export interface ServiceItem {
  number: string;
  slug: string;
  title: string;
  tagline: string;
  description: string;
  longDescription: string;
  deliverables: string[];
  pricing: string;
  pricingNumeric: number;
  delivery: string;
  waText: string;
  benefits: string[];
  idealFor: string[];
}

export interface ProjectItem {
  slug: string;
  title: string;
  client: string;
  sector: string;
  tag: string;
  resultMetric: string;
  overview: string;
  problem: string;
  solution: string;
  techStack: string[];
  isDemo: boolean;
  isFeatured: boolean;
  deliveryDays: string;
}

export interface PricingTier {
  name: string;
  price: string;
  priceNumeric: number;
  description: string;
  deliveryTimeframe: string;
  features: string[];
  ctaLabel: string;
  isFeatured: boolean;
}

export interface FaqItem {
  question: string;
  answer: string;
  category: "general" | "pricing" | "technical";
}

export const SITE_CONFIG = {
  name: "NeuralWaves",
  tagline: "AI that ships.",
  subhead: "Chatbots, dashboards, and AI agents for UAE businesses. Fixed price. Delivered in days.",
  domain: "https://neuralwaves.in",
  location: "Dubai, United Arab Emirates",
  address: {
    streetAddress: "DIFC Gate Precinct, Building 4",
    addressLocality: "Dubai",
    addressRegion: "Dubai",
    postalCode: "00000",
    addressCountry: "AE",
  },
  geo: {
    latitude: 25.2048,
    longitude: 55.2708,
  },
  contact: {
    email: "zaminaskari.work@gmail.com",
    phone: "+91-8840936715",
    whatsapp: "+91-8840936715",
    whatsappDisplay: "+91-8840936715",
    calUrl: "https://cal.com/neuralwaves/15min",
  },
  socials: {
    twitter: "https://twitter.com/neuralwaves_in",
    linkedin: "https://linkedin.com/company/neuralwaves",
    github: "https://github.com/neuralwaves",
  },
};

