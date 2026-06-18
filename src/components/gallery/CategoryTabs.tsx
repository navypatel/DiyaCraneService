import React from 'react';

interface CategoryTabsProps {
  categories: string[];
  activeCategory: string;
  onSelectCategory: (category: string) => void;
}

export default function CategoryTabs({ categories, activeCategory, onSelectCategory }: CategoryTabsProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2 mb-10" id="gallery-category-tabs">
      {categories.map((cat) => {
        const isActive = activeCategory === cat;
        return (
          <button
            key={cat}
            onClick={() => onSelectCategory(cat)}
            className={`px-5 py-2.5 rounded font-display font-semibold text-sm tracking-wide transition-all ${
              isActive
                ? 'bg-brand-black text-brand-yellow shadow border-2 border-brand-yellow scale-[1.02]'
                : 'bg-brand-gray hover:bg-gray-200 text-brand-black border border-gray-200'
            }`}
          >
            {cat} Fleet
          </button>
        );
      })}
    </div>
  );
}
