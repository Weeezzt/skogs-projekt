import { useState } from "react";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { Lock, Mail } from "lucide-react";
import { signIn } from "next-auth/react"; // <-- Add this import

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (email: string, password: string) => void;
}

export default function LoginModal({
  isOpen,
  onClose,
  onSubmit,
}: LoginModalProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Use NextAuth's signIn function
    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });
    if (result?.ok) {
      onClose();
      // Optionally show a success message or reload data
    } else {
      // Optionally show an error message
      alert("Felaktig e-post eller lösenord");
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border">
          <DialogTitle className="text-xl font-semibold text-center mb-4">
            Inlogg för administratörer
          </DialogTitle>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2 rounded-xl bg-orange text-white font-semibold hover:bg-orange/90 transition cursor-pointer"
            >
              Logga in
            </button>
          </form>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
