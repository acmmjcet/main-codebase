"use client";
import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

const DummyPage = ({ handleLoading }: { handleLoading?: () => void }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    let animationFrame: number;
    const width = (canvas.width = window.innerWidth);
    const height = (canvas.height = window.innerHeight);

    // Particle system
    interface Particle {
      x: number;
      y: number;
      z: number;
      targetX: number;
      targetY: number;
      targetZ: number;
      vx: number;
      vy: number;
      vz: number;
      size: number;
      alpha: number;
    }

    const particles: Particle[] = [];
    const particleCount = 800;

    // Generate heart shape points in 3D
    const heartShape: { x: number; y: number; z: number }[] = [];
    for (let t = 0; t < Math.PI * 2; t += 0.08) {
      for (let layer = -3; layer <= 3; layer++) {
        const x = 16 * Math.pow(Math.sin(t), 3);
        const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
        const z = layer * 2;
        heartShape.push({ x, y, z });
      }
    }

    // Initialize particles at random positions
    for (let i = 0; i < particleCount; i++) {
      const target = heartShape[Math.floor(Math.random() * heartShape.length)];
      particles.push({
        x: (Math.random() - 0.5) * width,
        y: (Math.random() - 0.5) * height,
        z: (Math.random() - 0.5) * 500,
        targetX: target.x,
        targetY: target.y,
        targetZ: target.z,
        vx: 0,
        vy: 0,
        vz: 0,
        size: Math.random() * 2 + 1,
        alpha: 0,
      });
    }

    let time = 0;
    let formationProgress = 0;

    const draw = () => {
      time += 0.01;
      formationProgress = Math.min(formationProgress + 0.008, 1);
      
      ctx.fillStyle = "rgba(0, 0, 0, 0.15)";
      ctx.fillRect(0, 0, width, height);

      // Rotate heart
      const rotationY = time * 0.3;
      
      particles.forEach((p) => {
        // Easing towards target position
        const ease = 0.05 * formationProgress;
        p.vx += (p.targetX - p.x / 10) * ease;
        p.vy += (p.targetY + p.y / 10) * ease;
        p.vz += (p.targetZ - p.z) * ease;
        
        p.vx *= 0.9;
        p.vy *= 0.9;
        p.vz *= 0.9;
        
        p.x += p.vx;
        p.y += p.vy;
        p.z += p.vz;
        
        p.alpha = Math.min(p.alpha + 0.02, 1);

        // 3D rotation
        const cosY = Math.cos(rotationY);
        const sinY = Math.sin(rotationY);
        
        const x3d = p.x * cosY - p.z * sinY;
        const z3d = p.z * cosY + p.x * sinY;
        
        // Perspective projection
        const perspective = 600;
        const scale = perspective / (perspective + z3d);
        
        const x2d = x3d * scale + width / 2;
        const y2d = -p.y * scale + height / 2;
        
        // Size based on depth
        const size = p.size * scale * (0.5 + formationProgress * 0.5);
        
        // Color based on depth
        const depthColor = Math.floor(100 + (z3d + 100) * 0.5);
        
        // Glow effect
        const gradient = ctx.createRadialGradient(x2d, y2d, 0, x2d, y2d, size * 3);
        gradient.addColorStop(0, `rgba(255, ${depthColor}, 120, ${p.alpha * 0.8})`);
        gradient.addColorStop(0.5, `rgba(255, ${depthColor}, 120, ${p.alpha * 0.3})`);
        gradient.addColorStop(1, `rgba(255, ${depthColor}, 120, 0)`);
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x2d, y2d, size * 2, 0, Math.PI * 2);
        ctx.fill();
        
        // Core particle
        ctx.fillStyle = `rgba(255, ${depthColor + 50}, 140, ${p.alpha})`;
        ctx.beginPath();
        ctx.arc(x2d, y2d, size, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrame = requestAnimationFrame(draw);
    };
    draw();

    // Tagline fade-in with glass effect
    gsap.fromTo(
      textRef.current,
      { opacity: 0, y: 50, filter: "blur(10px)" },
      {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        delay: 2.5,
        duration: 1.5,
        ease: "power3.out",
        onStart: () => setPhase(1),
      }
    );

    return () => cancelAnimationFrame(animationFrame);
  }, []);

  // Phase-based timeline
  useGSAP(() => {
    const tl = gsap.timeline({ delay: 4.5 });

    tl.to({}, {
      duration: 2,
      onStart: () => setPhase(2),
    });

    tl.to(containerRef.current, {
      opacity: 0,
      scale: 1.2,
      duration: 1.2,
      ease: "power3.inOut",
      onStart: () => setPhase(3),
      onComplete: () => {
        if (handleLoading) handleLoading();
      },
    });
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 flex flex-col items-center justify-center overflow-hidden bg-black text-white z-[9999]"
      style={{ fontFamily: "Poppins, sans-serif" }}
    >
      <canvas ref={canvasRef} className="absolute inset-0" />

      {/* Glass-like transparent text */}
      <div
        ref={textRef}
        className="relative z-10 text-center text-3xl sm:text-4xl md:text-5xl font-semibold px-8"
        style={{
          color: "rgba(255, 255, 255, 0.1)",
          textShadow: `
            0 0 1px rgba(255, 255, 255, 0.3),
            0 0 3px rgba(255, 120, 150, 0.2),
            0 0 8px rgba(255, 120, 150, 0.1),
            1px 1px 0 rgba(255, 255, 255, 0.1),
            -1px -1px 0 rgba(255, 255, 255, 0.1)
          `,
          backdropFilter: "blur(2px)",
          WebkitBackdropFilter: "blur(2px)",
          background: "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)",
          WebkitBackgroundClip: "text",
          border: "1px solid rgba(255, 255, 255, 0.05)",
          borderRadius: "8px",
          padding: "20px 40px",
          boxShadow: "inset 0 0 20px rgba(255, 120, 150, 0.1)",
        }}
      >
        INNOVATION IS AT THE HEART OF EVERYTHING WE DO.
      </div>

      {/* Progress indicator */}
      <div className="absolute bottom-6 left-8 right-8 pointer-events-none">
        <div className="flex items-center gap-2 font-mono text-sm text-pink-400 opacity-70">
          <div className="flex-1 h-1 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-pink-400 to-orange-400 rounded-full"
              style={{
                width: `${(phase / 3) * 100}%`,
                transition: "width 1s ease-in-out",
              }}
            />
          </div>
          <span>{Math.round((phase / 3) * 100)}%</span>
        </div>
      </div>
    </div>
  );
};

export default DummyPage;