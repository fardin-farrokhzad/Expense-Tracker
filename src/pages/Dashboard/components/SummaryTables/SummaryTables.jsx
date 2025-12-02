import React from 'react';
import styles from './SummaryTables.module.css';
import { formatNumber } from '/src/utils/formatNumber.js';

function SummaryTables({ totals, monthlyTotals, lastMonthSummary }) {
  const currentMonthBalance = monthlyTotals.income - monthlyTotals.expense;

  return (
    <div className={styles.summary__tables}>
      {/* All-time summary */}
      <div className={styles.table__section}>
        <h2>خلاصه تراکنش‌ها (کل)</h2>
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
                {formatNumber(totals.incomeTotal)} تومان
              </td>
            </tr>
            <tr>
              <td>هزینه</td>
              <td className={styles.expense}>
                {formatNumber(totals.expenseTotal)} تومان
              </td>
            </tr>
            <tr>
              <td>تراز</td>
              <td
                className={
                  totals.balance >= 0 ? 'balance' : 'balance__negative'
                }
              >
                {formatNumber(totals.balance)} تومان
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Current month summary */}
      <div className={styles.table__section}>
        <h2>خلاصه تراکنش‌ها (ماه جاری)</h2>
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
                {formatNumber(monthlyTotals.income)} تومان
              </td>
            </tr>
            <tr>
              <td>هزینه</td>
              <td className={styles.expense}>
                {formatNumber(monthlyTotals.expense)} تومان
              </td>
            </tr>
            <tr>
              <td>تراز</td>
              <td
                className={
                  currentMonthBalance >= 0 ? 'balance' : 'balance__negative'
                }
              >
                {formatNumber(currentMonthBalance)} تومان
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Previous month summary */}
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
                {formatNumber(lastMonthSummary.income)} تومان
              </td>
            </tr>
            <tr>
              <td>هزینه</td>
              <td className={styles.expense}>
                {formatNumber(lastMonthSummary.expense)} تومان
              </td>
            </tr>
            <tr>
              <td>تراز</td>
              <td
                className={
                  lastMonthSummary.balance >= 0
                    ? 'balance'
                    : 'balance__negative'
                }
              >
                {formatNumber(lastMonthSummary.balance)} تومان
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SummaryTables;
