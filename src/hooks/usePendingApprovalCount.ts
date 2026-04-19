import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAdminRole } from "@/hooks/useAdminRole";

/**
 * Returns the count of profiles with approval_status = 'pending'.
 * Only fetches data when the user is an admin. Subscribes to realtime
 * changes on the profiles table so the badge updates instantly.
 */
export function usePendingApprovalCount() {
  const { isAdmin, loading: roleLoading } = useAdminRole();
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (roleLoading) return;
    if (!isAdmin) {
      setCount(0);
      setLoading(false);
      return;
    }

    let cancelled = false;

    const fetchCount = async () => {
      const { count: c } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .eq("approval_status", "pending");
      if (!cancelled) {
        setCount(c ?? 0);
        setLoading(false);
      }
    };

    fetchCount();

    const channel = supabase
      .channel("pending-approvals-watch")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "profiles" },
        () => fetchCount()
      )
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, [isAdmin, roleLoading]);

  return { count, loading, isAdmin };
}
