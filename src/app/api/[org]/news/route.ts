import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";
import { NewsDTO } from "@/types/dtos";
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
  const { org } = use(params);
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
    const buffer = Buffer.from(await image.arrayBuffer());
    const uploadDir = path.join(process.cwd(), "public", "uploads", org);
    await fs.promises.mkdir(uploadDir, { recursive: true });
    const fileName = `${Date.now()}_${image.name}`;
    const filePath = path.join(uploadDir, fileName);
    await writeFile(filePath, buffer);
    imageUrl = `/uploads/${org}/${fileName}`;
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

  return NextResponse.json({ success: true, news });
}
