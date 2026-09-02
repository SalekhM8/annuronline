import { createHash } from "crypto";

/**
 * Anonymous-poll voter hash. Deterministic per (user, session) so we can
 * prevent double voting and answer "has this student already rated?",
 * but the hash is never reversible to a userId without the secret salt —
 * and no userId is ever stored alongside a LessonFeedback row.
 */
export function voterHashFor(userId: string, sessionId: string): string {
  return createHash("sha256")
    .update(`${userId}:${sessionId}:${process.env.POLL_ANON_SALT ?? ""}`)
    .digest("hex");
}
