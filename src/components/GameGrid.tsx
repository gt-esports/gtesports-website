import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, EffectCoverflow, A11y } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";
import GameCard from "./GameCard";
import GameModal from "./GameModal";
import { games, casual_games } from "../data/gamesData";
import CarouselCard from "./CarouselCard";
import SearchBar from "./SearchBar";

function GameGrid() {
  const [comp, setComp] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState<{name: string; description: string} | null>(null);

  const handleLearnMore = (name: string, description: string) => {
    console.log("Learn more clicked:", name);
    setSelectedGame({ name, description });
    setModalOpen(true);
  };
  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedGame(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [searchTerm, setSearchTerm] = useState("");
  const lowerSearchTerm = searchTerm.toLowerCase();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const gamesToDisplay = useMemo(() => Object.entries(comp ? games : casual_games).filter(([name]) => name.toLowerCase().includes(lowerSearchTerm)), [comp, lowerSearchTerm]);
          
  function handleFilter(input: string) {
    setSearchTerm(input);
  }

  const animationVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  return (
    <div className="flex flex-wrap justify-center px-8 md:px-[100px] py-4 min-w-[400px]">
      <div className="flex flex-col w-full justify-center pb-4 font-barlow text-xl 2xl:left-56">
        <div className="flex justify-center w-full pb-4 font-barlow text-xl">
          <button
            className={
              comp
                ? "px-2 text-bright-buzz underline underline-offset-8"
                : "px-2 text-white underline-offset-4 duration-500 hover:text-bright-buzz"
            }
            onClick={() => setComp(true)}
          >
            Competitive
          </button>
          <button
            className={
              !comp
                ? "px-2 text-bright-buzz underline underline-offset-8"
                : "px-2 text-white underline-offset-4 duration-500 hover:text-bright-buzz"
            }
            onClick={() => setComp(false)}
          >
            Casual
          </button>
        </div>
        <div className="pb-4 flex justify-center">
          <SearchBar searchTerm={searchTerm} placeholder={"Search games..."} handleInput={handleFilter} />
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center">
        {Object.entries(comp ? games : casual_games).map(
          ([name, game], index) => (
            <div className="p-3">
              <GameCard
                key={index}
                image={game.image}
                name={name}
                link={game.pageLink}
                discordLink={game.discordLink}
                onLearnMore={() => handleLearnMore(name, game.description)}
              />
            </div>
          )
        )}
      <div className="w-full">
        <AnimatePresence mode="wait">
          {isMobile ? (
            <motion.div
              key="mobile"
              variants={animationVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.5 }}
            >
              <Swiper
                effect={"coverflow"}
                navigation={true}
                centeredSlides={true}
                modules={[Pagination, Navigation, EffectCoverflow, A11y]}
                pagination={{ clickable: true }}
                loop={false}
                observer={true}
                observeParents={true}
                slidesPerView={1}
                spaceBetween={0}
                coverflowEffect={{ rotate: 50, stretch: 0, depth: 100, modifier: 1, slideShadows: true }}
                className="w-full pb-12"
              >
                {gamesToDisplay.map(([name, game]) => (
                  <SwiperSlide key={name} className="flex justify-center items-center">
                    <CarouselCard image={game.image} name={name} link={game.discordLink} />
                  </SwiperSlide>
                ))}
              </Swiper>
            </motion.div>
          ) : (
            <motion.div
              key="desktop"
              variants={animationVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.5 }}
            >
              <div className="flex flex-wrap items-center justify-center">
                {gamesToDisplay.map(([name, game]) => (
                  <motion.div
                    layout
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className="p-3"
                    key={name}
                  >
                    <GameCard
                      image={game.image}
                      name={name}
                      link={game.pageLink}
                      discordLink={game.discordLink}
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <GameModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        gameName={selectedGame?.name || ""}
        gameDescription={selectedGame?.description || ""}
      />
    </div>
  );
}

export default GameGrid;
