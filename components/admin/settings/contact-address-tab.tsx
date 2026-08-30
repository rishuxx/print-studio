import * as React from "react";
import { BusinessAddressRecord, BusinessContactPointRecord } from "@/lib/business-settings/types";
import { updateBusinessAddressAction } from "@/lib/business-settings/mutations";
import { INDIAN_STATES } from "@/lib/business-settings/constants";
import { toast } from "sonner";
import { MapPin, Phone, Mail, MessageSquare, Clock, Save, RefreshCw, HelpCircle, Headphones } from "lucide-react";

interface ContactAddressTabProps {
  initialAddress: BusinessAddressRecord;
  initialContacts: BusinessContactPointRecord[];
  onSaved: (updatedAddress: BusinessAddressRecord) => void;
}

export function ContactAddressTab({
  initialAddress,
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
        toast.success("Business address & support channels saved successfully.");
        onSaved(res.data);
      } else {
        toast.error(res.error || "Failed to update address & contacts.");
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
              Primary production facility address and direct customer support communication channels.
            </p>
          </div>
        </div>

        {/* Page Help Alert */}
        <div className="mt-4 rounded-xl bg-violet-wash/30 border border-violet/20 p-3.5 flex items-start gap-2.5 text-xs text-ink/80">
          <HelpCircle className="size-4 text-violet shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-violet">Live Propagation: </span>
            Support desk phone, email, and WhatsApp numbers configured below immediately update the storefront header, floating WhatsApp chat widget, tax invoices, and maintenance contact cards.
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

        {/* ── Active Multi-Channel Support Endpoints (Fully Editable) ── */}
        <div className="pt-6 border-t border-border/80 space-y-4">
          <div className="flex items-center gap-2">
            <div className="flex size-7 items-center justify-center rounded-lg bg-violet/10 text-violet">
              <Headphones className="size-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-ink">Active Multi-Channel Support Endpoints</h4>
              <p className="text-[0.6875rem] text-muted-foreground">
                Customer support helpline, official order inquiry email, and direct pre-press WhatsApp.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Phone Endpoint */}
            <div className="space-y-1.5 p-3.5 rounded-2xl border border-border/80 bg-paper/30">
              <label className="text-xs font-bold text-ink flex items-center gap-1.5">
                <Phone className="size-3.5 text-violet" />
                <span>Customer Support Desk</span>
              </label>
              <input
                type="tel"
                value={addressData.support_phone || ""}
                onChange={(e) => setAddressData((prev) => ({ ...prev, support_phone: e.target.value }))}
                placeholder="+91 6388693472"
                className="w-full rounded-xl border border-border bg-white px-3 py-2 font-mono text-xs font-bold text-ink focus:border-violet focus:outline-none"
              />
              <p className="text-[0.625rem] text-muted-foreground">Phone helpline shown on top bar and invoice footers.</p>
            </div>

            {/* Email Endpoint */}
            <div className="space-y-1.5 p-3.5 rounded-2xl border border-border/80 bg-paper/30">
              <label className="text-xs font-bold text-ink flex items-center gap-1.5">
                <Mail className="size-3.5 text-violet" />
                <span>General Inquiries & Orders</span>
              </label>
              <input
                type="email"
                value={addressData.support_email || ""}
                onChange={(e) => setAddressData((prev) => ({ ...prev, support_email: e.target.value }))}
                placeholder="ayushiaggrawal13@gmail.com"
                className="w-full rounded-xl border border-border bg-white px-3 py-2 font-mono text-xs font-bold text-ink focus:border-violet focus:outline-none"
              />
              <p className="text-[0.625rem] text-muted-foreground">Official support & artwork proofing email.</p>
            </div>

            {/* WhatsApp Endpoint */}
            <div className="space-y-1.5 p-3.5 rounded-2xl border border-emerald-200/80 bg-emerald-50/30">
              <label className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                <MessageSquare className="size-3.5 text-emerald-600" />
                <span>Live Pre-Press WhatsApp</span>
              </label>
              <input
                type="tel"
                value={addressData.whatsapp_number || ""}
                onChange={(e) =>
                  setAddressData((prev) => ({ ...prev, whatsapp_number: e.target.value.replace(/\D/g, "") }))
                }
                placeholder="916388693472"
                className="w-full rounded-xl border border-emerald-300 bg-white px-3 py-2 font-mono text-xs font-bold text-ink focus:border-emerald-500 focus:outline-none"
              />
              <p className="text-[0.625rem] text-emerald-800">Phone with country code (e.g. 916388693472 for India).</p>
            </div>
          </div>

          {/* Support Operating Hours */}
          <div className="space-y-1.5 pt-2">
            <label className="text-xs font-bold text-ink flex items-center gap-1.5">
              <Clock className="size-3.5 text-violet" />
              <span>Customer Support Operating Window</span>
            </label>
            <input
              type="text"
              value={addressData.support_hours || ""}
              onChange={(e) => setAddressData((prev) => ({ ...prev, support_hours: e.target.value }))}
              placeholder="Mon–Sat: 10:00 AM – 7:00 PM"
              className="w-full rounded-xl border border-border bg-paper/60 px-3.5 py-2.5 text-xs font-semibold text-ink focus:bg-white focus:border-violet focus:outline-none"
            />
            <p className="text-[0.6875rem] text-muted-foreground">Displayed in storefront contact modals and customer footer.</p>
          </div>
        </div>
      </div>

      {/* Save Action Bar */}
      <div className="flex items-center justify-between rounded-2xl border border-border/80 bg-white p-4 shadow-xs">
        <span className="font-mono text-[0.6875rem] text-muted-foreground">
          Address & Channels Version: <code className="font-bold text-ink">v{addressData.version}</code>
        </span>
        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex items-center gap-2 rounded-xl bg-violet px-5 py-2.5 text-xs font-bold text-white shadow-lift hover:bg-violet-lift transition-all disabled:opacity-50"
        >
          {isSaving ? <RefreshCw className="size-4 animate-spin" /> : <Save className="size-4" />}
          <span>{isSaving ? "Saving Address & Channels..." : "Save Address & Channels"}</span>
        </button>
      </div>
    </form>
  );
}
