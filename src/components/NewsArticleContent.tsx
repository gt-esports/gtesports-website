import { useId } from "react";
import type { Category } from "../data/newsSchema";
import { getNewsCoverUrl } from "../lib/newsCovers";
import { formatNewsDate } from "../lib/newsDisplay";
import NewsArticleBody from "./NewsArticleBody";

type ArticleContent = {
  title: string;
  excerpt: string;
  author: string;
  category: Category;
  cover_url: string;
  cover_alt?: string;
  cover_path?: string | null;
  body: string;
  published_at?: string | null;
};

export default function NewsArticleContent({
  article,
  preview = false,
}: {
  article: ArticleContent;
  preview?: boolean;
}) {
  const titleId = useId();
  const coverUrl = article.cover_path
    ? getNewsCoverUrl(article.cover_path)
    : article.cover_url;
  const Title = preview ? "h3" : "h1";

  return (
    <article aria-labelledby={titleId} className="mt-8">
      <header className="mx-auto max-w-3xl">
        <p className="font-outfit text-sm font-semibold uppercase tracking-widest text-tech-gold">
          {article.category}
        </p>
        <Title
          id={titleId}
          className="mt-4 break-words font-outfit text-4xl font-bold leading-tight text-white sm:text-5xl md:text-6xl"
        >
          {article.title || (preview ? "Untitled post" : "")}
        </Title>
        {article.excerpt && (
          <p className="mt-6 text-lg leading-relaxed text-gray-300 sm:text-xl">
            {article.excerpt}
          </p>
        )}
        {(article.author || article.published_at) && (
          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-400 sm:text-base">
            {article.author && (
              <p>
                By{" "}
                <span className="font-medium text-gray-200">
                  {article.author}
                </span>
              </p>
            )}
            {article.published_at && (
              <time dateTime={article.published_at}>
                {formatNewsDate(article.published_at)}
              </time>
            )}
          </div>
        )}
        <div aria-hidden="true" className="mt-8 h-1 w-20 bg-tech-gold" />
      </header>
      {coverUrl && (
        <figure className="mx-auto mt-8 max-w-3xl overflow-hidden rounded-2xl border border-white/10 bg-white/5 sm:mt-10">
          <img
            src={coverUrl}
            alt={article.cover_alt ?? ""}
            decoding="async"
            className="block h-auto w-full"
          />
        </figure>
      )}
      <NewsArticleBody body={article.body} preview={preview} />
    </article>
  );
}
