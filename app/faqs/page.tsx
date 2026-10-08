import type { Metadata } from "next";
import Header from "@/components/Header";
import PageHero from "@/components/PageHero";
import Footer from "@/components/Footer";
import { faqs, site } from "@/lib/content";

export const metadata: Metadata = {
  title: "FAQs | MYiDocUSA",
  description: "Answers to common questions about booking, privacy and what to expect from a MYiDocUSA consultation.",
};

export default function FAQsPage() {
  return (
    <>
      <Header />
      <main id="main">
        <PageHero
          eyebrow="Frequently Asked Questions"
          title="FAQs"
          crumb="FAQs"
          parent={{ label: "About", href: "/about" }}
        />

        <section className="section">
          <div className="container" style={{ maxWidth: 820, marginLeft: "auto", marginRight: "auto" }}>
            <div className="faq-list">
              {faqs.map((item) => (
                <details key={item.q} className="faq-item">
                  <summary>{item.q}</summary>
                  <p>{item.a}</p>
                </details>
              ))}
            </div>

            <div className="section-head section-head--center" style={{ marginTop: 56, marginBottom: 0 }}>
              <p className="lead">Still have questions?</p>
              <a href={`mailto:${site.email}`} className="btn btn--primary btn--lg">
                Email Us
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
