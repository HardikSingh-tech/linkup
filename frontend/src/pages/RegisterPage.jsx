import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import Button from '../components/Button';
import Spinner from '../components/Spinner';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    headline: '',
    location: '',
  });

  const { register, isLoading, error } = useAuthStore();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await register(formData);
    if (res.success) {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center space-x-2 mb-6">
        <div className="w-10 h-10 rounded-lg bg-brand-blue flex items-center justify-center text-white font-black text-2xl shadow-md">
          L
        </div>
        <span className="text-3xl font-extrabold text-brand-blue tracking-tight">
          Link<span className="text-gray-900">Up</span>
        </span>
      </div>

      <div className="max-w-md w-full bg-white rounded-xl shadow-md border border-brand-border p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Make the most of your professional life</h2>
        <p className="text-xs text-gray-500 mb-6">Connect with fellow developers, engineers, and product leaders</p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-xs font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">First Name</label>
              <input
                type="text"
                name="firstName"
                required
                value={formData.firstName}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-brand-blue focus:outline-none"
                placeholder="John"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Last Name</label>
              <input
                type="text"
                name="lastName"
                required
                value={formData.lastName}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-brand-blue focus:outline-none"
                placeholder="Doe"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-brand-blue focus:outline-none"
              placeholder="john.doe@example.com"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Password (6+ chars)</label>
            <input
              type="password"
              name="password"
              required
              minLength={6}
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-brand-blue focus:outline-none"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Professional Headline</label>
            <input
              type="text"
              name="headline"
              value={formData.headline}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-brand-blue focus:outline-none"
              placeholder="Software Engineer @ Company"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-brand-blue focus:outline-none"
              placeholder="San Francisco, CA"
            />
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 rounded-full text-base"
            >
              {isLoading ? <Spinner size="sm" /> : 'Agree & Join'}
            </Button>
          </div>
        </form>

        <div className="mt-6 pt-4 border-t border-brand-border text-center">
          <p className="text-xs text-gray-600">
            Already on LinkUp?{' '}
            <Link to="/login" className="font-semibold text-brand-blue hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
