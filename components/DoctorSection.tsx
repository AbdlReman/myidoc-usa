import { SectionHead } from "./Sections";
import DoctorCard from "./DoctorCard";
import { getDoctors } from "@/lib/contentful";

export default async function DoctorSection({
  limit,
  tint = true,
  hideIfEmpty = false,
}: {
  limit?: number;
  tint?: boolean;
  hideIfEmpty?: boolean;
}) {
  const doctors = await getDoctors();
  const shown = limit ? doctors.slice(0, limit) : doctors;
  if (shown.length === 0 && hideIfEmpty) return null;

  return (
    <section id="doctors" className={`section ${tint ? "section--tint" : ""}`}>
      <div className="container">
        <SectionHead center eyebrow="Our Specialists" title="Meet Our Expert Doctors" />
        {shown.length > 0 ? (
          <div className="doctor-list">
            {shown.map((doc) => (
              <DoctorCard key={doc.slug} doctor={doc} />
            ))}
          </div>
        ) : (
          <p className="muted">Our specialist profiles are on their way — check back soon.</p>
        )}
      </div>
    </section>
  );
}
