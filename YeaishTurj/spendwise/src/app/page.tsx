import Link from "next/link";
import {
  ArrowUpRight,
  BarChart3,
  ShieldCheck,
  Sparkles,
  Wallet,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatCurrency } from "@/lib/formatCurrency";

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

export default function Home() {
  return (
    <div className="space-y-14 lg:space-y-20">
      <section className="grid items-center gap-12 lg:grid-cols-[1.08fr_0.92fr] lg:gap-16">
        <div className="space-y-7">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-background/80 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground shadow-sm backdrop-blur">
            <Sparkles className="size-3.5 text-emerald-500" /> Finance, made
            simpler
          </div>

          <div className="space-y-5">
            <h1 className="max-w-2xl text-4xl font-semibold leading-[1.02] tracking-tight text-balance sm:text-5xl lg:text-6xl xl:text-[4.5rem]">
              Take Control of Your Finances
            </h1>
            <p className="max-w-xl text-base leading-8 text-muted-foreground sm:text-lg">
              Track expenses, analyze spending, and manage budgets with a modern
              finance dashboard.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button size="lg" asChild className="rounded-full px-6 sm:px-7">
              <Link href="/signup">Create Free Account</Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              asChild
              className="rounded-full px-6 sm:px-7"
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
                    <p className="text-sm font-semibold">{item.title}</p>
                    <p className="text-sm text-muted-foreground">
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
            <CardDescription className="max-w-md text-sm leading-7">
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
                <span className="font-medium">Spending momentum</span>
                <span className="text-muted-foreground">72% healthy</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-background">
                <div className="h-full w-[72%] rounded-full bg-linear-to-r from-emerald-500 via-blue-500 to-sky-500" />
              </div>
              <p className="text-sm leading-6 text-muted-foreground">
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
            <CardTitle>Premium feel</CardTitle>
            <CardDescription>
              Sharper spacing and calmer surfaces.
            </CardDescription>
          </CardHeader>
        </Card>
        <Card className="border-border/70 bg-background/80 shadow-sm backdrop-blur">
          <CardHeader>
            <CardTitle>Fast overview</CardTitle>
            <CardDescription>
              Important numbers stay visible first.
            </CardDescription>
          </CardHeader>
        </Card>
        <Card className="border-border/70 bg-background/80 shadow-sm backdrop-blur">
          <CardHeader>
            <CardTitle>Portfolio-ready</CardTitle>
            <CardDescription>
              Looks finished, not like a class project.
            </CardDescription>
          </CardHeader>
        </Card>
      </section>
    </div>
  );
}
