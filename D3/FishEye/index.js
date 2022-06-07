
let svgObj = null;
let svgLens = null;
let svgMove = null;
let svgSize = null;
let svgEffc = null;

let rectSize = 50;
let rectXCnt = Math.ceil(window.innerWidth / rectSize);
let rectYCnt = Math.ceil(window.innerHeight / rectSize);

let lensParam = {
	x: window.innerWidth / 2,
	y: window.innerHeight / 2,
	r: 100
};
let contolerR = 15;
let effectRange = 1.1;
let effectRatio = 0.5;
let segCnt = 50;

let moveLens = false;
let zoomLens = false;
let effcLens = false;
let moveStart = null;

$(document).ready(initAll);

function initAll() {
	initD3();
	initLensHandler();
}

function initD3() {

	// init D3
	svgObj = d3.select('#svg-area')
		.style('width', window.innerWidth)
		.style('height', window.innerWidth)
		.style('left', 0)
		.style('top', 0);

	// draw control circle
	svgLens = d3.select('#lens');
	svgMove = d3.select('#moveCtrl').attr('r', contolerR);
	svgSize = d3.select('#sizeCtrl').attr('r', contolerR);
	svgEffc = d3.select('#effcCtrl').attr('r', contolerR);
	drawLens();

	// draw grids
	drawGrids();
}

function drawFishEyeRect(context, x, y) {

	let effecBox = {
		minX: lensParam.x - lensParam.r * effectRange,
		maxX: lensParam.x + lensParam.r * effectRange,
		minY: lensParam.y - lensParam.r * effectRange,
		maxY: lensParam.y + lensParam.r * effectRange
	}

	let x1 = x * rectSize;
	let y1 = y * rectSize;
	let x2 = (x + 1) * rectSize;
	let y2 = (y + 1) * rectSize;
	let p = [];
	p.push({ x: x1, y: y1 });
	p.push({ x: x2, y: y1 });
	p.push({ x: x2, y: y2 });
	p.push({ x: x1, y: y2 });

	if (gridTouchBox(p, effecBox) && gridTouchLens(p)) {
		// console.log('calculate p deform');
		let ps = calculateLensEffect(p[0]);
		context.moveTo(ps.x, ps.y);
		for (let n = 0; n < 4; ++n) {
			let pS = p[n];
			let pE = p[(n + 1) % 4];
			let pDif = { x: (pE.x - pS.x) / segCnt, y: (pE.y - pS.y) / segCnt };
			for (let s = 0; s < segCnt; ++s) {
				let pDef = {
					x: pS.x + pDif.x * (s + 1),
					y: pS.y + pDif.y * (s + 1)
				};
				pDef = calculateLensEffect(pDef);
				context.lineTo(pDef.x, pDef.y);
			}
		}
	} else {
		context.moveTo(p[0].x, p[0].y);
		context.lineTo(p[1].x, p[1].y);
		context.lineTo(p[2].x, p[2].y);
		context.lineTo(p[3].x, p[3].y);
		context.closePath();
	}

	return context;
}

function drawGrids() {
	let svgGrids = d3.select('#grids');
	svgGrids.selectAll('path').remove();
	for (let x = 0; x < rectXCnt; ++x) {
		for (let y = 0; y < rectYCnt; ++y) {
			let c = 255 * ((x + y) % 2);
			svgGrids.append('path')
				.attr('fill', `rgb(${c},${c},${c})`)
				.attr('stroke', 'white')
				.attr('stroke-width', '0.1')
				.attr('d', drawFishEyeRect(d3.path(), x, y));
		};
	};
}

function drawLens() {

	svgLens.attr('r', lensParam.r)
		.attr('cx', lensParam.x)
		.attr('cy', lensParam.y);

	let moveR = (lensParam.r + contolerR) / Math.sqrt(2);
	svgMove
		.attr('cx', lensParam.x + moveR)
		.attr('cy', lensParam.y + moveR);
	svgSize
		.attr('cx', lensParam.x + moveR)
		.attr('cy', lensParam.y - moveR);

	let a = (-90 + effectRatio * 180) * Math.PI / 180;
	let ex = lensParam.x - (lensParam.r + contolerR) * Math.cos(a);
	let ey = lensParam.y - (lensParam.r + contolerR) * Math.sin(a);
	svgEffc.attr('cx', ex).attr('cy', ey);
}

function calculateLensEffect(p) {

	let xDis = p.x - lensParam.x;
	let yDis = p.y - lensParam.y;
	let dist = Math.sqrt(xDis * xDis + yDis * yDis);
	if ((dist <= 0) || dist >= lensParam.r) return { x: p.x, y: p.y };

	let movement = effectRatio * Math.sqrt(lensParam.r * lensParam.r - dist * dist);
	let moveP = {
		x: lensParam.x + xDis * Math.min(lensParam.r, dist + movement) / dist,
		y: lensParam.y + yDis * Math.min(lensParam.r, dist + movement) / dist
	};
	return moveP;
}

function gridTouchLens(ps) {
	let touched = false;
	ps.forEach(p => {
		if (!touched) {
			let xDis = p.x - lensParam.x;
			let yDis = p.y - lensParam.y;
			let dist = Math.sqrt(xDis * xDis + yDis * yDis);
			if (dist < lensParam.r) touched = true;
		}
	});
	return touched;
}

function gridTouchBox(ps, box) {
	return false ||
		ptInBox(ps[0], box) ||
		ptInBox(ps[1], box) ||
		ptInBox(ps[2], box) ||
		ptInBox(ps[3], box);
}

function ptInBox(p, box) {
	return (
		(p.x >= box.minX) && (p.x <= box.maxX) &&
		(p.y >= box.minY) && (p.y <= box.maxY)
	);
}

function initLensHandler() {
	$('#moveCtrl').mousedown(function (e) {
		moveLens = true;
		moveStart = {
			pagex: e.pageX,
			pagey: e.pageY,
			lenx: lensParam.x,
			leny: lensParam.y
		};
	});
	$('#sizeCtrl').mousedown(function (e) {
		zoomLens = true;
		moveStart = {
			pagey: e.pageY,
			leny: lensParam.y,
			lenr: lensParam.r
		};
	});
	$('#effcCtrl').mousedown(function (e) {
		effcLens = true;
		moveStart = {
			pagey: e.pageY,
			leny: lensParam.y,
			ratio: effectRatio
		};
	});
	$('#svg-area').mouseup(function (e) {
		if (moveLens) moveLens = false;
		if (zoomLens) zoomLens = false;
		if (effcLens) effcLens = false;
	});
	$('#svg-area').mousemove(function (e) {
		if (moveLens) {
			let moveX = e.pageX - moveStart.pagex;
			let moveY = e.pageY - moveStart.pagey;
			lensParam.x = moveStart.lenx + moveX;
			lensParam.y = moveStart.leny + moveY;
			drawLens();
			drawGrids();
		}
		if (zoomLens) {
			let moveY = moveStart.pagey - e.pageY;
			lensParam.r = moveStart.lenr + moveY;
			drawLens();
			drawGrids();
		}
		if (effcLens) {
			let moveY = 0.5 * (moveStart.pagey - e.pageY) / lensParam.r;
			effectRatio = moveStart.ratio + moveY;
			if (effectRatio < 0) effectRatio = 0;
			if (effectRatio > 1) effectRatio = 1;
			drawLens();
			drawGrids();
		}
	});
}
