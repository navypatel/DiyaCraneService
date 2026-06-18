import React from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export default function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center border-2 border-dashed border-red-100 rounded-xl bg-red-50/20" id="error-state-wrapper">
      <div className="bg-red-50 p-3 rounded-full text-brand-red mb-4">
        <AlertCircle className="w-8 h-8" />
      </div>
      <p className="text-sm font-semibold text-brand-red font-display tracking-tight mb-2">Operation Error</p>
      <p className="text-xs text-gray-500 max-w-sm font-sans mb-6">{message}</p>
      
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-white border border-gray-200 rounded-md shadow-sm hover:bg-gray-50 text-gray-700 transition"
          id="error-state-retry-btn"
        >
          <RotateCcw className="w-3.5 h-3.5 text-gray-600" />
          Retry Request
        </button>
      )}
    </div>
  );
}
