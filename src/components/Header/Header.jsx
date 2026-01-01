import React from 'react';
import styles from './Header.module.css';
import { NavLink, Link } from 'react-router';
import Logo from '/src/assets/svg/outline/logo.svg?react';
import Logout from '/src/assets/svg/outline/exit.svg?react';
import { useContext } from 'react';
import { AuthContext } from '/src/context/AuthContext.jsx';

function Header() {
  const { dispatch } = useContext(AuthContext);

  function handleLogout() {
    dispatch({ type: 'LOGOUT' });
  }
  return (
    <nav className={styles.nav}>
      {/* Navigation Links */}
      <div className={styles.wrapper}>
        {/* Logo that links to home (Dashboard) */}
        <Link to='/' className={styles.logoLink}>
          <Logo className={styles.logo} />
        </Link>
        <NavLink
          to='/dashboard'
          end
          className={({ isActive }) =>
            isActive ? `${styles.item} ${styles.active}` : styles.item
          }
        >
          داشبورد
        </NavLink>

        <NavLink
          to='/transactions'
          className={({ isActive }) =>
            isActive ? `${styles.item} ${styles.active}` : styles.item
          }
        >
          لیست هزینه‌ها
        </NavLink>
      </div>
      <Link to='/login' className={styles.logout} onClick={handleLogout}>
        <Logout />
      </Link>
    </nav>
  );
}

export default Header;
