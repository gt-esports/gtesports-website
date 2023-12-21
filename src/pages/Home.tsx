import Carousel from "../components/Carousel";

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
        <div className="mx-auto mt-5 flex w-4/5 max-w-screen-xl flex-row">
          <Carousel />
        </div>
      </div>
    </div>
  );
}

export default Home;
