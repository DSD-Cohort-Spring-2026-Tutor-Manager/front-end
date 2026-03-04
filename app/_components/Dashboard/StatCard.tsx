import React from "react";

export interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}

export function StatCard({ title, value, icon, color }: StatCardProps) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
      <span
        className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}
      >
        {icon}
      </span>
      <div>
        <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">
          {title}
        </p>
        <p className="text-2xl font-bold text-[--Support]">{value}</p>
      </div>
    </div>
  );
}
