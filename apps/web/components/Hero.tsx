import { useEffect, useRef, useState, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ChevronDown } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

// ========================
// CONSTANTS & CONFIGURATION
// ========================

const ANIMATION_CONFIG = {
  PHASE_1_END: 0.40,
  PHASE_2_END: 0.70,
  PHASE_3_END: 1.0,
  LERP_SPEED: 0.12,
  SCROLL_SCRUB: 2,
};

const MOBILE_BREAKPOINT = 768;

const IMAGE_SETS = [
  [
    { url: "assets/hero_section_images/Hello_world_waasi.jpg", row: 0, col: 0 },
    { url: "assets/hero_section_images/award_delivery.jpg", row: 0, col: 2 },
    { url: "assets/hero_section_images/Ethnic_1.jpg", row: 1, col: 1 }
  ],
  [
    { url: "assets/hero_section_images/Ethnic_2.jpg", row: 0, col: 1 },
    { url: "assets/hero_section_images/Ethnic_3.jpg", row: 1, col: 0 },
    { url: "assets/hero_section_images/Ethnic_4.jpg", row: 1, col: 2 }
  ],
  [
    { url: "assets/hero_section_images/Ethnic_3.jpg", row: 0, col: 2 },
    { url: "assets/hero_section_images/Ethnic_5.jpg", row: 1, col: 0 }
  ],
  [
    { url: "assets/hero_section_images/Ethnic_3.jpg", row: 0, col: 0 },
    { url: "assets/hero_section_images/Ethnic_4.jpg", row: 0, col: 1 },
    { url: "assets/hero_section_images/Ethnic_6.jpg", row: 1, col: 2 }
  ]
];

// ========================
// UTILITY FUNCTIONS
// ========================

const createFallbackTexture = () => {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 384;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const gradient = ctx.createLinearGradient(0, 0, 512, 384);
    gradient.addColorStop(0, '#1e3a8a');
    gradient.addColorStop(1, '#0c4a6e');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 512, 384);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  return texture;
};

const easeInOutCubic = (t: number) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const smoothstep = (t: number) => t * t * (3 - 2 * t);

// ========================
// ANIMATION CALCULATIONS
// ========================

const calculatePhaseProgress = (scrollProgress: number, setIndex: number) => {
  const setStartProgress = setIndex * 0.18;
  const setDuration = 0.82;
  const setEndProgress = Math.min(1, setStartProgress + setDuration);
  
  if (scrollProgress < setStartProgress) return 0;
  if (scrollProgress > setEndProgress) return 1;
  return (scrollProgress - setStartProgress) / setDuration;
};

