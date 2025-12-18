import styles from './TransactionFilter.module.css';

function TransactionFilter() {
  return (
    <div className={styles.container}>
      <div className={styles.from}>
        <label htmlFor='fromDate'>از تاریخ</label>
        <input
          type='date'
          id='fromDate'
          name='fromDate'
          placeholder='انتخاب کنید'
        />
      </div>
      <div className={styles.to}>
        <label htmlFor='toDate'>تا تاریخ</label>
        <input
          type='date'
          id='toDate'
          name='toDate'
          placeholder='انتخاب کنید'
        />
      </div>
      <div className={styles.order}>
        <label htmlFor='orderSelect'>ترتیب نمایش</label>
        <select id='orderSelect' name='orderSelect'>
          <option value='newest'>جدیدترین</option>
          <option value='oldest'>قدیمی‌ترین</option>
          <option value='highest-expense'>بالاترین هزینه</option>
          <option value='lowest-expense'>کمترین هزینه</option>
          <option value='highest-income'>بالاترین درآمد</option>
          <option value='lowest-income'>کمترین درآمد</option>
        </select>
      </div>
    </div>
  );
}

export default TransactionFilter;
