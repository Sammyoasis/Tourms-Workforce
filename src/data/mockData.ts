/**
 * TOURMS AGRO-SOLUTIONS Mock Dataset
 * NOTE: All entries in this dataset represent structured demonstration data
 * prepared for UI/UX architectural verification and workflow validation.
 */

import {
  JobListing,
  OpportunityListing,
  InsightArticle,
  WorkerProfile,
  EmployerProfile,
  JobApplication,
  ModerationReport,
  SystemUser
} from '../types';

export const SAMPLE_JOBS: JobListing[] = [
  {
    id: 'job-001',
    title: 'Senior Agronomist — Commercial Cassava & Maize',
    organisation: 'Flourish Agri-Enterprises Ltd',
    employerId: 'emp-101',
    employerVerified: true,
    location: {
      state: 'Oyo',
      lga: 'Iseyin',
      farmSiteOrAddress: 'Kilometre 14, Iseyin-Oyo Road'
    },
    employmentType: 'Full-time',
    duration: 'Permanent (Subject to 3-month probation)',
    category: 'Crop Production',
    compensation: {
      type: 'range',
      amountMin: 350000,
      amountMax: 480000,
      currency: 'NGN',
      frequency: 'month',
      notes: 'Includes on-farm accommodation and health insurance allowance.'
    },
    summary:
      'Lead agronomic field operations, soil fertility management, planting schedules, and pest control regimes across 450 hectares of mechanized cassava and commercial maize.',
    responsibilities: [
      'Manage seedbed preparation, planting density, and crop calendar adherence.',
      'Develop Integrated Pest Management (IPM) protocols for fall armyworm and cassava mosaic disease.',
      'Supervise field tractor operators, chemical spray technicians, and seasonal weeding crews.',
      'Collect, record, and interpret soil moisture and yield trial telemetry.',
      'Coordinate with the processing mill manager for timely harvest staging and haulage.'
    ],
    essentialRequirements: [
      'Minimum B.Agric / B.Sc in Agronomy, Crop Production, or related field.',
      'At least 4 years hands-on field experience managing commercial grain or root crop acreage.',
      'Demonstrated competence in calibrating tractor-mounted boom sprayers and seed drills.',
      'Willingness to reside on or within 15 km of the farm facility in Iseyin.'
    ],
    desirableQualifications: [
      'Experience with drip or furrow irrigation scheduling in the Guinea savannah zone.',
      'Valid Nigerian driving licence.'
    ],
    skills: [
      'Field Agronomy',
      'Integrated Pest Management',
      'Tractor Implement Calibration',
      'Yield Estimation',
      'Crew Supervision'
    ],
    applicationInstructions:
      'Submit your Tourms capability profile and attach your degree or diploma certificate.',
    deadline: '2026-11-28',
    postedDate: '2026-10-24',
    status: 'approved',
    priority: 'urgent',
    totalApplicationsCount: 14
  },
  {
    id: 'job-002',
    title: 'Poultry Farm Operations Supervisor (Layers & Broilers)',
    organisation: 'Savannah Crest Farms',
    employerId: 'emp-102',
    employerVerified: true,
    location: {
      state: 'Ogun',
      lga: 'Sagamu',
      farmSiteOrAddress: 'Simawa Agricultural Cluster, off Sagamu Expressway'
    },
    employmentType: 'Full-time',
    duration: '12 Months Renewable',
    category: 'Livestock',
    compensation: {
      type: 'fixed',
      amountMin: 220000,
      amountMax: 220000,
      currency: 'NGN',
      frequency: 'month',
      notes: 'Monthly performance bonus based on feed conversion ratio and mortality threshold.'
    },
    summary:
      'Supervise daily husbandry, biosecurity controls, ventilation, and flock nutrition across 3 automated deep-litter broiler houses and 2 battery cage layer units.',
    responsibilities: [
      'Enforce farm biosecurity protocols, foot-baths, and vehicular disinfection.',
      'Monitor daily water intake, feed consumption rates, and egg grading records.',
      'Execute routine vaccination schedules (Newcastle, Gumboro, Fowl Pox) under veterinary guidance.',
      'Manage mortalities disposal according to environmental compliance regulations.'
    ],
    essentialRequirements: [
      'HND or B.Sc in Animal Science / Animal Production.',
      '3+ years direct supervision experience in commercial poultry operations (>20,000 birds).',
      'Proven record maintaining broiler flock mortality under 4% to harvest.'
    ],
    desirableQualifications: [
      'Experience troubleshooting automated feed augers and nipple drinker lines.'
    ],
    skills: [
      'Poultry Husbandry',
      'Flock Vaccination',
      'Biosecurity Compliance',
      'Feed Conversion Tracking',
      'Egg Grading'
    ],
    applicationInstructions:
      'Apply with your verified livestock management history and past flock performance records.',
    deadline: '2026-11-20',
    postedDate: '2026-10-21',
    status: 'approved',
    totalApplicationsCount: 9
  },
  {
    id: 'job-003',
    title: 'Recirculating Aquaculture System (RAS) Hatchery Technician',
    organisation: 'Delta Aqua Blue Ventures',
    employerId: 'emp-103',
    employerVerified: false, // Transparent unverified badge
    location: {
      state: 'Delta',
      lga: 'Warri South',
      farmSiteOrAddress: 'Osubi Waterway Enclave'
    },
    employmentType: 'Full-time',
    duration: 'Indefinite',
    category: 'Fisheries & Aquaculture',
    compensation: {
      type: 'range',
      amountMin: 180000,
      amountMax: 250000,
      currency: 'NGN',
      frequency: 'month'
    },
    summary:
      'Manage broodstock conditioning, artificial hormone stripping, egg incubation, and fry nursing in a 50,000-fingerling monthly output catfish and tilapia hatchery.',
    responsibilities: [
      'Maintain water quality parameters: Dissolved Oxygen (DO), pH, Ammonia, and Nitrite.',
      'Conduct broodstock hypophysation and hormone preparation.',
      'Manage live Artemia culture and transition feeding to micro-pellets.',
      'Clean drum filters, UV sterilizers, and bio-filters on a strict preventive maintenance cycle.'
    ],
    essentialRequirements: [
      'ND/HND/B.Sc in Fisheries, Aquaculture, or Marine Biology.',
      'Minimum 2 years practical experience in African Catfish (Clarias gariepinus) artificial propagation.',
      'Proficiency in testing water chemistry using digital photometers or titration kits.'
    ],
    desirableQualifications: ['Experience managing biofloc or outdoor earthen nursery ponds.'],
    skills: [
      'Hatchery Management',
      'Water Chemistry Testing',
      'Broodstock Stripping',
      'Fingerling Grading',
      'Biofilter Maintenance'
    ],
    applicationInstructions:
      'Verified Tourms profiles will be prioritized during initial telephone screenings.',
    deadline: '2026-12-05',
    postedDate: '2026-10-26',
    status: 'approved',
    totalApplicationsCount: 6
  },
  {
    id: 'job-004',
    title: 'Tractor Fleet Operator & Maintenance Mechanic',
    organisation: 'Benue Food Basket Mechanization Hub',
    employerId: 'emp-104',
    employerVerified: true,
    location: {
      state: 'Benue',
      lga: 'Gboko',
      farmSiteOrAddress: 'Plot 8, Agricultural Industrial Zone'
    },
    employmentType: 'Contract',
    duration: '8-Month Planting & Harvest Contract (Nov 2026 - Jun 2027)',
    category: 'Farm Operations',
    compensation: {
      type: 'fixed',
      amountMin: 195000,
      amountMax: 195000,
      currency: 'NGN',
      frequency: 'month',
      notes: 'Overtime paid for weekend tillage operations during peak planting window.'
    },
    summary:
      'Operate modern 75–120 HP agricultural tractors equipped with disk ploughs, harrows, ridgers, and combine harvesters. Perform daily greasing and routine hydraulic checks.',
    responsibilities: [
      'Operate tractors safely for primary and secondary land preparation across contracted farm clusters.',
      'Perform pre-start inspections: oil levels, coolant, tire pressure, and PTO shaft connections.',
      'Diagnose and repair minor field breakdowns (hydraulic leaks, belt snaps, fuel blockage).',
      'Maintain tractor logbooks noting operating hours, diesel consumption, and hectares cleared.'
    ],
    essentialRequirements: [
      'Valid Trade Test Certificate (Mechanic / Agricultural Machinery) or NABTEB equivalent.',
      'Minimum 3 years verifiable tractor driving experience.',
      'Knowledge of local soil types and terrain conditions in the Middle Belt.'
    ],
    desirableQualifications: ['GPS guidance system operation experience.'],
    skills: [
      'Tractor Operation',
      'Disk Plough Rigging',
      'Hydraulic Troubleshooting',
      'Preventive Maintenance',
      'Hectare Tillage'
    ],
    applicationInstructions:
      'Practical driving and implement hitching assessment will be conducted at the Gboko hub.',
    deadline: '2026-11-15',
    postedDate: '2026-10-28',
    status: 'approved',
    priority: 'urgent',
    totalApplicationsCount: 22
  },
  {
    id: 'job-005',
    title: 'Grain Quality Assurance & Silo Operations Officer',
    organisation: 'Dawanau Agri-Storage Services',
    employerId: 'emp-105',
    employerVerified: true,
    location: {
      state: 'Kano',
      lga: 'Dawakin Tofa',
      farmSiteOrAddress: 'Dawanau Grain Terminal Access Road'
    },
    employmentType: 'Full-time',
    duration: 'Permanent',
    category: 'Processing',
    compensation: {
      type: 'range',
      amountMin: 280000,
      amountMax: 360000,
      currency: 'NGN',
      frequency: 'month'
    },
    summary:
      'Direct intake quality testing, moisture determination, aflatoxin screening, and aeration in a 20,000 MT steel grain silo facility storing sorghum, millet, and dry maize.',
    responsibilities: [
      'Draw representative grain core samples from incoming flatbed trucks.',
      'Operate digital grain moisture analyzers and test for broken grains, foreign matter, and weevil infestation.',
      'Manage phosphine fumigation cycles strictly complying with pesticide safety protocols.',
      'Control aeration fans and thermal monitoring cables to prevent grain caking or hot-spots.'
    ],
    essentialRequirements: [
      'B.Sc or HND in Food Science & Technology, Post-Harvest Technology, or Chemistry.',
      '3+ years experience in bulk grain storage or flour milling laboratory operations.',
      'Deep knowledge of SON (Standards Organisation of Nigeria) grain grading standards.'
    ],
    desirableQualifications: ['HACCP / ISO 22000 internal auditor qualification.'],
    skills: [
      'Moisture Testing',
      'Grain Sampling Protocols',
      'Silo Aeration Management',
      'Phosphine Fumigation',
      'Aflatoxin Screening'
    ],
    applicationInstructions:
      'Submit your application with proof of laboratory testing experience.',
    deadline: '2026-12-10',
    postedDate: '2026-10-29',
    status: 'approved',
    totalApplicationsCount: 8
  },
  {
    id: 'job-006',
    title: 'Cold-Chain Refrigerated Logistics Coordinator',
    organisation: 'FreshRoute Agro-Logistics',
    employerId: 'emp-106',
    employerVerified: true,
    location: {
      state: 'Plateau',
      lga: 'Jos South',
      farmSiteOrAddress: 'Bukuru Cold Hub'
    },
    employmentType: 'Full-time',
    duration: 'Indefinite',
    category: 'Logistics',
    compensation: {
      type: 'range',
      amountMin: 260000,
      amountMax: 340000,
      currency: 'NGN',
      frequency: 'month'
    },
    summary:
      'Coordinate temperature-controlled distribution of fresh horticulture (tomatoes, bell peppers, Irish potatoes) from Jos Plateau packhouses to Lagos and Abuja wholesale markets.',
    responsibilities: [
      'Dispatch and track refrigerated transit trucks using GPS and real-time temperature loggers.',
      'Ensure pre-cooling criteria are satisfied prior to container loading.',
      'Liaise with cooperative farmers on harvest packing windows to minimize transit delay.',
      'Manage transit claims, temperature excursions, and waybill sign-offs.'
    ],
    essentialRequirements: [
      'Bachelor degree in Logistics, Supply Chain Management, or Agricultural Economics.',
      '3 years logistics experience with perishable agricultural commodities.',
      'Proven understanding of cold chain temperature profiles (2°C - 8°C vs ambient).'
    ],
    desirableQualifications: ['Knowledge of major interstate transport corridors and transit security.'],
    skills: [
      'Cold Chain Monitoring',
      'Fleet Dispatch',
      'Perishable Handling',
      'Route Optimization',
      'Waybill Administration'
    ],
    applicationInstructions: 'Apply via Tourms Workforce.',
    deadline: '2026-12-01',
    postedDate: '2026-10-30',
    status: 'approved',
    totalApplicationsCount: 5
  },
  {
    id: 'job-007',
    title: 'Precision Agriculture Drone Pilot & Remote Sensing Specialist',
    organisation: 'AgroData Spatial Labs',
    employerId: 'emp-107',
    employerVerified: true,
    location: {
      state: 'Kaduna',
      lga: 'Zaria',
      farmSiteOrAddress: 'Research Road, Samaru'
    },
    employmentType: 'Full-time',
    duration: '2 Years Contract Renewable',
    category: 'Technology & Data',
    compensation: {
      type: 'range',
      amountMin: 400000,
      amountMax: 550000,
      currency: 'NGN',
      frequency: 'month'
    },
    summary:
      'Fly multispectral and RGB UAVs over plantation crops to calculate NDVI, canopy cover, weed infestations, and nitrogen deficiency maps for commercial estates.',
    responsibilities: [
      'Plan autonomous drone flight missions with terrain awareness.',
      'Process raw sensor data in photogrammetry suites (Pix4D, WebODM, QGIS).',
      'Generate prescription maps for variable rate fertilizer application.',
      'Maintain drone hardware, LiPo batteries, and multispectral sensors.'
    ],
    essentialRequirements: [
      'NCAA Remote Pilot Licence (RPL) or international equivalent.',
      'Demonstrated expertise in GIS software (QGIS/ArcGIS) and vegetation indices.',
      'Minimum 200 verifiable flight hours on fixed-wing or VTOL survey platforms.'
    ],
    desirableQualifications: ['Coding skills in Python for spatial raster data processing.'],
    skills: [
      'UAV Flight Operations',
      'Multispectral Imaging',
      'NDVI Processing',
      'QGIS / Spatial Mapping',
      'Prescription Mapping'
    ],
    applicationInstructions:
      'Include a sample orthomosaic or NDVI export link with your capability submission.',
    deadline: '2026-11-30',
    postedDate: '2026-10-25',
    status: 'approved',
    totalApplicationsCount: 4
  },
  // Pending queue job for Admin review
  {
    id: 'job-008',
    title: 'Cashew Processing Plant Shift Supervisor',
    organisation: 'Kwara Agro-Allied Exporters',
    employerId: 'emp-108',
    employerVerified: false,
    location: {
      state: 'Kwara',
      lga: 'Ogbondoroko / Asa',
      farmSiteOrAddress: 'Ilorin-Ajase Ipo Road'
    },
    employmentType: 'Full-time',
    duration: 'Full-time Permanent',
    category: 'Processing',
    compensation: {
      type: 'range',
      amountMin: 170000,
      amountMax: 210000,
      currency: 'NGN',
      frequency: 'month'
    },
    summary:
      'Manage raw cashew nut (RCN) steaming, mechanical shelling, peeling, grading, and vacuum packaging lines.',
    responsibilities: [
      'Supervise 60 shift line workers across grading and packaging sections.',
      'Ensure kernel whole-nut yield meets export specification (>80% intact).',
      'Audit machine sanitation and worker personal hygiene.'
    ],
    essentialRequirements: [
      'OND/HND in Mechanical Engineering or Food Technology.',
      '2 years factory supervisory experience in nut or seed processing.'
    ],
    desirableQualifications: ['Familiarity with CNSL (Cashew Nut Shell Liquid) safety protocols.'],
    skills: ['Factory Line Supervision', 'Cashew Grading', 'Sanitation Auditing', 'Shift Scheduling'],
    applicationInstructions: 'Apply through Tourms.',
    deadline: '2026-12-15',
    postedDate: '2026-10-31',
    status: 'awaiting_review', // Queued in admin review
    totalApplicationsCount: 0
  }
];

