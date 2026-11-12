import type { Category, Status } from "../data/newsSchema";
import { hasNewsBodyContent } from "./newsBody";
import { supabase } from "./supabase";

export type NewsPostInput = {
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  author: string;
  category: Category;
  cover_url: string;
  cover_path: string;
  cover_alt: string;
  featured: boolean;
  status: Status;
};

export type ManagedNewsArticle = NewsPostInput & {
  id: string;
  revision: number;
  created_at: string;
  updated_at: string;
  published_at: string | null;
};

type ExistingPost = Pick<ManagedNewsArticle, "id" | "revision">;
type SupabaseError = { code?: string };

function requestError(error: SupabaseError, action: string): Error {
  if (error.code === "23505")
    return new Error(
      "That article URL is already in use. Choose a different slug."
    );
  if (error.code === "42501")
    return new Error(
      "Your admin access could not be verified. Reload the page and try again."
    );
  if (error.code === "42P01" || error.code === "PGRST205")
    return new Error(
      "News is unavailable on this database. Check the project setup and try again."
    );
  return new Error(
    `Unable to ${action} the article. Check your connection and try again.`
  );
}

export function makeNewsSlug(title: string): string {
  return title
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 120)
    .replace(/-+$/g, "");
}

function validateNewsPost(
  input: NewsPostInput,
  replacingCover: boolean
): NewsPostInput {
  const values = {
    ...input,
    title: input.title.trim(),
    slug: input.slug.trim(),
    excerpt: input.excerpt.trim(),
    body: input.body.trim(),
    author: input.author.trim(),
    cover_url: replacingCover ? "" : input.cover_url.trim(),
    cover_path: replacingCover ? "" : input.cover_path,
    cover_alt: input.cover_alt.trim(),
  };
  if (!values.title || values.title.length > 180)
    throw new Error("Title must be between 1 and 180 characters.");
  if (
    !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(values.slug) ||
    values.slug.length > 120
  )
    throw new Error(
      "Use a lowercase article URL with letters, numbers, and single hyphens."
    );
  if (values.excerpt.length > 400)
    throw new Error("The summary must be 400 characters or fewer.");
  if (values.author.length > 100)
    throw new Error("The author name must be 100 characters or fewer.");
  if (values.body.length > 100000)
    throw new Error(
      "This article is too long to save. Shorten the text or remove some formatting."
    );
  if (
    values.status === "published" &&
    (!values.excerpt || !hasNewsBodyContent(values.body) || !values.author)
  )
    throw new Error(
      "Add the article text, a summary, and an author before publishing."
    );
  if (values.cover_url) {
    try {
      if (
        !/^https:\/\/[^\s\\]+$/.test(values.cover_url) ||
        !new URL(values.cover_url).hostname
      )
        throw new Error();
    } catch {
      throw new Error("Cover image URL must use HTTPS.");
    }
    if (values.cover_url.length > 2000)
      throw new Error("Cover image URL must be 2,000 characters or fewer.");
  }
  if (replacingCover || values.cover_url || values.cover_path) {
    if (!values.cover_alt || values.cover_alt.length > 300)
      throw new Error("Add an image description of 1 to 300 characters.");
  } else values.cover_alt = "";
  return values;
}

export async function fetchAdminNews(): Promise<ManagedNewsArticle[]> {
  const articles: ManagedNewsArticle[] = [];
  const pageSize = 100;
  for (let start = 0; ; start += pageSize) {
    const { data, error } = await supabase
      .from("news_posts")
      .select("*")
      .order("updated_at", { ascending: false })
      .order("id")
      .range(start, start + pageSize - 1)
      .returns<ManagedNewsArticle[]>();
    if (error) throw requestError(error, "load");
    articles.push(...data);
    if (data.length < pageSize) return articles;
  }
}

export async function saveNewsPost(
  input: NewsPostInput,
  existing?: ExistingPost,
  uploadCover?: () => Promise<string>
): Promise<ManagedNewsArticle> {
  const values = validateNewsPost(input, !!uploadCover);
  if (uploadCover) values.cover_path = await uploadCover();
  const query = existing
    ? supabase
        .from("news_posts")
        .update(values)
        .eq("id", existing.id)
        .eq("revision", existing.revision)
    : supabase.from("news_posts").insert(values);
  const { data, error } = await query
    .select("*")
    .maybeSingle<ManagedNewsArticle>();
  if (error) throw requestError(error, "save");
  if (!data)
    throw new Error(
      "This article changed or your admin access was removed. Reload the list and reopen it before saving."
    );
  return data;
}

export async function deleteNewsPost(existing: ExistingPost): Promise<void> {
  const { data, error } = await supabase
    .from("news_posts")
    .delete()
    .eq("id", existing.id)
    .eq("revision", existing.revision)
    .select("id");
  if (error) throw requestError(error, "delete");
  if (!data?.length)
    throw new Error(
      "This article changed or your admin access was removed. Reload the list before deleting."
    );
}
