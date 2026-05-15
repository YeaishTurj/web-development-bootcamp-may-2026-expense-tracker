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
    <Button
      variant="destructive"
      size="sm"
      onClick={logout}
      disabled={loading}
      className="text-xs sm:text-sm px-2 sm:px-3 flex-shrink-0"
    >
      <LogOut className="size-3 sm:size-4" />
      <span className="hidden sm:inline ml-1">
        {loading ? "Signing out..." : "Logout"}
      </span>
      <span className="sm:hidden">{loading ? "..." : "Out"}</span>
    </Button>
  );
}
