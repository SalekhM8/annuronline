import Link from "next/link";
import { Eye, Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { PageHeader, EmptyState } from "@/components/portal/ui";
import { formatDate } from "@/lib/utils";
import Modal from "@/components/admin/Modal";
import ObservationForm from "@/components/admin/ObservationForm";

function preview(text: string | null, max = 80): string {
  if (!text) return "—";
  return text.length > max ? `${text.slice(0, max)}…` : text;
}

export default async function ObservationsPage() {
  const [observations, teachers] = await Promise.all([
    prisma.observation.findMany({
      orderBy: { observedAt: "desc" },
      take: 100,
      include: {
        teacher: { select: { id: true, firstName: true, lastName: true } },
        observer: { select: { firstName: true, lastName: true } },
      },
    }),
    prisma.user.findMany({
      where: { role: "TEACHER", isActive: true },
      orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
      select: { id: true, firstName: true, lastName: true },
    }),
  ]);

  return (
    <div>
      <PageHeader
        title="Lesson observations"
        subtitle="Professional standards: every teacher observed at least monthly"
        actions={
          <Modal trigger={<><Plus className="h-4 w-4" /> Record observation</>} title="Record observation">
            <ObservationForm
              teachers={teachers.map((t) => ({ id: t.id, name: `${t.firstName} ${t.lastName}` }))}
            />
          </Modal>
        }
      />

      {observations.length === 0 ? (
        <EmptyState icon={Eye} title="No observations recorded yet" hint="Record the first observation to start the quality log." />
      ) : (
        <div className="card table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Teacher</th>
                <th>Observer</th>
                <th>Date</th>
                <th>Class</th>
                <th>Score</th>
                <th>Strengths</th>
                <th>Improvements</th>
              </tr>
            </thead>
            <tbody>
              {observations.map((o) => (
                <tr key={o.id}>
                  <td>
                    <Link href={`/admin/teachers/${o.teacher.id}`} className="font-bold text-green-800 hover:underline">
                      {o.teacher.firstName} {o.teacher.lastName}
                    </Link>
                  </td>
                  <td>{o.observer.firstName} {o.observer.lastName}</td>
                  <td>{formatDate(o.observedAt)}</td>
                  <td>{o.classContext ?? "—"}</td>
                  <td className="font-bold">{o.score}/{o.maxScore}</td>
                  <td className="max-w-xs text-xs">{preview(o.strengths)}</td>
                  <td className="max-w-xs text-xs">{preview(o.improvements)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
