import { useContext, useMemo } from 'react';
import { TransactionContext } from '/src/context/TransactionContext.jsx';
import styles from './Dashboard.module.css';
import DoughnutChart from './components/DoughnutChart/DoughnutChart.jsx';
import BarChart from './components/BarChart/BarChart.jsx';
import LineChart from './components/LineChart/LineChart.jsx';

function Dashboard() {
  const { state: data } = useContext(TransactionContext);

  const { totals, monthlyTotals, lastMonthSummary, chartData } = useMemo(() => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    // Last month
    const lastMonthDate = new Date(now);
    lastMonthDate.setMonth(currentMonth - 1);
    const lastYear = lastMonthDate.getFullYear();
    const lastMonth = lastMonthDate.getMonth();

    // Accumulators
    let totalIncome = 0;
    let totalExpense = 0;
    let currentMonthIncome = 0;
    let currentMonthExpense = 0;
    let lastMonthIncome = 0;
    let lastMonthExpense = 0;

    const monthlySummary = {};

    data.forEach(item => {
      const date = new Date(item.date);
      const year = date.getFullYear();
      const monthIndex = date.getMonth();
      const monthKey = `${year}-${String(monthIndex + 1).padStart(2, '0')}`;

      // Initialize month
      if (!monthlySummary[monthKey]) {
        monthlySummary[monthKey] = {
          monthYear: monthKey,
          درآمد: 0,
          هزینه: 0,
        };
      }

      const amount = item.amount;

      if (item.type === 'income') {
        totalIncome += amount;
        monthlySummary[monthKey].درآمد += amount;

        // Current month
        if (year === currentYear && monthIndex === currentMonth) {
          currentMonthIncome += amount;
        }

        // Last month
        if (year === lastYear && monthIndex === lastMonth) {
          lastMonthIncome += amount;
        }
      } else if (item.type === 'expense') {
        totalExpense += amount;
        monthlySummary[monthKey].هزینه += amount;

        if (year === currentYear && monthIndex === currentMonth) {
          currentMonthExpense += amount;
        }

        if (year === lastYear && monthIndex === lastMonth) {
          lastMonthExpense += amount;
        }
      }
    });

    // Sort months
    const chartData = Object.values(monthlySummary).sort((a, b) =>
      a.monthYear.localeCompare(b.monthYear)
    );

    const totalBalance = totalIncome - totalExpense;
    const lastMonthBalance = lastMonthIncome - lastMonthExpense;

    return {
      totals: {
        incomeTotal: totalIncome,
        expenseTotal: totalExpense,
        balance: totalBalance,
      },
      monthlyTotals: {
        income: currentMonthIncome,
        expense: currentMonthExpense,
      },
      lastMonthSummary: {
        income: lastMonthIncome,
        expense: lastMonthExpense,
        balance: lastMonthBalance,
      },
      chartData,
    };
  }, [data]);

  // Helper for dynamic balance class
  const getBalanceClass = value =>
    value >= 0 ? styles.balance : styles.balance__negative;

  return (
    <div className={styles.container}>
      <h1>داشبورد</h1>

      {/* Summary Cards */}
      <div className={styles.summary__cards}>
        <div className={`${styles.card} ${styles.card__income}`}>
          <span>مجموع درآمد</span>
          <p className={styles.income}>{totals.incomeTotal}</p>
        </div>
        <div className={`${styles.card} ${styles.card__expense}`}>
          <span>مجموع هزینه</span>
          <p className={styles.expense}>{totals.expenseTotal}</p>
        </div>
        <div className={`${styles.card} ${getBalanceClass(totals.balance)}`}>
          <span>تراز</span>
          <p>{totals.balance}</p>
        </div>
      </div>

      {/* Charts & Tables */}
      {data.length > 0 ? (
        <>
          {/* Summary Tables */}
          <div className={styles.summary__tables}>
            <div className={styles.table__section}>
              <h2>خلاصه تراکنش‌ها (همه)</h2>
              <table>
                <thead>
                  <tr>
                    <th className={styles.type}>نوع</th>
                    <th className={styles.amount}>مقدار</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>درآمد</td>
                    <td className={styles.income}>
                      {totals.incomeTotal} تومان
                    </td>
                  </tr>
                  <tr>
                    <td>هزینه</td>
                    <td className={styles.expense}>
                      {totals.expenseTotal} تومان
                    </td>
                  </tr>
                  <tr>
                    <td>تراز</td>
                    <td className={getBalanceClass(totals.balance)}>
                      {totals.balance} تومان
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className={styles.table__section}>
              <h2>خلاصه تراکنش‌ها (ماه گذشته)</h2>
              <table>
                <thead>
                  <tr>
                    <th className={styles.type}>نوع</th>
                    <th className={styles.amount}>مقدار</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>درآمد</td>
                    <td className={styles.income}>
                      {lastMonthSummary.income} تومان
                    </td>
                  </tr>
                  <tr>
                    <td>هزینه</td>
                    <td className={styles.expense}>
                      {lastMonthSummary.expense} تومان
                    </td>
                  </tr>
                  <tr>
                    <td>تراز</td>
                    <td className={getBalanceClass(lastMonthSummary.balance)}>
                      {lastMonthSummary.balance} تومان
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className={styles.charts}>
            <div className={`${styles.chart__wrapper} ${styles.bar}`}>
              <span>درآمد و هزینه (ماه جاری)</span>
              <BarChart
                monthlyIncome={monthlyTotals.income}
                monthlyExpense={monthlyTotals.expense}
              />
            </div>
            <div className={`${styles.chart__wrapper} ${styles.doughnut}`}>
              <span>هزینه و درآمد (کل)</span>
              <DoughnutChart
                incomeTotal={totals.incomeTotal}
                expenseTotal={totals.expenseTotal}
              />
            </div>

            <div className={`${styles.chart__wrapper} ${styles.line}`}>
              <span>روند درآمد و هزینه (ماهانه)</span>
              <LineChart data={chartData} />
            </div>
          </div>
        </>
      ) : (
        <p className={styles.no__data}>هیچ داده‌ای موجود نیست</p>
      )}
    </div>
  );
}

export default Dashboard;
