import "./globals.css";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LogoutButton } from "@/app/(auth)/logoutBtn";
import { Toaster } from "sonner";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "SpendWise",
  description: "Modern finance dashboard",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  const isLoggedIn = !!data.user;

  return (
    <html lang="en">
      <body className="bg-background text-foreground antialiased">
        <div className="relative min-h-screen overflow-hidden">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(37,99,235,0.12),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(16,185,129,0.12),_transparent_26%),linear-gradient(to_bottom,_rgba(255,255,255,0.82),_rgba(255,255,255,0.96))]" />

          <div className="relative flex min-h-screen flex-col">
            <header className="fixed left-0 right-0 top-2 z-40 px-2 sm:px-4 lg:px-8">
              <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-1 sm:gap-2 rounded-full border border-border/70 bg-background/80 px-2 sm:px-4 py-2 sm:py-3 shadow-[0_20px_80px_-42px_rgba(15,23,42,0.35)] backdrop-blur-xl">
                <Link
                  href="/"
                  className="flex items-center gap-2 sm:gap-3 flex-shrink-0"
                >
                  <span className="flex size-8 sm:size-10 items-center justify-center rounded-full border border-primary/15 bg-primary text-xs sm:text-sm font-semibold text-primary-foreground shadow-sm shadow-primary/20">
                    S
                  </span>
                  <div className="hidden sm:block">
                    <p className="text-xs sm:text-sm font-semibold tracking-tight">
                      SpendWise
                    </p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground">
                      Finance, made simpler.
                    </p>
                  </div>
                </Link>

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
                  <Button
                    size="sm"
                    asChild
                    className="rounded-full px-2 sm:px-5 text-xs sm:text-sm flex-shrink-0"
                  >
                    <Link href="/dashboard/add">
                      <span className="sm:hidden">Add</span>
                      <span className="hidden sm:inline">Add Expense</span>
                    </Link>
                  </Button>
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
              </div>
            </header>

            <main className="mx-auto w-full max-w-7xl flex-1 px-2 pb-4 pt-20 sm:px-4 sm:pb-6 sm:pt-24 lg:px-8 lg:pb-10 lg:pt-28">
              {children}
            </main>

            <Toaster richColors position="top-right" closeButton />
          </div>
        </div>
      </body>
    </html>
  );
}
