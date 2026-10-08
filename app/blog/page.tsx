import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import PageHero from "@/components/PageHero";
import Footer from "@/components/Footer";
import Photo from "@/components/Photo";
import { getBlogPosts } from "@/lib/contentful";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Blog | MYiDocUSA",
  description: "News and insights on cancer prevention, oncology and telemedicine from the MYiDocUSA team.",
};

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <>
      <Header />
      <main id="main">
        <PageHero eyebrow="News & Insights" title="Blog" crumb="Blog" />
        <section className="section">
          <div className="container">
            {posts.length > 0 ? (
              <div className="grid-3">
                {posts.map((post) => {
                  const { title, slug, thumbnail, coverImage, category } = post;
                  return (
                    <article key={slug} className="article">
                      <Link href={`/blog/${slug}`}>
                        <Photo
                          src={thumbnail ?? coverImage}
                          alt={title}
                          placeholder="[Article image]"
                          className="article__img"
                          sizes="(max-width: 900px) 100vw, 380px"
                        />
                      </Link>
                      <div className="article__body">
                        {category && <span className="tag">{category}</span>}
                        <h2 className="h4">{title}</h2>
                        <Link href={`/blog/${slug}`} className="link-arrow">
                          Read more →
                        </Link>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <p className="muted">New articles are on their way — check back soon.</p>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
