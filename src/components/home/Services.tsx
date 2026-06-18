import React from 'react';
import { Link } from 'react-router-dom';
import { Truck, Weight, ArrowRight, Layers, Settings } from 'lucide-react';

export default function Services() {
  const categories = [
    {
      title: 'HYDRA Crane Fleet',
      type: 'HYDRA',
      capacity: '12 Tons - 18 Tons',
      tagline: 'Precision maneuvers in narrow spaces',
      desc: 'Mobile hydraulic cranes featuring articulating chassis structures, multi-stage telescopic boom extensions, and maximum stable rigging profiles. Perfect for confined factory shifts.',
      specs: [
        { label: 'Max Lift', val: '18 Tons' },
        { label: 'Max Height', val: '55 Feet' },
        { label: 'Best For', val: 'Industrial Maintenance' }
      ],
      slug: 'hydra',
      image: '/src/assets/images/Hydra.png',
      color: 'border-brand-yellow',
      icon: <Layers className="w-5 h-5 text-brand-black" />
    },
    {
      title: 'FARANA Crane Fleet',
      type: 'FARANA',
      capacity: '15 Tons - 25 Tons',
      tagline: 'Heavy duty pick-and-carry mobility',
      desc: 'High-torque Pick & Carry cranes engineered to lift massive industrial cargoes and safely transport them across graded site bases, complete with electronic load monitoring dials.',
      specs: [
        { label: 'Max Lift', val: '25 Tons' },
        { label: 'Max Height', val: '70 Feet' },
        { label: 'Best For', val: 'Steel Erection & Slabs' }
      ],
      slug: 'farana',
      image: '/src/assets/images/Farana.png',
      color: 'border-brand-red',
      icon: <Settings className="w-5 h-5 text-brand-black" />
    }
  ];

  return (
    <section id="fleet-section" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Heading & Badge */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-brand-red uppercase font-mono text-xs tracking-widest font-black block mb-2">Our Operations</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-black tracking-tight" id="services-section-heading">
            Heavy Lift <span className="text-brand-red">Mobile Crane</span> Solutions
          </h2>
          <p className="mt-4 text-sm text-gray-500 font-sans">
            Our crane operators maintain uncompromised, safety-compliant rig setups operating primarily across Valsad and adjacent Gujarat industrial belts.
          </p>
        </div>

        {/* Dynamic Dual Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12" id="services-grid-container">
          {categories.map((cat, i) => (
            <div
              key={i}
              className={`flex flex-col rounded-xl overflow-hidden border bg-brand-gray/30 shadow-sm transition-all hover:shadow-lg hover:-translate-y-1 ${cat.color} border-t-4`}
            >
              {/* Card Image Area */}
              <div className="relative h-[250px] bg-brand-black/90 flex items-center justify-center overflow-hidden group">
                <div
                  className="absolute inset-0 bg-cover bg-center opacity-65 group-hover:scale-105 transition-transform duration-500"
                  style={{ backgroundImage: `url('${cat.image}')` }}
                />

                {/* Fallback Graphic */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-brand-black/90 via-brand-black/40 to-transparent p-6 flex items-end justify-between">
                  <div>
                    <span className="px-2.5 py-1 bg-brand-yellow text-brand-black text-[10px] font-mono tracking-widest uppercase font-extrabold rounded">
                      {cat.type} SERIES
                    </span>
                    <h3 className="text-white text-xl font-bold mt-1.5">{cat.title}</h3>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md text-white p-3 rounded-full">
                    <Weight className="w-6 h-6 text-brand-yellow" />
                  </div>
                </div>
              </div>

              {/* Card Details Area */}
              <div className="p-6 flex-grow flex flex-col justify-between gap-6">
                <div>
                  <p className="text-xs uppercase font-mono tracking-widest text-brand-red font-bold">
                    Capacity Profile: {cat.capacity}
                  </p>
                  <p className="font-semibold text-brand-black/80 font-sans text-sm mt-1">
                    {cat.tagline}
                  </p>
                  <p className="text-sm text-gray-500 font-sans leading-relaxed mt-3">
                    {cat.desc}
                  </p>
                </div>

                {/* Specs Section Container */}
                <div className="border-t border-b border-gray-200/60 py-4 grid grid-cols-3 gap-2">
                  {cat.specs.map((item, idx) => (
                    <div key={idx} className="text-center border-r last:border-r-0 border-gray-100 px-1">
                      <span className="block text-[10px] text-gray-400 uppercase font-mono tracking-wider leading-none">
                        {item.label}
                      </span>
                      <span className="block ml-0.5 text-xs sm:text-sm font-extrabold text-brand-black font-display tracking-tight mt-1">
                        {item.val}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Learn More Button */}
                <div className="flex items-center justify-between">
                  <Link
                    to={`/services/${cat.slug}`}
                    className="inline-flex items-center gap-1 text-sm font-extrabold text-brand-red hover:text-brand-black hover:translate-x-1 transition-all"
                  >
                    View Operational Specs
                    <ArrowRight className="w-4 h-4 text-brand-yellow" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
