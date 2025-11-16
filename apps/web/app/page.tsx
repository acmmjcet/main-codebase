"use client";
import { useEffect, useState } from "react";
import { API_ENDPOINTS } from '@acm/api-endpoints';
import Hero from "@/components/Hero";
import LoadingScreen from "@/components/LoadingScreen";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AboutSection from "@/components/LandingPage/About";
import FacultyCoordinator from "@/components/LandingPage/Faculty-Coordinator";

export default function Index() {
  useEffect(()=>{
    console.log(API_ENDPOINTS.message)
  })
  const [loading, setLoading] = useState(true);

  const handleLoading = () => {
    setLoading(false);
  };  

  
  return (
    <>
      <Navbar/>
      <Hero/>
      {loading && <LoadingScreen onComplete={handleLoading} />}
      <FacultyCoordinator/>
      <AboutSection/>
      <Footer/>
    </>
  );
};