const CONST_X_COUNT = 20;
const CONST_Y_COUNT = 10;
const CONST_WEEK_NAME = ['Sun.', 'Mon.', 'Tue.', 'Wed.', 'Thu.', 'Fri.', 'Sat.'];

const CONST_WE_HTML = '<span class="clock-text">$TimeStr$</span><br>                                    ' +
	'<span class="ratio-main" style="color:yellow;">$RatioInt$.$RatioDec$%</span><br>    ' +
	'<span class="ext-text" style="color:orange;">STOP THE FUCKING CLOCK !!!</span><br> ' +
	'<span class="ext-text">You have&nbsp;</span>                ' +
	'<span class="ext-text" style="color:orange;">&nbsp;$ExtText$&nbsp;</span>          ' +
	'<span class="ext-text">&nbsp;left.</span>                   ';

const CONST_WD_HTML = '<span class="clock-text">$TimeStr$</span><br>                                            ' +
	'<span class="ratio-main" style="color:$RatioColor1$;">$RatioInt$.$RatioDec$%</span><br>  ' +
	'<span class="ext-text">You have to be a dog for&nbsp;</span>        ' +
	'<span class="ext-text" style="color:$RatioColor2$;font-size:200%;">$ExtText2$</span>     ' +
	'<span class="ext-text">&nbsp;more day.</span>                       ';

window.onload = function () {
	$('#timeText').html(ratioHtml());
	$('#timeText').css({
		'top': window.innerHeight / 3 - $('#timeText').height() / 2,
		'left': (window.innerWidth - $('#timeText').width()) / 2
	});

	setInterval(() => {
		$('#timeText').html(ratioHtml());
	}, 1000);

	//    $(document).mousemove(mousemoveHandler);
};

function mousemoveHandler(event) {
	$('.floating-box').each(function () {
		let thisId = $(this).attr('id');
		let deltaX = (boxCenter[thisId].x - event.pageX) / 30;
		let deltaY = (boxCenter[thisId].y - event.pageY) / 30;
		let delta = Math.max(10, Math.max(Math.abs(deltaX), Math.abs(deltaY)));

		$(this).css({
			'box-shadow': deltaX + 'px ' + deltaY + 'px ' + delta + 'px ' + delta + 'px rgb(214, 214, 214)'
		});
	});
}

function ratioHtml() {
	let now = new Date();

	// test
	//now.setDate(now.getDate() + 1);

	let yyyy = now.getFullYear();
	let mm = now.getMonth();
	let dd = now.getDate();
	let hr = now.getHours();
	let mi = now.getMinutes();
	let ss = now.getSeconds();
	let ww = now.getDay();
	let timeStr =
		yyyy + '-' +
		format(mm, 2) + '-' +
		format(dd, 2) +
		' (' + CONST_WEEK_NAME[ww] + ') ' +
		format(hr, 2) + ':' +
		format(mi, 2) + ':' +
		format(ss, 2);

	console.log(timeStr);
	console.log(ww);
	let html = '';
	if ((ww == 0) || (ww == 6)) {
		// calculate ratio to workday
		let workStart = new Date();

		// test
		//workStart.setDate(now.getDate());

		if (ww == 0) workStart.setDate(workStart.getDate() + 1);
		if (ww == 6) workStart.setDate(workStart.getDate() + 2);
		workStart.setHours(0);
		workStart.setMinutes(0);
		workStart.setSeconds(0);

		let ratio = 100.0 * (workStart.getTime() - now.getTime()) / (2 * 86400000);
		let ratio_int = Math.round(ratio);
		let ratio_dec = ('' + ratio).split('.')[1].substring(0, 4);
		ratio = Math.round(ratio * 1000) / 1000.0;

		html = CONST_WE_HTML.replace('$TimeStr$', timeStr)
			.replace('$RatioInt$', ratio_int)
			.replace('$RatioDec$', ratio_dec)
			.replace('$ExtText$', (ww == 0 ? 'ONE happy day' : 'TWO happy days'));
	} else {
		// calculate ratio to weekend
		let todayStart = new Date();
		let todayEnd = new Date();

		// test
		//todayStart.setDate(now.getDate());
		//todayEnd.setDate(now.getDate());

		todayStart.setHours(7);
		todayStart.setMinutes(0);
		todayStart.setSeconds(0);
		todayEnd.setHours(19);
		todayEnd.setMinutes(0);
		todayEnd.setSeconds(0);

		// count only work time (07:00 ~ 19:00)
		if (now.getTime() > todayEnd.getTime()) now = todayEnd;

		let ratio_color = 'black';
		if (ww < 3) ratio_color = 'orange';
		else if (ww = 3) ratio_color = 'lightgray';
		else ratio_color = 'lightgreen';

		let ratio = 100.0 - 100.0 * (now.getTime() - todayStart.getTime() + (ww - 1) * 43200000) / (5 * 43200000);
		console.log(ratio);
		let ratio_int = Math.round(ratio);
		let ratio_dec = (ratio_int == ratio) ? '0000' : ('' + ratio).split('.')[1].substring(0, 4);
		ratio = Math.round(ratio * 1000) / 1000.0;

		html = CONST_WD_HTML.replace('$TimeStr$', timeStr)
			.replace('$RatioColor1$', ratio_color)
			.replace('$RatioColor2$', ratio_color)
			.replace('$RatioInt$', ratio_int)
			.replace('$RatioDec$', ratio_dec)
			.replace('$ExtText1$', '')
			.replace('$ExtText2$', 6 - ww);
	}
	return html;
}

function format(number, digital) {
	return ('000' + number).slice(-1 * digital);
}