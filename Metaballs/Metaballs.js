let DEFAULT_X = 0;
let DEFAULT_Y = 0;
let DEFAULT_R = 50;
let META_AREA_RADIUS = 5;
let DEFAULT_META_THRESHOLD = 0.5;

let REALTIME = true;
let DISPLAY_CTRL_BALL = true

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

	if (REALTIME) generateMetaballArea();
	event.preventDefault();
}

function releaseCtrlBall(event)
{
	selectedBall = null;
	selectedBallId = -1;
	generateMetaballArea();
}

function updateParameters()
{
	DEFAULT_R = eval($('#control-ball-radius').val());
	META_AREA_RADIUS = eval($('#metaball-area-ptsize').val());
	DEFAULT_META_THRESHOLD = eval($('#metaball-threshold').val());

	REALTIME = $('#real-time').is(':checked');
	DISPLAY_CTRL_BALL = $('#display-ctrl-ball').is(':checked');

	if (DISPLAY_CTRL_BALL)	$('.ctrl-ball').removeClass('hide');
	else					$('.ctrl-ball').addClass('hide');
	generateMetaballArea();
}

function addBall()
{
	let newBall = {
		x: DEFAULT_X,
		y: DEFAULT_Y,
		r: DEFAULT_R
	}
	balls.push(newBall);

	let ballId = (balls.length - 1);
	let ballClass = DISPLAY_CTRL_BALL ? 'ctrl-ball' : 'ctrl-ball hide';
	var vo = makeSVG('circle', 	{id: ballId, cx:newBall.x, cy:newBall.y, r:newBall.r, class:ballClass});

	$('#svg-area').append(vo);

	generateMetaballArea();
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
	for (let sx=minPoint.x; sx<=maxPoint.x; sx+=META_AREA_RADIUS)
	{
		for (let sy=minPoint.y; sy<=maxPoint.y; sy+=META_AREA_RADIUS)
		{
			strengh = 0;
			let p = {x: sx, y: sy, r:META_AREA_RADIUS};
			for (let n=0; n<balls.length; ++n) strengh += META_FUNC(p, balls[n]);
			if (strengh >= DEFAULT_META_THRESHOLD) {
				p.r = 2 * META_AREA_RADIUS * Math.atan(strengh) / Math.PI;
				var vo = makeSVG('circle', 	{cx:p.x, cy:p.y, r:p.r, class:'metaball-point'});
				$('#svg-area').append(vo);
			}
		}
	}
}

function generateMetaballBoundary()
{

}

function xyPair(xy) {
	return xy.x + ' ' + xy.y;
}

function dia(ang) {
	return ang * Math.PI / 180;
}

function makeSVG(tag, attrs) {
	var el= document.createElementNS('http://www.w3.org/2000/svg', tag);
	for (var k in attrs) el.setAttribute(k, attrs[k]);
	return el;
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
