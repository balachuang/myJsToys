const BAR_MARGIN = 2;
const BAR_WIDTH = 6;
const BAR_AREA = 2 * BAR_MARGIN + BAR_WIDTH;

let DATA_COUNT = 10;
let ANIMATE_INTERVAL = 100;

let svgObj = null;
let scaleX = null;
let scaleY1 = null;
let scaleY2 = null;
let activeIdxs = null;
let data = null;

let stepNo = 0;
let startTime = 0;
let forceStop = false;

$(document).ready(initD3);

function initD3()
{
	// init D3
	svgObj = d3.select('#svg-area');

	initData();
	initBarChart();
	showEstimation();

	$('#reset').click(function(){ reset(); });
	$('#reset-a').click(function(){ reset('asc'); });
	$('#reset-d').click(function(){ reset('des'); });
	$('#stop').click(function(){
		forceStop = true;
	});
	$('#start').click(function(){
		stepNo = 0;
		forceStop = false;
		startTime = new Date();
		ANIMATE_INTERVAL = eval($('#delay-time').val());

		let sortMethod = $('#sort-method').val();
		sort(sortMethod);
	});

	$('#control-panel input').change(function(){ showEstimation(); });
	$('#control-panel select').change(function(){ showEstimation(); });
}

function reset(sort)
{
	$('rect').remove();
	$('#step-display-content').text('Click "Start" to sort...');
	stepNo = 0;

	DATA_COUNT = eval($('#data-count').val());
	initData(sort);
	initBarChart();
	showEstimation();
}

function initData(sort)
{
	data = [];
	for (var i=0; i<DATA_COUNT; ++i) data.push(10 + Math.round(990 * Math.random()));

	if (sort == 'asc') data.sort(function(a, b){return a - b});
	if (sort == 'des') data.sort(function(a, b){return b - a});

	scaleX = d3.scale.linear().domain([0, DATA_COUNT * BAR_AREA]).range([0, $('#svg-area').width()]);
	scaleY1 = d3.scale.linear().domain([0, d3.max(data)]).range([0, $('#svg-area').height()]); // use for Y-length
	scaleY2 = d3.scale.linear().domain([0, d3.max(data)]).range([$('#svg-area').height(), 0]); // use for Y-position
	scaleColor = d3.scale.linear().domain([0, d3.max(data)]).range([64, 224]); // use for Color
}

function initBarChart()
{
	svgObj.selectAll('rect')
		.data(data).enter()
		.append('rect')
		.attr({
			width: scaleX(BAR_WIDTH),
			height: function(val){ return scaleY1(val); },
			x: function(val, idx){ return scaleX(idx * BAR_AREA + BAR_MARGIN); },
			y: function(val){ return scaleY2(val); }
		})
		.style({
			fill: function(val){
				let c = scaleColor(val);
				return 'rgb(' + c + ',' + c + ',' + c + ')';
			},
			stroke: 'none'
		});
}

function updateBarChart()
{
	svgObj.selectAll('rect')
		.data(data)
		.attr({
			width: scaleX(BAR_WIDTH),
			height: function(val){ return scaleY1(val); },
			x: function(val, idx){ return scaleX(idx * BAR_AREA + BAR_MARGIN); },
			y: function(val){ return scaleY2(val); }
		})
		.style({
			fill: function(val, idx) {
				if (activeIdxs.indexOf(idx) >= 0)
				{
					return 'yellow';
				}else{
					let c = scaleColor(val);
					return 'rgb(' + c + ',' + c + ',' + c + ')';
				}
			},
			stroke: 'none'
		});
}

function sort(method)
{
	if (data == null) return;
	if (data.length <= 1) return;
	if (data.length == 2) return swapByCompare(0, 1);

	switch(method)
	{
	case 'Bubble':
		sort_Bubble();
		break;
	case 'Cocktail':
		sort_Cocktail();
		break;
	case 'Quick':
		sort_Quick(0, data.length-1);
		break;
	case 'Merge':
		sort_Merge(0, data.length-1, true);
		break;
	case 'Counting':
		sort_Counting();
		break;
	}
}

async function sort_Bubble()
{
	let rgtSwapCnt = 1;
	for (var end=data.length-2; end>=0; end -= rgtSwapCnt)
	{
		for (comp=0; comp<=end; ++comp)
		{
			let thisSwap = swapByCompare(comp, comp+1);
			rgtSwapCnt = thisSwap ? 1 : ++rgtSwapCnt;

			// update barchart and pause
			await updateAndBreak([comp, comp+1, end+1]);
			if (forceStop) break;
		}
		if (forceStop) break;
	}

	await updateAndBreak([]);
	showFinish();
}

