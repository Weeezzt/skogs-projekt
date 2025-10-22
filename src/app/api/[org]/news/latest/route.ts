import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ org: string }> }
) {
  const { org } = await params;

  // 1) Find org
  const organization = await prisma.organization.findUnique({
    where: { slug: org },
    select: { id: true },
  });

  if (!organization) {
    return NextResponse.json(
      { error: "Organization not found" },
      { status: 404 }
    );
  }

  const latest = await prisma.news.findMany({
    where: {
      organizationId: organization.id,
    },
    orderBy: [{ publishedAt: "desc" }],
    take: 3,
    include: { documents: true },
  });

  if (!latest) {
    return NextResponse.json({ error: "No news found" }, { status: 404 });
  }

  return NextResponse.json(latest);
}
