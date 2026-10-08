import Icon from "./Icon";
import Photo from "./Photo";
import { hero, site } from "@/lib/content";

export default function Hero() {
  return (
    <section id="top" className="hero">
      <div className="hero__ring hero__ring--lg" aria-hidden="true" />
      <div className="hero__ring hero__ring--sm" aria-hidden="true" />
      <div className="container hero__inner">
        <div className="hero__copy">
          <div className="pill">
            <span className="pill__dot" />
            {hero.eyebrow}
          </div>
          <h1 className="hero__title">{hero.title}</h1>
          <p className="hero__text">{hero.text}</p>
          <div className="hero__ctas">
            <a href={site.bookingUrl} className="btn btn--gold btn--lg">
              Book An Appointment
            </a>
            <a href="#how" className="btn btn--outline-light btn--lg">
              How It Works
            </a>
          </div>
        </div>

        <div className="hero__media">
          <Photo
            src={hero.image}
            alt="Dr. Muhammad Raza Naqvi, MYiDocUSA cancer specialist"
            placeholder="[Professional portrait — doctor in white coat, soft background]"
            className="hero__photo"
            priority
            fit="contain"
            sizes="(max-width: 900px) 100vw, 470px"
          />
          <div className="hero__badge">
            <span className="icon-tile icon-tile--sm">
              <Icon name="shield" size={22} strokeWidth={2} />
            </span>
            <span>
              <strong>{hero.badgeTitle}</strong>
              <small>{hero.badgeText}</small>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
