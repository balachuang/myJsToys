// TO-DO
// 1. add Name in Blender and set camera positon by reference obj
// 2. add lights in Blender and set if lights can be loaded
// 3. add controls for speed-up / down

// =========================================================== import objects
import * as THREE from 'three';
import { PointerLockControls } from 'https://threejs.org/examples/jsm/controls/PointerLockControls.js';
import { GLTFLoader } from 'https://threejs.org/examples/jsm/loaders/GLTFLoader.js';
import { CSS2DRenderer, CSS2DObject } from 'https://threejs.org/examples/jsm/renderers/CSS2DRenderer.js';
import { Font } from 'https://threejs.org/examples/jsm/loaders/FontLoader.js';
import { TTFLoader } from 'https://threejs.org/examples/jsm/loaders/TTFLoader.js';

// =========================================================== Calculate High
let sceneWidth = $('#view-area').width();
let sceneHeight = $('#view-area').height();

// =========================================================== 3D
const defaultCamPos = new THREE.Vector3(15, 1.8, 15);
const defaultCamGaz = new THREE.Vector3(0, 0, 0);

// used by PointerLockControls
let objects = [];
let velocity = new THREE.Vector3();
let direction = new THREE.Vector3();
let speed = 50.0;

let camera = null;
let scene = null;
let renderer = null;
let controls = null;
let objLoader = null;
let glbObj = { loaded: false };
let clock = null;

let raycaster = null;
let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let canJump = false;

let prevTime = performance.now();


init3D();
animate();

function init3D() {

	clock = new THREE.Clock();

	scene = new THREE.Scene();
	scene.background = new THREE.Color("rgb(255, 255, 255)");

	// create camera
	let screenRatio = sceneWidth / sceneHeight;
	camera = new THREE.PerspectiveCamera(45, screenRatio, 0.01, 10000);
	camera.position.copy(defaultCamPos);
	camera.lookAt(defaultCamGaz);

	// create light and add to scene
	createEnvLights();

	// create scene renderer
	renderer = new THREE.WebGLRenderer({
		antialias: true
	});
	renderer.setSize(sceneWidth, sceneHeight);
	document.getElementById('view-area').appendChild(renderer.domElement);

	// object loader
	objLoader = new GLTFLoader();

	// create controller
	controls = new PointerLockControls(camera, renderer.domElement);
	controls.getObject().position.copy(defaultCamPos);
	scene.add(controls.getObject());
	raycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, - 1, 0 ), 0, 10 );

	document.getElementById('view-area').addEventListener( 'click', function(){ controls.lock(); } );
	document.addEventListener( 'resize', onWindowResize );
	document.addEventListener( 'keydown', onKeyDown );
	document.addEventListener( 'keyup', onKeyUp );

	loadGLB('model/emptyHouse.glb');
	// createTestObj();
}

function onWindowResize()
{
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
	controls.handleResize();
}

// go render...
function animate()
{
	requestAnimationFrame(animate);
	updatePointerLockControls();
	renderer.render(scene, camera);
}

// https://github.com/mrdoob/three.js/blob/master/examples/misc_controls_pointerlock.html
function updatePointerLockControls()
{
	const time = performance.now();

	// 設定 光追物件位置 = 控制物件位置
	raycaster.ray.origin.copy(controls.getObject().position);
	// raycaster.ray.origin.y = -10;

	// 借用 光追物件 找出所有物件距離遠近
	// 原始範例的目的是找出前方是否有方塊, 有的話就可以按空白, 讓 Control 往上一個方塊高.
	// 如果發現前方沒有方塊了, 就讓 Control 的 Y 軸回到原始值, 表示跳下方塊.
	let intersections = raycaster.intersectObjects(objects, false); //--> intersections.length = 0 ??? why
	// let onObject = intersections.length > 0;
	let delta = (time - prevTime) / 1000;
	let distance = (intersections.length > 0) ? intersections[0].distinace : 9999;

	velocity.x -= velocity.x * 10 * delta;
	velocity.z -= velocity.z * 10 * delta;
	// velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass
	// velocity.y = defaultCamPos.y;

	// if (distance < 0.5) velocity.z = 0;

	direction.z = Number(moveForward) - Number(moveBackward);
	direction.x = Number(moveRight) - Number(moveLeft);
	direction.normalize(); // this ensures consistent movements in all directions

	// if (moveForward && (distance >= 0.5)) velocity.z -= direction.z * speed * delta;
	// if (moveBackward) velocity.z -= direction.z * speed * delta;
	if (moveForward || moveBackward) velocity.z -= direction.z * speed * delta;
	if (moveLeft    || moveRight)    velocity.x -= direction.x * speed * delta;

	// 前進方向有東西
	// if (onObject === true)
	// {
	// 	velocity.y = Math.max(0, velocity.y);
	// 	canJump = true;
	// }

	controls.moveRight(- velocity.x * delta);
	controls.moveForward(- velocity.z * delta);
	// controls.getObject().position.y += (velocity.y * delta); // new behavior: 跳

	// if (controls.getObject().position.y < 10)
	// {
	// 	velocity.y = 0;
	// 	controls.getObject().position.y = 10;
	// 	canJump = true;
	// }

	prevTime = time;
}

