# PHASE 10G --- CUSTOMERS

## Production-Grade Customer Management, CRM, Identity, Privacy & Customer Operations

> **Project standard:** This is a real production e-commerce/printing
> business application. It is **not** a college project, demo,
> prototype, or CRUD exercise.
>
> Build this phase as a secure, scalable customer-management platform
> suitable for real customer traffic, large datasets, concurrent staff,
> guest checkout, B2B customers, privacy requests, fraud/account
> controls, and long-term operational use.
>
> **Do not claim "bug-free" merely because TypeScript/build/lint pass.**
> The implementation is complete only after functional, security,
> database, concurrency, performance, privacy, integration, and
> regression tests pass with evidence.

------------------------------------------------------------------------

# 0. NON-NEGOTIABLE IMPLEMENTATION RULES

1.  **Inspect the existing project before changing anything.**
2.  Do not create duplicate customer/order/payment concepts if
    equivalent tables already exist.
3.  Reuse and extend the existing:
    -   Supabase/PostgreSQL schema
    -   Supabase Auth
    -   admin authentication/RBAC
    -   orders
    -   order_items
    -   payments
    -   refunds
    -   invoices
    -   products/catalogue
    -   pricing engine
    -   audit infrastructure
    -   Page Help system
4.  Preserve historical order/payment/refund/invoice integrity.
5.  Never trust client-provided customer IDs, ownership, status, totals,
    permissions, or sensitive fields.
6.  Every privileged mutation must be authorized server-side.
7.  RLS must be enabled for every exposed customer-related table.
8.  Do not expose `service_role` credentials to browser/client code.
9.  Never store passwords, payment card PAN, CVV, OTPs, payment PINs,
    gateway secrets, or authentication tokens in customer tables.
10. Never log raw passwords, authentication tokens, full payment
    credentials, or unnecessary sensitive PII.
11. Financial records remain immutable except through controlled
    business workflows.
12. Customer deletion must never destroy legally/financially required
    historical records.
13. Use soft lifecycle controls first; irreversible
    deletion/anonymization requires an explicit protected workflow.
14. Use UUIDs for externally exposed entity identifiers.
15. Use integer minor units for money.
16. All timestamps must be timezone-aware (`timestamptz`).
17. Store canonical operational timezone as configuration; do not assume
    browser timezone.
18. All list endpoints must be bounded and paginated.
19. Prefer **keyset/cursor pagination** for large customer datasets.
20. No unbounded `SELECT *`.
21. No N+1 database queries.
22. No client-side loading of the entire customer database.
23. Search/filter/sort must execute server-side.
24. Sensitive customer operations must produce audit events.
25. Use optimistic concurrency/version checks on editable customer
    records.
26. Do not use optimistic UI for irreversible or high-risk operations.
27. Destructive actions require explicit confirmation and appropriate
    authorization.
28. Build useful loading states, error states, empty states, retry
    states, and stale-data states.
29. Avoid unnecessary full-page reloads between admin screens.
30. Preserve existing storefront, checkout, payments, pricing, orders
    and catalogue behavior.
31. Do not silently change existing business rules.
32. If an existing business rule conflicts with this specification, stop
    and document the conflict before changing it.
33. Do not mark the phase production-ready until the final audit
    checklist passes.

------------------------------------------------------------------------

# 1. RESEARCH / ENGINEERING BASIS

Use current official documentation and established security guidance
while implementing this phase.

The architecture must follow the principles of:

-   PostgreSQL relational integrity and indexed querying.
-   PostgreSQL full-text search / GIN indexes where appropriate.
-   `pg_trgm` for typo-tolerant/fuzzy customer lookup where appropriate.
-   Supabase Auth + PostgreSQL RLS.
-   Server-side authorization and least privilege.
-   OWASP authorization, authentication, session-management and logging
    principles.
-   Privacy/data-protection readiness appropriate for an Indian
    business.

Important: do not copy proprietary Amazon/Flipkart/Myntra implementation
details. Implement equivalent **enterprise-grade operational
capabilities** using our own architecture.

For privacy/compliance, design the system to support applicable Indian
privacy obligations, including DPDP requirements as applicable to the
business. Do not represent this implementation as legal advice.

------------------------------------------------------------------------

# 2. FIRST TASK --- FULL EXISTING-SCHEMA DISCOVERY

Before writing migration SQL, inspect:

-   all existing migrations
-   `public.profiles`
-   `public.orders`
-   `public.order_items`
-   `public.payments`
-   `public.payment_refunds`
-   `public.webhook_events`
-   invoices
-   addresses if present
-   auth relationships
-   existing audit tables
-   admin roles
-   existing RLS helper functions
-   existing customer/account tables
-   existing storage buckets
-   pricing tables
-   catalogue tables

Create an internal schema map:

``` text
Auth User
   ↓
Profile / Customer
   ↓
Customer Identity
   ↓
Addresses
   ↓
Orders
   ├── Order Items
   ├── Payments
   ├── Refunds
   └── Invoices

Customer
   ├── Segments
   ├── Tags
   ├── Notes
   ├── Activity
   ├── Consent / Privacy
   └── Account Controls
```

If equivalent tables already exist:

-   extend them safely,
-   migrate data,
-   preserve IDs,
-   preserve historical relationships,
-   preserve RLS,
-   avoid duplicate sources of truth.

Produce a migration plan before destructive schema changes.

------------------------------------------------------------------------

# 3. CUSTOMER DOMAIN MODEL

The customer system must support:

### Customer types

-   Individual
-   Business/B2B
-   Guest
-   Registered
-   Wholesale
-   Corporate
-   Reseller/partner if required later

### Customer lifecycle

Recommended states:

``` text
guest
pending
active
restricted
suspended
deactivated
anonymization_pending
anonymized
```

Do not allow arbitrary status transitions.

Use an explicit state machine.

Example:

``` text
guest → registered
pending → active
active → restricted
active → suspended
active → deactivated
suspended → active
deactivated → active
deactivated → anonymization_pending
anonymization_pending → anonymized
```

Some transitions must require elevated permission and audit logging.

------------------------------------------------------------------------

# 4. DATABASE TABLES

Implement a normalized customer schema.

## 4.1 `customers`

Canonical customer entity.

Required fields should include:

-   `id UUID PRIMARY KEY`
-   `auth_user_id UUID NULL`
-   `customer_number TEXT UNIQUE NOT NULL`
-   `customer_type`
-   `account_status`
-   `first_name`
-   `last_name`
-   `display_name`
-   `email`
-   `normalized_email`
-   `phone`
-   `normalized_phone`
-   `company_name`
-   `gstin` if applicable
-   `tax_profile`
-   `email_verified_at`
-   `phone_verified_at`
-   `last_login_at`
-   `last_order_at`
-   `first_order_at`
-   `order_count`
-   `lifetime_value_minor`
-   `refunded_value_minor`
-   `cancelled_order_count`
-   `average_order_value_minor`
-   `currency`
-   `marketing_status`
-   `risk_status`
-   `customer_score`
-   `notes_count`
-   `version`
-   `created_at`
-   `updated_at`
-   `deleted_at`
-   `anonymized_at`

### Important

Do not use aggregate fields as an uncontrolled source of truth.

