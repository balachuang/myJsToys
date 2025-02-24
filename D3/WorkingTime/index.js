
let timeStrOffset = 0;
let xScale = null;
let yScale = null;
let workColorScale = null;
let restColorScale = null;
let prevLeftSec = -1;

let showShadow = false;
let shadowCnt = 5;
let maxShadow = 0.5;
let minShadow = 0.01;
let prevPath = [];


$(document).ready(initD3);

function initD3() {

	// init D3
	let lineWidth = window.innerWidth / 2;
	let lineHeight = 60;
	let lineXCent = window.innerWidth / 2;
	let lineYCent = window.innerHeight / 2;
	svgObj = d3.select('#svg-area')
		.style('width', lineWidth)
		.style('height', lineHeight)
		.style('left', lineXCent - lineWidth / 2)
		.style('top', lineYCent - lineHeight / 2);

	// set d3 scale
	let biTimeStr = '0000:0000000:0000000:0000000';
	let totalWorkTime = (4 * 24 + 9) * 3600; // Mon. 09:00 ~ Fri. 18:00
	let totalRestTime = (2 * 24 + 15) * 3600; // Fri. 18:00 ~ Mon. 09:00
	xScale = d3.scaleLinear()
		.domain([0, biTimeStr.length + 2])
		.range([0, lineWidth]);
	yScale = d3.scaleBand()
		.domain([-1, 0, 1])
		.range([1 * lineHeight, 0.25 * lineHeight]);
	workColorScale = d3.scaleLinear()
		.domain([totalWorkTime, 0])
		.range([0, 255]);
	restColorScale = d3.scaleLinear()
		.domain([totalRestTime, 0])
		.range([0, 255]);

	// create an initial path
	let leftBiAry = getTimeBiAry(biTimeStr);
	svgObj.append('path')
		.attr('id', 'primary')
		.attr('fill', 'none')
		.attr('stroke', 'white')
		.attr('stroke-width', '2')
		.attr('stroke-oopacity', 0.5)
		.attr('d', drawTimeLine(d3.path(), leftBiAry));
	for (let n = 0; n < shadowCnt; ++n) {
		let id = `shadow-${n}`;
		prevPath.push([]);
		svgObj.append('path')
			.attr('id', id)
			.attr('fill', 'none')
			.attr('stroke', 'none')
			.attr('stroke-width', '0')
			.attr('stroke-oopacity', 0.1)
			.attr('d', drawTimeLine(d3.path(), leftBiAry));
	}

	$('#clockStr').css({
		width: lineWidth,
		left: lineXCent - lineWidth / 2,
		top: lineYCent + lineHeight / 2 + $('#clockStr').height() / 2
	});
	$('#clockDis').css({
		width: lineWidth,
		left: lineXCent - lineWidth / 2,
		top: lineYCent - lineHeight / 2 - $('#clockStr').height() * 1.5
	});
	$('#svg-area').mouseenter(function () {
		showShadow = true;
		prevPath.forEach((p, idx) => svgObj.select(`path#shadow-${idx}`).attr('stroke-width', '2'));
	});
	$('#svg-area').mouseleave(function () {
		showShadow = false;
		prevPath.forEach((p, idx) => svgObj.select(`path#shadow-${idx}`).attr('stroke-width', '0'));
	});

	// start timer
	setInterval(updateTimer, 1000);
}

