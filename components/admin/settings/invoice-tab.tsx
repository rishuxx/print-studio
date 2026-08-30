import * as React from "react";
import { InvoiceSettingsRecord } from "@/lib/business-settings/types";
import { updateInvoiceSettingsAction } from "@/lib/business-settings/mutations";
import { toast } from "sonner";
import { Receipt, Save, RefreshCw } from "lucide-react";

interface InvoiceTabProps {
  initialInvoice: InvoiceSettingsRecord;
  onSaved: (updatedInvoice: InvoiceSettingsRecord) => void;
}

export function InvoiceTab({ initialInvoice, onSaved }: InvoiceTabProps) {
  const [invoiceData, setInvoiceData] = React.useState<InvoiceSettingsRecord>(initialInvoice);
  const [isSaving, setIsSaving] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await updateInvoiceSettingsAction(invoiceData);
      if (res.success) {
        toast.success("Invoice settings updated successfully.");
        onSaved(res.data);
      } else {
        toast.error(res.error || "Failed to update invoice settings.");
      }
    } catch {
      toast.error("Unexpected error occurred while saving.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header Info */}
      <div className="rounded-2xl border border-border/80 bg-white p-6 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-violet/10 text-violet">
            <Receipt className="size-5" />
          </div>
          <div>
            <h3 className="font-display text-lg font-bold text-ink">Tax Invoice Template & Numbering</h3>
            <p className="text-xs text-muted-foreground">
              Manage GST tax invoice numbering format, visible document breakdowns, and computer-generated signature notices.
            </p>
          </div>
        </div>
      </div>

      {/* Main Settings */}
      <div className="rounded-2xl border border-border/80 bg-white p-6 shadow-xs space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-ink flex items-center gap-1">
              Invoice Prefix <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              maxLength={10}
              value={invoiceData.invoice_prefix}
              onChange={(e) =>
                setInvoiceData((prev) => ({ ...prev, invoice_prefix: e.target.value.toUpperCase() }))
              }
              placeholder="INV"
              className="w-full rounded-xl border border-border bg-paper/60 px-3.5 py-2.5 font-mono text-xs font-bold text-ink uppercase focus:bg-white focus:border-violet focus:outline-none"
            />
            <p className="text-[0.6875rem] text-muted-foreground">E.g. &quot;INV&quot; yields INV-2026-XXXX.</p>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-ink">Numbering Strategy</label>
            <select
              value={invoiceData.invoice_number_strategy}
              onChange={(e) =>
                setInvoiceData((prev) => ({
                  ...prev,
                  invoice_number_strategy: e.target.value as "YEAR_ORDER_NUMBER" | "SEQUENTIAL_NUMBER" | "DATE_SEQUENTIAL",
                }))
              }
              className="w-full rounded-xl border border-border bg-white px-3.5 py-2.5 text-xs font-semibold text-ink focus:border-violet focus:outline-none"
            >
              <option value="YEAR_ORDER_NUMBER">Year + Sequential Order Number (INV-2026-XXXX)</option>
              <option value="SEQUENTIAL_NUMBER">Direct Sequential Sequence (INV-001001)</option>
              <option value="DATE_SEQUENTIAL">Date Stamp + Sequence (INV-260830-XXXX)</option>
            </select>
          </div>
        </div>

        {/* Display Toggles */}
        <div className="pt-3 border-t border-border/60 space-y-3">
          <h4 className="text-xs font-bold text-ink">Invoice Layout Breakdown Visibility</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="flex items-center gap-2 text-xs font-semibold text-ink cursor-pointer p-2.5 rounded-xl border border-border/60 bg-paper/30">
              <input
                type="checkbox"
                checked={invoiceData.show_tax_breakdown}
                onChange={(e) =>
                  setInvoiceData((prev) => ({ ...prev, show_tax_breakdown: e.target.checked }))
                }
                className="size-4 rounded text-violet focus:ring-violet"
              />
              <span>Show CGST / SGST / IGST Tax Breakdown</span>
            </label>

            <label className="flex items-center gap-2 text-xs font-semibold text-ink cursor-pointer p-2.5 rounded-xl border border-border/60 bg-paper/30">
              <input
                type="checkbox"
                checked={invoiceData.show_payment_reference}
                onChange={(e) =>
                  setInvoiceData((prev) => ({ ...prev, show_payment_reference: e.target.checked }))
                }
                className="size-4 rounded text-violet focus:ring-violet"
              />
              <span>Show Razorpay Payment Reference & Gateway RRN</span>
            </label>

            <label className="flex items-center gap-2 text-xs font-semibold text-ink cursor-pointer p-2.5 rounded-xl border border-border/60 bg-paper/30">
              <input
                type="checkbox"
                checked={invoiceData.show_shipping}
                onChange={(e) =>
                  setInvoiceData((prev) => ({ ...prev, show_shipping: e.target.checked }))
                }
                className="size-4 rounded text-violet focus:ring-violet"
              />
              <span>Show Separate Courier & Shipping Line Item</span>
            </label>

            <label className="flex items-center gap-2 text-xs font-semibold text-ink cursor-pointer p-2.5 rounded-xl border border-border/60 bg-paper/30">
              <input
                type="checkbox"
                checked={invoiceData.display_gstin}
                onChange={(e) =>
                  setInvoiceData((prev) => ({ ...prev, display_gstin: e.target.checked }))
                }
                className="size-4 rounded text-violet focus:ring-violet"
              />
              <span>Display Store GSTIN on Header</span>
            </label>
          </div>
        </div>

        {/* Legal Notices */}
        <div className="space-y-4 pt-3 border-t border-border/60">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-ink">Invoice Footer Notice</label>
            <input
              type="text"
              value={invoiceData.footer_text || ""}
              onChange={(e) =>
                setInvoiceData((prev) => ({ ...prev, footer_text: e.target.value }))
              }
              placeholder="This is a computer-generated GST tax invoice. No signature is required."
              className="w-full rounded-xl border border-border bg-paper/60 px-3.5 py-2.5 text-xs font-semibold text-ink focus:bg-white focus:border-violet focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-ink">Terms & Conditions of Sale</label>
            <textarea
              rows={2}
              value={invoiceData.terms_text || ""}
              onChange={(e) =>
                setInvoiceData((prev) => ({ ...prev, terms_text: e.target.value }))
              }
              placeholder="Payment due upon receipt. Goods once printed with approved artwork are non-returnable except for defects."
              className="w-full rounded-xl border border-border bg-paper/60 p-3 text-xs font-medium text-ink focus:bg-white focus:border-violet focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Save Action Bar */}
      <div className="flex items-center justify-between rounded-2xl border border-border/80 bg-white p-4 shadow-xs">
        <span className="font-mono text-[0.6875rem] text-muted-foreground">
          Invoice Template Version: <code className="font-bold text-ink">v{invoiceData.version}</code>
        </span>
        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex items-center gap-2 rounded-xl bg-violet px-5 py-2.5 text-xs font-bold text-white shadow-lift hover:bg-violet-lift transition-all disabled:opacity-50"
        >
          {isSaving ? <RefreshCw className="size-4 animate-spin" /> : <Save className="size-4" />}
          <span>{isSaving ? "Saving Invoice Template..." : "Save Invoice Template"}</span>
        </button>
      </div>
    </form>
  );
}
