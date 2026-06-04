"use client";

import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Wallet,
  ArrowUp,
  ArrowDown,
  Trash,
  Edit,
  X,
  Info,
  BarChart3,
  PieChart as PieChartIcon,
} from "lucide-react";
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
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { deleteExpense } from "@/actions/expense";
import EditExpenseForm from "@/components/EditExpenseForm";
import { CURRENCIES, getCurrencySymbol } from "@/lib/currency";
import { convertCurrency } from "@/lib/convertCurrency";
import { toast } from "sonner";

interface Expense {
  id: string;
  title: string;
  amount: number;
  category: string;
  type: string;
  currency: string;
  recurring: boolean;
  createdAt: Date;
}

interface DashboardClientProps {
  expenses: Expense[];
  budgetAmount: number;
  budgetCurrency: string;
}

export function DashboardClient({
  expenses,
  budgetAmount,
  budgetCurrency,
}: DashboardClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "income" | "expense">(
    "all",
  );
  const [displayCurrency, setDisplayCurrency] = useState("BDT");
  const now = new Date();
  const defaultMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const [selectedMonth, setSelectedMonth] = useState(defaultMonthKey);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [csvFromDate, setCsvFromDate] = useState("");
  const [csvToDate, setCsvToDate] = useState("");
  const [deletingExpenseId, setDeletingExpenseId] = useState<string | null>(
    null,
  );
  const [csvColumns, setCsvColumns] = useState({
    title: true,
    amount: true,
    category: true,
    type: true,
    createdAt: true,
  });

  const categories = useMemo(() => {
    const set = new Set<string>();
    expenses.forEach((e) => set.add(e.category));
    return ["all", ...Array.from(set)];
  }, [expenses]);

  const filteredExpenses = useMemo(() => {
    return expenses.filter((e) => {
      if (filterType !== "all" && e.type !== filterType) return false;
      if (
        selectedCategory &&
        selectedCategory !== "all" &&
        e.category !== selectedCategory
      )
        return false;
      if (
        searchQuery &&
        !e.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
        return false;
      return true;
    });
  }, [expenses, filterType, selectedCategory, searchQuery]);

  const hasActiveFilters =
    filterType !== "all" || selectedCategory !== "all" || searchQuery !== "";

  const resultsSummary =
    filteredExpenses.length === expenses.length
      ? `${filteredExpenses.length} transaction${filteredExpenses.length === 1 ? "" : "s"}`
      : `Showing ${filteredExpenses.length} of ${expenses.length} transaction${expenses.length === 1 ? "" : "s"}`;

  const resetFilters = () => {
    setFilterType("all");
    setSelectedCategory("all");
    setSearchQuery("");
  };

  const activeFilterChips = [
    searchQuery
      ? {
          label: `Search: ${searchQuery}`,
          onClear: () => setSearchQuery(""),
        }
      : null,
    selectedCategory !== "all"
      ? {
          label: `Category: ${selectedCategory}`,
          onClear: () => setSelectedCategory("all"),
        }
      : null,
    filterType !== "all"
      ? {
          label: `Type: ${filterType}`,
          onClear: () => setFilterType("all"),
        }
      : null,
  ].filter(Boolean) as { label: string; onClear: () => void }[];

  const formatDisplayAmount = (value: number) =>
    `${getCurrencySymbol(displayCurrency)}${new Intl.NumberFormat("en-US", {
      maximumFractionDigits: 0,
    }).format(value)}`;

  const displayExpenses = useMemo(
    () =>
      expenses.map((expense) => ({
        ...expense,
        displayAmount: convertCurrency(
          expense.amount,
          expense.currency,
          displayCurrency,
        ),
      })),
    [displayCurrency, expenses],
  );

  const displayBudgetAmount = convertCurrency(
    budgetAmount,
    budgetCurrency,
    displayCurrency,
  );

  // selectedMonth defaults to current month; month picking UI removed

  // Filter by current month for Balance, Income, Expense cards
  const [selYear, selMonth] = selectedMonth.split("-").map(Number);
  const currentMonthExpenses = displayExpenses.filter((e) => {
    const d = new Date(e.createdAt);
    return d.getMonth() + 1 === selMonth && d.getFullYear() === selYear;
  });

  const income = currentMonthExpenses
    .filter((expense) => expense.type === "income")
    .reduce((accumulator, current) => accumulator + current.displayAmount, 0);

  const expense = currentMonthExpenses
    .filter((expense) => expense.type === "expense")
    .reduce((accumulator, current) => accumulator + current.displayAmount, 0);

  const balance = income - expense;
  const remaining = displayBudgetAmount - expense;
  const progress =
    displayBudgetAmount > 0 ? (expense / displayBudgetAmount) * 100 : 0;

  const displayCategoryData = useMemo(() => {
    const categoryMap: Record<string, number> = {};

    displayExpenses.forEach((expense) => {
      if (expense.type === "expense") {
        categoryMap[expense.category] =
          (categoryMap[expense.category] || 0) + expense.displayAmount;
      }
    });

    return Object.keys(categoryMap).map((key) => ({
      name: key,
      value: categoryMap[key],
    }));
  }, [displayExpenses]);

  const displayMonthlyData = useMemo(() => {
    const monthlyMap: Record<string, number> = {};

    displayExpenses.forEach((expense) => {
      const month = new Date(expense.createdAt).toLocaleString("default", {
        month: "short",
      });

      monthlyMap[month] = (monthlyMap[month] || 0) + expense.displayAmount;
    });

    return Object.keys(monthlyMap).map((key) => ({
      month: key,
      amount: monthlyMap[key],
    }));
  }, [displayExpenses]);

  const topCategory = displayCategoryData.reduce(
    (accumulator, current) =>
      current.value > accumulator.value ? current : accumulator,
    { name: "—", value: 0 },
  );

  // Insights (based on selected month)
  // selectedMonthTotal is now replaced by expense (current month total)
  const budgetStatus =
    displayBudgetAmount <= 0
      ? { label: "No budget set", tone: "text-muted-foreground" }
      : progress < 70
        ? { label: "On track", tone: "text-emerald-600" }
        : progress < 100
          ? { label: "Near limit", tone: "text-amber-600" }
          : { label: "Over budget", tone: "text-rose-600" };

  // previous month relative to current month
  const prevDate = new Date(selYear, selMonth - 2, 1); // month-2 because Date months 0-indexed
  const prevMonthTotal = displayExpenses
    .filter((e) => {
      const d = new Date(e.createdAt);
      return (
        d.getMonth() === prevDate.getMonth() &&
        d.getFullYear() === prevDate.getFullYear()
      );
    })
    .reduce((sum, expense) => sum + expense.displayAmount, 0);

  // Use currentMonthExpenses total (expense) for comparison
  const percentChange =
    prevMonthTotal === 0 || displayBudgetAmount === 0
      ? 100
      : Math.round(((expense - prevMonthTotal) / prevMonthTotal) * 100);

  const currentMonthCategoryMap: Record<string, number> = {};

  displayExpenses.forEach((e) => {
    const itemDate = new Date(e.createdAt);
    if (
      e.type === "expense" &&
      itemDate.getMonth() + 1 === selMonth &&
      itemDate.getFullYear() === selYear
    ) {
      currentMonthCategoryMap[e.category] =
        (currentMonthCategoryMap[e.category] || 0) + e.displayAmount;
    }
  });

  const currentMonthTopCategory = Object.entries(
    currentMonthCategoryMap,
  ).reduce(
    (acc, [category, value]) => (value > acc.value ? { category, value } : acc),
    { category: "—", value: 0 },
  );

  const trendLabel =
    percentChange > 0
      ? `You spent ${percentChange}% more than last month.`
      : percentChange < 0
        ? `You spent ${Math.abs(percentChange)}% less than last month.`
        : "Your spending matched last month.";

  const csvReadyExpenses = useMemo(() => {
    return filteredExpenses.filter((e) => {
      const itemDate = new Date(e.createdAt);
      if (csvFromDate) {
        const from = new Date(`${csvFromDate}T00:00:00`);
        if (itemDate < from) return false;
      }
      if (csvToDate) {
        const to = new Date(`${csvToDate}T23:59:59`);
        if (itemDate > to) return false;
      }
      return true;
    });
  }, [filteredExpenses, csvFromDate, csvToDate]);

  const exportCSV = (rows: Expense[]) => {
    const selectedColumns = [
      ["title", "Title"],
      ["amount", "Amount"],
      ["category", "Category"],
      ["type", "Type"],
      ["createdAt", "Date"],
    ].filter(([key]) => csvColumns[key as keyof typeof csvColumns]);

    if (selectedColumns.length === 0) {
      toast.error("Choose at least one column", {
        description: "CSV export needs at least one column selected.",
      });
      return;
    }

    const header = selectedColumns.map(([, label]) => label);
    const data = rows.map((r) =>
      selectedColumns.map(([key]) => {
        if (key === "title") return r.title;
        if (key === "amount") return r.amount;
        if (key === "category") return r.category;
        if (key === "type") return r.type;
        return new Date(r.createdAt).toISOString();
      }),
    );

    const csv = [header, ...data]
      .map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","),
      )
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `spendwise-expenses-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    toast.success("CSV exported", {
      description: `${rows.length} transaction${rows.length === 1 ? "" : "s"} downloaded.`,
    });
  };

  // Resolve chart colors from CSS variables so theme adjustments stay consistent.
  const resolveVar = (name: string, fallback: string) =>
    (typeof window !== "undefined" &&
      getComputedStyle(document.documentElement).getPropertyValue(name)) ||
    fallback;

  const chartCells = [
    resolveVar("--chart-1", "#10b981") || "#10b981",
    resolveVar("--chart-2", "#3b82f6") || "#3b82f6",
    resolveVar("--chart-3", "#ef4444") || "#ef4444",
    resolveVar("--chart-4", "#f59e0b") || "#f59e0b",
  ].map((c) => c.trim());

  return (
    <div className="space-y-8">
      <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <Card className="border-border/70 bg-background/90 shadow-sm backdrop-blur">
          <CardContent className="flex flex-col gap-4 p-4 sm:gap-6 sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-muted-foreground">Budget status</span>
                  <span className={`font-medium ${budgetStatus.tone}`}>
                    {budgetStatus.label}
                  </span>
                </div>
                <p className="text-sm font-medium uppercase tracking-[0.24em] text-muted-foreground">
                  Dashboard
                </p>
                <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl md:text-4xl">
                  A calmer view of your money.
                </h1>
                <p className="max-w-2xl text-xs leading-5 text-muted-foreground sm:text-sm sm:leading-6">
                  Balance, income, spending, and recent activity are surfaced in
                  a cleaner layout so the app feels ready to use and present.
                </p>
              </div>

              <div className="flex flex-col gap-2 sm:items-end">
                <label className="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">
                  Display currency
                </label>
                <div className="flex items-center gap-2">
                  <select
                    value={displayCurrency}
                    onChange={(e) => setDisplayCurrency(e.target.value)}
                    className="h-10 rounded-full border border-border/70 bg-background/90 px-4 text-sm shadow-sm outline-none"
                  >
                    {CURRENCIES.map((currency) => (
                      <option key={currency.code} value={currency.code}>
                        {currency.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="grid gap-2 sm:gap-3 grid-cols-1 sm:grid-cols-3">
              {[
                {
                  label: "Balance",
                  value: balance,
                  icon: Wallet,
                  tone: "bg-emerald-500/10 text-emerald-600 ring-emerald-500/20",
                },
                {
                  label: "Income",
                  value: income,
                  icon: ArrowUp,
                  tone: "bg-blue-500/10 text-blue-600 ring-blue-500/20",
                },
                {
                  label: "Expense",
                  value: expense,
                  icon: ArrowDown,
                  tone: "bg-rose-500/10 text-rose-600 ring-rose-500/20",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-xl sm:rounded-2xl border border-border/70 bg-muted/35 p-3 sm:p-4 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-2 sm:gap-4">
                    <div>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        {item.label}
                      </p>
                      <p className="mt-1 sm:mt-2 truncate text-lg sm:text-2xl font-semibold tracking-tight">
                        {formatDisplayAmount(item.value)}
                      </p>
                    </div>
                    <span
                      className={`flex flex-shrink-0 size-8 sm:size-10 items-center justify-center rounded-xl sm:rounded-2xl ring-1 ${item.tone}`}
                    >
                      <item.icon className="size-3 sm:size-4" />
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <Card className="border-border/70 bg-background/90 shadow-sm">
              <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Monthly Budget
                    </p>
                    <h2 className="text-xl sm:text-2xl font-bold truncate">
                      {formatDisplayAmount(displayBudgetAmount)}
                    </h2>
                  </div>

                  <Button variant="outline" size="sm" asChild>
                    <a href="/dashboard/budget">Set Budget</a>
                  </Button>
                </div>

                <Progress value={progress} />

                <div className="flex flex-col gap-2 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
                  <p>Spent: {formatDisplayAmount(expense)}</p>
                  <p>Remaining: {formatDisplayAmount(remaining)}</p>
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card className="border-border/70 bg-background/90 shadow-sm backdrop-blur">
            <CardContent className="flex h-full flex-col justify-between gap-5 p-6 sm:p-8">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Snapshot
                </p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight">
                  Spend less time scanning, more time deciding.
                </h2>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span>Transactions</span>
                  <span className="font-medium">{expenses.length}</span>
                </div>
                <div className="h-2 rounded-full bg-muted">
                  <div className="h-full w-[68%] rounded-full bg-linear-to-r from-sky-500 via-blue-500 to-emerald-500" />
                </div>
                <p className="text-sm leading-6 text-muted-foreground">
                  Clean spacing and stronger contrast make the interface easier
                  to read on mobile and desktop.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/70 bg-background/90 shadow-sm backdrop-blur">
            <CardContent className="space-y-4 p-6 sm:p-8">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Smart insights
                </p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight">
                  Quick signals from your spending.
                </h2>
              </div>

              <div className="space-y-3 rounded-2xl border border-border/70 bg-muted/30 p-4 text-sm">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-muted-foreground">Monthly trend</span>
                  <span className="font-medium text-foreground">
                    {trendLabel}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-muted-foreground">Top category</span>
                  <span className="font-medium text-foreground">
                    {currentMonthTopCategory.category} —{" "}
                    {formatDisplayAmount(currentMonthTopCategory.value)}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-muted-foreground">
                    Budget remaining
                  </span>
                  <span className="font-medium text-foreground">
                    {formatDisplayAmount(remaining)} left
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border/70 bg-background/90 shadow-sm backdrop-blur">
          <CardContent className="p-6 sm:p-8">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold tracking-tight">
                  Expenses by category
                </h2>
                <p className="text-sm text-muted-foreground">
                  Where your spending is concentrated.
                </p>
              </div>
              {displayCategoryData.length > 0 && (
                <div className="hidden sm:flex flex-col items-end gap-2">
                  <div className="text-sm text-muted-foreground">
                    Top category
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <h2 className="text-2xl font-bold">
                        {formatDisplayAmount(currentMonthTopCategory.value)}
                      </h2>
                      <p className="text-xs text-muted-foreground">
                        {currentMonthTopCategory.category}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {displayCategoryData.length === 0 ? (
              <div className="flex h-[280px] flex-col items-center justify-center rounded-lg border border-dashed border-border/50 bg-muted/20">
                <PieChartIcon className="mb-3 size-8 text-muted-foreground/60" />
                <p className="text-sm font-medium text-muted-foreground">
                  No category data yet
                </p>
                <p className="mt-1 text-xs text-muted-foreground/70">
                  Add transactions to see spending breakdown
                </p>
                <Button asChild size="sm" variant="outline" className="mt-4">
                  <a href="/dashboard/add">Add Transaction</a>
                </Button>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={displayCategoryData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={104}
                    innerRadius={58}
                    paddingAngle={4}
                  >
                    {displayCategoryData.map((_, index) => (
                      <Cell
                        key={index}
                        fill={chartCells[index % chartCells.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/70 bg-background/90 shadow-sm backdrop-blur">
          <CardContent className="p-6 sm:p-8">
            <div className="mb-6">
              <h2 className="text-lg font-semibold tracking-tight">
                Monthly spending
              </h2>
              <p className="text-sm text-muted-foreground">
                Compare month-to-month totals at a glance.
              </p>
            </div>

            {displayMonthlyData.length === 0 ? (
              <div className="flex h-[280px] flex-col items-center justify-center rounded-lg border border-dashed border-border/50 bg-muted/20">
                <BarChart3 className="mb-3 size-8 text-muted-foreground/60" />
                <p className="text-sm font-medium text-muted-foreground">
                  No monthly spending data yet
                </p>
                <p className="mt-1 text-xs text-muted-foreground/70">
                  Add transactions to see spending trends
                </p>
                <Button asChild size="sm" variant="outline" className="mt-4">
                  <a href="/dashboard/add">Add Transaction</a>
                </Button>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={displayMonthlyData}>
                  <XAxis dataKey="month" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} width={36} />
                  <Tooltip />
                  <Bar
                    dataKey="amount"
                    radius={[10, 10, 0, 0]}
                    fill={chartCells[1]}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </section>

      <section className="space-y-4">
        <div className="flex flex-col gap-4 sm:items-end sm:justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-semibold tracking-tight">
              Recent activity
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              A cleaner transaction list with better hierarchy.
            </p>
          </div>

          <div className="flex flex-col gap-2 w-full sm:w-auto sm:flex-row sm:items-center sm:flex-wrap">
            <input
              placeholder="Search title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8 sm:h-9 rounded-lg sm:rounded-xl border border-border/70 bg-background px-2 sm:px-3 text-xs sm:text-sm shadow-sm outline-none flex-1 sm:flex-none"
            />

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="h-8 sm:h-9 rounded-lg sm:rounded-xl border border-border/70 bg-background px-2 sm:px-3 text-xs sm:text-sm shadow-sm outline-none flex-1 sm:flex-none"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            <div className="flex gap-1 overflow-x-auto">
              <Button
                variant={filterType === "all" ? undefined : "ghost"}
                size="sm"
                className="text-xs sm:text-sm flex-shrink-0"
                onClick={() => setFilterType("all")}
              >
                All
              </Button>
              <Button
                variant={filterType === "income" ? undefined : "ghost"}
                size="sm"
                className="text-xs sm:text-sm flex-shrink-0"
                onClick={() => setFilterType("income")}
              >
                Income
              </Button>
              <Button
                variant={filterType === "expense" ? undefined : "ghost"}
                size="sm"
                className="text-xs sm:text-sm flex-shrink-0"
                onClick={() => setFilterType("expense")}
              >
                Expense
              </Button>
            </div>

            <span className="rounded-full border border-border/70 bg-muted/40 px-2 sm:px-3 py-0.5 sm:py-1 text-xs font-medium text-muted-foreground flex-shrink-0">
              {filteredExpenses.length} result
              {filteredExpenses.length === 1 ? "" : "s"}
            </span>

            {hasActiveFilters ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={resetFilters}
                className="text-xs sm:text-sm h-8 sm:h-9"
              >
                Reset
              </Button>
            ) : null}

            <Button
              size="sm"
              onClick={() => exportCSV(filteredExpenses)}
              disabled={csvReadyExpenses.length === 0}
              className="text-xs sm:text-sm h-8 sm:h-9 flex-1 sm:flex-none"
            >
              Export CSV ({csvReadyExpenses.length})
            </Button>

            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs sm:text-sm h-8 sm:h-9 flex-1 sm:flex-none"
                >
                  CSV Options
                </Button>
              </DialogTrigger>
              <DialogContent className="w-full sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>CSV Export Settings</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                  <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <label className="text-xs sm:text-sm font-medium">
                        From date
                      </label>
                      <input
                        type="date"
                        value={csvFromDate}
                        onChange={(e) => setCsvFromDate(e.target.value)}
                        className="h-8 sm:h-10 w-full rounded-lg sm:rounded-xl border border-border/70 bg-background px-2 sm:px-3 text-xs sm:text-sm shadow-sm outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs sm:text-sm font-medium">
                        To date
                      </label>
                      <input
                        type="date"
                        value={csvToDate}
                        onChange={(e) => setCsvToDate(e.target.value)}
                        className="h-8 sm:h-10 w-full rounded-lg sm:rounded-xl border border-border/70 bg-background px-2 sm:px-3 text-xs sm:text-sm shadow-sm outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium">Columns</p>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {[
                        ["title", "Title"],
                        ["amount", "Amount"],
                        ["category", "Category"],
                        ["type", "Type"],
                        ["createdAt", "Date"],
                      ].map(([key, label]) => (
                        <label
                          key={key}
                          className="flex items-center gap-2 text-sm"
                        >
                          <input
                            type="checkbox"
                            checked={csvColumns[key as keyof typeof csvColumns]}
                            onChange={(e) =>
                              setCsvColumns((prev) => ({
                                ...prev,
                                [key]: e.target.checked,
                              }))
                            }
                          />
                          {label}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm text-muted-foreground">
                      Ready to export {csvReadyExpenses.length} row
                      {csvReadyExpenses.length === 1 ? "" : "s"}.
                    </p>
                    <Button
                      size="sm"
                      onClick={() => exportCSV(csvReadyExpenses)}
                    >
                      Download CSV
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {activeFilterChips.length > 0 ? (
            <div className="flex flex-wrap items-center gap-2">
              {activeFilterChips.map((chip) => (
                <button
                  key={chip.label}
                  type="button"
                  onClick={chip.onClear}
                  className="inline-flex items-center gap-1 rounded-full border border-border/70 bg-muted/40 px-3 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted"
                >
                  <span>{chip.label}</span>
                  <X className="size-3" />
                </button>
              ))}
            </div>
          ) : null}

          <p className="text-xs text-muted-foreground">{resultsSummary}</p>
        </div>

        {filteredExpenses.length === 0 ? (
          <Card className="border-dashed border-border/70 bg-background/80">
            <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
              <p className="text-sm font-medium">
                {hasActiveFilters
                  ? "No matching transactions"
                  : "No transactions yet"}
              </p>
              <p className="max-w-sm text-sm text-muted-foreground">
                {hasActiveFilters
                  ? "Try clearing the filters to bring your transactions back."
                  : "Add your first transaction to see the dashboard come alive."}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2">
                {hasActiveFilters ? (
                  <Button variant="outline" size="sm" onClick={resetFilters}>
                    Clear filters
                  </Button>
                ) : null}
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredExpenses.map((e) => (
              <Card
                key={e.id}
                className="border-border/70 bg-background/90 shadow-sm backdrop-blur transition-transform duration-200 hover:-translate-y-0.5"
              >
                <CardContent className="flex flex-col gap-3 p-3 sm:gap-4 sm:p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="space-y-0.5 sm:space-y-1 min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium leading-none text-sm sm:text-base truncate">
                        {e.title}
                      </p>
                      {e.recurring ? (
                        <span className="rounded-full border border-sky-500/20 bg-sky-500/10 px-2 py-0.5 text-[11px] font-medium text-sky-700">
                          🔁 Recurring
                        </span>
                      ) : null}
                    </div>
                    <div className="flex flex-wrap items-center gap-1 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
                      <span>{e.category}</span>
                      <span className="hidden sm:inline">•</span>
                      <span>
                        {new Intl.DateTimeFormat("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        }).format(new Date(e.createdAt))}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 sm:justify-end">
                    <p
                      className={`text-xs sm:text-sm font-semibold ${
                        e.type === "expense"
                          ? "text-rose-600"
                          : "text-emerald-600"
                      }`}
                    >
                      {e.type === "expense" ? "-" : "+"}
                      {formatDisplayAmount(
                        convertCurrency(e.amount, e.currency, displayCurrency),
                      )}
                    </p>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs sm:text-sm h-8 sm:h-auto"
                        >
                          <Edit size={14} />
                          <span className="hidden sm:inline ml-1">Edit</span>
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="w-full sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle className="text-base sm:text-lg">
                            Edit expense
                          </DialogTitle>
                        </DialogHeader>
                        <EditExpenseForm expense={e} />
                      </DialogContent>
                    </Dialog>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="destructive"
                          size="sm"
                          className="text-xs sm:text-sm h-8 sm:h-auto"
                        >
                          <Trash size={14} />
                          <span className="hidden sm:inline ml-1">Delete</span>
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="w-full sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle className="text-base sm:text-lg">
                            Delete transaction?
                          </DialogTitle>
                          <DialogDescription>
                            This action cannot be undone. "{e.title}" will be
                            permanently removed.
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                          </DialogClose>
                          <Button
                            variant="destructive"
                            disabled={deletingExpenseId === e.id}
                            onClick={async () => {
                              try {
                                setDeletingExpenseId(e.id);
                                await deleteExpense(e.id);
                                window.location.reload();
                              } catch {
                                toast.error("Delete failed", {
                                  description:
                                    "Could not delete this transaction.",
                                });
                                setDeletingExpenseId(null);
                              }
                            }}
                          >
                            {deletingExpenseId === e.id
                              ? "Deleting..."
                              : "Confirm delete"}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
