import Link from "next/link";
import Icon from "./Icon";
import Photo from "./Photo";
import { doctor, services, site, steps, trust } from "@/lib/content";

function SectionHead({ eyebrow, title, text, center = false, light = false }: {
  eyebrow: string;
  title: string;
  text?: string;
  center?: boolean;
  light?: boolean;
}) {
  return (
    <div className={`section-head ${center ? "section-head--center" : ""} ${light ? "section-head--light" : ""}`}>
      <div className="eyebrow">{eyebrow}</div>
      <h2 className="h2">{title}</h2>
      {text && <p className="lead">{text}</p>}
    </div>
  );
}

export function TrustStrip() {
  return (
    <section className="trust" aria-label="Why patients choose us">
      <div className="container trust__grid">
        {trust.map((t) => (
          <div key={t.label} className="trust__item">
            <Icon name={t.icon} size={26} />
            <span>{t.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export function Services() {
  return (
    <section id="services" className="section section--tint">
      <div className="container">
        <SectionHead
          center
          eyebrow="Our Health Services"
          title="Comprehensive Cancer, Hematology & Nutrition Support"
          text="Specialist guidance for patients at every stage — from initial diagnosis through survivorship."
        />
        <div className="grid-3">
          {services.map((s) => (
            <article key={s.title} className="card">
              <span className="icon-tile">
                <Icon name={s.icon} size={28} />
              </span>
              <h3 className="h3">{s.title}</h3>
              <p className="muted">{s.text}</p>
              <Link href="/services" className="link-arrow">
                Learn more →
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HowItWorks() {
  return (
    <section id="how" className="section">
      <div className="container split">
        <div className="split__text">
          <SectionHead
            eyebrow="How It Works"
            title="Time beyond the typical 20-minute oncology visit"
            text="Each consultation is a dedicated hour with a board-certified oncologist and cancer coach — your chance to feel heard, gain reassurance, and take your next steps with confidence and clarity."
          />
          <a href={site.bookingUrl} className="btn btn--gold btn--lg">
            Schedule a Consultation
          </a>
        </div>
        <ol className="steps">
          {steps.map((s, i) => (
            <li key={s.title} className="step">
              <span className="step__num">{i + 1}</span>
              <div>
                <h3 className="h4">{s.title}</h3>
                <p>{s.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function Doctor() {
  return (
    <section id="doctors" className="section section--tint">
      <div className="container">
        <SectionHead center eyebrow="Our Specialists" title="Meet Our Expert Doctors" />
        <article className="doctor">
          <Photo
            src={doctor.image}
            alt={doctor.name}
            placeholder="[Doctor headshot]"
            className="doctor__photo"
            sizes="(max-width: 900px) 100vw, 400px"
          />
          <div className="doctor__body">
            <div className="doctor__spec">{doctor.specialty}</div>
            <h3 className="doctor__name">{doctor.name}</h3>
            <p className="doctor__bio">{doctor.bio}</p>
            <ul className="tags">
              {doctor.tags.map((t) => (
                <li key={t} className="tag">
                  {t}
                </li>
              ))}
            </ul>
            <div className="doctor__actions">
              <a href={site.bookingUrl} className="btn btn--gold">
                {doctor.bookLabel}
              </a>
              <div className="socials">
                <a href={site.social.facebook} aria-label="Facebook" className="social">
                  <Icon name="facebook" size={15} strokeWidth={2.2} />
                </a>
                <a href={site.social.linkedin} aria-label="LinkedIn" className="social">
                  <Icon name="linkedin" size={15} strokeWidth={2.2} />
                </a>
                <a href={site.social.youtube} aria-label="YouTube" className="social">
                  <Icon name="youtube" size={15} strokeWidth={2.2} />
                </a>
              </div>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
