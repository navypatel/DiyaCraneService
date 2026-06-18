export const BRAND_COLORS = {
  primaryYellow: '#FFD700', // Crimson and yellow
  primaryYellowHover: '#E5C100',
  accentRed: '#DC143C',
  bgBlack: '#1A1A1A',
  lightGray: '#F5F5F5',
  borderGray: '#E5E7EB',
};

export const NAVIGATION_LINKS = [
  { name: 'Home', path: '/' },
  { name: 'Services', path: '/services' },
  { name: 'About', path: '/about' },
  { name: 'Gallery', path: '/gallery' },
  { name: 'Contact', path: '/contact' },
];

export const SERVICE_DETAILS = {
  hydra: {
    slug: 'hydra',
    name: 'HYDRA Crane Service',
    tagline: 'Reliable Mobile Hydraulic Escort Cranes',
    description: `Our HYDRA cranes (commonly ranging from 12-ton to 15-ton and 18-ton capacities) are the workhorses of the South Gujarat industrial corridor. Features include stable articulation, durable boom structures, and excellent maneuverability in confined spaces. Ideal for factory maintenance, loading heavy machinery, and shifting materials on site.`,
    capacitySpecs: {
      capacity: '12 Tons to 18 Tons',
      height: 'Up to 55 Feet',
      reach: 'Up to 45 Feet horizontal',
      conditions: 'Dry, firm terrain with adequate overhead clearance',
      availability: '24/7 Support in Valsad, Vapi, Pardi, and Gundlav areas',
    },
    features: [
      '360-degree stability stabilizers for safe lifts',
      'Articulating chassis for ultra-tight turning radius',
      'High-grade steel multi-stage boom extensions',
      'Fully certified operators with safe rigging validation',
    ],
  },
  farana: {
    slug: 'farana',
    name: 'FARANA Crane Service',
    tagline: 'Heavy Lift and Pull Pick & Carry Cranes',
    description: `Our FARANA cranes (such as F-15, F-17, and F-20 models) offer specialized pick-and-carry capabilities where the crane can lift high weights and transport them across long distances within a yard. These units are highly favored for construction sites, steel structure installations, raw material handling, and bridge erections in Valsad and South Gujarat.`,
    capacitySpecs: {
      capacity: '15 Tons to 25 Tons',
      height: 'Up to 70 Feet',
      reach: 'Up to 58 Feet horizontal',
      conditions: 'Industrial yards, concrete platforms, graded construction terrains',
      availability: '24/7 Emergency and planned hires',
    },
    features: [
      'Pick & Carry capability — transport heavy cargo directly on wheels',
      'Advanced load momentary safety indicators (SLI)',
      'Rear wheel steering with high gradeability',
      'Industrial heavy duty heavy-duty fly jibs available',
    ],
  },
};

export const FAQ_LIST = [
  {
    question: "Do you provide crane services on short notice in Valsad?",
    answer: "Yes, we maintain standby crews and cranes in the South Gujarat and Valsad areas. Contact our hotline directly for 24/7 emergency support."
  },
  {
    question: "Are your crane operators licensed and safety certified?",
    answer: "Absolutely. Safety is our primary tenet. All Diya Crane Service operators undergo quarterly rigorous safety compliance checks, maintain valid heavy motor vehicle licenses, and are certified for specific crane classes."
  },
  {
    question: "What is the difference between HYDRA and FARANA crane series?",
    answer: "The primary difference lies in mobility and lifting dynamics. HYDRA cranes are standard mobile hydraulic cranes known for maneuvering tight structures. FARANA cranes are pick-and-carry mobile cranes that can lift a load and travel with it, offering higher capacities and longer horizontal boom reach."
  },
  {
    question: "How do you calculate crane rental charges?",
    answer: "Rental charges are determined based on the crane series (HYDRA vs FARANA), tonnage capacity, booking duration (hourly/daily/monthly shift basis), and distance to location from our Valsad base. We offer competitive quote matrices for long-term contract partners."
  }
];

