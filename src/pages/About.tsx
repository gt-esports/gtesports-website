import AboutInformation from "../components/AboutInformation";
import ImageCarousel from "../components/ImageCarousel";

function About() {
  return (
    <div className="flex min-h-screen flex-col bg-deep-space pt-24">
      <div className="mb-8 text-center">
        <h1 className="font-outfit text-5xl font-bold tracking-wider text-white md:text-6xl">ABOUT <span className="text-tech-gold">US</span></h1>
        <div className="mx-auto mt-4 h-1 w-24 bg-tech-gold"></div>
      </div>
      <ImageCarousel />

      <AboutInformation />
    </div>
  );
}

export default About;
