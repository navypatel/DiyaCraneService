import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ChevronRight, Phone, Mail, MapPin, MessageSquare, Landmark, 
  MapPin as MapIcon, ShieldCheck, Clock 
} from 'lucide-react';
import ContactForm from '../components/forms/ContactForm';

export default function Contact() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-brand-gray/30 pt-[80px] min-h-screen pb-20" id="contact-us-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb Navigation Segment */}
        <nav className="flex items-center gap-2 py-4 text-xs font-mono uppercase tracking-wider text-gray-500">
          <Link to="/" className="hover:text-brand-red transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          <span className="text-brand-black font-semibold">Contact Operations</span>
        </nav>

        {/* 1. Header Banner */}
        <div className="text-left py-8 max-w-2xl border-b border-gray-200 mb-12">
          <span className="text-xs font-mono uppercase tracking-widest text-brand-red font-bold block mb-2">Quotation Dispatch Desk</span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-brand-black tracking-tight" id="contact-page-heading">
            Connect <span className="text-brand-red">With Us</span>
          </h1>
          <p className="mt-4 text-sm text-gray-655 font-sans leading-relaxed">
            Reach our dispatch operators 24/7 for heavy equipment bookings, emergency roadside breakdowns, GIDC textile layout inspections, or construction crane contract inquiries.
          </p>
        </div>

        {/* 2. Structured Dual Grid (Left Column Form, Right Column Info/Map) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start" id="contact-main-grid">
          
          {/* Left Column: Form component (Col-7) */}
          <div className="lg:col-span-7">
            <ContactForm />
          </div>

          {/* Right Column: Contact info cards + Maps (Col-5) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* Direct Line Cards frame */}
            <div className="bg-white p-6 rounded-xl border border-gray-150 shadow-sm relative overflow-hidden flex flex-col gap-5">
              <div className="absolute top-0 inset-x-0 h-1 bg-brand-yellow" />
              
              <h3 className="text-base font-extrabold text-brand-black tracking-tight font-display uppercase font-mono">
                Direct Communication Channels
              </h3>

              <div className="flex flex-col gap-4">
                
                {/* Channel 1: Phone */}
                <a 
                  href="tel:+919824996999" 
                  className="flex items-start gap-3.5 p-3 hover:bg-brand-gray rounded-lg transition-colors group"
                >
                  <div className="p-3 bg-brand-yellow/15 text-brand-black rounded-lg group-hover:bg-brand-yellow transition-colors">
                    <Phone className="w-5 h-5 text-brand-black" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-mono text-gray-400 tracking-wider font-semibold leading-none mb-1">Ground Dispatch</span>
                    <span className="text-sm font-extrabold text-brand-black font-sans tracking-tight group-hover:text-brand-red">+91 98249 96999</span>
                    <span className="text-[11px] text-gray-500 font-sans mt-0.5 leading-none">Standard calling rates apply. 24/7 support.</span>
                  </div>
                </a>

                {/* Channel 2: WhatsApp */}
                <a 
                  href="https://wa.me/919824996999?text=Hello%20Diya%20Crane%20Service%2C%20I%20would%2520like%2520to%252520enquire%252520about%252520crane%252520rentals."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3.5 p-3 hover:bg-brand-gray rounded-lg transition-colors group"
                >
                  <div className="p-3 bg-green-50 text-green-600 rounded-lg group-hover:bg-green-600 group-hover:text-white transition-colors">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-mono text-gray-400 tracking-wider font-semibold leading-none mb-1">WhatsApp Chat</span>
                    <span className="text-sm font-extrabold text-brand-black font-sans tracking-tight group-hover:text-green-600">Quick WhatsApp Enquiry</span>
                    <span className="text-[11px] text-gray-500 font-sans mt-0.5 leading-none">Instant responses on mobilizations.</span>
                  </div>
                </a>

                {/* Channel 3: Email */}
                <a 
                  href="mailto:info@diyacraneservice.com" 
                  className="flex items-start gap-3.5 p-3 hover:bg-brand-gray rounded-lg transition-colors group"
                >
                  <div className="p-3 bg-brand-gray text-gray-600 rounded-lg group-hover:bg-brand-black group-hover:text-white transition-colors">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-mono text-gray-400 tracking-wider font-semibold leading-none mb-1">Corporate Mail desk</span>
                    <span className="text-sm font-extrabold text-brand-black font-sans tracking-tight group-hover:text-brand-red">info@diyacraneservice.com</span>
                    <span className="text-[11px] text-gray-500 font-sans mt-0.5 leading-none">Lease terms and contract paperwork.</span>
                  </div>
                </a>

              </div>

            </div>

            {/* GIDC Address & Google Map iframe embed (Valsad, Gujarat) */}
            <div className="bg-white p-6 rounded-xl border border-gray-150 shadow-sm relative overflow-hidden flex flex-col gap-4">
              <div className="absolute top-0 inset-x-0 h-1 bg-brand-red" />
              
              <div className="flex items-start gap-3">
                <div className="p-2.5 bg-brand-gray rounded-md flex-shrink-0 mt-0.5">
                  <MapPin className="w-5 h-5 text-brand-red" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-mono uppercase tracking-widest text-brand-red font-black">Lifting Yard Address</span>
                  <p className="text-xs sm:text-sm text-brand-black font-sans font-medium mt-1 leading-relaxed">
                    Chanvai road, near Ambaji tample, Parnera, Gujarat 396020
                  </p>
                </div>
              </div>

              {/* Google Maps Responsive embed */}
              <div className="w-full h-[220px] rounded-lg border border-gray-200 overflow-hidden relative shadow bg-gray-50 mt-2">
                <iframe
                  title="Diya Crane Service Valsad Location Map"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d119799.30058866384!2d72.84646194770281!3d20.599187310574044!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be0cf2ecfcffa91%3A0x6bba847c1fbb4ef0!2sValsad%2C%20Gujarat!5e0!3m2!1sen!2sin!4v1718500000000!5m2!1sen!2sin"
                  className="absolute inset-0 w-full h-full border-0"
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
