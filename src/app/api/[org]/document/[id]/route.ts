import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";
import { use } from "react";

const prisma = new PrismaClient();

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; org: string }> }
) {
  const { id, org } = use(params);

  const document = await prisma.document.findUnique({
    where: { id: Number(id) },
  });

  if (!document) {
    return NextResponse.json(
      { error: "Document not found" + org },
      { status: 404 }
    );
  }

  return NextResponse.json(document);
}
