"use client";

import React, { useTransition } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { NotificationRecord } from "@/lib/notifications/types";
import { markNotificationAsReadAction, dismissNotificationAction } from "@/lib/notifications/mutations";
import {
  Check,
  Package,
  CheckCircle2,
  AlertTriangle,
  Info,
  Truck,
  CreditCard,
  Tag,
  Megaphone,
  Clock,
  ExternalLink,
  X,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NotificationItemProps {
  notification: NotificationRecord;
  onReadAction?: (id: string) => void;
  onDismissAction?: (id: string) => void;
  isPopover?: boolean;
}

function getSemanticIcon(category?: string | null, iconName?: string | null) {
  // If explicitly requested semantic icon name
  switch (iconName?.toLowerCase()) {
    case "truck":
    case "shipping":
      return <Truck className="size-4" />;
    case "creditcard":
    case "payment":
      return <CreditCard className="size-4" />;
    case "tag":
    case "coupon":
      return <Tag className="size-4" />;
    case "megaphone":
    case "announcement":
      return <Megaphone className="size-4" />;
    case "sparkles":
      return <Sparkles className="size-4" />;
    case "check":
    case "delivered":
      return <CheckCircle2 className="size-4" />;
    case "clock":
      return <Clock className="size-4" />;
    case "alert":
    case "warning":
      return <AlertTriangle className="size-4 text-amber-500" />;
  }

  // Fallback by category
  switch (category?.toLowerCase()) {
    case "order":
      return <Package className="size-4" />;
    case "shipping":
      return <Truck className="size-4" />;
    case "payment":
    case "refund":
      return <CreditCard className="size-4" />;
    case "marketing":
      return <Tag className="size-4" />;
    case "system":
      return <Megaphone className="size-4" />;
    case "security":
      return <AlertTriangle className="size-4 text-rose-500" />;
    default:
      return <Info className="size-4" />;
  }
}

function resolveNavigationUrl(notification: NotificationRecord): string | null {
  if (notification.action_url) {
    return notification.action_url;
  }
  if (notification.resource_type === "order" && notification.resource_id) {
    return `/orders/${notification.resource_id}`;
  }
  if (notification.order_id) {
    return `/orders/${notification.order_id}`;
  }
  return null;
}

export function NotificationItem({
  notification,
  onReadAction,
  onDismissAction,
  isPopover,
}: NotificationItemProps) {
  const [isPending, startTransition] = useTransition();
  const isRead = !!notification.read_at;
  const navUrl = resolveNavigationUrl(notification);

  const handleMarkAsRead = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isRead || isPending) return;
    startTransition(async () => {
      const res = await markNotificationAsReadAction(notification.id);
      if (res.success && onReadAction) {
        onReadAction(notification.id);
      }
    });
  };

  const handleDismiss = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    startTransition(async () => {
      const res = await dismissNotificationAction(notification.id);
      if (res.success && onDismissAction) {
        onDismissAction(notification.id);
      }
    });
  };

  const itemContent = (
    <div
      className={cn(
        "group relative flex gap-3 rounded-xl p-3.5 sm:p-4 transition-all duration-200 border",
        isRead
          ? "bg-white border-zinc-100 hover:border-zinc-200 text-zinc-500 shadow-2xs"
          : "bg-violet-50/40 border-violet-100/80 hover:border-violet-200 text-zinc-900 shadow-xs"
      )}
    >
      {/* Unread Accent Indicator Dot */}
      {!isRead && (
        <span
          className="absolute left-1.5 top-1/2 -translate-y-1/2 size-1.5 rounded-full bg-primary"
          aria-hidden="true"
        />
      )}

      {/* Semantic Icon Surface */}
      <div
        className={cn(
          "flex size-9 shrink-0 items-center justify-center rounded-lg mt-0.5 transition-transform group-hover:scale-105",
          isRead
            ? "bg-zinc-100 text-zinc-500 border border-zinc-200/60"
            : "bg-primary text-white shadow-2xs"
        )}
      >
        {getSemanticIcon(notification.category, notification.icon)}
      </div>

      {/* Textual & Metadata Content */}
      <div className="flex flex-1 flex-col min-w-0 pr-6">
        <div className="flex items-start justify-between gap-2">
          <h4
            className={cn(
              "text-xs sm:text-sm font-semibold leading-tight line-clamp-1",
              isRead ? "text-zinc-600" : "text-zinc-900 font-bold"
            )}
          >
            {notification.title || "Notification Update"}
          </h4>
          <time
            dateTime={notification.created_at}
            className="shrink-0 text-[10px] font-medium text-zinc-400 whitespace-nowrap mt-0.5"
          >
            {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
          </time>
        </div>

        <p
          className={cn(
            "mt-1 text-xs leading-relaxed line-clamp-2",
            isRead ? "text-zinc-500" : "text-zinc-700"
          )}
        >
          {notification.body}
        </p>

        {/* Action Link (Deep link) */}
        {navUrl && (
          <div className="mt-2.5 flex items-center gap-1 text-[11px] font-bold text-primary group-hover:underline">
            <span>{notification.action_label || "View Details"}</span>
            <ExternalLink className="size-3" />
          </div>
        )}
      </div>

      {/* Right Controls: Mark as Read & Dismiss */}
      <div className="absolute right-2.5 top-2.5 flex items-center gap-1">
        {!isRead && (
          <button
            onClick={handleMarkAsRead}
            disabled={isPending}
            title="Mark as read"
            aria-label="Mark as read"
            className="flex size-6 items-center justify-center rounded-full bg-white border border-zinc-200 text-zinc-500 hover:text-primary hover:border-primary/40 transition-colors shadow-2xs"
          >
            {isPending ? (
              <div className="size-2.5 animate-spin rounded-full border border-primary/30 border-t-primary" />
            ) : (
              <Check className="size-3" />
            )}
          </button>
        )}

        {onDismissAction && !isPopover && (
          <button
            onClick={handleDismiss}
            disabled={isPending}
            title="Dismiss notification"
            aria-label="Dismiss notification"
            className="flex size-6 items-center justify-center rounded-full text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors"
          >
            <X className="size-3" />
          </button>
        )}
      </div>
    </div>
  );

  if (navUrl) {
    return (
      <Link
        href={navUrl}
        className="block rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        onClick={() => {
          if (!isRead) {
            startTransition(() => {
              markNotificationAsReadAction(notification.id);
            });
          }
        }}
      >
        {itemContent}
      </Link>
    );
  }

  return itemContent;
}
