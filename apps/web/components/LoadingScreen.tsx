"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";

interface LoadingScreenProps {
  onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [logoOpacity, setLogoOpacity] = useState(0);
  const [sideElementsOpacity, setSideElementsOpacity] = useState(0);
  const rafRef = useRef<number>();

  useEffect(() => {
    // Fade in logo and side elements
    setTimeout(() => {
      setLogoOpacity(1);
      setSideElementsOpacity(1);
    }, 100);

    // Simulate loading progress with smooth animation
    const duration = 2500; // 2.5 seconds total
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const rawProgress = Math.min(100, (elapsed / duration) * 100);
      
      // Ease out function for smooth deceleration
      const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
      const easedProgress = easeOut(rawProgress / 100) * 100;
      
      setProgress(easedProgress);

      if (rawProgress < 100) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        // Wait a brief moment at 100%, then fade out
        setTimeout(() => {
          setIsComplete(true);
          // Fade out animation
          setTimeout(() => {
            onComplete();
          }, 600); // Fade out duration
        }, 300);
      }
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-[#0a0a0a] transition-opacity duration-500 ease-out ${
        isComplete ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      style={{ transitionDuration: '600ms' }}
    >
      <div className="relative flex items-center justify-center w-full max-w-6xl px-8 md:px-12">
        {/* Left Side Element */}
        <div
          className="absolute left-0 md:left-8 flex items-center transition-opacity duration-700 ease-out"
          style={{ opacity: sideElementsOpacity }}
        >
          <div className="flex flex-col items-center gap-4">
            <div className="w-px h-16 bg-[#d0d0d0]/30" />
            <div className="w-2 h-2 rounded-full bg-[#d0d0d0]/40" />
            <div className="w-px h-16 bg-[#d0d0d0]/30" />
          </div>
        </div>

        {/* Center Content */}
        <div className="flex flex-col items-center text-center">
          {/* Logo */}
          <div
            className="mb-12 transition-opacity duration-700 ease-out"
            style={{ opacity: logoOpacity }}
          >
            <Image
              src="/logo_without_bg.png"
              alt="ACM MJCET Logo"
              width={200}
              height={93}
              className="w-40 h-auto md:w-48 lg:w-52"
              priority
            />
          </div>

          {/* Initialising text */}
          <div
            className="mb-6 text-[#d0d0d0] text-base md:text-lg tracking-[0.15em] transition-opacity duration-500"
            style={{
              fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
              fontWeight: 300,
              letterSpacing: "0.15em",
              opacity: logoOpacity,
            }}
          >
            Initialising…
          </div>

          {/* Progress percentage */}
          <div
            className="text-[#d0d0d0] text-xl md:text-2xl tracking-wider transition-opacity duration-500"
            style={{
              fontFamily: "'Courier New', 'Monaco', 'Menlo', monospace",
              fontWeight: 400,
              letterSpacing: "0.1em",
              opacity: logoOpacity,
            }}
          >
            {Math.round(progress)}%
          </div>
        </div>

        {/* Right Side Element */}
        <div
          className="absolute right-0 md:right-8 flex items-center transition-opacity duration-700 ease-out"
          style={{ opacity: sideElementsOpacity }}
        >
          <div className="flex flex-col items-center gap-4">
            <div className="w-px h-16 bg-[#d0d0d0]/30" />
            <div className="w-2 h-2 rounded-full bg-[#d0d0d0]/40" />
            <div className="w-px h-16 bg-[#d0d0d0]/30" />
          </div>
        </div>
      </div>
    </div>
  );
}

