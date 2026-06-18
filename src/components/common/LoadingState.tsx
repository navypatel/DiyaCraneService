import React from 'react';
import { Loader2 } from 'lucide-react';

export default function LoadingState({ message = 'Loading records...' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4" id="loading-state-wrapper">
      <Loader2 className="w-10 h-10 text-brand-yellow animate-spin stroke-[2.5] mb-4" />
      <p className="text-sm font-medium text-gray-500 font-mono tracking-wide animate-pulse">{message}</p>
    </div>
  );
}
