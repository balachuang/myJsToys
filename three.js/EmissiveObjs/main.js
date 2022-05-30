// =========================================================== import objects
import * as THREE from 'three';
//import { GUI } from 'https://threejs.org/examples/jsm/libs/lil-gui.module.min.js';
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

let sceneWidth = window.innerWidth;
let sceneHeight = window.innerHeight;

init3D();
animate();

function init3D() {

	scene = new THREE.Scene();

	// create camera
	let screenRatio = sceneWidth / sceneHeight;
	camera = new THREE.PerspectiveCamera(65, screenRatio, 1, 10000);
	camera.position.set(0, 50, 100);
	camera.lookAt(0, 0, 0);

	// create light and add to scene
	let ambientLight = new THREE.AmbientLight(new THREE.Color('rgb(120,120,120)'));
	scene.add(ambientLight);

	let directlight = new THREE.DirectionalLight(new THREE.Color('rgb(120,120,120)'));
	directlight.position.set(-100, 100, -100);
	scene.add(directlight);

	// create materail
	// 發光:
	// https://blog.csdn.net/yangjianxun8888/article/details/123569310
	// https://threejs.org/examples/?q=bloom#webgl_postprocessing_unreal_bloom_selective
	// https://github.com/mrdoob/three.js/blob/master/examples/webgl_postprocessing_unreal_bloom_selective.html
	for (let n = 0; n < lightCnt; ++n) {

		edir[n] = 1;
		lightMaterial[n] = new THREE.MeshStandardMaterial({
			color: 'rgb(150,50,50)',
			emissive: 'rgb(255,100,100)',
			emissiveIntensity: 1.0 * n / lightCnt,
			shadowSide: THREE.DoubleSide,
			side: THREE.DoubleSide,
			transparent: true,
			opacity: 0.5
		});

		// Create Object
		let geometry = new THREE.CylinderGeometry(lightRis, lightRis, lightRis * 2, 32, 1);
		let mesh = new THREE.Mesh(geometry, lightMaterial[n]);
		mesh.position.set(0.5 * (1 - lightCnt) * lightDis + lightDis * n, 0, 0);
		scene.add(mesh);
	}

	// renderers for bloom effect
	renderer = new THREE.WebGLRenderer({
		toneMapping: THREE.ReinhardToneMapping,
		toneMappingExposure: 1
	});
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(sceneWidth, sceneHeight);
	document.body.appendChild(renderer.domElement);

	renderScene = new RenderPass(scene, camera);

	bloomPass = new UnrealBloomPass(new THREE.Vector2(sceneWidth, sceneHeight), 1.5, 0.4, 0.85);
	bloomPass.threshold = 0;
	bloomPass.strength = 2;
	bloomPass.radius = 1;

	bloomComposer = new EffectComposer(renderer);
	bloomComposer.renderToScreen = false;
	bloomComposer.addPass(renderScene);
	bloomComposer.addPass(bloomPass);

	finalPass = new ShaderPass(
		new THREE.ShaderMaterial({
			uniforms: {
				baseTexture: { value: null },
				bloomTexture: { value: bloomComposer.renderTarget2.texture }
			},
			vertexShader: document.getElementById('vertexshader').textContent,
			fragmentShader: document.getElementById('fragmentshader').textContent,
			defines: {}
		}), 'baseTexture'
	);
	finalPass.needsSwap = true;

	finalComposer = new EffectComposer(renderer);
	finalComposer.addPass(renderScene);
	finalComposer.addPass(finalPass);

	// create controller
	controls = new OrbitControls(camera, renderer.domElement);
	controls.autoRotateSpeed = 0.5;
	controls.enableDamping = true;
	controls.dampingFactor = 0.05;
	controls.screenSpacePanning = false;
	controls.minDistance = 50;
	controls.maxDistance = 300;
}

// go render...
function animate() {

	//bloomPass.strength += edir * 0.03;
	//if ((bloomPass.strength > 5) || (bloomPass.strength < 0)) edir = -edir;

	for (let n = 0; n < lightCnt; ++n) {
		lightMaterial[n].emissiveIntensity += edir[n] * 0.01;
		if ((lightMaterial[n].emissiveIntensity > 1) ||
			(lightMaterial[n].emissiveIntensity < 0)) {
			edir[n] = -edir[n];
		}
	}

	controls.update();

	bloomComposer.render();
	finalComposer.render();

	requestAnimationFrame(animate);
}
