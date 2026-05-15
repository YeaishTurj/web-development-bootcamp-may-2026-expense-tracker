"use server";

import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

export async function setBudget(amount: number, currency = "BDT") {
  const supabase = await createClient();

  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    throw new Error("Unauthorized");
  }

  const budgetDelegate = (
    prisma as unknown as {
      budget?: {
        findFirst: (args: {
          where: { userId: string };
        }) => Promise<{ id: string; currency?: string } | null>;
        update: (args: {
          where: { id: string };
          data: { amount: number; currency: string };
        }) => Promise<unknown>;
        create: (args: {
          data: { amount: number; currency: string; userId: string };
        }) => Promise<unknown>;
      };
    }
  ).budget;

  if (!budgetDelegate) {
    throw new Error(
      "Budget model is unavailable in Prisma Client. Run `npx prisma generate` and restart the server.",
    );
  }

  const existing = await budgetDelegate.findFirst({
    where: {
      userId: data.user.id,
    },
  });

  if (existing) {
    return await budgetDelegate.update({
      where: {
        id: existing.id,
      },
      data: {
        amount,
        currency,
      },
    });
  }

  return await budgetDelegate.create({
    data: {
      amount,
      currency,
      userId: data.user.id,
    },
  });
}
