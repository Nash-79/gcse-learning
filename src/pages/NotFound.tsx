import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] w-full flex items-center justify-center">
      <div className="text-center">
        <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">404 — Page Not Found</h1>
        <p className="text-sm text-muted-foreground mb-6">The page you're looking for doesn't exist.</p>
        <Link to="/"><Button>Back to Dashboard</Button></Link>
      </div>
    </div>
  );
}
