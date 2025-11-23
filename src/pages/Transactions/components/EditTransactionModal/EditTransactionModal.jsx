import { useContext } from 'react';
import styles from './EditTransactionModal.module.css';
import { TransactionContext } from '/src/context/TransactionContext.jsx';
import TransactionForm from '../TransactionForm/TransactionForm';

function EditTransactionModal({ isOpen, onClose, transaction }) {
  const { dispatch } = useContext(TransactionContext);

  // Called when form is valid
  const handleValidSubmit = updatedData => {
    dispatch({
      type: 'EDIT_TRANSACTION',
      payload: { id: transaction.id, updatedData },
    });
    onClose();
  };

  if (!isOpen || !transaction) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <TransactionForm
        headerTitle='ویرایش تراکنش'
        submitButtonText='ذخیره تغییرات'
        defaultValues={transaction} // pre-fills the form with current transaction data
        onValidSubmit={handleValidSubmit}
        onClose={onClose}
      />
    </div>
  );
}

export default EditTransactionModal;
