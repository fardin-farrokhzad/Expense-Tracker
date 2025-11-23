# Expense Tracker

Expense Tracker is a web-based financial management application built with **React.js** and **Vite**. It provides users with an intuitive interface for tracking personal expenses and incomes, visualizing their financial activity, and maintaining full control over cash flow through a responsive and minimal design.

The application enables users to create, edit, and delete transactions, flag them as expenses or incomes, and view all data in a structured transaction table. Data persistence is handled through the browser’s **localStorage**, ensuring that user information remains available across sessions without requiring external databases or backend integration.

### Core Features
  
- Add, edit, and delete transactions with a smooth modal experience
- Automatic categorization: Income vs Expense
- Real-time summary tables:
  - All-time totals
  - Current month overview
  - Previous month comparison
- Beautiful interactive charts:
  - Line chart (monthly trend)
  - Bar chart (income vs expense comparison)
  - Doughnut chart (expense/income ratio)  
- Responsive design – works perfectly on mobile and desktop
- Clean, reusable components and utility functions
- Structured multi-page routing with **React Router**  
- Zero backend – all data stored in browser's localStorage (via Context API) 
- Clean and consistent code quality ensured by **ESLint** and **Prettier**

### Built With
- **React.js**
- **Vite**
- **JavaScript (ES6+)**
- **CSS Modules / Native CSS**
- **React Router**
- **ESLint** and **Prettier**

  
## Getting Started

### Prerequisites
- Node.js 
- npm

## Installation & Running the App

### 1. Clone the repository
git clone https://github.com/fardin-farrokhzad/Expense-Tracker.git

### 2. Go into the project folder
cd Expense-Tracker

### 3. Install dependencies
npm install

### 4. Start the server
npm run dev
