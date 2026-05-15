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
            <header className="fixed left-0 right-0 top-4 z-40 px-4 sm:px-6 lg:px-8">
              <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3 rounded-full border border-border/70 bg-background/80 px-4 py-3 shadow-[0_20px_80px_-42px_rgba(15,23,42,0.35)] backdrop-blur-xl sm:px-5">
                <Link href="/" className="flex items-center gap-3">
                  <span className="flex size-10 items-center justify-center rounded-full border border-primary/15 bg-primary text-sm font-semibold text-primary-foreground shadow-sm shadow-primary/20">
                    S
                  </span>
                  <div className="hidden sm:block">
                    <p className="text-sm font-semibold tracking-tight">
                      SpendWise
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Finance, made simpler.
                    </p>
                  </div>
                </Link>

                <nav className="flex items-center gap-2 sm:gap-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    className="rounded-full px-4 text-sm text-muted-foreground hover:text-foreground"
                  >
                    <Link href="/">Home</Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    className="rounded-full px-4 text-sm text-muted-foreground hover:text-foreground"
                  >
                    <Link href="/dashboard">Dashboard</Link>
                  </Button>
                  <Button
                    size="sm"
                    asChild
                    className="rounded-full px-4 sm:px-5"
                  >
                    <Link href="/dashboard/add">Add Expense</Link>
                  </Button>
                  {isLoggedIn ? <LogoutButton /> : null}
                </nav>
              </div>
            </header>

            <main className="mx-auto w-full max-w-7xl flex-1 px-4 pb-6 pt-28 sm:px-6 lg:px-8 lg:pb-10 lg:pt-32">
              {children}
            </main>

            <Toaster richColors position="top-right" closeButton />
          </div>
        </div>
      </body>
    </html>
  );
}
