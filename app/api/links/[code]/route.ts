import { NextResponse } from "next/server";
import { getLinkByCode, deleteLink } from "@/lib/db";

export async function GET(
  req: Request,
  context: { params: Promise<{ code: string }> }
) {
  const params = await context.params;
  const code = String(params.code);
  if (!code) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const link = await getLinkByCode(code);
  if (!link) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(link);
}

export async function DELETE(
  req: Request,
  context: { params: Promise<{ code: string }> }
) {
  const params = await context.params;
  const code = String(params.code);
  if (!code) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const success = await deleteLink(code);
  if (!success) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
