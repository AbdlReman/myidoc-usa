import type { Metadata } from "next";
import Header from "@/components/Header";
import PageHero from "@/components/PageHero";
import Footer from "@/components/Footer";
import Photo from "@/components/Photo";
import { articles } from "@/lib/content";

export const metadata: Metadata = {
  title: "Blog | MYiDocUSA",
  description: "News and insights on cancer prevention, oncology and telemedicine from the MYiDocUSA team.",
};

export default function BlogPage() {
  return (
    <>
      <Header />
      <main id="main">
        <PageHero eyebrow="News & Insights" title="Blog" crumb="Blog" />
        <section className="section">
          <div className="container">
            <div className="grid-3">
              {articles.map((a) => (
                <article key={a.title} className="article">
                  <Photo
                    src={a.image}
                    alt={a.title}
                    placeholder="[Article image]"
                    className="article__img"
                    sizes="(max-width: 900px) 100vw, 380px"
                  />
                  <div className="article__body">
                    <span className="tag">{a.category}</span>
                    <h2 className="h4">{a.title}</h2>
                    <a href={a.href} className="link-arrow">
                      Read more →
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
