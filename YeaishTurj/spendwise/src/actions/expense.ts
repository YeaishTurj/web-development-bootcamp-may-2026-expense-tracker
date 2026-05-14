"use server";

import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

export async function addExpense(data: {
  title: string;
  amount: number;
  category: string;
  type: "income" | "expense";
}) {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) {
    throw new Error("Unauthorized");
  }

  return await prisma.expense.create({
    data: {
      ...data,
      userId: userData.user.id,
    },
  });
}

export async function deleteExpense(id: string) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    throw new Error("Unauthorized");
  }

  return await prisma.expense.delete({
    where: { id },
  });
}

export async function updateExpense(
  id: string,
  data: {
    title?: string;
    amount?: number;
    category?: string;
    type?: "income" | "expense";
  },
) {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) {
    throw new Error("Unauthorized");
  }

  return await prisma.expense.update({
    where: { id },
    data,
  });
}
