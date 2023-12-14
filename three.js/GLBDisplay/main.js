// =========================================================== import objects
import * as THREE from 'three';
import { Vector3 } from 'three';
import { OrbitControls } from 'https://threejs.org/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'https://threejs.org/examples/jsm/loaders/GLTFLoader.js';
import { RGBELoader } from 'https://threejs.org/examples/jsm/loaders/RGBELoader.js';
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

	// create camera
	let screenRatio = sceneWidth / sceneHeight;
	camera = new THREE.PerspectiveCamera(45, screenRatio, 0.01, 10000);
	camera.position.set(0, 0, 100);
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
	labelRenderer = new CSS2DRenderer();
	labelRenderer.setSize(sceneWidth, sceneHeight);
	labelRenderer.domElement.style.position = 'absolute';
	labelRenderer.domElement.style.top = '0px';
	document.getElementById('three').appendChild(labelRenderer.domElement);

	// font
	let loader = new TTFLoader();
	loader.load('fonts/segoepr.ttf', function (json) {
		labelFont = new Font(json);
	});

	// object loader
	objLoader = new GLTFLoader();

	// material of dimension mark and text
	dimMaterial = new THREE.MeshPhongMaterial({
		color: 'rgb(0,0,0)',
		flatShading: true,
		side: THREE.DoubleSide
	});

	// create controller
	// OrbitControls - 提供放大. 縮小, 平移, 旋轉功能
	controls = new OrbitControls(camera, labelRenderer.domElement);
	controls.enableDamping = true;
	controls.dampingFactor = 0.05;
	controls.screenSpacePanning = false;
	controls.minDistance = 10;
	controls.maxDistance = 3000;
}

// go render...
function animate() {

	controls.update();
	renderer.render(scene, camera);
	requestAnimationFrame(animate);
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
		createXZPlane();
		createDimension();

		//camera.position.set(10, 10, 10);
		camera.position.set(10, 10, -10);
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
	//camera.position.set(0, cameraPos, cameraPos);
	camera.position.set(0, 0, cameraPos);
	camera.lookAt(0, 0, 0);
}

function createDimension() {

	if (!glbObj.loaded) return;
	if (dimObj.length > 0) dimObj.forEach(d => scene.remove(d));
	dimObj = [];

	let textRatio = 0.15;
	let lineRatio = 0.015;

	let minDif = Math.min(
		Math.min(
			glbObj.maxDim.x - glbObj.minDim.x,
			glbObj.maxDim.y - glbObj.minDim.y),
		glbObj.maxDim.z - glbObj.minDim.z);

	let textSize = minDif * textRatio;
	let lineWidth = minDif * lineRatio;
	let markLength = textSize;

	// create X-Dimension
	let xDimGroup = createDimensionLine(
		false, lineWidth, markLength, textSize,
		glbObj.maxDim.x - glbObj.minDim.x,
		glbObj.minDim.x.toFixed(2),
		glbObj.maxDim.x.toFixed(2),
		(glbObj.maxDim.x - glbObj.minDim.x).toFixed(2));
	xDimGroup.rotateX(-Math.PI / 2);
	xDimGroup.position.set((glbObj.maxDim.x + glbObj.minDim.x) / 2, 0, 1.5 * glbObj.maxDim.z);
	dimObj.push(xDimGroup);
	scene.add(xDimGroup);

	// create Y-Dimension
	let yDimGroup = createDimensionLine(
		false, lineWidth, markLength, textSize,
		glbObj.maxDim.y - glbObj.minDim.y,
		glbObj.minDim.y.toFixed(2),
		glbObj.maxDim.y.toFixed(2),
		(glbObj.maxDim.x - glbObj.minDim.y).toFixed(2));
	yDimGroup.rotateZ(Math.PI / 2);
	yDimGroup.position.set(1.5 * glbObj.maxDim.x, (glbObj.maxDim.y + glbObj.minDim.y) / 2, 0);
	dimObj.push(yDimGroup);
	scene.add(yDimGroup);

	// create Z-Dimension
	let zDimGroup = createDimensionLine(
		true, lineWidth, markLength, textSize,
		glbObj.maxDim.z - glbObj.minDim.z,
		glbObj.minDim.z.toFixed(2),
		glbObj.maxDim.z.toFixed(2),
		(glbObj.maxDim.z - glbObj.minDim.z).toFixed(2));
	zDimGroup.rotateX(-Math.PI / 2);
	zDimGroup.rotateZ(Math.PI / 2);
	zDimGroup.position.set(-1.5 * glbObj.maxDim.x, 0, (glbObj.maxDim.z + glbObj.minDim.z) / 2);
	dimObj.push(zDimGroup);
	scene.add(zDimGroup);
}

