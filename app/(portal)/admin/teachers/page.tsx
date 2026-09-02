import Link from "next/link";
import { GraduationCap, UserPlus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { PageHeader, EmptyState } from "@/components/portal/ui";
import Modal from "@/components/admin/Modal";
import TeacherAddForm from "@/components/admin/TeacherAddForm";

export default async function TeachersPage() {
  const teachers = await prisma.user.findMany({
    where: { role: "TEACHER" },
    orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
    take: 100,
    include: {
      taughtGroups: { where: { isActive: true }, select: { id: true, name: true } },
      _count: { select: { observationsAsTeacher: true } },
    },
  });

  return (
    <div>
      <PageHeader
        title="Teachers"
        subtitle="Teaching staff, their classes and professional-standards observations"
        actions={
          <Modal trigger={<><UserPlus className="h-4 w-4" /> Add teacher</>} title="Add teacher">
            <TeacherAddForm />
          </Modal>
        }
      />

      {teachers.length === 0 ? (
        <EmptyState icon={GraduationCap} title="No teachers yet" hint="Use “Add teacher” to create the first account." />
      ) : (
        <div className="card table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Classes</th>
                <th>Observations</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {teachers.map((t) => (
                <tr key={t.id}>
                  <td>
                    <Link href={`/admin/teachers/${t.id}`} className="font-bold text-green-800 hover:underline">
                      {t.firstName} {t.lastName}
                    </Link>
                  </td>
                  <td>{t.email}</td>
                  <td>{t.phone ?? "—"}</td>
                  <td>{t.taughtGroups.map((g) => g.name).join(", ") || "—"}</td>
                  <td>{t._count.observationsAsTeacher}</td>
                  <td>
                    {t.isActive ? (
                      <span className="badge badge-ok">Active</span>
                    ) : (
                      <span className="badge badge-neutral">Inactive</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
