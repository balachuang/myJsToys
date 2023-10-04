// =========================================================== import objects
import * as THREE from 'three';
import { Vector3 } from 'three';
import { PointerLockControls } from 'https://threejs.org/examples/jsm/controls/PointerLockControls.js';
import { GLTFLoader } from 'https://threejs.org/examples/jsm/loaders/GLTFLoader.js';
// import { RGBELoader } from 'https://threejs.org/examples/jsm/loaders/RGBELoader.js';
import { CSS2DRenderer, CSS2DObject } from 'https://threejs.org/examples/jsm/renderers/CSS2DRenderer.js';
import { Font } from 'https://threejs.org/examples/jsm/loaders/FontLoader.js';
import { TTFLoader } from 'https://threejs.org/examples/jsm/loaders/TTFLoader.js';
import { TextGeometry } from 'https://threejs.org/examples/jsm/geometries/TextGeometry.js';

// =========================================================== Calculate High
let sceneWidth = window.innerWidth - 255;
let sceneHeight = window.innerHeight - 45;

$('#three').width(sceneWidth);
$('.cols').height(sceneHeight);

let fonts = [
	'https://threejs.org/examples/fonts/helvetiker_normal.typeface.json',
	'https://threejs.org/examples/fonts/optimer_normal.typeface.json',
	'https://threejs.org/examples/fonts/gentilis_normal.typeface.json',
	'https://threejs.org/examples/fonts/droid/droid_sans_normal.typeface.json',
	'https://threejs.org/examples/fonts/droid/droid_serif_normal.typeface.json'
];

// =========================================================== 3D
let camera = null;
let scene = null;
let renderer = null;
let material = null;
let dimMaterial = null;
let controls = null;
let labelRenderer = null;
let labelFont = null;
let objLoader = null;
let glbObj = { loaded: false };
let dimObj = [];
let clock = null;

// helper parameters
let xzPlane = null;
let xzSize = 10;
let xzColor1 = 'rgb(170,170,255)';
let xzColor2 = 'rgb(230,230,230)';

init3D();
animate();

// register click handler
$('#glb-selector').click();
$('.glb-object').click(function () {
	let path = $(this).attr('path');
	loadGLB(path);
});

function init3D() {

	scene = new THREE.Scene();
	scene.background = new THREE.Color("rgb(255, 255, 255)");

	clock = new THREE.Clock();

	// create camera
	let screenRatio = sceneWidth / sceneHeight;
	camera = new THREE.PerspectiveCamera(45, screenRatio, 0.01, 10000);
	camera.position.set(100, 100, 100);
	camera.lookAt(0, 0, 0);

	// create X-Z plane
	createXZPlane();

	// create light and add to scene
	createEnvLights();

	// create scene renderer
	renderer = new THREE.WebGLRenderer({
		antialias: true
	});
	renderer.setSize(sceneWidth, sceneHeight);
	document.getElementById('three').appendChild(renderer.domElement);

	// create lable renderer - prepare for axis lable
	// labelRenderer = new CSS2DRenderer();
	// labelRenderer.setSize(sceneWidth, sceneHeight);
	// labelRenderer.domElement.style.position = 'absolute';
	// labelRenderer.domElement.style.top = '0px';
	// document.getElementById('three').appendChild(labelRenderer.domElement);

	// font
	// let loader = new TTFLoader();
	// loader.load('fonts/segoepr.ttf', function (json) {
	// 	labelFont = new Font(json);
	// });

	// object loader
	objLoader = new GLTFLoader();

	// material of dimension mark and text
	dimMaterial = new THREE.MeshPhongMaterial({
		color: 'rgb(0,0,0)',
		flatShading: true,
		side: THREE.DoubleSide
	});

	// create controller
	// FirstPersonControls - 提供第一人稱運動
	controls = new PointerLockControls(camera, renderer.domElement);
	controls.autoForward = false;
	controls.noFly = true;
	controls.movementSpeed = 10;
	controls.lookSpeed = 0.1;

	//
	loadGLB('model/xyz_100.glb');
}

// go render...
function animate() {
	controls.update(clock.getDelta());
	renderer.render(scene, camera);
	requestAnimationFrame(animate);
}

function render() {
	controls.update(clock.getDelta());
	renderer.render(scene, camera);
}

// generate rock by loading model
function loadGLB(path) {
	if (glbObj.loaded) {
		// remove all objects first
		//for (let n = 0; n < glbObj.length; ++n) scene.remove(glbObj[n]);
		scene.remove(glbObj.obj);
		glbObj = { loaded: false };
	}

	objLoader.load(path, function (gltf) {
		// load rock
		let obj = gltf.scene;

		// recalculate size
		let maxDim = { x: -1, y: -1, z: -1 };
		let minDim = { x: -1, y: -1, z: -1 };
		for (let n = 0; n < obj.children.length; ++n) {
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

		xzSize = Math.max(Math.max(maxDim.x - minDim.x, maxDim.y - minDim.y), maxDim.z - minDim.z);
		//createXZPlane();

		camera.position.set(100, 100, 100);
		camera.lookAt(0, 0, 0);
	}, undefined, function (error) {
		console.error(error);
	});
}

function createXZPlane() {

	if (xzPlane !== null) scene.remove(xzPlane);

	// calculate size
	xzSize = 10 * Math.round(xzSize * 2.0 / 10);
	let div = Math.round(xzSize / 10);
	div = div + (div % 2);
	if (div < 10) div = 10;

	// add plane
	xzPlane = new THREE.GridHelper(xzSize, div, xzColor1, xzColor2);
	scene.add(xzPlane);

	// modify camera position according to the plane size
	let cameraPos = xzSize / 2;
	camera.position.set(0, cameraPos, cameraPos);
	camera.lookAt(0, 0, 0);
}

function createEnvLights() {
	let ambientLight = new THREE.AmbientLight(new THREE.Color('rgb(120,120,120)'));
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