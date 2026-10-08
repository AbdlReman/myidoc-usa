import type { Metadata } from "next";
import Header from "@/components/Header";
import PageHero from "@/components/PageHero";
import Footer from "@/components/Footer";
import { Doctor } from "@/components/Sections";

export const metadata: Metadata = {
  title: "Our Doctors | MYiDocUSA",
  description: "Meet the board-certified oncology and hematology specialists behind MYiDocUSA's virtual consultations.",
};

export default function DoctorsPage() {
  return (
    <>
      <Header />
      <main id="main">
        <PageHero eyebrow="Our Specialists" title="Our Doctors" crumb="Doctors" />
        <Doctor />
      </main>
      <Footer />
    </>
  );
}
