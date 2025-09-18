import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { DocumentDTO } from "@/types/dtos";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ org: string }> }
) {
  const { org } = await params;

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
    where: {
      organizationId: organization.id,
      isDeleted: false,
    },
    orderBy: { uploadedAt: "desc" },
  });

  return NextResponse.json(docs);
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ org: string }> }
) {
  const { org } = await params;
  const formData = await req.formData();
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  // Accept either folderId (existing) or folderName (new)
  const folderIdRaw = formData.get("folderId");
  const folderNameRaw = formData.get("folderName") as string | null;
  const files = formData.getAll("files") as File[];
  const tags = formData.getAll("tags") as string[] | null;
  if (tags?.length == 0) {
    tags.push("Standard");
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

  let folderId: number | null = null;
  let folderName: string = "";

  // If folderId is provided, fetch folder name from DB
  if (folderIdRaw) {
    folderId = Number(folderIdRaw);
    const folder = await prisma.folder.findUnique({
      where: {
        id: folderId,
        organizationId: organization.id,
      },
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

    let fileUrl: string | null = null;
    if (file && typeof file === "object" && "arrayBuffer" in file) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const fileName = `${uuidv4()}_${file.name}`;
      const s3Key = folderName
        ? `uploads/${org}/files/${folderName}/${fileName}`
        : `uploads/${org}/files/${fileName}`;

      try {
        console.log("Uploading to S3:", {
          Bucket: process.env.AWS_S3_BUCKET,
          Key: s3Key,
          ContentType: file.type,
        });
        await s3.send(
          new PutObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET!,
            Key: s3Key,
            Body: buffer,
            ContentType: file.type || "application/octet-stream",
            ContentDisposition: contentDispositionAttachment(file.name),
          })
        );
        fileUrl = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3Key}`;
      } catch (err) {
        console.error("S3 upload error:", err);
        return NextResponse.json(
          { error: "File upload to S3 failed" },
          { status: 500 }
        );
      }
    }

    const document = await prisma.document.create({
      data: {
        title,
        fileType,
        path: fileUrl ?? "",
        category: folderName,
        folderId: folderId ?? undefined,
        organizationId: organization.id,
        preview: fileType === "pdf",
        tags: tags ? { set: tags } : undefined,
      },
    });

    createdDocs.push(document);
  }

  return NextResponse.json({ success: true, documents: createdDocs });
}

function contentDispositionAttachment(filename: string) {
  const ascii = filename.replace(/["\\]/g, "_");
  const utf8 = encodeURIComponent(filename);
  return `attachment; filename="${ascii}"; filename*=UTF-8''${utf8}`;
}
