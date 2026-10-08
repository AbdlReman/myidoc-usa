import type { Metadata } from "next";
import Header from "@/components/Header";
import PageHero from "@/components/PageHero";
import Footer from "@/components/Footer";
import { Services, HowItWorks } from "@/components/Sections";

export const metadata: Metadata = {
  title: "Our Services | MYiDocUSA",
  description:
    "Online cancer care, hematology consultations and cancer nutrition guidance from board-certified, USA-trained specialists.",
};

export default function ServicesPage() {
  return (
    <>
      <Header />
      <main id="main">
        <PageHero eyebrow="What We Offer" title="Our Services" crumb="Services" />
        <Services />
        <HowItWorks />
      </main>
      <Footer />
    </>
  );
}