Maintain:

``` text
orders/payments/refunds = financial source of truth
customer aggregates = optimized read model
```

Create safe reconciliation/rebuild capability.

------------------------------------------------------------------------

# 5. CUSTOMER NUMBER

Do not expose sequential database IDs as customer identifiers.

Generate a human-friendly customer number, for example:

``` text
CUS-000001
CUS-000002
```

But ensure:

-   database UUID remains canonical
-   customer number is unique
-   concurrent creation cannot duplicate numbers
-   sequence generation is database-safe
-   no race condition exists

Prefer PostgreSQL sequence-backed generation or another transactional
mechanism.

------------------------------------------------------------------------

# 6. CUSTOMER IDENTITY / DUPLICATE HANDLING

Create:

## `customer_identities`

Fields:

-   `id`
-   `customer_id`
-   `identity_type`
-   `identity_value_hash`
-   `identity_value_normalized`
-   `is_primary`
-   `verified_at`
-   `source`
-   `created_at`
-   `updated_at`

Supported identity types:

``` text
email
phone
external_auth
guest_checkout
business_tax_id
```

Do not expose identity hashes unnecessarily.

### Duplicate prevention

Normalize:

-   email → lowercase + canonical normalization
-   phone → E.164 where possible
-   GSTIN → uppercase normalized format
-   business identifiers → normalized

Use appropriate unique constraints.

Do not blindly enforce uniqueness where legitimate shared contact
information is possible.

Example:

-   family members may share phone numbers
-   business accounts may share a company phone
-   multiple users may share a business email

Therefore implement **duplicate detection + confidence scoring**, not
just simplistic uniqueness.

------------------------------------------------------------------------

# 7. DUPLICATE CUSTOMER DETECTION

Create a duplicate candidate system.

## `customer_duplicate_candidates`

Fields:

-   `id`
-   `customer_a_id`
-   `customer_b_id`
-   `match_score`
-   `match_reasons JSONB`
-   `status`
-   `reviewed_by`
-   `reviewed_at`
-   `resolution`
-   `created_at`

Possible matching signals:

-   normalized email
-   verified phone
-   GSTIN
-   company name
-   name similarity
-   address similarity
-   historical order patterns

Never automatically merge customers solely because names match.

Possible states:

``` text
pending
confirmed_duplicate
not_duplicate
merged
ignored
```

------------------------------------------------------------------------

# 8. CUSTOMER MERGE WORKFLOW

Implement a protected admin merge workflow.

Before merge:

-   show both profiles
-   show orders
-   show payments
-   show refunds
-   show invoices
-   show addresses
-   show notes
-   show activity
-   show identities
-   show segments
-   show account status

Admin must explicitly select:

``` text
Primary customer
Secondary customer
```

Merge must be transactional.

Rules:

-   never delete historical orders
-   never alter financial amounts
-   never create duplicate payment ownership
-   preserve original customer ID in merge history
-   migrate allowed child records
-   record merge audit event
-   create immutable merge record
-   prevent repeated merge loops

Create:

## `customer_merge_events`

Fields:

-   `id`
-   `source_customer_id`
-   `target_customer_id`
-   `performed_by`
-   `reason`
-   `snapshot JSONB`
-   `created_at`

Require elevated permission for merge.

------------------------------------------------------------------------

# 9. CUSTOMER ADDRESSES

Create:

## `customer_addresses`

Fields:

-   `id`
-   `customer_id`
-   `address_type`
-   `recipient_name`
-   `company_name`
-   `address_line_1`
-   `address_line_2`
-   `landmark`
-   `city`
-   `state`
-   `postal_code`
-   `country_code`
-   `phone`
-   `is_default_shipping`
-   `is_default_billing`
-   `is_verified`
-   `verification_source`
-   `version`
-   `created_at`
-   `updated_at`
-   `deleted_at`

Address types:

``` text
shipping
billing
both
```

Rules:

-   maximum reasonable address count per customer
-   prevent duplicate identical active addresses
-   only one default shipping address
-   only one default billing address
-   defaults enforced transactionally
-   historical order shipping addresses must not depend on this table

Important:

**Orders must retain their own immutable shipping/billing snapshots.**

Changing a customer's address must never rewrite historical orders.

------------------------------------------------------------------------

# 10. CONTACT PREFERENCES

Create:

## `customer_contact_preferences`

Support:

-   email
-   SMS
-   WhatsApp if actually integrated
-   phone
-   push notifications if later supported

Fields:

-   `customer_id`
-   `email_allowed`
-   `sms_allowed`
-   `whatsapp_allowed`
-   `phone_allowed`
-   `transactional_allowed`
-   `marketing_allowed`
-   `quiet_hours`
-   `updated_at`
-   `version`

Transactional communications must not accidentally be disabled when
legally/operationally required.

------------------------------------------------------------------------

# 11. CONSENT / PRIVACY

Create:

## `customer_consents`

Fields:

-   `id`
-   `customer_id`
-   `consent_type`
-   `purpose`
-   `status`
-   `policy_version`
-   `source`
-   `ip_hash` if legally/operationally justified
-   `user_agent_hash` if justified
-   `granted_at`
-   `withdrawn_at`
-   `created_at`

Consent types may include:

``` text
marketing_email
marketing_sms
marketing_whatsapp
analytics
personalization
```

Do not store unnecessary tracking information.

Consent history must be append-oriented.

Do not simply overwrite historical consent.

------------------------------------------------------------------------

# 12. PRIVACY REQUESTS

Create:

## `customer_privacy_requests`

Support:

``` text
access
correction
withdrawal
deletion
anonymization
restriction
```

Fields:

-   `id`
-   `customer_id`
-   `request_type`
-   `status`
-   `requested_at`
-   `verified_at`
-   `verified_by`
-   `due_at`
-   `completed_at`
-   `completed_by`
-   `reason`
-   `resolution_notes`
-   `verification_method`
-   `created_at`
-   `updated_at`

States:

``` text
submitted
identity_verification_required
verified
in_review
approved
rejected
processing
completed
cancelled
```

Never allow an anonymous person to request another person's data.

Identity verification must be handled before disclosure or destructive
privacy operations.

------------------------------------------------------------------------

# 13. ANONYMIZATION

Do not physically delete financial history blindly.

Implement controlled anonymization.

Example anonymization:

``` text
name → Deleted Customer
email → deterministic anonymized placeholder
phone → NULL / anonymized
address → NULL where legally permitted
marketing data → removed
free-text PII → redacted where possible
```

Preserve:

-   order IDs
-   invoice IDs
-   financial totals
-   payment transaction references where required
-   required tax/accounting records

The exact retention/anonymization policy must be configurable and
reviewed against applicable legal/accounting requirements.

Every anonymization must be audited.

------------------------------------------------------------------------

# 14. CUSTOMER ACCOUNT CONTROLS

Create:

## `customer_account_controls`

Fields:

-   `customer_id`
-   `login_enabled`
-   `checkout_enabled`
-   `ordering_enabled`
-   `review_enabled`
-   `marketing_enabled`
-   `reason_code`
-   `reason`
-   `expires_at`
-   `set_by`
-   `created_at`
-   `updated_at`
-   `version`

Examples:

``` text
fraud_suspected
abusive_behavior
payment_risk
duplicate_account
customer_request
operational_review
```

Avoid permanent manual blocks unless required.

Support temporary restrictions.

------------------------------------------------------------------------

# 15. RISK STATUS

Create a controlled risk model.

Example:

``` text
normal
review
elevated
blocked
```

Do not create an opaque automated "fraud score" that staff cannot
understand.

Store:

-   score
-   reason codes
-   source
-   generated_at
-   reviewed_by

Risk decisions must remain auditable.

------------------------------------------------------------------------

# 16. B2B / BUSINESS CUSTOMER

Create:

## `customer_business_profiles`

Fields:

-   `customer_id`
-   `legal_name`
-   `trade_name`
-   `gstin`
-   `pan_last4` only if genuinely required
-   `business_type`
-   `industry`
-   `website`
-   `billing_email`
-   `billing_phone`
-   `credit_terms`
-   `credit_limit_minor`
-   `payment_terms`
-   `tax_profile`
-   `purchase_order_required`
-   `account_manager_id`
-   `approval_status`
-   `version`
-   `created_at`
-   `updated_at`

Do not store complete sensitive government identifiers unless necessary.

Encrypt or otherwise protect sensitive fields when required.

------------------------------------------------------------------------

# 17. B2B CREDIT CONTROLS

If B2B credit is enabled, create controlled credit records.

Support:

-   credit limit
-   outstanding balance
-   available credit
-   payment terms
-   overdue amount
-   credit status
-   temporary override
-   approval history

Never let a client manipulate credit values.

Credit changes require elevated permissions and audit logging.

------------------------------------------------------------------------

# 18. CUSTOMER SEGMENTS

Create:

## `customer_segments`

Fields:

-   `id`
-   `name`
-   `code`
-   `description`
-   `segment_type`
-   `rule_definition JSONB`
-   `status`
-   `priority`
-   `created_by`
-   `created_at`
-   `updated_at`
-   `version`

Examples:

``` text
new_customer
repeat_customer
high_value
inactive
b2b
wholesale
festival_buyer
at_risk
```

Support:

-   manual segments
-   rule-based segments

But never execute arbitrary code from JSON rules.

Use a validated rule DSL.

------------------------------------------------------------------------

# 19. CUSTOMER SEGMENT MEMBERSHIP

Create:

## `customer_segment_memberships`

Fields:

-   `customer_id`
-   `segment_id`
-   `membership_source`
-   `entered_at`
-   `exited_at`
-   `last_evaluated_at`
-   `evaluation_version`

Unique active membership:

``` text
(customer_id, segment_id)
```

Large-scale recalculation must be asynchronous/batched.

Never block the admin request while recalculating millions of customers.

------------------------------------------------------------------------

# 20. CUSTOMER TAGS

Create:

## `customer_tags`

Fields:

-   `id`
-   `name`
-   `slug`
-   `description`
-   `created_by`
-   `created_at`

Create:

## `customer_tag_links`

Fields:

-   `customer_id`
-   `tag_id`
-   `created_by`
-   `created_at`

Examples:

``` text
VIP
B2B
Needs Follow-up
High Volume
Payment Review
Artwork Issue
Repeat Buyer
```

Tags are operational metadata, not security permissions.

------------------------------------------------------------------------

# 21. INTERNAL CUSTOMER NOTES

Create:

## `customer_notes`

Fields:

-   `id`
-   `customer_id`
-   `author_id`
-   `note_type`
-   `content`
-   `visibility`
-   `created_at`
-   `updated_at`
-   `deleted_at`
-   `version`

Visibility:

``` text
internal
restricted
```

Never expose internal notes to customers.

Sanitize rendering to prevent XSS.

Do not allow arbitrary HTML.

------------------------------------------------------------------------

# 22. CUSTOMER ACTIVITY TIMELINE

Create an append-oriented:

## `customer_activity_events`

Fields:

-   `id`
-   `customer_id`
-   `event_type`
-   `event_source`
-   `actor_type`
-   `actor_id`
-   `entity_type`
-   `entity_id`
-   `summary`
-   `metadata JSONB`
-   `created_at`

Events:

``` text
account_created
email_verified
phone_verified
login
logout
password_changed
address_added
address_updated
address_deleted
order_created
order_paid
order_cancelled
refund_created
refund_completed
invoice_created
profile_updated
note_added
segment_added
segment_removed
status_changed
restriction_added
restriction_removed
privacy_request_created
privacy_request_completed
customer_merged
customer_anonymized
```

Do not put secrets into metadata.

------------------------------------------------------------------------

# 23. ORDERS / PAYMENTS / REFUNDS / INVOICES

Customer detail must provide a unified view.

Do not duplicate financial data.

Use existing canonical tables.

Customer page should show:

### Orders

-   order number
-   date
-   status
-   payment status
-   total
-   fulfillment status
-   item count

### Payments

-   payment ID
-   gateway
-   status
-   amount
-   created time
-   settlement/reconciliation state

Never show:

-   full card number
-   CVV
-   OTP
-   secret credentials

### Refunds

-   refund ID
-   order
-   amount
-   status
-   reason
-   date

### Invoices

-   invoice number
-   issue date
-   amount
-   tax
-   status
-   document link

Use server-side authorization for every relationship.

------------------------------------------------------------------------

# 24. CUSTOMER STATISTICS

Build an optimized customer summary.

Metrics:

-   total orders
-   completed orders
-   cancelled orders
-   returned/refunded orders
-   lifetime gross value
-   lifetime paid value
-   lifetime refunded value
-   average order value
-   first order
-   last order
-   repeat purchase interval
-   active days
-   outstanding amount if B2B credit exists

Financial metrics must derive from canonical financial records.

Create a safe aggregate refresh/reconciliation mechanism.

------------------------------------------------------------------------

# 25. CUSTOMER DIRECTORY

Build `/admin/customers`.

Required UI:

### KPI cards

-   Total Customers
-   Active Customers
-   New Customers
-   B2B Customers
-   At-Risk / Restricted
-   High-Value Customers

### Search

Search by:

-   customer number
-   name
-   email
-   phone
-   company
-   GSTIN where authorized
-   order number
-   invoice number

Use server-side search.

------------------------------------------------------------------------

# 26. SEARCH ARCHITECTURE

Do not perform:

``` sql
WHERE LOWER(name) LIKE '%query%'
```

across millions of rows without suitable indexes.

Use:

-   B-tree for exact normalized fields
-   `pg_trgm` for fuzzy/prefix/substring lookup where appropriate
-   PostgreSQL full-text search for multi-field textual search
-   GIN indexes where appropriate

Create a search document or generated/search-vector representation where
useful.

Search must remain bounded.

Support:

``` text
exact customer number
exact email
exact phone
fuzzy name/company
order number lookup
```

Search result ranking should prioritize:

1.  exact identifier
2.  exact email/phone
3.  exact customer number
4.  strong normalized match
5.  fuzzy match

------------------------------------------------------------------------

# 27. LARGE DATABASE PAGINATION

Do NOT use large offsets such as:

``` text
OFFSET 500000
```

for the primary customer directory.

Prefer cursor/keyset pagination:

``` text
created_at DESC,
id DESC
```

