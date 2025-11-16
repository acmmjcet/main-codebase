import { useEffect, useRef, useState, useMemo, useCallback } from "react";
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
  PHASE_1_END: 0.35,
  PHASE_2_END: 0.65,
  PHASE_3_END: 1.0,
  LERP_SPEED: 0.15,
  SCROLL_SCRUB: 1.5,
} as const;

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
] as const;

const PLANE_CONFIG = {
  mobile: {
    width: 7,
    height: 5.25,
    spacing: 2,
    verticalOffset: -2,
  },
  desktop: {
    width: 10,
    height: 7.5,
    spacing: 3,
    verticalOffset: 0,
  }
} as const;

const CAMERA_CONFIG = {
  mobile: {
    initial: 450,
    phase1End: 220,
    phase2End: 80,
    phase3End: 650,
    fov: 55,
  },
  desktop: {
    initial: 600,
    phase1End: 300,
    phase2End: 120,
    phase3End: 900,
    fov: 48,
  }
} as const;

// ========================
// UTILITY FUNCTIONS
// ========================

const createFallbackTexture = (): THREE.Texture => {
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

const easeInOutCubic = (t: number): number => 
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

const easeOutCubic = (t: number): number => 
  1 - Math.pow(1 - t, 3);

const smoothstep = (t: number): number => 
  t * t * (3 - 2 * t);

// ========================
// ANIMATION CALCULATIONS
// ========================

const calculatePhaseProgress = (scrollProgress: number, setIndex: number): number => {
  const setStartProgress = setIndex * 0.15;
  const setDuration = 0.85;
  const setEndProgress = Math.min(1, setStartProgress + setDuration);
  
  if (scrollProgress < setStartProgress) return 0;
  if (scrollProgress > setEndProgress) return 1;
  return (scrollProgress - setStartProgress) / setDuration;
};

interface GridPosition {
  row: number;
  col: number;
}

interface TransformResult {
  position: THREE.Vector3;
  scale: number;
  opacity: number;
  rotation: number;
}

const calculateImageTransform = (
  localProgress: number,
  gridPosition: GridPosition,
  setIndex: number,
  isMobile: boolean
): TransformResult => {
  // Pseudo-random offsets for natural distribution
  const seed1 = gridPosition.row * 123.456 + gridPosition.col * 789.123 + setIndex * 456.789;
  const seed2 = gridPosition.row * 456.789 + gridPosition.col * 321.654 + setIndex * 234.567;
  
  const randomOffsetX = isMobile ? (Math.sin(seed1) * 8) - 4 : (Math.sin(seed1) * 12) - 6;
  const randomOffsetY = isMobile ? (Math.cos(seed2) * 22) - 11 : (Math.cos(seed2) * 18) - 9;
  
  // Grid configuration
  const config = isMobile ? PLANE_CONFIG.mobile : PLANE_CONFIG.desktop;
  const { width: planeWidth, height: planeHeight, spacing, verticalOffset } = config;
  const gridCols = 3;
  const gridRows = 2;
  
  const totalWidth = (planeWidth + spacing) * gridCols - spacing;
  const totalHeight = (planeHeight + spacing) * gridRows - spacing;
  
  const gridX = -totalWidth / 2 + gridPosition.col * (planeWidth + spacing) + planeWidth / 2;
  const gridY = totalHeight / 2 - gridPosition.row * (planeHeight + spacing) - planeHeight / 2 + verticalOffset;

  const position = new THREE.Vector3();
  let scale = 1;
  let opacity = 0;
  let rotation = 0;

  // Phase 1: Fade in and approach (0 - 0.35)
  if (localProgress <= ANIMATION_CONFIG.PHASE_1_END) {
    const t = localProgress / ANIMATION_CONFIG.PHASE_1_END;
    const eased = easeOutCubic(t);
    
    const startZ = isMobile ? -500 - (setIndex * 70) : -700 - (setIndex * 90);
    const midZ = isMobile ? 20 : 10;
    const startScale = isMobile ? 1.6 : 1.8;
    const midScale = isMobile ? 1.8 : 2.1;
    
    position.set(randomOffsetX, randomOffsetY, THREE.MathUtils.lerp(startZ, midZ, eased));
    scale = THREE.MathUtils.lerp(startScale, midScale, eased);
    opacity = Math.min(1, eased * 1.8);
  }
  // Phase 2: Move to grid and zoom (0.35 - 0.65)
  else if (localProgress <= ANIMATION_CONFIG.PHASE_2_END) {
    const t = (localProgress - ANIMATION_CONFIG.PHASE_1_END) / 
              (ANIMATION_CONFIG.PHASE_2_END - ANIMATION_CONFIG.PHASE_1_END);
    const eased = smoothstep(t);
    
    const midZ = isMobile ? 20 : 10;
    const peakZ = isMobile ? 200 : 280;
    const midScale = isMobile ? 1.8 : 2.1;
    const peakScale = isMobile ? 2.2 : 2.8;
    
    const targetX = THREE.MathUtils.lerp(randomOffsetX, gridX, eased);
    const targetY = THREE.MathUtils.lerp(randomOffsetY, gridY, eased);
    const targetZ = THREE.MathUtils.lerp(midZ, peakZ, eased);
    
    position.set(targetX, targetY, targetZ);
    scale = THREE.MathUtils.lerp(midScale, peakScale, eased);
    opacity = 1;
  }
  // Phase 3: Spread and fade out (0.65 - 1.0)
  else {
    const t = (localProgress - ANIMATION_CONFIG.PHASE_2_END) / 
              (ANIMATION_CONFIG.PHASE_3_END - ANIMATION_CONFIG.PHASE_2_END);
    const eased = easeInOutCubic(t);
    
    const peakZ = isMobile ? 200 : 280;
    const endZ = isMobile ? 900 : 1200;
    const peakScale = isMobile ? 2.2 : 2.8;
    const endScale = 0.3;
    
    const spreadMultiplier = isMobile ? 24 : 32;
    const spreadX = gridX + (gridPosition.col - 1) * spreadMultiplier;
    const spreadY = gridY + (1 - gridPosition.row) * spreadMultiplier;
    
    const targetX = THREE.MathUtils.lerp(gridX, spreadX, eased);
    const targetY = THREE.MathUtils.lerp(gridY, spreadY, eased);
    const targetZ = THREE.MathUtils.lerp(peakZ, endZ, eased);
    
    position.set(targetX, targetY, targetZ);
    scale = THREE.MathUtils.lerp(peakScale, endScale, eased);
    opacity = Math.max(0, 1 - (eased * 1.3));
    
    const rotationAmount = (gridPosition.row + gridPosition.col) % 2 === 0 ? 1 : -1;
    rotation = eased * rotationAmount * 1.2;
  }

  return { position, scale, opacity, rotation };
};

// ========================
// COMPONENTS
// ========================

interface ImagePlaneProps {
  imageUrl: string;
  gridPosition: GridPosition;
  setIndex: number;
  scrollProgress: number;
  isMobile: boolean;
}

const ImagePlane = ({ 
  imageUrl, 
  gridPosition, 
  setIndex, 
  scrollProgress, 
  isMobile 
}: ImagePlaneProps) => {
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
        
        // Get the image aspect ratio
        const img = loadedTexture.image;
        const imageAspect = img.width / img.height;
        const config = isMobile ? PLANE_CONFIG.mobile : PLANE_CONFIG.desktop;
        const planeAspect = config.width / config.height;
        
        // Calculate scale to cover the plane (object-cover behavior)
        if (imageAspect > planeAspect) {
          // Image is wider than plane - fit height and crop sides
          const scale = planeAspect / imageAspect;
          loadedTexture.repeat.set(scale, 1);
          loadedTexture.offset.set((1 - scale) / 2, 0);
        } else {
          // Image is taller than plane - fit width and crop top/bottom
          const scale = imageAspect / planeAspect;
          loadedTexture.repeat.set(1, scale);
          loadedTexture.offset.set(0, (1 - scale) / 2);
        }
        
        setTexture(loadedTexture);
      },
      undefined,
      (error) => {
        console.warn(`Failed to load texture: ${imageUrl}`, error);
        setTexture(createFallbackTexture());
      }
    );

    return () => {
      if (texture) {
        texture.dispose();
      }
    };
  }, [imageUrl, isMobile]);

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

  const config = isMobile ? PLANE_CONFIG.mobile : PLANE_CONFIG.desktop;

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[config.width, config.height]} />
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