export const SAMPLE_OPPORTUNITIES: OpportunityListing[] = [
  {
    id: 'opp-001',
    title: 'FGN-NIRSAL Youth in Agribusiness Credit Facility 2026/2027',
    provider: 'NIRSAL Plc & Central Bank of Nigeria',
    providerVerified: true,
    category: 'Loan',
    description:
      'Single-digit concessionary loan facility (5% p.a.) tailored for registered agricultural entrepreneurs operating in grain, poultry, or oil palm value chains.',
    eligibility: [
      'Nigerian citizens aged 21 to 45 years.',
      'Registered agribusiness entity (CAC Certificate of Business Name or Limited Company).',
      'Verifiable farm site ownership or minimum 3-year registered land lease.',
      'Credit Bureau clean record.'
    ],
    benefits: [
      'Working capital financing up to ₦10,000,000.',
      '12-month moratorium before principal repayment begins.',
      'Guaranteed 50% credit risk cover by NIRSAL.'
    ],
    locationScope: 'All 36 States & FCT',
    deadline: '2026-12-31',
    sourceUrl: 'https://nirsal.com/agri-credit-scheme',
    status: 'published',
    verificationSource: 'Federal Gazette & NIRSAL Circular No. 2026/04',
    verifiedBy: 'Verification Officer T. Adeyemi',
    verifiedDate: '2026-09-15'
  },
  {
    id: 'opp-002',
    title: 'IITA Young Agricultural Research Fellowships 2027',
    provider: 'International Institute of Tropical Agriculture (IITA)',
    providerVerified: true,
    category: 'Fellowship',
    description:
      'Fully funded residential research fellowship at IITA Ibadan headquarters focusing on climate-resilient legume breeding, bio-fortification, and soil microbiome diagnostics.',
    eligibility: [
      'Enrolled or recently graduated MSc or PhD students in Agricultural Sciences.',
      'Proposal addressing drought tolerance in cowpea, soybean, or yam.',
      'Under 35 years of age at the time of submission.'
    ],
    benefits: [
      'Monthly living stipend of $1,200 (USD equivalent in NGN).',
      'Free residential accommodation inside the IITA Ibadan campus.',
      'Full access to genomics laboratories, greenhouses, and agronomy test plots.',
      'International publication cost sponsorship.'
    ],
    locationScope: 'West & Central Africa (Nigeria Host Station)',
    deadline: '2026-11-30',
    sourceUrl: 'https://www.iita.org/fellowships-2027',
    status: 'published',
    verificationSource: 'IITA Capacity Development Office Direct Verification',
    verifiedBy: 'Editorial Lead O. Danjuma',
    verifiedDate: '2026-08-20'
  },
  {
    id: 'opp-003',
    title: 'Ogun State Horticulture Modernization Grant Programme',
    provider: 'Ogun State Ministry of Agriculture & World Bank APPEALS',
    providerVerified: true,
    category: 'Grant',
    description:
      'Matching grants for smallholder tomato, chili pepper, and leafy vegetable farming clusters investing in solar-powered borehole irrigation systems.',
    eligibility: [
      'Registered cooperative group with a minimum of 10 active farmer members.',
      'Farmland located within Ogun State.',
      'Willingness to contribute 15% equity in community labor or materials.'
    ],
    benefits: [
      'Non-repayable equipment grant up to ₦7,500,000 per cooperative.',
      'Installation of solar pumping array and 5,000-litre elevated reservoir.',
      'Agronomic training and off-take linkages to Lagos wholesale markets.'
    ],
    locationScope: 'Ogun State (Sagamu, Odeda, Obafemi Owode, Yewa)',
    deadline: '2026-12-18',
    sourceUrl: 'https://ogunstate.gov.ng/agric-appeals-grant',
    status: 'published',
    verificationSource: 'Ogun State Ministry of Agriculture Bulletin',
    verifiedBy: 'Verification Desk',
    verifiedDate: '2026-10-02'
  },
  {
    id: 'opp-004',
    title: 'National Agricultural Seed Council (NASC) Certified Seed Inspector Training',
    provider: 'National Agricultural Seed Council',
    providerVerified: true,
    category: 'Training Programme',
    description:
      'Professional certification programme qualifying agricultural graduates as licensed private seed field inspectors and quality tags verifiers.',
    eligibility: [
      'B.Agric, B.Sc Botany, Crop Science, or related biological discipline.',
      'Passed basic seed testing methodology pre-test.',
      'Working laptop and basic digital record-keeping ability.'
    ],
    benefits: [
      'Accredited NASC Private Inspector Seal and Certificate.',
      'Listing on the National Seed Certification Directory.',
      'Job placement opportunities with commercial seed producers.'
    ],
    locationScope: 'Abuja Training Centre & Regional Zonal Offices',
    deadline: '2026-11-25',
    sourceUrl: 'https://seedcouncil.gov.ng/inspector-certification',
    status: 'published',
    verificationSource: 'NASC Official Notice',
    verifiedBy: 'Operations Lead',
    verifiedDate: '2026-10-10'
  },
  {
    id: 'opp-005',
    title: 'African Development Bank Agri-Pitch Competition 2026',
    provider: 'African Development Bank (AfDB) Enable Youth',
    providerVerified: true,
    category: 'Competition',
    description:
      'Pan-African agribusiness startup showcase awarding equity-free prize capital and acceleration support to tech-enabled post-harvest solutions.',
    eligibility: [
      'Founder must be an African citizen aged 18 to 35.',
      'Business must be incorporated and operating for at least 12 months.',
      'Demonstrated impact on farmer income or post-harvest preservation.'
    ],
    benefits: [
      'Top prize: $40,000 non-dilutive grant.',
      'Runner-up: $20,000.',
      'Intensive 2-week investor readiness bootcamp with venture mentors.'
    ],
    locationScope: 'Pan-African (Nigeria Applicants Eligible)',
    deadline: '2026-12-10',
    sourceUrl: 'https://afdb.org/agripitch-2026',
    status: 'published',
    verificationSource: 'AfDB Official Press Release',
    verifiedBy: 'Verification Desk',
    verifiedDate: '2026-09-30'
  },
  // Pending review opportunity
  {
    id: 'opp-006',
    title: 'Benue River Basin Soya Bean Cultivation Subvention',
    provider: 'Lower Benue River Basin Development Authority',
    providerVerified: false,
    category: 'Grant',
    description:
      'Subsidized input packages and land allocation for dry-season soya bean cultivation along irrigated riverbanks.',
    eligibility: [
      'Farming groups in Makurdi, Gwer, and Otukpo LGAs.',
      'Commitment to sell back grain to strategic grain reserves.'
    ],
    benefits: ['Subsidized seeds and fertilizer.', 'Direct canal water access.'],
    locationScope: 'Benue State',
    deadline: '2026-12-20',
    sourceUrl: 'https://benueriverbasin.gov.ng/soya-scheme',
    status: 'submitted'
  }
];

