import { apiHandler, requireUser } from "@/lib/rbac";
import { generateMonthlyInvoices, sweepOverdueAndLock } from "@/lib/billing";

/** "Run monthly billing now" — same pipeline as the daily cron. Idempotent. */
export async function POST() {
  return apiHandler(async () => {
    await requireUser("ADMIN");
    const { created } = await generateMonthlyInvoices();
    const { overdue, locked } = await sweepOverdueAndLock();
    return { ok: true, created, overdue, locked };
  });
}
