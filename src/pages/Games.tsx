import Carousel from "../components/Carousel";

function Games() {
  return (
    <div className="h-screen w-full">
      <div className="flex h-[300vh] w-full flex-col items-center bg-streak bg-cover pt-36">
        <div>
          <h2 className="font-bayon text-7xl tracking-wide git text-white">
            GAMES
          </h2>
        </div>
        <div className="mx-auto mt-5 flex w-4/5 max-w-screen-xl flex-col text-white">
          <Carousel></Carousel>
        </div>
      </div>
    </div>
  );
}

export default Games;
  