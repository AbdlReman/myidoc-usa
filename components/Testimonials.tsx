"use client";

import { useRef } from "react";
import Icon from "./Icon";
import { testimonials } from "@/lib/content";

const initials = (name: string) =>
  name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

export default function Testimonials() {
  const track = useRef<HTMLDivElement>(null);

  const scroll = (dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.9, behavior: "smooth" });
  };

  return (
    <section id="testimonials" className="section section--blue">
      <div className="container">
        <div className="section-row">
          <div className="section-head section-head--light">
            <div className="eyebrow">What Our Clients Say</div>
            <h2 className="h2">Patient Testimonials</h2>
          </div>
          <div className="carousel-nav">
            <button type="button" className="round-btn round-btn--ghost" aria-label="Previous testimonials" onClick={() => scroll(-1)}>
              <Icon name="arrowLeft" size={20} strokeWidth={2} />
            </button>
            <button type="button" className="round-btn round-btn--solid" aria-label="Next testimonials" onClick={() => scroll(1)}>
              <Icon name="arrowRight" size={20} strokeWidth={2} />
            </button>
          </div>
        </div>

        <div ref={track} className="carousel" tabIndex={0} aria-label="Testimonials">
          {testimonials.map((t) => (
            <figure key={t.name} className="quote">
              <div className="stars" aria-label="5 out of 5 stars">
                ★★★★★
              </div>
              <blockquote>“{t.quote}”</blockquote>
              <figcaption>
                <span className="avatar" aria-hidden="true">
                  {initials(t.name)}
                </span>
                <span>
                  <strong>{t.name}</strong>
                  <small>{t.role}</small>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
