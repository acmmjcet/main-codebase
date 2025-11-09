import * as THREE from 'three';

export interface KeyData {
  keyCap: THREE.Mesh;
  underglow: THREE.Mesh;
  sideGlow: THREE.Mesh;
  letter: string;
  isTarget: boolean;
  targetIndex: number;
  baseY: number;
  baseColor: THREE.Color;
}

export interface KeyboardObject {
  keyboardGroup: THREE.Group;
  keys: KeyData[];
  glowPlate: THREE.Mesh;
}

export interface KeyboardOptions {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  targetLetters?: string[];
  baseColor?: number;
  glowColor?: number;
  emissiveIntensity?: number;
}

export const createKeyboard = (
  scene: THREE.Scene,
  options: KeyboardOptions = {}
): KeyboardObject => {
  const {
    position = [0, 0, 0],
    rotation = [0, 0, 0],
    scale = 1,
    targetLetters = ['A', 'C', 'M', 'M', 'J', 'C', 'E', 'T'],
    baseColor = 0x0d0d0d,
    glowColor = 0xff00ff,
    emissiveIntensity = 0.3,
  } = options;

  const keyboardGroup = new THREE.Group();
  
  // Base plate
  const baseGeometry = new THREE.BoxGeometry(45, 1.5, 16);
  const baseMaterial = new THREE.MeshStandardMaterial({
    color: baseColor,
    roughness: 0.4,
    metalness: 0.6,
  });
  const base = new THREE.Mesh(baseGeometry, baseMaterial);
  base.castShadow = true;
  base.receiveShadow = true;
  keyboardGroup.add(base);

  // Glow plate
  const glowPlateGeometry = new THREE.BoxGeometry(46, 0.3, 17);
  const glowPlateMaterial = new THREE.MeshStandardMaterial({
    color: baseColor,
    roughness: 0.3,
    metalness: 0.7,
    emissive: glowColor,
    emissiveIntensity: emissiveIntensity,
  });
  const glowPlate = new THREE.Mesh(glowPlateGeometry, glowPlateMaterial);
  glowPlate.position.y = -0.9;
  keyboardGroup.add(glowPlate);

  const keys: KeyData[] = [];
  
  // Key layout
  const keyRows = [
    ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M'],
  ];

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

  // Create keys
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

      // Underglow
      const underglowGeometry = new THREE.PlaneGeometry(2.4, 2.4);
      const underglow = new THREE.Mesh(underglowGeometry, underglowMaterial.clone());
      underglow.rotation.x = -Math.PI / 2;
      underglow.position.set(x, 0.1, z);
      keyboardGroup.add(underglow);

      // Side glow
      const sideGlowGeometry = new THREE.BoxGeometry(2.3, 0.2, 2.3);
      const sideGlow = new THREE.Mesh(sideGlowGeometry, sideGlowMaterial.clone());
      sideGlow.position.set(x, 0.85, z);
      keyboardGroup.add(sideGlow);

      // Label
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
      const keyData: KeyData = {
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

  // Spacebar
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

  const spacebarSideGlow = new THREE.Mesh(
    new THREE.BoxGeometry(14.1, 0.2, 2.3),
    sideGlowMaterial.clone()
  );
  spacebarSideGlow.position.set(0, 0.85, 4);
  keyboardGroup.add(spacebarSideGlow);

  // Enter key
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

  // Set position, rotation, and scale
  keyboardGroup.position.set(...position);
  keyboardGroup.rotation.set(...rotation);
  keyboardGroup.scale.setScalar(scale);
  
  scene.add(keyboardGroup);

  return { keyboardGroup, keys, glowPlate };
};