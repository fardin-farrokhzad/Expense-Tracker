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
// Generate monthly data for the line chart one entry per month
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

// Return transactions filtered by timeframe
function filterByTimeframe(transactions, timeframe) {
  if (!timeframe || timeframe === 'all_time') return transactions;

  const now = new Date();
  let months = 0;
  switch (timeframe) {
    case 'last_1_month':
      months = 1;
      break;
    case 'last_3_months':
      months = 3;
      break;
    case 'last_6_months':
      months = 6;
      break;
    case 'last_12_months':
      months = 12;
      break;
    default:
      return transactions;
  }

  // Include the current month and the previous (months-1) months
  const start = new Date(now.getFullYear(), now.getMonth() - (months - 1), 1);
  const startTs = start.getTime();

  return transactions.filter(t => {
    const d = new Date(t.date);
    return d.getTime() >= startTs;
  });
}

// Main function – returns all data needed for the dashboard for a given timeframe
export function calculateDashboardData(transactions, timeframe = 'all_time') {
  // first filter transactions according to the selected timeframe
  const filtered = filterByTimeframe(transactions, timeframe);

  const totals = calculateTotals(filtered); // totals for the selected period
  const chartData = calculateMonthlyChartData(filtered);

  return {
    totals: {
      incomeTotal: totals.income,
      expenseTotal: totals.expense,
      balance: totals.income - totals.expense,
    },
    periodTotals: {
      income: totals.income,
      expense: totals.expense,
    },
    chartData,
  };
}
