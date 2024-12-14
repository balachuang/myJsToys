let sourceInfo = {x:0, y:0, vx:0, vy:0};
let listenerInfo = [];
let waveToListenerVel = [];
let listenerCnt = 3;

let svgWidth = 0;
let svgHeight = 0;
let svhMargin = 50;
let svgTop = 50;

let nodeRadius = 5;
let sourceMoveDis = 1;
let waveMoveDis = 4;
let currSrcMvX = 0;
let currSrcMvY = 0;
let waveId = 0;

let initFreq = 300;
let freqDiff = 100;

// 创建新的音频上下文接口
let VOL = 0.2;
let oscillator = [];
let compressorNode = null;
let audioCtx = new AudioContext();
window.AudioContext = window.AudioContext || window.webkitAudioContext;


$(document).ready(init);

function init()
{
	if (!window.AudioContext) { 
		alert('当前浏览器不支持Web Audio API');
		return;
	}

	// init SVG
	initSVGContainer();

	// init positions
	initNodes();

	// init audio
	$('#start-doppler').click(function(){
		if ($(this).text() == 'Play')
		{
			// init sound wave
			setInterval(addWave, 1000);
			setInterval(showWave, 100);

			// init audio
			compressorNode = audioCtx.createDynamicsCompressor();
			compressorNode.connect(audioCtx.destination);
			initAudioContext();

			$(this).text('Reset');
		}else{
			// reset
			location.reload();
		}
	});

	// register event handler
	$(document).on('click', 'circle.listener', toggleSound);
	$(document).on('keydown', moveSource);
	$(document).on('keyup', stopSource);
}

function initNodes()
{
	// store position in array for performance
	sourceInfo = {
		x : svgWidth / 2,
		y : svgHeight / 2,
		vx: 0,
		vy: 0
	};

	// update source display
	$('#source').attr({
		cx : sourceInfo.x,
		cy : sourceInfo.y,
		r  : nodeRadius
	});

	// update listeners display
	$('.listener').remove();
	for (let l=0; l<listenerCnt; ++l)
	{
		// store position in array for performance
		let lx = svhMargin + l * (svgWidth - svhMargin * 2) / (listenerCnt - 1);
		let ly = svgHeight - svhMargin;

		listenerInfo.push({ id:l, x:lx, y:ly, velocity:0, reached: false, active: false, isPlaying: false });
		$('#svg-area').append(makeSVG('circle', { id:'listener_' + l, class:'listener', cx:lx, cy:ly, r:nodeRadius }));
	}
}

function toggleSound()
{
	let idx = eval($(this).attr('id').substring(9));
	$(this).toggleClass('sound');
	listenerInfo[idx].active = $(this).hasClass('sound');

	console.log(`Turn listener[${idx}] ${listenerInfo[idx].active ? 'on' : 'off'}`);
}

function addWave()
{
	let idx = waveId++;

	// calculate velocity of this wave to each listener
	let vel = [];
	for (let l in listenerInfo)
	{
		let xDis = listenerInfo[l].x - sourceInfo.x;
		let yDis = listenerInfo[l].y - sourceInfo.y;
		let dist = Math.sqrt(xDis*xDis + yDis*yDis);
		let vxs = sourceInfo.vx * xDis / dist; // cos()
		let vys = sourceInfo.vy * yDis / dist; // sin()
		vel[l] = {distance: dist, velocity: vxs + vys, passed: false};
	}
	waveToListenerVel[idx] = vel;

	$('#svg-area').prepend(makeSVG('circle', {
		id: `wave_${idx}`,
		class: 'wave',
		cx : sourceInfo.x,
		cy : sourceInfo.y,
		r  : 0
	}));
}

