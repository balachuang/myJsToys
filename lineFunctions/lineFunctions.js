let ANGLE_START = 0;
let ANGLE_INCREASE = 1;
let ANGLE_STOP = 360;
let TIME_INT = 1;

let xTotal = window.innerWidth;
let yTotal = window.innerHeight;
let xMax = xTotal / 2;
let yMax = yTotal / 2;

$(document).ready(function()
{
	$('#svg-container').css({width: window.innerWidth, height: window.innerHeight });
	$('#svg-area').attr({
		'width'   : xTotal,
		'height'  : yTotal,
		'viewBox' : '0 0 ' + xTotal + ' ' + yTotal
	});

	$('.line-btn').click(function(){

		$('#svg-area line').remove();

		var funcName = $(this).attr('value').split(' ')[0];
		var params = $(this).attr('param').split(' ');

		ANGLE_START = 0;
		ANGLE_INCREASE = eval(params[0]);
		ANGLE_STOP = eval(params[1]);
	
		let lineFunc = eval('lf_' + funcName);
	
		setTimeout(function(){
			drawLine(lineFunc, ANGLE_START);
		}, TIME_INT);
	});
});

function drawLine(lineFunction, currAngle)
{
	if (currAngle >= ANGLE_STOP) return;

	// calculate
	let p1 = {x: -xMax, y: 0};
	let p2 = {x:  xMax, y: 0};
	p1.y = lineFunction(p1.x, currAngle);
	p2.y = lineFunction(p2.x, currAngle);

	createSVGLine(p1, p2);

	// go next
	setTimeout(function(){
		drawLine(lineFunction, currAngle + ANGLE_INCREASE);
	}, TIME_INT);
}

function createSVGLine(realP1, realP2)
{
	// transfer
	let p1s = toDisplay(realP1);
	let p2s = toDisplay(realP2);

	// draw
	var vo = makeSVG('line', {x1:p1s.x, y1:p1s.y, x2:p2s.x, y2:p2s.y});
	$('#svg-area').append(vo);
}

function makeSVG(tag, attrs) {
	var el= document.createElementNS('http://www.w3.org/2000/svg', tag);
	for (var k in attrs) el.setAttribute(k, attrs[k]);
	return el;
}

function xyPair(xy) {
	return xy.x + ' ' + xy.y;
}

function toDisplay(realPnt)
{
	let dispPnt = {
		x: realPnt.x + xMax,
		y: yMax - realPnt.y
	};
	return dispPnt;
}

function toReal(dispPnt)
{
	let realPnt = {
		x:  dispPnt.x + xMax,
		y: -dispPnt.y + yMax
	};
	return realPnt;
}

// Jacob Bernoulli
// a: degree angle
function lf_Jakob(x, a)
{
	let aa = a * Math.PI / 180;
	let ss = Math.sin(aa);
	let ii = Math.exp (aa/5) - 2 * x * ss;
	let jj = ss - Math.cos(aa);

	return x + ii / jj;
}

// Archimedes
// a: degree angle
function lf_Archimedes(x, a)
{
	let aa = a * Math.PI / 180;
	let ss = Math.sin(aa);
	let cc = Math.cos(aa);
	let ii = x * (ss + aa * cc) - 10 * aa * aa;
	let jj = cc - aa * ss;

	return ii / jj;
}

// Circle
// a: degree angle
function lf_Circle(x, a)
{
	if (a % 90 == 0) a += 0.01;

	let aa = a * Math.PI / 180;
	let ct = 1 / Math.tan(aa);
	let cs = 1 / Math.sin(aa);

	return -x * ct + 100 * cs;
}

// Heart
// a: degree angle
function lf_Cardioid(x, a)
{
	if (a % 60 == 0) a += 0.01;

	let aa = a * Math.PI / 180;
	let tt = Math.tan(aa / 2);
	let cc = Math.cos(aa);

	return tt * (cc + 2 * x * cc + x - 150) / (2 * cc - 1);
}

// Rose
// a: degree angle
function lf_Rose(x, a)
{
	if (a % 45 == 0) a += 0.01;

	let aa = a * Math.PI / 180;
	let ss2 = Math.sin(2 * aa);
	let ss4 = Math.sin(4 * aa);
	let cc2 = Math.cos(2 * aa);
	let cc4 = Math.cos(4 * aa);
	let cc6 = Math.cos(6 * aa);
	let ii = 2 * x * (cc2 - 2 * cc4) + 200 + cc6;
	let jj = 2 * ss2 + 4 * ss4;

	return ii / jj;
}


// Descartes
// a: degree angle
function lf_Descartes(x, a)
{
	if (a % 45 == 0) a += 0.01;

	let aa = a * Math.PI / 180;
	let tt = Math.tan(aa);
	let t3 = tt * tt * tt;
	let ii = tt * (300 * tt + x * t3 - 2 * x);
	let jj = 2 * t3 - 1;

	return ii / jj;
}
