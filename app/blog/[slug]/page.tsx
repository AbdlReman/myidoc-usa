import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import Header from "@/components/Header";
import PageHero from "@/components/PageHero";
import Footer from "@/components/Footer";
import Photo from "@/components/Photo";
import { getBlogPost, getBlogPosts } from "@/lib/contentful";

export const revalidate = 300;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const posts = await getBlogPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) return {};
  return {
    title: `${post.metaTitle || post.title} | MYiDocUSA`,
    description: post.metaDescription || undefined,
  };
}

function formatDate(date: string | null) {
  if (!date) return null;
  return new Date(date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) notFound();

  const publishedDate = formatDate(post.publishedDate);

  return (
    <>
      <Header />
      <main id="main">
        <PageHero
          eyebrow={post.category || "Blog"}
          title={post.title}
          crumb={post.title}
          parent={{ label: "Blog", href: "/blog" }}
        />
        <section className="section">
          <div className="container post">
            {(post.author || publishedDate) && (
              <p className="muted post__meta">
                {post.author && <>By {post.author}</>}
                {post.author && publishedDate && " · "}
                {publishedDate}
              </p>
            )}

            {post.coverImage && (
              <Photo
                src={post.coverImage}
                alt={post.title}
                placeholder="[Article cover image]"
                className="post__cover"
                sizes="(max-width: 900px) 100vw, 800px"
                priority
              />
            )}

            <div className="post__content">{documentToReactComponents(post.body)}</div>

            {post.tags.length > 0 && (
              <ul className="tags post__tags">
                {post.tags.map((tag) => (
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
