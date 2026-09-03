# Resolutions Architecture Guide

## 1. Domain Overview
The Resolutions domain manages post-delivery customer complaints, defects, transit damages, and short quantities for PreetyPrints custom print products.

## 2. Entities
- `resolution_requests`: Main ticket entity (`RES-2026-XXXXXX`).
- `resolution_request_items`: Claimed vs approved quantities per order item.
- `resolution_evidence`: Secured customer upload files (photographs of defects, scans).
- `credit_ledger`: Auditable store credit ledger entries.

## 3. Operations Flow
1. **Customer Submission**: Customer reports an issue from `/orders/[orderId]`.
2. **Server Eligibility**: Evaluated in `lib/resolutions/eligibility.ts`.
3. **Admin Review**: Reviewed in `/admin/resolutions` and `/admin/resolutions/[resolutionId]`.
4. **Action Execution**:
   - **Gateway Refund**: Invokes `processPaymentRefund()` in `lib/payments/refunds.ts`.
   - **Replacement**: Spawns urgent manufacturing job via `spawnReplacementProductionJob()` in `lib/resolutions/replacement-orchestrator.ts`.
   - **Rejection**: Requires explicit customer-visible justification.
