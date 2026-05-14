"use client";

import { useState } from "react";
import { addExpense } from "@/actions/expense";

export default function AddExpensePage() {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState<"income" | "expense">("expense");

  const handleSubmit = async () => {
    await addExpense({
      title,
      amount: Number(amount),
      category,
      type,
    });

    alert("Expense added!");
  };

  return (
    <div className="p-6 space-y-3">
      <h1 className="text-xl font-bold">Add Expense</h1>

      <input placeholder="Title" onChange={(e) => setTitle(e.target.value)} />
      <input placeholder="Amount" onChange={(e) => setAmount(e.target.value)} />
      <input placeholder="Category" onChange={(e) => setCategory(e.target.value)} />

      <select onChange={(e) => setType(e.target.value as any)}>
        <option value="expense">Expense</option>
        <option value="income">Income</option>
      </select>

      <button onClick={handleSubmit}>
        Save
      </button>
    </div>
  );
}
