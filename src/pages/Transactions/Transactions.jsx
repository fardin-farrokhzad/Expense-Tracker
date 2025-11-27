import { useState, useContext } from 'react';
import styles from './Transactions.module.css';
import PlusIcon from '/src/assets/svg/outline/plus.svg?react';
import DangerCircleIcon from '/src/assets/svg/outline/danger-circle.svg?react';
import TransactionList from './components/TransactionList/TransactionList';
import TransactionModal from './components/TransactionModal/TransactionModal';
import { TransactionContext } from '/src/context/TransactionContext.jsx';

function Transactions() {
  const [modal, setModal] = useState({
    isOpen: false,
    mode: 'add',
    data: null,
  });

  const { state: data } = useContext(TransactionContext);

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

      {data.length === 0 ? (
        <div className={styles.no__data}>
          <DangerCircleIcon className={styles.no__data__icon} />
          <span>شما هنوز تراکنشی وارد نکرده‌اید</span>
        </div>
      ) : (
        <TransactionList setModal={setModal} />
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
