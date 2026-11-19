import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import Button from '../components/Button';
import Spinner from '../components/Spinner';

export default function LoginPage() {
  const [email, setEmail] = useState('hardik@linkup.com');
  const [password, setPassword] = useState('Password@123');
  const { login, isLoading, error } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await login(email, password);
    if (res.success) {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Brand Header */}
      <div className="flex items-center space-x-2 mb-6">
        <div className="w-10 h-10 rounded-lg bg-brand-blue flex items-center justify-center text-white font-black text-2xl shadow-md">
          L
        </div>
        <span className="text-3xl font-extrabold text-brand-blue tracking-tight">
          Link<span className="text-gray-900">Up</span>
        </span>
      </div>

      <div className="max-w-md w-full bg-white rounded-xl shadow-md border border-brand-border p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Sign in</h2>
        <p className="text-xs text-gray-500 mb-6">Stay updated on your professional world</p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-xs font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent"
              placeholder="you@domain.com"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent"
              placeholder="••••••••"
            />
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 rounded-full text-base"
            >
              {isLoading ? <Spinner size="sm" /> : 'Sign in'}
            </Button>
          </div>
        </form>

        <div className="mt-6 pt-4 border-t border-brand-border text-center">
          <p className="text-xs text-gray-600">
            New to LinkUp?{' '}
            <Link to="/register" className="font-semibold text-brand-blue hover:underline">
              Join now
            </Link>
          </p>
        </div>

        {/* Demo Credentials quick fill */}
        <div className="mt-4 p-3 bg-slate-50 border border-slate-200 rounded-lg text-left">
          <p className="text-[11px] font-semibold text-gray-700">Quick Demo Accounts (Password: Password@123):</p>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {['hardik@linkup.com', 'sarah.jenkins@techcorp.io', 'david.chen@cloudscale.net'].map(acc => (
              <button
                key={acc}
                type="button"
                onClick={() => { setEmail(acc); setPassword('Password@123'); }}
                className="text-[10px] bg-white border border-gray-300 px-2 py-0.5 rounded hover:bg-gray-100 text-gray-700 font-mono"
              >
                {acc.split('@')[0]}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
