import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import WebGL from "three/addons/capabilities/WebGL.js";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  50,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

const modal = document.querySelector("body");
modal.appendChild(renderer.domElement);

// Adicionando uma luz ambiente
let ambientLight = new THREE.AmbientLight(0xf5f5dc);
scene.add(ambientLight);

// Adicionando uma luz direcional
let directionalLight = new THREE.DirectionalLight(0xf5f5dc, 1);
directionalLight.position.set(1, 1, 1);
scene.add(directionalLight);

let skull;
const loader = new GLTFLoader();
loader.load(
  "https://liaser.s3.sa-east-1.amazonaws.com/praticas/cenario-saude/modelos-3d/visible_interactive_human_-_exploding_skull.glb",
  function (gltf) {
    const model = gltf.scene;
    scene.add(model);
    skull = new THREE.AnimationMixer(model);

    const clips = gltf.animations;
    clips.forEach(function (clip) {
      const action = skull.clipAction(clip);
      action.play();
    });
  },
  undefined,
  function (error) {
    console.error(error);
  }
);

camera.position.z = 30;

// Cor do fundo
scene.background = new THREE.Color(0x4f4f4f);
// Adicionando controles de órbita para interatividade
const controls = new OrbitControls(camera, renderer.domElement);

const clock = new THREE.Clock();
function animate() {
  requestAnimationFrame(animate);

  if (skull) skull.update(clock.getDelta());

  controls.update();

  renderer.render(scene, camera);
}

if (WebGL.isWebGLAvailable()) {
  // Initiate function or other initializations here
  animate();
} else {
  const warning = WebGL.getWebGLErrorMessage();
  document.getElementById("container").appendChild(warning);
}

console.log("Modelo three.js 0.0.1");
