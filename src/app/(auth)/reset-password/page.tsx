"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/browser";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Sparkles, Lock } from "lucide-react";
import AnimatedPrimaryButton from "@/components/ui/animated-primary-button";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if user has a valid session from the reset link
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        setError("Invalid or expired reset link. Please try again.");
      }
    };

    checkSession();
  }, []);

  const handleResetPassword = async () => {
    // Validation
    if (!password || !confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      toast.error("Failed to reset password", { description: error.message });
      setLoading(false);
      return;
    }

    setSuccess(true);
    toast.success("Password updated successfully!");
    setTimeout(() => {
      router.push("/login");
    }, 2000);
  };

  if (error) {
    return (
      <div className="mx-auto flex min-h-[calc(100vh-12rem)] max-w-6xl items-center justify-center py-10">
        <Card className="w-full max-w-md border-border/70 bg-background/85">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <p className="text-sm text-destructive font-medium">{error}</p>
              <Link
                href="/login"
                className="flex items-center justify-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
              >
                Back to login
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-12rem)] max-w-6xl items-center justify-center py-10">
      <div className="grid w-full gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <Card className="overflow-hidden border-border/70 bg-background/85 shadow-[0_28px_80px_-36px_rgba(15,23,42,0.42)] backdrop-blur-xl">
          <CardHeader className="space-y-4 pb-2 pt-6">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              <Lock className="size-3.5 text-yellow-500" />
              Create new password
            </div>
            <CardTitle className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Reset Password
            </CardTitle>
            <CardDescription className="max-w-md text-base leading-7">
              Enter a new password for your account. Make sure it's something
              secure.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4 pb-6 pt-2">
            {success ? (
              <div className="space-y-4">
                <div className="rounded-lg border border-border/50 bg-muted/30 p-4">
                  <p className="text-sm font-medium text-emerald-600">
                    ✓ Password updated successfully
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    You can now log in with your new password.
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">
                    New Password
                  </label>
                  <input
                    className="h-12 w-full rounded-full border border-border/70 bg-background px-4 text-sm shadow-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20"
                    placeholder="••••••••"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                  />
                  <p className="text-xs text-muted-foreground">
                    At least 6 characters
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">
                    Confirm Password
                  </label>
                  <input
                    className="h-12 w-full rounded-full border border-border/70 bg-background px-4 text-sm shadow-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20"
                    placeholder="••••••••"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={loading}
                  />
                </div>

                <AnimatedPrimaryButton
                  className="w-full rounded-full"
                  onClick={handleResetPassword}
                  disabled={loading}
                >
                  {loading ? "Updating..." : "Update Password"}
                  <ArrowRight className="size-4" />
                </AnimatedPrimaryButton>

                <p className="text-center text-sm text-muted-foreground">
                  <Link
                    className="font-medium text-foreground underline underline-offset-4"
                    href="/login"
                  >
                    Back to login
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
