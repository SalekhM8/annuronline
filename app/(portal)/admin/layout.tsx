import { redirect } from "next/navigation";
import { getSession, roleHome } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/** Admin-only guard for every /admin page. */
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session?.user?.id) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true, isActive: true },
  });
  if (!user || !user.isActive) redirect("/login");
  if (user.role !== "ADMIN") redirect(roleHome(user.role));

  return <>{children}</>;
}
