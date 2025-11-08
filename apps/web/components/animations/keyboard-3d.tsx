// import React, { useRef, useEffect, useMemo, useState } from 'react';
// import { Canvas, useFrame, useThree } from '@react-three/fiber';
// import { Environment, Text, PerspectiveCamera } from '@react-three/drei';
// import * as THREE from 'three';

// // Load GSAP from CDN (required for environment compatibility)
// const gsap = window.gsap;
// const ScrollTrigger = window.ScrollTrigger;

// // Ensure GSAP plugins are registered if they were loaded via CDN
// if (gsap && ScrollTrigger) {
//   gsap.registerPlugin(ScrollTrigger);
// } else {
//   console.error("GSAP or ScrollTrigger not loaded correctly via CDN.");
// }

// // --- 1. CONFIGURATION CONSTANTS ---

// // Sequence of letters to be pressed: A C M M J C E T
// // NOTE: We use indices for repeated letters (M1, M2, C2) to ensure unique targeting.
// const KEY_SEQUENCE = ['Key_A', 'Key_C', 'Key_M1', 'Key_M2', 'Key_J', 'Key_C2', 'Key_E', 'Key_T'];

// // Key press timings and actions (normalized to the GSAP timeline, 0 to 1.5)
// const KEY_ACTIONS = KEY_SEQUENCE.flatMap((keyName, index) => {
//   const baseTime = 0.35 + index * 0.15; // Start key presses after the initial camera move
//   return [
//     { keyName, time: baseTime, action: 'press' },
//     { keyName, time: baseTime + 0.05, action: 'release' },
//   ];
// });

// const KEY_PRESS_OFFSET = -0.15;
// const KEY_PRESS_DURATION = 0.05;
// const SCROLL_HEIGHT = 500; // Multiplier for scrollable height (e.g., 500vh)

// // Camera path points (defines the cinematic scenes)
// const CAMERA_POINTS = [
//   // Normalized Timeline Time: 0.0 to 1.5
//   { t: 0.0, pos: [0, 1.5, 5.5], target: [0, 0.5, 0] }, // Start: Wide front view
//   { t: 0.1, pos: [0, 1.5, 5.5], target: [0, 0.5, 0] }, // Hold initial view for power-up
//   { t: 0.25, pos: [-3, 1.2, 2], target: [-2, 0.5, 0] }, // Scene 1: Close-up on left side
//   { t: 0.5, pos: [-0.5, 1.0, 1.5], target: [0, 0.2, 0] }, // Scene 2: Focus on 'A C M' area (Key presses start)
//   { t: 0.8, pos: [0, 5, -1], target: [0, 0, 0] },       // Scene 3: Top/Back view
//   { t: 1.1, pos: [1.5, 1.2, 2], target: [1.8, 0.5, 0] }, // Scene 4: Focus on 'J E T' area
//   { t: 1.5, pos: [5, 2.5, 5], target: [0, 0, 0] },       // End: Final dramatic exit view
// ];

// // --- 2. KEYBOARD SIMULATION COMPONENTS ---

// /**
//  * Renders an individual keycap mesh. Simulates the emissive material for RGB effects.
//  */
// function FakeKey({ position, name, letter, keyColor, initialEmissive }) {
//   const keyRef = useRef();
  
//   // Custom material for keycap with emissive properties
//   const material = useMemo(() => {
//     // Only use THREE.MeshStandardMaterial for meshes
//     if (!keyRef.current) {
//         const mat = new THREE.MeshStandardMaterial({
//             color: keyColor,
//             roughness: 0.8,
//             metalness: 0.1,
//             emissive: new THREE.Color(initialEmissive),
//             emissiveIntensity: 0, // Start with no glow
//         });
//         keyRef.current = mat; 
//         return mat;
//     }
//     return keyRef.current;
//   }, [keyColor, initialEmissive]);

//   // Expose the group to be targeted by GSAP in the SceneManager
//   useThree(({ scene }) => {
//     // This is a common pattern to ensure GSAP can find the group by name
//     if (keyRef.current && !scene.getObjectByName(name)) {
//         scene.add(keyRef.current);
//     }
//   });

//   return (
//     <group position={position} name={name} ref={keyRef}>
//       {/* Keycap Body */}
//       <mesh material={material} position-y={0.075} castShadow receiveShadow>
//         <boxGeometry args={[0.9, 0.15, 0.9]} />
//       </mesh>
      
//       {/* Key Stem/Base (hidden mechanical part) */}
//       <mesh position-y={-0.1} >
//         <boxGeometry args={[0.5, 0.3, 0.5]} />
//         <meshStandardMaterial color="#222" />
//       </mesh>

