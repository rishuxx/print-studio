"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  Calendar,
  AlertTriangle,
  Play,
  Pause,
  Plus,
  ShieldCheck,
  Edit,
  Trash2,
  Clock,
  Tag,
  Filter,
  DollarSign,
  Search,
  CheckCircle2,
  Receipt,
  Sliders,
} from "lucide-react";
import { toast } from "sonner";
import type {
  DatabasePriceBook,
  DatabasePromotion,
  DatabaseProductPrice,
  PricingHealthIssue,
} from "@/lib/pricing/types";
import {
  updatePromotionStatusAction,
  savePromotionAction,
  deletePromotionAction,
  saveProductPriceAction,
  savePriceBookAction,
  deletePriceBookAction,
} from "@/lib/pricing/mutations";
import { categories } from "@/lib/data/categories";
import { products } from "@/lib/data/products";
import { siteConfig } from "@/lib/site-config";
import { useCartStore } from "@/lib/cart-store";
import { calculateAuthoritativePrice } from "@/lib/pricing/engine";

interface AdminPricingClientViewProps {
  priceBooks: DatabasePriceBook[];
  activeSalesCount: number;
  scheduledSalesCount: number;
  promotions: DatabasePromotion[];
  healthIssues: PricingHealthIssue[];
  productPrices: DatabaseProductPrice[];
}

