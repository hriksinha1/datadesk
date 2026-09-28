import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Building2, User, Mail, Lock, AlertCircle, ArrowRight } from 'lucide-react';
import AuthLayout from './AuthLayout';
import { useAuth } from '../../context/AuthContext';

export default function Signup() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [propertyName, setPropertyName] = useState('');
  const [propertyType, setPropertyType] = useState('Boutique Hotel');
  const [unitCount, setUnitCount] = useState('1');
  const [termsAgreed, setTermsAgreed] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!termsAgreed) {
      setError('Please agree to the Terms of Service & Privacy Policy.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await signup({
        fullName,
        email,
        password,
        propertyName,
        propertyType,
        unitCount,
      });
      navigate('/app');
    } catch (err: any) {
      setError(err?.message || 'Unable to create workspace. Please check your information.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Set up your property workspace"
      subtitle="Create your free workspace."
    >
      {error && (
        <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
          <AlertCircle size={15} className="shrink-0 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3.5">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Full Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <User size={15} />
            </div>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Rohan Sharma"
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Work Email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Mail size={15} />
            </div>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="rohan@thefernresidency.com"
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Password (at least 8 characters)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Lock size={15} />
            </div>
            <input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Property / Business Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Building2 size={15} />
            </div>
            <input
              type="text"
              required
              value={propertyName}
              onChange={(e) => setPropertyName(e.target.value)}
              placeholder="e.g. The Fern Residency"
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Property Type
            </label>
            <select
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
              className="select w-full text-xs sm:text-sm py-2"
            >
              <option value="Boutique Hotel">Boutique Hotel</option>
              <option value="Homestay">Homestay / Villa</option>
              <option value="Hostel">Hostel / Dormitory</option>
              <option value="Lodge">Guest House / Lodge</option>
              <option value="Resort">Small Resort</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Locations
            </label>
            <select
              value={unitCount}
              onChange={(e) => setUnitCount(e.target.value)}
              className="select w-full text-xs sm:text-sm py-2"
            >
              <option value="1">1 Property</option>
              <option value="2-5">2 to 5 Properties</option>
              <option value="6+">6+ Properties</option>
            </select>
          </div>
        </div>

        <div className="pt-2">
          <label className="flex items-start gap-2 text-xs text-slate-600 cursor-pointer">
            <input
              type="checkbox"
              checked={termsAgreed}
              onChange={(e) => setTermsAgreed(e.target.checked)}
              className="mt-0.5 rounded text-slate-900 focus:ring-slate-900"
            />
            <span>
              I agree to the{' '}
              <a href="#terms" className="text-slate-900 underline font-medium">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#privacy" className="text-slate-900 underline font-medium">
                Privacy Policy
              </a>
              .
            </span>
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-4 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 transition-colors disabled:opacity-50 cursor-pointer"
        >
          {loading ? 'Creating Workspace...' : 'Create Workspace'} <ArrowRight size={15} />
        </button>
      </form>

      <div className="mt-5 pt-4 border-t border-slate-100 text-center text-xs text-slate-600">
        <span>Already have an account? </span>
        <Link
          to="/login"
          className="font-semibold text-slate-900 hover:text-emerald-800 transition-colors"
        >
          Sign in
        </Link>
      </div>
    </AuthLayout>
  );
}
