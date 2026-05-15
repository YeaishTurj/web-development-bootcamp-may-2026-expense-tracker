"use client";

import { supabase } from "@/lib/supabase/browser";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";

export function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const logout = async () => {
    setLoading(true);
    await supabase.auth.signOut({ scope: "local" });

    // Refresh server components (layout) so auth state updates and
    // the LogoutButton is removed without needing a manual page reload.
    try {
      router.push("/login");
    } finally {
      router.refresh();
    }
  };

  return (
    <Button variant="destructive" size="sm" onClick={logout} disabled={loading}>
      <LogOut className="size-4" />
      {loading ? "Signing out..." : "Logout"}
    </Button>
  );
}
