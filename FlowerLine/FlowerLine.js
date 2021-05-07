let xTotal = window.innerWidth;
let yTotal = window.innerHeight;
let xMax = xTotal / 2;
let yMax = yTotal / 2;

let r1 = {x:0, y:0, r:0};
let r2 = {x:0, y:0, r:0};
let fp = {x:0, y:0, r:0};

let rotateCount = 0;
let prevAngle = 0;

let isR2Catched = false;
let isR2CircleCatched = false;

window.onload = function()
{
	// set draw area and total length
	$('#svg-container').css({ width: xTotal, height: yTotal });
	$('#svg-area').attr('viewBox', '0 0 ' + xTotal + ' ' + yTotal);

	r1.r = 0.8 * Math.min(xMax, yMax);
	updateCircleCenter('#R1', r1);
	updateCircleCenter('#R1C', r1);
	$('#R1').attr('r', r1.r);

	r2.r = 0.7 * r1.r;
	r2.x = r1.x + r1.r - r2.r;
	r2.y = r1.y;
	updateCircleCenter('#R2', r2);
	updateCircleCenter('#R2C', r2);
	$('#R2').attr('r', r2.r);

	fp.r = 0.6 * r2.r;
	fp.x = r2.x + fp.r;
	fp.y = r2.y;
	updateCircleCenter('#flower-point', fp);

	$('#R2C').mousedown(catchR2Center);
	$('#R2').mousedown(catchR2Circle);
    $(document).mousemove(mousemoveHandler);
    $(document).mouseup(releaseR2);
};

function catchR2Center(event)
{
	isR2Catched = true;
}

function catchR2Circle(event)
{
	isR2CircleCatched = true;
}

function mousemoveHandler(event)
{
	if (isR2Catched) {
		let mousePnt = {x: event.pageX, y: event.pageY};
		updateR2Center(toReal(mousePnt));
	}

	if (isR2CircleCatched) {
		let mousePnt = {x: event.pageX, y: event.pageY};
		updateR2Radius(toReal(mousePnt));
	}
}

function releaseR2()
{
	isR2Catched = false;
	isR2CircleCatched = false;
}

function updateR2Radius(mouseRealPnt)
{
	// calculate A1
	let ex = mouseRealPnt.x - r2.x;
	let ey = mouseRealPnt.y - r2.y;
	let rDif = r2.r - fp.r;
	r2.r = Math.sqrt(ex * ex + ey * ey);
	r2.x = (r1.r - r2.r) * Math.cos(prevAngle);
	r2.y = (r1.r - r2.r) * Math.sin(prevAngle);
	fp.r = r2.r - rDif;
	$('#R2').attr('r', r2.r);
	updateCircleCenter('#R2', r2);
	updateCircleCenter('#R2C', r2);

	updateFlowerLine(prevAngle);
}

function updateR2Center(mouseRealPnt)
{
	// calculate A1
	let ex = mouseRealPnt.x - r1.x;
	let ey = mouseRealPnt.y - r1.y;
	let currAngle = arcTan(ex, ey);
	if (prevAngle - currAngle > Math.PI) ++rotateCount;
	if (currAngle - prevAngle > Math.PI) --rotateCount;
	prevAngle = currAngle;

	updateFlowerLine(currAngle);
}

function updateFlowerLine(currAngle)
{

	let a1 = rotateCount * Math.PI * 2 + currAngle;

	// calculate R2 Center and update
	// r1 = (0, 0), no need to add
	r2.x = (r1.r - r2.r) * Math.cos(a1);
	r2.y = (r1.r - r2.r) * Math.sin(a1);
	// console.log(xyPair(r2));
	updateCircleCenter('#R2', r2);
	updateCircleCenter('#R2C', r2);

	// calculate flower path, every 0.5 degree
	let aStep = dia(1) * a1 / Math.abs(a1);
	let calAngle = 0;
	let fPathStr = '';
	while(Math.abs(calAngle) < Math.abs(a1))
	{
		a2 = calAngle * r1.r / r2.r;
		fp.x = (r1.r - r2.r) * Math.cos(calAngle) + fp.r * Math.cos(calAngle - a2);
		fp.y = (r1.r - r2.r) * Math.sin(calAngle) + fp.r * Math.sin(calAngle - a2);
		fPathStr += xyPair(toDisplay(fp)) + ' ';
		calAngle += aStep;
	}

	updateCircleCenter('#flower-point', fp);
	$('#flower-line').attr('points', fPathStr);
}

function xyPair(xy) {
	return xy.x + ',' + xy.y;
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
		x: dispPnt.x - xMax,
		y: yMax - dispPnt.y
	};
	return realPnt;
}

function dia(ang) {
	return ang * Math.PI / 180;
}

function arcTan(x, y)
{
	let a = 0;
	if (x > 0)
	{
		a = Math.atan(y / x);
	}else if(x < 0){
		a = Math.PI + Math.atan(y / x);
	}else{
		if (y > 0)
			a = Math.PI / 2;
		else if (y < 0)
			a = -Math.PI / 2;
		else
			a = 0;
	}
	return a;
}

function updateCircleCenter(circleId, centPoint)
{
	let dispPoint = toDisplay(centPoint);
	$(circleId).attr({ 'cx' : dispPoint.x, 'cy' : dispPoint.y });
}

function updateInputValue(objId, objValue)
{
	console.log(objId + '=' + objValue);
	$('#' + objId).val(objValue);
}

/*
function updateParameters()
{
	CONST_HEAD_ROTATE_COEF = $('#const-head-rotate-coef').val();
	CONST_SECT_CNT = $('#const-sect-cnt').val();
	CONST_SECT_LEN = $('#const-sect-len').val();
	CONST_SWING_MAX_ANG = dia($('#const-swing-max-ang').val());
	CONST_TIME_INTERVAL = $('#const-time-interval').val();
	CONST_SWING_CYCLE = $('#const-swing-cycle').val() / CONST_TIME_INTERVAL;
	CONST_SWING_DELAY = $('#const-swing-delay').val() / CONST_TIME_INTERVAL;
	CONST_AFTER_IMAGE_COUNT = $('#const-after-image-count').val();
	CONST_SHOW_SECTION = $('#show-section').is(':checked');

	clearInterval(intObj);
	//timeClock = 0;
	prepareSvg();
	intObj = setInterval(() => {
		updateSwingLine();
	}, CONST_TIME_INTERVAL);
}

function prepareSvg()
{
	let darkest = 50;
	let colorSeg = (255 - darkest) / CONST_AFTER_IMAGE_COUNT;

	$('#svg-area').empty();

	// create lines
	for (let n=0; n<=CONST_AFTER_IMAGE_COUNT; ++n) {
		let color = 255 - n * colorSeg;
		let colorStr = 'rgb('+color+','+color+','+color+')';
		var vo = makeSVG('path', {id:'swing-line-'+n, stroke:colorStr, fill:'none', d:''});
		$('#svg-area').append(vo);
	}
}
*/

function makeSVG(tag, attrs) {
	var el= document.createElementNS('http://www.w3.org/2000/svg', tag);
	for (var k in attrs) el.setAttribute(k, attrs[k]);
	return el;
}
