import { redirect } from "next/navigation";
import { Award, Download } from "lucide-react";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { EmptyState, PageHeader } from "@/components/portal/ui";

export default async function CertificatesPage() {
  const session = await getSession();
  if (!session?.user?.id) redirect("/login");
  const userId = session.user.id;

  // Only the student's own certificates.
  const certificates = await prisma.certificate.findMany({
    where: { studentId: userId },
    orderBy: { issuedAt: "desc" },
    select: {
      id: true,
      serial: true,
      moduleTitle: true,
      courseTitle: true,
      issuedAt: true,
    },
  });

  return (
    <div>
      <PageHeader
        title="Certificates"
        subtitle="A certificate is issued for every module you complete, alhamdulillah"
      />

      {certificates.length === 0 ? (
        <EmptyState
          icon={Award}
          title="No certificates yet"
          hint="Complete a module and your certificate will appear here."
        />
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {certificates.map((c) => (
            <div key={c.id} className="card-gold flex flex-col p-6">
              <div className="flex items-start justify-between gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold-500/20 text-gold-700">
                  <Award className="h-6 w-6" />
                </div>
                <span className="badge badge-gold">{c.serial}</span>
              </div>
              <h2 className="mt-4 text-lg leading-snug">{c.moduleTitle}</h2>
              <p className="mt-0.5 text-sm text-ink-soft">{c.courseTitle}</p>
              <p className="mt-1 text-xs font-bold uppercase tracking-wide text-gold-700">
                Awarded {formatDate(c.issuedAt)}
              </p>
              <a
                href={`/api/student/certificates/${c.id}/pdf`}
                className="btn-primary mt-5 !px-4 !py-2 text-sm"
              >
                <Download className="h-4 w-4" /> Download PDF
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
