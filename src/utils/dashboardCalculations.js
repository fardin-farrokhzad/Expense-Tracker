// Calculate total all-time income and expense
export function calculateTotals(transactions) {
  return transactions.reduce(
    (acc, t) => {
      const amount = Number(t.amount);
      if (t.type === 'income') acc.income += amount;
      else if (t.type === 'expense') acc.expense += amount;
      return acc;
    },
    { income: 0, expense: 0 }
  );
}

// Calculate income and expense for the current month only
export function calculateCurrentMonthTotals(transactions) {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  return transactions.reduce(
    (acc, t) => {
      const date = new Date(t.date);
      if (
        date.getFullYear() === currentYear &&
        date.getMonth() === currentMonth
      ) {
        const amount = Number(t.amount);
        if (t.type === 'income') acc.income += amount;
        else if (t.type === 'expense') acc.expense += amount;
      }
      return acc;
    },
    { income: 0, expense: 0 }
  );
}

// Calculate income and expense for the previous month
export function calculateLastMonthTotals(transactions) {
  const now = new Date();
  const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const year = lastMonthDate.getFullYear();
  const month = lastMonthDate.getMonth();

  return transactions.reduce(
    (acc, t) => {
      const date = new Date(t.date);
      if (date.getFullYear() === year && date.getMonth() === month) {
        const amount = Number(t.amount);
        if (t.type === 'income') acc.income += amount;
        else if (t.type === 'expense') acc.expense += amount;
      }
      return acc;
    },
    { income: 0, expense: 0 }
  );
}

// Generate monthly data for the line chart (one entry per month)
export function calculateMonthlyChartData(transactions) {
  if (transactions.length === 0) return [];

  const dates = transactions.map(t => new Date(t.date));
  const minDate = new Date(Math.min(...dates));
  const maxDate = new Date(Math.max(...dates));

  const startYear = minDate.getFullYear();
  const startMonth = minDate.getMonth();
  const endYear = maxDate.getFullYear();
  const endMonth = maxDate.getMonth();

  const monthsMap = {};
  let current = new Date(startYear, startMonth, 1);

  // Fill map with every month between first and last transaction
  while (
    current.getFullYear() < endYear ||
    (current.getFullYear() === endYear && current.getMonth() <= endMonth)
  ) {
    const key = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, '0')}`;
    monthsMap[key] = { monthYear: key, income: 0, expense: 0 };
    current.setMonth(current.getMonth() + 1);
  }

  // Aggregate transaction amounts into corresponding months
  transactions.forEach(t => {
    const date = new Date(t.date);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const amount = Number(t.amount);

    if (monthsMap[key]) {
      if (t.type === 'income') monthsMap[key].income += amount;
      else if (t.type === 'expense') monthsMap[key].expense += amount;
    }
  });

  return Object.keys(monthsMap)
    .sort()
    .map(key => monthsMap[key]);
}

// Main function – returns all data needed for the dashboard
export function calculateDashboardData(transactions) {
  const allTotals = calculateTotals(transactions);
  const monthly = calculateCurrentMonthTotals(transactions);
  const lastMonth = calculateLastMonthTotals(transactions);
  const chartData = calculateMonthlyChartData(transactions);

  return {
    totals: {
      incomeTotal: allTotals.income,
      expenseTotal: allTotals.expense,
      balance: allTotals.income - allTotals.expense,
    },
    monthlyTotals: {
      income: monthly.income,
      expense: monthly.expense,
    },
    lastMonthSummary: {
      income: lastMonth.income,
      expense: lastMonth.expense,
      balance: lastMonth.income - lastMonth.expense,
    },
    chartData,
  };
}
