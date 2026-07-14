import './style.css';
import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

const canvas = document.querySelector('#scene');
const experience = document.querySelector('.experience');
const stickyHero = document.querySelector('.sticky-hero');
const copyBlocks = [...document.querySelectorAll('[data-copy]')];
const meterItems = [...document.querySelectorAll('[data-meter]')];
const meterFill = document.querySelector('#meter-fill');
const systemState = document.querySelector('#system-state');
const cursor = document.querySelector('.cursor-orbit');
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let hasPresentedFirstFrame = false;

function revealExperience() {
  if (hasPresentedFirstFrame) return;
  hasPresentedFirstFrame = true;
  window.clearTimeout(window.__qeeBootFallback);
  document.body.classList.remove('is-loading');
  document.documentElement.classList.add('is-ready');
  const bootScreen = document.querySelector('#boot-screen');
  if (bootScreen) window.setTimeout(() => bootScreen.remove(), 760);
}

if (menuToggle && nav) {
  menuToggle.addEventListener('click', () => {
    const open = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!open));
    nav.classList.toggle('is-open', !open);
  });
  nav.addEventListener('click', (event) => {
    if (event.target.closest('a')) {
      menuToggle.setAttribute('aria-expanded', 'false');
      nav.classList.remove('is-open');
    }
  });
}

const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  alpha: false,
  powerPreference: 'high-performance'
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.02;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setClearColor(0x041012, 1);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x041012);
scene.fog = new THREE.FogExp2(0x041012, 0.033);

const camera = new THREE.PerspectiveCamera(32, window.innerWidth / window.innerHeight, 0.1, 110);
camera.position.set(0.15, 0.1, 13.3);

const pmrem = new THREE.PMREMGenerator(renderer);
const environment = new RoomEnvironment();
scene.environment = pmrem.fromScene(environment, 0.04).texture;
environment.dispose();
pmrem.dispose();

const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
const bloom = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  0.28,
  0.52,
  0.84
);
composer.addPass(bloom);

scene.add(new THREE.HemisphereLight(0xcde9e5, 0x031113, 1.15));
const key = new THREE.DirectionalLight(0xf4fbf9, 4.7);
key.position.set(5.5, 7.2, 7.4);
key.castShadow = true;
key.shadow.mapSize.set(2048, 2048);
key.shadow.camera.left = -9;
key.shadow.camera.right = 9;
key.shadow.camera.top = 9;
key.shadow.camera.bottom = -9;
scene.add(key);

const tealFill = new THREE.PointLight(0x2ad8d1, 25, 21, 2);
tealFill.position.set(-4.8, 2.4, 4.4);
scene.add(tealFill);
const rim = new THREE.PointLight(0xc7f4ef, 18, 19, 2);
rim.position.set(5.4, -2.8, 4.5);
scene.add(rim);
const pointerLight = new THREE.PointLight(0x6ee3dc, 9, 13, 2);
pointerLight.position.set(2.5, 2, 6);
scene.add(pointerLight);

const world = new THREE.Group();
world.position.set(2.15, 0.12, 0);
world.rotation.set(-0.07, -0.22, 0.015);
scene.add(world);

const claritySystem = new THREE.Group();
world.add(claritySystem);

