import React, { useContext, useMemo } from 'react';
import { TransactionContext } from '/src/context/TransactionContext.jsx';
import styles from './Dashboard.module.css';
import DoughnutChart from './components/DoughnutChart/DoughnutChart.jsx';
import BarChart from './components/BarChart/BarChart.jsx';
import LineChart from './components/LineChart/LineChart.jsx';

function Dashboard() {
  const { state: data } = useContext(TransactionContext);

  // Total calculations
  const totals = useMemo(() => {
    const incomeTotal = data.filter(item => item.type === 'income').reduce((acc, item) => acc + item.amount, 0);
    const expenseTotal = data.filter(item => item.type === 'expense').reduce((acc, item) => acc + item.amount, 0);
    const balance = incomeTotal - expenseTotal;
    return { incomeTotal, expenseTotal, balance };
  }, [data]);

  // Monthly totals
  const currentMonth = new Date().getMonth();
  const monthlyData = useMemo(() => data.filter(item => new Date(item.date).getMonth() === currentMonth), [data]);

  const monthlyTotals = useMemo(() => {
    const income = monthlyData.filter(item => item.type === 'income').reduce((acc, item) => acc + item.amount, 0);
    const expense = monthlyData.filter(item => item.type === 'expense').reduce((acc, item) => acc + item.amount, 0);
    return { income, expense };
  }, [monthlyData]);

  // Line chart data
  const lineChartData = useMemo(() => {
    const sortedData = [...data].sort((a, b) => new Date(a.date) - new Date(b.date));
    const labels = sortedData.map(item => item.date);
    const incomeLine = sortedData.map(item => (item.type === 'income' ? item.amount : 0));
    const expenseLine = sortedData.map(item => (item.type === 'expense' ? item.amount : 0));
    return { labels, incomeLine, expenseLine };
  }, [data]);

  return (
    <div className={styles.container}>
      <h1>داشبورد</h1>

      {/* Summary Cards */}
      <div className={styles.summary__cards}>
        <div className={styles.card}>
          <span>مجموع درآمد</span>
          <p className={styles.income}>{totals.incomeTotal}</p>
        </div>
        <div className={styles.card}>
          <span>مجموع هزینه</span>
          <p className={styles.expense}>{totals.expenseTotal}</p>
        </div>
        <div className={styles.card}>
          <span>تراز</span>
          <p className={styles.balance}>{totals.balance}</p>
        </div>
      </div>

      {/* Charts */}
      {data.length > 0 ? (
        <div className={styles.charts}>
          <div className={`${styles.chart__wrapper} ${styles.bar}`}>
            <span>درآمد و هزینه ماه جاری</span>
            <BarChart monthlyIncome={monthlyTotals.income} monthlyExpense={monthlyTotals.expense} />
          </div>

          <div className={`${styles.chart__wrapper} ${styles.line}`}>
            <span>روند درآمد و هزینه</span>
            <LineChart labels={lineChartData.labels} incomeData={lineChartData.incomeLine} expenseData={lineChartData.expenseLine} />
          </div>

          <div className={`${styles.chart__wrapper} ${styles.doughnut}`}>
            <span>درآمد vs هزینه کل</span>
            <DoughnutChart incomeTotal={totals.incomeTotal} expenseTotal={totals.expenseTotal} />
          </div>
        </div>
      ) : (
        <p className={styles.no__data}>هیچ داده‌ای موجود نیست</p>
      )}
    </div>
  );
}

export default Dashboard;
