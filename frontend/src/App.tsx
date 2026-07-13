import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginPage from './pages/auth/LoginPage';
import ProtectedRoute from './components/common/ProtectedRoute';
import DashboardLayout from './layouts/DashboardLayout';
import DashboardPage from './pages/employer/DashboardPage';
import PortalLayout from './layouts/PortalLayout';
import PortalPage from './pages/professional/PortalPage';

const RoleBasedRedirect = () => {
  const { user } = useAuth();
  if (user?.role === 'PROFESSIONAL') return <Navigate to="/portal" replace />;
  if (user?.role === 'EMPLOYER' || user?.role === 'ADMIN') return <Navigate to="/dashboard" replace />;
  return <Navigate to="/login" replace />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            } 
          >
            <Route index element={<DashboardPage />} />
          </Route>

          <Route 
            path="/portal" 
            element={
              <ProtectedRoute>
                <PortalLayout />
              </ProtectedRoute>
            } 
          >
            <Route index element={<PortalPage />} />
          </Route>
          
          <Route path="/" element={<RoleBasedRedirect />} />
          <Route path="*" element={<RoleBasedRedirect />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
