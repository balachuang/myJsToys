//...

var ctrlPoints;
// var ctrlPointSvgObj;
// var ctrlLineSvgObj;
// var bcurveSvgObj;

var ctrlPointRadius = 7;
var initCtrlPts = [
	{x: 100, y: 200},
	{x: 250, y: 100},
	{x: 250, y: 300},
	{x: 400, y: 200},
];

var currMoveIdx = -1;
var mouseStartPoiint;

$(document).ready(initDocuemnt);

function initDocuemnt()
{
	// initialize Canvas
	cvs = $('#bezierArea');
	cvsW = cvs.width();
	cvsH = $(window).height() - 80;
	cvs.height(cvsH);

	// init b-curve control points
	ctrlPoints = [];
	for (let n=0; n<4; ++n) ctrlPoints[n] = new Point2(initCtrlPts[n].x, initCtrlPts[n].y);

	// init svg objects
	$('#bezierArea').append(makeSVG('polyline', {id: 'bcurve', fill: 'none', stroke: 'yellow', 'stroke-width': 3 }));
	$('#bezierArea').append(makeSVG('line', {id: 'ctrl-line-0', fill: 'none', stroke: 'white',	'stroke-width': 1, 'stroke-dasharray': '5,5'}));
	$('#bezierArea').append(makeSVG('line', {id: 'ctrl-line-1', fill: 'none', stroke: 'white',	'stroke-width': 1, 'stroke-dasharray': '5,5'}));
	$('#bezierArea').append(makeSVG('line', {id: 'ctrl-line-2', fill: 'none', stroke: 'white',	'stroke-width': 1, 'stroke-dasharray': '5,5'}));
	$('#bezierArea').append(makeSVG('circle', {id: 'ctrl-point-0', r: ctrlPointRadius, fill: 'white', stroke: 'white', 'stroke-width': 1}));
	$('#bezierArea').append(makeSVG('circle', {id: 'ctrl-point-1', r: ctrlPointRadius, fill: 'rgb(36, 37, 38)', stroke: 'white', 'stroke-width': 1}));
	$('#bezierArea').append(makeSVG('circle', {id: 'ctrl-point-2', r: ctrlPointRadius, fill: 'rgb(36, 37, 38)', stroke: 'white', 'stroke-width': 1}));
	$('#bezierArea').append(makeSVG('circle', {id: 'ctrl-point-3', r: ctrlPointRadius, fill: 'white', stroke: 'white', 'stroke-width': 1}));

	// event handler
	$('#bezierDiv').on('mousedown', mousedownHandler);
	$('#bezierDiv').on('mousemove', mousemoveHandler);
	$('#bezierDiv').on('mouseup', mouseupHandler);

	// update bezier curve
	updateBezierSvg(-1, 0, 0);
}

function mousedownHandler(e)
{
	mouseStartPoiint = { x: e.offsetX, y: e.offsetY };

	let clickPoint = {
		x: e.offsetX - $('#bezierDiv').position().left,
		y: e.offsetY - $('#bezierDiv').position().top
	};
	// let clickPoint = getClickPoint(e);

	for (let n=0; n<4; ++n)
	{
		let dis = Math.sqrt((ctrlPoints[n].x - clickPoint.x)**2 + (ctrlPoints[n].y - clickPoint.y)**2);
		if (dis <= ctrlPointRadius * 2) {
			currMoveIdx = n;
			break;
		}
	}
}

function mouseupHandler(e)
{
	// update result point
	if (currMoveIdx >= 0)
	{
		// let thisId = `#ctrl-point-${currMoveIdx}`;
		let xDiff = e.offsetX - mouseStartPoiint.x;
		let yDiff = e.offsetY - mouseStartPoiint.y;
		ctrlPoints[currMoveIdx].x += xDiff;
		ctrlPoints[currMoveIdx].y += yDiff;
		// $(thisId).attr('cx', ctrlPoints[currMoveIdx].x);
		// $(thisId).attr('cy', ctrlPoints[currMoveIdx].y);
		currMoveIdx = -1;
		updateBezierSvg(-1, 0, 0);
	}
}

function mousemoveHandler(e)
{
	if (currMoveIdx >= 0)
	{
		console.log(e.offsetX - mouseStartPoiint.x);
		let xDiff = e.offsetX - mouseStartPoiint.x;
		let yDiff = e.offsetY - mouseStartPoiint.y;
		updateBezierSvg(currMoveIdx, xDiff, yDiff);
	}
}

