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
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8); // Much brighter ambient light
scene.add(ambientLight);

const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1.0);
scene.add(hemisphereLight);

const mainLight = new THREE.PointLight(0xa78bfa, 10, 25); // Increased intensity
mainLight.position.set(5, 5, 5);
scene.add(mainLight);

const secondaryLight = new THREE.PointLight(0xf472b6, 10, 25); // Increased intensity
secondaryLight.position.set(-5, -5, 5);
scene.add(secondaryLight);

const cameraLight = new THREE.PointLight(0xffffff, 5, 15);
camera.add(cameraLight); // Light moves with camera
scene.add(camera);

// --- Crazy Particle System ---
const particlesCount = 4000;
const positions = new Float32Array(particlesCount * 3);
const colors = new Float32Array(particlesCount * 3);

for(let i=0; i < particlesCount * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 20;
    colors[i] = Math.random();
}

const particlesGeometry = new THREE.BufferGeometry();
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

const particlesMaterial = new THREE.PointsMaterial({
    size: 0.02,
    vertexColors: true,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending
});

const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particlesMesh);

// --- Floating Nebula Spheres ---
const nebulaCount = 8; // More nebulas
const nebulas = [];
for(let i=0; i < nebulaCount; i++) {
    const geo = new THREE.SphereGeometry(Math.random() * 3 + 1, 32, 32);
    const mat = new THREE.MeshBasicMaterial({
        color: i % 2 === 0 ? 0xa78bfa : 0xf472b6,
        transparent: true,
        opacity: 0.04, // Slightly more visible
    });
    const nebula = new THREE.Mesh(geo, mat);
    nebula.position.set(
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 15
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
    color: 0xffffff,
    metalness: 0.7, // Lowered metalness to catch more direct light
    roughness: 0.2, // Increased roughness for better scattering
    reflectivity: 1,
    clearcoat: 1.0,
    clearcoatRoughness: 0.1,
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

// --- Event Listeners ---
objectSelect.addEventListener('change', (e) => {
    mesh.geometry.dispose();
    mesh.geometry = geometries[e.target.value];
});

colorPicker.addEventListener('input', (e) => {
    material.color.set(e.target.value);
});

lightPicker.addEventListener('input', (e) => {
    mainLight.color.set(e.target.value);
    particlesMaterial.color.set(e.target.value);
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
    material.color.set(0xffffff);
    colorPicker.value = '#ffffff';
    mainLight.color.set(0x7c3aed);
    lightPicker.value = '#7c3aed';
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
