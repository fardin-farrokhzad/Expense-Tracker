import { createContext, useReducer } from 'react';

export const AuthContext = createContext();

function AuthProvider({ children }) {
  const status = localStorage.getItem('authState');
  if (status) {
    var initialState = JSON.parse(status);
  } else {
    var initialState = { user: null };
  }
  function authReducer(state, action) {
    switch (action.type) {
      case 'LOGIN':
        const loggedInState = { user: action.payload };
        localStorage.setItem('authState', JSON.stringify(loggedInState));
        return loggedInState;
      case 'LOGOUT':
        localStorage.removeItem('authState');
        return { user: null };
      default:
        return state;
    }
  }

  const [state, dispatch] = useReducer(authReducer, initialState);
  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
