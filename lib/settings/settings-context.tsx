"use client";

import * as React from "react";
import type { DatabaseBusinessSettings } from "@/lib/settings/types";
import { DEFAULT_BUSINESS_SETTINGS } from "@/lib/settings/constants";
import { createClient } from "@/lib/supabase/client";

const SettingsContext = React.createContext<DatabaseBusinessSettings>(DEFAULT_BUSINESS_SETTINGS);

interface SettingsProviderProps {
  initialSettings: DatabaseBusinessSettings;
  children: React.ReactNode;
}

/**
 * Provides live reactive business settings across the entire application.
 * Automatically synchronizes with Supabase Realtime so changes made in /admin/settings
 * reflect across all open storefront tabs instantly without manual page refreshes.
 */
export function SettingsProvider({ initialSettings, children }: SettingsProviderProps) {
  const [settings, setSettings] = React.useState<DatabaseBusinessSettings>(initialSettings);

  React.useEffect(() => {
    const supabase = createClient();

    // Listen for Realtime updates on business_settings table
    const channel = supabase
      .channel("realtime-business-settings")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "business_settings",
        },
        (payload) => {
          if (payload.new && typeof payload.new === "object") {
            setSettings(payload.new as DatabaseBusinessSettings);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <SettingsContext.Provider value={settings}>
      {children}
    </SettingsContext.Provider>
  );
}

/**
 * Hook to consume live reactive business settings anywhere in the client.
 */
export function useStoreSettings(): DatabaseBusinessSettings {
  const ctx = React.useContext(SettingsContext);
  return ctx || DEFAULT_BUSINESS_SETTINGS;
}