function showWave()
{
	$('.wave').each(function(){
		let r = eval($(this).attr('r')) + waveMoveDis;
		if ((r > svgWidth) && (r > svgHeight))
		{
			$(this).remove();
			return;
		}
		$(this).attr('r', r);

		// update listener
		let waveId = eval($(this).attr('id').substring(5));
		for (let l in listenerInfo)
		{
			if (!waveToListenerVel[waveId][l].passed && (r >= waveToListenerVel[waveId][l].distance))
			{
				listenerInfo[l].reached = true;
				listenerInfo[l].velocity = waveToListenerVel[waveId][l].velocity;
				updateFreqency(l);
				waveToListenerVel[waveId][l].passed = true;
			}
		}
	});
}

function moveSource(event)
{
	switch(event.which)
	{
		case 37: // left
		case 65: // A
			sourceInfo.x -= sourceMoveDis;
			sourceInfo.vx = -sourceMoveDis;
			break;
		case 38: // up
		case 87: // W
			sourceInfo.y -= sourceMoveDis;
			sourceInfo.vy = -sourceMoveDis;
			break;
		case 39: // right
		case 68: // D
			sourceInfo.x += sourceMoveDis;
			sourceInfo.vx = sourceMoveDis;
			break;
		case 40: // down
		case 83: // S
			sourceInfo.y += sourceMoveDis;
			sourceInfo.vy = sourceMoveDis;
			break;
	}

	$('#source').attr('cx', sourceInfo.x);
	$('#source').attr('cy', sourceInfo.y);
}

function stopSource()
{
	sourceInfo.vx = 0;
	sourceInfo.vy = 0;
}

function initSVGContainer()
{
	// set SVG area
	svhMargin = 50;
	svgTop = 50;
	svgWidth = $(document).width() - svhMargin * 2;
	svgHeight = window.innerHeight - svhMargin * 2 - svgTop;

	$('#svg-container').css({
		'top': svhMargin + svgTop,
		'left': svhMargin,
		'width': svgWidth,
		'height': svgHeight
	});
	$('#svg-area').attr({ 'viewBox': '0 0 ' + svgWidth + ' ' + svgHeight });
}

function makeSVG(tag, attrs) {
	var el= document.createElementNS('http://www.w3.org/2000/svg', tag);
	for (var k in attrs) el.setAttribute(k, attrs[k]);
	return el;
}

function initAudioContext()
{
	for (let l in listenerInfo)
	{
		oscillator[l] = audioCtx.createOscillator();
		oscillator[l].type = 'sine'; // sine, square, sawtooth, triangle, custom
		oscillator[l].frequency.value = 300;
		oscillator[l].start(audioCtx.currentTime);
	}
}

function updateFreqency(listId)
{
	// if (!oscillator[listId]) return;

	// oscillator[listId].frequency.value = frequency;
	// oscillator[listId].frequency.setValueAtTime(frequency, audioCtx.currentTime);
	let frequency = initFreq + freqDiff * listenerInfo[listId].velocity;
	oscillator[listId].frequency.linearRampToValueAtTime(frequency, audioCtx.currentTime + 1);

	if ((listenerInfo[listId].active && listenerInfo[listId].reached) && !listenerInfo[listId].isPlaying)
	{
		let gain = audioCtx.createGain();
		gain.connect(compressorNode);
		gain.gain.setValueAtTime(0, audioCtx.currentTime);
		gain.gain.linearRampToValueAtTime(VOL, audioCtx.currentTime + 0.5);

		oscillator[listId].connect(gain);
		listenerInfo[listId].isPlaying = true;
	}

	if ((!listenerInfo[listId].active || !listenerInfo[listId].reached) && listenerInfo[listId].isPlaying)
	{
		let gain = audioCtx.createGain();
		gain.connect(compressorNode);
		gain.gain.setValueAtTime(1, audioCtx.currentTime);
		gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);

		oscillator[listId].disconnect();
		oscillator[listId].connect(gain);
		setTimeout(function(){ oscillator[listId].disconnect(); }, 500);
		listenerInfo[listId].isPlaying = false;
	}
}