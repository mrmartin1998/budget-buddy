#!/usr/bin/env node

/**
 * Seed script for Budget Buddy demo data
 * Creates a demo user with realistic accounts, transactions, and budgets
 * 
 * Usage: npm run seed:demo
 */

const DEMO_USER = {
  email: 'demo@budgetbuddy.com',
  password: 'Demo2024!'
};

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// Account definitions
const ACCOUNTS = [
  { name: 'Main Checking', type: 'bank', balance: 2850, color: '#3B82F6' },
  { name: 'Savings Account', type: 'savings', balance: 12000, color: '#10B981' },
  { name: 'Credit Card', type: 'credit', balance: -450, color: '#EF4444' },
  { name: 'Cash Wallet', type: 'cash', balance: 120, color: '#F59E0B' },
  { name: 'Investment Portfolio', type: 'investment', balance: 25000, color: '#8B5CF6' }
];

// Transaction templates for realistic data
const TRANSACTION_TEMPLATES = {
  income: [
    { category: 'Salary', amounts: [3500], description: 'Monthly salary' },
    { category: 'Freelance', amounts: [500, 650, 800], description: 'Freelance project' },
    { category: 'Investments', amounts: [150, 200, 250, 300], description: 'Investment return' },
    { category: 'Other Income', amounts: [50, 75, 100], description: 'Cash gift' }
  ],
  expenses: [
    { category: 'Food', amounts: [40, 55, 75, 90, 110, 120], description: 'Grocery shopping', frequency: 15 },
    { category: 'Food', amounts: [15, 25, 35, 45, 55, 65], description: 'Dining out', frequency: 12 },
    { category: 'Transportation', amounts: [45, 55, 65, 75, 80], description: 'Gas fill-up', frequency: 9 },
    { category: 'Entertainment', amounts: [20, 35, 50, 85, 120, 150], description: 'Movies/Events', frequency: 8 },
    { category: 'Shopping', amounts: [30, 60, 95, 130, 175, 200], description: 'Clothing/Items', frequency: 10 },
    { category: 'Utilities', amounts: [120, 145, 165, 180], description: 'Monthly bills', frequency: 3 },
    { category: 'Healthcare', amounts: [25, 45, 125, 300], description: 'Doctor/Pharmacy', frequency: 4 },
    { category: 'Other', amounts: [5, 8, 12, 15], description: 'Coffee/Snacks', frequency: 10 },
    { category: 'Entertainment', amounts: [10, 13, 15, 20], description: 'Subscriptions', frequency: 6 }
  ]
};

// Budget configurations (calculated based on expected spending)
const BUDGETS = [
  { category: 'Groceries', limit: 500, period: 'monthly', type: 'expense' }, // Will be ~65% (green)
  { category: 'Dining Out', limit: 100, period: 'weekly', type: 'expense' },  // Will be ~87% (yellow)
  { category: 'Entertainment', limit: 150, period: 'monthly', type: 'expense' }, // Will be ~110% (red)
  { category: 'Coffee/Snacks', limit: 10, period: 'daily', type: 'expense' }, // Will be ~60% (green)
  { category: 'Transportation', limit: 300, period: 'monthly', type: 'expense' }, // Will be ~80% (yellow)
  { category: 'Shopping', limit: 250, period: 'monthly', type: 'expense' }, // Will be ~72% (yellow)
  { category: 'Healthcare', limit: 2000, period: 'yearly', type: 'expense' }, // Will be ~25% (green)
  { category: 'Subscriptions', limit: 50, period: 'monthly', type: 'expense' } // Will be ~120% (red)
];

// Helper to make authenticated API calls
let authCookie = null;

