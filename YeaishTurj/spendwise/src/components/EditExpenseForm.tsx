"use client";

import { useState } from "react";
import { updateExpense } from "@/actions/expense";
import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";
import { toast } from "sonner";
import { CURRENCIES } from "@/lib/currency";

interface EditExpenseFormProps {
  expense: {
    id: string;
    title: string;
    amount: number;
    category: string;
    type: string;
    currency?: string;
  };
  onSave?: () => void;
}

export default function EditExpenseForm({
  expense,
  onSave,
}: EditExpenseFormProps) {
  const [title, setTitle] = useState(expense.title);
  const [amount, setAmount] = useState(expense.amount);
  const [category, setCategory] = useState(expense.category);
  const [type, setType] = useState(expense.type);
  const [currency, setCurrency] = useState(expense.currency || "BDT");
  const [loading, setLoading] = useState(false);

  const save = async () => {
    setLoading(true);
    try {
      const normalizedCategory = category.trim().toLowerCase();

      await updateExpense(expense.id, {
        title,
        amount: Number(amount),
        category: normalizedCategory,
        type: type as "income" | "expense",
        currency,
      });

      window.location.reload();
    } catch (error) {
      toast.error("Update failed", {
        description: "Failed to update expense",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 pt-1">
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Title</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="h-10 w-full rounded-xl border border-border/70 bg-background px-3 text-sm shadow-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20"
          placeholder="Expense name"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Amount</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="h-10 w-full rounded-xl border border-border/70 bg-background px-3 text-sm shadow-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20"
          placeholder="0"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Category</label>
        <input
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="h-10 w-full rounded-xl border border-border/70 bg-background px-3 text-sm shadow-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20"
          placeholder="e.g. Food"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Type</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="h-10 w-full rounded-xl border border-border/70 bg-background px-3 text-sm shadow-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20"
        >
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Currency</label>
        <select
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          className="h-10 w-full rounded-xl border border-border/70 bg-background px-3 text-sm shadow-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20"
        >
          {CURRENCIES.map((curr) => (
            <option key={curr.code} value={curr.code}>
              {curr.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex gap-2 pt-2">
        <Button onClick={save} disabled={loading} className="w-full">
          {loading ? "Saving..." : "Save"}
        </Button>
        <DialogClose asChild>
          <Button variant="outline" className="w-full">
            Cancel
          </Button>
        </DialogClose>
      </div>
    </div>
  );
}
// TypeScript fix applied