const calculateImageTransform = (
  localProgress: number,
  gridPosition: { row: number; col: number },
  setIndex: number,
  isMobile: boolean
) => {
  // Pseudo-random offsets based on grid position
  const seed1 = gridPosition.row * 123.456 + gridPosition.col * 789.123 + setIndex * 456.789;
  const seed2 = gridPosition.row * 456.789 + gridPosition.col * 321.654 + setIndex * 234.567;
  
  const randomOffsetX = isMobile ? (Math.sin(seed1) * 12) - 6 : (Math.sin(seed1) * 18) - 9;
  const randomOffsetY = isMobile ? (Math.cos(seed2) * 35) - 17.5 : (Math.cos(seed2) * 25) - 12.5;
  
  // Grid calculations
  const planeWidth = isMobile ? 5.5 : 8.5;
  const planeHeight = isMobile ? 4.125 : 6.375;
  const spacing = isMobile ? 1.5 : 2.5;
  const gridCols = 3;
  const gridRows = 2;
  
  const totalWidth = (planeWidth + spacing) * gridCols - spacing;
  const totalHeight = (planeHeight + spacing) * gridRows - spacing;
  const verticalOffset = isMobile ? -1 : 0;
  
  const gridX = -totalWidth / 2 + gridPosition.col * (planeWidth + spacing) + planeWidth / 2;
  const gridY = totalHeight / 2 - gridPosition.row * (planeHeight + spacing) - planeHeight / 2 + verticalOffset;

  let position = new THREE.Vector3();
  let scale = 1;
  let opacity = 0;
  let rotation = 0;

  // Phase 1: Fade in and approach
  if (localProgress <= ANIMATION_CONFIG.PHASE_1_END) {
    const t = localProgress / ANIMATION_CONFIG.PHASE_1_END;
    const eased = easeOutCubic(t);
    
    const startZ = isMobile ? -700 - (setIndex * 90) : -1000 - (setIndex * 110);
    const midZ = isMobile ? -50 : -70;
    const startScale = isMobile ? 1.1 : 1.3;
    const midScale = isMobile ? 1.4 : 1.7;
    
    position.set(randomOffsetX, randomOffsetY, THREE.MathUtils.lerp(startZ, midZ, eased));
    scale = THREE.MathUtils.lerp(startScale, midScale, eased);
    opacity = Math.min(1, eased * 2);
  }
  // Phase 2: Move to grid and zoom
  else if (localProgress <= ANIMATION_CONFIG.PHASE_2_END) {
    const t = (localProgress - ANIMATION_CONFIG.PHASE_1_END) / (ANIMATION_CONFIG.PHASE_2_END - ANIMATION_CONFIG.PHASE_1_END);
    const eased = smoothstep(t);
    
    const midZ = isMobile ? -50 : -70;
    const peakZ = isMobile ? 160 : 220;
    const midScale = isMobile ? 1.4 : 1.7;
    const peakScale = isMobile ? 2.6 : 3.5;
    
    const targetX = THREE.MathUtils.lerp(randomOffsetX, gridX, eased);
    const targetY = THREE.MathUtils.lerp(randomOffsetY, gridY, eased);
    const targetZ = THREE.MathUtils.lerp(midZ, peakZ, eased);
    
    position.set(targetX, targetY, targetZ);
    scale = THREE.MathUtils.lerp(midScale, peakScale, eased);
    opacity = 1;
  }
  // Phase 3: Spread and fade out
  else {
    const t = (localProgress - ANIMATION_CONFIG.PHASE_2_END) / (ANIMATION_CONFIG.PHASE_3_END - ANIMATION_CONFIG.PHASE_2_END);
    const eased = easeInOutCubic(t);
    
    const peakZ = isMobile ? 160 : 220;
    const endZ = isMobile ? 800 : 1100;
    const peakScale = isMobile ? 2.6 : 3.5;
    const endScale = 0.2;
    
    const spreadMultiplier = isMobile ? 20 : 28;
    const spreadX = gridX + (gridPosition.col - 1) * spreadMultiplier;
    const spreadY = gridY + (1 - gridPosition.row) * spreadMultiplier;
    
    const targetX = THREE.MathUtils.lerp(gridX, spreadX, eased);
    const targetY = THREE.MathUtils.lerp(gridY, spreadY, eased);
    const targetZ = THREE.MathUtils.lerp(peakZ, endZ, eased);
    
    position.set(targetX, targetY, targetZ);
    scale = THREE.MathUtils.lerp(peakScale, endScale, eased);
    opacity = Math.max(0, 1 - (eased * 1.5));
    
    const rotationAmount = (gridPosition.row + gridPosition.col) % 2 === 0 ? 1 : -1;
    rotation = eased * rotationAmount * 1.5;
  }

  return { position, scale, opacity, rotation };
};

// ========================
// COMPONENTS
// ========================

interface ImagePlaneProps {
  imageUrl: string;
  gridPosition: { row: number; col: number };
  setIndex: number;
  scrollProgress: number;
  isMobile: boolean;
}

