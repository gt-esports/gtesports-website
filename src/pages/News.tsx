import { useState } from "react";
import { FaArrowRight, FaDiscord, FaRegNewspaper } from "react-icons/fa";
import { Link } from "react-router-dom";
import NewsCard from "../components/NewsCard";
import type { Category } from "../data/newsSchema";
import { NEWS_PAGE_SIZE, useNewsList } from "../hooks/useNews";
import { newsCategories } from "../lib/newsDisplay";

type Filter = Category | "All";
const filters: { value: Filter; label: string }[] = [
  { value: "All", label: "All news" },
  ...newsCategories.map((category) => ({ value: category, label: category })),
];
const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tech-gold focus-visible:ring-offset-4 focus-visible:ring-offset-deep-space";

function ComingSoon() {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-16 text-center sm:px-8 sm:py-20">
      <div className="mx-auto flex max-w-2xl flex-col items-center">
        <div
          className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl border border-tech-gold/20 bg-tech-gold/10 text-tech-gold"
          aria-hidden="true"
        >
          <FaRegNewspaper className="text-3xl" />
        </div>
        <h2 className="font-outfit text-4xl font-bold text-white sm:text-5xl">
          Coming soon
        </h2>
        <p className="mt-6 max-w-xl leading-relaxed text-gray-300 sm:text-lg">
          Team news, event announcements, and community stories are on their
          way. In the meantime, join our Discord or explore our games.
        </p>
        <div className="mt-8 flex w-full max-w-sm flex-col gap-3 sm:w-auto sm:max-w-none sm:flex-row">
          <a
            href="https://discord.gg/uwdSHXq4sN"
            target="_blank"
            rel="noopener noreferrer"
            className={`flex min-h-[44px] items-center justify-center gap-2 rounded-full bg-tech-gold px-6 py-3 font-outfit text-sm font-bold text-deep-space hover:bg-gold-glow ${focusRing}`}
          >
            Join Discord <FaDiscord aria-hidden="true" />
          </a>
          <Link
            to="/games"
            className={`flex min-h-[44px] items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3 font-outfit text-sm font-semibold text-white hover:border-tech-gold/50 hover:bg-white/10 ${focusRing}`}
          >
            Explore games <FaArrowRight aria-hidden="true" />
          </Link>
        </div>
      </div>
    </div>
  );
}

function NewsResults({ category }: { category: Filter }) {
  const { articles, loading, loadingMore, error, hasMore, loadMore, retry } =
    useNewsList(category);
  const lead =
    articles.slice(0, NEWS_PAGE_SIZE).find((article) => article.featured) ??
    articles[0];
  const rest = articles.filter((article) => article !== lead);

  if (loading)
    return (
      <p role="status" className="py-16 text-center text-gray-300">
        Loading news…
      </p>
    );
  if (error && articles.length === 0) {
    return (
      <div
        role="alert"
        className="rounded-2xl border border-white/10 p-10 text-center"
      >
        <p className="text-white">{error}</p>
        <button
          type="button"
          onClick={retry}
          className={`mt-5 rounded-full border border-tech-gold/50 px-6 py-3 text-tech-gold ${focusRing}`}
        >
          Try again
        </button>
      </div>
    );
  }
  if (!lead)
    return category === "All" ? (
      <ComingSoon />
    ) : (
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-16 text-center">
        <h2 className="font-outfit text-2xl font-bold text-white">
          No {category} posts yet
        </h2>
        <button
          type="button"
          onClick={retry}
          className={`mt-6 rounded-full border border-tech-gold/50 px-6 py-3 text-tech-gold ${focusRing}`}
        >
          Check again
        </button>
      </div>
    );

  return (
    <div className="space-y-8">
      <NewsCard article={lead} featured />
      {rest.length > 0 && (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((article) => (
            <NewsCard key={article.id} article={article} />
          ))}
        </div>
      )}
      {error && (
        <p role="alert" className="text-center text-red-300">
          {error}
        </p>
      )}
      {hasMore && (
        <div className="text-center">
          <button
            type="button"
            disabled={loadingMore}
            onClick={() => {
              void loadMore();
            }}
            className={`rounded-full border border-white/20 px-8 py-3 text-white disabled:opacity-60 ${focusRing}`}
          >
            {loadingMore ? "Loading…" : "Load more"}
          </button>
        </div>
      )}
    </div>
  );
}

function News() {
  const [category, setCategory] = useState<Filter>("All");
  return (
    <div className="min-h-screen bg-deep-space pb-12 pt-12 sm:pt-20">
      <div className="mx-auto max-w-7xl px-6 xl:px-8">
        <header className="mb-8 text-center sm:mb-12">
          <h1 className="font-outfit text-5xl font-bold uppercase tracking-widest text-white md:text-6xl">
            News
          </h1>
          <div
            className="mx-auto mt-4 h-1 w-24 bg-tech-gold"
            aria-hidden="true"
          />
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-gray-300 sm:text-lg">
            Stories from our teams and gaming community.
          </p>
        </header>
        <section aria-label="News posts">
          <div className="mb-8 flex flex-col gap-3 border-b border-white/10 pb-6 md:flex-row md:items-center md:justify-between">
            <div
              className="flex flex-wrap gap-2"
              role="group"
              aria-label="Filter news by category"
            >
              {filters.map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  aria-pressed={category === value}
                  onClick={() => setCategory(value)}
                  className={`min-h-[44px] rounded-full border px-5 py-2 text-sm transition-colors motion-reduce:transition-none ${focusRing} ${
                    category === value
                      ? "border-tech-gold bg-tech-gold text-deep-space"
                      : "border-white/20 bg-white/5 text-gray-300 hover:border-tech-gold/50 hover:text-white"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          <NewsResults key={category} category={category} />
        </section>
      </div>
    </div>
  );
}

export default News;
