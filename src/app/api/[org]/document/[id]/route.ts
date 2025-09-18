import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ org: string; id: string }> }
) {
  const { id, org } = await params;

  const document = await prisma.document.findFirst({
    where: {
      id: Number(id),
      organization: { slug: org },
      isDeleted: false,
    },
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
  const { id, org } = await params;
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await prisma.document.update({
    where: {
      id: Number(id),
      organization: { slug: org },
    },
    data: { isDeleted: true },
  });

  return new NextResponse(null, { status: 204 });
}
