"use client";

import { useState } from "react";
import { setBudget } from "@/actions/budget";
import { useRouter } from "next/navigation";
import { ArrowLeft, Sparkles } from "lucide-react";
import { CURRENCIES } from "@/lib/currency";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function BudgetPage() {
  const router = useRouter();
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("BDT");
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    await setBudget(Number(amount), currency);
    router.push("/dashboard");
  };

  return (
    <div className="mx-auto max-w-2xl">
      <Button variant="ghost" size="sm" asChild className="mb-4">
        <a href="/dashboard">
          <ArrowLeft className="size-4" />
          Back to dashboard
        </a>
      </Button>

      <Card className="border-border/70 bg-background/90 shadow-sm backdrop-blur">
        <CardHeader className="space-y-3">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-border/70 bg-muted/40 px-3 py-1 text-xs font-medium text-muted-foreground">
            <Sparkles className="size-3.5 text-emerald-500" />
            Budget planner
          </div>
          <CardTitle className="text-3xl tracking-tight">
            Set Monthly Budget
          </CardTitle>
          <CardDescription>
            Give yourself a clear spending target and track what remains.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 pb-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Budget Amount
            </label>
            <input
              type="number"
              placeholder="Enter budget"
              className="h-11 w-full rounded-xl border border-border/70 bg-background px-3 text-sm shadow-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20"
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Budget Currency
            </label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="h-11 w-full rounded-xl border border-border/70 bg-background px-3 text-sm shadow-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20"
            >
              {CURRENCIES.map((item) => (
                <option key={item.code} value={item.code}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>

          <Button onClick={save} className="w-full" disabled={saving}>
            {saving ? "Saving..." : "Save Budget"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
