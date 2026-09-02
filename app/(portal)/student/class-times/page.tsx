import { redirect } from "next/navigation";
import { CalendarDays } from "lucide-react";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { EmptyState, PageHeader } from "@/components/portal/ui";
import ClassPicker, { type ClassOption } from "@/components/student/ClassPicker";

export const dynamic = "force-dynamic";

export default async function ClassTimesPage() {
  const session = await getSession();
  if (!session?.user?.id) redirect("/login");
  const userId = session.user.id;

  const me = await prisma.user.findUniqueOrThrow({
    where: { id: userId },
    select: { isChild: true },
  });

  const enrolments = await prisma.enrolment.findMany({
    where: { studentId: userId, mode: "LIVE", status: { in: ["ACTIVE", "PENDING_PAYMENT"] } },
    include: {
      course: { select: { id: true, title: true, arabicTitle: true } },
      classGroup: { select: { id: true, type: true } },
    },
    orderBy: { startedAt: "asc" },
  });

  // Available GROUP classes per course, audience-appropriate, with seat counts
  const audiences = me.isChild ? ["CHILD", "MIXED"] : ["ADULT", "MIXED"];
  const cards = await Promise.all(
    enrolments.map(async (e) => {
      if (e.classGroup?.type === "ONE_TO_ONE") {
        return { enrolment: e, oneToOne: true as const, options: [] as ClassOption[] };
      }
      const groups = await prisma.classGroup.findMany({
        where: {
          courseId: e.course.id,
          isActive: true,
          type: "GROUP",
          audience: { in: audiences as ("CHILD" | "ADULT" | "MIXED")[] },
        },
        include: {
          teacher: { select: { firstName: true, lastName: true } },
          _count: {
            select: { enrolments: { where: { status: { in: ["ACTIVE", "PENDING_PAYMENT"] } } } },
          },
        },
        orderBy: { name: "asc" },
      });
      const options: ClassOption[] = groups.map((g) => ({
        id: g.id,
        name: g.name,
        scheduleText: g.scheduleText,
        teacherName: g.teacher ? `${g.teacher.firstName} ${g.teacher.lastName}` : null,
        seatsLeft: g.capacity != null ? Math.max(0, g.capacity - g._count.enrolments) : null,
        current: g.id === e.classGroupId,
      }));
      return { enrolment: e, oneToOne: false as const, options };
    })
  );

  return (
    <div>
      <PageHeader
        title="Class times"
        subtitle="Choose the class times that suit you — changes take effect from your next session"
      />
      {cards.length === 0 ? (
        <EmptyState
          icon={CalendarDays}
          title="No live-class enrolments"
          hint="Distance-learning courses are studied at your own pace."
        />
      ) : (
        <div className="space-y-6">
          {cards.map(({ enrolment, oneToOne, options }) => (
            <section key={enrolment.id} className="card p-6">
              <div className="mb-4 flex items-baseline justify-between gap-3">
                <h2 className="text-xl">{enrolment.course.title}</h2>
                {enrolment.course.arabicTitle && (
                  <span className="arabic text-lg text-gold-700">{enrolment.course.arabicTitle}</span>
                )}
              </div>
              {oneToOne ? (
                <p className="text-sm text-ink-soft">
                  This is a one-to-one course — your session times are arranged personally with
                  your teacher. Message them on your board, or contact the academy, to change
                  times.
                </p>
              ) : (
                <ClassPicker enrolmentId={enrolment.id} options={options} />
              )}
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
