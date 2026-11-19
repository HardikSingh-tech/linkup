import React from 'react';
import AppLayout from '../components/AppLayout';

export default function StubPage({ title }) {
  return (
    <AppLayout>
      <div className="bg-white rounded-lg border border-brand-border p-8 text-center">
        <h2 className="text-xl font-bold text-gray-800">{title}</h2>
        <p className="text-sm text-gray-500 mt-2">Section under active deployment.</p>
      </div>
    </AppLayout>
  );
}