Cursor must be opaque and signed/validated.

Support:

-   first page
-   next page
-   previous page where practical
-   deterministic ordering

Never allow the client to inject arbitrary SQL sort expressions.

Whitelist sortable fields.

------------------------------------------------------------------------

# 28. FILTERS

Implement:

-   account status
-   customer type
-   verification state
-   B2B
-   segment
-   tags
-   order count range
-   lifetime value range
-   date joined
-   last order date
-   risk status
-   marketing status
-   restricted/suspended
-   privacy-request status

Filters must be composed server-side.

------------------------------------------------------------------------

# 29. BULK OPERATIONS

Support safe bulk operations:

-   add tag
-   remove tag
-   assign segment
-   remove segment
-   suspend
-   restrict
-   enable/disable marketing
-   export approved data
-   assign account manager

Dangerous operations must not be blindly bulk-applied.

For bulk actions:

1.  preview affected count
2.  display filters
3.  require confirmation
4.  enforce maximum batch size
5.  execute asynchronously for large batches
6.  show job status
7.  record audit event

------------------------------------------------------------------------

# 30. CUSTOMER EXPORT

Implement controlled export.

Support CSV/JSON export only for authorized staff.

Security requirements:

-   permission check
-   export reason
-   filters captured
-   actor recorded
-   export job ID
-   expiration
-   no permanent public URL
-   sensitive columns excluded by default
-   large exports processed asynchronously
-   rate limits
-   audit event

Never generate a giant export synchronously in a browser request.

------------------------------------------------------------------------

# 31. CUSTOMER DETAIL PAGE

Create:

``` text
/admin/customers
/admin/customers/[customerId]
```

Customer detail layout:

### Header

-   customer name
-   customer number
-   account status
-   verification badges
-   customer type
-   risk state
-   quick actions

### Tabs

1.  Overview
2.  Orders
3.  Payments
4.  Refunds
5.  Invoices
6.  Addresses
7.  Activity
8.  Notes
9.  Segments & Tags
10. Business
11. Privacy
12. Account Controls

Tabs must load data independently.

Do not load every tab's full dataset at initial page load.

------------------------------------------------------------------------

# 32. CUSTOMER QUICK ACTIONS

Provide controlled actions:

-   Edit Profile
-   Add Address
-   Add Note
-   Add Tag
-   Assign Segment
-   Restrict Account
-   Suspend Account
-   Reactivate
-   Disable Marketing
-   Merge Customer
-   Create Privacy Request
-   Export Customer Data

High-risk actions:

-   Merge
-   Anonymize
-   Account suspension
-   privacy disclosure/export
-   B2B credit changes

must require appropriate permissions.

------------------------------------------------------------------------

# 33. PERFORMANCE / SLOW ADMIN NAVIGATION

The existing dashboard has shown slow page-to-page navigation.

Treat this as a cross-admin performance problem.

Implement:

### Server-side

-   parallelize independent queries
-   bounded queries
-   indexed filters
-   select only required columns
-   avoid sequential waterfalls
-   avoid N+1
-   cache safe reference data
-   use stable query keys
-   use database functions only when they materially reduce round trips
-   avoid huge JSON payloads

### Next.js / frontend

-   preserve server rendering where useful
-   use streaming/loading boundaries
-   route-level loading UI
-   avoid unnecessarily converting server components to client
    components
-   prefetch safe likely navigation targets
-   avoid duplicate fetches
-   abort stale requests
-   debounce search
-   use URL query state
-   use transitions for non-blocking navigation
-   keep client bundles small
-   lazy-load heavy dialogs/components

### Important

Do NOT add caching blindly to customer PII.

Customer-specific sensitive data must have conservative cache behavior.

------------------------------------------------------------------------

# 34. REAL-TIME CUSTOMER UPDATES

Use realtime selectively.

Do not subscribe the admin browser to the entire customer table.

Useful events:

-   account status changed
-   new order
-   payment status changed
-   refund status changed
-   privacy request changed
-   customer restriction changed

Prefer:

``` text
database event
→ authorized channel
→ invalidate/refetch affected query
```

rather than pushing entire customer records.

Every realtime event must be authorization-safe.

------------------------------------------------------------------------

# 35. RLS SECURITY MODEL

Enable RLS on every exposed customer table.

Follow:

``` text
customer:
  customer can access own customer record

customer_addresses:
  customer can access own addresses

customer_consents:
  customer can access own consent history where appropriate

customer_notes:
  customer NEVER accesses internal notes

customer_activity:
  customer sees only approved customer-visible events

admin:
  admin permissions determine administrative access

service role:
  server-only
```

Do not rely on UI hiding.

Do not rely only on Next.js route guards.

RLS + server authorization must both be correct.

Supabase's `service_role` bypasses RLS, so it must remain server-side
only.

------------------------------------------------------------------------

# 36. ADMIN AUTHORIZATION

Do not use:

``` text
if role === "admin"
```

as the only long-term authorization model.

Prepare for granular permissions from Phase 10I.

Examples:

``` text
customers.read
customers.edit
customers.export
customers.restrict
customers.suspend
customers.merge
customers.anonymize
customers.manage_notes
customers.manage_segments
customers.manage_b2b
customers.manage_credit
customers.privacy_access
```

Until 10I is implemented, map these capabilities safely to the existing
admin model.

------------------------------------------------------------------------

# 37. SENSITIVE ACTION RE-AUTHENTICATION

For extremely sensitive actions consider step-up
authentication/re-authentication:

-   customer merge
-   customer data export
-   anonymization
-   B2B credit changes
-   bulk suspension

Do not make step-up authentication annoying for ordinary
viewing/editing.

------------------------------------------------------------------------

# 38. SQL SECURITY REQUIREMENTS

Every migration must include:

-   explicit constraints
-   foreign keys
-   appropriate `ON DELETE` behavior
-   check constraints
-   unique constraints
-   indexes
-   RLS
-   grants
-   comments where useful
-   safe trigger functions
-   concurrency-safe operations

Avoid `ON DELETE CASCADE` on financial/historical records unless
explicitly justified.

For security-definer functions:

``` sql
SECURITY DEFINER
SET search_path = ''
```

and explicitly qualify schema/table names.

Revoke unnecessary function execution privileges.

------------------------------------------------------------------------

# 39. DATABASE CONSTRAINTS

At minimum validate:

-   email length
-   phone length
-   currency
-   status enums
-   customer type
-   positive money values
-   non-negative counters
-   valid version
-   valid timestamps
-   default address rules
-   valid segment membership
-   valid lifecycle transitions
-   no self-merge
-   source customer != target customer
-   no duplicate active identity
-   no duplicate active tag membership

Do not depend only on Zod for invariants that must survive every
client/API path.

------------------------------------------------------------------------

# 40. TRANSACTIONAL OPERATIONS

Use database transactions for:

-   customer creation + identity creation
-   address default changes
-   customer merge
-   account status change + activity event
-   anonymization
-   segment membership replacement
-   credit changes
-   sensitive bulk state transitions

If a workflow can partially succeed, design an explicit job/state model.

------------------------------------------------------------------------

# 41. AUDIT REQUIREMENTS

Every sensitive action must produce:

