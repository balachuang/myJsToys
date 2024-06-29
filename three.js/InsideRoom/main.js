// =========================================================== import objects
import * as THREE from 'three';
//import { GUI } from 'https://threejs.org/examples/jsm/libs/lil-gui.module.min.js';
import { PointerLockControls } from 'https://threejs.org/examples/jsm/controls/PointerLockControls.js';
import { OrbitControls } from 'https://threejs.org/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'https://threejs.org/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'https://threejs.org/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'https://threejs.org/examples/jsm/postprocessing/ShaderPass.js';
import { UnrealBloomPass } from 'https://threejs.org/examples/jsm/postprocessing/UnrealBloomPass.js';

// =========================================================== 3D
// create 3d scene
let camera = null;
let scene = null;
let lightCnt = 10;
let lightRis = 5;
let lightDis = 15;
let lightMaterial = [];
let renderer = null;
let renderScene = null;
let bloomPass = null;
let bloomComposer = null;
let finalPass = null;
let finalComposer = null;
let controls = null;
let edir = [];

// variables for Controls
let raycaster = null;
let moveFwd = false;
let moveBwd = false;
let moveLft = false;
let moveRgt = false;
let moveUp = false;
let moveDn = false;
let prevTime = performance.now();
let velocity = new THREE.Vector3();
let direction = new THREE.Vector3();
let speed = 50.0;

let sceneWidth = window.innerWidth;
let sceneHeight = window.innerHeight;

init3D();
animate();

function init3D() {

	scene = new THREE.Scene();

	// create camera
	let screenRatio = sceneWidth / sceneHeight;
	camera = new THREE.PerspectiveCamera(45, screenRatio, 1, 500);
	camera.position.set(1, 1.8, 1);
	camera.lookAt(0,1.8,0);

	// create light and add to scene
	let ambientLight = new THREE.AmbientLight(new THREE.Color('rgb(100,100,100)'));
	scene.add(ambientLight);

	let plight = new THREE.PointLight(new THREE.Color('rgb(255,255,255)'), 10);
	plight.position.set(0, 3.3, 0);
	scene.add(plight);

	let mat = new THREE.MeshStandardMaterial({
		color: 'rgb(255,255,200)',
		shadowSide: THREE.DoubleSide,
		side: THREE.DoubleSide
	});

	// Create Object
	let geo = new THREE.BoxGeometry(10, 3.5, 20);
	let mesh = new THREE.Mesh(geo, mat);
	mesh.position.set(0, 1.75, 0);
	scene.add(mesh);

	// renderers for bloom effect
	renderer = new THREE.WebGLRenderer();
	renderer.setSize(sceneWidth, sceneHeight);
	document.body.appendChild(renderer.domElement);

	// create controller
	controls = new PointerLockControls(camera, renderer.domElement);
	raycaster = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, 0, -1), 0, 10);

	document.body.addEventListener('click', function(){ controls.lock(); });
	document.addEventListener('keydown', onKeyDown);
	document.addEventListener('keyup', onKeyUp);
	document.addEventListener('wheel', onMouseWheel);
}

// go render...
function animate()
{
	requestAnimationFrame(animate);
	updatePointerLockControls();
	renderer.render(scene, camera);
}

function updatePointerLockControls()
{
	const time = performance.now();
	let delta = (time - prevTime) / 1000;

	raycaster.ray.origin.copy(controls.getObject().position);
	let intersections = raycaster.intersectObjects(scene.children, false);
	let distance = (intersections.length > 0) ? intersections[0].distance : 9999;

	velocity.x -= velocity.x * 10 * delta;
	velocity.z -= velocity.z * 10 * delta;

	direction.z = Number(moveFwd) - Number(moveBwd);
	direction.x = Number(moveRgt) - Number(moveLft);
	direction.normalize(); // this ensures consistent movements in all directions

	if (moveFwd || moveBwd) velocity.z -= direction.z * speed * delta;
	if (moveLft || moveRgt) velocity.x -= direction.x * speed * delta;

	// this is workable, need to try propreate config.
	// if (distance < 1.0) velocity.z = 0;
	// console.log('dist: ' + distance + ', vol: ' + velocity.z);

	if (moveUp) controls.getObject().position.y += 0.1 * speed * delta;
	if (moveDn) controls.getObject().position.y -= 0.1 * speed * delta;

	controls.moveRight(- velocity.x * delta);
	controls.moveForward(- velocity.z * delta);

	prevTime = time;
}

function updateViewerPos()
{
	camera.position.set(viewerPosX, viewerHeight, viewerPosZ);
	camera.lookAt(0, viewerHeight, 0);
	controls.getObject().position.set(viewerPosX, viewerHeight, viewerPosZ);
}

// keyboard event handlers
// find keycode: https://www.toptal.com/developers/keycode
function onKeyDown(event)
{
	switch (event.code)
	{
		case 'ArrowUp':
		case 'KeyW':
			moveFwd = true;
			break;
		case 'ArrowLeft':
		case 'KeyA':
			moveLft = true;
			break;
		case 'ArrowDown':
		case 'KeyS':
			moveBwd = true;
			break;
		case 'ArrowRight':
		case 'KeyD':
			moveRgt = true;
			break;
		case 'PageUp':
		case 'KeyE':
			moveUp = true;
			break;
		case 'PageDown':
		case 'KeyQ':
			moveDn = true;
			break;
	}
};

function onKeyUp(event)
{
	switch (event.code)
	{
		case 'ArrowUp':
		case 'KeyW':
			moveFwd = false;
			break;
		case 'ArrowLeft':
		case 'KeyA':
			moveLft = false;
			break;
		case 'ArrowDown':
		case 'KeyS':
			moveBwd = false;
			break;
		case 'ArrowRight':
		case 'KeyD':
			moveRgt = false;
			break;
		case 'PageUp':
		case 'KeyE':
			moveUp = false;
			break;
		case 'PageDown':
		case 'KeyQ':
			moveDn = false;
			break;
	}
};

function onMouseWheel(event)
{
	const delta = Math.sign(event.deltaY);
	speed *= (delta > 0) ? 0.8 : 1.2;
}