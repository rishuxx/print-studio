import * as React from "react";
import { Lock, Building2, Globe2, Layers, Cpu } from "lucide-react";

export function LockedFeaturesTab() {
  const lockedModules = [
    {
      title: "Multi-Store & Franchise Tenancy",
      description: "Manage multiple retail print outlets, franchise inventories, and localized production dispatchers under one account.",
      icon: Building2,
      badge: "Enterprise Roadmap",
    },
    {
      title: "Multi-Region & International Tax Engine",
      description: "Automated VAT, cross-border customs declarations, and real-time forex multi-currency invoicing.",
      icon: Globe2,
      badge: "Phase 12 Preview",
    },
    {
      title: "B2B Corporate Wholesale Portals",
      description: "Dedicated corporate client procurement logins with negotiated custom rate cards and net-30 credit terms.",
      icon: Layers,
      badge: "Enterprise Roadmap",
    },
    {
      title: "Automated ERP & MIS Webhook Dispatchers",
      description: "Direct REST/GraphQL webhook feeds syncing press job runs directly with Heidelberg / HP Indigo print RIP servers.",
      icon: Cpu,
      badge: "Enterprise Roadmap",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="rounded-2xl border border-border/80 bg-white p-6 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-violet/10 text-violet">
            <Lock className="size-5" />
          </div>
          <div>
            <h3 className="font-display text-lg font-bold text-ink">Advanced Enterprise Architecture</h3>
            <p className="text-xs text-muted-foreground">
              Advanced multi-region, multi-store, and automated print shop ERP integrations reserved for future enterprise releases.
            </p>
          </div>
        </div>
      </div>

      {/* Grid of Locked Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {lockedModules.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              className="relative flex flex-col justify-between rounded-2xl border border-border/80 bg-paper/30 p-5 space-y-4 opacity-90 hover:opacity-100 transition-opacity"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex size-9 items-center justify-center rounded-xl bg-paper text-muted-foreground">
                    <Icon className="size-4.5" />
                  </div>
                  <span className="rounded-md border border-violet/20 bg-violet-wash/50 px-2 py-0.5 font-mono text-[0.625rem] font-bold text-violet uppercase tracking-wider">
                    {item.badge}
                  </span>
                </div>

                <div>
                  <h4 className="font-display text-sm font-bold text-ink">{item.title}</h4>
                  <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{item.description}</p>
                </div>
              </div>

              <div className="pt-3 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground font-mono">
                <span className="flex items-center gap-1">
                  <Lock className="size-3 text-muted-foreground" />
                  <span>Reserved for Future Release</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
