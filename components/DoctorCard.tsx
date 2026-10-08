import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import Icon from "./Icon";
import Photo from "./Photo";
import { site } from "@/lib/content";
import type { Doctor } from "@/lib/contentful";

function titleCase(value: string) {
  return value.replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function DoctorCard({ doctor }: { doctor: Doctor }) {
  return (
    <article className="doctor">
      <Photo
        src={doctor.image}
        alt={doctor.name}
        placeholder="[Doctor headshot]"
        className="doctor__photo"
        fit="contain"
        sizes="(max-width: 900px) 100vw, 400px"
      />
      <div className="doctor__body">
        {doctor.specialization && <div className="doctor__spec">{doctor.specialization}</div>}
        <h3 className="doctor__name">{doctor.name}</h3>
        {doctor.generalInfo && <div className="doctor__bio">{documentToReactComponents(doctor.generalInfo)}</div>}
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
          <a href={site.bookingUrl} className="btn btn--gold">
            Book with {doctor.name}
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
  );
}
