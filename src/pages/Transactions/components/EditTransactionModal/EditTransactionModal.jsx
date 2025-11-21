import React, { useContext, useState, useEffect } from 'react';
import styles from './EditTransactionModal.module.css';
import { TransactionContext } from '/src/context/TransactionContext.jsx';

function EditTransactionModal({ isOpen, onClose, transaction }) {
  const { dispatch } = useContext(TransactionContext);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) setError('');
  }, [isOpen]);

  function showError(message) {
    setError(message);
    setTimeout(() => setError(''), 3000);
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

    dispatch({
      type: 'EDIT_TRANSACTION',
      payload: {
        id: transaction.id,
        updatedData: { date, amount: numericAmount, type, description },
      },
    });

    onClose();
  }

  if (!isOpen || !transaction) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.header}>
          <h4>ویرایش تراکنش</h4>
          <button className={styles.close__button} onClick={onClose}>
            <div className={styles.close}></div>
          </button>
        </div>

        <form
          className={styles.form}
          onSubmit={e => {
            e.preventDefault();
            handleFormAction(new FormData(e.target));
          }}
        >
          {/* Date */}
          <label className={styles.label}>
            تاریخ
            <div className={styles.input__wrapper}>
              <input
                type='date'
                name='date'
                className={styles.input}
                defaultValue={transaction.date}
                required
              />
              <span className={styles.calendarIcon}></span>
            </div>
          </label>

          {/* Amount */}
          <label className={styles.label}>
            مبلغ (تومان)
            <input
              type='number'
              name='amount'
              className={styles.input}
              defaultValue={transaction.amount}
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
                  defaultChecked={transaction.type === 'income'}
                />{' '}
                درآمد
              </label>
              <label>
                <input
                  type='radio'
                  name='type'
                  value='expense'
                  defaultChecked={transaction.type === 'expense'}
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
              className={styles.input}
              defaultValue={transaction.description}
              required
            />
          </label>

          {error && <p className={styles.error}>{error}</p>}

          <div className={styles.footer}>
            <button
              type='button'
              className={styles.cancel__button}
              onClick={onClose}
            >
              انصراف
            </button>
            <button type='submit' className={styles.submit__button}>
              ثبت تغییرات
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditTransactionModal;
