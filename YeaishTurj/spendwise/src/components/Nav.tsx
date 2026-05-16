"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, LayoutDashboard, PiggyBank } from "lucide-react";
import { Button } from "@/components/ui/button";
import AnimatedPrimaryButton from "@/components/ui/animated-primary-button";
import { LogoutButton } from "@/app/(auth)/logoutBtn";

export default function Nav({
  isLoggedIn,
  userEmail,
}: {
  isLoggedIn: boolean;
  userEmail: string | null;
}) {
  const username = userEmail?.split("@")[0] ?? "User";
  const avatarInitial = username.charAt(0).toUpperCase();
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
    };
  }, []);

  return (
    <nav className="flex flex-wrap items-center gap-1 sm:gap-2">
      <AnimatedPrimaryButton
        href="/dashboard/add"
        className="rounded-full px-2 text-xs sm:px-5 sm:text-sm shrink-0"
      >
        <span className="sm:hidden">Add</span>
        <span className="hidden sm:inline">Add Expense</span>
      </AnimatedPrimaryButton>

      {isLoggedIn ? (
        <div ref={dropdownRef} className="relative">
          <button
            type="button"
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((current) => !current)}
            className="flex items-center gap-2 rounded-full border border-border/70 bg-background/90 px-2 py-1.5 text-left shadow-sm backdrop-blur transition hover:border-primary/20 hover:bg-background sm:px-3"
          >
            <div className="flex size-8 items-center justify-center rounded-full bg-emerald-600 text-xs font-semibold text-white shadow-sm">
              {avatarInitial}
            </div>
            <div className="hidden max-w-32 flex-col sm:flex">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Hello
              </span>
              <span className="truncate text-sm font-semibold text-slate-950 dark:text-slate-50">
                {username}
              </span>
            </div>
            <div className="flex flex-col items-start sm:hidden">
              <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">
                {username}
              </span>
            </div>
            <ChevronDown className="size-4 text-slate-500 dark:text-slate-400" />
          </button>

          {menuOpen ? (
            <div className="absolute right-0 top-[calc(100%+0.5rem)] z-50 w-56 rounded-2xl border border-border/70 bg-background/95 p-2 shadow-[0_20px_60px_-20px_rgba(15,23,42,0.35)] backdrop-blur-xl">
              <div className="mb-2 rounded-xl bg-muted/40 px-3 py-2">
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  Signed in as
                </p>
                <p className="truncate text-sm font-semibold text-slate-950 dark:text-slate-50">
                  {username}
                </p>
              </div>

              <div className="space-y-1">
                <Button
                  variant="ghost"
                  asChild
                  className="w-full justify-start rounded-xl px-3 text-sm text-slate-700 hover:text-slate-950 dark:text-slate-300 dark:hover:text-slate-50"
                  onClick={() => setMenuOpen(false)}
                >
                  <Link href="/dashboard">
                    <LayoutDashboard className="mr-2 size-4" />
                    Dashboard
                  </Link>
                </Button>

                <Button
                  variant="ghost"
                  asChild
                  className="w-full justify-start rounded-xl px-3 text-sm text-slate-700 hover:text-slate-950 dark:text-slate-300 dark:hover:text-slate-50"
                  onClick={() => setMenuOpen(false)}
                >
                  <Link href="/dashboard/budget">
                    <PiggyBank className="mr-2 size-4" />
                    Budget
                  </Link>
                </Button>

                <div className="pt-1">
                  <LogoutButton
                    className="w-full justify-start rounded-xl px-3 text-sm"
                    onClick={() => setMenuOpen(false)}
                  />
                </div>
              </div>
            </div>
          ) : null}
        </div>
      ) : (
        <Button
          size="sm"
          asChild
          variant="outline"
          className="rounded-full px-2 text-xs sm:px-4 sm:text-sm shrink-0"
        >
          <Link href="/login">Sign In</Link>
        </Button>
      )}
    </nav>
  );
}
