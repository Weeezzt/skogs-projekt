import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";
import { S3Client } from "@aws-sdk/client-s3";

const prisma = new PrismaClient();

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

  const latest = await prisma.news.findFirst({
    where: {
      organizationId: organization.id,
    },
    orderBy: [{ publishedAt: "desc" }],
    include: { documents: true },
  });

  if (!latest) {
    return NextResponse.json({ error: "No news found" }, { status: 404 });
  }

  return NextResponse.json(latest);
}
