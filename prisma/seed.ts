import { PrismaClient } from "../src/generated/prisma";
import newsData from "../src/data/newsData.json";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("TSASOA123", 10);

  // 1. Create organizations
  const sorsele = await prisma.organization.upsert({
    where: { slug: "sorsele" },
    update: {},
    create: { name: "Sorsele", slug: "sorsele" },
  });

  const tsa = await prisma.organization.upsert({
    where: { slug: "tarna-stensele" },
    update: {},
    create: { name: "Tärna-Stensele", slug: "tarna-stensele" },
  });

  // 2. Create superadmin
  await prisma.admin.upsert({
    where: { email: "johan.stenvall@allmskog-ac.nu" },
    update: {},
    create: {
      name: "Admin",
      email: "johan.stenvall@allmskog-ac.nu",
      passwordHash,
      organizations: { connect: [{ id: sorsele.id }, { id: tsa.id }] },
    },
  });

  // 3. Seed Sorsele members
  const sorseleMembers = [
    {
      name: "Rickard Westerberg",
      role: "Ordförande",
      address: "Bankgatan 7, 924 32 Sorsele",
      phone: "0952-55104",
      email: "",
      imageUrl: "/profile-placeholder.png",
    },
    {
      name: "Lilian Holloway",
      role: "Vice ordförande",
      address: "Box 28, 924 22 Ammarnäs",
      phone: "0952-60166",
      email: "",
      imageUrl: "/profile-placeholder.png",
    },
    {
      name: "Åke Johansson",
      role: "Ledamot",
      address: "Nyåker 201, 924 94 Sorsele",
      phone: "070-648 02 32",
      email: "",
      imageUrl: "/profile-placeholder.png",
    },
    {
      name: "Sören Långberg",
      role: "Ledamot",
      address: "Klippen 133, 924 94 Sorsele",
      phone: "0952-34026",
      email: "",
      imageUrl: "/profile-placeholder.png",
    },
    {
      name: "Annica Grundström",
      role: "Ledamot",
      address: "Strandvägen 24, 924 95 Ammarnäs",
      phone: "070-397 04 11",
      email: "",
      imageUrl: "/profile-placeholder.png",
    },
    {
      name: "Johan Stenvall",
      role: "Allmänningsförvaltare",
      address: "Tärna-Stensele & Sorsele övre allmänningsskog",
      phone: "070-3029409",
      email: "johan.stenvall@allmskog-ac.nu",
      imageUrl: "/profile-placeholder.png",
    },
  ];
  for (const member of sorseleMembers) {
    await prisma.member.create({
      data: { ...member, organizationId: sorsele.id },
    });
  }

  // 4. Seed Tärna-Stensele members (current)
  const tstaMembers = [
    {
      name: "Ulrik Dahlgren",
      role: "Ordförande",
      address: "Strandvägen 7, 923 31 Storuman",
      phone: "070-517 78 84",
      email: "",
      imageUrl: "/profile-placeholder.png",
    },
    {
      name: "Roland Johansson",
      role: "Vice ordförande",
      address: "Vargliden 2, 925 93 Hemavan",
      phone: "070-558 68 35",
      email: "",
      imageUrl: "/profile-placeholder.png",
    },
    {
      name: "Rickard Kristoffersson",
      role: "Kassör",
      address: "Rönäs 122, 925 93 Hemavan",
      phone: "0954-350 12, 070-559 46 56",
      email: "",
      imageUrl: "/profile-placeholder.png",
    },
    {
      name: "Tony Olofsson",
      role: "Ledamot",
      address: "Mosekälla 128, 925 91 Tärnaby",
      phone: "070-562 69 91",
      email: "",
      imageUrl: "/profile-placeholder.png",
    },
    {
      name: "Lovisa Bjuhr",
      role: "Ledamot",
      address: "",
      phone: "070-221 50 69",
      email: "",
      imageUrl: "/profile-placeholder.png",
    },
    {
      name: "Johan Stenvall",
      role: "Allmänningsförvaltare",
      address: "Tärna-Stensele & Sorsele övre allmänningsskog",
      phone: "070-3029409",
      email: "johan.stenvall@allmskog-ac.nu",
      imageUrl: "/profile-placeholder.png",
    },
  ];
  for (const member of tstaMembers) {
    await prisma.member.create({
      data: { ...member, organizationId: tsa.id },
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
