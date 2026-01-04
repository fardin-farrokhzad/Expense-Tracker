import React from 'react';
import styles from './SummaryTables.module.css';
import { formatNumber } from '/src/utils/formatNumber.js';

function SummaryTables({ totals, periodTotals, timeframeLabel }) {
  const periodBalance = periodTotals.income - periodTotals.expense;

  return (
    <div className={styles.summary__tables}>
      {/* Selected period summary */}
      <div className={styles.table__section}>
        <h2>خلاصه تراکنش‌ها ({timeframeLabel || 'Selected period'})</h2>
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
                {formatNumber(periodTotals.income)} تومان
              </td>
            </tr>
            <tr>
              <td>هزینه</td>
              <td className={styles.expense}>
                {formatNumber(periodTotals.expense)} تومان
              </td>
            </tr>
            <tr>
              <td>تراز</td>
              <td
                className={periodBalance >= 0 ? 'balance' : 'balance__negative'}
              >
                {formatNumber(periodBalance)} تومان
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SummaryTables;
