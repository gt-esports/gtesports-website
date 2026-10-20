import { FaDiscord, FaGamepad, FaTrophy } from "react-icons/fa";
import { Link } from "react-router-dom";
import RecruitmentBanner from "../components/RecruitmentBanner";
import DepartmentGrid from "../components/DepartmentGrid";
import RecruitmentForm from "../components/RecruitmentForm";

const focusClass = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tech-gold focus-visible:ring-offset-4 focus-visible:ring-offset-deep-space";

function Recruitment() {
  return (
    <div className="min-h-screen w-full bg-deep-space pt-24">
      <header className="mx-auto max-w-4xl px-6 pb-12 pt-12 text-center sm:pt-20">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-tech-gold">Find your place at GT Esports Organization</p>
        <h1 className="mb-6 font-outfit text-5xl font-bold uppercase tracking-widest text-white md:text-6xl">
          JOIN <span className="text-tech-gold">US</span>
        </h1>
        <p className="mx-auto max-w-2xl text-lg leading-relaxed text-gray-300">
          Compete with GT Esports Organization, find people to play with, or help shape our community. There's more than one way to get involved.
        </p>
      </header>

      <section aria-labelledby="players-heading" className="mx-auto max-w-6xl px-6 pb-20">
        <h2 id="players-heading" className="mb-8 text-center font-outfit text-3xl font-bold text-white sm:text-4xl">Competitors &amp; Casual Players</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <article className="flex flex-col rounded-3xl border border-tech-gold/20 bg-tech-gold/5 p-8 sm:p-10">
            <FaTrophy aria-hidden="true" className="mb-6 text-3xl text-tech-gold" />
            <h3 className="mb-4 font-outfit text-2xl font-bold text-white">Compete with GT Esports Organization</h3>
            <p className="mb-4 leading-relaxed text-gray-300">Ready to take your game further? Explore our games and connect with the community for the title you play.</p>
            <p className="mb-8 leading-relaxed text-gray-400">Tryout schedules and roster opportunities vary by game. Check your game's Discord for current announcements and next steps.</p>
            <Link to="/games" className={`mt-auto self-start rounded-full bg-tech-gold px-6 py-3 font-bold text-deep-space transition-colors hover:bg-gold-glow ${focusClass}`}>Explore games &amp; tryouts</Link>
          </article>
          <article className="flex flex-col rounded-3xl border border-white/10 bg-white/[0.03] p-8 sm:p-10">
            <FaGamepad aria-hidden="true" className="mb-6 text-3xl text-tech-gold" />
            <h3 className="mb-4 font-outfit text-2xl font-bold text-white">Play for the fun of it</h3>
            <p className="mb-4 leading-relaxed text-gray-300">Looking for teammates, a new game, or friends who share your interests? Our community is for casual players, too.</p>
            <p className="mb-8 leading-relaxed text-gray-400">Start in our main Discord to meet other players and hear about community games and events. You don't need a competitive roster spot to get involved.</p>
            <a href="https://discord.gg/uwdSHXq4sN" target="_blank" rel="noopener noreferrer" className={`mt-auto inline-flex items-center gap-2 self-start rounded-full border border-white/20 px-6 py-3 font-bold text-white transition-colors hover:border-tech-gold hover:text-tech-gold ${focusClass}`}>Join our Discord <FaDiscord aria-hidden="true" /></a>
          </article>
        </div>
        <p className="mt-6 text-center text-sm text-gray-400">Leadership application cycles below are separate from game tryouts and community participation.</p>
      </section>

      <section id="leadership-opportunities" aria-labelledby="leadership-heading" className="scroll-mt-28 border-t border-white/10 pt-16">
        <div className="mx-auto max-w-4xl px-6 pb-12">
          <div className="mb-10 text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-tech-gold">Build the community behind the games</p>
            <h2 id="leadership-heading" className="mb-4 font-outfit text-3xl font-bold text-white sm:text-4xl">Leadership &amp; Departments</h2>
            <p className="mx-auto max-w-2xl leading-relaxed text-gray-300">Help run events, create content, build our technology, and support GT Esports Organization behind the scenes. Explore our departments and leadership application status below.</p>
          </div>
          <RecruitmentBanner />
        </div>
        <DepartmentGrid />
        <RecruitmentForm />
      </section>
    </div>
  );
}

export default Recruitment;
