import ProfileCard from "@/features/cards/ProfileCard";

const members = [
  {
    name: "Rickard Westerberg",
    role: "Ordförande",
    address: "Bankgatan 7, 924 32 Sorsele",
    phone: "0952-55104",
    email: "5",
    imageUrl: "/profile-placeholder.png",
  },
  {
    name: "Lilian Holloway",
    role: "Vice ordförande",
    address: "Box 28, 924 22 Ammarnäs",
    phone: "0952-60166",
    email: "4",
    imageUrl: "/profile-placeholder.png",
  },
  {
    name: "Åke Johansson",
    role: "Ledamot",
    address: "Nyåker 201, 924 94 Sorsele",
    phone: "070-648 02 32",
    email: "3",
    imageUrl: "/profile-placeholder.png",
  },
  {
    name: "Sören Långberg",
    role: "Ledamot",
    address: "Klippen 133, 924 94 Sorsele",
    phone: "0952-34026",
    email: "2",
    imageUrl: "/profile-placeholder.png",
  },
  {
    name: "Annica Grundström",
    role: "Ledamot",
    address: "Strandvägen 24, 924 95 Ammarnäs",
    phone: "070-397 04 11",
    email: "1",
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
export default function StyrelseMedlemmarPage() {
  return (
    <main className="max-w-5xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold text-[#2F5D50] mb-8 text-center">
        Styrelse & Medlemmar
      </h1>
      <div className="flex flex-wrap justify-center gap-8">
        {members.map((member) => (
          <ProfileCard key={member.email} {...member} />
        ))}
      </div>
    </main>
  );
}