export const SAMPLE_INSIGHTS: InsightArticle[] = [
  {
    id: 'art-001',
    title: 'Mitigating Post-Harvest Cyanogenic Glycosides in Commercial Cassava Processing',
    slug: 'mitigating-post-harvest-cyanide-commercial-cassava',
    excerpt:
      'A technical review of mechanical chipping, pneumatic drying temperatures, and fermentation holding times for high-quality cassava flour (HQCF) and industrial starch.',
    category: 'Research Brief',
    readingTimeMinutes: 7,
    publishedDate: '2026-10-18',
    status: 'published',
    author: {
      name: 'Dr. Kelechi Okafor',
      role: 'Principal Food Processing Engineer',
      affiliation: 'National Root Crops Research Institute (NRCRI), Umudike'
    },
    content: [
      'Cassava (Manihot esculenta Crantz) remains the backbone of carbohydrate production in southern and central Nigeria. However, the presence of cyanogenic glucosides (principally linamarin and lotaustralin) necessitates strict adherence to rapid detoxification protocols within 24 to 48 hours of root lifting.',
      'When roots are injured during mechanical harvesting, endogenous linamarase hydrolyzes linamarin into acetone cyanohydrin. In processing lines producing High-Quality Cassava Flour (HQCF), rapid flash drying at inlet air temperatures between 160°C and 180°C halts microbial enzymatic breakdown prematurely if pre-treatment grating and dewatering are incomplete.',
      'Field data from 12 processing hubs across Ogun and Oyo states demonstrates that dual-stage disc rasping combined with hydraulic pressing reduces total cyanide content to well below the regulatory threshold of 10 ppm (mg HCN eq/kg) prior to thermal drying.',
      'Processing managers must establish daily titration tests or picrate paper test strips to verify that outgoing HQCF batches consistently achieve food-grade safety standards for industrial bakery off-takers.'
    ],
    citations: [
      'Okafor, K. et al. (2025). Industrial Detoxification Kinetics of Bitter Cassava in Tropical Processing Lines. Journal of Agricultural Engineering & Tech, 31(2), 114–128.',
      'Standard Organisation of Nigeria (SON). Specification for High Quality Cassava Flour: NIS 384:2018.'
    ],
    tags: ['Cassava', 'Post-Harvest', 'Processing', 'Quality Control', 'Food Safety']
  },
  {
    id: 'art-002',
    title: 'The Realities of Solar Pumping Economics in the Northern Irrigation Belt',
    slug: 'realities-solar-pumping-economics-northern-irrigation',
    excerpt:
      'Comparing lifecycle capital expenditure, payback durations, and water yield between diesel gen-sets and DC submersible solar pumps in Kano, Jigawa, and Bauchi.',
    category: 'Industry Analysis',
    readingTimeMinutes: 6,
    publishedDate: '2026-10-22',
    status: 'published',
    author: {
      name: 'Musa Abdullahi, PE',
      role: 'Agricultural Irrigation Consultant',
      affiliation: 'Kano-Hadejia Basin Water Users Association'
    },
    content: [
      'Rising diesel and premium motor spirit (PMS) costs have severely impacted dry-season irrigation farmers cultivating tomatoes, onions, and wheat along northern river floodplains (fadamas). A 2-inch gasoline water pump operating 6 hours daily can consume up to ₦12,000 in fuel each day.',
      'A transition to 2.2kW DC brushless submersible solar pumps operating directly from a 6-panel polycrystalline array requires an initial capital outlay of approximately ₦1.8M to ₦2.4M (including borehole drilling, casing, panels, and inverter controller).',
      'Our 18-month comparative trial reveals an average payback period of 1.4 farming seasons for a 2-hectare horticultural plot. Beyond financial savings, solar installations eliminated the risk of irrigation halts caused by fuel scarcity during critical flowering stages.',
      'However, challenges persist: security against panel theft remains the primary hurdle, necessitating community-managed security pacts or movable panel mountings anchored during daytime operation.'
    ],
    citations: [
      'Abdullahi, M. (2026). Comparative Energetics of Smallholder Fadama Irrigation in Kano State. Agro-Economics Review, 19(4), 88–95.',
      'Energy Commission of Nigeria (ECN). Renewable Off-Grid Agricultural Pumping Survey, 2025.'
    ],
    tags: ['Irrigation', 'Solar Power', 'Agri-Economics', 'Northern Agriculture', 'Horticulture']
  },
  {
    id: 'art-003',
    title: 'Cold-Chain Vulnerabilities in Interstate Vegetable Corridors',
    slug: 'cold-chain-vulnerabilities-interstate-vegetable-corridors',
    excerpt:
      'Quantifying tomato and pepper spoilage rates along the 900-kilometer Jos-to-Lagos transit corridor and evaluating returnable plastic crates (RPCs) vs raffia baskets.',
    category: 'Field Notes',
    readingTimeMinutes: 5,
    publishedDate: '2026-10-27',
    status: 'published',
    author: {
      name: 'Amina Bello',
      role: 'Supply Chain Operations Analyst',
      affiliation: 'Plateau Fresh Produce Alliance'
    },
    content: [
      'Every week, an estimated 800 metric tons of fresh Roma tomatoes and bell peppers depart the high-altitude farm clusters of Jos Plateau heading for Mile 12 and Ketu markets in Lagos. Over 35% of this volume is lost to crushing, fungal rots, and heat asphyxiation prior to retail sale.',
      'The traditional conical raffia basket, packed with 45–50 kg of produce and stacked up to seven tiers high on open-bed trucks, exerts intense hydrostatic pressure on bottom layers. Intercellular fluid leaks, generating rapid ethylene release and bacterial soft rot.',
      'Pilots utilizing stackable ventilated High-Density Polyethylene (HDPE) returnable plastic crates (RPCs) limiting weight to 22 kg per unit reduced in-transit loss to under 6%.',
      'The barrier to wider adoption is reverse logistics: returning empty crates to northern depots currently requires coordinated back-haul agreements with dry goods truckers carrying FMCG products from Lagos to the North.'
    ],
    citations: [
      'Nigerian Stored Products Research Institute (NSPRI). Field Assessment of Tomato Transport Losses: Technical Report 2025/11.',
      'GEMS4 / DFID Logistics Assessment of Nigerian Perishables.'
    ],
    tags: ['Logistics', 'Cold Chain', 'Tomatoes', 'Horticulture', 'Post-Harvest']
  },
  {
    id: 'art-004',
    title: 'Soil Organic Carbon Restoration Protocols for the Middle Belt Guinea Savannah',
    slug: 'soil-organic-carbon-restoration-middle-belt',
    excerpt:
      'Step-by-step methodologies for regenerating depleted topsoil through green manure cover crops (Mucuna pruriens), minimal tillage, and biochar integration.',
    category: 'Guide',
    readingTimeMinutes: 8,
    publishedDate: '2026-10-29',
    status: 'published',
    author: {
      name: 'Prof. Emmanuel Chukwu',
      role: 'Professor of Soil Science',
      affiliation: 'Federal University of Agriculture, Makurdi (FUAM)'
    },
    content: [
      'Decades of slash-and-burn clearing combined with continuous chemical nitrogen application have depleted soil organic carbon (SOC) levels in Benue, Nasarawa, and Niger states to below 0.6% in many arable fields. This manifests in poor cation-exchange capacity (CEC) and rapid moisture drought stress.',
      'Restoration requires a structured three-year regenerative transition: Year 1 introduces velvet bean (Mucuna pruriens) as a late-season cover crop, contributing up to 140 kg of biologically fixed nitrogen per hectare upon residue rolling.',
      'Year 2 replaces destructive deep disk ploughing with rip-tillage, preserving microbial mycorrhizal fungi networks in the root zone.',
      'Year 3 integrates pyrolysis-derived biochar from rice husk residue, locking recalcitrant carbon in the soil matrix for decades and substantially enhancing fertilizer nutrient retention.'
    ],
    citations: [
      'Chukwu, E. (2024). Regenerative Agro-Ecology in the Nigerian Guinea Savannah. Soil Biology & Biochemistry Africa, 14(1), 45–62.'
    ],
    tags: ['Soil Science', 'Regenerative Agriculture', 'Middle Belt', 'Agronomy']
  }
];