//       {/* Letter Text on Keycap */}
//       <Text
//         position={[0, 0.15, 0]}
//         fontSize={0.5}
//         color="white"
//         anchorX="center"
//         anchorY="middle"
//         material-depthTest={false}
//       >
//         {letter}
//       </Text>
//     </group>
//   );
// }

// /**
//  * Assembles the full simulated keyboard structure.
//  */
// function FakeKeyboard() {
//   const keyboardBaseRef = useRef();

//   // Create positions for a standard QWERTY layout (simplified)
//   const keyGrid = useMemo(() => {
//     const keys = [];
//     // Only need 3 rows for all target keys (QWERTY, ASDFGHJKL, ZXCVBNM)
//     const layout = [
//       ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
//       ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ';'],
//       ['Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.', '/'],
//     ];

//     // Map letters to unique names for GSAP targeting (FIXED)
//     // The keys array in nameMap must be unique keys to prevent the duplicate object key error.
//     const nameMap = {
//       'A': 'Key_A',
//       'C_1': 'Key_C', // First C
//       'C_2': 'Key_C2', // Second C in sequence (used the '.' key as placeholder)
//       'J': 'Key_J',
//       'E': 'Key_E',
//       'T': 'Key_T',
//       'M_1': 'Key_M1', // First M
//       'M_2': 'Key_M2', // Second M
//     };
    
//     let mCount = 0;
//     let cCount = 0;

//     layout.forEach((row, rowIndex) => {
//       row.forEach((letter, colIndex) => {
//         const x = colIndex * 1.2 - 5;
//         const z = rowIndex * 1.2 - 1.5;
        
//         let name = `Key_${letter}_${rowIndex}_${colIndex}`;
//         let targetLetter = letter;
//         let isTargeted = false;

//         // Custom mapping logic for the sequence A C M M J C E T
//         if (letter === 'A') {
//           name = nameMap.A;
//           isTargeted = true;
//         } else if (letter === 'C') {
//           // Row 2, Col 2 is the 'C' key. Use it for C and C2 in the sequence.
//           if (cCount === 0) {
//             name = nameMap.C_1;
//             cCount++;
//             isTargeted = true;
//           } else if (cCount === 1) {
//             // Use the '.' key position (Row 2, Col 8) for the second 'C' action (Key_C2)
//             name = nameMap.C_2;
//             targetLetter = '.'; // Still displays '.' but is animated as 'C2'
//             cCount++;
//             isTargeted = true;
//           }
//         } else if (letter === 'M') {
//           if (mCount === 0) {
//             name = nameMap.M_1;
//             mCount++;
//             isTargeted = true;
//           } else if (mCount === 1) {
//             name = nameMap.M_2;
//             mCount++;
//             isTargeted = true;
//           }
//         } else if (letter === 'J') {
//           name = nameMap.J;
//           isTargeted = true;
//         } else if (letter === 'E') {
//           name = nameMap.E;
//           isTargeted = true;
//         } else if (letter === 'T') {
//           name = nameMap.T;
//           isTargeted = true;
//         }
        
//         // Set specific color for targeted keys
//         const keyColor = isTargeted ? '#282c34' : '#1e2128'; 
//         // Initial Emissive color (purple) for targeted keys
//         const initialEmissive = isTargeted ? 0xff00ff : 0x000000;

//         keys.push(
//           <FakeKey
//             key={name}
//             name={name}
//             position={[x, 0, z]}
//             letter={targetLetter}
//             keyColor={keyColor}
//             initialEmissive={initialEmissive}
//           />
//         );
//       });
//     });

//     return keys;
//   }, []);

//   // Base material to simulate the metal/plastic body of the keyboard
//   const baseMaterial = useMemo(() => new THREE.MeshStandardMaterial({
//     color: '#111',
//     roughness: 0.6,
//     metalness: 0.9,
//     emissive: new THREE.Color(0x000000),
//     emissiveIntensity: 0,
//   }), []);
  
//   // Expose the base mesh for GSAP to find
//   useThree(({ scene }) => {
//     if (keyboardBaseRef.current && !scene.getObjectByName('KeyboardBase')) {
//         scene.add(Object.assign(keyboardBaseRef.current, { name: 'KeyboardBase' }));
//     }
//   });


//   return (
//     <group rotation-x={-0.1} position-y={-0.3}>
//       {/* Keyboard Base Plate (Used for RGB Power-up animation) */}
//       <mesh ref={keyboardBaseRef} material={baseMaterial} castShadow receiveShadow>
//         <boxGeometry args={[12, 0.4, 6]} />
//       </mesh>
//       {/* All Keycaps */}
//       {keyGrid}
//     </group>
//   );
// }

// // --- 3. SCENE AND ANIMATION MANAGER ---

