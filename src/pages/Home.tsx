import CarouselCard from "../components/CarouselCard";
import league from "../assets/league.png";
import valorant from "../assets/val.jpeg";
import ow2 from "../assets/overwatch.jpeg";

const games = [
  [valorant, "Valorant", "discordlink"],
  [league, "League of Legends", "discordlink"],
  [ow2, "Overwatch 2", "discordlink"],
];

function Home() {
  return (
    <div className="h-screen w-full">
      <div className="flex h-full w-full items-center justify-center bg-home-1 bg-cover ">
        <h1 className="font-bayon text-9xl font-normal text-tech-gold">
          G<span className="text-white">eorgi</span>a Tech{" "}
          <span className="text-white">Esports</span>
        </h1>
      </div>
      <div className="flex h-[300vh] w-full flex-col items-center bg-streak bg-cover pt-24">
        <div>
          <h2 className="font-bayon text-7xl font-normal text-white">
            CHOOSE YOUR GAME
          </h2>
        </div>
        <div className="flex flex-row">
          {games.map((game) => (
            <CarouselCard image={game[0]} name={game[1]} link={game[2]} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;
