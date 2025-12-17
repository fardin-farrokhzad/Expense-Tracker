import { useContext, useState } from 'react';
import styles from './DeleteConfirmModal.module.css';
import { TransactionContext } from '/src/context/TransactionContext.jsx';

function DeleteConfirmModal({ isOpen, onClose, id }) {
  const { deleteTransaction } = useContext(TransactionContext);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(''); // Local error for delete action

  if (!isOpen) return null;

  const handleDelete = async () => {
    setError('');
    setIsDeleting(true);
    try {
      await deleteTransaction(id);
      onClose(); // Only close if success
    } catch (err) {
      setError('حذف تراکنش با خطا مواجه شد. لطفاً دوباره تلاش کنید.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <h4 className={styles.title}>حذف تراکنش</h4>
          <button
            className={styles.close}
            onClick={onClose}
            disabled={isDeleting}
          ></button>
        </div>

        {/* Confirmation message */}
        <p className={styles.message}>از حذف تراکنش اطمینان دارید؟</p>

        {/* Error message */}
        {error && <p className='modal__error'>{error}</p>}

        {/* Action buttons */}
        <div className={styles.footer}>
          <button
            className={styles.cancel}
            onClick={onClose}
            disabled={isDeleting}
          >
            انصراف
          </button>
          <button
            className={styles.confirm}
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? 'در حال حذف...' : 'حذف'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteConfirmModal;
