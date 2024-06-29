// 创建新的音频上下文接口
var audioCtx = new AudioContext();

// 发出的声音频率数据，表现为音调的高低
let vLength = 0.5; // 音長
let freqA = [264, 297, 330, 352, 396, 440, 495, 528];
let freqB = [264, 297, 334.125, 396, 445.5, 528];
let freqC = [196.00, 220.00, 246.94, 261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25, 587.33, 659.25, 698.46, 783.99, 880.00, 987.77, 1046.50];
let freqGood = [285, 396, 417, 528, 639, 741, 852, 963];


window.AudioContext = window.AudioContext || window.webkitAudioContext;

$(document).ready(initAudio);
function initAudio()
{
    if (!window.AudioContext) { 
        alert('当前浏览器不支持Web Audio API');
        return;
    }

	// when click button
	$('#scale-A').click(function(){ playAudio(1, 0); });
	$('#scale-B').click(function(){ playAudio(2, musicScale.length-1); });
	$('#scale-C').click(function(){ playAudio(3, 0); });
	$('#scale-D').click(function(){ playAudio(4, musicScale.length-1); });
	$('#scale-52').click(function(){ playAudioSingle(52, 2, 3); });
	$('#scale-10').click(function(){ playAudioSingle(10, 2, 3); });
	$('#scale-10_52').click(function(){ playAudioFreqChange(20, 100, 2, 5); });
	$('#scale-196_880').click(function(){ playAudioFreqChange(196, 880, 0.2, 5); });
	$('#scale-432').click(function(){ playAudioFreqChange(432, 432, 0.5, 5); });
	$('#scale-440').click(function(){ playAudioFreqChange(440, 440, 0.5, 5); });
	$('#scale-525').click(function(){ playAudioFreqChange(525, 525, 0.5, 5); });
	$('#scale-528').click(function(){ playAudioFreqChange(528, 528, 0.5, 5); });
	$('#scale-Good').click(function(){ playAudio(5, 0); });
}

function playAudio(type, idx)
{
	if (type == 5) playAudioSingle(freqGood[idx], 0.3, vLength);
	else           playAudioSingle(musicScale[idx].freq, 0.1, vLength);

	let nxtIdx = 0;
	switch(type)
	{
	case 1:
		if (idx >= musicScale.length-1) return;
		nxtIdx = idx + 1;
		break;
	case 2:
		if (idx <= 0) return;
		nxtIdx = idx - 1;
		break;
	case 3:
		nxtIdx = idx + 1;
		while ((nxtIdx < musicScale.length-1) && (musicScale[nxtIdx].id * 10 % 10 == 5)) nxtIdx += 1;
		if (idx >= musicScale.length) return;
		break;
	case 4:
		nxtIdx = idx - 1;
		while ((nxtIdx > 0) && (musicScale[nxtIdx].id * 10 % 10 == 5)) nxtIdx -= 1;
		if (idx < 0) return;
		break;
	case 5:
		if (idx >= freqGood.length-1) return;
		nxtIdx = idx + 1;
		break;
	}

	setTimeout(() => {
		playAudio(type, nxtIdx);
	}, vLength * 1000);
}

function playAudioSingle(freq, vol, time)
{
	var gainNode = audioCtx.createGain();
	var now = audioCtx.currentTime;
	gainNode.connect(audioCtx.destination);
	gainNode.gain.setValueAtTime(0, now);
	gainNode.gain.linearRampToValueAtTime(vol, now + 0.01);
	// gainNode.gain.exponentialRampToValueAtTime(0.001, now + time);

	var oscillator = audioCtx.createOscillator();
	oscillator.connect(gainNode);
	oscillator.type = 'sine';
	oscillator.frequency.value = freq;
	oscillator.start(audioCtx.currentTime);
	oscillator.stop(audioCtx.currentTime + time);
}

function playAudioFreqChange(freq1, freq2, vol, time)
{
	var gainNode = audioCtx.createGain();
	var now = audioCtx.currentTime;
	gainNode.connect(audioCtx.destination);
	gainNode.gain.setValueAtTime(0, now);
	gainNode.gain.linearRampToValueAtTime(vol, now + 0.01);

	var oscillator = audioCtx.createOscillator();
	oscillator.connect(gainNode);
	oscillator.type = 'sine';
	oscillator.frequency.setValueAtTime(freq1, now);
	oscillator.frequency.linearRampToValueAtTime(freq2, now + time);
	oscillator.start(audioCtx.currentTime);
	oscillator.stop(audioCtx.currentTime + time);
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
