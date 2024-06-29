let svgDefObj = null;
let spaceObj = null;
let spaceDim = null;
let svgAstro = null;
let astroObjs = [];

let lastTime = (new Date()).getTime();

const G = 0.01;
const starConst = {
	sizeRange: {min: 10, max: 15},
	massRange: {min: 100, max: 200},
	colorRange: {min: 150, max: 225}
};
const planetConst = {
	sizeRange: {min: 2, max: 5},
	massRange: {min: 10, max: 20},
	colorRange: {min: 150, max: 225}
};

$(document).ready(initDocuemnt);
function initDocuemnt()
{
	// init div height
	spaceObj = $('#space');
	svgDefObj = $("#svg-defs");
	svgAstro = $('#astro-objs');
	spaceDim = {
		x: {
			min: spaceObj.position().left,
			max: spaceObj.position().left + spaceObj.width(),
			range: spaceObj.width(),
			center: spaceObj.position().left + spaceObj.width() / 2
		},
		y: {
			min: spaceObj.position().top,
			max: spaceObj.position().top + spaceObj.height(),
			range: spaceObj.height(),
			center: spaceObj.position().top + spaceObj.height() / 2
		}
	};
	console.log(spaceDim);

	addAstroObj({ x: 800, y: 400 }, randomMass(true),  { x: 0, y: 0 }, true);
	addAstroObj({ x: 900, y: 400 }, randomMass(false), { x: 0, y: 0.05 }, false);

	// start astro objects' animation
	animate();
}

function animate()
{
	let currTime = (new Date()).getTime();
	let timeSpan = (currTime - lastTime) / 1000;

	// calculate forces between all asto objects
	let force = Array.apply(null, Array(astroObjs.length * astroObjs.length)).map(function() { return -1 });
	for(var i=0; i<astroObjs.length; ++i)
	{
		for(var j=i+1; j<astroObjs.length; ++j)
		{
			let idxIJ = i * astroObjs.length + j;
			let idxJI = j * astroObjs.length + i;
			if ((force[idxIJ] >= 0) && (force[idxJI] >= 0)) continue;

			let xDis = astroObjs[i].center.x - astroObjs[j].center.x;
			let yDis = astroObjs[i].center.y - astroObjs[j].center.y;
			let disPower = (xDis * xDis) + (yDis * yDis);
			let f = G * astroObjs[i].mass * astroObjs[j].mass / disPower;
			force[idxIJ] = f;
			force[idxJI] = f;
		}
	}

	// calculate all movements
	let newVelocity = Array.apply(null, Array(astroObjs.length)).map(function() { return {x: 0, y: 0} });
	let newPosition = Array.apply(null, Array(astroObjs.length)).map(function() { return {x: 0, y: 0} });
	for(var i=0; i<astroObjs.length; ++i)
	{
		// calculate join force in astroObjs[i]
		let joinForce = {x: 0, y: 0};
		for(var j=0; j<astroObjs.length; ++j)
		{
			if (j == i) continue;

			// calculate force in x / y direction
			let ang = Math.atan2(astroObjs[j].center.y - astroObjs[i].center.y, astroObjs[j].center.x - astroObjs[i].center.x);
			let idxIJ = i * astroObjs.length + j;
			joinForce.x += force[idxIJ] * Math.cos(ang);
			joinForce.y += force[idxIJ] * Math.sin(ang);
		}

		// calculate acceleration from join force
		let accX = joinForce.x / astroObjs[i].mass;
		let accY = joinForce.y / astroObjs[i].mass;

		// calculate new velocity
		let velX = astroObjs[i].velocity.x + accX * timeSpan;
		let velY = astroObjs[i].velocity.y + accY * timeSpan;
		newVelocity[i] = {x: velX, y: velY};

		// calculate new position
		let posX = astroObjs[i].center.x + (astroObjs[i].velocity.x + velX) * timeSpan / 2;
		let posY = astroObjs[i].center.y + (astroObjs[i].velocity.y + velY) * timeSpan / 2;
		newPosition[i] = {x: posX, y: posY};
	}

	// update SVG
	for(var i=0; i<astroObjs.length; ++i)
	{
		let objId = '#' + (astroObjs[i].isStar ? 'star_' : 'planet_') + astroObjs[i].id;
		astroObjs[i].center = newPosition[i];
		astroObjs[i].velocity = newVelocity[i];
		updateAstroCenter(objId, astroObjs[i].center);
	}
	setTimeout(animate, 20);
}

function updateAstroCenter(objId, center) {
	$(objId).attr('cx', center.x);
	$(objId).attr('cy', spaceDim.y.max - center.y);
}

function randomMass(isStar) {
	let range = isStar ? starConst.massRange : planetConst.massRange;
	return range.min + Math.random() * (range.max - range.min);
}

function massSize(_mass, isStar) {
	let massRange = isStar ? starConst.massRange : planetConst.massRange;
	let sizeRange = isStar ? starConst.sizeRange : planetConst.sizeRange;
	return sizeRange.min + (sizeRange.max - sizeRange.min) * (_mass - massRange.min) / (massRange.max - massRange.min);
}

function massColor(_mass, isStar)
{
	let massRange = isStar ? starConst.massRange : planetConst.massRange;
	let colorRange = isStar ? starConst.colorRange : planetConst.colorRange;
	let colorValue = colorRange.min + (colorRange.max - colorRange.min) * (_mass - massRange.min) / (massRange.max - massRange.min);
	let colorStr = isStar ? 'rgb(255, {val}, 0)' : 'rgb({val}, {val}, {val})';
	return colorStr.replaceAll('{val}', colorValue);
}

// add new astro object
// function addAstroObj(_center, _radius, _velocity, _color, _isStar)
function addAstroObj(_center, _mass, _velocity, _isStar)
{
	let size = massSize(_mass, _isStar);
	let color = massColor(_mass, _isStar);

	let newAstro = {
		id: (astroObjs.length > 0) ? (astroObjs[astroObjs.length - 1].id + 1) : 0,
		center: _center,
		mass: _mass,
		radius: size,
		velocity: _velocity,
		color: color,
		isStar: _isStar
	};
	astroObjs.push(newAstro);
	svgAstro.append(astroSvg(newAstro));
}

// generate astro obj svg
function astroSvg(astroObj)
{
	if (astroObj.isStar) svgDefObj.append(gradientSvg(astroObj.id, astroObj.color));

	return makeSVG(
		'circle',
		{
			id: (astroObj.isStar ? 'star_' : 'planet_') + astroObj.id,
			cx: astroObj.center.x,
			cy: spaceDim.y.max - astroObj.center.y,
			r: astroObj.radius,
			fill: astroObj.isStar ? 'url(#starGradient-' + astroObj.id + ')' : astroObj.color,
			filter: astroObj.isStar ? 'url(#starFilter)' : 'none'
		});
}

// generate gradient filter by color
function gradientSvg(_id, _color) {
	let gObj = makeSVG('radialGradient', {id: 'starGradient-' + _id});
	gObj.append(makeSVG('stop', {offset: '0%', 'stop-color': _color}));
	gObj.append(makeSVG('stop', {offset: '70%', 'stop-color': _color}));
	gObj.append(makeSVG('stop', {offset: '100%', 'stop-color': _color, 'stop-opacity': '0%'}));
	return gObj;
}

function makeSVG(tag, attrs) {
	var el = document.createElementNS('http://www.w3.org/2000/svg', tag);
	for (var k in attrs) el.setAttribute(k, attrs[k]);
	return el;
}