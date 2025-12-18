import React, {
  createContext,
  useCallback,
  useState,
  useMemo,
  useEffect,
} from 'react';
import { useFetch } from '/src/hooks/useFetch.js';

export const TransactionContext = createContext();

const API_BASE = 'http://localhost:3001/transactions';

export function TransactionProvider({ children }) {
  const [transactions, setTransactions] = useState([]);
  const { data, loading, error: fetchError, refetch } = useFetch(API_BASE);

  const error = fetchError
    ? 'بارگذاری تراکنش‌ها با خطا مواجه شد. لطفاً اتصال اینترنت خود را بررسی کنید یا دوباره تلاش کنید.'
    : null;

  useEffect(() => {
    if (!data) return;

    setTransactions([...data]);
  }, [data]);

  const addTransaction = useCallback(async transaction => {
    try {
      const res = await fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transaction),
      });
      if (!res.ok) throw new Error('add failed');
      const newTrans = await res.json();
      setTransactions(prev => [newTrans, ...prev]);
      return newTrans;
    } catch (err) {
      console.error('Add transaction error:', err);
      throw err;
    }
  }, []);

  const updateTransaction = useCallback(async updatedTrans => {
    try {
      const res = await fetch(`${API_BASE}/${updatedTrans.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTrans),
      });
      if (!res.ok) throw new Error('update failed');
      const updated = await res.json();
      setTransactions(prev =>
        prev.map(t => (t.id === updated.id ? updated : t))
      );
      return updated;
    } catch (err) {
      console.error('Update transaction error:', err);
      throw err;
    }
  }, []);

  const deleteTransaction = useCallback(async id => {
    try {
      const res = await fetch(`${API_BASE}/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('delete failed');
      setTransactions(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      console.error('Delete transaction error:', err);
      throw err;
    }
  }, []);
  const value = useMemo(
    () => ({
      transactions,
      isLoading: loading,
      error,
      addTransaction,
      updateTransaction,
      deleteTransaction,
      refetch,
    }),
    [
      transactions,
      loading,
      error,
      addTransaction,
      updateTransaction,
      deleteTransaction,
      refetch,
    ]
  );

  return (
    <TransactionContext.Provider value={value}>
      {children}
    </TransactionContext.Provider>
  );
}
