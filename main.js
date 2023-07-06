import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import WebGL from "three/addons/capabilities/WebGL.js";
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

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
directionalLight.position.set(10, 100, 10);
scene.add(directionalLight);

var lightHelper = new THREE.DirectionalLightHelper(directionalLight, 1);
scene.add(lightHelper);

function createPanelSkull() {

  const gui = new GUI( { width: 310 } );

  const skullFolder = gui.addFolder('Crâneo')
  skullFolder.add(craneo.rotation, 'x', 0, Math.PI * 2);
  skullFolder.add(craneo.rotation, 'y', 0, Math.PI * 2);
  skullFolder.add(craneo.rotation, 'z', 0, Math.PI * 2);
  skullFolder.add(craneo.position, 'x', -50, Math.PI * 2);
  skullFolder.add(craneo.position, 'y', 0, Math.PI * 2);
  skullFolder.add(craneo.position, 'z', 0, Math.PI * 2);
}



let skull;
let craneo;
const loader = new GLTFLoader();
loader.load(
  "https://liaser.s3.sa-east-1.amazonaws.com/praticas/cenario-saude/modelos-3d/visible_interactive_human_-_exploding_skull.glb",
  function (gltf) {
    const model = gltf.scene;
    craneo = model;
    model.visible = true;
    model.position.x = -50;
    scene.add(model);
    
    createPanelSkull();
    
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

// const texture = new THREE.TextureLoader().load("./textures/images.jpeg");
const texture = new THREE.TextureLoader().load("./textures/eu.png");
texture.colorSpace = THREE.SRGBColorSpace;

const geometry = new THREE.SphereGeometry();
const material = new THREE.MeshBasicMaterial({ map: texture });

const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

const textureBilly = new THREE.TextureLoader().load("./textures/meulindo2.png");
textureBilly.colorSpace = THREE.SRGBColorSpace;
const materialBilly = new THREE.MeshBasicMaterial({ map: textureBilly });
const billy = new THREE.Mesh(geometry, materialBilly);
scene.add(billy);
billy.position.x = 20;

const textureAlex = new THREE.TextureLoader().load("./textures/meulindo.png");
textureAlex.colorSpace = THREE.SRGBColorSpace;
const materialAlex = new THREE.MeshBasicMaterial({ map: textureAlex });
const alex = new THREE.Mesh(geometry, materialAlex);
scene.add(alex);
alex.position.x = 40;

const textureAngelixa = new THREE.TextureLoader().load(
  "./textures/minhalinda3.png"
);
textureAngelixa.colorSpace = THREE.SRGBColorSpace;
const materialAngelica = new THREE.MeshBasicMaterial({ map: textureAngelixa });
const angelica = new THREE.Mesh(geometry, materialAngelica);
scene.add(angelica);
angelica.position.x = -20;

const textureAdilson = new THREE.TextureLoader().load("./textures/adilson.png");
textureAdilson.colorSpace = THREE.SRGBColorSpace;
const materialAdilson = new THREE.MeshBasicMaterial({ map: textureAdilson });
const adilson = new THREE.Mesh(geometry, materialAdilson);
scene.add(adilson);
adilson.position.y = 20;
adilson.position.x = 10;

let arrayPerson = [cube, billy, angelica, alex, adilson];
arrayPerson.forEach((el) => {
  el.scale.set(5, 5, 5);
  el.position.x += 50;
});

const createCubeWithTexture = () => {
  for (let i = 0; i < 2000; i++) {
    const geometry = new THREE.BoxGeometry();
    const object = new THREE.Mesh(
      geometry,
      new THREE.MeshLambertMaterial({ color: Math.random() * 0xffffff })
    );

    object.position.x = Math.random() * 40 - 20;
    object.position.y = Math.random() * 40 - 20;
    object.position.z = Math.random() * 40 - 20;

    object.rotation.x = Math.random() * 2 * Math.PI;
    object.rotation.y = Math.random() * 2 * Math.PI;
    object.rotation.z = Math.random() * 2 * Math.PI;

    object.scale.x = Math.random() + 0.5;
    object.scale.y = Math.random() + 0.5;
    object.scale.z = Math.random() + 0.5;

    scene.add(object);
  }
};
// createCubeWithTexture();

// setTimeout(()=>{
//   console.log(craneo)
//   createPanel()
// }, 10 * 1000)

camera.position.z = 30;

scene.background = new THREE.CubeTextureLoader()
  .setPath("textures/")
  .load(["px.jpg", "nx.jpg", "py.jpg", "ny.jpg", "pz.jpg", "nz.jpg"]);

// Adicionando controles de órbita para interatividade
const controls = new OrbitControls(camera, renderer.domElement);

// Controles por seta

let keydown;

window.onkeydown = function(e) {
  if(e.key === "ArrowUp") camera.position.z -= 1;
  if(e.key === "ArrowDown") camera.position.z += 1;
  if(e.key === "ArrowLeft") camera.position.x -= 1;
  if(e.key === "ArrowRight") camera.position.x += 1;
}



const clock = new THREE.Clock();
function animate() {
  requestAnimationFrame(animate);
  controls.update();

  if (skull) skull.update(clock.getDelta());

  arrayPerson.forEach((el) => {
    el.rotation.x += 0.01;
    el.rotation.y += 0.01;
    el.rotation.z += 0.01;
  });

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
