import type React from "react";
import ProfileCard from "../components/ProfileCard";
import type { ProfileCardProps } from "../types";
import Footer from "../components/Footer";

const executives: ProfileCardProps[] = [
  {
    image: "",
    name: 'Matt G. "Sultann"',
    position: "President",
    linkedinUrl: "https://www.linkedin.com/in/mattgerami/",
  },
  {
    image: "",
    name: "DJ Fratt",
    position: "Vice President",
    linkedinUrl: "https://www.linkedin.com/in/dj-fratt/",
  },
  {
    image: "",
    name: "Francesco V.",
    position: "Executive Finance Officer",
    linkedinUrl: "https://www.linkedin.com/in/fvezzola/",
  },
  {
    image: "",
    name: "Jim C.",
    position: "Head of Engineering",
    linkedinUrl: "https://www.linkedin.com/in/loxij/",
  },
  {
    image: "",
    name: "Ben E.",
    position: "Director of Competitive Gaming",
    linkedinUrl: "https://www.linkedin.com/in/benjamin-edmonds-2912ba20a/",
  },
  {
    image: "",
    name: "Beeta E",
    position: "Director of Marketing & Creative Media",
    linkedinUrl: "https://www.linkedin.com/in/beetaenfaradi/",
  },
  {
    image: "",
    name: "Tyler L.",
    position: "Director of Events & Activations",
    linkedinUrl: "https://www.linkedin.com/in/tylermlam/",
  },
];

const development: ProfileCardProps[] = [
  {
    image: "",
    name: "Kevin H.",
    position: "Software Developer",
    linkedinUrl: "https://www.linkedin.com/in/sijunkevinhu/",
  },
  {
    image: "",
    name: "May L.",
    position: "Software Developer",
    linkedinUrl: "https://www.linkedin.com/in/mei-li-ba800b290/",
  },
  {
    image: "",
    name: "Wilson G.",
    position: "Software Developer",
    linkedinUrl: "https://www.linkedin.com/in/gaowilson81/",
  },
  {
    image: "",
    name: "Ethan L.",
    position: "Software Developer",
    linkedinUrl: "https://www.linkedin.com/in/ethan-loo-73a1b0236/",
  },
];

const creative: ProfileCardProps[] = [
  {
    image: "",
    name: "Anthea C.",
    position: "Creative Team",
    linkedinUrl: "https://www.linkedin.com/in/anthea-chu-639390333/",
  },
  {
    image: "",
    name: "Justin W.",
    position: "Creative Team",
    linkedinUrl: "https://www.linkedin.com/in/justin-b-williams",
  },
  {
    image: "",
    name: "Emmaly N.",
    position: "Creative Team",
    linkedinUrl: "https://www.linkedin.com/in/emmaly-nguyen",
  },
  {
    image: "",
    name: "Oluteniola O.",
    position: "Creative Team",
    linkedinUrl: "https://www.linkedin.com/in/oluteniola-oshin/",
  },
];

const OurTeam: React.FC = () => {
  const renderSection = (title: string, members: ProfileCardProps[]) => {
    return (
      <section className="py-12">
        <h2 className="mb-10 text-center font-bayon text-4xl tracking-wider text-white">
          {title}
        </h2>
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-4 sm:grid-cols-2 lg:grid-cols-3">
          {members.map((member) => (
            <div key={member.name} className="flex justify-center">
              <ProfileCard {...member} />
            </div>
          ))}
        </div>
      </section>
    );
  };

  return (
    <div className="min-h-screen bg-black bg-streak bg-cover pt-36">
      <div className="container mx-auto px-4">
        <h1 className="mb-16 text-center font-bayon text-6xl tracking-wider text-white">
          OUR TEAM
        </h1>

        {renderSection("EXECUTIVES", executives)}
        {renderSection("DEVELOPMENT", development)}
        {renderSection("CREATIVE", creative)}
      </div>
      <Footer />
    </div>
  );
};

export default OurTeam;
