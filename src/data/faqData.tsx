import { Link } from "react-router-dom";

export const faqs = [
  {
    question: "Is this organization only for competitive gamers?",
    answer:
    (
      <>
        <p>Not at all! We host gaming communities for competitive and casual gamers alike. Check out our <Link to="/games" className="underline">Games</Link> page 
        to see a list of our communities!
        </p>
      </>
    )
  },
  {
    question: "What are the time commitments for this organization?",
    answer:
      "There is no specific time commitment necessary to join our communities. Commitments depend on your expectations and interests for the gaming community!",
  },
  {
    question: "How do I join?",
    answer: (
      <>
        <p>Discord links in the <Link to="/games" className="underline">Games</Link> page, link to our main <Link to="https://discord.gg/gtesports" className="underline">Discord</Link>, link to our <Link to="https://gatech.campuslabs.com/engage/organization/esports" className="underline">Engage</Link>.</p>
      </>
    )
  },
];
