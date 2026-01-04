import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router';
import { AuthContext } from '/src/context/AuthContext.jsx';

function ProtectedRoute({ children }) {
  const { state } = useContext(AuthContext);

  if (!state.user) {
    return <Navigate to='/login' replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
