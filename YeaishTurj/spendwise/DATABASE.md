# SpendWise Database Documentation

Complete guide to the SpendWise database schema, data models, and relationships using Prisma ORM with PostgreSQL.

---

## 📋 Table of Contents

1. [Database Overview](#database-overview)
2. [Schema Models](#schema-models)
3. [Data Types & Constraints](#data-types--constraints)
4. [Relationships & Isolation](#relationships--isolation)
5. [Migrations](#migrations)
6. [Queries & Examples](#queries--examples)
7. [Performance Considerations](#performance-considerations)
8. [Troubleshooting](#troubleshooting)

---

## Database Overview

### Tech Stack

- **Database**: PostgreSQL (hosted on Supabase)
- **ORM**: Prisma 7.8.0
- **Connection**: Direct URL for migrations, standard URL for app
- **Authentication**: Supabase Auth (JWT-based)

### Connection Details

The database uses two connection strings:

```env
# Standard connection (for app runtime)
DATABASE_URL="postgresql://user:password@host.supabase.co:5432/postgres"

# Direct connection (for migrations, requires direct access)
DIRECT_URL="postgresql://user:password@host.supabase.co:6543/postgres"
```

### User Data Isolation

All data is isolated by **userId** (Supabase user ID). Each user sees only their own expenses and budgets:

```
User Authentication (Supabase)
    ↓
Supabase Session
    ↓
Extract user.id
    ↓
Filter queries by userId
```

---

## Schema Models

### Expense Model

Represents a single transaction (income or expense).

```prisma
model Expense {
  id        String   @id @default(cuid())
  title     String
  amount    Float
  category  String
  type      String   // "income" | "expense"
  currency  String   @default("BDT")
  recurring Boolean  @default(false)

  userId    String

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

#### Fields

| Field       | Type     | Default | Description                                                  |
| ----------- | -------- | ------- | ------------------------------------------------------------ |
| `id`        | String   | CUID    | Unique transaction identifier                                |
| `title`     | String   | —       | Transaction description (e.g., "Grocery Shopping", "Salary") |
| `amount`    | Float    | —       | Transaction amount in specified currency                     |
| `category`  | String   | —       | Expense category (e.g., "Food", "Transport", "Salary")       |
| `type`      | String   | —       | Either `"income"` or `"expense"`                             |
| `currency`  | String   | "BDT"   | 3-letter currency code (BDT, USD, EUR, GBP, INR)             |
| `recurring` | Boolean  | false   | Whether this is a recurring transaction                      |
| `userId`    | String   | —       | Supabase auth user ID (for data isolation)                   |
| `createdAt` | DateTime | now()   | Timestamp when expense was created                           |
| `updatedAt` | DateTime | now()   | Last updated timestamp                                       |

#### Validation Rules

- `title`: Non-empty string, max 255 characters
- `amount`: Positive number, validated in API layer
- `category`: One of predefined categories (Food, Transport, Utilities, Entertainment, Salary, Other)
- `type`: Only "income" or "expense"
- `currency`: ISO 4217 3-letter code
- `recurring`: Boolean (not actively used in current version, reserved for future)

#### Example Records

```sql
-- Grocery expense
INSERT INTO "Expense" (id, title, amount, category, type, currency, "userId", "createdAt", "updatedAt")
VALUES ('cuid1', 'Grocery Shopping', 1500.00, 'Food', 'expense', 'BDT', 'user-123', now(), now());

-- Monthly salary
INSERT INTO "Expense" (id, title, amount, category, type, currency, "userId", "createdAt", "updatedAt")
VALUES ('cuid2', 'Monthly Salary', 50000.00, 'Salary', 'income', 'BDT', 'user-123', now(), now());
```

---

### Budget Model

Represents a user's monthly budget for spending.

```prisma
model Budget {
  id        String   @id @default(cuid())

  amount    Float
  currency  String   @default("BDT")

  userId    String

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

#### Fields

| Field       | Type     | Default | Description                                |
| ----------- | -------- | ------- | ------------------------------------------ |
| `id`        | String   | CUID    | Unique budget identifier                   |
| `amount`    | Float    | —       | Monthly budget limit in specified currency |
| `currency`  | String   | "BDT"   | 3-letter currency code                     |
| `userId`    | String   | —       | Supabase auth user ID (for data isolation) |
| `createdAt` | DateTime | now()   | Timestamp when budget was created          |
| `updatedAt` | DateTime | now()   | Last updated timestamp                     |

#### Validation Rules

- `amount`: Positive number (non-zero)
- `currency`: ISO 4217 3-letter code (matches Expense currency)

#### Example Record

```sql
-- Monthly budget of 50,000 BDT
INSERT INTO "Budget" (id, amount, currency, "userId", "createdAt", "updatedAt")
VALUES ('cuid3', 50000.00, 'BDT', 'user-123', now(), now());
```

---

## Data Types & Constraints

### Primary Keys

Both models use **CUID** (Collision-resistant unique identifier):

- Format: `cuid()` generated by Prisma
- Example: `c4a4w7x9z2q1m9p8`
- Advantages:
  - URL-friendly
  - Collision-resistant
  - Better performance than UUID for database indexing
  - Sortable by creation time

### Timestamps

All models include automatic timestamps:

- `@default(now())` - Server-side timestamp on creation
- `@updatedAt` - Automatically updated on any modification

### Data Validation

Validation occurs at multiple layers:

1. **Database Level**: PostgreSQL type checking (Float, String, DateTime)
2. **Prisma Level**: Schema constraints
3. **API Level** (Server Actions):
   - Zod schema validation for input
   - Type checking via TypeScript
   - Business logic validation (amounts > 0, valid categories)

### Storage Size

Estimated storage per record:

- **Expense**: ~150-250 bytes (depending on title/category length)
- **Budget**: ~120-180 bytes

For 10,000 expenses per user: ~2.5 MB

---

## Relationships & Isolation

### Data Isolation Pattern

Each user's data is isolated using `userId`:

```typescript
// Fetch only user's expenses (in Server Action)
const expenses = await prisma.expense.findMany({
  where: {
    userId: session.user.id, // ← User-scoped query
  },
});
```

### No Explicit Foreign Keys

Currently, there are **no explicit foreign key relationships** to Supabase Auth tables:

- `userId` is a string reference to Supabase user.id
- No FOREIGN KEY constraint in database (by design)
- Allows Supabase Auth table changes without migrations

### Why This Design?

✅ Advantages:

- Flexibility with Auth table schema changes
- Simple, straightforward isolation
- No referential integrity overhead

⚠️ Considerations:

- Orphaned records if user is deleted (can add cleanup triggers)
- Must validate userId exists in auth layer

---

## Migrations

### Initial Schema

The current schema represents the initial production migration.

### Running Migrations

**Dev environment:**

```bash
npx prisma migrate dev --name add_expense_budget_models
```

**Production:**

```bash
npx prisma migrate deploy
```

### Viewing Migration History

```bash
# See all applied migrations
npx prisma migrate status

# View migration file
cat prisma/migrations/[timestamp]_init/migration.sql
```

### Creating New Migrations

After modifying `schema.prisma`:

```bash
# Create migration with descriptive name
npx prisma migrate dev --name descriptive_name

# Or use:
npx prisma migrate diff --from-empty --to-schema-datamodel --script
```

### Prisma Studio (Interactive DB Browser)

```bash
# Open interactive database GUI
npx prisma studio
```

Accessible at `http://localhost:5555`

---

## Queries & Examples

### Using Prisma Client

All queries use the `prisma` client instance imported from `@/lib/db` or `@/lib/prisma`:

```typescript
import { prisma } from "@/lib/db";
```

### Create Operations

#### Add Expense

```typescript
const expense = await prisma.expense.create({
  data: {
    title: "Grocery Shopping",
    amount: 1500,
    category: "Food",
    type: "expense",
    currency: "BDT",
    recurring: false,
    userId: session.user.id,
  },
});
```

#### Set Budget

```typescript
const budget = await prisma.budget.upsert({
  where: { userId: session.user.id },
  update: { amount: 50000 },
  create: {
    amount: 50000,
    currency: "BDT",
    userId: session.user.id,
  },
});
```

### Read Operations

#### Fetch All User Expenses

```typescript
const expenses = await prisma.expense.findMany({
  where: { userId: session.user.id },
  orderBy: { createdAt: "desc" },
});
```

#### Filter by Type (Income vs Expense)

```typescript
// Only expenses
const expenses = await prisma.expense.findMany({
  where: {
    userId: session.user.id,
    type: "expense",
  },
});

// Only income
const income = await prisma.expense.findMany({
  where: {
    userId: session.user.id,
    type: "income",
  },
});
```

#### Filter by Date Range

```typescript
const monthStart = new Date(2026, 4, 1); // May 1, 2026
const monthEnd = new Date(2026, 5, 1); // June 1, 2026

const expenses = await prisma.expense.findMany({
  where: {
    userId: session.user.id,
    createdAt: {
      gte: monthStart,
      lt: monthEnd,
    },
  },
});
```

#### Get User Budget

```typescript
const budget = await prisma.budget.findFirst({
  where: { userId: session.user.id },
});
```

### Update Operations

#### Update Expense

```typescript
const updated = await prisma.expense.update({
  where: { id: expenseId },
  data: {
    title: "Updated Title",
    amount: 2000,
    category: "Transport",
  },
});
```

**Important**: Always validate that expense belongs to current user before updating:

```typescript
// Verify ownership
const expense = await prisma.expense.findUnique({
  where: { id: expenseId },
});

if (expense?.userId !== session.user.id) {
  throw new Error("Unauthorized");
}

// Then update
await prisma.expense.update({ ... });
```

### Delete Operations

#### Delete Expense

```typescript
const deleted = await prisma.expense.delete({
  where: { id: expenseId },
});
```

#### Delete with Verification

```typescript
// Verify ownership first
const expense = await prisma.expense.findUnique({
  where: { id: expenseId },
});

if (expense?.userId !== session.user.id) {
  throw new Error("Unauthorized");
}

// Delete
await prisma.expense.delete({
  where: { id: expenseId },
});
```

### Aggregation Queries

#### Total Expenses for Month

```typescript
const stats = await prisma.expense.aggregate({
  where: {
    userId: session.user.id,
    type: "expense",
    createdAt: {
      gte: monthStart,
      lt: monthEnd,
    },
  },
  _sum: { amount: true },
  _count: true,
});

console.log(`Total spent: ${stats._sum.amount}`);
console.log(`Number of transactions: ${stats._count}`);
```

#### Group by Category

```typescript
const byCategory = await prisma.expense.groupBy({
  by: ["category"],
  where: {
    userId: session.user.id,
    type: "expense",
  },
  _sum: { amount: true },
  _count: true,
});

// Result: [
//   { category: "Food", _sum: { amount: 5000 }, _count: 2 },
//   { category: "Transport", _sum: { amount: 2000 }, _count: 1 }
// ]
```

---

## Performance Considerations

### Indexing

Currently, indexes are created automatically on:

- Primary keys (`id`)
- Foreign key references (`userId`) - implicit

**Future optimization** might add:

```prisma
// Recommended indexes for common queries
model Expense {
  @@index([userId])
  @@index([userId, createdAt])
  @@index([userId, type])
  @@index([userId, category])
}

model Budget {
  @@unique([userId])  // Only one budget per user
}
```

### Query Optimization

1. **Always filter by userId** in WHERE clause
2. **Use pagination** for large datasets:

```typescript
const expenses = await prisma.expense.findMany({
  where: { userId: session.user.id },
  take: 50, // Limit to 50 records
  skip: 0, // Offset
  orderBy: { createdAt: "desc" },
});
```

3. **Select only needed fields**:

```typescript
const expenses = await prisma.expense.findMany({
  where: { userId: session.user.id },
  select: {
    id: true,
    title: true,
    amount: true,
    category: true,
  },
  // ↑ Omit: type, currency, recurring, userId, timestamps
});
```

4. **Batch queries** when possible:

```typescript
// Good: One query with aggregation
const stats = await prisma.expense.aggregate({ ... });

// Avoid: Multiple queries
const totalExpense = await prisma.expense.aggregate({ type: "expense" });
const totalIncome = await prisma.expense.aggregate({ type: "income" });
```

---

## Troubleshooting

### Migration Issues

**Problem**: `FATAL: Ident authentication failed for user`

**Solution**:

- Check DATABASE_URL and DIRECT_URL are correct
- Verify credentials in Supabase dashboard
- Ensure DIRECT_URL uses port 6543 (direct connection)

```bash
# Verify connection
psql $DATABASE_URL -c "SELECT 1"
```

### Prisma Client Issues

**Problem**: `error PrismaClientInitializationError`

**Solution**:

```bash
# Reinstall Prisma Client
npx prisma generate

# Or complete reinstall
rm -rf node_modules/@prisma
npm install
```

### Query Not Returning Results

**Problem**: `findMany()` returns empty array even though data exists

**Solution**: Verify userId filtering:

```typescript
// Check what userId is being used
console.log("Current user ID:", session.user.id);

// Query without userId filter to debug
const allExpenses = await prisma.expense.findMany();
console.log("All expenses:", allExpenses.length);

// Then add userId filter
const userExpenses = await prisma.expense.findMany({
  where: { userId: session.user.id },
});
```

### Data Type Mismatches

**Problem**: `amount` stored as integer instead of float

**Solution**: Ensure API layer converts to Float:

```typescript
// Schema validation (Zod)
const expenseSchema = z.object({
  amount: z.coerce.number().positive(), // ← Coerce to number
  // ...
});

// Or explicit conversion
const amount = parseFloat(req.body.amount);
```

### Performance Degradation

**Problem**: Queries slow with large datasets

**Solution**:

1. Add indexes (see Performance section)
2. Implement pagination
3. Use query caching at API level
4. Consider denormalizing frequently aggregated data

```typescript
// Example: Cache aggregation result
cache.set(`user-stats-${userId}`, stats, 3600); // 1 hour TTL
```

---

## Next Steps

### Recommended Improvements

1. **Add Unique Constraint to Budget**:

   ```prisma
   model Budget {
     @@unique([userId])  // Only one budget per user
   }
   ```

2. **Add Explicit Indexes**:

   ```prisma
   model Expense {
     @@index([userId, createdAt])
   }
   ```

3. **Add Referential Integrity** (optional):

   ```prisma
   model Expense {
     user   User @relation(fields: [userId], references: [id], onDelete: Cascade)
   }
   ```

4. **Archiving Strategy**: Add soft deletes for audit trail:
   ```prisma
   model Expense {
     deletedAt DateTime?
   }
   ```

---

## Support

For issues or questions:

- Check Prisma docs: https://www.prisma.io/docs/
- Supabase PostgreSQL: https://supabase.com/docs/guides/database
- See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for Server Actions