export const SERVICES_DATA: ServiceItem[] = [
  {
    number: "01",
    slug: "chatbots",
    title: "AI Chatbots & WhatsApp Automation",
    tagline: "Menu bots, AI replies, and human handoff — on the app your customers already use.",
    description:
      "Customer communication in the UAE happens on WhatsApp. We engineer verified Meta Cloud API bots and website assistants capable of instant lead capture, catalog browsing, and reservation bookings in fluent Arabic and English.",
    longDescription:
      "In the UAE, over 85% of customer interactions start and finish on WhatsApp. Traditional phone queues and delayed email tickets cost businesses tens of thousands of dirhams in abandoned transactions. We build production-ready WhatsApp bots using the official Meta Cloud API, integrated directly with OpenAI/Claude and your CRM. From bilingual Arabic/English intent routing to live human agent escalation, we ship systems that convert inbound interest into booked revenue within seconds.",
    deliverables: [
      "Official Meta WhatsApp Cloud API verification & setup",
      "Menu flows + natural language AI replies (OpenAI / Claude)",
      "Instant calendar booking & reservation engine",
      "Seamless human agent takeover & escalation desk",
      "CRM & Google Sheets real-time lead sync",
      "Arabic (MSA & Gulf) + English dual-language fluency",
    ],
    pricing: "From AED 1,500",
    pricingNumeric: 1500,
    delivery: "3–5 days",
    waText: "Hi NeuralWaves, I want to discuss WhatsApp & AI Chatbots",
    benefits: [
      "Sub-30 second response times 24/7/365",
      "Zero missed inquiries during weekends & holidays",
      "Bilingual comprehension native to Gulf dialects",
      "Direct sync to your existing sales CRM or Google Sheets",
    ],
    idealFor: [
      "Real estate brokerages & luxury leasing agents",
      "Clinics, wellness centers & dental practices",
      "Automotive showrooms & car rental agencies",
      "High-volume service businesses & restaurants",
    ],
  },
  {
    number: "02",
    slug: "dashboards",
    title: "Web & Admin Dashboards",
    tagline: "Custom dashboards for the operations you're running on spreadsheets.",
    description:
      "Replace fragile, slow spreadsheets with secure, blazingly fast internal portals. We build tailored admin panels, client viewing portals, and KPI consoles with real-time permissions and sub-second load times.",
    longDescription:
      "Spreadsheets work until your team hits 10 people and files start corrupting, permissions get leaked, or formula errors cost you real money. We build custom Next.js admin dashboards and operational command centers tailored specifically to your company's SOPs. Engineered with Supabase/PostgreSQL, role-based access control (RBAC), and lightning-fast filters, our portals give your team complete operational visibility on desktop and mobile alike.",
    deliverables: [
      "Custom Next.js & React UI tailored to your ops workflow",
      "Role-based access control (RBAC) & secure auth",
      "Real-time database sync (Postgres / Supabase / Firebase)",
      "Instant multi-column search, filtering & CSV/PDF exports",
      "Live activity logs, audit trails & team permissioning",
      "Fully responsive mobile & tablet layouts for field teams",
    ],
    pricing: "From AED 2,500",
    pricingNumeric: 2500,
    delivery: "5–7 days",
    waText: "Hi NeuralWaves, I want to discuss Web & Admin Dashboards",
    benefits: [
      "Eliminate spreadsheet synchronization conflicts",
      "Granular team permissions (Admins, Managers, Staff)",
      "Real-time updates via WebSockets without page refreshes",
      "1-click export of financial, dispatch, and lead records",
    ],
    idealFor: [
      "Logistics, fleet & dispatch coordinators",
      "Multi-branch restaurants and cloud kitchens",
      "B2B service providers managing client deliverables",
      "E-commerce merchants coordinating fulfillment",
    ],
  },
  {
    number: "03",
    slug: "agents",
    title: "AI Agents for Business",
    tagline: "Lead gen, scraping, reporting. Agents that work while you sleep.",
    description:
      "Autonomous background workers engineered to handle multi-step business operations: lead scraping, document parsing, invoice reconciliation, and daily executive briefings delivered directly to your phone.",
    longDescription:
      "Routine business operations shouldn't consume your highest-paid team members' focus. We build deterministic, autonomous AI agents that run silently in the background: discovering commercial tenders across government portals, extracting invoice line items from messy scanned PDFs, enriching prospect profiles, and dispatching daily morning summaries to executive WhatsApp threads before 8:00 AM.",
    deliverables: [
      "Autonomous web scraping & competitor pricing bots",
      "Intelligent document parsing (PDF invoices, trade licenses, receipts)",
      "Multi-step lead enrichment & LinkedIn/CRM syncing",
      "Scheduled morning briefing reports sent via WhatsApp/Email",
      "Resilient job queues with automatic retry mechanisms",
      "Custom webhooks connecting all your third-party SaaS apps",
    ],
    pricing: "From AED 7,500",
    pricingNumeric: 7500,
    delivery: "7–10 days",
    waText: "Hi NeuralWaves, I want to discuss AI Agents for Business",
    benefits: [
      "Save 15–30 hours of repetitive data entry every week",
      "Zero human error in invoice transcription & verification",
      "Automated alerts for competitor price shifts",
      "Proactive notifications for high-priority commercial leads",
    ],
    idealFor: [
      "Import/export traders & freight forwarders",
      "Accounting & legal document processing teams",
      "Commercial procurement & tender bidding departments",
      "Market research & B2B outbound sales teams",
    ],
  },
];

