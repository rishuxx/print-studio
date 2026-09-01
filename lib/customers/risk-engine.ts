/**
 * Production Behavioral Risk Engine & Customer Health Scorer
 *
 * Implements transparent, multi-dimensional heuristic rules to dynamically compute:
 * 1. Customer Health Score (0 - 1000)
 * 2. Risk Status ('normal' | 'review' | 'elevated' | 'blocked')
 * 3. Behavioral Factor Breakdown (reasons, trust badges, risk warnings)
 */

export interface RiskEvaluationFactors {
  orderCompletionRate: number; // 0 to 1
  cancellationRate: number; // 0 to 1
  failedPaymentCount: number;
  totalOrders: number;
  completedOrders: number;
  lifetimeValueRupees: number;
  hasB2BProfile: boolean;
  hasGstin: boolean;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  accountAgeDays: number;
  daysSinceLastActive: number;
  hasMultipleAddresses: boolean;
  isManuallyBlockedOrRestricted?: boolean;
}

export interface RiskEvaluationResult {
  score: number; // 0 to 1000
  status: "normal" | "review" | "elevated" | "blocked";
  reasons: string[];
  positiveFactors: string[];
  riskFactors: string[];
}

export function evaluateCustomerRisk(factors: RiskEvaluationFactors): RiskEvaluationResult {
  if (factors.isManuallyBlockedOrRestricted) {
    return {
      score: 50,
      status: "blocked",
      reasons: ["Account flagged or restricted by administrative command"],
      positiveFactors: [],
      riskFactors: ["Manual Admin Restriction"],
    };
  }

  // 1. Starting Baseline
  let score = 500;
  const reasons: string[] = [];
  const positiveFactors: string[] = [];
  const riskFactors: string[] = [];

  // 2. Identity & Verification Trust (+150 max)
  if (factors.isEmailVerified) {
    score += 75;
    positiveFactors.push("Verified email address");
  } else {
    riskFactors.push("Unverified email");
  }

  if (factors.isPhoneVerified) {
    score += 75;
    positiveFactors.push("Verified phone number");
  }

  // 3. Business / B2B Commercial Trust (+150 max)
  if (factors.hasB2BProfile) {
    score += 80;
    positiveFactors.push("Corporate B2B account registration");
    if (factors.hasGstin) {
      score += 70;
      positiveFactors.push("Valid GSTIN business tax registration");
    }
  }

  // 4. Order & Fulfillment History (+250 max or -300 penalty)
  if (factors.totalOrders > 0) {
    if (factors.completedOrders > 0) {
      // Reward each completed order up to 10 orders
      const orderBonus = Math.min(150, factors.completedOrders * 15);
      score += orderBonus;
      positiveFactors.push(`${factors.completedOrders} successfully fulfilled orders (+${orderBonus} pts)`);
    }

    // High cancellation / rejection penalty
    if (factors.cancellationRate > 0.5 && factors.totalOrders >= 2) {
      const penalty = Math.round(factors.cancellationRate * 180);
      score -= penalty;
      riskFactors.push(`High order cancellation rate (${Math.round(factors.cancellationRate * 100)}%) (-${penalty} pts)`);
    }

    // Failed payments penalty
    if (factors.failedPaymentCount > 0) {
      const penalty = Math.min(200, factors.failedPaymentCount * 50);
      score -= penalty;
      riskFactors.push(`${factors.failedPaymentCount} failed payment attempt(s) (-${penalty} pts)`);
    }
  } else {
    // New customer without orders yet
    reasons.push("New customer profile — baseline observation period");
  }

  // 5. Lifetime Value / Commercial Volume (+100 max)
  if (factors.lifetimeValueRupees >= 10000) {
    score += 100;
    positiveFactors.push("High Lifetime Value Tier (> ₹10,000 spend)");
  } else if (factors.lifetimeValueRupees >= 2000) {
    score += 50;
    positiveFactors.push("Established spending record (> ₹2,000 spend)");
  }

  // 6. Account Longevity & Consistency (+50 max)
  if (factors.accountAgeDays >= 30) {
    score += 30;
    positiveFactors.push(`Tenured member (${factors.accountAgeDays} days registered)`);
  }

  // 7. Clamp score to 0 - 1000
  score = Math.max(0, Math.min(1000, score));

  // 8. Determine Risk Level Status
  let status: "normal" | "review" | "elevated" | "blocked" = "normal";

  if (score < 300) {
    status = "blocked";
  } else if (score < 550) {
    status = "elevated";
  } else if (score < 700) {
    status = "review";
  } else {
    status = "normal";
  }

  return {
    score,
    status,
    reasons,
    positiveFactors,
    riskFactors,
  };
}
