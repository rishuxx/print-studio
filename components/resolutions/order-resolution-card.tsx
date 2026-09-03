"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  RotateCcw,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileText,
  ShieldCheck,
  Package,
  Eye,
  PlusCircle,
} from "lucide-react";
import type { ResolutionRequestRecord, EligibilityResult } from "@/lib/resolutions/types";
import { ResolutionRequestModal } from "./resolution-request-modal";
import { evaluateResolutionEligibility } from "@/lib/resolutions/eligibility";

interface OrderResolutionCardProps {
  orderId: string;
  orderNumber: string;
  orderStatus: string;
  items: Array<{ id: string; product_title: string; quantity: number }>;
  existingResolution?: ResolutionRequestRecord | null;
  onRefresh?: () => void;
}

export function OrderResolutionCard({
  orderId,
  orderNumber,
  orderStatus,
  items,
  existingResolution,
  onRefresh,
}: OrderResolutionCardProps) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  // Check if resolution is active or already exists
  const hasActiveResolution = Boolean(existingResolution);

  return (
    <div className="rounded-2xl border border-border bg-white p-6 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <RotateCcw className="size-4 text-violet" />
          <h2 className="font-bold text-sm text-ink uppercase font-mono tracking-wider">
            Returns, Replacements & Issue Resolution
          </h2>
        </div>

        {hasActiveResolution && existingResolution && (
          <span className="inline-flex items-center gap-1 rounded-full bg-violet/10 border border-violet/20 px-2.5 py-0.5 text-xs font-mono font-bold text-violet uppercase">
            #{existingResolution.requestNumber} • {existingResolution.status.replace(/_/g, " ")}
          </span>
        )}
      </div>

      {hasActiveResolution && existingResolution ? (
        <div className="space-y-3 text-xs">
          <div className="rounded-xl border border-border/80 bg-paper/30 p-4 space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="font-bold text-ink text-sm">
                  {existingResolution.type.replace(/_/g, " ").toUpperCase()}
                </span>
                <span className="rounded bg-paper border border-border px-2 py-0.5 text-[10px] font-mono text-muted-foreground uppercase">
                  Reason: {existingResolution.reasonCode.replace(/_/g, " ")}
                </span>
              </div>
              <span className="text-[11px] font-mono text-muted-foreground">
                Submitted: {new Date(existingResolution.requestedAt).toLocaleDateString("en-IN")}
              </span>
            </div>

            <p className="text-muted-foreground leading-relaxed">
              <strong className="text-ink">Reported Issue:</strong> {existingResolution.customerDescription}
            </p>

            {existingResolution.customerDecisionNotes && (
              <div className="rounded-lg border border-emerald-200 bg-emerald-50/60 p-3 text-emerald-900 mt-2">
                <strong className="block font-bold mb-0.5">Studio Decision:</strong>
                <span>{existingResolution.customerDecisionNotes}</span>
              </div>
            )}
          </div>

          {/* Affected Items List */}
          {existingResolution.items && existingResolution.items.length > 0 && (
            <div className="border border-border/70 rounded-xl p-3 bg-paper/20 space-y-1.5">
              <span className="font-bold text-[11px] font-mono uppercase text-muted-foreground">
                Affected Print Items
              </span>
              <div className="divide-y divide-border/50">
                {existingResolution.items.map((i) => (
                  <div key={i.id} className="py-1.5 flex items-center justify-between text-xs">
                    <span className="text-ink font-medium">{i.productTitle}</span>
                    <span className="font-mono text-muted-foreground">
                      {i.requestedQuantity} Units Claimed ({i.decision})
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-border bg-paper/40 p-5 text-center space-y-3 text-xs">
          <p className="text-muted-foreground max-w-md mx-auto leading-relaxed">
            Received damaged goods, printing defects, or missing units? Custom print products are fully protected under our Studio Quality Warranty.
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-violet px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-violet/90 transition-colors"
          >
            <RotateCcw className="size-3.5" />
            Report Issue / Request Resolution
          </button>
        </div>
      )}

      {/* Submission Modal */}
      <ResolutionRequestModal
        orderId={orderId}
        orderNumber={orderNumber}
        items={items}
        isCustomProduct={true}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          onRefresh?.();
          router.refresh();
        }}
      />
    </div>
  );
}