-   actor
-   actor role
-   customer
-   action
-   target
-   timestamp
-   request/correlation ID
-   reason where appropriate
-   old state summary
-   new state summary
-   result
-   failure reason if failed

Never put raw secrets in audit metadata.

Audit records should be append-only.

Examples:

``` text
CUSTOMER_VIEW_SENSITIVE
CUSTOMER_UPDATED
CUSTOMER_STATUS_CHANGED
CUSTOMER_RESTRICTED
CUSTOMER_SUSPENDED
CUSTOMER_REACTIVATED
CUSTOMER_ADDRESS_CHANGED
CUSTOMER_NOTE_CREATED
CUSTOMER_MERGED
CUSTOMER_EXPORT_REQUESTED
CUSTOMER_PRIVACY_REQUESTED
CUSTOMER_ANONYMIZED
CUSTOMER_B2B_CHANGED
CUSTOMER_CREDIT_CHANGED
```

------------------------------------------------------------------------

# 42. PRIVACY-SAFE LOGGING

Mask or omit:

-   full email where unnecessary
-   phone where unnecessary
-   government identifiers
-   addresses
-   authentication tokens
-   payment credentials
-   passwords
-   session IDs

Use structured logs with correlation IDs.

------------------------------------------------------------------------

# 43. RATE LIMITING

Protect:

-   customer search
-   customer export
-   bulk operations
-   identity lookup
-   merge
-   privacy operations
-   account state changes

Use appropriate server-side rate limits.

Rate limits must not be implemented solely in the browser.

------------------------------------------------------------------------

# 44. INPUT VALIDATION

Use strict Zod schemas or equivalent runtime validators.

Validate:

-   UUID
-   email
-   phone
-   names
-   address fields
-   GSTIN format if applicable
-   customer status
-   segment rules
-   tags
-   notes
-   pagination cursor
-   sort field
-   filter values

Reject unknown fields for sensitive mutation endpoints.

------------------------------------------------------------------------

# 45. XSS / INJECTION PROTECTION

Customer-controlled values are untrusted.

Escape/sanitize:

-   names
-   company names
-   addresses
-   notes
-   imported data
-   external metadata

Never use unsafe HTML rendering for customer notes.

Never construct SQL from user-provided strings.

Use parameterized queries.

------------------------------------------------------------------------

# 46. CUSTOMER ACCOUNT TAKEOVER PROTECTION

Integrate with existing Auth security.

Support/admin visibility for:

-   email verified state
-   phone verified state
-   recent login
-   account status
-   suspicious activity
-   password reset activity where safely available
-   MFA status if available

Do not expose authentication secrets.

Follow secure session management practices.

------------------------------------------------------------------------

# 47. FRAUD / ABUSE OPERATIONS

Customer admin should make suspicious behavior visible without claiming
automated certainty.

Display:

-   multiple failed payment patterns
-   repeated cancellations
-   unusual refund frequency
-   repeated failed checkouts
-   multiple accounts sharing strong identifiers
-   suspicious account restrictions

Keep these as operational signals.

Do not make irreversible automated decisions based only on a heuristic
score.

------------------------------------------------------------------------

# 48. CUSTOMER PROFILE UX

The interface must feel like a professional operations console.

Use modern accessible components already used by the project.

Required:

-   skeleton loaders
-   empty states
-   error states
-   confirmation dialogs
-   toast notifications
-   badges
-   drawers/modals
-   tabs
-   searchable comboboxes
-   data tables
-   pagination
-   filters
-   bulk-selection toolbar
-   activity timeline
-   stat cards

Do not overload the initial screen.

Prioritize:

``` text
identity
status
value
orders
recent activity
risk
actions
```

------------------------------------------------------------------------

# 49. PAGE HELP

Every customer page must have the existing **Page Help** button.

Explain:

-   Customer vs Guest
-   Active / Restricted / Suspended / Deactivated
-   Lifetime Value
-   Average Order Value
-   Risk Status
-   Verification
-   B2B Customer
-   Segments
-   Tags
-   Internal Notes
-   Privacy Requests
-   Anonymization
-   Customer Merge
-   Account Restrictions
-   Export
-   Order vs Payment status

Use plain operational language for new staff.

------------------------------------------------------------------------

# 50. API / SERVER ACTION DESIGN

Create a clean server-side boundary:

``` text
lib/customers/
  types.ts
  validation.ts
  queries.ts
  mutations.ts
  search.ts
  aggregates.ts
  identity.ts
  merge.ts
  privacy.ts
  permissions.ts
  audit.ts
```

Do not put all customer logic in React components.

Client components should orchestrate UI.

Server code owns:

-   authorization
-   validation
-   database mutations
-   privacy
-   business rules
-   audit
-   financial references

------------------------------------------------------------------------

# 51. QUERY DESIGN

Every query must specify required columns.

Bad:

``` sql
SELECT *
FROM customers;
```

Good:

``` sql
SELECT
  id,
  customer_number,
  display_name,
  email,
  account_status,
  customer_type,
  order_count,
  lifetime_value_minor,
  last_order_at
FROM public.customers
...
```

For customer detail, load secondary datasets independently.

------------------------------------------------------------------------

# 52. INDEX PLAN

At minimum evaluate indexes for:

### Customers

-   normalized email
-   normalized phone
-   customer number
-   auth user ID
-   account status
-   customer type
-   created_at
-   last_order_at
-   lifetime_value
-   risk status
-   B2B status

### Search

-   trigram indexes where justified
-   GIN full-text search where justified

### Addresses

-   customer_id
-   active/default lookup

### Orders

-   customer_id + created_at
-   customer_id + status

### Payments

-   customer_id/order_id
-   status/date

### Refunds

-   customer_id/order_id
-   status/date

### Activities

-   customer_id + created_at DESC
-   event_type

### Notes

-   customer_id + created_at DESC

### Segments

-   customer_id
-   segment_id
-   active membership

Do not create indexes blindly. Measure query plans and write an index
rationale.

------------------------------------------------------------------------

# 53. LARGE DATASET TARGET

Design for:

``` text
100,000 customers
1,000,000 customers
10,000,000+ activity/order-related records
```

without requiring a rewrite of the architecture.

The customer directory must remain responsive as the database grows.

Use:

-   keyset pagination
-   selective indexes
-   bounded queries
-   aggregate/read models
-   asynchronous jobs
-   batch processing
-   appropriate caching
-   connection-efficient queries

Do not claim support for a specific scale without load testing.

------------------------------------------------------------------------

# 54. ASYNC JOBS

For expensive operations create a job abstraction if the existing
application has no equivalent.

Jobs:

-   bulk tagging
-   bulk segmentation
-   customer export
-   aggregate rebuild
-   duplicate detection
-   privacy anonymization
-   large customer imports
-   reconciliation

Job fields:

``` text
id
type
status
requested_by
payload
progress
total
processed
failed
error_summary
created_at
started_at
completed_at
```

Never put secrets in job payloads.

------------------------------------------------------------------------

# 55. IMPORT / MIGRATION READINESS

Prepare for future customer import.

CSV import should eventually support:

-   dry run
-   validation
-   duplicate detection
-   preview
-   row-level errors
-   rollback strategy
-   batch processing
-   audit trail