// /**
//  * Manages the camera, lights, and scroll-triggered animations (GSAP).
//  */
// function SceneManager({ cameraRef }) {
//   const { camera, scene } = useThree();
//   const cameraTarget = useMemo(() => new THREE.Vector3(0, 0.5, 0), []);
//   const scrollTimelineRef = useRef(null);

  
//   // Use useFrame to update the camera look-at position every frame
//   useFrame(() => {
//     // Ensure the camera always looks at the dynamically updated target
//     camera.lookAt(cameraTarget);
//   });
  
//   // Set up GSAP ScrollTrigger timeline
//   useEffect(() => {
//     // Check if GSAP and ScrollTrigger are available after CDN load
//     if (!gsap || !ScrollTrigger) {
//         console.warn("GSAP libraries are not ready for animation setup.");
//         return;
//     }

//     // 1. Cleanup old timeline
//     if (scrollTimelineRef.current) {
//         scrollTimelineRef.current.kill(); 
//         ScrollTrigger.getAll().forEach(trigger => trigger.kill());
//     }

//     // 2. Initial Setup: Find the meshes needed for animation
//     const keyboardBaseMesh = scene.getObjectByName('KeyboardBase');
//     const keyMeshes = {};
//     KEY_SEQUENCE.forEach(name => {
//       const keyMesh = scene.getObjectByName(name);
//       if (keyMesh) {
//         keyMeshes[name] = keyMesh;
//       }
//     });

//     // 3. Create the main GSAP timeline linked to scroll
//     const tl = gsap.timeline({
//       defaults: { duration: 0.2, ease: 'power2.inOut' },
//       scrollTrigger: {
//         trigger: '#scroll-container', // Link to the scrollable div
//         start: 'top top',
//         end: `+=${SCROLL_HEIGHT}vh`,
//         scrub: 1, // Smooth scrubbing
//         // markers: true // Uncomment to debug scroll
//       },
//     });

//     scrollTimelineRef.current = tl;

//     // --- A. RGB Power-Up (0.0 to 0.1) ---
//     if (keyboardBaseMesh) {
//         // Animate the keyboard base plate's emissive intensity (Blue glow)
//         tl.to(keyboardBaseMesh.material, { emissiveIntensity: 1.5, duration: 0.1, ease: 'power1.in' }, 0.0);
//         tl.to(keyboardBaseMesh.material.emissive, { r: 0.1, g: 0.5, b: 0.8, duration: 0.1 }, 0.0);
        
//         // Target Keycap Meshes: Animate their emissive intensity (Purple/Pink Glow)
//         Object.values(keyMeshes).forEach((keyGroup) => {
//             const material = keyGroup.children[0].material; // Keycap mesh material
//             tl.to(material, { emissiveIntensity: 2.0, duration: 0.1 }, 0.0);
//             tl.to(material.emissive, { r: 1.0, g: 0.1, b: 0.8, duration: 0.1 }, 0.0);
//         });
//     }

//     // --- B. Cinematic Camera Path (0.1 to 1.5) ---
//     CAMERA_POINTS.forEach(({ t, pos, target }, index) => {
//       if (t >= 0.1) { // Skip the initial 0.0 stage for the main path
//         // Camera Position Tween
//         tl.to(camera.position, {
//           x: pos[0], y: pos[1], z: pos[2],
//           duration: CAMERA_POINTS[index + 1]?.t - t || 0.2,
//           ease: 'power2.inOut'
//         }, t);

//         // Camera Target Tween
//         tl.to(cameraTarget, {
//           x: target[0], y: target[1], z: target[2],
//           duration: CAMERA_POINTS[index + 1]?.t - t || 0.2,
//           ease: 'power2.inOut'
//         }, t);
//       }
//     });


//     // --- C. Key Press Sequence (0.35 onwards) ---
//     KEY_ACTIONS.forEach(action => {
//       const keyGroup = scene.getObjectByName(action.keyName); // The Group component
//       if (!keyGroup) return;

//       const progress = action.time; 
      
//       // Target the key group's position for the press effect
//       if (action.action === 'press') {
//         tl.to(keyGroup.position, {
//           y: KEY_PRESS_OFFSET,
//           duration: KEY_PRESS_DURATION,
//           ease: 'power1.out',
//         }, progress);
//       } else if (action.action === 'release') {
//         tl.to(keyGroup.position, {
//           y: 0,
//           duration: KEY_PRESS_DURATION * 2,
//           ease: 'elastic.out(1, 0.5)', // Nice mechanical spring back effect
//         }, progress);
//       }
//     });

//     return () => {
//       // Final cleanup
//       if (scrollTimelineRef.current) scrollTimelineRef.current.kill(); 
//       ScrollTrigger.getAll().forEach(trigger => trigger.kill());
//     };
//   }, [camera, cameraTarget, scene]);

