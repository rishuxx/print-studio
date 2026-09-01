# Production Observability & Incident Response Guide

**System:** Print Studio E-Commerce & Production Operating System  
**Document Version:** 1.0 (Phase 11B)  

---

## 1. Structured Logging Standards

The application implements structured server-side logging with request context:

```json
{
  "timestamp": "2026-09-01T20:30:00.000Z",
  "level": "info",
  "route": "/api/payments/razorpay/verify",
  "orderNumber": "PRT-2026-2945",
  "internalOrderId": "uuid-here",
  "providerPaymentId": "pay_OXYZ123456",
  "amountRupees": 1299.00,
  "status": "captured",
  "durationMs": 42
}
```

### Absolute Rules for Logging:
- **NEVER LOG:** Passwords, payment secrets, webhook secrets, full credit card numbers, or full raw customer PII.
- **ALWAYS LOG:** Order references, payment transition codes, refund IDs, webhook event IDs, and carrier waybills (AWB).

---

## 2. Real-Time Operational Monitoring

### Key Performance Indicators (KPIs) to Track:
1. **Payment Verification Failure Rate:** Normal: < 0.5%. Alert threshold: > 2% in 15 minutes.
2. **Webhook Idempotency & Latency:** Ensure incoming webhooks process in < 500ms.
3. **Database Health Response Time:** Ping `/api/health` should respond in < 150ms.
4. **Logistics Serviceability Latency:** Real-time Delhivery PIN query latency should remain < 400ms.

---

## 3. Incident Response Protocol

```text
ALERT DETECTED
  ↓
1. TRIAGE & ASSIGN (Determine SEV-1 to SEV-4)
  ↓
2. CONTAIN (Pause affected module / enable maintenance mode if financial or data corruption risk)
  ↓
3. DIAGNOSE & ROOT CAUSE (Inspect server logs, Supabase query logs, and Razorpay event logs)
  ↓
4. REMEDIATE (Deploy forward-fix / apply PITR recovery / rotate credentials)
  ↓
5. VERIFY (Run E2E smoke tests and health check)
  ↓
6. POSTMORTEM (Document root cause, impact duration, and preventive measures)
```

---

## 4. Operational Runbooks for Admin Staff

### Unreconciled Payment Resolution:
1. Navigate to **Admin Console -> Payments (`/admin/payments`)**.
2. Filter by status `pending` or reconciliation state `discrepancy`.
3. Verify transaction against Razorpay Gateway Dashboard.
4. If payment was captured at bank but webhook dropped, trigger administrative manual reconciliation.

### Stuck Order Dispatch:
1. Navigate to **Admin Console -> Shipping (`/admin/shipping`)**.
2. Filter by `unassigned` or `manifest_failed`.
3. Re-evaluate destination PIN serviceability or reassign to secondary partner (Shiprocket / Blue Dart).
