import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useParams } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import AppShell from './components/layout/AppShell';

// Lazy-loaded routes for code splitting
const HomePage = lazy(() => import('./pages/HomePage'));
const Login = lazy(() => import('./features/auth/Login'));
const Signup = lazy(() => import('./features/auth/Signup'));
const ForgotPassword = lazy(() => import('./features/auth/ForgotPassword'));
const ResetPassword = lazy(() => import('./features/auth/ResetPassword'));
const VerifyEmail = lazy(() => import('./features/auth/VerifyEmail'));

const Dashboard = lazy(() => import('./features/dashboard/Dashboard'));
const BookingsList = lazy(() => import('./features/bookings/BookingsList'));
const BookingDetail = lazy(() => import('./features/bookings/BookingDetail'));
const NewBooking = lazy(() => import('./features/bookings/NewBooking'));
const CustomersList = lazy(() => import('./features/customers/CustomersList'));
const PropertiesList = lazy(() => import('./features/properties/PropertiesList'));
const PaymentsList = lazy(() => import('./features/payments/PaymentsList'));
const OutstandingPayments = lazy(() => import('./features/payments/OutstandingPayments'));
const ReportsList = lazy(() => import('./features/reports/ReportsList'));
const Settings = lazy(() => import('./features/settings/Settings'));

function RouteLoading() {
  return (
    <div className="min-h-[50vh] flex items-center justify-center p-8">
      <div className="flex flex-col items-center gap-2">
        <div className="w-7 h-7 rounded-[6px] bg-[#0D5C4D] text-white flex items-center justify-center font-bold text-xs animate-pulse">
          MY
        </div>
        <div className="text-xs text-[#64748B] font-medium">Loading workspace...</div>
      </div>
    </div>
  );
}

function ProtectedWorkspaceRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F8FA] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-[6px] bg-[#0D5C4D] text-white flex items-center justify-center font-bold text-xs animate-pulse">
            MY
          </div>
          <div className="text-xs text-[#64748B] font-medium">Authenticating session...</div>
        </div>
      </div>
    );
  }

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
        <Suspense fallback={<RouteLoading />}>
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
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
}
