"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { ChevronDown } from "lucide-react";

// Types
interface ParticlesProps {
  count: number;
}

interface ImageMeshProps {
  url: string;
  index: number;
  total: number;
  progress: number;
}

interface CameraControllerProps {
  progress: number;
  isMobile: boolean;
}

interface SceneProps {
  progress: number;
  isMobile: boolean;
}

// Constants
const IMAGE_URLS = [
  "assets/hero_section_images/Hello_world_waasi.jpg",
  "assets/hero_section_images/award_delivery.jpg",
  "assets/hero_section_images/Ethnic_1.jpg",
  "assets/hero_section_images/Ethnic_2.jpg",
  "assets/hero_section_images/Ethnic_3.jpg",
  "assets/hero_section_images/Ethnic_4.jpg",
];

const PARTICLE_COUNT_MOBILE = 500;
const PARTICLE_COUNT_DESKTOP = 1000;
const MOBILE_BREAKPOINT = 768;

// Particles Component
const Particles = ({ count }: ParticlesProps) => {
  const pointsRef = useRef<THREE.Points>(null);
  const velocitiesRef = useRef<Float32Array>(new Float32Array(count * 3));

  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 80;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 80;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 40;
    velocitiesRef.current[i * 3] = (Math.random() - 0.5) * 0.015;
    velocitiesRef.current[i * 3 + 1] = (Math.random() - 0.5) * 0.015;
    velocitiesRef.current[i * 3 + 2] = (Math.random() - 0.5) * 0.01;
  }

  useFrame(() => {
    if (!pointsRef.current) return;
    const pos = pointsRef.current.geometry.attributes.position
      .array as Float32Array;

    for (let i = 0; i < count; i++) {
      pos[i * 3] += velocitiesRef.current[i * 3];
      pos[i * 3 + 1] += velocitiesRef.current[i * 3 + 1];
      pos[i * 3 + 2] += velocitiesRef.current[i * 3 + 2];

      if (Math.abs(pos[i * 3]) > 40) velocitiesRef.current[i * 3] *= -1;
      if (Math.abs(pos[i * 3 + 1]) > 40)
        velocitiesRef.current[i * 3 + 1] *= -1;
      if (Math.abs(pos[i * 3 + 2]) > 20)
        velocitiesRef.current[i * 3 + 2] *= -1;
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          args={[positions, 3]}
          attach="attributes-position"
          count={count}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        blending={THREE.AdditiveBlending}
        color="#666666"
        opacity={0.4}
        size={0.1}
        sizeAttenuation
        transparent
      />
    </points>
  );
};

// Image Mesh Component
const ImageMesh = ({ url, index, total, progress }: ImageMeshProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [texture, setTexture] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.load(
      url,
      (loadedTexture) => {
        loadedTexture.minFilter = THREE.LinearFilter;
        loadedTexture.magFilter = THREE.LinearFilter;
        setTexture(loadedTexture);
      },
      undefined,
      () => {
        const fallback = createFallbackTexture();
        setTexture(fallback);
      }
    );

    return () => {
      if (texture) {
        texture.dispose();
      }
    };
  }, [url]);

  useFrame((state) => {
    if (!meshRef.current) return;

    const time = state.clock.elapsedTime;
    const angleOffset = (index / total) * Math.PI * 2;
    const angle = angleOffset + time * 0.12;

    // Initial scattered positions
    const scatterRadius = 25;
    const scatterX = Math.cos(angleOffset * 2.3) * scatterRadius;
    const scatterY = Math.sin(angleOffset * 1.7) * scatterRadius;
    const scatterZ = -50 - index * 8;

    // Circle formation positions
    const circleRadius = 15;
    const circleX = Math.cos(angle) * circleRadius;
    const circleZ = Math.sin(angle) * circleRadius;
    const circleY = Math.sin(time * 0.5 + index) * 1.5;

    // Final scattered positions
    const finalRadius = 35;
    const finalX = Math.cos(angleOffset * 1.5) * finalRadius;
    const finalY = Math.sin(angleOffset * 2.1) * finalRadius;
    const finalZ = 80 + index * 10;

    let targetX = 0;
    let targetY = 0;
    let targetZ = 0;
    let targetScale = 1;
    let targetOpacity = 0;

    // Phase 1: Gather from scattered to circle (0-0.35)
    if (progress <= 0.35) {
      const t = progress / 0.35;
      const eased = easeOutCubic(t);
      targetX = lerp(scatterX, circleX, eased);
      targetY = lerp(scatterY, circleY, eased);
      targetZ = lerp(scatterZ, circleZ, eased);
      targetScale = lerp(0.8, 1.2, eased);
      targetOpacity = Math.min(1, t * 2);
    }
    // Phase 2: Zoom in circle (0.35-0.65)
    else if (progress <= 0.65) {
      const t = (progress - 0.35) / 0.3;
      const eased = smoothstep(t);
      const zoomRadius = lerp(circleRadius, 8, eased);
      targetX = Math.cos(angle) * zoomRadius;
      targetZ = Math.sin(angle) * zoomRadius;
      targetY = circleY;
      targetScale = lerp(1.2, 1.8, eased);
      targetOpacity = 1;
    }
    // Phase 3: Scatter away (0.65-1.0)
    else {
      const t = (progress - 0.65) / 0.35;
      const eased = easeInCubic(t);
      targetX = lerp(circleX, finalX, eased);
      targetY = lerp(circleY, finalY, eased);
      targetZ = lerp(circleZ, finalZ, eased);
      targetScale = lerp(1.8, 0.4, eased);
      targetOpacity = Math.max(0, 1 - t * 1.5);
    }

    meshRef.current.position.lerp(
      new THREE.Vector3(targetX, targetY, targetZ),
      0.1
    );
    meshRef.current.scale.lerp(
      new THREE.Vector3(targetScale, targetScale, targetScale),
      0.1
    );
    (meshRef.current.material as THREE.MeshBasicMaterial).opacity = targetOpacity;
    meshRef.current.rotation.y = -angle + Math.PI / 2;
  });

  if (!texture) return null;

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[6, 4.5]} />
      <meshBasicMaterial
        map={texture}
        side={THREE.DoubleSide}
        toneMapped={false}
        transparent
      />
    </mesh>
  );
};

