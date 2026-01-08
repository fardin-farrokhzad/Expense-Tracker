import { useContext, useState } from 'react';
import styles from './TransactionModal.module.css';
import { TransactionContext } from '/src/context/TransactionContext.jsx';
import { validateTransaction } from '/src/utils/validateTransaction.js';

function TransactionModal({
  isOpen,
  onClose,
  mode = 'add',
  transaction = null,
}) {
  const { addTransaction, updateTransaction } = useContext(TransactionContext);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEdit = mode === 'edit';

  if (!isOpen) return null;

  const defaultValues = isEdit
    ? transaction
    : { date: '', amount: '', type: 'income', description: '' };

  const handleSubmit = async data => {
    setError('');
    setIsSubmitting(true);

    const formData = {
      date: data.get('date'),
      amount: data.get('amount'),
      type: data.get('type'),
      description: data.get('description'),
    };

    const validated = validateTransaction(formData, setError);
    if (!validated) {
      setIsSubmitting(false);
      return;
    }

    try {
      if (isEdit) {
        await updateTransaction(transaction.id, validated);
      } else {
        await addTransaction(validated);
      }
      onClose(); // Only close on success
    } catch (err) {
      setError('خطا در ارتباط با سرور. لطفاً دوباره تلاش کنید.');
    } finally {
      setIsSubmitting(false);
    }
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
            disabled={isSubmitting}
          >
            <div className={styles.close}></div>
          </button>
        </div>

        {/* Form */}
        <form
          className={styles.form}
          action='#'
          onSubmit={e => {
            e.preventDefault();
            const formData = new FormData(e.target);
            handleSubmit(formData);
          }}
        >
          {/* Date */}
          <label className={`${styles.label} ${styles.date}`}>
            تاریخ
            <div className={styles.input__wrapper}>
              <input
                type='date'
                name='date'
                className={styles.input}
                defaultValue={defaultValues.date}
                onClick={e => e.currentTarget.showPicker()}
                required
                disabled={isSubmitting}
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
              disabled={isSubmitting}
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
                  disabled={isSubmitting}
                />{' '}
                درآمد
              </label>
              <label>
                <input
                  type='radio'
                  name='type'
                  value='expense'
                  defaultChecked={defaultValues.type === 'expense'}
                  disabled={isSubmitting}
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
              disabled={isSubmitting}
            />
          </label>

          {/* Validation & server errors */}
          {error && <p className='modal__error'>{error}</p>}

          {/* Action buttons */}
          <div className={styles.footer}>
            <button
              type='button'
              className={styles.cancel__button}
              onClick={onClose}
              disabled={isSubmitting}
            >
              انصراف
            </button>
            <button
              type='submit'
              className={styles.submit__button}
              disabled={isSubmitting}
            >
              {isSubmitting
                ? isEdit
                  ? 'در حال ذخیره...'
                  : 'در حال ثبت...'
                : isEdit
                  ? 'ذخیره تغییرات'
                  : 'ثبت'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TransactionModal;
