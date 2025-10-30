import { Link } from "react-router-dom";
import FAQ from "./FAQ";
import SubscribeForm from "./Form";

function AboutInformation() {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-16 py-10">
      {/* WHO WE ARE Section - Image Removed */}
      <div className="w-full px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h3 className="mb-6 font-bayon text-3xl tracking-wide text-tech-gold">
            WHO WE ARE
          </h3>
          <p className="font-quicksand text-lg leading-relaxed text-white">
            Georgia Tech Esports, or GT Esports, is an organization and a
            community for all gamers, both competitive and casual. We strive to
            help nurture the growth of both our communities around Georgia Tech.
            For our competitive players, we help our competitive teams to
            participate in collegiate leagues. As for our casual community, we
            actively host social and casual gaming events. Our goal is to help
            make esports all-inclusive for everyone who'd like to be involved.
          </p>
        </div>
      </div>

      {/* WHAT WE STAND FOR Section */}
      <div className="w-full px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h3 className="mb-6 font-bayon text-3xl tracking-wide text-tech-gold">
            WHAT WE STAND FOR
          </h3>
          <p className="font-quicksand text-lg leading-relaxed text-white">
            We stand for the expansion and democratization of esports across the
            world. Georgia Tech is not only a leader and an innovator in
            collegiate esports competition - we are a hive of innovators
            creating the next transformative models for the esports space. With
            a rich history extending to the beginning of commercial gaming,
            Georgia Tech Esports has long been a driving force in the background
            of competitive gaming for good, and we strive to carry on that
            mission.
          </p>
        </div>
      </div>

      {/* Meet Our Team Button */}
      <div className="flex justify-center">
        <Link
          to="/ourteam"
          className="inline-block rounded-full bg-tech-gold px-10 py-4 font-bold uppercase tracking-wide text-white shadow-lg transition-all duration-300 hover:bg-yellow-500 hover:shadow-xl"
        >
          Meet Our Team
        </Link>
      </div>

      {/* FAQ Section */}
      <div className="w-full px-6 lg:px-8">
        <h3 className="mb-10 text-center font-bayon text-3xl tracking-wide text-tech-gold">
          FREQUENTLY ASKED QUESTIONS
        </h3>
        <div className="mx-auto max-w-4xl">
          <FAQ />
        </div>
      </div>

      {/* Contact Section */}
      <div className="w-full px-6 pb-10 lg:px-8">
        <h3 className="mb-10 text-center font-bayon text-3xl tracking-wide text-tech-gold">
          Stay Updated
        </h3>
        <div className="mx-auto max-w-4xl">
          <SubscribeForm />
        </div>
      </div>
    </div>

    
  );
}

export default AboutInformation;
