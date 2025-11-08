"use client";
import React, { useEffect, useRef, useState } from "react";

const DummyPage = ({ handleLoading }: { handleLoading?: () => void }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState(0);
  const [textOpacity, setTextOpacity] = useState(0);
  const [wordOpacities, setWordOpacities] = useState<number[]>([]);
  const animationStateRef = useRef({
    time: 0,
    formationProgress: 0,
    dispersing: false,
    animationFrame: 0
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d", { alpha: false });
    if (!canvas || !ctx) return;

    const width = (canvas.width = window.innerWidth);
    const height = (canvas.height = window.innerHeight);

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
      baseAlpha: number;
      hue: number;
      exploded: boolean;
    }

    const particles: Particle[] = [];
    const particleCount = 800;
    const connectionDistance = 100;

    // Responsive scaling based on viewport
    const getScaleFactor = () => {
      if (width < 640) return 0.28; // Mobile
      if (width < 1024) return 0.45; // Tablet
      return 0.65; // Desktop
    };

    const generateLetterPoints = () => {
      const tempCanvas = document.createElement('canvas');
      const tempCtx = tempCanvas.getContext('2d');
      if (!tempCtx) return [];
      
      tempCanvas.width = 1200;
      tempCanvas.height = 300;
      
      tempCtx.font = 'bold 160px Arial';
      tempCtx.textAlign = 'center';
      tempCtx.textBaseline = 'middle';
      
      tempCtx.fillStyle = 'white';
      tempCtx.fillText('ACM MJCET', 600, 150);
      
      const points: { x: number; y: number; z: number }[] = [];
      
      const imageData = tempCtx.getImageData(0, 0, 1200, 300);
      const data = imageData.data;
      
      const scaleFactor = getScaleFactor();
      
      for (let y = 0; y < 300; y += 4) {
        for (let x = 0; x < 1200; x += 4) {
          const i = (y * 1200 + x) * 4;
          if (data[i + 3] > 128) {
            for (let layer = -1; layer <= 1; layer++) {
              if (Math.random() < 0.35) {
                points.push({
                  x: (x - 600) * scaleFactor,
                  y: (y - 150) * scaleFactor,
                  z: layer * 20 + (Math.random() - 0.5) * 15
                });
              }
            }
          }
        }
      }
      
      return points;
    };

    const letterPoints = generateLetterPoints();

    // Initialize particles with explosion effect
    for (let i = 0; i < particleCount; i++) {
      const target = letterPoints[Math.floor(Math.random() * letterPoints.length)];
      const explosionAngle = Math.random() * Math.PI * 2;
      const explosionRadius = Math.random() * 600 + 400;
      
      particles.push({
        x: Math.cos(explosionAngle) * explosionRadius,
        y: Math.sin(explosionAngle) * explosionRadius,
        z: (Math.random() - 0.5) * 1000,
        targetX: target.x,
        targetY: target.y,
        targetZ: target.z,
        vx: 0,
        vy: 0,
        vz: 0,
        size: Math.random() * 2 + 1,
        alpha: 0,
        baseAlpha: Math.random() * 0.4 + 0.6,
        hue: Math.random() < 0.7 ? 0 : 210 + Math.random() * 20,
        exploded: false
      });
    }

    const easeInOutCubic = (t: number) => {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    };

    const draw = () => {
      const state = animationStateRef.current;
      state.time += 0.01;
      
      if (!state.dispersing) {
        state.formationProgress = Math.min(state.formationProgress + 0.005, 1);
      }
      
      ctx.fillStyle = "#0a0a0a";
      ctx.fillRect(0, 0, width, height);

      const rotationY = Math.sin(state.time * 0.2) * 0.15;
      const rotationX = Math.cos(state.time * 0.15) * 0.08;
      
      const cosY = Math.cos(rotationY);
      const sinY = Math.sin(rotationY);
      const cosX = Math.cos(rotationX);
      const sinX = Math.sin(rotationX);
      const perspective = 800;

      // Transform and sort particles
      const transformedParticles = particles.map(p => {
        let x3d = p.x * cosY - p.z * sinY;
        let z3d = p.z * cosY + p.x * sinY;
        let y3d = p.y * cosX - z3d * sinX;
        z3d = z3d * cosX + p.y * sinX;
        
        const scale = perspective / (perspective + z3d);
        
        return {
          particle: p,
          x3d,
          y3d,
          z3d,
          scale,
          x2d: x3d * scale + width / 2,
          y2d: y3d * scale + height / 2
        };
      }).sort((a, b) => a.z3d - b.z3d);

      // Draw connections (optimized)
      if (state.formationProgress > 0.3) {
        ctx.strokeStyle = `rgba(207, 207, 207, 0.12)`;
        ctx.lineWidth = 0.5;
        
        for (let i = 0; i < transformedParticles.length; i++) {
          const tp1 = transformedParticles[i];
          const p1 = tp1.particle;
          
          for (let j = i + 1; j < Math.min(i + 4, transformedParticles.length); j++) {
            const tp2 = transformedParticles[j];
            const p2 = tp2.particle;
            
            const dx = p1.x - p2.x;
            const dy = p1.y - p2.y;
            const dz = p1.z - p2.z;
            const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
            
            if (dist < connectionDistance) {
              const connectionStrength = 1 - dist / connectionDistance;
              const avgAlpha = (p1.alpha + p2.alpha) / 2;
              
              ctx.strokeStyle = `rgba(207, 207, 207, ${connectionStrength * avgAlpha * 0.15})`;
              ctx.beginPath();
              ctx.moveTo(tp1.x2d, tp1.y2d);
              ctx.lineTo(tp2.x2d, tp2.y2d);
              ctx.stroke();
            }
          }
        }
      }

      // Update and draw particles
      transformedParticles.forEach(({ particle: p, x2d, y2d, z3d, scale }) => {
        if (state.dispersing) {
          if (!p.exploded) {
            const disperseAngle = Math.atan2(p.y - p.targetY, p.x - p.targetX);
            p.vx = Math.cos(disperseAngle) * 8;
            p.vy = Math.sin(disperseAngle) * 8;
            p.vz = (Math.random() - 0.5) * 10;
            p.exploded = true;
          }
          
          p.x += p.vx;
          p.y += p.vy;
          p.z += p.vz;
          p.alpha = Math.max(p.alpha - 0.02, 0);
        } else {
          const ease = 0.05 * easeInOutCubic(state.formationProgress);
          p.vx += (p.targetX - p.x) * ease;
          p.vy += (p.targetY - p.y) * ease;
          p.vz += (p.targetZ - p.z) * ease;
          
          p.vx *= 0.88;
          p.vy *= 0.88;
          p.vz *= 0.88;
          
          p.x += p.vx;
          p.y += p.vy;
          p.z += p.vz;
          
          p.alpha = Math.min(p.alpha + 0.012, p.baseAlpha);
        }

        const depthFactor = Math.max(0, Math.min(1, (z3d + 400) / 800));
        const size = p.size * scale * (0.5 + state.formationProgress * 0.5);
        
        // Skip particles that are behind the camera or would cause negative radius
        if (z3d < -perspective || size <= 0 || x2d < -50 || x2d > width + 50 || y2d < -50 || y2d > height + 50) {
          return;
        }
        
        let r, g, b;
        if (p.hue === 0) {
          const brightness = Math.floor(180 + depthFactor * 75);
          r = brightness;
          g = brightness;
          b = brightness;
        } else {
          r = Math.floor(27 + depthFactor * 40);
          g = Math.floor(38 + depthFactor * 50);
          b = Math.floor(59 + depthFactor * 60);
        }
        
        // Simplified glow
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${p.alpha * 0.3})`;
        ctx.beginPath();
        ctx.arc(x2d, y2d, size * 2, 0, Math.PI * 2);
        ctx.fill();
        
        // Core particle
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${p.alpha})`;
        ctx.beginPath();
        ctx.arc(x2d, y2d, size, 0, Math.PI * 2);
        ctx.fill();
      });

      state.animationFrame = requestAnimationFrame(draw);
    };

    draw();

    // Text animation
    const textTimer = setTimeout(() => {
      const words = "INNOVATION IS AT THE HEART OF EVERYTHING WE DO.".split(' ');
      setWordOpacities(new Array(words.length).fill(0));
      
      const duration = 2500;
      const startTime = Date.now();
      
      const animateText = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeProgress = easeInOutCubic(progress);
        
        setTextOpacity(easeProgress);
        
        const newOpacities = words.map((_, i) => {
          const wordStart = i / words.length;
          const wordEnd = (i + 1) / words.length;
          const wordProgress = Math.max(0, Math.min(1, (progress - wordStart) / (wordEnd - wordStart + 0.2)));
          return easeInOutCubic(wordProgress);
        });
        setWordOpacities(newOpacities);
        
        if (progress < 1) {
          requestAnimationFrame(animateText);
        } else {
          setPhase(1);
        }
      };
      
      requestAnimationFrame(animateText);
    }, 1800);

    const phase2Timer = setTimeout(() => setPhase(2), 5000);
    
    const phase3Timer = setTimeout(() => {
      setPhase(3);
      animationStateRef.current.dispersing = true;
    }, 8000);
    
    const fadeTimer = setTimeout(() => {
      const fadeOutDuration = 2000;
      const fadeStartTime = Date.now();
      
      const fadeOut = () => {
        const elapsed = Date.now() - fadeStartTime;
        const progress = Math.min(elapsed / fadeOutDuration, 1);
        const easeProgress = easeInOutCubic(progress);
        
        if (containerRef.current) {
          containerRef.current.style.opacity = String(1 - easeProgress);
        }
        
        if (progress < 1) {
          requestAnimationFrame(fadeOut);
        } else {
          if (handleLoading) handleLoading();
        }
      };
      
      fadeOut();
    }, 10000);

    return () => {
      cancelAnimationFrame(animationStateRef.current.animationFrame);
      clearTimeout(textTimer);
      clearTimeout(phase2Timer);
      clearTimeout(phase3Timer);
      clearTimeout(fadeTimer);
    };
  }, [handleLoading]);

  const words = "INNOVATION IS AT THE HEART OF EVERYTHING WE DO.".split(' ');

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 flex flex-col items-center justify-center overflow-hidden z-[9999]"
      style={{ 
        fontFamily: "Poppins, sans-serif",
        background: "#0a0a0a"
      }}
    >
      <canvas ref={canvasRef} className="absolute inset-0" />

      <div
        ref={textRef}
        className="absolute top-[55%] left-1/2 transform -translate-x-1/2 z-10 text-center px-8 max-w-5xl"
        style={{
          opacity: textOpacity * 0.9,
          transform: `translate(-50%, 0) translateY(${(1 - textOpacity) * 30}px)`,
          transition: "none",
          willChange: "opacity, transform"
        }}
      >
        {words.map((word, i) => (
          <span
            key={i}
            className="text-xl sm:text-2xl md:text-3xl lg:text-4xl"
            style={{
              display: "inline-block",
              opacity: wordOpacities[i] || 0,
              color: "transparent",
              WebkitTextStroke: "1.2px rgba(207, 207, 207, 0.4)",
              textShadow: `
                0 0 8px rgba(207, 207, 207, 0.5),
                0 0 16px rgba(207, 207, 207, 0.3),
                0 0 24px rgba(27, 38, 59, 0.25)
              `,
              filter: `drop-shadow(0 0 6px rgba(207, 207, 207, 0.3))`,
              letterSpacing: "0.05em",
              marginRight: "0.35em",
              transform: `translateY(${(1 - (wordOpacities[i] || 0)) * 15}px)`,
              transition: "none",
              willChange: "opacity, transform"
            }}
          >
            {word}
          </span>
        ))}
      </div>

      <div className="absolute bottom-8 left-8 right-8 pointer-events-none">
        <div className="flex items-center gap-3 font-mono text-xs text-gray-400 opacity-60">
          <div className="flex-1 h-0.5 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{
                background: "linear-gradient(90deg, #1B263B 0%, #CFCFCF 50%, #1B263B 100%)",
                width: `${(phase / 3) * 100}%`,
                transition: "width 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
                boxShadow: "0 0 10px rgba(207, 207, 207, 0.3)"
              }}
            />
          </div>
          <span style={{ color: "#CFCFCF", minWidth: "40px", textAlign: "right" }}>
            {Math.round((phase / 3) * 100)}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default DummyPage;