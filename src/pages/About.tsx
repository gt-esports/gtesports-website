import React from "react";
import Footer from "../components/Footer";
import AboutInformation from "../components/AboutInformation";
function About() {
  return (
      <div className="flex w-full flex-col bg-streak bg-cover justify-center">
        <div className="flex items-center justify-center">
          <div className="flex justify-center pt-24 w-full"> 
            <AboutInformation />
          </div>
        </div>
            <Footer/>
      </div>
    
      
  
    
  );
}

export default About;