const silver = new THREE.MeshPhysicalMaterial({
  color: 0xa6b2b1,
  metalness: 0.92,
  roughness: 0.17,
  clearcoat: 0.86,
  clearcoatRoughness: 0.11,
  envMapIntensity: 1.3
});
const darkMetal = new THREE.MeshPhysicalMaterial({
  color: 0x081718,
  metalness: 0.84,
  roughness: 0.2,
  clearcoat: 0.86,
  clearcoatRoughness: 0.12,
  envMapIntensity: 1.22
});
const tealMetal = new THREE.MeshPhysicalMaterial({
  color: 0x167f7d,
  metalness: 0.66,
  roughness: 0.18,
  clearcoat: 0.92,
  clearcoatRoughness: 0.09,
  emissive: 0x062b2c,
  emissiveIntensity: 0.32
});
const clearGlass = new THREE.MeshPhysicalMaterial({
  color: 0xa9ded9,
  metalness: 0,
  roughness: 0.045,
  transmission: 0.78,
  thickness: 1.6,
  transparent: true,
  opacity: 0.36,
  clearcoat: 1,
  clearcoatRoughness: 0.035,
  ior: 1.45,
  envMapIntensity: 1.35
});
const tealGlass = new THREE.MeshPhysicalMaterial({
  color: 0x25c7c0,
  metalness: 0.03,
  roughness: 0.06,
  transmission: 0.5,
  thickness: 1.15,
  transparent: true,
  opacity: 0.58,
  clearcoat: 1,
  clearcoatRoughness: 0.04,
  ior: 1.39,
  emissive: 0x06393a,
  emissiveIntensity: 0.42
});
const ceramic = new THREE.MeshPhysicalMaterial({
  color: 0xeaf5f2,
  metalness: 0.06,
  roughness: 0.18,
  clearcoat: 0.86,
  clearcoatRoughness: 0.1
});
const softGlow = new THREE.MeshBasicMaterial({
  color: 0x62e3dc,
  transparent: true,
  opacity: 0.58,
  toneMapped: false
});
const paleGlow = new THREE.MeshBasicMaterial({
  color: 0xc4f4ef,
  transparent: true,
  opacity: 0.44,
  toneMapped: false
});

function makeTextTexture(text, options = {}) {
  const canvasEl = document.createElement('canvas');
  canvasEl.width = options.width || 1024;
  canvasEl.height = options.height || 256;
  const ctx = canvasEl.getContext('2d');
  ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
  if (options.backdrop) {
    ctx.fillStyle = options.backdrop;
    ctx.beginPath();
    ctx.roundRect(18, 36, canvasEl.width - 36, canvasEl.height - 72, 48);
    ctx.fill();
  }
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = options.color || '#eef8f5';
  ctx.font = `${options.weight || 600} ${options.size || 82}px ${options.family || 'Arial'}`;
  ctx.fillText(text, canvasEl.width / 2, canvasEl.height / 2 + (options.offsetY || 0));
  const texture = new THREE.CanvasTexture(canvasEl);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = Math.min(renderer.capabilities.getMaxAnisotropy(), 8);
  return texture;
}

function makeSprite(text, width, height, options = {}) {
  const material = new THREE.SpriteMaterial({
    map: makeTextTexture(text, options),
    transparent: true,
    opacity: options.opacity ?? 1,
    depthWrite: false,
    toneMapped: false
  });
  const sprite = new THREE.Sprite(material);
  sprite.scale.set(width, height, 1);
  return sprite;
}

// Smooth physical clarity lens: nested glass volumes, polished rings and
// flowing value bands. There are no angular cards or box-based UI metaphors.
const coreGroup = new THREE.Group();
claritySystem.add(coreGroup);

const outerShell = new THREE.Mesh(new THREE.SphereGeometry(2.2, 128, 96), clearGlass);
outerShell.castShadow = true;
coreGroup.add(outerShell);

const midShellMaterial = tealGlass.clone();
midShellMaterial.opacity = 0.23;
const midShell = new THREE.Mesh(new THREE.SphereGeometry(1.55, 112, 80), midShellMaterial);
coreGroup.add(midShell);

const insightCoreMaterial = new THREE.MeshPhysicalMaterial({
  color: 0x5de0d9,
  metalness: 0.15,
  roughness: 0.08,
  transmission: 0.25,
  transparent: true,
  opacity: 0.82,
  clearcoat: 1,
  clearcoatRoughness: 0.04,
  emissive: 0x0b8580,
  emissiveIntensity: 0.42
});
const insightCore = new THREE.Mesh(new THREE.SphereGeometry(0.67, 96, 72), insightCoreMaterial);
insightCore.castShadow = true;
coreGroup.add(insightCore);