Do not implement uncontrolled direct CSV → database insertion.

If not required in 10G UI, architect the schema so it can be added
later.

------------------------------------------------------------------------

# 56. DATA RETENTION

Create configurable retention policies.

Do not hard-code destructive deletion without documenting:

-   purpose
-   retention period
-   legal dependency
-   financial dependency
-   deletion/anonymization strategy

Financial/order records may require longer retention than marketing
data.

------------------------------------------------------------------------

# 57. ADMIN EXPORT SAFETY

Before export:

``` text
Who?
What data?
Why?
Which customers?
How many records?
Which fields?
Expiration?
```

Export should produce an audit record.

For large export:

``` text
requested
→ authorized
→ processing
→ ready
→ expires
```

No permanent public download links.

------------------------------------------------------------------------

# 58. CUSTOMER SEARCH PRIVACY

Customer lookup is sensitive.

Prevent:

-   unauthenticated search
-   customer enumeration
-   broad public customer APIs
-   exposing full email/phone unnecessarily
-   searching without authorization

Admin search results should mask sensitive values according to
permission.

------------------------------------------------------------------------

# 59. OBSERVABILITY

Add structured instrumentation for:

-   query latency
-   customer search latency
-   customer detail latency
-   bulk job duration
-   failed mutations
-   RLS failures
-   authorization failures
-   export requests
-   privacy requests
-   merge failures

Use correlation IDs.

Do not log PII unnecessarily.

------------------------------------------------------------------------

# 60. ERROR HANDLING

Every operation must return controlled errors.

Do not leak:

-   SQL errors
-   stack traces
-   internal table names
-   Supabase service details
-   gateway secrets
-   environment variables

User-facing message:

``` text
We couldn't complete this operation.
Reference: <correlation-id>
```

Detailed diagnostics belong in server logs.

------------------------------------------------------------------------

# 61. CUSTOMER ADMIN ROUTES

Implement:

``` text
/admin/customers
/admin/customers/[customerId]
```

Optional protected workflows:

``` text
/admin/customers/duplicates
/admin/customers/privacy
/admin/customers/segments
```

Do not create unnecessary routes if tabs/modals provide a cleaner
architecture.

------------------------------------------------------------------------

# 62. CUSTOMER DIRECTORY TABLE

Columns:

-   checkbox
-   customer
-   customer number
-   type
-   verification
-   status
-   orders
-   lifetime value
-   last order
-   risk
-   created
-   actions

Actions:

``` text
View
Edit
Restrict
Suspend
```

Use an overflow menu for less frequent actions.

------------------------------------------------------------------------

# 63. CUSTOMER DETAIL ACTION SAFETY

For:

### Suspend

Require:

-   reason
-   optional duration
-   confirmation

### Restrict

Require:

-   restriction reason
-   scope
-   expiry if applicable

### Merge

Require:

-   source
-   target
-   preview
-   explicit confirmation

### Anonymize

Require:

-   privacy request
-   verification
-   reason
-   explicit irreversible confirmation
-   elevated authorization

------------------------------------------------------------------------

# 64. CUSTOMER PROFILE EDITING

Editable:

-   name
-   phone
-   email through secure account workflow
-   company information
-   preferences
-   selected operational metadata

Not editable casually:

-   historical order ownership
-   payment amounts
-   refund amounts
-   invoice financial totals
-   audit history

Sensitive identity changes should trigger verification workflows where
appropriate.

------------------------------------------------------------------------

# 65. CUSTOMER TIMELINE UX

Timeline should visually distinguish:

``` text
Account
Order
Payment
Refund
Support
Security
Privacy
Admin
```

Example:

``` text
30 Aug 2026 11:24
Payment completed
Order ORD-10482
₹4,720

30 Aug 2026 11:30
Digital proof approved

30 Aug 2026 12:05
Refund initiated
₹500
```

Do not expose internal staff notes as ordinary customer activity.

------------------------------------------------------------------------

# 66. CUSTOMER BUSINESS DASHBOARD

For B2B customers show:

-   company
-   GST status
-   account manager
-   total orders
-   monthly spend
-   outstanding balance
-   credit limit
-   payment terms
-   purchase order requirement
-   last activity

Sensitive B2B financial controls require permission.

------------------------------------------------------------------------

# 67. API RESPONSE SHAPES

Do not return raw database rows.

Use DTOs.

Example:

``` ts
type AdminCustomerListItem = {
  id: string;
  customerNumber: string;
  displayName: string;
  customerType: CustomerType;
  status: CustomerStatus;
  verification: {
    email: boolean;
    phone: boolean;
  };
  orderCount: number;
  lifetimeValueMinor: number;
  lastOrderAt: string | null;
  riskStatus: RiskStatus;
};
```

Separate internal/database types from public/admin DTOs.

------------------------------------------------------------------------

# 68. CONCURRENCY

Use `version` or equivalent optimistic concurrency.

Update pattern:

``` sql
UPDATE customers
SET
  ...,
  version = version + 1,
  updated_at = now()
WHERE
  id = $1
  AND version = $2;
```

If zero rows update:

``` text
409 CONFLICT
```

UI must tell staff:

> This customer was updated by another staff member. Reload the latest
> version before saving.

Never silently overwrite another admin's changes.

------------------------------------------------------------------------

# 69. DATABASE FUNCTIONS

Use PostgreSQL functions only when beneficial.

Good candidates:

-   safe customer-number allocation
-   transactional address default switching
-   aggregate refresh
-   atomic merge
-   controlled anonymization

Avoid giant business-logic functions that become impossible to test.

For `SECURITY DEFINER` functions:

-   explicitly set `search_path`
-   schema-qualify relations
-   revoke unnecessary EXECUTE
-   validate caller authorization inside the function

------------------------------------------------------------------------

# 70. SECURITY TEST SUITE

Mandatory tests:

### Authentication

-   logged out
-   customer
-   admin
-   unauthorized admin role
-   expired session

### Authorization

-   customer cannot read another customer
-   customer cannot access internal notes
-   customer cannot access another customer's addresses
-   staff without permission cannot merge
-   staff without permission cannot export
-   staff without permission cannot anonymize

### IDOR

Attempt:

``` text
/customer/A → /customer/B
```

Must fail.

### RLS

Direct database/API attempts must fail.

### Mass assignment

Attempt to modify:

``` text
id
customer_number
lifetime_value
order_count
created_at
risk_status
audit fields
```

unless explicitly authorized.

### Injection

-   SQL injection strings
-   XSS payloads
-   malformed UUIDs
-   oversized fields
-   malformed JSON rules

### Bulk abuse

-   huge customer IDs list
-   repeated requests
-   unauthorized bulk actions

### Privacy

-   unauthorized export
-   unauthorized deletion
-   unauthorized anonymization
-   duplicate privacy request
-   expired verification

### Merge

-   self merge
-   already merged customer
-   concurrent merge
-   financial record corruption attempt

------------------------------------------------------------------------

# 71. PROPERTY / INVARIANT TESTING

Test invariants such as:

``` text
customer order_count >= 0
customer lifetime_value >= 0
refund total <= paid total
one default shipping address per customer
one default billing address per customer
customer cannot be merged with itself
anonymized customer cannot regain PII accidentally
historical order snapshots never change
financial totals never change because profile changes
segment membership cannot duplicate
```

