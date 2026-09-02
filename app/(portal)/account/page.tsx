import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/portal/ui";
import PasswordChangeForm from "@/components/portal/PasswordChangeForm";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const session = await getSession();
  if (!session?.user?.id) redirect("/login");

  const user = await prisma.user.findUniqueOrThrow({
    where: { id: session.user.id },
    select: { firstName: true, lastName: true, email: true, role: true, createdAt: true },
  });

  return (
    <div>
      <PageHeader title="My account" subtitle="Your sign-in details" />
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="card p-6">
          <h2 className="mb-4 text-lg">Details</h2>
          <dl className="space-y-3 text-sm">
            <div>
              <dt className="font-bold text-ink-soft">Name</dt>
              <dd className="text-green-900">{user.firstName} {user.lastName}</dd>
            </div>
            <div>
              <dt className="font-bold text-ink-soft">Email</dt>
              <dd className="text-green-900">{user.email}</dd>
            </div>
            <div>
              <dt className="font-bold text-ink-soft">Role</dt>
              <dd className="text-green-900 capitalize">{user.role.toLowerCase()}</dd>
            </div>
            <div>
              <dt className="font-bold text-ink-soft">Member since</dt>
              <dd className="text-green-900">{user.createdAt.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</dd>
            </div>
          </dl>
          <p className="mt-4 text-xs text-ink-soft">
            To change your name or contact details, please contact the academy.
          </p>
        </section>
        <section className="card p-6">
          <h2 className="mb-4 text-lg">Change password</h2>
          <PasswordChangeForm />
        </section>
      </div>
    </div>
  );
}
