import React from "react";

interface DashboardLayoutProps {
  title: string;
  subtitle: string;
  stats: React.ReactNode;
  actions: React.ReactNode;
  notesTitle: string;
  notes: React.ReactNode;
}

export function DashboardLayout({
  title,
  subtitle,
  stats,
  actions,
  notesTitle,
  notes,
}: DashboardLayoutProps) {
  return (
    <main className="dashboard p-6 space-y-6 max-w-6xl mx-auto w-full">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[--Support]">{title}</h1>
        <p className="text-gray-400 text-sm mt-1">{subtitle}</p>
      </div>

      {/* Stat Cards */}
      <section className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {stats}
      </section>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <section className="lg:col-span-2 space-y-3">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
            Quick Actions
          </h2>
          {actions}
        </section>

        {/* Notes Panel */}
        <section className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 space-y-4">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
            {notesTitle}
          </h2>
          <div className="space-y-3 text-sm">{notes}</div>
        </section>
      </div>
    </main>
  );
}
