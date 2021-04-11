const CONST_X_COUNT = 20;
const CONST_Y_COUNT = 10;
const CONST_WEEK_NAME = ['Sun.','Mon.','Tue.','Wed.','Thu.','Fri.','Sat.'];
const CONST_HEAD_ROTATE_SPEED = 0.1;

var headCircle = {x:0, y:0, radius:0};
var head = {x:0, y:0, angle:0, clockwise:true};
var section1 = {length:0, angle:0, maxAngle:30};
var section2 = {length:0, angle:0, maxAngle:30};

window.onload = function()
{
	$('#svg-container').css({
		width: window.innerWidth,
		height: window.innerHeight
	});
	$('#svg-area').attr('viewBox', '0 0 ' + window.innerWidth + ' ' + window.innerHeight);

	headCircle.x = window.innerWidth / 4;
	headCircle.y = window.innerHeight / 2;
	headCircle.radius = Math.min(window.innerWidth / 8, window.innerHeight / 4);

	$('#text-content').text(currentTime());

	setInterval(() => {
		$('#text-content').text(currentTime());
	}, 1000);

	setInterval(() => {
		updateTextPath();
	}, 10);

//	$(document).mousemove(mousemoveHandler);
};

function updateTextPath()
{
	head.x = headCircle.x + headCircle.radius * Math.cos(head.angle * Math.PI / 180);
	head.y = headCircle.y + headCircle.radius * Math.sin(head.angle * Math.PI / 180);
	let sect1 = {
		x : head.x + 300,
		y : head.y - 150
	}
	let sect2 = {
		x : sect1.x + 300,
		y : head.y + 150
	}
	let tail = {
		x : sect2.x + 300,
		y : head.y
	}

	let newPath = 'M ' + xyPair(head) + ' C ' + xyPair(sect1) + ' ' + xyPair(sect2) + ' ' + xyPair(tail);
	$('#timeT-text-path').attr('d', newPath);

	head.angle = (head.angle + CONST_HEAD_ROTATE_SPEED) % 360;
}

function mousemoveHandler(event)
{
	$('.floating-box').each(function(){
		let thisId = $(this).attr('id');
		let deltaX = (boxCenter[thisId].x - event.pageX) / 30;
		let deltaY = (boxCenter[thisId].y - event.pageY) / 30;
		let delta = Math.max(10, Math.max(Math.abs(deltaX), Math.abs(deltaY)));
	
		$(this).css({
			'box-shadow' : deltaX+'px '+deltaY+'px '+delta+'px '+delta+'px rgb(214, 214, 214)'
		});
	});
}

function currentTime()
{
	let now = new Date();
	let yyyy = now.getFullYear();
	let mm = numberToString(now.getMonth(), 2);
	let dd = numberToString(now.getDate(), 2);
	let hr = numberToString(now.getHours(), 2);
	let mi = numberToString(now.getMinutes(), 2);
	let ss = numberToString(now.getSeconds(), 2);
	let ww = now.getDay();

	let timeStr = yyyy + '-' + mm + '-' + dd + ' (' + CONST_WEEK_NAME[ww] + ') ' + hr + ':' + mi + ':' + ss;
	return timeStr;
}

function numberToString(number, digital)
{
	return ('000' + number).slice(-1 * digital);
}

function xyPair(xy)
{
	return xy.x + ' ' + xy.y;
}