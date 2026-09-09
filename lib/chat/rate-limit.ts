const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 20;

/**
 * Soft per-userId rate limit. Serverless instances do not share this Map, so
 * this is a best-effort guard — not a hard multi-instance limit.
 */
const buckets = new Map<string, number[]>();

export function checkChatRateLimit(userId: string): boolean {
  const now = Date.now();
  const recent = (buckets.get(userId) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_REQUESTS) {
    buckets.set(userId, recent);
    return false;
  }
  recent.push(now);
  buckets.set(userId, recent);
  return true;
}