export const SAMPLE_WORKER: WorkerProfile = {
  id: 'worker-201',
  fullName: 'Ibrahim Babatunde Alabi',
  headline: 'Commercial Agronomist & Mechanized Crop Operations Specialist',
  email: 'ibrahim.alabi@example.ng',
  phone: '+234 803 456 7890',
  isVerified: true,
  phoneVerified: true,
  location: {
    state: 'Oyo',
    lga: 'Ibadan North'
  },
  summary:
    'Agronomist with 5+ years of practical field experience managing large-scale cereal, grain, and root crop farming in Oyo and Ogun states. Specialized in precision seedbed preparation, drone-assisted field health monitoring, and tractor-implement calibration.',
  capabilities: [
    {
      id: 'cap-1',
      title: 'Tractor Boom Sprayer & Seed Drill Calibration',
      description:
        'Independently calibrated 18-meter boom sprayers and pneumatic seed drills across 300 hectares of commercial maize, ensuring exact chemical dosage and seed spacing.',
      evidenceLevel: 'verified_document',
      evidenceDocumentName: 'Field_Log_Savannah_2025.pdf'
    },
    {
      id: 'cap-2',
      title: 'Integrated Pest Management for Fall Armyworm',
      description:
        'Designed and executed scouting schedules, biological parasitoid releases, and targeted spinosad spraying that kept armyworm infestation under 3% in commercial grain crops.',
      evidenceLevel: 'institutional_credential',
      evidenceDocumentName: 'IITA_IPM_Certification_2024.pdf'
    },
    {
      id: 'cap-3',
      title: 'Soil Moisture & Drip Irrigation Management',
      description:
        'Managed daily tensiometer readings and scheduled solar pump run times for 40 hectares of dry-season vegetables.',
      evidenceLevel: 'self_reported'
    }
  ],
  skills: [
    'Crop Scouting',
    'Fertilizer Blending & Application',
    'Field Crew Leadership',
    'Tractor Operations (Basic)',
    'Yield Forecasting',
    'QGIS Field Mapping',
    'Record Keeping'
  ],
  workExperience: [
    {
      id: 'exp-1',
      role: 'Assistant Farm Manager — Crop Production',
      organisation: 'Oyo Agro-Allied Farm Hub Ltd',
      location: 'Iseyin, Oyo State',
      startDate: '2023-03',
      endDate: '2026-09',
      current: false,
      responsibilities: [
        'Supervised 25 permanent field staff and up to 80 seasonal casual workers.',
        'Managed planting, fertilization, and harvest of 350 hectares of yellow maize and cassava.',
        'Reduced post-harvest grain transit losses by 18% through improved field bagging protocols.'
      ]
    },
    {
      id: 'exp-2',
      role: 'Field Agronomy Officer',
      organisation: 'Greenland Seed Producers Cooperative',
      location: 'Abeokuta North, Ogun State',
      startDate: '2021-08',
      endDate: '2023-02',
      current: false,
      responsibilities: [
        'Carried out certified seed multiplication inspections for foundation maize and cowpea.',
        'Trained outgrower farmers in row spacing, rogueing diseased plants, and seed drying.'
      ]
    }
  ],
  education: [
    {
      id: 'edu-1',
      institution: 'University of Ibadan',
      qualification: 'B.Agric (First Class Honours)',
      field: 'Agronomy & Crop Science',
      yearCompleted: '2021'
    }
  ],
  certifications: [
    {
      id: 'cert-1',
      name: 'Certified Seed Field Inspector',
      issuer: 'National Agricultural Seed Council (NASC)',
      year: '2023',
      evidenceLevel: 'institutional_credential'
    },
    {
      id: 'cert-2',
      name: 'Safe Chemical Handling & Protective Application',
      issuer: 'CropLife Nigeria',
      year: '2022',
      evidenceLevel: 'verified_document'
    }
  ],
  availability: 'Immediately Available',
  preferences: {
    employmentTypes: ['Full-time', 'Contract'],
    preferredStates: ['Oyo', 'Ogun', 'Osun', 'Kwara'],
    willingToRelocate: true
  },
  completionPercentage: 92,
  verifiedStatus: 'verified'
};

