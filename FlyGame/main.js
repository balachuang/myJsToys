// =========================================================== import objects
import * as THREE from 'three';
import { OrbitControls } from 'https://threejs.org/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'https://threejs.org/examples/jsm/loaders/GLTFLoader.js';
import { RGBELoader } from 'https://threejs.org/examples/jsm/loaders/RGBELoader.js';
import { Vector3 } from 'three';

// =========================================================== 3D
// basic parameters
let sceneWidth = window.innerWidth;
let sceneHeight = window.innerHeight;
let rockObjs = [];
let minGenCnt = 3;
let maxGenCnt = 5;
let generatedRocks = 0;
let passRocks = 0;
let totalRocks = 500;
let speed = 10;
let minSize = 5;
let maxSize = 10;
let genInterval = 100;
let controls = null;

// create 3d scene
let camera = null;
let scene = null;
let renderer = null;
let rockMaterials = [];
//let rockModels = [];
let rockLoader = null;

let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let moveLength = 3;

let start = false;
let enableOrbitControl = false;


init3D();
animate();
generateRock();

function init3D() {

	scene = new THREE.Scene();

	if (enableOrbitControl) {
		// set background by HDRI image
		new RGBELoader()
			.setPath('img/')
			.load('mars.hdr', function (texture) {
				texture.mapping = THREE.EquirectangularReflectionMapping;
				scene.background = texture;
				scene.environment = texture;
			});
	} else {
		// set background by JPG image
		let bgTexture = new THREE.TextureLoader().load('./img/space2.jpg');
		scene.background = bgTexture;
	}

	// create camera
	let screenRatio = sceneWidth / sceneHeight;
	camera = new THREE.PerspectiveCamera(60, screenRatio, 1, 10000);
	camera.position.set(0, 0, 100);
	camera.lookAt(0, 0, 0);

	// create light and add to scene
	let ambientLight = new THREE.AmbientLight(new THREE.Color('rgb(120,120,120)'));
	scene.add(ambientLight);

	let directlight = new THREE.DirectionalLight(new THREE.Color('rgb(255,255,255)'));
	directlight.position.set(0, 0, 10);
	directlight.intensity = 3;
	scene.add(directlight);

	// create renderer
	renderer = new THREE.WebGLRenderer({
		sortObjects: false
	});
	renderer.setSize(sceneWidth, sceneHeight);
	document.body.appendChild(renderer.domElement);

	// create controller
	if (enableOrbitControl) {
		controls = new OrbitControls(camera, renderer.domElement);
		controls.autoRotateSpeed = 0.5;
		controls.enableDamping = true;
		controls.dampingFactor = 0.05;
		controls.screenSpacePanning = false;
		controls.minDistance = 50;
		controls.maxDistance = 300;
	} else {
		controls = null;
	}

	// rock loader
	rockLoader = new GLTFLoader();
}

// go render...
function animate() {

	if (moveForward) camera.position.y += moveLength;
	if (moveBackward) camera.position.y -= moveLength;
	if (moveLeft) camera.position.x -= moveLength;
	if (moveRight) camera.position.x += moveLength;
	camera.lookAt(camera.position.x, camera.position.y, 0);

	// rocks fly to me
	for (let n = 0; n < rockObjs.length; ++n) {
		rockObjs[n].rock_obj.position.z += speed * rockObjs[n].rock_speed;
		rockObjs[n].rock_obj.rotateX(rockObjs[n].rock_rotate.x);
		rockObjs[n].rock_obj.rotateY(rockObjs[n].rock_rotate.y);
		rockObjs[n].rock_obj.rotateZ(rockObjs[n].rock_rotate.z);
		if (rockObjs[n].rock_obj.position.z >= camera.position.z * 1.2) {
			scene.remove(rockObjs[n].rock_obj);
			rockObjs.splice(n, 1);

			if (++passRocks > totalRocks) document.getElementById('success').style.display = 'block';
			let status = `${passRocks} / ${totalRocks}`;
			document.getElementById('status').innerText = status;
		}
	}

	if (controls != null) controls.update();
	renderer.render(scene, camera);
	requestAnimationFrame(animate);
}

// generate rock by loading model
function generateRock() {

	setTimeout(generateRock, genInterval);
	if (!start) return;
	if (generatedRocks >= totalRocks) return;

	let thisCnt = minGenCnt + Math.random() * (maxGenCnt - minGenCnt);
	for (let n = 0; n < thisCnt; ++n) {

		// create rock
		let rockIdx = 1 + Math.floor(Math.random() * 3);
		rockLoader.load(`model/rock${rockIdx}.glb`, function (gltf) {

			// load rock
			let rock = gltf.scene;
			//let rockScale = 20 + randn_bm() * 10;
			rock.scale.set(
				20 + randn_bm() * 5,
				20 + randn_bm() * 5,
				20 + randn_bm() * 5
			);

			// rotate rock
			rock.rotateX(Math.random() * Math.PI / 2);
			rock.rotateY(Math.random() * Math.PI / 2);
			rock.rotateZ(Math.random() * Math.PI / 2);

			// place rock
			let x = camera.position.x + (randn_bm() * 500);
			let y = camera.position.y + (randn_bm() * 500);
			rock.position.set(x, y, -2000);
			scene.add(rock);

			// create self-rotate factor
			let rs = 0.5 + Math.random();
			let rr = {
				x: Math.random() * 0.05,
				y: Math.random() * 0.05,
				z: Math.random() * 0.05
			};
			rockObjs.push({
				rock_obj: rock,
				rock_rotate: rr,
				rock_speed: rs
			});
			++generatedRocks;
		}, undefined, function (error) {
			console.error(error);
		});
	}
}