const ImagePlane = ({ imageUrl, gridPosition, setIndex, scrollProgress, isMobile }: ImagePlaneProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshBasicMaterial>(null);
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  
  const targetPosRef = useRef(new THREE.Vector3());
  const currentPosRef = useRef(new THREE.Vector3());
  const targetScaleRef = useRef(1);
  const currentScaleRef = useRef(1);

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.crossOrigin = "anonymous";
    
    loader.load(
      imageUrl,
      (loadedTexture) => {
        loadedTexture.minFilter = THREE.LinearFilter;
        loadedTexture.magFilter = THREE.LinearFilter;
        setTexture(loadedTexture);
      },
      undefined,
      (error) => {
        console.warn(`Failed to load texture: ${imageUrl}`, error);
        setTexture(createFallbackTexture());
      }
    );
  }, [imageUrl]);

  useFrame(() => {
    if (!meshRef.current || !materialRef.current) return;

    const localProgress = calculatePhaseProgress(scrollProgress, setIndex);
    const transform = calculateImageTransform(localProgress, gridPosition, setIndex, isMobile);

    targetPosRef.current.copy(transform.position);
    targetScaleRef.current = transform.scale;
    materialRef.current.opacity = transform.opacity;
    meshRef.current.rotation.z = transform.rotation;

    // Smooth interpolation
    currentPosRef.current.lerp(targetPosRef.current, ANIMATION_CONFIG.LERP_SPEED);
    currentScaleRef.current += (targetScaleRef.current - currentScaleRef.current) * ANIMATION_CONFIG.LERP_SPEED;

    meshRef.current.position.copy(currentPosRef.current);
    meshRef.current.scale.setScalar(currentScaleRef.current);
  });

  if (!texture) return null;

  const planeWidth = isMobile ? 5.5 : 8.5;
  const planeHeight = isMobile ? 4.125 : 6.375;

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[planeWidth, planeHeight]} />
      <meshBasicMaterial
        ref={materialRef}
        map={texture}
        side={THREE.DoubleSide}
        transparent
        depthWrite={false}
      />
    </mesh>
  );
};

const Scene = ({ scrollProgress, isMobile }: { scrollProgress: number; isMobile: boolean }) => {
  const { camera } = useThree();
  const cameraTargetRef = useRef({ z: isMobile ? 500 : 680, y: 0 });
  const cameraCurrentRef = useRef({ z: isMobile ? 500 : 680, y: 0 });

  const allImages = useMemo(() => 
    IMAGE_SETS.flatMap((set, setIdx) =>
      set.map((img) => ({ ...img, setIdx }))
    ), []
  );

  useFrame(() => {
    if (scrollProgress <= ANIMATION_CONFIG.PHASE_1_END) {
      const t = scrollProgress / ANIMATION_CONFIG.PHASE_1_END;
      const eased = smoothstep(t);
      cameraTargetRef.current.z = isMobile 
        ? THREE.MathUtils.lerp(500, 260, eased)
        : THREE.MathUtils.lerp(680, 350, eased);
      cameraTargetRef.current.y = 0;
    } else if (scrollProgress <= ANIMATION_CONFIG.PHASE_2_END) {
      const t = (scrollProgress - ANIMATION_CONFIG.PHASE_1_END) / (ANIMATION_CONFIG.PHASE_2_END - ANIMATION_CONFIG.PHASE_1_END);
      const eased = smoothstep(t);
      cameraTargetRef.current.z = isMobile
        ? THREE.MathUtils.lerp(260, 100, eased)
        : THREE.MathUtils.lerp(350, 140, eased);
      cameraTargetRef.current.y = 0;
    } else {
      const t = (scrollProgress - ANIMATION_CONFIG.PHASE_2_END) / (ANIMATION_CONFIG.PHASE_3_END - ANIMATION_CONFIG.PHASE_2_END);
      const eased = t * t;
      cameraTargetRef.current.z = isMobile
        ? THREE.MathUtils.lerp(100, 600, eased)
        : THREE.MathUtils.lerp(140, 800, eased);
      cameraTargetRef.current.y = isMobile
        ? THREE.MathUtils.lerp(0, 30, eased)
        : THREE.MathUtils.lerp(0, 40, eased);
    }

    cameraCurrentRef.current.z += (cameraTargetRef.current.z - cameraCurrentRef.current.z) * ANIMATION_CONFIG.LERP_SPEED;
    cameraCurrentRef.current.y += (cameraTargetRef.current.y - cameraCurrentRef.current.y) * ANIMATION_CONFIG.LERP_SPEED;

    camera.position.z = cameraCurrentRef.current.z;
    camera.position.y = cameraCurrentRef.current.y;
    camera.lookAt(0, 0, 0);
  });

  return (
    <>
      <ambientLight intensity={1.5} />
      <directionalLight intensity={1.1} position={[10, 10, 15]} />
      <directionalLight intensity={0.9} position={[-10, -10, 15]} />
      {allImages.map((data, idx) => (
        <ImagePlane
          key={`${data.setIdx}-${data.row}-${data.col}`}
          imageUrl={data.url}
          gridPosition={{ row: data.row, col: data.col }}
          setIndex={data.setIdx}
          scrollProgress={scrollProgress}
          isMobile={isMobile}
        />
      ))}
    </>
  );
};