export const SAMPLE_WORKERS: WorkerProfile[] = [
  SAMPLE_WORKER,
  {
    id: 'worker-202',
    fullName: 'Haruna Danladi Yakubu',
    headline: 'Commercial Combine Harvester & Tractor Operations Lead',
    email: 'haruna.yakubu@example.ng',
    phone: '+234 805 112 3344',
    location: {
      state: 'Niger',
      lga: 'Mokwa'
    },
    summary:
      'Master agricultural equipment operator with 7 years of specialized combine harvesting, pneumatic seed drilling, and tractor-drawn disk ridging across the Niger River agricultural basin. Verifiable track record with John Deere and New Holland harvesting equipment.',
    capabilities: [
      {
        id: 'cap-h1',
        title: 'Combine Harvester Swath & Concave Calibration',
        description:
          'Operated John Deere W-Series and New Holland TC5.30 across 850 hectares of paddy rice and hybrid maize, keeping field grain loss under 1.8%.',
        evidenceLevel: 'institutional_credential',
        evidenceDocumentName: 'JohnDeere_WestAfrica_MasterOperator.pdf'
      },
      {
        id: 'cap-h2',
        title: 'Hydraulic System Bleed-Off & Lockout-Tagout Safety',
        description:
          'Trained and enforced farm machinery safety protocols, hydraulic emergency lock-out procedures, and header jam clearing without downtime.',
        evidenceLevel: 'verified_document',
        evidenceDocumentName: 'TradeTest_Machinery_Grade1.pdf'
      }
    ],
    skills: [
      'Combine Harvester Operation',
      'Hydraulic Header Calibration',
      'Grain Loss Sampling',
      'Preventive Implement Maintenance',
      'GPS Swath Guidance',
      'Tractor Implement Setup'
    ],
    workExperience: [
      {
        id: 'wexp-h1',
        role: 'Chief Combine Harvester Operator',
        organisation: 'Mokwa Commercial Rice & Grain Hub',
        location: 'Mokwa LGA, Niger State',
        startDate: '2021-04',
        endDate: '2026-10',
        current: false,
        responsibilities: [
          'Led mechanized harvesting operations for 6 combine operators during peak 6-week seasonal harvest windows.',
          'Conducted daily 20-point pre-flight checks on hydraulics, grain elevators, and cutting bar floatation.'
        ]
      }
    ],
    education: [
      {
        id: 'edu-h1',
        institution: 'Federal College of Agriculture, Moor Plantation',
        qualification: 'HND Agricultural Engineering (Farm Power & Machinery)',
        field: 'Farm Machinery Mechanics',
        yearCompleted: '2019'
      }
    ],
    certifications: [
      {
        id: 'cert-h1',
        name: 'Heavy Agricultural Machinery Trade Test Grade 1 (Combine & Tractor)',
        issuer: 'Federal Ministry of Labour and Employment',
        year: '2022',
        evidenceLevel: 'institutional_credential'
      },
      {
        id: 'cert-h2',
        name: 'John Deere S-Series Harvester Operation & Threshing Concave Calibration',
        issuer: 'John Deere West Africa / Tata Agri',
        year: '2023',
        evidenceLevel: 'verified_document'
      }
    ],
    availability: 'Immediately Available',
    preferences: {
      employmentTypes: ['Seasonal', 'Contract', 'Full-time'],
      preferredStates: ['Niger', 'Kaduna', 'Kogi', 'Kwara', 'Benue'],
      willingToRelocate: true
    },
    completionPercentage: 96,
    verifiedStatus: 'verified'
  },
  {
    id: 'worker-203',
    fullName: 'Grace Nneka Okoli',
    headline: 'Commercial Poultry Operations Lead (Layers, Broilers & Biosecurity)',
    email: 'grace.okoli@example.ng',
    phone: '+234 803 778 9900',
    location: {
      state: 'Ogun',
      lga: 'Sagamu'
    },
    summary:
      'Livestock husbandry specialist with 4+ years running automated broiler deep-litter pens (45,000 birds) and layer battery cages. Expert in automated climate ventilation, feed conversion ratios (FCR < 1.62), and veterinary cold-chain vaccination.',
    capabilities: [
      {
        id: 'cap-g1',
        title: 'Automated Flock Ventilation & Ammonia Monitoring',
        description:
          'Maintained optimal tunnel ventilation and environmental temperature curves, keeping flock mortality under 2.8% to 6-week harvest weight.',
        evidenceLevel: 'institutional_credential',
        evidenceDocumentName: 'BigDutchman_Ventilation_Cert.pdf'
      },
      {
        id: 'cap-g2',
        title: 'Poultry Cold-Chain Vaccination Scheduling',
        description:
          'Administered over 120,000 doses of Gumboro, Lasota, and Infectious Bronchitis vaccines under strict temperature-controlled cold chains.',
        evidenceLevel: 'verified_document',
        evidenceDocumentName: 'NVRI_Vom_Vaccination_Log.pdf'
      }
    ],
    skills: [
      'Poultry Husbandry',
      'Flock Vaccination',
      'Biosecurity Compliance',
      'Feed Conversion Tracking',
      'Automated Auger Maintenance',
      'Egg Grading'
    ],
    workExperience: [
      {
        id: 'wexp-g1',
        role: 'Assistant Farm Manager — Commercial Poultry',
        organisation: 'Crestline Agro-Livestock Ltd',
        location: 'Sagamu, Ogun State',
        startDate: '2022-01',
        endDate: '2026-08',
        current: false,
        responsibilities: [
          'Supervised daily flock feed allocation, mortality autopsies, and automated egg sorting lines.',
          'Reduced brooding stage heat mortality by 35% through digital infrared sensor monitoring.'
        ]
      }
    ],
    education: [
      {
        id: 'edu-g1',
        institution: 'Federal University of Agriculture, Abeokuta (FUNAAB)',
        qualification: 'B.Agric in Animal Science',
        field: 'Animal Nutrition & Poultry Husbandry',
        yearCompleted: '2021'
      }
    ],
    certifications: [
      {
        id: 'cert-g1',
        name: 'Commercial Poultry Biosecurity & Disease Surveillance',
        issuer: 'Poultry Association of Nigeria (PAN) & NAPRI',
        year: '2023',
        evidenceLevel: 'institutional_credential'
      },
      {
        id: 'cert-g2',
        name: 'Automated Climate & Ventilation Controller Certification',
        issuer: 'Big Dutchman West Africa',
        year: '2024',
        evidenceLevel: 'verified_document'
      }
    ],
    availability: 'Immediately Available',
    preferences: {
      employmentTypes: ['Full-time', 'Contract'],
      preferredStates: ['Ogun', 'Oyo', 'Lagos', 'Osun'],
      willingToRelocate: false
    },
    completionPercentage: 94,
    verifiedStatus: 'verified'
  },
  {
    id: 'worker-204',
    fullName: 'Suleiman Bello Garba',
    headline: 'Calibrated Boom Sprayer Specialist & Weed Science Agronomist',
    email: 'suleiman.garba@example.ng',
    phone: '+234 802 889 4411',
    location: {
      state: 'Kaduna',
      lga: 'Ikara'
    },
    summary:
      'Precision agrochemical application specialist with 6 years experience operating 12-18m tractor-mounted hydraulic sprayers, chemical drift shields, and ISO flow-rate nozzle calibrators for commercial maize, soya bean, and tomato fields.',
    capabilities: [
      {
        id: 'cap-s1',
        title: 'Tractor-Mounted Hydraulic Boom Sprayer Calibration',
        description:
          'Calibrated air-induction and twin-fan nozzles across 500+ hectares, preventing chemical drift onto non-target crops and saving 22% in herbicide expenditure.',
        evidenceLevel: 'institutional_credential',
        evidenceDocumentName: 'CropLife_Applicator_License.pdf'
      }
    ],
    skills: [
      'Boom Sprayer Calibration',
      'Chemical Drift Management',
      'Integrated Weed Management',
      'PPE & Hazmat Safety',
      'Water-Sensitive Test Paper Sampling'
    ],
    workExperience: [
      {
        id: 'wexp-s1',
        role: 'Lead Chemical Application Officer',
        organisation: 'Zaria Grain & Oilseeds Alliance',
        location: 'Ikara LGA, Kaduna State',
        startDate: '2020-05',
        endDate: '2026-09',
        current: false,
        responsibilities: [
          'Managed 4 chemical application rigs and safety compliance for 18 field crew members.',
          'Maintained zero pesticide contamination incidents over 6 seasons.'
        ]
      }
    ],
    education: [
      {
        id: 'edu-s1',
        institution: 'Ahmadu Bello University, Zaria',
        qualification: 'B.Sc Crop Protection',
        field: 'Weed Science & Toxicology',
        yearCompleted: '2020'
      }
    ],
    certifications: [
      {
        id: 'cert-s1',
        name: 'Tractor-Mounted Hydraulic Boom Sprayer Calibration',
        issuer: 'CropLife Nigeria / IITA',
        year: '2023',
        evidenceLevel: 'institutional_credential'
      },
      {
        id: 'cert-s2',
        name: 'Agricultural Hazardous Chemical Handling & Field PPE Protocol',
        issuer: 'Federal Ministry of Agriculture & Rural Development',
        year: '2022',
        evidenceLevel: 'verified_document'
      }
    ],
    availability: 'Immediately Available',
    preferences: {
      employmentTypes: ['Seasonal', 'Contract'],
      preferredStates: ['Kaduna', 'Kano', 'Niger', 'Katsina'],
      willingToRelocate: true
    },
    completionPercentage: 91,
    verifiedStatus: 'verified'
  },
  {
    id: 'worker-205',
    fullName: 'Tariere Doubra Pere',
    headline: 'Recirculating Aquaculture System (RAS) & Hatchery Specialist',
    email: 'tariere.pere@example.ng',
    phone: '+234 809 332 1199',
    location: {
      state: 'Delta',
      lga: 'Warri South'
    },
    summary:
      'Aquaculture technologist with 5 years managing indoor recirculating aquaculture systems, broodstock hypophysation, Artemia live feed culture, and UV bio-filtration for African Catfish and Nile Tilapia hatcheries.',
    capabilities: [
      {
        id: 'cap-t1',
        title: 'RAS Bio-filter & DO Water Chemistry Management',
        description:
          'Monitored dissolved oxygen, ammonia, and pH using digital spectrophotometers, sustaining 88% fry survival from yolk absorption to fingerling stage.',
        evidenceLevel: 'institutional_credential',
        evidenceDocumentName: 'AfricanAquaculture_RAS_License.pdf'
      }
    ],
    skills: [
      'Broodstock Stripping & Hypophysation',
      'Water Chemistry Testing (DO, pH, Ammonia)',
      'Bio-Filter Maintenance',
      'Artemia Live Feed Culture',
      'Fry Grading'
    ],
    workExperience: [
      {
        id: 'wexp-t1',
        role: 'Senior Hatchery Technologist',
        organisation: 'Niger Delta Blue Waters Fisheries',
        location: 'Warri South LGA, Delta State',
        startDate: '2021-06',
        endDate: '2026-09',
        current: false,
        responsibilities: [
          'Oversaw artificial spawning cycles producing 60,000 fingerlings monthly.',
          'Maintained oxygen blowers and backwash cycles on mechanical drum filters.'
        ]
      }
    ],
    education: [
      {
        id: 'edu-t1',
        institution: 'Delta State University, Abraka',
        qualification: 'B.Sc Fisheries & Aquaculture',
        field: 'Aquaculture Technology',
        yearCompleted: '2021'
      }
    ],
    certifications: [
      {
        id: 'cert-t1',
        name: 'Recirculating Aquaculture System (RAS) Bio-filtration & UV Management',
        issuer: 'African Aquaculture Society (AAS)',
        year: '2023',
        evidenceLevel: 'institutional_credential'
      },
      {
        id: 'cert-t2',
        name: 'Digital Water Quality Photometer Diagnostics',
        issuer: 'Hach Water Analytics Nigeria',
        year: '2022',
        evidenceLevel: 'verified_document'
      }
    ],
    availability: '2 Weeks Notice',
    preferences: {
      employmentTypes: ['Full-time', 'Contract'],
      preferredStates: ['Delta', 'Edo', 'Rivers', 'Bayelsa', 'Lagos'],
      willingToRelocate: true
    },
    completionPercentage: 90,
    verifiedStatus: 'verified'
  },
  {
    id: 'worker-206',
    fullName: 'Terver Emmanuel Iorfa',
    headline: 'Commercial Drip & Center-Pivot Irrigation Lead',
    email: 'terver.iorfa@example.ng',
    phone: '+234 814 665 4422',
    location: {
      state: 'Benue',
      lga: 'Gboko'
    },
    summary:
      'Irrigation engineer with 4+ years specializing in pressurized drip tape installation, diesel booster pump overhaul, and tensiometer moisture tracking for dry-season commercial hybrid maize and soya bean production.',
    capabilities: [
      {
        id: 'cap-te1',
        title: 'Pressurized Drip Network Hydraulic Design',
        description:
          'Installed 45 hectares of subsurface drip lines with venture injector fertigation manifolds, ensuring uniform pressure distribution across slopes.',
        evidenceLevel: 'institutional_credential',
        evidenceDocumentName: 'Netafim_Pressurized_Irrigation.pdf'
      }
    ],
    skills: [
      'Drip Irrigation Installation',
      'Diesel Booster Pump Overhaul',
      'Soil Moisture Tensiometers',
      'Fertigation Manifold Setup',
      'Pitot Tube Pressure Testing'
    ],
    workExperience: [
      {
        id: 'wexp-te1',
        role: 'Irrigation & Water Resource Supervisor',
        organisation: 'Benue Agro-Valley Farms Ltd',
        location: 'Gboko LGA, Benue State',
        startDate: '2022-02',
        endDate: '2026-10',
        current: false,
        responsibilities: [
          'Maintained 3 Lister Petter 4-cylinder diesel booster pumps and disc filter backwash manifolds.',
          'Eliminated emitter clogging through acid-flushing maintenance regimes.'
        ]
      }
    ],
    education: [
      {
        id: 'edu-te1',
        institution: 'Federal University of Agriculture, Makurdi (FUAM)',
        qualification: 'B.Eng Agricultural & Environmental Engineering',
        field: 'Soil & Water Resources Engineering',
        yearCompleted: '2021'
      }
    ],
    certifications: [
      {
        id: 'cert-te1',
        name: 'Pressurized Irrigation System Design & Maintenance',
        issuer: 'Lower Benue River Basin Authority / Netafim',
        year: '2023',
        evidenceLevel: 'institutional_credential'
      },
      {
        id: 'cert-te2',
        name: 'Commercial Diesel Pump Station Operation & Maintenance',
        issuer: 'Lister Petter Technical Certification',
        year: '2022',
        evidenceLevel: 'verified_document'
      }
    ],
    availability: 'Immediately Available',
    preferences: {
      employmentTypes: ['Seasonal', 'Contract', 'Full-time'],
      preferredStates: ['Benue', 'Nasarawa', 'Plateau', 'Kogi'],
      willingToRelocate: true
    },
    completionPercentage: 93,
    verifiedStatus: 'verified'
  }
];

