"use client";

import { useState } from "react";
import {
  WhatsAppConfigRecord,
  WhatsAppTemplateRecord,
  WhatsAppTriggerRecord,
  WhatsAppOutboxRecord,
  WhatsAppMetricsSummary,
} from "@/lib/whatsapp/types";
import {
  saveWhatsAppConfigAction,
  testWhatsAppConnectionAction,
  sendWhatsAppTestAction,
  updateWhatsAppTriggerAction,
  retryWhatsAppOutboxMessageAction,
  resendWhatsAppOutboxMessageAction,
} from "@/lib/whatsapp/actions";
import { renderTemplatePreview } from "@/lib/whatsapp/variables";
import { maskPhoneNumber } from "@/lib/whatsapp/phone";
import {
  MessageSquare,
  KeyRound,
  FileCode2,
  Zap,
  ListFilter,
  Send,
  CheckCircle2,
  XCircle,
  RotateCw,
  ShieldCheck,
  Smartphone,
  ChevronRight,
  Info,
} from "lucide-react";
import { toast } from "sonner";

interface Props {
  initialConfig: WhatsAppConfigRecord;
  initialTemplates: WhatsAppTemplateRecord[];
  initialTriggers: WhatsAppTriggerRecord[];
  initialLogs: WhatsAppOutboxRecord[];
  initialLogsCount: number;
  initialMetrics: WhatsAppMetricsSummary;
}

