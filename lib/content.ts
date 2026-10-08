// All site copy and links in one place — edit here, not in components.

export const site = {
  name: "MYiDocUSA",
  bookingUrl: "https://myidocusa.janeapp.com/",
  email: "admin@myidocusa.com",
  address: ["501 S Cherry St, Suite 1100", "Denver, CO 80246"],
  termsUrl: "https://www.myidocusa.com/terms-conditions/",
  privacyUrl: "https://www.myidocusa.com/legal/privacy-policy/",
  social: {
    facebook: "https://www.facebook.com/MYiDocUSA/",
    youtube: "https://www.youtube.com/@MYiDocUSA/",
    linkedin: "https://www.linkedin.com/company/myidocusa/about/",
    instagram: "https://www.instagram.com/myidocusa/",
  },
} as const;

export const nav = [
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Doctors", href: "#doctors" },
  { label: "Blog", href: "#news" },
  { label: "Contact", href: "#contact" },
] as const;

export const hero = {
  eyebrow: "Welcome to MYiDOCUSA",
  title: "Your Online Platform for Cancer Coaching",
  text: "MYiDOCUSA offers one-on-one personalized coaching to help you navigate diagnosis, treatment, and survivorship with confidence — with direct access to a cancer coach and expert.",
  badgeTitle: "Board-Certified",
  badgeText: "Oncology & Hematology",
  // Put your photo in /public/images and set the path, e.g. "/images/hero-doctor.jpg"
  image: null as string | null,
};

export type IconName =
  | "clock"
  | "video"
  | "file"
  | "heart"
  | "drop"
  | "leaf"
  | "shield"
  | "mail"
  | "pin"
  | "facebook"
  | "youtube"
  | "linkedin"
  | "instagram"
  | "menu"
  | "close"
  | "arrowLeft"
  | "arrowRight";

export const trust: { icon: IconName; label: string }[] = [
  { icon: "clock", label: "Dedicated 1-hour sessions" },
  { icon: "video", label: "Secure video, from home" },
  { icon: "file", label: "Records reviewed in advance" },
  { icon: "heart", label: "USA-trained specialists" },
];

export const services: { icon: IconName; title: string; text: string; href: string }[] = [
  {
    icon: "heart",
    title: "Cancer Care & Support",
    text: "Understand your diagnosis, pathology and treatment options, and prepare for decisions with your oncology team.",
    href: "#",
  },
  {
    icon: "drop",
    title: "Hematology & Blood Disorders",
    text: "Expert consultations on anemia, clotting, platelet and other blood disorders, explained in plain language.",
    href: "#",
  },
  {
    icon: "leaf",
    title: "Cancer Nutrition",
    text: "Practical, evidence-based nutrition guidance before, during and after cancer treatment.",
    href: "#",
  },
];

export const steps = [
  { title: "Book your session", text: "Choose a time online and complete a short intake form." },
  { title: "Share your records", text: "Securely upload reports and note your questions ahead of time." },
  { title: "Meet your specialist", text: "An unhurried hour by secure video, focused entirely on you." },
];

export const doctor = {
  name: "Dr. Muhammad Raza Naqvi",
  specialty: "Oncology · Hematology",
  bio: "[Short professional bio — board certifications, training, years of experience, and areas of special interest in cancer and blood disorders.]",
  tags: ["[Board certification]", "[Fellowship]", "[Hospital affiliation]"],
  bookLabel: "Book with Dr. Naqvi",
  image: null as string | null,
};

export const testimonials = [
  {
    quote:
      "Professional, caring, and knowledgeable staff. They provided excellent care for my cancer treatment and were always available to answer my questions.",
    name: "Michael Chen",
    role: "Patient",
  },
  {
    quote:
      "I'm grateful for the personalized treatment plan and the ongoing support from the MYiDocUSA team. They truly care about their patients' well-being.",
    name: "Emily Rodriguez",
    role: "Patient",
  },
];

export const articles: { category: string; title: string; href: string; image: string | null }[] = [
  { category: "Cancer Prevention", title: "Prevent Colorectal Cancer: A Complete Guide to Early Prevention", href: "#", image: null },
  { category: "Medical", title: "Breast Cancer: Insights from an Oncologist's Perspective", href: "#", image: null },
  { category: "Medical", title: "Top Telemedicine Clinics in the USA 2026", href: "#", image: null },
];

export const disclaimer =
  "Our website content is not intended to replace the advice or treatment provided by your local healthcare provider. Continue to rely on your local healthcare provider for routine medical care, including physical examinations, diagnostic testing, and follow-up care. Seek immediate medical attention at your local emergency department if you experience a medical emergency. By using our services, you acknowledge that our doctors are not your primary care physicians. Our services are intended to supplement, not replace, the care provided by your local healthcare provider.";
