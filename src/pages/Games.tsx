import GameGrid from "../components/GameGrid";
import Footer from "../components/Footer";


function Games() {
  return (
    <div className=" bg-streak bg-cover pt-36">
      <div className="flex items-center justify-center">
        <h1 className="font-bayon text-6xl text-white justify-center">
          GAMES
        </h1>
      </div>
      <div className="flex items-center flex-col py-16 pb-28">
        <GameGrid />
      </div>
      <Footer/>
    </div>
  );
}

export default Games;

