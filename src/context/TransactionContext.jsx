import React, { createContext, useState, useEffect } from 'react';

export const TransactionContext = createContext();

const API_BASE = 'http://localhost:3001/transactions';

export function TransactionProvider({ children }) {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null); // Global error for initial fetch only

  const fetchTransactions = async () => {
    setError(null);
    setIsLoading(true);
    try {
      const res = await fetch(API_BASE);
      if (!res.ok) {
        throw new Error('خطا در دریافت داده‌ها از سرور');
      }
      const data = await res.json();
      setTransactions(data.sort((a, b) => b.id - a.id));
    } catch (err) {
      console.error('Fetch error:', err);
      setError(
        'بارگذاری تراکنش‌ها با خطا مواجه شد. لطفاً اتصال اینترنت خود را بررسی کنید یا دوباره تلاش کنید.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const addTransaction = async transaction => {
    const res = await fetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(transaction),
    });
    if (!res.ok) throw new Error('add failed');
    const newTrans = await res.json();
    setTransactions(prev => [newTrans, ...prev]);
  };

  const updateTransaction = async updatedTrans => {
    const res = await fetch(`${API_BASE}/${updatedTrans.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedTrans),
    });
    if (!res.ok) throw new Error('update failed');
    const updated = await res.json();
    setTransactions(prev => prev.map(t => (t.id === updated.id ? updated : t)));
  };

  const deleteTransaction = async id => {
    const res = await fetch(`${API_BASE}/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('delete failed');
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        isLoading,
        error,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        refetch: fetchTransactions,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
}
