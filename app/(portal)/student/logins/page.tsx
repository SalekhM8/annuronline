import { redirect } from "next/navigation";
import { History } from "lucide-react";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatDateTime } from "@/lib/utils";
import { EmptyState, PageHeader } from "@/components/portal/ui";

/** Crude user-agent parse: browser + OS is all we need for the itemised list. */
function parseDevice(ua: string | null): string {
  if (!ua) return "Unknown device";
  const browser = /Edg\//.test(ua)
    ? "Edge"
    : /OPR\/|Opera/.test(ua)
      ? "Opera"
      : /Chrome\//.test(ua)
        ? "Chrome"
        : /Firefox\//.test(ua)
          ? "Firefox"
          : /Safari\//.test(ua)
            ? "Safari"
            : "Browser";
  const os = /Windows/.test(ua)
    ? "Windows"
    : /iPhone|iPad|iPod/.test(ua)
      ? "iOS"
      : /Android/.test(ua)
        ? "Android"
        : /Mac OS X|Macintosh/.test(ua)
          ? "macOS"
          : /Linux/.test(ua)
            ? "Linux"
            : "Unknown OS";
  return `${browser} on ${os}`;
}

function approxDuration(loggedInAt: Date, lastSeenAt: Date): string {
  const mins = Math.max(0, Math.round((lastSeenAt.getTime() - loggedInAt.getTime()) / 60000));
  if (mins < 1) return "< 1 min";
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h > 0 ? `${h}h ${m}m` : `${m} min${m > 1 ? "s" : ""}`;
}

export default async function LoginsPage() {
  const session = await getSession();
  if (!session?.user?.id) redirect("/login");
  const userId = session.user.id;

  // Only the student's own login history, newest first, capped at 100.
  const events = await prisma.loginEvent.findMany({
    where: { userId },
    orderBy: { loggedInAt: "desc" },
    take: 100,
    select: { id: true, loggedInAt: true, lastSeenAt: true, userAgent: true },
  });

  return (
    <div>
      <PageHeader
        title="Login history"
        subtitle="An itemised record of every sign-in to your account (most recent 100)"
      />

      {events.length === 0 ? (
        <EmptyState icon={History} title="No logins recorded yet" />
      ) : (
        <div className="card table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Logged in at</th>
                <th>Last activity</th>
                <th>Approx. duration</th>
                <th>Device</th>
              </tr>
            </thead>
            <tbody>
              {events.map((e) => (
                <tr key={e.id}>
                  <td className="font-semibold text-green-900">{formatDateTime(e.loggedInAt)}</td>
                  <td>{formatDateTime(e.lastSeenAt)}</td>
                  <td>{approxDuration(e.loggedInAt, e.lastSeenAt)}</td>
                  <td>{parseDevice(e.userAgent)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