export const PROJECTS_DATA: ProjectItem[] = [
  {
    slug: "dubai-real-estate-whatsapp-bot",
    title: "Dubai Real Estate WhatsApp Lead Bot",
    client: "Elysian Luxury Properties",
    sector: "Real Estate",
    tag: "AI Chatbot",
    resultMetric: "Response time: 4 hours → 30 seconds",
    overview:
      "Autonomous WhatsApp assistant qualifying ultra-luxury villa inquiries in Palm Jumeirah and Emirates Hills around the clock.",
    problem:
      "Brokers were losing high-intent international and GCC buyers due to delayed replies outside Dubai business hours. Weekend inquiries routinely went cold before Monday morning follow-ups.",
    solution:
      "Engineered an official Meta Cloud API assistant that prompts prospective buyers for budget, preferred communities, and timeline, serves verified PDF brochures, and books viewing appointments directly on broker calendars.",
    techStack: [
      "Next.js 14",
      "Meta WhatsApp Cloud API",
      "OpenAI GPT-4o",
      "Supabase PostgreSQL",
      "Cal.com API",
    ],
    isDemo: false,
    isFeatured: true,
    deliveryDays: "5 days",
  },
  {
    slug: "restaurant-ordering-dashboard",
    title: "Restaurant Fleet & Order Management Dashboard",
    client: "Bait Al Karam Hospitality Group",
    sector: "F&B",
    tag: "Admin Dashboard",
    resultMetric: "3 hrs/day saved on order management",
    overview:
      "Centralized operational command portal dispatching live kitchen orders across 4 cloud kitchen hubs in Dubai and Sharjah.",
    problem:
      "Franchise managers were juggling separate tablets for Talabat, Deliveroo, and phone orders on messy Excel sheets, resulting in delayed prep times, food waste, and frequent duplicate orders.",
    solution:
      "Built a unified Next.js real-time admin portal syncing all incoming delivery streams into an intuitive kitchen display system (KDS) with live courier route tracking and automated inventory depletion.",
    techStack: [
      "Next.js 14",
      "React",
      "PostgreSQL",
      "Tailwind CSS",
      "WebSockets",
      "Supabase",
    ],
    isDemo: false,
    isFeatured: true,
    deliveryDays: "7 days",
  },
  {
    slug: "abu-dhabi-logistics-lead-agent",
    title: "Abu Dhabi Logistics Lead-Gen Agent",
    client: "Gulf Horizon Freight (Demo)",
    sector: "Logistics",
    tag: "AI Agent",
    resultMetric: "40 qualified leads/week",
    overview:
      "Autonomous market scraping agent discovering industrial import/export cargo bids and qualifying logistics decision-makers in Khalifa Industrial Zone (KEZAD).",
    problem:
      "Freight forwarders relied on manual cold calls and trade directory searches, spending 25+ hours weekly researching trade license databases with negligible conversion.",
    solution:
      "Deployed an autonomous background agent that monitors public commercial tenders, verifies company shipping volumes, enriches contact details via LinkedIn, and queues personalized introduction emails.",
    techStack: [
      "Python",
      "FastAPI",
      "Playwright",
      "Claude 3.5 Sonnet",
      "HubSpot API",
      "Supabase",
    ],
    isDemo: true,
    isFeatured: false,
    deliveryDays: "8 days",
  },
  {
    slug: "dubai-clinic-appointment-bot",
    title: "Dubai Clinic Appointment & Follow-Up Bot",
    client: "Aura Wellness Clinics (Demo)",
    sector: "Healthcare",
    tag: "AI Chatbot",
    resultMetric: "60% fewer no-shows",
    overview:
      "Bilingual WhatsApp concierge handling specialist doctor bookings, insurance inquiries, and automatic appointment reminders.",
    problem:
      "High patient cancellation rates and receptionist phone congestion during peak morning clinic hours resulted in empty doctor consultation slots and frustrated patients.",
    solution:
      "Built an automated WhatsApp bot that confirms booking times, verifies Emirates ID/insurance card photos via OCR, and sends interactive confirmation buttons 24 hours prior.",
    techStack: [
      "Next.js 14",
      "WhatsApp Cloud API",
      "Vision OCR",
      "Supabase",
      "Twilio API",
    ],
    isDemo: true,
    isFeatured: false,
    deliveryDays: "4 days",
  },
];

