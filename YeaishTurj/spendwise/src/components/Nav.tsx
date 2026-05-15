"use client";

import Link from "next/link";
import React from "react";
import { Button } from "@/components/ui/button";
import AnimatedPrimaryButton from "@/components/ui/animated-primary-button";
import { LogoutButton } from "@/app/(auth)/logoutBtn";

export default function Nav({ isLoggedIn }: { isLoggedIn: boolean }) {
  return (
    <nav className="flex items-center gap-1 sm:gap-2 flex-wrap">
      <Button
        variant="ghost"
        size="sm"
        asChild
        className="rounded-full px-2 sm:px-4 text-xs sm:text-sm text-muted-foreground hover:text-foreground flex-shrink-0"
      >
        <Link href="/">Home</Link>
      </Button>

      <Button
        variant="ghost"
        size="sm"
        asChild
        className="rounded-full px-2 sm:px-4 text-xs sm:text-sm text-muted-foreground hover:text-foreground flex-shrink-0"
      >
        <Link href="/dashboard">
          <span className="sm:hidden">Dash</span>
          <span className="hidden sm:inline">Dashboard</span>
        </Link>
      </Button>

      <AnimatedPrimaryButton
        href="/dashboard/add"
        className="rounded-full px-2 sm:px-5 text-xs sm:text-sm flex-shrink-0"
      >
        <span className="sm:hidden">Add</span>
        <span className="hidden sm:inline">Add Expense</span>
      </AnimatedPrimaryButton>

      {isLoggedIn ? (
        <LogoutButton />
      ) : (
        <Button
          size="sm"
          asChild
          variant="outline"
          className="rounded-full px-2 sm:px-4 text-xs sm:text-sm flex-shrink-0"
        >
          <Link href="/login">Sign In</Link>
        </Button>
      )}
    </nav>
  );
}
