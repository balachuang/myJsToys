const CONST_HEAD_ROTATE_COEF = 0.002;
const CONST_SECT_CNT = 20;
const CONST_SECT_LEN = 50;
const CONST_SWING_MAX_ANG = dia(20);
const CONST_TIME_INTERVAL = 10;	// ms
const CONST_SWING_CYCLE = 500;		// intreval count
const CONST_SWING_DELAY = 50;		// interval count

var headCircle = {x:0, y:0, radius:0};
let timeClock = 0;
let sectPoint = [];

window.onload = function()
{
	// set draw area and total length
	$('#svg-container').css({
		width: window.innerWidth,
		height: window.innerHeight
	});
	$('#svg-area').attr('viewBox', '0 0 ' + window.innerWidth + ' ' + window.innerHeight);
	$('#text-content').attr('textLength', CONST_SECT_CNT * CONST_SECT_LEN);

	headCircle.x = (window.innerWidth - CONST_SECT_CNT * CONST_SECT_LEN) / 2;
	headCircle.y = window.innerHeight / 2;
	headCircle.radius = Math.min(headCircle.x / 2, headCircle.y / 2);

	for (var n=0; n<CONST_SECT_CNT; ++n)
	{
		let point = {x:0, y:0};
		sectPoint.push(point)
	}

	setInterval(() => {
		updateTextPath();
	}, CONST_TIME_INTERVAL);
};

function updateTextPath()
{
	let head = {
		x: headCircle.x + headCircle.radius * Math.cos(CONST_HEAD_ROTATE_COEF * timeClock), 
		y: headCircle.y + headCircle.radius * Math.sin(CONST_HEAD_ROTATE_COEF * timeClock)
	};

	let newPath = 'M ' + xyPair(head);

	for (var n=0; n<CONST_SECT_CNT; ++n)
	{
		let delay = n * CONST_SWING_DELAY;
		let angle = CONST_SWING_MAX_ANG * Math.sin(Math.max(timeClock - delay, 0) * 2 * Math.PI / CONST_SWING_CYCLE);
		sectPoint[n].x = head.x + (CONST_SECT_LEN * (n + 0.5)) * Math.cos(angle);
		sectPoint[n].y = head.y + (CONST_SECT_LEN * (n + 0.5)) * Math.sin(angle);
	}

	let cent = {
		x: (sectPoint[0].x + sectPoint[1].x) / 2 ,
		y: (sectPoint[0].y + sectPoint[1].y) / 2
	}
	newPath += ' Q ' + xyPair(sectPoint[0]) + ' ' + xyPair(cent);
	for (var n=1; n<CONST_SECT_CNT-1; ++n)
	{
		cent.x = (sectPoint[n].x + sectPoint[n+1].x) / 2;
		cent.y = (sectPoint[n].y + sectPoint[n+1].y) / 2;
		newPath += ' Q ' + xyPair(sectPoint[n]) + ' ' + xyPair(cent);
	}
	newPath += ' Q ' + xyPair(sectPoint[CONST_SECT_CNT-1]) + ' ' + xyPair(sectPoint[CONST_SECT_CNT-1]);

	$('#timeT-text-path').attr('d', newPath);

	timeClock += 1;
}

function xyPair(xy) {
	return xy.x + ' ' + xy.y;
}

function dia(ang) {
	return ang * Math.PI / 180;
}