export function AdminPricingClientView({
  priceBooks,
  activeSalesCount,
  scheduledSalesCount,
  promotions,
  healthIssues,
  productPrices,
}: AdminPricingClientViewProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = React.useState<"products" | "campaigns" | "simulator" | "taxation" | "books" | "health">("products");
  const [productSearch, setProductSearch] = React.useState("");
  
  // Price Book Modal State
  const [isPriceBookModalOpen, setIsPriceBookModalOpen] = React.useState(false);
  const [editingPriceBook, setEditingPriceBook] = React.useState<Partial<DatabasePriceBook> | null>(null);
  const [isSavingPriceBook, setIsSavingPriceBook] = React.useState(false);

  // Smart Tax / GST configuration control
  const [gstModeState, setGstModeState] = React.useState<"inclusive" | "exclusive">(siteConfig.pricingPolicy.gstMode);
  const [gstRateState, setGstRateState] = React.useState<number>(siteConfig.pricingPolicy.gstRate * 100);

  // Campaign modal form state
  const [isPromoModalOpen, setIsPromoModalOpen] = React.useState(false);
  const [editingPromo, setEditingPromo] = React.useState<DatabasePromotion | null>(null);
  const [name, setName] = React.useState("");
  const [code, setCode] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [type, setType] = React.useState<"percentage_discount" | "fixed_discount" | "sale_price">("percentage_discount");
  const [discountValue, setDiscountValue] = React.useState(10);
  const [minOrderValue, setMinOrderValue] = React.useState(0);
  const [maxDiscountAmount, setMaxDiscountAmount] = React.useState(0);
  const [stackable, setStackable] = React.useState(false);
  const [targetType, setTargetType] = React.useState<"all" | "category" | "product">("all");
  const [selectedTargetIds, setSelectedTargetIds] = React.useState<string[]>([]);
  const [startsAt, setStartsAt] = React.useState("");
  const [endsAt, setEndsAt] = React.useState("");
  const [isSubmittingPromo, setIsSubmittingPromo] = React.useState(false);

  // Direct Product Price Matrix Editor Modal State
  const [isPriceModalOpen, setIsPriceModalOpen] = React.useState(false);
  const [editingPriceRecord, setEditingPriceRecord] = React.useState<DatabaseProductPrice | null>(null);
  const [selectedProductTitle, setSelectedProductTitle] = React.useState("");
  const [basePriceRupees, setBasePriceRupees] = React.useState(199);
  const [compareAtRupees, setCompareAtRupees] = React.useState(299);
  const [costPriceRupees, setCostPriceRupees] = React.useState(120);
  const [minFloorRupees, setMinFloorRupees] = React.useState(140);
  const [quantityTiers, setQuantityTiers] = React.useState<
    Array<{ minQuantity: number; maxQuantity: number | null; tierPriceMinor: number; discountPercent?: number }>
  >([
    { minQuantity: 100, maxQuantity: 249, tierPriceMinor: 19900, discountPercent: 0 },
    { minQuantity: 250, maxQuantity: 499, tierPriceMinor: 39900, discountPercent: 10 },
    { minQuantity: 500, maxQuantity: 999, tierPriceMinor: 69900, discountPercent: 20 },
    { minQuantity: 1000, maxQuantity: null, tierPriceMinor: 119900, discountPercent: 30 },
  ]);
  const [isSubmittingPrice, setIsSubmittingPrice] = React.useState(false);

  // Price Simulator State
  const [simProductHandle, setSimProductHandle] = React.useState(products[0]?.handle || "standard-visiting-cards");
  const [simQty, setSimQty] = React.useState(500);
  const [simCoupon, setSimCoupon] = React.useState("");

  // Filtered product prices
  const filteredPrices = React.useMemo(() => {
    if (!productSearch.trim()) return productPrices;
    const term = productSearch.toLowerCase().trim();
    return productPrices.filter((p) => {
      const title = p.product?.title?.toLowerCase() || "";
      const sku = p.product?.sku?.toLowerCase() || "";
      const handle = p.product?.handle?.toLowerCase() || "";
      return title.includes(term) || sku.includes(term) || handle.includes(term);
    });
  }, [productPrices, productSearch]);

  // Price Simulator calculation
  const simProduct = React.useMemo(() => {
    return products.find((prod) => prod.handle === simProductHandle) || products[0];
  }, [simProductHandle]);

  const simResult = React.useMemo(() => {
    const p = simProduct;
    const matchDbPrice = productPrices.find((pp) => pp.product?.handle === simProductHandle);
    return calculateAuthoritativePrice({
      product: {
        id: p.id,
        title: p.title,
        handle: p.handle,
        categoryIds: p.categoryHandles,
      },
      priceRecord: matchDbPrice,
      quantity: Number(simQty) || 1,
      promotions,
      couponCode: simCoupon.trim() ? simCoupon.trim().toUpperCase() : null,
    });
  }, [simProduct, simProductHandle, simQty, simCoupon, productPrices, promotions]);

  // Open Price Editor Modal
  const openPriceEditor = (priceRecord: DatabaseProductPrice) => {
    setEditingPriceRecord(priceRecord);
    setSelectedProductTitle(priceRecord.product?.title || "Product");
    setBasePriceRupees(priceRecord.base_price_minor / 100);
    setCompareAtRupees(priceRecord.compare_at_price_minor ? priceRecord.compare_at_price_minor / 100 : 0);
    setCostPriceRupees(priceRecord.cost_price_minor ? priceRecord.cost_price_minor / 100 : 0);
    setMinFloorRupees(priceRecord.minimum_price_floor_minor ? priceRecord.minimum_price_floor_minor / 100 : 0);

    if (priceRecord.quantity_tiers && priceRecord.quantity_tiers.length > 0) {
      setQuantityTiers(
        priceRecord.quantity_tiers.map((t) => ({
          minQuantity: t.min_quantity,
          maxQuantity: t.max_quantity,
          tierPriceMinor: t.tier_price_minor,
          discountPercent: t.discount_percent ? Number(t.discount_percent) : 0,
        }))
      );
    } else {
      setQuantityTiers([
        { minQuantity: 100, maxQuantity: 249, tierPriceMinor: priceRecord.base_price_minor, discountPercent: 0 },
        { minQuantity: 250, maxQuantity: 499, tierPriceMinor: Math.round(priceRecord.base_price_minor * 2 * 0.9), discountPercent: 10 },
        { minQuantity: 500, maxQuantity: 999, tierPriceMinor: Math.round(priceRecord.base_price_minor * 4 * 0.8), discountPercent: 20 },
        { minQuantity: 1000, maxQuantity: null, tierPriceMinor: Math.round(priceRecord.base_price_minor * 7 * 0.7), discountPercent: 30 },
      ]);
    }
    setIsPriceModalOpen(true);
  };

  const handleSaveProductPrice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPriceRecord) return;
    setIsSubmittingPrice(true);

    const defaultBook = priceBooks.find((b) => b.is_default) || priceBooks[0];

    const res = await saveProductPriceAction({
      id: editingPriceRecord.id,
      productId: editingPriceRecord.product_id,
      priceBookId: editingPriceRecord.price_book_id || defaultBook.id,
      basePriceMinor: Math.round(basePriceRupees * 100),
      compareAtPriceMinor: compareAtRupees > 0 ? Math.round(compareAtRupees * 100) : null,
      costPriceMinor: costPriceRupees > 0 ? Math.round(costPriceRupees * 100) : null,
      minimumPriceFloorMinor: minFloorRupees > 0 ? Math.round(minFloorRupees * 100) : null,
      status: "active",
      version: editingPriceRecord.version || 1,
      quantityTiers,
    });

    setIsSubmittingPrice(false);
    if (res.success) {
      setIsPriceModalOpen(false);
      window.location.reload();
    } else {
      alert(res.error || "Failed to save product price");
    }
  };

  // Promotion Handlers
  const openCreatePromoModal = () => {
    setEditingPromo(null);
    setName("");
    setCode("");
    setDescription("");
    setType("percentage_discount");
    setDiscountValue(10);
    setMinOrderValue(0);
    setMaxDiscountAmount(0);
    setStackable(false);
    setTargetType("all");
    setSelectedTargetIds([]);
    setStartsAt("");
    setEndsAt("");
    setIsPromoModalOpen(true);
  };

  const openEditPromoModal = (p: DatabasePromotion) => {
    setEditingPromo(p);
    setName(p.name);
    setCode(p.code || "");
    setDescription(p.description || "");
    setType(p.type as "percentage_discount" | "fixed_discount" | "sale_price");
    setDiscountValue(p.discount_value);
    setMinOrderValue(p.min_order_value_minor ? p.min_order_value_minor / 100 : 0);
    setMaxDiscountAmount(p.max_discount_amount_minor ? p.max_discount_amount_minor / 100 : 0);
    setStackable(p.stackable);
    setTargetType((p.target_type as "all" | "category" | "product") || "all");
    setSelectedTargetIds(p.target_ids || []);
    if (p.starts_at) setStartsAt(new Date(p.starts_at).toISOString().slice(0, 16));
    else setStartsAt("");
    if (p.ends_at) setEndsAt(new Date(p.ends_at).toISOString().slice(0, 16));
    else setEndsAt("");
    setIsPromoModalOpen(true);
  };

  const handleTogglePromo = async (promoId: string, currentStatus: string) => {
    const nextStatus = currentStatus === "active" ? "paused" : "active";
    const res = await updatePromotionStatusAction(promoId, nextStatus);
    if (res.success) window.location.reload();
    else alert(res.error || "Status update failed");
  };

  const handleDeletePromo = async (promoId: string, promoName: string) => {
    if (!confirm(`Are you sure you want to permanently delete the promotion "${promoName}"?`)) return;
    const res = await deletePromotionAction(promoId);
    if (res.success) window.location.reload();
    else alert(res.error || "Failed to delete promotion");
  };

  const handleSavePromo = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingPromo(true);

    let calculatedStatus: DatabasePromotion["status"] = "active";
    let formattedStartsAt: string | null = null;
    let formattedEndsAt: string | null = null;

    if (startsAt) {
      formattedStartsAt = new Date(startsAt).toISOString();
      if (new Date(startsAt).getTime() > Date.now()) calculatedStatus = "scheduled";
    }
    if (endsAt) formattedEndsAt = new Date(endsAt).toISOString();
    if (editingPromo?.status === "paused") calculatedStatus = "paused";

    const res = await savePromotionAction({
      id: editingPromo?.id,
      name: name.trim(),
      code: code.trim() ? code.trim().toUpperCase() : null,
      description: description.trim() || null,
      type,
      status: calculatedStatus,
      stackable,
      priority: 10,
      discountValue: Number(discountValue),
      minOrderValueMinor: minOrderValue > 0 ? Math.round(minOrderValue * 100) : null,
      maxDiscountAmountMinor: maxDiscountAmount > 0 ? Math.round(maxDiscountAmount * 100) : null,
      targetType,
      targetIds: selectedTargetIds,
      startsAt: formattedStartsAt,
      endsAt: formattedEndsAt,
      timezone: "Asia/Kolkata",
    });

    setIsSubmittingPromo(false);
    if (res.success) {
      setIsPromoModalOpen(false);
      window.location.reload();
    } else {
      alert(res.error || "Failed to save promotion");
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-extrabold text-ink tracking-tight">
            Pricing Engine & Promotions Command Center
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Authoritative base prices, quantity tier volume discounts, margin floors, flash sales, and live simulator.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={openCreatePromoModal}
            className="inline-flex items-center gap-2 rounded-xl bg-violet px-4 py-2 text-xs font-bold text-white hover:bg-violet/90 transition-all shadow-sm"
          >
            <Plus className="size-4" />
            <span>Create Campaign</span>
          </button>
        </div>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          onClick={() => setActiveTab("products")}
          className="bg-white p-5 rounded-2xl border border-border shadow-xs space-y-1 cursor-pointer hover:border-violet transition-all"
        >
          <div className="flex items-center justify-between text-muted-foreground text-xs font-semibold">
            <span>Configured Products</span>
            <DollarSign className="size-4 text-violet" />
          </div>
          <p className="font-display text-2xl font-black text-ink">{productPrices.length}</p>
          <p className="text-[0.6875rem] text-violet font-semibold">Active Price Matrix</p>
        </div>

        <div
          onClick={() => setActiveTab("campaigns")}
          className="bg-white p-5 rounded-2xl border border-border shadow-xs space-y-1 cursor-pointer hover:border-emerald-400 transition-all"
        >
          <div className="flex items-center justify-between text-muted-foreground text-xs font-semibold">
            <span>Active Sales</span>
            <Sparkles className="size-4 text-emerald-600" />
          </div>
          <p className="font-display text-2xl font-black text-ink">{activeSalesCount}</p>
          <p className="text-[0.6875rem] text-emerald-700 font-semibold">Live on Storefront</p>
        </div>

        <div
          onClick={() => setActiveTab("campaigns")}
          className="bg-white p-5 rounded-2xl border border-border shadow-xs space-y-1 cursor-pointer hover:border-sky-400 transition-all"
        >
          <div className="flex items-center justify-between text-muted-foreground text-xs font-semibold">
            <span>Scheduled Sales</span>
            <Calendar className="size-4 text-sky-600" />
          </div>
          <p className="font-display text-2xl font-black text-ink">{scheduledSalesCount}</p>
          <p className="text-[0.6875rem] text-muted-foreground">Asia/Kolkata (IST)</p>
        </div>

        <div
          onClick={() => setActiveTab("health")}
          className="bg-white p-5 rounded-2xl border border-border shadow-xs space-y-1 cursor-pointer hover:border-amber-400 transition-all"
        >
          <div className="flex items-center justify-between text-muted-foreground text-xs font-semibold">
            <span>Pricing Health</span>
            <ShieldCheck className="size-4 text-amber-600" />
          </div>
          <p className="font-display text-2xl font-black text-ink">
            {healthIssues.length === 0 ? "100%" : `${healthIssues.length} alerts`}
          </p>
          <p className="text-[0.6875rem] text-muted-foreground">
            {healthIssues.length === 0 ? "All prices verified" : "Requires attention"}
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-border text-xs font-bold">
        <button
          type="button"
          onClick={() => setActiveTab("products")}
          className={`px-4 py-2.5 border-b-2 transition-all ${
            activeTab === "products"
              ? "border-violet text-violet"
              : "border-transparent text-muted-foreground hover:text-ink"
          }`}
        >
          Product Price Matrix & Tiers ({productPrices.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("campaigns")}
          className={`px-4 py-2.5 border-b-2 transition-all ${
            activeTab === "campaigns"
              ? "border-violet text-violet"
              : "border-transparent text-muted-foreground hover:text-ink"
          }`}
        >
          Promotions & Sales ({promotions.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("simulator")}
          className={`px-4 py-2.5 border-b-2 transition-all ${
            activeTab === "simulator"
              ? "border-violet text-violet"
              : "border-transparent text-muted-foreground hover:text-ink"
          }`}
        >
          Pricing Simulator & Explanation Trace
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("taxation")}
          className={`px-4 py-2.5 border-b-2 transition-all flex items-center gap-1.5 ${
            activeTab === "taxation"
              ? "border-violet text-violet"
              : "border-transparent text-muted-foreground hover:text-ink"
          }`}
        >
          <Receipt className="size-3.5" />
          <span>Smart GST & Tax Policy</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("books")}
          className={`px-4 py-2.5 border-b-2 transition-all ${
            activeTab === "books"
              ? "border-violet text-violet"
              : "border-transparent text-muted-foreground hover:text-ink"
          }`}
        >
          Price Books ({priceBooks.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("health")}
          className={`px-4 py-2.5 border-b-2 transition-all ${
            activeTab === "health"
              ? "border-violet text-violet"
              : "border-transparent text-muted-foreground hover:text-ink"
          }`}
        >
          Pricing Health ({healthIssues.length})
        </button>
      </div>

      {/* TAB 1: Product Price Matrix & Quantity Tiers */}
      {activeTab === "products" && (
        <div className="bg-white rounded-2xl border border-border shadow-xs overflow-hidden space-y-4 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border">
            <div>
              <h3 className="font-display text-sm font-bold text-ink">Products Price Matrix</h3>
              <p className="text-xs text-muted-foreground">
                Manage Base Selling Rate, Compare-at Price, Cost Price, Margin Floor, and Bulk Quantity Tiers.
              </p>
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                placeholder="Search product or SKU..."
                className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-border text-xs focus:outline-none focus:border-violet"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-border bg-paper/60 font-mono text-[0.6875rem] font-bold text-muted-foreground uppercase">
                  <th className="p-3">Product Name & SKU</th>
                  <th className="p-3">Base Price</th>
                  <th className="p-3">Compare At</th>
                  <th className="p-3">Cost / Floor Margin</th>
                  <th className="p-3">Quantity Tiers</th>
                  <th className="p-3">Price Book</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredPrices.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-muted-foreground">
                      No matching products found.
                    </td>
                  </tr>
                ) : (
                  filteredPrices.map((p) => (
                    <tr key={p.id} className="hover:bg-paper/40 transition-colors">
                      <td className="p-3">
                        <div className="font-bold text-ink">{p.product?.title || "Custom Product"}</div>
                        <div className="font-mono text-[0.6875rem] text-muted-foreground">
                          {p.product?.sku || "SKU-AUTO"}
                        </div>
                      </td>
                      <td className="p-3 font-mono font-bold text-ink">
                        ₹{(p.base_price_minor / 100).toFixed(2)}
                      </td>
                      <td className="p-3 font-mono text-muted-foreground line-through">
                        {p.compare_at_price_minor ? `₹${(p.compare_at_price_minor / 100).toFixed(2)}` : "—"}
                      </td>
                      <td className="p-3 text-[0.6875rem] font-mono">
                        <div className="text-muted-foreground">Cost: ₹{p.cost_price_minor ? (p.cost_price_minor / 100).toFixed(0) : "—"}</div>
                        <div className="text-emerald-700 font-semibold">Floor: ₹{p.minimum_price_floor_minor ? (p.minimum_price_floor_minor / 100).toFixed(0) : "—"}</div>
                      </td>
                      <td className="p-3">
                        {p.quantity_tiers && p.quantity_tiers.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {p.quantity_tiers.map((t, idx) => (
                              <span
                                key={t.id || idx}
                                className="px-1.5 py-0.5 rounded bg-violet/10 text-violet font-mono text-[0.625rem] font-bold"
                              >
                                {t.min_quantity}+ → ₹{(t.tier_price_minor / 100).toFixed(0)}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-[0.6875rem] text-muted-foreground italic">Single rate</span>
                        )}
                      </td>
                      <td className="p-3 font-mono text-[0.6875rem]">
                        <span className="px-2 py-0.5 rounded bg-paper border border-border font-semibold">
                          {p.price_book?.name || "Retail"}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          type="button"
                          onClick={() => openPriceEditor(p)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border bg-white text-ink hover:border-violet hover:text-violet text-xs font-bold shadow-2xs transition-all"
                        >
                          <Edit className="size-3 text-violet" />
                          <span>Edit Price & Tiers</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: Campaigns */}
      {activeTab === "campaigns" && (
        <div className="bg-white rounded-2xl border border-border shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-border bg-paper/60 font-mono text-[0.6875rem] font-bold text-muted-foreground uppercase">
                  <th className="p-4">Campaign Name</th>
                  <th className="p-4">Scope & Target</th>
                  <th className="p-4">Discount</th>
                  <th className="p-4">Coupon Code</th>
                  <th className="p-4">Schedule / Flash Sale</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {promotions.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-muted-foreground">
                      No active or scheduled promotions. Click &quot;Create Campaign&quot; to launch a sale.
                    </td>
                  </tr>
                ) : (
                  promotions.map((p) => (
                    <tr key={p.id} className="hover:bg-paper/40 transition-colors">
                      <td className="p-4">
                        <div className="font-bold text-ink">{p.name}</div>
                        {p.description && (
                          <p className="text-[0.6875rem] text-muted-foreground">{p.description}</p>
                        )}
                      </td>
                      <td className="p-4 font-mono">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[0.6875rem] bg-paper border border-border text-ink font-semibold">
                          <Filter className="size-3 text-violet" />
                          <span className="capitalize">{p.target_type || "All Products"}</span>
                          {p.target_ids && p.target_ids.length > 0 && (
                            <span className="text-violet font-bold">({p.target_ids.length})</span>
                          )}
                        </span>
                      </td>
                      <td className="p-4 font-mono font-bold text-ink">
                        {p.type === "percentage_discount"
                          ? `${p.discount_value}% OFF`
                          : `₹${p.discount_value} OFF`}
                      </td>
                      <td className="p-4 font-mono">
                        {p.code ? (
                          <span className="px-2 py-0.5 rounded bg-violet/10 text-violet font-bold font-mono">
                            {p.code}
                          </span>
                        ) : (
                          <span className="text-muted-foreground/60 italic">Automatic</span>
                        )}
                      </td>
                      <td className="p-4 text-muted-foreground">
                        {p.starts_at || p.ends_at ? (
                          <div className="space-y-0.5 text-[0.6875rem]">
                            {p.starts_at && (
                              <div className="flex items-center gap-1 font-mono">
                                <span className="text-muted-foreground">From:</span>
                                <span>{new Date(p.starts_at).toLocaleDateString("en-IN", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
                              </div>
                            )}
                            {p.ends_at && (
                              <div className="flex items-center gap-1 font-mono text-amber-700">
                                <span>Till:</span>
                                <span>{new Date(p.ends_at).toLocaleDateString("en-IN", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-[0.6875rem] text-muted-foreground italic">Always Active</span>
                        )}
                      </td>
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                            p.status === "active"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : p.status === "scheduled"
                              ? "bg-sky-50 text-sky-700 border border-sky-200"
                              : "bg-slate-100 text-slate-700 border border-slate-300"
                          }`}
                        >
                          {p.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleTogglePromo(p.id, p.status)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-border bg-white text-ink hover:border-violet text-xs font-bold shadow-2xs"
                            title={p.status === "active" ? "Pause Campaign" : "Activate Campaign"}
                          >
                            {p.status === "active" ? (
                              <>
                                <Pause className="size-3 text-amber-600" />
                                <span>Pause</span>
                              </>
                            ) : (
                              <>
                                <Play className="size-3 text-emerald-600" />
                                <span>Start</span>
                              </>
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={() => openEditPromoModal(p)}
                            className="p-1.5 rounded-lg border border-border bg-white text-ink hover:border-violet hover:text-violet shadow-2xs"
                            title="Edit Campaign"
                          >
                            <Edit className="size-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeletePromo(p.id, p.name)}
                            className="p-1.5 rounded-lg border border-border bg-white text-muted-foreground hover:text-rose-600 hover:border-rose-200 shadow-2xs"
                            title="Delete Campaign"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: Pricing Simulator & Explanation Trace */}
      {activeTab === "simulator" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 bg-white rounded-2xl border border-border p-6 shadow-xs space-y-5 text-xs">
            <div className="border-b border-border pb-3">
              <h3 className="font-display text-sm font-bold text-ink flex items-center gap-2">
                <Sliders className="size-4 text-violet" />
                <span>Pricing Simulator Controls</span>
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Simulate checkout amounts against canonical server rules, volume tiers, and active campaigns.
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="font-bold text-ink">Select Product</label>
                <select
                  value={simProductHandle}
                  onChange={(e) => setSimProductHandle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-border font-semibold text-ink bg-paper/50"
                >
                  {products.map((p) => (
                    <option key={p.handle} value={p.handle}>
                      {p.title} ({p.categoryHandles?.[0] || "Custom"})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-ink">Quantity / Batch Size</label>
                  <span className="text-[0.6875rem] text-muted-foreground font-mono">
                    {simProduct?.priceUnit || "units"}
                  </span>
                </div>
                <input
                  type="number"
                  min={1}
                  value={simQty}
                  onChange={(e) => setSimQty(Math.max(1, Number(e.target.value)))}
                  className="w-full px-3 py-2 font-mono font-bold rounded-xl border border-border text-base"
                />

                {/* Quick preset buttons */}
                {simProduct?.quantityTiers && simProduct.quantityTiers.length > 0 && (
                  <div className="flex items-center gap-1.5 pt-1">
                    <span className="text-[0.6875rem] text-muted-foreground font-semibold">Presets:</span>
                    {simProduct.quantityTiers.map((t) => (
                      <button
                        key={t.qty}
                        type="button"
                        onClick={() => setSimQty(t.qty)}
                        className={`px-2 py-0.5 rounded text-[0.6875rem] font-mono font-bold border transition-colors ${
                          simQty === t.qty
                            ? "bg-violet text-white border-violet"
                            : "bg-paper text-ink border-border hover:border-violet"
                        }`}
                      >
                        {t.qty}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <label className="font-bold text-ink flex items-center justify-between">
                  <span>Apply Promotional Coupon Code</span>
                  {promotions.length > 0 && (
                    <span className="text-[0.625rem] text-violet font-mono font-semibold">
                      Active codes: {promotions.filter((p) => p.code).map((p) => p.code).join(", ") || "None"}
                    </span>
                  )}
                </label>
                <input
                  type="text"
                  value={simCoupon}
                  onChange={(e) => setSimCoupon(e.target.value.toUpperCase())}
                  placeholder="e.g. PRINT10, FESTIVE20"
                  className="w-full px-3 py-2 font-mono font-bold rounded-xl border border-border uppercase"
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 bg-white rounded-2xl border border-border p-6 shadow-xs space-y-4 text-xs">
            <div className="border-b border-border pb-3 flex items-center justify-between">
              <div>
                <h3 className="font-display text-sm font-bold text-ink">Authoritative Pricing Breakdown</h3>
                <p className="text-xs text-muted-foreground">Server-calculated trace against mathematical rules</p>
              </div>
              <span className="px-2 py-0.5 rounded text-[0.625rem] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                Engine: {simResult.engineVersion}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 bg-paper/60 rounded-xl border border-border">
              <div className="space-y-0.5">
                <div className="text-muted-foreground text-[0.6875rem]">Base Unit Rate:</div>
                <div className="font-display text-base font-bold text-ink">₹{(simResult.baseUnitPriceMinor / 100).toFixed(2)}</div>
              </div>

              <div className="space-y-0.5">
                <div className="text-muted-foreground text-[0.6875rem]">Effective Tier Rate:</div>
                <div className="font-display text-base font-bold text-violet">₹{(simResult.effectiveTierUnitPriceMinor / 100).toFixed(2)}</div>
              </div>

              <div className="space-y-0.5">
                <div className="text-muted-foreground text-[0.6875rem]">Total Payable Line:</div>
                <div className="font-display text-lg font-black text-ink">₹{(simResult.finalLinePriceMinor / 100).toFixed(2)}</div>
              </div>
            </div>

            {/* In-depth Math Breakdown */}
            <div className="p-3 rounded-xl bg-paper/40 border border-border space-y-1.5 font-mono text-[0.6875rem]">
              <div className="flex justify-between text-muted-foreground">
                <span>Raw Subtotal ({simQty} × ₹{(simResult.baseUnitPriceMinor / 100).toFixed(2)}):</span>
                <span className="text-ink font-semibold">₹{(simResult.rawSubtotalMinor / 100).toFixed(2)}</span>
              </div>
              {simResult.quantityTierDiscountMinor > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Volume Tier Discount Savings:</span>
                  <span>-₹{(simResult.quantityTierDiscountMinor / 100).toFixed(2)}</span>
                </div>
              )}
              {simResult.promotionsDiscountMinor > 0 && (
                <div className="flex justify-between text-violet font-bold">
                  <span>Campaign & Coupon Discount:</span>
                  <span>-₹{(simResult.promotionsDiscountMinor / 100).toFixed(2)}</span>
                </div>
              )}
              <div className="border-t border-border/80 pt-1.5 flex justify-between font-bold text-ink">
                <span>Final Line Subtotal:</span>
                <span>₹{(simResult.finalLinePriceMinor / 100).toFixed(2)}</span>
              </div>
            </div>

            {/* Rule Hierarchy Trace */}
            <div className="space-y-2 pt-2">
              <span className="font-bold text-ink uppercase font-mono text-[0.6875rem]">
                Evaluated Campaign Rules Trace
              </span>

              {simResult.appliedRules.length > 0 ? (
                <div className="space-y-1.5">
                  {simResult.appliedRules.map((rule) => (
                    <div
                      key={rule.ruleId}
                      className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="size-3.5 text-emerald-600" />
                        <span className="font-bold">{rule.ruleName}</span>
                      </div>
                      <span className="font-mono font-bold">-₹{(rule.discountMinor / 100).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-3 rounded-lg bg-paper border border-border text-muted-foreground text-[0.6875rem]">
                  No promotional discounts applied for this configuration.
                </div>
              )}

              {simResult.rejectedRules.length > 0 && (
                <div className="space-y-1 pt-2">
                  <div className="text-muted-foreground text-[0.6875rem] font-semibold">Skipped / Ineligible Rules:</div>
                  {simResult.rejectedRules.map((rule) => (
                    <div
                      key={rule.ruleId}
                      className="p-2 rounded-lg bg-paper/40 border border-border text-muted-foreground text-[0.6875rem] flex items-center justify-between"
                    >
                      <span>{rule.ruleName}</span>
                      <span className="italic text-[0.625rem]">{rule.reason}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB: Smart GST & Tax Policy */}
      {activeTab === "taxation" && (
        <div className="bg-white rounded-2xl border border-border shadow-xs p-6 space-y-6">
          <div className="border-b border-border pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <Receipt className="size-5 text-violet" />
                <h3 className="font-display text-base font-bold text-ink">Smart GST & Tax Invoicing Strategy</h3>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Configure how GST (18%) is applied across the storefront, cart, checkout, and generated customer tax invoices.
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <ShieldCheck className="size-3.5" />
              <span>Compliant with Indian Tax Code (SAC 9989)</span>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Mode Option 1: Smart Inclusive Pricing (Standard for Modern E-commerce) */}
            <div
              onClick={() => setGstModeState("inclusive")}
              className={`p-5 rounded-2xl border-2 cursor-pointer transition-all space-y-3 ${
                gstModeState === "inclusive"
                  ? "border-violet bg-violet/5 ring-1 ring-violet shadow-sm"
                  : "border-border hover:border-border/80 bg-white"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`size-4 rounded-full border-2 flex items-center justify-center ${gstModeState === "inclusive" ? "border-violet bg-violet" : "border-muted-foreground"}`}>
                    {gstModeState === "inclusive" && <div className="size-1.5 rounded-full bg-white" />}
                  </div>
                  <span className="font-bold text-ink text-sm">Smart All-Inclusive MRP (Recommended)</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[0.625rem] font-bold bg-violet/10 text-violet font-mono">
                  Enterprise Standard
                </span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Prices shown to customers on product pages, cart, and checkout are <strong>all-inclusive</strong> (MRP). No unexpected tax surcharges are added during payment, drastically reducing cart abandonment.
              </p>
              <div className="p-3 rounded-xl bg-paper/80 border border-border text-[0.6875rem] space-y-1 font-mono text-ink">
                <div className="text-muted-foreground font-semibold">Storefront Experience:</div>
                <div>Customer pays: <strong className="text-ink">₹899.00 Total</strong> (No surprise charges)</div>
                <div>Invoice breakdown: <strong>Taxable: ₹761.86 + 18% GST: ₹137.14</strong> (Included)</div>
              </div>
            </div>

            {/* Mode Option 2: Exclusive Surcharge */}
            <div
              onClick={() => setGstModeState("exclusive")}
              className={`p-5 rounded-2xl border-2 cursor-pointer transition-all space-y-3 ${
                gstModeState === "exclusive"
                  ? "border-violet bg-violet/5 ring-1 ring-violet shadow-sm"
                  : "border-border hover:border-border/80 bg-white"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`size-4 rounded-full border-2 flex items-center justify-center ${gstModeState === "exclusive" ? "border-violet bg-violet" : "border-muted-foreground"}`}>
                    {gstModeState === "exclusive" && <div className="size-1.5 rounded-full bg-white" />}
                  </div>
                  <span className="font-bold text-ink text-sm">Exclusive Tax Surcharge</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[0.625rem] font-bold bg-amber-100 text-amber-800 font-mono">
                  Traditional B2B
                </span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Base price is displayed on product catalogue, and GST is added as an additional fee at the bottom of the checkout summary.
              </p>
              <div className="p-3 rounded-xl bg-paper/80 border border-border text-[0.6875rem] space-y-1 font-mono text-ink">
                <div className="text-muted-foreground font-semibold">Storefront Experience:</div>
                <div>Base Subtotal: <strong>₹899.00</strong></div>
                <div>Checkout Surcharge: <strong className="text-amber-700">+ 18% GST (₹161.82) &rarr; Total: ₹1,060.82</strong></div>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl border border-border bg-paper/40 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <label className="font-bold text-xs text-ink flex items-center gap-1.5">
                  <Sliders className="size-3.5 text-violet" />
                  <span>Configured Standard GST Rate (%)</span>
                </label>
                <p className="text-[0.6875rem] text-muted-foreground">
                  Default Indian GST tariff for printing items (SAC 9989 / HSN 4911) is 18%.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={0}
                  max={28}
                  value={gstRateState}
                  onChange={(e) => setGstRateState(Number(e.target.value))}
                  className="w-24 px-3 py-2 rounded-xl border border-border font-mono font-bold text-sm text-center bg-white"
                />
                <span className="font-bold text-xs text-ink">%</span>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-border">
              <button
                type="button"
                onClick={() => {
                  siteConfig.pricingPolicy.gstMode = gstModeState;
                  siteConfig.pricingPolicy.gstRate = gstRateState / 100;
                  useCartStore.getState().setGstPolicy(gstModeState, gstRateState);
                  toast.success("GST Strategy Active", {
                    description: `Tax strategy set to ${gstModeState.toUpperCase()} with ${gstRateState}% rate across live site & invoices.`,
                  });
                }}
                className="px-6 py-2.5 rounded-xl bg-violet text-white text-xs font-bold shadow-lift hover:bg-violet-lift transition-all"
              >
                Apply & Save Tax Policy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Price Books */}
      {activeTab === "books" && (
        <div className="bg-white rounded-2xl border border-border shadow-xs p-6 space-y-4">
          <div className="border-b border-border pb-3 flex items-center justify-between">
            <div>
              <h3 className="font-display text-sm font-bold text-ink">Active Price Books</h3>
              <p className="text-xs text-muted-foreground">Contextual lists used for customer segments.</p>
            </div>
            <button
              type="button"
              onClick={() => {
                setEditingPriceBook({
                  currency: "INR",
                  status: "active",
                  is_default: false,
                  priority: 0,
                });
                setIsPriceBookModalOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-violet text-white rounded-xl text-xs font-bold shadow-lift hover:bg-violet-lift transition-all"
            >
              <Plus className="size-3.5" />
              <span>New Price Book</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {priceBooks.map((b) => (
              <div key={b.id} className="p-4 rounded-xl border border-border bg-paper/30 space-y-3 group relative">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-ink">{b.name}</span>
                  {b.is_default && (
                    <span className="px-2 py-0.5 rounded text-[0.625rem] font-bold bg-violet/10 text-violet">
                      Default Storefront
                    </span>
                  )}
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground font-mono">Code: {b.code}</p>
                  <p className="text-xs text-muted-foreground">{b.description}</p>
                </div>
                
                {/* Actions */}
                <div className="pt-3 flex gap-2 border-t border-border mt-3">
                  <button
                    onClick={() => {
                      setEditingPriceBook(b);
                      setIsPriceBookModalOpen(true);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-ink bg-white border border-border hover:bg-paper"
                  >
                    <Edit className="size-3" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={async () => {
                      if (!confirm(`Are you sure you want to archive ${b.name}?`)) return;
                      const res = await deletePriceBookAction(b.id);
                      if (res.success) {
                        toast.success("Price book archived successfully");
                        router.refresh();
                      } else {
                        toast.error(res.error || "Failed to archive");
                      }
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-red-600 bg-red-50 border border-red-100 hover:bg-red-100"
                  >
                    <Trash2 className="size-3" />
                    <span>Archive</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: Health */}
      {activeTab === "health" && (
        <div className="bg-white rounded-2xl border border-border shadow-xs p-6 space-y-4">
          <div className="border-b border-border pb-3">
            <h3 className="font-display text-sm font-bold text-ink">Pricing Health Diagnostics</h3>
            <p className="text-xs text-muted-foreground">Automated conflict, margin floor, and expiry detector.</p>
          </div>

          {healthIssues.length === 0 ? (
            <div className="p-8 text-center text-emerald-700 text-xs font-semibold bg-emerald-50 rounded-xl border border-emerald-200">
              ✓ All pricing rules, quantity tiers, and campaign expiration dates are healthy.
            </div>
          ) : (
            <div className="space-y-3">
              {healthIssues.map((issue) => (
                <div
                  key={issue.id}
                  className="p-4 rounded-xl border border-amber-200 bg-amber-50 text-xs space-y-1"
                >
                  <div className="font-bold text-amber-900 flex items-center gap-1.5">
                    <AlertTriangle className="size-4 text-amber-600" />
                    <span>{issue.entityName}</span>
                  </div>
                  <p className="text-amber-800">{issue.explanation}</p>
                  <p className="font-semibold text-amber-950">Action: {issue.recommendedAction}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* MODAL 1: Product Price & Quantity Tiers Editor */}
      {isPriceModalOpen && editingPriceRecord && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <form
            onSubmit={handleSaveProductPrice}
            className="w-full max-w-2xl max-h-[90vh] my-auto flex flex-col bg-white rounded-2xl p-6 sm:p-8 shadow-2xl border border-border text-xs"
          >
            <div className="border-b border-border pb-3 shrink-0">
              <span className="text-[0.6875rem] font-bold uppercase font-mono text-violet">
                Product Pricing Workspace
              </span>
              <h3 className="font-display text-lg font-extrabold text-ink">{selectedProductTitle}</h3>
            </div>

            <div className="space-y-4 overflow-y-auto py-3 pr-1.5 flex-1">
              {/* Rates Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-ink">Base Selling (₹) *</label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={basePriceRupees}
                    onChange={(e) => setBasePriceRupees(Number(e.target.value))}
                    className="w-full px-3 py-2 font-mono font-bold rounded-xl border border-border"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-ink">Compare-at (₹)</label>
                  <input
                    type="number"
                    min={0}
                    value={compareAtRupees}
                    onChange={(e) => setCompareAtRupees(Number(e.target.value))}
                    className="w-full px-3 py-2 font-mono rounded-xl border border-border"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-ink">Cost Price (₹)</label>
                  <input
                    type="number"
                    min={0}
                    value={costPriceRupees}
                    onChange={(e) => setCostPriceRupees(Number(e.target.value))}
                    className="w-full px-3 py-2 font-mono rounded-xl border border-border"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-ink">Margin Floor (₹)</label>
                  <input
                    type="number"
                    min={0}
                    value={minFloorRupees}
                    onChange={(e) => setMinFloorRupees(Number(e.target.value))}
                    className="w-full px-3 py-2 font-mono rounded-xl border border-border"
                  />
                </div>
              </div>

              {/* Quantity Tiers Editor */}
              <div className="p-4 bg-paper/60 rounded-xl border border-border space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-ink font-display text-sm">Bulk Quantity Tier Price Breaks</span>
                    <p className="text-[0.6875rem] text-muted-foreground">Volume discount breaks applied automatically at checkout.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const lastTier = quantityTiers[quantityTiers.length - 1];
                      const nextMin = lastTier ? (lastTier.maxQuantity ? lastTier.maxQuantity + 1 : lastTier.minQuantity * 2) : 100;
                      setQuantityTiers([
                        ...quantityTiers,
                        { minQuantity: nextMin, maxQuantity: null, tierPriceMinor: Math.round(basePriceRupees * nextMin * 0.7 * 100), discountPercent: 30 },
                      ]);
                    }}
                    className="px-2.5 py-1 rounded-lg border border-border bg-white text-ink hover:border-violet text-[0.6875rem] font-bold"
                  >
                    + Add Tier
                  </button>
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {quantityTiers.map((tier, idx) => (
                    <div key={idx} className="grid grid-cols-12 gap-2 items-center p-2 rounded-lg bg-white border border-border">
                      <div className="col-span-3">
                        <span className="text-[0.625rem] text-muted-foreground block">Min Qty</span>
                        <input
                          type="number"
                          min={1}
                          value={tier.minQuantity}
                          onChange={(e) => {
                            const updated = [...quantityTiers];
                            updated[idx].minQuantity = Number(e.target.value);
                            setQuantityTiers(updated);
                          }}
                          className="w-full px-2 py-1 font-mono rounded-md border border-border text-xs"
                        />
                      </div>

                      <div className="col-span-3">
                        <span className="text-[0.625rem] text-muted-foreground block">Max Qty (Blank = ∞)</span>
                        <input
                          type="number"
                          min={tier.minQuantity}
                          value={tier.maxQuantity || ""}
                          onChange={(e) => {
                            const updated = [...quantityTiers];
                            updated[idx].maxQuantity = e.target.value ? Number(e.target.value) : null;
                            setQuantityTiers(updated);
                          }}
                          placeholder="No max"
                          className="w-full px-2 py-1 font-mono rounded-md border border-border text-xs"
                        />
                      </div>

                      <div className="col-span-3">
                        <span className="text-[0.625rem] text-muted-foreground block">Tier Total (₹)</span>
                        <input
                          type="number"
                          min={0}
                          value={tier.tierPriceMinor / 100}
                          onChange={(e) => {
                            const updated = [...quantityTiers];
                            updated[idx].tierPriceMinor = Math.round(Number(e.target.value) * 100);
                            setQuantityTiers(updated);
                          }}
                          className="w-full px-2 py-1 font-mono font-bold rounded-md border border-border text-xs text-violet"
                        />
                      </div>

                      <div className="col-span-2">
                        <span className="text-[0.625rem] text-muted-foreground block">Discount %</span>
                        <input
                          type="number"
                          min={0}
                          max={100}
                          value={tier.discountPercent || 0}
                          onChange={(e) => {
                            const updated = [...quantityTiers];
                            updated[idx].discountPercent = Number(e.target.value);
                            setQuantityTiers(updated);
                          }}
                          className="w-full px-2 py-1 font-mono rounded-md border border-border text-xs"
                        />
                      </div>

                      <div className="col-span-1 pt-3 text-right">
                        <button
                          type="button"
                          onClick={() => setQuantityTiers(quantityTiers.filter((_, i) => i !== idx))}
                          className="text-muted-foreground hover:text-rose-600"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-border shrink-0">
              <button
                type="button"
                onClick={() => setIsPriceModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-border text-xs font-bold hover:bg-paper"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmittingPrice}
                className="px-4 py-2 rounded-xl bg-violet text-xs font-bold text-white hover:bg-violet/90 transition-all shadow-sm"
              >
                {isSubmittingPrice ? "Saving..." : "Save Product Price Matrix"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL 2: Create / Edit Campaign Modal */}
      {isPromoModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <form
            onSubmit={handleSavePromo}
            className="w-full max-w-xl max-h-[90vh] my-auto flex flex-col bg-white rounded-2xl p-6 sm:p-8 shadow-2xl border border-border text-xs"
          >
            <div className="border-b border-border pb-3 shrink-0">
              <span className="text-[0.6875rem] font-bold uppercase font-mono text-violet">
                {editingPromo ? "Edit Campaign" : "New Promotional Campaign"}
              </span>
              <h3 className="font-display text-lg font-extrabold text-ink">
                {editingPromo ? editingPromo.name : "Create Campaign & Promotion Rules"}
              </h3>
            </div>

            <div className="space-y-4 overflow-y-auto py-3 pr-1.5 flex-1">
              <div className="space-y-1">
                <label className="font-bold text-ink">Campaign Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Diwali Mega Fest / Visiting Card Flash Sale"
                  className="w-full px-3 py-2 rounded-xl border border-border font-semibold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-ink flex items-center gap-1">
                    <Tag className="size-3 text-violet" />
                    <span>Coupon Code (Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    placeholder="e.g. FLASH20 (Blank = Auto)"
                    className="w-full px-3 py-2 font-mono font-bold rounded-xl border border-border"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-ink">Short Blurb / Top Banner</label>
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="e.g. 20% off cards & stationery"
                    className="w-full px-3 py-2 rounded-xl border border-border"
                  />
                </div>
              </div>

              {/* Scope & Target Rule */}
              <div className="p-3.5 bg-paper/60 rounded-xl border border-border space-y-2.5">
                <div className="font-bold text-ink flex items-center gap-1.5">
                  <Filter className="size-3.5 text-violet" />
                  <span>Offer Targeting Scope</span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setTargetType("all");
                      setSelectedTargetIds([]);
                    }}
                    className={`py-2 px-3 rounded-lg border font-semibold text-center transition-all ${
                      targetType === "all"
                        ? "bg-violet text-white border-violet"
                        : "bg-white border-border text-ink hover:border-violet/40"
                    }`}
                  >
                    All Products
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setTargetType("category");
                      setSelectedTargetIds([]);
                    }}
                    className={`py-2 px-3 rounded-lg border font-semibold text-center transition-all ${
                      targetType === "category"
                        ? "bg-violet text-white border-violet"
                        : "bg-white border-border text-ink hover:border-violet/40"
                    }`}
                  >
                    Specific Categories
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setTargetType("product");
                      setSelectedTargetIds([]);
                    }}
                    className={`py-2 px-3 rounded-lg border font-semibold text-center transition-all ${
                      targetType === "product"
                        ? "bg-violet text-white border-violet"
                        : "bg-white border-border text-ink hover:border-violet/40"
                    }`}
                  >
                    Specific Products
                  </button>
                </div>

                {targetType === "category" && (
                  <div className="space-y-1.5 pt-1">
                    <label className="font-semibold text-muted-foreground text-[0.6875rem]">
                      Select Categories for this promotion:
                    </label>
                    <div className="grid grid-cols-2 gap-1.5 max-h-32 overflow-y-auto p-2 bg-white rounded-lg border border-border">
                      {categories.map((c) => {
                        const checked = selectedTargetIds.includes(c.handle);
                        return (
                          <label key={c.handle} className="flex items-center gap-2 cursor-pointer text-ink font-medium">
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={(e) => {
                                if (e.target.checked) setSelectedTargetIds([...selectedTargetIds, c.handle]);
                                else setSelectedTargetIds(selectedTargetIds.filter((id) => id !== c.handle));
                              }}
                              className="size-3 text-violet rounded border-border"
                            />
                            <span className="truncate">{c.title}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                )}

                {targetType === "product" && (
                  <div className="space-y-1.5 pt-1">
                    <label className="font-semibold text-muted-foreground text-[0.6875rem]">
                      Select Products for this promotion:
                    </label>
                    <div className="grid grid-cols-1 gap-1.5 max-h-36 overflow-y-auto p-2 bg-white rounded-lg border border-border">
                      {products.slice(0, 50).map((prod) => {
                        const checked = selectedTargetIds.includes(prod.handle) || selectedTargetIds.includes(prod.id);
                        return (
                          <label key={prod.id} className="flex items-center gap-2 cursor-pointer text-ink font-medium">
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={(e) => {
                                if (e.target.checked) setSelectedTargetIds([...selectedTargetIds, prod.handle]);
                                else setSelectedTargetIds(selectedTargetIds.filter((id) => id !== prod.handle && id !== prod.id));
                              }}
                              className="size-3 text-violet rounded border-border"
                            />
                            <span className="truncate">{prod.title}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Discount Details */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-ink">Discount Type</label>
                  <select
                    value={type}
                    onChange={(e) =>
                      setType(e.target.value as "percentage_discount" | "fixed_discount" | "sale_price")
                    }
                    className="w-full px-3 py-2 rounded-xl border border-border font-semibold"
                  >
                    <option value="percentage_discount">Percentage Discount (%)</option>
                    <option value="fixed_discount">Fixed Amount (₹)</option>
                    <option value="sale_price">Fixed Sale Price (₹)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-ink">Discount Value *</label>
                  <input
                    type="number"
                    min={1}
                    value={discountValue}
                    onChange={(e) => setDiscountValue(Number(e.target.value))}
                    className="w-full px-3 py-2 font-mono font-bold rounded-xl border border-border"
                  />
                </div>
              </div>

              {/* Minimum Subtotal & Max Cap */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-ink">Min Order Subtotal (₹)</label>
                  <input
                    type="number"
                    min={0}
                    value={minOrderValue}
                    onChange={(e) => setMinOrderValue(Number(e.target.value))}
                    placeholder="0 = No Minimum"
                    className="w-full px-3 py-2 font-mono rounded-xl border border-border"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-ink">Max Discount Cap (₹)</label>
                  <input
                    type="number"
                    min={0}
                    value={maxDiscountAmount}
                    onChange={(e) => setMaxDiscountAmount(Number(e.target.value))}
                    placeholder="0 = No Cap"
                    className="w-full px-3 py-2 font-mono rounded-xl border border-border"
                  />
                </div>
              </div>

              {/* Scheduled / Flash Sale Time Windows */}
              <div className="p-3.5 bg-paper/60 rounded-xl border border-border space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-ink flex items-center gap-1.5">
                    <Clock className="size-3.5 text-sky-600" />
                    <span>Scheduled / Flash Sale Window (IST)</span>
                  </div>
                  <span className="text-[0.625rem] font-mono text-muted-foreground">Asia/Kolkata</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-semibold text-muted-foreground text-[0.6875rem]">Start Time (IST)</label>
                    <input
                      type="datetime-local"
                      value={startsAt}
                      onChange={(e) => setStartsAt(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-border font-mono text-[0.6875rem]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-muted-foreground text-[0.6875rem]">End Time / Expiry (IST)</label>
                    <input
                      type="datetime-local"
                      value={endsAt}
                      onChange={(e) => setEndsAt(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-border font-mono text-[0.6875rem]"
                    />
                  </div>
                </div>
              </div>

              {/* Stackable Toggle */}
              <div>
                <label className="flex items-center gap-2 cursor-pointer font-semibold">
                  <input
                    type="checkbox"
                    checked={stackable}
                    onChange={(e) => setStackable(e.target.checked)}
                    className="rounded border-border size-3.5 text-violet"
                  />
                  <span>Allow stacking with other coupons & volume discounts</span>
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-border shrink-0">
              <button
                type="button"
                onClick={() => setIsPromoModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-border text-xs font-bold hover:bg-paper"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmittingPromo}
                className="px-4 py-2 rounded-xl bg-violet text-xs font-bold text-white hover:bg-violet/90 transition-all shadow-sm"
              >
                {isSubmittingPromo ? "Saving..." : editingPromo ? "Update Campaign" : "Launch Campaign"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* PRICE BOOK MODAL */}
      {isPriceBookModalOpen && editingPriceBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/20 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-sheet overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-border flex items-center justify-between bg-paper/50">
              <h2 className="font-display font-bold text-sm text-ink">
                {editingPriceBook.id ? "Edit Price Book" : "New Price Book"}
              </h2>
              <button
                onClick={() => setIsPriceBookModalOpen(false)}
                className="p-1 rounded hover:bg-black/5 text-muted-foreground"
              >
                ✕
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-4">
              <div>
                <label className="text-xs font-bold text-ink block mb-1">Name</label>
                <input
                  type="text"
                  value={editingPriceBook.name || ""}
                  onChange={(e) => setEditingPriceBook({ ...editingPriceBook, name: e.target.value })}
                  className="w-full rounded-xl border border-border bg-white px-3 py-2 text-sm text-ink focus:border-violet focus:outline-none"
                  placeholder="e.g. Wholesale Partners"
                />
              </div>
              
              <div>
                <label className="text-xs font-bold text-ink block mb-1">Code</label>
                <input
                  type="text"
                  value={editingPriceBook.code || ""}
                  onChange={(e) => setEditingPriceBook({ ...editingPriceBook, code: e.target.value.toUpperCase().replace(/[^A-Z0-9_]/g, '') })}
                  className="w-full rounded-xl border border-border bg-white px-3 py-2 text-sm font-mono uppercase text-ink focus:border-violet focus:outline-none"
                  placeholder="e.g. WHOLESALE_2024"
                />
                <p className="text-[10px] text-muted-foreground mt-1">Uppercase letters, numbers, and underscores only.</p>
              </div>

              <div>
                <label className="text-xs font-bold text-ink block mb-1">Description</label>
                <textarea
                  value={editingPriceBook.description || ""}
                  onChange={(e) => setEditingPriceBook({ ...editingPriceBook, description: e.target.value })}
                  className="w-full rounded-xl border border-border bg-white px-3 py-2 text-sm text-ink focus:border-violet focus:outline-none"
                  rows={2}
                />
              </div>

              <div className="flex items-center gap-3 bg-paper p-3 rounded-xl border border-border">
                <input
                  type="checkbox"
                  id="isDefaultPriceBook"
                  checked={editingPriceBook.is_default || false}
                  onChange={(e) => setEditingPriceBook({ ...editingPriceBook, is_default: e.target.checked })}
                  className="size-4 accent-violet rounded border-border"
                />
                <label htmlFor="isDefaultPriceBook" className="text-xs font-bold text-ink cursor-pointer">
                  Default Storefront Price Book
                  <p className="text-[10px] text-muted-foreground font-normal mt-0.5">
                    Will replace any existing default price book if checked.
                  </p>
                </label>
              </div>
            </div>

            <div className="p-4 border-t border-border flex justify-end gap-3 bg-paper/50 mt-auto">
              <button
                type="button"
                onClick={() => setIsPriceBookModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-ink bg-white border border-border hover:bg-paper"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isSavingPriceBook || !editingPriceBook.name || !editingPriceBook.code}
                onClick={async () => {
                  setIsSavingPriceBook(true);
                  const res = await savePriceBookAction({
                    id: editingPriceBook.id,
                    name: editingPriceBook.name!,
                    code: editingPriceBook.code!,
                    description: editingPriceBook.description,
                    isDefault: editingPriceBook.is_default || false,
                    currency: "INR",
                    status: "active",
                    priority: 0,
                  });
                  setIsSavingPriceBook(false);
                  
                  if (res.success) {
                    toast.success("Price book saved");
                    setIsPriceBookModalOpen(false);
                    router.refresh();
                  } else {
                    toast.error(res.error || "Failed to save");
                  }
                }}
                className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-violet hover:bg-violet-lift disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSavingPriceBook ? "Saving..." : "Save Price Book"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