const coreHalo = new THREE.Mesh(new THREE.TorusGeometry(0.93, 0.018, 12, 260), paleGlow.clone());
coreHalo.rotation.x = Math.PI / 2;
coreGroup.add(coreHalo);

const qeeMark = makeSprite('QEE', 1.55, 0.43, {
  family: 'Georgia',
  size: 118,
  weight: 600,
  color: '#f3faf7'
});
qeeMark.position.set(0, 0.03, 2.21);
qeeMark.material.opacity = 0;
coreGroup.add(qeeMark);

const clarityLabel = makeSprite('CLARITY · ASSURANCE · PERFORMANCE', 2.25, 0.28, {
  family: 'Arial',
  size: 41,
  weight: 600,
  color: '#8fe7e2'
});
clarityLabel.position.set(0, -0.53, 2.16);
clarityLabel.material.opacity = 0;
coreGroup.add(clarityLabel);

const rings = [];
[
  { radius: 1.03, tube: 0.038, rotation: [Math.PI / 2, 0, 0.2], material: tealMetal },
  { radius: 1.5, tube: 0.026, rotation: [1.1, 0.32, -0.55], material: silver },
  { radius: 1.84, tube: 0.022, rotation: [0.45, 1.05, 0.25], material: tealMetal },
  { radius: 2.42, tube: 0.018, rotation: [1.22, -0.3, 0.85], material: silver }
].forEach((def, index) => {
  const material = def.material.clone();
  material.transparent = true;
  material.opacity = index === 0 ? 0.82 : 0.62;
  const ring = new THREE.Mesh(new THREE.TorusGeometry(def.radius, def.tube, 16, 320), material);
  ring.rotation.set(...def.rotation);
  ring.userData.initialRotation = ring.rotation.clone();
  ring.userData.targetRotation = new THREE.Euler(
    Math.PI / 2 + (index - 1.5) * 0.08,
    (index - 1.5) * 0.17,
    (index - 1.5) * 0.13
  );
  coreGroup.add(ring);
  rings.push(ring);
});

function makeClosedRibbon(radius, phase, yScale, zScale, tilt, material) {
  const points = [];
  for (let i = 0; i < 160; i += 1) {
    const a = (i / 160) * Math.PI * 2;
    points.push(new THREE.Vector3(
      Math.cos(a) * radius,
      Math.sin(a) * radius * yScale,
      Math.sin(a * 2 + phase) * zScale
    ));
  }
  const curve = new THREE.CatmullRomCurve3(points, true, 'centripetal', 0.5);
  const mesh = new THREE.Mesh(new THREE.TubeGeometry(curve, 360, 0.027, 12, true), material.clone());
  mesh.rotation.set(tilt[0], tilt[1], tilt[2]);
  mesh.userData.curve = curve;
  return mesh;
}

const valueBands = [
  makeClosedRibbon(1.26, 0.1, 0.68, 0.16, [0.25, 0.15, 0.08], tealMetal),
  makeClosedRibbon(1.57, 1.6, 0.57, 0.21, [-0.2, 0.52, 0.18], silver),
  makeClosedRibbon(1.92, 3.0, 0.52, 0.24, [0.34, -0.38, -0.16], tealMetal)
];
valueBands.forEach((band, index) => {
  band.material.transparent = true;
  band.material.opacity = 0.68 - index * 0.1;
  coreGroup.add(band);
});

const valueLabels = [
  { text: 'QUALITY', position: new THREE.Vector3(-1.3, 1.44, 1.72) },
  { text: 'EFFICIENCY', position: new THREE.Vector3(1.4, 1.23, 1.65) },
  { text: 'EFFECTIVENESS', position: new THREE.Vector3(0.3, -1.63, 1.62) }
].map((def) => {
  const sprite = makeSprite(def.text, 1.25, 0.24, {
    family: 'Arial', size: 50, weight: 600, color: '#c5f2ee', backdrop: 'rgba(4,16,18,.48)'
  });
  sprite.position.copy(def.position);
  sprite.material.opacity = 0;
  coreGroup.add(sprite);
  return sprite;
});

