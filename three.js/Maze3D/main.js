// =========================================================== Maze
// define size
let mazeMain = $('#3d-container');
let mazeWidth = mazeMain.width();
let mazeHeight = $(window).height() - 110;
let mazeGridWidth = 10;
let mazeWallThick = 1;
let mazeWallHeight = 10;
let mazeXOffset = 0;
let mazeZOffset = 0;
let maze = null;
let mazeObjs = [];
mazeMain.height(mazeHeight);

$('#make').click(function () {
	let x = eval($('#x-size').val());
	let y = eval($('#y-size').val());
	maze = new Maze(
		new MazePos(x, y),
		new MazePos(0, 0),
		new MazePos(x - 1, y - 1)
	);

	maze.setShowStep(false, 0);
	maze.setRenderFnctions(renderMazeSvg, renderGridSvg, function () { }, function () { });
	maze.generate();
});

$('#walk').click(function () {

	$('#walk').blur();

	// 用了 LookAt 會 reset rotation, 除非之後都不再改變 rotation, 否則不要用.
	// LookAt 會用 camera.up 自動計算 rotation, 所以只要有設 camera.up 就可以了.
	let camPosTween = new TWEEN.Tween(camera.position)
		.to(cameraPos2, 3000)
		.easing(TWEEN.Easing.Cubic.Out)
		.onComplete(function () {
			controls = new THREE.PointerLockControls(camera, renderer.domElement);
			controls.lock();
			scene.add(controls.getObject());
		})
		.start();
	let camLookTween = new TWEEN.Tween(lookAtPos1)
		.to(lookAtPos2, 3000)
		.easing(TWEEN.Easing.Cubic.Out)
		.onUpdate(function () {
			camera.lookAt(lookAtPos1.x, lookAtPos1.y, lookAtPos1.z);
		})
		.start();
});

$('#3d-container').click(function () {
	if ((controls != null) && !controls.isLocked) controls.lock();
});

// Three.js 的向上方向為 Y, 如果不 follow 的話, 在設 camera 會超~~~~麻煩
// 把 Maze 畫在 X-Z 平面上, init 時把 camera 放到 Y 軸上去看他.
function renderMazeSvg(mazeAry) {

	let xSize = mazeAry.length;
	let zSize = mazeAry[0].length;
	let xTotal = xSize * mazeGridWidth;
	let zTotal = zSize * mazeGridWidth;
	mazeXOffset = -xTotal / 2;
	mazeZOffset = -zTotal / 2;

	cameraPos2 = {
		x: mazeXOffset - mazeGridWidth,
		y: mazeWallHeight / 2,
		z: mazeZOffset + mazeGridWidth / 2
	};
	lookAtPos2 = {
		x: mazeXOffset,
		y: mazeWallHeight / 2,
		z: mazeZOffset + mazeGridWidth / 2
	};

	// clear all objects
	for (let n = 0; n < mazeObjs.length; ++n) {
		scene.remove(mazeObjs[n]);
	}
	mazeObjs = [];

	// create floor
	let floorGeometry = new THREE.BoxGeometry(
		xTotal + mazeWallThick,
		mazeWallThick,
		zTotal + mazeWallThick);
	let wall = new THREE.Mesh(floorGeometry, floorMaterial);
	wall.position.set(0, -mazeWallThick / 2, 0);
	scene.add(wall);
	mazeObjs.push(wall);

	// create grid
	for (let y = 0; y < zSize; ++y) {
		for (let x = 0; x < xSize; ++x) {
			renderGridSvg(mazeAry[x][y]);
		}
	}
}

