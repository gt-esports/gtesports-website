import logoImage from "../assets/gtesportsimage.png";
import ProfileGrid from './ProfileGrid';
import FAQ from "./FAQ";
import Form from "./Form"

function AboutInformation() {
  return (
    <div className="flex flex-col items-center pt-10 w-[90%]">
      <div className="w-full flex flex-row">
        {/* Text Section */}
        <div className="flex-1 mx-20">
          <h3 className="text-3xl font-bayon tracking-wide text-tech-gold mb-4">
            WHO WE ARE
          </h3>
          <p className="max-w-2xl pt-3 text-white font-quicksand text-lg">
              Georgia Tech Esports, or GT Esports, is an organization and a community for all gamers, both competitive and casual.
              We strive to help nurture the growth of both our communities around Georgia Tech.
              For our competitive players, we help our competitive teams to participate in collegiate leagues.
              As for our casual community, we actively host social and casual gaming events. Our goal is to help make esports all-inclusive for everyone who’d like to be involved.
          </p>
        </div>
        
        {/* Image Section */}
        <div className="flex-shrink-0 rounded-lg">
          <img
            src={logoImage}
            alt="Holding Image"
            className="object-contain max-w-md mr-20 rounded-lg backdrop-blur-2xl"
          />
        </div>
      </div>

        {/* Section with WHAT WE STAND FOR */}
      <div className="w-full flex flex-row items-start">
      <div className="flex-1 ml-20">
        <h3 className="text-3xl font-bayon tracking-wide text-tech-gold mb-4">
          WHAT WE STAND FOR
        </h3>
        <p className="max-w-full pt-3 text-white normal-case mr-20">
            We stand for the expansion and democratization of esports across the world.
            Georgia Tech is not only a leader and an innovator in collegiate esports competition - we
            are a hive of innovators Creating the Next transformative models for the esports space.
            With a rich history extending to the beginning of commercial gaming,
            Georgia Tech Esports has long been a driving force in the background of
            competitive gaming for good, and we strive to carry on that mission.
        </p>
        </div>
      </div>

      <div className="font-bayon text-normal font-normal tracking-wide text-white text-center mt-20 w-full">
      <h1 className="text-white text-3xl font-banyon mb-8">Staff Profiles</h1>
        <ProfileGrid />
      </div>

      <div className="font-bayon text-normal font-normal tracking-wide text-white text-center mt-20 w-full">
          <h1 className="text-3xl font-bayon tracking-wide text-white mb-8">
          FREQUENTLY ASKED QUESTIONS
          </h1>
          <FAQ />
      </div>
      <div className="font-bayon text-normal font-normal tracking-wide text-white my-10 w-full">
        <h1 className="text-3xl font-bayon tracking-wide text-white text-center pb-10">
              CONTACT US
          </h1>
        <Form/>
      </div>
      
    </div>
  );
}

export default AboutInformation;
