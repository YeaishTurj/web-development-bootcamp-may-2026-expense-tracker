# SpendWise — Personal Finance SaaS

## Project Tagline

# **Polished Production-Ready Personal Finance Dashboard**

NOT: half-finished super-ambitious fintech platform

---

## 🎯 Core Philosophy

**Build one thing really well, not ten things poorly.**

Focus on:

- ✅ Auth (solid)
- ✅ CRUD (polished)
- ✅ Analytics (clean)
- ✅ Responsive UI (flawless)
- ✅ Deployment (working)

NOT on:

- ❌ Complex debt reconciliation
- ❌ Realtime websockets
- ❌ Advanced algorithms
- ❌ Overengineered schema

---

## ⚠️ Most Important Rule

**If Day 2 evening comes: STOP ADDING FEATURES.**

Only focus on:

- Polish spacing
- Fix bugs
- Improve typography
- Responsive tweaks
- README + screenshots

These increase score WAY more than rushed functionality.

---

# ✅ Final Tech Stack

```txt
Next.js App Router
       ↓
Supabase Auth
       ↓
Server Actions / Route Handlers
       ↓
Prisma ORM
       ↓
Supabase PostgreSQL
```

## Frontend

- Next.js 16 (App Router)
- TypeScript
- TailwindCSS
- shadcn/ui
- Recharts (charts only)
- React Hook Form
- Zod



---

## Backend

- Prisma 7 (ORM)
- Supabase PostgreSQL
- Supabase Auth

---

## Deployment

- Vercel (frontend)
- Supabase (database + auth)

---

## 🧪 Local Development

Run from the app directory:

```bash
cd YeaishTurj/spendwise
npm install
npm run dev
```

Notes:

- If port 3000 is busy, Next.js will use 3001 automatically.
- Use this project path for all npm commands: `YeaishTurj/spendwise`.

---

# ✅ Final Feature Scope

## 🔥 Tier 1 — MUST COMPLETE (Days 1-2 Morning)

These are non-negotiable. Build in this exact order.

---

### 1. Authentication

- Signup
- Login
- Logout
- Protected dashboard
- Session persistence (Supabase)

---

### 2. Expense CRUD

- Add expense / income
- Edit expense
- Delete expense
- Categories
- Recurring toggle

---

### 3. Dashboard

Summary Cards:

- Balance card
- Expense card
- Income card
- Recent transactions list

---

### 4. Analytics

Charts (Recharts):

- Pie chart (expense by category)
- Monthly trend chart (bar)

---

### 5. Responsive UI

- Mobile-first design
- Desktop optimized
- Clean spacing
- Modern typography

---

### 6. Dark Mode

Very high ROI feature. Toggle in settings.

---

### 7. Deployment

Must be flawless. Test on production link.

---

## 💪 Tier 2 — Strong Bonus (Day 2 Afternoon if complete)

Build ONLY after Tier 1 is solid.

---

### Budget Planner (Lite)

Simple version:

- Set monthly limit
- Show remaining amount
- Progress bar

Low complexity, high visual value.

---

### Shared Expense Groups Lite ⭐

**Important:** This is NOT a full debt reconciliation engine.

What users can do:

- Create group
- Add members manually
- Add shared expense
- See equal split display

Example:

```txt
Dinner = ৳1200
Members = 4
Each owes = ৳300
```

Why this works:

- Shows advanced schema (relational)
- Many-to-many relations
- Collaboration feature
- Higher difficulty perception

WITHOUT:

- Settlement algorithms
- Complex debt graph
- Balance resolution logic

---

## ⏸️ Tier 3 — Only if Extra Time (Unlikely)

Do NOT start these unless Tier 1 + 2 complete by Day 2 2pm.

- CSV export
- Receipt image upload
- Profile settings
- Transaction search/filter

---

# ❌ DO NOT BUILD

These waste time with no score impact:

- Realtime sync
- Websockets
- AI analytics
- Push notifications
- Complex RBAC
- Payment gateways
- OCR scanning
- Mobile app
- Microservices
- Advanced caching

---

# 🧠 What Evaluators Actually Score

| Criteria          | Impact  |
| ----------------- | ------- |
| UI polish         | VERY HI |
| Deployment works  | VERY HI |
| Auth system       | HIGH    |
| ORM usage         | HIGH    |
| Responsive design | HIGH    |
| Advanced schema   | HIGH    |
| Fancy algorithms  | LOW     |
| Code cleanliness  | HIGH    |

**Key insight:** A half-broken "advanced feature" reduces confidence.
A polished basic feature increases it.

---

# 🗃️ Final Prisma Schema Design

## Core Models

### User

Connected to Supabase Auth. Additional profile data if needed.

---

### Expense

- title, amount, category
- type (income/expense)
- recurring toggle
- createdAt, updatedAt

---

### Category

Custom categories per user.

---

### Budget

Monthly spending targets.

---

### Group

Shared expense groups.

---

### GroupMember

Group membership relation (many-to-many).

---

### SharedExpense

Expenses inside groups.

---

### ExpenseSplit

Tracks who owes whom (simplified = equal split).

---

# 🏗️ App Structure

```txt
src/
 ├── app/
 │    ├── (auth)/
 │    │    ├── signup/
 │    │    └── login/
 │    ├── dashboard/
 │    ├── expenses/
 │    ├── groups/
 │    ├── analytics/
 │    ├── budget/
 │    ├── settings/
 │    └── api/
 │
 ├── components/
 │    ├── dashboard/
 │    ├── charts/
 │    ├── forms/
 │    ├── expense/
 │    ├── group/
 │    └── ui/
 │
 ├── lib/
 │    ├── prisma.ts
 │    ├── supabase.ts
 │    ├── validations.ts
 │    └── utils.ts
 │
 ├── actions/
 │
 └── types/
```

---

# 🎨 Design Direction

## Visual Style

Modern fintech SaaS.

## Colors

- Primary: Emerald / Green
- Background: Soft gray + dark mode

## Typography

- Clean, modern fonts
- Good hierarchy
- Readable on mobile

---

# 📊 Expected Deliverable

By end of Day 2, you should have:

✅ Deployed production link
✅ Working auth system
✅ Full CRUD for expenses
✅ Beautiful dashboard
✅ 2 analytics charts
✅ Mobile-responsive
✅ Dark mode toggle
✅ Clean README with screenshots

Optional bonus:
⭐ Budget planner
⭐ Shared groups lite
⭐ Deployment docs

---

# 🚀 Your Competitive Edge

You already have:

- Next.js experience
- Frontend design skills
- Full-stack basics
- Portfolio visibility

Most competitors will have:

- ❌ Ugly UI
- ❌ Incomplete deployment
- ❌ Broken auth
- ❌ Tutorial-level dashboard

If yours looks **premium, responsive, and cohesive**, reviewers will instantly remember it.

---

# ✨ Final Verdict

A polished SpendWise app with:

- ✅ Auth
- ✅ Analytics
- ✅ Beautiful dashboard
- ✅ Prisma ORM
- ✅ Responsive UI
- ✅ Deployed production link

**Already looks internship-worthy.**

Focus on execution, not ambition. Finish strong. 🎯
