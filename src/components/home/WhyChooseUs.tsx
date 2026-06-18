import React from 'react';
import { ShieldAlert, Compass, UserCheck, PhoneCall, Award, MapPin } from 'lucide-react';

export default function WhyChooseUs() {
  const benefits = [
    {
      icon: <ShieldAlert className="w-6 h-6 text-brand-red" />,
      title: 'Safety First Culture',
      desc: 'All lifting rigs are thoroughly load-tested, and operations are run in adherence to strict safety margins. No shortcuts, ever.'
    },
    {
      icon: <Compass className="w-6 h-6 text-brand-red" />,
      title: '99.9% Punctual Mobilization',
      desc: 'We respect industrial schedules. Our standby crews ensure cranes are on site on or before the requested shift hour.'
    },
    {
      icon: <UserCheck className="w-6 h-6 text-brand-red" />,
      title: 'Quarterly Certified Operators',
      desc: 'Our ground operators maintain verified licenses and pass regular rigging and safety-dynamics assessment tests.'
    },
    {
      icon: <PhoneCall className="w-6 h-6 text-brand-red" />,
      title: '24/7 Breakdown Dispatch',
      desc: 'Got an emergency lift at midnight? Our dispatch desk works round the clock to send nearby mobile rigs.'
    },
    {
      icon: <Award className="w-6 h-6 text-brand-red" />,
      title: '10+ Years Valsad Credibility',
      desc: 'Operating with premium local corporate contractors, chemical mills, and masonry yards since 2015.'
    },
    {
      icon: <MapPin className="w-6 h-6 text-brand-red" />,
      title: 'GIDC Yard Proximity',
      desc: 'Our yard is strategically located right in the South Gujarat corridor, cutting down mobilization costs significantly.'
    }
  ];

  return (
    <section id="why-choose-us" className="py-20 bg-brand-gray/40 relative">
      <div className="absolute inset-0 bg-[radial-gradient(#ffd7000c_2px,transparent_2px)] [background-size:32px_32px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Block */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-brand-red uppercase font-mono text-xs tracking-widest font-black block mb-2">Unmatched Strength</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-black tracking-tight" id="why-choose-section-heading">
            Building Commercial Trust, <span className="text-brand-red">One Lift</span> at a Time
          </h2>
          <p className="mt-4 text-sm text-gray-500 font-sans">
            Whether doing simple machinery shifts or complex civil erections, we bring decades of certified strength.
          </p>
        </div>

        {/* 3x2 Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="why-choose-cards-container">
          {benefits.map((item, i) => (
            <div 
              key={i}
              className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-all hover:-translate-y-1 border border-gray-150 relative overflow-hidden group"
            >
              <div className="absolute top-0 left-0 w-1.5 h-full bg-brand-yellow group-hover:bg-brand-red transition-colors" />
              
              <div className="flex items-start gap-4">
                <div className="p-3 bg-brand-gray rounded-md flex-shrink-0 group-hover:bg-brand-yellow/10 transition-colors">
                  {item.icon}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-brand-black font-display tracking-tight leading-snug group-hover:text-brand-red transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-550 leading-relaxed font-sans mt-2">
                    {item.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
