import { prisma } from "@/lib/prisma";
import { apiHandler, requireUser } from "@/lib/rbac";
import { productSchema, slugify } from "./shared";

/** Create a shop product (slug auto-generated from the name). */
export async function POST(req: Request) {
  return apiHandler(async () => {
    await requireUser("ADMIN");
    const body = productSchema.parse(await req.json());

    const base = slugify(body.name);
    let slug = base;
    for (let i = 2; await prisma.product.findUnique({ where: { slug }, select: { id: true } }); i++) {
      slug = `${base}-${i}`;
    }

    const product = await prisma.product.create({ data: { ...body, slug } });
    return { ok: true, productId: product.id, slug };
  });
}
