import Carousel from "../components/Carousel";
import HomeAbout from "../components/HomeAbout";
// import SubscribeForm from "../components/Form";

function Home() {
  return (
    <div className="flex w-full flex-col">
      {/* Hero Section */}
      <section className="relative flex min-h-[90vh] w-full flex-col items-center justify-center overflow-hidden bg-home-hero bg-cover bg-center bg-no-repeat px-4 text-center">
        {/* Overlay gradient for better legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-deep-space via-transparent to-deep-space/60"></div>

        <div className="relative z-10 flex flex-col items-center gap-6">
          <h1 className="font-outfit text-5xl font-extrabold uppercase tracking-tighter text-white sm:text-7xl md:text-8xl lg:text-9xl">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">GEORGIA</span>{" "}
            <span className="text-tech-gold">TECH</span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-tech-gold to-gold-glow">ESPORTS</span>
          </h1>

          <p className="max-w-2xl font-inter text-lg font-light tracking-wide text-gray-300 sm:text-xl">
            The premier collegiate esports organization of Georgia Tech.
            <br className="hidden sm:block" /> Compete, connect, and conquer.
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:gap-6">
            <a
              href="https://techhack.gatechesports.com"
              target="_blank"
              rel="noreferrer"
              className="group relative flex items-center justify-center overflow-hidden rounded-full bg-gradient-to-r from-tech-gold to-gold-glow px-8 py-4 font-outfit text-lg font-bold tracking-wider text-white transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(212,175,55,0.6)]"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full transition-transform duration-300 group-hover:translate-y-0"></div>
              <span className="relative">HACKATHON</span>
            </a>
            <a
              href="/games"
              className="group relative flex items-center justify-center overflow-hidden rounded-full bg-tech-gold px-8 py-4 font-outfit text-lg font-bold tracking-wider text-white transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(179,163,105,0.4)]"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full transition-transform duration-300 group-hover:translate-y-0"></div>
              <span className="relative">ENTER ARENA</span>
            </a>
            <a
              href="https://discord.gg/uwdSHXq4sN"
              target="_blank"
              rel="noreferrer"
              className="group relative flex items-center justify-center overflow-hidden rounded-full border border-white/20 bg-white/5 px-8 py-4 font-outfit text-lg font-bold tracking-wider text-white backdrop-blur-sm transition-all hover:scale-105 hover:bg-white/10 hover:border-white/40"
            >
              <span className="relative">JOIN DISCORD</span>
            </a>
          </div>
        </div>
      </section>

      <HomeAbout />

      {/* Games Carousel Section */}
      <section id="games" className="relative w-full bg-deep-space py-24">
        <div className="absolute top-0 h-32 w-full bg-gradient-to-b from-deep-space to-transparent opacity-50"></div>

        <div className="container mx-auto flex flex-col items-center px-4">
          <h2 className="mb-12 text-center font-outfit text-4xl font-bold uppercase tracking-widest text-white md:text-5xl lg:text-6xl">
            CHOOSE YOUR <span className="text-tech-gold">GAME</span>
          </h2>

          <div className="w-full max-w-7xl">
            <Carousel />
          </div>

          <a
            href="/games"
            className="mt-12 rounded-full border border-white/10 bg-white/5 px-8 py-3 font-outfit text-sm font-semibold tracking-widest text-white transition-all hover:bg-white/10 hover:text-tech-gold"
          >
            VIEW ALL TEAMS
          </a>
        </div>
      </section>

      {/* Community/Newsletter Section */}
      <section className="relative w-full bg-gradient-to-b from-deep-space to-black py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur-md sm:p-16">
            <h3 className="mb-4 font-outfit text-3xl font-bold text-white sm:text-4xl">
              STAY CONNECTED
            </h3>
            <p className="mb-8 font-inter text-gray-400">
              Join our mailing list to get the latest updates on matches, events, and recruitment.
            </p>

            <div className="flex w-full flex-col items-center justify-center rounded-xl border border-tech-gold/20 bg-tech-gold/5 px-6 py-8">
              <span className="font-outfit text-xl font-bold text-tech-gold">COMING SOON</span>
              <p className="mt-2 text-sm text-gray-500">Newsletter integration is currently under maintenance.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
