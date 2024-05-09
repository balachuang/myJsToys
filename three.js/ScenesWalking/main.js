// =========================================================== import objects
import * as THREE from 'three';
import { Vector3 } from 'three';
import { PointerLockControls } from 'https://threejs.org/examples/jsm/controls/PointerLockControls.js';
import { GLTFLoader } from 'https://threejs.org/examples/jsm/loaders/GLTFLoader.js';
import { OBJLoader } from 'https://threejs.org/examples/jsm/loaders/OBJLoader.js';

// =========================================================== 自訂變數
// object file name:
// EmptyHouse.glb, room.glb, xyz.glb, Scene.glb, basic.obj
let defaultObj = 'model/EmptyHouse.glb';

// =========================================================== Viewport
let sceneWidth = $('#three').width();
let sceneHeight = $('#three').height();

$('#three').width(sceneWidth);
$('.cols').height(sceneHeight);

// =========================================================== Viewer
let viewerName = '_ViewRef_';
let viewerHeight = 1.8;
let viewerPosX = 10;
let viewerPosZ = -10;

// =========================================================== Scene
let camera = null;
let scene = null;
let renderer = null;
let controls = null;
let glbObj = { objs: [], loaded: false };

// parameters for PointerLockControls
// let raycaster = null;
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


init3D();
animate();

document.getElementById('three').addEventListener('click', function(){ controls.lock(); });
document.addEventListener('keydown', onKeyDown);
document.addEventListener('keyup', onKeyUp);
document.addEventListener('wheel', onMouseWheel);

function init3D()
{
	scene = new THREE.Scene();
	scene.background = new THREE.Color("rgb(230, 230, 230)");

	// create camera
	let screenRatio = sceneWidth / sceneHeight;
	camera = new THREE.PerspectiveCamera(45, screenRatio, 0.01, 10000);
	// camera.position.copy(viewerPos);
	// camera.lookAt(viewerGaz);

	// create light and add to scene
	createEnvLights();

	// create scene renderer
	renderer = new THREE.WebGLRenderer({
		antialias: true
	});
	renderer.setSize(sceneWidth, sceneHeight);
	document.getElementById('three').appendChild(renderer.domElement);

	// create controller
	// PointerLockControls - 提供第一人稱運動
	controls = new PointerLockControls(camera, renderer.domElement);
	scene.add(controls.getObject());
	// controls.getObject().position.copy(viewerPos);
	// raycaster = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, - 1, 0), 0, 10);

	// load GLB objects to Scene
	load3DModel(defaultObj);

	// setup init viewpoint
	updateViewerPos();
}

// go render...
function animate()
{
	requestAnimationFrame(animate);

	// controls.update();
	updatePointerLockControls();

	renderer.render(scene, camera);
}

// https://github.com/mrdoob/three.js/blob/master/examples/misc_controls_pointerlock.html
function updatePointerLockControls()
{
	const time = performance.now();
	let delta = (time - prevTime) / 1000;

	// 設定 光追物件位置 = 控制物件位置
	// raycaster.ray.origin.copy(controls.getObject().position);

	// 借用 光追物件 找出所有物件距離遠近
	// 原始範例的目的是找出前方是否有方塊, 有的話就可以按空白, 讓 Control 往上一個方塊高.
	// 如果發現前方沒有方塊了, 就讓 Control 的 Y 軸回到原始值, 表示跳下方塊.
	// 這個先留著, 之後可以用來做碰撞測試.
	// let intersections = raycaster.intersectObjects(glbObj.objs, false); //--> intersections.length = 0 ??? why
	// let onObject = intersections.length > 0;
	// let distance = (intersections.length > 0) ? intersections[0].distinace : 9999;

	velocity.x -= velocity.x * 10 * delta;
	velocity.z -= velocity.z * 10 * delta;
	// velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass
	// velocity.y = defaultCamPos.y;
	// if (distance < 0.5) velocity.z = 0;

	direction.z = Number(moveFwd) - Number(moveBwd);
	direction.x = Number(moveRgt) - Number(moveLft);
	direction.normalize(); // this ensures consistent movements in all directions

	// if (moveFwd && (distance >= 0.5)) velocity.z -= direction.z * speed * delta;
	// if (moveBwd) velocity.z -= direction.z * speed * delta;
	if (moveFwd || moveBwd) velocity.z -= direction.z * speed * delta;
	if (moveLft || moveRgt) velocity.x -= direction.x * speed * delta;

	if (moveUp) controls.getObject().position.y += 0.1 * speed * delta;
	if (moveDn) controls.getObject().position.y -= 0.1 * speed * delta;

	// 前進方向有東西
	// if (onObject === true)
	// {
	// 	velocity.y = Math.max(0, velocity.y);
	// 	canJump = true;
	// }

	controls.moveRight(- velocity.x * delta);
	controls.moveForward(- velocity.z * delta);
	// controls.getObject().position.y += velocity.y;
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
function load3DModel(path)
{
	if (glbObj.loaded)
	{
		// remove all objects first
		// scene.remove(glbObj.obj);
		scene.clear();
		glbObj = { objs: [], loaded: false };
	}

	let isObj = path.toLowerCase().endsWith('.obj');

	let objLoader = isObj ? new OBJLoader() : new GLTFLoader();
	objLoader.load(path, function (gltf) {
		// remove viewer object from scene
		let obj = isObj ? gltf : gltf.scene;
		for (let n = 0; n < obj.children.length; ++n)
		{
			if (obj.children[n].name != viewerName) continue;

			// update viewpoint by reference object
			obj.children[n].geometry.computeBoundingBox();
			viewerHeight = obj.children[n].geometry.boundingBox.max.y;
			viewerPosX = obj.children[n].position.x;
			viewerPosZ = obj.children[n].position.z;
			updateViewerPos();

			// remove reference object
			obj.children.splice(n, 1);
			break;
		}

		glbObj.loaded = true;
		glbObj.objs.push(obj);
		scene.add(obj);
	}, undefined, function (error) {
		console.error(error);
	});
}

function createEnvLights()
{
	let ambientLight = new THREE.AmbientLight(new THREE.Color('rgb(255,255,255)'));
	scene.add(ambientLight);

	let l1 = new THREE.DirectionalLight(new THREE.Color('rgb(255,255,255)'));
	l1.position.set(100, 100, 100);
	l1.intensity = 1;
	scene.add(l1);

	let l2 = new THREE.DirectionalLight(new THREE.Color('rgb(255,255,255)'));
	l2.position.set(-100, 100, -100);
	l2.intensity = 0.5;
	scene.add(l2);

	let l3 = new THREE.DirectionalLight(new THREE.Color('rgb(255,255,255)'));
	l3.position.set(100, -100, -100);
	l3.intensity = 0.2;
	scene.add(l3);

	let l4 = new THREE.DirectionalLight(new THREE.Color('rgb(255,255,255)'));
	l4.position.set(-100, -100, 100);
	l4.intensity = 0.2;
	scene.add(l4);
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