function updateTimer() {

	// get current time and end time
	let now = new Date();
	let endTime = getEndTime();
	let isWorking = (endTime.getDay() == 5);

	// get time list in Binary format
	let timeLeft = (endTime - now) / 1000;
	let dyLeft = Math.floor(timeLeft / 86400);
	let hrLeft = Math.floor((timeLeft - dyLeft * 86400) / 3600);
	let miLeft = Math.floor((timeLeft - dyLeft * 86400 - hrLeft * 3600) / 60);
	let ssLeft = Math.floor(timeLeft - dyLeft * 86400 - hrLeft * 3600 - miLeft * 60);
	let dyLeft2 = dyLeft.toString(2).padStart(4, '0');
	let hrLeft2 = hrLeft.toString(2).padStart(7, '0');
	let miLeft2 = miLeft.toString(2).padStart(7, '0');
	let ssLeft2 = ssLeft.toString(2).padStart(7, '0');
	let leftBiStr = `${dyLeft2}:${hrLeft2}:${miLeft2}:${ssLeft2}`;
	let leftBiAry = getTimeBiAry(leftBiStr);
	let colorB = isWorking ? workColorScale(0) - workColorScale(timeLeft) : restColorScale(timeLeft);
	let colorY = isWorking ? workColorScale(timeLeft) : restColorScale(0) - restColorScale(timeLeft);

	// draw timer by D3
	svgObj.select('path#primary')
		.attr('stroke', `rgba(${colorY},${colorY},${colorB},1)`)
		.transition()
		.attr('d', drawTimeLine(d3.path(), leftBiAry));

	for (let idx = prevPath.length - 1; idx >= 0; --idx) {
		let pid = `path#shadow-${idx}`;
		let opps = maxShadow - (idx + 1) * (maxShadow - minShadow) / prevPath.length;
		let color = `rgba(${colorY},${colorY},${colorB},${opps})`;
		svgObj.select(pid)
			.attr('stroke', color)
			.transition()
			.attr('d', drawTimeLine(d3.path(), prevPath[idx]));
		prevPath[idx] = (idx == 0) ? leftBiAry.slice(0) : prevPath[idx - 1].slice(0);
	}

	let leftStr = isWorking
		? `You still need to work as a dog for ${dyLeft} days, ${hrLeft} hours, ${miLeft} minutes and ${ssLeft} seconds.`
		: `Remaining happy time: ${dyLeft} days, ${hrLeft} hours, ${miLeft} minutes and ${ssLeft} seconds.`;
	$('#clockStr').text(leftStr);
	$('#clockDis').text(leftBiStr);

	prevLeftSec = ssLeft;
}

function getEndTime() {

	let now = new Date();
	let w = now.getDay();
	let h = now.getHours();
	let endTime = new Date(now);
	endTime.setMinutes(0);
	endTime.setSeconds(0);
	switch (w) {
		case 0:
			endTime.setDate(endTime.getDate() + 1);
			endTime.setHours(9);
			break;
		case 6:
			endTime.setDate(endTime.getDate() + 2);
			endTime.setHours(9);
			break;
		case 1:
			if (h >= 9) {
				endTime.setHours(9);
			} else {
				endTime.setDate(endTime.getDate() + 4);
				endTime.setHours(18);
			}
			break;
		case 5:
			if (h < 18) {
				endTime.setHours(18);
			} else {
				endTime.setDate(endTime.getDate() + 3);
				endTime.setHours(9);
			}
			break;
		default:
			endTime.setDate(endTime.getDate() + (5 - w));
			endTime.setHours(18);
			break;
	}

	return endTime;
}

function drawTimeLine(context, timeStr) {
	timeStr.forEach((val, idx) => {
		if (idx == 0) {
			context.moveTo(xScale(idx), yScale(val));
		} else if (idx == timeStr.length - 1) {
			context.lineTo(xScale(idx), yScale(timeStr[idx - 1]));
			context.lineTo(xScale(idx), yScale(val));
			context.lineTo(xScale(idx + 1), yScale(val));
		} else {
			context.lineTo(xScale(idx), yScale(timeStr[idx - 1]));
			context.lineTo(xScale(idx), yScale(val));
		}
	});
	return context;
}

function getTimeBiAry(biTimeStr) {

	if (timeStrOffset > 0)
		biTimeStr =
			biTimeStr.substring(timeStrOffset) +
			biTimeStr.substring(0, timeStrOffset);
	timeStrOffset = (timeStrOffset + 1) % 28;

	biTimeStr = ':' + biTimeStr + ':';

	let timeBiAry = [];
	biTimeStr.split('').forEach(function (b) {
		if (b == '0') timeBiAry.push(-1);
		if (b == '1') timeBiAry.push(1);
		if (b == ':') timeBiAry.push(0);
	});

	return timeBiAry;
}