"use client";

import { useState } from "react";
import { updateExpense } from "@/actions/expense";
import { DialogClose } from "@/components/ui/dialog";

interface EditExpenseFormProps {
  expense: {
    id: string;
    title: string;
    amount: number;
    category: string;
    type: string;
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
  const [loading, setLoading] = useState(false);

  const save = async () => {
    setLoading(true);
    try {
      await updateExpense(expense.id, {
        title,
        amount: Number(amount),
        category,
        type: type as "income" | "expense",
      });

      window.location.reload();
    } catch (error) {
      alert("Failed to update expense");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium">Title</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 w-full rounded mt-1"
          placeholder="Expense name"
        />
      </div>

      <div>
        <label className="text-sm font-medium">Amount</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="border p-2 w-full rounded mt-1"
          placeholder="0"
        />
      </div>

      <div>
        <label className="text-sm font-medium">Category</label>
        <input
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border p-2 w-full rounded mt-1"
          placeholder="e.g. Food"
        />
      </div>

      <div>
        <label className="text-sm font-medium">Type</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="border p-2 w-full rounded mt-1"
        >
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
      </div>

      <div className="flex gap-2">
        <button
          onClick={save}
          disabled={loading}
          className="bg-blue-500 text-white p-2 w-full rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save"}
        </button>
        <DialogClose asChild>
          <button className="bg-gray-300 text-black p-2 w-full rounded hover:bg-gray-400">
            Cancel
          </button>
        </DialogClose>
      </div>
    </div>
  );
}
// TypeScript fix applied
