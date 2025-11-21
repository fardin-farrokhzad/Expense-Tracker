import React, { useContext, useState } from 'react';
import styles from './AddTransactionModal.module.css';
import { TransactionContext } from '/src/context/TransactionContext.jsx';

function AddTransactionModal({ isOpen, onClose }) {
  const { dispatch } = useContext(TransactionContext);
  const [error, setError] = useState('');

  function showError(message) {
    setError(message);
    setTimeout(() => setError(''), 3000); // Clear after 3s
  }

  function handleFormAction(formData) {
    const date = formData.get('date');
    const amount = formData.get('amount');
    const type = formData.get('type');
    const description = formData.get('description')?.trim();

    if (!date) return showError('تاریخ را وارد کنید.');
    const selectedDate = new Date(date);
    if (isNaN(selectedDate.getTime())) return showError('تاریخ نامعتبر است.');

    if (!amount) return showError('مبلغ را وارد کنید.');
    const numericAmount = Number(amount);
    if (numericAmount <= 0)
      return showError('مبلغ تراکنش باید عددی مثبت باشد.');
    if (numericAmount >= 10000000000000)
      return showError('مبلغ باید کم‌تر از ۱۰,۰۰۰,۰۰۰,۰۰۰,۰۰۰ باشد.');

    if (!['income', 'expense'].includes(type))
      return showError('نوع تراکنش نامعتبر است.');

    if (!description) return showError('شرح تراکنش نمی‌تواند خالی باشد.');
    if (description.length > 30)
      return showError('شرح نباید بیشتر از ۳۰ کاراکتر باشد.');

    // Add transaction
    dispatch({
      type: 'ADD_TRANSACTION',
      payload: { date, amount: numericAmount, type, description },
    });

    onClose();
  }

  return isOpen ? (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.header}>
          <h4>افزودن تراکنش</h4>
          <button className={styles.close__button} onClick={onClose}>
            <div className={styles.close}></div>
          </button>
        </div>

        <form className={styles.form} action={handleFormAction}>
          {/* Date */}
          <label className={`${styles.label} ${styles.date}`}>
            تاریخ
            <div className={styles.input__wrapper}>
              <input
                type='date'
                name='date'
                className={styles.input}
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
              required
            />
          </label>

          {/* Type */}
          <label className={styles.label}>
            نوع تراکنش
            <div className={styles.radio__group}>
              <label>
                <input type='radio' name='type' value='income' defaultChecked />{' '}
                درآمد
              </label>
              <label>
                <input type='radio' name='type' value='expense' /> هزینه
              </label>
            </div>
          </label>

          {/* Description */}
          <label className={styles.label}>
            شرح
            <input
              type='text'
              name='description'
              className={styles.input}
              required
            />
          </label>
          {/* Error message */}
          {error && <p className={styles.error}>{error}</p>}

          {/* Footer Buttons */}
          <div className={styles.footer}>
            <button
              type='button'
              className={styles.cancel__button}
              onClick={onClose}
            >
              انصراف
            </button>
            <button type='submit' className={styles.submit__button}>
              ثبت
            </button>
          </div>
        </form>
      </div>
    </div>
  ) : null;
}

export default AddTransactionModal;
