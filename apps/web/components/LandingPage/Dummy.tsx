"use client";
import React, { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

const DummyPage = ({ handleLoading }: { handleLoading?: any }) => {
  const [currentPhase, setCurrentPhase] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Three.js refs
  const sceneRef = useRef<any>(null);
  const cameraRef = useRef<any>(null);
  const rendererRef = useRef<any>(null);
  const dataFlowRef = useRef<any>(null);
  const serverRacksRef = useRef<any>(null);
  const scanLinesRef = useRef<any>(null);

  // Initialize Three.js Scene
  useEffect(() => {
    if (!canvasRef.current) return;

    const THREE = (window as any).THREE;
    if (!THREE) {
      console.error("Three.js not loaded");
      return;
    }

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x000000, 5, 15);
    
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 8);

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

    // Create Server Racks (3D Boxes representing servers)
    const serverRacks = new THREE.Group();
    const rackGeometry = new THREE.BoxGeometry(0.8, 1.5, 0.3);
    
    for (let i = 0; i < 12; i++) {
      const material = new THREE.MeshPhongMaterial({
        color: 0x1a1a2e,
        emissive: 0x0066ff,
        emissiveIntensity: 0.2,
        shininess: 100,
        transparent: true,
        opacity: 0.8,
      });
      
      const rack = new THREE.Mesh(rackGeometry, material);
      const angle = (i / 12) * Math.PI * 2;
      const radius = 4;
      rack.position.set(
        Math.cos(angle) * radius,
        Math.sin(i * 0.5) * 2,
        Math.sin(angle) * radius
      );
      rack.rotation.y = -angle;
      
      // Add small lights to simulate server LEDs
      const ledCount = 8;
      for (let j = 0; j < ledCount; j++) {
        const led = new THREE.Mesh(
          new THREE.BoxGeometry(0.05, 0.05, 0.1),
          new THREE.MeshBasicMaterial({
            color: Math.random() > 0.5 ? 0x00ff00 : 0xff0000,
            transparent: true,
            opacity: 0.9,
          })
        );
        led.position.set(
          -0.3 + (j % 4) * 0.2,
          0.5 - Math.floor(j / 4) * 0.3,
          0.2
        );
        rack.add(led);
      }
      
      serverRacks.add(rack);
    }
    scene.add(serverRacks);
    serverRacksRef.current = serverRacks;

    // Create Data Flow Lines (representing network connections)
    const dataFlow = new THREE.Group();
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x00ffff,
      transparent: true,
      opacity: 0.6,
      linewidth: 2,
    });

    for (let i = 0; i < 50; i++) {
      const points = [];
      const startAngle = Math.random() * Math.PI * 2;
      const endAngle = startAngle + Math.random() * Math.PI;
      
      const startRadius = 3 + Math.random() * 2;
      const endRadius = 3 + Math.random() * 2;
      
      points.push(
        new THREE.Vector3(
          Math.cos(startAngle) * startRadius,
          (Math.random() - 0.5) * 4,
          Math.sin(startAngle) * startRadius
        )
      );
      points.push(
        new THREE.Vector3(
          Math.cos(endAngle) * endRadius,
          (Math.random() - 0.5) * 4,
          Math.sin(endAngle) * endRadius
        )
      );
      
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const line = new THREE.Line(geometry, lineMaterial);
      dataFlow.add(line);
    }
    scene.add(dataFlow);
    dataFlowRef.current = dataFlow;

    // Create Scan Lines Effect
    const scanLines = new THREE.Group();
    for (let i = 0; i < 20; i++) {
      const geometry = new THREE.PlaneGeometry(20, 0.02);
      const material = new THREE.MeshBasicMaterial({
        color: 0x00ff88,
        transparent: true,
        opacity: 0.1,
        side: THREE.DoubleSide,
      });
      const line = new THREE.Mesh(geometry, material);
      line.position.y = -10 + i;
      scanLines.add(line);
    }
    scene.add(scanLines);
    scanLinesRef.current = scanLines;

    // Create Particle System (data packets)
    const particlesGeometry = new THREE.BufferGeometry();
    const particleCount = 2000;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 3 + Math.random() * 5;
      positions[i] = Math.cos(angle) * radius;
      positions[i + 1] = (Math.random() - 0.5) * 10;
      positions[i + 2] = Math.sin(angle) * radius;

      const color = new THREE.Color();
      color.setHSL(Math.random() * 0.2 + 0.5, 1, 0.5);
      colors[i] = color.r;
      colors[i + 1] = color.g;
      colors[i + 2] = color.b;
    }

    particlesGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );
    particlesGeometry.setAttribute(
      "color",
      new THREE.BufferAttribute(colors, 3)
    );

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.03,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 1);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x00ffff, 2, 20);
    pointLight1.position.set(5, 5, 5);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xff0088, 2, 20);
    pointLight2.position.set(-5, -5, 5);
    scene.add(pointLight2);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(0, 10, 10);
    scene.add(directionalLight);

    // Animation Loop
    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.01;

      // Rotate server racks
      if (serverRacksRef.current) {
        serverRacksRef.current.rotation.y += 0.002;
        serverRacksRef.current.children.forEach((rack: any, index: number) => {
          rack.children.forEach((led: any, ledIndex: number) => {
            if (led.material) {
              led.material.opacity = 0.5 + Math.sin(time * 3 + ledIndex) * 0.5;
            }
          });
        });
      }

      // Animate data flow
      if (dataFlowRef.current) {
        dataFlowRef.current.rotation.y += 0.001;
        dataFlowRef.current.children.forEach((line: any, index: number) => {
          line.material.opacity = 0.3 + Math.sin(time * 2 + index * 0.1) * 0.3;
        });
      }

      // Animate scan lines
      if (scanLinesRef.current) {
        scanLinesRef.current.position.y = (time * 2) % 20 - 10;
        scanLinesRef.current.children.forEach((line: any) => {
          line.material.opacity = 0.05 + Math.sin(time * 5) * 0.05;
        });
      }

      // Animate particles
      const positions = particles.geometry.attributes.position.array;
      for (let i = 1; i < positions.length; i += 3) {
        positions[i] += Math.sin(time + i) * 0.01;
        if (positions[i] > 5) positions[i] = -5;
        if (positions[i] < -5) positions[i] = 5;
      }
      particles.geometry.attributes.position.needsUpdate = true;
      particles.rotation.y += 0.0005;

      // Camera slight movement
      camera.position.x = Math.sin(time * 0.1) * 0.5;
      camera.position.y = Math.cos(time * 0.15) * 0.3;
      camera.lookAt(0, 0, 0);

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

  // GSAP Timeline Animation
  useGSAP(() => {
    const timeline = gsap.timeline();

    // Phase 1: Ideate
    timeline.to({}, {
      duration: 0.5,
      onStart: () => setCurrentPhase(0),
    });

    timeline.to(".phase-0", {
      duration: 1.5,
      scale: 1.1,
      opacity: 1,
      ease: "power2.inOut",
    });

    timeline.to(".phase-0", {
      duration: 1,
      x: window.innerWidth,
      ease: "power3.in",
      onComplete: () => setCurrentPhase(1),
    });

    // Phase 2: Innovate
    timeline.to(".phase-1", {
      duration: 1.5,
      scale: 1.1,
      opacity: 1,
      ease: "power2.inOut",
    });

    timeline.to(".phase-1", {
      duration: 1,
      y: -window.innerHeight,
      ease: "power3.in",
      onComplete: () => setCurrentPhase(2),
    });

    // Phase 3: Incubate
    timeline.to(".phase-2", {
      duration: 1.5,
      scale: 1.1,
      opacity: 1,
      ease: "power2.inOut",
    });

    timeline.to(".phase-2", {
      duration: 1,
      rotation: 90,
      scale: 0,
      opacity: 0,
      ease: "power3.in",
    });

    // Final: Complete loading
    timeline.to(".loader-container", {
      duration: 0.8,
      opacity: 0,
      scale: 1.5,
      ease: "power2.in",
      onComplete: () => {
        if (handleLoading) handleLoading();
      },
    });

  }, []);

  const phases = [
    { text: "Ideate", color: "from-cyan-400 via-blue-500 to-purple-600" },
    { text: "Innovate", color: "from-green-400 via-emerald-500 to-teal-600" },
    { text: "Incubate", color: "from-orange-400 via-red-500 to-pink-600" },
  ];

  return (
    <div ref={containerRef} className="loader-container fixed inset-0 z-50 overflow-hidden">
      {/* Three.js Canvas Background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{
          background: "radial-gradient(circle at center, #0a0a0a 0%, #000000 100%)",
        }}
      />

      {/* Grid Overlay */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: `
          linear-gradient(rgba(0, 255, 255, 0.3) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0, 255, 255, 0.3) 1px, transparent 1px)
        `,
        backgroundSize: "50px 50px",
      }} />

      {/* Scanline Effect */}
      <div className="absolute inset-0 pointer-events-none opacity-5" style={{
        backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 255, 255, 0.5) 2px, rgba(0, 255, 255, 0.5) 4px)",
        animation: "scanline 8s linear infinite",
      }} />

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center h-full w-full px-4 sm:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 max-w-7xl w-full">
          
          {/* "We" Text */}
          <div className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white tracking-tight">
            <span className="inline-block" style={{
              textShadow: "0 0 20px rgba(0, 255, 255, 0.5), 0 0 40px rgba(0, 255, 255, 0.3)",
            }}>
              We
            </span>
          </div>

          {/* Phase Container */}
          <div className="relative w-full sm:w-auto sm:flex-1 max-w-2xl h-32 sm:h-40 md:h-48">
            {phases.map((phase, index) => (
              <div
                key={index}
                className={`phase-${index} absolute inset-0 flex items-center justify-center sm:justify-start ${
                  currentPhase === index ? "opacity-100" : "opacity-0"
                }`}
                style={{
                  transform: currentPhase === index ? "scale(1)" : "scale(0.8)",
                }}
              >
                <div className="relative">
                  <h2
                    className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black bg-gradient-to-r ${phase.color} bg-clip-text text-transparent tracking-tight`}
                    style={{
                      textShadow: "0 0 30px rgba(0, 255, 255, 0.3)",
                    }}
                  >
                    · {phase.text}
                  </h2>
                  
                  {/* Glitch Effect Lines */}
                  <div className="absolute inset-0 opacity-30">
                    <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${phase.color}`} 
                         style={{ animation: "glitch 3s infinite" }} />
                    <div className={`absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r ${phase.color}`} 
                         style={{ animation: "glitch 3s infinite reverse" }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* System Info Overlay */}
      <div className="absolute top-4 left-4 right-4 sm:top-8 sm:left-8 sm:right-8 flex justify-between items-start font-mono text-xs sm:text-sm pointer-events-none">
        <div className="space-y-1 text-cyan-400">
          <div className="opacity-70">SYSTEM: ACM_CORE</div>
          <div className="opacity-70">STATUS: <span className="text-green-400">INITIALIZING</span></div>
        </div>
        <div className="space-y-1 text-cyan-400 text-right">
          <div className="opacity-70">CPU: 100%</div>
          <div className="opacity-70">NETWORK: <span className="text-green-400">ACTIVE</span></div>
        </div>
      </div>

      {/* Bottom Progress */}
      <div className="absolute bottom-4 left-4 right-4 sm:bottom-8 sm:left-8 sm:right-8 pointer-events-none">
        <div className="flex items-center gap-2 font-mono text-xs sm:text-sm text-cyan-400 opacity-70">
          <div className="flex-1 h-1 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"
              style={{
                width: `${((currentPhase + 1) / phases.length) * 100}%`,
                transition: "width 1s ease-in-out",
              }}
            />
          </div>
          <span>{Math.round(((currentPhase + 1) / phases.length) * 100)}%</span>
        </div>
      </div>

      <style jsx>{`
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        @keyframes glitch {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-3px); }
          75% { transform: translateX(3px); }
        }
      `}</style>
    </div>
  );
};

export default DummyPage;