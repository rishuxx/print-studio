import * as React from "react";
import { StorefrontSettingsRecord, BusinessHourRecord } from "@/lib/business-settings/types";
import {
  updateStorefrontSettingsAction,
  updateBusinessHoursAction,
} from "@/lib/business-settings/mutations";
import { toast } from "sonner";
import { Clock, Megaphone, Save, RefreshCw } from "lucide-react";

interface StorefrontHoursTabProps {
  initialStorefront: StorefrontSettingsRecord;
  initialHours: BusinessHourRecord[];
  onStorefrontSaved: (updated: StorefrontSettingsRecord) => void;
  onHoursSaved: (updated: BusinessHourRecord[]) => void;
}

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function StorefrontHoursTab({
  initialStorefront,
  initialHours,
  onStorefrontSaved,
  onHoursSaved,
}: StorefrontHoursTabProps) {
  const [storefrontData, setStorefrontData] = React.useState<StorefrontSettingsRecord>(initialStorefront);
  const [hoursData, setHoursData] = React.useState<BusinessHourRecord[]>(initialHours);
  const [isSavingStorefront, setIsSavingStorefront] = React.useState(false);
  const [isSavingHours, setIsSavingHours] = React.useState(false);

  const handleSaveStorefront = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingStorefront(true);
    try {
      const res = await updateStorefrontSettingsAction(storefrontData);
      if (res.success) {
        toast.success("Storefront settings saved.");
        onStorefrontSaved(res.data);
      } else {
        toast.error(res.error || "Failed to update storefront settings.");
      }
    } catch {
      toast.error("Unexpected error occurred.");
    } finally {
      setIsSavingStorefront(false);
    }
  };

  const handleSaveHours = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingHours(true);
    try {
      const res = await updateBusinessHoursAction(hoursData);
      if (res.success) {
        toast.success("Weekly business hours saved.");
        onHoursSaved(res.data);
      } else {
        toast.error(res.error || "Failed to update business hours.");
      }
    } catch {
      toast.error("Unexpected error occurred.");
    } finally {
      setIsSavingHours(false);
    }
  };

  const updateHourItem = (dayIndex: number, updates: Partial<BusinessHourRecord>) => {
    setHoursData((prev) =>
      prev.map((h) => (h.day_of_week === dayIndex ? { ...h, ...updates } : h))
    );
  };

  return (
    <div className="space-y-8">
      {/* ── Storefront Announcement Section ───────────────────────── */}
      <form onSubmit={handleSaveStorefront} className="space-y-6">
        <div className="rounded-2xl border border-border/80 bg-white p-6 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-violet/10 text-violet">
              <Megaphone className="size-5" />
            </div>
            <div>
              <h3 className="font-display text-lg font-bold text-ink">Storefront Announcements & Support Banners</h3>
              <p className="text-xs text-muted-foreground">
                Display promo alerts, express turnaround highlights, or bulk quotation messaging at top of storefront.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border/80 bg-white p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between p-3.5 rounded-xl border border-border/80 bg-paper/30">
            <div className="space-y-0.5">
              <div className="text-xs font-bold text-ink">Enable Header Announcement Bar</div>
              <p className="text-[0.6875rem] text-muted-foreground">Renders promotional banner at the top of every storefront page.</p>
            </div>
            <input
              type="checkbox"
              checked={storefrontData.announcement_enabled}
              onChange={(e) => setStorefrontData((prev) => ({ ...prev, announcement_enabled: e.target.checked }))}
              className="size-4.5 rounded border-border text-violet focus:ring-violet"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-ink">Announcement Text</label>
            <input
              type="text"
              value={storefrontData.announcement_text || ""}
              onChange={(e) => setStorefrontData((prev) => ({ ...prev, announcement_text: e.target.value }))}
              placeholder="Fast local printing and express dispatch available on select custom products."
              className="w-full rounded-xl border border-border bg-paper/60 px-3.5 py-2.5 text-xs font-semibold text-ink focus:bg-white focus:border-violet focus:outline-none"
            />
          </div>

          <div className="space-y-1.5 pt-2">
            <label className="text-xs font-bold text-ink">Customer Support Note</label>
            <input
              type="text"
              value={storefrontData.support_message || ""}
              onChange={(e) => setStorefrontData((prev) => ({ ...prev, support_message: e.target.value }))}
              placeholder="Need custom bulk quotation? Our production studio team is available Mon–Sat."
              className="w-full rounded-xl border border-border bg-paper/60 px-3.5 py-2.5 text-xs font-semibold text-ink focus:bg-white focus:border-violet focus:outline-none"
            />
          </div>
        </div>

        <div className="flex items-center justify-between rounded-2xl border border-border/80 bg-white p-4 shadow-xs">
          <span className="font-mono text-[0.6875rem] text-muted-foreground">
            Storefront Policy: <code className="font-bold text-ink">v{storefrontData.version}</code>
          </span>
          <button
            type="submit"
            disabled={isSavingStorefront}
            className="inline-flex items-center gap-2 rounded-xl bg-violet px-5 py-2.5 text-xs font-bold text-white shadow-lift hover:bg-violet-lift transition-all disabled:opacity-50"
          >
            {isSavingStorefront ? <RefreshCw className="size-4 animate-spin" /> : <Save className="size-4" />}
            <span>{isSavingStorefront ? "Saving..." : "Save Storefront Banners"}</span>
          </button>
        </div>
      </form>

      {/* ── Business Hours Section ─────────────────────────────────── */}
      <form onSubmit={handleSaveHours} className="space-y-6">
        <div className="rounded-2xl border border-border/80 bg-white p-6 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-violet/10 text-violet">
              <Clock className="size-5" />
            </div>
            <div>
              <h3 className="font-display text-lg font-bold text-ink">Weekly Operating Hours & Studio Schedule</h3>
              <p className="text-xs text-muted-foreground">
                Set customer support and print facility operation windows across the 7 days of the week.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border/80 bg-white p-6 shadow-xs space-y-3">
          <div className="grid grid-cols-1 divide-y divide-border/60">
            {hoursData.map((hour) => {
              const dayName = DAY_NAMES[hour.day_of_week] || `Day ${hour.day_of_week}`;
              return (
                <div key={hour.day_of_week} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3 w-36">
                    <input
                      type="checkbox"
                      checked={hour.is_open}
                      onChange={(e) => updateHourItem(hour.day_of_week, { is_open: e.target.checked })}
                      className="size-4 rounded text-violet focus:ring-violet"
                    />
                    <span className="font-bold text-xs text-ink">{dayName}</span>
                  </div>

                  {hour.is_open ? (
                    <div className="flex items-center gap-2 text-xs">
                      <input
                        type="text"
                        pattern="^([01]\d|2[0-3]):([0-5]\d)$"
                        value={hour.open_time || "10:00"}
                        onChange={(e) => updateHourItem(hour.day_of_week, { open_time: e.target.value })}
                        className="w-24 rounded-lg border border-border bg-paper/60 px-2.5 py-1.5 font-mono text-xs text-center font-bold text-ink focus:bg-white focus:border-violet focus:outline-none"
                      />
                      <span className="text-muted-foreground font-mono">to</span>
                      <input
                        type="text"
                        pattern="^([01]\d|2[0-3]):([0-5]\d)$"
                        value={hour.close_time || "19:00"}
                        onChange={(e) => updateHourItem(hour.day_of_week, { close_time: e.target.value })}
                        className="w-24 rounded-lg border border-border bg-paper/60 px-2.5 py-1.5 font-mono text-xs text-center font-bold text-ink focus:bg-white focus:border-violet focus:outline-none"
                      />
                    </div>
                  ) : (
                    <span className="rounded-md bg-paper px-2.5 py-1 text-[0.6875rem] font-bold font-mono text-muted-foreground">
                      Closed for Operations
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex items-center justify-between rounded-2xl border border-border/80 bg-white p-4 shadow-xs">
          <span className="font-mono text-[0.6875rem] text-muted-foreground">
            Weekly Schedule: 7 days configured
          </span>
          <button
            type="submit"
            disabled={isSavingHours}
            className="inline-flex items-center gap-2 rounded-xl bg-violet px-5 py-2.5 text-xs font-bold text-white shadow-lift hover:bg-violet-lift transition-all disabled:opacity-50"
          >
            {isSavingHours ? <RefreshCw className="size-4 animate-spin" /> : <Save className="size-4" />}
            <span>{isSavingHours ? "Saving..." : "Save Operating Hours"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
