import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { parseMemberInput } from "@/lib/memberInput";

type Ctx = { params: Promise<{ org: string; id: string }> };

// Resolves the member only if it belongs to the org in the URL
async function findMember({ params }: Ctx) {
  const { org, id } = await params;
  const memberId = Number(id);
  if (!Number.isInteger(memberId)) return null;
  return prisma.member.findFirst({
    where: { id: memberId, organization: { slug: org } },
    select: { id: true },
  });
}

export async function PUT(req: NextRequest, ctx: Ctx) {
  if (!(await getServerSession(authOptions))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const member = await findMember(ctx);
  if (!member) {
    return NextResponse.json({ error: "Member not found" }, { status: 404 });
  }
  const data = parseMemberInput(await req.json().catch(() => null));
  if (!data) {
    return NextResponse.json(
      { error: "Name and role are required" },
      { status: 400 }
    );
  }
  const updated = await prisma.member.update({
    where: { id: member.id },
    data,
  });
  return NextResponse.json(updated);
}

export async function DELETE(_req: NextRequest, ctx: Ctx) {
  if (!(await getServerSession(authOptions))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const member = await findMember(ctx);
  if (!member) {
    return NextResponse.json({ error: "Member not found" }, { status: 404 });
  }
  await prisma.member.delete({ where: { id: member.id } });
  return NextResponse.json({ success: true });
}
