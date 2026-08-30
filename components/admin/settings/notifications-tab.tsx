import * as React from "react";
import { NotificationSettingsRecord } from "@/lib/business-settings/types";
import { updateNotificationSettingsAction } from "@/lib/business-settings/mutations";
import { toast } from "sonner";
import { Bell, Save, RefreshCw } from "lucide-react";

interface NotificationsTabProps {
  initialNotifications: NotificationSettingsRecord;
  onSaved: (updated: NotificationSettingsRecord) => void;
}

export function NotificationsTab({ initialNotifications, onSaved }: NotificationsTabProps) {
  const [notifData, setNotifData] = React.useState<NotificationSettingsRecord>(initialNotifications);
  const [isSaving, setIsSaving] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await updateNotificationSettingsAction(notifData);
      if (res.success) {
        toast.success("Notification workflow triggers saved.");
        onSaved(res.data);
      } else {
        toast.error(res.error || "Failed to update notification settings.");
      }
    } catch {
      toast.error("Unexpected error occurred while saving.");
    } finally {
      setIsSaving(false);
    }
  };

  const toggles: Array<{
    key: keyof Omit<NotificationSettingsRecord, "id" | "version" | "updated_by" | "created_at" | "updated_at">;
    label: string;
    description: string;
  }> = [
    {
      key: "order_confirmation_enabled",
      label: "Order Confirmation Triggers",
      description: "Dispatches instant email and SMS receipts immediately upon order creation.",
    },
    {
      key: "payment_confirmation_enabled",
      label: "Payment Verification Notifications",
      description: "Sends Razorpay payment capture verification receipt and payment ID.",
    },
    {
      key: "production_update_enabled",
      label: "Production & Press Proofing Updates",
      description: "Notifies customer when artwork passes pre-flight and enters offset/digital press queue.",
    },
    {
      key: "quality_update_enabled",
      label: "Quality Check & Packing Milestones",
      description: "Alerts customer when merchandise clears QC inspection and enters packaging.",
    },
    {
      key: "dispatch_update_enabled",
      label: "Carrier Dispatch & Live AWB Tracking",
      description: "Dispatches courier assignment, tracking URL, and estimated arrival window.",
    },
    {
      key: "delivery_update_enabled",
      label: "Successful Delivery Confirmation",
      description: "Sends delivery acknowledgment and post-fulfillment feedback prompt.",
    },
    {
      key: "cancellation_update_enabled",
      label: "Cancellation & Order Abort Notifications",
      description: "Sends official cancellation confirmation with cancellation reason.",
    },
    {
      key: "refund_update_enabled",
      label: "Refund Initiation & Bank RRN Updates",
      description: "Alerts customer of refund processing back to original source method in 3–7 business days.",
    },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header Info */}
      <div className="rounded-2xl border border-border/80 bg-white p-6 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-violet/10 text-violet">
            <Bell className="size-5" />
          </div>
          <div>
            <h3 className="font-display text-lg font-bold text-ink">Automated Notification Workflows</h3>
            <p className="text-xs text-muted-foreground">
              Enable or silence customer notifications triggered during fulfillment, pre-press proofing, and refunds.
            </p>
          </div>
        </div>
      </div>

      {/* Toggles Grid */}
      <div className="rounded-2xl border border-border/80 bg-white p-6 shadow-xs space-y-3">
        {toggles.map((item) => {
          const isEnabled = notifData[item.key] as boolean;
          return (
            <label
              key={item.key}
              className="flex items-start justify-between gap-4 p-3.5 rounded-xl border border-border/70 bg-paper/20 hover:bg-paper/50 transition-colors cursor-pointer"
            >
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-ink">{item.label}</div>
                <div className="text-[0.6875rem] text-muted-foreground leading-relaxed">{item.description}</div>
              </div>
              <input
                type="checkbox"
                checked={isEnabled}
                onChange={(e) => setNotifData((prev) => ({ ...prev, [item.key]: e.target.checked }))}
                className="size-4.5 rounded border-border text-violet focus:ring-violet shrink-0 mt-0.5"
              />
            </label>
          );
        })}
      </div>

      {/* Save Action Bar */}
      <div className="flex items-center justify-between rounded-2xl border border-border/80 bg-white p-4 shadow-xs">
        <span className="font-mono text-[0.6875rem] text-muted-foreground">
          Notification Policy: <code className="font-bold text-ink">v{notifData.version}</code>
        </span>
        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex items-center gap-2 rounded-xl bg-violet px-5 py-2.5 text-xs font-bold text-white shadow-lift hover:bg-violet-lift transition-all disabled:opacity-50"
        >
          {isSaving ? <RefreshCw className="size-4 animate-spin" /> : <Save className="size-4" />}
          <span>{isSaving ? "Saving Notifications..." : "Save Notification Toggles"}</span>
        </button>
      </div>
    </form>
  );
}
