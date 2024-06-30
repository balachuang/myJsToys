// 音階
const CENTRAL_A_IDX = 69;
const CENTRAL_A_FRQ_ISO = 440;
const CENTRAL_A_FRQ_NAT = 432;

// 12 Equal Temperament
const OCTAVE_INFO_12 = [
	{ id: -9, name: 'C', read: 'Do', half: false },
	{ id: -8, name: 'C', read: 'Do', half: true  },
	{ id: -7, name: 'D', read: 'Re', half: false },
	{ id: -6, name: 'D', read: 'Re', half: true  },
	{ id: -5, name: 'E', read: 'Mi', half: false },
	{ id: -4, name: 'F', read: 'Fa', half: false },
	{ id: -3, name: 'F', read: 'Fa', half: true  },
	{ id: -2, name: 'G', read: 'So', half: false },
	{ id: -1, name: 'G', read: 'So', half: true  },
	{ id:  0, name: 'A', read: 'La', half: false },
	{ id:  1, name: 'A', read: 'La', half: true  },
	{ id:  2, name: 'B', read: 'Si', half: false },
];

let FREQ_OPT_HTML = '<li><a class="dropdown-item opt-frequency" href="#" singingName="{singingName}" noteName="{noteName}" frequency="{frequency}" freqIndex="{freqIndex}">{optionText}</a></li>';
let FREQ_ROW_HTML =
	'<tr style="vertical-align: baseline;">' +
	'	<td>' +
	'		<div class="input-group mb-3">' +
	'			<button class="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">Octave</button>' +
	'			<ul class="dropdown-menu">' +
	'				<li><a class="dropdown-item opt-octave" href="#" octave="+2">Upper   (+2)</a></li>' +
	'				<li><a class="dropdown-item opt-octave" href="#" octave="+1">Upper   (+1)</a></li>' +
	'				<li><a class="dropdown-item opt-octave" href="#" octave=" 0">Central (0) </a></li>' +
	'				<li><a class="dropdown-item opt-octave" href="#" octave="-1">Lower   (-1)</a></li>' +
	'				<li><a class="dropdown-item opt-octave" href="#" octave="-2">Lower   (-2)</a></li>' +
	'			</ul>' +
	'			<input type="text" class="form-control curr-octv" aria-label="Octave" placeholder="Select Octave here" value="0" readonly>' +
	'		</div>' +
	'	</td>' +
	'	<td>' +
	'		<div class="input-group mb-3">' +
	'			<button class="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">Frequency</button>' +
	'			<ul class="dropdown-menu">' +
	'				{FreqOptions}' +
	'				<li><hr class="dropdown-divider"></li>' +
	'				<li><a class="dropdown-item opt-frequency" href="#" singingName="" noteName="" frequency="" freqIndex="-1">Free Key-in</a></li>' +
	'			</ul>' +
	'			<span class="input-group-text scale-name" style="display:none;"></span>' +
	'			<span class="input-group-text scale-read" style="display:none;"></span>' +
	'			<input type="text" class="form-control curr-freq" aria-label="Frequency" placeholder="Input freqency here" freqIndex="-1">' +
	'			<span class="input-group-text">Hz</span>' +
	'		</div>' +
	'	</td>' +
	'	<td>' +
	'		<div class="input-group mb-3">' +
	'			<button class="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">Duration</button>' +
	'			<ul class="dropdown-menu">' +
	'				<li><a class="dropdown-item opt-duration" href="#" duration=" 1.00">  1.00 </a></li>' +
	'				<li><a class="dropdown-item opt-duration" href="#" duration=" 2.00">  2.00 </a></li>' +
	'				<li><a class="dropdown-item opt-duration" href="#" duration=" 3.00">  3.00 </a></li>' +
	'				<li><a class="dropdown-item opt-duration" href="#" duration=" 5.00">  5.00 </a></li>' +
	'				<li><a class="dropdown-item opt-duration" href="#" duration="10.00"> 10.00 </a></li>' +
	'			</ul>' +
	'			<input type="text" class="form-control curr-dura" aria-label="Duration" placeholder="Input duration here">' +
	'			<span class="input-group-text">Sec</span>' +
	'		</div>' +
	'	</td>' +
	'	<td>' +
	'		<div class="form-check form-switch form-check-inline">' +
	'			<input class="form-check-input toggle-play-selection" type="checkbox" role="switch" style="float:right;">' +
	'		</div>' +
	'		<button class="btn btn-dark remove-this-row" type="button">' +
	'			<i data-feather="x-circle"></i>' +
	'		</button>' +
	'		<button class="btn btn-dark play-single-freq" type="button">' +
	'			<i data-feather="play"></i>' +
	'		</button>' +
	'	</td>' +
	'</tr>' ;