// only render once, no need to consider wall change
function renderGridSvg(mazeGrid) {

	// draw lines around this grid
	let xStart = mazeXOffset + mazeGridWidth * mazeGrid.pos.x;
	let zStart = mazeZOffset + mazeGridWidth * mazeGrid.pos.y;
	let halfGrid = mazeGridWidth / 2;

	// 牆疊在一起的地方貼圖會閃.
	// 用了梯型牆後貼圖會跑掉, 先不要
	// 最後用 renderOrder 解決.
	// 原本不行是因為一片牆只有部分重曐, 所以就算設了 renderOrder 還是會分別畫每一面.
	// 後來改成重疊部分另外畫一個柱子, 由於多個柱子是完全重疊, 所以只會最後一個.
	// only first column/raw need to render left/top wall
	if ((mazeGrid.pos.x == 0) && mazeGrid.wallLft && !mazeGrid.isStart) {
		makeWall(DIR.LFT, xStart, zStart);
	}
	if ((mazeGrid.pos.y == 0) && mazeGrid.wallTop) {
		makeWall(DIR.TOP, xStart, zStart);
	}
	if (mazeGrid.wallRgt) {
		makeWall(DIR.RGT, xStart, zStart);
	}
	if (mazeGrid.wallBtm) {
		makeWall(DIR.BTM, xStart, zStart);
	}

	// create an End mark
	if (mazeGrid.isEnd) {
		let r = 0.25 * mazeGridWidth;
		const endGeometry = new THREE.CylinderGeometry(r, r, 50, 32, 1, true);
		const end = new THREE.Mesh(endGeometry, endMaterial);
		end.position.set(xStart + halfGrid, 25, zStart + halfGrid);
		scene.add(end);
		mazeObjs.push(end);
	}
}

function makeWall(dir, x, z) {

	let width = 0;
	let length = 0;
	let half = mazeGridWidth / 2;
	let radius = mazeWallThick / 2;
	let y = mazeWallHeight / 2;

	switch (dir) {
		case DIR.LFT:
		case DIR.RGT:
			width = mazeWallThick;
			length = mazeGridWidth - mazeWallThick;
			break;
		case DIR.TOP:
		case DIR.BTM:
			width = mazeGridWidth - mazeWallThick;
			length = mazeWallThick;
			break;
	}

	const wallGeometry = new THREE.BoxGeometry(width, mazeWallHeight, length);
	const wall = new THREE.Mesh(wallGeometry, wallMaterial);

	const end1Geometry = new THREE.BoxGeometry(mazeWallThick, mazeWallHeight, mazeWallThick);
	const end1 = new THREE.Mesh(end1Geometry, wallMaterial);

	const end2Geometry = new THREE.BoxGeometry(mazeWallThick, mazeWallHeight, mazeWallThick);
	const end2 = new THREE.Mesh(end2Geometry, wallMaterial);

	switch (dir) {
		case DIR.LFT:
			wall.position.set(x, y, z + half);
			end1.position.set(x, y, z);
			end2.position.set(x, y, z + mazeGridWidth);
			break;
		case DIR.RGT:
			wall.position.set(x + mazeGridWidth, y, z + half);
			end1.position.set(x + mazeGridWidth, y, z);
			end2.position.set(x + mazeGridWidth, y, z + mazeGridWidth);
			break;
		case DIR.TOP:
			wall.position.set(x + half, y, z);
			end1.position.set(x, y, z);
			end2.position.set(x + mazeGridWidth, y, z);
			break;
		case DIR.BTM:
			wall.position.set(x + half, y, z + mazeGridWidth);
			end1.position.set(x, y, z + mazeGridWidth);
			end2.position.set(x + mazeGridWidth, y, z + mazeGridWidth);
			break;
	}

	wall.renderOrder = mazeObjs.length + 1;
	end1.renderOrder = mazeObjs.length + 2;
	end2.renderOrder = mazeObjs.length + 3;
	scene.add(wall);
	scene.add(end1);
	scene.add(end2);
	mazeObjs.push(wall);
	mazeObjs.push(end1);
	mazeObjs.push(end2);
}


