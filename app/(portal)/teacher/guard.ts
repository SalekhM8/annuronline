import { redirect } from "next/navigation";
import { getSession, roleHome } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * Page-level gate for the teacher portal. TEACHER and ADMIN pass
 * (admins may inspect the teacher portal); everyone else is sent home.
 */
export async function requireTeacherPage() {
  const session = await getSession();
  const userId = session?.user?.id;
  if (!userId) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, role: true, isActive: true, firstName: true, lastName: true },
  });
  if (!user || !user.isActive) redirect("/login");
  if (user.role !== "TEACHER" && user.role !== "ADMIN") redirect(roleHome(user.role));
  return user;
}
