// 创建新的音频上下文接口
let audioCtx = new AudioContext();
window.AudioContext = window.AudioContext || window.webkitAudioContext;

const VOL = 1;
let compressorNode = null;

$(document).ready(init);

function init()
{
	if (!window.AudioContext) { 
		alert('当前浏览器不支持Web Audio API');
		return;
	}

	compressorNode = audioCtx.createDynamicsCompressor();
	compressorNode.connect(audioCtx.destination);

	// initial first row
	addNewRow();

	// update target icon color, reference: https://feathericons.com/
	$('#play-selected-freq svg').attr('stroke', 'gray');
	$('#play-selected-freq svg').attr('fill', 'gray');
	$('#play-selected-freq-in-seq svg').attr('stroke', 'gray');

	// register event handler
	$('#add-new-row').click(addNewRow);
	$(document).on('click', 'a.opt-octave', updateOctaveInput);
	$(document).on('click', 'a.opt-frequency', updateFrequencyInput);
	$(document).on('click', 'a.opt-duration', updateDurationInput);
	$(document).on('click', '.remove-this-row', function(){ $(this).closest('tr').remove(); });
	$(document).on('click', '.toggle-play-selection', updatePlaySelection);
	$(document).on('click', '.play-single-freq', playSingleFreq);
	$(document).on('click', '#play-selected-freq', playMultipleFreq);
	$(document).on('click', '#play-selected-freq-in-seq', playMultipleFreqInSeq);
	$(document).on('keydown', 'input.curr-freq', resetFreqInput);
}

function updateOctaveInput()
{
	let octave = $(this).attr('octave');
	$(this).closest('div').find('input').val(octave);

	let currFreqIndex = eval($(this).closest('tr').find('input.curr-freq').attr('freqIndex'));
	if (currFreqIndex == -1) return;

	let scaleNum = CENTRAL_A_IDX + OCTAVE_INFO_12[currFreqIndex].id;
	let scaleFreq = CENTRAL_A_FRQ_ISO * Math.pow(2, (scaleNum - CENTRAL_A_IDX) / 12);
	let currFreq = scaleFreq * Math.pow(2, eval(octave));
	$(this).closest('tr').find('input.curr-freq').val(currFreq.toFixed(2));
}

function updateFrequencyInput(row)
{
	let currOctave = eval($(this).closest('tr').find('input.curr-octv').val());
	let frequency = eval($(this).attr('frequency')) * Math.pow(2, currOctave);
	let freqIndex = $(this).attr('freqIndex');
	let nameText = $(this).attr('noteName');
	let readText = $(this).attr('singingName');
	$(this).closest('div').find('input').val(frequency);
	$(this).closest('div').find('input').attr('freqIndex', freqIndex);
	if (frequency == '') {
		$(this).closest('div').find('span.scale-name').hide();
		$(this).closest('div').find('span.scale-read').hide();
	}else{
		$(this).closest('div').find('span.scale-name').text(nameText);
		$(this).closest('div').find('span.scale-read').text(readText);
		$(this).closest('div').find('span.scale-name').show();
		$(this).closest('div').find('span.scale-read').show();
	}
}

function updateDurationInput()
{
	let duration = $(this).attr('duration');
	$(this).closest('div').find('input').val(duration);
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
						.replace('{singingName}', read)
						.replace('{noteName}',    name)
						.replace('{frequency}',   scaleFreq.toFixed(2))
						.replace('{freqIndex}',   n)
						.replace('{optionText}',  read);
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
		$('#play-selected-freq svg').attr('fill', 'currentColor');
		$('#play-selected-freq-in-seq svg').attr('stroke', 'currentColor');
	}else{
		$('#play-selected-freq svg').attr('stroke', 'gray');
		$('#play-selected-freq svg').attr('fill', 'gray');
		$('#play-selected-freq-in-seq svg').attr('stroke', 'gray');
	}
}

function resetFreqInput()
{
	$(this).attr('freqIndex', -1);
	$(this).closest('div').find('span.scale-name').hide();
	$(this).closest('div').find('span.scale-read').hide();
}

function playSingleFreq()
{
	playRow($(this).closest('tr').index());
}

function playMultipleFreqInSeq(seq)
{
	if (typeof(seq) != 'number') seq = 0;
	let switches = $('.toggle-play-selection');
	if (seq >= switches.length) return;
	if (!switches[seq].checked) {
		playMultipleFreqInSeq(seq+1);
		return;
	}

	setTimeout(
		function(){ playMultipleFreqInSeq(seq+1); },
		playRow(seq) * 1000);
}

function playMultipleFreq()
{
	let switches = $('.toggle-play-selection');
	for (let n=0; n<switches.length; ++n) {
		if (switches[n].checked) playRow(n);
	}
}

function playRow(rowIdx)
{
	// prepare audio parameters
	let rowDom = $('tbody tr').eq(rowIdx);
	let frequency = eval(rowDom.find('input.curr-freq').val());
	let duration = eval(rowDom.find('input.curr-dura').val());
	if (!frequency || !duration) return;

	// setup display
	rowDom.addClass('table-active');

	// create audioNodes
	var gainNode = audioCtx.createGain();
	gainNode.connect(compressorNode);
	// gainNode.connect(audioCtx.destination);
	gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
	gainNode.gain.linearRampToValueAtTime(VOL, audioCtx.currentTime + 0.05);
	gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

	var oscillator = audioCtx.createOscillator();
	oscillator.connect(gainNode);
	oscillator.type = 'sine'; // sine, square, sawtooth, triangle, custom
	oscillator.frequency.value = frequency;
	oscillator.start(audioCtx.currentTime);
	oscillator.stop(audioCtx.currentTime + duration *2);

	setTimeout(function(){ rowDom.removeClass('table-active') }, duration * 1000);

	return duration;
}
