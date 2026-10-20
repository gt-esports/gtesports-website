import { Link } from "react-router-dom";
import FAQ from "./FAQ";
import { useSiteContent } from "../hooks/useSiteContent";
// import SubscribeForm from "./Form";

function AboutInformation() {
  const content = useSiteContent("about");
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-16 py-10">
      {/* WHO WE ARE Section - Image Removed */}
      <div className="w-full px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h3 className="mb-6 font-bayon text-3xl tracking-wide text-tech-gold">
            WHO WE ARE
          </h3>
          <p className="whitespace-pre-line font-quicksand text-lg leading-relaxed text-white">
            {content.whoBody}
          </p>
        </div>
      </div>

      {/* WHAT WE STAND FOR Section */}
      <div className="w-full px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h3 className="mb-6 font-bayon text-3xl tracking-wide text-tech-gold">
            WHAT WE STAND FOR
          </h3>
          <p className="whitespace-pre-line font-quicksand text-lg leading-relaxed text-white">
            {content.valuesBody}
          </p>
        </div>
      </div>

      {/* Meet Our Leadership Button */}
      <div className="flex justify-center">
        <Link
          to="/leadership"
          className="inline-block rounded-full bg-tech-gold px-10 py-4 font-bold uppercase tracking-wide text-white shadow-lg transition-all duration-300 hover:bg-yellow-500 hover:shadow-xl"
        >
          Meet Our Leadership
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
          {/* <SubscribeForm /> */}
          <div className="flex w-full flex-col items-center justify-center rounded-lg border border-white/10 bg-black/40 px-6 py-12 text-center backdrop-blur-sm">
            <h4 className="font-bayon text-2xl tracking-wider text-white md:text-3xl">
              COMING SOON
            </h4>
            <p className="mt-2 whitespace-pre-line text-lg text-gray-300">
              {content.updatesBody}
            </p>
          </div>
        </div>
      </div>
    </div>


  );
}

export default AboutInformation;
