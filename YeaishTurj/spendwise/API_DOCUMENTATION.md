# SpendWise API Documentation

Complete API reference for the SpendWise finance dashboard built with Next.js Server Actions and Supabase.

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Authentication](#authentication)
3. [Data Models](#data-models)
4. [Server Actions API](#server-actions-api)
5. [Authentication Endpoints](#authentication-endpoints)
6. [Error Handling](#error-handling)
7. [Rate Limiting](#rate-limiting)
8. [Examples](#examples)

---

## Overview

**SpendWise** is a modern finance dashboard API built on:

- **Framework**: Next.js 16.2.6 (App Router)
- **Backend**: Next.js Server Actions
- **Database**: PostgreSQL via Supabase
- **ORM**: Prisma 7.8.0
- **Authentication**: Supabase Auth

### Base URL

```
http://localhost:3000  # Development
https://spendwise.vercel.app  # Production (when deployed)
```

### API Type

This is **not a REST API**. Instead, SpendWise uses **Next.js Server Actions** for backend operations. Server Actions are type-safe, encrypted client-to-server calls that eliminate the need for traditional API endpoints.

---

## Authentication

### Overview

All protected operations require the user to be authenticated via Supabase Auth.

### Authentication Methods

#### 1. **Supabase Client-Side Auth** (Browser)

Used for signup, login, and password reset from the client.

```typescript
import { supabase } from "@/lib/supabase/browser";

// Sign up
const { data, error } = await supabase.auth.signUp({
  email: "user@example.com",
  password: "SecurePassword123",
});

// Sign in
const { error } = await supabase.auth.signInWithPassword({
  email: "user@example.com",
  password: "SecurePassword123",
});

// Sign out
await supabase.auth.signOut({ scope: "local" });

// Reset password
const { error } = await supabase.auth.resetPasswordForEmail(email, {
  redirectTo: `${window.location.origin}/reset-password`,
});
```

#### 2. **Supabase Server-Side Auth** (Server Components/Actions)

Used for secure backend operations.

```typescript
import { createClient } from "@/lib/supabase/server";

const supabase = await createClient();
const { data } = await supabase.auth.getUser();

if (!data.user) {
  throw new Error("Unauthorized");
}
```

### Session Management

- Sessions are managed via Supabase Auth cookies
- Server-side session validation on protected routes
- Automatic redirect to `/login` for unauthenticated users on dashboard

### Protected Routes

```
/dashboard                 # Main dashboard (requires auth)
/dashboard/add            # Add expense page (requires auth)
/dashboard/budget         # Budget management (requires auth)
```

### Public Routes

```
/                         # Landing page
/login                    # Login page
/signup                   # Sign up page
/forgot-password          # Password reset request
/reset-password           # Password reset confirmation
```

---

## Data Models

### Expense Model

Represents a transaction (income or expense).

```prisma
model Expense {
  id        String   @id @default(cuid())      # Unique identifier
  title     String                              # Transaction title/description
  amount    Float                               # Transaction amount
  category  String                              # Category (normalized to lowercase)
  type      String                              # "income" or "expense"
  currency  String   @default("BDT")            # Currency code (BDT, USD, EUR, GBP, INR)
  recurring Boolean  @default(false)            # Recurring transaction flag

  userId    String                              # User ID (from Supabase Auth)

  createdAt DateTime @default(now())            # Creation timestamp
  updatedAt DateTime @updatedAt                 # Last update timestamp
}
```

### Budget Model

Represents the user's monthly budget.

```prisma
model Budget {
  id        String   @id @default(cuid())      # Unique identifier
  amount    Float                               # Budget amount
  currency  String   @default("BDT")            # Currency code

  userId    String                              # User ID (one budget per user)

  createdAt DateTime @default(now())            # Creation timestamp
  updatedAt DateTime @updatedAt                 # Last update timestamp
}
```

### Supported Currencies

| Code | Symbol | Name             |
| ---- | ------ | ---------------- |
| BDT  | ৳      | Bangladeshi Taka |
| USD  | $      | US Dollar        |
| EUR  | €      | Euro             |
| GBP  | £      | British Pound    |
| INR  | ₹      | Indian Rupee     |

---

## Server Actions API

### Expense Actions

All expense actions are located in `src/actions/expense.ts` and require authentication.

#### 1. Create Expense

**Function**: `addExpense(data)`

Creates a new expense or income transaction.

##### Parameters

```typescript
{
  title: string;              // Required: Transaction title
  amount: number;             // Required: Transaction amount (positive number)
  category: string;           // Required: Category name (auto-normalized to lowercase)
  type: "income" | "expense"; // Required: Transaction type
  currency?: string;          // Optional: Currency code (default: "BDT")
}
```

##### Returns

```typescript
{
  id: string; // Unique transaction ID
  title: string;
  amount: number;
  category: string; // Stored in lowercase
  type: string;
  currency: string;
  recurring: boolean;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}
```

##### Errors

- `"Unauthorized"` - User is not authenticated
- Database constraint violations

##### Example

```typescript
import { addExpense } from "@/actions/expense";

const expense = await addExpense({
  title: "Grocery Shopping",
  amount: 2500,
  category: "food",
  type: "expense",
  currency: "BDT",
});
```

---

#### 2. Update Expense

**Function**: `updateExpense(id, data)`

Updates an existing expense or income transaction.

##### Parameters

```typescript
id: string;                   // Required: Expense ID

data: {
  title?: string;            // Optional: New title
  amount?: number;           // Optional: New amount
  category?: string;         // Optional: New category (auto-normalized)
  type?: "income" | "expense"; // Optional: New type
  currency?: string;         // Optional: New currency
}
```

##### Returns

```typescript
{
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
}
```

##### Errors

- `"Unauthorized"` - User is not authenticated
- `"NotFound"` - Expense with given ID doesn't exist

##### Example

```typescript
import { updateExpense } from "@/actions/expense";

const updated = await updateExpense("expense-123", {
  title: "Grocery - Corrected",
  amount: 3000,
});
```

---

#### 3. Delete Expense

**Function**: `deleteExpense(id)`

Deletes an expense or income transaction.

##### Parameters

```typescript
id: string; // Required: Expense ID to delete
```

##### Returns

```typescript
{
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
}
```

##### Errors

- `"Unauthorized"` - User is not authenticated
- `"NotFound"` - Expense with given ID doesn't exist

##### Example

```typescript
import { deleteExpense } from "@/actions/expense";

const deleted = await deleteExpense("expense-123");
```

---

### Budget Actions

All budget actions are located in `src/actions/budget.ts` and require authentication.

#### 1. Set Budget

**Function**: `setBudget(amount, currency)`

Creates or updates the user's monthly budget. Each user can have only one active budget.

##### Parameters

```typescript
amount: number;       // Required: Budget amount (positive number)
currency?: string;    // Optional: Currency code (default: "BDT")
```

##### Returns

```typescript
{
  id: string; // Unique budget ID
  amount: number;
  currency: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}
```

##### Behavior

- If a budget already exists for the user, it updates the existing one
- If no budget exists, creates a new one
- Updates the `updatedAt` timestamp

##### Errors

- `"Unauthorized"` - User is not authenticated
- `"Budget model is unavailable"` - Prisma client not properly generated

##### Example

```typescript
import { setBudget } from "@/actions/budget";

const budget = await setBudget(50000, "BDT");
// Creates or updates the user's budget to 50,000 BDT
```

---

## Authentication Endpoints

### Supabase Auth Flow

#### 1. Sign Up

**Endpoint**: `/auth/signup` (Client-side)

```typescript
const { data, error } = await supabase.auth.signUp({
  email: "user@example.com",
  password: "SecurePassword123",
});

if (error) {
  // Handle error (e.g., weak password, email already exists)
  console.error(error.message);
} else {
  // User created, but not logged in until email is verified
  // (if email verification is enabled)
}
```

#### 2. Sign In

**Endpoint**: `/auth/signin` (Client-side)

```typescript
const { data, error } = await supabase.auth.signInWithPassword({
  email: "user@example.com",
  password: "SecurePassword123",
});

if (error) {
  // Handle error (e.g., invalid credentials)
  console.error(error.message);
} else {
  // User is now authenticated
  // Session is automatically stored in cookies
}
```

#### 3. Sign Out

**Endpoint**: `/auth/signout` (Client-side)

```typescript
const { error } = await supabase.auth.signOut({ scope: "local" });

if (error) {
  console.error(error.message);
} else {
  // User is logged out
  // Redirect to login page
}
```

#### 4. Request Password Reset

**Endpoint**: `/auth/reset-password` (Client-side)

```typescript
const { data, error } = await supabase.auth.resetPasswordForEmail(
  "user@example.com",
  {
    redirectTo: `${window.location.origin}/reset-password`,
  },
);

if (error) {
  console.error(error.message);
} else {
  // Email sent with reset link
}
```

#### 5. Confirm Password Reset

**Endpoint**: `/reset-password` (Server Component)

```typescript
// After user clicks reset link in email, they're redirected here
// Supabase automatically handles the reset session

// User sets new password:
const { data, error } = await supabase.auth.updateUser({
  password: "NewSecurePassword123",
});
```

---

## Error Handling

### Common Errors

#### 1. Unauthorized

**Cause**: User is not authenticated when calling a protected action.

```typescript
// Example error
throw new Error("Unauthorized");
```

**Solution**: Ensure user is logged in before calling server actions.

---

#### 2. Validation Errors

**Cause**: Invalid input data.

**Examples**:

- Missing required fields
- Invalid currency code
- Amount is negative

**Solution**: Validate input on the client-side before calling server actions.

---

#### 3. Database Errors

**Cause**: Database constraints violated or connection issues.

**Solution**: Check error message and ensure data is valid.

---

### Error Handling Pattern

```typescript
try {
  const result = await addExpense({
    title: "Test",
    amount: 100,
    category: "test",
    type: "expense",
  });
} catch (error) {
  if (error instanceof Error) {
    if (error.message === "Unauthorized") {
      // Redirect to login
      router.push("/login");
    } else {
      // Show error toast
      toast.error(error.message);
    }
  }
}
```

---

## Rate Limiting

### Supabase Rate Limits

SpendWise uses Supabase for authentication and database. Rate limits are enforced at the Supabase level:

- **Auth**: 10 requests per second per IP
- **Database**: Depends on your Supabase pricing tier

### Client-Side Rate Limiting

Implement rate limiting in UI components to prevent abuse:

```typescript
const [isLoading, setIsLoading] = useState(false);

const handleSubmit = async () => {
  if (isLoading) return; // Prevent multiple submissions

  setIsLoading(true);
  try {
    await addExpense(data);
  } finally {
    setIsLoading(false);
  }
};
```

---

## Examples

### Complete Expense Workflow

#### 1. Add an Expense

```typescript
import { addExpense } from "@/actions/expense";
import { toast } from "sonner";

async function handleAddExpense() {
  try {
    const expense = await addExpense({
      title: "Lunch at Restaurant",
      amount: 750,
      category: "food",
      type: "expense",
      currency: "BDT",
    });

    toast.success("Expense added successfully");
    console.log("Created expense:", expense.id);
  } catch (error) {
    toast.error("Failed to add expense");
  }
}
```

#### 2. Update an Expense

```typescript
import { updateExpense } from "@/actions/expense";

async function handleUpdateExpense(expenseId: string) {
  try {
    const updated = await updateExpense(expenseId, {
      amount: 800, // Corrected amount
      title: "Lunch at Restaurant - Updated",
    });

    toast.success("Expense updated");
  } catch (error) {
    toast.error("Failed to update expense");
  }
}
```

#### 3. Delete an Expense

```typescript
import { deleteExpense } from "@/actions/expense";

async function handleDeleteExpense(expenseId: string) {
  try {
    await deleteExpense(expenseId);
    toast.success("Expense deleted");
  } catch (error) {
    toast.error("Failed to delete expense");
  }
}
```

---

### Complete Budget Workflow

#### 1. Set a Monthly Budget

```typescript
import { setBudget } from "@/actions/budget";

async function handleSetBudget() {
  try {
    const budget = await setBudget(100000, "BDT");

    toast.success(`Budget set to ৳${budget.amount}`);
  } catch (error) {
    toast.error("Failed to set budget");
  }
}
```

---

### Complete Authentication Workflow

#### 1. Sign Up

```typescript
import { supabase } from "@/lib/supabase/browser";
import { useRouter } from "next/navigation";

async function handleSignup(email: string, password: string) {
  const { error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    toast.error(error.message);
  } else {
    toast.success("Check your email to confirm");
    router.push("/login");
  }
}
```

#### 2. Login

```typescript
async function handleLogin(email: string, password: string) {
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    toast.error(error.message);
  } else {
    router.push("/dashboard");
  }
}
```

#### 3. Logout

```typescript
async function handleLogout() {
  const { error } = await supabase.auth.signOut({ scope: "local" });

  if (error) {
    toast.error(error.message);
  } else {
    router.push("/login");
  }
}
```

---

### Dashboard Data Fetching

```typescript
// src/app/dashboard/page.tsx (Server Component)

import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  // Protected route - redirect if not authenticated
  if (!data.user) {
    redirect("/login");
  }

  // Fetch all expenses for current user
  const expenses = await prisma.expense.findMany({
    where: {
      userId: data.user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Fetch budget for current user
  const budget = await prisma.budget.findFirst({
    where: {
      userId: data.user.id,
    },
  });

  return (
    <DashboardClient
      expenses={expenses}
      budgetAmount={budget?.amount || 0}
      budgetCurrency={budget?.currency || "BDT"}
    />
  );
}
```

---

## Best Practices

### 1. Always Check Authentication

```typescript
const supabase = await createClient();
const { data } = await supabase.auth.getUser();

if (!data.user) {
  throw new Error("Unauthorized");
}
```

### 2. Normalize Categories

Categories are automatically converted to lowercase when stored:

```typescript
// Input: "FOOD" → Stored as: "food"
await addExpense({
  category: "FOOD",
  // ...
});
```

### 3. Use Type Safety

```typescript
import type { Expense } from "@/types";

const expenses: Expense[] = await fetchExpenses();
```

### 4. Handle Errors Gracefully

Always use try-catch blocks:

```typescript
try {
  await addExpense(data);
} catch (error) {
  if (error instanceof Error) {
    toast.error(error.message);
  }
}
```

### 5. Show Loading States

```typescript
const [isLoading, setIsLoading] = useState(false);

const handleSubmit = async () => {
  setIsLoading(true);
  try {
    await addExpense(data);
  } finally {
    setIsLoading(false);
  }
};
```

---

## Deployment Notes

### Environment Variables

Required for deployment:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
DATABASE_URL=postgresql://user:password@host/db
DIRECT_URL=postgresql://user:password@host:6543/db
```

### Vercel Deployment

1. Push to GitHub
2. Connect repository to Vercel
3. Set Root Directory to `spendwise`
4. Configure environment variables
5. Deploy

---

## Support & Troubleshooting

### Common Issues

#### 1. "Budget model is unavailable"

**Solution**: Run `npx prisma generate` and restart the dev server.

#### 2. Auth Session Lost

**Solution**: Clear browser cookies and log in again.

#### 3. Database Connection Error

**Solution**: Check `DATABASE_URL` and `DIRECT_URL` in `.env.local`.

---

## Version

- **Current Version**: 1.0.0
- **Last Updated**: May 16, 2026
- **Next.js**: 16.2.6
- **Prisma**: 7.8.0

---

## License

MIT License - See LICENSE file for details.
