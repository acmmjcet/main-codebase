"use client";
import React, { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import Image from "next/image";

const DummyPage = ({ handleLoading }: { handleLoading?: any }) => {
  const [currentPhase, setCurrentPhase] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Three.js refs
  const sceneRef = useRef<any>(null);
  const cameraRef = useRef<any>(null);
  const rendererRef = useRef<any>(null);
  const meshGridRef = useRef<any>(null);
  const dataFlowRef = useRef<any>(null);
  const particlesRef = useRef<any>(null);

  // Initialize Three.js Scene with 3D Mesh Grid
  useEffect(() => {
    if (!canvasRef.current) return;

    const THREE = (window as any).THREE;
    if (!THREE) {
      console.error("Three.js not loaded");
      return;
    }

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x000814, 10, 30);
    
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 3, 15);

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    sceneRef.current = scene;
    cameraRef.current = camera;
    rendererRef.current = renderer;

    // Create 3D Mesh Wave Grid - Main Innovation Visual
    const meshGrid = new THREE.Group();
    const gridSize = 60;
    const spacing = 0.6;
    const waveGeometry = new THREE.PlaneGeometry(spacing * 0.85, spacing * 0.85);
    
    for (let x = 0; x < gridSize; x++) {
      for (let z = 0; z < gridSize; z++) {
        const material = new THREE.MeshPhongMaterial({
          color: 0x0088ff,
          emissive: 0x0044cc,
          emissiveIntensity: 0.4,
          shininess: 150,
          transparent: true,
          opacity: 0.5,
          side: THREE.DoubleSide,
          wireframe: false,
        });
        
        const mesh = new THREE.Mesh(waveGeometry, material);
        mesh.position.set(
          (x - gridSize / 2) * spacing,
          0,
          (z - gridSize / 2) * spacing - 15
        );
        mesh.rotation.x = -Math.PI / 2;
        mesh.userData = { baseX: x, baseZ: z };
        
        meshGrid.add(mesh);
      }
    }
    scene.add(meshGrid);
    meshGridRef.current = meshGrid;

    // Create Floating Data Orbs - Innovation Nodes
    const orbsGroup = new THREE.Group();
    for (let i = 0; i < 30; i++) {
      const orbGeometry = new THREE.SphereGeometry(0.1 + Math.random() * 0.15, 16, 16);
      const orbMaterial = new THREE.MeshPhongMaterial({
        color: Math.random() > 0.5 ? 0x00ffff : 0xff00ff,
        emissive: Math.random() > 0.5 ? 0x00aaaa : 0xaa00aa,
        emissiveIntensity: 0.8,
        transparent: true,
        opacity: 0.7,
        shininess: 100,
      });
      
      const orb = new THREE.Mesh(orbGeometry, orbMaterial);
      const angle = (i / 30) * Math.PI * 2;
      const radius = 8 + Math.random() * 4;
      orb.position.set(
        Math.cos(angle) * radius,
        (Math.random() - 0.5) * 6,
        Math.sin(angle) * radius
      );
      orb.userData = { 
        speedY: 0.01 + Math.random() * 0.02,
        speedRotation: 0.01 + Math.random() * 0.02,
        angle: angle,
        radius: radius
      };
      
      orbsGroup.add(orb);
    }
    scene.add(orbsGroup);
    dataFlowRef.current = orbsGroup;

    // Create Connection Lines between Orbs
    const linesGroup = new THREE.Group();
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x00ffff,
      transparent: true,
      opacity: 0.15,
    });

    for (let i = 0; i < 40; i++) {
      const points = [];
      const startAngle = Math.random() * Math.PI * 2;
      const endAngle = startAngle + (Math.random() - 0.5) * Math.PI;
      
      const startRadius = 7 + Math.random() * 5;
      const endRadius = 7 + Math.random() * 5;
      
      points.push(
        new THREE.Vector3(
          Math.cos(startAngle) * startRadius,
          (Math.random() - 0.5) * 5,
          Math.sin(startAngle) * startRadius
        )
      );
      points.push(
        new THREE.Vector3(
          Math.cos(endAngle) * endRadius,
          (Math.random() - 0.5) * 5,
          Math.sin(endAngle) * endRadius
        )
      );
      
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const line = new THREE.Line(geometry, lineMaterial);
      linesGroup.add(line);
    }
    scene.add(linesGroup);

    // Enhanced Particle System
    const particlesGeometry = new THREE.BufferGeometry();
    const particleCount = 3000;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    for (let i = 0; i < particleCount * 3; i += 3) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 5 + Math.random() * 15;
      positions[i] = Math.cos(angle) * radius;
      positions[i + 1] = (Math.random() - 0.5) * 20;
      positions[i + 2] = Math.sin(angle) * radius;

      const color = new THREE.Color();
      color.setHSL(0.5 + Math.random() * 0.3, 1, 0.6);
      colors[i] = color.r;
      colors[i + 1] = color.g;
      colors[i + 2] = color.b;
      
      sizes[i / 3] = Math.random() * 0.05;
    }

    particlesGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );
    particlesGeometry.setAttribute(
      "color",
      new THREE.BufferAttribute(colors, 3)
    );
    particlesGeometry.setAttribute(
      "size",
      new THREE.BufferAttribute(sizes, 1)
    );

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.05,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });

    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);
    particlesRef.current = particles;

    // Dynamic Lighting System
    const ambientLight = new THREE.AmbientLight(0x222244, 0.8);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x00ffff, 3, 30);
    pointLight1.position.set(8, 8, 8);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xff00ff, 3, 30);
    pointLight2.position.set(-8, -5, 8);
    scene.add(pointLight2);

    const pointLight3 = new THREE.PointLight(0x00ff88, 2, 25);
    pointLight3.position.set(0, 12, -5);
    scene.add(pointLight3);

    // Animation Loop with Wave Effects
    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.016;

      // Animate 3D Mesh Grid with Ripple Waves
      if (meshGridRef.current) {
        meshGridRef.current.children.forEach((mesh: any) => {
          const x = mesh.userData.baseX;
          const z = mesh.userData.baseZ;
          const distance = Math.sqrt(
            Math.pow(x - 30, 2) + Math.pow(z - 30, 2)
          );
          
          // Multi-layered wave equation
          const wave1 = Math.sin(distance * 0.15 - time * 2) * 1.2;
          const wave2 = Math.cos(distance * 0.1 - time * 1.5) * 0.8;
          const wave3 = Math.sin(x * 0.2 + time) * Math.cos(z * 0.2 + time) * 0.5;
          
          mesh.position.y = wave1 + wave2 + wave3;
          
          // Dynamic color based on height
          const normalizedHeight = (mesh.position.y + 2) / 4;
          mesh.material.emissiveIntensity = 0.2 + normalizedHeight * 0.6;
          mesh.material.opacity = 0.3 + Math.abs(normalizedHeight) * 0.3;
        });
      }

      // Animate Floating Orbs
      if (dataFlowRef.current) {
        dataFlowRef.current.children.forEach((orb: any) => {
          orb.position.y += Math.sin(time * orb.userData.speedY * 5) * 0.02;
          orb.userData.angle += orb.userData.speedRotation;
          orb.position.x = Math.cos(orb.userData.angle) * orb.userData.radius;
          orb.position.z = Math.sin(orb.userData.angle) * orb.userData.radius;
          orb.rotation.x += 0.01;
          orb.rotation.y += 0.01;
          
          // Pulsing effect
          const scale = 1 + Math.sin(time * 3 + orb.userData.angle) * 0.2;
          orb.scale.set(scale, scale, scale);
          orb.material.emissiveIntensity = 0.5 + Math.sin(time * 2) * 0.3;
        });
      }

      // Animate Particles
      if (particlesRef.current) {
        const positions = particlesRef.current.geometry.attributes.position.array;
        for (let i = 0; i < positions.length; i += 3) {
          positions[i + 1] += Math.sin(time * 0.5 + i) * 0.02;
          
          if (positions[i + 1] > 10) positions[i + 1] = -10;
          if (positions[i + 1] < -10) positions[i + 1] = 10;
        }
        particlesRef.current.geometry.attributes.position.needsUpdate = true;
        particlesRef.current.rotation.y += 0.0003;
      }

      // Dynamic Camera Movement
      camera.position.x = Math.sin(time * 0.15) * 3;
      camera.position.y = 3 + Math.cos(time * 0.2) * 1.5;
      camera.position.z = 15 + Math.sin(time * 0.1) * 3;
      camera.lookAt(0, 0, 0);

      // Animate Lights
      pointLight1.position.x = Math.cos(time * 0.5) * 10;
      pointLight1.position.z = Math.sin(time * 0.5) * 10;
      
      pointLight2.position.x = Math.sin(time * 0.7) * 8;
      pointLight2.position.y = -5 + Math.cos(time * 0.6) * 3;

      renderer.render(scene, camera);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      if (cameraRef.current && rendererRef.current) {
        cameraRef.current.aspect = window.innerWidth / window.innerHeight;
        cameraRef.current.updateProjectionMatrix();
        rendererRef.current.setSize(window.innerWidth, window.innerHeight);
      }
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
    };
  }, []);

  // GSAP Timeline Animation for Tagline
  useGSAP(() => {
    const timeline = gsap.timeline();

    // Phase 0: INNOVATION - Explosive entrance
    timeline.fromTo(".phase-0", 
      {
        scale: 0.3,
        opacity: 0,
        rotationX: -120,
        y: -150,
        filter: "blur(40px)"
      },
      {
        duration: 1.8,
        scale: 1.2,
        opacity: 1,
        rotationX: 0,
        y: 0,
        filter: "blur(0px)",
        ease: "elastic.out(1, 0.5)",
        onStart: () => setCurrentPhase(0),
      }
    );

    // Breathing pulse
    timeline.to(".phase-0", {
      duration: 0.6,
      scale: 1.25,
      ease: "sine.inOut",
    });

    timeline.to(".phase-0", {
      duration: 0.4,
      scale: 1.15,
      ease: "sine.inOut",
    });

    // Exit with rotation and blur
    timeline.to(".phase-0", {
      duration: 1,
      scale: 0.2,
      opacity: 0,
      rotationY: 180,
      z: -500,
      filter: "blur(30px)",
      ease: "power3.in",
    });

    // Phase 1: IS AT THE HEART - Heart pulse with beat
    timeline.fromTo(".phase-1", 
      {
        scale: 0,
        opacity: 0,
        rotationZ: -45
      },
      {
        duration: 1.2,
        scale: 1,
        opacity: 1,
        rotationZ: 0,
        ease: "back.out(2.5)",
        onStart: () => setCurrentPhase(1),
      }
    );

    // First heartbeat
    timeline.to(".phase-1", {
      duration: 0.25,
      scale: 1.2,
      ease: "power2.out",
    });
    
    timeline.to(".phase-1", {
      duration: 0.2,
      scale: 0.95,
      ease: "power2.in",
    });
    
    // Second heartbeat
    timeline.to(".phase-1", {
      duration: 0.25,
      scale: 1.15,
      ease: "power2.out",
    });

    timeline.to(".phase-1", {
      duration: 0.25,
      scale: 1,
      ease: "power2.inOut",
    });

    // Hold and glow
    timeline.to(".phase-1", {
      duration: 0.6,
      scale: 1.05,
      ease: "sine.inOut",
    });

    // Exit upward with fade
    timeline.to(".phase-1", {
      duration: 0.9,
      y: -window.innerHeight * 1.2,
      opacity: 0,
      scale: 0.8,
      ease: "power3.in",
    });

    // Phase 2: OF EVERYTHING WE DO - Wave text entrance
    timeline.fromTo(".phase-2", 
      {
        opacity: 0,
        y: 150,
        scale: 0.7,
        rotationX: 45
      },
      {
        duration: 1.6,
        opacity: 1,
        y: 0,
        scale: 1.1,
        rotationX: 0,
        ease: "power3.out",
        onStart: () => setCurrentPhase(2),
      }
    );

    // Shimmer effect
    timeline.to(".phase-2", {
      duration: 0.8,
      scale: 1.15,
      ease: "sine.inOut",
    });

    timeline.to(".phase-2", {
      duration: 0.6,
      scale: 1.12,
      ease: "sine.inOut",
    });

    // Hold finale
    timeline.to(".phase-2", {
      duration: 0.8,
      scale: 1.2,
      ease: "power1.inOut",
    });

    // Final explosive fade
    timeline.to(".loader-container", {
      duration: 1.4,
      opacity: 0,
      filter: "blur(40px) brightness(2)",
      scale: 2,
      ease: "power2.in",
      onComplete: () => {
        if (handleLoading) handleLoading();
      },
    });

  }, []);

  const phases = [
    { text: "INNOVATION", color: "from-cyan-300 via-blue-400 to-purple-500" },
    { text: "IS AT THE HEART", color: "from-pink-400 via-red-400 to-orange-500" },
    { text: "OF EVERYTHING WE DO", color: "from-green-300 via-emerald-400 to-teal-500" },
  ];

  return (
    <div ref={containerRef} className="loader-container fixed inset-0 z-50 overflow-hidden">
      {/* Three.js Canvas Background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{
          background: "radial-gradient(ellipse at center, #001a33 0%, #000510 60%, #000000 100%)",
        }}
      />

      {/* Subtle Grid Overlay */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: `
          linear-gradient(rgba(0, 200, 255, 0.4) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0, 200, 255, 0.4) 1px, transparent 1px)
        `,
        backgroundSize: "60px 60px",
      }} />

      {/* Animated Scanline */}
      <div className="absolute inset-0 pointer-events-none opacity-10" style={{
        backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0, 255, 255, 0.6) 3px, rgba(0, 255, 255, 0.6) 6px)",
        animation: "scanline 10s linear infinite",
      }} />

      {/* Radial Glow Overlay */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(circle at 50% 50%, rgba(0, 150, 255, 0.15) 0%, transparent 60%)",
      }} />

      {/* Main Content - Tagline Animation */}
      <div className="relative z-10 flex items-center justify-center h-full w-full px-4 sm:px-8">
        <div className="flex flex-col items-center justify-center gap-8 max-w-7xl w-full">
          
          {/* Phase Container */}
          <div className="relative w-full max-w-6xl" style={{ minHeight: "350px" }}>
            {phases.map((phase, index) => (
              <div
                key={index}
                className={`phase-${index} absolute inset-0 flex items-center justify-center ${
                  currentPhase === index ? "opacity-100" : "opacity-0"
                }`}
                style={{
                  transform: currentPhase === index ? "scale(1)" : "scale(0.8)",
                  perspective: "1500px",
                  transformStyle: "preserve-3d",
                }}
              >
                <div className="relative text-center">
                  <h2
                    className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-black bg-gradient-to-r ${phase.color} bg-clip-text text-transparent tracking-tight leading-tight px-4 py-2`}
                    style={{
                      textShadow: "0 0 60px rgba(0, 200, 255, 0.5), 0 0 100px rgba(100, 150, 255, 0.3)",
                      fontFamily: "'Inter', 'SF Pro Display', system-ui, -apple-system, sans-serif",
                      letterSpacing: "-0.03em",
                      fontWeight: 900,
                    }}
                  >
                    {phase.text}
                  </h2>
                  
                  {/* Heart Icon for Phase 1 */}
                  {index === 1 && (
                    <div className="mt-6 flex justify-center heart-container">
                      <svg width="100" height="100" viewBox="0 0 100 100" className="heart-icon">
                        <defs>
                          <linearGradient id="heartGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" style={{ stopColor: "#ff6b9d", stopOpacity: 1 }} />
                            <stop offset="50%" style={{ stopColor: "#ff3366", stopOpacity: 1 }} />
                            <stop offset="100%" style={{ stopColor: "#ff8844", stopOpacity: 1 }} />
                          </linearGradient>
                          <filter id="glow">
                            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                            <feMerge>
                              <feMergeNode in="coloredBlur"/>
                              <feMergeNode in="SourceGraphic"/>
                            </feMerge>
                          </filter>
                        </defs>
                        <path
                          d="M50,85 C50,85 15,60 15,38 C15,25 23,17 32,17 C41,17 48,24 50,28 C52,24 59,17 68,17 C77,17 85,25 85,38 C85,60 50,85 50,85 Z"
                          fill="none"
                          stroke="url(#heartGradient)"
                          strokeWidth="3.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          filter="url(#glow)"
                          style={{
                            animation: "heartPulse 1.5s ease-in-out infinite",
                          }}
                        />
                      </svg>
                    </div>
                  )}
                  
                  {/* Floating Particles around Text */}
                  <div className="absolute inset-0 overflow-visible pointer-events-none" style={{ transform: "translateZ(50px)" }}>
                    {[...Array(12)].map((_, i) => (
                      <div
                        key={i}
                        className={`absolute rounded-full bg-gradient-to-r ${phase.color}`}
                        style={{
                          width: `${4 + Math.random() * 6}px`,
                          height: `${4 + Math.random() * 6}px`,
                          left: `${10 + i * 7}%`,
                          top: `${20 + (i % 4) * 20}%`,
                          opacity: 0.5 + Math.random() * 0.3,
                          animation: `float-particle-${i % 4} ${2.5 + i * 0.2}s ease-in-out infinite`,
                          boxShadow: `0 0 15px rgba(${index === 0 ? '0, 200, 255' : index === 1 ? '255, 100, 150' : '0, 255, 150'}, 0.6)`,
                        }}
                      />
                    ))}
                  </div>
                  
                  {/* Glow Effect Lines */}
                  <div className="absolute inset-0 opacity-20 pointer-events-none">
                    <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${phase.color}`} 
                         style={{ animation: "glitchLine 2s infinite", filter: "blur(2px)" }} />
                    <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${phase.color}`} 
                         style={{ animation: "glitchLine 2s infinite reverse", filter: "blur(2px)" }} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ACM MJCET Badge */}
          <div className="absolute bottom-20 sm:bottom-24 md:bottom-28 left-1/2 transform -translate-x-1/2">
            {/* <div className="relative group"> */}
              {/* <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div> */}
              {/* <div className="relative bg-black/60 backdrop-blur-xl border-2 border-cyan-400/40 rounded-full px-8 py-3 shadow-2xl"> */}
                {/* <p className="text-cyan-300 font-mono text-sm sm:text-base md:text-lg tracking-widest font-bold"> */}
                  {/* ACM MJCET */}
                  <Image
                    alt="ACM Logo"
                    height={280}
                    width={320}
                    src="/logo_without_bg.png"
                  />
                {/* </p> */}
              {/* </div> */}
            {/* </div> */}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-6 sm:bottom-8 left-6 right-6 sm:left-12 sm:right-12 pointer-events-none z-20">
        <div className="flex items-center gap-3 font-mono text-xs sm:text-sm text-cyan-300">
          <div className="flex-1 h-1.5 bg-gray-900/80 backdrop-blur-sm rounded-full overflow-hidden border border-cyan-500/20">
            <div
              className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 rounded-full relative"
              style={{
                width: `${((currentPhase + 1) / phases.length) * 100}%`,
                transition: "width 1.2s cubic-bezier(0.4, 0, 0.2, 1)",
                boxShadow: "0 0 20px rgba(0, 200, 255, 0.6)",
              }}
            >
              <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
            </div>
          </div>
          <span className="text-cyan-400 font-bold min-w-[3rem] text-right">
            {Math.round(((currentPhase + 1) / phases.length) * 100)}%
          </span>
        </div>
      </div>

      <style jsx>{`
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        
        @keyframes glitchLine {
          0%, 100% { transform: translateX(0) scaleX(1); opacity: 0.2; }
          25% { transform: translateX(-5px) scaleX(0.98); opacity: 0.4; }
          50% { transform: translateX(3px) scaleX(1.02); opacity: 0.3; }
          75% { transform: translateX(-2px) scaleX(0.99); opacity: 0.35; }
        }
        
        @keyframes heartPulse {
          0%, 100% { transform: scale(1); }
          25% { transform: scale(1.1); }
          50% { transform: scale(1.05); }
          75% { transform: scale(1.12); }
        }
        
        @keyframes float-particle-0 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(10px, -15px) rotate(90deg); }
          50% { transform: translate(-5px, -25px) rotate(180deg); }
          75% { transform: translate(-15px, -10px) rotate(270deg); }
        }
        
        @keyframes float-particle-1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-12px, 18px) scale(1.2); }
          66% { transform: translate(8px, -12px) scale(0.9); }
        }
        
        @keyframes float-particle-2 {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        @keyframes float-particle-3 {
          0%, 100% { transform: translate(0, 0); opacity: 0.5; }
          25% { transform: translate(15px, -10px); opacity: 0.8; }
          50% { transform: translate(8px, -20px); opacity: 0.6; }
          75% { transform: translate(-8px, -15px); opacity: 0.9; }
        }
      `}</style>
    </div>
  );
};

export default DummyPage;