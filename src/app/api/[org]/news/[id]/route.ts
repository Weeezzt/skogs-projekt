import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

export async function GET(
  req: NextRequest,
  { params }: { params: { org: string; id: string } }
) {
  const { org, id } = params;

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