interface SceneProps {
  scrollProgress: number;
  isMobile: boolean;
}

const Scene = ({ scrollProgress, isMobile }: SceneProps) => {
  const { camera } = useThree();
  const camConfig = isMobile ? CAMERA_CONFIG.mobile : CAMERA_CONFIG.desktop;
  
  const cameraTargetRef = useRef<{ z: number; y: number }>({ z: camConfig.initial, y: 0 });
  const cameraCurrentRef = useRef<{ z: number; y: number }>({ z: camConfig.initial, y: 0 });

  const allImages = useMemo(() => 
    IMAGE_SETS.flatMap((set, setIdx) =>
      set.map((img) => ({ ...img, setIdx }))
    ), []
  );

  useFrame(() => {
    // Phase 1: Initial approach
    if (scrollProgress <= ANIMATION_CONFIG.PHASE_1_END) {
      const t = scrollProgress / ANIMATION_CONFIG.PHASE_1_END;
      const eased = smoothstep(t);
      cameraTargetRef.current.z = THREE.MathUtils.lerp(camConfig.initial, camConfig.phase1End, eased);
      cameraTargetRef.current.y = 0;
    } 
    // Phase 2: Focus on grid
    else if (scrollProgress <= ANIMATION_CONFIG.PHASE_2_END) {
      const t = (scrollProgress - ANIMATION_CONFIG.PHASE_1_END) / 
                (ANIMATION_CONFIG.PHASE_2_END - ANIMATION_CONFIG.PHASE_1_END);
      const eased = smoothstep(t);
      cameraTargetRef.current.z = THREE.MathUtils.lerp(camConfig.phase1End, camConfig.phase2End, eased);
      cameraTargetRef.current.y = 0;
    } 
    // Phase 3: Pull back
    else {
      const t = (scrollProgress - ANIMATION_CONFIG.PHASE_2_END) / 
                (ANIMATION_CONFIG.PHASE_3_END - ANIMATION_CONFIG.PHASE_2_END);
      const eased = t * t;
      cameraTargetRef.current.z = THREE.MathUtils.lerp(camConfig.phase2End, camConfig.phase3End, eased);
      cameraTargetRef.current.y = THREE.MathUtils.lerp(0, isMobile ? 35 : 45, eased);
    }

    // Smooth camera movement
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
          key={`${data.setIdx}-${data.row}-${data.col}-${idx}`}
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

interface ScrollIndicatorProps {
  opacity: number;
}

const ScrollIndicator = ({ opacity }: ScrollIndicatorProps) => (
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
    <style>{`
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

interface HeroTextProps {
  opacity: number;
  scale: number;
}

const HeroText = ({ opacity, scale }: HeroTextProps) => {
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
  const [textOpacity, setTextOpacity] = useState(1);
  const [textScale, setTextScale] = useState(1);
  const [canvasOpacity, setCanvasOpacity] = useState(1);
  const [scrollIndicatorOpacity, setScrollIndicatorOpacity] = useState(1);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const updateAnimationState = useCallback((progress: number) => {
    setScrollProgress(progress);

    // Scroll indicator fade
    if (progress === 0) {
      setScrollIndicatorOpacity(1);
    } else if (progress <= 0.08) {
      setScrollIndicatorOpacity(Math.max(0, 1 - (progress / 0.08)));
    } else {
      setScrollIndicatorOpacity(0);
    }

    // Text animation
    if (progress <= 0.03) {
      setTextOpacity(1);
      setTextScale(1);
    } else if (progress <= 0.12) {
      const fadeAmount = (progress - 0.03) / 0.09;
      setTextOpacity(Math.max(0.7, 1 - fadeAmount * 0.3));
      setTextScale(1 - fadeAmount * 0.05);
    } else if (progress <= 0.18) {
      const fadeIn = (progress - 0.12) / 0.06;
      const eased = smoothstep(fadeIn);
      setTextOpacity(0.7 + eased * 0.3);
      setTextScale(0.95 + eased * 0.05);
    } else if (progress >= 0.75) {
      const fadeOut = (progress - 0.75) / 0.25;
      setTextOpacity(Math.max(0, 1 - fadeOut));
      setTextScale(1 + fadeOut * 0.15);
    } else {
      setTextOpacity(1);
      setTextScale(1);
    }

    // Canvas fade at end
    if (progress >= 0.92) {
      setCanvasOpacity(Math.max(0, 1 - ((progress - 0.92) / 0.08)));
    } else {
      setCanvasOpacity(1);
    }
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

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
  }, [updateAnimationState]);

  const camConfig = isMobile ? CAMERA_CONFIG.mobile : CAMERA_CONFIG.desktop;

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
              position: [0, 0, camConfig.initial], 
              fov: camConfig.fov, 
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