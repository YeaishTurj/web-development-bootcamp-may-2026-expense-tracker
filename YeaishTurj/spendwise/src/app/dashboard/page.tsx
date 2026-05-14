import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { DashboardClient } from "@/components/dashboard/dashboard-client";

type Expense = {
  id: string;
  title: string;
  amount: number;
  category: string;
  type: "income" | "expense";
  createdAt: Date;
};

export default async function Dashboard() {
  const supabase = await createClient();

  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    redirect("/login");
  }

  const expenses: Expense[] = await prisma.expense.findMany({
    where: {
      userId: data.user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const income = expenses
    .filter((e) => e.type === "income")
    .reduce((acc, curr) => acc + curr.amount, 0);

  const expense = expenses
    .filter((e) => e.type === "expense")
    .reduce((acc, curr) => acc + curr.amount, 0);

  const categoryMap: Record<string, number> = {};

  expenses.forEach((e) => {
    if (e.type === "expense") {
      categoryMap[e.category] = (categoryMap[e.category] || 0) + e.amount;
    }
  });

  const categoryData = Object.keys(categoryMap).map((key) => ({
    name: key,
    value: categoryMap[key],
  }));

  const monthlyMap: Record<string, number> = {};

  expenses.forEach((e) => {
    const month = new Date(e.createdAt).toLocaleString("default", {
      month: "short",
    });

    monthlyMap[month] = (monthlyMap[month] || 0) + e.amount;
  });

  const monthlyData = Object.keys(monthlyMap).map((key) => ({
    month: key,
    amount: monthlyMap[key],
  }));

  const balance = income - expense;

  return (
    <DashboardClient
      expenses={expenses}
      income={income}
      expense={expense}
      balance={balance}
      categoryData={categoryData}
      monthlyData={monthlyData}
    />
  );
}
