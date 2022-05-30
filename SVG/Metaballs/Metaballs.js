// Still some bugs...

let DEFAULT_X = 0;
let DEFAULT_Y = 0;
let DEFAULT_R = 50;
let BOUNDARY_RES = 10;
let AREA_PNT_SIZE = 5;
let INIT_MOVEMENT = 20;
let BOUNDARY_RESOLUTION = 10;
let BOUNDARY_PNT_SIZE = 3;
let DEFAULT_META_THRESHOLD = 0.5;

let REALTIME = true;
let DISPLAY_CTRL_BALL = true
let DISPLAY_MEAT_AREA = true;
let DISPLAY_MERA_BNDY = true;

let META_FUNC = MFS_R2;

let balls = [];
let selectedBall = null;
let selectedBallId = -1;

$(document).ready(function()
{
	// setup config panel
	$('#control-panel input[type="number"]').each(function(){
		let thisId = $(this).attr('id');
		let valAry = $(this).attr('quick-btn').split(',');
		let btnHtml = '';
		for (let n=0; n<valAry.length; ++n)
		{
			btnHtml += '<span class="value-btn" target-id="' + thisId + '" >' + valAry[n] + '</span>';
		}
		$(this).after(btnHtml + '<br>');
	});

	DEFAULT_X = window.innerWidth / 2;
	DEFAULT_Y = window.innerHeight / 2;

	$('#svg-container').css({
		width: window.innerWidth,
		height: window.innerHeight 
	});
	$('#svg-area').attr('viewBox', '0 0 ' + window.innerWidth + ' ' + window.innerHeight);

	$('#add-ball').click(addBall);

	$(document).on('mousedown', '.ctrl-ball', selectCtrlBall);
	$(document).on('mousemove', 'body',      moveCtrlBall);
	$(document).on('mouseup',   '.ctrl-ball', releaseCtrlBall);

	$('.value-btn').click(function(){
		let thisVal = $(this).text();
		let targId = $(this).attr('target-id');
		$('#' + targId).val(thisVal);
		updateParameters();
	});

	$('#control-panel input').change(updateParameters);
	$('#control-panel input').keyup(updateParameters);
});

function selectCtrlBall(event)
{
	selectedBall = $(this);
	selectedBallId = selectedBall.attr('id');

	balls[selectedBallId].x = event.pageX;
	balls[selectedBallId].y = event.pageY;

	selectedBall.attr('cx', balls[selectedBallId].x);
	selectedBall.attr('cy', balls[selectedBallId].y);

	if (REALTIME) $('.metaball-point').remove();
}

function moveCtrlBall(event)
{
	if (selectedBall == null) return;

	balls[selectedBallId].x = event.pageX;
	balls[selectedBallId].y = event.pageY;

	selectedBall.attr('cx', balls[selectedBallId].x);
	selectedBall.attr('cy', balls[selectedBallId].y);

	if (REALTIME)
	{
		if (DISPLAY_MEAT_AREA) generateMetaballArea();
		if (DISPLAY_MERA_BNDY) generateMetaballBoundary();
	}

	event.preventDefault();
}

function releaseCtrlBall(event)
{
	selectedBall = null;
	selectedBallId = -1;

	if (DISPLAY_MEAT_AREA) generateMetaballArea();
	if (DISPLAY_MERA_BNDY) generateMetaballBoundary();
}

function updateParameters()
{
	DEFAULT_R = eval($('#control-ball-radius').val());
	AREA_PNT_SIZE = eval($('#metaball-area-ptsize').val());
	BOUNDARY_RESOLUTION = eval($('#metaball-boundaty-resolution').val());
	BOUNDARY_PNT_SIZE = eval($('#metaball-boundaty-ptsize').val());
	DEFAULT_META_THRESHOLD = eval($('#metaball-threshold').val());

	REALTIME = $('#real-time').is(':checked');
	DISPLAY_CTRL_BALL = $('#display-ctrl-ball').is(':checked');
	DISPLAY_MEAT_AREA = $('#display-metaball-area').is(':checked');
	DISPLAY_MERA_BNDY = $('#display-metaball-boundary').is(':checked');

	if (DISPLAY_CTRL_BALL)	$('.ctrl-ball').removeClass('hide');
	else					$('.ctrl-ball').addClass('hide');

	$('.metaball-point').remove();
	if (DISPLAY_MEAT_AREA) generateMetaballArea();

	$('.boundary').remove();
	if (DISPLAY_MERA_BNDY) generateMetaballBoundary();
}

function addBall()
{
	let newBall = {
		x: DEFAULT_X,
		y: DEFAULT_Y,
		r: DEFAULT_R,
		isBdryCovered: false
	}
	balls.push(newBall);

	let ballId = (balls.length - 1);
	let ballClass = DISPLAY_CTRL_BALL ? 'ctrl-ball' : 'ctrl-ball hide';
	var vo = makeSVG('circle', 	{id: ballId, cx:newBall.x, cy:newBall.y, r:newBall.r, class:ballClass});

	$('#svg-area').append(vo);

	if (DISPLAY_MEAT_AREA) generateMetaballArea();
	if (DISPLAY_MERA_BNDY) generateMetaballBoundary();
}

