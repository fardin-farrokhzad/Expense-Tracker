import { useContext } from 'react';
import styles from './AddTransactionModal.module.css';
import { TransactionContext } from '/src/context/TransactionContext.jsx';
import TransactionForm from '../TransactionForm/TransactionForm';

/**
  AddTransactionModal – modal wrapper for adding a new transaction.
  Uses TransactionForm and dispatches ADD_TRANSACTION on valid submit.
 */
function AddTransactionModal({ isOpen, onClose }) {
  const { dispatch } = useContext(TransactionContext);

  // Called when form is valid → adds transaction and closes modal
  const handleValidSubmit = data => {
    dispatch({ type: 'ADD_TRANSACTION', payload: data });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <TransactionForm
        headerTitle='افزودن تراکنش'
        submitButtonText='ثبت'
        onValidSubmit={handleValidSubmit}
        onClose={onClose}
      />
    </div>
  );
}

export default AddTransactionModal;
