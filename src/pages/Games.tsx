import GameGrid from "../components/GameGrid";

export default function Games() {
  return (
    <div className="min-h-screen w-full bg-deep-space pt-24">
      <header className="mx-auto max-w-3xl px-6 pb-12 pt-10 text-center sm:pt-16">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-tech-gold">GT Esports Organization</p>
        <h1 className="font-outfit text-5xl font-bold tracking-tight text-white sm:text-6xl">Your game. <span className="text-tech-gold">Your people.</span></h1>
        <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-gray-400">From competitive teams to casual communities, find a game you love and the people who play it. Explore a game to learn more and connect.</p>
      </header>
      <div className="mx-auto flex max-w-7xl justify-center"><GameGrid /></div>
    </div>
  );
}
