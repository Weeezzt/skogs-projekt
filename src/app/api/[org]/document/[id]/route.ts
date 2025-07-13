import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

export async function GET(
  req: NextRequest,
  context: { params: { org: string; id: string } }
) {
  const { id } = context.params;

  const document = await prisma.document.findUnique({
    where: { id: Number(id) },
  });

  if (!document) {
    return NextResponse.json({ error: "Document not found" }, { status: 404 });
  }

  return NextResponse.json(document);
}
