export const projectCategories = [
  "All",
  "Workplace",
  "F&B",
  "Education",
  "Hospitality",
] as const;

export type ProjectCategory = (typeof projectCategories)[number];

export type Project = {
  slug: string;
  number: string;
  title: string;
  category: Exclude<ProjectCategory, "All">;
  location: string;
  year: string;
  client: string;
  image: string;
  description: string;
  overview: string;
  challenge: string;
  solution: string;
  services: string[];
  stats: { value: string; label: string }[];
  partners: { name: string; image: string; slug: string }[];
  gallery: { src: string; alt: string; position?: string }[];
  featured: boolean;
};

const imagePool = {
  signage: "/images/our-work.png",
  meeting: "/images/solution.png",
  learning: "/images/about.png",
  boardroom: "/images/bg-hero.png",
} as const;

const technologyPartners = {
  panasonic: { name: "Panasonic", image: "/images/partners-4.png", slug: "panasonic" },
  tpLink: { name: "TP-Link", image: "/images/partners-3.png", slug: "tp-link" },
  logitech: { name: "Logitech", image: "/images/partners-1.png", slug: "logitech" },
  benq: { name: "BenQ", image: "/images/partners-2.png", slug: "benq" },
  epson: { name: "Epson", image: "/images/partners-5.png", slug: "epson" },
} as const;