export const SAMPLE_EMPLOYER: EmployerProfile = {
  id: 'emp-101',
  companyName: 'Flourish Agri-Enterprises Ltd',
  businessType: 'Commercial Crop Farming & Value Addition',
  registrationNumber: 'RC 1492084',
  cacVerified: true,
  location: {
    state: 'Oyo',
    lga: 'Iseyin',
    farmSiteAddress: 'Kilometre 14, Iseyin-Oyo Road, Oyo State'
  },
  contactPerson: 'Adewale Johnson (Managing Director)',
  email: 'operations@flourishagri.ng',
  phone: '+234 802 334 5566',
  isVerified: true,
  phoneVerified: true,
  verificationStatus: 'verified',
  verificationDocuments: [
    {
      id: 'doc-1',
      title: 'CAC Certificate of Incorporation',
      documentType: 'CAC_RC',
      submittedAt: '2025-06-12',
      status: 'verified',
      notes: 'Verified against CAC portal database.'
    },
    {
      id: 'doc-2',
      title: 'Agricultural Land Title Certificate of Occupancy (C of O)',
      documentType: 'LAND_TITLE',
      submittedAt: '2025-06-12',
      status: 'verified',
      notes: 'Oyo State Ministry of Lands and Housing registry confirmed.'
    }
  ]
};

