# Budget Buddy - Personal Finance Manager

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=flat&logo=next.js)
![React](https://img.shields.io/badge/React-18.3-61DAFB?style=flat&logo=react)
![MongoDB](https://img.shields.io/badge/MongoDB-Latest-47A248?style=flat&logo=mongodb)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=flat&logo=tailwind-css)
![Vitest](https://img.shields.io/badge/Vitest-Tested-6E9F18?style=flat&logo=vitest)
![CI/CD](https://img.shields.io/github/actions/workflow/status/mrmartin1998/budget-buddy/ci.yml?label=CI%2FCD)

**A production-ready personal finance management platform with multi-account support, intelligent budget tracking, and real-time expense monitoring.**

[Features](#-features) • [Tech Stack](#-tech-stack) • [Architecture](#-system-architecture) • [Getting Started](#-getting-started) • [API](#-api-documentation)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [System Architecture](#-system-architecture)
- [Getting Started](#-getting-started)
- [API Documentation](#-api-documentation)
- [Testing](#-testing)
- [Skills Demonstrated](#-skills-demonstrated)
- [Development Roadmap](#-development-roadmap)
- [Contributing](#-contributing)

---

## 🎯 Overview

### The Problem
Managing personal finances across multiple accounts, tracking budgets, and understanding spending patterns can be overwhelming. Traditional tools are either too complex for everyday use or lack the features needed for comprehensive financial management.

### The Solution
Budget Buddy provides an elegant, intuitive platform for complete financial oversight. Track expenses across multiple accounts (cash, bank, credit cards, crypto), set intelligent budgets with flexible time periods, and gain insights through real-time analytics—all in one seamless experience.

### Key Differentiators
- **Multi-Account Architecture**: Manage unlimited accounts with different types (cash, bank, credit, savings, investment, crypto, loans)
- **Flexible Budget Periods**: Daily, weekly, monthly, or yearly budget tracking with automatic period calculations
- **Real-Time Synchronization**: Instant updates across all accounts and budgets when transactions are added or modified
- **Smart Filtering**: Filter transactions by account, date range, amount, and category for precise financial analysis
- **Professional UX**: Loading skeletons, error boundaries, and responsive design for a polished experience

---

## ✨ Features

### 💳 Account Management
- Create and manage multiple financial accounts
- Support for 8 account types: Cash, Bank, Credit Card, Savings, Investment, Cryptocurrency, Loan, Other
- Color-coded accounts for quick visual identification
- Real-time balance updates based on transactions
- Account filtering across all transaction views
- Safe account deletion with transaction validation

### 💰 Transaction Tracking
- Add income and expense transactions with detailed information
- Smart categorization system with 20+ predefined categories
- Custom category creation and management
- Transaction editing and deletion with balance recalculation
- Date range filtering for specific time period analysis
- Amount range filtering for expense analysis
- Multi-account transaction filtering
- Recent transactions widget on dashboard
- Detailed transaction history with edit/delete capabilities

### 📊 Budget Management
- Set budgets for specific categories with customizable limits
- Flexible budget periods: Daily, Weekly, Monthly, Yearly
- Real-time budget progress tracking with visual indicators
- Color-coded progress bars (green < 70%, yellow 70-90%, red > 90%)
- Budget alerts when spending exceeds thresholds
- Edit and delete budgets with historical data preservation
- Budget overview widget on dashboard
- Period-aware calculations (handles weekly/monthly/yearly accurately)

### 📈 Dashboard & Analytics
- Real-time financial statistics (total balance, income, expenses)
- Cash flow visualization with income vs. expenses comparison
- Category breakdown showing spending distribution
- Net flow calculations with positive/negative indicators
- Recent transactions preview
- Budget progress mini-widget
- Responsive grid layouts for all screen sizes
- Enhanced cash flow analysis with date range filtering

### 🔐 Authentication & Security
- JWT-based authentication with HTTP-only cookies
- 7-day token expiration with secure session management
- Password hashing with industry-standard algorithms
- Protected API routes with middleware validation
- Automatic token refresh handling
- Secure user data isolation

### 🎨 User Experience
- **Loading States**: Animated skeleton screens during data fetching
- **Error Boundaries**: Graceful error handling with user-friendly messages
- **Toast Notifications**: Success/error feedback for all actions
- **Alert System**: Budget threshold warnings
- **Responsive Design**: Mobile-first approach with seamless tablet/desktop scaling
- **Dark Mode Ready**: Prepared for theme switching

### 🧪 Quality Assurance
- 25+ comprehensive tests covering utilities and business logic
- Automated testing in CI/CD pipeline
- Code coverage reporting
- ESLint for code quality
- Production build verification

---

## 🛠️ Tech Stack

### Frontend Framework
**Next.js 14 (App Router) + React 18**
- *Why Next.js?* Server-side rendering, file-based routing, API routes in one framework
- *Why App Router?* Modern React Server Components, improved performance, better data fetching patterns
- Built-in optimization: Image optimization, code splitting, lazy loading

### Styling & UI
**Tailwind CSS 3.4**
- *Why Tailwind?* Rapid development with utility classes, consistent design system, minimal CSS bundle
- Responsive design utilities for mobile-first development
- Custom color palette for account types and budget indicators

### Database & ODM
**MongoDB + Mongoose**
- *Why MongoDB?* Flexible schema perfect for evolving financial data models
- *Why Mongoose?* Schema validation, middleware hooks, relationship management
- Efficient queries with indexed fields
- Referential integrity for user-account-transaction relationships

### Authentication
**JWT (jsonwebtoken) + HTTP-only Cookies**
- *Why JWT?* Stateless authentication, scalable across services
- *Why HTTP-only Cookies?* Protection against XSS attacks
- 7-day token expiration with automatic cleanup

### State Management
**React Context API**
- *Why Context?* Sufficient for app-level state, no external dependencies
- AccountContext: Global account state with CRUD operations
- ToastContext: App-wide notification system
- AuthProvider: Authentication state management

### Testing
**Vitest + React Testing Library**
- *Why Vitest?* Vite-powered, fast execution, ES modules support
- *Why RTL?* Test components like users interact with them
- Coverage reporting with v8 provider
- Automated testing in CI/CD

### DevOps & Deployment
**GitHub Actions + Vercel**
- *Why GitHub Actions?* Free CI/CD directly integrated with repository
- *Why Vercel?* Zero-config Next.js deployment, instant previews, automatic HTTPS
- Automated testing and build verification on every push/PR

### Development Tools
- **ESLint**: Code quality and consistency
- **PostCSS**: CSS processing for Tailwind
- **jsconfig.json**: Path aliases for clean imports (@/components, @/lib, etc.)

---

## 🏗️ System Architecture

### High-Level Architecture

```mermaid
graph TB
    Client[Client Browser]
    NextJS[Next.js Frontend<br/>React Components]
    API[API Routes<br/>Next.js Backend]
    Auth[JWT Auth<br/>Middleware]
    DB[(MongoDB<br/>Database)]
    
    Client -->|HTTPS| NextJS
    NextJS -->|API Calls| API
    API -->|Validate Token| Auth
    Auth -->|Query/Update| DB
    API -->|Query/Update| DB
    DB -->|Data| API
    API -->|JSON Response| NextJS
    NextJS -->|Render| Client
    
    style Client fill:#e1f5ff
    style NextJS fill:#61dafb
    style API fill:#47a248
    style Auth fill:#f7b731
    style DB fill:#13aa52
```

### Data Model

```mermaid
erDiagram
    User ||--o{ Account : owns
    User ||--o{ Transaction : creates
    User ||--o{ Budget : sets
    User ||--o{ Category : manages
    Account ||--o{ Transaction : contains
    Category ||--o{ Transaction : categorizes
    Category ||--o| Budget : tracks
    
    User {
        ObjectId _id PK
        string username
        string email
        string password
        datetime createdAt
    }
    
    Account {
        ObjectId _id PK
        ObjectId userId FK
        string name
        string type
        number balance
        string color
        datetime createdAt
    }
    
    Transaction {
        ObjectId _id PK
        ObjectId userId FK
        ObjectId accountId FK
        string type
        number amount
        string category
        string description
        date date
        datetime createdAt
    }
    
    Budget {
        ObjectId _id PK
        ObjectId userId FK
        string category
        number limit
        string period
        datetime createdAt
    }
    
    Category {
        ObjectId _id PK
        ObjectId userId FK
        string name
        string type
        boolean isCustom
    }
```

### Component Architecture

```
src/
├── app/                          # Next.js App Router
│   ├── (auth)/                  # Auth route group
│   │   ├── login/               
│   │   └── signup/              
│   ├── (dashboard)/             # Protected routes
│   │   ├── dashboard/           # Main dashboard
│   │   ├── transactions/        # Transaction management
│   │   ├── budgets/             # Budget management
│   │   └── categories/          # Category management
│   ├── (public)/                # Public landing page
│   ├── api/                     # API Routes
│   │   ├── auth/                # Authentication endpoints
│   │   ├── accounts/            # Account CRUD
│   │   ├── transactions/        # Transaction CRUD + stats
│   │   ├── budgets/             # Budget CRUD + progress
│   │   └── categories/          # Category management
│   ├── layout.js                # Root layout with providers
│   └── globals.css              # Global styles
│
├── components/
│   ├── accounts/                # Account UI components
│   │   ├── AccountCard.js       
│   │   ├── AccountManager.js    
│   │   └── AccountSelector.js   
│   ├── budget/                  # Budget UI components
│   │   ├── BudgetForm.js        
│   │   ├── BudgetProgress.js    
│   │   └── BudgetProgressMini.js
│   ├── transactions/            # Transaction UI components
│   │   ├── TransactionForm.js   
│   │   ├── TransactionList.js   
│   │   └── DetailedCashFlow.js  
│   ├── dashboard/               # Dashboard widgets
│   │   ├── StatsOverview.js     
│   │   ├── CashFlow.js          
│   │   ├── CategoryBreakdown.js 
│   │   └── RecentTransactions.js
│   ├── common/                  # Shared components
│   │   ├── ErrorBoundary.js     # Error handling
│   │   ├── Toast.js             # Notifications
│   │   ├── DateRangeFilter.js   
│   │   └── skeletons/           # Loading states
│   │       ├── CardSkeleton.js  
│   │       ├── ListSkeleton.js  
│   │       ├── ChartSkeleton.js 
│   │       └── StatCardSkeleton.js
│   └── providers/               # Context providers
│
├── contexts/                    # React Context
│   ├── AccountContext.js        # Account state
│   └── ToastContext.js          # Toast notifications
│
├── lib/
│   ├── db/
│   │   ├── connect.js           # MongoDB connection
│   │   └── models/              # Mongoose schemas
│   │       ├── User.js          
│   │       ├── Account.js       
│   │       ├── Transaction.js   
│   │       ├── Budget.js        
│   │       └── Category.js      
│   ├── middleware/
│   │   └── budgetCheck.js       # Budget alert middleware
│   ├── utils/
│   │   ├── auth.js              # JWT utilities
│   │   ├── budgetPeriodUtils.js # Period calculations
│   │   ├── dateFormatter.js     # Date utilities
│   │   └── accountUtils.js      # Account helpers
│   └── constants/
│       ├── categories.js        # Default categories
│       └── colors.js            # Account colors
│
└── __tests__/                   # Test suite
    ├── utils/                   
    │   ├── auth.test.js         # Authentication tests
    │   ├── budgetPeriodUtils.test.js
    │   └── dateFormatter.test.js
    └── setup.js                 # Test configuration
```

### Authentication Flow

```mermaid
sequenceDiagram
    participant User
    participant Client
    participant API
    participant JWT
    participant DB
    
    User->>Client: Enter credentials
    Client->>API: POST /api/auth/login
    API->>DB: Verify credentials
    DB-->>API: User data
    API->>JWT: Generate token (7d expiry)
    JWT-->>API: Signed JWT
    API-->>Client: Set HTTP-only cookie + user data
    Client->>Client: Store user in AuthContext
    Client-->>User: Redirect to dashboard
    
    Note over Client,API: Protected Route Access
    User->>Client: Navigate to /dashboard
    Client->>API: GET /api/dashboard/stats<br/>(with cookie)
    API->>JWT: Verify token
    alt Token valid
        JWT-->>API: Decoded user ID
        API->>DB: Fetch user data
        DB-->>API: Dashboard stats
        API-->>Client: JSON response
        Client-->>User: Display dashboard
    else Token invalid/expired
        JWT-->>API: Verification failed
        API-->>Client: 401 Unauthorized
        Client->>Client: Clear auth state
        Client-->>User: Redirect to login
    end
```

### Transaction Flow with Balance Updates

```mermaid
sequenceDiagram
    participant User
    participant Form
    participant API
    participant DB
    participant Account
    
    User->>Form: Submit transaction
    Form->>API: POST /api/transactions/add
    API->>DB: Create transaction
    DB-->>API: Transaction created
    API->>Account: Update account balance
    Account->>DB: Save new balance
    API->>DB: Check budget thresholds
    DB-->>API: Budget status
    API-->>Form: Success + alerts
    Form->>Form: Refresh transaction list
    Form->>Form: Update account context
    Form-->>User: Show success toast
    
    Note over User,Account: Real-time updates ensure<br/>all components reflect<br/>new balances immediately
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: 18.17 or higher
- **MongoDB**: Local instance or MongoDB Atlas account
- **npm** or **yarn**: Package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/mrmartin1998/budget-buddy.git
   cd budget-buddy
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create `.env.local` in the root directory:
   ```env
   # MongoDB Connection
   MONGODB_URI=mongodb://localhost:27017/budget-buddy
   # or for MongoDB Atlas:
   # MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/budget-buddy
   
   # JWT Secret (generate a strong random string)
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   
   # Next.js
   NEXT_PUBLIC_API_URL=http://localhost:3000
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

### Available Scripts

```bash
# Development
npm run dev          # Start development server (port 3000)

# Production
npm run build        # Create optimized production build
npm start            # Start production server

# Testing
npm test             # Run tests with Vitest
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Generate coverage report

# Code Quality
npm run lint         # Run ESLint
```

### Initial Setup

1. **Create an account** - Sign up with username, email, and password
2. **Add your first account** - Go to Transactions page and add a bank account, cash account, etc.
3. **Create categories** - Visit Categories page to customize your expense/income categories
4. **Set budgets** - Go to Budgets page and set spending limits for categories
5. **Start tracking** - Add your first transaction and watch your finances come to life!

---

## 📡 API Documentation

### Authentication Endpoints

#### POST `/api/auth/register`
Register a new user account.

**Request Body:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Response (201):**
```json
{
  "message": "User registered successfully",
  "user": {
    "_id": "65abc123...",
    "username": "john_doe",
    "email": "john@example.com"
  }
}
```

#### POST `/api/auth/login`
Authenticate user and receive JWT token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "user": {
    "_id": "65abc123...",
    "username": "john_doe",
    "email": "john@example.com"
  }
}
```
*Sets HTTP-only cookie with JWT token (7-day expiry)*

---

### Account Endpoints

#### GET `/api/accounts`
Get all accounts for authenticated user.

**Headers:** `Authorization: Bearer {token}` (or cookie)

**Response (200):**
```json
{
  "accounts": [
    {
      "_id": "65abc456...",
      "name": "Main Checking",
      "type": "bank",
      "balance": 2500.50,
      "color": "#3B82F6",
      "createdAt": "2026-03-01T10:30:00Z"
    }
  ]
}
```

#### POST `/api/accounts/add`
Create a new account.

**Request Body:**
```json
{
  "name": "Savings Account",
  "type": "savings",
  "balance": 10000,
  "color": "#10B981"
}
```

**Account Types:** `cash`, `bank`, `credit`, `savings`, `investment`, `crypto`, `loan`, `other`

#### PUT `/api/accounts/[id]`
Update account details.

#### DELETE `/api/accounts/[id]`
Delete an account (fails if transactions exist).

---

### Transaction Endpoints

#### GET `/api/transactions`
Get all transactions with optional filters.

**Query Parameters:**
- `start`: Start date (YYYY-MM-DD)
- `end`: End date (YYYY-MM-DD)
- `accounts`: Comma-separated account IDs
- `categories`: Comma-separated category names
- `minAmount`: Minimum transaction amount
- `maxAmount`: Maximum transaction amount

**Response (200):**
```json
{
  "transactions": [
    {
      "_id": "65abc789...",
      "type": "expense",
      "amount": 45.99,
      "category": "Groceries",
      "description": "Weekly shopping",
      "date": "2026-03-15",
      "accountId": {
        "_id": "65abc456...",
        "name": "Main Checking",
        "type": "bank"
      }
    }
  ]
}
```

#### POST `/api/transactions/add`
Create a new transaction.

**Request Body:**
```json
{
  "accountId": "65abc456...",
  "type": "expense",
  "amount": 45.99,
  "category": "Groceries",
  "description": "Weekly shopping",
  "date": "2026-03-15"
}
```

**Transaction Types:** `income`, `expense`

#### PUT `/api/transactions/[id]`
Update transaction (recalculates account balances).

#### DELETE `/api/transactions/[id]`
Delete transaction (reverses balance changes).

#### GET `/api/transactions/stats`
Get income/expense statistics for date range.

**Query Parameters:**
- `start`: Start date (required)
- `end`: End date (required)
- `accounts`: Filter by account IDs

**Response (200):**
```json
{
  "totalIncome": 5000.00,
  "totalExpenses": 3250.75,
  "netFlow": 1749.25
}
```

#### GET `/api/transactions/categories`
Get spending breakdown by category.

#### GET `/api/transactions/recent`
Get 5 most recent transactions.

---

### Budget Endpoints

#### GET `/api/budgets/progress`
Get all budgets with current spending progress.

**Response (200):**
```json
{
  "budgets": [
    {
      "_id": "65abcdef...",
      "category": "Groceries",
      "limit": 500,
      "period": "monthly",
      "spent": 325.50,
      "percentage": 65.1,
      "remaining": 174.50
    }
  ]
}
```

#### POST `/api/budgets/set`
Create or update a budget.

**Request Body:**
```json
{
  "category": "Groceries",
  "limit": 500,
  "period": "monthly"
}
```

**Budget Periods:** `daily`, `weekly`, `monthly`, `yearly`

#### PUT `/api/budgets/[id]`
Update budget limit or period.

#### DELETE `/api/budgets/[id]`
Delete a budget.

---

### Category Endpoints

#### GET `/api/categories`
Get all categories (default + custom).

**Response (200):**
```json
{
  "categories": [
    {
      "_id": "65abc001...",
      "name": "Groceries",
      "type": "expense",
      "isCustom": false
    },
    {
      "_id": "65abc002...",
      "name": "Freelance Work",
      "type": "income",
      "isCustom": true
    }
  ]
}
```

#### POST `/api/categories`
Create custom category.

#### DELETE `/api/categories/[id]`
Delete custom category (only if not used in transactions/budgets).

---

### Dashboard Endpoints

#### GET `/api/dashboard/stats`
Get aggregated dashboard statistics.

**Response (200):**
```json
{
  "totalBalance": 12500.50,
  "totalIncome": 5000.00,
  "totalExpenses": 3250.75,
  "accountCount": 4,
  "budgetAlerts": [
    {
      "category": "Dining Out",
      "percentage": 95,
      "message": "95% of budget used"
    }
  ]
}
```

---

## 🧪 Testing

Budget Buddy includes a comprehensive test suite ensuring reliability and maintainability.

### Test Coverage

- **25+ tests** covering critical business logic
- **Utility Functions**: Authentication, budget calculations, date formatting
- **Automated Testing**: CI/CD pipeline runs tests on every push/PR
- **Coverage Reporting**: Detailed coverage metrics with v8 provider

### Running Tests

```bash
# Run all tests
npm test

# Watch mode for development
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### Test Structure

```
__tests__/
├── utils/
│   ├── auth.test.js              # JWT generation, verification, expiration
│   ├── budgetPeriodUtils.test.js # Daily/weekly/monthly/yearly calculations
│   └── dateFormatter.test.js     # Date formatting and parsing
└── setup.js                      # Mock configuration (localStorage, Next.js router)
```

### Example Test Output

```
✓ __tests__/utils/auth.test.js (7 tests)
  ✓ JWT Token Management
    ✓ should generate a valid JWT token
    ✓ should verify a valid token
    ✓ should reject expired tokens
    ✓ should reject tampered tokens
    
✓ __tests__/utils/budgetPeriodUtils.test.js (13 tests)
  ✓ Budget Period Calculations
    ✓ should calculate daily period correctly
    ✓ should calculate weekly period correctly
    ✓ should calculate monthly period correctly
    ✓ should calculate yearly period correctly
    
Test Files  3 passed (3)
Tests       25 passed (25)
Start at    10:30:45
Duration    1.23s
```

---

## 💡 Skills Demonstrated

This project showcases a comprehensive range of modern web development skills:

### Full-Stack Development
- **Frontend**: React 18, Next.js 14 App Router, Server/Client Components
- **Backend**: Next.js API Routes, RESTful API design
- **Database**: MongoDB schema design, Mongoose ODM, data relationships
- **Authentication**: JWT implementation, secure cookie handling, token management

### React Ecosystem
- **Hooks**: useState, useEffect, useContext, useCallback, custom hooks
- **Context API**: Global state management for accounts, auth, toasts
- **Component Architecture**: Reusable components, composition patterns
- **Performance**: Loading states, error boundaries, optimistic updates

### UI/UX Design
- **Responsive Design**: Mobile-first approach, Tailwind CSS utilities
- **Loading States**: Skeleton screens for improved perceived performance
- **Error Handling**: User-friendly error boundaries with recovery options
- **Feedback Systems**: Toast notifications, visual progress indicators
- **Accessibility**: Semantic HTML, keyboard navigation, ARIA labels

### Database Design
- **Schema Modeling**: User, Account, Transaction, Budget, Category relationships
- **Data Integrity**: Foreign key references, cascade operations
- **Query Optimization**: Indexed fields, efficient lookups
- **Aggregation**: Complex calculations for budgets and statistics

### Business Logic
- **Financial Calculations**: Budget period calculations, balance updates
- **Real-Time Updates**: Synchronize data across multiple entities
- **Budget Tracking**: Threshold alerts, period-aware spending calculations
- **Transaction Management**: CRUD operations with balance reconciliation

### Testing & Quality
- **Unit Testing**: Vitest + React Testing Library
- **Test Coverage**: 25+ tests covering utilities and business logic
- **CI/CD**: GitHub Actions for automated testing and deployment
- **Code Quality**: ESLint, consistent code style, documentation

### DevOps & Deployment
- **Version Control**: Git workflow, feature branches, pull requests
- **CI/CD Pipeline**: Automated testing, build verification
- **Deployment**: Vercel for Next.js, zero-downtime deployments
- **Environment**: Environment variable management across environments

### Software Engineering Practices
- **Clean Code**: Meaningful names, single responsibility, DRY principles
- **Documentation**: Comprehensive README, inline code comments
- **Error Handling**: Try-catch blocks, graceful degradation
- **Security**: Input validation, SQL injection prevention, XSS protection
- **Scalability**: Modular architecture, separation of concerns

---

## 🗺️ Development Roadmap

### Implemented Features ✅
- [x] Multi-account management with 8 account types
- [x] Transaction tracking with categorization
- [x] Smart budget system with flexible periods
- [x] Real-time dashboard analytics
- [x] Date range and multi-filter support
- [x] JWT authentication with secure cookies
- [x] Error boundaries and loading states
- [x] Comprehensive test suite (25+ tests)
- [x] CI/CD pipeline with automated testing
- [x] Responsive mobile-first design

### Planned Enhancements 🚀

#### High Priority
- [ ] **Recurring Transactions**: Set up automatic income/expense entries
- [ ] **Budget Alerts**: Email/push notifications when approaching limits
- [ ] **Export Functionality**: Download transactions as CSV/PDF
- [ ] **Data Visualization**: Interactive charts with Chart.js or Recharts
- [ ] **Search Functionality**: Full-text search across transactions
- [ ] **Tags System**: Add custom tags to transactions for better organization

#### Medium Priority
- [ ] **Multi-Currency Support**: Handle different currencies with conversion rates
- [ ] **Split Transactions**: Divide single transactions across multiple categories
- [ ] **Savings Goals**: Track progress toward specific financial targets
- [ ] **Transaction Templates**: Save frequently-used transactions as templates
- [ ] **Monthly Reports**: Auto-generated financial summary reports
- [ ] **Account Sharing**: Collaborate on shared accounts with other users

#### Nice to Have
- [ ] **Dark Mode**: Full dark theme support
- [ ] **Mobile App**: React Native mobile application
- [ ] **Receipt Scanning**: OCR for receipt upload and parsing
- [ ] **Bank Integration**: Connect to banks via Plaid API
- [ ] **Bill Reminders**: Upcoming bill tracking and notifications
- [ ] **Investment Tracking**: Portfolio performance monitoring

### Technical Debt & Improvements
- [ ] Migrate to TypeScript for type safety
- [ ] Add component tests with React Testing Library
- [ ] Implement API route testing
- [ ] Add end-to-end tests with Playwright
- [ ] Optimize database queries with aggregation pipeline
- [ ] Implement proper error logging (Sentry)
- [ ] Add performance monitoring
- [ ] Implement caching strategy (Redis)

---

## 🤝 Contributing

Contributions are welcome! This project follows standard GitHub workflow practices.

### Getting Started

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Run tests**
   ```bash
   npm test
   npm run lint
   ```
5. **Commit your changes**
   ```bash
   git commit -m 'feat: add amazing feature'
   ```
6. **Push to your branch**
   ```bash
   git push origin feature/amazing-feature
   ```
7. **Open a Pull Request**

### Branch Strategy

This project follows GitFlow branching model:
- `main`: Production-ready code
- `develop`: Development branch
- `feature/*`: New features
- `bugfix/*`: Bug fixes
- `release/*`: Release preparation

See [BRANCH_STRATEGY.md](.github/BRANCH_STRATEGY.md) for detailed guidelines.

### Commit Conventions

Follow [Conventional Commits](https://www.conventionalcommits.org/):
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `test:` Test additions or changes
- `refactor:` Code refactoring
- `style:` Formatting, missing semi-colons, etc.
- `chore:` Maintenance tasks

### Code Review Checklist

Before submitting a PR, ensure:
- [ ] Code follows project style guidelines
- [ ] All tests pass (`npm test`)
- [ ] No console.logs in production code
- [ ] Meaningful commit messages
- [ ] Documentation updated if needed
- [ ] No breaking changes (or clearly documented)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 👨‍💻 Author

**Martin Emil Brabenec**
- GitHub: [@mrmartin1998](https://github.com/mrmartin1998)
- Project Repository: [budget-buddy](https://github.com/mrmartin1998/budget-buddy)

---

## 🙏 Acknowledgments

- Next.js team for the incredible framework
- MongoDB for flexible database solutions
- Tailwind CSS for rapid UI development
- Vitest team for fast, modern testing
- Open source community for inspiration and tools

---

<div align="center">

**Built with ❤️ using modern web technologies**

[⬆ Back to Top](#budget-buddy---personal-finance-manager)

</div>
