import styles from './NotFound.module.css';
import Message from '/src/assets/svg/outline/notFound.svg?react';

function NotFound() {
  return (
    <div className={styles.container}>
      <Message className={styles.message} />
      <span className={styles.text}> ! صفحه مورد نظر پیدا نشد</span>
    </div>
  );
}

export default NotFound;
