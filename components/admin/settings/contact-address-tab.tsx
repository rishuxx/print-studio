import * as React from "react";
import { BusinessAddressRecord, BusinessContactPointRecord } from "@/lib/business-settings/types";
import { updateBusinessAddressAction } from "@/lib/business-settings/mutations";
import { INDIAN_STATES } from "@/lib/business-settings/constants";
import { toast } from "sonner";
import { MapPin, Phone, Mail, MessageSquare, Save, RefreshCw, HelpCircle } from "lucide-react";

interface ContactAddressTabProps {
  initialAddress: BusinessAddressRecord;
  initialContacts: BusinessContactPointRecord[];
  onSaved: (updatedAddress: BusinessAddressRecord) => void;
}

export function ContactAddressTab({
  initialAddress,
  initialContacts,
  onSaved,
}: ContactAddressTabProps) {
  const [addressData, setAddressData] = React.useState<BusinessAddressRecord>(initialAddress);
  const [isSaving, setIsSaving] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await updateBusinessAddressAction(addressData);
      if (res.success) {
        toast.success("Business address saved successfully.");
        onSaved(res.data);
      } else {
        toast.error(res.error || "Failed to update address.");
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
            <MapPin className="size-5" />
          </div>
          <div>
            <h3 className="font-display text-lg font-bold text-ink">Headquarters & Operational Address</h3>
            <p className="text-xs text-muted-foreground">
              Primary production facility address printed on invoices and used as the default origin for courier dispatches.
            </p>
          </div>
        </div>

        {/* Page Help Alert */}
        <div className="mt-4 rounded-xl bg-violet-wash/30 border border-violet/20 p-3.5 flex items-start gap-2.5 text-xs text-ink/80">
          <HelpCircle className="size-4 text-violet shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-violet">Origin Dispatch Notice: </span>
            Changing the headquarters PIN code updates default estimated delivery calculations for non-serviceable pin fallbacks. Real carrier serviceability (Delhivery / Blue Dart) checks take precedence.
          </div>
        </div>
      </div>

      {/* Address Form Fields */}
      <div className="rounded-2xl border border-border/80 bg-white p-6 shadow-xs space-y-5">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-ink flex items-center gap-1">
            Facility / Building Label <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            required
            value={addressData.label}
            onChange={(e) => setAddressData((prev) => ({ ...prev, label: e.target.value }))}
            placeholder="e.g. Headquarters & Main Production Facility"
            className="w-full rounded-xl border border-border bg-paper/60 px-3.5 py-2.5 text-xs font-semibold text-ink focus:bg-white focus:border-violet focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-ink flex items-center gap-1">
              Address Line 1 <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={addressData.address_line_1}
              onChange={(e) => setAddressData((prev) => ({ ...prev, address_line_1: e.target.value }))}
              placeholder="e.g. Balaji Complex, Prem Nagar"
              className="w-full rounded-xl border border-border bg-paper/60 px-3.5 py-2.5 text-xs font-semibold text-ink focus:bg-white focus:border-violet focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-ink">Address Line 2 / Area</label>
            <input
              type="text"
              value={addressData.address_line_2 || ""}
              onChange={(e) => setAddressData((prev) => ({ ...prev, address_line_2: e.target.value }))}
              placeholder="e.g. Chakrata Road"
              className="w-full rounded-xl border border-border bg-paper/60 px-3.5 py-2.5 text-xs font-semibold text-ink focus:bg-white focus:border-violet focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-ink flex items-center gap-1">
              City <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={addressData.city}
              onChange={(e) => setAddressData((prev) => ({ ...prev, city: e.target.value }))}
              placeholder="Dehradun"
              className="w-full rounded-xl border border-border bg-paper/60 px-3.5 py-2.5 text-xs font-semibold text-ink focus:bg-white focus:border-violet focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-ink flex items-center gap-1">
              State <span className="text-rose-500">*</span>
            </label>
            <select
              value={addressData.state}
              onChange={(e) => setAddressData((prev) => ({ ...prev, state: e.target.value }))}
              className="w-full rounded-xl border border-border bg-white px-3.5 py-2.5 text-xs font-semibold text-ink focus:border-violet focus:outline-none"
            >
              {INDIAN_STATES.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-ink flex items-center gap-1">
              PIN Code (Postal Code) <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              maxLength={6}
              value={addressData.postal_code}
              onChange={(e) => setAddressData((prev) => ({ ...prev, postal_code: e.target.value.replace(/\D/g, "") }))}
              placeholder="248007"
              className="w-full rounded-xl border border-border bg-paper/60 px-3.5 py-2.5 font-mono text-xs font-bold text-ink focus:bg-white focus:border-violet focus:outline-none"
            />
          </div>
        </div>

        {/* Existing Public Contact Channels Snapshot */}
        <div className="pt-4 border-t border-border/60 space-y-3">
          <h4 className="text-xs font-bold text-ink">Active Multi-Channel Support Endpoints</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {initialContacts.map((contact) => (
              <div key={contact.id} className="rounded-xl border border-border/80 bg-paper/40 p-3 space-y-1">
                <div className="flex items-center gap-1.5 text-muted-foreground text-[0.6875rem] font-bold">
                  {contact.type === "PHONE" && <Phone className="size-3 text-violet" />}
                  {contact.type === "EMAIL" && <Mail className="size-3 text-violet" />}
                  {contact.type === "WHATSAPP" && <MessageSquare className="size-3 text-emerald-600" />}
                  <span>{contact.label}</span>
                </div>
                <div className="font-mono text-xs font-bold text-ink truncate">{contact.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Save Action Bar */}
      <div className="flex items-center justify-between rounded-2xl border border-border/80 bg-white p-4 shadow-xs">
        <span className="font-mono text-[0.6875rem] text-muted-foreground">
          Address Version: <code className="font-bold text-ink">v{addressData.version}</code>
        </span>
        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex items-center gap-2 rounded-xl bg-violet px-5 py-2.5 text-xs font-bold text-white shadow-lift hover:bg-violet-lift transition-all disabled:opacity-50"
        >
          {isSaving ? <RefreshCw className="size-4 animate-spin" /> : <Save className="size-4" />}
          <span>{isSaving ? "Saving Address..." : "Save Address"}</span>
        </button>
      </div>
    </form>
  );
}