function createDimensionLine(isZ, lineWidth, markLength, textSize, lineLength, minStr, maxStr, lenStr) {

	let lineGeo1 = new THREE.PlaneGeometry(lineWidth, markLength);
	let lineGeo2 = new THREE.PlaneGeometry(lineWidth, markLength);
	let lineGeo3 = new THREE.PlaneGeometry(lineLength, lineWidth);

	let line1 = new THREE.Mesh(lineGeo1, dimMaterial);
	let line2 = new THREE.Mesh(lineGeo2, dimMaterial);
	let line3 = new THREE.Mesh(lineGeo3, dimMaterial);
	line1.position.set(-lineLength / 2, 0, 0);
	line2.position.set(lineLength / 2, 0, 0);
	line3.position.set(0, 0, 0);

	let cirGeo1 = new THREE.CircleGeometry(lineWidth / 2, 8, 0, Math.PI);
	let cirGeo2 = new THREE.CircleGeometry(lineWidth / 2, 8, 0, Math.PI);
	let cirGeo3 = new THREE.CircleGeometry(lineWidth / 2, 8, Math.PI);
	let cirGeo4 = new THREE.CircleGeometry(lineWidth / 2, 8, Math.PI);
	let cir1 = new THREE.Mesh(cirGeo1, dimMaterial);
	let cir2 = new THREE.Mesh(cirGeo2, dimMaterial);
	let cir3 = new THREE.Mesh(cirGeo3, dimMaterial);
	let cir4 = new THREE.Mesh(cirGeo4, dimMaterial);
	cir1.position.set(-lineLength / 2, markLength / 2, 0);
	cir2.position.set(lineLength / 2, markLength / 2, 0);
	cir3.position.set(-lineLength / 2, -markLength / 2, 0);
	cir4.position.set(lineLength / 2, -markLength / 2, 0);

	let minTxt = createText(minStr, textSize);
	let maxTxt = createText(maxStr, textSize);
	let lenTxt = createText(lenStr, textSize);
	if (isZ) {
		minTxt.mesh.position.set(lineLength / 2 - minTxt.width / 2, markLength / 2 + 2 * minTxt.height, 0);
		maxTxt.mesh.position.set(-lineLength / 2 - minTxt.width / 2, markLength / 2 + 2 * minTxt.height, 0);
		lenTxt.mesh.position.set(-minTxt.width / 2, markLength / 2 + 2 * minTxt.height, 0);
	} else {
		minTxt.mesh.position.set(-lineLength / 2 - minTxt.width / 2, -markLength / 2 - 2 * minTxt.height, 0);
		maxTxt.mesh.position.set(lineLength / 2 - minTxt.width / 2, -markLength / 2 - 2 * minTxt.height, 0);
		lenTxt.mesh.position.set(-minTxt.width / 2, -markLength / 2 - 2 * minTxt.height, 0);
	}

	let group = new THREE.Group();
	group.add(line1);
	group.add(line2);
	group.add(line3);
	group.add(cir1);
	group.add(cir2);
	group.add(cir3);
	group.add(cir4);
	group.add(minTxt.mesh);
	group.add(maxTxt.mesh);
	group.add(lenTxt.mesh);

	return group;
}

function createText(txt, textSize) {

	let txtGeo = new TextGeometry(txt, {
		font: labelFont,
		size: textSize,
		height: 0,
		curveSegments: 1,
		bevelThickness: 0,
		bevelSize: 0,
		bevelEnabled: false
	});
	txtGeo.computeBoundingBox();
	txtGeo.computeVertexNormals();
	let width = txtGeo.boundingBox.max.x - txtGeo.boundingBox.min.x;
	let height = txtGeo.boundingBox.max.y - txtGeo.boundingBox.min.y;
	let txtMesh = new THREE.Mesh(txtGeo, dimMaterial);
	let txtObj = {
		mesh: txtMesh,
		width: width,
		height: height
	};
	return txtObj;
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