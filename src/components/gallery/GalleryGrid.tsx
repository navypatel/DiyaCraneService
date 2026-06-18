import React from 'react';
import { ZoomIn, MapPin } from 'lucide-react';

interface ImageItem {
  id: number;
  src: string;
  category: 'HYDRA' | 'FARANA';
  title: string;
  location: string;
}

interface GalleryGridProps {
  images: ImageItem[];
  onOpenImage: (img: ImageItem) => void;
}

export default function GalleryGrid({ images, onOpenImage }: GalleryGridProps) {
  return (
    <div 
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" 
      id="gallery-visual-masonry"
    >
      {images.map((img) => (
        <div 
          key={img.id}
          onClick={() => onOpenImage(img)}
          className="group bg-white rounded-lg overflow-hidden border border-gray-150 shadow-sm hover:shadow-md transition-all cursor-pointer relative"
        >
          {/* Card Image Block */}
          <div className="relative h-64 bg-brand-black/90 flex items-center justify-center overflow-hidden">
            <img
              src={img.src}
              alt={img.title}
              referrerPolicy="no-referrer"
              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'data:image/svg+xml;charset=utf-8,%3Csvg xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22 width%3D%22800%22 height%3D%22505%22 viewBox%3D%220 0 800 505%22%3E%3Crect width%3D%22100%25%22 height%3D%22100%25%22 fill%3D%22%23262626%22%2F%3E%3Ctext x%3D%2250%25%22 y%3D%2250%25%22 fill%3D%22%23888888%22 font-family%3D%22sans-serif%22 font-size%3D%2220%22 text-anchor%3D%22middle%22%3E' + img.category + ' Crane Shift%3C%2Ftext%3E%3C%2Fsvg%3E';
              }}
            />
            {/* Top Right Badges */}
            <div className="absolute top-4 left-4">
              <span className={`px-2.5 py-1 text-[10px] font-mono tracking-widest uppercase font-extrabold rounded shadow ${
                img.category === 'HYDRA' ? 'bg-brand-yellow text-brand-black' : 'bg-brand-red text-white'
              }`}>
                {img.category}
              </span>
            </div>

            {/* Hover overlay zooming glass */}
            <div className="absolute inset-0 bg-brand-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
              <div className="bg-brand-yellow text-brand-black p-3.5 rounded-full shadow-lg">
                <ZoomIn className="w-5 h-5 stroke-[2.5]" />
              </div>
            </div>
          </div>

          {/* Description Block */}
          <div className="p-4 flex flex-col gap-2">
            <h4 className="font-display font-bold text-sm text-brand-black tracking-tight group-hover:text-brand-red transition-colors max-w-xs leading-snug">
              {img.title}
            </h4>
            
            <div className="flex items-center gap-1.5 text-xs text-gray-500 font-sans">
              <MapPin className="w-3.5 h-3.5 text-brand-yellow flex-shrink-0" />
              <span>{img.location}</span>
            </div>
          </div>

        </div>
      ))}
    </div>
  );
}
