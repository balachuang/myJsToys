// prepare all points
const MAX_GRID = 200;
const GRID_INV = 5;
const EARTH_RADIUS = 100;
const CLOUD_RADIUS = 1.015 * EARTH_RADIUS;
const RADIUS_DIFF = 30;
const POINT_COUNT = 500;
const EARTH_ROTATE_SPEED = 0; //Math.PI / 200000;
const CLOUD_ROTATE_SPEED = EARTH_ROTATE_SPEED + Math.PI / 100000;

// create 3d scene
const scene = new THREE.Scene();

// create camera
const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 500 );
camera.position.set(200, 30, 200);
camera.lookAt( 0, 0, 0 );

// 產生 X-Z 座標平面, 之後不會變動, 不需回傳
// generatePlanes(true, false, true);

// 產生座標軸, 之後不會變動, 不需回傳
// generateAxis(true, true, true);

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
	// earth texture - transparent video !!!
	var dayVideo = document.getElementById( 'earthDay' );
	var nightVideo = document.getElementById( 'earthNight' );
	dayVideo.play();
	nightVideo.play();

	// earth texture - Day
	const earthDayTexture = new THREE.TextureLoader().load('./Texture/Earth_Day.png');
	// const earthDayAlphaTexture = new THREE.TextureLoader().load('./Texture/Earth_Day_alpha.png');
	const earthDayAlphaTexture = new THREE.VideoTexture( dayVideo );
	const earthDayMaterial = new THREE.MeshBasicMaterial({
		map: earthDayTexture,
		alphaMap: earthDayAlphaTexture,
		blending: THREE.AdditiveBlending
	});
	earthDayMaterial.map.wrapS = THREE.RepeatWrapping;
	earthDayMaterial.alphaMap.wrapS = THREE.RepeatWrapping;
	earthDayMaterial.map.repeat.x = 1;
	earthDayMaterial.alphaMap.repeat.x = 1;

	// earth texture - Night
	const earthNightTexture = new THREE.TextureLoader().load('./Texture/Earth_Night.png');
	// const earthNightAlphaTexture = new THREE.TextureLoader().load('./Texture/Earth_Night_alpha.png');
	const earthNightAlphaTexture = new THREE.VideoTexture( nightVideo );
	const earthNightMaterial = new THREE.MeshBasicMaterial({
		map: earthNightTexture,
		alphaMap: earthNightAlphaTexture,
		blending: THREE.AdditiveBlending
	});
	earthNightMaterial.map.wrapS = THREE.RepeatWrapping;
	earthNightMaterial.alphaMap.wrapS = THREE.RepeatWrapping;
	earthNightMaterial.map.repeat.x = 1;
	earthNightMaterial.alphaMap.repeat.x = 1;

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

	// console.log(earthNight.material.alphaMap);
	// earthNight.material.alphaMap.offset.x += 0.5;
	// earthDay.material.alphaMap.rotateY += Math.PI / 2;
	// earthNight.material.alphaMap.rotateX += Math.PI / 2;

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
	// earth.day.material.map.offset.x -= sunRotateAngle;
	// earth.night.material.map.offset.x -= sunRotateAngle;
	// earth.night.material.alphaMap.rotateY -= sunRotateAngle;
}

