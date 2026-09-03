"use client";

import React, { useTransition } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { NotificationRecord } from "@/lib/notifications/types";
import { markNotificationAsReadAction } from "@/lib/notifications/mutations";
import { Check, CheckCircle2, Circle, AlertTriangle, Info, Box, Truck, CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";

interface NotificationItemProps {
  notification: NotificationRecord;
  onReadAction?: (id: string) => void;
  isPopover?: boolean;
}

function getIcon(category?: string | null) {
  switch (category) {
    case "order":
      return <Box className="size-4" />;
    case "shipping":
      return <Truck className="size-4" />;
    case "payment":
    case "refund":
      return <CreditCard className="size-4" />;
    case "security":
      return <AlertTriangle className="size-4 text-red-500" />;
    default:
      return <Info className="size-4" />;
  }
}

function getLinkPath(notification: NotificationRecord) {
  if (notification.resource_type === "order" && notification.resource_id) {
    return `/account/orders/${notification.resource_id}`;
  }
  return null;
}

export function NotificationItem({ notification, onReadAction, isPopover }: NotificationItemProps) {
  const [isPending, startTransition] = useTransition();
  const isRead = !!notification.read_at;
  const linkPath = getLinkPath(notification);

  const handleMarkAsRead = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isRead || isPending) return;
    startTransition(async () => {
      const res = await markNotificationAsReadAction(notification.id!);
      if (res.success && onReadAction) {
        onReadAction(notification.id!);
      }
    });
  };

  const content = (
    <div
      className={cn(
        "group relative flex gap-3 rounded-xl p-3 sm:p-4 transition-all duration-200 border",
        isRead
          ? "bg-white border-transparent text-muted-foreground"
          : "bg-violet-wash/50 border-violet/10 text-ink shadow-sm"
      )}
    >
      {/* Icon Area */}
      <div
        className={cn(
          "flex size-8 shrink-0 items-center justify-center rounded-full mt-0.5",
          isRead ? "bg-muted text-muted-foreground" : "bg-violet text-white"
        )}
      >
        {getIcon(notification.category)}
      </div>

      {/* Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="flex items-start justify-between gap-2">
          <h4
            className={cn(
              "text-sm font-semibold leading-tight",
              isRead ? "text-muted-foreground" : "text-ink"
            )}
          >
            {notification.title || "New Notification"}
          </h4>
          <span className="shrink-0 text-[0.625rem] font-medium text-muted-foreground uppercase tracking-wider mt-0.5">
            {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
          </span>
        </div>
        <p
          className={cn(
            "mt-1 text-xs leading-relaxed line-clamp-2",
            isRead ? "text-muted-foreground/80" : "text-ink/80"
          )}
        >
          {notification.body}
        </p>

        {/* Action Link (if resource exists) */}
        {linkPath && !isPopover && (
          <div className="mt-3">
            <span className="inline-flex text-xs font-semibold text-violet group-hover:underline">
              View details &rarr;
            </span>
          </div>
        )}
      </div>

      {/* Unread Indicator & Mark Read Button */}
      {!isRead && (
        <button
          onClick={handleMarkAsRead}
          disabled={isPending}
          aria-label="Mark as read"
          className="absolute right-3 top-3 sm:right-4 sm:top-4 flex size-5 items-center justify-center rounded-full bg-violet text-white opacity-100 transition-all hover:bg-violet-deep hover:scale-110 focus:outline-none focus:ring-2 focus:ring-violet focus:ring-offset-2"
        >
          {isPending ? (
            <div className="size-3 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          ) : (
            <Check className="size-3" />
          )}
        </button>
      )}
    </div>
  );

  if (linkPath) {
    return (
      <Link
        href={linkPath}
        className="block outline-none focus-visible:ring-2 focus-visible:ring-violet focus-visible:ring-offset-2 rounded-xl"
        onClick={() => {
          if (!isRead) {
            startTransition(() => {
              markNotificationAsReadAction(notification.id!);
            });
          }
        }}
      >
        {content}
      </Link>
    );
  }

  return content;
}
