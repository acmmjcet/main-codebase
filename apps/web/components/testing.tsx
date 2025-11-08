"use client";
import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CustomEase } from "gsap/CustomEase";
import { CustomWiggle } from "gsap/CustomWiggle";
import "./Hero.css";

gsap.registerPlugin(ScrollTrigger, CustomEase, CustomWiggle);

const Hero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    CustomWiggle.create("myWiggle", { wiggles: 8, type: "easeOut" });

    const text = textRef.current;
    const container = containerRef.current;

    // Entrance animation
    gsap.fromTo(
      text,
      {
        opacity: 0,
        y: 120,
        rotateX: 45,
        scale: 0.9,
        filter: "blur(10px)",
      },
      {
        opacity: 1,
        y: 0,
        rotateX: 0,
        scale: 1,
        filter: "blur(0px)",
        ease: "myWiggle",
        duration: 1.8,
        scrollTrigger: {
          trigger: container,
          start: "top 80%",
          end: "bottom 60%",
          scrub: true,
        },
      }
    );

    // Background gradient movement with scroll
    gsap.to(container, {
      backgroundPosition: "100% center",
      ease: "sine.inOut",
      scrollTrigger: {
        trigger: container,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });

    // Subtle 3D oscillation
    gsap.to(text, {
      rotateY: 10,
      duration: 4,
      ease: "power1.inOut",
      yoyo: true,
      repeat: -1,
    });

    // Mouse interactivity (depth parallax)
    const handleMouseMove = (e: MouseEvent) => {
      if (!container || !text) return;
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      gsap.to(text, {
        rotationY: x * 25,
        rotationX: y * -15,
        transformPerspective: 800,
        ease: "power2.out",
        duration: 0.6,
      });
    };

    container?.addEventListener("mousemove", handleMouseMove);
    return () => container?.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <section ref={containerRef} className="hero-container">
      <div ref={textRef} className="hero-text">
        <span className="acm">acm</span>&nbsp;
        <span className="mjcet">mjcet</span>
        <div className="sub">Student Chapter</div>
      </div>
    </section>
  );
};

export default Hero;
