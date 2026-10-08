import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import Header from "@/components/Header";
import PageHero from "@/components/PageHero";
import Footer from "@/components/Footer";
import Photo from "@/components/Photo";
import Icon from "@/components/Icon";
import { site } from "@/lib/content";
import { getDoctor, getDoctors } from "@/lib/contentful";

export const revalidate = 300;

type Props = { params: Promise<{ slug: string }> };

function titleCase(value: string) {
  return value.replace(/\b\w/g, (c) => c.toUpperCase());
}

export async function generateStaticParams() {
  const doctors = await getDoctors();
  return doctors.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const doctor = await getDoctor(slug);
  if (!doctor) return {};
  return {
    title: `${doctor.metaTitle || doctor.name} | MYiDocUSA`,
    description: doctor.metaDescription || undefined,
  };
}

export default async function DoctorDetailPage({ params }: Props) {
  const { slug } = await params;
  const doctor = await getDoctor(slug);
  if (!doctor) notFound();

  return (
    <>
      <Header />
      <main id="main">
        <PageHero
          eyebrow="Our Specialists"
          title={doctor.name}
          crumb={doctor.name}
          parent={{ label: "Doctors", href: "/doctors" }}
        />
        <section className="section">
          <div className="container">
            <article className="doctor">
              <Photo
                src={doctor.image}
                alt={doctor.name}
                placeholder="[Doctor headshot]"
                className="doctor__photo"
                fit="contain"
                sizes="(max-width: 900px) 100vw, 400px"
                priority
              />
              <div className="doctor__body">
                {doctor.specialization && <div className="doctor__spec">{doctor.specialization}</div>}
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
          </div>
        </section>

        {(doctor.generalInfo || doctor.additionalDetail) && (
          <section className="section section--tint">
            <div className="container post">
              {doctor.generalInfo && <div className="post__content">{documentToReactComponents(doctor.generalInfo)}</div>}
              {doctor.additionalDetail && (
                <div className="post__content">{documentToReactComponents(doctor.additionalDetail)}</div>
              )}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
