import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// --- Scene Setup ---
const container = document.getElementById('canvas-container');
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
container.appendChild(renderer.domElement);

// --- Orbit Controls ---
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.enableZoom = true;

// --- Lighting ---
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambientLight);

const mainLight = new THREE.PointLight(0x7c3aed, 2, 20);
mainLight.position.set(5, 5, 5);
scene.add(mainLight);

const secondLight = new THREE.PointLight(0x3b82f6, 2, 20);
secondLight.position.set(-5, -5, 5);
scene.add(secondLight);

// --- Particle Background ---
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 2000;
const posArray = new Float32Array(particlesCount * 3);

for(let i=0; i < particlesCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 15;
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
const particlesMaterial = new THREE.PointsMaterial({
    size: 0.005,
    color: 0x7c3aed,
    transparent: true,
    opacity: 0.5
});

const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particlesMesh);

// --- 3D Objects ---
const geometries = {
    torusKnot: new THREE.TorusKnotGeometry(1, 0.3, 128, 16),
    cube: new THREE.BoxGeometry(1.5, 1.5, 1.5),
    sphere: new THREE.SphereGeometry(1.2, 64, 64),
    dodecahedron: new THREE.DodecahedronGeometry(1.3)
};

const material = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    metalness: 0.9,
    roughness: 0.1,
    reflectivity: 1,
    clearcoat: 1,
    clearcoatRoughness: 0.1
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
    particlesMesh.rotation.y += 0.001;

    // Update UI Stats
    rotXEl.textContent = mesh.rotation.x.toFixed(2);
    rotYEl.textContent = mesh.rotation.y.toFixed(2);
    rotZEl.textContent = (mesh.rotation.z || 0).toFixed(2);

    renderer.render(scene, camera);
}

animate();
