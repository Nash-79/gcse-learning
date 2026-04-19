import { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useGetProgress } from "@/hooks/useTopics";
import {
  LEADERBOARD_UPDATE_EVENT,
  buildLeaderboardEntry,
  getLeaderboardSyncSignature,
  hasLeaderboardActivity,
  type LeaderboardRow,
} from "@/lib/leaderboard";
import { appLog } from "@/lib/appLogger";

const DEFAULT_LIMIT = 5;

function getLeaderboardSyncStorageKey(userId: string) {
  return `pylearn-leaderboard-sync:${userId}`;
}

export function useLeaderboard(limit: number | null = DEFAULT_LIMIT) {
  const [entries, setEntries] = useState<LeaderboardRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function fetchLeaderboard() {
      setLoading(true);
      setError(null);

      const baseQuery = supabase
        .from("leaderboard_scores")
        .select("*")
        .order("total_xp", { ascending: false })
        .order("completed_topics", { ascending: false })
        .order("gold_topics", { ascending: false })
        .order("updated_at", { ascending: true });

      const query = limit === null ? baseQuery : baseQuery.limit(limit);
      const { data, error: fetchError } = await query;

      if (!active) return;

      if (fetchError) {
        setEntries([]);
        setError(fetchError.message);
      } else {
        setEntries((data || []) as LeaderboardRow[]);
      }

      setLoading(false);
    }

    void fetchLeaderboard();
    const handleLeaderboardUpdate = () => {
      void fetchLeaderboard();
    };
    window.addEventListener(LEADERBOARD_UPDATE_EVENT, handleLeaderboardUpdate);

    return () => {
      active = false;
      window.removeEventListener(LEADERBOARD_UPDATE_EVENT, handleLeaderboardUpdate);
    };
  }, [limit]);

  return { entries, loading, error };
}

export function useLeaderboardSync() {
  const { user, loading: authLoading } = useAuth();
  const { data: progress } = useGetProgress();
  const lastSyncedRef = useRef<string | null>(null);
  const syncSignature = useMemo(
    () => (progress ? getLeaderboardSyncSignature(progress) : null),
    [progress],
  );

  useEffect(() => {
    if (!user) {
      lastSyncedRef.current = null;
      return;
    }

    const stored = sessionStorage.getItem(getLeaderboardSyncStorageKey(user.id));
    lastSyncedRef.current = stored;
  }, [user?.id]);

  useEffect(() => {
    if (authLoading || !user || !progress || !syncSignature) return;
    if (!hasLeaderboardActivity(progress)) return;
    if (lastSyncedRef.current === syncSignature) return;

    let cancelled = false;

    async function syncLeaderboard() {
      const payload = {
        user_id: user.id,
        ...buildLeaderboardEntry(progress),
      };

      const { error } = await supabase
        .from("leaderboard_scores")
        .upsert(payload, { onConflict: "user_id" });

      if (cancelled) return;

      if (error) {
        void appLog({
          event_type: "api_error",
          origin: "useLeaderboardSync.syncLeaderboard",
          message: error.message,
          details: { userId: user.id },
          severity: "warning",
        });
        return;
      }

      lastSyncedRef.current = syncSignature;
      sessionStorage.setItem(getLeaderboardSyncStorageKey(user.id), syncSignature);
      window.dispatchEvent(new Event(LEADERBOARD_UPDATE_EVENT));
    }

    void syncLeaderboard();

    return () => {
      cancelled = true;
    };
  }, [authLoading, progress, syncSignature, user]);
}