/*
// 畫座標軸
function generateAxis(xx, yy, zz)
{
	const xMaterial = new THREE.LineBasicMaterial({color: 0xaaaaaa});
	const yMaterial = new THREE.LineBasicMaterial({color: 0xaaaa00});
	const zMaterial = new THREE.LineBasicMaterial({color: 0x0000ff});
	const nMaterial = new THREE.LineBasicMaterial({color: 0x333333});

	const xPoints = [];
	const yPoints = [];
	const zPoints = [];
	const nxPoints = [];
	const nyPoints = [];
	const nzPoints = [];
	xPoints.push(new THREE.Vector3(       0,        0,        0));
	xPoints.push(new THREE.Vector3(MAX_GRID,        0,        0));
	yPoints.push(new THREE.Vector3(       0,        0,        0));
	yPoints.push(new THREE.Vector3(       0, MAX_GRID,        0));
	zPoints.push(new THREE.Vector3(       0,        0,        0));
	zPoints.push(new THREE.Vector3(       0,        0, MAX_GRID));
	nxPoints.push(new THREE.Vector3(        0,         0,         0));
	nxPoints.push(new THREE.Vector3(-MAX_GRID,         0,         0));
	nyPoints.push(new THREE.Vector3(        0,         0,         0));
	nyPoints.push(new THREE.Vector3(        0, -MAX_GRID,         0));
	nzPoints.push(new THREE.Vector3(        0,         0,         0));
	nzPoints.push(new THREE.Vector3(        0,         0, -MAX_GRID));

	const xGeometry = new THREE.BufferGeometry().setFromPoints( xPoints );
	const yGeometry = new THREE.BufferGeometry().setFromPoints( yPoints );
	const zGeometry = new THREE.BufferGeometry().setFromPoints( zPoints );
	const nxGeometry = new THREE.BufferGeometry().setFromPoints( nxPoints );
	const nyGeometry = new THREE.BufferGeometry().setFromPoints( nyPoints );
	const nzGeometry = new THREE.BufferGeometry().setFromPoints( nzPoints );

	const xAxis = new THREE.Line( xGeometry, xMaterial );
	const yAxis = new THREE.Line( yGeometry, yMaterial );
	const zAxis = new THREE.Line( zGeometry, zMaterial );
	const nxAxis = new THREE.Line( nxGeometry, nMaterial );
	const nyAxis = new THREE.Line( nyGeometry, nMaterial );
	const nzAxis = new THREE.Line( nzGeometry, nMaterial );

	if (xx) scene.add(xAxis);
	if (yy) scene.add(yAxis);
	if (zz) scene.add(zAxis);
	if (xx) scene.add(nxAxis);
	if (yy) scene.add(nyAxis);
	if (zz) scene.add(nzAxis);
}

// 畫座標平面
// three.js 無法建立四角面, 只好自己畫線
function generatePlanes(x, y, z)
{
	// 一次只能畫一個平面
	if (x && y && z) return;

	const planeMaterial = new THREE.LineBasicMaterial({color: 0x333333});

	let vectStr = '';
	if (!x) vectStr = 'new THREE.Vector3(0, a, b)';
	if (!y) vectStr = 'new THREE.Vector3(a, 0, b)';
	if (!z) vectStr = 'new THREE.Vector3(a, b, 0)';

	const planePointsU = [];
	const planePointsV = [];
	for (var i=-MAX_GRID; i<MAX_GRID; i+=GRID_INV)
	{
		if (i == 0) continue;

		let j = i + GRID_INV;
		if (j == 0) j += GRID_INV;

		planePointsU.push(eval(vectStr.replace('a', '' + i).replace('b', '' + (-MAX_GRID))));
		planePointsU.push(eval(vectStr.replace('a', '' + i).replace('b', '' + ( MAX_GRID))));
		planePointsU.push(eval(vectStr.replace('a', '' + j).replace('b', '' + ( MAX_GRID))));
		planePointsU.push(eval(vectStr.replace('a', '' + j).replace('b', '' + (-MAX_GRID))));
		planePointsU.push(eval(vectStr.replace('a', '' + i).replace('b', '' + (-MAX_GRID))));

		planePointsV.push(eval(vectStr.replace('b', '' + i).replace('a', '' + (-MAX_GRID))));
		planePointsV.push(eval(vectStr.replace('b', '' + i).replace('a', '' + ( MAX_GRID))));
		planePointsV.push(eval(vectStr.replace('b', '' + j).replace('a', '' + ( MAX_GRID))));
		planePointsV.push(eval(vectStr.replace('b', '' + j).replace('a', '' + (-MAX_GRID))));
		planePointsV.push(eval(vectStr.replace('b', '' + i).replace('a', '' + (-MAX_GRID))));
	}

	const planeUGridGeometry = new THREE.BufferGeometry().setFromPoints( planePointsU );
	const planeVGridGeometry = new THREE.BufferGeometry().setFromPoints( planePointsV );
	const planeU = new THREE.Line(planeUGridGeometry, planeMaterial);
	const planeV = new THREE.Line(planeVGridGeometry, planeMaterial);
	scene.add(planeU);
	scene.add(planeV);
}

function rotateYPoint(x, y, z, a)
{
	let rx = x * Math.cos(a) - x * Math.sin(a);
	let ry = y;
	let rz = z * Math.sin(a) + z * Math.cos(a);

	return {x:rx, y:ry, z:rz};
}
*/