export function WhatsAppDashboardContainer({
  initialConfig,
  initialTemplates,
  initialTriggers,
  initialLogs,
  initialMetrics,
}: Props) {
  const [activeTab, setActiveTab] = useState<"overview" | "templates" | "triggers" | "logs" | "test">("overview");

  // State
  const [config, setConfig] = useState<WhatsAppConfigRecord>(initialConfig);
  const [templates] = useState<WhatsAppTemplateRecord[]>(initialTemplates);
  const [triggers, setTriggers] = useState<WhatsAppTriggerRecord[]>(initialTriggers);
  const [logs, setLogs] = useState<WhatsAppOutboxRecord[]>(initialLogs);
  const [metrics] = useState<WhatsAppMetricsSummary>(initialMetrics);

  // Settings form state
  const [isEnabled, setIsEnabled] = useState(initialConfig.is_enabled);
  const [phoneNumberId, setPhoneNumberId] = useState(initialConfig.phone_number_id || "");
  const [businessAccountId, setBusinessAccountId] = useState(initialConfig.business_account_id || "");
  const [apiVersion, setApiVersion] = useState(initialConfig.api_version || "v20.0");
  const [newAccessToken, setNewAccessToken] = useState("");
  const [defaultCountryCode, setDefaultCountryCode] = useState(initialConfig.default_country_code || "91");
  const [isSavingConfig, setIsSavingConfig] = useState(false);

  // Test Connection state
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [connectionResult, setConnectionResult] = useState<{
    tested: boolean;
    success: boolean;
    verifiedName?: string;
    displayPhoneNumber?: string;
    qualityRating?: string;
    error?: string;
  } | null>(null);

  // Test Message Console state
  const [testTemplateKey, setTestTemplateKey] = useState(initialTemplates[0]?.key || "ORDER_CONFIRMED");
  const [testPhone, setTestPhone] = useState("");
  const [testVariables, setTestVariables] = useState<Record<string, string>>({
    CUSTOMER_NAME: "Rohan Sharma",
    ORDER_NUMBER: "PRT-2026-8841",
    ORDER_TOTAL: "1,499.00",
    PAYMENT_AMOUNT: "1,499.00",
    AWB_NUMBER: "DLH9928172645",
    CARRIER_NAME: "Delhivery Express",
    ARTWORK_REVIEW_URL: "https://preetyprints.com/orders/PRT-2026-8841#proof",
    ORDER_TRACKING_URL: "https://preetyprints.com/orders/PRT-2026-8841",
  });
  const [isSendingTest, setIsSendingTest] = useState(false);

  // Active Template Preview Selection
  const [selectedTemplateKey, setSelectedTemplateKey] = useState(initialTemplates[0]?.key || "ORDER_CONFIRMED");
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // Save Settings Handler
  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingConfig(true);

    try {
      const res = await saveWhatsAppConfigAction({
        isEnabled,
        phoneNumberId,
        businessAccountId,
        apiVersion,
        defaultCountryCode,
        newAccessToken: newAccessToken.trim() ? newAccessToken : undefined,
      });

      if (res.success) {
        toast.success("WhatsApp configuration saved successfully.");
        setConfig((prev) => ({
          ...prev,
          is_enabled: isEnabled,
          phone_number_id: phoneNumberId,
          business_account_id: businessAccountId,
          api_version: apiVersion,
          default_country_code: defaultCountryCode,
          token_masked: res.tokenMasked || prev.token_masked,
        }));
        setNewAccessToken("");
      } else {
        toast.error(res.error || "Failed to save configuration.");
      }
    } catch {
      toast.error("An unexpected error occurred.");
    } finally {
      setIsSavingConfig(false);
    }
  };

  // Test Connection Handler
  const handleTestConnection = async () => {
    setIsTestingConnection(true);
    setConnectionResult(null);

    try {
      const res = await testWhatsAppConnectionAction();
      setConnectionResult({
        tested: true,
        success: res.success,
        verifiedName: res.verifiedName,
        displayPhoneNumber: res.displayPhoneNumber,
        qualityRating: res.qualityRating,
        error: res.error,
      });

      if (res.success) {
        toast.success("Meta Cloud API connection verified successfully!");
        setConfig((prev) => ({
          ...prev,
          last_connection_status: "CONNECTED",
          last_tested_at: new Date().toISOString(),
          last_error_safe: null,
        }));
      } else {
        toast.error(res.error || "Meta API connection test failed.");
        setConfig((prev) => ({
          ...prev,
          last_connection_status: "INVALID_CREDENTIALS",
          last_tested_at: new Date().toISOString(),
          last_error_safe: res.error || null,
        }));
      }
    } catch {
      toast.error("Network or unexpected error testing connection.");
    } finally {
      setIsTestingConnection(false);
    }
  };

  // Send Test Message Handler
  const handleSendTestMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testPhone.trim()) {
      toast.error("Please enter a valid test recipient phone number.");
      return;
    }

    setIsSendingTest(true);
    try {
      const res = await sendWhatsAppTestAction({
        templateKey: testTemplateKey,
        recipientPhone: testPhone,
        testVariables,
      });

      if (res.success) {
        toast.success("Live test WhatsApp message sent through Meta API!");
      } else {
        toast.error(res.error || "WhatsApp API test failed. Make sure Meta credentials and approved templates are configured.");
      }
    } catch {
      toast.error("Error dispatching test message.");
    } finally {
      setIsSendingTest(false);
    }
  };

  // Toggle Trigger Handler
  const handleToggleTrigger = async (trigger: WhatsAppTriggerRecord) => {
    const nextState = !trigger.is_enabled;
    setTriggers((prev) => prev.map((t) => (t.id === trigger.id ? { ...t, is_enabled: nextState } : t)));

    const res = await updateWhatsAppTriggerAction({
      id: trigger.id,
      isEnabled: nextState,
      templateId: trigger.template_id,
      maxRetries: trigger.max_retries,
    });

    if (res.success) {
      toast.success(`Trigger '${trigger.event_type}' ${nextState ? "enabled" : "disabled"}.`);
    } else {
      toast.error(res.error || "Failed to update trigger.");
      setTriggers((prev) => prev.map((t) => (t.id === trigger.id ? { ...t, is_enabled: !nextState } : t)));
    }
  };

  // Retry Outbox Record Handler
  const handleRetryOutbox = async (id: string) => {
    setActionLoadingId(id);
    try {
      const res = await retryWhatsAppOutboxMessageAction(id);
      if (res.success) {
        toast.success("Message retry dispatched successfully.");
        setLogs((prev) => prev.map((l) => (l.id === id ? { ...l, status: "SENT", attempts: l.attempts + 1 } : l)));
      } else {
        toast.error(res.error || "Manual retry failed.");
      }
    } catch {
      toast.error("Retry execution error.");
    } finally {
      setActionLoadingId(null);
    }
  };

  // Resend Outbox Record Handler
  const handleResendOutbox = async (id: string) => {
    if (!confirm("This will dispatch a new WhatsApp notification to the customer. Proceed?")) {
      return;
    }

    setActionLoadingId(id);
    try {
      const res = await resendWhatsAppOutboxMessageAction(id);
      if (res.success) {
        toast.success("Notification resent successfully.");
      } else {
        toast.error(res.error || "Manual resend failed.");
      }
    } catch {
      toast.error("Resend execution error.");
    } finally {
      setActionLoadingId(null);
    }
  };

  const selectedTemplate = templates.find((t) => t.key === selectedTemplateKey) || templates[0];
  const activeTestTemplate = templates.find((t) => t.key === testTemplateKey) || templates[0];

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6 font-sans">
      {/* Top Banner & Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <h1 className="text-2xl font-bold font-display text-ink flex items-center gap-2">
            <MessageSquare className="size-6 text-emerald-600" />
            <span>WhatsApp Business Platform</span>
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Official Meta WhatsApp Cloud API integration for automated transactional order, payment, artwork, and shipping updates.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div
            className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${
              config.is_enabled && config.last_connection_status === "CONNECTED"
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800"
                : config.is_enabled
                ? "bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800"
                : "bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:text-slate-300"
            }`}
          >
            <span
              className={`size-2 rounded-full ${
                config.is_enabled && config.last_connection_status === "CONNECTED"
                  ? "bg-emerald-500 animate-pulse"
                  : config.is_enabled
                  ? "bg-amber-500"
                  : "bg-slate-400"
              }`}
            />
            <span>
              {config.is_enabled
                ? config.last_connection_status === "CONNECTED"
                  ? "CONNECTED & LIVE"
                  : "ENABLED (WAITING FOR META CREDENTIALS)"
                : "DISABLED (SETUP REQUIRED)"}
            </span>
          </div>

          <button
            onClick={handleTestConnection}
            disabled={isTestingConnection}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-paper hover:bg-muted text-xs font-medium transition text-ink disabled:opacity-50"
          >
            <RotateCw className={`size-3.5 ${isTestingConnection ? "animate-spin" : ""}`} />
            <span>Test Connection</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-paper border border-border rounded-xl p-4">
          <div className="text-xs text-muted-foreground font-medium">Messages Today</div>
          <div className="text-2xl font-bold text-ink mt-1">{metrics.messagesToday}</div>
          <div className="text-[11px] text-muted-foreground mt-1">{metrics.messagesThisWeek} this week</div>
        </div>
        <div className="bg-paper border border-border rounded-xl p-4">
          <div className="text-xs text-muted-foreground font-medium">Total Delivered</div>
          <div className="text-2xl font-bold text-emerald-600 mt-1">{metrics.totalSent}</div>
          <div className="text-[11px] text-emerald-600/80 mt-1">Delivery rate {metrics.successRatePercent}%</div>
        </div>
        <div className="bg-paper border border-border rounded-xl p-4">
          <div className="text-xs text-muted-foreground font-medium">Pending / Queued</div>
          <div className="text-2xl font-bold text-amber-600 mt-1">{metrics.totalQueued}</div>
          <div className="text-[11px] text-muted-foreground mt-1">Outbox worker active</div>
        </div>
        <div className="bg-paper border border-border rounded-xl p-4">
          <div className="text-xs text-muted-foreground font-medium">Failed Dispatches</div>
          <div className="text-2xl font-bold text-rose-600 mt-1">{metrics.totalFailed}</div>
          <div className="text-[11px] text-rose-600/80 mt-1">Safe error logging</div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-border gap-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab("overview")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-medium border-b-2 transition whitespace-nowrap ${
            activeTab === "overview"
              ? "border-emerald-600 text-emerald-600 font-semibold"
              : "border-transparent text-muted-foreground hover:text-ink"
          }`}
        >
          <KeyRound className="size-4" />
          <span>Overview & Credentials</span>
        </button>

        <button
          onClick={() => setActiveTab("templates")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-medium border-b-2 transition whitespace-nowrap ${
            activeTab === "templates"
              ? "border-emerald-600 text-emerald-600 font-semibold"
              : "border-transparent text-muted-foreground hover:text-ink"
          }`}
        >
          <FileCode2 className="size-4" />
          <span>Templates ({templates.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("triggers")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-medium border-b-2 transition whitespace-nowrap ${
            activeTab === "triggers"
              ? "border-emerald-600 text-emerald-600 font-semibold"
              : "border-transparent text-muted-foreground hover:text-ink"
          }`}
        >
          <Zap className="size-4" />
          <span>Automations / Triggers ({triggers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("logs")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-medium border-b-2 transition whitespace-nowrap ${
            activeTab === "logs"
              ? "border-emerald-600 text-emerald-600 font-semibold"
              : "border-transparent text-muted-foreground hover:text-ink"
          }`}
        >
          <ListFilter className="size-4" />
          <span>Message Logs ({logs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("test")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-medium border-b-2 transition whitespace-nowrap ${
            activeTab === "test"
              ? "border-emerald-600 text-emerald-600 font-semibold"
              : "border-transparent text-muted-foreground hover:text-ink"
          }`}
        >
          <Send className="size-4" />
          <span>Live Test Console</span>
        </button>
      </div>

      {/* TAB 1: OVERVIEW & CREDENTIALS */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-paper border border-border rounded-xl p-5 space-y-6">
            <div>
              <h2 className="text-base font-semibold text-ink flex items-center gap-2">
                <KeyRound className="size-4 text-emerald-600" />
                <span>Meta WhatsApp Cloud API Configuration</span>
              </h2>
              <p className="text-xs text-muted-foreground mt-1">
                Configure your Meta Developer App credentials. Tokens are stored encrypted with AES-256-GCM and never exposed to the frontend.
              </p>
            </div>

            <form onSubmit={handleSaveConfig} className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-muted/40 rounded-lg border border-border">
                <div>
                  <div className="text-xs font-semibold text-ink">Enable WhatsApp Outbound Notifications</div>
                  <div className="text-[11px] text-muted-foreground">
                    When disabled, all events are safely logged as SKIPPED without calling Meta API.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={isEnabled}
                  onChange={(e) => setIsEnabled(e.target.checked)}
                  className="size-4 rounded border-border text-emerald-600 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-ink mb-1">Phone Number ID</label>
                  <input
                    type="text"
                    value={phoneNumberId}
                    onChange={(e) => setPhoneNumberId(e.target.value)}
                    placeholder="e.g. 104829104829104"
                    className="w-full text-xs px-3 py-2 rounded-lg border border-border bg-paper focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <p className="text-[10px] text-muted-foreground mt-1">From Meta WhatsApp App → API Setup</p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-ink mb-1">WhatsApp Business Account ID (WABA)</label>
                  <input
                    type="text"
                    value={businessAccountId}
                    onChange={(e) => setBusinessAccountId(e.target.value)}
                    placeholder="e.g. 109283746510293"
                    className="w-full text-xs px-3 py-2 rounded-lg border border-border bg-paper focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <p className="text-[10px] text-muted-foreground mt-1">WABA account identifier</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-ink mb-1">Meta Graph API Version</label>
                  <input
                    type="text"
                    value={apiVersion}
                    onChange={(e) => setApiVersion(e.target.value)}
                    placeholder="v20.0"
                    className="w-full text-xs px-3 py-2 rounded-lg border border-border bg-paper focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-ink mb-1">Default Country Code</label>
                  <input
                    type="text"
                    value={defaultCountryCode}
                    onChange={(e) => setDefaultCountryCode(e.target.value)}
                    placeholder="91"
                    className="w-full text-xs px-3 py-2 rounded-lg border border-border bg-paper focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="border-t border-border pt-4">
                <label className="block text-xs font-medium text-ink mb-1">
                  WhatsApp Access Token (Permanent System User Token)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="password"
                    value={newAccessToken}
                    onChange={(e) => setNewAccessToken(e.target.value)}
                    placeholder={config.token_masked ? `Current: ${config.token_masked}` : "Paste EAAB... Meta Token"}
                    className="flex-1 text-xs px-3 py-2 rounded-lg border border-border bg-paper focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <p className="text-[10px] text-muted-foreground mt-1">
                  Leave blank to keep existing encrypted token. Never shared with browser.
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="submit"
                  disabled={isSavingConfig}
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition disabled:opacity-50"
                >
                  {isSavingConfig ? "Saving..." : "Save Configuration"}
                </button>
              </div>
            </form>
          </div>

          {/* Diagnostics / Status Card */}
          <div className="space-y-4">
            <div className="bg-paper border border-border rounded-xl p-5 space-y-4">
              <h3 className="text-xs font-bold text-ink uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck className="size-4 text-emerald-600" />
                <span>Security & Connection Health</span>
              </h3>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-1.5 border-b border-border/50">
                  <span className="text-muted-foreground">Access Token:</span>
                  <span className="font-mono text-ink">{config.token_masked || "Not Configured"}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-border/50">
                  <span className="text-muted-foreground">Phone Number ID:</span>
                  <span className="font-mono text-ink">{config.phone_number_id || "Not Configured"}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-border/50">
                  <span className="text-muted-foreground">API Version:</span>
                  <span className="font-mono text-ink">{config.api_version}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-border/50">
                  <span className="text-muted-foreground">Last Tested:</span>
                  <span className="text-ink">{config.last_tested_at ? new Date(config.last_tested_at).toLocaleString() : "Never"}</span>
                </div>
              </div>

              {connectionResult && (
                <div
                  className={`p-3 rounded-lg text-xs space-y-1 ${
                    connectionResult.success
                      ? "bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800"
                      : "bg-rose-50 text-rose-800 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800"
                  }`}
                >
                  <div className="font-bold flex items-center gap-1.5">
                    {connectionResult.success ? <CheckCircle2 className="size-4" /> : <XCircle className="size-4" />}
                    <span>{connectionResult.success ? "Connection Verified" : "Verification Failed"}</span>
                  </div>
                  {connectionResult.verifiedName && (
                    <div>Verified Name: {connectionResult.verifiedName}</div>
                  )}
                  {connectionResult.displayPhoneNumber && (
                    <div>Display Number: {connectionResult.displayPhoneNumber}</div>
                  )}
                  {connectionResult.qualityRating && (
                    <div>Quality Rating: {connectionResult.qualityRating}</div>
                  )}
                  {connectionResult.error && (
                    <div className="text-[11px] font-mono mt-1 text-rose-700 dark:text-rose-400">
                      {connectionResult.error}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="bg-paper border border-border rounded-xl p-4 text-xs space-y-2 text-muted-foreground">
              <div className="font-semibold text-ink flex items-center gap-1.5">
                <Info className="size-3.5 text-blue-500" />
                <span>Next Steps for Meta Launch:</span>
              </div>
              <ol className="list-decimal list-inside space-y-1 text-[11px]">
                <li>Paste permanent System User token from Meta Business Manager.</li>
                <li>Enter Phone Number ID and click <strong>Test Connection</strong>.</li>
                <li>Ensure templates in the <strong>Templates</strong> tab match approved Meta names.</li>
                <li>Switch toggle to <strong>Enabled</strong>.</li>
              </ol>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: TEMPLATES */}
      {activeTab === "templates" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 bg-paper border border-border rounded-xl p-4 space-y-2 max-h-[600px] overflow-y-auto">
            <div className="text-xs font-bold text-ink uppercase tracking-wider pb-2 border-b border-border">
              Configured Template Catalog ({templates.length})
            </div>
            {templates.map((tpl) => (
              <button
                key={tpl.id}
                onClick={() => setSelectedTemplateKey(tpl.key)}
                className={`w-full text-left p-3 rounded-lg border text-xs transition flex items-center justify-between ${
                  selectedTemplateKey === tpl.key
                    ? "bg-emerald-50 border-emerald-300 dark:bg-emerald-950/30 dark:border-emerald-700 text-emerald-900 dark:text-emerald-100"
                    : "bg-paper border-border hover:bg-muted/50 text-ink"
                }`}
              >
                <div>
                  <div className="font-semibold">{tpl.name}</div>
                  <div className="text-[10px] text-muted-foreground font-mono">{tpl.meta_template_name}</div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                      tpl.status === "ACTIVE"
                        ? "bg-emerald-100 text-emerald-800"
                        : tpl.status === "APPROVED"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-slate-100 text-slate-800"
                    }`}
                  >
                    {tpl.status}
                  </span>
                  <ChevronRight className="size-3 text-muted-foreground" />
                </div>
              </button>
            ))}
          </div>

          {/* Template Details & Preview */}
          <div className="lg:col-span-2 space-y-6">
            {selectedTemplate && (
              <div className="bg-paper border border-border rounded-xl p-5 space-y-5">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-border pb-4">
                  <div>
                    <h3 className="text-base font-bold text-ink">{selectedTemplate.name}</h3>
                    <p className="text-xs text-muted-foreground font-mono">
                      Event Key: {selectedTemplate.key} · Meta Template: {selectedTemplate.meta_template_name}
                    </p>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
                    Language: {selectedTemplate.language_code}
                  </span>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-bold text-ink uppercase tracking-wider">
                    Template Body Format (Local Source):
                  </label>
                  <div className="p-3 bg-muted/40 rounded-lg border border-border font-mono text-xs whitespace-pre-wrap text-ink">
                    {selectedTemplate.body_text}
                  </div>
                </div>

                {/* Live Preview Card */}
                <div className="space-y-3">
                  <div className="text-xs font-bold text-ink uppercase tracking-wider flex items-center gap-1.5">
                    <Smartphone className="size-3.5 text-emerald-600" />
                    <span>Customer WhatsApp Message Preview (Resolved Sample):</span>
                  </div>
                  <div className="p-4 bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 rounded-xl max-w-md shadow-sm">
                    <div className="text-xs text-ink whitespace-pre-wrap leading-relaxed">
                      {renderTemplatePreview(selectedTemplate.body_text, selectedTemplate.variable_schema)}
                    </div>
                    <div className="text-[10px] text-muted-foreground text-right mt-2">12:30 PM ✓✓</div>
                  </div>
                </div>

                {/* Variable Mappings */}
                <div className="space-y-2">
                  <div className="text-xs font-bold text-ink uppercase tracking-wider">
                    Meta Positional Variable Mappings:
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {selectedTemplate.variable_schema.map((v) => (
                      <div key={v.pos} className="p-2.5 rounded-lg border border-border bg-muted/20 text-xs flex justify-between">
                        <span className="font-mono text-emerald-600 font-bold">{`{{${v.pos}}}`}</span>
                        <span className="font-mono text-ink">{v.var}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: AUTOMATIONS / TRIGGERS */}
      {activeTab === "triggers" && (
        <div className="bg-paper border border-border rounded-xl p-5 space-y-4">
          <div>
            <h2 className="text-base font-semibold text-ink flex items-center gap-2">
              <Zap className="size-4 text-emerald-600" />
              <span>Event Lifecycle Triggers & Automation Rules</span>
            </h2>
            <p className="text-xs text-muted-foreground mt-1">
              Control which store lifecycle events automatically dispatch WhatsApp messages.
            </p>
          </div>

          <div className="divide-y divide-border border border-border rounded-lg overflow-hidden">
            {triggers.map((trig) => (
              <div key={trig.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-muted/20 transition">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold font-mono text-ink">{trig.event_type}</span>
                    <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                      {trig.category}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">{trig.description}</p>
                  <div className="text-[11px] text-emerald-600 font-medium">
                    Template: {trig.template?.name || "None assigned"}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={trig.is_enabled}
                      onChange={() => handleToggleTrigger(trig)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: MESSAGE LOGS */}
      {activeTab === "logs" && (
        <div className="bg-paper border border-border rounded-xl p-5 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-base font-semibold text-ink flex items-center gap-2">
                <ListFilter className="size-4 text-emerald-600" />
                <span>Authoritative Message Outbox & Delivery Logs</span>
              </h2>
              <p className="text-xs text-muted-foreground mt-1">
                Real-time delivery status, attempt history, idempotency keys, and safe diagnostic errors.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto border border-border rounded-lg">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/50 border-b border-border text-muted-foreground">
                <tr>
                  <th className="py-2.5 px-3 font-semibold">Event</th>
                  <th className="py-2.5 px-3 font-semibold">Recipient</th>
                  <th className="py-2.5 px-3 font-semibold">Status</th>
                  <th className="py-2.5 px-3 font-semibold">Attempts</th>
                  <th className="py-2.5 px-3 font-semibold">Created / Sent</th>
                  <th className="py-2.5 px-3 font-semibold">Provider ID</th>
                  <th className="py-2.5 px-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {logs.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-muted-foreground">
                      No WhatsApp notifications logged yet.
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => (
                    <tr key={log.id} className="hover:bg-muted/20 transition">
                      <td className="py-2.5 px-3 font-mono font-bold text-ink">
                        <div className="flex items-center gap-1.5">
                          <span>{log.event_type}</span>
                          {log.is_test && (
                            <span className="text-[9px] px-1 py-0.2 rounded bg-amber-100 text-amber-800 font-sans font-bold">
                              TEST
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-2.5 px-3 font-mono text-muted-foreground">
                        {maskPhoneNumber(log.recipient_phone)}
                      </td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            log.status === "SENT" || log.status === "DELIVERED" || log.status === "READ"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : log.status === "FAILED"
                              ? "bg-rose-50 text-rose-700 border border-rose-200"
                              : log.status === "SKIPPED"
                              ? "bg-slate-100 text-slate-700"
                              : "bg-amber-50 text-amber-700"
                          }`}
                        >
                          {log.status}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-muted-foreground">{log.attempts}</td>
                      <td className="py-2.5 px-3 text-muted-foreground">
                        {new Date(log.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-[10px] text-muted-foreground">
                        {log.provider_message_id || "—"}
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {log.status === "FAILED" && (
                            <button
                              onClick={() => handleRetryOutbox(log.id)}
                              disabled={actionLoadingId === log.id}
                              className="px-2 py-1 rounded bg-amber-600 hover:bg-amber-700 text-white text-[10px] font-semibold"
                            >
                              Retry
                            </button>
                          )}
                          <button
                            onClick={() => handleResendOutbox(log.id)}
                            disabled={actionLoadingId === log.id}
                            className="px-2 py-1 rounded border border-border hover:bg-muted text-ink text-[10px] font-semibold"
                          >
                            Resend
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: LIVE TEST CONSOLE */}
      {activeTab === "test" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-paper border border-border rounded-xl p-5 space-y-4">
            <div>
              <h2 className="text-base font-semibold text-ink flex items-center gap-2">
                <Send className="size-4 text-emerald-600" />
                <span>Send Real Meta Test Notification</span>
              </h2>
              <p className="text-xs text-muted-foreground mt-1">
                Dispatches a live template request through Meta WhatsApp Cloud API. Explicitly marked as a test message in logs.
              </p>
            </div>

            <form onSubmit={handleSendTestMessage} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-ink mb-1">Select Template</label>
                <select
                  value={testTemplateKey}
                  onChange={(e) => setTestTemplateKey(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-border bg-paper text-ink"
                >
                  {templates.map((tpl) => (
                    <option key={tpl.key} value={tpl.key}>
                      {tpl.name} ({tpl.meta_template_name})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-ink mb-1">
                  Recipient Test Phone Number (E.164 or 10-digit Indian Number)
                </label>
                <input
                  type="text"
                  value={testPhone}
                  onChange={(e) => setTestPhone(e.target.value)}
                  placeholder="+91 9876543210 or 9876543210"
                  className="w-full text-xs px-3 py-2 rounded-lg border border-border bg-paper text-ink focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="space-y-2 border-t border-border pt-3">
                <div className="text-xs font-semibold text-ink">Sample Variables Payload:</div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="text-[10px] text-muted-foreground">CUSTOMER_NAME</label>
                    <input
                      type="text"
                      value={testVariables.CUSTOMER_NAME || ""}
                      onChange={(e) => setTestVariables((p) => ({ ...p, CUSTOMER_NAME: e.target.value }))}
                      className="w-full text-xs px-2 py-1 rounded border border-border bg-paper"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-muted-foreground">ORDER_NUMBER</label>
                    <input
                      type="text"
                      value={testVariables.ORDER_NUMBER || ""}
                      onChange={(e) => setTestVariables((p) => ({ ...p, ORDER_NUMBER: e.target.value }))}
                      className="w-full text-xs px-2 py-1 rounded border border-border bg-paper"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-muted-foreground">ORDER_TOTAL / AMOUNT</label>
                    <input
                      type="text"
                      value={testVariables.ORDER_TOTAL || ""}
                      onChange={(e) => setTestVariables((p) => ({ ...p, ORDER_TOTAL: e.target.value, PAYMENT_AMOUNT: e.target.value }))}
                      className="w-full text-xs px-2 py-1 rounded border border-border bg-paper"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-muted-foreground">AWB_NUMBER</label>
                    <input
                      type="text"
                      value={testVariables.AWB_NUMBER || ""}
                      onChange={(e) => setTestVariables((p) => ({ ...p, AWB_NUMBER: e.target.value }))}
                      className="w-full text-xs px-2 py-1 rounded border border-border bg-paper"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSendingTest}
                  className="w-full py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Send className="size-3.5" />
                  <span>{isSendingTest ? "Contacting Meta API..." : "Send Live Test WhatsApp Message"}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Test Preview */}
          <div className="bg-paper border border-border rounded-xl p-5 space-y-4">
            <div className="text-xs font-bold text-ink uppercase tracking-wider">
              Live Preview of Message to be Sent:
            </div>
            {activeTestTemplate && (
              <div className="p-4 bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 rounded-xl space-y-2">
                <div className="text-xs text-ink whitespace-pre-wrap leading-relaxed">
                  {renderTemplatePreview(activeTestTemplate.body_text, activeTestTemplate.variable_schema, testVariables)}
                </div>
                <div className="text-[10px] text-muted-foreground text-right">Preview</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
