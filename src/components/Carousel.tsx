import { Swiper, SwiperSlide } from "swiper/react";

import { Navigation, Pagination, EffectCoverflow, A11y } from "swiper/modules";
import { games } from "../data/gamesData";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

export default () => {
  return (
    <Swiper
      effect={"coverflow"}
      direction={"horizontal"}
      navigation
      observer={true}
      observeParents={true}
      centeredSlides={true}
      modules={[Pagination, Navigation, EffectCoverflow, A11y]}
      coverflowEffect={{
        // depth: 90,
        // rotate: -30,
        // scale: 3 / 20,
        slideShadows: true,
        // stretch: 0,
      }}
      pagination={{
        clickable: true,
        type: "bullets",
      }}
      spaceBetween={0}
      slidesPerView={1}
      breakpoints={{
        300: {
          slidesPerView: 1,
          spaceBetween: 5,
          effect: "coverflow",
          coverflowEffect: {
            depth: 90,
            rotate: 100,
            scale: 9 / 20,
            slideShadows: false,
          },
        },
        600: {
          slidesPerView: 2,
          spaceBetween: -15,
          effect: "coverflow",
          coverflowEffect: {
            depth: 90,
            rotate: -30,
            scale: 14 / 20,
            slideShadows: false,
            stretch: 0,
          },
        },
        1100: {
          slidesPerView: 3,
          spaceBetween: -5,
          effect: "coverflow",
          coverflowEffect: {
            depth: 90,
            rotate: -30,
            scale: 14 / 20,
            slideShadows: false,
            stretch: 0,
          },
        },
      }}
      loop={true}
      className="h-86 flex w-11/12 flex-col items-center justify-center rounded-lg"
    >
      {Object.entries(games).map(([name, game], index) => (
        <SwiperSlide key={index}>
          <img
            src={game.image}
            alt={name}
            className="h-[490px] w-[370px] scale-90 rounded-lg"
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};
