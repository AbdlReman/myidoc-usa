import type { Metadata } from "next";
import Header from "@/components/Header";
import PageHero from "@/components/PageHero";
import Footer from "@/components/Footer";
import Icon from "@/components/Icon";
import { about, site } from "@/lib/content";

export const metadata: Metadata = {
  title: "Our Mission | MYiDocUSA",
  description: about.mission.text,
};

export default function MissionPage() {
  return (
    <>
      <Header />
      <main id="main">
        <PageHero
          eyebrow="Our Mission"
          title="Our Mission"
          crumb="Our Mission"
          parent={{ label: "About", href: "/about" }}
        />

        <section className="section">
          <div className="container">
            <div className="section-head section-head--center">
              <p className="lead" style={{ margin: 0 }}>
                {about.mission.text}
              </p>
            </div>
          </div>
        </section>

        <section className="section section--tint">
          <div className="container">
            <div className="section-head section-head--center">
              <div className="eyebrow">What Drives Us</div>
              <h2 className="h2">The Principles Behind Every Consultation</h2>
            </div>
            <div className="values">
              {about.values.map((v) => (
                <article key={v.title} className="card">
                  <span className="icon-tile">
                    <Icon name={v.icon} size={26} />
                  </span>
                  <h3 className="h4">{v.title}</h3>
                  <p className="muted" style={{ marginBottom: 0 }}>
                    {v.text}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container" style={{ textAlign: "center" }}>
            <a href={site.bookingUrl} className="btn btn--gold btn--lg">
              Schedule a Consultation
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
