import logoImage from "../assets/gtesportsimage.png";
import ProfileGrid from "./ProfileGrid";
import FAQ from "./FAQ";
import Form from "./Form";

function AboutInformation() {
  return (
    <div className="flex w-[90%] flex-col items-center gap-12 pt-10">
      <div className="flex w-full flex-col items-center gap-8 lg:flex-row">
        {/* Text Section */}
        <div className="ml-20 flex flex-1 flex-col items-start">
          <h3 className="mb-4 font-bayon text-3xl tracking-wide text-tech-gold">
            WHO WE ARE
          </h3>
          <p className="max-w-2xl pt-3 font-quicksand text-lg text-white">
            Georgia Tech Esports, or GT Esports, is an organization and a
            community for all gamers, both competitive and casual. We strive to
            help nurture the growth of both our communities around Georgia Tech.
            For our competitive players, we help our competitive teams to
            participate in collegiate leagues. As for our casual community, we
            actively host social and casual gaming events. Our goal is to help
            make esports all-inclusive for everyone who’d like to be involved.
          </p>
        </div>

        {/* Image Section */}
        <div className="flex-shrink-0 rounded-lg">
          <img
            src={logoImage}
            alt="Holding Image"
            className="max-w-md rounded-lg object-contain backdrop-blur-2xl"
          />
        </div>
      </div>

      {/* Section with WHAT WE STAND FOR */}
      <div className="flex w-full flex-row items-start">
        <div className="ml-20 flex-1">
          <h3 className="mb-4 font-bayon text-3xl tracking-wide text-tech-gold">
            WHAT WE STAND FOR
          </h3>
          <p className="mr-20 max-w-full pt-3 normal-case text-white">
            We stand for the expansion and democratization of esports across the
            world. Georgia Tech is not only a leader and an innovator in
            collegiate esports competition - we are a hive of innovators
            Creating the Next transformative models for the esports space. With
            a rich history extending to the beginning of commercial gaming,
            Georgia Tech Esports has long been a driving force in the background
            of competitive gaming for good, and we strive to carry on that
            mission.
          </p>
        </div>
      </div>

      <div className="text-normal mt-20 w-full text-center font-bayon font-normal tracking-wide text-white">
        <h1 className="font-banyon mb-8 text-3xl text-white">
          Executive Staff Profiles
        </h1>
        <ProfileGrid />
      </div>

      <div className="text-normal mt-20 w-full text-center font-bayon font-normal tracking-wide text-white">
        <h1 className="mb-8 font-bayon text-3xl tracking-wide text-white">
          FREQUENTLY ASKED QUESTIONS
        </h1>
        <FAQ />
      </div>
      <div className="text-normal my-10 w-full font-bayon font-normal tracking-wide text-white">
        <h1 className="pb-10 text-center font-bayon text-3xl tracking-wide text-white">
          CONTACT US
        </h1>
        <Form />
      </div>
    </div>
  );
}

export default AboutInformation;
