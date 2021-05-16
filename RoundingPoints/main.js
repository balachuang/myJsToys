// prepare all points
const CENTER_SIZE = 10;
const MAX_RADIUS = 200;
const POINT_COUNT = 3000;
const MAX_RND_SPEED = 2 * Math.PI / 1000;
let points = preparePoints();

// create 3d scene
const scene = new THREE.Scene();
//scene.background = new THREE.Color(0x555555);

// create camera
const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 500 );
camera.position.set(100, 50, 100);
camera.lookAt( 0, 0, 0 );

// create balls and vertices
//addPointsToScene(true);
let centerBall = createCenterBall();
let roundingBalls = createRoundingBalls();
scene.add(centerBall);
scene.add(roundingBalls);

// create renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// create controller
const controls = new THREE.OrbitControls( camera, renderer.domElement );
//controls.autoRotate = true;
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

function preparePoints()
{
	let points = [];
	for (var i=0; i<POINT_COUNT; ++i)
	{
		let r = CENTER_SIZE + Math.random() * (MAX_RADIUS - CENTER_SIZE);
		let a = 2 * Math.PI * Math.random();
		let t = CENTER_SIZE / r;
		let h = CENTER_SIZE * (Math.random() * t - t / 2);
		let s = MAX_RND_SPEED * t * t;

		points.push({radius: r, angle: a, height: h, speed: s});
	}
	return points;
}

function createCenterBall()
{
	// center ball
	const ballGeometry = new THREE.SphereGeometry(0.7 * CENTER_SIZE, 32, 32);
	const ballMaterial = new THREE.MeshBasicMaterial( {color: 0x555500} );
	const ball = new THREE.Mesh(ballGeometry, ballMaterial);
	ball.position.set(0, 0, 0);
	return ball;
}

function createRoundingBalls()
{
	const vertexLocation = [];
	const vertexColor = [];
	const vertexSize = [];
	for (var i=0; i<POINT_COUNT; ++i)
	{
		let x = points[i].radius * Math.cos(points[i].angle);
		let z = points[i].radius * Math.sin(points[i].angle);
		vertexLocation.push(x, points[i].height, z);

		let r = Math.random();
		let g = Math.random();
		let b = Math.random();
		vertexColor.push(r, g, b);

		let s = THREE.Math.randFloat(1, 5);
		vertexSize.push(s);
	}

	let dotGeometry = new THREE.BufferGeometry();
	dotGeometry.setAttribute('position', new THREE.Float32BufferAttribute(vertexLocation, 3));
	dotGeometry.setAttribute('color', new THREE.Float32BufferAttribute( vertexColor, 3 ) );
	dotGeometry.setAttribute('size', new THREE.Float32BufferAttribute( vertexSize, 1 ) );

	var tex = new THREE.TextureLoader().load('PntShape.png');
	// let dotMaterial = new THREE.PointsMaterial({color: 'yellow', map: tex});
	let dotMaterial = new THREE.PointsMaterial({
		size: 2,
		vertexSize: true,
		vertexColors: true,
		blending: THREE.AdditiveBlending,
		alphaMap: tex
	});

	let dot = new THREE.Points(dotGeometry, dotMaterial);
	return dot;
}

function updateRoundingBallsLocation(delta)
{
	let dotGeometry = roundingBalls.geometry;
	const vertexLocation = [];
	for (var i=0; i<POINT_COUNT; ++i)
	{
		// calculate urrent angle from delta time
		points[i].angle -= points[i].speed * delta;

		// update all locations
		let x = points[i].radius * Math.cos(points[i].angle);
		let z = points[i].radius * Math.sin(points[i].angle);
		vertexLocation.push(x, points[i].height, z);
	}
	dotGeometry.setAttribute('position', new THREE.Float32BufferAttribute(vertexLocation, 3));
}

// Too many meshes when using SphereGeometry
/*
function addPointsToScene(usePointMaterial)
{
	// center ball
	const ballGeometry = new THREE.SphereGeometry(0.7 * CENTER_SIZE, 32, 32);
	const ballMaterial = new THREE.MeshBasicMaterial( {color: 0xffff00} );
	const ball = new THREE.Mesh(ballGeometry, ballMaterial);
	ball.position.set(0, 0, 0);
	scene.add(ball);

	// calculate locations by radius and angle
	if (usePointMaterial)
	{
		const vertexLocation = [];
		const vertexColor = [];
		const vertexSize = [];
		for (var i=0; i<POINT_COUNT; ++i)
		{
			let x = points[i].radius * Math.cos(points[i].angle);
			let z = points[i].radius * Math.sin(points[i].angle);
			vertexLocation.push(x, points[i].height, z);
	
			let r = Math.random();
			let g = Math.random();
			let b = Math.random();
			vertexColor.push(r, g, b);
	
			let s = THREE.Math.randFloat(1, 5);
			vertexSize.push(s);
		}
	
		let dotGeometry = new THREE.BufferGeometry();
		dotGeometry.setAttribute('position', new THREE.Float32BufferAttribute(vertexLocation, 3));
		dotGeometry.setAttribute('color', new THREE.Float32BufferAttribute( vertexColor, 3 ) );
		dotGeometry.setAttribute('size', new THREE.Float32BufferAttribute( vertexSize, 1 ) );
	
		var tex = new THREE.TextureLoader().load('PntShape.bmp');
		// let dotMaterial = new THREE.PointsMaterial({color: 'yellow', map: tex});
		let dotMaterial = new THREE.PointsMaterial({
			size: 2,
			vertexSize: true,
			vertexColors: true,
			blending: THREE.AdditiveBlending,
			alphaMap: tex
		});
	
		let dot = new THREE.Points(dotGeometry, dotMaterial);
		scene.add(dot);
	}else{
		for (var i=0; i<POINT_COUNT; ++i)
		{
			let x = points[i].radius * Math.cos(points[i].angle);
			let z = points[i].radius * Math.sin(points[i].angle);
			let s = 1 + 4 * Math.random();
			let r = Math.random();
			let g = Math.random();
			let b = Math.random();

			const vertGeometry = new THREE.SphereGeometry(s / 2, 3, 3);
			const vertMaterial = new THREE.MeshBasicMaterial({color: new THREE.Color(r, g, b)});
			const vertex = new THREE.Mesh(vertGeometry, vertMaterial);
			vertex.position.set(x, points[i].height, z);

			scene.add(vertex);
		}
	}
}
*/
