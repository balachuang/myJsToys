// 创建新的音频上下文接口
var audioCtx = new AudioContext();
window.AudioContext = window.AudioContext || window.webkitAudioContext;

// 发出的声音频率数据，表现为音调的高低
let vLength = 0.5; // 音長
let freqA = [264, 297, 330, 352, 396, 440, 495, 528];
let freqB = [264, 297, 334.125, 396, 445.5, 528];
let freqC = [196.00, 220.00, 246.94, 261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25, 587.33, 659.25, 698.46, 783.99, 880.00, 987.77, 1046.50];
let freqGood = [285, 396, 417, 528, 639, 741, 852, 963];

$(document).ready(init);

function init()
{
	if (!window.AudioContext) { 
		alert('当前浏览器不支持Web Audio API');
		return;
	}

	// initial first row
	addNewRow();

	// update target icon color, reference: https://feathericons.com/
	$('#play-selected-freq svg').attr('stroke', 'gray');

	// register event handler
	$('#add-new-row').click(addNewRow);
	$(document).on('click', 'a.dropdown-item', updateInput);
	$(document).on('click', '.remove-this-row', function(){ $(this).closest('tr').remove(); });
	$(document).on('click', '.toggle-play-selection', updatePlaySelection);
	$(document).on('click', '.play-single-freq', playSingleFreq);
	$(document).on('click', '#play-selected-freq', playMultipleFreq);
}

function updateInput()
{
	let inputBoxText = $(this).attr('targetVal');
	let nameText = $(this).attr('displayVal');
	let readText = $(this).text();
	$(this).closest('div').find('input').val(inputBoxText);
	if (inputBoxText == '') {
		$(this).closest('div').find('span.scale-name').hide();
		$(this).closest('div').find('span.scale-read').hide();
	}else{
		$(this).closest('div').find('span.scale-name').text(nameText);
		$(this).closest('div').find('span.scale-read').text(readText);
		$(this).closest('div').find('span.scale-name').show();
		$(this).closest('div').find('span.scale-read').show();
	}
}

function addNewRow()
{
	let freqOpts = '';
	for (var n in OCTAVE_INFO_12)
	{
		let scaleNum = CENTRAL_A_IDX + OCTAVE_INFO_12[n].id;
		let scaleFreq = CENTRAL_A_FRQ_ISO * Math.pow(2, (scaleNum - CENTRAL_A_IDX) / 12);
		let name = OCTAVE_INFO_12[n].name + (OCTAVE_INFO_12[n].half ? '#' : '');
		let read = OCTAVE_INFO_12[n].read + (OCTAVE_INFO_12[n].half ? '#' : '');
		freqOpts += FREQ_OPT_HTML
						.replace('{targetVal}', scaleFreq.toFixed(2))
						.replace('{displayVal}', name)
						.replace('{optionText}', read);
	}
	$(FREQ_ROW_HTML.replace('{FreqOptions}', freqOpts)).insertBefore('#end-row');
	feather.replace(); // display icon
}

function updatePlaySelection()
{
	let hasSelection = false;
	let switches = $('.toggle-play-selection');
	for (let n=0; n<switches.length; ++n) {
		if (switches[n].checked) {
			hasSelection = true;
			break;
		}
	}

	if (hasSelection) {
		$('#play-selected-freq svg').attr('stroke', 'currentColor');
		$('#play-selected-freq svg').addClass('enable');
		$('#play-selected-freq svg').removeClass('disable');
	}else{
		$('#play-selected-freq svg').attr('stroke', 'gray');
		$('#play-selected-freq svg').addClass('disable');
		$('#play-selected-freq svg').removeClass('enable');
	}
}

function playSingleFreq()
{
	let freq = eval($(this).closest('tr').find('input.curr-freq').val());
	let dura = eval($(this).closest('tr').find('input.curr-dura').val());
	if (!freq || !dura) return;

	play(freq, dura, 1);
}

function playMultipleFreq()
{
	let switches = $('.toggle-play-selection');
	for (let n=0; n<switches.length; ++n) {
		if (switches[n].checked) {
			let freq = eval($(switches[n]).closest('tr').find('input.curr-freq').val());
			let dura = eval($(switches[n]).closest('tr').find('input.curr-dura').val());
			if (!freq || !dura) continue;

			play(freq, dura, 1);
		}
	}
}

function play(frequency, duration, volumn)
{
	var gainNode = audioCtx.createGain();
	var now = audioCtx.currentTime;
	gainNode.connect(audioCtx.destination);
	gainNode.gain.setValueAtTime(0, now);
	gainNode.gain.linearRampToValueAtTime(volumn, now + 0.05);
	gainNode.gain.exponentialRampToValueAtTime(0.01, now + duration);

	var oscillator = audioCtx.createOscillator();
	oscillator.connect(gainNode);
	oscillator.type = 'sine';
	oscillator.frequency.value = frequency;
	oscillator.start(audioCtx.currentTime);
	oscillator.stop(audioCtx.currentTime + duration *2);
}

// Reference...
// https://www.zhangxinxu.com/wordpress/2017/06/html5-web-audio-api-js-ux-voice/
//
// var oscillator = audioCtx.createOscillator();									// 创建一个OscillatorNode, 它表示一个周期性波形（振荡），基本上来说创造了一个音调
// var gainNode = audioCtx.createGain();											// 创建一个GainNode,它可以控制音频的总音量
// oscillator.connect(gainNode);													// 把音量，音调和终节点进行关联
// gainNode.connect(audioCtx.destination);											// audioCtx.destination返回AudioDestinationNode对象，表示当前audio context中所有节点的最终节点，一般表示音频渲染设备
// oscillator.type = 'sine';														// 指定音调的类型，其他还有square|triangle|sawtooth
// oscillator.frequency.value = ;													// 设置当前播放声音的频率，也就是最终播放声音的调调
// gainNode.gain.setValueAtTime(0, audioCtx.currentTime);							// 当前时间设置音量为0
// gainNode.gain.linearRampToValueAtTime(0.5, audioCtx.currentTime + 0.01);			// 0.01秒后音量为1
// oscillator.start(audioCtx.currentTime);											// 音调从当前时间开始播放
// gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1);		// 1秒内声音慢慢降低，是个不错的停止声音的方法
// oscillator.stop(audioCtx.currentTime + 1);										// 1秒后完全停止声音
