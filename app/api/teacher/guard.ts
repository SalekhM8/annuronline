import type { Role } from "@prisma/client";
import { ApiError } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";

/**
 * Assert the class group exists and belongs to this teacher
 * (admins bypass the ownership check). Returns the group.
 */
export async function requireOwnGroup(user: { id: string; role: Role }, classGroupId: string) {
  const group = await prisma.classGroup.findUnique({
    where: { id: classGroupId },
    select: { id: true, name: true, teacherId: true, courseId: true, isActive: true },
  });
  if (!group) throw new ApiError(404, "Class not found");
  if (user.role !== "ADMIN" && group.teacherId !== user.id) {
    throw new ApiError(403, "This class is not assigned to you");
  }
  return group;
}
