export interface AdminHelpSection {
  title: string;
  description: string;
  sections: Array<{
    heading: string;
    content: string | string[];
    variant?: "default" | "warning" | "tip" | "danger";
  }>;
}

export const ADMIN_HELP_REGISTRY: Record<string, AdminHelpSection> = {
  "/admin": {
    title: "Executive Business Dashboard",
    description: "Real-time key performance indicators, active operational press load, and financial revenue summaries.",
    sections: [
      {
        heading: "What the numbers mean",
        content: [
          "• Total Orders: Count of all lifetime customer orders placed in PostgreSQL.",
          "• Paid Revenue: Total collected & settled INR funds from captured payments (minus refunds).",
          "• In Production: Count of orders currently undergoing pre-press, offset printing, or quality check.",
          "• Delivered: Total orders fulfilled and confirmed received by customers.",
        ],
      },
      {
        heading: "Financial Invariant",
        variant: "tip",
        content: "Gross order values are NOT counted as revenue until the payment is authoritatively captured by Razorpay.",
      },
    ],
  },
  "/admin/orders": {
    title: "Orders Console & Milestone Dispatcher",
    description: "Manage printing jobs, inspect customer/delivery snapshots, review uploaded artwork proofs, and advance production lifecycle milestones.",
    sections: [
      {
        heading: "Production Milestone Workflow",
        content: [
          "1. Pending: Order placed by customer, awaiting initial confirmation.",
          "2. Confirmed & Artwork Review: Design files are checked for 300 DPI resolution, bleed, and safe margins.",
          "3. Proof Pending / Approved: Digital PDF proof shared with customer for sign-off.",
          "4. In Production & Quality Check: Print job is running on offset/digital press.",
          "5. Ready, Shipped & Delivered: Logistics dispatch and tracking updates.",
        ],
      },
      {
        heading: "Operational Rule",
        variant: "warning",
        content: "Never advance an order to In Production until payment has been confirmed captured and artwork proof is approved.",
      },
    ],
  },
  "/admin/payments": {
    title: "Payments & Gateway Reconciliation",
    description: "Live Razorpay transaction audit, automated discrepancy detector, idempotent webhook log, and administrative refund dispatcher.",
    sections: [
      {
        heading: "Payment vs Order Lifecycle",
        content: "Payment status represents money movement (Captured, Pending, Failed, Refunded), while Order status represents manufacturing state (In Production, Ready, Shipped). They are kept strictly separate.",
      },
      {
        heading: "Gateway Refund Rules",
        variant: "warning",
        content: [
          "• Full & Partial refunds call Razorpay's server API using unique idempotency keys.",
          "• Refundable balance = Gross Captured Amount minus all prior refunds.",
          "• In Test Mode, refunds simulate real financial transactions against Razorpay's staging environment.",
        ],
      },
      {
        heading: "Automated Reconciliation",
        variant: "tip",
        content: "Click 'Reconcile Gateway' to cross-verify database payment totals with Razorpay's live servers to detect any amounts or status mismatches.",
      },
    ],
  },
  "/admin/products": {
    title: "Products & Catalogue Management",
    description: "Manage printing items, SKU codes, minimum order quantities (MOQ), turnarounds, and publishing status.",
    sections: [
      {
        heading: "Product Lifecycle Meaning",
        content: [
          "• Draft: Product exists in admin but is not customer-visible on the live store.",
          "• Active: Published live and available for customers to order.",
          "• Paused: Temporarily hidden from customer ordering without removing configuration.",
          "• Archived: Retired product. Historical orders retain their full product snapshot permanently.",
        ],
      },
      {
        heading: "SKU & Slug Rules",
        variant: "tip",
        content: "Every product must have a unique, uppercase SKU (e.g. PRT-VC-001) and URL slug (e.g. standard-visiting-cards).",
      },
    ],
  },
  "/admin/categories": {
    title: "Categories & Navigation Hierarchy",
    description: "Manage storefront categories, mega-menu groups, and homepage quick strips.",
    sections: [
      {
        heading: "Archival Safeguard",
        variant: "warning",
        content: "Archiving a category hides it from the customer navigation menu but will NEVER delete or orphan the products assigned to it.",
      },
    ],
  },
  "/admin/pricing": {
    title: "Pricing Engine & Promotion System",
    description: "Authoritative base pricing, quantity tier bulk discounts, scheduled sales, and margin protections.",
    sections: [
      {
        heading: "Status Legend & Campaign Lifecycle",
        content: [
          "• Active (Green): The campaign is live right now on the customer storefront. Eligible discounts are automatically applied in the cart.",
          "• Paused (Slate/Grey): The campaign is temporarily deactivated without deleting its settings. Customers will not receive this discount until reactivated.",
          "• Scheduled (Blue): Future campaign that will automatically trigger once its start date/time (IST) arrives.",
          "• Expired (Amber): The campaign has passed its designated end time.",
        ],
      },
      {
        heading: "Rule Precedence Pipeline",
        content: [
          "1. Base Price: Standard rate per unit configured in the active Price Book.",
          "2. Quantity Tiers: Volume discount breaks (e.g. 500+ cards receive 15% bulk discount).",
          "3. Active Sale Price: Time-windowed promotional discounts in Asia/Kolkata timezone.",
          "4. Coupon / Automatic Promo: Evaluated for stacking vs exclusivity rules.",
          "5. Margin Floor: Enforces that final prices never drop below the minimum required profit floor.",
        ],
      },
      {
        heading: "Storefront Sale Announcement Ribbon",
        variant: "tip",
        content: "Any active campaign with an optional Coupon Code automatically broadcasts across the top announcement banner of the live storefront to drive customer conversions.",
      },
      {
        heading: "Financial Invariant",
        variant: "warning",
        content: "All currency calculations occur on the server in integer paise (₹1 = 100 paise) to prevent floating point inaccuracies during Razorpay checkout.",
      },
    ],
  },
  "/admin/customers": {
    title: "Customer Directory & CRM Command",
    description: "Manage retail, guest, and corporate B2B customer accounts, address books, internal staff notes, and DPDP privacy requests.",
    sections: [
      {
        heading: "Customer vs. Guest Accounts",
        content: [
          "• Registered Customer: Authenticated user with email/phone verification, saved addresses, and unified order history.",
          "• Guest Customer: Single-checkout customer linked by normalized email or phone without an active password account.",
        ],
      },
      {
        heading: "Account Status States",
        content: [
          "• Active: In good standing, able to order and checkout.",
          "• Restricted: Limited permissions (e.g., checkout disabled for credit review).",
          "• Suspended: Blocked from placing orders or logging in due to risk/fraud flags.",
          "• Anonymized: PII scrubbed under DPDP privacy regulations while preserving legal financial invoices.",
        ],
      },
      {
        heading: "Financial Immutability Safeguard",
        variant: "tip",
        content: "Orders and payments remain the immutable source of truth. Customer statistics (LTV, AOV) are computed from real historical transactions and will never drift or corrupt financial records.",
      },
    ],
  },
};
