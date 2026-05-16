<div align="center">

# SpendWise

**A modern personal finance dashboard built for clarity, speed, and control.**

Track income and expenses, manage monthly budgets, and visualize spending patterns — all in Bengali Taka (৳) with multi-currency support.

[![Next.js](https://img.shields.io/badge/Next.js-16.2.6-000000?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.4-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38BDF8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-7.8.0-2D3748?style=flat-square&logo=prisma)](https://www.prisma.io/)
[![Supabase](https://img.shields.io/badge/Supabase-Auth_%26_DB-3ECF8E?style=flat-square&logo=supabase)](https://supabase.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](./LICENSE)

[**Live Demo**](https://spendwise-seven-gold.vercel.app/) · [**Watch Demo on YouTube**](https://youtu.be/31_tfzguh5Q) · [**API Docs**](./API_DOCUMENTATION.md) · [**Database Docs**](./DATABASE.md)

> ⚠️ **Note:** Deployed on Vercel's free tier — initial load may take a few seconds due to cold start. For a full walkthrough of features, watch the [YouTube demo](https://youtu.be/31_tfzguh5Q).

</div>

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [Authentication Flow](#authentication-flow)
- [Currency Support](#currency-support)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

SpendWise is a full-stack personal finance dashboard that gives you a real-time view of your financial health. Built with Next.js App Router and server actions, it prioritizes security (server-side auth), performance (Turbopack, Prisma), and a clean mobile-first UI.

---

## Features

### Expense Tracking

- Record income and expenses with title, amount, category, date, and currency
- Edit and delete transactions at any time
- Export transactions to CSV with custom date ranges and selectable columns

### Budget Management

- Set and update monthly budgets per currency
- Visual budget progress and overspend indicators

### Dashboard Analytics

- **Summary Cards** — real-time balance, income, and expenses for the current month
- **Pie Chart** — category breakdown of spending
- **Bar Chart** — monthly spending trends over time
- **Empty States** — professional placeholders when no data is available yet

### Filtering & Search

- Filter by transaction type (income / expense / all)
- Filter by category
- Full-text search by transaction title
- Date-range picker for CSV exports

### Authentication & Security

- Email/password sign-up with mandatory email verification
- Password reset via Supabase email flow
- Server-side session validation on every protected route
- Complete data isolation — users can only access their own records

### Design & Accessibility

- Mobile-first responsive layout (xs → sm → md → lg breakpoints)
- Consistent shadcn/ui component library
- Toast notifications via Sonner
- Fully typed with TypeScript throughout

---

## Tech Stack

### Frontend

| Technology      | Version | Purpose                                     |
| --------------- | ------- | ------------------------------------------- |
| Next.js         | 16.2.6  | React framework with App Router & Turbopack |
| React           | 19.2.4  | UI rendering with hooks                     |
| TypeScript      | —       | End-to-end type safety                      |
| Tailwind CSS    | v4      | Utility-first styling                       |
| shadcn/ui       | —       | Composable UI component library             |
| Recharts        | 3.8.1   | Pie and bar chart visualizations            |
| Lucide React    | 1.14.0  | Icon library                                |
| React Hook Form | —       | Performant form state management            |
| Zod             | —       | Schema validation                           |
| Sonner          | 2.0.7   | Toast notifications                         |

### Backend & Database

| Technology             | Version | Purpose                             |
| ---------------------- | ------- | ----------------------------------- |
| Next.js Server Actions | —       | Type-safe backend operations        |
| Prisma ORM             | 7.8.0   | Type-safe database access layer     |
| PostgreSQL             | —       | Relational database                 |
| Supabase               | —       | PostgreSQL hosting + authentication |

### Authentication

| Package               | Purpose                                             |
| --------------------- | --------------------------------------------------- |
| Supabase Auth         | Session management (sign-up, login, password reset) |
| @supabase/ssr         | Server component auth support                       |
| @supabase/supabase-js | Client-side auth SDK                                |

---

## Project Structure

```
spendwise/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── (auth)/                   # Auth route group
│   │   │   ├── login/page.tsx        # Login page
│   │   │   ├── signup/page.tsx       # Sign-up page
│   │   │   └── logoutBtn.tsx         # Logout button component
│   │   ├── dashboard/                # Protected dashboard routes
│   │   │   ├── page.tsx              # Dashboard home
│   │   │   ├── add/page.tsx          # Add transaction page
│   │   │   └── budget/page.tsx       # Budget management page
│   │   ├── layout.tsx                # Root layout (navbar)
│   │   ├── page.tsx                  # Public landing page
│   │   └── globals.css               # Global styles
│   │
│   ├── components/
│   │   ├── dashboard/
│   │   │   └── dashboard-client.tsx  # Main dashboard client component
│   │   ├── EditExpenseForm.tsx        # Edit transaction modal
│   │   └── ui/                        # shadcn/ui primitives
│   │
│   ├── actions/                       # Next.js Server Actions
│   │   ├── expense.ts                 # Expense CRUD operations
│   │   └── budget.ts                  # Budget get/set operations
│   │
│   └── lib/
│       ├── supabase/
│       │   ├── server.ts              # Server-side Supabase client
│       │   └── browser.ts             # Client-side Supabase client
│       ├── currency.ts                # Currency configuration & constants
│       ├── convertCurrency.ts         # Currency conversion logic
│       └── formatCurrency.ts          # Currency display formatting (৳ symbol)
│
├── prisma/
│   ├── schema.prisma                  # Prisma schema definition
│   └── migrations/                    # Database migration history
│
├── public/                            # Static assets
├── .env.example                       # Environment variable template
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── postcss.config.mjs
└── next.config.ts
```

---

## Database Schema

For complete documentation including query examples, data isolation patterns, and optimization tips, see [DATABASE.md](./DATABASE.md).

### Expense

```prisma
model Expense {
  id        String   @id @default(cuid())
  userId    String   @db.Uuid
  title     String
  amount    Decimal  @db.Decimal(12, 2)
  category  String   // Normalized to lowercase on write
  type      String   // "income" | "expense"
  currency  String   @default("BDT")
  recurring Boolean  @default(false)
  createdAt DateTime @default(now())

  @@index([userId])
  @@index([createdAt])
}
```

### Budget

```prisma
model Budget {
  id        String   @id @default(cuid())
  userId    String   @db.Uuid @unique   // One budget per user
  amount    Decimal  @db.Decimal(12, 2)
  currency  String   @default("BDT")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

**Design Notes:**

- `userId` maps to the Supabase auth user UUID — no foreign-key join required
- `@@index([userId])` ensures all per-user queries are fast regardless of table size
- Category values are always lowercased before storage for consistent filtering

---

## Authentication Flow

```
Sign Up → Email Verification → Login → Dashboard (server-side session check)
                                            ↓
                                    Unauthenticated → Redirect to /login
```

| Step               | Mechanism                                                    |
| ------------------ | ------------------------------------------------------------ |
| Sign Up            | Supabase Auth — creates user, sends verification email       |
| Email Verification | Required before first login                                  |
| Login              | Email + password via Supabase Auth                           |
| Session            | Server-side validation via `createClient()` on every request |
| Password Reset     | Supabase sends a secure reset link to the user's email       |
| Logout             | Clears session, redirects to `/login`                        |
| Route Protection   | Middleware + server-side checks on all `/dashboard/*` routes |

---

## Currency Support

| Currency                     | Code | Symbol |
| ---------------------------- | ---- | ------ |
| Bangladeshi Taka _(default)_ | BDT  | ৳      |
| US Dollar                    | USD  | $      |
| Euro                         | EUR  | €      |
| British Pound                | GBP  | £      |
| Indian Rupee                 | INR  | ₹      |

- Each transaction and budget record stores its own currency code
- Conversion is handled client-side using hardcoded exchange rates
- All dashboard totals are displayed in the user's selected display currency

---

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn
- A [Supabase](https://supabase.com/) project (free tier is sufficient)

### 1. Clone and Install

```bash
git clone https://github.com/YeaishTurj/web-development-bootcamp-may-2026-expense-tracker
cd spendwise
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the project root. Use [`.env.example`](./.env.example) as a reference:

```env
# Prisma — Supabase PostgreSQL connection
DATABASE_URL="postgresql://user:password@host:5432/database"
DIRECT_URL="postgresql://user:password@host:6543/database"

# Supabase — client-side authentication
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
```

> Both `DATABASE_URL` and `DIRECT_URL` are required. The direct URL bypasses the Supabase connection pooler for migrations.

### 3. Set Up the Database

```bash
# Generate the Prisma client
npx prisma generate

# Push schema to your Supabase database
npx prisma db push
```

### 4. Start the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Available Scripts

| Command         | Description                             |
| --------------- | --------------------------------------- |
| `npm run dev`   | Start development server with Turbopack |
| `npm run build` | Build optimized production bundle       |
| `npm start`     | Start production server                 |
| `npm run lint`  | Run ESLint across the project           |

---

## Deployment

### Vercel (Recommended)

1. Push the repository to GitHub
2. Import the repository in [Vercel](https://vercel.com/)
3. Set the **Root Directory** to `spendwise`
4. Add the following environment variables in the Vercel dashboard:

| Variable                        | Description                    |
| ------------------------------- | ------------------------------ |
| `DATABASE_URL`                  | Supabase pooled connection URL |
| `DIRECT_URL`                    | Supabase direct connection URL |
| `NEXT_PUBLIC_SUPABASE_URL`      | Your Supabase project URL      |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon/public key  |

5. Click **Deploy**

---

## Troubleshooting

### Database Connection Error

- Confirm `DATABASE_URL` and `DIRECT_URL` are correctly set in `.env.local`
- Ensure your Supabase project is active (free tier projects pause after inactivity)
- Re-run `npx prisma db push` if the schema is out of sync

### Authentication Issues

- Verify `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are correct
- Confirm the user has completed email verification before attempting login
- Clear browser cookies and retry if the session appears stale

### Build Errors

- Run `npx prisma generate` after any changes to `schema.prisma`
- Delete the `.next` cache and rebuild:
  ```bash
  rm -rf .next && npm run build
  ```

---

## Contributing

Contributions are welcome. To get started:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "feat: add your feature"`
4. Push to your fork: `git push origin feature/your-feature`
5. Open a Pull Request

Please open an issue first for significant changes so the approach can be discussed.

---

## License

This project is licensed under the [MIT License](./LICENSE).

---

<div align="center">

Built with Next.js · Prisma · Supabase · Tailwind CSS

</div>
