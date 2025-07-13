import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";
import { DocumentDTO } from "@/types/dtos";
import { writeFile } from "fs/promises";
import path from "path";
import fs from "fs";
import { use } from "react";

const prisma = new PrismaClient();

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ org: string }> }
) {
  const { org } = use(params);

  // Find the organization by slug
  const organization = await prisma.organization.findUnique({
    where: { slug: org },
  });

  if (!organization) {
    return NextResponse.json(
      { error: "Organization not found" },
      { status: 404 }
    );
  }

  // Fetch all news for this organization
  const docs: DocumentDTO[] = await prisma.document.findMany({
    where: { organizationId: organization.id },
    orderBy: { uploadedAt: "desc" },
  });

  return NextResponse.json(docs);
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ org: string }> }
) {
  const { org } = use(params);
  const formData = await req.formData();

  // Accept either folderId (existing) or folderName (new)
  const folderIdRaw = formData.get("folderId");
  const folderNameRaw = formData.get("folderName") as string | null;
  const files = formData.getAll("files") as File[];

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

  let folderId: number | null = null;
  let folderName: string = "";

  // If folderId is provided, fetch folder name from DB
  if (folderIdRaw) {
    folderId = Number(folderIdRaw);
    const folder = await prisma.folder.findUnique({
      where: { id: folderId },
    });
    if (!folder) {
      return NextResponse.json({ error: "Folder not found" }, { status: 400 });
    }
    folderName = folder.name;
  } else if (folderNameRaw) {
    folderName = folderNameRaw.trim();
    // Check if folder already exists for this org
    let folder = await prisma.folder.findFirst({
      where: {
        name: folderName,
        organizationId: organization.id,
      },
    });
    // If not, create it
    if (!folder) {
      folder = await prisma.folder.create({
        data: {
          name: folderName,
          organizationId: organization.id,
        },
      });
    }
    folderId = folder.id;
  }

  const createdDocs = [];

  for (const file of files) {
    const title = file.name.replace(/\.[^/.]+$/, "");
    const fileType = file.name.split(".").pop() || "";

    let filePath: string | null = null;
    if (file && typeof file === "object" && "arrayBuffer" in file) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const uploadDir = path.join(
        process.cwd(),
        "public",
        "docs",
        org,
        folderName || ""
      );
      await fs.promises.mkdir(uploadDir, { recursive: true });
      const fileName = `${Date.now()}_${file.name}`;
      const fullPath = path.join(uploadDir, fileName);
      await writeFile(fullPath, buffer);
      filePath = folderName
        ? `${org}/${folderName}/${fileName}`
        : `${org}/${fileName}`;
    }

    const document = await prisma.document.create({
      data: {
        title,
        fileType,
        path: filePath ?? "",
        category: folderName,
        folderId: folderId ?? undefined,
        // Add other fields as needed, e.g. year, description, tags
        organizationId: organization.id,
        preview: fileType === "pdf",
      },
    });

    createdDocs.push(document);
  }

  return NextResponse.json({ success: true, documents: createdDocs });
}
