import Carousel from "../components/Carousel";
import Footer from "../components/Footer";

function Home() {
  return (
    <div className="flex flex-col w-full">
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
        <Footer />
      </div>
    </div>
  );
}

export default Home;
