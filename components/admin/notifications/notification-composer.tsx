"use client";

import React, { useState, useTransition } from "react";
import {
  Send,
  Eye,
  Calendar,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Tag,
  Package,
  Megaphone,
  CreditCard,
  Truck,
  Sparkles,
  Info,
  ShieldAlert,
  X,
  ExternalLink,
} from "lucide-react";
import {
  NotificationCategory,
  NotificationPriority,
  NotificationTargetType,
} from "@/lib/notifications/types";
import { createAdminBroadcastAction } from "@/lib/notifications/mutations";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface NotificationComposerProps {
  onSuccess?: () => void;
}

export function NotificationComposer({ onSuccess }: NotificationComposerProps) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState<NotificationCategory>("order");
  const [priority, setPriority] = useState<NotificationPriority>("normal");
  const [icon, setIcon] = useState("package");
  const [actionUrl, setActionUrl] = useState("");
  const [actionLabel, setActionLabel] = useState("");
  const [targetType, setTargetType] = useState<NotificationTargetType>("ALL");
  const [targetSegment, setTargetSegment] = useState("all_active");
  const [singleUserId, setSingleUserId] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleOpenConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Notification title is required.");
      return;
    }
    if (!body.trim()) {
      toast.error("Notification message body is required.");
      return;
    }

    if (targetType === "ALL") {
      setShowConfirmModal(true);
    } else {
      executePublish();
    }
  };

  const executePublish = () => {
    setShowConfirmModal(false);
    startTransition(async () => {
      const res = await createAdminBroadcastAction({
        title: title.trim(),
        body: body.trim(),
        category,
        priority,
        icon,
        actionUrl: actionUrl.trim() || undefined,
        actionLabel: actionLabel.trim() || undefined,
        targetType,
        targetSegment: targetType === "SEGMENT" ? targetSegment : undefined,
        targetUserIds:
          targetType === "INDIVIDUAL" && singleUserId.trim()
            ? [singleUserId.trim()]
            : undefined,
        scheduledAt: scheduledAt ? new Date(scheduledAt).toISOString() : null,
        expiresAt: expiresAt ? new Date(expiresAt).toISOString() : null,
      });

      if (res.success) {
        toast.success(
          scheduledAt
            ? "Notification successfully scheduled!"
            : `Notification dispatched to ${res.targetedCount} user(s)!`
        );
        // Reset form
        setTitle("");
        setBody("");
        setActionUrl("");
        setActionLabel("");
        setScheduledAt("");
        setExpiresAt("");
        if (onSuccess) onSuccess();
      } else {
        toast.error("Failed to publish notification", { description: res.error });
      }
    });
  };

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6 shadow-2xs">
      <div className="flex items-center justify-between border-b border-zinc-100 pb-4 mb-6">
        <div>
          <h2 className="text-base font-bold text-zinc-900 flex items-center gap-2">
            <Megaphone className="size-4 text-primary" />
            <span>Create & Broadcast Notification</span>
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Publish an in-app notice, promotion banner, or system alert to your customers.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Form: 7 cols */}
        <form onSubmit={handleOpenConfirm} className="lg:col-span-7 space-y-4">
          <div>
            <label className="block text-xs font-bold text-zinc-700 mb-1">Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Your Order #PP1024 has been dispatched"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl border border-zinc-200 px-3.5 py-2.5 text-xs text-zinc-800 placeholder:text-zinc-400 focus:border-primary focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-700 mb-1">Message Body *</label>
            <textarea
              required
              rows={3}
              placeholder="e.g. Consignment manifested with Blue Dart Express. Estimated doorstep delivery in 48 hours."
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="w-full rounded-xl border border-zinc-200 px-3.5 py-2.5 text-xs text-zinc-800 placeholder:text-zinc-400 focus:border-primary focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => {
                  const val = e.target.value as NotificationCategory;
                  setCategory(val);
                  if (val === "order") setIcon("package");
                  else if (val === "marketing") setIcon("tag");
                  else if (val === "shipping") setIcon("truck");
                  else if (val === "payment") setIcon("creditcard");
                  else setIcon("megaphone");
                }}
                className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-xs text-zinc-800 focus:border-primary focus:outline-none"
              >
                <option value="order">Order Update</option>
                <option value="shipping">Shipment Tracking</option>
                <option value="payment">Payment & Refund</option>
                <option value="marketing">Offer / Promotion</option>
                <option value="product">Product Launch</option>
                <option value="system">System Notice</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as NotificationPriority)}
                className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-xs text-zinc-800 focus:border-primary focus:outline-none"
              >
                <option value="low">Low</option>
                <option value="normal">Normal</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1">Icon</label>
              <select
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-xs text-zinc-800 focus:border-primary focus:outline-none"
              >
                <option value="package">Package / Box</option>
                <option value="truck">Truck / Shipping</option>
                <option value="creditcard">Credit Card</option>
                <option value="tag">Discount Tag</option>
                <option value="megaphone">Megaphone</option>
                <option value="sparkles">Sparkles</option>
                <option value="check">Checkmark</option>
                <option value="alert">Alert / Warning</option>
              </select>
            </div>
          </div>

          {/* Deep link action */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1">
                Action URL (Optional Deep Link)
              </label>
              <input
                type="text"
                placeholder="e.g. /orders/PRT-2026 or /products"
                value={actionUrl}
                onChange={(e) => setActionUrl(e.target.value)}
                className="w-full rounded-xl border border-zinc-200 px-3.5 py-2 text-xs text-zinc-800 placeholder:text-zinc-400 focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1">
                Action Button Label
              </label>
              <input
                type="text"
                placeholder="e.g. Track Consignment"
                value={actionLabel}
                onChange={(e) => setActionLabel(e.target.value)}
                className="w-full rounded-xl border border-zinc-200 px-3.5 py-2 text-xs text-zinc-800 placeholder:text-zinc-400 focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          {/* Target Audience */}
          <div className="rounded-xl border border-zinc-200 bg-zinc-50/60 p-3.5 space-y-3">
            <div>
              <label className="block text-xs font-bold text-zinc-800 mb-1">Target Audience</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {(
                  [
                    { id: "ALL", label: "Broadcast All Users" },
                    { id: "SEGMENT", label: "Customer Segment" },
                    { id: "INDIVIDUAL", label: "Single Customer" },
                  ] as const
                ).map((t) => (
                  <button
                    type="button"
                    key={t.id}
                    onClick={() => setTargetType(t.id)}
                    className={cn(
                      "rounded-lg px-2.5 py-1.5 text-xs font-semibold border transition-all text-center",
                      targetType === t.id
                        ? "bg-zinc-900 text-white border-zinc-900 shadow-xs"
                        : "bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-100"
                    )}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {targetType === "SEGMENT" && (
              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">Select Segment</label>
                <select
                  value={targetSegment}
                  onChange={(e) => setTargetSegment(e.target.value)}
                  className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs text-zinc-800 focus:border-primary focus:outline-none"
                >
                  <option value="all_active">All Active Verified Accounts</option>
                  <option value="customers_with_orders">Customers with Placed Orders</option>
                  <option value="bulk_buyers">Corporate / Bulk Printing Buyers</option>
                </select>
              </div>
            )}

            {targetType === "INDIVIDUAL" && (
              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">User UUID</label>
                <input
                  type="text"
                  placeholder="e.g. 9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d"
                  value={singleUserId}
                  onChange={(e) => setSingleUserId(e.target.value)}
                  className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-mono text-zinc-800 focus:border-primary focus:outline-none"
                />
              </div>
            )}
          </div>

          {/* Scheduling & Expiration */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1">
                Schedule For Later (Optional)
              </label>
              <input
                type="datetime-local"
                value={scheduledAt}
                onChange={(e) => setScheduledAt(e.target.value)}
                className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-xs text-zinc-800 focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1">
                Expires At (Optional)
              </label>
              <input
                type="datetime-local"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
                className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-xs text-zinc-800 focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex items-center justify-center gap-2 w-full rounded-xl bg-primary py-2.5 px-4 text-xs font-bold text-white hover:bg-primary/90 transition-all shadow-sheet cursor-pointer disabled:opacity-50"
            >
              {isPending ? (
                <div className="size-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              ) : scheduledAt ? (
                <Calendar className="size-3.5" />
              ) : (
                <Send className="size-3.5" />
              )}
              <span>{scheduledAt ? "Schedule Notification" : "Publish Notification"}</span>
            </button>
          </div>
        </form>

        {/* Right: Live Realistic Notification Card Preview */}
        <div className="lg:col-span-5 rounded-2xl border border-zinc-200 bg-zinc-50/50 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
              <Eye className="size-3.5 text-zinc-400" />
              <span>Live In-App Preview</span>
            </span>
            <span className="rounded bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
              Desktop & Mobile
            </span>
          </div>

          <p className="text-[11px] text-zinc-400">
            This preview depicts how customer devices will render the popover and feed card:
          </p>

          {/* Render Preview Card */}
          <div className="rounded-xl border border-violet-100 bg-violet-50/40 p-4 shadow-xs relative">
            <span className="absolute left-1.5 top-1/2 -translate-y-1/2 size-1.5 rounded-full bg-primary" />
            <div className="flex gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary text-white shadow-2xs">
                {icon === "truck" && <Truck className="size-4" />}
                {icon === "package" && <Package className="size-4" />}
                {icon === "creditcard" && <CreditCard className="size-4" />}
                {icon === "tag" && <Tag className="size-4" />}
                {icon === "megaphone" && <Megaphone className="size-4" />}
                {icon === "sparkles" && <Sparkles className="size-4" />}
                {icon === "check" && <CheckCircle2 className="size-4" />}
                {icon === "alert" && <AlertTriangle className="size-4" />}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-xs font-bold text-zinc-900 leading-tight">
                    {title.trim() || "Your notification title will appear here"}
                  </h4>
                  <span className="text-[10px] font-medium text-zinc-400 whitespace-nowrap">
                    Just now
                  </span>
                </div>

                <p className="mt-1 text-xs text-zinc-700 leading-relaxed">
                  {body.trim() ||
                    "Enter your message body above to preview the realistic customer announcement text."}
                </p>

                {actionLabel && (
                  <div className="mt-2 flex items-center gap-1 text-[11px] font-bold text-primary">
                    <span>{actionLabel}</span>
                    <ExternalLink className="size-3" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Broadcast Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/60 p-4 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xl space-y-4">
            <div className="flex size-12 items-center justify-center rounded-full bg-amber-50 text-amber-600 border border-amber-200">
              <ShieldAlert className="size-6" />
            </div>

            <div>
              <h3 className="text-base font-bold text-zinc-900">
                Confirm Mass Broadcast Notification
              </h3>
              <p className="text-xs text-zinc-500 mt-1">
                You are about to broadcast this notification to <strong>ALL registered customers</strong>.
                This will write delivery records into the database and push live alerts immediately.
              </p>
            </div>

            <div className="rounded-xl bg-zinc-50 p-3 border border-zinc-200/60 text-xs">
              <div className="font-bold text-zinc-800">{title}</div>
              <div className="text-zinc-500 mt-0.5 line-clamp-2">{body}</div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="rounded-xl border border-zinc-200 px-4 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-100 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={executePublish}
                disabled={isPending}
                className="rounded-xl bg-primary px-5 py-2 text-xs font-bold text-white hover:bg-primary/90 transition-all shadow-sheet cursor-pointer"
              >
                {isPending ? "Broadcasting..." : "Yes, Broadcast Notification"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
