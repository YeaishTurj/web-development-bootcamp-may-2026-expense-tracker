"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/browser";
import Link from "next/link";
import { ArrowRight, Sparkles, Mail } from "lucide-react";
import AnimatedPrimaryButton from "@/components/ui/animated-primary-button";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleForgotPassword = async () => {
    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      toast.error("Failed to send reset email", { description: error.message });
      setLoading(false);
      return;
    }

    setEmailSent(true);
    toast.success("Check your email for reset link");
  };

  return (
    <div className="mx-auto flex min-h-[calc(100vh-12rem)] max-w-6xl items-center justify-center py-10">
      <div className="grid w-full gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <Card className="overflow-hidden border-border/70 bg-background/85 shadow-[0_28px_80px_-36px_rgba(15,23,42,0.42)] backdrop-blur-xl">
          <CardHeader className="space-y-4 pb-2 pt-6">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              <Mail className="size-3.5 text-blue-500" />
              Reset your password
            </div>
            <CardTitle className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Forgot Password
            </CardTitle>
            <CardDescription className="max-w-md text-base leading-7">
              Enter your email address and we'll send you a link to reset your
              password.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4 pb-6 pt-2">
            {emailSent ? (
              <div className="space-y-4">
                <div className="rounded-lg border border-border/50 bg-muted/30 p-4">
                  <p className="text-sm font-medium">Check your email</p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    We sent a password reset link to <strong>{email}</strong>.
                    Click the link to set a new password.
                  </p>
                </div>

                <div className="flex flex-col gap-2">
                  <Link
                    href="/login"
                    className="flex items-center justify-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
                  >
                    Back to login
                  </Link>
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
                    placeholder="your@email.com"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                  />
                </div>

                <AnimatedPrimaryButton
                  className="w-full rounded-full"
                  onClick={handleForgotPassword}
                  disabled={loading}
                >
                  {loading ? "Sending..." : "Send Reset Link"}
                  <ArrowRight className="size-4" />
                </AnimatedPrimaryButton>

                <p className="text-center text-sm text-muted-foreground">
                  Remember your password?{" "}
                  <Link
                    className="font-medium text-foreground underline underline-offset-4"
                    href="/login"
                  >
                    Go to login
                  </Link>
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
