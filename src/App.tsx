import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useParams } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import HomePage from './pages/HomePage';
import Login from './features/auth/Login';
import Signup from './features/auth/Signup';
import ForgotPassword from './features/auth/ForgotPassword';
import ResetPassword from './features/auth/ResetPassword';
import VerifyEmail from './features/auth/VerifyEmail';
import AppShell from './components/layout/AppShell';
import Dashboard from './features/dashboard/Dashboard';
import BookingsList from './features/bookings/BookingsList';
import BookingDetail from './features/bookings/BookingDetail';
import NewBooking from './features/bookings/NewBooking';
import CustomersList from './features/customers/CustomersList';
import PropertiesList from './features/properties/PropertiesList';
import PaymentsList from './features/payments/PaymentsList';
import OutstandingPayments from './features/payments/OutstandingPayments';
import ReportsList from './features/reports/ReportsList';
import Settings from './features/settings/Settings';

function ProtectedWorkspaceRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-sm animate-pulse">
            M
          </div>
          <div className="text-xs text-slate-500 font-medium">
            Loading property workspace...
          </div>
        </div>
      </div>
    );
  }

  // If not logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function BookingParamRedirect() {
  const { id } = useParams();
  return <Navigate to={`/app/bookings/${id}`} replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Marketing Website */}
          <Route path="/" element={<HomePage />} />

          {/* Authentication System */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/verify-email" element={<VerifyEmail />} />

          {/* PMS Workspace Routes */}
          <Route
            path="/app"
            element={
              <ProtectedWorkspaceRoute>
                <AppShell />
              </ProtectedWorkspaceRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="bookings" element={<BookingsList />} />
            <Route path="bookings/new" element={<NewBooking />} />
            <Route path="bookings/:id" element={<BookingDetail />} />
            <Route path="payments" element={<PaymentsList />} />
            <Route path="outstanding" element={<OutstandingPayments />} />
            <Route path="customers" element={<CustomersList />} />
            <Route path="properties" element={<PropertiesList />} />
            <Route path="reports" element={<ReportsList />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* Legacy root redirects for seamless continuity */}
          <Route path="/bookings" element={<Navigate to="/app/bookings" replace />} />
          <Route path="/bookings/new" element={<Navigate to="/app/bookings/new" replace />} />
          <Route path="/bookings/:id" element={<BookingParamRedirect />} />
          <Route path="/payments" element={<Navigate to="/app/payments" replace />} />
          <Route path="/outstanding" element={<Navigate to="/app/outstanding" replace />} />
          <Route path="/customers" element={<Navigate to="/app/customers" replace />} />
          <Route path="/properties" element={<Navigate to="/app/properties" replace />} />
          <Route path="/reports" element={<Navigate to="/app/reports" replace />} />
          <Route path="/settings" element={<Navigate to="/app/settings" replace />} />

          {/* Fallback to marketing home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
