import { useState, useEffect } from "react";
import { useSwipeable } from 'react-swipeable';
import image1 from "../assets/about-image/league.jpg";
import image2 from "../assets/about-image/c9 group.jpg"
import image3 from "../assets/about-image/gt player.jpg";
import image4 from "../assets/about-image/excited.jpg";
import image5 from "../assets/about-image/gamefest playing.jpg";
import image6 from "../assets/about-image/rainbow6.jpg";
import image7 from "../assets/about-image/valorant.jpg";
import image8 from "../assets/about-image/gamefest group.jpg";


const images = [
  {
    src: image1,
    alt: "League of Legends Event",
  },
  
  {
    src: image2,
    alt: "Cloud9 Event Group Photo",
  },
  {
    src: image3,
    alt: "A Georgia Tech Student at Gamefest",
  },
  {
    src: image4,
    alt: "Excited Player at Gamefest",
  },
  {
    src: image5,
    alt: "People playing games at Gamefest",
  },
  {
    src: image6,
    alt: "Rainbow Six Siege gameplay from Gamefest",
  },
  {
    src: image7,
    alt: "Valorant gameplay from Gamefest",
  },
  {
    src: image8,
    alt: "Gamefest group photo",
  },
];

function ImageCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPause] = useState(false);

  const handlers = useSwipeable({
    onSwipedLeft: () => nextImage(),
    onSwipedRight: () => previousImage(),
    delta: 20,
    preventScrollOnSwipe: true,
    trackMouse: true 

});

  const nextImage = () => {
    if (currentIndex === images.length - 1) {
      setCurrentIndex(0);
    } else {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const previousImage = () => {
    if (currentIndex === 0) {
      setCurrentIndex(images.length - 1);
    } else {
      setCurrentIndex(currentIndex - 1);
    }
  };
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex((currentIndex) => {
        if (currentIndex === images.length - 1) {
          return 0;
        } else {
          return currentIndex + 1;
        }
      });
    }, 3000);

    return () => clearInterval(timer);
  }, [isPaused]);

  return (
    <div {...handlers} className="relative mx-auto w-full max-w-4xl" onMouseEnter={() => setIsPause(true)}
      onMouseLeave={() => setIsPause(false)}>
      <img
        src={images[currentIndex].src}
        alt={images[currentIndex].alt}
        className="select-none pointer-events-none h-96 w-full rounded-lg object-cover"
      />

      <button
        onClick={previousImage}
        className="absolute left-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border-2 border-tech-gold text-2xl text-tech-gold opacity-70 transition duration-300 hover:bg-tech-gold hover:text-deep-space hover:opacity-100"
        >
        &lt;
    </button>

    <button
        onClick={nextImage}
        className="absolute right-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border-2 border-tech-gold text-2xl text-tech-gold opacity-70 transition duration-300 hover:bg-tech-gold hover:text-deep-space hover:opacity-100"
        >
        &gt;
    </button>

      <div className="mt-4 flex justify-center gap-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-3 w-3 rounded-full ${
              index === currentIndex ? "bg-tech-gold" : "bg-gray-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export default ImageCarousel;