const ScrollIndicator = ({ opacity }: { opacity: number }) => (
  <div 
    className="pointer-events-none absolute bottom-12 left-1/2 z-20 -translate-x-1/2"
    style={{ opacity }}
  >
    <div className="flex flex-col items-center gap-3">
      <p 
        className="text-xs font-semibold tracking-widest text-cyan-100 sm:text-sm"
        style={{ 
          textShadow: "0 0 20px rgba(96, 165, 250, 0.9)",
          animation: "pulse 2s ease-in-out infinite",
          letterSpacing: "0.2em"
        }}
      >
        SCROLL TO EXPLORE
      </p>
      <div 
        className="flex flex-col items-center"
        style={{ animation: "bounce 2s ease-in-out infinite" }}
      >
        <ChevronDown 
          className="h-5 w-5 text-cyan-400 sm:h-6 sm:w-6" 
          strokeWidth={2.5}
          style={{ filter: "drop-shadow(0 0 10px rgba(96, 165, 250, 0.9))" }}
        />
        <ChevronDown 
          className="-mt-2.5 h-5 w-5 text-cyan-400 opacity-50 sm:h-6 sm:w-6" 
          strokeWidth={2.5}
          style={{ filter: "drop-shadow(0 0 10px rgba(96, 165, 250, 0.7))" }}
        />
      </div>
    </div>
    <style jsx>{`
      @keyframes bounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-12px); }
      }
      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
      }
    `}</style>
  </div>
);

const MeshBackground = () => (
  <div className="pointer-events-none absolute inset-0" style={{ opacity: 0.4 }}>
    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
      <defs>
        <pattern id="smallGrid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(148, 163, 184, 0.15)" strokeWidth="0.5"/>
        </pattern>
        <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
          <rect width="80" height="80" fill="url(#smallGrid)"/>
          <path d="M 80 0 L 0 0 0 80" fill="none" stroke="rgba(148, 163, 184, 0.25)" strokeWidth="1"/>
        </pattern>
        <radialGradient id="gridFade" cx="50%" cy="50%" r="70%">
          <stop offset="0%" stopColor="white" stopOpacity="0.6"/>
          <stop offset="50%" stopColor="white" stopOpacity="0.3"/>
          <stop offset="100%" stopColor="white" stopOpacity="0"/>
        </radialGradient>
        <linearGradient id="verticalFade" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="black" stopOpacity="0.8"/>
          <stop offset="20%" stopColor="black" stopOpacity="0"/>
          <stop offset="80%" stopColor="black" stopOpacity="0"/>
          <stop offset="100%" stopColor="black" stopOpacity="0.8"/>
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />
      <rect width="100%" height="100%" fill="url(#gridFade)" />
      <rect width="100%" height="100%" fill="url(#verticalFade)" />
      <circle cx="50%" cy="50%" r="20%" fill="none" stroke="rgba(148, 163, 184, 0.2)" strokeWidth="1.5" opacity="0.5"/>
      <circle cx="50%" cy="50%" r="30%" fill="none" stroke="rgba(148, 163, 184, 0.15)" strokeWidth="1" opacity="0.4"/>
      <circle cx="50%" cy="50%" r="40%" fill="none" stroke="rgba(148, 163, 184, 0.1)" strokeWidth="0.5" opacity="0.3"/>
    </svg>
  </div>
);

const HeroText = ({ opacity, scale }: { opacity: number; scale: number }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div 
      className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center px-6"
      style={{ 
        opacity,
        transform: `scale(${scale})`,
        transition: "opacity 0.4s ease-out, transform 0.4s ease-out"
      }}
    >
      <div className="flex w-full max-w-6xl flex-col items-center">
        <h1
          className="text-center text-3xl font-extrabold uppercase leading-tight tracking-wider sm:text-4xl md:text-6xl lg:text-7xl xl:text-8xl"
          style={{
            fontFamily: "'Arial Black', 'Arial', sans-serif",
            fontWeight: 900,
            color: "transparent",
            WebkitTextFillColor: "transparent",
            WebkitTextStroke: isMobile ? "1.2px rgba(224, 242, 254, 0.95)" : "2px rgba(224, 242, 254, 0.9)",
            background: "linear-gradient(180deg, rgba(224, 242, 254, 0.35) 0%, rgba(186, 230, 253, 0.25) 60%, rgba(224, 242, 254, 0.15) 100%)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            textShadow: "0 2px 8px rgba(96, 165, 250, 0.25)",
            letterSpacing: "0.06em",
            filter: "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.55))"
          }}
        >
          Fueling future with innovation
        </h1>
        <div className="mt-8 flex justify-center md:mt-12">
          <img
            alt="ACM logo"
            width={isMobile ? 180 : 280}
            height={isMobile ? 84 : 130}
            src="/logo_without_bg.png"
            className="h-auto w-auto"
            style={{
              maxWidth: isMobile ? "180px" : "280px"
            }}
          />
        </div>
      </div>
    </div>
  );
};

