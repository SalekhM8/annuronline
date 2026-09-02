import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/portal/ui";
import StudentAddForm from "@/components/admin/StudentAddForm";

export default async function AddStudentPage() {
  const [courses, groups] = await Promise.all([
    prisma.course.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
      select: { id: true, title: true },
    }),
    prisma.classGroup.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
      select: {
        id: true,
        courseId: true,
        name: true,
        type: true,
        monthlyFeePence: true,
        hourlyFeePence: true,
      },
    }),
  ]);

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title="Add student"
        subtitle="Creates the account, first enrolment, welcome email (direct-debit link) and portal login email"
      />
      <StudentAddForm courses={courses} groups={groups} />
    </div>
  );
}
