"use client";

import { useEffect, useState } from "react";
import { addExpense } from "@/actions/expense";
import { useRouter } from "next/navigation";
import { ArrowLeft, Sparkles } from "lucide-react";
import { supabase } from "@/lib/supabase/browser";
import { CURRENCIES } from "@/lib/currency";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function AddExpensePage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState<"income" | "expense">("expense");
  const [currency, setCurrency] = useState("BDT");
  const [saving, setSaving] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        router.push("/login");
      }
      setIsChecking(false);
    };
    checkAuth();
  }, [router]);

  const handleSubmit = async () => {
    setSaving(true);
    const normalizedCategory = category.trim().toLowerCase();

    await addExpense({
      title,
      amount: Number(amount),
      category: normalizedCategory,
      type,
      currency,
    });

    router.push("/dashboard");
  };

  if (isChecking) {
    return (
      <div className="mx-auto max-w-3xl">
        <div className="animate-pulse space-y-4">
          <div className="h-9 w-24 rounded-lg bg-muted/50" />
          <div className="space-y-3 rounded-lg border border-border/70 bg-background/90 p-8">
            <div className="h-8 w-48 rounded bg-muted/50" />
            <div className="h-5 w-96 rounded bg-muted/50" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <Button variant="ghost" size="sm" asChild className="mb-4">
        <a href="/dashboard">
          <ArrowLeft className="size-4" />
          Back to dashboard
        </a>
      </Button>

      <Card className="border-border/70 bg-background/90 shadow-sm backdrop-blur">
        <CardHeader className="space-y-3">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-border/70 bg-muted/40 px-3 py-1 text-xs font-medium text-muted-foreground">
            <Sparkles className="size-3.5 text-sky-500" />
            Fast transaction entry
          </div>
          <CardTitle className="text-3xl tracking-tight">Add expense</CardTitle>
          <CardDescription>
            Save a new transaction and return to the polished dashboard view.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 pb-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Title</label>
            <input
              className="h-11 w-full rounded-xl border border-border/70 bg-background px-3 text-sm shadow-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20"
              placeholder="Coffee, rent, freelance income..."
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Amount
              </label>
              <input
                className="h-11 w-full rounded-xl border border-border/70 bg-background px-3 text-sm shadow-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20"
                placeholder="0"
                type="number"
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Category
              </label>
              <input
                className="h-11 w-full rounded-xl border border-border/70 bg-background px-3 text-sm shadow-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20"
                placeholder="Food, salary, transport..."
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Type</label>
            <select
              className="h-11 w-full rounded-xl border border-border/70 bg-background px-3 text-sm shadow-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20"
              onChange={(e) => setType(e.target.value as any)}
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Currency
            </label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="h-11 w-full rounded-xl border border-border/70 bg-background px-3 text-sm shadow-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20"
            >
              {CURRENCIES.map((curr) => (
                <option key={curr.code} value={curr.code}>
                  {curr.label}
                </option>
              ))}
            </select>
          </div>

          <Button
            className="w-full sm:w-auto"
            onClick={handleSubmit}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save transaction"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