------------------------------------------------------------------------

# 72. PERFORMANCE TESTING

Measure:

### Customer directory

-   p50
-   p95
-   p99

### Search

-   exact email
-   phone
-   customer number
-   fuzzy name
-   company

### Detail page

-   initial response
-   tab load
-   activity timeline
-   order list

### Bulk

-   100
-   1,000
-   10,000+ records

Use realistic database volumes.

Inspect:

``` sql
EXPLAIN (ANALYZE, BUFFERS)
```

for important queries.

Fix sequential scans where indexes should be used.

------------------------------------------------------------------------

# 73. LOAD TESTING

Test realistic concurrent admin traffic.

Example scenarios:

``` text
100 concurrent customer searches
50 concurrent customer detail views
20 concurrent updates
10 concurrent bulk jobs
```

Do not claim a capacity number unless measured.

Record:

-   latency
-   throughput
-   error rate
-   DB CPU
-   connection utilization
-   lock contention

------------------------------------------------------------------------

# 74. REGRESSION TESTING

After 10G:

### Storefront

-   homepage
-   product listing
-   product detail
-   cart
-   checkout
-   account
-   customer order history

### Admin

-   dashboard
-   orders
-   payments
-   products
-   catalogue
-   pricing

### Financial

-   pricing engine
-   payment creation
-   payment verification
-   webhook
-   refunds
-   invoice references

Customer changes must not modify historical financial facts.

------------------------------------------------------------------------

# 75. SEO

Customer admin pages must **never be indexed**.

Ensure:

-   authentication required
-   no public rendering
-   appropriate robots behavior
-   no sensitive metadata in page HTML
-   no customer PII in public URLs
-   no customer information in Open Graph metadata

Storefront SEO must remain unaffected.

------------------------------------------------------------------------

# 76. ACCESSIBILITY

Target WCAG-oriented accessibility.

Verify:

-   keyboard navigation
-   focus management
-   dialogs
-   labels
-   table headers
-   status badges
-   screen-reader semantics
-   sufficient contrast
-   mobile touch targets
-   error messaging

------------------------------------------------------------------------

# 77. MOBILE / RESPONSIVE

Test:

``` text
375px
390px
768px
1024px
1440px+
```

Customer tables may transform into cards/condensed layouts on mobile.

Do not require horizontal scrolling for every basic action.

------------------------------------------------------------------------

# 78. PAGE NAVIGATION PERFORMANCE

Every admin navigation must have:

-   route-level loading state
-   instant visual feedback
-   no blank screen
-   preserved sidebar state
-   minimal duplicate requests
-   predictable error handling

Investigate current slow navigation using browser/network profiling.

Do not simply increase timeouts.

Identify the actual bottleneck:

``` text
server render
DB query
bundle
client hydration
waterfall
auth check
duplicate request
```

and fix the root cause.

------------------------------------------------------------------------

# 79. FILES TO CREATE

Expected structure:

``` text
supabase/migrations/
  20260830040000_phase_10g_customers.sql

lib/customers/
  types.ts
  validation.ts
  queries.ts
  mutations.ts
  search.ts
  aggregates.ts
  identity.ts
  merge.ts
  privacy.ts
  permissions.ts
  audit.ts

app/admin/customers/
  page.tsx

app/admin/customers/[customerId]/
  page.tsx

components/admin/customers/
  admin-customers-client-view.tsx
  admin-customer-detail-client-view.tsx
  customer-profile.tsx
  customer-orders.tsx
  customer-payments.tsx
  customer-refunds.tsx
  customer-invoices.tsx
  customer-addresses.tsx
  customer-activity.tsx
  customer-notes.tsx
  customer-segments.tsx
  customer-business.tsx
  customer-privacy.tsx
  customer-account-controls.tsx
  customer-merge-dialog.tsx
  customer-export-dialog.tsx
  customer-status-dialog.tsx
```

Adjust structure to the existing architecture rather than blindly
creating duplicates.

------------------------------------------------------------------------

# 80. MIGRATION REQUIREMENTS

Migration must be:

-   transactional where possible
-   idempotent where appropriate
-   backward compatible
-   safe for existing production-like data
-   reversible where realistically possible

Before applying:

1.  backup/checkpoint database
2.  inspect existing schema
3.  count existing customers
4.  identify duplicates
5.  identify orphaned orders
6.  identify missing customer links
7.  identify guest orders
8.  identify invalid emails/phones
9.  generate migration report

Do not silently discard records.

------------------------------------------------------------------------

# 81. LEGACY DATA BACKFILL

If existing orders have no customer relation:

Build a controlled backfill.

Matching priority:

``` text
verified auth user
→ exact normalized email
→ verified phone
→ explicit legacy mapping
→ guest customer
```

Never merge based solely on similar names.

Backfill must be:

-   idempotent
-   batched
-   resumable
-   audited

------------------------------------------------------------------------

# 82. CUSTOMER AGGREGATE REBUILD

Provide a maintenance/reconciliation operation.

Recompute:

``` text
order_count
completed_order_count
cancelled_order_count
lifetime_value
paid_value
refunded_value
average_order_value
first_order_at
last_order_at
```

from canonical records.

Compare stored aggregate vs computed aggregate.

Report discrepancies.

Never silently overwrite without recording the repair operation.

------------------------------------------------------------------------

# 83. DATABASE BACKUP / RECOVERY READINESS

Document:

-   backup strategy
-   restore test
-   migration rollback strategy
-   customer data recovery
-   audit preservation
-   anonymization recovery limitations

Never claim backup safety without a restore test.

------------------------------------------------------------------------

# 84. OBSERVABILITY DASHBOARD

Add operational health metrics where the existing architecture permits:

``` text
Customer Search p95
Customer Detail p95
Failed Customer Mutations
Authorization Failures
Privacy Requests Pending
Duplicate Candidates
Bulk Jobs Running
Aggregate Discrepancies
Database Errors
```

Do not expose sensitive PII in metrics.

------------------------------------------------------------------------

# 85. TEST REPORT

At completion produce:

# PHASE 10G --- FINAL CUSTOMER SYSTEM AUDIT REPORT

Include:

## 1. Executive Summary

## 2. Files Created

## 3. Files Modified

## 4. Database Schema

List every table, index, constraint, trigger and RLS policy.

## 5. Customer Lifecycle

Show every allowed transition.

## 6. Security Model

Explain:

-   authentication
-   authorization
-   RLS
-   grants
-   server actions
-   sensitive operations
-   rate limiting
-   audit
-   privacy

## 7. Search Architecture

Explain:

-   indexes
-   pagination
-   ranking
-   query bounds

## 8. Performance

Include:

-   query latency
-   page load metrics
-   p95/p99
-   EXPLAIN results
-   load test results

## 9. Privacy

Include:

-   consent
-   export
-   deletion
-   anonymization
-   retention

## 10. Duplicate / Merge

Document merge safeguards.

## 11. Financial Integrity

Prove customer changes cannot alter:

-   historical orders
-   payments
-   refunds
-   invoices
-   pricing

## 12. Test Results

Must include:

``` text
TypeScript
ESLint
Production Build
Unit Tests
Integration Tests
RLS Tests
Authorization Tests
IDOR Tests
XSS Tests
SQL Injection Tests
Mass Assignment Tests
Concurrency Tests
Privacy Tests
Merge Tests
Performance Tests
Load Tests
Responsive Tests
Accessibility Tests
Regression Tests
```

## 13. User Action Required

Clearly state anything the business owner must configure.

Examples:

-   GST/business identity information
-   customer lifecycle policy
-   privacy retention policy
-   B2B credit policy
-   segment definitions
-   admin permissions
-   email/SMS/WhatsApp provider
-   data-region configuration
-   backup/restore verification

Do not silently invent business decisions.

## 14. Known Limitations

List every unresolved issue.

Do not hide warnings.

## 15. Final Decision

Use exactly one:

``` text
PRODUCTION READY
```

or

``` text
NOT READY — BLOCKED
```

`PRODUCTION READY` is allowed only if all critical/high-severity issues
are resolved and required user/business actions are explicitly
identified.

------------------------------------------------------------------------

# 86. FINAL DEFINITION OF DONE

10G is complete only when ALL are true:

-   [ ] Customer schema normalized
-   [ ] Existing data preserved
-   [ ] Legacy customer/order links handled
-   [ ] Customer directory implemented
-   [ ] Server-side search implemented
-   [ ] Cursor pagination implemented
-   [ ] Filters implemented
-   [ ] Customer profile implemented
-   [ ] Order history integrated
-   [ ] Payment history integrated
-   [ ] Refund history integrated
-   [ ] Invoice history integrated
-   [ ] Address management implemented
-   [ ] Contact preferences implemented
-   [ ] Customer lifecycle implemented
-   [ ] Verification state implemented
-   [ ] Account restrictions implemented
-   [ ] B2B profile implemented
-   [ ] B2B controls protected
-   [ ] Segments implemented
-   [ ] Tags implemented
-   [ ] Internal notes implemented
-   [ ] Activity timeline implemented
-   [ ] Duplicate detection implemented
-   [ ] Merge workflow implemented
-   [ ] Privacy requests implemented
-   [ ] Export workflow implemented
-   [ ] Anonymization workflow implemented
-   [ ] Aggregate statistics implemented
-   [ ] Aggregate reconciliation implemented
-   [ ] Audit events implemented
-   [ ] RLS enabled on every exposed customer table
-   [ ] Grants reviewed
-   [ ] Service role server-only
-   [ ] Authorization enforced server-side
-   [ ] Sensitive actions protected
-   [ ] Rate limiting implemented
-   [ ] Input validation implemented
-   [ ] XSS protections verified
-   [ ] IDOR tests passed
-   [ ] Mass-assignment tests passed
-   [ ] Concurrency tests passed
-   [ ] Search performance tested
-   [ ] Large dataset behavior tested
-   [ ] Admin navigation performance investigated/fixed
-   [ ] Loading states implemented
-   [ ] Error states implemented
-   [ ] Page Help implemented
-   [ ] Responsive UI verified
-   [ ] Accessibility verified
-   [ ] SEO isolation verified
-   [ ] Storefront regression passed
-   [ ] Payments regression passed
-   [ ] Orders regression passed
-   [ ] Pricing regression passed
-   [ ] TypeScript passes
-   [ ] ESLint passes
-   [ ] Production build passes
-   [ ] Security tests pass
-   [ ] Load tests pass
-   [ ] Final audit report generated
-   [ ] No critical/high unresolved security issues
-   [ ] No known financial-integrity defects
-   [ ] No known customer-data isolation defects
-   [ ] Explicit GO/NO-GO decision issued

------------------------------------------------------------------------

# 87. IMPORTANT IMPLEMENTATION PHILOSOPHY

Do not optimize for "number of files created".

Optimize for:

``` text
Correctness
+
Security
+
Data integrity
+
Operational control
+
Performance
+
Auditability
+
Maintainability
+
Recoverability
```

A smaller, well-designed system is preferable to hundreds of
disconnected CRUD features.

Do not add fake enterprise features that have no real operational
purpose.

Every feature must have:

``` text
database model
→ authorization
→ validation
→ business rule
→ UI
→ audit
→ tests
→ error handling
```

------------------------------------------------------------------------

# 88. AGENT EXECUTION ORDER

Implement strictly in this order:

``` text
STEP 1
Existing schema + codebase audit

STEP 2
Customer domain model

STEP 3
Migration/schema

STEP 4
RLS + grants + security functions

STEP 5
Legacy data/backfill strategy

STEP 6
Server-side customer query layer

STEP 7
Search + indexes + cursor pagination

STEP 8
Customer lifecycle + account controls

STEP 9
Profile + addresses + preferences

STEP 10
Orders/payments/refunds/invoices integration

STEP 11
B2B functionality

STEP 12
Segments + tags

STEP 13
Notes + activity timeline

STEP 14
Duplicate detection + merge

STEP 15
Privacy/export/anonymization

STEP 16
Customer admin UI

STEP 17
Realtime/invalidation

STEP 18
Admin navigation performance optimization

STEP 19
Security testing

STEP 20
Concurrency testing

STEP 21
Large-dataset/load testing

STEP 22
Full regression testing

STEP 23
Production build

STEP 24
Final audit

STEP 25
GO / NO-GO
```

**Do not skip ahead because a page visually appears complete.**

------------------------------------------------------------------------

# 89. HARD STOP CONDITIONS

Stop implementation and report instead of guessing if:

-   existing order/customer relationships are ambiguous
-   an existing payment schema conflicts with the proposed model
-   deleting a record could affect financial history
-   privacy requirements are unclear
-   an authorization boundary is unclear
-   a business rule is missing
-   a migration could destroy data
-   an existing RLS policy conflicts
-   an existing trigger changes customer state unexpectedly
-   a performance problem requires infrastructure changes outside the
    current project
-   a third-party service is required but credentials/configuration are
    missing

The report must say:

``` text
BLOCKED
Reason:
Impact:
Required decision:
Recommended solution:
```

------------------------------------------------------------------------

# 90. FINAL INSTRUCTION TO THE IMPLEMENTING AGENT

Build **PHASE 10G --- CUSTOMERS** as a production-grade customer
operations system integrated with the already completed Admin Dashboard,
Orders, Payments, Products/Catalogue and Pricing Engine.

Do not treat this as a simple CRUD module.

The final system must allow authorized staff to understand, search,
operate, protect, segment, support, restrict, audit, and manage real
customers at scale while preserving historical financial and order
integrity.

Do not declare success merely because:

``` text
tsc = 0
lint = 0
build = pass
```

Those are necessary but insufficient.

The final declaration requires evidence that:

``` text
Security
+ Authorization
+ RLS
+ Data Integrity
+ Privacy
+ Concurrency
+ Search
+ Performance
+ Large Data
+ Customer Operations
+ Financial Integration
+ Regression
+ Accessibility
+ Production Build
```

all pass.

If any critical or high-severity issue remains:

> **DO NOT DECLARE PRODUCTION READY.**

Return a detailed final audit report with a clear:

``` text
GO
```

or

``` text
NO-GO
```

decision.