async function apiCall(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };

  if (authCookie) {
    headers['Cookie'] = authCookie;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers
    });

    // Store cookie from login
    if (response.headers.get('set-cookie')) {
      authCookie = response.headers.get('set-cookie');
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `API call failed: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error(`❌ Error calling ${endpoint}:`, error.message);
    throw error;
  }
}

// Generate random date within range
function randomDate(start, end) {
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  // Add random hour and minute
  date.setHours(Math.floor(Math.random() * 24));
  date.setMinutes(Math.floor(Math.random() * 60));
  return date;
}

// Get random item from array
function randomChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Step 1: Create or verify demo user
async function setupDemoUser() {
  console.log('\n📝 Setting up demo user...');
  
  try {
    // Try to login first
    const loginData = await apiCall('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: DEMO_USER.email,
        password: DEMO_USER.password
      })
    });
    
    console.log('✅ Demo user already exists, logged in successfully');
    return loginData.user;
  } catch (error) {
    // User doesn't exist, create new one
    console.log('📝 Creating new demo user...');
    
    const registerData = await apiCall('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(DEMO_USER)
    });
    
    // Login after registration
    await apiCall('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: DEMO_USER.email,
        password: DEMO_USER.password
      })
    });
    
    console.log('✅ Demo user created and logged in');
    return registerData.user;
  }
}

// Cleanup: Delete existing demo data
async function cleanupExistingData() {
  console.log('\n🧹 Cleaning up existing demo data...');
  
  try {
    // Delete existing budgets
    const budgetsResponse = await apiCall('/api/budgets/progress');
    if (budgetsResponse.budgets && budgetsResponse.budgets.length > 0) {
      for (const budget of budgetsResponse.budgets) {
        try {
          await apiCall(`/api/budgets/${budget._id}`, {
            method: 'DELETE'
          });
        } catch (error) {
          // Silent fail - budget might not exist
        }
      }
      console.log(`✅ Deleted ${budgetsResponse.budgets.length} existing budgets`);
    }
    
    // Delete existing accounts (this will cascade delete transactions)
    const accountsResponse = await apiCall('/api/accounts');
    if (accountsResponse.accounts && accountsResponse.accounts.length > 0) {
      for (const account of accountsResponse.accounts) {
        try {
          await apiCall(`/api/accounts/${account._id}`, {
            method: 'DELETE'
          });
        } catch (error) {
          // Silent fail - account might not exist
        }
      }
      console.log(`✅ Deleted ${accountsResponse.accounts.length} existing accounts`);
    }
  } catch (error) {
    console.log('ℹ️  No existing data to clean up (first run)');
  }
}

// Step 2: Create accounts
async function createAccounts() {
  console.log('\n💳 Creating accounts...');
  const createdAccounts = [];
  
  for (const account of ACCOUNTS) {
    try {
      const data = await apiCall('/api/accounts/add', {
        method: 'POST',
        body: JSON.stringify(account)
      });
      
      createdAccounts.push(data.account);
      console.log(`✅ Created account: ${account.name} ($${account.balance})`);
    } catch (error) {
      console.error(`❌ Failed to create account: ${account.name}`);
    }
  }
  
  return createdAccounts;
}

// Step 3: Create transactions
async function createTransactions(accounts) {
  console.log('\n💰 Creating transactions...');
  
  // Date range: April 1 - June 30, 2026 (3 months)
  const startDate = new Date('2026-04-01');
  const endDate = new Date('2026-06-30');
  
  const transactions = [];
  const accountsWithBalance = accounts.filter(a => a.balance > 0);
  
  // Create monthly salary (3 times)
  for (let month = 3; month <= 5; month++) { // April=3, May=4, June=5
    const salaryDate = new Date(2026, month, 1);
    transactions.push({
      accountId: accounts.find(a => a.type === 'bank')?._id,
      type: 'income',
      category: 'Salary',
      amount: 3500,
      description: 'Monthly salary',
      date: salaryDate
    });
  }
  
  // Create freelance income (random)
  for (let i = 0; i < 5; i++) {
    const template = TRANSACTION_TEMPLATES.income[1];
    transactions.push({
      accountId: accounts.find(a => a.type === 'bank')?._id,
      type: 'income',
      category: template.category,
      amount: randomChoice(template.amounts),
      description: template.description,
      date: randomDate(startDate, endDate)
    });
  }
  
  // Create investment returns (monthly)
  for (let month = 3; month <= 5; month++) {
    const template = TRANSACTION_TEMPLATES.income[2];
    const returnDate = new Date(2026, month, 15 + Math.floor(Math.random() * 10));
    transactions.push({
      accountId: accounts.find(a => a.type === 'investment')?._id,
      type: 'income',
      category: template.category,
      amount: randomChoice(template.amounts),
      description: template.description,
      date: returnDate
    });
  }
  
  // Create expenses based on templates
  for (const template of TRANSACTION_TEMPLATES.expenses) {
    for (let i = 0; i < template.frequency; i++) {
      // Distribute across different accounts
      let accountId;
      const rand = Math.random();
      if (rand < 0.70) {
        // 70% from checking
        accountId = accounts.find(a => a.type === 'bank')?._id;
      } else if (rand < 0.85) {
        // 15% from credit card
        accountId = accounts.find(a => a.type === 'credit')?._id;
      } else if (rand < 0.95) {
        // 10% from cash
        accountId = accounts.find(a => a.type === 'cash')?._id;
      } else {
        // 5% from savings
        accountId = accounts.find(a => a.type === 'savings')?._id;
      }
      
      transactions.push({
        accountId,
        type: 'expense',
        category: template.category,
        amount: randomChoice(template.amounts),
        description: template.description,
        date: randomDate(startDate, endDate)
      });
    }
  }
  
  // Sort by date
  transactions.sort((a, b) => new Date(a.date) - new Date(b.date));
  
  // Create transactions via API
  let created = 0;
  for (const transaction of transactions) {
    try {
      await apiCall('/api/transactions/add', {
        method: 'POST',
        body: JSON.stringify(transaction)
      });
      created++;
      
      // Show progress every 10 transactions
      if (created % 10 === 0) {
        console.log(`  ⏳ Created ${created}/${transactions.length} transactions...`);
      }
    } catch (error) {
      console.error(`❌ Failed to create transaction: ${transaction.description}`);
    }
  }
  
  console.log(`✅ Created ${created} transactions`);
  return created;
}

// Step 4: Create budgets
async function createBudgets() {
  console.log('\n📊 Creating budgets...');
  
  for (const budget of BUDGETS) {
    try {
      await apiCall('/api/budgets/set', {
        method: 'POST',
        body: JSON.stringify(budget)
      });
      
      console.log(`✅ Created budget: ${budget.category} ($${budget.limit}/${budget.period})`);
    } catch (error) {
      // Budget might already exist (unique constraint)
      if (error.message.includes('duplicate')) {
        console.log(`⚠️  Budget already exists: ${budget.category}`);
      } else {
        console.error(`❌ Failed to create budget: ${budget.category}`);
      }
    }
  }
}

// Main execution
async function main() {
  console.log('🌱 Budget Buddy - Demo Data Seed Script');
  console.log('========================================');
  
  try {
    // Step 1: Setup user
    const user = await setupDemoUser();
    
    // Step 1.5: Cleanup existing data
    await cleanupExistingData();
    
    // Step 2: Create accounts
    const accounts = await createAccounts();
    console.log(`✅ Created ${accounts.length} accounts`);
    
    // Step 3: Create transactions
    const transactionCount = await createTransactions(accounts);
    
    // Step 4: Create budgets
    await createBudgets();
    
    console.log('\n✨ Demo data creation complete!');
    console.log('\n📋 Summary:');
    console.log(`  User: ${DEMO_USER.email}`);
    console.log(`  Password: ${DEMO_USER.password}`);
    console.log(`  Accounts: ${accounts.length}`);
    console.log(`  Transactions: ${transactionCount}`);
    console.log(`  Budgets: ${BUDGETS.length}`);
    console.log('\n🎉 You can now login and explore the demo data!');
    
  } catch (error) {
    console.error('\n❌ Seed script failed:', error.message);
    process.exit(1);
  }
}

// Run the script
main();
