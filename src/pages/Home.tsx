import Carousel from "../components/Carousel";
import Footer from "../components/Footer";
import NECard from "../components/NECard";
import league from "../assets/league.png";

const testNews = [
  ["news name 1", league, "12/31/2023", "newslink", ""],
  ["news name 2", league, "12/31/2023", "newslink", ""],
  ["news name 3", league, "12/31/2023", "newslink", ""],
];

const testEvents = [
  ["events name 1", league, "12/31/2023", "newslink", "Klaus"],
  ["events name 2", league, "12/31/2023", "newslink", "Klaus"],
  ["events name 3", league, "12/31/2023", "newslink", "Klaus"],
];

function Home() {
  function handleButtonClick(e: React.MouseEvent<HTMLButtonElement>) {
    window.location.href = (e.target as HTMLButtonElement).value;
  }

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
        <div className="mx-auto mt-5 flex w-4/5 max-w-screen-xl flex-col items-center pb-24">
          <Carousel />
          <button
            onClick={handleButtonClick}
            value="/games"
            className="mt-8 h-16 w-48 rounded-md bg-tech-gold text-white font-barlow"
          >
            VIEW ALL
          </button>
        </div>
        <div className="flex flex-col items-center">
          <div className="mb-8 flex w-full flex-row items-center justify-between">
            <h2 className="font-bayon text-5xl font-normal text-white">NEWS</h2>
            <button
              onClick={handleButtonClick}
              value="/newsandevents"
              className="h-14 w-40 rounded-md bg-tech-gold text-white font-barlow"
            >
              VIEW MORE
            </button>
          </div>
          <div className="flex">
            {testNews.map((card) => (
              <NECard
                name={card[0]}
                image={card[1]}
                time={card[2]}
                link={card[3]}
                location={card[4]}
                type={true}
              />
            ))}
          </div>
        </div>
        <div className="mb-64 mt-32 flex flex-col items-center">
          <div className="mb-8 flex w-full flex-row items-center justify-between">
            <h2 className="font-bayon text-5xl font-normal text-white">
              EVENTS
            </h2>
            <button
              onClick={handleButtonClick}
              value="/newsandevents"
              className="h-14 w-40 rounded-md bg-tech-gold text-white font-barlow"
            >
              VIEW MORE
            </button>
          </div>
          <div className="flex">
            {testEvents.map((card) => (
              <NECard
                name={card[0]}
                image={card[1]}
                time={card[2]}
                link={card[3]}
                location={card[4]}
                type={false}
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
