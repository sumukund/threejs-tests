
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
// set up the scene
const scene = new THREE.Scene();
// set up the renderer
const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

// set up the field of view and camera
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 10 );
camera.position.z = 2;

renderer.render(scene, camera);
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.03;

const count = 1000;
const positions = new Float32Array(count * 3)

for (let i = 0; i < count; i++) {

  const i3 = i * 3

  positions[i3 + 0] = (Math.random() - 0.5) * 4

  positions[i3 + 1] = (Math.random() - 0.5) * 4

  positions[i3 + 2] = (Math.random() - 0.5) * 4

}

const geometry = new THREE.BufferGeometry()

geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

const material = new THREE.PointsMaterial({ color: 0x66ccff, size: 0.03, sizeAttenuation: true })

const points = new THREE.Points(geometry, material)


scene.add(points)


const hemiLight = new THREE.HemisphereLight(0x8F2F1D, 0x2484AE);
scene.add( hemiLight );

function animate(t = 0) {
  requestAnimationFrame(animate);
  points.rotation.y = t * 0.0001;
  renderer.render(scene, camera);
  controls.update();
}

renderer.setAnimationLoop(animate);