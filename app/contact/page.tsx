import type { Metadata } from "next";
import Header from "@/components/Header";
import PageHero from "@/components/PageHero";
import Footer from "@/components/Footer";
import Icon from "@/components/Icon";
import { contact, site } from "@/lib/content";

export const metadata: Metadata = {
  title: "Contact Us | MYiDocUSA",
  description: "Get in touch with MYiDocUSA or schedule a consultation with a board-certified oncology and hematology specialist.",
};

export default function ContactPage() {
  return (
    <>
      <Header />
      <main id="main">
        <PageHero eyebrow={contact.eyebrow} title="Contact Us" crumb="Contact" />

        <section className="section">
          <div className="container split">
            <div className="split__text">
              <div className="section-head">
                <h2 className="h2">{contact.title}</h2>
                <p className="lead">{contact.text}</p>
              </div>

              <ul className="contact-list">
                <li>
                  <Icon name="mail" size={20} strokeWidth={2} />
                  <span>
                    <strong>Email</strong>
                    <a href={`mailto:${site.email}`}>{site.email}</a>
                  </span>
                </li>
                <li>
                  <Icon name="pin" size={20} strokeWidth={2} />
                  <span>
                    <strong>Address</strong>
                    <span>
                      {site.address[0]}
                      <br />
                      {site.address[1]}
                    </span>
                  </span>
                </li>
              </ul>

              <div className="socials" style={{ marginTop: 28 }}>
                <a href={site.social.facebook} aria-label="Facebook" className="social" target="_blank" rel="noopener noreferrer">
                  <Icon name="facebook" size={15} strokeWidth={2.2} />
                </a>
                <a href={site.social.linkedin} aria-label="LinkedIn" className="social" target="_blank" rel="noopener noreferrer">
                  <Icon name="linkedin" size={15} strokeWidth={2.2} />
                </a>
                <a href={site.social.youtube} aria-label="YouTube" className="social" target="_blank" rel="noopener noreferrer">
                  <Icon name="youtube" size={15} strokeWidth={2.2} />
                </a>
                <a href={site.social.instagram} aria-label="Instagram" className="social" target="_blank" rel="noopener noreferrer">
                  <Icon name="instagram" size={15} strokeWidth={2.2} />
                </a>
              </div>
            </div>

            <div className="contact-banner" style={{ flex: "1 1 380px" }}>
              <span className="icon-tile" style={{ background: "rgba(255,255,255,.12)", color: "#fff" }}>
                <Icon name="video" size={26} />
              </span>
              <h3 className="h4" style={{ color: "#fff" }}>
                Ready to talk to a specialist?
              </h3>
              <p>
                Book a dedicated, one-hour virtual consultation with a board-certified oncology or hematology specialist —
                from the comfort of your home.
              </p>
              <a href={site.bookingUrl} className="btn btn--gold btn--lg">
                Schedule a Consultation
              </a>
              <p style={{ fontSize: 14, color: "var(--lavender-100)" }}>
                Medical emergency? Please call <strong style={{ color: "#fff" }}>911</strong>.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
