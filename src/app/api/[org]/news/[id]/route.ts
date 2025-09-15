import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

const prisma = new PrismaClient();

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ org: string; id: string }> }
) {
  const { org, id } = await params;

  // Find organization
  const organization = await prisma.organization.findUnique({
    where: { slug: org },
  });
  if (!organization) {
    return NextResponse.json(
      { error: "Organization not found" },
      { status: 404 }
    );
  }

  // Find news by id and org
  const news = await prisma.news.findFirst({
    where: {
      id: Number(id),
      organizationId: organization.id,
    },
    include: { documents: true },
  });

  if (!news) {
    return NextResponse.json({ error: "News not found" }, { status: 404 });
  }

  return NextResponse.json(news);
}

// Real delete handler
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ org: string; id: string }> }
) {
  const { org, id } = await params;
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Find organization
  const organization = await prisma.organization.findUnique({
    where: { slug: org },
  });
  if (!organization) {
    return NextResponse.json(
      { error: "Organization not found" },
      { status: 404 }
    );
  }

  // Delete news by id and org
  await prisma.news.deleteMany({
    where: {
      id: Number(id),
      organizationId: organization.id,
    },
  });

  return NextResponse.json({ success: true });
}