async function sort_Cocktail()
{
	let unsortedIdx = {lft: 0, rgt: data.length-1};
	let swap = true;
	while(swap)
	{
		swap = false;

		// Head --> Tail
		let rgtSwapCnt = 1;
		for (var n=unsortedIdx.lft; n<unsortedIdx.rgt; ++n)
		{
			let thisSwap = swapByCompare(n, n+1);
			rgtSwapCnt = thisSwap ? 1 : ++rgtSwapCnt;
			swap = thisSwap || swap;

			// update barchart and pause
			await updateAndBreak([n, n+1, unsortedIdx.lft, unsortedIdx.rgt]);
			if (forceStop) break;
		}
		unsortedIdx.rgt -= rgtSwapCnt;

		// Tail --> Head
		let lftSwapCnt = 1;
		for (var n=unsortedIdx.rgt; n>unsortedIdx.lft; --n)
		{
			let thisSwap = swapByCompare(n-1, n);
			lftSwapCnt = thisSwap ? 1 : ++lftSwapCnt;
			swap = thisSwap || swap;

			// update barchart and pause
			await updateAndBreak([n-1, n, unsortedIdx.lft, unsortedIdx.rgt]);
			if (forceStop) break;
		}
		unsortedIdx.lft += lftSwapCnt;

		if (unsortedIdx.lft >= unsortedIdx.rgt) break;
	}

	await updateAndBreak([]);
	showFinish();
}

async function sort_Quick(lft, rgt)
{
	showMessage('Process: ' + lft + ' ~ ' + rgt);
	if (lft < rgt)
	{
		let pivotIdx = await sort_QuickPartition(lft, rgt);
		showMessage('Get Pivot: ' + pivotIdx);

		if (!forceStop) 
		{
			await sort_Quick(lft, pivotIdx - 1);
			await sort_Quick(pivotIdx + 1, rgt);
		}
	}

	if ((lft == 0) && (rgt == data.length-1))
	{
		await updateAndBreak([]);
		showFinish();
	}
}

async function sort_QuickPartition(lft, rgt)
{
	let pivotVal = data[lft];

	swap(lft, rgt);

	// update barchart and pause
	await updateAndBreak([lft, rgt]);

	let storeIndex = lft;
	for (var i=lft; i<rgt; ++i)
	{
		if (data[i] < pivotVal)
		{
			swap(storeIndex, i);
			++storeIndex;

			// update barchart and pause
			await updateAndBreak([lft, rgt, storeIndex, i]);
		}
		if (forceStop) break;
	}

	swap(storeIndex, rgt);
	return storeIndex;
}

async function sort_Merge(lft, rgt, isRoot)
{
	// pre-check, stop the recursive
	if (lft == rgt) return;
	if (lft + 1 == rgt)
	{
		swapByCompare(lft, rgt);
		await updateAndBreak([lft, rgt]);
		return;
	}

	showMessage('Devide ' + lft + ' ~ ' + rgt);
	await updateAndBreak([lft, rgt]);
	if (forceStop) return;

	// cut into 2 arrays and sort
	let cutIdx = Math.round((lft + rgt) / 2);
	await sort_Merge(lft, cutIdx - 1, false);
	await sort_Merge(cutIdx, rgt, false);

	// merge
	let insterIdx = lft;
	let lftIdx = lft;
	let rgtIdx = cutIdx;
	let tempData = Array.from(data);
	while ((lftIdx <= cutIdx - 1) && (rgtIdx <= rgt))
	{
		showMessage('Merge ' + lftIdx + ' & ' + rgtIdx);
		if (tempData[lftIdx] == tempData[rgtIdx])
		{
			data[insterIdx++] = tempData[lftIdx++];
			data[insterIdx++] = tempData[rgtIdx++];
			await updateAndBreak([lft, rgt, insterIdx-2]);
		}
		else if (tempData[lftIdx] < tempData[rgtIdx])
		{
			data[insterIdx++] = tempData[lftIdx++];
			await updateAndBreak([lft, rgt, insterIdx-1]);
		}
		else
		{
			data[insterIdx++] = tempData[rgtIdx++];
			await updateAndBreak([lft, rgt, insterIdx-1]);
		}
		if (forceStop) break;
	}

	if (lftIdx <= cutIdx - 1)
	{
		for (var n=lftIdx; n<=cutIdx - 1; ++n)
		{
			data[insterIdx++] = tempData[n];
			await updateAndBreak([insterIdx-1, n]);
			if (forceStop) break;
		}
	}

	if (rgtIdx <= rgt)
	{
		for (var n=rgtIdx; n<=rgt; ++n)
		{
			data[insterIdx++] = tempData[n];
			await updateAndBreak([insterIdx-1, n]);
			if (forceStop) break;
		}
	}

	if (isRoot)
	{
		await updateAndBreak([]);
		showFinish();
	}
}

