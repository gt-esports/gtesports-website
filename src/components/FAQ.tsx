"use client";

import { useState } from "react";
import { FaChevronDown } from "react-icons/fa";

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "Is this organization only for competitive gamers?",
      answer:
        "Not at all! We host gaming communities for competitive and casual gamers alike. Check out our games page" +
        " to see a list of our communities!",
    },
    {
      question: "What are the time commitments for this organization?",
      answer:
        "There is no specific time commitment necessary to join our communities. Depends on your expectations and interests for the gaming community!",
    },
    {
      question: "How do I join?",
      answer:
        "Discord links in the Games Page, link to our main Discord: https://discord.gg/gtesports, link to our Engage: https://gatech.campuslabs.com/engage/organization/esports.",
    },
  ];

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="mx-auto w-full space-y-4">
      {faqs.map((faq, index) => (
        <div
          key={index}
          className={`rounded-lg border border-gray-700 bg-gray-800 p-4 transition-all duration-200 ease-in-out ${
            openIndex === index ? "bg-opacity-80" : "bg-opacity-60"
          }`}
        >
          <button
            onClick={() => handleToggle(index)}
            className="flex w-full items-center justify-between text-left font-semibold text-white focus:outline-none"
          >
            <span className="text-lg tracking-wider">{faq.question}</span>
            <FaChevronDown
              className={`transition-transform duration-200 ${
                openIndex === index ? "rotate-180 transform" : ""
              }`}
            />
          </button>
          {openIndex === index && (
            <p className="mt-4 select-text text-start leading-relaxed text-gray-200">
              {faq.answer}
            </p>
          )}
        </div>
      ))}
    </div>
  );
};

export default FAQ;
