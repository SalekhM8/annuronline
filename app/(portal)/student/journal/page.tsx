import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatDate, formatDateTime } from "@/lib/utils";
import { PageHeader } from "@/components/portal/ui";
import JournalClient, { type JournalEntryDto } from "@/components/student/JournalClient";

export default async function JournalPage() {
  const session = await getSession();
  if (!session?.user?.id) redirect("/login");
  const userId = session.user.id;

  // Only the student's own entries.
  const entries = await prisma.journalEntry.findMany({
    where: { studentId: userId },
    orderBy: { entryDate: "desc" },
    select: {
      id: true,
      title: true,
      content: true,
      entryDate: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  const dtos: JournalEntryDto[] = entries.map((e) => ({
    id: e.id,
    title: e.title,
    content: e.content,
    entryDate: e.entryDate.toISOString(),
    entryDateLabel: formatDate(e.entryDate),
    updatedAtLabel: formatDateTime(e.updatedAt),
    // small tolerance so the automatic updatedAt on create doesn't count
    wasEdited: e.updatedAt.getTime() - e.createdAt.getTime() > 5000,
  }));

  return (
    <div>
      <PageHeader
        title="Learning journal"
        subtitle="Your personal study notes — private to you, and always editable"
      />
      <JournalClient entries={dtos} />
    </div>
  );
}
