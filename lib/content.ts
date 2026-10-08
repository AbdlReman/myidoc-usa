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
  {
    label: "About",
    href: "/about",
    children: [
      { label: "About Us", href: "/about" },
      { label: "Our Mission", href: "/about/mission" },
      { label: "FAQs", href: "/faqs" },
    ],
  },
  {
    label: "Services",
    href: "/services",
    children: [
      { label: "Our Services", href: "/services" },
      { label: "Cancer Support", href: "/cancer" },
      { label: "Hematology", href: "/hematology" },
    ],
  },
  { label: "Doctors", href: "/doctors" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
] as const;

export const hero = {
  eyebrow: "Welcome to MYiDOCUSA",
  title: "Your Online Platform for Cancer Coaching",
  text: "MYiDOCUSA offers one-on-one personalized coaching to help you navigate diagnosis, treatment, and survivorship with confidence — with direct access to a cancer coach and expert.",
  badgeTitle: "Board-Certified",
  badgeText: "Oncology & Hematology",
  // Put your photo in /public/images and set the path, e.g. "/images/hero-doctor.jpg"
  image: "/images/doctor-raza-naqvi.png" as string | null,
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
  | "arrowRight"
  | "chevronDown";

export const trust: { icon: IconName; label: string }[] = [
  { icon: "clock", label: "Dedicated 1-hour sessions" },
  { icon: "video", label: "Secure video, from home" },
  { icon: "file", label: "Records reviewed in advance" },
  { icon: "heart", label: "USA-trained specialists" },
];

export const services: { title: string; text: string; href: string; image: string | null }[] = [
  {
    title: "Cancer Support & Care",
    text: "Understand your diagnosis, pathology and treatment options, and prepare for decisions with your oncology team.",
    href: "/cancer",
    // Put your photo in /public/images and set the path, e.g. "/images/cancer-care.jpg"
    image: null,
  },
  {
    title: "Hematology & Blood Disorders",
    text: "Expert consultations on anemia, clotting, platelet and other blood disorders, explained in plain language.",
    href: "/hematology",
    // Put your photo in /public/images and set the path, e.g. "/images/hematology.jpg"
    image: null,
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
  image: "/images/doctor-raza-naqvi.png" as string | null,
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

export const about = {
  eyebrow: "About MYiDocUSA",
  title: "Specialist cancer & hematology support, built around your schedule",
  intro:
    "MYiDocUSA connects patients with board-certified, USA-trained oncology and hematology specialists for focused, one-on-one virtual consultations — for people who want more time, clearer answers, and support that goes beyond a rushed office visit.",
  mission: {
    title: "Our Mission",
    text: "To make expert cancer, hematology and nutrition guidance accessible from anywhere in the USA, with the time and personal attention every patient deserves.",
  },
  values: [
    {
      icon: "clock" as IconName,
      title: "Patient-first consultations",
      text: "Every session is a dedicated, unhurried hour — not a rushed hallway consult.",
    },
    {
      icon: "shield" as IconName,
      title: "Board-certified expertise",
      text: "Specialists trained and certified in the USA, with deep experience in oncology and hematology.",
    },
    {
      icon: "heart" as IconName,
      title: "Whole-person support",
      text: "Guidance that covers diagnosis, treatment decisions and nutrition — not just prescriptions.",
    },
    {
      icon: "video" as IconName,
      title: "Secure & convenient",
      text: "Private video visits from home, with your records reviewed ahead of time.",
    },
  ],
};

export const faqs = [
  {
    q: "How does an online consultation with MYiDocUSA work?",
    a: "You book a time online, complete a short intake form and securely share any relevant records. At your scheduled time, you'll meet your specialist for a dedicated, one-hour video visit.",
  },
  {
    q: "Who are the specialists on MYiDocUSA?",
    a: "Our consultations are led by board-certified, USA-trained oncology and hematology specialists with experience across diagnosis, treatment planning and survivorship care.",
  },
  {
    q: "What can I expect to cover in a session?",
    a: "Sessions typically cover your diagnosis and pathology, treatment options, second opinions, blood disorder questions, and cancer nutrition — whatever is most relevant to you, in plain language.",
  },
  {
    q: "Is this a replacement for my local doctor?",
    a: "No. MYiDocUSA is designed to supplement, not replace, the care provided by your local healthcare provider. Continue to rely on your local provider for routine care, and seek emergency care immediately if needed.",
  },
  {
    q: "Is my information kept private and secure?",
    a: "Yes. Visits take place over secure video, and any records you share are used only to prepare for and support your consultation.",
  },
  {
    q: "What do I do in a medical emergency?",
    a: "MYiDocUSA consultations are not for emergencies. If you are experiencing a medical emergency, call 911 or go to your nearest emergency department immediately.",
  },
] as const;

export const contact = {
  eyebrow: "Get In Touch",
  title: "We're here to help",
  text: "Have a question about a consultation, your records, or how MYiDocUSA works? Reach out and our team will get back to you.",
};

export const disclaimer =
  "Our website content is not intended to replace the advice or treatment provided by your local healthcare provider. Continue to rely on your local healthcare provider for routine medical care, including physical examinations, diagnostic testing, and follow-up care. Seek immediate medical attention at your local emergency department if you experience a medical emergency. By using our services, you acknowledge that our doctors are not your primary care physicians. Our services are intended to supplement, not replace, the care provided by your local healthcare provider.";
