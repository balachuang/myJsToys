// prepare all points
const MAX_GRID = 200;
const GRID_INV = 5;
const BASIC_RADIUS = 100;
const RADIUS_DIFF = 30;
const POINT_COUNT = 500;
const ROUND_SPEED  = 0.05 * Math.PI / 1000;
const ROTATE_SPEED = 0.01 * Math.PI / 1000;

// create 3d scene
const scene = new THREE.Scene();

// create camera
const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 500 );
camera.position.set(100, 30, 100);
camera.lookAt( 0, 0, 0 );

// 產生 X-Z 座標平面, 之後不會變動, 不需回傳
generatePlanes(true, false, true);

// 產生座標軸, 之後不會變動, 不需回傳
generateAxis(true, true, true);

// 計算每個點的起始位置, 並產生 Point Object
let pointPolar = initPolarParameters();
let pointObjects = preparePointsObject();
scene.add(pointObjects);

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
	updateRoundingBallsLocation(currTime - prevTime);
	prevTime = currTime;

	// go render
	controls.update();
	renderer.render( scene, camera );
}

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

// 計算每個點的初始距離, 角度, 及速度.
// 角度,速度包含公轉及自轉.
function initPolarParameters()
{
	let points = [];
	for (var i=0; i<POINT_COUNT; ++i)
	{
		let r = BASIC_RADIUS + 2 * RADIUS_DIFF * Math.random() - RADIUS_DIFF;
		let a1 = 2 * Math.PI * Math.random();
		let a2 = 2 * Math.PI * Math.random();
		let t1 = BASIC_RADIUS / r;
		let t2 = RADIUS_DIFF / (r - BASIC_RADIUS);
		let s1 = ROUND_SPEED  * t1 * t1;
		let s2 = Math.min(ROTATE_SPEED * 100, ROTATE_SPEED * t2 * t2);

		// revolution = 公轉
		// rotation   = 自轉
		points.push({
			radius: r,
			revolutionAngle: a1,
			rotationAngle: a2,
			revolutionSpeed: s1,
			rotateSpeed: s2
		});
	}
	return points;
}

// 根據角度計算每個點的位置.
// 同時產生 WebGL 用的 Object
function preparePointsObject()
{
	const pointLocation = [];
	const pointColor = [];
	for (var i=0; i<POINT_COUNT; ++i)
	{
		// 計算公轉位置
		let gx = pointPolar[i].radius * Math.cos(pointPolar[i].revolutionAngle);
		let gz = pointPolar[i].radius * Math.sin(pointPolar[i].revolutionAngle);

		// 計算自轉位置 - 每個點繞 R=BASIC_RADIUS 位置在 X-Y 平面上自轉
		// 計算在原 X-Y 平面位置後, 再旋轉並平移到目前公轉位置
		let rotationRadius = Math.abs(pointPolar[i].radius - BASIC_RADIUS);
		let rx = rotationRadius * Math.cos(pointPolar[i].rotationAngle);
		let ry = rotationRadius * Math.sin(pointPolar[i].rotationAngle);

		let p = rotateYPoint(rx, ry, 0, pointPolar[i].revolutionAngle);
		pointLocation.push(p.x + gx, p.y, p.z + gz);

		// let r = Math.random();
		// let g = Math.random();
		// let b = Math.random();
		// pointColor.push(r, g, b);
		pointColor.push(1, 1, 0);
	}

	let pointGeometry = new THREE.BufferGeometry();
	pointGeometry.setAttribute('position', new THREE.Float32BufferAttribute(pointLocation, 3));
	pointGeometry.setAttribute('color', new THREE.Float32BufferAttribute(pointColor, 3) );

	var tex = new THREE.TextureLoader().load('PntShape.png');
	let pointMaterial = new THREE.PointsMaterial({
		size: 2,
		vertexSize: true,
		vertexColors: true,
		blending: THREE.AdditiveBlending,
		alphaMap: tex
	});

	let points = new THREE.Points(pointGeometry, pointMaterial);
	return points;
}

// 根據速度計算每個點的新位置
function updateRoundingBallsLocation(delta)
{
	let pointGeometry = pointObjects.geometry;
	const pointLocation = [];
	for (var i=0; i<POINT_COUNT; ++i)
	{
		// calculate urrent angle from delta time
		pointPolar[i].revolutionAngle -= pointPolar[i].revolutionSpeed * delta;
		pointPolar[i].rotationAngle   -= pointPolar[i].rotateSpeed * delta;

		// 計算公轉位置
		let gx = pointPolar[i].radius * Math.cos(pointPolar[i].revolutionAngle);
		let gz = pointPolar[i].radius * Math.sin(pointPolar[i].revolutionAngle);

		// 計算自轉位置 - 每個點繞 R=BASIC_RADIUS 位置在 X-Y 平面上自轉
		// 計算在原 X-Y 平面位置後, 再旋轉並平移到目前公轉位置
		let rotationRadius = Math.abs(pointPolar[i].radius - BASIC_RADIUS);
		let rx = rotationRadius * Math.cos(pointPolar[i].rotationAngle);
		let ry = rotationRadius * Math.sin(pointPolar[i].rotationAngle);

		let p = rotateYPoint(rx, ry, 0, pointPolar[i].revolutionAngle);
		pointLocation.push(p.x + gx, p.y, p.z + gz);
	}
	pointGeometry.setAttribute('position', new THREE.Float32BufferAttribute(pointLocation, 3));
}

function rotateYPoint(x, y, z, a)
{
	let rx = x * Math.cos(a) - x * Math.sin(a);
	let ry = y;
	let rz = z * Math.sin(a) + z * Math.cos(a);

	return {x:rx, y:ry, z:rz};
}