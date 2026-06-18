import React, { useEffect, useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { 
  ChevronRight, ArrowRight, ShieldCheck, Mail, PhoneCall, HelpCircle, 
  MapPin, HelpCircle as FaqIcon, CheckCircle2, ChevronDown, Landmark, 
  Layers, Settings, Hammer, Compass, AlertTriangle, CheckSquare
} from 'lucide-react';
import { SERVICE_DETAILS, FAQ_LIST } from '../lib/constants';

// Step descriptions for crane mobilization
const PROCESS_STEPS = [
  {
    title: 'Initial Consultation',
    desc: 'Reviewing customer cargo weights, radius, and elevation challenges over call or email.',
    icon: <PhoneCall className="w-5 h-5 text-brand-black" />
  },
  {
    title: 'Site Assessment',
    desc: 'Inspecting ground gradient soils, overhead cables, and entry clearance corridors.',
    icon: <Compass className="w-5 h-5 text-brand-black" />
  },
  {
    title: 'Quote & Booking',
    desc: 'Providing flat hour-shifts rates or contract indices followed by rig dispatch reservation.',
    icon: <CheckSquare className="w-5 h-5 text-brand-black" />
  },
  {
    title: 'Equipment Delivery',
    desc: 'Mobilizing the certified crane series and matching rigging hooks to the site on schedule.',
    icon: <Layers className="w-5 h-5 text-brand-black" />
  },
  {
    title: 'Operation & Safety',
    desc: 'Setting stabilizing pads, completing structural hooks, and safe lifting execution.',
    icon: <ShieldCheck className="w-5 h-5 text-brand-black" />
  },
  {
    title: 'Completion & Farewell',
    desc: 'Lifting completion, loading accessory gears back, and final invoice checks on site.',
    icon: <CheckCircle2 className="w-5 h-5 text-brand-black" />
  }
];

export default function ServiceDetail() {
  const { serviceSlug } = useParams<{ serviceSlug: string }>();
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [serviceSlug]);

  // Validate path slug
  const slug = serviceSlug?.toLowerCase();
  if (slug !== 'hydra' && slug !== 'farana') {
    return <Navigate to="/services" replace />;
  }

  const detail = SERVICE_DETAILS[slug as 'hydra' | 'farana'];

  // Accordion toggle helper
  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  const serviceMockImages = {
    hydra: [
      { id: 1, title: 'HYDRA Crane heavy pipe lift', location: 'Atul Chemical Yard' },
      { id: 2, title: 'HYDRA 14T shifting factory lathe', location: 'Pardi GIDC' },
      { id: 3, title: 'HYDRA structural panel rigging', location: 'Valsad Halar Road' }
    ],
    farana: [
      { id: 1, title: 'FARANA 18T pick-and-carry girders', location: 'Valsad Overbridge' },
      { id: 2, title: 'FARANA truss erection task', location: 'Gundlav Industrial Sheds' },
      { id: 3, title: 'Farana heavy cargo transport shift', location: 'Vapi GIDC Yard' }
    ]
  };

  const currentGalleryPreviews = serviceMockImages[slug as 'hydra' | 'farana'];

  return (
    <div className="bg-white min-h-screen pt-[80px] pb-20" id="service-specific-detail-page">
      
      {/* 1. Header Banner & Title */}
      <div 
        className="w-full relative py-16 sm:py-24 bg-brand-black text-white overflow-hidden border-b-4 border-brand-yellow"
        id="service-detail-banner"
      >
        {/* Gradients */}
        <div className="absolute inset-0 bg-gradient-to-r from-brand-black via-brand-black/90 to-transparent z-10" />
        <div className="absolute inset-0 bg-[radial-gradient(#ffd7000e_1.5px,transparent_1.5px)] [background-size:24px_24px] pointer-events-none" />
        
        {/* Placeholder image background */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30 pointer-events-none"
          style={{ backgroundImage: `url('/public/images/services/${slug}-hero.jpg')` }}
        />

        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-20 flex flex-col items-start">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 mb-6 text-[10px] font-mono uppercase tracking-wider text-gray-400">
            <Link to="/" className="hover:text-brand-yellow transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3 text-gray-500" />
            <Link to="/services" className="hover:text-brand-yellow transition-colors">Services</Link>
            <ChevronRight className="w-3 h-3 text-gray-500" />
            <span className="text-white font-semibold">{slug.toUpperCase()} Fleet</span>
          </nav>

          <span className="px-3 py-1 bg-brand-yellow text-brand-black font-extrabold text-[10px] font-mono tracking-widest rounded mb-3 uppercase">
            {detail.capacitySpecs.capacity}
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight" id="service-title-display">
            {detail.name}
          </h1>
          <p className="mt-4 text-base sm:text-lg text-gray-300 max-w-2xl font-sans font-medium">
            {detail.tagline}
          </p>
        </div>
      </div>

      {/* 2. Core Specification Tables & Paragraph description */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left: Specifications Table (Col-5) */}
          <div className="lg:col-span-5 flex flex-col gap-5">
            <div className="bg-brand-gray/50 rounded-xl border border-gray-150 p-6 shadow-sm overflow-hidden relative">
              <div className="absolute top-0 inset-x-0 h-1 bg-brand-red" />
              
              <h3 className="text-base font-extrabold text-brand-black tracking-tight mb-4 uppercase font-mono">
                Fleet Specifications Table
              </h3>

              <div className="flex flex-col text-xs font-sans divide-y divide-gray-200">
                <div className="py-3 flex justify-between items-center gap-4">
                  <span className="text-gray-500 uppercase font-mono tracking-wider font-semibold">Tonnage Capacities</span>
                  <span className="text-brand-black font-extrabold font-display">{detail.capacitySpecs.capacity}</span>
                </div>
                <div className="py-3 flex justify-between items-center gap-4">
                  <span className="text-gray-500 uppercase font-mono tracking-wider font-semibold">Maximum Elevation</span>
                  <span className="text-brand-black font-extrabold font-display">{detail.capacitySpecs.height}</span>
                </div>
                <div className="py-3 flex justify-between items-center gap-4">
                  <span className="text-gray-500 uppercase font-mono tracking-wider font-semibold">Horizontal Radius</span>
                  <span className="text-brand-black font-extrabold font-display">{detail.capacitySpecs.reach}</span>
                </div>
                <div className="py-3 flex justify-between items-start gap-4 flex-col sm:flex-row sm:items-center">
                  <span className="text-gray-500 uppercase font-mono tracking-wider font-semibold">Pre-conditions</span>
                  <span className="text-brand-black font-bold font-sans text-right">{detail.capacitySpecs.conditions}</span>
                </div>
                <div className="py-3 flex justify-between items-start gap-4 flex-col sm:flex-row sm:items-center">
                  <span className="text-gray-500 uppercase font-mono tracking-wider font-semibold">Area Availability</span>
                  <span className="text-brand-black font-bold font-sans text-right">{detail.capacitySpecs.availability}</span>
                </div>
              </div>
            </div>

            {/* Safety Assurance list card */}
            <div className="bg-brand-black text-white rounded-xl p-6 border border-white/10 flex flex-col gap-4">
              <div className="flex items-center gap-2.5 text-brand-yellow font-bold text-sm tracking-tight font-display">
                <ShieldCheck className="w-5 h-5 text-brand-yellow stroke-[2]" />
                <span>Our Uncompromised Safety Pledge</span>
              </div>
              <p className="text-xs text-gray-300 font-sans leading-relaxed">
                Diya Crane Service operators execute lifting strictly in compliance with crane rating charts. Safe Load Limiters are calibrated quarterly to protect load shafts and operator safety.
              </p>
            </div>
          </div>

          {/* Right: Technical Explanation & Bullets (Col-7) */}
          <div className="lg:col-span-7 flex flex-col justify-between gap-6 pr-2">
            <div>
              <h3 className="text-2xl font-extrabold text-brand-black tracking-tight" id="service-desc-heading">
                Operational Load Handling Analysis
              </h3>
              <p className="text-sm text-gray-600 font-sans leading-relaxed mt-4">
                {detail.description}
              </p>
              <p className="text-sm text-gray-650 font-sans leading-relaxed mt-4">
                Operating heavy equipment requires careful attention to site variables. Our {slug.toUpperCase()} crane deployments undergo thorough inspections to verify site clearances and ground profiles prior to placing any heavy equipment on stabilizing jacks. This proactive oversight prevents shifts or listing incidents on dynamic construction terrains.
              </p>
              <p className="text-sm text-gray-650 font-sans leading-relaxed mt-4">
                For commercial builders and textile mill engineers in the Valsad and Pardi industrial GIDC networks, we offer flexible lease schedules. Call or email us to discuss daily shift outlines, monthly contracts, and emergency machinery swaps.
              </p>
            </div>

            <div className="mt-6">
              <h4 className="text-sm uppercase font-mono tracking-wider text-brand-red font-bold">Key Fleet Benefits</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                {detail.features.map((feat, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs text-gray-600 font-sans leading-snug">
                    <CheckCircle2 className="w-4.5 h-4.5 text-brand-yellow mt-0.5 flex-shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 3. 6-Step Process workflow segment */}
      <div className="bg-brand-gray/30 py-20 mt-20" id="service-detail-process-workflow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-brand-red uppercase font-mono text-xs tracking-widest font-black block mb-2">Our Process</span>
            <h2 className="text-3xl font-extrabold text-brand-black tracking-tight">
              Site Mobilization in <span className="text-brand-red">6 Clear Steps</span>
            </h2>
            <p className="mt-3 text-xs text-gray-500 font-sans">
              To guarantee total safety and on-time execution, our ground rigging teams trace a verified sequence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PROCESS_STEPS.map((step, idx) => (
              <div 
                key={idx}
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-150 transition-all hover:shadow-md relative overflow-hidden group"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-brand-yellow group-hover:bg-brand-red transition-all" />
                <span className="absolute top-4 right-4 text-3xl font-mono font-black text-gray-100 group-hover:text-brand-yellow/30 transition-colors">
                  0{idx + 1}
                </span>

                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 bg-brand-yellow text-brand-black rounded-md flex-shrink-0">
                    {step.icon}
                  </div>
                  <h3 className="font-display font-extrabold text-sm sm:text-base text-brand-black leading-tight tracking-tight">
                    {step.title}
                  </h3>
                </div>

                <p className="text-xs text-gray-550 leading-relaxed font-sans">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* 4. Local Site visual preview grids */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-10 border-b border-gray-100 pb-5">
          <div>
            <span className="text-brand-red uppercase font-mono text-xs tracking-widest font-black block mb-1">Photo Evidence</span>
            <h3 className="text-2xl font-extrabold text-brand-black tracking-tight">
              {slug.toUpperCase()} Cranes in Action
            </h3>
          </div>
          <Link
            to="/gallery"
            className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-brand-red hover:text-brand-black hover:translate-x-1.5 transition-all w-fit"
          >
            Explore Complete Gallery
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentGalleryPreviews.map((pic) => (
            <div key={pic.id} className="group bg-brand-gray rounded-lg overflow-hidden border border-gray-200 relative">
              <div className="relative h-56 bg-brand-black/90">
                {/* Visual placeholder fallback logo */}
                <div className="absolute inset-0 bg-gradient-to-t from-brand-black/70 to-transparent z-10" />
                <div className="absolute inset-0 flex items-center justify-center font-mono text-xs text-white/20">
                  <span>{detail.name} Picture</span>
                </div>
              </div>
              <div className="p-4 relative bg-white border-t border-gray-100">
                <h4 className="text-xs font-bold text-brand-black font-display tracking-tight leading-tight block">
                  {pic.title}
                </h4>
                <span className="text-[10px] text-gray-400 font-sans block mt-1">
                  Location: {pic.location}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Akkordion */}
      <div className="bg-brand-gray/30 py-16 border-t border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-left mb-10">
            <h3 className="text-2xl font-extrabold text-brand-black tracking-tight">
              Frequently Asked Questions (FAQ)
            </h3>
            <p className="text-xs text-gray-500 font-sans mt-1">
              Quick guidelines about crane hire schedules and operator licensing in Valsad GIDC.
            </p>
          </div>

          <div className="flex flex-col gap-3" id="faq-accordions">
            {FAQ_LIST.map((faq, idx) => {
              const isExpanded = expandedFaq === idx;
              return (
                <div 
                  key={idx}
                  className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden"
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full text-left px-5 py-4 flex items-center justify-between gap-4 font-display font-semibold text-sm sm:text-base text-brand-black focus:outline-none"
                  >
                    <span className="flex items-center gap-2">
                      <HelpCircle className="w-4.5 h-4.5 text-brand-red flex-shrink-0" />
                      {faq.question}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-gray-400 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {isExpanded && (
                    <div className="px-5 pb-5 pt-1 border-t border-gray-100 text-xs sm:text-sm text-gray-600 font-sans leading-relaxed bg-brand-gray/20">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Final CTA panel */}
      <div className="max-w-5xl mx-auto px-4 mt-20 text-center">
        <h3 className="text-3xl font-extrabold text-brand-black tracking-tight">
          Ready to Book our {slug.toUpperCase()} Fleet?
        </h3>
        <p className="text-sm text-gray-500 font-sans mt-3 max-w-lg mx-auto">
          Secure immediate or planned bookings across Valsad GIDC with customized billing options.
        </p>
        <Link
          to={`/contact?service=${slug}`}
          className="mt-6 inline-flex items-center gap-2 px-8 py-4 bg-brand-yellow hover:bg-brand-yellow-hover text-brand-black text-sm font-bold rounded shadow-md transform active:scale-95 transition-all text-center uppercase tracking-wider"
        >
          Book {slug.toUpperCase()} Shift Now
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

    </div>
  );
}
