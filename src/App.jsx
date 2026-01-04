import { Routes, Route, Navigate } from 'react-router';
import Transactions from './pages/Transactions/Transactions';
import Layout from './layout/Layout.jsx';
import Dashboard from './pages/Dashboard/Dashboard.jsx';
import NotFound from './pages/NotFound/NotFound.jsx';
import Login from './pages/Login/Login.jsx';
import ProtectedRoute from './routes/ProtectedRoute.jsx';

function App() {
  return (
    <Routes>
      <Route path='/login' element={<Login />} />
      <Route element={<ProtectedRoute />}>
        <Route path='/' element={<Layout />}>
          <Route index element={<Navigate to='/dashboard' />} />
          <Route path='dashboard' element={<Dashboard />} />
          <Route path='transactions' element={<Transactions />} />
        </Route>
      </Route>
      <Route path='*' element={<NotFound />} />
    </Routes>
  );
}

export default App;
