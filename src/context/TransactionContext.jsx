import React, { createContext, useMemo } from 'react';
import { useFetch } from '/src/hooks/useFetch.js';
import { useContext } from 'react';
import { AuthContext } from '/src/context/AuthContext.jsx';

export const TransactionContext = createContext();

const API_BASE = 'https://6959f073950475ada4656c2f.mockapi.io/transactions';

export function TransactionProvider({ children }) {
  const { state } = useContext(AuthContext);
  if (!state.user) {
    return (
      <TransactionContext.Provider value={null}>
        {children}
      </TransactionContext.Provider>
    );
  }

  const {
    data: transactions,
    loading,
    error,
    postData,
    putData,
    deleteData,
  } = useFetch(API_BASE);
  async function addTransaction(transaction) {
    return await postData(transaction);
  }
  async function updateTransaction(id, transaction) {
    return await putData(id, transaction);
  }
  async function deleteTransaction(id) {
    return await deleteData(id);
  }

  const value = useMemo(
    () => ({
      transactions: transactions ?? [],
      isLoading: loading,
      error,
      addTransaction,
      updateTransaction,
      deleteTransaction,
    }),
    [transactions, loading, error, postData, putData, deleteData]
  );

  return (
    <TransactionContext.Provider value={value}>
      {children}
    </TransactionContext.Provider>
  );
}
