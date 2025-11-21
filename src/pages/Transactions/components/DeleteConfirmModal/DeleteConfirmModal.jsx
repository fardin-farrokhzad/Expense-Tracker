import React, { useContext } from 'react';
import styles from './DeleteConfirmModal.module.css';
import { TransactionContext } from '/src/context/TransactionContext.jsx';

function DeleteConfirmModal({ isOpen, onClose, id }) {
  const { dispatch } = useContext(TransactionContext);

  if (!isOpen) return null;

  const handleDelete = () => {
    dispatch({ type: 'DELETE_TRANSACTION', payload: id });
    onClose();
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <h4 className={styles.title}>حذف تراکنش</h4>
          <button className={styles.close} onClick={onClose}></button>
        </div>

        {/* Message */}
        <p className={styles.message}>از حذف تراکنش اطمینان دارید؟</p>

        {/* Footer */}
        <div className={styles.footer}>
          <button className={styles.cancel} onClick={onClose}>
            انصراف
          </button>
          <button className={styles.confirm} onClick={handleDelete}>
            حذف
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteConfirmModal;
