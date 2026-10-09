import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Source_Sans_3 } from "next/font/google";
import SubscribePopup from "@/components/SubscribePopup";
import "./globals.css";

const heading = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-heading",
  display: "swap",
});

const body = Source_Sans_3({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.myidocusa.com"),
  title: "Online Cancer & Hematology Consultation Services | MYiDocUSA",
  description:
    "Board-certified hematologist-oncologist providing online cancer coaching, blood disorder consultations, cancer nutrition and extended 1-hour virtual visits across the USA.",
  openGraph: {
    title: "Online Cancer & Hematology Consultation Services | MYiDocUSA",
    description:
      "One-on-one personalized cancer coaching with direct access to a board-certified specialist — from the comfort of your home.",
    url: "https://www.myidocusa.com/",
    siteName: "MYiDocUSA",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#1D4E89",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${heading.variable} ${body.variable}`}>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        {children}
        <SubscribePopup />
      </body>
    </html>
  );
}
