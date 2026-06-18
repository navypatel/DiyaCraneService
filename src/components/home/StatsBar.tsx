import React from 'react';
import { Calendar, Building, Clock, ShieldCheck } from 'lucide-react';

export default function StatsBar() {
  const stats = [
    {
      icon: <Calendar className="w-5 h-5 text-brand-red" />,
      number: '10+',
      label: 'Years Experience',
      sub: 'Operating in South Gujarat'
    },
    {
      icon: <Building className="w-5 h-5 text-brand-red" />,
      number: '100+',
      label: 'Projects Delivered',
      sub: 'Factories, Sub-stations & Bridges'
    },
    {
      icon: <Clock className="w-5 h-5 text-brand-red" />,
      number: '99.9%',
      label: 'Punctuality',
      sub: 'On-time crane mobilization'
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-brand-red" />,
      number: '24/7',
      label: 'Operator Support',
      sub: 'Standby breakdown rig crews'
    }
  ];

  return (
    <div className="bg-brand-gray py-8 relative -mt-4 z-10" id="stats-bar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <div 
              key={i}
              className="bg-white p-5 rounded-lg shadow-sm border-t-4 border-brand-yellow flex flex-col md:flex-row md:items-center gap-4 transition-all hover:shadow-md"
            >
              <div className="p-3 bg-brand-yellow/15 text-brand-black rounded-lg w-fit">
                {stat.icon}
              </div>
              <div>
                <span className="block font-display font-black text-2xl sm:text-3xl text-brand-black tracking-tight">
                  {stat.number}
                </span>
                <span className="block font-display font-bold text-xs sm:text-sm text-brand-black/90 leading-none mt-1">
                  {stat.label}
                </span>
                <span className="block text-[10px] text-gray-500 font-sans mt-1">
                  {stat.sub}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
