import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export type ApprovalStatus = "pending" | "approved" | "rejected";

export function useApprovalStatus() {
  const { user } = useAuth();
  const [status, setStatus] = useState<ApprovalStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setStatus(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    supabase
      .from("profiles")
      .select("approval_status")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        setStatus(((data as any)?.approval_status as ApprovalStatus) ?? "pending");
        setLoading(false);
      });
  }, [user]);

  return { status, loading, isApproved: status === "approved" };
}
