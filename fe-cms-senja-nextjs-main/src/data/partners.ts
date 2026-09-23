export type TechnologyPartner = {
  slug: string
  number: string
  name: string
  image: string
  description: string
  capabilities: string[]
  relationship: string
  relationshipDetail: string
  heroImage: string
  gallery: { src: string; alt: string; position?: string }[]
  products: {
    name: string
    category: string
    description: string
    image: string
  }[]
}

export const technologyPartners: TechnologyPartner[] = [
  {
    slug: "panasonic",
    number: "01",
    name: "Panasonic",
    image: "/images/partners-4.png",
    description: "Professional visual systems engineered for dependable, always-on communication environments.",
    capabilities: ["Professional displays", "AV systems", "Digital signage"],
    relationship: "Reliable visual technology for spaces that need to perform all day, every day.",
    relationshipDetail: "Senja works with Panasonic professional visual solutions to deliver clear, dependable communication across meeting rooms, digital signage environments, and shared facilities. Our role connects product selection, spatial coordination, installation, and ongoing support into one accountable experience.",
    heroImage: "/images/our-work.png",
    gallery: [
      { src: "/images/bg-hero.png", alt: "Panasonic display technology integrated into a premium meeting space" },
      { src: "/images/our-work.png", alt: "Professional digital displays in a hospitality environment" },
    ],
    products: [
      { name: "SQ2H Series", category: "Professional Display", description: "High-brightness 4K displays for premium signage and corporate communication.", image: "/images/our-work.png" },
      { name: "EQ2 Series", category: "Commercial Display", description: "Versatile professional displays for meeting rooms, information, and everyday signage.", image: "/images/solution.png" },
      { name: "PressIT360", category: "Collaboration", description: "A 360-degree camera speakerphone designed for equitable hybrid meetings.", image: "/images/bg-hero.png" },
    ],
  },
  {
    slug: "tp-link",
    number: "02",
    name: "TP-Link",
    image: "/images/partners-3.png",
    description: "Reliable network infrastructure that keeps every connected room responsive and secure.",
    capabilities: ["Enterprise network", "Wi-Fi", "Connectivity"],
    relationship: "The connected foundation behind every responsive Senja experience.",
    relationshipDetail: "Together with TP-Link's Omada ecosystem, Senja designs network foundations that support collaboration, signage, room control, and guest connectivity. We plan coverage, switching, segmentation, and centralized management around the real operational needs of each space.",
    heroImage: "/images/about.png",
    gallery: [
      { src: "/images/solution.png", alt: "Connected workplace powered by enterprise network infrastructure" },
      { src: "/images/about.png", alt: "A learning environment supported by reliable wireless connectivity" },
    ],
    products: [
      { name: "EAP653", category: "Wi-Fi 6 Access Point", description: "Slim AX3000 ceiling access point for fast, high-capacity business wireless coverage.", image: "/images/about.png" },
      { name: "SG2210P", category: "Managed PoE+ Switch", description: "A managed ten-port switch that powers and connects room technology through PoE+.", image: "/images/solution.png" },
      { name: "OC200", category: "Hardware Controller", description: "Centralized on-premises management for access points, switches, and gateways.", image: "/images/bg-hero.png" },
    ],
  },
  {
    slug: "logitech",
    number: "03",
    name: "Logitech",
    image: "/images/partners-1.png",
    description: "Human-centered video collaboration solutions made for intuitive hybrid communication.",
    capabilities: ["Video conferencing", "Room systems", "Peripherals"],
    relationship: "Making video collaboration feel natural in rooms of every size.",
    relationshipDetail: "Senja and Logitech bring human-centered collaboration into the workplace through room systems that are easy to start, consistent to operate, and simple for IT teams to manage. We match the right camera, controller, and room configuration to each meeting experience.",
    heroImage: "/images/solution.png",
    gallery: [
      { src: "/images/bg-hero.png", alt: "Executive collaboration room using Logitech meeting technology" },
      { src: "/images/solution.png", alt: "Modern meeting room designed for effortless video collaboration" },
    ],
    products: [
      { name: "Rally Bar", category: "All-in-one Video Bar", description: "A premium appliance-based video bar for medium-sized meeting rooms.", image: "/images/bg-hero.png" },
      { name: "MeetUp 2", category: "Conference Camera", description: "AI-enabled USB video bar designed for PC and BYOD-based small meeting rooms.", image: "/images/solution.png" },
      { name: "Tap IP", category: "Touch Controller", description: "A network-connected meeting controller built around one-touch join simplicity.", image: "/images/about.png" },
    ],
  },
  {
    slug: "benq",
    number: "04",
    name: "BenQ",
    image: "/images/partners-2.png",
    description: "Interactive displays and visual solutions designed for productive workplaces and learning spaces.",
    capabilities: ["Interactive displays", "Meeting rooms", "Education"],
    relationship: "Interactive visual experiences for ideas people can see, shape, and share.",
    relationshipDetail: "Senja integrates BenQ displays into workplaces and learning environments where participation matters. From interactive boards to wireless presentation and managed signage, we design the supporting system so every user can present and collaborate with confidence.",
    heroImage: "/images/about.png",
    gallery: [
      { src: "/images/about.png", alt: "Interactive display in a modern learning space" },
      { src: "/images/our-work.png", alt: "BenQ visual communication technology integrated into an interior" },
    ],
    products: [
      { name: "Board Pro RP04", category: "Interactive Display", description: "Google-certified 4K interactive displays for collaborative workplaces and classrooms.", image: "/images/about.png" },
      { name: "InstaShow VS20", category: "Wireless Presentation", description: "Plug-and-play 4K wireless presentation and hybrid meeting integration.", image: "/images/solution.png" },
      { name: "ST04 Series", category: "Smart Signage", description: "Secure 4K smart signage for corporate information and customer-facing content.", image: "/images/our-work.png" },
    ],
  },
  {
    slug: "epson",
    number: "05",
    name: "Epson",
    image: "/images/partners-5.png",
    description: "Scalable projection technology for immersive presentations, learning, and shared experiences.",
    capabilities: ["Laser projection", "Immersive visuals", "Large venues"],
    relationship: "Scalable projection for ideas that deserve a larger canvas.",
    relationshipDetail: "Senja works with Epson projection technology to create bright, flexible visual experiences for classrooms, meeting rooms, signage, and large venues. We coordinate projection geometry, mounting, signal flow, control, and commissioning for a complete result.",
    heroImage: "/images/about.png",
    gallery: [
      { src: "/images/about.png", alt: "Large-format Epson projection in a learning environment" },
      { src: "/images/bg-hero.png", alt: "Immersive projected presentation in a professional interior" },
    ],
    products: [
      { name: "PowerLite L210SF", category: "Short Throw Laser", description: "A Full HD short-throw laser display for classrooms and collaborative spaces.", image: "/images/about.png" },
      { name: "PowerLite 810E", category: "Extreme Short Throw", description: "A compact lamp-free display with 4K enhancement for large images near the wall.", image: "/images/solution.png" },
      { name: "EB-PU1008B", category: "Large Venue Projector", description: "An 8,500-lumen WUXGA laser projector with 4K enhancement for demanding venues.", image: "/images/bg-hero.png" },
    ],
  },
]

export function getPartnerBySlug(slug: string) {
  return technologyPartners.find((partner) => partner.slug === slug)
}
