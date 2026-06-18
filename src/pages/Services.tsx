import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Landmark, Layers, Settings, Weight, HelpCircle } from 'lucide-react';

export default function Services() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const services = [
    {
      id: 'hydra',
      name: 'HYDRA Crane Service',
      tagline: 'Superb mobility and articulation for factory plants',
      desc: 'Our HYDRA Mobile Escort class cranes are optimal for indoor machine placements, heavy factory migrations, and pipeline shifts. Designed to operate safely in cramped conditions with tight steering articulations.',
      capacity: '12-ton to 18-ton standard rigging',
      image: '/src/assets/images/Hydra.png',
      icon: <Layers className="w-6 h-6 text-brand-black" />,
      features: [
        'Advanced articulating chassis design',
        'Telescopic boom reach up to 55 feet',
        'Compact structure for narrow plant entries',
        'Heavy-duty safety winches'
      ]
    },
    {
      id: 'farana',
      name: 'FARANA Crane Service',
      tagline: 'High tonnage pick-and-carry heavy lifters',
      desc: 'Our heavy-capacity FARANA mobile cranes excel in loading, unloading, and site-to-site travel with massive hook weight loads. Optimal for steel framework erections and municipal girder placements.',
      capacity: '15-ton to 25-ton high clearance rigs',
      image: '/src/assets/images/Farana.png',
      icon: <Settings className="w-6 h-6 text-white" />,
      features: [
        'Move loads directly on wheels (Pick & Carry)',
        'Telescopic boom reach up to 70 feet',
        'Built-in electronic Safe Load Indicators (SLI)',
        'High torque engines with outstanding gradeability'
      ]
    }
  ];

  return (
    <div className="bg-brand-gray/30 min-h-screen pt-[80px] pb-20" id="services-overview-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Breadcrumb Navigation Segment */}
        <nav className="flex items-center gap-2 py-4 text-xs font-mono uppercase tracking-wider text-gray-500">
          <Link to="/" className="hover:text-brand-red transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          <span className="text-brand-black font-semibold">Services</span>
        </nav>

        {/* Header Hero Title */}
        <div className="text-left py-8 max-w-3xl border-b border-gray-200">
          <span className="text-xs font-mono uppercase tracking-widest text-brand-red font-bold block mb-2">Our Heavy Machinery</span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-brand-black tracking-tight" id="services-page-title">
            The Lifting <span className="text-brand-red">Fleet</span>
          </h1>
          <p className="mt-4 text-sm text-gray-650 leading-relaxed font-sans">
            We operate top-grade industrial mobile cranes suited for different load configurations. Equipped with durable safety controls and operated by certified professionals who prioritize site integrity.
          </p>
        </div>

        {/* Dynamic Detailed Service Column list */}
        <div className="mt-16 flex flex-col gap-12 sm:gap-16" id="services-main-list">
          {services.map((srv, idx) => (
            <div
              key={srv.id}
              className={`bg-white rounded-xl overflow-hidden border border-gray-150 shadow-sm hover:shadow-lg transition-all flex flex-col ${
                idx % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
              }`}
            >

              {/* Media Block */}
              <div className="lg:w-1/2 relative bg-brand-black/90 min-h-[300px] flex items-center justify-center">
                <div
                  className="absolute inset-0 bg-cover bg-center opacity-70"
                  style={{ backgroundImage: `url('${srv.image}')` }}
                />

                {/* Visual Accent Badge */}
                <div className="absolute top-6 left-6 z-15">
                  <span className="px-3 py-1.5 bg-brand-yellow text-brand-black font-extrabold text-xs tracking-wider rounded font-mono uppercase shadow-md border border-brand-black/15">
                    {srv.id.toUpperCase()} SERIES
                  </span>
                </div>
              </div>

              {/* Text Block */}
              <div className="lg:w-1/2 p-8 sm:p-12 flex flex-col justify-between gap-8">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-black leading-tight tracking-tight">{srv.name}</h2>
                  <span className="text-xs font-mono uppercase text-brand-red tracking-wider font-bold block mt-1.5">{srv.capacity}</span>
                  <p className="text-sm font-semibold text-gray-500 font-sans leading-relaxed mt-4">{srv.tagline}</p>
                  <p className="text-sm text-gray-600 font-sans leading-relaxed mt-3">{srv.desc}</p>

                  {/* Bullet Spec Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
                    {srv.features.map((feat, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-gray-550 font-sans">
                        <span className="text-brand-yellow font-bold text-base leading-none">•</span>
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Learn more actions */}
                <div className="flex items-center gap-4">
                  <Link
                    to={`/services/${srv.id}`}
                    className="px-6 py-3 bg-brand-black text-brand-yellow hover:text-white font-extrabold text-xs uppercase tracking-wider rounded transition-colors shadow border border-brand-yellow"
                  >
                    View Technical Specs
                  </Link>
                  <Link
                    to={`/contact?service=${srv.id}`}
                    className="px-6 py-3 bg-brand-yellow hover:bg-brand-yellow-hover text-brand-black font-extrabold text-xs uppercase tracking-wider rounded transition-all active:scale-95 text-center"
                  >
                    Get a Quote
                  </Link>
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* Standby Crew disclaimer block */}
        <div className="mt-16 bg-brand-black text-white p-8 rounded-xl border border-white/10 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="absolute top-0 inset-x-0 h-1 bg-brand-yellow" />
          <div className="flex items-start gap-4">
            <div className="bg-brand-yellow text-brand-black p-3 rounded-lg flex-shrink-0 mt-1">
              <HelpCircle className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-white text-lg font-bold">Unsure which crane model matches your lifting cargo?</h3>
              <p className="text-xs text-gray-400 font-sans max-w-xl mt-1.5 leading-relaxed">
                Provide us with basic details about the load weight and horizontal clearance distances on our quote panel. Our heavy rigging engineer will formulate a customized lift diagram and select the perfect crane model.
              </p>
            </div>
          </div>
          <Link
            to="/contact"
            className="flex-shrink-0 py-3 px-6 bg-brand-yellow text-brand-black font-extrabold text-xs uppercase tracking-wider rounded hover:bg-brand-yellow-hover active:scale-95 transition-all text-center"
          >
            Ask our Engineers
          </Link>
        </div>

      </div>
    </div>
  );
}
