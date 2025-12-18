import { useState, useContext, useMemo, useEffect } from 'react';
import styles from './Transactions.module.css';
import PlusIcon from '/src/assets/svg/outline/plus.svg?react';
import DangerCircleIcon from '/src/assets/svg/outline/danger-circle.svg?react';
import TransactionList from './components/TransactionList/TransactionList';
import TransactionPagination from './components/TransactionPagination/TransactionPagination';
import { useSearchParams } from 'react-router-dom';
import TransactionModal from './components/TransactionModal/TransactionModal';
import { TransactionContext } from '/src/context/TransactionContext.jsx';
import TransactionFilter from './components/TransactionFilter/TransactionFilter';

function Transactions() {
  const [modal, setModal] = useState({
    isOpen: false,
    mode: 'add',
    data: null,
  });

  const { transactions, isLoading, error, refetch } =
    useContext(TransactionContext);

  // pagination + filtering/sorting driven by URL params: from, to, order
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get('page')) || 1;
  const pageSize = 10;

  const fromDateParam = searchParams.get('from') || '';
  const toDateParam = searchParams.get('to') || '';
  const orderParam = searchParams.get('order') || 'newest';

  const filteredTransactions = useMemo(() => {
    let list = Array.isArray(transactions) ? [...transactions] : [];

    // date filtering based on item.date (assumed parsable)
    if (fromDateParam) {
      const fromTs = Date.parse(fromDateParam);
      if (!Number.isNaN(fromTs)) {
        list = list.filter(item => Date.parse(item.date) >= fromTs);
      }
    }
    if (toDateParam) {
      const toTs = Date.parse(toDateParam);
      if (!Number.isNaN(toTs)) {
        // include the whole to day
        const endOfDay = toTs + 24 * 60 * 60 * 1000 - 1;
        list = list.filter(item => Date.parse(item.date) <= endOfDay);
      }
    }

    // ordering and optional type filtering
    switch (orderParam) {
      case 'oldest':
        list.sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));
        break;
      case 'highest-expense':
        list = list
          .filter(t => t.type === 'expense')
          .sort((a, b) => b.amount - a.amount);
        break;
      case 'lowest-expense':
        list = list
          .filter(t => t.type === 'expense')
          .sort((a, b) => a.amount - b.amount);
        break;
      case 'highest-income':
        list = list
          .filter(t => t.type === 'income')
          .sort((a, b) => b.amount - a.amount);
        break;
      case 'lowest-income':
        list = list
          .filter(t => t.type === 'income')
          .sort((a, b) => a.amount - b.amount);
        break;
      case 'newest':
      default:
        list.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    }

    return list;
  }, [transactions, fromDateParam, toDateParam, orderParam]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredTransactions.length / pageSize)
  );
  const clampedPage = Math.min(Math.max(1, currentPage), totalPages);

  // keep URL in valid range (do not call setSearchParams during render)
  useEffect(() => {
    const urlPage = searchParams.get('page') || '1';
    if (String(clampedPage) !== urlPage) {
      const params = new URLSearchParams(searchParams);
      if (clampedPage === 1) params.delete('page');
      else params.set('page', String(clampedPage));
      setSearchParams(params);
    }
  }, [clampedPage]);

  const paginatedTransactions = filteredTransactions.slice(
    (clampedPage - 1) * pageSize,
    clampedPage * pageSize
  );

  const openAddModal = () => {
    setModal({ isOpen: true, mode: 'add', data: null });
  };

  let content;

  if (isLoading) {
    content = (
      <div className='loader__container'>
        <div className='loader'></div>
      </div>
    );
  } else if (error) {
    content = (
      <div className='error__container'>
        <DangerCircleIcon className={styles.error__icon} />
        <p className={styles.error__text}>{error}</p>
        <button className={styles.retry__button} onClick={refetch}>
          تلاش مجدد
        </button>
      </div>
    );
  } else if (transactions.length === 0) {
    content = (
      <div className={styles.no__data}>
        <DangerCircleIcon className={styles.no__data__icon} />
        <span>شما هنوز تراکنشی وارد نکرده‌اید</span>
      </div>
    );
  } else {
    content = (
      <>
        <TransactionList setModal={setModal} items={paginatedTransactions} />
        {transactions.length > pageSize && (
          <TransactionPagination totalPages={totalPages} />
        )}
      </>
    );
  }

  return (
    <section className={styles.transactions}>
      <div className={styles.title__wrapper}>
        <h2 className={styles.transactions__title}>تراکنش‌ها</h2>

        <button className={styles.transaction__button} onClick={openAddModal}>
          <span>افزودن تراکنش</span>
          <PlusIcon className={styles.plus} />
        </button>
      </div>
      <TransactionFilter />

      {content}

      <TransactionModal
        isOpen={modal.isOpen}
        onClose={() => setModal({ isOpen: false, mode: 'add', data: null })}
        mode={modal.mode}
        transaction={modal.data}
      />
    </section>
  );
}

export default Transactions;