// add user interaction
document.addEventListener('keydown', onKeyDown, false);
document.addEventListener('keyup', onKeyUp, false);

function onKeyDown(event) {
	switch (event.keyCode) {
		case 38: // up
		case 87: // w
			moveForward = true;
			break;
		case 37: // left
		case 65: // a
			moveLeft = true;
			break;
		case 40: // down
		case 83: // s
			moveBackward = true;
			break;
		case 39: // right
		case 68: // d
			moveRight = true;
			break;
		case 32: // space
			start = !start;
			if (start) {
				if (passRocks >= totalRocks) passRocks = 0;
				if (generatedRocks >= totalRocks) generatedRocks = 0;
				document.getElementById('caption').style.display = 'none';
				document.getElementById('success').style.display = 'none';
				document.getElementById('status').innerText = `${passRocks} / ${totalRocks}`;
			} else {
				document.getElementById('caption').style.display = 'block';
				document.getElementById('success').style.display = 'none';
			}
			break;
	}
}

function onKeyUp(event) {
	switch (event.keyCode) {
		case 38: // up
		case 87: // w
			moveForward = false;
			break;
		case 37: // left
		case 65: // a
			moveLeft = false;
			break;
		case 40: // down
		case 83: // s
			moveBackward = false;
			break;
		case 39: // right
		case 68: // d
			moveRight = false;
			break;
	}
};

// count random number in normal distribution (center = 0)
function randn_bm() {
	var u = 0, v = 0;
	while (u === 0) u = Math.random(); //Converting [0,1) to (0,1)
	while (v === 0) v = Math.random();
	return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}



// generate rock
//function generateRock_bySphere() {
//
//	setTimeout(generateRock_bySphere, genInterval);
//	if (!start) return;
//
//	let thisCnt = minGenCnt + Math.random() * (maxGenCnt - minGenCnt);
//	for (let n = 0; n < thisCnt; ++n) {
//
//		// create sphere
//		let thisSize = minSize + Math.random() * (maxSize - minSize);
//		let geometry = new THREE.IcosahedronGeometry(thisSize, 1);
//
//		// create mesh and add to scene
//		let x = camera.position.x + (randn_bm() * 500);
//		let y = camera.position.y + (randn_bm() * 500);
//		let m = Math.floor(Math.random() * 3);
//		let rock = new THREE.Mesh(geometry, rockMaterials[m]);
//		rock.scale.set(
//			0.5 + Math.random() * 2,
//			0.5 + Math.random() * 2,
//			0.5 + Math.random() * 2
//		);
//		rock.rotateX(Math.random() * Math.PI / 2);
//		rock.rotateY(Math.random() * Math.PI / 2);
//		rock.rotateZ(Math.random() * Math.PI / 2);
//		rock.position.set(x, y, -2000);
//		scene.add(rock);
//
//		// create self-rotate factor
//		let rs = 0.5 + Math.random();
//		let rr = {
//			x: Math.random() * 0.1,
//			y: Math.random() * 0.1,
//			z: Math.random() * 0.1
//		};
//		rockObjs.push({
//			rock_obj: rock,
//			rock_rotate: rr,
//			rock_speed: rs
//		});
//	}
//}


// 直接修改裡面每個點達到不規則效果
// 太麻煩而且速度會變慢, 不過這段留著搞不好以後用得到
//// make rough
//let poss = geometry.getAttribute('position').array;
//let rfac = [];
//for (let n = 0; n < poss.length / 3; ++n) {
//	let xx = poss[3 * n];
//	let yy = poss[3 * n + 1];
//	let zz = poss[3 * n + 2];
//	let k = `${xx}-${yy}-${zz}`;
//	let v = 0.8 + Math.random() * 0.4;
//	rfac.push({ key: k, val: v });
//}
//for (let n = 0; n < poss.length / 3; ++n) {
//	let xx = poss[3 * n];
//	let yy = poss[3 * n + 1];
//	let zz = poss[3 * n + 2];
//	let k = `${xx}-${yy}-${zz}`;
//	for (let m = 0; m < rfac.length; ++m) {
//		if (k == rfac[m].key) {
//			poss[3 * n] *= rfac[m].val;
//			poss[3 * n + 1] *= rfac[m].val;
//			poss[3 * n + 2] *= rfac[m].val;
//			break;
//		}
//	}
//}
//let vertices = new Float32Array(poss);
//geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));

