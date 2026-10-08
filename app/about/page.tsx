import type { Metadata } from "next";
import Image from "next/image";
import Header from "@/components/Header";
import PageHero from "@/components/PageHero";
import Footer from "@/components/Footer";
import Icon from "@/components/Icon";
import Photo from "@/components/Photo";
import { TrustStrip } from "@/components/Sections";
import { about, site } from "@/lib/content";

export const metadata: Metadata = {
  title: "About Us | MYiDocUSA",
  description:
    "MYiDocUSA connects patients with board-certified, USA-trained oncology and hematology specialists for focused, one-on-one virtual consultations.",
};

export default function AboutPage() {
  return (
    <>
      <Header />
      <main id="main">
        <PageHero eyebrow={about.eyebrow} title="About Us" crumb="About" />

        <section className="section">
          <div className="container split">
            <div className="about-media">
              <Image
                src="/images/about/about-shape-1.png"
                alt=""
                width={480}
                height={520}
                aria-hidden="true"
                className="about-media__shape-1"
              />
              <Photo
                src="/images/about/about1.jpg"
                alt="MYiDocUSA telehealth specialist"
                placeholder="[About photo]"
                className="about-media__photo"
                sizes="(max-width: 900px) 100vw, 480px"
              />
              <Image
                src="/images/about/about-shape-3.png"
                alt=""
                width={120}
                height={120}
                aria-hidden="true"
                className="about-media__shape-3"
              />
              <Image
                src="/images/about/about-shape-2.png"
                alt=""
                width={200}
                height={400}
                aria-hidden="true"
                className="about-media__shape-2"
              />
            </div>

            <div className="split__text">
              <div className="section-head">
                <div className="eyebrow">{about.eyebrow}</div>
                <h2 className="h2">{about.title}</h2>
                <p className="lead">{about.intro}</p>
              </div>
              <h3 className="h4">{about.mission.title}</h3>
              <p className="muted">{about.mission.text}</p>
              <a href={site.bookingUrl} className="btn btn--gold btn--lg">
                Schedule a Consultation
              </a>
            </div>
          </div>
        </section>

        <TrustStrip />

        <section className="section section--tint">
          <div className="container">
            <div className="section-head section-head--center">
              <div className="eyebrow">Why MYiDocUSA</div>
              <h2 className="h2">What You Can Expect</h2>
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
      </main>
      <Footer />
    </>
  );
}
