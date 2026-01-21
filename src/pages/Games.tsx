import GameGrid from "../components/GameGrid";

function Games() {
  return (
    <div className="min-h-screen w-full bg-deep-space pt-24">
      <div className="container mx-auto flex flex-col items-center">
        <h1 className="mb-4 text-center font-outfit text-5xl font-bold uppercase tracking-widest text-white md:text-6xl">
          <span className="text-tech-gold">Our</span> Games
        </h1>
        <div className="h-1 w-24 bg-tech-gold mb-8"></div>
        <GameGrid />
      </div>
    </div>
  );
}

export default Games;
