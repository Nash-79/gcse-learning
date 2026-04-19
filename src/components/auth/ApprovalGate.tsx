import { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useApprovalStatus } from "@/hooks/useApprovalStatus";
import PendingApproval from "@/pages/PendingApproval";

interface Props {
  children: ReactNode;
}

/**
 * Global gate: if a signed-in user's approval_status is not 'approved',
 * shows the PendingApproval screen instead of the app — across all routes.
 * Public auth-related routes (/auth, /reset-password) are exempt so users
 * can still sign out / reset password.
 */
export function ApprovalGate({ children }: Props) {
  const { user, loading } = useAuth();
  const { status, loading: approvalLoading } = useApprovalStatus();
  const location = useLocation();

  const exemptPaths = ["/auth", "/reset-password"];
  const isExempt = exemptPaths.some(p => location.pathname.startsWith(p));

  if (isExempt || !user) return <>{children}</>;

  if (loading || approvalLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (status && status !== "approved") {
    return <PendingApproval status={status} />;
  }

  return <>{children}</>;
}
