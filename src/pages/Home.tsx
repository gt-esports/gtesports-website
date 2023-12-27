import Carousel from "../components/Carousel";
import Footer from "../components/Footer";
import NECard from "../components/NECard";
import league from "../assets/league.png";

const testNews = [
  ["news name 1", league, "12/31/2023", "newslink"],
  ["news name 2", league, "12/31/2023", "newslink"],
  ["news name 3", league, "12/31/2023", "newslink"],
];

function Home() {
  return (
    <div className="flex w-full flex-col">
      <div className="flex min-h-screen items-center justify-center bg-home-1 bg-cover">
        <h1 className="font-bayon text-9xl font-normal text-tech-gold">
          G<span className="text-white">eorgi</span>a Tech{" "}
          <span className="text-white">Esports</span>
        </h1>
      </div>
      <div className="flex flex-col items-center bg-streak bg-cover pt-24">
        <div>
          <h2 className="font-bayon text-7xl font-normal text-white">
            CHOOSE YOUR GAME
          </h2>
        </div>
        <div className="mx-auto mt-5 flex w-4/5 max-w-screen-xl flex-row pb-24">
          <Carousel />
        </div>
        <div className="flex flex-col items-center">
          <h2 className="font-bayon text-7xl font-normal text-white">
            NEWS AND EVENTS
          </h2>
          <div className="flex">
            {testNews.map((card) => (
              <NECard
                name={card[0]}
                image={card[1]}
                time={card[2]}
                link={card[3]}
              />
            ))}
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default Home;