// =========================================================== 3D
// create 3d scene
let scene = null;
let camera = null;
let ambientLight = null;
let directlight = null;
let rotateDir = { x: 0, y: 0 };
let cameraPos1 = { x: 0, y: 100, z: 1 };
let cameraPos2 = { x: 0, y: 0, z: 0 };
let lookAtPos1 = { x: 0, y: 0, z: 0 };
let lookAtPos2 = { x: 0, y: 0, z: 0 };
let renderer = null;
let controls = null;
let cameraGrp = null;
let rayForward = null;
let rayLeft = null;
let rayRight = null;
let wallMaterial = null;
let floorMaterial = null;
let endMaterial = null;
let controlsEnabled = false;
let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let jump = false;
let jumpDir = 1;
let velocity = { x: 0, y: 0, z: 0 };
var prevTime = performance.now();

init3D();
animate();

function init3D() {

	scene = new THREE.Scene();

	// create camera
	camera = new THREE.PerspectiveCamera(65, mazeWidth / mazeHeight, 1, 10000);
	camera.position.set(0, 100, 1);
	camera.lookAt(0, 0, 0);

	cameraGrp = new THREE.Group();
	cameraGrp.add(camera);
	scene.add(cameraGrp);

	// create light and add to scene
	ambientLight = new THREE.AmbientLight(new THREE.Color('rgb(155,155,155)'))
	scene.add(ambientLight)

	directlight = new THREE.DirectionalLight(new THREE.Color('rgb(255,255,255)'));
	directlight.position.x = mazeXOffset;
	directlight.position.y = 100;
	directlight.position.z = mazeZOffset;
	scene.add(directlight);

	// create materail
	// 發光: https://blog.csdn.net/yangjianxun8888/article/details/123569310
	//wallMaterial = new THREE.MeshBasicMaterial({ color: 0x555555, wireframe: true });
	//mazeMaterial = new THREE.MeshLambertMaterial({ color: 0x555555 });
	let wallTexture = new THREE.TextureLoader().load('./img/wall.jpg');
	let wallBump = new THREE.TextureLoader().load('./img/wallbump.jpg');
	wallMaterial = new THREE.MeshStandardMaterial({
		color: 'grey',
		map: wallTexture,
		bumpScale: wallBump,
		//polygonOffset: true,
		//polygonOffsetFactor: 1,
		//polygonOffsetUnits: 1
	})
	let floorTexture = new THREE.TextureLoader().load('./img/floor.jpg');
	floorMaterial = new THREE.MeshStandardMaterial({
		color: 'grey',
		map: floorTexture
	})
	let endTexture = new THREE.TextureLoader().load('./img/end.jpg');
	let endAlpha = new THREE.TextureLoader().load('./img/endalpha.jpg');
	endMaterial = new THREE.MeshStandardMaterial({
		color: 'grey',
		map: endTexture,
		alphaMap: endAlpha,
		blending: THREE.AdditiveBlending,
		side: THREE.DoubleSide,
		transparent: true,
		depthWrite: false
	})

	// Create Background
	let bgTexture = new THREE.TextureLoader().load('./img/bg.jpg');
	let bgMaterial = new THREE.MeshBasicMaterial({
		map: bgTexture,
		side: THREE.DoubleSide,
		blending: THREE.AdditiveBlending
	});
	let bgGeometry = new THREE.SphereGeometry(5000, 64, 64);
	let bg = new THREE.Mesh(bgGeometry, bgMaterial);
	scene.add(bg);

	// use Raycaster to test object collection
	rayForward = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, 0, -1), 0, mazeGridWidth / 2);
	rayLeft = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(-1, 0, 0), 0, mazeGridWidth);
	rayRight = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(1, 0, 0), 0, mazeGridWidth);

	// create renderer
	renderer = new THREE.WebGLRenderer({
		sortObjects: false
	});
	renderer.setSize(mazeWidth, mazeHeight);
	document.getElementById('3d-container').appendChild(renderer.domElement);
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
			jump = true;
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
		case 32: // space
			jump = false;
			jumpDir = 1;
			break;
	}
};

