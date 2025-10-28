import Carousel from "../components/Carousel";
import Footer from "../components/Footer";
import { SubscribeForm } from "../components/Form";

function Home() {
  // const scrollToSection = (sectionId: string, offset: number = 0) => {
  //   const targetElement = document.getElementById(sectionId);
  //   if (!targetElement) return;

  //   const startPosition = window.scrollY;
  //   const targetPosition =
  //     targetElement.getBoundingClientRect().top + window.scrollY + offset;
  //   const distance = targetPosition - startPosition;
  //   const duration = 1500;
  //   let start: number | null = null;

  //   function animation(currentTime: number) {
  //     if (start === null) start = currentTime;
  //     const timeElapsed = currentTime - start;
  //     const progress = Math.min(timeElapsed / duration, 1);

  //     const easeInOutCubic = (progress: number) => {
  //       return progress < 0.5
  //         ? 4 * progress * progress * progress
  //         : 1 - Math.pow(-2 * progress + 2, 3) / 2;
  //     };

  //     window.scrollTo({
  //       top: startPosition + distance * easeInOutCubic(progress),
  //     });

  //     if (timeElapsed < duration) {
  //       requestAnimationFrame(animation);
  //     }
  //   }

  //   requestAnimationFrame(animation);
  // };

  function handleButtonClick(e: React.MouseEvent<HTMLButtonElement>) {
    window.location.href = (e.target as HTMLButtonElement).value;
  }

  return (
    <div className="flex w-full flex-col bg-streak bg-cover">
      <div className="flex min-h-screen flex-col items-center justify-center rounded-sm bg-home-1 bg-cover">
        <h1 className="px-3 py-3 font-bayon text-9xl font-normal text-tech-gold xs:rounded-lg xs:text-5xl xs:backdrop-blur-lg sm:text-7xl md:text-8xl lg:text-9xl">
          G<span className="text-white">eorgi</span>a Tech{" "}
          <span className="text-white">Esports</span>
        </h1>
        <div className="flex justify-center">
          <button
            onClick={() => (window.location.href = "/games")}
            className="mx-3 mt-8 rounded-md bg-tech-gold px-4 py-2 font-bayon text-2xl text-white hover:bg-tech-gold/90 sm:mt-12 sm:px-6 sm:py-3 sm:text-4xl"
          >
            ENTER COMMUNITY
          </button>
          <button
            onClick={() =>
              window.open("https://gamefest.gatechesports.com", "_blank")
            }
            className="mx-3 mt-8 rounded-md bg-tech-gold px-4 py-2 font-bayon text-2xl text-white hover:bg-tech-gold/90 sm:mt-12 sm:px-6 sm:py-3 sm:text-4xl"
          >
            ENTER GAMEFEST
          </button>
        </div>
      </div>
      <div
        id="carousel-section"
        className="flex flex-col items-center justify-center pt-24"
      >
        <div>
          <h2 className="flex justify-center pb-16 pt-24 text-center font-bayon text-7xl font-normal tracking-wide text-white">
            CHOOSE YOUR GAME
          </h2>
        </div>
        <div className="mt-5 flex w-full max-w-screen-xl flex-col items-center justify-center pb-24">
          <Carousel />
          <button
            onClick={handleButtonClick}
            value="/games"
            className="mt-8 h-16 w-48 rounded-md bg-tech-gold font-barlow text-white"
          >
            VIEW ALL
          </button>
        </div>
        <div className="w-full px-6 pb-10 lg:px-8">
          <h3 className="mb-10 text-center font-bayon text-3xl tracking-wide text-tech-gold">
            Stay Updated
          </h3>
          <div className="mx-auto max-w-4xl">
            <SubscribeForm />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Home;
