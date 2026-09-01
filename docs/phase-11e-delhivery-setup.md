# HOW TO TEST DELHIVERY SHIPPING (STAGING & PRODUCTION UAT GUIDE)

Follow this step-by-step testing workflow to test your Delhivery shipping integration on **Staging** and **Production**.

---

## 1. Automated Test Verification (Instant CLI Verification)

Run the automated shipping integration test suite:

```bash
npx tsx lib/shipping-integration-test.ts
```

### What this automatically checks:
- **Pincode Serviceability:** Checks valid PINs (e.g., `248007`, `400001`) vs invalid PINs (`000000`).
- **Environment Gateway Routing:** Ensures calls route to `staging-express.delhivery.com` in staging.
- **Webhook Deduplication:** Tests identical scan payloads through SHA-256 fingerprinting.
- **Atomic Manifestation Lock:** Tests 3 concurrent shipment calls to ensure exactly 1 AWB is created.
- **Pickup State Machine:** Verifies courier pickup is only allowable from `manifested` status.

---

## 2. End-to-End Visual Testing in Admin Console

### Step A: Start Development Server
```bash
npm run dev
```

### Step B: Open Admin Shipping Console
1. Navigate to `http://localhost:3000/admin/shipping`.
2. Inspect the **KPI Dashboard** (Total Shipments, Manifested, In Transit, Out for Delivery, Delivered, NDR, RTO).
3. Select an order in `paid` or `in_production` status and click **"Create Shipment"** with Delhivery Express.
4. Verify that:
   - AWB is assigned and locked.
   - Initial tracking milestone (*"Waybill generated and consignment manifested with courier partner"*) appears on the timeline.
   - Carrier assignment becomes permanently locked (cannot be overwritten).

### Step C: Test Courier Pickup Request
1. On the manifested shipment, click **"Request Pickup"**.
2. Verify status transitions to `picked_up` and a pickup reference is returned.

### Step D: Test Tracking Refresh
1. Click **"Refresh Tracking"**.
2. Verify the carrier API is polled and new scans are appended idempotently without duplicating old scans.

---

## 3. Customer Storefront & Public Tracking Testing

1. Open `http://localhost:3000/track/[trackingToken]` (or check your customer order page `/orders/[orderId]`).
2. Verify:
   - Customer sees clean milestones (**Order Placed** $\rightarrow$ **Packed** $\rightarrow$ **Picked Up** $\rightarrow$ **In Transit** $\rightarrow$ **Out for Delivery** $\rightarrow$ **Delivered**).
   - Sensitive internal error codes, staff notes, and private carrier credentials are never shown to the customer.

---

## 4. Webhook Ingestion Testing

Simulate a Delhivery push scan webhook by sending a `POST` request to:
`http://localhost:3000/api/webhooks/delhivery`

Sample JSON payload:
```json
{
  "Shipment": {
    "AWB": "DLV-248007-123456",
    "Status": {
      "Status": "OUT FOR DELIVERY",
      "StatusDateTime": "2026-09-01T14:30:00Z",
      "StatusLocation": "Dehradun Hub",
      "Instructions": "Courier executive assigned for delivery"
    }
  }
}
```

Verify that:
- Endpoint returns `{ success: true }` with HTTP 200.
- Shipment status updates to `out_for_delivery`.
- Replaying the exact same webhook returns `{ success: true, message: "Duplicate webhook ignored (idempotent)" }` without mutating the database twice.

---

## 5. Production UAT (When Ready for Real ₹500 Delivery Test)

When you receive your live credentials from Delhivery:
1. Update `.env.local`:
   ```env
   DELHIVERY_ENV=production
   DELHIVERY_API_TOKEN=your_live_production_token_here
   DELHIVERY_PICKUP_LOCATION="PreetyPrints Production Facility"
   ```
2. In Delhivery Dashboard, set your push webhook URL to:
   `https://preetyprints.com/api/webhooks/delhivery`
3. Manifest one real low-value order and request physical courier pickup.
