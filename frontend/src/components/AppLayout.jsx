import React from 'react';
import Navbar from './Navbar';

export default function AppLayout({ children, leftCol, rightCol }) {
  return (
    <div className="min-h-screen bg-brand-bg flex flex-col min-w-desktop">
      <Navbar />

      <main className="max-w-[1128px] w-full mx-auto px-4 py-6 flex-1 flex gap-6 justify-center items-start">
        {/* Left Column (225px) */}
        {leftCol && (
          <aside className="w-[225px] flex-shrink-0 flex flex-col gap-2.5">
            {leftCol}
          </aside>
        )}

        {/* Center Content Feed (555px - 850px depending on layout) */}
        <section className="flex-1 max-w-[555px] min-w-0 flex flex-col gap-3">
          {children}
        </section>

        {/* Right Column (300px) */}
        {rightCol && (
          <aside className="w-[300px] flex-shrink-0 flex flex-col gap-2.5">
            {rightCol}
          </aside>
        )}
      </main>
    </div>
  );
}
