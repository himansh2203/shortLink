import { NextRequest, NextResponse } from "next/server";
import { getLinkByCode, deleteLink } from "@/lib/db";

// GET a link by code
export async function GET(_req: NextRequest, { params }: { params: { code: string } }) {
  const code = String(params.code ?? "");
  if (!code) return NextResponse.json({ error: "Not found" }, { status: 404 });

  try {
    const link = await getLinkByCode(code);
    if (!link) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json(link);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// DELETE a link by code
export async function DELETE(_req: NextRequest, { params }: { params: { code: string } }) {
  const code = String(params.code ?? "");
  if (!code) return NextResponse.json({ error: "Not found" }, { status: 404 });

  try {
    const success = await deleteLink(code);
    if (!success) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
