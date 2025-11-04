import Carousel from "../components/Carousel";
import Footer from "../components/Footer";
import SubscribeForm from "../components/Form";

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
      <div className="flex min-h-screen flex-col items-center justify-center rounded-sm bg-home-1 bg-cover px-4">
        <h1 className="px-3 py-3 text-center font-bayon font-normal text-tech-gold backdrop-blur-lg xs:rounded-lg xs:text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl">
          G<span className="text-white">eorgi</span>a Tech{" "}
          <span className="text-white">Esports</span>
        </h1>
        <div className="flex w-full justify-center">
          <button
            onClick={() => (window.location.href = "/games")}
            className="mt-8 rounded-md bg-tech-gold px-4 py-2 font-bayon text-xl text-white hover:bg-tech-gold/90 xs:mt-10 xs:px-5 xs:py-2.5 xs:text-xl sm:mt-12 sm:px-6 sm:py-3 sm:text-2xl md:text-3xl lg:text-4xl"
          >
            ENTER COMMUNITY
          </button>
        </div>
      </div>
      <div
        id="carousel-section"
        className="flex flex-col items-center justify-center pt-12 xs:pt-16 sm:pt-20 md:pt-24"
      >
        <div>
          <h2 className="flex justify-center pb-8 pt-12 text-center font-bayon font-normal tracking-wide text-white xs:pb-12 xs:pt-16 xs:text-3xl sm:pb-14 sm:pt-20 sm:text-4xl md:pb-16 md:pt-24 md:text-5xl lg:text-6xl xl:text-7xl">
            CHOOSE YOUR GAME
          </h2>
        </div>
        <div className="mt-5 flex w-full max-w-screen-xl flex-col items-center justify-center pb-12 xs:pb-16 sm:pb-20 md:pb-24">
          <Carousel />
          <button
            onClick={handleButtonClick}
            value="/games"
            className="mt-6 h-12 w-40 rounded-md bg-tech-gold font-barlow text-white xs:mt-8 xs:h-14 xs:w-44 sm:h-16 sm:w-48"
          >
            VIEW ALL
          </button>
        </div>
        <div className="w-full px-4 pb-8 xs:px-6 xs:pb-10 lg:px-8">
          <h3 className="mb-6 text-center font-bayon text-2xl tracking-wide text-tech-gold xs:mb-8 xs:text-2xl sm:mb-10 sm:text-3xl">
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
