import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';

import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Search from './pages/Search';
import Alerts from './pages/Alerts';
import Upgrade from './pages/Upgrade';

function App() {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div>Loading application...</div>;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
        
        <Route path="/dashboard" element={
          <PrivateRoute>
             <Dashboard />
          </PrivateRoute>
        } />
        
        <Route path="/search" element={
          <PrivateRoute>
             <Search />
          </PrivateRoute>
        } />

        <Route path="/alerts" element={
          <PrivateRoute>
             <Alerts />
          </PrivateRoute>
        } />

        <Route path="/upgrade" element={
          <PrivateRoute>
             <Upgrade />
          </PrivateRoute>
        } />

        <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
