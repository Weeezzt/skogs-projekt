import { Pencil } from "lucide-react";

interface ProfileCardProps {
  name: string;
  role: string;
  address: string;
  phone: string;
  email: string;
  imageUrl?: string;
  onEdit?: () => void; // shown only to logged-in admins
}

export default function ProfileCard({
  name,
  role,
  address,
  phone,
  email,
  onEdit,
}: ProfileCardProps) {
  return (
    <div className="bg-forest-dark border border-beige/10 rounded-xl p-4 relative flex flex-col items-center gap-2 w-full max-w-2xs">
      <h2 className="text-xl font-bold text-beige">{name}</h2>
      <h3 className="text-sm text-orange font-semibold">{role}</h3>
      <p className="text-sm text-beige/70 text-center">{address}</p>
      <p className="flex items-center gap-2 text-sm text-beige/70">{phone}</p>
      <p className="flex items-center gap-2 text-sm text-beige/70">{email}</p>
      {onEdit && (
        <button
          type="button"
          onClick={onEdit}
          aria-label={`Redigera ${name}`}
          title="Redigera"
          className="absolute top-2 right-2 rounded-md p-1.5 text-beige/50 hover:text-orange hover:bg-beige/5 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange"
        >
          <Pencil size={16} />
        </button>
      )}
    </div>
  );
}
