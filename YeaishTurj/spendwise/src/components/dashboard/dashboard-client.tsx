"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Wallet, ArrowUp, ArrowDown, Trash, Edit } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from "recharts";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { deleteExpense } from "@/actions/expense";
import EditExpenseForm from "@/components/EditExpenseForm";

interface Expense {
  id: string;
  title: string;
  amount: number;
  category: string;
  type: string;
  createdAt: Date;
}

interface DashboardClientProps {
  expenses: Expense[];
  income: number;
  expense: number;
  balance: number;
  categoryData: { name: string; value: number }[];
  monthlyData: { month: string; amount: number }[];
}

export function DashboardClient({
  expenses,
  income,
  expense,
  balance,
  categoryData,
  monthlyData,
}: DashboardClientProps) {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {/* CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Balance */}
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Balance</p>
              <h2 className="text-2xl font-bold">{balance}</h2>
            </div>
            <Wallet className="text-blue-500" />
          </CardContent>
        </Card>

        {/* Income */}
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Income</p>
              <h2 className="text-2xl font-bold text-green-500">{income}</h2>
            </div>
            <ArrowUp className="text-green-500" />
          </CardContent>
        </Card>

        {/* Expense */}
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Expense</p>
              <h2 className="text-2xl font-bold text-red-500">{expense}</h2>
            </div>
            <ArrowDown className="text-red-500" />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {/* PIE CHART */}
        <div className="p-4 border rounded">
          <h2 className="font-semibold mb-4">Expenses by Category</h2>

          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={categoryData}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
              >
                {categoryData.map((_, index) => (
                  <Cell
                    key={index}
                    fill={
                      ["#10b981", "#3b82f6", "#ef4444", "#f59e0b"][index % 4]
                    }
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="p-4 border rounded mt-6">
        <h2 className="font-semibold mb-4">Monthly Spending</h2>

        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={monthlyData}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="amount" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* TRANSACTIONS */}
      {expenses.length === 0 ? (
        <div className="text-center py-10 border rounded">
          <p className="text-muted-foreground">No transactions yet</p>
          <a href="/dashboard/add" className="text-blue-500 text-sm">
            Add your first expense
          </a>
        </div>
      ) : (
        <div className="space-y-3">
          {expenses.map((e) => (
            <Card key={e.id}>
              <CardContent className="p-4 flex justify-between items-center gap-4">
                <div>
                  <p className="font-medium">{e.title}</p>
                  <p className="text-sm text-muted-foreground">{e.category}</p>
                </div>

                <div className="flex items-center gap-3">
                  <p
                    className={
                      e.type === "expense"
                        ? "text-red-500 font-semibold"
                        : "text-green-500 font-semibold"
                    }
                  >
                    {e.type === "expense" ? "-" : "+"}
                    {e.amount.toLocaleString()}
                  </p>

                  {/* Edit Button */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <button className="text-blue-500 hover:text-blue-700">
                        <Edit size={16} />
                      </button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Expense</DialogTitle>
                      </DialogHeader>
                      <EditExpenseForm expense={e} />
                    </DialogContent>
                  </Dialog>

                  {/* Delete Button */}
                  <button
                    onClick={async () => {
                      if (confirm("Delete this expense?")) {
                        await deleteExpense(e.id);
                        window.location.reload();
                      }
                    }}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash size={16} />
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
