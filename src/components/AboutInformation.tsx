import logoImage from "../assets/gt-esports-logo1.png";
import ProfileGrid from './ProfileGrid';
import FAQ from "./FAQ";
import Form from "./Form"

function AboutInformation() {
  return (
    <div className="flex flex-col items-center pt-10 w-full">
      <h1 className="font-bayon text-6xl text-white">
        ABOUT
      </h1>

      <div className="w-full flex flex-row items-start">
        {/* Text Section */}
        <div className="flex-1 ml-20">
          <h3 className="text-3xl font-bayon tracking-wide text-tech-gold mb-4">
            WHO WE ARE
          </h3>
          <p className="text-white max-w-2xl pt-3 text-white font-bayon">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </p>
        </div>
        
        {/* Image Section */}
        <div className="flex-shrink-0">
          <img
            src={logoImage}
            alt="Holding Image"
            className="object-contain max-w-md mr-20"
          />
        </div>
      </div>

        {/* Section with WHAT WE STAND FOR */}
      <div className="w-full flex flex-row items-start">
      <div className="flex-1 ml-20">
        <h3 className="text-3xl font-bayon tracking-wide text-tech-gold mb-4">
          WHAT WE STAND FOR
        </h3>
        <p className="text-white max-w-full pt-3 text-white normal-case mr-20">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </p>
        </div>
      </div>

      <div className="font-bayon text-normal font-normal tracking-wide text-white text-center mt-20 w-full">
      <h1 className="text-white text-3xl font-banyon mb-8">Staff Profiles</h1>
        <ProfileGrid />
      </div>

      <div className="font-bayon text-normal font-normal tracking-wide text-white text-center my-20 w-full">
        
          <h1 className="text-3xl font-bayon tracking-wide text-white mb-8">
          FREQUENTLY ASKED QUESTIONS
          </h1>
          <FAQ />
        
      </div>

      <div className="font-bayon text-normal font-normal tracking-wide text-white my-20 w-full">
      <h1 className="text-3xl font-bayon tracking-wide text-white mb-8 text-center">
          CONTACT US
          </h1>
        <Form/>
        </div>
      
    </div>
  );
}

export default AboutInformation;