export const SAMPLE_EMPLOYERS: EmployerProfile[] = [
  SAMPLE_EMPLOYER,
  {
    id: 'emp-102',
    companyName: 'GreenFields Agro-Ventures Ltd',
    businessType: 'Commercial Grain & Oilseed Production',
    registrationNumber: 'RC 2094812',
    cacVerified: false,
    location: {
      state: 'Kaduna',
      lga: 'Ikara',
      farmSiteAddress: 'Plot 4, Ikara-Zaria Agricultural Corridor, Kaduna State'
    },
    contactPerson: 'Sani Abdullahi (Chief Operating Officer)',
    email: 'sani.a@greenfieldsagro.ng',
    phone: '+234 803 998 7711',
    verificationStatus: 'pending',
    verificationDocuments: [
      {
        id: 'doc-g1',
        title: 'CAC Certificate of Incorporation',
        documentType: 'CAC_RC',
        submittedAt: '2026-10-28',
        status: 'pending',
        notes: 'Submitted document RC 2094899 contains conflict with profile RC 2094812.'
      },
      {
        id: 'doc-g2',
        title: 'Kaduna State Agricultural Lease Agreement',
        documentType: 'LAND_LEASE',
        submittedAt: '2026-10-28',
        status: 'pending'
      }
    ]
  },
  {
    id: 'emp-103',
    companyName: 'Savannah Cattle & Grain Ranch Ltd',
    businessType: 'Commercial Livestock & Grain Operations',
    registrationNumber: 'RC 3819201',
    cacVerified: false,
    location: {
      state: 'Niger',
      lga: 'Mokwa',
      farmSiteAddress: 'Mokwa Grazing Reserve Extension, Niger State'
    },
    contactPerson: 'Bello Al-Hassan (Managing Partner)',
    email: 'bello@savannahranch.ng',
    phone: '+234 814 223 9900',
    verificationStatus: 'pending',
    verificationDocuments: [
      {
        id: 'doc-s1',
        title: 'CAC Certificate of Incorporation',
        documentType: 'CAC_RC',
        submittedAt: '2026-10-29',
        status: 'pending',
        notes: 'Certificate reads Savannah Global Logistics & Feeds Ltd.'
      }
    ]
  },
  {
    id: 'emp-104',
    companyName: 'Delta Aqua Blue Ventures',
    businessType: 'Commercial RAS Catfish & Tilapia Aquaculture',
    registrationNumber: 'BN 2819034',
    cacVerified: false,
    location: {
      state: 'Delta',
      lga: 'Warri South',
      farmSiteAddress: 'Osubi Waterway Enclave, Delta State'
    },
    contactPerson: 'Doubra Ebi (Founder)',
    email: 'doubra@deltaaquablue.ng',
    phone: '+234 809 111 2244',
    verificationStatus: 'pending',
    verificationDocuments: [
      {
        id: 'doc-d1',
        title: 'Business Name Registration Certificate (BN)',
        documentType: 'CAC_BN',
        submittedAt: '2026-10-30',
        status: 'pending',
        notes: 'Embossed seal displays digital raster manipulation.'
      }
    ]
  }
];

