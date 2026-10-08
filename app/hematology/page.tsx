import type { Metadata } from "next";
import Header from "@/components/Header";
import PageHero from "@/components/PageHero";
import Footer from "@/components/Footer";
import ServiceList from "@/components/ServiceList";
import { getServices } from "@/lib/contentful";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Hematology Services | MYiDocUSA",
  description:
    "Online consultations for anemia, clotting disorders, leukemia, lymphoma and other blood conditions, led by board-certified hematology specialists.",
};

export default async function HematologyPage() {
  const services = await getServices("Hematology");

  return (
    <>
      <Header />
      <main id="main">
        <PageHero eyebrow="Blood Disorders" title="Hematology Services" crumb="Hematology" />
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
