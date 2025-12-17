// src/utils/validateTransaction.js
function showFormError(setError, message) {
  setError(message);
  setTimeout(() => setError(''), 3000);
}

export function validateTransaction(data, setError) {
  const date = data.date?.trim();
  const amount = data.amount;
  const type = data.type;
  const description = data.description?.trim();

  if (!date) return showFormError(setError, 'تاریخ را وارد کنید.');
  const selectedDate = new Date(date);
  if (isNaN(selectedDate.getTime()))
    return showFormError(setError, 'تاریخ نامعتبر است.');

  if (!amount) return showFormError(setError, 'مبلغ را وارد کنید.');
  const numericAmount = Number(amount);
  if (isNaN(numericAmount) || numericAmount <= 0)
    return showFormError(setError, 'مبلغ تراکنش باید عددی مثبت باشد.');

  if (!['income', 'expense'].includes(type))
    return showFormError(setError, 'نوع تراکنش نامعتبر است.');

  if (!description)
    return showFormError(setError, 'شرح تراکنش نمی‌تواند خالی باشد.');
  if (description.length > 30)
    return showFormError(setError, 'شرح نباید بیشتر از ۳۰ کاراکتر باشد.');

  return {
    date,
    amount: numericAmount,
    type,
    description,
  };
}
