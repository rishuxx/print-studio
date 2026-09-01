import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireAdminAuth } from "@/lib/supabase/admin-guard";
import * as xlsx from "xlsx";

export async function POST(req: NextRequest) {
  try {
    // 1. Verify Admin Auth
    await requireAdminAuth("/admin/products");
    const supabase = await createClient();

    // 2. Parse FormData
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // 3. Read Excel File
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const workbook = xlsx.read(buffer, { type: "buffer" });

    const masterSheetName = "Master Rate Card";
    if (!workbook.SheetNames.includes(masterSheetName)) {
      return NextResponse.json(
        { error: `Missing sheet: ${masterSheetName}` },
        { status: 400 }
      );
    }

    const masterSheet = workbook.Sheets[masterSheetName];
    const rows = xlsx.utils.sheet_to_json<any>(masterSheet);

    // 4. Initialize Report
    const report = {
      created: 0,
      updated: 0,
      skipped: 0,
      duplicates: 0,
      needsReview: 0,
      invalid: 0,
    };

    // 5. Fetch Default Price Book
    const { data: defaultPriceBook } = await supabase
      .from("price_books")
      .select("id")
      .eq("is_default", true)
      .single();

    let priceBookId = defaultPriceBook?.id;
    if (!priceBookId) {
      // Fallback: get the first active one, or create one if none exist.
      const { data: firstPriceBook } = await supabase
        .from("price_books")
        .select("id")
        .eq("status", "active")
        .limit(1)
        .single();
      
      if (firstPriceBook) {
        priceBookId = firstPriceBook.id;
      } else {
        const { data: newPb } = await supabase.from("price_books").insert({
          name: "Standard Retail",
          code: "RETAIL_DEFAULT",
          is_default: true,
        }).select().single();
        priceBookId = newPb?.id;
      }
    }

    // 6. Process Rows
    for (const row of rows) {
      const competitor = row["Competitor"];
      const categoryName = row["Category"];
      const productName = row["Product"];
      const listedPrice = row["Listed Price (₹)"];
      const basisQty = row["Basis Qty"] || 1;
      const normalizedUnitPrice = row["Normalized Unit Price (₹)"];
      const sourceUrl = row["Source URL"];
      const notes = row["Notes"];

      if (!productName || !categoryName) {
        report.invalid++;
        continue;
      }

      // Safe handle generation
      const handle = productName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      const categoryHandle = categoryName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

      // 6a. Resolve or Create Category
      let { data: category } = await supabase
        .from("categories")
        .select("id")
        .eq("handle", categoryHandle)
        .single();

      if (!category) {
        const { data: newCat } = await supabase
          .from("categories")
          .insert({
            handle: categoryHandle,
            title: categoryName,
            status: "active"
          })
          .select("id")
          .single();
        category = newCat;
      }

      // 6b. Try to find existing product (By exact Handle, then Name)
      // Note: We check by handle first for idempotency
      let { data: existingProduct } = await supabase
        .from("products")
        .select("id, handle, base_price_minor")
        .eq("handle", handle)
        .single();

      if (!existingProduct) {
         const { data: productByName } = await supabase
            .from("products")
            .select("id, handle, base_price_minor")
            .ilike("title", productName)
            .single();
         existingProduct = productByName;
      }

      const basePriceMinor = normalizedUnitPrice ? Math.round(parseFloat(normalizedUnitPrice) * 100) : 19900;
      const listedPriceMinor = listedPrice ? Math.round(parseFloat(listedPrice) * 100) : null;
      
      let productId = existingProduct?.id;

      if (existingProduct) {
        // UPDATE/MERGE
        const { error: updateError } = await supabase
          .from("products")
          .update({
            base_price_minor: basePriceMinor,
          })
          .eq("id", productId);
        
        if (updateError) {
          console.error("Failed to update product:", updateError);
          report.invalid++;
          continue;
        }

        report.updated++;
      } else {
        // CREATE
        const generatedSku = `PRN-${handle.substring(0, 8).toUpperCase()}-${Math.floor(Math.random() * 10000)}`;
        
        const { data: newProduct, error: insertError } = await supabase
          .from("products")
          .insert({
            handle: handle,
            title: productName,
            sku: generatedSku,
            status: "draft", // Imported products go to draft first
            base_price_minor: basePriceMinor,
          })
          .select("id")
          .single();

        if (insertError) {
          console.error("Failed to create product:", insertError);
          report.invalid++;
          continue;
        }

        productId = newProduct.id;
        report.created++;

        // Link Category
        if (category) {
          await supabase.from("product_category_links").insert({
            product_id: productId,
            category_id: category.id,
          });
        }
      }

      // 6c. Upsert Competitor Price Data
      if (competitor && productId) {
        // Simple check to avoid excessive duplicates in competitor prices
        const { data: existingCompPrice } = await supabase
           .from("competitor_prices")
           .select("id")
           .eq("product_id", productId)
           .eq("competitor_name", competitor)
           .single();

        if (!existingCompPrice) {
            await supabase.from("competitor_prices").insert({
            product_id: productId,
            competitor_name: competitor,
            listed_price_minor: listedPriceMinor,
            quantity: basisQty,
            normalized_unit_price_minor: basePriceMinor,
            source_url: sourceUrl,
            notes: notes
            });
        }
      }

      // 6d. Upsert Product Price in Price Book & default quantity tier
      if (productId && priceBookId) {
         const { data: existingPrice } = await supabase
            .from("product_prices")
            .select("id")
            .eq("product_id", productId)
            .eq("price_book_id", priceBookId)
            .single();
         
         let priceId = existingPrice?.id;

         if (existingPrice) {
            await supabase.from("product_prices").update({
               base_price_minor: basePriceMinor
            }).eq("id", priceId);
         } else {
            const { data: newPrice } = await supabase.from("product_prices").insert({
               product_id: productId,
               price_book_id: priceBookId,
               base_price_minor: basePriceMinor
            }).select("id").single();
            priceId = newPrice?.id;
         }

         // Default Tier
         if (priceId) {
             const { data: existingTier } = await supabase
                .from("product_quantity_tiers")
                .select("id")
                .eq("product_price_id", priceId)
                .eq("min_quantity", 1)
                .single();
            
             if (!existingTier) {
                 await supabase.from("product_quantity_tiers").insert({
                    product_price_id: priceId,
                    min_quantity: 1,
                    tier_price_minor: basePriceMinor
                 });
             }
         }
      }
    }

    return NextResponse.json({ success: true, report });
  } catch (error: any) {
    console.error("Import Error:", error);
    return NextResponse.json(
      { error: "Failed to import products", details: error.message },
      { status: 500 }
    );
  }
}