export const PRICING_TIERS_DATA: PricingTier[] = [
  {
    name: "Starter",
    price: "1,500",
    priceNumeric: 1500,
    description: "Essential automation for single workflows or support bots.",
    deliveryTimeframe: "3–5 working days",
    features: [
      "Custom WhatsApp or Web chat assistant",
      "Menu-driven navigation & static FAQ responses",
      "Lead collection to Google Sheets & Email alerts",
      "Standard Meta Cloud API setup & verification",
      "1 revision round included",
      "14-day post-launch warranty",
    ],
    ctaLabel: "Get started",
    isFeatured: false,
  },
  {
    name: "Growth",
    price: "3,500",
    priceNumeric: 3500,
    description: "Full AI conversational assistant integrated into your CRM.",
    deliveryTimeframe: "5–7 working days",
    features: [
      "Natural language AI replies (OpenAI / Claude)",
      "Arabic (Gulf & MSA) + English bilingual support",
      "HubSpot, Zoho, or Supabase CRM real-time sync",
      "Automated appointment booking & calendar sync",
      "Human agent takeover console",
      "30-day post-launch warranty & 2 revision rounds",
    ],
    ctaLabel: "Get started",
    isFeatured: true,
  },
  {
    name: "Business",
    price: "7,500",
    priceNumeric: 7500,
    description: "Complete end-to-end bespoke system with custom dashboard.",
    deliveryTimeframe: "7–10 working days",
    features: [
      "Custom Next.js Web App & Admin Dashboard",
      "Role-based team authentication & permissioning",
      "Autonomous daily reporting & data scraping agents",
      "Full API integrations & webhook automation",
      "Dedicated developer Slack/WhatsApp channel",
      "30-day post-launch warranty with priority support",
    ],
    ctaLabel: "Get started",
    isFeatured: false,
  },
  {
    name: "Custom",
    price: "15,000",
    priceNumeric: 15000,
    description: "Enterprise-grade AI infrastructure for multi-department operations.",
    deliveryTimeframe: "10–15 working days",
    features: [
      "Multi-agent autonomous workflow orchestration",
      "Custom fine-tuned models & internal knowledge base (RAG)",
      "ERP / SAP / Legacy database deep integration",
      "On-premise or UAE sovereign cloud data residency",
      "Dedicated engineering sprint team",
      "Ongoing SLA with guaranteed 1-hour response times",
    ],
    ctaLabel: "Contact for scope",
    isFeatured: false,
  },
];

export const FAQS_DATA: FaqItem[] = [
  {
    question: "How does fixed pricing work?",
    answer:
      "We quote a single number upfront based on agreed deliverables. No hourly rates, no scope creep, no surprise invoices. 50% deposit to kick off the sprint, 50% upon deployment after your acceptance sign-off.",
    category: "pricing",
  },
  {
    question: "How fast do you actually deliver?",
    answer:
      "Most projects ship in 3 to 7 working days. Starter bots take 3–5 days, custom dashboards take 5–7 days, and complex AI agents take 7–10 days. We start within 24 hours of receiving the 50% deposit.",
    category: "general",
  },
  {
    question: "Do you support Arabic language interactions?",
    answer:
      "Yes. All our AI chatbots and agent systems support native bilingual conversations in Modern Standard Arabic (MSA) and Gulf Arabic dialects (Khaleeji), alongside English.",
    category: "technical",
  },
  {
    question: "Who owns the code and intellectual property?",
    answer:
      "You do. Upon final payment, 100% of the source code, API configurations, and database credentials are fully transferred to your company repository.",
    category: "general",
  },
  {
    question: "What happens after the project launches?",
    answer:
      "Every project includes a 14 to 30 day warranty period where bug fixes and minor adjustments are handled free of charge. We also offer ongoing monthly maintenance starting at AED 750/mo.",
    category: "general",
  },
  {
    question: "Can you connect to our existing software (HubSpot, Zoho, ERP)?",
    answer:
      "Yes. We specialize in API integrations across popular platforms including Zoho, HubSpot, Salesforce, Google Sheets, Supabase, Airtable, Cal.com, and custom REST/GraphQL APIs.",
    category: "technical",
  },
];
