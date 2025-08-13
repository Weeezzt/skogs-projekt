import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";
import { NewsDTO } from "@/types/dtos";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const prisma = new PrismaClient();

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
  const news: NewsDTO[] = await prisma.news.findMany({
    where: { organizationId: organization.id },
    orderBy: { publishedAt: "desc" },
    include: { documents: true }, // include related documents
  });

  return NextResponse.json(news);
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ org: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { org } = await params;
  const formData = await req.formData();
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const image = formData.get("image") as File | null;
  const author = formData.get("author") as string | null;
  const documentId = formData.get("documentId") as string | null;
  const href = formData.get("href") as string | null;

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

  let imageUrl: string | null = null;

  if (image && typeof image === "object" && "arrayBuffer" in image) {
    if (image.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Image too large (max 5MB)" },
        { status: 413 }
      );
    }
    const buffer = Buffer.from(await image.arrayBuffer());
    const fileName = `${uuidv4()}_${image.name}`;
    const s3Key = `uploads/${org}/${fileName}`;

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
      console.error("S3 upload error:", err); // <-- Add this line
      return NextResponse.json(
        { error: "Image upload to S3 failed" },
        { status: 500 }
      );
    }
  }

  const news = await prisma.news.create({
    data: {
      title,
      content,
      href,
      author,
      image: imageUrl,
      organizationId: organization.id,
    },
  });
  if (documentId) {
    await prisma.news.update({
      where: { id: news.id },
      data: {
        documents: { connect: { id: Number(documentId) } },
      },
    });
  }

  return NextResponse.json({ success: true, news, imageUrl });
}
