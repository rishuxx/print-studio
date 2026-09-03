"use server";

import { getUnreadNotificationCount, getNotifications } from "./queries";

export async function fetchUnreadCountAction() {
  return await getUnreadNotificationCount();
}

export async function fetchNotificationsAction(params: {
  limit?: number;
  offset?: number;
  category?: string;
  unreadOnly?: boolean;
}) {
  return await getNotifications(params);
}
