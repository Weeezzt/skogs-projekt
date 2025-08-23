import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

// Always serve fresh
export const revalidate = 0; // or: export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ org: string }> }
) {
  const { org } = await params;

  // 1) Find organization
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

  // 2) Latest document (fallback to createdAt if needed)
  const latest = await prisma.document.findFirst({
    where: { organizationId: organization.id },
    orderBy: [{ uploadedAt: "desc" }],
  });

  if (!latest) {
    return NextResponse.json({ error: "No documents found" }, { status: 404 });
  }

  return NextResponse.json(latest);
}
