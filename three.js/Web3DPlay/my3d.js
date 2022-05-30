// create 3d scene
const scene = new THREE.Scene();

// create camera
//const camera = new THREE.PerspectiveCamera( 65, window.innerWidth / window.innerHeight, 1, 500 );
const camera = new THREE.PerspectiveCamera( 65, 400/300, 1, 500 );
camera.position.set(0, 0, 10);
camera.lookAt( 0, 0, 0 );

// create light and add to scene
let ambientLight = new THREE.AmbientLight( new THREE.Color('rgb(155,155,155)') )
scene.add(ambientLight)

let light = new THREE.DirectionalLight( new THREE.Color('rgb(255,255,255)') ); 
scene.add(light);

// load objects and add to scene
let object = null;
let glCameras = null;
const loader = new THREE.GLTFLoader();
loader.load( 'model/example.glb', function ( gltf ) {
	object = gltf.scene;
	glCameras = gltf.cameras;
	scene.add( object );
	// object.rotation.x = 0.3;
	animate();
}, undefined, function ( error ) {
	console.error( error );
} );

// create renderer
const renderer = new THREE.WebGLRenderer();
//renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setSize(400, 300);
//document.body.appendChild( renderer.domElement );
document.getElementById('3d-container').appendChild( renderer.domElement );

// go render...
let rotateDir = {x:0, y:0};
function animate() {
	requestAnimationFrame( animate );
	renderer.render( scene, camera );
}

// add user interaction
let isClick = false;
let clickPnt = {x:0, y:0};
document.addEventListener('mousedown', onDocumentMouseDown, false);
document.addEventListener('mousemove', onDocumentMouseMove, false);
document.addEventListener('mouseup', onDocumentMouseUp, false);
document.addEventListener('mousewheel', onDocumentMouseWheel, false);

function onDocumentMouseDown(event)
{
	isClick = true;
	clickPnt.x = event.pageX;
	clickPnt.y = event.pageY;
}

function onDocumentMouseMove(event)
{
	if (!isClick) return;

	let xDiff = event.pageX - clickPnt.x;
	let yDiff = event.pageY - clickPnt.y;

	object.rotation.x = rotateDir.x + 0.01 * yDiff;
	object.rotation.y = rotateDir.y + 0.01 * xDiff;
}

function onDocumentMouseUp()
{
	isClick = false;
	rotateDir.x = object.rotation.x;
	rotateDir.y = object.rotation.y;
}

function onDocumentMouseWheel(event)
{
	if (event.wheelDelta > 0) camera.position.z -= 0.2;
	if (event.wheelDelta < 0) camera.position.z += 0.2;
}