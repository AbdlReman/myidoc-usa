import Header from "@/components/Header";
import Hero from "@/components/Hero";
import { HowItWorks, TrustStrip } from "@/components/Sections";
import DoctorSection from "@/components/DoctorSection";
import Testimonials from "@/components/Testimonials";
import LatestBlog from "@/components/LatestBlog";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";

export const revalidate = 300;

export default function Home() {
  return (
    <>
      <Header />
      <main id="main">
        <Hero />
        <TrustStrip />
        <HowItWorks />
        <DoctorSection limit={1} hideIfEmpty />
        <Testimonials />
        <LatestBlog />
        <Newsletter />
      </main>
      <Footer />
    </>
  );
}
