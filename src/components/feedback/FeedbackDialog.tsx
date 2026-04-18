import { ReactNode, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { MessageSquare, Send, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { submitFeedback, type FeedbackType } from "@/lib/feedback";

export interface FeedbackDialogProps {
  trigger?: ReactNode;
  sectionKey?: string;
  context?: Record<string, unknown>;
}

const FEEDBACK_TYPES: Array<{ id: FeedbackType; label: string }> = [
  { id: "bug", label: "Bug" },
  { id: "suggestion", label: "Suggestion" },
  { id: "content", label: "Content issue" },
  { id: "other", label: "Other" },
];

export function FeedbackDialog({ trigger, sectionKey, context }: FeedbackDialogProps) {
  const location = useLocation();
  const pagePath = location.pathname;
  const resolvedSectionKey = sectionKey?.trim() || "global";

  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [feedbackType, setFeedbackType] = useState<FeedbackType>("suggestion");
  const [summary, setSummary] = useState("");
  const [details, setDetails] = useState("");
  const [tryingToDo, setTryingToDo] = useState("");
  const [steps, setSteps] = useState("");
  const [expected, setExpected] = useState("");
  const [actual, setActual] = useState("");
  const [contactEmail, setContactEmail] = useState("");

  const showBugFields = feedbackType === "bug";

  const triggerNode = useMemo(() => {
    if (trigger) return trigger;
    return (
      <Button
        variant="ghost"
        size="icon"
        className="rounded-full text-muted-foreground hover:text-foreground h-8 w-8"
        aria-label="Send feedback"
      >
        <MessageSquare className="h-4 w-4" aria-hidden="true" />
      </Button>
    );
  }, [trigger]);

  const resetForm = () => {
    setFeedbackType("suggestion");
    setSummary("");
    setDetails("");
    setTryingToDo("");
    setSteps("");
    setExpected("");
    setActual("");
    setContactEmail("");
  };

  const onSubmit = async () => {
    if (!summary.trim() || !details.trim()) {
      toast.error("Please add a summary and details");
      return;
    }

    setSubmitting(true);
    const payload: Record<string, unknown> = {
      summary: summary.trim(),
      details: details.trim(),
      tryingToDo: tryingToDo.trim() || undefined,
      contactEmail: contactEmail.trim() || undefined,
      context: context ?? {},
    };

    if (showBugFields) {
      payload.bug = {
        steps: steps.trim() || undefined,
        expected: expected.trim() || undefined,
        actual: actual.trim() || undefined,
      };
    }

    const result = await submitFeedback({
      pagePath,
      sectionKey: resolvedSectionKey,
      feedbackType,
      payload,
    });

    setSubmitting(false);
    if (!result.ok) {
      toast.error(`Failed to submit feedback: ${result.error}`);
      return;
    }

    toast.success("Thanks — feedback submitted");
    resetForm();
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) resetForm();
      }}
    >
      <DialogTrigger asChild>
        {triggerNode}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[640px] rounded-2xl">
        <DialogHeader>
          <DialogTitle className="font-display">Send feedback</DialogTitle>
          <DialogDescription>
            Helps improve content, AI answers, and the overall experience. Includes the current page/section automatically.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Page</Label>
              <Input value={pagePath} readOnly />
            </div>
            <div className="space-y-1.5">
              <Label>Section</Label>
              <Input value={resolvedSectionKey} readOnly />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Type</Label>
              <Select value={feedbackType} onValueChange={(v) => setFeedbackType(v as FeedbackType)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select feedback type" />
                </SelectTrigger>
                <SelectContent>
                  {FEEDBACK_TYPES.map((t) => (
                    <SelectItem key={t.id} value={t.id}>{t.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Contact email (optional)</Label>
              <Input
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="you@example.com"
                inputMode="email"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Summary</Label>
            <Input
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="One-line summary"
              maxLength={160}
            />
          </div>

          <div className="space-y-1.5">
            <Label>Details</Label>
            <Textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="What happened? What should we change?"
              className="min-h-[110px]"
            />
          </div>

          <div className="space-y-1.5">
            <Label>What were you trying to do? (optional)</Label>
            <Textarea
              value={tryingToDo}
              onChange={(e) => setTryingToDo(e.target.value)}
              placeholder="E.g. revise OCR Boolean logic, generate a quiz, ask AI to explain..."
              className="min-h-[70px]"
            />
          </div>

          {showBugFields && (
            <div className="grid gap-3 rounded-xl border border-border/50 bg-muted/20 p-3">
              <div className="text-xs font-medium text-muted-foreground">Bug details</div>
              <div className="space-y-1.5">
                <Label>Steps to reproduce</Label>
                <Textarea
                  value={steps}
                  onChange={(e) => setSteps(e.target.value)}
                  placeholder="1) ... 2) ... 3) ..."
                  className="min-h-[80px]"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Expected</Label>
                  <Textarea
                    value={expected}
                    onChange={(e) => setExpected(e.target.value)}
                    className="min-h-[70px]"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Actual</Label>
                  <Textarea
                    value={actual}
                    onChange={(e) => setActual(e.target.value)}
                    className="min-h-[70px]"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            onClick={() => void onSubmit()}
            disabled={submitting}
            className="gap-2 rounded-xl"
          >
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

