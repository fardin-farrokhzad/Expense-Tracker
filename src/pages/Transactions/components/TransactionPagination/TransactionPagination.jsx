import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import styles from './TransactionPagination.module.css';
import ArrowRight from '/src/assets/svg/outline/arrowRight.svg?react';
import ArrowLeft from '/src/assets/svg/outline/arrowLeft.svg?react';

function TransactionPagination({ totalPages = 1 }) {
  const [searchParams, setSearchParams] = useSearchParams();

  // get current page from query param, clamp to [1, totalPages]
  const currentPage = useMemo(() => {
    const p = parseInt(searchParams.get('page')) || 1;
    if (Number.isNaN(p)) return 1;
    if (p < 1) return 1;
    if (p > totalPages) return totalPages;
    return p;
  }, [searchParams, totalPages]);

  const maxButtons = 5;

  const pages = useMemo(() => {
    const tp = Math.max(1, totalPages);
    if (tp <= maxButtons) return Array.from({ length: tp }, (_, i) => i + 1);

    let start = currentPage - Math.floor(maxButtons / 2);
    let end = start + maxButtons - 1;
    if (start < 1) {
      start = 1;
      end = maxButtons;
    }
    if (end > tp) {
      end = tp;
      start = tp - maxButtons + 1;
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }, [currentPage, totalPages]);

  const setPage = page => {
    const params = new URLSearchParams(searchParams);
    if (page <= 1)
      params.delete('page'); // keep URL tidy: no page=1
    else params.set('page', String(page));
    setSearchParams(params);
  };

  const prevDisabled = currentPage <= 1;
  const nextDisabled = currentPage >= Math.max(1, totalPages);

  return (
    <div className={styles.container}>
      <button
        className={`${styles.nav} ${prevDisabled ? styles.disabled : ''}`}
        onClick={() => !prevDisabled && setPage(currentPage - 1)}
        aria-label='صفحه قبل'
        disabled={prevDisabled}
      >
        <ArrowRight className={styles.arrow} />
      </button>

      {pages.map(p => (
        <button
          key={p}
          className={`${styles.page} ${p === currentPage ? styles.active : ''}`}
          onClick={() => setPage(p)}
          aria-current={p === currentPage ? 'page' : undefined}
        >
          {p}
        </button>
      ))}

      <button
        className={`${styles.nav} ${nextDisabled ? styles.disabled : ''}`}
        onClick={() => !nextDisabled && setPage(currentPage + 1)}
        aria-label='صفحه بعد'
        disabled={nextDisabled}
      >
        <ArrowLeft className={styles.arrow} />
      </button>
    </div>
  );
}

export default TransactionPagination;
