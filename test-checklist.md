# Budget Buddy Production Testing Plan

## Pre-testing Setup
- [ ] Clear browser cache and cookies
- [ ] Have multiple devices ready (desktop, mobile, tablet)
- [ ] Prepare test data (account names, transaction details, etc.)
- [ ] Note down the production URL

## 1. Authentication Flow Testing
### Registration Testing
- [ ] Test valid registration:
  ```
  Email: test.user@example.com
  Password: TestPass123!
  ```
- [ ] Test invalid cases:
  - [ ] Short password (less than 8 characters)
  - [ ] Invalid email format
  - [ ] Duplicate email registration
  - [ ] Empty fields submission

### Login Testing
- [ ] Test valid login with registered credentials
- [ ] Test invalid cases:
  - [ ] Wrong password
  - [ ] Non-existent email
  - [ ] Empty fields
- [ ] Verify redirect to dashboard after successful login
- [ ] Test "Remember me" functionality
- [ ] Verify token storage in localStorage

Issues:
  - On the landing page, the logout button is visible but I haven't logged in yet... it should show login button instead.
  - There is no remember me functionality.

## 2. Dashboard Testing
- [ ] Verify all dashboard components load:
  - [ ] Account Manager
  - [ ] Cash Flow chart
  - [ ] Recent Transactions
  - [ ] Category Breakdown
  - [ ] Budget Progress
- [ ] Test account selection filtering
- [ ] Verify real-time updates of:
  - [ ] Total balance
  - [ ] Account balances
  - [ ] Transaction list
  - [ ] Budget progress

Issues:
  - Need to more features for accounts:
    - Can add account but Need to make a manage account, like changing the name, color, etc.
    - Need more account types, currently only cash and bank.
    - No way to exit the form (create account) when you start it. 

## 3. Account Management Testing
- Create different account types:
  ```
  1. Checking Account (Initial: $1000)
  2. Savings Account (Initial: $5000)
  3. Credit Card (Initial: -$500)
  ```
- Verify account listing displays correctly
- Test account balance updates
- Verify total balance calculation
- Test account filtering in transaction view

Issues:
  - Adding the credit card account, the negative balance has no influence what so ever on the dashboard.

## 4. Transaction Management Testing
### Adding Transactions
- Test adding various transaction types:
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
- Verify form validation
- Check balance updates after transactions
- Test transaction categorization

Issues:
  - The credit card account start at -500 i added 500 and it shows 500. it should show 0. (- 500 + 500 = 0).

### Transaction List
- Test sorting functionality:
  - By date
  - By amount
  - By category
- Test filtering capabilities
- Verify transaction editing
- Test transaction deletion
- Check date range filtering

Issues:
  - Add new filter features:
    - by amount
    - by category

Issues:
  - I keet running into a error to fetch data. I want to take a look at it. 

## 5. Budget Management Testing
### Budget Creation
- Create test budgets:
  ```
  1. Groceries: $500/month
  2. Entertainment: $200/month
  3. Transportation: $300/month
  ```
- Test budget limit validation
- Verify budget creation feedback
- Test period selection (daily/weekly/monthly/yearly)
- Test form closing functionality

### Budget Management
- Test edit budget functionality:
  - Change budget amount
  - Change budget period
  - Verify updates reflect immediately
- Test delete budget functionality:
  - Confirm deletion modal
  - Verify budget removal
  - Check cascade effects

### Budget Progress Tracking
- Verify budget progress calculations
- Test color-coded progress bars:
  - Green (0-70%)
  - Yellow (71-90%)
  - Red (>90%)
- Check budget period calculations:
  - Daily reset
  - Weekly reset
  - Monthly reset
  - Yearly reset
- Verify budget vs actual spending

## 6. UI/UX Testing
### Responsive Design
- Test on different screen sizes:
  - Mobile (320px - 480px)
  - Tablet (768px - 1024px)
  - Desktop (1024px+)
- Verify navigation menu responsiveness
- Check form layouts on different devices

Issues:
  - UI is alright just needs some polish and it should look better.

### Visual Elements
- Verify toast notifications:
  - Success messages
  - Error messages
  - Warning alerts
- Test loading states
- Check form validation messages
- Verify color coding:
  - Income (green)
  - Expenses (red)
  - Budget progress indicators

## 7. Error Handling
- Test network error scenarios:
  - Slow connection
  - No connection
  - API timeout
- Verify error messages display
- Check form validation errors
- Test API error responses

## 8. Performance Testing
- Measure load times:
  - Initial page load
  - Dashboard data loading
  - Transaction list loading
- Test with large datasets:
  - Many transactions
  - Multiple accounts
  - Several budgets
- Verify real-time updates performance

Issues:
  - I want a script to test big data sets. 

## Notes:
- Document any bugs found with:
  - Steps to reproduce
  - Expected behavior
  - Actual behavior
  - Screenshots
- Test on multiple browsers:
  - [ ] Chrome
  - [ ] Firefox
  - [ ] Safari
  - [ ] Edge
- Record performance metrics
- Note any UI/UX improvement suggestions