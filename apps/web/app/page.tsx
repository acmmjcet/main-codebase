"use client";
import { useEffect, useState } from "react";
import { API_ENDPOINTS } from '@acm/api-endpoints';
import Hero from "@/components/Hero";
import DummyPage from "@/components/LandingPage/Dummy-trial-2";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

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
      <div
        className={`fixed z-50 h-screen w-full ${
          loading ? "block" : "hidden"
          } `}
          >
        <DummyPage handleLoading={handleLoading} />
      </div>
      <Footer/>
    </>
  );
};