export const SAMPLE_APPLICATIONS: JobApplication[] = [
  {
    id: 'app-501',
    jobId: 'job-001',
    jobTitle: 'Senior Agronomist — Commercial Cassava & Maize',
    organisation: 'Flourish Agri-Enterprises Ltd',
    applicantId: 'worker-201',
    applicantName: 'Ibrahim Babatunde Alabi',
    applicantEmail: 'ibrahim.alabi@example.ng',
    applicantHeadline: 'Commercial Agronomist & Mechanized Crop Operations Specialist',
    applicantLocation: 'Ibadan North, Oyo State',
    coverNote:
      'With over five years of active field management across Oyo and Ogun states, I have directly managed mechanized tillage, seed drill calibrations, and armyworm IPM for commercial maize and cassava. My verified credentials and references are attached.',
    status: 'under_review',
    appliedAt: '2026-10-25'
  },
  {
    id: 'app-502',
    jobId: 'job-002',
    jobTitle: 'Poultry Farm Operations Supervisor (Layers & Broilers)',
    organisation: 'Savannah Crest Farms',
    applicantId: 'worker-202',
    applicantName: 'Grace Nneka Okoli',
    applicantEmail: 'grace.okoli@example.ng',
    applicantHeadline: 'Livestock Husbandry Graduate & Automated Poultry Supervisor',
    applicantLocation: 'Sagamu, Ogun State',
    coverNote:
      'I have 3 years direct experience in deep-litter broiler houses maintaining mortality below 3.2% with verified vaccination logs.',
    status: 'shortlisted',
    appliedAt: '2026-10-23'
  }
];

export const SAMPLE_MODERATION_REPORTS: ModerationReport[] = [
  {
    id: 'rep-01',
    targetType: 'job',
    targetId: 'job-raw-99',
    targetTitle: 'Unverified Grain Broker Agent',
    reason: 'Job post asks applicants for an upfront application processing fee via WhatsApp.',
    severity: 'critical',
    priority: 'P1',
    status: 'open',
    reportedBy: 'User #4492',
    reportedAt: '2026-10-30 14:15',
    assignedTo: 'O. Danjuma'
  },
  {
    id: 'rep-02',
    targetType: 'employer',
    targetId: 'emp-103',
    targetTitle: 'Delta Aqua Blue Ventures',
    reason: 'CAC registration number format mismatched during automated verification lookup.',
    severity: 'medium',
    priority: 'P2',
    status: 'investigating',
    reportedBy: 'System Audit',
    reportedAt: '2026-10-28 09:30',
    assignedTo: 'T. Adeyemi'
  },
  {
    id: 'rep-03',
    targetType: 'opportunity',
    targetId: 'opp-006',
    targetTitle: 'Benue River Basin Soya Bean Cultivation Subvention',
    reason: 'Opportunity deadline reported as inconsistent with the official ministry press release.',
    severity: 'low',
    priority: 'P3',
    status: 'resolved',
    reportedBy: 'Agricultural Extension Officer M. Garba',
    reportedAt: '2026-10-26 11:00',
    assignedTo: 'Editorial Desk',
    resolutionNotes: 'Verified source with Lower Benue River Basin Authority and updated deadline.'
  }
];

export const SAMPLE_ADMIN_USERS: SystemUser[] = [
  {
    id: 'usr-0',
    name: 'M-Olany Solutions (Executive Super Admin)',
    email: 'molanysolutions@gmail.com',
    role: 'super_admin',
    status: 'active',
    lastActive: 'Just now',
    permissions: ['all_access', 'role_management', 'system_audit', 'content_publish', 'employer_verify', 'payout_authorize', 'financial_oversight']
  },
  {
    id: 'usr-1',
    name: 'Olufemi Danjuma',
    email: 'admin@tourmsworkforce.com.ng',
    role: 'super_admin',
    status: 'active',
    lastActive: '10 minutes ago',
    permissions: ['all_access', 'role_management', 'system_audit', 'content_publish', 'employer_verify']
  },
  {
    id: 'usr-2',
    name: 'Tosin Adeyemi',
    email: 'tosin.a@tourms.ng',
    role: 'verifier',
    status: 'active',
    lastActive: '25 minutes ago',
    permissions: ['employer_verify', 'worker_evidence_verify', 'cac_audit']
  },
  {
    id: 'usr-3',
    name: 'Fatima Sanusi',
    email: 'fatima.s@tourms.ng',
    role: 'moderator',
    status: 'active',
    lastActive: '1 hour ago',
    permissions: ['job_review', 'queue_dispatch', 'moderation_action']
  },
  {
    id: 'usr-4',
    name: 'Chinedu Eze',
    email: 'chinedu.e@tourms.ng',
    role: 'moderator',
    status: 'active',
    lastActive: '3 hours ago',
    permissions: ['content_edit', 'content_publish', 'opportunities_review']
  },
  {
    id: 'usr-5',
    name: 'Bilikisu Mohammed',
    email: 'bilikisu.m@tourms.ng',
    role: 'support_lead',
    status: 'active',
    lastActive: 'Yesterday',
    permissions: ['user_inquiries', 'ticket_response']
  },
  {
    id: 'usr-6',
    name: 'Adetola Balogun',
    email: 'adetola.b@tourms.ng',
    role: 'verifier',
    status: 'active',
    lastActive: 'Yesterday',
    permissions: ['analytics_read', 'audit_logs_read']
  }
];
