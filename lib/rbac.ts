import { NextResponse } from "next/server";
import type { Role } from "@prisma/client";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

/**
 * API-route guard. Returns the session user or throws ApiError.
 * Also enforces account locks: a locked/deactivated user can still
 * hold a valid JWT, so every API call re-checks the database.
 */
export async function requireUser(...roles: Role[]) {
  const session = await getSession();
  if (!session?.user?.id) throw new ApiError(401, "Not signed in");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, role: true, isActive: true, lockedAt: true, firstName: true, lastName: true, email: true },
  });
  if (!user || !user.isActive) throw new ApiError(401, "Account unavailable");
  if (roles.length > 0 && !roles.includes(user.role)) throw new ApiError(403, "Forbidden");
  return user;
}

/** Students only: throws 423 if the account is fee-locked. */
export async function requireUnlockedStudent() {
  const user = await requireUser("STUDENT");
  if (user.lockedAt) throw new ApiError(423, "Account locked — payment required");
  return user;
}

/** Wrap an API handler body; converts ApiError/zod issues to JSON responses. */
export function apiHandler<T>(fn: () => Promise<T>) {
  return fn()
    .then((data) => NextResponse.json(data))
    .catch((err) => {
      if (err instanceof ApiError) {
        return NextResponse.json({ error: err.message }, { status: err.status });
      }
      if (err?.name === "ZodError") {
        return NextResponse.json({ error: "Invalid input", issues: err.issues }, { status: 400 });
      }
      console.error("API error:", err);
      return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    });
}
