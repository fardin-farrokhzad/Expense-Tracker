// src/layout/Layout.jsx
import Header from '../components/Header/Header';
import { Outlet } from 'react-router-dom';
import styles from './Layout.module.css';
import { useContext } from 'react';
import { TransactionContext } from '../context/TransactionContext.jsx';

function Layout() {
  const { isLoading } = useContext(TransactionContext);
  return (
    <>
      <Header />
      {isLoading ? (
        <main className={styles.main}>
          <div className={styles.loader__container}>
            <div className='loader'></div>
          </div>
        </main>
      ) : (
        <main className={styles.main}>
          <Outlet />
        </main>
      )}
    </>
  );
}

export default Layout;
