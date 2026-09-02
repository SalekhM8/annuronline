import { redirect } from "next/navigation";
import { getSession, roleHome } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import SessionProvider from "@/components/portal/SessionProvider";
import PortalShell from "@/components/portal/PortalShell";
import LockedScreen from "@/components/portal/LockedScreen";

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session?.user?.id) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, role: true, isActive: true, lockedAt: true, lockReason: true, firstName: true, lastName: true },
  });
  if (!user || !user.isActive) redirect("/login");

  // Opportunistically extend the latest login event (for itemised durations)
  const latest = await prisma.loginEvent.findFirst({
    where: { userId: user.id },
    orderBy: { loggedInAt: "desc" },
    select: { id: true, loggedInAt: true },
  });
  if (latest && Date.now() - latest.loggedInAt.getTime() < 12 * 60 * 60 * 1000) {
    await prisma.loginEvent.update({ where: { id: latest.id }, data: { lastSeenAt: new Date() } });
  }

  const roleLabel =
    user.role === "ADMIN" ? "Admin" : user.role === "TEACHER" ? "Teacher portal" : "Student portal";

  // Fee lock: students see only the locked screen (client requirement)
  const content =
    user.role === "STUDENT" && user.lockedAt ? <LockedScreen reason={user.lockReason} /> : children;

  return (
    <SessionProvider>
      <PortalShell
        role={user.role}
        userName={`${user.firstName} ${user.lastName}`}
        roleLabel={roleLabel}
      >
        {content}
      </PortalShell>
    </SessionProvider>
  );
}

export const dynamic = "force-dynamic";
