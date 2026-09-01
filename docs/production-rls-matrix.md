# Production Row-Level Security (RLS) Policy Matrix

**System:** Print Studio E-Commerce & Production Operating System  
**Database:** PostgreSQL (Supabase)  
**Document Version:** 1.0 (Phase 11B)  

---

## 1. Complete Table RLS Audit Matrix

| Table Name | RLS Enabled | Anonymous (Public) | Customer (Authenticated) | Staff (`staff`) | Admin (`admin`) | Owner (`owner`) | Service Role Key | Risk Rating |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `products` | **YES** | Read Active & Public only | Read Active & Public only | Full CRUD via RBAC | Full CRUD | Full CRUD | Full Bypass | LOW |
| `categories` | **YES** | Read Active only | Read Active only | Full CRUD via RBAC | Full CRUD | Full CRUD | Full Bypass | LOW |
| `product_variants` | **YES** | Read Active only | Read Active only | Full CRUD via RBAC | Full CRUD | Full CRUD | Full Bypass | LOW |
| `product_quantity_tiers` | **YES** | Read Public only | Read Public only | Full CRUD via RBAC | Full CRUD | Full CRUD | Full Bypass | LOW |
| `product_media` | **YES** | Read Public only | Read Public only | Full CRUD via RBAC | Full CRUD | Full CRUD | Full Bypass | LOW |
| `profiles` | **YES** | Denied | Read/Update Own Profile (`id = auth.uid()`) | Read customers (`customers.view`) | Read/Write all | Full Control | Full Bypass | LOW |
| `addresses` | **YES** | Denied | Read/Insert/Update/Delete Own (`user_id = auth.uid()`) | Read all (`customers.view`) | Read/Write all | Full Control | Full Bypass | LOW |
| `orders` | **YES** | Denied | Read/Insert Own (`user_id = auth.uid()`) | Read all (`orders.view`), Update (`orders.manage`) | Read/Write all | Full Control | Full Bypass | LOW |
| `order_items` | **YES** | Denied | Read Own (`order.user_id = auth.uid()`) | Read all | Read/Write all | Full Control | Full Bypass | LOW |
| `order_events` | **YES** | Denied | Read Own Customer Visible (`order.user_id = auth.uid()`) | Read all, Insert event | Read/Write all | Full Control | Full Bypass | LOW |
| `payments` | **YES** | Denied | Read Own (`order.user_id = auth.uid()`) | Read all (`payments.view`), Refund (`payments.refund`) | Read/Write all | Full Control | Full Bypass | LOW |
| `payment_refunds` | **YES** | Denied | Read Own (`order.user_id = auth.uid()`) | Read all, Refund (`payments.refund`) | Read/Write all | Full Control | Full Bypass | LOW |
| `order_cancellations` | **YES** | Denied | Read Own (`order.user_id = auth.uid()`) | Manage cancellations (`orders.manage`) | Read/Write all | Full Control | Full Bypass | LOW |
| `credit_notes` | **YES** | Denied | Read Own (`order.user_id = auth.uid()`) | Read all (`payments.view`) | Read/Write all | Full Control | Full Bypass | LOW |
| `shipping_shipments` | **YES** | Denied | Read Own (`order.user_id = auth.uid()`) | Manage dispatch (`shipping.manage`) | Read/Write all | Full Control | Full Bypass | LOW |
| `shipping_tracking_events` | **YES** | Read Customer Visible by Tracking Token | Read Own Customer Visible | Read all | Read/Write all | Full Control | Full Bypass | LOW |
| `role_permissions` | **YES** | Denied | Denied | Read Own Role Permissions | Read all | Full CRUD (`users.manage`) | Full Bypass | LOW |
| `admin_audit_logs` | **YES** | Denied | Denied | Insert Action Log | Read all (`users.view`) | Full Control | Full Bypass | LOW |
| `webhook_events` | **YES** | Denied | Denied | Denied | Read all (`payments.view`) | Full Control | Full Bypass | LOW |
| `business_settings` | **YES** | Read Public Site Config | Read Public Site Config | Read all | Read/Write (`settings.manage`) | Full Control | Full Bypass | LOW |

---

## 2. IDOR Prevention Verification

- **Customer vs Customer Isolation:** Customer A is prevented by PostgreSQL row security policies (`auth.uid() = user_id`) from querying Customer B's orders, addresses, invoices, payments, and profile records.
- **Server Action & API Route Guarding:** Every Server Action independently queries `requirePermission(permission)` or `supabase.auth.getUser()`, ensuring direct API calls cannot bypass frontend UI button restrictions.
- **Service Role Key Isolation:** All client components instantiate the anonymous public client (`createBrowserClient` / `createClient`), while privileged administrative mutations use server actions or protected server routes with validated credentials.
