import { Inbox } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { PageHeader, EmptyState, StatusBadge } from "@/components/portal/ui";
import { formatDateTime } from "@/lib/utils";
import BookingStatusControl from "@/components/admin/BookingStatusControl";

const COUNSELLING_LABEL: Record<string, string> = {
  PERSONAL: "Personal",
  YOUTH: "Youth",
  MARRIAGE: "Marriage",
  BENEFITS_FINANCE: "Benefits & finance",
};

export default async function BookingsPage() {
  const [assessments, counselling, submissions] = await Promise.all([
    prisma.assessmentBooking.findMany({ orderBy: { createdAt: "desc" }, take: 100 }),
    prisma.counsellingBooking.findMany({ orderBy: { createdAt: "desc" }, take: 100 }),
    prisma.submission.findMany({ orderBy: { createdAt: "desc" }, take: 100 }),
  ]);

  return (
    <div>
      <PageHeader
        title="Bookings inbox"
        subtitle="Assessment bookings, counselling bookings and website enrolment applications"
      />

      <section>
        <h2 className="mb-3 text-xl">Assessment bookings</h2>
        {assessments.length === 0 ? (
          <EmptyState icon={Inbox} title="No assessment bookings" />
        ) : (
          <div className="card table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Contact</th>
                  <th>Course interest</th>
                  <th>Preferred times</th>
                  <th>Received</th>
                  <th>Status</th>
                  <th>Pipeline</th>
                </tr>
              </thead>
              <tbody>
                {assessments.map((b) => (
                  <tr key={b.id}>
                    <td>
                      <p className="font-bold text-green-900">{b.fullName}</p>
                      <p className="text-xs text-ink-soft">
                        {b.email}
                        {b.phone ? ` · ${b.phone}` : ""}
                      </p>
                      {b.notes && <p className="mt-1 max-w-xs text-xs text-ink-soft">{b.notes}</p>}
                    </td>
                    <td>{b.courseInterest ?? "—"}</td>
                    <td>{b.preferredTimes ?? "—"}</td>
                    <td>{formatDateTime(b.createdAt)}</td>
                    <td>
                      <StatusBadge status={b.status} />
                      {b.scheduledAt && (
                        <p className="mt-1 text-xs text-ink-soft">{formatDateTime(b.scheduledAt)}</p>
                      )}
                    </td>
                    <td>
                      <BookingStatusControl
                        kind="assessment"
                        bookingId={b.id}
                        status={b.status}
                        scheduledAt={b.scheduledAt ? b.scheduledAt.toISOString() : null}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="mt-8">
        <h2 className="mb-3 text-xl">Counselling bookings</h2>
        {counselling.length === 0 ? (
          <EmptyState icon={Inbox} title="No counselling bookings" />
        ) : (
          <div className="card table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Contact</th>
                  <th>Type</th>
                  <th>Method</th>
                  <th>Received</th>
                  <th>Status</th>
                  <th>Pipeline</th>
                </tr>
              </thead>
              <tbody>
                {counselling.map((b) => (
                  <tr key={b.id}>
                    <td>
                      <p className="font-bold text-green-900">{b.fullName}</p>
                      <p className="text-xs text-ink-soft">
                        {b.email}
                        {b.phone ? ` · ${b.phone}` : ""}
                      </p>
                      {b.message && <p className="mt-1 max-w-xs text-xs text-ink-soft">{b.message}</p>}
                    </td>
                    <td>
                      <span className="badge badge-green">{COUNSELLING_LABEL[b.type] ?? b.type}</span>
                    </td>
                    <td>
                      <span className="badge badge-neutral">{b.method === "IN_PERSON" ? "In person" : "Online"}</span>
                    </td>
                    <td>{formatDateTime(b.createdAt)}</td>
                    <td>
                      <StatusBadge status={b.status} />
                      {b.scheduledAt && (
                        <p className="mt-1 text-xs text-ink-soft">{formatDateTime(b.scheduledAt)}</p>
                      )}
                    </td>
                    <td>
                      <BookingStatusControl
                        kind="counselling"
                        bookingId={b.id}
                        status={b.status}
                        scheduledAt={b.scheduledAt ? b.scheduledAt.toISOString() : null}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="mt-8">
        <h2 className="mb-1 text-xl">Enrolment applications</h2>
        <p className="mb-3 text-sm text-ink-soft">
          Read-only inbox from the website forms. Convert an application by adding the student in
          the Student register.
        </p>
        {submissions.length === 0 ? (
          <EmptyState icon={Inbox} title="No applications" />
        ) : (
          <div className="space-y-2">
            {submissions.map((s) => (
              <details key={s.id} className="card p-4">
                <summary className="flex cursor-pointer flex-wrap items-center justify-between gap-2">
                  <span>
                    <span className="font-bold text-green-900">{s.fullName}</span>
                    <span className="badge badge-neutral ml-2">
                      {s.type === "ENROLLMENT" ? "Enrolment" : "Assessment"}
                    </span>
                    <span className="ml-2 text-sm text-ink-soft">{s.courses}</span>
                  </span>
                  <span className="text-xs text-ink-soft">{formatDateTime(s.createdAt)}</span>
                </summary>
                <div className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
                  <p><span className="font-bold">Email:</span> {s.email}</p>
                  <p><span className="font-bold">Phone:</span> {s.phone ?? "—"}</p>
                  <p><span className="font-bold">For whom:</span> {s.forWhom ?? "—"}</p>
                  <p><span className="font-bold">Student name:</span> {s.studentName ?? "—"}</p>
                  <p><span className="font-bold">Relationship:</span> {s.relationship ?? "—"}</p>
                  <p><span className="font-bold">Age:</span> {s.age ?? "—"}</p>
                  <p><span className="font-bold">Gender:</span> {s.gender ?? "—"}</p>
                  <p><span className="font-bold">Heard about us:</span> {s.heardAbout ?? "—"}</p>
                  <p className="sm:col-span-2"><span className="font-bold">Preferences:</span> {s.preferences ?? "—"}</p>
                  <p className="sm:col-span-2"><span className="font-bold">Comments:</span> {s.comments ?? "—"}</p>
                </div>
              </details>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
