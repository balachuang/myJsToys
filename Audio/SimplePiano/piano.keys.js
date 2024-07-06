// 创建新的音频上下文接口
window.AudioContext = window.AudioContext || window.webkitAudioContext;

const VOLUMN = 1;
const DURATION = 1;
let audioCtx = null;
let compressorNode = null;
var oscillatorAry = null;

let keyWidthInPx = 0;
let keyOffseInPx = 0;
let kbKeyId = '';
let kbOctave = 0;
let kbOctShift = 1;
let pressedKeys = [];

$(document).ready(init);
$(document).on('mouseenter', 'button', mouseEnter);
$(document).on('mouseleave', 'button', mouseLeave);
$(document).on('keydown', keyboardPressDn);
$(document).on('keyup', keyboardPressUp);
$(window).on('resize', generatePianoKeys);

function init()
{
	if (!window.AudioContext) { 
		alert('当前浏览器不支持Web Audio API');
		return;
	}

	audioCtx = new AudioContext();
	compressorNode = audioCtx.createDynamicsCompressor();
	compressorNode.connect(audioCtx.destination);

	// calculate all keys
	keyWidthInPx = $('#key-ruler').width();
	keyOffseInPx = $('#offset-ruler').width();
	$('#key-ruler').remove();
	$('#offset-ruler').remove();
	generatePianoKeys();

	$('#piano-configs').click();
}

function generatePianoKeys()
{
	// clear all keys
	$('button').remove();
	oscillatorAry = [];

	// generate white keys
	let keyCnt = Math.floor($('#piano-white-keys').width() / keyWidthInPx);
	let boundKeyCnt = Math.round((keyCnt - 7) / 2);
	let idxStart = 7 - (boundKeyCnt % 7);
	let octWStart = -Math.ceil(boundKeyCnt / 7);
	let octBStart = octWStart;
	for (let i=idxStart; i<idxStart + keyCnt; ++i)
	{
		let wkidx = i % 7;
		let keyText = WHITE_KEYS[wkidx].readName;
		let scaleDiff = WHITE_KEYS[wkidx].id + octWStart * 12;
		let freq = getScaleFrequency(scaleDiff, 'ISO');
		let keyId = 'oct_' + octWStart + '_nod_' + WHITE_KEYS[wkidx].nodeName;
		let html = generateKeyHtml(true, keyId, scaleDiff, freq, keyText)
		$('#piano-white-keys').append(html);
		if (wkidx == 6) ++octWStart;
	}

	// generate black keys --> start position can refer to white key.
	keyCnt = Math.floor(($('#piano-black-keys').width() - keyOffseInPx) / keyWidthInPx);
	for (let i=idxStart; i<idxStart + keyCnt; ++i)
	{
		let bkidx = i % 7;
		let keyText = JStringUtils.emptyIfNull(BLACK_KEYS[bkidx].readName);
		let scaleDiff = BLACK_KEYS[bkidx].id + octBStart * 12;
		let freq = getScaleFrequency(scaleDiff, 'ISO');
		let keyId = (!!BLACK_KEYS[bkidx].nodeName) ? 'oct_' + octBStart + '_nod_' + BLACK_KEYS[bkidx].nodeName.replace('#', 'u') : 'null';
		let htmlObj = $(generateKeyHtml(false, keyId, scaleDiff, freq, keyText));
		if (BLACK_KEYS[bkidx].readName == null) htmlObj.addClass('no-show');
		htmlObj.appendTo('#piano-black-keys');
		if (bkidx == 6) ++octBStart;
	}
}

function keyboardPressDn(e)
{
	e.preventDefault();
	e.stopPropagation();

	// 為了防止持續產生 keyboard event.
	var isRepeating = !!pressedKeys[e.which];
    pressedKeys[e.which] = true;

	if (!isRepeating && KEY_NODE_MAPPING[e.which])
	{
		kbKeyId = '#oct_' + (kbOctave * kbOctShift) + '_nod_' + KEY_NODE_MAPPING[e.which];
		pressPianoKey($(kbKeyId));
	}

	switch(e.which)
	{
		case !isRepeating && 37: // Arrow-Left
			kbOctave = -1;
			break;
		case !isRepeating && 39: // Arrow-Right
			kbOctave = 1;
			break;
		case !isRepeating && 38: // Arrow-Up
			kbOctShift = 2;
			break;
	}
}

function keyboardPressUp(e)
{
	e.preventDefault();
	e.stopPropagation();
	pressedKeys[e.which] = false;

	if (KEY_NODE_MAPPING[e.which])
	{
		kbKeyId = '#oct_' + (kbOctave * kbOctShift) + '_nod_' + KEY_NODE_MAPPING[e.which];
		releasePianoKey($(kbKeyId));
	}

	switch(e.which)
	{
		case 37: // Arrow-Left
		case 39: // Arrow-Right
			kbOctave = 0;
			break;
		case 38: // Arrow-Up
			kbOctShift = 1;
			break;
	}
}

function mouseEnter(e)
{
	if (!$('#opt_mouse').prop('checked')) return;
	pressPianoKey($(this));
}

function mouseLeave(e)
{
	if (!$('#opt_mouse').prop('checked')) return;
	releasePianoKey($(this));
}

function pressPianoKey(jqObj)
{
	if (jqObj.hasClass('no-show')) return;
	jqObj.addClass('active');

	// real-time calculate frequency
	let volumn = eval($('#volText').val());
	let baseFreq = eval($('#baseFreqText').val());
	let scaleDiff = eval(jqObj.attr('scaleDiff'));
	let frequency = getScaleFrequency(scaleDiff, baseFreq);
	let oscType = $('input.oscTypeRadio:checked').val();
	let isRampdown = $('#opt_rampdn').prop('checked');

	// create audioNodes
	var gainNode = audioCtx.createGain();
	gainNode.connect(compressorNode);
	gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
	gainNode.gain.linearRampToValueAtTime(volumn, audioCtx.currentTime + 0.05);
	if (isRampdown) gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + DURATION);

	oscillatorAry[scaleDiff] = audioCtx.createOscillator();
	oscillatorAry[scaleDiff].connect(gainNode);
	oscillatorAry[scaleDiff].type = oscType; // sine, square, sawtooth, triangle, custom
	oscillatorAry[scaleDiff].frequency.value = frequency;
	oscillatorAry[scaleDiff].start(audioCtx.currentTime);

	// set ramp down and stop after DURATION *2
	if (isRampdown) oscillatorAry[scaleDiff].stop(audioCtx.currentTime + DURATION *2);
}

function releasePianoKey(jqObj)
{
	if (jqObj.hasClass('no-show')) return;
	jqObj.removeClass('active');

	let scaleDiff = eval(jqObj.attr('scaleDiff'));
	let isRampdown = $('#opt_rampdn').prop('checked');

	// stop play if no ramp down
	if (!oscillatorAry[scaleDiff]) return;
	if (!isRampdown) {
		oscillatorAry[scaleDiff].stop();
		oscillatorAry[scaleDiff] = null;
	}
}

function generateKeyHtml(isWhiteKey, id, scaleDiff, freq, keyText)
{
	let keyClass = isWhiteKey ? 'white-keys' : 'black-keys';
	let keyTextClass = isWhiteKey ? 'white-key-text' : 'black-key-text';
	return KEY_TEMPLATE
			.replace('{id}', id)
			.replace('{keyClass}', keyClass)
			.replace('{keyTextClass}', keyTextClass)
			.replace('{scaleDiff}', scaleDiff)
			.replace('{frequency}', freq)
			.replace('{keyText}', keyText);
}
