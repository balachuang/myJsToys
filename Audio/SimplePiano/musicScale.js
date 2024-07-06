// 音階
const CENTRAL_A_IDX = 69;
// const CENTRAL_A_FRQ_ISO = 440;
// const CENTRAL_A_FRQ_NAT = 432;

const KEY_TEMPLATE = '<button id="{id}" class="{keyClass}" scaleDiff="{scaleDiff}" frequency="{frequency}"><div class="{keyTextClass}">{keyText}</div></button>';
// const WHITE_KEY_TEMPLATE = '<button id="{id}" class="white-keys" scaleDiff="{scaleDiff}" frequency="{frequency}"><div class="white-key-text">{keyText}</div></button>';
// const BLACK_KEY_TEMPLATE = '<button id="{id}" class="black-keys" scaleDiff="{scaleDiff}" frequency="{frequency}"><div class="black-key-text">{keyText}</div></button>';

// 12 Equal Temperament
const WHITE_KEYS = [
	{ id: -9, nodeName: 'C', readName: 'Do' },
	{ id: -7, nodeName: 'D', readName: 'Re' },
	{ id: -5, nodeName: 'E', readName: 'Mi' },
	{ id: -4, nodeName: 'F', readName: 'Fa' },
	{ id: -2, nodeName: 'G', readName: 'So' },
	{ id:  0, nodeName: 'A', readName: 'La' },
	{ id:  2, nodeName: 'B', readName: 'Si' },
];

const BLACK_KEYS = [
	{ id: -8, nodeName: 'C#', readName: 'Do#' },
	{ id: -6, nodeName: 'D#', readName: 'Re#' },
	{ id: -0, nodeName: null, readName: null },
	{ id: -3, nodeName: 'F#', readName: 'Fa#' },
	{ id: -1, nodeName: 'G#', readName: 'So#' },
	{ id:  1, nodeName: 'A#', readName: 'La#' },
	{ id: -0, nodeName: null, readName: null },
];

let KEY_NODE_MAPPING = [];
KEY_NODE_MAPPING[65] =  'C';
KEY_NODE_MAPPING[83] =  'D';
KEY_NODE_MAPPING[68] =  'E';
KEY_NODE_MAPPING[70] =  'F';
KEY_NODE_MAPPING[71] =  'G';
KEY_NODE_MAPPING[72] =  'A';
KEY_NODE_MAPPING[74] =  'B';
KEY_NODE_MAPPING[87] = 'Cu';
KEY_NODE_MAPPING[69] = 'Du';
KEY_NODE_MAPPING[84] = 'Fu';
KEY_NODE_MAPPING[89] = 'Gu';
KEY_NODE_MAPPING[85] = 'Au';

let CEN_A_FREQ = [];
CEN_A_FREQ['ISO'] = 440; // ISO-xxxx
CEN_A_FREQ['NAT'] = 432; // Nature

// calculate frequency
function getScaleFrequency(scaleIndexDiff, centralFreq)
{
	if (typeof(centralFreq) != 'number') centralFreq = (!!CEN_A_FREQ[centralFreq]) ? CEN_A_FREQ[centralFreq] : CEN_A_FREQ['ISO'];
	let targetScaleFreq = centralFreq * Math.pow(2, (scaleIndexDiff) / 12);
	return targetScaleFreq.toFixed(2);
}
