let CONST_HEAD_ROTATE_COEF = 0.005;
let CONST_SECT_CNT = 25;
let CONST_SECT_LEN = 40;
let CONST_SWING_MAX_ANG = dia(10);
let CONST_TIME_INTERVAL = 10;		// ms
let CONST_SWING_CYCLE = 100;		// intreval count
let CONST_SWING_DELAY = 5;		// interval count
let CONST_SHOW_SECTION = false;		// interval count

let headCircle = {x:0, y:0, radius:0};
let timeClock = 0;
let sectPoint = [];

let intObj = null;

window.onload = function()
{
	// setup config panel
	$('#config-panel input[type="number"]').each(function(){
		let thisId = $(this).attr('id');
		let valAry = $(this).attr('quick-btn').split(',');
		let btnHtml = '';
		for (let n=0; n<valAry.length; ++n)
		{
			btnHtml += '<span class="value-btn" target-id="' + thisId + '" >' + valAry[n] + '</span>';
		}
		$(this).after(btnHtml + '<br>');
	});

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

	$('.value-btn').click(function(){
		let thisVal = $(this).text();
		let targId = $(this).attr('target-id');
		$('#' + targId).val(thisVal);
		updateParameters();
	});

	$('#config-panel input').change(updateParameters);
	$('#config-panel input').keyup(updateParameters);

	intObj = setInterval(() => {
		updateTextPath();
	}, CONST_TIME_INTERVAL);
};

function updateTextPath()
{
	$('.swing-section-pnt').remove();

	let head = {
		x: headCircle.x + headCircle.radius * Math.cos(CONST_HEAD_ROTATE_COEF * timeClock), 
		y: headCircle.y + headCircle.radius * Math.sin(CONST_HEAD_ROTATE_COEF * timeClock / 2)
	};

	let newPath = 'M ' + xyPair(head);

	for (var n=0; n<CONST_SECT_CNT; ++n)
	{
		let delay = n * CONST_SWING_DELAY;
		let angle = CONST_SWING_MAX_ANG * Math.sin(Math.max(timeClock - delay, 0) * 2 * Math.PI / CONST_SWING_CYCLE);
		sectPoint[n].x = head.x + (CONST_SECT_LEN * (n + 0.5)) * Math.cos(angle);
		sectPoint[n].y = head.y + (CONST_SECT_LEN * (n + 0.5)) * Math.sin(angle);

		// draw section
		if (CONST_SHOW_SECTION)
		{
			var vo = makeSVG('circle', 	{cx:sectPoint[n].x, cy:sectPoint[n].y, r:5, class:'swing-section-pnt'});
			$('#svg-area').append(vo);
		}
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

function updateInputValue(objId, objValue)
{
	console.log(objId + '=' + objValue);
	$('#' + objId).val(objValue);
}

function updateParameters()
{
	CONST_HEAD_ROTATE_COEF = $('#const-head-rotate-coef').val();
	CONST_SECT_CNT = $('#const-sect-cnt').val();
	CONST_SECT_LEN = $('#const-sect-len').val();
	CONST_SWING_MAX_ANG = dia($('#const-swing-max-ang').val());
	CONST_TIME_INTERVAL = $('#const-time-interval').val();
	CONST_SWING_CYCLE = $('#const-swing-cycle').val() / CONST_TIME_INTERVAL;
	CONST_SWING_DELAY = $('#const-swing-delay').val() / CONST_TIME_INTERVAL;
	CONST_SHOW_SECTION = $('#show-section').is(':checked');

	clearInterval(intObj);
	intObj = setInterval(() => {
		updateTextPath();
	}, CONST_TIME_INTERVAL);
}

function makeSVG(tag, attrs) {
	var el= document.createElementNS('http://www.w3.org/2000/svg', tag);
	for (var k in attrs) el.setAttribute(k, attrs[k]);
	return el;
}