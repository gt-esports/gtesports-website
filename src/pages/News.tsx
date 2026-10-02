import { FaArrowRight, FaDiscord, FaRegNewspaper } from "react-icons/fa";
import { Link } from "react-router-dom";

function News() {
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

        <section
          aria-labelledby="news-coming-soon"
          className="rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-16 text-center sm:px-8 sm:py-20 lg:py-24"
        >
          <div className="mx-auto flex max-w-2xl flex-col items-center">
            <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl border border-tech-gold/20 bg-tech-gold/10 text-tech-gold" aria-hidden="true">
              <FaRegNewspaper className="text-3xl" />
            </div>
            <h2 id="news-coming-soon" className="font-outfit text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
              Coming soon
            </h2>
            <p className="mt-6 max-w-xl leading-relaxed text-gray-300 sm:text-lg">
              Team news, event announcements, and community stories are on their way.
              Check back soon for the latest from GT Esports.
            </p>
            <p className="mt-4 max-w-xl leading-relaxed text-gray-400">
              In the meantime, join our Discord to stay connected or find your next game.
            </p>

            <div className="mt-8 flex w-full max-w-sm flex-col gap-3 sm:w-auto sm:max-w-none sm:flex-row">
              <a
                href="https://discord.gg/uwdSHXq4sN"
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-[44px] items-center justify-center gap-2 rounded-full bg-tech-gold px-6 py-3 font-outfit text-sm font-bold text-deep-space transition-colors duration-200 hover:bg-gold-glow motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tech-gold focus-visible:ring-offset-4 focus-visible:ring-offset-deep-space"
              >
                Join Discord <FaDiscord aria-hidden="true" />
              </a>
              <Link
                to="/games"
                className="flex min-h-[44px] items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3 font-outfit text-sm font-semibold text-white transition-colors duration-200 hover:border-tech-gold/50 hover:bg-white/10 motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tech-gold focus-visible:ring-offset-4 focus-visible:ring-offset-deep-space"
              >
                Explore games <FaArrowRight aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default News;
