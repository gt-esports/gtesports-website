import { FaDiscord, FaArrowRight, FaBell } from "react-icons/fa";

function Recruitment() {
  return (
    <div className="min-h-screen w-full bg-deep-space pt-24">
      <section className="relative w-full px-4 py-20">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-12 text-center">
            <h1 className="mb-4 font-outfit text-5xl font-bold uppercase tracking-widest text-white md:text-6xl">
              JOIN THE <span className="text-tech-gold">TEAM</span>
            </h1>
            <div className="mx-auto h-1 w-24 bg-tech-gold"></div>
          </div>

          <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 md:p-12">
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-tech-gold/10 blur-3xl"></div>

            <div className="relative z-10 flex flex-col items-start gap-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-tech-gold to-gold-glow text-white shadow-lg">
                <FaBell className="text-2xl" />
              </div>

              <h2 className="font-outfit text-3xl font-bold uppercase text-white md:text-4xl">
                Recruitment is currently closed
              </h2>

              <div className="space-y-4 font-inter text-gray-400">
                <p>
                  We're not actively recruiting for our Development, Creative, Production, Finance, or Events departments right now — but new cycles open up each semester.
                </p>
                <p>
                  Join our <span className="text-tech-gold">Main Discord</span> to stay in the loop. All recruitment announcements, tryout dates, and application links are posted there as soon as we reopen.
                </p>
                <p>
                  Interested in competing? Head to the <a href="/games" className="text-tech-gold underline hover:text-white">Games page</a> to find the Discord and tryout info for your specific game.
                </p>
              </div>

              <div className="mt-4 flex flex-wrap gap-4">
                <a
                  href="https://discord.gg/uwdSHXq4sN"
                  target="_blank"
                  rel="noreferrer"
                  className="group/btn flex items-center gap-2 rounded-full bg-tech-gold px-6 py-3 font-outfit text-sm font-bold text-white transition-all hover:bg-white hover:text-deep-space"
                >
                  JOIN OUR DISCORD <FaDiscord />
                </a>
                <a
                  href="/games"
                  className="group/btn flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3 font-outfit text-sm font-bold text-white transition-all hover:border-white/40 hover:bg-white/10"
                >
                  VIEW TEAMS <FaArrowRight className="transition-transform group-hover/btn:translate-x-1" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Recruitment;
