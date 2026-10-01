import { useState } from "react";
import NewsCard from "../components/NewsCard";
import { newsCategories, newsPosts, type NewsCategory } from "../data/newsData";

function News() {
  const [category, setCategory] = useState<NewsCategory>("All news");
  const filteredPosts = newsPosts.filter(
    (post) => category === "All news" || post.category === category
  );
  const [leadPost, ...remainingPosts] = filteredPosts;

  return (
    <div className="min-h-screen bg-deep-space pb-12 pt-12 sm:pt-20">
      <div className="mx-auto max-w-7xl px-6 xl:px-8">
        <header className="mb-8 text-center sm:mb-12">
          <h1 className="font-outfit text-5xl font-bold uppercase tracking-widest text-white md:text-6xl">
            News
          </h1>
          <div className="mx-auto mt-4 h-1 w-24 bg-tech-gold" aria-hidden="true" />
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-gray-300 sm:text-lg">
            Stories from our teams and gaming community.
          </p>
        </header>

        <section aria-label="News posts">
          <div className="mb-8 flex flex-col gap-3 border-b border-white/10 pb-6 md:flex-row md:items-center md:justify-between md:gap-6">
            <div className="flex flex-wrap gap-2" role="group" aria-label="Filter news by category">
              {newsCategories.map((option) => (
                <button
                  key={option}
                  type="button"
                  aria-pressed={category === option}
                  onClick={() => setCategory(option)}
                  className={`min-h-[44px] rounded-full border px-5 py-2 text-sm font-medium transition-colors duration-200 motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tech-gold focus-visible:ring-offset-4 focus-visible:ring-offset-deep-space ${
                    category === option
                      ? "border-tech-gold bg-tech-gold text-deep-space"
                      : "border-white/20 bg-white/5 text-gray-300 hover:border-tech-gold/50 hover:text-white"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
            <p className="shrink-0 text-sm text-gray-400" role="status" aria-live="polite" aria-atomic="true">
              {filteredPosts.length} {filteredPosts.length === 1 ? "post" : "posts"}
            </p>
          </div>

          <p className="mb-8 text-sm leading-relaxed text-gray-400">
            <span className="font-medium text-tech-gold">Sample posts.</span>{" "}
            Stories and publication dates below are examples for this preview.
          </p>

          {leadPost ? (
            <div className="space-y-8">
              <NewsCard post={leadPost} featured />
              {remainingPosts.length > 0 && (
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                  {remainingPosts.map((post) => (
                    <NewsCard key={post.id} post={post} />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-16 text-center">
              <h2 className="font-outfit text-2xl font-bold text-white">No posts yet</h2>
              <p className="mt-3 text-gray-300">Check another category for updates from GT Esports.</p>
              <button
                type="button"
                onClick={() => setCategory("All news")}
                className="mt-6 min-h-[44px] rounded-full border border-tech-gold/50 px-6 py-2 font-medium text-tech-gold hover:bg-tech-gold/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tech-gold focus-visible:ring-offset-4 focus-visible:ring-offset-deep-space"
              >
                View all news
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default News;