// ========================
// MAIN COMPONENT
// ========================

const Hero = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [textOpacity, setTextOpacity] = useState(1); // Start visible
  const [textScale, setTextScale] = useState(1); // Start at full scale
  const [canvasOpacity, setCanvasOpacity] = useState(1);
  const [scrollIndicatorOpacity, setScrollIndicatorOpacity] = useState(1);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateAnimationState = (progress: number) => {
      setScrollProgress(progress);

      // Scroll indicator fade
      if (progress === 0) {
        setScrollIndicatorOpacity(1);
      } else if (progress <= 0.08) {
        setScrollIndicatorOpacity(Math.max(0, 1 - (progress / 0.08)));
      } else {
        setScrollIndicatorOpacity(0);
      }

      // Text animation - starts visible, then fades slightly before coming back
      if (progress <= 0.03) {
        // Initial state - fully visible
        setTextOpacity(1);
        setTextScale(1);
      } else if (progress <= 0.12) {
        // Slight fade for transition effect
        const fadeAmount = (progress - 0.03) / 0.09;
        setTextOpacity(Math.max(0.7, 1 - fadeAmount * 0.3));
        setTextScale(1 - fadeAmount * 0.05);
      } else if (progress <= 0.18) {
        // Fade back in stronger
        const fadeIn = (progress - 0.12) / 0.06;
        const eased = smoothstep(fadeIn);
        setTextOpacity(0.7 + eased * 0.3);
        setTextScale(0.95 + eased * 0.05);
      } else if (progress >= 0.75) {
        // Final fade out
        const fadeOut = (progress - 0.75) / 0.25;
        setTextOpacity(Math.max(0, 1 - fadeOut));
        setTextScale(1 + fadeOut * 0.15);
      } else {
        // Middle section - fully visible
        setTextOpacity(1);
        setTextScale(1);
      }

      // Canvas fade at end
      if (progress >= 0.92) {
        setCanvasOpacity(Math.max(0, 1 - ((progress - 0.92) / 0.08)));
      } else {
        setCanvasOpacity(1);
      }
    };

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: container,
        start: "top top",
        end: "bottom bottom",
        pin: ".gallery-content",
        scrub: ANIMATION_CONFIG.SCROLL_SCRUB,
        anticipatePin: 1,
        onUpdate: (self) => updateAnimationState(self.progress)
      });
    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="relative h-[500vh]"
      style={{
        background:
          "radial-gradient(1200px 600px at 20% -10%, rgba(99,102,241,0.16), transparent 60%), radial-gradient(1200px 600px at 80% -10%, rgba(236,72,153,0.14), transparent 60%), linear-gradient(to bottom, #0a0806 0%, #141016 50%, #0a0806 100%)",
      }}
    >
      <div className="gallery-content sticky top-0 h-screen w-full overflow-hidden">
        <MeshBackground />
        
        <div
          className="absolute inset-0"
          style={{ opacity: canvasOpacity }}
        >
          <Canvas
            camera={{ 
              position: [0, 0, isMobile ? 500 : 680], 
              fov: isMobile ? 55 : 48, 
              near: 0.1, 
              far: 2500 
            }}
            gl={{ 
              alpha: true, 
              antialias: true,
              powerPreference: "high-performance"
            }}
            dpr={[1, 2]}
            frameloop="always"
          >
            <Scene scrollProgress={scrollProgress} isMobile={isMobile} />
          </Canvas>
        </div>
        
        <HeroText opacity={textOpacity} scale={textScale} />
        <ScrollIndicator opacity={scrollIndicatorOpacity} />
        
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: "radial-gradient(circle at center, transparent 40%, rgba(10, 8, 6, 0.6) 100%)"
          }}
        />
      </div>
    </div>
  );
};

export default Hero;