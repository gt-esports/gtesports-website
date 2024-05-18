import GameGrid from "../components/GameGrid";
import Footer from "../components/Footer";

function Games() {
  return (
    <div className=" bg-streak bg-cover pt-36">
      <div className="flex items-center justify-center">
        <h1 className="justify-center font-bayon text-6xl text-white">GAMES</h1>
      </div>
      <div className="flex flex-col items-center pb-40 pt-4">
        <GameGrid />
      </div>
      <Footer />
    </div>
  );
}

export default Games;