export const projects: Project[] = [
  {
    slug: "digital-signage-installation",
    number: "01",
    title: "Digital Signage Installation",
    category: "F&B",
    location: "Surabaya",
    year: "2025",
    client: "Hospitality Group",
    image: imagePool.signage,
    description: "A connected menu-board ecosystem designed to make content management effortless across every customer touchpoint.",
    overview: "A growing hospitality brand needed a digital communication system that could keep pace with changing menus, promotions, and customer behavior. Senja created a warm, visually integrated signage experience that feels native to the interior rather than added on afterward.",
    challenge: "Content updates were slow and inconsistent across displays, while the existing screens competed with the carefully designed atmosphere. The system needed to be simple for the operational team and invisible to the guest.",
    solution: "We combined commercial-grade displays, centralized content management, and custom mounting details. Every screen was calibrated for consistent color and readability, giving the team one intuitive workflow for every customer-facing message.",
    services: ["Experience design", "Digital signage", "Content management", "System integration"],
    stats: [{ value: "05", label: "Integrated displays" }, { value: "01", label: "Control platform" }, { value: "40%", label: "Faster updates" }],
    partners: [technologyPartners.panasonic, technologyPartners.benq, technologyPartners.tpLink],
    gallery: [
      { src: imagePool.signage, alt: "Integrated digital menu displays above the service counter" },
      { src: imagePool.meeting, alt: "Technology detail and display integration" },
      { src: imagePool.boardroom, alt: "Warm interior lighting and integrated technology", position: "center 62%" },
      { src: imagePool.learning, alt: "A connected presentation environment" },
    ],
    featured: true,
  },
  {
    slug: "intelligent-meeting-ecosystem",
    number: "02",
    title: "Intelligent Meeting Ecosystem",
    category: "Workplace",
    location: "Jakarta",
    year: "2025",
    client: "Corporate Headquarters",
    image: imagePool.meeting,
    description: "One-touch collaboration, room control, and video conferencing built around the way modern teams actually work.",
    overview: "This workplace transformation turns everyday meetings into effortless collaborative sessions. Technology is intentionally quiet: the room responds quickly, remote participants feel present, and teams can focus on ideas instead of controls.",
    challenge: "Different meeting platforms and disconnected room devices created delays at the beginning of every session. The client wanted a consistent experience for both frequent users and first-time guests.",
    solution: "Senja designed a single-touch control layer connecting video, audio, lighting, and room scheduling. Automated presets remove repetitive setup while enterprise monitoring keeps every room ready throughout the day.",
    services: ["AV consulting", "Video collaboration", "Room automation", "User training"],
    stats: [{ value: "12", label: "Connected rooms" }, { value: "01", label: "Touch to start" }, { value: "99%", label: "Room readiness" }],
    partners: [technologyPartners.logitech, technologyPartners.benq, technologyPartners.tpLink],
    gallery: [
      { src: imagePool.meeting, alt: "Modern connected meeting room" },
      { src: imagePool.boardroom, alt: "Executive meeting environment" },
      { src: imagePool.learning, alt: "Large-format collaboration display" },
      { src: imagePool.signage, alt: "Integrated digital information display" },
    ],
    featured: false,
  },
  {
    slug: "immersive-learning-space",
    number: "03",
    title: "Immersive Learning Space",
    category: "Education",
    location: "Bandung",
    year: "2024",
    client: "Learning Institute",
    image: imagePool.learning,
    description: "An adaptive classroom where clear audio, immersive displays, and simple controls keep the focus on learning.",
    overview: "Designed as a flexible home for lectures, workshops, and hybrid classes, this learning environment gives every participant a clear view and a clear voice—whether they are in the first row or joining remotely.",
    challenge: "A long room, mixed teaching formats, and variable daylight made consistent sightlines and intelligible audio difficult. Lecturers also needed to switch formats without technical support.",
    solution: "We coordinated display placement, distributed audio, camera tracking, and intuitive lectern controls. Flexible presets allow the space to shift between lecture, discussion, and hybrid modes in seconds.",
    services: ["Learning space design", "Acoustic planning", "Hybrid learning", "Control programming"],
    stats: [{ value: "80", label: "Learner capacity" }, { value: "03", label: "Teaching modes" }, { value: "360°", label: "Audio coverage" }],
    partners: [technologyPartners.epson, technologyPartners.logitech, technologyPartners.tpLink],
    gallery: [
      { src: imagePool.learning, alt: "Immersive classroom with large presentation screen" },
      { src: imagePool.meeting, alt: "Collaborative learning table" },
      { src: imagePool.boardroom, alt: "Integrated display wall in a dark interior" },
      { src: imagePool.signage, alt: "Digital content presentation system" },
    ],
    featured: false,
  },
  {
    slug: "executive-collaboration-suite",
    number: "04",
    title: "Executive Collaboration Suite",
    category: "Workplace",
    location: "Jakarta",
    year: "2025",
    client: "Regional Enterprise",
    image: imagePool.boardroom,
    description: "A discreetly integrated boardroom that combines premium interiors with enterprise-grade collaboration technology.",
    overview: "A flagship boardroom where high-stakes conversations can happen without technological friction. The experience pairs cinematic presence with discreet systems that preserve the architectural character of the room.",
    challenge: "The room required broadcast-quality communication without visible cable runs, intrusive hardware, or complicated operation. Speech needed to remain clear across a long table and for every remote participant.",
    solution: "Senja embedded beamforming microphones, directional audio, dual displays, and secure conferencing behind carefully coordinated interior details. A tailored interface presents only the controls needed for each meeting mode.",
    services: ["Executive AV design", "Secure conferencing", "Interior coordination", "Automation"],
    stats: [{ value: "24", label: "Executive seats" }, { value: "4K", label: "Visual clarity" }, { value: "02", label: "Meeting modes" }],
    partners: [technologyPartners.panasonic, technologyPartners.logitech, technologyPartners.benq],
    gallery: [
      { src: imagePool.boardroom, alt: "Executive boardroom with warm architectural lighting" },
      { src: imagePool.meeting, alt: "Meeting room display and collaboration setup" },
      { src: imagePool.signage, alt: "Integrated screen installation" },
      { src: imagePool.learning, alt: "Presentation screen viewed from audience seating" },
    ],
    featured: true,
  },
  // {
  //   slug: "guest-experience-display",
  //   number: "05",
  //   title: "Guest Experience Display",
  //   category: "Hospitality",
  //   location: "Bali",
  //   year: "2024",
  //   client: "Boutique Resort",
  //   image: imagePool.signage,
  //   description: "Dynamic wayfinding and visual communication that welcomes every guest with timely, relevant information.",
  //   overview: "A network of subtle digital touchpoints helps guests navigate, discover experiences, and feel informed throughout their stay. Each display adopts the resort's visual language and responds to time, location, and context.",
  //   challenge: "Printed wayfinding became outdated quickly and multilingual updates were difficult to manage. The new system needed to improve clarity without interrupting the calm resort atmosphere.",
  //   solution: "We developed a centrally managed display network with location-aware templates, scheduled content, and low-glare screens. Hardware placement was coordinated to blend naturally with each guest area.",
  //   services: ["Guest journey mapping", "Wayfinding", "Digital signage", "Content templates"],
  //   stats: [{ value: "18", label: "Guest touchpoints" }, { value: "03", label: "Languages" }, { value: "24/7", label: "Live information" }],
  //   partners: [technologyPartners.panasonic, technologyPartners.epson, technologyPartners.tpLink],
  //   gallery: [
  //     { src: imagePool.signage, alt: "Digital guest information display" },
  //     { src: imagePool.boardroom, alt: "Warm hospitality interior with integrated technology" },
  //     { src: imagePool.learning, alt: "Large-format information display" },
  //     { src: imagePool.meeting, alt: "Intuitive display and control interface" },
  //   ],
  //   featured: false,
  // },
  // {
  //   slug: "hybrid-learning-studio",
  //   number: "06",
  //   title: "Hybrid Learning Studio",
  //   category: "Education",
  //   location: "Surabaya",
  //   year: "2024",
  //   client: "Higher Education Campus",
  //   image: imagePool.learning,
  //   description: "A broadcast-ready teaching environment that brings remote and in-room participants into one shared experience.",
  //   overview: "Part classroom and part production studio, this environment helps educators deliver engaging lessons to audiences anywhere. Intelligent cameras and balanced audio make hybrid participation feel natural rather than secondary.",
  //   challenge: "Remote students struggled to follow demonstrations and classroom discussions, while educators were overwhelmed by production controls. The workflow needed to feel as familiar as teaching in a normal room.",
  //   solution: "Automated camera tracking, content capture, confidence monitors, and voice reinforcement work as one system. A simplified teaching interface lets educators begin, record, and share a session without a technician.",
  //   services: ["Studio planning", "Lecture capture", "Camera automation", "Faculty enablement"],
  //   stats: [{ value: "02", label: "Auto-tracking cameras" }, { value: "4K", label: "Lecture capture" }, { value: "01", label: "Teaching interface" }],
  //   partners: [technologyPartners.epson, technologyPartners.logitech, technologyPartners.benq, technologyPartners.tpLink],
  //   gallery: [
  //     { src: imagePool.learning, alt: "Hybrid learning studio and presentation display" },
  //     { src: imagePool.meeting, alt: "Collaboration technology used for remote learning" },
  //     { src: imagePool.signage, alt: "Digital content displayed to a room" },
  //     { src: imagePool.boardroom, alt: "Professional presentation environment" },
  //   ],
  //   featured: false,
  // },
];

export function getProjectBySlug(slug: string) {
  return projects.find((project) => project.slug === slug);
}