function updateBezierSvg(idx, xDiff, yDiff)
{
	let tempCtPts = [];
	for (let n=0; n<4; ++n) tempCtPts[n] = {x:ctrlPoints[n].x, y: ctrlPoints[n].y};

	if (idx >= 0)
	{
		// 目前正在移動控制點
		tempCtPts[idx].x += xDiff;
		tempCtPts[idx].y += yDiff;

		// bezier curve
		let bcurveStr = calculateBCurve(tempCtPts);
		$('#bcurve').attr('points', bcurveStr);

		// control-line
		if (idx < 3)
		{
			let idStr = `#ctrl-line-${idx}`;
			$(idStr).attr('x1', tempCtPts[idx].x);
			$(idStr).attr('y1', tempCtPts[idx].y);
			$(idStr).attr('x2', tempCtPts[idx+1].x);
			$(idStr).attr('y2', tempCtPts[idx+1].y);
		}
		if (idx > 0)
		{
			let idStr = `#ctrl-line-${idx-1}`;
			$(idStr).attr('x1', tempCtPts[idx-1].x);
			$(idStr).attr('y1', tempCtPts[idx-1].y);
			$(idStr).attr('x2', tempCtPts[idx].x);
			$(idStr).attr('y2', tempCtPts[idx].y);
		}

		// control poiint
		let idStr = `#ctrl-point-${idx}`;
		$(idStr).attr('cx', tempCtPts[idx].x);
		$(idStr).attr('cy', tempCtPts[idx].y);
	}
	else
	{
		// 目前是單純畫圖
		// bezier curve
		let bcurveStr = calculateBCurve(tempCtPts);
		$('#bcurve').attr('points', bcurveStr);

		// control-line
		for (let n=0; n<3; ++n)
		{
			let idStr = `#ctrl-line-${n}`;
			$(idStr).attr('x1', tempCtPts[n].x);
			$(idStr).attr('y1', tempCtPts[n].y);
			$(idStr).attr('x2', tempCtPts[n+1].x);
			$(idStr).attr('y2', tempCtPts[n+1].y);
		}

		// control poiint
		for (let n=0; n<4; ++n)
		{
			let idStr = `#ctrl-point-${n}`;
			$(idStr).attr('cx', tempCtPts[n].x);
			$(idStr).attr('cy', tempCtPts[n].y);
		}
	}
}

// function createBezierSvg()
// {
// 	// bezier curve
// 	let bcurveStr = calculateBCurve(ctrlPoints);
// 	let svgObj = makeSVG('polyline', {
// 		id: 'bcurve', points: bcurveStr,
// 		fill: 'none', stroke: 'white', 'stroke-width': 3
// 	});
// 	$('#bezierArea').append(svgObj);

// 	// control-line
// 	for (let n=0; n<3; ++n)
// 	{
// 		svgObj = makeSVG('line', {
// 			id: `ctrl-line-${n}`,
// 			x1: ctrlPoints[n].x,   y1: ctrlPoints[n].y,
// 			x2: ctrlPoints[n+1].x, y2: ctrlPoints[n+1].y,
// 			fill: 'none', stroke: 'white',
// 			'stroke-width': 1, 'stroke-dasharray': '5,5'
// 		});
// 		$('#bezierArea').append(svgObj);
// 	}

// 	// control poiint
// 	for (let n=0; n<4; ++n)
// 	{
// 		svgObj = makeSVG('circle', {
// 			id: `ctrl-point-${n}`,
// 			cx: ctrlPoints[n].x, cy: ctrlPoints[n].y, r: ctrlPointRadius, 
// 			fill: ((n % 3)==0) ? 'white' : 'black', 
// 			stroke: 'white', 'stroke-width': 1 
// 		});
// 		$('#bezierArea').append(svgObj);
// 	}
// }

// function addSvgLine(id, start, end) {
// 	var vo = makeSVG('line', { id: id, x1: start.x, y1: start.y, x2: end.x, y2: end.y });
// 	$('#bezierArea').append(vo);
// }

function makeSVG(tag, attrs) {
	var el = document.createElementNS('http://www.w3.org/2000/svg', tag);
	for (var k in attrs) el.setAttribute(k, attrs[k]);
	return el;
}

// cps: control points
function calculateBCurve(cps)
{
	let bcurveStr = '';
	for (let n=0; n<=100; ++n)
	{
		let t1 = n / 100.0;
		let t2 = 1 - t1;

		let px = (t2**3)*cps[0].x + 3*t1*(t2**2)*cps[1].x + 3*(t1**2)*t2*cps[2].x + (t1**3)*cps[3].x;
		let py = (t2**3)*cps[0].y + 3*t1*(t2**2)*cps[1].y + 3*(t1**2)*t2*cps[2].y + (t1**3)*cps[3].y;
		bcurveStr += `${px},${py} `;
	}
	return bcurveStr.trim();
}

function getClickPoint(e)
{
	return {
		x: e.offsetX - $('#bezierDiv').position().left,
		y: e.offsetY - $('#bezierDiv').position().top
	};
}


// class
class Point2
{
	constructor(x = 0, y = 0)
	{
		this.x = x;
		this.y = y;
	}
}
