import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

const Hero = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const objectsRef = useRef<{
    desk?: THREE.Mesh;
    keyboard?: {
      keyboardGroup: THREE.Group;
      keys: Array<{
        keyCap: THREE.Mesh;
        underglow: THREE.Mesh;
        sideGlow: THREE.Mesh;
        letter: string;
        isTarget: boolean;
        targetIndex: number;
        baseY: number;
        baseColor: THREE.Color;
      }>;
      glowPlate: THREE.Mesh;
    };
    logo?: {
      logoGroup: THREE.Group;
      hexagon: THREE.Mesh;
      circle: THREE.Mesh;
      ring: THREE.Mesh;
      acmText: THREE.Mesh;
      mjcetText: THREE.Mesh;
      particles: THREE.Points;
    };
    rimLight1?: THREE.PointLight;
    rimLight2?: THREE.PointLight;
  }>({});

  useEffect(() => {
    if (!canvasRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0f);
    scene.fog = new THREE.Fog(0x0a0a0f, 10, 150);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      500
    );
    camera.position.set(-25, 8, 35);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: false,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.4;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    const ambientLight = new THREE.AmbientLight(0x1a1a2e, 0.4);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0x6a7fc1, 2);
    mainLight.position.set(15, 20, 15);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 4096;
    mainLight.shadow.mapSize.height = 4096;
    scene.add(mainLight);

    const rimLight1 = new THREE.PointLight(0xff00ff, 2, 80);
    rimLight1.position.set(-20, 10, 20);
    scene.add(rimLight1);

    const rimLight2 = new THREE.PointLight(0x00ffff, 2, 80);
    rimLight2.position.set(20, 10, 20);
    scene.add(rimLight2);

    const topLight = new THREE.SpotLight(0xffffff, 1.5);
    topLight.position.set(0, 40, 0);
    topLight.angle = Math.PI / 3;
    topLight.penumbra = 0.5;
    topLight.castShadow = true;
    scene.add(topLight);

    const createDesk = () => {
      const deskGeometry = new THREE.PlaneGeometry(100, 80);
      const deskMaterial = new THREE.MeshStandardMaterial({
        color: 0x1a1520,
        roughness: 0.7,
        metalness: 0.3,
      });
      const desk = new THREE.Mesh(deskGeometry, deskMaterial);
      desk.rotation.x = -Math.PI / 2;
      desk.position.y = -1;
      desk.receiveShadow = true;
      scene.add(desk);
      return desk;
    };

    const createKeyboard = () => {
      const keyboardGroup = new THREE.Group();
      
      const baseGeometry = new THREE.BoxGeometry(45, 1.5, 16);
      const baseMaterial = new THREE.MeshStandardMaterial({
        color: 0x0d0d0d,
        roughness: 0.4,
        metalness: 0.6,
      });
      const base = new THREE.Mesh(baseGeometry, baseMaterial);
      base.castShadow = true;
      base.receiveShadow = true;
      keyboardGroup.add(base);

      const glowPlateGeometry = new THREE.BoxGeometry(46, 0.3, 17);
      const glowPlateMaterial = new THREE.MeshStandardMaterial({
        color: 0x0d0d0d,
        roughness: 0.3,
        metalness: 0.7,
        emissive: 0xff00ff,
        emissiveIntensity: 0.3,
      });
      const glowPlate = new THREE.Mesh(glowPlateGeometry, glowPlateMaterial);
      glowPlate.position.y = -0.9;
      keyboardGroup.add(glowPlate);

      const keys: Array<{
        keyCap: THREE.Mesh;
        underglow: THREE.Mesh;
        sideGlow: THREE.Mesh;
        letter: string;
        isTarget: boolean;
        targetIndex: number;
        baseY: number;
        baseColor: THREE.Color;
      }> = [];
      
      const keyRows = [
        ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
        ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
        ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
        ['Z', 'X', 'C', 'V', 'B', 'N', 'M'],
      ];

      const targetLetters = ['A', 'C', 'M', 'M', 'J', 'C', 'E', 'T'];
      let letterIndex = 0;

      const keyCapMaterial = new THREE.MeshStandardMaterial({
        color: 0x1a1a1a,
        roughness: 0.5,
        metalness: 0.5,
      });

      const underglowMaterial = new THREE.MeshBasicMaterial({
        color: 0xff0000,
        transparent: true,
        opacity: 0.4,
        side: THREE.DoubleSide,
      });

      const sideGlowMaterial = new THREE.MeshBasicMaterial({
        color: 0xff0000,
        transparent: true,
        opacity: 0.6,
      });

      keyRows.forEach((row, rowIndex) => {
        row.forEach((letter, colIndex) => {
          const keyCapGeometry = new THREE.BoxGeometry(2.2, 0.8, 2.2);
          const keyCap = new THREE.Mesh(keyCapGeometry, keyCapMaterial.clone());
          
          const offsetX = rowIndex === 3 ? 2 : rowIndex === 2 ? 1 : 0;
          const x = (colIndex - row.length / 2) * 2.6 + offsetX;
          const z = (rowIndex - 1.5) * 2.6;
          
          keyCap.position.set(x, 1.15, z);
          keyCap.castShadow = true;
          keyboardGroup.add(keyCap);

          const underglowGeometry = new THREE.PlaneGeometry(2.4, 2.4);
          const underglow = new THREE.Mesh(underglowGeometry, underglowMaterial.clone());
          underglow.rotation.x = -Math.PI / 2;
          underglow.position.set(x, 0.1, z);
          keyboardGroup.add(underglow);

          const sideGlowGeometry = new THREE.BoxGeometry(2.3, 0.2, 2.3);
          const sideGlow = new THREE.Mesh(sideGlowGeometry, sideGlowMaterial.clone());
          sideGlow.position.set(x, 0.85, z);
          keyboardGroup.add(sideGlow);

          const canvas = document.createElement('canvas');
          canvas.width = 64;
          canvas.height = 64;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 32px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(letter, 32, 32);
          }
          
          const texture = new THREE.CanvasTexture(canvas);
          const labelMaterial = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
            opacity: 0.8,
          });
          const labelGeometry = new THREE.PlaneGeometry(1.5, 1.5);
          const label = new THREE.Mesh(labelGeometry, labelMaterial);
          label.rotation.x = -Math.PI / 2;
          label.position.set(x, 1.56, z);
          keyboardGroup.add(label);

          const isTargetKey = targetLetters.includes(letter);
          const keyData = {
            keyCap,
            underglow,
            sideGlow,
            letter,
            isTarget: isTargetKey,
            targetIndex: isTargetKey ? targetLetters.indexOf(letter, letterIndex) : -1,
            baseY: 1.15,
            baseColor: new THREE.Color(0xff0000),
          };

          if (isTargetKey && keyData.targetIndex === letterIndex) {
            letterIndex++;
          }

          keys.push(keyData);
        });
      });

      const spacebarGeometry = new THREE.BoxGeometry(14, 0.8, 2.2);
      const spacebar = new THREE.Mesh(spacebarGeometry, keyCapMaterial.clone());
      spacebar.position.set(0, 1.15, 4);
      spacebar.castShadow = true;
      keyboardGroup.add(spacebar);

      const spacebarUnderglowGeometry = new THREE.PlaneGeometry(14.2, 2.4);
      const spacebarUnderglow = new THREE.Mesh(spacebarUnderglowGeometry, underglowMaterial.clone());
      spacebarUnderglow.rotation.x = -Math.PI / 2;
      spacebarUnderglow.position.set(0, 0.1, 4);
      keyboardGroup.add(spacebarUnderglow);

      const enterGeometry = new THREE.BoxGeometry(4, 0.8, 2.2);
      const enter = new THREE.Mesh(enterGeometry, keyCapMaterial.clone());
      enter.position.set(14, 1.15, -2.6);
      enter.castShadow = true;
      keyboardGroup.add(enter);

      const enterUnderglowGeometry = new THREE.PlaneGeometry(4.2, 2.4);
      const enterUnderglow = new THREE.Mesh(enterUnderglowGeometry, underglowMaterial.clone());
      enterUnderglow.rotation.x = -Math.PI / 2;
      enterUnderglow.position.set(14, 0.1, -2.6);
      keyboardGroup.add(enterUnderglow);

      const enterSideGlow = new THREE.Mesh(
        new THREE.BoxGeometry(4.1, 0.2, 2.3),
        sideGlowMaterial.clone()
      );
      enterSideGlow.position.set(14, 0.85, -2.6);
      keyboardGroup.add(enterSideGlow);

      keys.push({
        keyCap: enter,
        underglow: enterUnderglow,
        sideGlow: enterSideGlow,
        letter: 'ENTER',
        isTarget: true,
        targetIndex: 8,
        baseY: 1.15,
        baseColor: new THREE.Color(0xff0000),
      });

      keyboardGroup.position.set(0, 0, 0);
      scene.add(keyboardGroup);
      
      return { keyboardGroup, keys, glowPlate };
    };

    const createLogo = () => {
      const logoGroup = new THREE.Group();
      
      const hexagonShape = new THREE.Shape();
      const radius = 8;
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        if (i === 0) hexagonShape.moveTo(x, y);
        else hexagonShape.lineTo(x, y);
      }
      hexagonShape.closePath();

      const hexGeometry = new THREE.ShapeGeometry(hexagonShape);
      const hexMaterial = new THREE.MeshBasicMaterial({
        color: 0x00ffff,
        transparent: true,
        opacity: 0,
        side: THREE.DoubleSide,
      });
      const hexagon = new THREE.Mesh(hexGeometry, hexMaterial);
      logoGroup.add(hexagon);

      const circleGeometry = new THREE.CircleGeometry(6, 64);
      const circleMaterial = new THREE.MeshBasicMaterial({
        color: 0x0a0a1f,
        transparent: true,
        opacity: 0,
        side: THREE.DoubleSide,
      });
      const circle = new THREE.Mesh(circleGeometry, circleMaterial);
      circle.position.z = -0.1;
      logoGroup.add(circle);

      const ringGeometry = new THREE.RingGeometry(5.5, 6.5, 64);
      const ringMaterial = new THREE.MeshBasicMaterial({
        color: 0x00ffff,
        transparent: true,
        opacity: 0,
        side: THREE.DoubleSide,
      });
      const ring = new THREE.Mesh(ringGeometry, ringMaterial);
      ring.position.z = 0.1;
      logoGroup.add(ring);

      const createText = (text: string, size: number, yPos: number) => {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 128;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = '#00ffff';
          ctx.font = `bold ${size}px Arial`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(text, 256, 64);
        }
        
        const texture = new THREE.CanvasTexture(canvas);
        const material = new THREE.MeshBasicMaterial({
          map: texture,
          transparent: true,
          opacity: 0,
        });
        const geometry = new THREE.PlaneGeometry(12, 3);
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.y = yPos;
        mesh.position.z = 0.2;
        return mesh;
      };

      const acmText = createText('ACM', 80, 1.5);
      const mjcetText = createText('MJCET', 60, -1);
      
      logoGroup.add(acmText);
      logoGroup.add(mjcetText);

      const particleCount = 100;
      const particleGeometry = new THREE.BufferGeometry();
      const positions = new Float32Array(particleCount * 3);
      
      for (let i = 0; i < particleCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const radius = 8 + Math.random() * 5;
        positions[i * 3] = Math.cos(angle) * radius;
        positions[i * 3 + 1] = Math.sin(angle) * radius;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 2;
      }
      
      particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      const particleMaterial = new THREE.PointsMaterial({
        color: 0x00ffff,
        size: 0.3,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
      });
      const particles = new THREE.Points(particleGeometry, particleMaterial);
      logoGroup.add(particles);

      logoGroup.visible = false;
      logoGroup.position.set(14, 1.5, -2.6);
      scene.add(logoGroup);

      return { 
        logoGroup, 
        hexagon, 
        circle, 
        ring, 
        acmText, 
        mjcetText, 
        particles 
      };
    };

    const desk = createDesk();
    const keyboard = createKeyboard();
    const logo = createLogo();

    objectsRef.current = {
      desk,
      keyboard,
      logo,
      rimLight1,
      rimLight2,
    };

    const clock = new THREE.Clock();
    
    const animate = () => {
      const elapsedTime = clock.getElapsedTime();

      keyboard.keys.forEach((keyData, index) => {
        const wave = elapsedTime * 0.5 + index * 0.05;
        const hue = (wave % 1);
        const color = new THREE.Color().setHSL(hue, 1, 0.5);
        (keyData.underglow.material as THREE.MeshBasicMaterial).color = color;
        (keyData.sideGlow.material as THREE.MeshBasicMaterial).color = color;
        keyData.baseColor = color;
      });

      if (scrollProgress < 0.15) {
        camera.position.set(-25, 8, 35);
        camera.lookAt(0, 0, 0);
        
        keyboard.keyboardGroup.position.y = Math.sin(elapsedTime * 0.5) * 0.1;
      }
      else if (scrollProgress < 0.25) {
        const progress = (scrollProgress - 0.15) / 0.1;
        const eased = 1 - Math.pow(1 - progress, 3);
        
        camera.position.set(
          -25 + eased * 25,
          8 + eased * 22,
          35 - eased * 35
        );
        camera.lookAt(0, 0, 0);
      }
      else if (scrollProgress < 0.65) {
        const progress = (scrollProgress - 0.25) / 0.4;
        const targetKeys = keyboard.keys.filter(k => k.isTarget && k.letter !== 'ENTER');
        const currentTyping = Math.min(Math.floor(progress * targetKeys.length * 1.5), targetKeys.length - 1);
        
        camera.position.set(0, 30, 0);
        camera.lookAt(0, 0, 0);
        
        keyboard.keys.forEach((keyData) => {
          if (keyData.isTarget && keyData.targetIndex < targetKeys.length && keyData.targetIndex <= currentTyping) {
            const pressProgress = Math.min((currentTyping - keyData.targetIndex + progress * targetKeys.length) / 1, 1);
            
            if (keyData.targetIndex === currentTyping) {
              const press = Math.sin(pressProgress * Math.PI * 4) * 0.5 + 0.5;
              keyData.keyCap.position.y = keyData.baseY - press * 0.3;
              (keyData.underglow.material as THREE.MeshBasicMaterial).opacity = 0.8 + press * 0.2;
              (keyData.sideGlow.material as THREE.MeshBasicMaterial).opacity = 0.8 + press * 0.2;
              
              (keyData.underglow.material as THREE.MeshBasicMaterial).color.set(0x00ffff);
              (keyData.sideGlow.material as THREE.MeshBasicMaterial).color.set(0x00ffff);
            } else {
              keyData.keyCap.position.y = keyData.baseY;
              (keyData.underglow.material as THREE.MeshBasicMaterial).color.set(0x0088aa);
              (keyData.sideGlow.material as THREE.MeshBasicMaterial).color.set(0x0088aa);
              (keyData.underglow.material as THREE.MeshBasicMaterial).opacity = 0.5;
              (keyData.sideGlow.material as THREE.MeshBasicMaterial).opacity = 0.5;
            }
          } else {
            keyData.keyCap.position.y = keyData.baseY;
          }
        });
      }
      else if (scrollProgress < 0.75) {
        const progress = (scrollProgress - 0.65) / 0.1;
        const eased = 1 - Math.pow(1 - progress, 2);
        
        camera.position.set(
          0 + eased * 14,
          30 - eased * 15,
          0 + eased * 15
        );
        camera.lookAt(14, 0, -2.6);
        
        keyboard.keys.forEach((keyData) => {
          if (keyData.isTarget && keyData.letter !== 'ENTER') {
            (keyData.underglow.material as THREE.MeshBasicMaterial).color.set(0x0088aa);
            (keyData.sideGlow.material as THREE.MeshBasicMaterial).color.set(0x0088aa);
            (keyData.underglow.material as THREE.MeshBasicMaterial).opacity = 0.5;
            (keyData.sideGlow.material as THREE.MeshBasicMaterial).opacity = 0.5;
          }
        });
      }
      else if (scrollProgress < 0.85) {
        const progress = (scrollProgress - 0.75) / 0.1;
        
        const enterKey = keyboard.keys.find(k => k.letter === 'ENTER');
        if (enterKey) {
          const pressProgress = Math.min(progress * 3, 1);
          const press = Math.sin(pressProgress * Math.PI) * 0.5;
          enterKey.keyCap.position.y = enterKey.baseY - press * 0.4;
          (enterKey.underglow.material as THREE.MeshBasicMaterial).color.set(0xff00ff);
          (enterKey.sideGlow.material as THREE.MeshBasicMaterial).color.set(0xff00ff);
          (enterKey.underglow.material as THREE.MeshBasicMaterial).opacity = 0.9;
          (enterKey.sideGlow.material as THREE.MeshBasicMaterial).opacity = 0.9;
        }
        
        const zoomEased = progress * progress * progress;
        camera.position.set(
          14,
          15 - zoomEased * 13.5,
          15 - zoomEased * 17.6
        );
        camera.lookAt(14, 1.5, -2.6);
      }
      else {
        const progress = (scrollProgress - 0.85) / 0.15;
        const eased = 1 - Math.pow(1 - Math.min(progress, 1), 3);
        
        logo.logoGroup.visible = true;
        
        keyboard.keys.forEach((keyData) => {
          (keyData.underglow.material as THREE.MeshBasicMaterial).opacity *= (1 - eased * 0.7);
          (keyData.sideGlow.material as THREE.MeshBasicMaterial).opacity *= (1 - eased * 0.7);
        });
        
        logo.hexagon.material.opacity = eased * 0.8;
        logo.circle.material.opacity = eased * 0.9;
        logo.ring.material.opacity = eased * 0.7;
        logo.acmText.material.opacity = eased;
        logo.mjcetText.material.opacity = eased;
        logo.particles.material.opacity = eased * 0.6;
        
        logo.particles.rotation.z = elapsedTime * 0.3;
        
        logo.logoGroup.scale.setScalar(0.5 + eased * 1.5);
        
        camera.position.set(
          14,
          1.5 + eased * 15,
          -2.6 + eased * 35
        );
        camera.lookAt(14, 1.5, -2.6);
        
        const pulse = Math.sin(elapsedTime * 2) * 0.2 + 0.8;
        logo.ring.material.opacity = eased * 0.7 * pulse;
      }

      rimLight1.intensity = 2 + Math.sin(elapsedTime * 1.5) * 0.5;
      rimLight2.intensity = 2 + Math.cos(elapsedTime * 1.3) * 0.5;
      
      rimLight1.position.x = -20 + Math.sin(elapsedTime * 0.5) * 5;
      rimLight2.position.x = 20 + Math.cos(elapsedTime * 0.5) * 5;

      renderer.render(scene, camera);
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    const handleScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = Math.min(window.scrollY / maxScroll, 1);
      setScrollProgress(progress);
    };

    const handleResize = () => {
      if (!camera || !renderer) return;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      renderer.dispose();
    };
  }, [scrollProgress]);

  const getSceneContent = () => {
    if (scrollProgress < 0.15) {
      return {
        show: true,
        title: '',
        subtitle: 'RGB Gaming Keyboard',
        tagline: 'Scroll to begin the journey...',
      };
    } else if (scrollProgress < 0.25) {
      return {
        show: true,
        title: '',
        subtitle: 'Preparing to type...',
        tagline: '',
      };
    } else if (scrollProgress < 0.65) {
      return {
        show: true,
        title: 'ACM MJCET',
        subtitle: 'Typing in progress...',
        tagline: 'Letter by letter, we build the future',
      };
    } else if (scrollProgress < 0.75) {
      return {
        show: true,
        title: 'Ready to Enter',
        subtitle: 'Press ENTER to continue',
        tagline: '',
      };
    } else if (scrollProgress < 0.85) {
      return {
        show: false,
        title: '',
        subtitle: '',
        tagline: '',
      };
    } else {
      return {
        show: true,
        title: 'ACM MJCET',
        subtitle: 'Student Chapter',
        tagline: 'Creating Compute Power That Machines Can\'t Comprehend',
      };
    }
  };

  const content = getSceneContent();
  const sceneIndex = Math.floor(scrollProgress * 6);

  return (
    <>
      <div className="fixed left-0 top-0 h-screen w-full overflow-hidden bg-black">
        <canvas ref={canvasRef} className="absolute left-0 top-0 h-full w-full" />
        
        {content.show && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div 
              className="space-y-4 text-center px-6 transition-all duration-1000 md:space-y-6"
              style={{
                opacity: Math.max(0.3, 1 - Math.abs(scrollProgress - (sceneIndex / 6)) * 10),
              }}
            >
              {content.title && (
                <h1 className="text-4xl font-bold tracking-wider md:text-6xl lg:text-8xl">
                  <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
                    {content.title}
                  </span>
                </h1>
              )}
              {content.subtitle && (
                <p className="text-xl font-light tracking-widest text-cyan-300 md:text-2xl lg:text-3xl">
                  {content.subtitle}
                </p>
              )}
              {content.tagline && (
                <p className="mx-auto max-w-3xl text-sm italic text-gray-400 md:text-base lg:text-xl">
                  {content.tagline}
                </p>
              )}
            </div>
          </div>
        )}

        <div className="absolute bottom-8 right-8 flex flex-col gap-3">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className={`h-3 w-3 rounded-full transition-all duration-300 ${
                sceneIndex === i
                  ? 'scale-150 bg-cyan-400 shadow-lg shadow-cyan-400/50'
                  : 'bg-gray-700 hover:bg-gray-500'
              }`}
            />
          ))}
        </div>

        <div className="absolute left-8 top-8">
          <div className="text-xs font-mono text-cyan-400 md:text-sm">
            {scrollProgress < 0.15 && <p>SCENE_01: ANGLED_VIEW</p>}
            {scrollProgress >= 0.15 && scrollProgress < 0.25 && <p>SCENE_02: TOP_VIEW_TRANSITION</p>}
            {scrollProgress >= 0.25 && scrollProgress < 0.65 && <p>SCENE_03: TYPING_ACM_MJCET</p>}
            {scrollProgress >= 0.65 && scrollProgress < 0.75 && <p>SCENE_04: FOCUS_ENTER_KEY</p>}
            {scrollProgress >= 0.75 && scrollProgress < 0.85 && <p>SCENE_05: ENTER_PRESS_ZOOM</p>}
            {scrollProgress >= 0.85 && <p>SCENE_06: LOGO_REVEAL</p>}
          </div>
        </div>

        {scrollProgress >= 0.25 && scrollProgress < 0.65 && (
          <div className="absolute bottom-1/3 left-1/2 -translate-x-1/2 transform">
            <div className="flex animate-pulse items-center gap-3 text-lg font-mono text-cyan-400 md:text-2xl">
              <span>{'>'}</span>
              <span className="bg-cyan-400 px-2 text-black">_</span>
            </div>
          </div>
        )}

        {scrollProgress >= 0.65 && scrollProgress < 0.75 && (
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform">
            <div className="animate-pulse space-y-3 text-center">
              <div className="text-6xl">⏎</div>
              <p className="text-xl font-mono text-cyan-400">SCROLL TO ENTER</p>
            </div>
          </div>
        )}

        {scrollProgress >= 0.75 && scrollProgress < 0.90 && (
          <div 
            className="pointer-events-none absolute inset-0"
            style={{
              background: `radial-gradient(circle at center, transparent ${(1 - (scrollProgress - 0.75) / 0.15) * 60}%, rgba(0, 0, 0, ${(scrollProgress - 0.75) / 0.15 * 0.8}) 100%)`,
            }}
          />
        )}

        {scrollProgress >= 0.90 && (
          <div className="absolute bottom-20 left-1/2 w-full -translate-x-1/2 transform px-6">
            <div 
              className="space-y-2 text-center transition-all duration-1000"
              style={{
                opacity: Math.min((scrollProgress - 0.90) / 0.1, 1),
              }}
            >
              <p className="text-2xl font-bold text-cyan-400 md:text-4xl">
                Creating Compute Power
              </p>
              <p className="text-xl font-light text-purple-400 md:text-3xl">
                That Machines Can't Comprehend
              </p>
              <div className="mt-6 flex justify-center gap-4">
                <div className="rounded-lg border border-cyan-500 bg-cyan-500/20 px-6 py-3">
                  <p className="text-sm font-mono text-cyan-400">100,000+ Members</p>
                </div>
                <div className="rounded-lg border border-purple-500 bg-purple-500/20 px-6 py-3">
                  <p className="text-sm font-mono text-purple-400">38 SIGs</p>
                </div>
                <div className="rounded-lg border border-blue-500 bg-blue-500/20 px-6 py-3">
                  <p className="text-sm font-mono text-blue-400">860+ Chapters</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div
          className="pointer-events-none absolute inset-0 opacity-[0.02]"
          style={{
            background:
              'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 255, 255, 0.1) 2px, rgba(0, 255, 255, 0.1) 4px)',
          }}
        />

        {scrollProgress >= 0.15 && (
          <>
            <div 
              className="pointer-events-none absolute inset-0 border-2 border-cyan-500/20"
              style={{
                boxShadow: 'inset 0 0 30px rgba(0, 255, 255, 0.1)',
              }}
            />
            <div 
              className="pointer-events-none absolute inset-0 border-2 border-pink-500/20"
              style={{
                boxShadow: 'inset 0 0 30px rgba(255, 0, 255, 0.1)',
                transform: 'translate(1px, 1px)',
              }}
            />
          </>
        )}

        <div 
          className="pointer-events-none absolute inset-0"
          style={{
            background: 'radial-gradient(circle at center, transparent 30%, rgba(0, 0, 0, 0.6) 100%)',
          }}
        />

        {scrollProgress < 0.02 && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/90 transition-opacity duration-1000">
            <div className="space-y-6 text-center">
              <div className="text-4xl font-bold md:text-6xl">
                <span className="animate-pulse bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                  ACM MJCET
                </span>
              </div>
              <div className="flex justify-center gap-2">
                {[0, 1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-3 w-3 animate-bounce rounded-full bg-cyan-400"
                    style={{
                      animationDelay: `${i * 0.15}s`,
                    }}
                  />
                ))}
              </div>
              <p className="text-sm font-mono text-gray-400">
                INITIALIZING RGB ENVIRONMENT...
              </p>
            </div>
          </div>
        )}

        {scrollProgress < 0.10 && scrollProgress > 0.02 && (
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce transform">
            <div className="flex flex-col items-center gap-2 text-cyan-400">
              <p className="text-sm font-mono">SCROLL DOWN</p>
              <svg 
                className="h-6 w-6" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            </div>
          </div>
        )}

        {scrollProgress >= 0.75 && scrollProgress < 0.85 && (
          <div 
            className="pointer-events-none absolute inset-0"
            style={{
              background: `radial-gradient(circle at 50% 50%, rgba(255, 0, 255, ${(scrollProgress - 0.75) * 3}), transparent 60%)`,
              mixBlendMode: 'screen',
            }}
          />
        )}

        {scrollProgress >= 0.74 && scrollProgress < 0.76 && (
          <div 
            className="pointer-events-none absolute inset-0 opacity-30"
            style={{
              background: 'repeating-linear-gradient(0deg, transparent, transparent 10px, rgba(0, 255, 255, 0.3) 10px, rgba(0, 255, 255, 0.3) 11px)',
              animation: 'glitch 0.1s infinite',
            }}
          />
        )}
      </div>
      
      <div style={{ height: '600vh' }} />

      <style>{`
        @keyframes glitch {
          0% { transform: translateX(0); }
          20% { transform: translateX(-5px); }
          40% { transform: translateX(5px); }
          60% { transform: translateX(-5px); }
          80% { transform: translateX(5px); }
          100% { transform: translateX(0); }
        }
      `}</style>
    </>
  );
};

export default Hero;