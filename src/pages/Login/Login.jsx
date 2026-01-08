import { useContext, useState } from 'react';
import { AuthContext } from '/src/context/AuthContext.jsx';
import { Navigate } from 'react-router';
import styles from './Login.module.css';
import Logo from '/src/assets/svg/outline/logo2.svg?react';

function Login() {
  const { state, dispatch } = useContext(AuthContext);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const checkEmail = email => emailRegex.test(email);
  async function loginAction(formData) {
    const email = formData.get('email');
    const password = formData.get('password');

    if (email === 'admin@example.com' && password === 'admin123') {
      dispatch({
        type: 'LOGIN',
        payload: { email },
      });
    } else if (!checkEmail(email)) {
      setError(true);
      setErrorMessage('فرمت ایمیل صحیح نیست!');
      setTimeout(() => setError(false), 3000);
    } else {
      setError(true);
      setErrorMessage('ایمیل یا رمز ورود اشتباه است!');
      setTimeout(() => setError(false), 3000);
    }
  }

  if (state.user) {
    return <Navigate to='/' replace />;
  }

  return (
    <div className={styles.login__wrapper}>
      <form className={styles.login__form} action={loginAction}>
        <Logo className={styles.login__logo} />
        <span className={error ? styles.show : styles.error}>
          {errorMessage}
        </span>
        <div className={styles.login__input__wrapper}>
          <label htmlFor='email'>ایمیل</label>
          <input name='email' type='text' required />
        </div>
        <div className={styles.login__input__wrapper}>
          <label htmlFor='password'>رمز ورود</label>
          <input name='password' type='password' required />
        </div>

        <button type='submit'>ورود</button>
      </form>
    </div>
  );
}

export default Login;
