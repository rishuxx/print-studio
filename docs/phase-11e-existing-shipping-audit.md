# PHASE 11E — EXISTING SHIPPING ARCHITECTURE & INTEGRATION AUDIT

**System:** PreetyPrints Production E-Commerce & Print Fulfilment Platform  
**Audit Date:** September 1, 2026  
**Primary Carrier Target:** Delhivery Express & Surface (Official REST APIs)  
**Status:** **IN PROGRESS — PHASE 11E IMPLEMENTATION**

---

## 1. Existing Shipping Architecture Summary

The existing repository already has a robust foundation for shipping and logistics orchestration under `lib/shipping/`:

1. **Carrier Adapter Registry (`lib/shipping/carriers/`):**
   - Implements `CarrierAdapter` interface with `createShipment()` and `trackShipment()` methods.
   - Adapters exist for `DelhiveryCarrierAdapter`, `ShiprocketCarrierAdapter`, and sandbox `FakeCarrierAdapter`.
2. **Authoritative Server Mutations (`lib/shipping/mutations.ts`):**
   - `createOrderShipmentAction()`: Validates administrative RBAC permissions, ensures order exists, enforces partner immutability once assigned, performs serviceability check, calls carrier adapter, writes authoritative `shipping_shipments` record, and inserts the initial timeline event.
   - `refreshShipmentTrackingAction()`: Fetches shipment by ID, polls carrier tracking API, deduplicates scan events via SHA-256 raw payload hashes, and updates canonical status.
3. **Pincode Serviceability & Dynamic Rating (`lib/shipping/serviceability.ts`):**
   - Supports both static high-speed matrix lookup and live Delhivery Gateway API querying (`https://track.delhivery.com/c/api/pin-codes/json/?filter_codes=...`).
   - Retrieves live prepaid/COD eligibility, ODA (Out of Delivery Area) flags, district/state mapping, and freight estimates.
4. **Push Webhook Integration (`app/api/webhooks/delhivery/route.ts`):**
   - Listens for Delhivery push scan updates.
   - Computes SHA-256 payload hash for idempotency.
   - Maps raw Delhivery scan statuses (`DL`, `OFD`, `UD`, `PU`, `RTO`, `NDR`) to canonical internal statuses.
   - Updates `shipping_shipments` and appends customer-visible timeline milestones.
5. **Customer & Admin UIs:**
   - Public Consignment Tracking: `/track/[trackingToken]` (cryptographically signed/secure tracking).
   - Customer Order Details Timeline: `/orders/[orderId]` and `/account`.
   - Admin Logistics Command: `/admin/shipping` (filter by date, status, carrier, search AWB/order, view KPIs).

---

## 2. Identified Enhancements for Phase 11E

1. **Environment Separation (Staging vs Production):**
   - Support `DELHIVERY_ENV=staging|production` with dedicated endpoints (`https://staging-express.delhivery.com` vs `https://track.delhivery.com`).
2. **Label Generation & Manifest Downloads:**
   - Provide dedicated server action for downloading/fetching shipping label barcodes.
3. **Pickup Request Orchestration:**
   - Add explicit `requestShipmentPickupAction()` to dispatch courier pickup requests to Delhivery after manifestation.
4. **Automated Shipping Invariant & Concurrency Test Suite:**
   - Create `lib/shipping-integration-test.ts` testing serviceability mapping, AWB uniqueness, webhook deduplication, and atomic concurrent shipment creation.
