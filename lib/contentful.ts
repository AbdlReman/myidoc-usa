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
    timeout: 8000,
    retryLimit: 1,
  });
}

function assetUrl(asset?: Asset): string | null {
  const url = asset?.fields?.file?.url as string | undefined;
  if (!url) return null;
  return url.startsWith("//") ? `https:${url}` : url;
}

type RichTextNode = { nodeType: string; value?: string; content?: RichTextNode[] };

function richTextToPlainText(node: RichTextNode): string {
  if (node.nodeType === "text") return node.value ?? "";
  if (!node.content) return "";
  return node.content.map(richTextToPlainText).join(" ");
}

/** Plain-text excerpt of a rich text document, cut at a word boundary. */
export function excerpt(doc: Document | null, limit = 160): string {
  if (!doc) return "";
  const text = richTextToPlainText(doc as unknown as RichTextNode).replace(/\s+/g, " ").trim();
  if (text.length <= limit) return text;
  const cut = text.slice(0, limit);
  const lastSpace = cut.lastIndexOf(" ");
  return `${cut.slice(0, lastSpace > 0 ? lastSpace : limit)}...`;
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

export type Service = {
  name: string;
  slug: string;
  category: string | null;
  smallImage: string | null;
  bannerImage: string | null;
  gallery: string[];
  shortDescription: string | null;
  description: Document | null;
  metaTitle: string | null;
  metaDescription: string | null;
  tags: string[];
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toService(entry: any): Service {
  const f = entry.fields;
  return {
    name: f.name,
    slug: f.slug,
    category: f.category ?? null,
    smallImage: assetUrl(f.smallImage),
    bannerImage: assetUrl(f.bannerImage),
    gallery: ((f.gallery ?? []) as Asset[]).map(assetUrl).filter((url): url is string => !!url),
    shortDescription: f.shortDescription ?? null,
    description: f.description ?? null,
    metaTitle: f.metaTitle ?? null,
    metaDescription: f.metaDescription ?? null,
    tags: f.tags ?? [],
  };
}

export async function getServices(category?: string): Promise<Service[]> {
  const client = getClient();
  if (!client) return [];
  try {
    const entries = await client.getEntries({
      content_type: "service",
      order: ["fields.name"],
      ...(category ? { "fields.category": category } : {}),
    });
    return entries.items.map(toService);
  } catch (err) {
    console.error("Failed to fetch services from Contentful:", err);
    return [];
  }
}

export async function getService(slug: string): Promise<Service | null> {
  const client = getClient();
  if (!client) return null;
  try {
    const entries = await client.getEntries({
      content_type: "service",
      "fields.slug": slug,
      limit: 1,
    });
    const entry = entries.items[0];
    return entry ? toService(entry) : null;
  } catch (err) {
    console.error(`Failed to fetch service "${slug}" from Contentful:`, err);
    return null;
  }
}

export type Doctor = {
  name: string;
  slug: string;
  specialization: string | null;
  image: string | null;
  doctorCities: string[];
  doctorStates: string[];
  generalInfo: Document | null;
  additionalDetail: Document | null;
  metaTitle: string | null;
  metaDescription: string | null;
  keywords: string[];
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toDoctor(entry: any): Doctor {
  const f = entry.fields;
  return {
    name: f.name,
    slug: f.slug,
    specialization: f.specialization ?? null,
    image: assetUrl(f.image),
    doctorCities: f.doctorCities ?? [],
    doctorStates: f.doctorStates ?? [],
    generalInfo: f.generalInfo ?? null,
    additionalDetail: f.additionalDetail ?? null,
    metaTitle: f.metaTitle ?? null,
    metaDescription: f.metaDescription ?? null,
    keywords: f.keywords ?? [],
  };
}

export async function getDoctors(): Promise<Doctor[]> {
  const client = getClient();
  if (!client) return [];
  try {
    const entries = await client.getEntries({
      content_type: "doctor",
      order: ["fields.name"],
    });
    return entries.items.map(toDoctor);
  } catch (err) {
    console.error("Failed to fetch doctors from Contentful:", err);
    return [];
  }
}

export async function getDoctor(slug: string): Promise<Doctor | null> {
  const client = getClient();
  if (!client) return null;
  try {
    const entries = await client.getEntries({
      content_type: "doctor",
      "fields.slug": slug,
      limit: 1,
    });
    const entry = entries.items[0];
    return entry ? toDoctor(entry) : null;
  } catch (err) {
    console.error(`Failed to fetch doctor "${slug}" from Contentful:`, err);
    return null;
  }
}
