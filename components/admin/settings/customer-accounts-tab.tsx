import * as React from "react";
import { CustomerSettingsRecord } from "@/lib/business-settings/types";
import { updateCustomerSettingsAction } from "@/lib/business-settings/mutations";
import { toast } from "sonner";
import { Users, UserCheck, ShieldCheck, MailCheck, PhoneCall, MapPin, Save, RefreshCw, HelpCircle } from "lucide-react";

interface CustomerAccountsTabProps {
  initialCustomers: CustomerSettingsRecord;
  onSaved: (updated: CustomerSettingsRecord) => void;
}

export function CustomerAccountsTab({ initialCustomers, onSaved }: CustomerAccountsTabProps) {
  const [customerData, setCustomerData] = React.useState<CustomerSettingsRecord>(initialCustomers);
  const [isSaving, setIsSaving] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await updateCustomerSettingsAction(customerData);
      if (res.success) {
        toast.success("Customer account policies saved successfully.");
        onSaved(res.data);
      } else {
        toast.error(res.error || "Failed to update customer settings.");
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
            <Users className="size-5" />
          </div>
          <div>
            <h3 className="font-display text-lg font-bold text-ink">Customer Accounts & Authentication Policy</h3>
            <p className="text-xs text-muted-foreground">
              Govern customer self-registration, guest checkout allowances, address book limits, and verification rules.
            </p>
          </div>
        </div>

        {/* Page Help Alert */}
        <div className="mt-4 rounded-xl bg-violet-wash/30 border border-violet/20 p-3.5 flex items-start gap-2.5 text-xs text-ink/80">
          <HelpCircle className="size-4 text-violet shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-violet">Account Policies: </span>
            Allowing guest checkout maximizes top-of-funnel conversion. Customer account creation lets repeat clients view order histories, artwork proofing archives, and re-order in 1-click.
          </div>
        </div>
      </div>

      {/* Main Settings Box */}
      <div className="rounded-2xl border border-border/80 bg-white p-6 shadow-xs space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Allow Customer Accounts */}
          <label className="flex items-start gap-3 p-4 rounded-xl border border-border/80 bg-paper/30 cursor-pointer hover:bg-paper/50 transition-colors">
            <input
              type="checkbox"
              checked={customerData.allow_customer_accounts}
              onChange={(e) =>
                setCustomerData((prev) => ({ ...prev, allow_customer_accounts: e.target.checked }))
              }
              className="size-4.5 rounded border-border text-violet focus:ring-violet mt-0.5"
            />
            <div className="space-y-0.5">
              <div className="text-xs font-bold text-ink flex items-center gap-1.5">
                <UserCheck className="size-3.5 text-violet" />
                <span>Customer Self-Registration</span>
              </div>
              <p className="text-[0.6875rem] text-muted-foreground">
                Enables customer sign-up, sign-in, and personal order dashboards.
              </p>
            </div>
          </label>

          {/* Allow Guest Checkout */}
          <label className="flex items-start gap-3 p-4 rounded-xl border border-border/80 bg-paper/30 cursor-pointer hover:bg-paper/50 transition-colors">
            <input
              type="checkbox"
              checked={customerData.allow_guest_checkout}
              onChange={(e) =>
                setCustomerData((prev) => ({ ...prev, allow_guest_checkout: e.target.checked }))
              }
              className="size-4.5 rounded border-border text-violet focus:ring-violet mt-0.5"
            />
            <div className="space-y-0.5">
              <div className="text-xs font-bold text-ink flex items-center gap-1.5">
                <ShieldCheck className="size-3.5 text-emerald-600" />
                <span>Allow Guest Checkout</span>
              </div>
              <p className="text-[0.6875rem] text-muted-foreground">
                Shoppers can complete purchases without creating an account.
              </p>
            </div>
          </label>

          {/* Require Email Verification */}
          <label className="flex items-start gap-3 p-4 rounded-xl border border-border/80 bg-paper/30 cursor-pointer hover:bg-paper/50 transition-colors">
            <input
              type="checkbox"
              checked={customerData.require_email_verification}
              onChange={(e) =>
                setCustomerData((prev) => ({ ...prev, require_email_verification: e.target.checked }))
              }
              className="size-4.5 rounded border-border text-violet focus:ring-violet mt-0.5"
            />
            <div className="space-y-0.5">
              <div className="text-xs font-bold text-ink flex items-center gap-1.5">
                <MailCheck className="size-3.5 text-violet" />
                <span>Require Email Verification</span>
              </div>
              <p className="text-[0.6875rem] text-muted-foreground">
                Sends OTP / verification links prior to first print order dispatch.
              </p>
            </div>
          </label>

          {/* Require Phone Verification */}
          <label className="flex items-start gap-3 p-4 rounded-xl border border-border/80 bg-paper/30 cursor-pointer hover:bg-paper/50 transition-colors">
            <input
              type="checkbox"
              checked={customerData.require_phone_verification}
              onChange={(e) =>
                setCustomerData((prev) => ({ ...prev, require_phone_verification: e.target.checked }))
              }
              className="size-4.5 rounded border-border text-violet focus:ring-violet mt-0.5"
            />
            <div className="space-y-0.5">
              <div className="text-xs font-bold text-ink flex items-center gap-1.5">
                <PhoneCall className="size-3.5 text-violet" />
                <span>Require Phone Number</span>
              </div>
              <p className="text-[0.6875rem] text-muted-foreground">
                Mandates 10-digit Indian mobile number for courier OTP deliveries.
              </p>
            </div>
          </label>
        </div>

        {/* Address Book Limits */}
        <div className="pt-4 border-t border-border/60 space-y-4">
          <div className="flex items-center justify-between p-3.5 rounded-xl border border-border/80 bg-paper/30">
            <div className="space-y-0.5">
              <div className="text-xs font-bold text-ink flex items-center gap-1.5">
                <MapPin className="size-3.5 text-violet" />
                <span>Customer Saved Address Book</span>
              </div>
              <p className="text-[0.6875rem] text-muted-foreground">
                Permits registered customers to save multiple shipping destinations for fast reorders.
              </p>
            </div>
            <input
              type="checkbox"
              checked={customerData.allow_customer_address_book}
              onChange={(e) =>
                setCustomerData((prev) => ({ ...prev, allow_customer_address_book: e.target.checked }))
              }
              className="size-4.5 rounded border-border text-violet focus:ring-violet"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-ink">Max Saved Addresses per Customer</label>
              <input
                type="number"
                min={1}
                max={50}
                value={customerData.max_saved_addresses}
                onChange={(e) =>
                  setCustomerData((prev) => ({
                    ...prev,
                    max_saved_addresses: parseInt(e.target.value) || 5,
                  }))
                }
                className="w-full rounded-xl border border-border bg-paper/60 px-3.5 py-2.5 font-mono text-xs font-bold text-ink focus:bg-white focus:border-violet focus:outline-none"
              />
              <p className="text-[0.6875rem] text-muted-foreground">Maximum address slots allowed per account.</p>
            </div>

            <div className="space-y-1.5 flex flex-col justify-center">
              <label className="text-xs font-bold text-ink">Marketing Opt-In Checkbox</label>
              <label className="flex items-center gap-2 p-2.5 rounded-xl border border-border/80 bg-paper/30 cursor-pointer">
                <input
                  type="checkbox"
                  checked={customerData.allow_marketing_opt_in}
                  onChange={(e) =>
                    setCustomerData((prev) => ({ ...prev, allow_marketing_opt_in: e.target.checked }))
                  }
                  className="size-4 rounded border-border text-violet focus:ring-violet"
                />
                <span className="text-xs font-semibold text-ink">Show promo discount opt-in at checkout</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Save Action Bar */}
      <div className="flex items-center justify-between rounded-2xl border border-border/80 bg-white p-4 shadow-xs">
        <span className="font-mono text-[0.6875rem] text-muted-foreground">
          Customer Policy: <code className="font-bold text-ink">v{customerData.version}</code>
        </span>
        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex items-center gap-2 rounded-xl bg-violet px-5 py-2.5 text-xs font-bold text-white shadow-lift hover:bg-violet-lift transition-all disabled:opacity-50"
        >
          {isSaving ? <RefreshCw className="size-4 animate-spin" /> : <Save className="size-4" />}
          <span>{isSaving ? "Saving Customer Policies..." : "Save Customer Accounts"}</span>
        </button>
      </div>
    </form>
  );
}
