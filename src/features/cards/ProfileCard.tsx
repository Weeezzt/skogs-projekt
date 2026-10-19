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
}: ProfileCardProps) {
  return (
    <div className="bg-forest-dark border border-beige/10 rounded-xl p-4 flex flex-col items-center gap-2 w-full max-w-2xs">
      <h2 className="text-xl font-bold text-beige">{name}</h2>
      <h3 className="text-sm text-orange font-semibold">{role}</h3>
      <p className="text-sm text-beige/70 text-center">{address}</p>
      <p className="flex items-center gap-2 text-sm text-beige/70">{phone}</p>
      <p className="flex items-center gap-2 text-sm text-beige/70">{email}</p>
    </div>
  );
}
