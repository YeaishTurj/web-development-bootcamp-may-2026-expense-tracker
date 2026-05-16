import Link from "next/link";
import {
  ArrowUpRight,
  BarChart3,
  ShieldCheck,
  Sparkles,
  Wallet,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import AnimatedPrimaryButton from "@/components/ui/animated-primary-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatCurrency } from "@/lib/formatCurrency";
import { createClient } from "@/lib/supabase/server";

const highlights = [
  {
    icon: Wallet,
    title: "Track cash flow",
    description: "See income, expenses, and balance at a glance.",
  },
  {
    icon: BarChart3,
    title: "Spot spending patterns",
    description: "Turn every transaction into a clearer monthly view.",
  },
  {
    icon: ShieldCheck,
    title: "Built for real use",
    description: "Auth, database, and deployment already wired together.",
  },
];

export default async function Home() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  const isLoggedIn = !!data.user;
  return (
    <div className="space-y-14 lg:space-y-20">
      <section className="grid items-center gap-12 lg:grid-cols-[1.08fr_0.92fr] lg:gap-16">
        <div className="space-y-7">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-background/80 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-600 shadow-sm backdrop-blur dark:text-slate-300">
            <Sparkles className="size-3.5 text-emerald-500" /> Finance, made
            simpler
          </div>

          <div className="space-y-5">
            <h1 className="max-w-2xl text-4xl font-semibold leading-[1.02] tracking-tight text-balance text-slate-950 sm:text-5xl lg:text-6xl xl:text-[4.5rem] dark:text-slate-50">
              Take Control of Your{" "}
              <span className="text-sky-600 dark:text-sky-400">Finances</span>
            </h1>
            <p className="max-w-xl text-base leading-8 text-slate-600 sm:text-lg dark:text-slate-300">
              Track expenses, analyze spending, and manage budgets with a modern
              finance dashboard.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            {!isLoggedIn && (
              <AnimatedPrimaryButton className="rounded-full px-6 sm:px-7">
                <Link href="/signup">Create Free Account</Link>
              </AnimatedPrimaryButton>
            )}
            <Button
              size="lg"
              asChild
              className="rounded-full border border-slate-900/10 bg-slate-950 px-6 text-white shadow-[0_18px_40px_-18px_rgba(15,23,42,0.42)] transition hover:bg-slate-800 hover:shadow-[0_22px_50px_-16px_rgba(15,23,42,0.48)] sm:px-7 dark:bg-slate-50 dark:text-slate-950 dark:hover:bg-slate-200"
            >
              <Link href="/dashboard">
                View Dashboard
                <ArrowUpRight className="size-4" />
              </Link>
            </Button>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {highlights.map((item) => (
              <Card
                key={item.title}
                size="sm"
                className="border-border/70 bg-background/75 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.38)] backdrop-blur-xl"
              >
                <CardContent className="flex h-full items-start gap-3 p-4">
                  <div className="flex size-10 items-center justify-center rounded-2xl border border-primary/10 bg-primary/5 text-primary">
                    <item.icon className="size-4" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-slate-950 dark:text-slate-50">
                      {item.title}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      {item.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <Card className="overflow-hidden border-border/70 bg-background/85 shadow-[0_32px_90px_-32px_rgba(15,23,42,0.42)] backdrop-blur-xl">
          <CardHeader className="pb-3 pt-6">
            <div className="mb-2 inline-flex w-fit items-center gap-2 rounded-full border border-border/70 bg-muted/50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              <span className="size-2 rounded-full bg-emerald-500" /> Live
              preview
            </div>
            <CardTitle className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Analytics preview
            </CardTitle>
            <CardDescription className="max-w-md text-sm leading-7 text-slate-600 dark:text-slate-300">
              A quick snapshot of how the dashboard presents your money.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5 pb-6">
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-emerald-500/15 bg-linear-to-br from-emerald-500/12 to-background p-4 shadow-sm">
                <p className="text-xs font-medium text-emerald-700">Balance</p>
                <p className="mt-2 text-2xl font-semibold tracking-tight">
                  {formatCurrency(8240)}
                </p>
              </div>
              <div className="rounded-2xl border border-blue-500/15 bg-linear-to-br from-blue-500/12 to-background p-4 shadow-sm">
                <p className="text-xs font-medium text-blue-700">Income</p>
                <p className="mt-2 text-2xl font-semibold tracking-tight">
                  {formatCurrency(12500)}
                </p>
              </div>
              <div className="rounded-2xl border border-rose-500/15 bg-linear-to-br from-rose-500/12 to-background p-4 shadow-sm">
                <p className="text-xs font-medium text-rose-700">Expense</p>
                <p className="mt-2 text-2xl font-semibold tracking-tight">
                  {formatCurrency(4260)}
                </p>
              </div>
            </div>

            <div className="space-y-3 rounded-2xl border border-border/70 bg-muted/25 p-4 shadow-inner">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-slate-900 dark:text-slate-50">
                  Spending momentum
                </span>
                <span className="text-slate-500 dark:text-slate-400">
                  72% healthy
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-background">
                <div className="h-full w-[72%] rounded-full bg-linear-to-r from-emerald-500 via-blue-500 to-sky-500" />
              </div>
              <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
                Clean spacing, calmer colors, and stronger hierarchy make the
                product easier to trust at a glance.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <Card className="border-border/70 bg-background/80 shadow-sm backdrop-blur">
          <CardHeader>
            <CardTitle className="text-slate-950 dark:text-slate-50">
              Premium feel
            </CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-300">
              Sharper spacing and calmer surfaces.
            </CardDescription>
          </CardHeader>
        </Card>
        <Card className="border-border/70 bg-background/80 shadow-sm backdrop-blur">
          <CardHeader>
            <CardTitle className="text-slate-950 dark:text-slate-50">
              Fast overview
            </CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-300">
              Important numbers stay visible first.
            </CardDescription>
          </CardHeader>
        </Card>
        <Card className="border-border/70 bg-background/80 shadow-sm backdrop-blur">
          <CardHeader>
            <CardTitle className="text-slate-950 dark:text-slate-50">
              Portfolio-ready
            </CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-300">
              Looks finished, not like a class project.
            </CardDescription>
          </CardHeader>
        </Card>
      </section>
    </div>
  );
}
