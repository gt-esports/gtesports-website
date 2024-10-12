import Footer from "../components/Footer";
import AboutInformation from "../components/AboutInformation";
function About() {
  return (
    <div className="flex flex-col items-center justify-center bg-streak bg-cover pt-36 w-full">
        <div className="flex items-center justify-center">
            <h1 className="justify-center font-bayon text-6xl text-white">ABOUT</h1>
        </div>
        <div className="flex items-center justify-center w-[95%] pt-4">
            <AboutInformation/>
        </div>
        <Footer />
    </div>
  );
}

export default About;
