import { useContext, useState } from 'react';
import styles from './TransactionModal.module.css';
import { TransactionContext } from '/src/context/TransactionContext.jsx';
import { validateTransaction } from '/src/utils/validateTransaction.js';

function TransactionModal({
  isOpen,
  onClose,
  mode = 'add', // "add" or "edit"
  transaction = null, // for edit mode
}) {
  const { dispatch } = useContext(TransactionContext);

  const isEdit = mode === 'edit';

  const [error, setError] = useState('');

  if (!isOpen) return null;

  const defaultValues = isEdit
    ? transaction
    : { date: '', amount: '', type: 'income', description: '' };

  const handleSubmit = e => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    const validated = validateTransaction(data, setError);
    if (!validated) return;

    if (isEdit) {
      dispatch({
        type: 'EDIT_TRANSACTION',
        payload: { id: transaction.id, updatedData: validated },
      });
    } else {
      dispatch({
        type: 'ADD_TRANSACTION',
        payload: validated,
      });
    }

    onClose();
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <h4>{isEdit ? 'ویرایش تراکنش' : 'افزودن تراکنش'}</h4>
          <button
            type='button'
            className={styles.close__button}
            onClick={onClose}
          >
            <div className={styles.close}></div>
          </button>
        </div>

        {/* Form */}
        <form className={styles.form} onSubmit={handleSubmit}>
          {/* Date */}
          <label className={`${styles.label} ${styles.date}`}>
            تاریخ
            <div className={styles.input__wrapper}>
              <input
                type='date'
                name='date'
                className={styles.input}
                defaultValue={defaultValues.date}
                required
              />
            </div>
          </label>

          {/* Amount */}
          <label className={styles.label}>
            مبلغ (تومان)
            <input
              type='number'
              name='amount'
              className={styles.input}
              defaultValue={defaultValues.amount}
              required
            />
          </label>

          {/* Type */}
          <label className={styles.label}>
            نوع تراکنش
            <div className={styles.radio__group}>
              <label>
                <input
                  type='radio'
                  name='type'
                  value='income'
                  defaultChecked={defaultValues.type === 'income'}
                />{' '}
                درآمد
              </label>
              <label>
                <input
                  type='radio'
                  name='type'
                  value='expense'
                  defaultChecked={defaultValues.type === 'expense'}
                />{' '}
                هزینه
              </label>
            </div>
          </label>

          {/* Description */}
          <label className={styles.label}>
            شرح
            <input
              type='text'
              name='description'
              maxLength='30'
              className={styles.input}
              defaultValue={defaultValues.description}
              required
            />
          </label>

          {/* Error */}
          {error && <p className={styles.error}>{error}</p>}

          {/* Action buttons */}
          <div className={styles.footer}>
            <button
              type='button'
              className={styles.cancel__button}
              onClick={onClose}
            >
              انصراف
            </button>
            <button type='submit' className={styles.submit__button}>
              {isEdit ? 'ذخیره تغییرات' : 'ثبت'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
export default TransactionModal;
