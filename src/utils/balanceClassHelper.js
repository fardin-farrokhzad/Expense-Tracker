// src/utils/balanceClassHelper.js
import styles from '../styles/utils.module.css';

export function balanceClassHelper(value) {
  return value >= 0 ? styles.balance : styles.balance__negative;
}
