import { NextResponse } from "next/server";
import { getLinkByCode, deleteLink } from "@/lib/db";

export async function GET(
  _req: Request,
  context: { params: { code: string } } // <- type-safe
) {
  const { code } = context.params;
  if (!code) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const link = await getLinkByCode(code);
  if (!link) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json(link);
}

export async function DELETE(
  _req: Request,
  context: { params: { code: string } } // <- type-safe
) {
  const { code } = context.params;
  if (!code) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const success = await deleteLink(code);
  if (!success) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({ ok: true });
}
