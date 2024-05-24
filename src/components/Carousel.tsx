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
      modules={[Pagination, Navigation, EffectCoverflow, A11y]}
      coverflowEffect={{
        // depth: 90,
        rotate: -40,
        scale: 3 / 4,
        slideShadows: false,
        // stretch: 0,
      }}
      pagination={{
        clickable: true,
        type: "bullets",
      }}
      spaceBetween={-60}
      slidesPerView={3}
      loop={true}
      className="flex w-10/12 flex-col items-center justify-center rounded-lg"
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
