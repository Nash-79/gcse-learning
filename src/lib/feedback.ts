import { supabase } from "@/integrations/supabase/client";

export type FeedbackType = "bug" | "suggestion" | "content" | "other";

export interface SubmitFeedbackInput {
  pagePath: string;
  sectionKey: string;
  feedbackType: FeedbackType;
  payload: Record<string, unknown>;
}

export async function submitFeedback(input: SubmitFeedbackInput): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id ?? null;
    const userEmail = session?.user?.email ?? null;

    const pagePath = input.pagePath?.trim() || window.location.pathname;
    const sectionKey = input.sectionKey?.trim() || "unknown";

    const clientMeta = {
      url: window.location.href,
      userAgent: navigator.userAgent,
      language: navigator.language,
      viewport: { w: window.innerWidth, h: window.innerHeight },
      createdAtClient: new Date().toISOString(),
    };

    const { error } = await supabase.from("user_feedback").insert([{
      user_id: userId,
      user_email: userEmail,
      page_path: pagePath,
      section_key: sectionKey,
      feedback_type: input.feedbackType,
      payload: { ...input.payload, client: clientMeta },
    }]);

    if (error) return { ok: false, error: error.message };
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Unknown error" };
  }
}
