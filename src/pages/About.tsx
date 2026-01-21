// "use client";

import AboutInformation from "../components/AboutInformation";
import { useEffect } from "react";
import axios from "axios";

function About() {
  const fetchAPI = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api");
      console.log((response.data as { about?: string })?.about);
    } catch (error) {
      console.error("Error fetching API data:", error);
    }
  };

  useEffect(() => {
    void fetchAPI();
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-deep-space pt-24">
      <div className="mb-8 text-center">
        <h1 className="font-outfit text-5xl font-bold tracking-wider text-white md:text-6xl">ABOUT <span className="text-tech-gold">US</span></h1>
        <div className="mx-auto mt-4 h-1 w-24 bg-tech-gold"></div>
      </div>

      <AboutInformation />
    </div>
  );
}

export default About;
