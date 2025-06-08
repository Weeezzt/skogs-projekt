interface ProfileCardProps {
  name: string;
  role: string;
  address: string;
  phone: string;
  email: string;
  imageUrl?: string;
}

export default function ProfileCard({
  name,
  role,
  address,
  phone,
  email,
  imageUrl,
}: ProfileCardProps) {
  return (
    <div className="bg-beige rounded-xl shadow-lg p-3 flex flex-col items-center gap-2 w-full max-w-2xs">
      <h2 className="text-xl font-bold text-[#2F5D50]">{name}</h2>
      <h3 className="text-sm text-orange font-semibold">{role}</h3>
      <p className="text-sm text-gray-600 text-center">{address}</p>
      <p className="flex items-center gap-2 text-sm text-gray-700">{phone}</p>
      <p className="flex items-center gap-2 text-sm text-gray-700">{email}</p>
    </div>
  );
}
