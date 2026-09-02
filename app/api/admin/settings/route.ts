import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { apiHandler, requireUser } from "@/lib/rbac";

const ALLOWED_KEYS = [
  "contact_email",
  "contact_phone",
  "absence_email_enabled",
  "bank_details_text",
] as const;

const schema = z.object({
  settings: z.record(z.string(), z.string().max(5000)),
});

/** Upsert academy settings (Setting key/value rows). */
export async function POST(req: Request) {
  return apiHandler(async () => {
    await requireUser("ADMIN");
    const body = schema.parse(await req.json());

    for (const key of ALLOWED_KEYS) {
      const value = body.settings[key];
      if (value === undefined) continue;
      await prisma.setting.upsert({
        where: { key },
        create: { key, value },
        update: { value },
      });
    }
    return { ok: true };
  });
}
