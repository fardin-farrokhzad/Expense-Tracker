import { useContext, useMemo, useState } from 'react';
import { TransactionContext } from '/src/context/TransactionContext.jsx';
import { calculateDashboardData } from '/src/utils/dashboardCalculations.js';
import { formatNumber } from '/src/utils/formatNumber.js';
import styles from './Dashboard.module.css';
import DoughnutChart from './components/DoughnutChart/DoughnutChart.jsx';
import BarChart from './components/BarChart/BarChart.jsx';
import LineChart from './components/LineChart/LineChart.jsx';
import SummaryTables from './components/SummaryTables/SummaryTables.jsx';

const TIMEFRAMES = [
  { value: 'all_time', label: 'همه تراکنش‌ها' },
  { value: 'last_1_month', label: '1 ماه گذشته' },
  { value: 'last_3_months', label: '3 ماه گذشته' },
  { value: 'last_6_months', label: '6 ماه گذشته' },
  { value: 'last_12_months', label: '12 ماه گذشته' },
];

function Dashboard() {
  const { transactions, isLoading, error } = useContext(TransactionContext);

  const [timeframe, setTimeframe] = useState('all_time');

  const { totals, periodTotals, chartData } = useMemo(() => {
    return calculateDashboardData(transactions, timeframe);
  }, [transactions, timeframe]);

  const hasData = transactions.length > 0;

  return (
    <div className={styles.container}>
      <div className={styles.dashboard__header}>
        <h1>داشبورد</h1>

        <div className={styles.timeframe__selector}>
          <label htmlFor='timeframe-select'>فیلتر بازه زمانی</label>
          <select
            id='timeframe-select'
            value={timeframe}
            onChange={e => setTimeframe(e.target.value)}
          >
            {TIMEFRAMES.map(tf => (
              <option key={tf.value} value={tf.value}>
                {tf.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className='loader__container'>
          <div className='loader'></div>
        </div>
      ) : error ? (
        <div className='error__container'>
          <p className={styles.error__text}>خطا در بارگذاری داده‌ها</p>
          <button
            className={styles.retry__button}
            onClick={() => window.location.reload()}
          >
            تلاش مجدد
          </button>
        </div>
      ) : (
        <>
          {/* Controls: timeframe selector + Summary cards */}
          <div className={styles.controls}>
            <div className={styles.summary__cards}>
              <div className={`${styles.card} ${styles.card__income}`}>
                <span>مجموع درآمد</span>
                <p className={styles.income}>
                  {formatNumber(totals.incomeTotal)}
                </p>
              </div>
              <div className={`${styles.card} ${styles.card__expense}`}>
                <span>مجموع هزینه</span>
                <p className={styles.expense}>
                  {formatNumber(totals.expenseTotal)}
                </p>
              </div>
              <div
                className={`${styles.card} ${
                  totals.balance >= 0
                    ? styles.balance
                    : styles.balance__negative
                }`}
              >
                <span>تراز</span>
                <p
                  className={
                    totals.balance >= 0 ? 'balance' : 'balance__negative'
                  }
                >
                  {formatNumber(totals.balance)}
                </p>
              </div>
            </div>
          </div>

          {hasData ? (
            <>
              <SummaryTables
                totals={totals}
                periodTotals={periodTotals}
                timeframeLabel={
                  TIMEFRAMES.find(t => t.value === timeframe)?.label
                }
              />
              <div className={styles.charts}>
                <div className={`${styles.chart__wrapper} ${styles.bar}`}>
                  <span>
                    درآمد و هزینه (
                    {TIMEFRAMES.find(t => t.value === timeframe)?.label})
                  </span>
                  <BarChart
                    income={periodTotals.income}
                    expense={periodTotals.expense}
                  />
                </div>
                <div className={`${styles.chart__wrapper} ${styles.doughnut}`}>
                  <span>
                    درآمد و هزینه (
                    {TIMEFRAMES.find(t => t.value === timeframe)?.label})
                  </span>
                  <DoughnutChart
                    incomeTotal={periodTotals.income}
                    expenseTotal={periodTotals.expense}
                  />
                </div>
                <div className={`${styles.chart__wrapper} ${styles.line}`}>
                  <span>
                    روند ماهانه (
                    {TIMEFRAMES.find(t => t.value === timeframe)?.label})
                  </span>
                  <LineChart data={chartData} />
                </div>
              </div>
            </>
          ) : (
            <p className={styles.no__data}>هنوز هیچ تراکنشی ثبت نشده است.</p>
          )}
        </>
      )}
    </div>
  );
}

export default Dashboard;
