"use client";

import { supabase } from "@/lib/supabase/browser";
import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();

  const logout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <button onClick={logout} className="bg-red-500 text-white px-3 py-1">
      Logout
    </button>
  );
}
