import { useContext, useState } from 'react';
import { AuthContext } from '/src/context/AuthContext.jsx';
import { Navigate } from 'react-router';
import styles from './Login.module.css';
import Logo from '/src/assets/svg/outline/logo2.svg?react';

function Login() {
  const { state, dispatch } = useContext(AuthContext);
  const [error, setError] = useState(false);
  async function loginAction(formData) {
    const email = formData.get('email');
    const password = formData.get('password');

    if (email === 'admin@example.com' && password === 'admin123') {
      dispatch({
        type: 'LOGIN',
        payload: { email },
      });
    } else {
      setError(true);
      setTimeout(() => setError(false), 3000);
    }
  }

  if (state.user) {
    return <Navigate to='/' replace />;
  }

  return (
    <form className={styles.login__form} action={loginAction}>
      <Logo className={styles.login__logo} />
      <span className={error ? styles.show : styles.error}>
        ایمیل یا رمز ورود اشتباه است!
      </span>
      <label htmlFor='email'>ایمیل</label>
      <input name='email' type='email' required />
      <label htmlFor='password'>رمز ورود</label>
      <input name='password' type='password' required />

      <button type='submit'>ورود</button>
    </form>
  );
}

export default Login;
