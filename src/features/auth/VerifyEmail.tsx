import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Mail, RefreshCw, ArrowLeft, ExternalLink, CheckCircle } from 'lucide-react';
import AuthLayout from './AuthLayout';
import { authService } from '../../services/auth';

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') || 'your account email';
  const [resending, setResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  const handleResend = async () => {
    setResending(true);
    try {
      await authService.sendVerificationEmail();
      setResendSuccess(true);
      setTimeout(() => setResendSuccess(false), 5000);
    } catch {
      // ignore
    } finally {
      setResending(false);
    }
  };

  const openEmailApp = () => {
    window.location.href = 'mailto:';
  };

  return (
    <AuthLayout
      title="Verify your work email"
      subtitle="Confirm your identity to unlock full workspace access"
    >
      <div className="space-y-6 text-center py-2">
        <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center justify-center mx-auto shadow-2xs">
          <Mail size={28} />
        </div>

        <div>
          <h3 className="text-base font-bold text-slate-900">
            Check your inbox
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
            We sent a verification link to:
            <br />
            <strong className="text-slate-900 font-semibold">{email}</strong>
          </p>
          <p className="text-[11px] text-slate-500 mt-2">
            Click the link in the email to activate your property workspace.
          </p>
        </div>

        {resendSuccess && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center justify-center gap-1.5 font-medium">
            <CheckCircle size={15} className="text-emerald-700" />
            <span>Verification email sent again. Check spam if not visible.</span>
          </div>
        )}

        <div className="pt-2 space-y-2.5">
          <button
            onClick={openEmailApp}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 transition-colors shadow-xs cursor-pointer"
          >
            <span>Open Email App</span> <ExternalLink size={14} />
          </button>

          <button
            onClick={handleResend}
            disabled={resending}
            className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw size={14} className={resending ? 'animate-spin' : ''} />
            <span>{resending ? 'Resending...' : 'Resend verification email'}</span>
          </button>
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <Link
            to="/signup"
            className="hover:text-slate-900 transition-colors"
          >
            Change email
          </Link>
          <Link
            to="/login"
            className="inline-flex items-center gap-1 font-semibold text-slate-900 hover:text-emerald-800 transition-colors"
          >
            <ArrowLeft size={13} /> Back to sign in
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}
