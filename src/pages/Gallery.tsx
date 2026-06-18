import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Grid3X3 } from 'lucide-react';
import CategoryTabs from '../components/gallery/CategoryTabs';
import GalleryGrid from '../components/gallery/GalleryGrid';
import ImageModal from '../components/gallery/ImageModal';
import { GALLERY_CATEGORIES } from '../lib/constants';
import craneOrange from '../assets/images/crane_orange_15xw_1781700235890.jpg';
import craneGreen from '../assets/images/crane_green_f270_1781700221950.jpg';
import craneRoad from '../assets/images/fleet_crane_road_1781700201838.jpg';
import cranes from '../assets/images/cranes.jpg';
import HydraImage from '../assets/images/Hydra.png';
import FaranaImage from '../assets/images/Farana.png';

interface ImageItem {
  id: number;
  src: string;
  category: 'HYDRA' | 'FARANA';
  title: string;
  location: string;
}

const GALLERY_ITEMS: ImageItem[] = [
  {
    id: 1,
    src: craneOrange,
    category: 'HYDRA',
    title: 'Precision machinery swap at textile facility',
    location: 'Pardi GIDC Corridor'
  },
  {
    id: 2,
    src: craneGreen,
    category: 'FARANA',
    title: 'Erection of heavy structural GI trusses',
    location: 'Gundlav Industrial Estate'
  },
  {
    id: 3,
    src: craneRoad,
    category: 'HYDRA',
    title: 'Lifting vertical chemical tanks from trailers',
    location: 'Atul Ltd Chemical Yards'
  },
  {
    id: 4,
    src: HydraImage,
    category: 'HYDRA',
    title: 'Hydra fleet deployment for confined site lifting',
    location: 'Valsad Industrial Belt'
  },
  {
    id: 5,
    src: FaranaImage,
    category: 'FARANA',
    title: 'Farana pick-and-carry operation for steel transfer',
    location: 'Vapi Yard Zone 3'
  },
  {
    id: 6,
    src: cranes,
    category: 'FARANA',
    title: 'Multi-crane coordination for heavy load movement',
    location: 'South Gujarat project site'
  }
];

export default function Gallery() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [lightboxImg, setLightboxImg] = useState<ImageItem | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Filter images client-side
  const filteredImages = useMemo(() => {
    if (activeCategory === 'All') return GALLERY_ITEMS;
    return GALLERY_ITEMS.filter(item => item.category === activeCategory);
  }, [activeCategory]);

  // Gallery Navigation utilities
  const handlePrevImage = () => {
    if (!lightboxImg) return;
    const currentIdx = filteredImages.findIndex((item) => item.id === lightboxImg.id);
    const prevIdx = currentIdx === 0 ? filteredImages.length - 1 : currentIdx - 1;
    setLightboxImg(filteredImages[prevIdx]);
  };

  const handleNextImage = () => {
    if (!lightboxImg) return;
    const currentIdx = filteredImages.findIndex((item) => item.id === lightboxImg.id);
    const nextIdx = currentIdx === filteredImages.length - 1 ? 0 : currentIdx + 1;
    setLightboxImg(filteredImages[nextIdx]);
  };

  return (
    <div className="bg-brand-gray/30 pt-[80px] min-h-screen pb-20" id="gallery-index-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb Navigation segment */}
        <nav className="flex items-center gap-2 py-4 text-xs font-mono uppercase tracking-wider text-gray-500">
          <Link to="/" className="hover:text-brand-red transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          <span className="text-brand-black font-semibold">Project Gallery</span>
        </nav>

        {/* Header Hero Area */}
        <div className="text-left py-8 max-w-3xl border-b border-gray-200 mb-10">
          <span className="text-xs font-mono uppercase tracking-widest text-brand-red font-bold block mb-2">Our Work Evidence</span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-brand-black tracking-tight" id="gallery-page-title">
            Project <span className="text-brand-red">Gallery</span>
          </h1>
          <p className="mt-4 text-sm text-gray-650 leading-relaxed font-sans">
            A graphic archive of actual rigging maneuvers, pick-and-carry transits, and elevated girder erections carried out across South Gujarat GIDC belts by Diya Crane Service crews.
          </p>
        </div>

        {/* Categories Tab sliders */}
        <CategoryTabs
          categories={GALLERY_CATEGORIES}
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
        />

        {/* Visual Masonry Grid displaying images */}
        <div className="mt-8">
          <GalleryGrid
            images={filteredImages}
            onOpenImage={setLightboxImg}
          />
        </div>

        {/* Immersive Dark Lightbox modal dialog overlay */}
        <ImageModal
          isOpen={!!lightboxImg}
          activeImage={lightboxImg}
          onClose={() => setLightboxImg(null)}
          onPrev={handlePrevImage}
          onNext={handleNextImage}
        />

        {/* Last call to action line */}
        <div className="mt-16 bg-white p-8 rounded-xl border border-gray-150 shadow-sm text-center max-w-xl mx-auto flex flex-col items-center">
          <Grid3X3 className="w-8 h-8 text-brand-yellow stroke-[2] mb-3" />
          <h4 className="font-display font-extrabold text-sm sm:text-base text-brand-black">Have a custom payload requiring similar rigging clearance?</h4>
          <p className="text-xs text-gray-400 font-sans mt-2 max-w-md leading-relaxed">
            Send us the technical payload descriptions and heights. Our dispatch desk will blueprint the crane hook radius and deliver a comprehensive rental quote.
          </p>
          <Link
            to="/contact"
            className="mt-5 px-6 py-2.5 bg-brand-yellow hover:bg-brand-yellow-hover text-brand-black font-bold text-xs uppercase tracking-wider rounded transition-all active:scale-95 shadow"
          >
            Submit Enquiry Panel
          </Link>
        </div>

      </div>
    </div>
  );
}
