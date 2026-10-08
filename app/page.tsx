import Header from "@/components/Header";
import Hero from "@/components/Hero";
import { HowItWorks, TrustStrip } from "@/components/Sections";
import Testimonials from "@/components/Testimonials";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main id="main">
        <Hero />
        <TrustStrip />
        <HowItWorks />
        <Testimonials />
        <Newsletter />
      </main>
      <Footer />
    </>
  );
}