// Incoming complexity is rendered as fluid filaments. The high segment count
// and centripetal curves keep every path soft and continuous.
const incoming = [];
const seeded = (() => {
  let seed = 4127;
  return () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
})();

for (let i = 0; i < 15; i += 1) {
  const y = (seeded() - 0.5) * 5.2;
  const z = (seeded() - 0.5) * 3.4;
  const endY = (seeded() - 0.5) * 1.65;
  const endZ = (seeded() - 0.5) * 1.1;
  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-8.5 - seeded() * 1.3, y, z),
    new THREE.Vector3(-6.2, y * 0.88 + Math.sin(i) * 0.55, z * 0.82),
    new THREE.Vector3(-4.5, y * 0.55 + Math.cos(i * 1.7) * 0.35, z * 0.55),
    new THREE.Vector3(-3.0, endY * 1.25, endZ * 1.35),
    new THREE.Vector3(-2.02, endY, endZ)
  ], false, 'centripetal', 0.52);
  const material = new THREE.MeshBasicMaterial({
    color: i % 3 === 0 ? 0x8ce8e3 : 0x2f8f8c,
    transparent: true,
    opacity: 0.16 + (i % 4) * 0.025,
    toneMapped: false
  });
  const tube = new THREE.Mesh(new THREE.TubeGeometry(curve, 180, 0.011 + (i % 3) * 0.002, 9, false), material);
  claritySystem.add(tube);
  const pulse = new THREE.Mesh(new THREE.SphereGeometry(0.04 + (i % 3) * 0.008, 20, 14), i % 4 === 0 ? paleGlow.clone() : softGlow.clone());
  claritySystem.add(pulse);
  incoming.push({ curve, tube, pulse, offset: seeded() });
}

// Soft particulate signals create depth around the incoming streams.
const particleCount = 520;
const particlePositions = new Float32Array(particleCount * 3);
for (let i = 0; i < particleCount; i += 1) {
  particlePositions[i * 3] = -8.8 + seeded() * 7.4;
  particlePositions[i * 3 + 1] = (seeded() - 0.5) * 6.2;
  particlePositions[i * 3 + 2] = (seeded() - 0.5) * 4.4;
}
const particlesGeometry = new THREE.BufferGeometry();
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
const particlesMaterial = new THREE.PointsMaterial({
  color: 0x65d9d3,
  size: 0.025,
  transparent: true,
  opacity: 0.38,
  depthWrite: false,
  blending: THREE.AdditiveBlending
});
const particles = new THREE.Points(particlesGeometry, particlesMaterial);
claritySystem.add(particles);

