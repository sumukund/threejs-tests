import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
// set up the scene
const scene = new THREE.Scene();
// set up the renderer
const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setAnimationLoop( animate );
document.body.appendChild( renderer.domElement );

// set up the field of view and camera
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 10 );
camera.position.z = 2;

renderer.render(scene, camera);
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.03;

const geometry = new THREE.IcosahedronGeometry( 1.0, 3 );
const material = new THREE.MeshStandardMaterial( { color: 0xffffff, flatShading: true } );
const mesh = new THREE.Mesh( geometry, material );
scene.add( mesh );

const wireMat = new THREE.MeshBasicMaterial({color: 0xffffff, wireframe: true});
const wireMesh = new THREE.Mesh(geometry, wireMat);
wireMesh.scale.setScalar(1.001)
scene.add(wireMesh);
mesh.add( wireMesh);

const hemiLight = new THREE.HemisphereLight(0x8F2F1D, 0x2484AE);
scene.add( hemiLight );

function animate(t = 0) {
  requestAnimationFrame(animate);
  mesh.rotation.y = t * 0.0001;
  renderer.render(scene, camera);
  controls.update();
}
animate();
