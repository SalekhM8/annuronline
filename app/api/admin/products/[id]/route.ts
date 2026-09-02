import { prisma } from "@/lib/prisma";
import { apiHandler, requireUser, ApiError } from "@/lib/rbac";
import { productSchema } from "../shared";

/** Edit a shop product (slug is kept stable). */
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  return apiHandler(async () => {
    await requireUser("ADMIN");
    const { id } = await params;
    const body = productSchema.parse(await req.json());

    const existing = await prisma.product.findUnique({ where: { id }, select: { id: true } });
    if (!existing) throw new ApiError(404, "Product not found");

    await prisma.product.update({ where: { id }, data: body });
    return { ok: true };
  });
}
