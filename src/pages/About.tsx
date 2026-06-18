import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ChevronRight, ArrowRight, ShieldCheck, UserCheck, Activity, 
  MapPin, Milestone, Sparkles, Building, Landmark, Award
} from 'lucide-react';

const VALUES_CARDS = [
  {
    title: 'Safety First',
    desc: 'Strict adherence to crane load ratings, routine rigging checks, and quarterly equipment load certifications. We guarantee zero cutting corners.',
    icon: <ShieldCheck className="w-5 h-5 text-brand-red animate-pulse" />
  },
  {
    title: 'Customer-Centric',
    desc: 'Understanding that factory layouts and chemical piping lines are complex. We formulate safe lifting grids tailored to your exact payload.',
    icon: <UserCheck className="w-5 h-5 text-brand-red" />
  },
  {
    title: 'Reliability & Punctuality',
    desc: 'Timely mobilization is our pride. Our standby crane crews and drivers are dispatched early to guarantee arrival on or before schedule.',
    icon: <Activity className="w-5 h-5 text-brand-red" />
  },
  {
    title: 'Continuous Innovation',
    desc: 'Graduating to higher-tonnage FARANA pick-and-carry series with electronic Safe Load Indicators (SLI) to handle modern heavy architectures.',
    icon: <Sparkles className="w-5 h-5 text-brand-red" />
  }
];

const TIMELINE_STEPS = [
  {
    year: '2015',
    title: 'Company Founded',
    desc: 'Started operations in Valsad GIDC with a single used mobile hydra crane serving small plastic mills.'
  },
  {
    year: '2017',
    title: 'First HYDRA Acquisition',
    desc: 'Expanded to a higher tonnage Escorts crane series, unlocking heavy chemical piping shifts in Pardi.'
  },
  {
    year: '2019',
    title: 'FARANA Fleet Expansion',
    desc: 'Purchased our first pick-and-carry FARANA F-15 rig, offering moving heavy payloads across masonry yards.'
  },
  {
    year: '2022',
    title: '100+ Corporate Clients Milestone',
    desc: 'Signed regular lifting framework contracts with leading infrastructure developers and structural builders.'
  },
  {
    year: '2024',
    title: 'Industry Safety Recognition',
    desc: 'Certified for premium safety compliance by corporate audit organizations in South Gujarat.'
  }
];

