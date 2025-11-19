import React, { useContext } from 'react';
import styles from './TransactionList.module.css';
import DeleteIcon from '/src/assets/svg/outline/delete.svg?react';
import { TransactionContext } from '/src/context/TransactionContext.jsx';

function TransactionList() {
  const { state: data, dispatch } = useContext(TransactionContext);

  function handleDelete(id) {
    dispatch({ type: 'DELETE_TRANSACTION', payload: id });
  }

  return (
    <>
      {/* Table Header */}
      <div className={`${styles.transactions__header} ${styles.desktop__only}`}>
        <span>تاریخ</span>
        <span>درآمد (تومان)</span>
        <span>هزینه (تومان)</span>
        <span>شرح</span>
      </div>

      {/* Transactions */}
      <div className={styles.transactions__list}>
        {data.map(item => (
          <div className={styles.transaction} key={item.id}>
            {/* Date */}
            <div className={`${styles.transaction__item} ${styles.date}`}>
              <span>{item.date}</span>
            </div>

            {/* Income */}
            <div className={styles.transaction__item}>
              <span className={`${styles.income} ${item.type === 'income' ? styles.hasValue : ''}`}>
                {item.type === 'income' ? `${item.amount}+` : ''}
              </span>
            </div>

            {/* Expense */}
            <div className={styles.transaction__item}>
              <span className={`${styles.expense} ${item.type === 'expense' ? styles.hasValue : ''}`}>
                {item.type === 'expense' ? `${item.amount}-` : ''}
              </span>
            </div>

            {/* Description */}
            <div className={`${styles.transaction__item} ${styles.description}`}>
              <span>{item.description}</span>
            </div>

            {/* Delete button */}
            <div className={styles.transaction__item}>
              <button className={styles.deleteButton} onClick={() => handleDelete(item.id)}>
                <DeleteIcon className={styles.delete} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default TransactionList;
