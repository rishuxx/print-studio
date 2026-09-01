# Phase 10J — Supabase PostgreSQL Row Level Security (RLS) & Policy Audit

| Table | RLS Enabled | Policies Active | Authenticated | Anon | Admin / Staff Access | Risk / Security Note |
| :--- | :---: | :---: | :---: | :---: | :---: | :--- |
| `profiles` | YES | SELECT, UPDATE | Read own / Public profile | Read none | is_admin() bypass / protect_profile_role() trigger | Protected: Trigger blocks self-escalation and demoting last owner |
| `addresses` | YES | ALL | Own user_id | Denied | Admin via service-role / is_admin() | Isolated by `auth.uid() = user_id` |
| `orders` | YES | SELECT, INSERT, UPDATE | Own user_id | Denied | is_admin() sees all | Customers can only view their own orders |
| `order_items` | YES | SELECT, INSERT | Joined to order.user_id | Denied | is_admin() sees all | Protected by order parent ownership |
| `order_events` | YES | SELECT, INSERT | Joined to order.user_id | Denied | is_admin() sees all | Real-time events scoped to order owner |
| `payments` | YES | SELECT, UPDATE | Joined to order.user_id | Denied | is_admin() | Customer only views payment status of own orders |
| `payment_refunds` | YES | SELECT | Joined to payment.order | Denied | is_admin() / requirePermission('payments.refund') | Immutable audit log of refunds |
| `webhook_events` | YES | ALL | Denied (Internal) | Denied | Server service-role only | Idempotency log for Razorpay webhooks |
| `products` | YES | SELECT | Public | Public | requirePermission('products.manage') | Visible to all; mutations restricted to admin |
| `categories` | YES | SELECT | Public | Public | requirePermission('products.manage') | Visible to all; mutations restricted to admin |
| `product_media` | YES | SELECT | Public | Public | requirePermission('products.manage') | Public media read; admin mutation |
| `price_books` | YES | SELECT | Public (Active only) | Public | requirePermission('pricing.manage') | Active pricing visible; draft pricing protected |
| `role_permissions` | YES | SELECT | Authenticated | Denied | Owner only via updateRolePermissions | Centralized authorization matrix |
| `admin_audit_logs`| YES | SELECT, INSERT | Authenticated (is_admin)| Denied | requirePermission('users.view') | Tamper-resistant mutation logs |
| `shipping_shipments` | YES | SELECT | Authenticated | Denied | is_admin() / settings.view | Scoped tracking |
| `shipping_tracking_events` | YES | SELECT | Customer visible | Public tracking | is_admin() | Scoped to customer_visible flag |
