"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/browser";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

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

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSignup = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      toast.error("Signup failed", { description: error.message });
      setLoading(false);
      return;
    }
    // Show a confirmation indicator instructing the user to check their email
    setEmailSent(true);
    setLoading(false);
  };

  return (
    <div className="mx-auto flex min-h-[calc(100vh-12rem)] max-w-6xl items-center justify-center py-10">
      <div className="grid w-full gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <Card className="overflow-hidden border-border/70 bg-background/85 shadow-[0_28px_80px_-36px_rgba(15,23,42,0.42)] backdrop-blur-xl">
          <CardHeader className="space-y-4 pb-2 pt-6">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              <Sparkles className="size-3.5 text-sky-500" />
              Create your account
            </div>
            <CardTitle className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Sign up
            </CardTitle>
            <CardDescription className="max-w-md text-base leading-7">
              Start tracking income and expenses with a cleaner, more premium
              interface.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4 pb-6 pt-2">
            {emailSent ? (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Check your email</h3>
                <p className="text-sm text-muted-foreground">
                  We sent a confirmation link to <strong>{email}</strong>. Click
                  the link in the email to verify your account, then return to
                  the login page.
                </p>

                <div className="flex items-center gap-2">
                  <Button onClick={() => router.push("/login")} variant="ghost">
                    Go to login
                  </Button>
                </div>
              </div>
            ) : (
              <>
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
                  onClick={handleSignup}
                  disabled={loading}
                >
                  {loading ? "Creating account..." : "Create account"}
                  <ArrowRight className="size-4" />
                </AnimatedPrimaryButton>

                <p className="text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <Link
                    className="font-medium text-foreground underline underline-offset-4"
                    href="/login"
                  >
                    Login
                  </Link>
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="hidden overflow-hidden border-border/70 bg-background/75 shadow-[0_28px_80px_-36px_rgba(15,23,42,0.36)] backdrop-blur-xl lg:block">
          <CardContent className="flex h-full flex-col justify-between gap-6 p-8">
            <div className="space-y-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Simple onboarding
              </p>
              <h2 className="max-w-md text-3xl font-semibold tracking-tight xl:text-4xl">
                Build a polished finance app, not a rough demo.
              </h2>
              <p className="max-w-lg text-sm leading-7 text-muted-foreground">
                The signup page should feel as intentional as the dashboard, so
                the whole product reads like one system.
              </p>
            </div>

            <div className="space-y-3 rounded-3xl border border-border/70 bg-muted/25 p-4 text-sm text-muted-foreground shadow-inner">
              <p>• Clear spacing and labels</p>
              <p>• Same visual language as the app shell</p>
              <p>• Fast path to login after account creation</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
