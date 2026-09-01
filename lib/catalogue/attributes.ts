"use server";

import { createClient } from "@/lib/supabase/server";
import { requireAdminAuth } from "@/lib/supabase/admin-guard";
import { requirePermission } from "@/lib/auth/server-permissions";
import type {
  DatabaseAttributeDefinition,
  DatabaseCategoryAttributeTemplate,
  AllowedValueItem,
  AttributeType,
} from "./types";
import { DEFAULT_STANDARD_ATTRIBUTES } from "./attribute-utils";

/**
 * Fetch all available attribute definitions (with auto-seeding of defaults)
 */
export async function fetchAllAttributeDefinitions(): Promise<DatabaseAttributeDefinition[]> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("attribute_definitions")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error || !data || data.length === 0) {
      // Auto-seed default printing attributes if none exist
      await autoSeedDefaultAttributes();
      const { data: seededData } = await supabase
        .from("attribute_definitions")
        .select("*")
        .order("sort_order", { ascending: true });

      return (seededData as DatabaseAttributeDefinition[]) || [];
    }

    return data as DatabaseAttributeDefinition[];
  } catch {
    return [];
  }
}

/**
 * Fetch attribute templates assigned to a specific category
 */
export async function fetchCategoryAttributeTemplates(
  categoryId: string
): Promise<DatabaseCategoryAttributeTemplate[]> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("category_attribute_templates")
      .select("*, attribute:attribute_definitions(*)")
      .eq("category_id", categoryId)
      .order("sort_order", { ascending: true });

    if (error || !data) return [];
    return data as unknown as DatabaseCategoryAttributeTemplate[];
  } catch {
    return [];
  }
}

/**
 * Server Action: Save/Update an Attribute Definition
 */
export async function saveAttributeDefinitionAction(payload: {
  id?: string;
  code: string;
  name: string;
  label: string;
  description?: string | null;
  type: AttributeType;
  unit?: string | null;
  is_required: boolean;
  visible_on_storefront: boolean;
  used_for_variant: boolean;
  used_for_filtering: boolean;
  used_for_search: boolean;
  is_global: boolean;
  sort_order: number;
  allowed_values: AllowedValueItem[];
  validation_rules: Record<string, unknown>;
}): Promise<{
  success: boolean;
  attribute?: DatabaseAttributeDefinition;
  error?: string;
}> {
  try {
    await requirePermission("products.manage", "/admin/categories");
    const supabase = await createClient();

    const cleanCode = payload.code.toLowerCase().trim().replace(/[^a-z0-9_]/g, "_");

    const record = {
      code: cleanCode,
      name: payload.name.trim(),
      label: payload.label.trim(),
      description: payload.description || null,
      type: payload.type,
      unit: payload.unit || null,
      is_required: payload.is_required,
      visible_on_storefront: payload.visible_on_storefront,
      used_for_variant: payload.used_for_variant,
      used_for_filtering: payload.used_for_filtering,
      used_for_search: payload.used_for_search,
      is_global: payload.is_global,
      sort_order: payload.sort_order,
      allowed_values: payload.allowed_values,
      validation_rules: payload.validation_rules,
      updated_at: new Date().toISOString(),
    };

    if (payload.id) {
      const { data, error } = await supabase
        .from("attribute_definitions")
        .update(record)
        .eq("id", payload.id)
        .select()
        .single();

      if (error) return { success: false, error: error.message };
      return { success: true, attribute: data as DatabaseAttributeDefinition };
    } else {
      const { data, error } = await supabase
        .from("attribute_definitions")
        .insert(record)
        .select()
        .single();

      if (error) return { success: false, error: error.message };
      return { success: true, attribute: data as DatabaseAttributeDefinition };
    }
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to save attribute definition.",
    };
  }
}

/**
 * Server Action: Delete an Attribute Definition
 */
export async function deleteAttributeDefinitionAction(
  attributeId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await requirePermission("products.manage", "/admin/categories");
    const supabase = await createClient();

    const { error } = await supabase
      .from("attribute_definitions")
      .delete()
      .eq("id", attributeId);

    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to delete attribute.",
    };
  }
}

/**
 * Server Action: Assign Attribute Templates to Category
 */
export async function assignCategoryAttributeTemplateAction(
  categoryId: string,
  attributeIds: string[]
): Promise<{ success: boolean; error?: string }> {
  try {
    await requirePermission("products.manage", "/admin/categories");
    const supabase = await createClient();

    // 1. Delete existing templates for category
    await supabase
      .from("category_attribute_templates")
      .delete()
      .eq("category_id", categoryId);

    // 2. Insert new relations
    if (attributeIds.length > 0) {
      const rows = attributeIds.map((attrId, idx) => ({
        category_id: categoryId,
        attribute_id: attrId,
        sort_order: idx * 10,
      }));

      const { error } = await supabase
        .from("category_attribute_templates")
        .insert(rows);

      if (error) return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to update category templates.",
    };
  }
}

/**
 * Auto-seed standard attributes into PostgreSQL database
 */
async function autoSeedDefaultAttributes(): Promise<void> {
  try {
    const supabase = await createClient();
    for (const attr of DEFAULT_STANDARD_ATTRIBUTES) {
      await supabase
        .from("attribute_definitions")
        .upsert(attr, { onConflict: "code" });
    }
  } catch {
    // Ignore seeding failures
  }
}

export async function autoSeedAttributesIfEmpty(): Promise<void> {
  await autoSeedDefaultAttributes();
}

export const assignCategoryAttributeTemplatesAction = assignCategoryAttributeTemplateAction;
