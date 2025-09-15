import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ org: string }> }
) {
  const { org } = await params;
  // Find organization by slug
  const organization = await prisma.organization.findUnique({
    where: { slug: org },
  });

  if (!organization) {
    return NextResponse.json(
      { error: "Organization not found" },
      { status: 404 }
    );
  }

  // Find folder by name and organization
  const reglementeFolder = await prisma.folder.findFirst({
    where: {
      name: "Reglemente",
      organizationId: organization.id,
    },
  });

  if (!reglementeFolder) {
    return NextResponse.json({ error: "Folder not found" }, { status: 404 });
  }

  // Get all documents in the folder that are not deleted
  const documents = await prisma.document.findFirst({
    where: {
      folderId: reglementeFolder.id,
      isDeleted: false,
    },
    orderBy: { uploadedAt: "desc" },
  });

  return NextResponse.json(documents);
}
