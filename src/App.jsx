import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import DashboardLayout from './components/layout/DashboardLayout';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import CustomerDashboard from './pages/customer/Dashboard';
import MyComplaints from './pages/customer/MyComplaints';
import NewComplaint from './pages/customer/NewComplaint';
import ComplaintDetails from './pages/customer/ComplaintDetails';
import AgentDashboard from './pages/agent/Dashboard';
import TicketDetails from './pages/agent/TicketDetails';
import AssignedTickets from './pages/agent/AssignedTickets';
import AdminDashboard from './pages/admin/Dashboard';
import UserManagement from './pages/admin/UserManagement';
import AllComplaints from './pages/admin/AllComplaints';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to their appropriate dashboard if they try to access a route not for them
    if (user.role === 'customer') return <Navigate to="/customer/dashboard" replace />;
    if (user.role === 'agent') return <Navigate to="/agent/dashboard" replace />;
    if (user.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Customer Routes */}
          <Route path="/customer" element={
            <ProtectedRoute allowedRoles={['customer']}>
              <DashboardLayout />
            </ProtectedRoute>
          }>
            <Route path="dashboard" element={<CustomerDashboard />} />
            <Route path="complaints" element={<MyComplaints />} />
            <Route path="complaints/:id" element={<ComplaintDetails />} />
            <Route path="new-complaint" element={<NewComplaint />} />
          </Route>

          {/* Agent Routes */}
          <Route path="/agent" element={
            <ProtectedRoute allowedRoles={['agent']}>
              <DashboardLayout />
            </ProtectedRoute>
          }>
            <Route path="dashboard" element={<AgentDashboard />} />
            <Route path="tickets" element={<AssignedTickets />} />
            <Route path="tickets/:id" element={<TicketDetails />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <DashboardLayout />
            </ProtectedRoute>
          }>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="complaints" element={<AllComplaints />} />
            <Route path="complaints/:id" element={<TicketDetails />} />
            <Route path="users" element={<UserManagement />} />
          </Route>

          {/* Clean catch-all */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