// Assurance satellites represent the fields QEE brings into one coordinated
// view. Smooth glass spheres and circular rails replace angular service cards.
const serviceDefs = [
  { name: 'FINANCE', angle: 0.52, radius: 3.55 },
  { name: 'RISK', angle: 1.76, radius: 3.5 },
  { name: 'AUDIT', angle: 2.78, radius: 3.62 },
  { name: 'GOVERNANCE', angle: 3.88, radius: 3.52 },
  { name: 'CYBERSECURITY', angle: 5.18, radius: 3.62 }
];
const satellites = [];
serviceDefs.forEach((def, index) => {
  const group = new THREE.Group();
  const orbMaterial = tealGlass.clone();
  orbMaterial.opacity = 0.54;
  const orb = new THREE.Mesh(new THREE.SphereGeometry(0.3, 48, 32), orbMaterial);
  orb.castShadow = true;
  group.add(orb);
  const ringMaterial = index % 2 ? silver.clone() : tealMetal.clone();
  ringMaterial.transparent = true;
  ringMaterial.opacity = 0.72;
  const orbit = new THREE.Mesh(new THREE.TorusGeometry(0.42, 0.018, 12, 180), ringMaterial);
  orbit.rotation.x = Math.PI / 2;
  group.add(orbit);
  const indicator = new THREE.Mesh(new THREE.SphereGeometry(0.055, 22, 14), paleGlow.clone());
  indicator.position.set(0.19, 0.17, 0.25);
  group.add(indicator);
  const label = makeSprite(def.name, def.name.length > 9 ? 1.8 : 1.25, 0.25, {
    family: 'Arial', size: 51, weight: 600, color: '#d4f4f1', backdrop: 'rgba(4,16,18,.52)'
  });
  label.position.set(0, -0.65, 0.03);
  label.material.opacity = 0;
  group.add(label);

  const final = new THREE.Vector3(
    Math.cos(def.angle) * def.radius,
    Math.sin(def.angle) * def.radius * 0.68,
    0.15 + Math.sin(def.angle * 2) * 0.5
  );
  const start = final.clone().multiplyScalar(1.65).add(new THREE.Vector3(
    index % 2 ? 0.7 : -0.7,
    index < 2 ? 1.15 : -0.8,
    -1.6 - index * 0.22
  ));
  group.position.copy(start);
  group.scale.setScalar(0.2);
  group.visible = false;
  claritySystem.add(group);

  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0, -0.05),
    final.clone().multiplyScalar(0.32).add(new THREE.Vector3(0, 0.12 * (index - 2), -0.2)),
    final.clone().multiplyScalar(0.68),
    final.clone()
  ], false, 'centripetal', 0.48);
  const connectorMaterial = new THREE.MeshBasicMaterial({
    color: 0x78ded8,
    transparent: true,
    opacity: 0,
    toneMapped: false
  });
  const connector = new THREE.Mesh(new THREE.TubeGeometry(curve, 130, 0.012, 9, false), connectorMaterial);
  claritySystem.add(connector);
  const pulse = new THREE.Mesh(new THREE.SphereGeometry(0.04, 18, 12), softGlow.clone());
  pulse.material.opacity = 0;
  claritySystem.add(pulse);

  satellites.push({ group, orb, orbit, indicator, label, final, start, curve, connector, pulse, offset: index * 0.19 });
});

// Three organized output currents embody the proprietary QEE framework.
const outputDefs = [
  { name: 'QUALITY', y: 1.2, z: 0.35, color: 0xbcefeb },
  { name: 'EFFICIENCY', y: 0, z: -0.1, color: 0x53dcd5 },
  { name: 'EFFECTIVENESS', y: -1.2, z: 0.28, color: 0x93e7e2 }
];
const outputs = [];
outputDefs.forEach((def, index) => {
  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(2.0, def.y * 0.28, def.z * 0.5),
    new THREE.Vector3(3.4, def.y * 0.58, def.z),
    new THREE.Vector3(5.1, def.y * 0.84, def.z * 0.85),
    new THREE.Vector3(7.1, def.y, def.z)
  ], false, 'centripetal', 0.5);
  const material = new THREE.MeshBasicMaterial({
    color: def.color,
    transparent: true,
    opacity: 0,
    toneMapped: false
  });
  const tube = new THREE.Mesh(new THREE.TubeGeometry(curve, 180, 0.02, 10, false), material);
  claritySystem.add(tube);
  const pulse = new THREE.Mesh(new THREE.SphereGeometry(0.055, 22, 16), index === 1 ? paleGlow.clone() : softGlow.clone());
  pulse.material.opacity = 0;
  claritySystem.add(pulse);
  const label = makeSprite(def.name, def.name.length > 9 ? 1.82 : 1.35, 0.28, {
    family: 'Arial', size: 50, weight: 600, color: '#d9f7f4', backdrop: 'rgba(4,16,18,.55)'
  });
  label.position.set(6.85, def.y - 0.33, def.z + 0.14);
  label.material.opacity = 0;
  claritySystem.add(label);
  outputs.push({ curve, tube, pulse, label, offset: index * 0.27 });
});

