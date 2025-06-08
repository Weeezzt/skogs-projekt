import { useSession } from "next-auth/react";

export function useUserSession() {
  const { data: session, status } = useSession();
  const isLoggedIn = status === "authenticated";
  const user = session?.user;
  const userId = user?.id;
  return { isLoggedIn, user, userId, status };
}
