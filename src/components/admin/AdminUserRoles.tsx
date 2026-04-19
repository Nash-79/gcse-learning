import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users, Search, Shield, ShieldCheck, UserCog, Loader2,
  Plus, Trash2, ChevronDown, X, Check, Clock, ShieldX
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type ApprovalStatus = "pending" | "approved" | "rejected";

interface Profile {
  id: string;
  display_name: string | null;
  created_at: string;
  approval_status: ApprovalStatus;
  approved_at: string | null;
}

interface UserRole {
  id: string;
  user_id: string;
  role: "admin" | "moderator" | "user";
}

const roleConfig: Record<string, { icon: React.ReactNode; color: string; label: string }> = {
  admin: { icon: <ShieldCheck className="w-3.5 h-3.5" />, color: "text-red-400 bg-red-500/10 border-red-500/20", label: "Admin" },
  moderator: { icon: <Shield className="w-3.5 h-3.5" />, color: "text-amber-400 bg-amber-500/10 border-amber-500/20", label: "Moderator" },
  user: { icon: <UserCog className="w-3.5 h-3.5" />, color: "text-blue-400 bg-blue-500/10 border-blue-500/20", label: "User" },
};

const approvalConfig: Record<ApprovalStatus, { icon: React.ReactNode; color: string; label: string }> = {
  pending: { icon: <Clock className="w-3 h-3" />, color: "text-amber-400 bg-amber-500/10 border-amber-500/20", label: "Pending" },
  approved: { icon: <Check className="w-3 h-3" />, color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20", label: "Approved" },
  rejected: { icon: <ShieldX className="w-3 h-3" />, color: "text-red-400 bg-red-500/10 border-red-500/20", label: "Rejected" },
};

export default function AdminUserRoles() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [expandedUser, setExpandedUser] = useState<string | null>(null);
  const [addingRole, setAddingRole] = useState<{ userId: string; role: string } | null>(null);
  const [updatingApproval, setUpdatingApproval] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const [profilesRes, rolesRes] = await Promise.all([
      supabase.from("profiles").select("*").order("created_at", { ascending: false }),
      supabase.from("user_roles").select("*"),
    ]);

    if (profilesRes.data) setProfiles(profilesRes.data as Profile[]);
    if (rolesRes.data) setRoles(rolesRes.data as UserRole[]);
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const getUserRoles = (userId: string) => roles.filter(r => r.user_id === userId);

  const assignRole = async (userId: string, role: string) => {
    setAddingRole({ userId, role });
    const { error } = await supabase.from("user_roles").insert({ user_id: userId, role } as any);
    if (error) {
      if (error.code === "23505") toast.error("User already has this role");
      else toast.error("Failed to assign role");
    } else {
      toast.success(`Role "${role}" assigned`);
      await fetchData();
    }
    setAddingRole(null);
  };

  const removeRole = async (roleId: string) => {
    const { error } = await supabase.from("user_roles").delete().eq("id", roleId);
    if (error) {
      toast.error("Failed to remove role");
    } else {
      toast.success("Role removed");
      await fetchData();
    }
  };

  const updateApproval = async (userId: string, newStatus: ApprovalStatus) => {
    setUpdatingApproval(userId);
    const { data: { user: currentUser } } = await supabase.auth.getUser();
    const { error } = await supabase
      .from("profiles")
      .update({
        approval_status: newStatus,
        approved_at: newStatus === "approved" ? new Date().toISOString() : null,
        approved_by: currentUser?.id ?? null,
      } as any)
      .eq("id", userId);
    if (error) {
      toast.error("Failed to update approval");
    } else {
      toast.success(`User ${newStatus}`);
      await fetchData();
    }
    setUpdatingApproval(null);
  };

  const filtered = profiles.filter(p => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (p.display_name || "").toLowerCase().includes(q) || p.id.toLowerCase().includes(q);
  });

  // Sort: pending first, then approved, then rejected
  const sorted = [...filtered].sort((a, b) => {
    const order: Record<ApprovalStatus, number> = { pending: 0, approved: 1, rejected: 2 };
    const diff = order[a.approval_status] - order[b.approval_status];
    if (diff !== 0) return diff;
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  const pendingCount = profiles.filter(p => p.approval_status === "pending").length;

  return (
    <Card className="rounded-2xl overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <div>
            <h3 className="text-lg font-display font-bold flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              User Role Management
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {profiles.length} users · {roles.length} role assignments
              {pendingCount > 0 && (
                <span className="ml-2 inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-medium border text-amber-400 bg-amber-500/10 border-amber-500/20">
                  <Clock className="w-3 h-3" /> {pendingCount} pending
                </span>
              )}
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={fetchData} disabled={loading} className="gap-1.5 rounded-xl text-xs">
            <Loader2 className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or user ID..."
            className="w-full bg-background border border-border rounded-xl pl-9 pr-9 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : sorted.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Users className="w-8 h-8 mx-auto mb-2 opacity-40" />
            <p className="text-sm">No users found.</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
            {sorted.map(profile => {
              const userRoles = getUserRoles(profile.id);
              const isExpanded = expandedUser === profile.id;
              const ac = approvalConfig[profile.approval_status] || approvalConfig.pending;
              const isUpdating = updatingApproval === profile.id;

              return (
                <div
                  key={profile.id}
                  className={`rounded-xl border bg-card transition-all ${
                    profile.approval_status === "pending" ? "border-amber-500/30" : "border-border/40"
                  }`}
                >
                  <button
                    onClick={() => setExpandedUser(isExpanded ? null : profile.id)}
                    className="w-full text-left p-3 flex items-center gap-3"
                  >
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      <UserCog className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-medium text-foreground">
                          {profile.display_name || "Unnamed User"}
                        </span>
                        <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-medium border ${ac.color}`}>
                          {ac.icon} {ac.label}
                        </span>
                        {userRoles.map(r => {
                          const rc = roleConfig[r.role] || roleConfig.user;
                          return (
                            <span key={r.id} className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-medium border ${rc.color}`}>
                              {rc.icon} {rc.label}
                            </span>
                          );
                        })}
                      </div>
                      <span className="text-[10px] text-muted-foreground font-mono">{profile.id.slice(0, 8)}...</span>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                  </button>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="px-3 pb-3 border-t border-border/30 pt-3 space-y-3">
                          <div className="text-xs text-muted-foreground">
                            <span className="font-mono">ID: {profile.id}</span>
                            <br />
                            <span>Joined: {new Date(profile.created_at).toLocaleDateString()}</span>
                            {profile.approved_at && (
                              <>
                                <br />
                                <span>Approved: {new Date(profile.approved_at).toLocaleDateString()}</span>
                              </>
                            )}
                          </div>

                          {/* Approval actions */}
                          <div>
                            <p className="text-[11px] font-medium text-muted-foreground mb-1.5">Approval Status</p>
                            <div className="flex gap-2 flex-wrap">
                              {profile.approval_status !== "approved" && (
                                <Button
                                  size="sm"
                                  disabled={isUpdating}
                                  onClick={(e) => { e.stopPropagation(); updateApproval(profile.id, "approved"); }}
                                  className="gap-1 rounded-lg text-[11px] h-7 bg-emerald-600 hover:bg-emerald-700 text-white"
                                >
                                  {isUpdating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
                                  Approve
                                </Button>
                              )}
                              {profile.approval_status !== "rejected" && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  disabled={isUpdating}
                                  onClick={(e) => { e.stopPropagation(); updateApproval(profile.id, "rejected"); }}
                                  className="gap-1 rounded-lg text-[11px] h-7 text-red-400 border-red-500/30 hover:bg-red-500/10"
                                >
                                  {isUpdating ? <Loader2 className="w-3 h-3 animate-spin" /> : <ShieldX className="w-3 h-3" />}
                                  Reject
                                </Button>
                              )}
                              {profile.approval_status !== "pending" && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  disabled={isUpdating}
                                  onClick={(e) => { e.stopPropagation(); updateApproval(profile.id, "pending"); }}
                                  className="gap-1 rounded-lg text-[11px] h-7"
                                >
                                  {isUpdating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Clock className="w-3 h-3" />}
                                  Reset to Pending
                                </Button>
                              )}
                            </div>
                          </div>

                          {/* Current roles */}
                          {userRoles.length > 0 && (
                            <div>
                              <p className="text-[11px] font-medium text-muted-foreground mb-1.5">Current Roles</p>
                              <div className="flex flex-wrap gap-2">
                                {userRoles.map(r => {
                                  const rc = roleConfig[r.role] || roleConfig.user;
                                  return (
                                    <div key={r.id} className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-medium border ${rc.color}`}>
                                      {rc.icon} {rc.label}
                                      <button
                                        onClick={(e) => { e.stopPropagation(); removeRole(r.id); }}
                                        className="ml-1 hover:text-destructive transition-colors"
                                      >
                                        <Trash2 className="w-3 h-3" />
                                      </button>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                          {/* Assign role */}
                          <div>
                            <p className="text-[11px] font-medium text-muted-foreground mb-1.5">Assign Role</p>
                            <div className="flex gap-2">
                              {(["admin", "moderator", "user"] as const).map(role => {
                                const hasRole = userRoles.some(r => r.role === role);
                                const isAdding = addingRole?.userId === profile.id && addingRole?.role === role;
                                return (
                                  <Button
                                    key={role}
                                    variant="outline"
                                    size="sm"
                                    disabled={hasRole || !!addingRole}
                                    onClick={(e) => { e.stopPropagation(); assignRole(profile.id, role); }}
                                    className="gap-1 rounded-lg text-[11px] h-7"
                                  >
                                    {isAdding ? <Loader2 className="w-3 h-3 animate-spin" /> : <Plus className="w-3 h-3" />}
                                    {roleConfig[role].label}
                                  </Button>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
