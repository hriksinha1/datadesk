import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import AuthLayout from './AuthLayout';
import { authService } from '../../services/auth';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    try {
      setLoading(true);
      setError(null);
      await authService.sendPasswordReset(email);
      setSent(true);
    } catch (err: any) {
      setError(err?.message || 'Unable to send recovery email. Please check the address.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Reset your password"
      subtitle="Enter your account email to receive a secure recovery link"
    >
      {sent ? (
        <div className="space-y-5 text-center py-2">
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto border border-emerald-200">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Check your inbox</h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              We sent password reset instructions to <strong className="text-slate-900">{email}</strong>.
            </p>
          </div>
          <div className="pt-2 flex flex-col gap-2">
            <Link
              to={`/verify-email?email=${encodeURIComponent(email)}`}
              className="w-full inline-flex items-center justify-center py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 transition-colors"
            >
              View Verification Status
            </Link>
            <Link
              to="/login"
              className="w-full inline-flex items-center justify-center py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
            >
              Back to Sign in
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle size={15} className="shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Work Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Mail size={16} />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="manager@yourproperty.com"
                className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-1.5">
              If an account exists with this email, you will receive a reset link valid for 60 minutes.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 transition-colors disabled:opacity-50 cursor-pointer"
          >
            {loading ? 'Sending link...' : 'Send reset link'}
          </button>

          <div className="pt-3 text-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft size={14} /> Back to sign in
            </Link>
          </div>
        </form>
      )}
    </AuthLayout>
  );
}
