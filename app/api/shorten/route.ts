import { NextRequest, NextResponse } from "next/server";
import { createShortenedUrl } from "@/lib/shortener";

export async function POST(request: NextRequest) {
  try {
    const { originalUrl, customCode } = await request.json();
    const shortenedUrl = await createShortenedUrl(originalUrl, customCode);
    return NextResponse.json(shortenedUrl, { status: 201 });
  } catch (err) {
    // TypeScript: 'err' is unknown, narrow safely to string message
    const message = err instanceof Error ? err.message : String(err);
    const code = (err as any)?.code;
    const status =
      code === "INVALID_URL" ? 400 :
      code === "INVALID_CODE" ? 400 :
      code === "EXISTS" ? 409 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
