import { useState, useContext } from 'react';
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

  // pagination
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get('page')) || 1;
  const pageSize = 10;
  const totalPages = Math.max(1, Math.ceil(transactions.length / pageSize));
  const clampedPage = Math.min(Math.max(1, currentPage), totalPages);

  // keep URL in valid range
  if (String(clampedPage) !== (searchParams.get('page') || '1')) {
    const params = new URLSearchParams(searchParams);
    if (clampedPage === 1) params.delete('page');
    else params.set('page', String(clampedPage));
    setSearchParams(params);
  }

  const paginatedTransactions = transactions.slice(
    (clampedPage - 1) * pageSize,
    clampedPage * pageSize
  );

  const openAddModal = () => {
    setModal({ isOpen: true, mode: 'add', data: null });
  };

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

      {isLoading ? (
        <div className='loader__container'>
          <div className='loader'></div>
        </div>
      ) : error ? (
        <div className='error__container'>
          <DangerCircleIcon className={styles.error__icon} />
          <p className={styles.error__text}>{error}</p>
          <button className={styles.retry__button} onClick={refetch}>
            تلاش مجدد
          </button>
        </div>
      ) : transactions.length === 0 ? (
        <div className={styles.no__data}>
          <DangerCircleIcon className={styles.no__data__icon} />
          <span>شما هنوز تراکنشی وارد نکرده‌اید</span>
        </div>
      ) : (
        <>
          <TransactionList setModal={setModal} items={paginatedTransactions} />
          {transactions.length > pageSize && (
            <TransactionPagination totalPages={totalPages} />
          )}
        </>
      )}

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
