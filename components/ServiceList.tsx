import Link from "next/link";
import Photo from "./Photo";
import type { Service } from "@/lib/contentful";

export default function ServiceList({ services }: { services: Service[] }) {
  if (services.length === 0) {
    return <p className="muted">New services are on their way — check back soon.</p>;
  }

  return (
    <div className="grid-3">
      {services.map((s) => (
        <article key={s.slug} className="article">
          <Link href={`/services/${s.slug}`}>
            <Photo
              src={s.smallImage ?? s.bannerImage}
              alt={s.name}
              placeholder="[Service image]"
              className="article__img"
              sizes="(max-width: 900px) 100vw, 380px"
            />
          </Link>
          <div className="article__body">
            <h2 className="h4">{s.name}</h2>
            {s.shortDescription && <p className="muted">{s.shortDescription}</p>}
            <Link href={`/services/${s.slug}`} className="link-arrow">
              Read More →
            </Link>
          </div>
        </article>
      ))}
    </div>
  );
}