async function sort_Counting()
{
	let coutingAry = new Array(1000);
	coutingAry.fill(0);

	let minValue = Number.MAX_SAFE_INTEGER;
	let maxValue = Number.MIN_SAFE_INTEGER;

	// counting
	for (var n=0; n<data.length; ++n)
	{
		if (minValue > data[n]) minValue = data[n];
		if (maxValue < data[n]) maxValue = data[n];

		++coutingAry[data[n]];

		showMessage('Count: ('+n+') ' + data[n]);
		await updateAndBreak([n]);
		if (forceStop) break;
	}

	// acumulate
	showMessage('Accumlating...');
	// let acc = coutingAry[minValue];
	for (var n=minValue+1; n<=maxValue; ++n)
	{
		coutingAry[n] += coutingAry[n-1];

		if (forceStop) break;
	}

	// re-fill
	let tempData = Array.from(data);
	for (var n=tempData.length-1; n>=0; --n)
	{
		let val = tempData[n];
		let idx = --coutingAry[val];
		data[idx] = val;

		showMessage('Re-fill: ('+idx+') ' + data[idx]);
		await updateAndBreak([idx]);
		if (forceStop) break;
	}

	await updateAndBreak([]);
	showFinish();
}

function swapByCompare(idx1, idx2)
{
	if (idx1 == idx2) return false;

	showMessage('Compare: ('+idx1+') ' + data[idx1] + ' : ('+idx2+') ' + data[idx2]);
	if (data[idx1] > data[idx2]) return swap(idx1, idx2);

	// showMessage('No Swap.');
	return false;
}

function swap(idx1, idx2)
{
	if (idx1 == idx2) return false;

	var temp = data[idx1];
	data[idx1] = data[idx2];
	data[idx2] = temp;
	showMessage('Swap: ('+idx1+') ' + data[idx1] + ' : ('+idx2+') ' + data[idx2]);

	return true;
}

async function updateAndBreak(activeBars)
{
	activeIdxs = activeBars;
	updateBarChart();
	await sleep(ANIMATE_INTERVAL);
}

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

function showMessage(msg)
{
	$('#step-display-content').append('<br>' + (++stepNo) + ': ' + msg);
	$('#step-display').scrollTop($('#step-display-content').height());
}

function showEstimation()
{
	DATA_COUNT = eval($('#data-count').val());
	ANIMATE_INTERVAL = eval($('#delay-time').val());
	let sortMethod = $('#sort-method').val();

	let totalCount = 0;
	let totalTime = 0;
	switch(sortMethod)
	{
	case 'Bubble':
		totalCount = DATA_COUNT * DATA_COUNT;
		break;
	case 'Cocktail':
		totalCount = DATA_COUNT * DATA_COUNT;
		break;
	case 'Quick':
		totalCount = Math.round(DATA_COUNT * Math.log2(DATA_COUNT));
		break;
	case 'Merge':
		totalCount = Math.round(DATA_COUNT * Math.log2(DATA_COUNT));
		break;
	case 'Counting':
		totalCount = DATA_COUNT * 2;
		break;
	}
	totalTime = totalCount * (10 + ANIMATE_INTERVAL) / 1000;
	$('#estimation').text('Estimated need ' + totalCount + ' steps, ' + totalTime + ' seconds.');
}

function showFinish()
{
	showMessage('Sorted Complete.');

	let endTime = new Date();
	let totalTime = (endTime - startTime) / 1000;
	$('#estimation').append('&nbsp;&nbsp;&nbsp;&nbsp;');
	$('#estimation').append('Acture need ' + stepNo + ' steps, ' + totalTime + ' seconds.');
}

function useless()
{
	// var line1 = d3.svg.line()
	// 				.x(function(val, idx) { return scaleX(idx * BAR_AREA + BAR_MARGIN);  })
	// 				.y(function(val)      { return scaleY1(val); });

	// var line2 = d3.svg.line()
	// 				.x(function(val, idx) { return scaleX(idx * BAR_AREA + BAR_MARGIN);  })
	// 				.y(function(val)      { return scaleY2(val); });

	// svgObj.append('path')
	// 	.attr({
	// 		'd': line1(data),
	// 		'stroke':'white',
	// 		'fill':'none'
	// 	});
	// svgObj.append('path')
	// 	.attr({
	// 		'd': line2(data),
	// 		'stroke':'yellow',
	// 		'fill':'none'
	// 	});
}