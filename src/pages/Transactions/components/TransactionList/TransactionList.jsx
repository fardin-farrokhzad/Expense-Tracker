import { useContext, useState } from 'react';
import styles from './TransactionList.module.css';
import DeleteIcon from '/src/assets/svg/outline/delete.svg?react';
import EditIcon from '/src/assets/svg/outline/edit.svg?react';
import MoreIcon from '/src/assets/svg/outline/more.svg?react';
import { TransactionContext } from '/src/context/TransactionContext.jsx';
import DeleteConfirmModal from '../DeleteConfirmModal/DeleteConfirmModal';
import { formatNumber } from '/src/utils/formatNumber.js';

function TransactionList({ setModal }) {
  const { transactions, deleteTransaction } = useContext(TransactionContext);

  const [menuOpenId, setMenuOpenId] = useState(null);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    id: null,
  });

  const toggleMenu = id => {
    setMenuOpenId(menuOpenId === id ? null : id);
  };

  const openDeleteModal = id => {
    setDeleteModal({ isOpen: true, id });
    setMenuOpenId(null);
  };

  const openEditModal = item => {
    setModal({
      isOpen: true,
      mode: 'edit',
      data: item,
    });
    setMenuOpenId(null);
  };

  return (
    <>
      <div className={`${styles.transactions__header} ${styles.desktop__only}`}>
        <span>تاریخ</span>
        <span>درآمد (تومان)</span>
        <span>هزینه (تومان)</span>
        <span>شرح</span>
        <span></span>
      </div>

      <div className={styles.transactions__list}>
        {transactions.map(item => (
          <div className={styles.transaction} key={item.id}>
            <div className={`${styles.transaction__item} ${styles.date}`}>
              <span>{item.date}</span>
            </div>
            <div className={styles.transaction__item}>
              <span
                className={`${styles.income} ${
                  item.type === 'income' ? styles.hasValue : ''
                }`}
              >
                {item.type === 'income' ? `${formatNumber(item.amount)}+` : ''}
              </span>
            </div>
            <div className={styles.transaction__item}>
              <span
                className={`${styles.expense} ${
                  item.type === 'expense' ? styles.hasValue : ''
                }`}
              >
                {item.type === 'expense' ? `${formatNumber(item.amount)}-` : ''}
              </span>
            </div>
            <div
              className={`${styles.transaction__item} ${styles.description}`}
            >
              <span>{item.description}</span>
            </div>
            <div className={styles.transaction__item}>
              <div className={styles.more__wrapper}>
                <button
                  className={styles.more__button}
                  onClick={() => toggleMenu(item.id)}
                >
                  <MoreIcon />
                </button>
                {menuOpenId === item.id && (
                  <div className={styles.dropdown}>
                    <button
                      className={styles.dropdown__item}
                      onClick={() => openEditModal(item)}
                    >
                      <EditIcon className={styles.edit__icon} /> ویرایش
                    </button>
                    <button
                      className={`${styles.dropdown__item} ${styles.delete}`}
                      onClick={() => openDeleteModal(item.id)}
                    >
                      <DeleteIcon className={styles.delete__icon} /> حذف
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, id: null })}
        id={deleteModal.id}
      />
    </>
  );
}

export default TransactionList;
