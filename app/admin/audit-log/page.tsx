import { requirePermission } from "@/lib/auth/server-permissions";
import { createClient } from "@/lib/supabase/server";
import { ShieldAlert, User, Calendar, Activity, Database as DbIcon, Info } from "lucide-react";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "System Audit Logs · Admin Command Center",
};

interface AuditLogPageProps {
  searchParams: Promise<{ action?: string; limit?: string }>;
}

async function fetchAuditLogs(limit: number = 50, actionFilter?: string) {
  const supabase = await createClient();
  let query = supabase
    .from("admin_audit_logs")
    .select(`
      id,
      actor_id,
      target_id,
      action,
      details,
      ip_address,
      created_at,
      actor:profiles!admin_audit_logs_actor_id_fkey(full_name, email, role)
    `)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (actionFilter) {
    query = query.eq("action", actionFilter);
  }

  const { data, error } = await query;
  if (error) {
    // If relation error occurs, fallback to unjoined query
    const { data: rawLogs } = await supabase
      .from("admin_audit_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);
    return rawLogs || [];
  }
  return data || [];
}

export default async function AdminAuditLogPage({ searchParams }: AuditLogPageProps) {
  await requirePermission("users.view", "/admin/audit-log");
  const params = await searchParams;
  const limit = params.limit ? parseInt(params.limit, 10) : 50;
  const logs = await fetchAuditLogs(limit, params.action);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">System Audit Trail</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Tamper-resistant log of security events, administrative mutations, and role modifications.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-violet/10 px-3 py-1 text-xs font-bold text-violet">
            <ShieldAlert className="size-3.5" />
            Immutable Log
          </span>
        </div>
      </div>

      <div className="rounded-2xl border border-border/80 bg-white overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border bg-paper/60 text-muted-foreground font-mono uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3.5 font-bold">Timestamp</th>
                <th className="px-6 py-3.5 font-bold">Actor</th>
                <th className="px-6 py-3.5 font-bold">Action</th>
                <th className="px-6 py-3.5 font-bold">Target ID</th>
                <th className="px-6 py-3.5 font-bold">Details / Payload</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                    <Info className="size-6 mx-auto mb-2 opacity-50" />
                    No audit records registered yet.
                  </td>
                </tr>
              ) : (
                logs.map((log: any) => {
                  const actor = log.actor;
                  return (
                    <tr key={log.id} className="hover:bg-paper/30 transition-colors">
                      <td className="px-6 py-4 font-mono text-[11px] text-muted-foreground whitespace-nowrap">
                        {new Date(log.created_at).toLocaleString("en-IN", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-semibold text-ink">
                          {actor?.full_name || log.actor_id?.slice(0, 8) || "System"}
                        </div>
                        <div className="text-[11px] text-muted-foreground">{actor?.email || log.actor_id}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-block px-2 py-0.5 rounded font-mono text-[10px] font-bold uppercase tracking-wider ${
                          log.action.includes("refund")
                            ? "bg-amber-100 text-amber-800"
                            : log.action.includes("role") || log.action.includes("staff")
                            ? "bg-violet/10 text-violet"
                            : log.action.includes("suspended")
                            ? "bg-rose-100 text-rose-800"
                            : "bg-paper text-ink"
                        }`}>
                          {log.action}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-mono text-[11px] text-muted-foreground whitespace-nowrap">
                        {log.target_id ? log.target_id.slice(0, 12) + "..." : "—"}
                      </td>
                      <td className="px-6 py-4 font-mono text-[11px] text-muted-foreground max-w-xs truncate">
                        {typeof log.details === "object" ? JSON.stringify(log.details) : String(log.details || "—")}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
