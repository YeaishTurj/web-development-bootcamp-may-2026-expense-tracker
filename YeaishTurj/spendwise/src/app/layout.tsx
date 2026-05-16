import "./globals.css";
import Link from "next/link";
import Image from "next/image";
import Nav from "@/components/Nav";
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
  const userEmail = data.user?.email ?? null;

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/logo.png" sizes="512x512" />
        <link rel="apple-touch-icon" href="/logo.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#0ea5e9" />
        <meta name="msapplication-TileImage" content="/logo.png" />
      </head>
      <body className="bg-background text-foreground antialiased">
        <div className="relative min-h-screen overflow-hidden">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.12),transparent_28%),radial-gradient(circle_at_top_right,rgba(16,185,129,0.12),transparent_26%),linear-gradient(to_bottom,rgba(255,255,255,0.82),rgba(255,255,255,0.96))]" />

          <div className="relative flex min-h-screen flex-col">
            <header className="fixed left-0 right-0 top-2 z-40 px-2 sm:px-4 lg:px-8">
              <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-1 sm:gap-2 rounded-full border border-border/70 bg-background/80 glass-light px-2 sm:px-4 py-2 sm:py-3 shadow-[0_20px_80px_-42px_rgba(15,23,42,0.35)] backdrop-blur-xl">
                <Link
                  href="/"
                  className="flex items-center gap-2 sm:gap-3 shrink-0"
                >
                  <Image
                    src="/logo.png"
                    alt="SpendWise logo"
                    className="h-10 w-10 sm:h-12 sm:w-12 rounded-full object-cover"
                    width={48}
                    height={48}
                  />
                  <div className="hidden sm:block">
                    <p className="text-xs sm:text-sm font-semibold tracking-tight">
                      SpendWise
                    </p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground">
                      Finance, made simpler.
                    </p>
                  </div>
                </Link>

                <Nav isLoggedIn={isLoggedIn} userEmail={userEmail} />
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
