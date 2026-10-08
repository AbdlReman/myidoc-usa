import { createClient, type Asset } from "contentful";
import type { Document } from "@contentful/rich-text-types";

export type BlogPost = {
  title: string;
  slug: string;
  thumbnail: string | null;
  coverImage: string | null;
  body: Document;
  category: string | null;
  tags: string[];
  author: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  publishedDate: string | null;
};

function getClient() {
  const space = process.env.CONTENTFUL_SPACE_ID;
  const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN;
  if (!space || !accessToken) return null;
  return createClient({
    space,
    accessToken,
    environment: process.env.CONTENTFUL_ENVIRONMENT || "master",
  });
}

function assetUrl(asset?: Asset): string | null {
  const url = asset?.fields?.file?.url as string | undefined;
  if (!url) return null;
  return url.startsWith("//") ? `https:${url}` : url;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toBlogPost(entry: any): BlogPost {
  const f = entry.fields;
  return {
    title: f.title,
    slug: f.slug,
    thumbnail: assetUrl(f.thumbnail),
    coverImage: assetUrl(f.coverImage),
    body: f.description,
    category: f.category ?? null,
    tags: f.tags ?? [],
    author: f.author ?? null,
    metaTitle: f.metaTitle ?? null,
    metaDescription: f.metaDescription ?? null,
    publishedDate: f.publishedDate ?? null,
  };
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  const client = getClient();
  if (!client) return [];
  try {
    const entries = await client.getEntries({
      content_type: "blog",
      order: ["-fields.publishedDate"],
    });
    return entries.items.map(toBlogPost);
  } catch (err) {
    console.error("Failed to fetch blog posts from Contentful:", err);
    return [];
  }
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  const client = getClient();
  if (!client) return null;
  try {
    const entries = await client.getEntries({
      content_type: "blog",
      "fields.slug": slug,
      limit: 1,
    });
    const entry = entries.items[0];
    return entry ? toBlogPost(entry) : null;
  } catch (err) {
    console.error(`Failed to fetch blog post "${slug}" from Contentful:`, err);
    return null;
  }
}
