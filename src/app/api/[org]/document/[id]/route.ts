import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ org: string; id: string }> }
) {
  const { id, org } = await params;

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

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ org: string; id: string }> }
) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const updated = await prisma.document.update({
    where: { id: Number(id) },
    data: { isDeleted: true },
  });

  return NextResponse.json(updated);
}