// generate rock by loading model
function loadGLB(path)
{
	// remove all objects first
	if (glbObj.loaded) scene.remove(glbObj.obj);
	glbObj = { loaded: false };

	objLoader.load(path, function (gltf) {

		let obj = gltf.scene;

		// recalculate size
		let maxDim = { x: -1, y: -1, z: -1 };
		let minDim = { x: -1, y: -1, z: -1 };
		for (let n = 0; n < obj.children.length; ++n) {
			console.log('new object got: ' + obj.children[n].name);
			if (obj.children[n].geometry) {
				obj.children[n].geometry.computeBoundingBox();
				maxDim.x = Math.max(maxDim.x, obj.children[n].geometry.boundingBox.max.x);
				maxDim.y = Math.max(maxDim.y, obj.children[n].geometry.boundingBox.max.y);
				maxDim.z = Math.max(maxDim.z, obj.children[n].geometry.boundingBox.max.z);
				minDim.x = Math.min(minDim.x, obj.children[n].geometry.boundingBox.min.x);
				minDim.y = Math.min(minDim.y, obj.children[n].geometry.boundingBox.min.y);
				minDim.z = Math.min(minDim.z, obj.children[n].geometry.boundingBox.min.z);
			}
		}
		obj.position.set(0, 0, 0);
		glbObj = {
			loaded: true,
			obj: obj,
			minDim: minDim,
			maxDim: maxDim
		}
		scene.add(obj);
		objects.push(obj);

		camera.position.copy(defaultCamPos);
		camera.lookAt(defaultCamGaz);
	}, undefined, function (error) {
		console.log(error);
	});
}

function createTestObj()
{
	let testMat = new THREE.MeshStandardMaterial({color: 0xFCF3E9});
	let testGeo = new THREE.BoxGeometry(1, 3, 1);
	let testObj = new THREE.Mesh(testGeo, testMat);
	testObj.position.set(0, 1, 0);
	scene.add(testObj);
	objects.push(testObj);

	let floorMat = new THREE.MeshStandardMaterial({color: 0xFFFFFF});
	let floorGeo = new THREE.PlaneGeometry(30, 30);
	let floorObj = new THREE.Mesh(floorGeo, floorMat);
	floorObj.position.set(0,0,0);
	floorObj.rotateX(-Math.PI / 2);
	scene.add(floorObj);


	// for (var i=0; i<20; ++i)
	// {
	// 	let testGeo = new THREE.BoxGeometry(0.1 * (20-i), 0.1, 0.1 * (20-i));
	// 	let testObj = new THREE.Mesh(testGeo, testMat);
	// 	testObj.position.set(0, i, 0);
	// 	scene.add(testObj);
	// 	objects.push(testObj);
	// }

	camera.position.copy(defaultCamPos);
	camera.lookAt(defaultCamGaz);
}

function createEnvLights()
{
	let ambientLight = new THREE.AmbientLight(new THREE.Color('rgb(120,120,120)'));
	ambientLight.intensity = 1;
	scene.add(ambientLight);

	let l1 = new THREE.SpotLight(0xFFFFFF);
	l1.position.set(10, 30, 20);
	l1.castShadow = true;
	l1.intensity = 500;
	l1.shadow.camera.near = 10;
	l1.shadow.camera.far = 100;
	l1.shadow.camera.fov = 30;
	scene.add(l1);

	// let l1 = new THREE.DirectionalLight(new THREE.Color('rgb(255,255,255)'));
	// l1.position.set(10, 10, 10);
	// l1.intensity = 1;
	// scene.add(l1);

	// let l2 = new THREE.DirectionalLight(new THREE.Color('rgb(255,255,255)'));
	// l2.position.set(-100, 100, -100);
	// l2.intensity = 0.5;
	// scene.add(l2);

	// let l3 = new THREE.DirectionalLight(new THREE.Color('rgb(255,255,255)'));
	// l3.position.set(100, -100, -100);
	// l3.intensity = 0.2;
	// scene.add(l3);

	// let l4 = new THREE.DirectionalLight(new THREE.Color('rgb(255,255,255)'));
	// l4.position.set(-100, -100, 100);
	// l4.intensity = 0.2;
	// scene.add(l4);
}

// keyboard event handlers
function onKeyDown(event)
{
	switch (event.code)
	{
		case 'ArrowUp':
		case 'KeyW':
			moveForward = true;
			break;
		case 'ArrowLeft':
		case 'KeyA':
			moveLeft = true;
			break;
		case 'ArrowDown':
		case 'KeyS':
			moveBackward = true;
			break;
		case 'ArrowRight':
		case 'KeyD':
			moveRight = true;
			break;
		// case 'Space':
		// 	if (canJump === true) velocity.y += 350;
		// 	canJump = false;
		// 	break;
	}
};

function onKeyUp(event)
{
	switch (event.code)
	{
		case 'ArrowUp':
		case 'KeyW':
			moveForward = false;
			break;
		case 'ArrowLeft':
		case 'KeyA':
			moveLeft = false;
			break;
		case 'ArrowDown':
		case 'KeyS':
			moveBackward = false;
			break;
		case 'ArrowRight':
		case 'KeyD':
			moveRight = false;
			break;
	}
};