// Smooth circular pedestal and reflective shadow ground the system like a
// physical product shot rather than a floating UI illustration.
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(38, 24),
  new THREE.ShadowMaterial({ color: 0x000000, opacity: 0.38 })
);
floor.rotation.x = -Math.PI / 2;
floor.position.y = -3.66;
floor.receiveShadow = true;
scene.add(floor);

const pedestal = new THREE.Mesh(new THREE.CylinderGeometry(3.25, 3.65, 0.24, 160), darkMetal);
pedestal.position.set(0, -3.48, -0.75);
pedestal.scale.y = 0.28;
pedestal.receiveShadow = true;
pedestal.castShadow = true;
world.add(pedestal);
const pedestalRing = new THREE.Mesh(new THREE.TorusGeometry(2.95, 0.014, 8, 300), softGlow.clone());
pedestalRing.position.set(0, -3.36, -0.75);
pedestalRing.rotation.x = Math.PI / 2;
pedestalRing.material.opacity = 0.12;
world.add(pedestalRing);

const pointer = new THREE.Vector2();
const pointerTarget = new THREE.Vector2();
let scrollTarget = 0;
let scrollProgress = 0;
let currentScene = -1;
let pageVisible = true;

function clamp(value, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}
function smoothstep(edge0, edge1, value) {
  const t = clamp((value - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
}
function mix(a, b, t) {
  return a + (b - a) * t;
}
function lerpEuler(object, from, to, t) {
  object.rotation.x = mix(from.x, to.x, t);
  object.rotation.y = mix(from.y, to.y, t);
  object.rotation.z = mix(from.z, to.z, t);
}

const stateLabels = [
  'SIGNALS ENTERING',
  'CONTROLS ALIGNED',
  'INSIGHT VERIFIED',
  'PERFORMANCE ENABLED'
];
function updateCopy(sceneIndex) {
  if (currentScene === sceneIndex) return;
  currentScene = sceneIndex;
  copyBlocks.forEach((block, index) => block.classList.toggle('is-active', index === sceneIndex));
  meterItems.forEach((item, index) => item.classList.toggle('is-active', index === sceneIndex));
  systemState.textContent = stateLabels[sceneIndex];
}

function updateScroll() {
  const rect = experience.getBoundingClientRect();
  const max = experience.offsetHeight - window.innerHeight;
  scrollTarget = clamp(-rect.top / Math.max(max, 1));
}
window.addEventListener('scroll', updateScroll, { passive: true });
updateScroll();

function handlePointerMove(event) {
  pointerTarget.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointerTarget.y = -(event.clientY / window.innerHeight) * 2 + 1;
  if (cursor) cursor.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
  document.body.classList.add('pointer-ready');
}
window.addEventListener('pointermove', handlePointerMove, { passive: true });
stickyHero.addEventListener('pointerenter', () => document.body.classList.add('pointer-active'));
stickyHero.addEventListener('pointerleave', () => document.body.classList.remove('pointer-active'));
document.addEventListener('visibilitychange', () => { pageVisible = !document.hidden; });

function responsiveLayout() {
  const width = window.innerWidth;
  if (width < 560) {
    world.position.set(0.15, 2.12, -1.6);
    world.scale.setScalar(0.54);
    camera.fov = 43;
  } else if (width < 820) {
    world.position.set(0.55, 1.75, -1.15);
    world.scale.setScalar(0.66);
    camera.fov = 40;
  } else if (width < 1150) {
    world.position.set(2.15, 0.35, -0.35);
    world.scale.setScalar(0.82);
    camera.fov = 35;
  } else {
    world.position.set(2.15, 0.12, 0);
    world.scale.setScalar(1);
    camera.fov = 32;
  }
  camera.updateProjectionMatrix();
}
responsiveLayout();

window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6));
  composer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  responsiveLayout();
  updateScroll();
});

