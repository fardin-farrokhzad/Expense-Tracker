import { useContext, useMemo } from 'react';
import { TransactionContext } from '/src/context/TransactionContext.jsx';
import { calculateDashboardData } from '/src/utils/dashboardCalculations.js';
import { formatNumber } from '/src/utils/formatNumber.js';
import styles from './Dashboard.module.css';
import DoughnutChart from './components/DoughnutChart/DoughnutChart.jsx';
import BarChart from './components/BarChart/BarChart.jsx';
import LineChart from './components/LineChart/LineChart.jsx';
import SummaryTables from './components/SummaryTables/SummaryTables.jsx';

function Dashboard() {
  const { state: transactions } = useContext(TransactionContext);

  // Memoized dashboard data – recalculates only when transactions change
  const { totals, monthlyTotals, lastMonthSummary, chartData } = useMemo(() => {
    return calculateDashboardData(transactions);
  }, [transactions]);

  const hasData = transactions.length > 0;

  return (
    <div className={styles.container}>
      <h1>داشبورد</h1>

      {/* Summary cards – total income, expense and balance */}
      <div className={styles.summary__cards}>
        <div className={`${styles.card} ${styles.card__income}`}>
          <span>مجموع درآمد</span>
          <p className={styles.income}>{formatNumber(totals.incomeTotal)}</p>
        </div>
        <div className={`${styles.card} ${styles.card__expense}`}>
          <span>مجموع هزینه</span>
          <p className={styles.expense}>{formatNumber(totals.expenseTotal)}</p>
        </div>
        <div
          className={`${styles.card} ${totals.balance >= 0 ? styles.balance : styles.balance__negative}`}
        >
          <span>تراز</span>
          <p>{formatNumber(totals.balance)}</p>
        </div>
      </div>

      {/* Tables and charts*/}
      {hasData ? (
        <>
          <SummaryTables
            totals={totals}
            monthlyTotals={monthlyTotals}
            lastMonthSummary={lastMonthSummary}
          />

          <div className={styles.charts}>
            {/* Current month income vs expense */}
            <div className={`${styles.chart__wrapper} ${styles.bar}`}>
              <span>درآمد و هزینه (ماه جاری)</span>
              <BarChart
                monthlyIncome={monthlyTotals.income}
                monthlyExpense={monthlyTotals.expense}
              />
            </div>

            {/* All-time income vs expense */}
            <div className={`${styles.chart__wrapper} ${styles.doughnut}`}>
              <span>درآمد و هزینه (کل)</span>
              <DoughnutChart
                incomeTotal={totals.incomeTotal}
                expenseTotal={totals.expenseTotal}
              />
            </div>

            {/* Monthly */}
            <div className={`${styles.chart__wrapper} ${styles.line}`}>
              <span>روند ماهانه</span>
              <LineChart data={chartData} />
            </div>
          </div>
        </>
      ) : (
        <p className={styles.no__data}>هنوز هیچ تراکنشی ثبت نشده است.</p>
      )}
    </div>
  );
}

export default Dashboard;
