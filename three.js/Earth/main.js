// prepare all points
const MAX_GRID = 200;
const GRID_INV = 5;
const EARTH_RADIUS = 100;
const CLOUD_RADIUS = 1.015 * EARTH_RADIUS;
const RADIUS_DIFF = 30;
const POINT_COUNT = 500;
const EARTH_ROTATE_SPEED = 0; //Math.PI / 200000;
const CLOUD_ROTATE_SPEED = EARTH_ROTATE_SPEED - Math.PI / 300000;

// earth texture - transparent video !!!
const dayVideo = document.getElementById( 'earthDay' );
const nightVideo = document.getElementById( 'earthNight' );
dayVideo.play();
nightVideo.play();

const earthDayAlphaTexture = new THREE.VideoTexture( dayVideo );
earthDayAlphaTexture.wrapS = THREE.RepeatWrapping;
earthDayAlphaTexture.repeat.x = 1;

const earthNightAlphaTexture = new THREE.VideoTexture( nightVideo );
earthNightAlphaTexture.wrapS = THREE.RepeatWrapping;
earthNightAlphaTexture.repeat.x = 1;

const whiteTexture = new THREE.TextureLoader().load('./Texture/white.png');

// create 3d scene
const scene = new THREE.Scene();

// create camera
const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 500 );
camera.position.set(200, 30, 200);
camera.lookAt( 0, 0, 0 );

// create all meshes
let earth = createEarth();
scene.add(earth.day);
scene.add(earth.night);
scene.add(earth.cloud);

// create renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// create controller
const controls = new THREE.OrbitControls( camera, renderer.domElement );
controls.autoRotateSpeed = 0.5;
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.screenSpacePanning = false;
controls.minDistance = 50;
controls.maxDistance = 300;

controls.update();

// checkbox events
$('#show-sun').click(toggleSunLight);
$('#show-night').click(toggleNight);
$('#show-cloud').click(toggleCloud);

// go render...
let prevTime = (new Date()).getTime();
animate();
function animate() {
	requestAnimationFrame( animate );

	// calculate balls rounding
	let currTime = (new Date()).getTime();
	updateEarthRotation(currTime - prevTime);
	prevTime = currTime;

	// go render
	controls.update();
	renderer.render( scene, camera );
}

// PS. three.js 同一個 material 只有一個 offset 設定, 所有的 texture 共用.
function createEarth()
{
	// earth texture - Day
	const earthDayTexture = new THREE.TextureLoader().load('./Texture/Earth_Day.png');
	const earthDayMaterial = new THREE.MeshBasicMaterial({
		map: earthDayTexture,
		alphaMap: earthDayAlphaTexture,
		blending: THREE.AdditiveBlending
	});
	earthDayMaterial.map.wrapS = THREE.RepeatWrapping;
	earthDayMaterial.map.repeat.x = 1;

	// earth texture - Night
	const earthNightTexture = new THREE.TextureLoader().load('./Texture/Earth_Night.png');
	const earthNightMaterial = new THREE.MeshBasicMaterial({
		map: earthNightTexture,
		alphaMap: earthNightAlphaTexture,
		blending: THREE.AdditiveBlending
	});
	earthNightMaterial.map.wrapS = THREE.RepeatWrapping;
	earthNightMaterial.map.repeat.x = 1;

	// cloud texture
	const cloudTexture = new THREE.TextureLoader().load('./Texture/Cloud.png');
	const cloudMaterial = new THREE.MeshBasicMaterial({
		map: cloudTexture,
		alphaMap: cloudTexture,
		blending: THREE.AdditiveBlending
	});

	// models
	const earthDayGeometry = new THREE.SphereGeometry(EARTH_RADIUS, 64, 64);
	const earthNightGeometry = new THREE.SphereGeometry(EARTH_RADIUS, 64, 64);
	const cloudGeometry = new THREE.SphereGeometry(CLOUD_RADIUS, 64, 64);

	// objects
	const earthDay   = new THREE.Mesh(earthDayGeometry,   earthDayMaterial);
	const earthNight = new THREE.Mesh(earthNightGeometry, earthNightMaterial);
	const cloud = new THREE.Mesh(cloudGeometry, cloudMaterial);
	earthDay.position.set(0, 0, 0);
	earthNight.position.set(0, 0, 0);
	cloud.position.set(0, 0, 0);

	let earthInt = {
		day: earthDay,
		night: earthNight,
		cloud: cloud
	};
	return earthInt;
}

// 根據速度計算轉動角度
function updateEarthRotation(delta)
{
	let earthRotateAngle = EARTH_ROTATE_SPEED * delta;
	let cloudRotateAngle = CLOUD_ROTATE_SPEED * delta;

	earth.day.rotateY(earthRotateAngle);
	earth.night.rotateY(earthRotateAngle);
	earth.cloud.rotateY(cloudRotateAngle);
}

function toggleSunLight()
{
	let showSun = $('#show-sun:checked').length;
	let showNight = $('#show-night:checked').length;
	if (showSun == 1) {
		// earth.night.visible = true;
		earth.night.visible = (showNight == 1);
		earth.day.material.alphaMap = earthDayAlphaTexture;
	}else{
		earth.night.visible = false;
		earth.day.material.alphaMap = whiteTexture;
	}
}

function toggleNight()
{
	let showSun = $('#show-sun:checked').length;
	let showNight = $('#show-night:checked').length;
	if (showNight == 1) {
		earth.night.visible = (showSun == 1);
	}else{
		earth.night.visible = false;
	}
}

function toggleCloud()
{
	let show = $('#show-cloud:checked').length;
	if (show == 1) {
		earth.cloud.visible = true;
	}else{
		earth.cloud.visible = false;
	}
}

