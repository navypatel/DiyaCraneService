import React from 'react';

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  subtitle: string;
  badgeLabel?: string;
  badgeColor?: string; // e.g. text-green-700 bg-green-50
}

export default function StatsCard({ title, value, icon, subtitle, badgeLabel, badgeColor }: StatsCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg border border-gray-150 shadow-sm hover:shadow-md transition-all flex flex-col justify-between gap-4 relative overflow-hidden" id={`admin-stat-${title.toLowerCase().replace(/\s/g, '-')}`}>
      
      {/* Visual Top Highlight Accent */}
      <div className="absolute top-0 inset-x-0 h-1 bg-brand-yellow" />
      
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-mono uppercase tracking-widest text-gray-500">{title}</span>
          <span className="text-3xl sm:text-4xl font-extrabold text-brand-black tracking-tight font-display mt-1">{value}</span>
        </div>
        <div className="bg-brand-gray p-3 rounded-lg text-brand-black flex-shrink-0">
          {icon}
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 border-t border-gray-100 pt-3">
        <span className="text-xs text-gray-400 font-sans leading-none">{subtitle}</span>
        {badgeLabel && (
          <span className={`px-2 py-0.5 text-[10px] font-mono rounded tracking-wider uppercase font-bold ${badgeColor || 'bg-brand-yellow/20 text-brand-black'}`}>
            {badgeLabel}
          </span>
        )}
      </div>

    </div>
  );
}