function generateMetaballArea()
{
	if (balls.length <= 0) return;

	$('.metaball-point').remove();

	let minPoint = {x:balls[0].x, y:balls[0].y};
	let maxPoint = {x:balls[0].x, y:balls[0].y};
	for (let n=0; n<balls.length; ++n) {
		let bx = balls[n].x;
		let by = balls[n].y;
		let br = balls[n].r;

		if (minPoint.x > bx - 2 * br/DEFAULT_META_THRESHOLD) minPoint.x = bx - 2 * br/DEFAULT_META_THRESHOLD;
		if (minPoint.y > by - 2 * br/DEFAULT_META_THRESHOLD) minPoint.y = by - 2 * br/DEFAULT_META_THRESHOLD;
		if (maxPoint.x < bx + 2 * br/DEFAULT_META_THRESHOLD) maxPoint.x = bx + 2 * br/DEFAULT_META_THRESHOLD;
		if (maxPoint.y < by + 2 * br/DEFAULT_META_THRESHOLD) maxPoint.y = by + 2 * br/DEFAULT_META_THRESHOLD;
	}

	let strengh = 0;
	for (let sx=minPoint.x; sx<=maxPoint.x; sx+=AREA_PNT_SIZE)
	{
		for (let sy=minPoint.y; sy<=maxPoint.y; sy+=AREA_PNT_SIZE)
		{
			strengh = 0;
			let p = {x: sx, y: sy, r:AREA_PNT_SIZE};
			for (let n=0; n<balls.length; ++n) strengh += META_FUNC(p, balls[n]);
			if (strengh >= DEFAULT_META_THRESHOLD) {
				p.r = 2 * AREA_PNT_SIZE * Math.atan(strengh) / Math.PI;
				var vo = makeSVG('circle', 	{cx:p.x, cy:p.y, r:p.r, class:'metaball-point'});
				$('#svg-area').append(vo);
			}
		}
	}
}

function generateMetaballBoundary()
{
	if (balls.length <= 0) return;

	// clear all boundaries
	$('.boundary').remove();
	$('.boundary-ptn').remove();
	for (var n=0; n<balls.length; ++n) balls[n].isBdryCovered = false;

	let nextBallIdx = 0;
	while(nextBallIdx >= 0)
	{
		generateMetaballBoundaryFromBall(nextBallIdx);

		// find next uncovered ball
		nextBallIdx = -1;
		for (var n=0; n<balls.length; ++n) {
			if (!balls[n].isBdryCovered) {
				nextBallIdx = n;
				break;
			}
		}
	}
}

function generateMetaballBoundaryFromBall(ballIdx)
{
	// create a single boundary point
	let boundary = [{
		x:balls[ballIdx].x + balls[ballIdx].r,
		y:balls[ballIdx].y,
		gradient: {x:0, y:0},
		movement: INIT_MOVEMENT,
		lastStnDiff: 0,
		done:false
	}];

	// initialize boundery svg
	var svgBoundary = makeSVG('polygon', {class:'boundary', points:''});
	$('#svg-area').append(svgBoundary);

	// find next bounary point until close
	let boundaryClosed = false;
	while (!boundaryClosed)
	{
		// update current boundary position
		let n = boundary.length - 1;
		updateBoundaryPoint(boundary[n]);

		// find next boundary point
		let newPoint = findNextBoundaryPoint(boundary[n]);
		boundary.push(newPoint);

		// check if bounadry is closed
		boundaryClosed = checkBoundaryClose(boundary);

		if (boundary.length >= 1000) {
			console.log('boundary point count is abnormal: ' + boundary.length);
			boundaryClosed = true;
		}
	}

	// draw boundary
	updateBountdarySvg($(svgBoundary), boundary);
}

function updateBoundaryPoint(bnyPoint)
{
	if (bnyPoint.done) return;

	// calculate gradient, no need to recalculate gradient, all movements are in the same diection
	bnyPoint.gradient = {x:0, y:0};
	for (let c=0; c<balls.length; ++c)
	{
		let g = MFS_R2_DIF(bnyPoint, balls[c]);
		bnyPoint.gradient.x += g.x;
		bnyPoint.gradient.y += g.y;
	}
	let gradientLength = Math.sqrt(	bnyPoint.gradient.x*bnyPoint.gradient.x + 
									bnyPoint.gradient.y*bnyPoint.gradient.y );

	while(!bnyPoint.done)
	{
		// calculate M() of this boundary control point
		let strengh = 0;
		for (let c=0; c<balls.length; ++c) strengh += META_FUNC(bnyPoint, balls[c]);

		let strenghDiff = strengh - DEFAULT_META_THRESHOLD;
		if (Math.abs(strenghDiff) < DEFAULT_META_THRESHOLD / 30)
		{
			// this boundary control point is done
			bnyPoint.done = true;
		}
		else
		{
			if (strenghDiff * bnyPoint.lastStnDiff < 0) bnyPoint.movement /= 2;
			bnyPoint.lastStnDiff = strenghDiff;

			// calculate movement
			let dd = bnyPoint.movement / gradientLength;
			if (strenghDiff > 0)
			{
				// current M() > threshold
				bnyPoint.x -= dd * bnyPoint.gradient.x;
				bnyPoint.y -= dd * bnyPoint.gradient.y;
			}else{
				// current M() < threshold
				bnyPoint.x += dd * bnyPoint.gradient.x;
				bnyPoint.y += dd * bnyPoint.gradient.y;
			}
		}
	}
}

