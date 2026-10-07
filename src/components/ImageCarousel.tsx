import { useState } from "react";
import image1 from "../assets/about-image/placeholder.png";
import image2 from "../assets/about-image/placeholder2.png";


const images = [
  image1,
  image2,
  image1,
];

function ImageCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

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

  return (
    <div className="relative mx-auto w-full max-w-4xl">
      <img
        src={images[currentIndex]}
        alt={`Slide ${currentIndex + 1}`}
        className="h-96 w-full rounded-lg object-cover"
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