export const TESTIMONIALS = [
  {
    id: 1,
    quote: "Diya Crane Service has been our lifting partner for our textile factory expansion in Pardi. Over 3 months of site works, their operators were punctual, reliable, and maintained supreme safety compliance.",
    name: "Rajesh Desai",
    company: "Desi Textiles Pvt. Ltd.",
    stars: 5,
  },
  {
    id: 2,
    quote: "Highly standard operations. Their FARANA crane operator carried out heavy steel structural shifting over tight corridors with surgical precision. 100% recommended crane vendor in Valsad.",
    name: "Vikram Shah",
    company: "Shah Structural Erectors",
    stars: 5,
  },
  {
    id: 3,
    quote: "Excellent 24/7 service. We had an emergency machine repair on a Sunday night at our Gundlav plant. Diya Crane sent their HYDRA 14T within 45 minutes, saving us thousands in down-time.",
    name: "Arvind Patel",
    company: "Gujarat Plastics Industries",
    stars: 5,
  }
];

export const GALLERY_CATEGORIES = ['All', 'HYDRA', 'FARANA'];

export const SEED_ENTRIES = [
  {
    id: "rec-1",
    projectName: "Atul Chemical Pipeline Shift",
    serviceType: "HYDRA",
    clientName: "Mr. Rajesh Patel",
    clientCompanyName: "Atul Ltd",
    location: "Atul, Valsad",
    dateOfOperation: "2026-06-10",
    timeOfOperation: "09:30",
    shiftEndTime: "15:30",
    duration: 6,
    amount: 18000,
    notes: "Pipeline assembly shift. Safe lift completed with dual rigging.",
    createdAt: "2026-06-10T10:00:00.000Z",
    updatedAt: "2026-06-10T11:00:00.000Z",
    status: "Active"
  },
  {
    id: "rec-2",
    projectName: "Gundlav GI Truss Installs",
    serviceType: "FARANA",
    clientName: "Mr. Ketan Mehta",
    clientCompanyName: "Shree Rama Builders",
    location: "Gundlav GIDC",
    dateOfOperation: "2026-06-12",
    timeOfOperation: "08:00",
    shiftEndTime: "18:00",
    duration: 10,
    amount: 32000,
    notes: "Erection of 6 GI Roof Trusses. FARANA F-17 used with boom extension.",
    createdAt: "2026-06-12T12:00:00.000Z",
    updatedAt: "2026-06-12T12:00:00.000Z",
    status: "Active"
  },
  {
    id: "rec-3",
    projectName: "Pardi Power Substation Upgrade",
    serviceType: "HYDRA",
    clientName: "Mr. Navneet Shah",
    clientCompanyName: "GE T&D India",
    location: "Pardi, Valsad",
    dateOfOperation: "2026-06-14",
    timeOfOperation: "13:45",
    shiftEndTime: "17:45",
    duration: 4,
    amount: 15000,
    notes: "Transformer swap. Heavy-lift safety clearances validated prior to maneuver.",
    createdAt: "2026-06-14T14:00:00.000Z",
    updatedAt: "2026-06-14T14:30:00.000Z",
    status: "Active"
  },
  {
    id: "rec-4",
    projectName: "Valsad Overbridge Girder Yard Shifting",
    serviceType: "FARANA",
    clientName: "Mr. Manish Solanki",
    clientCompanyName: "L&T Infrastructure",
    location: "Valsad Halar Road",
    dateOfOperation: "2026-06-16",
    timeOfOperation: "21:00",
    shiftEndTime: "05:00",
    duration: 8,
    amount: 45000,
    notes: "Night operations shift. Shifting 3 girder slabs to concrete beds.",
    createdAt: "2026-06-16T22:00:00.000Z",
    updatedAt: "2026-06-16T22:00:00.000Z",
    status: "Active"
  }
];

export const SEED_ENQUIRIES = [
  {
    id: "enq-1",
    name: "Manish Solanki",
    email: "manish.s@solarfield.com",
    phone: "9824996999",
    service: "FARANA",
    projectDetails: "Need 20T FARANA crane for unloading machine containers inside factory shed from June 24th.",
    submissionDate: "2026-06-11T11:20:00.000Z",
    status: "New"
  },
  {
    id: "enq-2",
    name: "Ketan Mehta",
    email: "kmehta@mehtaconstruction.co.in",
    phone: "9124455823",
    service: "HYDRA",
    projectDetails: "General steel truss structure setup in Pardi. Estimate required for 3 days of booking.",
    submissionDate: "2026-06-15T15:40:00.000Z",
    status: "In Progress"
  },
  {
    id: "enq-3",
    name: "Ramesh Bhai",
    email: "ramesh@suratceramics.net",
    phone: "9879051632",
    service: "HYDRA",
    projectDetails: "Need regular crane for shifting raw clay bags in GIDC area.",
    submissionDate: "2026-06-16T09:12:00.000Z",
    status: "Closed"
  }
];
