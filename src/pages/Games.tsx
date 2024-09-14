import GameGrid from "../components/GameGrid";
import Footer from "../components/Footer";
import { RxComponentInstance } from "react-icons/rx";

function Games() {
  return (
    <div className="flex flex-col justify-center bg-streak bg-cover pt-36">
      <div className="flex items-center justify-center">
        <h1 className="justify-center font-bayon text-6xl text-white">GAMES</h1>
      </div>
      <div className="items-center pt-4">
        <GameGrid />
      </div>
      <Footer />
    </div>
  );
}

export default Games;