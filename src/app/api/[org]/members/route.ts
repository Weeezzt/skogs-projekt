import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

// Always serve fresh
export const revalidate = 0; // or: export const dynamic = "force-dynamic"

// Role priority for nicer ordering
const ROLE_ORDER = [
  "Ordförande",
  "Vice ordförande",
  "Kassör",
  "Allmänningsförvaltare",
  "Ledamot",
  "Suppleant",
];

function roleRank(role?: string | null) {
  const i = role ? ROLE_ORDER.indexOf(role) : -1;
  return i === -1 ? 999 : i;
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ org: string }> }
) {
  const { org } = await params;

  // 1) Resolve organization by slug (e.g. "sorsele-skog", "tarna-stensele")
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

  // 2) Optional filters: q (search), role
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") || "").trim();
  const role = (searchParams.get("role") || "").trim();

  // 3) Fetch members for this org (filter server-side where possible)
  const members = await prisma.member.findMany({
    where: {
      organizationId: organization.id,
      ...(role ? { role } : {}),
      ...(q
        ? {
            OR: [
              { name: { contains: q, mode: "insensitive" } },
              { role: { contains: q, mode: "insensitive" } },
              { address: { contains: q, mode: "insensitive" } },
              { phone: { contains: q, mode: "insensitive" } },
              { email: { contains: q, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    select: {
      id: true,
      name: true,
      role: true,
      address: true,
      phone: true,
      email: true,
      imageUrl: true,
      // add other fields if your model has them
    },
  });

  // 4) Sort by role priority, then name (sv locale)
  members.sort((a, b) => {
    const ra = roleRank(a.role);
    const rb = roleRank(b.role);
    if (ra !== rb) return ra - rb;
    return (a.name || "").localeCompare(b.name || "", "sv");
  });

  return NextResponse.json(members);
}
