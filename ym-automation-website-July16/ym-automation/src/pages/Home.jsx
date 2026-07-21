import React from "react";
import Hero from "../components/Hero.jsx";
import AboutUs from "../components/AboutUs.jsx";
import OurServices from "../components/OurServices.jsx";
import OurApproach from "../components/OurApproach.jsx";
import OurProjects from "../components/OurProjects.jsx";
import OurCustomers from "../components/OurCustomers.jsx";

export default function Home() {
  return (
    <>
      <Hero />
      <AboutUs />
      <OurServices />
      <OurApproach />
      <OurProjects />
      <OurCustomers />
    </>
  );
}
