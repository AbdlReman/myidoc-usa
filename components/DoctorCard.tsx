import Link from "next/link";
import Icon from "./Icon";
import Photo from "./Photo";
import { site } from "@/lib/content";
import { excerpt, type Doctor } from "@/lib/contentful";

function titleCase(value: string) {
  return value.replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function DoctorCard({ doctor }: { doctor: Doctor }) {
  const bio = excerpt(doctor.generalInfo, 160);

  return (
    <article className="doctor">
      <Link href={`/doctors/${doctor.slug}`} className="doctor__photo-link">
        <Photo
          src={doctor.image ?? "/images/doctor-raza-naqvi.png"}
          alt={doctor.name}
          placeholder="[Doctor headshot]"
          className="doctor__photo"
          fit="cover"
          sizes="(max-width: 900px) 100vw, 300px"
        />
      </Link>
      <div className="doctor__body">
        {doctor.specialization && <div className="doctor__spec">{doctor.specialization}</div>}
        <h3 className="doctor__name">{doctor.name}</h3>
        {bio && <p className="doctor__bio">{bio}</p>}
        {doctor.doctorStates.length > 0 && (
          <ul className="tags">
            {doctor.doctorStates.map((stateName) => (
              <li key={stateName} className="tag">
                {titleCase(stateName)}
              </li>
            ))}
          </ul>
        )}
        <div className="doctor__actions">
          <Link href={`/doctors/${doctor.slug}`} className="link-arrow">
            View Full Profile →
          </Link>
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
  );
}
