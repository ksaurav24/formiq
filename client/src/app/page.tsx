"use client";

import Hero from "@/components/sections/hero";
import Navbar from "@/components/sections/navbar";
import WhySection from "@/components/sections/why";
import HowItWorksSection from "@/components/sections/how-it-works";
import FeaturesSection from "@/components/sections/features";
import Footer from "@/components/sections/footer";
 

export default function Home() { 
  return (
    <div className="dark:bg-black bg-zinc-100 "> 
          <Navbar/>
          <Hero/>
          <WhySection/>
          <HowItWorksSection/>
          <FeaturesSection/>
          <Footer/>
    </div>
  );
}