export default function About() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-white min-h-screen pt-[80px] pb-20" id="about-us-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb Navigation Segment */}
        <nav className="flex items-center gap-2 py-4 text-xs font-mono uppercase tracking-wider text-gray-500">
          <Link to="/" className="hover:text-brand-red transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          <span className="text-brand-black font-semibold">About Company</span>
        </nav>

        {/* 1. Header Area with backup background image cover */}
        <div 
          className="relative rounded-xl overflow-hidden py-16 px-6 sm:px-10 bg-brand-black text-white mt-4 border-b-4 border-brand-yellow"
          id="about-hero"
        >
          {/* Background overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-brand-black via-brand-black/85 to-transparent z-10" />
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-40 pointer-events-none"
            style={{ backgroundImage: "url('/src/assets/images/fleet_crane_road_1781700201838.jpg')" }}
          />
          <div className="relative z-20 max-w-2xl text-left">
            <span className="text-xs font-mono uppercase tracking-widest text-[#FFD700] font-bold block mb-1">Our Journey</span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Lifting South Gujarat <br/>
              With <span className="text-[#FFD700]">Integrity</span> Since 2015
            </h1>
            <p className="mt-4 text-sm sm:text-base text-gray-300 leading-relaxed font-sans">
              Founded over a decade ago with a simple focus on safe operations, Diya Crane Service has grown into a leading mobile crane provider in Valsad, Pardi, Gundlav, and adjacent GIDC belts.
            </p>
          </div>
        </div>

        {/* 2. Core Business Story Column section */}
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-12 gap-12" id="about-story-container">
          
          {/* Left Block: Narrative */}
          <div className="lg:col-span-7 flex flex-col justify-center gap-6">
            <span className="text-xs font-mono uppercase tracking-widest text-brand-red font-bold leading-none block">Our Foundation</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-black tracking-tight leading-tight">
              Punctual Operations built on Uncompromised Rig Standards
            </h2>
            <div className="text-sm text-gray-600 font-sans leading-relaxed flex flex-col gap-4">
              <p>
                In the busy industrial landscape of South Gujarat, logistics schedules are highly demanding. Delaying heavy machinery transfers or piping assemblies by even an hour can ripple into substantial financial down-time losses. Recognizing this, Diya Crane Service was built with a fundamental priority: <strong>supreme punctuality.</strong>
              </p>
              <p>
                We maintain our own private workshop facilities in Valsad to carry out intensive preventive mechanical checks on our complete HYDRA Escort and FARANA pick-and-carry series. If a crane part shows mild wear, it is swapped immediately. This meticulous focus restricts field breakdown rates to practically zero.
              </p>
              <p>
                Today, our operations span major manufacturing clusters, delivering transformer upgrades, concrete girder transfers, masonry lifting hooks, and textile lathe positioning with perfect safety records.
              </p>
            </div>
          </div>

          {/* Right Block: Founder/Owner highlight card */}
          <div className="lg:col-span-5 bg-brand-gray/40 rounded-xl border border-gray-150 p-6 flex flex-col justify-between gap-6 relative" id="founder-profile-card">
            <div className="absolute top-0 inset-x-0 h-1 bg-brand-yellow" />
            
            <div className="flex flex-col gap-4">
              <div className="h-68 bg-brand-black rounded-lg overflow-hidden relative flex items-center justify-center">
                <div 
                  className="absolute inset-0 bg-cover bg-center opacity-70 pointer-events-none" 
                  style={{ backgroundImage: "url('/src/assets/images/DCSO.jpg')" }}
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-brand-black/90 to-transparent p-4 flex items-end">
                  <span className="text-[10px] uppercase font-mono tracking-widest text-brand-yellow">Proprietor Statement</span>
                </div>
              </div>
              
              <div>
                <cite className="block font-display font-extrabold text-lg text-brand-black not-italic leading-none">DCSO</cite>
                <span className="block text-xs text-gray-400 font-mono uppercase tracking-widest mt-1">Owner & Managing Director</span>
                <p className="mt-4 text-xs sm:text-sm italic text-gray-600 font-sans leading-relaxed">
                  "Safety is not an optional cost of business; it is the absolute baseline of our survival. Over 10+ years, our highest accomplishment is that every ground rig crew returned home safely at night, and every client payload reached its concrete base on time. Building trust, one lift at a time."
                </p>
              </div>
            </div>

            <div className="border-t border-gray-200/80 pt-4 flex items-center gap-2 text-brand-red font-display font-extrabold text-xs uppercase tracking-wider">
              <Award className="w-5 h-5 text-brand-yellow stroke-[2.5]" />
              <span>Safety Guaranteed Rig Master Command</span>
            </div>
          </div>

        </div>

        {/* 3. Horizontal Journey Timeline */}
        <div className="py-20 border-t border-b border-gray-100 mt-20" id="about-timeline">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-brand-red uppercase font-mono text-xs tracking-widest font-black block mb-2">Our Milestones</span>
            <h2 className="text-3xl font-extrabold text-brand-black tracking-tight">
              A Decade of steady <span className="text-brand-red">Fleet Progress</span>
            </h2>
            <p className="mt-3 text-xs text-gray-500 font-sans">
              Tracing our progress from humble beginnings in Valsad to a dominant heavy industrial rental fleet.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {TIMELINE_STEPS.map((step, i) => (
              <div 
                key={i}
                className="bg-brand-gray/25 p-5 rounded-lg border border-gray-150 shadow-sm relative hover:-translate-y-1 transition-all"
              >
                <span className="block font-mono font-black text-3xl text-brand-red tracking-tight mb-2">
                  {step.year}
                </span>
                <h4 className="font-display font-extrabold text-sm sm:text-base text-brand-black leading-tight tracking-tight">
                  {step.title}
                </h4>
                <p className="text-xs text-gray-550 font-sans mt-2.5 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Brand Values GRID */}
        <div className="py-20" id="about-values">
          <div className="text-center max-w-xl mx-auto mb-14">
            <span className="text-brand-red uppercase font-mono text-xs tracking-widest font-black block mb-2">Our Pillars</span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-brand-black tracking-tight">
              Corporate Values
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {VALUES_CARDS.map((val, idx) => (
              <div 
                key={idx}
                className="bg-white p-6 rounded-lg border border-gray-150 shadow-sm hover:shadow-md transition-all flex items-start gap-4"
              >
                <div className="p-3 bg-brand-gray rounded flex-shrink-0">
                  {val.icon}
                </div>
                <div>
                  <h4 className="font-display font-bold text-base text-brand-black leading-none">{val.title}</h4>
                  <p className="text-xs sm:text-sm text-gray-550 font-sans mt-2.5 leading-relaxed">
                    {val.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Last CTA line */}
        <div className="mt-10 text-center max-w-lg mx-auto" id="about-final-cta">
          <h4 className="text-lg font-bold text-brand-black">Interested in joining hands or setting up a corporate lease?</h4>
          <p className="text-xs text-gray-500 font-sans mt-2">Get quick custom pricing blueprints from our engineers.</p>
          <Link
            to="/contact"
            className="mt-5 inline-flex items-center gap-1.5 px-6 py-3 bg-brand-yellow hover:bg-brand-yellow-hover text-brand-black font-extrabold text-xs uppercase tracking-wider rounded transition-all active:scale-95 shadow"
          >
            Contact Ground Rig Operations
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>
    </div>
  );
}
