import Link from "next/link";
import { Users, Search, UserPlus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { PageHeader, EmptyState } from "@/components/portal/ui";

export default async function StudentRegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";

  const students = await prisma.user.findMany({
    where: {
      role: "STUDENT",
      ...(query && {
        OR: [
          { firstName: { contains: query, mode: "insensitive" as const } },
          { lastName: { contains: query, mode: "insensitive" as const } },
          { email: { contains: query, mode: "insensitive" as const } },
        ],
      }),
    },
    orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
    take: 100,
    include: {
      enrolments: {
        where: { status: { not: "CANCELLED" } },
        include: { course: { select: { title: true } } },
      },
    },
  });

  return (
    <div>
      <PageHeader
        title="Student register"
        subtitle="Every student in the academy, with their courses and account status"
        actions={
          <Link href="/admin/students/new" className="btn btn-primary">
            <UserPlus className="h-4 w-4" /> Add student
          </Link>
        }
      />

      <form method="get" className="mb-4 flex max-w-md items-center gap-2">
        <input
          className="input"
          type="search"
          name="q"
          defaultValue={query}
          placeholder="Search by name or email…"
        />
        <button type="submit" className="btn btn-outline">
          <Search className="h-4 w-4" /> Search
        </button>
      </form>

      {students.length === 0 ? (
        <EmptyState
          icon={Users}
          title={query ? "No students match your search" : "No students yet"}
          hint={query ? "Try a different name or email." : "Use “Add student” to register the first student."}
        />
      ) : (
        <div className="card table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Courses enrolled</th>
                <th>Status</th>
                <th>Guardian</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s.id}>
                  <td>
                    <Link href={`/admin/students/${s.id}`} className="font-bold text-green-800 hover:underline">
                      {s.firstName} {s.lastName}
                    </Link>
                    {s.isChild && (
                      <span className="badge badge-gold ml-2">Child</span>
                    )}
                  </td>
                  <td>{s.email}</td>
                  <td>{s.enrolments.map((e) => e.course.title).join(", ") || "—"}</td>
                  <td>
                    {s.lockedAt ? (
                      <span className="badge badge-red">Locked</span>
                    ) : s.isActive ? (
                      <span className="badge badge-ok">Active</span>
                    ) : (
                      <span className="badge badge-neutral">Inactive</span>
                    )}
                  </td>
                  <td>{s.isChild ? s.guardianName ?? "—" : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {students.length === 100 && (
        <p className="mt-2 text-xs text-ink-soft">Showing the first 100 students — refine your search to narrow the list.</p>
      )}
    </div>
  );
}
