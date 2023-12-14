// create random objects
const CENTER_SIZE = 10;
const MAX_RADIUS = 200;
const POINT_COUNT = 3000;
const MAX_RND_SPEED = 2 * Math.PI / 1000;
let points = preparePoints();

// create 3d scene
const scene = new THREE.Scene();

// create camera
const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 500 );
camera.position.set(100, 50, 100);
camera.lookAt( 0, 0, 0 );

// create balls and vertices
let centerBall = createCenterBall();
scene.add(centerBall);

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
animate();
function animate()
{
	requestAnimationFrame( animate );

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
