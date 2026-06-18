import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';

interface ImageItem {
  id: number;
  src: string;
  category: 'HYDRA' | 'FARANA';
  title: string;
  location: string;
}

interface ImageModalProps {
  isOpen: boolean;
  activeImage: ImageItem | null;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

export default function ImageModal({ isOpen, activeImage, onClose, onPrev, onNext }: ImageModalProps) {
  // Bind keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, onPrev, onNext]);

  return (
    <AnimatePresence>
      {isOpen && activeImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          id="gallery-lightbox-overlay"
          className="fixed inset-0 z-50 bg-brand-dark/95 backdrop-blur-md flex flex-col items-center justify-center p-4 sm:p-6"
        >
          {/* Close button top right */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 text-white hover:text-brand-yellow p-3 bg-white/5 rounded-full backdrop-blur-sm transition-all hover:scale-105"
            aria-label="Close Lightbox"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Main Visual Arena */}
          <div className="relative w-full max-w-4xl flex items-center justify-between gap-4">
            
            {/* Left Prev Arrow Button */}
            <button
              onClick={onPrev}
              className="text-white hover:text-brand-yellow bg-white/5 p-3 rounded-full hover:scale-105 transition-all outline-none"
              aria-label="Previous Image"
            >
              <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
            </button>

            {/* Centered Image display frame */}
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="flex-grow flex flex-col justify-center items-center overflow-hidden"
            >
              <div className="relative bg-brand-black p-1 border border-white/10 rounded-lg shadow-2xl max-h-[70vh] sm:max-h-[75vh] flex items-center justify-center overflow-hidden">
                <img
                  src={activeImage.src}
                  alt={activeImage.title}
                  referrerPolicy="no-referrer"
                  className="object-contain max-w-full max-h-[68vh] rounded"
                  onError={(e) => {
                    // Fail fallback graphic in case image file is not found
                    const target = e.target as HTMLImageElement;
                    target.src = 'data:image/svg+xml;charset=utf-8,%3Csvg xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22 width%3D%22800%22 height%3D%22500%22 viewBox%3D%220 0 800 500%22%3E%3Crect width%3D%22100%25%22 height%3D%22100%25%22 fill%3D%22%23262626%22%2F%3E%3Ctext x%3D%2250%25%22 y%3D%2250%25%22 fill%3D%22%23888888%22 font-family%3D%22sans-serif%22 font-size%3D%2220%22 text-anchor%3D%22middle%22%3EMobile Crane Image Placeholder%3C%2Ftext%3E%3C%2Fsvg%3E';
                  }}
                />
              </div>

              {/* Caption and Location */}
              <div className="mt-5 text-center px-4 max-w-xl">
                <h4 className="text-white text-lg font-bold font-display tracking-tight leading-snug">
                  {activeImage.title}
                </h4>
                <div className="flex items-center justify-center gap-2 mt-1.5 text-xs text-brand-yellow font-mono tracking-widest uppercase">
                  <span>{activeImage.category} SERIES</span>
                  <span className="text-gray-600">•</span>
                  <span className="text-gray-400">{activeImage.location}</span>
                </div>
              </div>

            </motion.div>

            {/* Right Next Arrow Button */}
            <button
              onClick={onNext}
              className="text-white hover:text-brand-yellow bg-white/5 p-3 rounded-full hover:scale-105 transition-all outline-none"
              aria-label="Next Image"
            >
              <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
            </button>

          </div>

          {/* Navigation helpers (indicators) */}
          <div className="absolute bottom-6 flex items-center gap-1 text-white/40 font-mono text-xs">
            <span>Press</span>
            <span className="text-white bg-white/10 px-1.5 py-0.5 rounded text-[10px]">ESC</span>
            <span>to close context</span>
          </div>

        </motion.div>
      )}
    </AnimatePresence>
  );
}
