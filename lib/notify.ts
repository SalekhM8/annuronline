import { prisma } from "@/lib/prisma";

/** In-app notification; failures never break the calling flow. */
export async function notify(userId: string, title: string, body: string, link?: string) {
  try {
    await prisma.notification.create({ data: { userId, title, body, link } });
  } catch (e) {
    console.error("notify failed:", e);
  }
}

export async function notifyMany(userIds: string[], title: string, body: string, link?: string) {
  if (userIds.length === 0) return;
  try {
    await prisma.notification.createMany({
      data: userIds.map((userId) => ({ userId, title, body, link })),
    });
  } catch (e) {
    console.error("notifyMany failed:", e);
  }
}
