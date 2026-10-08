import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import Header from "@/components/Header";
import PageHero from "@/components/PageHero";
import Footer from "@/components/Footer";
import Photo from "@/components/Photo";
import { getService, getServices } from "@/lib/contentful";

export const revalidate = 300;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const services = await getServices();
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = await getService(slug);
  if (!service) return {};
  return {
    title: `${service.metaTitle || service.name} | MYiDocUSA`,
    description: service.metaDescription || undefined,
  };
}

const CATEGORY_HUB: Record<string, { label: string; href: string }> = {
  Cancer: { label: "Cancer Services", href: "/cancer" },
  Hematology: { label: "Hematology", href: "/hematology" },
};

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const service = await getService(slug);
  if (!service) notFound();

  const parent = (service.category && CATEGORY_HUB[service.category]) || { label: "Services", href: "/services" };

  return (
    <>
      <Header />
      <main id="main">
        <PageHero eyebrow={service.category || "Services"} title={service.name} crumb={service.name} parent={parent} />
        <section className="section">
          <div className="container post">
            {service.shortDescription && <p className="lead">{service.shortDescription}</p>}

            {service.bannerImage && (
              <Photo
                src={service.bannerImage}
                alt={service.name}
                placeholder="[Service banner image]"
                className="post__cover"
                sizes="(max-width: 900px) 100vw, 800px"
                priority
              />
            )}

            {service.description && <div className="post__content">{documentToReactComponents(service.description)}</div>}

            {service.gallery.length > 0 && (
              <div className="grid-3 post__gallery">
                {service.gallery.map((src) => (
                  <Photo
                    key={src}
                    src={src}
                    alt={service.name}
                    placeholder="[Gallery image]"
                    className="article__img"
                    sizes="(max-width: 900px) 100vw, 380px"
                  />
                ))}
              </div>
            )}

            {service.tags.length > 0 && (
              <ul className="tags post__tags">
                {service.tags.map((tag) => (
                  <li key={tag} className="tag">
                    {tag}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
