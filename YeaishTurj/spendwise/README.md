# SpendWise - Modern Finance Dashboard

A modern, responsive finance dashboard built with Next.js that helps you track expenses, analyze spending patterns, and manage budgets with ease. Track your finances in **Bengali Taka (৳)** with multi-currency support.

![Finance Dashboard](https://img.shields.io/badge/Next.js-16.2.6-black?logo=next.js)
![React](https://img.shields.io/badge/React-19.2.4-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B6FF?logo=tailwindcss)

## 🌐 Live Demo

**[View Live Demo](https://spendwise-seven-gold.vercel.app/)** - Deployed on Vercel

## 🚀 Features

- **Expense Tracking**: Record income and expenses with category, date, and amount
- **Budget Management**: Set monthly budgets with multi-currency support
- **Dashboard Analytics**:
  - Real-time balance, income, and expense summaries (current month only)
  - Category breakdown with pie charts
  - Monthly spending trends with bar charts
  - Professional empty states when no data exists
- **Multi-Currency Support**: Track expenses in multiple currencies (BDT, USD, EUR, GBP, INR) with automatic conversion
- **Authentication**: Secure user authentication with Supabase
- **Email Verification**: Post-signup email confirmation flow
- **Responsive Design**: Mobile-first design with Tailwind CSS breakpoints (xs, sm, md, lg)
- **Data Export**: Export transactions to CSV with custom date ranges and columns
- **Transaction Management**: Edit and delete expenses with ease

## 🛠️ Tech Stack

### Frontend

- **Next.js 16.2.6** - React framework with App Router and Turbopack
- **React 19.2.4** - UI library with hooks
- **TypeScript** - Type-safe development
- **Tailwind CSS 4** - Utility-first CSS framework
- **shadcn/ui** - Pre-built, composable UI components
- **Recharts 3.8.1** - Data visualization (pie & bar charts)
- **Lucide React 1.14.0** - Modern icon library
- **React Hook Form** - Efficient form management
- **Zod** - TypeScript-first schema validation
- **Sonner 2.0.7** - Toast notifications

### Backend & Database

- **Next.js Server Actions** - Backend operations via server functions
- **Prisma 7.8.0 ORM** - Type-safe database access
- **PostgreSQL** - Relational database (via Supabase)
- **Supabase** - PostgreSQL hosting + authentication

### Authentication

- **Supabase Auth** - Server-side and client-side authentication
- **@supabase/ssr** - Server component support
- **@supabase/supabase-js** - Client-side auth

## � Documentation

Comprehensive guides for developing and maintaining SpendWise:

- **[API Documentation](./API_DOCUMENTATION.md)** - Complete Server Actions API reference, authentication flows, error handling, and code examples
- **[Database Documentation](./DATABASE.md)** - Schema models, Prisma queries, data isolation patterns, migrations, and optimization tips

## �📋 Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account (for database & auth)

## 🚀 Getting Started

### 1. Clone and Install

```bash
git clone <repository-url>
cd spendwise
npm install
```

### 2. Environment Setup

Create a `.env.local` file in the root directory (see [.env.example](./.env.example) for template):

```env
# Database (Prisma + Supabase)
DATABASE_URL="postgresql://user:password@host:5432/database"
DIRECT_URL="postgresql://user:password@host:6543/database"

# Supabase (Frontend Auth)
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
```

### 3. Database Setup

Generate Prisma client and run migrations:

```bash
npx prisma generate
npx prisma db push
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
spendwise/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── (auth)/                   # Auth-related routes
│   │   │   ├── login/page.tsx        # Login page
│   │   │   ├── signup/page.tsx       # Signup page
│   │   │   └── logoutBtn.tsx         # Logout button component
│   │   ├── dashboard/                # Dashboard pages
│   │   │   ├── page.tsx              # Dashboard home
│   │   │   ├── add/page.tsx          # Add expense page
│   │   │   └── budget/page.tsx       # Budget management
│   │   ├── layout.tsx                # Root layout with navbar
│   │   ├── page.tsx                  # Home page
│   │   └── globals.css               # Global styles
│   ├── components/
│   │   ├── dashboard/
│   │   │   └── dashboard-client.tsx  # Main dashboard component
│   │   ├── EditExpenseForm.tsx       # Edit expense modal
│   │   └── ui/                       # shadcn/ui components
│   ├── actions/                      # Server actions
│   │   ├── expense.ts                # Expense CRUD operations
│   │   └── budget.ts                 # Budget operations
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── server.ts             # Server-side Supabase client
│   │   │   └── browser.ts            # Client-side Supabase client
│   │   ├── currency.ts               # Currency configuration
│   │   ├── convertCurrency.ts        # Currency conversion logic
│   │   └── formatCurrency.ts         # Currency formatting (TK symbol)
│   └── prisma/                       # Database schema
│       ├── schema.prisma             # Prisma schema definition
│       └── migrations/               # Database migrations
├── public/                           # Static assets
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── postcss.config.mjs
└── next.config.ts
```

## 🗄️ Database Schema

For detailed database documentation, see [DATABASE.md](./DATABASE.md) for schema models, Prisma queries, migrations, and optimization.

### Expense Model

```prisma
model Expense {
  id        String   @id @default(cuid())
  userId    String   @db.Uuid
  title     String
  amount    Decimal  @db.Decimal(12, 2)
  category  String   // Normalized to lowercase
  type      String   // "income" or "expense"
  currency  String   @default("BDT")
  recurring Boolean  @default(false)
  createdAt DateTime @default(now())

  @@index([userId])
  @@index([createdAt])
}
```

### Budget Model

```prisma
model Budget {
  id        String   @id @default(cuid())
  userId    String   @db.Uuid @unique
  amount    Decimal  @db.Decimal(12, 2)
  currency  String   @default("BDT")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

## 🔐 Authentication Flow

1. **Signup**: User creates account → Email verification required
2. **Forgot Password**: Users can request a password reset email; Supabase handles the reset flow and sends a secure reset link to the user's email.
3. **Login**: User logs in with email/password
4. **Session**: Server-side auth check via `createClient()` from Supabase
5. **Logout**: Clear session and redirect to login
6. **Protected Routes**: Dashboard routes redirect unauthenticated users to `/login`

## 💰 Currency Support

- **Default**: Bengali Taka (৳) - BDT
- **Available**: USD ($), EUR (€), GBP (£), INR (₹)
- **Storage**: Each expense and budget stores its currency
- **Conversion**: Client-side conversion using hardcoded exchange rates
- **Display**: All values shown in selected display currency

## 📊 Dashboard Features

### Current Month Stats

- **Balance**: Income - Expenses (current month)
- **Income**: Sum of all income transactions (current month)
- **Expense**: Sum of all expenses (current month)

### Charts & Visualizations

- **Pie Chart**: Category breakdown of expenses
- **Bar Chart**: Monthly spending trends
- **Empty States**: Professional placeholders when no data exists

### Filters & Search

- Filter by transaction type (income/expense/all)
- Filter by category
- Search by transaction title
- Date range picker for exports

## 🔧 Server Actions

For complete API documentation with examples and error handling, see [API_DOCUMENTATION.md](./API_DOCUMENTATION.md).

### Expense Actions (`src/actions/expense.ts`)

- `addExpense()` - Create new expense
- `updateExpense()` - Update existing expense
- `deleteExpense()` - Remove expense

### Budget Actions (`src/actions/budget.ts`)

- `setBudget()` - Set/update monthly budget
- `getBudget()` - Fetch user's budget

**Data Normalization**: Categories are automatically normalized to lowercase before storage.

## 🎨 Design System

### Responsive Breakpoints

- **Mobile**: xs (default)
- **Tablet**: `sm:` (640px)
- **Desktop**: `md:` (768px), `lg:` (1024px)

### Color Palette

- Primary: Blue (#3B82F6)
- Success: Emerald (#10B981)
- Danger: Rose (#F43F5E)
- Accent: Sky (#0EA5E9)

### Components

- All UI components use shadcn/ui
- Tailwind CSS for styling
- Mobile-first design approach

## 🚀 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Connect repository to Vercel
3. Set Root Directory to `spendwise`
4. Configure environment variables:
   - `DATABASE_URL`
   - `DIRECT_URL`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Deploy

## 📦 Available Scripts

```bash
npm run dev       # Start development server
npm run build     # Build for production
npm start         # Start production server
npm run lint      # Run ESLint
```

## 🐛 Common Issues

### Database Connection Error

- Verify `DATABASE_URL` and `DIRECT_URL` in `.env.local`
- Ensure Supabase project is active
- Run `npx prisma db push` to sync schema

### Auth Issues

- Check Supabase URL and anon key
- Clear browser cookies and try login again
- Verify email verification is complete

### Build Errors

- Run `npx prisma generate` after schema changes
- Clear `.next` folder: `rm -rf .next`
- Rebuild: `npm run build`

## 📝 Notes

- **Current Month Only**: Dashboard shows only current month's statistics
- **Category Normalization**: All categories saved in lowercase
- **Default Currency**: BDT (Bangladeshi Taka)
- **Mobile Responsive**: Fully optimized for mobile devices
- **Server-Side Auth**: Auth checks happen on server for security

## 📄 License

MIT

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