// Camera Controller
const CameraController = ({ progress, isMobile }: CameraControllerProps) => {
  const { camera } = useThree();
  const targetZRef = useRef(isMobile ? 35 : 45);
  const currentZRef = useRef(isMobile ? 35 : 45);

  useFrame(() => {
    if (progress <= 0.35) {
      targetZRef.current = isMobile ? 35 : 45;
    } else if (progress <= 0.65) {
      const t = (progress - 0.35) / 0.3;
      const eased = smoothstep(t);
      targetZRef.current = lerp(
        isMobile ? 35 : 45,
        isMobile ? 15 : 20,
        eased
      );
    } else {
      const t = (progress - 0.65) / 0.35;
      const eased = t * t;
      targetZRef.current = lerp(
        isMobile ? 15 : 20,
        isMobile ? 60 : 80,
        eased
      );
    }

    currentZRef.current +=
      (targetZRef.current - currentZRef.current) * 0.08;
    camera.position.z = currentZRef.current;
    camera.lookAt(0, 0, 0);
  });

  return null;
};

// Scene
const Scene = ({ progress, isMobile }: SceneProps) => {
  const particleCount = isMobile
    ? PARTICLE_COUNT_MOBILE
    : PARTICLE_COUNT_DESKTOP;

  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight color="#ffffff" intensity={0.5} position={[5, 5, 5]} />
      <directionalLight
        color="#ffffff"
        intensity={0.3}
        position={[-5, -5, 5]}
      />
      <Particles count={particleCount} />
      {IMAGE_URLS.map((url, idx) => (
        <ImageMesh
          key={url}
          index={idx}
          progress={progress}
          total={IMAGE_URLS.length}
          url={url}
        />
      ))}
      <CameraController isMobile={isMobile} progress={progress} />
    </>
  );
};

// Utility functions
const createFallbackTexture = (): THREE.Texture => {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    const gradient = ctx.createLinearGradient(0, 0, 512, 512);
    gradient.addColorStop(0, "#1a1a1a");
    gradient.addColorStop(1, "#0a0a0a");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 512, 512);
  }
  return new THREE.CanvasTexture(canvas);
};

const lerp = (start: number, end: number, t: number): number => {
  return start + (end - start) * t;
};

const easeOutCubic = (t: number): number => {
  return 1 - Math.pow(1 - t, 3);
};

const easeInCubic = (t: number): number => {
  return t * t * t;
};

const smoothstep = (t: number): number => {
  return t * t * (3 - 2 * t);
};

// Main Component
export default function Hero() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const scrolled = -rect.top;
      const height = rect.height - window.innerHeight;
      const progress = Math.max(0, Math.min(1, scrolled / height));
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const textOpacity =
    scrollProgress < 0.7
      ? 1 - scrollProgress * 0.4
      : 0.72 - (scrollProgress - 0.7) * 2.4;
  const scrollIndicatorOpacity = Math.max(0, 1 - scrollProgress * 8);

  return (
    <div ref={containerRef} className="relative h-[400vh]">
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-gradient-to-br from-zinc-950 via-neutral-900 to-stone-950">
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 opacity-20">
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at 30% 40%, rgba(255, 255, 255, 0.05) 0%, transparent 50%), radial-gradient(circle at 70% 60%, rgba(255, 255, 255, 0.03) 0%, transparent 50%)",
            }}
          />
        </div>
        {/* Dark grid overlay */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="h-full w-full"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
        </div>
        {/* Canvas */}
        <Canvas
          camera={{ position: [0, 0, isMobile ? 35 : 45], fov: 50 }}
          dpr={[1, 2]}
          gl={{ alpha: true, antialias: true }}
        >
          <Scene isMobile={isMobile} progress={scrollProgress} />
        </Canvas>
        {/* Text content */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
          style={{ opacity: textOpacity }}
        >
          <h1 className="mb-8 text-5xl font-black uppercase tracking-tight text-white md:text-7xl lg:text-8xl">
            <span
              className="bg-gradient-to-r from-neutral-200 via-white to-neutral-300 bg-clip-text text-transparent"
              style={{
                textShadow: "0 0 60px rgba(255, 255, 255, 0.1)",
              }}
            >
              Fueling Future
            </span>
            <br />
            <span className="text-neutral-400">With Innovation</span>
          </h1>
          <div className="mt-8">
            <img
              alt="ACM Logo"
              className="h-auto w-48 md:w-64"
              src="/logo_without_bg.png"
              style={{
                filter: "drop-shadow(0 0 20px rgba(255, 255, 255, 0.2))",
              }}
            />
          </div>
        </div>
        {/* Scroll indicator */}
        <div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          style={{ opacity: scrollIndicatorOpacity }}
        >
          <div className="flex flex-col items-center gap-2">
            <p className="text-xs font-semibold tracking-widest text-neutral-400">
              SCROLL TO EXPLORE
            </p>
            <ChevronDown
              className="h-6 w-6 animate-bounce text-neutral-500"
              strokeWidth={2}
            />
          </div>
        </div>
        {/* Vignette */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at center, transparent 20%, rgba(0, 0, 0, 0.6) 100%)",
          }}
        />
      </div>
    </div>
  );
}