// go render...
function animate() {

	let currTime = performance.now();
	let delta = Math.min(0.03, 0.005 * (currTime - prevTime) / 1000);
	if (moveForward) velocity.z -= delta;
	else if (moveBackward) velocity.z += delta;
	else velocity.z = velocity.z - Math.sign(velocity.z) * delta;
	if (moveLeft) velocity.x -= delta;
	else if (moveRight) velocity.x += delta;
	else velocity.x = velocity.x - Math.sign(velocity.x) * delta;

	if (controls != null) {
		// check obj collection
		rayForward.setFromCamera({ x: 0, y: 0, z: -1 }, camera);
		rayLeft.setFromCamera({ x: -1, y: 0, z: 0 }, camera);
		rayRight.setFromCamera({ x: 1, y: 0, z: 0 }, camera);
		var objForward = rayForward.intersectObjects(mazeObjs);
		var objLeft = rayLeft.intersectObjects(mazeObjs);
		var objRight = rayRight.intersectObjects(mazeObjs);
		if (objForward.length > 0) velocity.z = velocity.z / 2;
		if ((objLeft.length > 0) || (objRight.length > 0)) velocity.x = velocity.x / 2;
		//var isOnObject = objForward.length > 0;
		//if (isOnObject) {
		//	velocity.x = velocity.x / 2;
		//	
		//}
		controls.getObject().translateX(velocity.x * delta);
		controls.getObject().translateZ(velocity.z * delta);

		// do jump
		if (jump) {
			controls.getObject().position.y += jumpDir * 10 * delta;
			if (controls.getObject().position.y >= mazeWallHeight * 1.7) jumpDir = -1;
			if (controls.getObject().position.y <= mazeWallHeight * 0.5) jumpDir = 1;
		} else {
			if (controls.getObject().position.y > mazeWallHeight * 0.55)
				controls.getObject().position.y -= 10 * delta;
			else
				controls.getObject().position.y = mazeWallHeight * 0.5;
		}
	}

	renderer.render(scene, camera);
	//if (controls != null) controls.update(clock.getDelta());
	TWEEN.update();

	requestAnimationFrame(animate);
}



//document.addEventListener('mousedown', onDocumentMouseDown, false);
//document.addEventListener('mousemove', onDocumentMouseMove, false);
//document.addEventListener('mouseup', onDocumentMouseUp, false);
//document.addEventListener('mousewheel', onDocumentMouseWheel, false);

//let isClick = false;
//let clickPnt = { x: 0, y: 0 };
//function onDocumentMouseDown(event) {
//	isClick = true;
//	clickPnt.x = event.pageX;
//	clickPnt.y = event.pageY;
//	//cameraZ = camera.rotation.z;
//	//cameraRot.x = camera.rotation.x;
//	//cameraRot.y = camera.rotation.y;
//	//cameraRot.z = camera.rotation.z;
//}
//
//function onDocumentMouseMove(event) {
//
//	if (!isClick) return;
//
//	let xDiff = event.pageX - clickPnt.x;
//	let yDiff = event.pageY - clickPnt.y;
//
//	camera.rotateX(yDiff * 0.1 * Math.PI / 180);
//	camera.rotateY(xDiff * 0.1 * Math.PI / 180);
//	//camera.rotation.x = cameraRot.x + xDiff * 0.1 * Math.PI / 180;
//	//camera.rotation.y = cameraRot.y + yDiff * 0.1 * Math.PI / 180;
//	//camera.rotation.z = cameraZ;
//
//	clickPnt.x = event.pageX;
//	clickPnt.y = event.pageY;
//}
//
//function onDocumentMouseUp() {
//	isClick = false;
//	//rotateDir.x = object.rotation.x;
//	//rotateDir.y = object.rotation.y;
//}
//
//function onDocumentMouseWheel(event) {
//	if (event.wheelDelta > 0) camera.position.z -= 1;
//	if (event.wheelDelta < 0) camera.position.z += 1;
//}

