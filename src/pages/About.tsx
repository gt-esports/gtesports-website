"use client";

import Footer from "../components/Footer";
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
    <div className="flex min-h-screen flex-col bg-streak bg-cover pt-36">
      <div className="mb-8 text-center">
        <h1 className="font-bayon text-6xl tracking-wider text-white">ABOUT</h1>
        <div className="mx-auto mt-4 h-1 w-24 bg-tech-gold"></div>
      </div>

      <AboutInformation />

      <Footer />
    </div>
  );
}

export default About;
