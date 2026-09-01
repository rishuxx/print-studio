"use client";

import * as React from "react";
import { UserRole } from "@/lib/supabase/database.types";
import { AVAILABLE_PERMISSIONS } from "@/lib/auth/permissions";
import { updateRolePermissions } from "@/lib/admin/role-actions";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";

interface RolePermissionsData {
  role: string;
  permissions: string[];
}

export function PermissionsManager({ 
  initialData, 
  currentUserRole 
}: { 
  initialData: RolePermissionsData[],
  currentUserRole: UserRole 
}) {
  const [data, setData] = React.useState<RolePermissionsData[]>(initialData);
  const [isSaving, setIsSaving] = React.useState<string | null>(null);

  const handleToggle = (role: string, permissionId: string, checked: boolean) => {
    setData((prev) => 
      prev.map((r) => {
        if (r.role !== role) return r;
        
        const newPerms = checked 
          ? [...r.permissions, permissionId]
          : r.permissions.filter((p) => p !== permissionId);
          
        return { ...r, permissions: newPerms };
      })
    );
  };

  const handleSave = async (role: string) => {
    try {
      setIsSaving(role);
      const roleData = data.find((r) => r.role === role);
      if (!roleData) return;

      await updateRolePermissions(role as UserRole, roleData.permissions);
      toast.success(`${role} permissions updated successfully`);
    } catch (err: any) {
      toast.error(err.message || "Failed to update permissions");
    } finally {
      setIsSaving(null);
    }
  };

  const editableRoles = ["admin", "staff"];

  return (
    <div className="space-y-8">
      {editableRoles.map((role) => {
        const roleData = data.find((r) => r.role === role) || { role, permissions: [] };
        
        return (
          <div key={role} className="rounded-xl border border-border/80 bg-white overflow-hidden shadow-sm">
            <div className="flex items-center justify-between border-b border-border/80 bg-paper/50 px-6 py-4">
              <div>
                <h3 className="font-display text-lg font-bold text-ink capitalize">{role} Permissions</h3>
                <p className="text-sm text-muted-foreground mt-0.5">Control what staff with the {role} role can access.</p>
              </div>
              <Button 
                onClick={() => handleSave(role)}
                disabled={isSaving === role || currentUserRole !== 'owner'}
                className="bg-violet hover:bg-violet-600 text-white shadow-sm"
              >
                {isSaving === role ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Save Changes
              </Button>
            </div>
            
            <div className="divide-y divide-border/60">
              {AVAILABLE_PERMISSIONS.map((perm) => (
                <div key={perm.id} className="flex items-start justify-between px-6 py-4 hover:bg-paper/30 transition-colors">
                  <div className="flex flex-col gap-1 pr-6">
                    <label className="text-sm font-semibold text-ink cursor-pointer" htmlFor={`${role}-${perm.id}`}>
                      {perm.label}
                    </label>
                    <p className="text-xs text-muted-foreground">{perm.description}</p>
                  </div>
                  <Switch 
                    id={`${role}-${perm.id}`}
                    checked={roleData.permissions.includes(perm.id)}
                    disabled={currentUserRole !== 'owner'}
                    onCheckedChange={(checked: boolean) => handleToggle(role, perm.id, checked)}
                    className="data-[state=checked]:bg-violet"
                  />
                </div>
              ))}
            </div>
          </div>
        );
      })}
      
      {/* Readonly Owner Box */}
      <div className="rounded-xl border border-violet/20 bg-violet/5 overflow-hidden">
        <div className="px-6 py-4">
          <h3 className="font-display text-sm font-bold text-violet capitalize">Owner Role (Protected)</h3>
          <p className="text-xs text-violet/70 mt-1">
            Owner permissions are locked to prevent accidental lockout. Owners inherently have full access to all modules.
          </p>
        </div>
      </div>
    </div>
  );
}
