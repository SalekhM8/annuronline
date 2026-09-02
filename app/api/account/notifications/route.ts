import { prisma } from "@/lib/prisma";
import { apiHandler, requireUser } from "@/lib/rbac";

export async function GET() {
  return apiHandler(async () => {
    const user = await requireUser();
    const [items, unread] = await Promise.all([
      prisma.notification.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
        take: 15,
      }),
      prisma.notification.count({ where: { userId: user.id, isRead: false } }),
    ]);
    return { items, unread };
  });
}

/** Mark all read. */
export async function PATCH() {
  return apiHandler(async () => {
    const user = await requireUser();
    await prisma.notification.updateMany({
      where: { userId: user.id, isRead: false },
      data: { isRead: true },
    });
    return { ok: true };
  });
}
