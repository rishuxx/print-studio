# Phase 10J — Security Test Matrix & Verification Log

| Test ID | Test Category | Description | Execution Vector | Expected Result | Actual Result |
| :--- | :--- | :--- | :--- | :--- | :---: |
| **AUTH-001** | Authentication | Unauthenticated user visits `/admin` | Direct HTTP GET `/admin` | 307 Redirect to `/login` | **PASS** |
| **AUTH-002** | Authentication | Customer account visits `/admin` | Direct HTTP GET `/admin` with customer cookie | 307 Redirect to `/` | **PASS** |
| **AUTH-003** | Authorization | Staff visits unauthorized `/admin/pricing` | Direct HTTP GET `/admin/pricing` | Intercepted by `requirePermission` | **PASS** |
| **AUTH-004** | Authorization | Admin attempts staff role escalation | Server Action `changeStaffRoleAction` | Enforced by `requirePermission('users.manage')` | **PASS** |
| **AUTH-005** | Owner Protection| Attempt to modify Owner permissions | Server Action `updateRolePermissions('owner', ...)` | Rejected with safety error | **PASS** |
| **IDOR-001** | IDOR Security | Customer attempts download of other artwork | Server Action `createArtworkSignedUrl(otherId)` | Rejected with Access Denied | **PASS** |
| **IDOR-002** | IDOR Security | Customer attempts cancellation of other order | Server Action `requestCancelDatabaseOrder(otherId)` | Rejected with Access Denied | **PASS** |
| **PAY-001** | Payment Security | Client sends forged signature | POST `/api/payments/razorpay/verify` | HMAC-SHA256 signature verification fails (400) | **PASS** |
| **PAY-002** | Payment Security | Client claims incorrect total amount | POST `/api/payments/razorpay/create-order` | Recalculated server total mismatch rejected (400) | **PASS** |
| **PAY-003** | Payment Security | Duplicate Razorpay webhook delivered | POST `/api/webhooks/razorpay` | Checked against `webhook_events` table (200 OK duplicate) | **PASS** |
| **PAY-004** | Refund Security | Attempt refund greater than captured amount | Server Action `processPaymentRefund` | Rejected with exceeded refundable balance error | **PASS** |
| **PAY-005** | Refund Security | Re-submitting identical refund request | Server Action `processPaymentRefund` (same key) | Idempotent response returned, no double charge | **PASS** |
| **RBAC-001** | Privilege Safety | User attempts to modify their own role | Server Action / DB trigger | Blocked by `protect_profile_role` | **PASS** |
| **ORDER-001**| Order Lifecycle | Customer attempts cancel on dispatched order| Server Action `requestCancelDatabaseOrder` | Blocked: only pre-production orders cancellable | **PASS** |
| **PRICE-001**| Pricing Engine | Client tampers with tier or variant price | POST `/api/payments/razorpay/create-order` | Server recomputes price from DB catalogue | **PASS** |
| **BUILD-001**| Production Build | Full TypeScript compilation & Next.js bundle | `npx tsc --noEmit && npm run build` | 0 errors across 42 static & dynamic routes | **PASS** |
