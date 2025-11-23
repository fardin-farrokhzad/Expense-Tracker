import React, { useState } from 'react';
import styles from './TransactionForm.module.css';
import { validateTransaction } from '/src/utils/validateTransaction.js';

/**
  TransactionForm – reusable form used in both Add and Edit modals.
  Handles validation, displays errors, and calls onValidSubmit with cleaned data.
 */
export default function TransactionForm({
  defaultValues = {},
  headerTitle = 'افزودن تراکنش',
  submitButtonText = 'ثبت',
  onValidSubmit,
  onClose,
}) {
  const [error, setError] = useState('');

  // Form submit handler – validates data before calling parent callback
  function handleSubmit(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    // validateTransaction returns cleaned data or false + sets error via setError
    const validated = validateTransaction(data, setError);
    if (!validated) return;

    onValidSubmit(validated);
  }

  return (
    <div className={styles.modal} onClick={e => e.stopPropagation()}>
      {/* Modal header with title and close button */}
      <div className={styles.header}>
        <h4>{headerTitle}</h4>
        <button
          type='button'
          className={styles.close__button}
          onClick={onClose}
        >
          <div className={styles.close}></div>
        </button>
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        {/* Date */}
        <label className={`${styles.label} ${styles.date}`}>
          تاریخ
          <div className={styles.input__wrapper}>
            <input
              type='date'
              name='date'
              className={styles.input}
              defaultValue={defaultValues.date || ''}
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
            defaultValue={defaultValues.amount || ''}
            required
          />
        </label>

        {/* Transaction type */}
        <label className={styles.label}>
          نوع تراکنش
          <div className={styles.radio__group}>
            <label>
              <input
                type='radio'
                name='type'
                value='income'
                defaultChecked={
                  defaultValues.type === 'income' || !defaultValues.type
                }
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
            defaultValue={defaultValues.description || ''}
            required
          />
        </label>

        {/* Error message */}
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
            {submitButtonText}
          </button>
        </div>
      </form>
    </div>
  );
}
