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

let FREQ_OPT_HTML = '<li><a class="dropdown-item" href="#" displayVal="{displayVal}" targetVal="{targetVal}">{optionText}</a></li>';
let FREQ_ROW_HTML =
	'<tr>' +
	'	<td>' +
	'		<div class="form-check form-switch form-check-inline" style="margin-top:5px;">' +
	'			<input class="form-check-input toggle-play-selection" type="checkbox" role="switch" style="float:right;">' +
	'		</div>' +
	'	</td><td>' +
	'		<div class="input-group mb-3">' +
	'			<button class="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">Frequency</button>' +
	'			<ul class="dropdown-menu">' +
	'				{FreqOptions}' +
	'				<li><hr class="dropdown-divider"></li>' +
	'				<li><a class="dropdown-item" href="#" displayVal="" targetVal="">Free Key-in</a></li>' +
	'			</ul>' +
	'			<span class="input-group-text scale-name" style="display:none;"></span>' +
	'			<span class="input-group-text scale-read" style="display:none;"></span>' +
	'			<input type="text" class="form-control curr-freq" aria-label="Frequency" placeholder="Input freqency here">' +
	'			<span class="input-group-text">Hz</span>' +
	'		</div>' +
	'	</td><td>' +
	'		<div class="input-group mb-3">' +
	'			<button class="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">Duration</button>' +
	'			<ul class="dropdown-menu">' +
	'				<li><a class="dropdown-item" href="#" displayVal="Duration" targetVal=" 1.00">  1.00 </a></li>' +
	'				<li><a class="dropdown-item" href="#" displayVal="Duration" targetVal=" 2.00">  2.00 </a></li>' +
	'				<li><a class="dropdown-item" href="#" displayVal="Duration" targetVal=" 3.00">  3.00 </a></li>' +
	'				<li><a class="dropdown-item" href="#" displayVal="Duration" targetVal=" 5.00">  5.00 </a></li>' +
	'				<li><a class="dropdown-item" href="#" displayVal="Duration" targetVal="10.00"> 10.00 </a></li>' +
	'				<li><hr class="dropdown-divider"></li>' +
	'				<li><a class="dropdown-item" href="#" displayVal="Duration" targetVal="">Free Key-in</a></li>' +
	'			</ul>' +
	'			<input type="text" class="form-control curr-dura" aria-label="Duration" placeholder="Input duration here">' +
	'			<span class="input-group-text">Sec</span>' +
	'		</div>' +
	'	</td><td>' +
	'		<button class="btn btn-dark remove-this-row" type="button">' +
	'			<i data-feather="minus-square"></i>' +
	'		</button>' +
	'		<button class="btn btn-dark play-single-freq" type="button">' +
	'			<i data-feather="play"></i>' +
	'		</button>' +
	'	</td>' +
	'</tr>' ;
