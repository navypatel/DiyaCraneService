import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';
import { TESTIMONIALS } from '../../lib/constants';

export default function Testimonials() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const length = TESTIMONIALS.length;

  const nextSlide = () => {
    setActiveIdx((prev) => (prev === length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setActiveIdx((prev) => (prev === 0 ? length - 1 : prev - 1));
  };

  useEffect(() => {
    if (!isHovered) {
      intervalRef.current = setInterval(() => {
        nextSlide();
      }, 5000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isHovered, activeIdx]);

  return (
    <section 
      id="testimonials-section" 
      className="py-20 bg-brand-black text-white relative overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background aesthetics */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-yellow/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-brand-red/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Section */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-brand-yellow uppercase font-mono text-xs tracking-widest font-black block mb-2">Our Testimonials</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight" id="testimonials-heading">
            Client <span className="text-brand-yellow">Appreciations</span>
          </h2>
          <p className="mt-4 text-sm text-gray-400 font-sans">
            Hear from leading construction enterprises, steel yard operations, and heavy fabricators in South Gujarat.
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative min-h-[300px] flex items-center justify-center p-2 sm:p-6" id="testimonials-carousel-view">
          
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIdx}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4 }}
              className="bg-brand-dark border border-white/10 p-8 sm:p-12 rounded-xl shadow-xl w-full max-w-3xl flex flex-col items-center text-center relative"
            >
              <Quote className="w-12 h-12 text-brand-yellow/10 absolute top-6 left-8 rotate-180" />
              
              {/* Star Rating Icon list */}
              <div className="flex gap-1 text-brand-yellow mb-6">
                {[...Array(TESTIMONIALS[activeIdx].stars)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-brand-yellow" />
                ))}
              </div>

              {/* Quote Statement */}
              <blockquote className="text-lg sm:text-xl font-medium font-sans text-gray-200 leading-relaxed italic pr-2">
                "{TESTIMONIALS[activeIdx].quote}"
              </blockquote>

              {/* Author Title and Subtitles */}
              <div className="mt-8 border-t border-white/10 pt-6 w-full max-w-sm">
                <cite className="block font-display font-bold text-base text-white not-italic">
                  {TESTIMONIALS[activeIdx].name}
                </cite>
                <span className="block text-xs font-mono uppercase tracking-widest text-[#FFD700] mt-1">
                  {TESTIMONIALS[activeIdx].company}
                </span>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/5 hover:bg-brand-yellow hover:text-brand-black border border-white/10 p-2 sm:p-3 rounded-full transition-colors focus:outline-none text-white shadow-xl z-20"
            id="testimonial-prev-arrow"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/5 hover:bg-brand-yellow hover:text-brand-black border border-white/10 p-2 sm:p-3 rounded-full transition-colors focus:outline-none text-white shadow-xl z-20"
            id="testimonial-next-arrow"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

        </div>

        {/* Animated Slide Pointers (Dots) */}
        <div className="flex justify-center gap-2.5 mt-8" id="testimonial-dots-container">
          {TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIdx(i)}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                i === activeIdx ? 'w-8 bg-brand-yellow' : 'w-2.5 bg-gray-600 hover:bg-gray-400'
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
