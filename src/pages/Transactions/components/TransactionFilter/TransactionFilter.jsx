import { useCallback } from 'react';
import { useSearchParams } from 'react-router';
import styles from './TransactionFilter.module.css';

function TransactionFilter() {
  const [searchParams, setSearchParams] = useSearchParams();

  const from = searchParams.get('from') || '';
  const to = searchParams.get('to') || '';
  const order = searchParams.get('order') || 'newest';

  const updateParam = useCallback(
    (key, value, removeIfDefault = false, defaultValue = '') => {
      const params = new URLSearchParams(searchParams);
      if (!value || (removeIfDefault && value === defaultValue))
        params.delete(key);
      else params.set(key, value);
      // reset page when filters change
      params.delete('page');
      setSearchParams(params);
    },
    [searchParams, setSearchParams]
  );

  return (
    <div className={styles.container}>
      <div className={styles.from}>
        <label htmlFor='fromDate'>از تاریخ</label>
        <input
          type='text'
          id='fromDate'
          name='fromDate'
          autoComplete='off'
          placeholder='انتخاب کنید'
          value={from}
          onChange={e => updateParam('from', e.target.value)}
          onClick={e => {
            e.target.type = 'date';
            e.currentTarget.showPicker();
          }}
        />
      </div>
      <div className={styles.to}>
        <label htmlFor='toDate'>تا تاریخ</label>
        <input
          type='text'
          id='toDate'
          name='toDate'
          autoComplete='off'
          placeholder='انتخاب کنید'
          value={to}
          onChange={e => updateParam('to', e.target.value)}
          onClick={e => {
            e.target.type = 'date';
            e.currentTarget.showPicker();
          }}
        />
      </div>
      <div className={styles.order}>
        <label htmlFor='orderSelect'>ترتیب نمایش</label>
        <select
          id='orderSelect'
          name='orderSelect'
          value={order}
          onChange={e => updateParam('order', e.target.value, true, 'newest')}
        >
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
