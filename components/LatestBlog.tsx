import Link from "next/link";
import Photo from "./Photo";
import { SectionHead } from "./Sections";
import { getBlogPosts } from "@/lib/contentful";

const TITLE_LIMIT = 53;

function truncateTitle(title: string) {
  return title.length > TITLE_LIMIT ? `${title.slice(0, TITLE_LIMIT)}...` : title;
}

export default async function LatestBlog() {
  const posts = (await getBlogPosts()).slice(0, 3);
  if (posts.length === 0) return null;

  return (
    <section className="section">
      <div className="container">
        <SectionHead
          center
          eyebrow="From the Blog"
          title="Latest News & Insights"
          text="Practical guidance on cancer prevention, treatment and survivorship from our team."
        />
        <div className="grid-3">
          {posts.map((post) => (
            <article key={post.slug} className="article">
              <Link href={`/blog/${post.slug}`}>
                <Photo
                  src={post.thumbnail ?? post.coverImage}
                  alt={post.title}
                  placeholder="[Article image]"
                  className="article__img"
                  sizes="(max-width: 900px) 100vw, 380px"
                />
              </Link>
              <div className="article__body">
                {post.category && <span className="tag">{post.category}</span>}
                <h3 className="h4">{truncateTitle(post.title)}</h3>
                <Link href={`/blog/${post.slug}`} className="link-arrow">
                  Read more →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
