import Header from "@/components/Header";
import Hero from "@/components/Hero";
import { Doctor, HowItWorks, News, Services, TrustStrip } from "@/components/Sections";
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
        <Services />
        <HowItWorks />
        <Doctor />
        <Testimonials />
        <News />
        <Newsletter />
      </main>
      <Footer />
    </>
  );
}
