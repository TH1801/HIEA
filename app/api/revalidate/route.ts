import { timingSafeEqual } from "crypto";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

/** Constant-time comparison to prevent timing attacks */
function isValidSecret(
  provided: string | null,
  expected: string | undefined
): boolean {
  if (!provided || !expected) return false;
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

/** ISR revalidation webhook — triggered by Supabase on article publish */
export async function POST(request: Request) {
  if (!process.env.REVALIDATION_SECRET) {
    return NextResponse.json(
      { error: "Server misconfigured" },
      { status: 500 }
    );
  }

  try {
    const authHeader = request.headers.get("x-revalidate-secret");
    if (!isValidSecret(authHeader, process.env.REVALIDATION_SECRET)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { slug, category_slug } = body as {
      slug?: string;
      category_slug?: string;
    };

    const basePath = category_slug === "policies" ? "/policies" : "/news";

    if (slug) {
      revalidatePath(`${basePath}/${slug}`);
    }

    revalidatePath(basePath);
    revalidatePath("/");

    return NextResponse.json({ revalidated: true, slug, basePath });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