//   return (
//     <>
//       <PerspectiveCamera ref={cameraRef} makeDefault position={[0, 1.5, 5.5]} fov={50} near={0.1} far={100} />
//       {/* Light Sources */}
//       <ambientLight intensity={0.5} />
//       <directionalLight position={[10, 10, 5]} intensity={3} castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048} />
//       <pointLight position={[-10, -10, 5]} intensity={1} />
      
//       {/* Environment for professional reflections */}
//       <Environment preset="city" /> 
      
//       {/* Render the simulated keyboard */}
//       <FakeKeyboard />
//     </>
//   );
// }

// // --- 4. MAIN APP COMPONENT ---

// export default function App() {
//   const cameraRef = useRef();
  
//   // NOTE: We need to inject the GSAP CDN scripts here for them to be available globally (window.gsap)
//   // The environment setup handles this externally for React, but we must import them explicitly in a React context if needed.
//   // For this environment, we rely on the CDN injection.

//   // Create a text overlay to showcase the content
//   const OverlayText = ({ text, scrollStart, scrollEnd, className = '' }) => {
//     const [opacity, setOpacity] = useState(0);

//     useEffect(() => {
//       if (!ScrollTrigger) return;
        
//       // Create a specific scroll trigger for the text visibility
//       const trigger = ScrollTrigger.create({
//         trigger: '#scroll-container',
//         start: scrollStart,
//         end: scrollEnd,
//         scrub: true,
//         onUpdate: (self) => {
//           // Fade in and out based on scroll progress within its section
//           const progress = self.progress;
//           let newOpacity;
//           if (progress < 0.2) {
//             newOpacity = progress / 0.2; // Fade in
//           } else if (progress > 0.8) {
//             newOpacity = 1 - ((progress - 0.8) / 0.2); // Fade out
//           } else {
//             newOpacity = 1; // Hold full opacity
//           }
//           setOpacity(Math.max(0, Math.min(1, newOpacity)));
//         },
//       });
      
//       return () => trigger.kill();
//     }, [scrollStart, scrollEnd]);

//     return (
//       <div 
//         className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-opacity duration-500 pointer-events-none ${className}`}
//         style={{ opacity }}
//       >
//         {text}
//       </div>
//     );
//   };

//   return (
//     <div className="relative h-screen w-screen bg-gray-900 font-sans">
//       {/* Canvas for the 3D scene (fixed to fill the viewport) */}
//       <div className="fixed inset-0 z-0">
//         <Canvas 
//           dpr={[1, 2]} 
//           shadows
//         >
//           <SceneManager cameraRef={cameraRef} />
//         </Canvas>
//       </div>

//       {/* Scrollable Container (Creates the vertical scroll space) */}
//       <div id="scroll-container" style={{ height: `${SCROLL_HEIGHT}vh` }} className="relative z-10 w-full">
//         {/* Overlay Content Sections */}

//         <OverlayText
//           text={
//             <div className="text-center">
//               <h1 className="text-6xl font-extrabold text-white mb-4 tracking-tight">
//                 MECHANICAL ELEGANCE
//               </h1>
//               <p className="text-2xl text-purple-300">
//                 A Cinematic Look at Performance
//               </p>
//             </div>
//           }
//           scrollStart="top top"
//           scrollEnd="center top"
//         />

//         <OverlayText
//           text={
//             <div className="text-center">
//               <h2 className="text-7xl font-black text-cyan-300 tracking-wider">
//                 A C M
//               </h2>
//               <p className="text-xl text-white mt-2">
//                 The keystrokes that define innovation.
//               </p>
//             </div>
//           }
//           scrollStart="30vh top"
//           scrollEnd="80vh top"
//         />

//         <OverlayText
//           text={
//             <div className="text-center">
//               <h2 className="text-7xl font-black text-fuchsia-400 tracking-wider">
//                 M J C E T
//               </h2>
//               <p className="text-xl text-white mt-2">
//                 Precision, speed, and execution.
//               </p>
//             </div>
//           }
//           scrollStart="100vh top"
//           scrollEnd="140vh top"
//         />

//         <OverlayText
//           text={
//             <div className="text-center p-8 bg-gray-900/80 rounded-xl shadow-2xl backdrop-blur-sm">
//               <h2 className="text-5xl font-extrabold text-lime-400 mb-2">
//                 MISSION COMPLETE
//               </h2>
//               <p className="text-lg text-gray-300">
//                 Scroll up to replay the cinematic sequence.
//               </p>
//             </div>
//           }
//           scrollStart="180vh top"
//           scrollEnd="bottom bottom"
//         />
//       </div>
//     </div>
//   );
// }