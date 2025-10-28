import * as THREE from "three";
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import spline from "./spline.js";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { SimplifyModifier } from 'three/addons/modifiers/SimplifyModifier.js';

const w = window.innerWidth;
const h = window.innerHeight;
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x000000, 0.3);
const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
camera.position.z = 5;
const renderer = new THREE.WebGLRenderer();
renderer.setSize(w, h);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.outputColorSpace = THREE.SRGBColorSpace;
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.03;

// post-processing
const renderScene = new RenderPass(scene, camera);
const bloomPass = new UnrealBloomPass(new THREE.Vector2(w, h), 1.5, 0.4, 100);
bloomPass.threshold = 0.002;
bloomPass.strength = 3.5;
bloomPass.radius = 0;
const composer = new EffectComposer(renderer);
composer.addPass(renderScene);
composer.addPass(bloomPass);

// create a line geometry from the spline
const points = spline.getPoints(100);
const geometry = new THREE.BufferGeometry().setFromPoints(points);
const material = new THREE.LineBasicMaterial({ color: 0xccff });
const line = new THREE.Line(geometry, material);
// scene.add(line);

// create a tube geometry from the spline
const tubeGeo = new THREE.TubeGeometry(spline, 222, 0.65, 16, true);

// create edges geometry from the spline
const edges = new THREE.EdgesGeometry(tubeGeo, 0.2);
const lineMat = new THREE.LineBasicMaterial({ color: 0xccff });
const tubeLines = new THREE.LineSegments(edges, lineMat);
scene.add(tubeLines);

const numBoxes = 10;
const loader = new GLTFLoader();
const modifier = new SimplifyModifier();

loader.load(
  "/static/ALIEN.glb",
  (glb) => {
    const alienModel = glb.scene;

    alienModel.traverse((child) => {
      if (child.isMesh && child.geometry) {
        const count = Math.floor(child.geometry.attributes.position.count * 0.3); // simplify more if needed
        child.geometry = modifier.modify(child.geometry, count);
        child.material.wireframe = false;
      }
    });

    const baseWithWire = alienModel.clone(true);
    baseWithWire.traverse((child) => {
      if (child.isMesh && child.geometry) {
        const edges = new THREE.EdgesGeometry(child.geometry);
        const color = new THREE.Color().setHSL(0.7, 1, 0.5);
        const lineMat = new THREE.LineBasicMaterial({ color });
        const wire = new THREE.LineSegments(edges, lineMat);
        wire.position.copy(child.position);
        wire.rotation.copy(child.rotation);
        wire.scale.copy(child.scale);
        child.add(wire);
      }
    });

    for (let i = 0; i < numBoxes; i++) {
      const alien = baseWithWire.clone(true);

      const p = (i / numBoxes + Math.random() * 0.1) % 1;
      const pos = tubeGeo.parameters.path.getPointAt(p);
      pos.x += Math.random() - 0.4;
      pos.z += Math.random() - 0.4;

      alien.position.copy(pos);

      const rot = new THREE.Vector3(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );
      alien.rotation.set(rot.x, rot.y, rot.z);
      alien.scale.set(0.1, 0.1, 0.1);

      scene.add(alien);
    }
  },
  (xhr) => console.log((xhr.loaded / xhr.total) * 100 + "% loaded"),
  (error) => console.error("An error happened:", error)
);

function updateCamera(t) {
  const time = t * 0.1;
  const looptime = 10 * 1000;
  const p = (time % looptime) / looptime;
  const pos = tubeGeo.parameters.path.getPointAt(p);
  const lookAt = tubeGeo.parameters.path.getPointAt((p + 0.03) % 1);
  camera.position.copy(pos);
  camera.lookAt(lookAt);
}

function animate(t = 0) {
  requestAnimationFrame(animate);
  updateCamera(t);
  composer.render(scene, camera);
  controls.update();
}
animate();

function handleWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', handleWindowResize, false);
