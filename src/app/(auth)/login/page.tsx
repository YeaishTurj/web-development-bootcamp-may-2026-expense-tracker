"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/browser";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import AnimatedPrimaryButton from "@/components/ui/animated-primary-button";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast.error("Login failed", { description: error.message });
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh(); // Refresh server components to get updated auth state
  };

  return (
    <div className="mx-auto flex min-h-[calc(100vh-12rem)] max-w-6xl items-center justify-center py-10">
      <div className="grid w-full gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <Card className="overflow-hidden border-border/70 bg-background/85 shadow-[0_28px_80px_-36px_rgba(15,23,42,0.42)] backdrop-blur-xl">
          <CardHeader className="space-y-4 pb-2 pt-6">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              <Sparkles className="size-3.5 text-emerald-500" />
              Welcome back
            </div>
            <CardTitle className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Login
            </CardTitle>
            <CardDescription className="max-w-md text-base leading-7">
              Sign in to review spending, edit transactions, and keep your
              finances organized.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4 pb-6 pt-2">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">
                Email
              </label>
              <input
                className="h-12 w-full rounded-full border border-border/70 bg-background px-4 text-sm shadow-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20"
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">
                Password
              </label>
              <input
                className="h-12 w-full rounded-full border border-border/70 bg-background px-4 text-sm shadow-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20"
                type="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <AnimatedPrimaryButton
              className="w-full rounded-full"
              onClick={handleLogin}
              disabled={loading}
            >
              {loading ? "Signing in..." : "Login"}
              <ArrowRight className="size-4" />
            </AnimatedPrimaryButton>

            <div className="flex items-center justify-between text-sm">
              <Link
                className="text-muted-foreground underline underline-offset-4 transition hover:text-foreground"
                href="/forgot-password"
              >
                Forgot password?
              </Link>
              <Link
                className="font-medium text-foreground underline underline-offset-4"
                href="/signup"
              >
                Create account
              </Link>
            </div>

            <p className="text-sm text-muted-foreground">
              No account yet?{" "}
              <Link
                className="font-medium text-foreground underline underline-offset-4"
                href="/signup"
              >
                Create one
              </Link>
            </p>
          </CardContent>
        </Card>

        <Card className="hidden overflow-hidden border-border/70 bg-background/75 shadow-[0_28px_80px_-36px_rgba(15,23,42,0.36)] backdrop-blur-xl lg:block">
          <CardContent className="flex h-full flex-col justify-between gap-6 p-8">
            <div className="space-y-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Secure access
              </p>
              <h2 className="max-w-md text-3xl font-semibold tracking-tight xl:text-4xl">
                One clean place for your money overview.
              </h2>
              <p className="max-w-lg text-sm leading-7 text-muted-foreground">
                SpendWise keeps the visual tone calm and premium while the
                product handles auth, CRUD, and analytics in the background.
              </p>
            </div>

            <div className="space-y-3 rounded-3xl border border-border/70 bg-muted/25 p-4 shadow-inner">
              <div className="flex items-center gap-3 text-sm">
                <ShieldCheck className="size-4 text-emerald-600" />
                Authentication is the gateway to the dashboard.
              </div>
              <div className="flex items-center gap-3 text-sm">
                <ShieldCheck className="size-4 text-emerald-600" />
                The interface matches the rest of the polished app.
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