function findNextBoundaryPoint(bnyPoint)
{
	// find direction is vertical to gradient
	let findDirection = {
		x:  bnyPoint.gradient.y ,
		y: -bnyPoint.gradient.x
	};
	let gradientLength = Math.sqrt(	findDirection.x * findDirection.x + 
									findDirection.y * findDirection.y );

	let dd = BOUNDARY_RESOLUTION / gradientLength;
	let newPoint = {
		x: bnyPoint.x + dd * findDirection.x ,
		y: bnyPoint.y + dd * findDirection.y ,
		gradient: {x:0, y:0},
		movement: INIT_MOVEMENT,
		lastStnDiff: 0,
		done:false
	};

	return newPoint;
}

function checkBoundaryClose(boundary)
{
	// check if cover control balls
	let ballInBoundary = 0;
	for (var n=0; n<balls.length; ++n)
	{
		// return true if any one of balls in bounary
		if (isPointInBoundary(balls[n], boundary))
		{
			// also record check result
			balls[n].isBdryCovered = true;
			++ballInBoundary;
		}
	}
	if (ballInBoundary <= 0) return false;

	// check the last point close to the first point
	let l = boundary.length - 1;
	let xx = (boundary[0].x - boundary[l].x) * (boundary[0].x - boundary[l].x);
	let yy = (boundary[0].y - boundary[l].y) * (boundary[0].y - boundary[l].y);
	let dd = Math.sqrt(xx + yy);
	if (dd <= BOUNDARY_RESOLUTION) return true;

	return false;
}

function isPointInBoundary(point, boundary)
{
	// remove all points that y equals
	let chkBoundary = [];
	for (var n=0; n<boundary.length; ++n) {
		if (boundary[n].y != point.y) chkBoundary.push(boundary[n]);
	}
	if (chkBoundary.length <= 2) return false;

	// calculate cross count
	let crossCount = 0;
	for (var n=0; n<chkBoundary.length; ++n)
	{
		let m = (n+1) % chkBoundary.length;

		if ((chkBoundary[n].x < point.x) && (chkBoundary[m].x < point.x)) continue;

		if (((chkBoundary[n].y < point.y) && (chkBoundary[m].y > point.y)) ||
			((chkBoundary[n].y > point.y) && (chkBoundary[m].y < point.y)))
		{
			crossCount ++;
		}
	}

	// point in boundary if cross count is odd
	return ((crossCount%2) == 1);
}

function updateBountdarySvg(svgObj, boundary)
{
	//$('.boundary-ptn').remove();

	let bdrySvg = '';
	for (var n=0; n<boundary.length; ++n)
	{
		bdrySvg += xyPair(boundary[n]) + ' ';

		if (BOUNDARY_PNT_SIZE > 1) {
			var svgBdryPnt = makeSVG(	'circle',
										{	class:'boundary-ptn',
											cx: boundary[n].x,
											cy: boundary[n].y,
											r:BOUNDARY_PNT_SIZE
									});
			$('#svg-area').append(svgBdryPnt);
		}
	}
	svgObj.attr('points', bdrySvg);
}

function makeSVG(tag, attrs) {
	var el= document.createElementNS('http://www.w3.org/2000/svg', tag);
	for (var k in attrs) el.setAttribute(k, attrs[k]);
	return el;
}

function xyPair(xy) {
	return xy.x + ' ' + xy.y;
}

// metaball function of single control ball...
function MFS_R2(ptn, ctrl)
{
	let xx = ptn.x - ctrl.x;
	let yy = ptn.y - ctrl.y;
	if ((xx == 0) && (yy == 0)) return Number.MAX_SAFE_INTEGER;

	return ctrl.r * ctrl.r / (xx * xx + yy * yy);
}

// difference of MFS_R2 - for boundary finding
function MFS_R2_DIF(ptn, ctrl)
{
	let diff = {
		x:Number.MAX_SAFE_INTEGER,
		y:Number.MAX_SAFE_INTEGER
	};

	let xx = ptn.x - ctrl.x;
	let yy = ptn.y - ctrl.y;
	if ((xx == 0) && (yy == 0)) return diff;

	let zz = xx * xx + yy * yy;
	zz = zz * zz;
	diff = {
		x: -2 * xx * ctrl.r * ctrl.r / zz,
		y: -2 * yy * ctrl.r * ctrl.r / zz
	}
	return diff;
}
