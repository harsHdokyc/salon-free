import team1 from "@/assets/team1.jpg";
import team2 from "@/assets/team2.jpg";
import team3 from "@/assets/team3.jpg";
import cut from "@/assets/cut.jpg";
import color from "@/assets/color.jpg";
import skin from "@/assets/skin.jpg";
import nails from "@/assets/nails.jpg";
import bridal from "@/assets/bridal.jpg";
import hero from "@/assets/hero.jpg";
import interior from "@/assets/interior.jpg";

export const SALON = {
  name: "Rochers",
  city: "Delhi",
  address: "14, Meherchand Market, Lodhi Colony, New Delhi 110003",
  phone: "+91 98100 00000",
  whatsapp: "919810000000",
  instagram: "https://instagram.com/rochers.delhi",
  email: "hello@rochers.in",
  hours: [
    ["Tuesday – Friday", "10:00 – 20:00"],
    ["Saturday – Sunday", "09:00 – 21:00"],
    ["Monday", "Closed"],
  ] as const,
};

export type Category = "Hair" | "Color" | "Skin" | "Nails" | "Bridal";
export type Service = { id: string; category: Category; name: string; desc: string; duration: number; price: number };

export const CATEGORIES: { name: Category; image: string; line: string }[] = [
  { name: "Hair", image: cut, line: "Precision cuts and soft, lived-in shapes." },
  { name: "Color", image: color, line: "Hand-painted tones that grow out beautifully." },
  { name: "Skin", image: skin, line: "Slow, results-led rituals for real skin." },
  { name: "Nails", image: nails, line: "Clean, quiet, perfectly kept hands." },
  { name: "Bridal", image: bridal, line: "Your day, composed with calm and care." },
];

export const SERVICES: Service[] = [
  { id: "signature-cut", category: "Hair", name: "Signature Cut & Style", desc: "Consultation, wash, precision cut and blow-dry finish.", duration: 60, price: 2500 },
  { id: "restyle", category: "Hair", name: "Restyle Transformation", desc: "A complete change of shape, mapped to your face and texture.", duration: 90, price: 3800 },
  { id: "blowout", category: "Hair", name: "Editorial Blow-dry", desc: "Volume, bounce and polish that lasts for days.", duration: 45, price: 1600 },
  { id: "keratin", category: "Hair", name: "Keratin Smoothing", desc: "Frizz-free, glassy lengths for up to four months.", duration: 150, price: 8500 },
  { id: "balayage", category: "Color", name: "Hand-painted Balayage", desc: "Sun-soft dimension, painted freehand for a natural grow-out.", duration: 180, price: 9500 },
  { id: "global", category: "Color", name: "Global Colour", desc: "Rich, even colour from root to tip with a gloss finish.", duration: 120, price: 5500 },
  { id: "gloss", category: "Color", name: "Gloss & Tone", desc: "Refresh brassiness and restore shine between colours.", duration: 45, price: 2200 },
  { id: "facial", category: "Skin", name: "Rochers Ritual Facial", desc: "Double cleanse, enzyme peel, sculpting massage and mask.", duration: 75, price: 4200 },
  { id: "hydra", category: "Skin", name: "Hydra Glow", desc: "Deep hydration and gentle extraction for luminous skin.", duration: 60, price: 5200 },
  { id: "brows", category: "Skin", name: "Brow Sculpt & Tint", desc: "Mapped shaping and a soft tint for fuller brows.", duration: 30, price: 1200 },
  { id: "manicure", category: "Nails", name: "Signature Manicure", desc: "Shape, cuticle care, massage and classic polish.", duration: 45, price: 1400 },
  { id: "gel", category: "Nails", name: "Gel Manicure", desc: "Chip-resistant colour with a mirror-shine finish.", duration: 60, price: 2000 },
  { id: "pedicure", category: "Nails", name: "Spa Pedicure", desc: "Soak, scrub, mask and polish. Pure restoration.", duration: 60, price: 2200 },
  { id: "bridal-trial", category: "Bridal", name: "Bridal Trial", desc: "Hair and makeup trial with a look-book consultation.", duration: 120, price: 7500 },
  { id: "bridal-day", category: "Bridal", name: "Wedding Day Hair & Makeup", desc: "Complete bridal look with touch-up kit.", duration: 180, price: 28000 },
  { id: "bridal-party", category: "Bridal", name: "Bridal Party (per guest)", desc: "Hair or makeup for family and bridesmaids.", duration: 60, price: 4500 },
];

export type Stylist = { id: string; name: string; role: string; specialty: string; image: string; alt: string };
export const TEAM: Stylist[] = [
  { id: "ananya", name: "Ananya Kapoor", role: "Creative Director", specialty: "Precision cuts & bobs", image: team1, alt: cut },
  { id: "kabir", name: "Kabir Malhotra", role: "Senior Colourist", specialty: "Balayage & lived-in colour", image: team2, alt: color },
  { id: "meher", name: "Meher Sethi", role: "Skin & Bridal Artist", specialty: "Bridal makeup & facials", image: team3, alt: bridal },
];

export const GALLERY = [
  { src: hero, label: "Soft volume, brunette gloss", tall: false },
  { src: cut, label: "Glass bob", tall: true },
  { src: bridal, label: "Bridal low bun with mogra", tall: true },
  { src: nails, label: "Clay & nude gel set", tall: false },
  { src: color, label: "Balayage in progress", tall: true },
  { src: interior, label: "The Lodhi Colony studio", tall: true },
  { src: skin, label: "Ritual facial", tall: true },
  { src: team1, label: "Ananya, Creative Director", tall: true },
];

export const TESTIMONIALS = [
  { quote: "Kabir gave me the balayage I have been describing to stylists for five years. Grew out like a dream.", name: "Ishita R.", detail: "Hand-painted balayage" },
  { quote: "The calmest hour of my month. The space, the people, the coffee — everything feels considered.", name: "Naina S.", detail: "Ritual facial" },
  { quote: "Meher did my wedding look and I still get stopped by people asking who did it.", name: "Aditi M.", detail: "Bridal" },
];

export const FAQS = [
  { q: "Do I need to book in advance?", a: "We recommend booking at least two days ahead, and four to six weeks for bridal. Same-day slots open up often — message us on WhatsApp." },
  { q: "What is your cancellation policy?", a: "Please let us know at least 24 hours before your appointment so we can offer the slot to someone else." },
  { q: "Which products do you use?", a: "We work with professional, low-tox colour and care lines, and we'll always talk you through what goes on your hair and skin." },
  { q: "Do you offer consultations?", a: "Yes. Colour and restyle consultations are complimentary — book a 15-minute slot or simply walk in." },
  { q: "Is there parking nearby?", a: "Meherchand Market has paid parking just outside, and the studio is a short walk from JLN Stadium metro." },
  { q: "Can I book for a group?", a: "Absolutely. For bridal parties or groups of three or more, call or WhatsApp us and we'll plan the day around you." },
];

export const SLOTS = ["10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00"];

export const formatINR = (n: number) => "₹" + n.toLocaleString("en-IN");
export const formatDuration = (m: number) => (m < 60 ? `${m} min` : `${Math.floor(m / 60)} hr${m % 60 ? ` ${m % 60} min` : ""}`);