const clock = new THREE.Clock();
function animate() {
  requestAnimationFrame(animate);
  if (!pageVisible) return;

  const dt = Math.min(clock.getDelta(), 0.05);
  const time = clock.elapsedTime;
  scrollProgress += (scrollTarget - scrollProgress) * (reducedMotion ? 1 : 0.075);
  pointer.lerp(pointerTarget, 0.06);

  const sceneIndex = Math.min(3, Math.floor(scrollProgress * 4 + 0.04));
  updateCopy(sceneIndex);
  meterFill.style.height = `${scrollProgress * 100}%`;

  const reveal = smoothstep(0, 0.14, scrollProgress);
  const assurance = smoothstep(0.16, 0.43, scrollProgress);
  const insight = smoothstep(0.4, 0.72, scrollProgress);
  const performance = smoothstep(0.69, 0.98, scrollProgress);

  outerShell.material.opacity = mix(0.08, 0.34, reveal);
  outerShell.scale.setScalar(mix(0.68, 1, reveal));
  midShell.material.opacity = mix(0.04, 0.24, assurance);
  midShell.scale.setScalar(mix(0.45, 1, assurance));
  insightCore.scale.setScalar(mix(0.28, 1, insight));
  insightCore.material.emissiveIntensity = mix(0.18, 0.72, insight);
  insightCore.material.opacity = mix(0.44, 0.88, insight);
  coreHalo.scale.setScalar(mix(0.35, 1, insight));
  coreHalo.material.opacity = mix(0.02, 0.62, insight);
  qeeMark.material.opacity = mix(0, 0.98, insight);
  clarityLabel.material.opacity = mix(0, 0.78, insight);

  rings.forEach((ring, index) => {
    lerpEuler(ring, ring.userData.initialRotation, ring.userData.targetRotation, assurance);
    ring.rotation.z += (reducedMotion ? 0 : dt * (index % 2 ? -0.035 : 0.025)) * (1 - insight * 0.7);
    ring.material.opacity = mix(index === 0 ? 0.28 : 0.18, index === 0 ? 0.9 : 0.66, assurance);
    ring.scale.setScalar(mix(0.55 + index * 0.05, 1, reveal));
  });

  valueBands.forEach((band, index) => {
    band.rotation.z += reducedMotion ? 0 : dt * (index % 2 ? -0.045 : 0.035);
    band.rotation.y += reducedMotion ? 0 : dt * 0.012 * (index + 1);
    band.scale.setScalar(mix(0.35, 1, insight));
    band.material.opacity = mix(0.05, 0.74 - index * 0.1, insight);
  });
  valueLabels.forEach((label, index) => {
    label.material.opacity = mix(0, 0.84, performance) * (0.92 + Math.sin(time * 0.8 + index) * 0.08);
  });

  incoming.forEach((item, index) => {
    const entering = 0.18 + (index % 5) * 0.018;
    item.tube.material.opacity = entering * mix(1, 0.28, insight);
    const t = (time * (0.055 + (index % 4) * 0.006) + item.offset) % 1;
    item.pulse.position.copy(item.curve.getPointAt(t));
    item.pulse.material.opacity = mix(0.18, 0.78, reveal) * mix(1, 0.35, insight) * Math.sin(t * Math.PI);
    item.pulse.scale.setScalar(0.65 + Math.sin(t * Math.PI) * 0.65);
  });
  particles.material.opacity = mix(0.4, 0.09, insight);
  particles.rotation.y = reducedMotion ? 0 : Math.sin(time * 0.08) * 0.05;

  satellites.forEach((satellite, index) => {
    const local = smoothstep(0.02 + index * 0.055, 0.7 + index * 0.035, assurance);
    satellite.group.position.lerpVectors(satellite.start, satellite.final, local);
    satellite.group.scale.setScalar(mix(0.18, 1, local));
    satellite.group.visible = local > 0.01;
    satellite.group.rotation.y = mix(-0.9 + index * 0.14, 0.08 * Math.sin(time * 0.5 + index), local);
    satellite.group.rotation.x = mix(index % 2 ? 0.5 : -0.45, 0.03 * Math.cos(time * 0.42 + index), local);
    satellite.orbit.rotation.z += reducedMotion ? 0 : dt * (0.18 + index * 0.02) * (index % 2 ? -1 : 1);
    satellite.connector.material.opacity = mix(0, 0.28, local);
    satellite.label.material.opacity = mix(0, 0.86, local);
    satellite.orb.material.opacity = mix(0.05, 0.58, local);
    const t = (time * 0.08 + satellite.offset) % 1;
    satellite.pulse.position.copy(satellite.curve.getPointAt(t));
    satellite.pulse.material.opacity = mix(0, 0.72, local) * Math.sin(t * Math.PI);
    satellite.indicator.material.opacity = 0.42 + Math.sin(time * 1.4 + index) * 0.24;
  });

  outputs.forEach((output, index) => {
    output.tube.material.opacity = mix(0, index === 1 ? 0.72 : 0.5, performance);
    output.label.material.opacity = mix(0, 0.9, performance);
    const t = (time * 0.075 + output.offset) % 1;
    output.pulse.position.copy(output.curve.getPointAt(t));
    output.pulse.material.opacity = mix(0, 0.82, performance) * Math.sin(t * Math.PI);
    output.pulse.scale.setScalar(0.72 + Math.sin(t * Math.PI) * 0.72);
  });

  const floatY = reducedMotion ? 0 : Math.sin(time * 0.42) * 0.045;
  claritySystem.position.y = floatY;
  claritySystem.rotation.x = mix(0.18, -0.055, assurance) + (reducedMotion ? 0 : pointer.y * 0.045);
  claritySystem.rotation.y = mix(-0.58, 0.08, insight) + mix(0, 0.28, performance) + (reducedMotion ? 0 : pointer.x * 0.075);
  claritySystem.rotation.z = mix(-0.08, 0.01, reveal);
  claritySystem.scale.setScalar(mix(0.82, 1.04, performance));

  const desktop = window.innerWidth >= 820;
  const baseX = desktop ? mix(2.15, 1.05, performance) : world.position.x;
  if (desktop) world.position.x += (baseX - world.position.x) * 0.04;
  world.rotation.y += ((-0.22 + (reducedMotion ? 0 : pointer.x * 0.08)) - world.rotation.y) * 0.035;
  world.rotation.x += ((-0.07 + (reducedMotion ? 0 : pointer.y * 0.045)) - world.rotation.x) * 0.035;

  const cameraZ = mix(13.3, 11.3, performance);
  camera.position.z += (cameraZ - camera.position.z) * 0.035;
  camera.position.x += (((reducedMotion ? 0 : pointer.x * 0.2) + mix(0, 0.6, performance)) - camera.position.x) * 0.025;
  camera.position.y += (((reducedMotion ? 0.12 : 0.12 + pointer.y * 0.11) + mix(0, -0.05, performance)) - camera.position.y) * 0.025;
  camera.lookAt(mix(0.55, 1.05, performance), 0.03, -0.1);

  pointerLight.position.x += ((pointer.x * 5.7 + 1.4) - pointerLight.position.x) * 0.05;
  pointerLight.position.y += ((pointer.y * 3.9 + 1.1) - pointerLight.position.y) * 0.05;
  pedestalRing.material.opacity = 0.08 + assurance * 0.12;
  pedestalRing.rotation.z += reducedMotion ? 0 : dt * 0.012;

  composer.render();
  if (!hasPresentedFirstFrame) requestAnimationFrame(revealExperience);
}

updateCopy(0);
animate();
