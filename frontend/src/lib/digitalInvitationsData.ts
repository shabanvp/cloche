export interface DigitalInviteTemplate {
  id: string;
  slug: string;
  name: string;
  category: "Wedding Cards" | "Save the Date" | "Video Invitations" | "Reception" | "Engagement" | "Mehendi" | "Haldi" | "Sangeet";
  type: "card" | "video" | "multi-page";
  image: string;
  badge: "Free" | "Premium" | "New" | "Trending";
  style: string;
  themeColor: string;
  fontStyle: string;
  musicTrack?: string;
  pages: {
    title: string;
    description: string;
    bgStyle: string;
  }[];
}

export const DIGITAL_INVITATION_CATEGORIES = [
  "All",
  "Wedding Cards",
  "Save the Date",
  "Video Invitations",
  "Reception",
  "Engagement",
  "Mehendi",
  "Haldi",
  "Sangeet",
] as const;

export const DIGITAL_INVITATION_FILTERS = [
  "All",
  "Trending",
  "Premium",
  "Free",
  "New",
] as const;

export const DIGITAL_INVITE_TEMPLATES: DigitalInviteTemplate[] = [
  {
    id: "tpl-1",
    slug: "sand-and-sea",
    name: "Sand and Sea",
    category: "Save the Date",
    type: "multi-page",
    image: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80",
    badge: "Free",
    style: "Pastel Teal & Beach Sunset",
    themeColor: "#0F4C45",
    fontStyle: "Playfair Display",
    pages: [
      { title: "Save Our Date", description: "Together with their families, Kareena & Saif invite you to celebrate.", bgStyle: "from-teal-900 via-[#0F4C45] to-emerald-950" },
      { title: "The Wedding Itinerary", description: "Haldi & Mehendi at Sunset Beach Resort • 4:00 PM", bgStyle: "from-[#0F4C45] via-teal-800 to-amber-950" },
      { title: "Venue & Accommodations", description: "The Grand Pavilion, Marari Beach Resort, Alleppey", bgStyle: "from-emerald-950 via-[#0F4C45] to-teal-900" },
      { title: "RSVP & Best Compliments", description: "Kindly RSVP by Nov 15th • Compliments from Kapoor & Khan Family", bgStyle: "from-[#0F4C45] via-[#145C54] to-charcoal" },
    ],
  },
  {
    id: "tpl-2",
    slug: "chirping-birds",
    name: "Chirping Birds",
    category: "Wedding Cards",
    type: "multi-page",
    image: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=800&q=80",
    badge: "Trending",
    style: "Heritage Arch & Botanical Flora",
    themeColor: "#991B1B",
    fontStyle: "Cinzel",
    pages: [
      { title: "Divine Blessings", description: "Mouni & Suraj request the pleasure of your company.", bgStyle: "from-red-950 via-rose-900 to-amber-950" },
      { title: "Muhurtham & Ceremony", description: "Traditional Vedic Rituals at Royal Arch Gardens", bgStyle: "from-amber-950 via-red-900 to-rose-950" },
      { title: "Celebration Feast", description: "Grand Reception & Musical Night • 7:30 PM Onwards", bgStyle: "from-red-900 via-rose-950 to-charcoal" },
      { title: "Family & Contact", description: "Warm regards from Nambiar & Roy Families", bgStyle: "from-rose-950 via-red-900 to-amber-900" },
    ],
  },
  {
    id: "tpl-3",
    slug: "traditional-ganesha",
    name: "Traditional Ganesha",
    category: "Wedding Cards",
    type: "multi-page",
    image: "https://images.unsplash.com/photo-1607190074257-dd4b7af0309f?auto=format&fit=crop&w=800&q=80",
    badge: "New",
    style: "Temple Gold & Haldi Crimson",
    themeColor: "#D97706",
    fontStyle: "Great Vibes",
    pages: [
      { title: "Shubh Vivah", description: "With the divine blessings of Lord Ganesha, Ananya & Rahul are tying the knot.", bgStyle: "from-amber-950 via-yellow-900 to-red-950" },
      { title: "Haldi & Sangeet", description: "Traditional Haldi Ceremony & Gala Musical Sangeet Night", bgStyle: "from-yellow-950 via-amber-900 to-red-900" },
      { title: "Wedding Ceremony", description: "Vedic Pheras at Celestia Palace, Udaipur • 9:15 AM", bgStyle: "from-red-950 via-amber-950 to-yellow-900" },
      { title: "Warm Regards", description: "With best compliments from Sharma & Verma Relatives", bgStyle: "from-amber-900 via-yellow-950 to-charcoal" },
    ],
  },
  {
    id: "tpl-4",
    slug: "royal-emerald-mandap",
    name: "Royal Emerald Mandap",
    category: "Reception",
    type: "multi-page",
    image: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80",
    badge: "Premium",
    style: "Deep Emerald & Gold Foil",
    themeColor: "#064E3B",
    fontStyle: "Playfair Display",
    pages: [
      { title: "Royal Union", description: "Deepika & Ranveer invite you to their Grand Reception.", bgStyle: "from-emerald-950 via-[#0F4C45] to-teal-950" },
      { title: "Gala Dinner", description: "Cocktails, Live Orchestra & Royal Banquet • 8:00 PM", bgStyle: "from-[#0F4C45] via-emerald-900 to-emerald-950" },
      { title: "Venue Guide", description: "The Oberoi Grand Ballroom, Marine Drive, Mumbai", bgStyle: "from-teal-950 via-[#0F4C45] to-emerald-900" },
      { title: "RSVP Info", description: "Please confirm your presence by Dec 1st", bgStyle: "from-emerald-900 via-teal-950 to-charcoal" },
    ],
  },
  {
    id: "tpl-5",
    slug: "shubh-nimantran-video",
    name: "Shubh Nimantran Video",
    category: "Video Invitations",
    type: "video",
    image: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80",
    badge: "Trending",
    style: "Animated Video & Background Music",
    themeColor: "#7C2D12",
    fontStyle: "Cormorant Garamond",
    musicTrack: "Soft Shehnai & Sitar Harmony",
    pages: [
      { title: "Animated Video Invite", description: "30-Second HD Motion Video Invitation with Shehnai & Flute background score.", bgStyle: "from-amber-950 via-orange-950 to-red-950" },
    ],
  },
  {
    id: "tpl-6",
    slug: "minimalist-botanical-arch",
    name: "Minimalist Botanical Arch",
    category: "Engagement",
    type: "multi-page",
    image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=800&q=80",
    badge: "Free",
    style: "Sage Green & Eucalyptus",
    themeColor: "#15803D",
    fontStyle: "Montserrat",
    pages: [
      { title: "Ring Ceremony", description: "Sneha & Rohan are getting engaged!", bgStyle: "from-emerald-900 via-green-900 to-teal-950" },
      { title: "High Tea & Music", description: "Casual High Tea & Live Acoustic Performance • 4:30 PM", bgStyle: "from-teal-950 via-emerald-900 to-green-900" },
      { title: "Venue & Google Map", description: "The Lawn Villa, ECR Road, Chennai", bgStyle: "from-green-900 via-teal-950 to-charcoal" },
    ],
  },
  {
    id: "tpl-7",
    slug: "monogram-elegance",
    name: "Monogram Elegance",
    category: "Sangeet",
    type: "multi-page",
    image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80",
    badge: "Trending",
    style: "Gold Crest & Cream Linen",
    themeColor: "#B45309",
    fontStyle: "Cinzel",
    pages: [
      { title: "Sangeet Night", description: "Bollywood Beats & Dance Performances with Priya & Vikram", bgStyle: "from-amber-950 via-yellow-900 to-amber-900" },
      { title: "Cocktail Bar", description: "Signature Drinks & DJ Set • 8:00 PM Onwards", bgStyle: "from-yellow-950 via-amber-950 to-charcoal" },
    ],
  },
  {
    id: "tpl-8",
    slug: "mehendi-madness",
    name: "Pastel Mehendi Fiesta",
    category: "Mehendi",
    type: "multi-page",
    image: "https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=800&q=80",
    badge: "New",
    style: "Marigold Yellow & Henna Green",
    themeColor: "#CA8A04",
    fontStyle: "Great Vibes",
    pages: [
      { title: "Mehendi Ceremony", description: "Henna, Music & Floral Decor for Ishaan & Radhika", bgStyle: "from-yellow-900 via-amber-800 to-emerald-950" },
      { title: "Dhol & Chooda", description: "Traditional Punjabi Dhol Beats & Bangles Ceremony", bgStyle: "from-emerald-950 via-yellow-900 to-charcoal" },
    ],
  },
];
