"use client";

import { useState } from "react";
import { UserRole } from "@/lib/supabase/database.types";
import { changeStaffRoleAction, updateStaffStatusAction, addStaffByEmailAction } from "@/lib/admin/user-actions";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UserPlus, Search, Shield, ShieldCheck, ShieldAlert } from "lucide-react";
import { PermissionsManager } from "./permissions-manager";

type StaffUser = {
  id: string;
  full_name: string;
  email: string;
  role: UserRole;
  status: string;
  version: number;
  created_at: string;
  updated_at: string;
};

interface UsersClientViewProps {
  staff: StaffUser[];
  currentProfile: { id: string; role: UserRole };
  permissionsData?: any[];
}

export function UsersClientView({ staff, currentProfile, permissionsData }: UsersClientViewProps) {
  const [activeTab, setActiveTab] = useState<"staff" | "permissions">("staff");
  const [filterRole, setFilterRole] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<StaffUser | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addEmail, setAddEmail] = useState("");
  const [addRole, setAddRole] = useState<"admin" | "staff">("staff");
  const [isPending, setIsPending] = useState(false);

  // Note: users.manage permission is needed to manage both users and role permissions
  const canManageUsers = currentProfile.role === "owner" || currentProfile.role === "admin";

  const filteredStaff = staff.filter((u) => {
    if (filterRole !== "all" && u.role !== filterRole) return false;
    if (search && !u.full_name.toLowerCase().includes(search.toLowerCase()) && !u.email.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const handleEditClick = (user: StaffUser) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleRoleChange = async (newRole: UserRole) => {
    if (!selectedUser) return;
    if (selectedUser.id === currentProfile.id) {
      toast.error("You cannot change your own role.");
      return;
    }
    
    setIsPending(true);
    const result = await changeStaffRoleAction({
      userId: selectedUser.id,
      newRole,
      version: selectedUser.version
    });

    if (result.success) {
      toast.success("Role updated successfully.");
      setIsEditModalOpen(false);
    } else {
      toast.error(result.error || "Failed to update role.");
      if (result.error?.includes("version")) {
         // handle concurrency conflict implicitly
         toast.error("This user was modified by someone else. Please refresh.");
      }
    }
    setIsPending(false);
  };

  const handleStatusChange = async (newStatus: "active" | "suspended") => {
    if (!selectedUser) return;
    if (selectedUser.id === currentProfile.id) {
      toast.error("You cannot suspend yourself.");
      return;
    }
    
    setIsPending(true);
    const result = await updateStaffStatusAction({
      userId: selectedUser.id,
      newStatus,
      version: selectedUser.version
    });

    if (result.success) {
      toast.success(`Account ${newStatus}.`);
      setIsEditModalOpen(false);
    } else {
      toast.error(result.error || "Failed to update status.");
    }
    setIsPending(false);
  };

  const handleAddStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addEmail.trim()) {
      toast.error("Please enter an email address.");
      return;
    }
    setIsPending(true);
    const res = await addStaffByEmailAction(addEmail.trim(), addRole);
    setIsPending(false);

    if (res.success) {
      toast.success(`Successfully assigned ${addRole.toUpperCase()} role to ${addEmail}!`);
      setIsAddModalOpen(false);
      setAddEmail("");
    } else {
      toast.error(res.error || "Failed to add staff member.");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Staff & Permissions</h1>
          <p className="text-sm text-gray-500">Manage internal team roles, access levels, and account status.</p>
        </div>
        {canManageUsers && (
          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-violet hover:bg-violet-600 text-white font-semibold flex items-center gap-2"
          >
            <UserPlus className="size-4" />
            Add Staff Member
          </Button>
        )}
      </div>

      <div className="flex items-center gap-4 border-b border-border">
        <button
          onClick={() => setActiveTab("staff")}
          className={`pb-3 px-1 text-sm font-semibold border-b-2 transition-colors ${
            activeTab === "staff"
              ? "border-violet text-violet"
              : "border-transparent text-muted-foreground hover:text-ink hover:border-border"
          }`}
        >
          Staff Members
        </button>
        {canManageUsers && permissionsData && (
          <button
            onClick={() => setActiveTab("permissions")}
            className={`pb-3 px-1 text-sm font-semibold border-b-2 transition-colors ${
              activeTab === "permissions"
                ? "border-violet text-violet"
                : "border-transparent text-muted-foreground hover:text-ink hover:border-border"
            }`}
          >
            Role Permissions
          </button>
        )}
      </div>

      {activeTab === "staff" ? (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row gap-4">
            <input 
              type="text" 
              placeholder="Search name or email..." 
              className="flex-1 px-4 py-2 border rounded-md"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select 
              className="px-4 py-2 border rounded-md bg-white"
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
            >
              <option value="all">All Roles</option>
              <option value="owner">Owner</option>
              <option value="admin">Admin</option>
              <option value="staff">Staff</option>
            </select>
          </div>

          <div className="bg-white border rounded-lg overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 border-b text-gray-700">
              <tr>
                <th className="px-6 py-4 font-medium">Staff Member</th>
                <th className="px-6 py-4 font-medium">Role</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Last Updated</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredStaff.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{user.full_name}</div>
                    <div className="text-gray-500 text-xs">{user.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      user.role === 'owner' ? 'bg-purple-100 text-purple-700' :
                      user.role === 'admin' ? 'bg-blue-100 text-blue-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {user.role.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      user.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {user.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500" suppressHydrationWarning>
                    {new Date(user.updated_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {canManageUsers && user.id !== currentProfile.id && (
                      <Button variant="outline" size="sm" onClick={() => handleEditClick(user)}>
                        Manage
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
              {filteredStaff.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    No staff members found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Manage Staff Account</DialogTitle>
            <DialogDescription>
              Modify roles and access for {selectedUser?.full_name}.
            </DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <div className="space-y-6 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Account Status</label>
                <div className="flex gap-2">
                  <Button 
                    variant={selectedUser.status === "active" ? "primary" : "outline"} 
                    className={selectedUser.status === "active" ? "bg-green-600 hover:bg-green-700 text-white" : ""}
                    onClick={() => handleStatusChange("active")}
                    disabled={isPending || selectedUser.status === "active"}
                  >
                    Active
                  </Button>
                  <Button 
                    variant={selectedUser.status === "suspended" ? "destructive" : "outline"} 
                    onClick={() => handleStatusChange("suspended")}
                    disabled={isPending || selectedUser.status === "suspended"}
                  >
                    Suspended
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Assign Role</label>
                <div className="flex flex-col gap-2">
                  <Button 
                    variant="outline" 
                    className="justify-start h-auto p-4"
                    onClick={() => handleRoleChange("owner")}
                    disabled={isPending || selectedUser.role === "owner"}
                  >
                    <div className="text-left">
                      <div className="font-semibold text-purple-700">Owner</div>
                      <div className="text-xs text-gray-500 font-normal">Full administrative access to all systems, billing, and staff management.</div>
                    </div>
                  </Button>

                  <Button 
                    variant="outline" 
                    className="justify-start h-auto p-4"
                    onClick={() => handleRoleChange("admin")}
                    disabled={isPending || selectedUser.role === "admin"}
                  >
                    <div className="text-left">
                      <div className="font-semibold text-blue-700">Admin</div>
                      <div className="text-xs text-gray-500 font-normal">Manage orders, products, pricing, and customers. Cannot manage staff.</div>
                    </div>
                  </Button>

                  <Button 
                    variant="outline" 
                    className="justify-start h-auto p-4"
                    onClick={() => handleRoleChange("staff")}
                    disabled={isPending || selectedUser.role === "staff"}
                  >
                    <div className="text-left">
                      <div className="font-semibold text-green-700">Staff</div>
                      <div className="text-xs text-gray-500 font-normal">Basic operational access to process orders and view customers.</div>
                    </div>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Staff Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add / Promote Staff Member</DialogTitle>
            <DialogDescription>
              Assign an Admin or Staff role to any registered user account by email.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddStaff} className="space-y-4 py-3">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">User Email Address</label>
              <input
                type="email"
                required
                placeholder="colleague@example.com"
                value={addEmail}
                onChange={(e) => setAddEmail(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-sm bg-white"
              />
              <p className="text-[11px] text-muted-foreground">
                The user must have registered an account first at <code>/register</code>.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Select Role</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setAddRole("staff")}
                  className={`p-3 rounded-lg border text-left text-xs transition-all ${
                    addRole === "staff" ? "border-violet bg-violet/5 ring-1 ring-violet font-bold text-violet" : "border-border hover:bg-paper"
                  }`}
                >
                  <div className="font-semibold text-sm">Staff</div>
                  <div className="text-muted-foreground font-normal mt-0.5">Order processing & operations</div>
                </button>
                <button
                  type="button"
                  onClick={() => setAddRole("admin")}
                  className={`p-3 rounded-lg border text-left text-xs transition-all ${
                    addRole === "admin" ? "border-violet bg-violet/5 ring-1 ring-violet font-bold text-violet" : "border-border hover:bg-paper"
                  }`}
                >
                  <div className="font-semibold text-sm">Admin</div>
                  <div className="text-muted-foreground font-normal mt-0.5">Full operations & pricing</div>
                </button>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isPending} className="bg-violet hover:bg-violet-600 text-white font-semibold">
                {isPending ? "Assigning..." : "Assign Role"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
        </div>
      ) : (
        <PermissionsManager initialData={permissionsData || []} currentUserRole={currentProfile.role} />
      )}
    </div>
  );
}
