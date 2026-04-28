import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// --- Scene Setup ---
const container = document.getElementById('canvas-container');
const scene = new THREE.Scene();
// Set background to deep black explicitly
scene.background = new THREE.Color(0x050508);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
container.appendChild(renderer.domElement);

// --- Orbit Controls ---
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// --- Lighting ---
const ambientLight = new THREE.AmbientLight(0xffffff, 1.2); 
scene.add(ambientLight);

const hemisphereLight = new THREE.HemisphereLight(0xc084fc, 0x6366f1, 1.5);
scene.add(hemisphereLight);

const mainLight = new THREE.PointLight(0xffffff, 20, 30);
mainLight.position.set(5, 5, 8);
scene.add(mainLight);

const rimLight = new THREE.PointLight(0xc084fc, 15, 20);
rimLight.position.set(-5, 2, -5);
scene.add(rimLight);

const cameraLight = new THREE.PointLight(0xffffff, 5, 10);
camera.add(cameraLight);
scene.add(camera);

// --- Perfect Particle System ---
const particlesCount = 3000;
const positions = new Float32Array(particlesCount * 3);
const colors = new Float32Array(particlesCount * 3);

for(let i=0; i < particlesCount * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 25;
    const color = new THREE.Color();
    color.setHSL(Math.random() * 0.2 + 0.7, 0.8, 0.8); // Purple to blue hues
    colors[i*3] = color.r;
    colors[i*3+1] = color.g;
    colors[i*3+2] = color.b;
}

const particlesGeometry = new THREE.BufferGeometry();
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

const particlesMaterial = new THREE.PointsMaterial({
    size: 0.03,
    vertexColors: true,
    transparent: true,
    opacity: 0.6,
    blending: THREE.AdditiveBlending
});

const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particlesMesh);

// --- Nebula Clouds ---
const nebulaCount = 12;
const nebulas = [];
for(let i=0; i < nebulaCount; i++) {
    const geo = new THREE.IcosahedronGeometry(Math.random() * 4 + 2, 1);
    const mat = new THREE.MeshBasicMaterial({
        color: i % 2 === 0 ? 0xc084fc : 0x6366f1,
        transparent: true,
        opacity: 0.02,
        wireframe: false
    });
    const nebula = new THREE.Mesh(geo, mat);
    nebula.position.set(
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20
    );
    scene.add(nebula);
    nebulas.push(nebula);
}

// --- 3D Objects ---
const geometries = {
    torusKnot: new THREE.TorusKnotGeometry(1, 0.3, 128, 16),
    cube: new THREE.BoxGeometry(1.5, 1.5, 1.5),
    sphere: new THREE.SphereGeometry(1.2, 64, 64),
    dodecahedron: new THREE.DodecahedronGeometry(1.3)
};

const material = new THREE.MeshPhysicalMaterial({
    color: 0xc084fc,
    metalness: 0.4,
    roughness: 0.1,
    reflectivity: 1,
    clearcoat: 1.0,
    clearcoatRoughness: 0.05,
    emissive: 0xc084fc,
    emissiveIntensity: 0.3,
    ior: 2.5,
    thickness: 2.0
});

let mesh = new THREE.Mesh(geometries.torusKnot, material);
scene.add(mesh);

// --- State ---
const state = {
    rotationSpeed: 1,
    scale: 1,
};

// --- UI Elements ---
const rotXEl = document.getElementById('rot-x');
const rotYEl = document.getElementById('rot-y');
const rotZEl = document.getElementById('rot-z');
const speedSlider = document.getElementById('speed-slider');
const scaleSlider = document.getElementById('scale-slider');
const objectSelect = document.getElementById('object-select');
const colorPicker = document.getElementById('color-picker');
const lightPicker = document.getElementById('light-picker');
const resetBtn = document.getElementById('reset-btn');

// Set initial color picker value
colorPicker.value = '#8b5cf6';

// --- Event Listeners ---
objectSelect.addEventListener('change', (e) => {
    mesh.geometry.dispose();
    mesh.geometry = geometries[e.target.value];
});

colorPicker.addEventListener('input', (e) => {
    material.color.set(e.target.value);
    material.emissive.set(e.target.value);
});

lightPicker.addEventListener('input', (e) => {
    mainLight.color.set(e.target.value);
});

speedSlider.addEventListener('input', (e) => {
    state.rotationSpeed = parseFloat(e.target.value);
});

scaleSlider.addEventListener('input', (e) => {
    state.scale = parseFloat(e.target.value);
    mesh.scale.set(state.scale, state.scale, state.scale);
});

resetBtn.addEventListener('click', () => {
    mesh.rotation.set(0, 0, 0);
    state.rotationSpeed = 1;
    state.scale = 1;
    speedSlider.value = 1;
    scaleSlider.value = 1;
    mesh.scale.set(1, 1, 1);
    material.color.set(0x8b5cf6);
    material.emissive.set(0x8b5cf6);
    colorPicker.value = '#8b5cf6';
    mainLight.color.set(0xa78bfa);
    lightPicker.value = '#a78bfa';
});

// --- Handle Resize ---
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// --- Animation Loop ---
function animate() {
    requestAnimationFrame(animate);

    controls.update();

    // Auto-rotation (Core Transformation)
    mesh.rotation.x += 0.005 * state.rotationSpeed;
    mesh.rotation.y += 0.01 * state.rotationSpeed;

    // Pulse effect
    const pulse = (Math.sin(Date.now() * 0.002) + 1) / 2;
    material.emissiveIntensity = 0.2 + pulse * 0.5;

    // Particle subtle movement
    particlesMesh.rotation.y += 0.0005;

    // Nebula movement
    nebulas.forEach((nebula, i) => {
        nebula.rotation.x += 0.001;
        nebula.rotation.z += 0.001;
        nebula.position.y += Math.sin(Date.now() * 0.001 + i) * 0.002;
    });

    // Update UI Stats
    rotXEl.textContent = mesh.rotation.x.toFixed(2);
    rotYEl.textContent = mesh.rotation.y.toFixed(2);
    rotZEl.textContent = (mesh.rotation.z || 0).toFixed(2);

    renderer.render(scene, camera);
}

animate();
