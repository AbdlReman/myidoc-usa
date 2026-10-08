import type { Metadata } from "next";
import Header from "@/components/Header";
import PageHero from "@/components/PageHero";
import Footer from "@/components/Footer";
import ServiceList from "@/components/ServiceList";
import { getServices } from "@/lib/contentful";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Cancer Services | MYiDocUSA",
  description:
    "Online consultations for cancer diagnosis, treatment planning and survivorship, led by board-certified oncology specialists.",
};

export default async function CancerPage() {
  const services = await getServices("Cancer");

  return (
    <>
      <Header />
      <main id="main">
        <PageHero eyebrow="Cancer Care" title="Cancer Services" crumb="Cancer Services" />
        <section className="section">
          <div className="container">
            <ServiceList services={services} />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
