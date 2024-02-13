import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import Stats from 'three/addons/libs/stats.module.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// Pour créer l’affichage en haut à droite
const container = document.getElementById('container');
const stats = new Stats();
container.appendChild(stats.dom);

const scene = new THREE.Scene();

scene.background = new THREE.CubeTextureLoader().setPath('./assets/').load(['posx.jpg', 'negx.jpg', 'posy.jpg', 'negy.jpg', 'posz.jpg', 'negz.jpg']);

const planeGeometry = new THREE.PlaneGeometry(25, 25, 32, 32);
const planeMaterial = new THREE.MeshStandardMaterial({ color: 0xffc0cb })
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.receiveShadow = true;
plane.rotation.set(Math.PI * -0.5, 0, 0);
scene.add(plane);

const loader = new GLTFLoader();

let model;

loader.load('./assets/Rocketship.glb', function (glb) {
  model = glb.scene;
  scene.add(model);

  model.traverse(function (node) {
    if (node.isMesh)
      node.castShadow = true;
  });


}, undefined, function (error) {

  console.error(error);

});


const light = new THREE.DirectionalLight(0xFFFFFF, 1);
light.position.set(50, 100, 10);
light.target.position.set(0, 0, 0);
light.castShadow = true;
scene.add(light);


light.shadow.bias = -0.001;
light.shadow.mapSize.width = 2048;
light.shadow.mapSize.height = 2048;
light.shadow.camera.near = 50;
light.shadow.camera.far = 150;
light.shadow.camera.left = 100;
light.shadow.camera.right = -100;
light.shadow.camera.top = 100;
light.shadow.camera.bottom = -100;




const helper = new THREE.CameraHelper(light.shadow.camera);
scene.add(helper);

// Camera
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight);
camera.position.set(0, 50, 0);
camera.up.set(0, 0, 1);
camera.lookAt(0, 0, 0);


// Renderer
const canvas = document.querySelector(".webgl");
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.render(scene, camera);


window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.render(scene, camera);
});

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
const loop = () => {

  controls.update();
  stats.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(loop);
  // Pour la mise à jour

}

loop();

let speed = 0;

const animation = () => {
    
    
    if (scene.children[3]!=undefined) {
        if (speed<10) {
            speed+=0.1;
            scene.children[3].position.y = speed;    
            
            window.requestAnimationFrame(animation);
        }
        else {
            scene.children[3].position.y =0;
        }

    }


    renderer.render(scene, camera);
}




const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

function onPointerClick( event ) {

	pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;


    window.requestAnimationFrame(render);

}


function render() {


	raycaster.setFromCamera( pointer, camera );

	const intersects = raycaster.intersectObjects( scene.children );

	for ( let i = 0; i < intersects.length; i ++ ) {
        
        if (intersects[i].object.castShadow==true) {
            scene.children[3].position.y = 0;
            speed = 0;
            animation();       
        }

	}

}

window.addEventListener( 'pointerdown', onPointerClick );