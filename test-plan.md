# Budget Buddy Production Testing Plan

## Pre-testing Setup
- [x] Clear browser cache and cookies
- [x] Have multiple devices ready (desktop, mobile, tablet)
- [x] Prepare test data (account names, transaction details, etc.)
- [x] Note down the production URL

## 1. Authentication Flow Testing
### Registration Testing
- [x] Test valid registration:
  ```
  Email: test.user@example.com
  Password: TestPass123!
  ```
- [x] Test invalid cases:
  - [x] Short password (less than 8 characters)
  - [x] Invalid email format
  - [x] Duplicate email registration
  - [x] Empty fields submission

### Login Testing
- [x] Test valid login with registered credentials
- [x] Test invalid cases:
  - [x] Wrong password
  - [x] Non-existent email
  - [x] Empty fields
- [x] Verify redirect to dashboard after successful login
- [x] Test "Remember me" functionality
- [x] Verify token storage in localStorage

Issues:
  - On the landing page, the logout button is visible but I haven't logged in yet... it should show login button instead.
  - There is no remember me functionality.


## 2. Dashboard Testing
- [x] Verify all dashboard components load:
  - [x] Account Manager
  - [x] Cash Flow chart
  - [x] Recent Transactions
  - [x] Category Breakdown
  - [x] Budget Progress
- [x] Test account selection filtering
- [x] Verify real-time updates of:
  - [x] Total balance
  - [x] Account balances
  - [x] Transaction list
  - [x] Budget progress

Issues:
  - Need to more features for accounts:
    - Can add account but Need to make a manage account, like changing the name, color, etc.
    - Need more account types, currently only cash and bank.
    - No way to exit the form (create account) when you start it. 

## 3. Account Management Testing
- [x] Create different account types:
  ```
  1. Checking Account (Initial: $1000)
  2. Savings Account (Initial: $5000)
  3. Credit Card (Initial: -$500)
  ```
- [x] Verify account listing displays correctly
- [x] Test account balance updates
- [x] Verify total balance calculation
- [x] Test account filtering in transaction view

Issues:
  - Adding the credit card account, the negative balance has no influence what so ever on the dashboard.

## 4. Transaction Management Testing
### Adding Transactions
- [ ] Test adding various transaction types:
  ```
  1. Income:
     - Salary deposit: $3000
     - Category: Income
     - Account: Checking

  2. Expense:
     - Grocery shopping: $150
     - Category: Food
     - Account: Credit Card

  3. Transfer:
     - From Checking to Savings: $500
  ```
- [x] Verify form validation
- [x] Check balance updates after transactions
- [x] Test transaction categorization

Issues:
  - The credit card account start at -500 i added 500 and it shows 500. it should show 0. (- 500 + 500 = 0).

### Transaction List
- [x] Test sorting functionality:
  - [x] By date
  - [x] By amount
  - [x] By category
- [x] Test filtering capabilities
- [x] Verify transaction editing
- [x] Test transaction deletion
- [x] Check date range filtering

Issues:
  - Add new filter features:
    - by amount
    - by category


Issues:
  - I keet running into a error to fetch data. I want to take a look at it. 

## 5. Budget Management Testing
### Budget Creation
- [x] Create test budgets:
  ```
  1. Groceries: $500/month
  2. Entertainment: $200/month
  3. Transportation: $300/month
  ```
- [x] Test budget limit validation
- [x] Verify budget creation feedback

Issues:
  - Add new budget features:
    - Need to add a way to edit the budget.
    - Need to add a way to delete the budget.
    - Need to add a way to exit the form (create budget) when you start it.
    - Need to be able to make the budget daily/weekly/monthly/yearly.

### Budget Monitoring
- [x] Verify budget progress calculations
- [x] Test budget alerts:
  - [x] Warning at 70% usage
  - [x] Alert at 90% usage
- [x] Check budget reset at month start
- [x] Verify budget vs actual spending

Issues:
  - Non of these features exist. Add them:
    - Warning at XX% usage.

## 6. UI/UX Testing
### Responsive Design
- [x] Test on different screen sizes:
  - [x] Mobile (320px - 480px)
  - [x] Tablet (768px - 1024px)
  - [x] Desktop (1024px+)
- [x] Verify navigation menu responsiveness
- [x] Check form layouts on different devices

Issues:
  - UI is alright just needs some polish and it should look better.

### Visual Elements
- [x] Verify toast notifications:
  - [x] Success messages
  - [x] Error messages
  - [x] Warning alerts
- [x] Test loading states
- [x] Check form validation messages
- [x] Verify color coding:
  - [x] Income (green)
  - [x] Expenses (red)
  - [x] Budget progress indicators

## 7. Error Handling
- [x] Test network error scenarios:
  - [x] Slow connection
  - [x] No connection
  - [x] API timeout
- [x] Verify error messages display
- [x] Check form validation errors
- [x] Test API error responses

## 8. Performance Testing
- [x] Measure load times:
  - [x] Initial page load
  - [x] Dashboard data loading
  - [x] Transaction list loading
- [x] Test with large datasets:
  - [x] Many transactions
  - [x] Multiple accounts
  - [x] Several budgets
- [x] Verify real-time updates performance

Issues:
  - I want a script to test big data sets. 

## Notes:
- Document any bugs found with:
  - Steps to reproduce
  - Expected behavior
  - Actual behavior
  - Screenshots
- Test on multiple browsers:
  - [x] Chrome
  - [x] Firefox
  - [x] Safari
  - [x] Edge
- Record performance metrics
- Note any UI/UX improvement suggestions