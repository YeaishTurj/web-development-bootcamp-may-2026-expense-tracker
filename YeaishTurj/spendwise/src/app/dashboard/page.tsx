import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { DashboardClient } from "@/components/dashboard/dashboard-client";

type Expense = {
  id: string;
  title: string;
  amount: number;
  category: string;
  type: string;
  currency: string;
  recurring: boolean;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
};

type Budget = {
  amount: number;
  currency: string;
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

  const budgetDelegate = (
    prisma as unknown as {
      budget?: {
        findFirst: (args: {
          where: { userId: string };
        }) => Promise<Budget | null>;
      };
    }
  ).budget;

  const budget: Budget | null = budgetDelegate
    ? await budgetDelegate.findFirst({
        where: {
          userId: data.user.id,
        },
      })
    : null;

  const budgetAmount = budget?.amount || 0;

  return (
    <DashboardClient
      expenses={expenses}
      budgetAmount={budgetAmount}
      budgetCurrency={budget?.currency || "BDT"}
    />
  );
}
