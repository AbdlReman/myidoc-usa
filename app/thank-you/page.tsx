import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import PageHero from "@/components/PageHero";
import Footer from "@/components/Footer";
import Icon from "@/components/Icon";
import { site } from "@/lib/content";

export const metadata: Metadata = {
  title: "Thank You for Subscribing | MYiDocUSA",
  description: "You're subscribed — here's what to expect next from MYiDocUSA.",
  robots: { index: false, follow: true },
};

export default function ThankYouPage() {
  return (
    <>
      <Header />
      <main id="main">
        <PageHero eyebrow="You're In" title="Thank You for Subscribing" crumb="Thank You" />
        <section className="section">
          <div className="container post" style={{ textAlign: "center", maxWidth: 640 }}>
            <Icon name="heart" size={48} style={{ color: "var(--primary)", marginBottom: 16 }} />
            <p>
              We've sent a welcome email to your inbox. Over the next couple of weeks you'll hear a bit more from us
              about how MyIDocUSA's one-on-one cancer coaching, hematology/oncology consultations, and nutrition
              support work — and how to book a virtual visit whenever you're ready.
            </p>
            <p>
              These emails are for general information only and are not a substitute for medical advice. If you are
              experiencing a medical emergency, call 911.
            </p>
            <p style={{ marginTop: 28 }}>
              <a className="btn btn--primary btn--lg" href={site.bookingUrl} target="_blank" rel="noopener noreferrer">
                Book An Appointment
              </a>
            </p>
            <p style={{ marginTop: 16 }}>
              <Link href="/">Return to the homepage</Link>
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
