import * as THREE from 'three';

// --- Scene Setup ---
const container = document.getElementById('canvas-container');
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
container.appendChild(renderer.domElement);

// --- Lighting ---
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0x6366f1, 2);
pointLight.position.set(5, 5, 5);
scene.add(pointLight);

const pointLight2 = new THREE.PointLight(0xa855f7, 2);
pointLight2.position.set(-5, -5, 5);
scene.add(pointLight2);

// --- 3D Object (Torus Knot) ---
const geometry = new THREE.TorusKnotGeometry(1, 0.3, 128, 16);
const material = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.1,
    metalness: 0.8,
});
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// --- Transformation State ---
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
const resetBtn = document.getElementById('reset-btn');

// --- Event Listeners ---
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

    // Apply Transformation: Rotation
    // This is the core 3D transformation being demonstrated
    mesh.rotation.x += 0.01 * state.rotationSpeed;
    mesh.rotation.y += 0.015 * state.rotationSpeed;
    mesh.rotation.z += 0.005 * state.rotationSpeed;

    // Update UI Stats
    rotXEl.textContent = mesh.rotation.x.toFixed(2);
    rotYEl.textContent = mesh.rotation.y.toFixed(2);
    rotZEl.textContent = mesh.rotation.z.toFixed(2);

    renderer.render(scene, camera);
}

animate();
