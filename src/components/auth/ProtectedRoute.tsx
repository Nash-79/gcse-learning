import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useApprovalStatus } from "@/hooks/useApprovalStatus";
import PendingApproval from "@/pages/PendingApproval";

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const { status, loading: approvalLoading } = useApprovalStatus();
  const location = useLocation();

  if (loading || (user && approvalLoading)) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace state={{ from: location.pathname }} />;
  }

  if (status && status !== "approved") {
    return <PendingApproval status={status} />;
  }

  return <>{children}</>;
}
