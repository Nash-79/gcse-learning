import { motion } from "framer-motion";
import { Clock, ShieldX, LogOut, Mail } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import type { ApprovalStatus } from "@/hooks/useApprovalStatus";

interface Props {
  status: ApprovalStatus;
}

export default function PendingApproval({ status }: Props) {
  const { user, signOut } = useAuth();
  const isRejected = status === "rejected";

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Card className="rounded-2xl border-border/50">
          <CardContent className="p-8 text-center">
            <div
              className={`mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl ${
                isRejected
                  ? "bg-destructive/10 text-destructive"
                  : "bg-amber-500/10 text-amber-500"
              }`}
            >
              {isRejected ? <ShieldX className="h-7 w-7" /> : <Clock className="h-7 w-7" />}
            </div>

            <h1 className="font-display text-2xl font-extrabold mb-2">
              {isRejected ? "Access Denied" : "Awaiting Approval"}
            </h1>

            <p className="text-sm text-muted-foreground mb-6">
              {isRejected
                ? "Your account access has been declined. Please contact an administrator if you believe this is a mistake."
                : "Thanks for signing up! An administrator needs to approve your account before you can use PyLearn. You'll be able to sign in normally once approved."}
            </p>

            {user?.email && (
              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground bg-muted/40 rounded-lg py-2 px-3 mb-6">
                <Mail className="w-3.5 h-3.5" />
                <span className="font-mono truncate">{user.email}</span>
              </div>
            )}

            <Button onClick={signOut} variant="outline" className="w-full rounded-xl gap-2">
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
