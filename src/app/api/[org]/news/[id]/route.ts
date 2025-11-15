import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

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

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ org: string; id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

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

  // Find existing news
  const existingNews = await prisma.news.findFirst({
    where: {
      id: Number(id),
      organizationId: organization.id,
    },
    include: { documents: true },
  });

  if (!existingNews) {
    return NextResponse.json({ error: "News not found" }, { status: 404 });
  }

  const formData = await req.formData();

  const title = (formData.get("title") as string | null) ?? existingNews.title;
  const content =
    (formData.get("content") as string | null) ?? existingNews.content;

  // href: we allow clearing it (empty string -> null)
  const hrefRaw = formData.get("href") as string | null;
  const href = hrefRaw === null ? existingNews.href : hrefRaw.trim() || null;

  const author =
    (formData.get("author") as string | null) ?? existingNews.author;

  const documentId = formData.get("documentId") as string | null;

  const image = formData.get("image") as File | null;

  // ---- Image handling (S3) ----
  let imageUrl: string | null = existingNews.image; // keep old by default

  if (image && typeof image === "object" && "arrayBuffer" in image) {
    if (image.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Image too large (max 5MB)" },
        { status: 413 }
      );
    }

    const buffer = Buffer.from(await image.arrayBuffer());
    const fileName = `${uuidv4()}_${image.name}`;
    const s3Key = `uploads/${org}/images/${fileName}`;

    try {
      await s3.send(
        new PutObjectCommand({
          Bucket: process.env.AWS_S3_BUCKET!,
          Key: s3Key,
          Body: buffer,
          ContentType: image.type || "application/octet-stream",
        })
      );
      imageUrl = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3Key}`;
    } catch (err) {
      console.error("S3 upload error:", err);
      return NextResponse.json(
        { error: "Image upload to S3 failed" },
        { status: 500 }
      );
    }
  }

  // ---- Build document update (optional) ----
  let documentsUpdate: any | undefined = undefined;

  if (documentId) {
    // Replace any existing relation with the new one
    documentsUpdate = {
      set: [{ id: Number(documentId) }],
    };
  }
  // If no documentId in formData, we simply leave documents unchanged

  const updatedNews = await prisma.news.update({
    where: { id: existingNews.id },
    data: {
      title,
      content,
      href,
      author,
      image: imageUrl,
      ...(documentsUpdate && { documents: documentsUpdate }),
    },
    include: { documents: true },
  });

  return NextResponse.json({ success: true, news: updatedNews, imageUrl });
}
