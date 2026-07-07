# Scripts Documentation

## Demo Data Seed Script

### Overview
The `seed-demo-data.js` script creates realistic demo data for Budget Buddy, perfect for:
- Portfolio demonstrations
- Screenshots for README
- Testing the application
- Showing features to recruiters

### Usage

**Start your development server first:**
```bash
npm run dev
```

**Then run the seed script in a new terminal:**
```bash
npm run seed:demo
```

### What Gets Created

#### Demo User
- **Email:** `demo@budgetbuddy.com`
- **Password:** `Demo2024!`
- **Username:** Demo User

#### Accounts (5)
1. **Main Checking** - $2,850 (Bank, Blue)
2. **Savings Account** - $12,000 (Savings, Green)
3. **Credit Card** - -$450 (Credit, Red - shows debt)
4. **Cash Wallet** - $120 (Cash, Orange)
5. **Investment Portfolio** - $25,000 (Investment, Purple)

**Total Net Worth:** ~$39,520

#### Transactions (~85)
Spanning **April 1 - June 30, 2026** (3 months):

**Income (~18 transactions):**
- Monthly salary: $3,500 x 3
- Freelance work: $500-$800 (random)
- Investment returns: $150-$300 (monthly)
- Other income: $50-$100 (occasional)

**Expenses (~67 transactions):**
- Groceries: 15 transactions ($40-$120)
- Dining out: 12 transactions ($15-$65)
- Transportation: 9 transactions ($45-$80)
- Entertainment: 8 transactions ($20-$150)
- Shopping: 10 transactions ($30-$200)
- Utilities: 3 transactions ($120-$180)
- Healthcare: 4 transactions ($25-$300)
- Coffee/Snacks: 10 transactions ($5-$15)
- Subscriptions: 6 transactions ($10-$20)

**Distribution:**
- 70% from checking account
- 15% from credit card
- 10% from cash
- 5% from savings

#### Budgets (8)
Shows all budget states and periods:

| Category | Limit | Period | Expected % | Status |
|----------|-------|--------|------------|--------|
| Food (Groceries) | $500 | Monthly | ~65% | 🟢 Green |
| Food (Dining) | $100 | Weekly | ~87% | 🟡 Yellow |
| Entertainment | $150 | Monthly | ~110% | 🔴 Red (Over) |
| Other (Coffee) | $10 | Daily | ~60% | 🟢 Green |
| Transportation | $300 | Monthly | ~80% | 🟡 Yellow |
| Shopping | $250 | Monthly | ~72% | 🟡 Yellow |
| Healthcare | $2,000 | Yearly | ~25% | 🟢 Green |
| Subscriptions | $50 | Monthly | ~120% | 🔴 Red (Over) |

✅ All 4 period types represented (daily, weekly, monthly, yearly)  
✅ Shows 3 status zones (green, yellow, red)  
✅ Demonstrates budget alerts

### Features Demonstrated

This demo data showcases:
- ✅ Multi-account management with different types
- ✅ Positive and negative balances (credit card debt)
- ✅ Realistic transaction patterns over time
- ✅ Budget tracking with multiple periods
- ✅ Over-budget and under-budget scenarios
- ✅ Budget alerts (>90% spent)
- ✅ Category breakdown analytics
- ✅ Cash flow visualization
- ✅ Recent transactions
- ✅ Account filtering capabilities

### Running Multiple Times

The script is **fully idempotent** - you can run it multiple times safely:

1. If demo user doesn't exist, it creates one
2. If demo user exists, it logs in
3. **Automatically deletes** all existing accounts, transactions, and budgets
4. Creates fresh demo data with consistent results

**Each run gives you a clean slate** - perfect for:
- Resetting demo data for screenshots
- Testing after making changes
- Showing fresh data to different audiences

No manual cleanup needed!

### Troubleshooting

**Error: "connect ECONNREFUSED"**
- Development server is not running
- Start it with `npm run dev` first

**Error: "API call failed: 401"**
- Authentication cookie may have expired
- Script will automatically re-login and continue

**Error: "Failed to delete account/budget"**
- First run - no existing data to delete (this is normal)
- Script continues and creates fresh data

### Advanced Usage

**Custom API URL:**
```bash
NEXT_PUBLIC_API_URL=http://localhost:4000 npm run seed:demo
```

**Production seeding (not recommended):**
```bash
NEXT_PUBLIC_API_URL=https://your-production-url.vercel.app npm run seed:demo
```
⚠️ **Warning:** Only seed demo data in development!

### File Structure
```
scripts/
└── seed-demo-data.js    # Main seed script (standalone, no dependencies)
```

### Implementation Details

**Approach:**
- Uses existing API endpoints (not direct DB access)
- Respects all Zod validation schemas
- Follows business logic (balance calculations, etc.)
- Handles authentication via cookies
- Generates realistic random dates

**Why API-based?**
- ✅ Tests the API endpoints
- ✅ Validates all data through Zod schemas
- ✅ Follows same path as real users
- ✅ Easier to debug
- ✅ Works with production too (if needed)

### Next Steps

After running the seed script:

1. **Login** with demo credentials
2. **Take screenshots** for README
3. **Test all features** with realistic data
4. **Show recruiters** the fully functional demo

---

**Questions?** Check the main [README.md](../README.md) or review the seed script code.
