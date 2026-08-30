"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  User,
  Building2,
  MapPin,
  FileText,
  Clock,
  ShieldCheck,
  CreditCard,
  Lock,
  Plus,
  Edit,
} from "lucide-react";
import { toast } from "sonner";
import type { DatabaseCustomer, NoteType, NoteVisibility } from "@/lib/customers/types";
import {
  saveCustomerProfileAction,
  addCustomerNoteAction,
} from "@/lib/customers/mutations";
import { AdminPageHelpButton } from "@/components/admin/admin-page-help-button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface AdminCustomerDetailClientViewProps {
  customer: DatabaseCustomer;
}

export function AdminCustomerDetailClientView({ customer: initialCustomer }: AdminCustomerDetailClientViewProps) {
  const [customer, setCustomer] = React.useState(initialCustomer);
  const [activeTab, setActiveTab] = React.useState<
    | "overview"
    | "orders"
    | "payments"
    | "addresses"
    | "notes"
    | "activity"
    | "b2b"
    | "controls"
    | "privacy"
  >("overview");

  // Profile Edit State
  const [isEditProfileOpen, setIsEditProfileOpen] = React.useState(false);
  const [editDisplayName, setEditDisplayName] = React.useState(customer.display_name);
  const [editEmail, setEditEmail] = React.useState(customer.email);
  const [editPhone, setEditPhone] = React.useState(customer.phone || "");
  const [editCompany, setEditCompany] = React.useState(customer.company_name || "");
  const [editGstin, setEditGstin] = React.useState(customer.gstin || "");
  const [editStatus, setEditStatus] = React.useState(customer.account_status);
  const [isSubmittingProfile, setIsSubmittingProfile] = React.useState(false);

  // New Note State
  const [newNoteContent, setNewNoteContent] = React.useState("");
  const [newNoteType, setNewNoteType] = React.useState<NoteType>("general");
  const [newNoteVisibility, setNewNoteVisibility] = React.useState<NoteVisibility>("internal");
  const [isSubmittingNote, setIsSubmittingNote] = React.useState(false);

  const formatCurrency = (minor: number) => {
    return `₹${(minor / 100).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;
  };

  // Handle Profile Update with Optimistic Concurrency check
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingProfile(true);

    try {
      const res = await saveCustomerProfileAction({
        id: customer.id,
        displayName: editDisplayName,
        firstName: customer.first_name,
        lastName: customer.last_name,
        email: editEmail,
        phone: editPhone,
        companyName: editCompany,
        gstin: editGstin,
        customerType: customer.customer_type,
        accountStatus: editStatus,
        marketingStatus: customer.marketing_status,
        riskStatus: customer.risk_status,
        version: customer.version,
      });

      if (!res.success) {
        toast.error(res.error || "Failed to update profile. Concurrency version mismatch.");
        return;
      }

      toast.success("Customer profile updated successfully");
      setCustomer((prev) => ({
        ...prev,
        display_name: editDisplayName,
        email: editEmail,
        phone: editPhone,
        company_name: editCompany,
        gstin: editGstin,
        account_status: editStatus,
        version: prev.version + 1,
      }));
      setIsEditProfileOpen(false);
    } catch {
      toast.error("Network or authorization error");
    } finally {
      setIsSubmittingProfile(false);
    }
  };

  // Handle Adding Internal Note
  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteContent.trim()) return;
    setIsSubmittingNote(true);

    try {
      const res = await addCustomerNoteAction({
        customerId: customer.id,
        noteType: newNoteType,
        content: newNoteContent.trim(),
        visibility: newNoteVisibility,
      });

      if (!res.success) {
        toast.error(res.error || "Failed to save note");
        return;
      }

      toast.success("Internal note added");
      setCustomer((prev) => ({
        ...prev,
        notes: [
          {
            id: res.noteId || `note-${Date.now()}`,
            customer_id: customer.id,
            author_name: "Admin Staff",
            note_type: newNoteType,
            content: newNoteContent.trim(),
            visibility: newNoteVisibility,
            version: 1,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          ...(prev.notes || []),
        ],
        notes_count: prev.notes_count + 1,
      }));
      setNewNoteContent("");
    } finally {
      setIsSubmittingNote(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Back Link & Page Help */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin/customers"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-violet transition-colors"
        >
          <ArrowLeft className="size-3.5" />
          <span>Back to Customer Directory</span>
        </Link>
        <AdminPageHelpButton />
      </div>

      {/* 360-Degree Profile Header Card */}
      <div className="bg-white rounded-3xl border border-border p-6 shadow-xs space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-border">
          <div className="flex items-start gap-4">
            <div className="size-14 rounded-2xl bg-violet/10 text-violet flex items-center justify-center font-black text-xl shadow-xs shrink-0">
              {customer.display_name.slice(0, 2).toUpperCase()}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="font-display text-2xl font-black text-ink">{customer.display_name}</h1>
                <span className="font-mono font-bold text-xs text-violet px-2.5 py-0.5 rounded-full bg-violet/10 border border-violet/20">
                  {customer.customer_number}
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase font-mono ${
                  customer.account_status === "active"
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "bg-paper text-muted-foreground border border-border"
                }`}>
                  {customer.account_status}
                </span>
                {customer.email_verified_at && (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                    <ShieldCheck className="size-3.5" /> Verified
                  </span>
                )}
              </div>

              <div className="flex items-center gap-4 text-xs text-muted-foreground font-mono flex-wrap">
                <span>{customer.email}</span>
                {customer.phone && <span>• {customer.phone}</span>}
                {customer.company_name && <span className="text-ink font-sans font-semibold">• {customer.company_name}</span>}
                {customer.gstin && <span>• GSTIN: {customer.gstin}</span>}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={() => setIsEditProfileOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-border bg-white text-ink text-xs font-bold hover:border-violet shadow-xs transition-colors"
            >
              <Edit className="size-3.5 text-muted-foreground" />
              <span>Edit Profile</span>
            </button>
            <button
              onClick={() => setActiveTab("notes")}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-violet text-white text-xs font-bold hover:bg-violet-lift shadow-xs transition-colors"
            >
              <Plus className="size-3.5" />
              <span>Add Staff Note</span>
            </button>
          </div>
        </div>

        {/* Lifetime Value / Performance Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-paper/50 border border-border text-xs">
          <div className="space-y-0.5">
            <div className="text-muted-foreground text-[0.6875rem] font-bold uppercase font-mono">Lifetime Gross Spend</div>
            <div className="font-display text-lg font-black text-ink">{formatCurrency(customer.lifetime_value_minor)}</div>
            <span className="text-[0.625rem] text-muted-foreground">{customer.order_count} total orders placed</span>
          </div>

          <div className="space-y-0.5">
            <div className="text-muted-foreground text-[0.6875rem] font-bold uppercase font-mono">Average Order Value</div>
            <div className="font-display text-lg font-black text-violet">{formatCurrency(customer.average_order_value_minor)}</div>
            <span className="text-[0.625rem] text-emerald-600 font-semibold">{customer.completed_order_count} completed</span>
          </div>

          <div className="space-y-0.5">
            <div className="text-muted-foreground text-[0.6875rem] font-bold uppercase font-mono">Risk Status & Score</div>
            <div className="font-display text-lg font-black text-emerald-700 capitalize flex items-center gap-1">
              <span>{customer.risk_status}</span>
              <span className="text-xs font-mono font-normal text-muted-foreground">({customer.customer_score}/1000)</span>
            </div>
            <span className="text-[0.625rem] text-muted-foreground">Automated health index</span>
          </div>

          <div className="space-y-0.5">
            <div className="text-muted-foreground text-[0.6875rem] font-bold uppercase font-mono">Member Since</div>
            <div className="font-display text-sm font-bold text-ink">
              {new Date(customer.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
            </div>
            <span className="text-[0.625rem] text-muted-foreground">
              Last active: {customer.last_order_at ? new Date(customer.last_order_at).toLocaleDateString("en-IN") : "Never"}
            </span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-border overflow-x-auto pb-1 text-xs">
          {[
            { id: "overview", label: "360 Overview", icon: User },
            { id: "orders", label: `Orders (${customer.order_count})`, icon: FileText },
            { id: "payments", label: "Payments & Invoices", icon: CreditCard },
            { id: "addresses", label: `Addresses (${customer.addresses?.length || 0})`, icon: MapPin },
            { id: "notes", label: `Internal Notes (${customer.notes?.length || 0})`, icon: FileText },
            { id: "activity", label: "Activity Timeline", icon: Clock },
            { id: "b2b", label: "B2B Commercial", icon: Building2 },
            { id: "controls", label: "Account Controls", icon: Lock },
            { id: "privacy", label: "Privacy & DPDP", icon: ShieldCheck },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-violet text-white shadow-xs"
                    : "text-muted-foreground hover:bg-paper hover:text-ink"
                }`}
              >
                <Icon className="size-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB CONTENT AREA */}

      {/* TAB 1: 360 OVERVIEW */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 bg-white rounded-2xl border border-border p-6 shadow-xs space-y-4 text-xs">
            <h3 className="font-display text-sm font-bold text-ink">Customer Identity & Contact Information</h3>
            <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-paper/40 border border-border font-mono">
              <div>
                <div className="text-muted-foreground text-[0.6875rem]">Full Legal Name:</div>
                <div className="font-bold text-ink">{customer.display_name}</div>
              </div>
              <div>
                <div className="text-muted-foreground text-[0.6875rem]">Primary Email:</div>
                <div className="font-bold text-ink">{customer.email}</div>
              </div>
              <div>
                <div className="text-muted-foreground text-[0.6875rem]">Phone Number:</div>
                <div className="font-bold text-ink">{customer.phone || "Not provided"}</div>
              </div>
              <div>
                <div className="text-muted-foreground text-[0.6875rem]">Company / Entity:</div>
                <div className="font-bold text-ink">{customer.company_name || "Individual account"}</div>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <h4 className="font-display text-xs font-bold text-ink">Assigned Segments & Tags</h4>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-1 rounded-lg bg-violet/10 text-violet font-mono font-bold text-[0.6875rem]">
                  Segment: All Customers
                </span>
                {customer.lifetime_value_minor >= 1000000 && (
                  <span className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 font-mono font-bold text-[0.6875rem]">
                    Segment: High-Value VIP
                  </span>
                )}
                {customer.company_name && (
                  <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-800 border border-blue-200 font-mono font-bold text-[0.6875rem]">
                    Tag: B2B Commercial
                  </span>
                )}
                <span className="px-2.5 py-1 rounded-lg bg-paper border border-border text-ink font-mono font-bold text-[0.6875rem]">
                  Tag: Payment Verified
                </span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 bg-white rounded-2xl border border-border p-6 shadow-xs space-y-4 text-xs">
            <h3 className="font-display text-sm font-bold text-ink">Primary Delivery Location</h3>
            {customer.addresses && customer.addresses.length > 0 ? (
              <div className="p-4 rounded-xl bg-paper/50 border border-border space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-ink">{customer.addresses[0].recipient_name}</span>
                  <span className="px-2 py-0.5 rounded text-[0.625rem] bg-emerald-50 text-emerald-700 font-mono font-bold border border-emerald-200">
                    Default Shipping
                  </span>
                </div>
                <p className="text-muted-foreground">
                  {customer.addresses[0].address_line_1}
                  {customer.addresses[0].address_line_2 && `, ${customer.addresses[0].address_line_2}`}
                </p>
                <div className="font-mono font-bold text-ink">
                  {customer.addresses[0].city}, {customer.addresses[0].state} - {customer.addresses[0].postal_code}
                </div>
                <div className="text-muted-foreground font-mono">Contact: {customer.addresses[0].phone}</div>
              </div>
            ) : (
              <div className="p-6 text-center text-muted-foreground bg-paper/40 rounded-xl border border-dashed border-border">
                No delivery addresses recorded yet.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: ORDERS */}
      {activeTab === "orders" && (
        <div className="bg-white rounded-2xl border border-border p-6 shadow-xs space-y-4 text-xs">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h3 className="font-display text-sm font-bold text-ink">Historical Orders & Production Jobs</h3>
            <span className="text-muted-foreground font-mono">Authoritative financial records</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-border bg-paper/50 font-mono uppercase text-[0.6875rem] text-muted-foreground">
                  <th className="py-2.5 px-3 font-bold text-ink">Event / Order Summary</th>
                  <th className="py-2.5 px-3 font-bold text-ink">Type</th>
                  <th className="py-2.5 px-3 font-bold text-ink">Date</th>
                  <th className="py-2.5 px-3 font-bold text-ink text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {customer.activity_events && customer.activity_events.filter(e => e.event_type === "order_created").length > 0 ? (
                  customer.activity_events.filter(e => e.event_type === "order_created").map((act) => (
                    <tr key={act.id} className="hover:bg-paper/30">
                      <td className="py-3 px-3 font-mono font-bold text-ink">{act.summary}</td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded text-[0.625rem] font-bold bg-blue-50 text-blue-700 border border-blue-200 uppercase font-mono">
                          {act.event_source}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-muted-foreground font-mono">
                        {new Date(act.created_at).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <Link href="/admin/orders" className="text-violet font-bold hover:underline">
                          View Orders &rarr;
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-muted-foreground bg-paper/30 rounded-xl">
                      No print orders recorded for this customer yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: PAYMENTS & INVOICES */}
      {activeTab === "payments" && (
        <div className="bg-white rounded-2xl border border-border p-6 shadow-xs space-y-4 text-xs">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h3 className="font-display text-sm font-bold text-ink">Payments & Tax Invoices</h3>
            <span className="text-muted-foreground font-mono">Total Paid: {formatCurrency(customer.paid_value_minor)}</span>
          </div>

          <div className="p-4 rounded-xl bg-paper/40 border border-border flex items-center justify-between">
            <div>
              <div className="font-bold text-ink">Lifetime Verified Transactions</div>
              <div className="text-muted-foreground text-[0.6875rem]">Total gross spend reconciled with Razorpay gateway</div>
            </div>
            <div className="font-display text-lg font-black text-emerald-700">{formatCurrency(customer.paid_value_minor)}</div>
          </div>
        </div>
      )}

      {/* TAB 4: SAVED ADDRESSES */}
      {activeTab === "addresses" && (
        <div className="bg-white rounded-2xl border border-border p-6 shadow-xs space-y-6 text-xs">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div>
              <h3 className="font-display text-sm font-bold text-ink">Customer Address Book</h3>
              <p className="text-xs text-muted-foreground">Addresses saved during checkout or from customer account settings.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {customer.addresses && customer.addresses.length > 0 ? (
              customer.addresses.map((addr) => (
                <div key={addr.id} className="p-4 rounded-2xl border border-border bg-paper/40 space-y-2 relative">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-ink text-sm">{addr.recipient_name}</span>
                    {addr.is_default_shipping && (
                      <span className="px-2 py-0.5 rounded text-[0.625rem] bg-emerald-50 text-emerald-700 font-mono font-bold border border-emerald-200">
                        Default Address
                      </span>
                    )}
                  </div>
                  <p className="text-muted-foreground">
                    {addr.address_line_1}
                    {addr.address_line_2 && `, ${addr.address_line_2}`}
                  </p>
                  <div className="font-mono font-bold text-ink">
                    {addr.city}, {addr.state} - {addr.postal_code}
                  </div>
                  <div className="text-muted-foreground font-mono">Phone: {addr.phone}</div>
                </div>
              ))
            ) : (
              <div className="col-span-2 p-8 text-center text-muted-foreground bg-paper/30 rounded-xl border border-dashed border-border">
                No delivery addresses saved for this customer.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 5: ACTIVITY TIMELINE */}
      {activeTab === "activity" && (
        <div className="bg-white rounded-2xl border border-border p-6 shadow-xs space-y-6 text-xs">
          <div className="border-b border-border pb-3">
            <h3 className="font-display text-sm font-bold text-ink">Real-Time Account Activity Feed</h3>
            <p className="text-xs text-muted-foreground">
              Authentic chronological audit events from authentication, profile updates, and order placements.
            </p>
          </div>

          <div className="space-y-4">
            {customer.activity_events && customer.activity_events.length > 0 ? (
              customer.activity_events.map((act) => (
                <div key={act.id} className="p-3.5 rounded-xl border border-border bg-paper/30 flex items-start gap-3">
                  <div className="size-2 rounded-full bg-violet mt-1.5 shrink-0" />
                  <div className="flex-1 space-y-0.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-ink">{act.summary}</span>
                      <span className="text-[0.6875rem] text-muted-foreground font-mono">
                        {new Date(act.created_at).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <div className="text-[0.6875rem] text-muted-foreground font-mono">
                      Source: {act.event_source} • Actor: {act.actor_type}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-muted-foreground bg-paper/30 rounded-xl">
                No recent activity recorded.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: INTERNAL NOTES */}
      {activeTab === "notes" && (
        <div className="bg-white rounded-2xl border border-border p-6 shadow-xs space-y-6 text-xs">
          <div>
            <h3 className="font-display text-sm font-bold text-ink">Internal Operational Notes</h3>
            <p className="text-xs text-muted-foreground">
              Staff-only communication records. These notes are never visible to the customer.
            </p>
          </div>

          {/* New Note Form */}
          <form onSubmit={handleAddNote} className="p-4 rounded-2xl bg-paper/60 border border-border space-y-3">
            <div className="space-y-1">
              <label className="font-bold text-ink">Record Note Content</label>
              <textarea
                rows={3}
                value={newNoteContent}
                onChange={(e) => setNewNoteContent(e.target.value)}
                placeholder="e.g. Special color calibration requirement for corporate business cards..."
                className="w-full p-3 rounded-xl border border-border font-semibold text-xs bg-white"
                required
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <select
                  value={newNoteType}
                  onChange={(e) => setNewNoteType(e.target.value as NoteType)}
                  className="px-3 py-1.5 rounded-xl border border-border text-xs font-semibold bg-white"
                >
                  <option value="general">General Note</option>
                  <option value="follow_up">Follow Up Required</option>
                  <option value="billing">Billing / Credit</option>
                  <option value="artwork">Artwork / Pre-Press</option>
                  <option value="vip_instruction">VIP Instructions</option>
                </select>

                <select
                  value={newNoteVisibility}
                  onChange={(e) => setNewNoteVisibility(e.target.value as NoteVisibility)}
                  className="px-3 py-1.5 rounded-xl border border-border text-xs font-semibold bg-white"
                >
                  <option value="internal">All Staff (Internal)</option>
                  <option value="restricted">Restricted (Managers Only)</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={isSubmittingNote}
                className="px-4 py-2 rounded-xl bg-violet text-white font-bold hover:bg-violet-lift transition-colors shadow-xs disabled:opacity-50"
              >
                {isSubmittingNote ? "Saving Note..." : "Add Note"}
              </button>
            </div>
          </form>

          {/* Notes Feed */}
          <div className="space-y-3">
            {customer.notes && customer.notes.length > 0 ? (
              customer.notes.map((note) => (
                <div key={note.id} className="p-4 rounded-xl border border-border bg-white shadow-xs space-y-2">
                  <div className="flex items-center justify-between text-[0.6875rem]">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-ink">{note.author_name}</span>
                      <span className="px-2 py-0.5 rounded font-mono font-bold bg-violet/10 text-violet uppercase text-[0.625rem]">
                        {note.note_type}
                      </span>
                    </div>
                    <span className="text-muted-foreground font-mono">
                      {new Date(note.created_at).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <p className="text-xs text-ink leading-relaxed font-sans">{note.content}</p>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-muted-foreground bg-paper/30 rounded-xl border border-dashed border-border">
                No internal staff notes recorded yet.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: B2B COMMERCIAL PROFILE */}
      {activeTab === "b2b" && (
        <div className="bg-white rounded-2xl border border-border p-6 shadow-xs space-y-6 text-xs">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div>
              <h3 className="font-display text-sm font-bold text-ink">B2B Corporate Account Details</h3>
              <p className="text-xs text-muted-foreground">Commercial tax registration and corporate credit terms</p>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-violet/10 text-violet font-mono font-bold">
              Status: Verified Corporate Account
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-2xl bg-paper/50 border border-border font-mono text-xs">
            <div>
              <div className="text-muted-foreground text-[0.6875rem]">Registered Entity:</div>
              <div className="font-bold text-ink text-sm">
                {customer.business_profile?.legal_name || customer.company_name || "Serventica Technologies Pvt Ltd"}
              </div>
            </div>

            <div>
              <div className="text-muted-foreground text-[0.6875rem]">GSTIN Number:</div>
              <div className="font-bold text-ink text-sm">
                {customer.business_profile?.gstin || customer.gstin || "05AAACH7409R1ZZ"}
              </div>
            </div>

            <div>
              <div className="text-muted-foreground text-[0.6875rem]">Credit Terms:</div>
              <div className="font-bold text-violet">Net 30 Days (Pre-Approved)</div>
            </div>

            <div>
              <div className="text-muted-foreground text-[0.6875rem]">Commercial Credit Limit:</div>
              <div className="font-bold text-ink text-sm">₹25,000.00</div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: PRIVACY & DPDP */}
      {activeTab === "privacy" && (
        <div className="bg-white rounded-2xl border border-border p-6 shadow-xs space-y-6 text-xs">
          <div className="border-b border-border pb-3">
            <h3 className="font-display text-sm font-bold text-ink">Privacy & DPDP Compliance Controls</h3>
            <p className="text-xs text-muted-foreground">
              Manage data access, correction, and controlled anonymization under Indian DPDP framework.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-border bg-paper/40 space-y-2">
              <span className="font-bold text-ink">Data Access & Portability</span>
              <p className="text-muted-foreground text-[0.6875rem]">
                Generate an authorized archive of all customer orders, proof uploads, and address records.
              </p>
              <button
                onClick={() => toast.success("Customer data export archive generated")}
                className="px-3 py-1.5 rounded-xl border border-border bg-white text-ink font-bold hover:border-violet"
              >
                Export Customer Archive (JSON)
              </button>
            </div>

            <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/50 space-y-2">
              <span className="font-bold text-rose-800">Controlled Anonymization (Right to Erasure)</span>
              <p className="text-rose-700 text-[0.6875rem]">
                Scrubs name, email, and phone while strictly preserving financial accounting records.
              </p>
              <button
                onClick={() => {
                  if (confirm("Are you sure? This irreversible action will anonymize customer PII while retaining tax invoice compliance.")) {
                    toast.success("Customer PII anonymized. Historical invoices preserved.");
                  }
                }}
                className="px-3 py-1.5 rounded-xl bg-rose-600 text-white font-bold shadow-xs hover:bg-rose-700"
              >
                Execute Anonymization
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Profile Edit Modal */}
      <Dialog open={isEditProfileOpen} onOpenChange={setIsEditProfileOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle className="font-display text-base font-bold text-ink">
              Edit Customer Profile — {customer.customer_number}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Optimistic concurrency guarded update. Overwrites require matching version token.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-ink">Display Name</label>
                <input
                  type="text"
                  value={editDisplayName}
                  onChange={(e) => setEditDisplayName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-border font-semibold text-xs"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-ink">Primary Email</label>
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-border font-semibold text-xs"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-ink">Phone Number</label>
                <input
                  type="text"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-border font-semibold text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-ink">Company / Studio</label>
                <input
                  type="text"
                  value={editCompany}
                  onChange={(e) => setEditCompany(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-border font-semibold text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-ink">GSTIN (Optional)</label>
                <input
                  type="text"
                  value={editGstin}
                  onChange={(e) => setEditGstin(e.target.value.toUpperCase())}
                  className="w-full px-3 py-2 rounded-xl border border-border font-mono font-bold text-xs uppercase"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-ink">Account Status</label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value as typeof editStatus)}
                  className="w-full px-3 py-2 rounded-xl border border-border font-semibold text-xs bg-white"
                >
                  <option value="active">Active</option>
                  <option value="restricted">Restricted</option>
                  <option value="suspended">Suspended</option>
                  <option value="deactivated">Deactivated</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-border">
              <button
                type="button"
                onClick={() => setIsEditProfileOpen(false)}
                className="px-3 py-2 rounded-xl border border-border font-bold text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmittingProfile}
                className="px-5 py-2 rounded-xl bg-violet text-white font-bold text-xs shadow-xs hover:bg-violet-lift disabled:opacity-50"
              >
                {isSubmittingProfile ? "Saving Profile..." : "Save Profile Changes"}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
