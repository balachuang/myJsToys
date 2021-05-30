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
let forceStop = false;

$(document).ready(initD3);

function initD3()
{
	// init D3
	svgObj = d3.select('#svg-area');

	initData();
	initBarChart();

	$('#reset').click(function(){
		$('rect').remove();
		$('#step-display-content').text('Click "Start" to sort...');
		stepNo = 0;

		DATA_COUNT = eval($('#data-count').val());
		initData();
		initBarChart();
	});
	$('#stop').click(function(){
		forceStop = true;
	});
	$('#start').click(function(){
		stepNo = 0;
		forceStop = false;
		ANIMATE_INTERVAL = eval($('#delay-time').val());

		let sortMethod = $('#sort-method').val();
		sort(sortMethod);
	});
}

function initData()
{
	data = [];
	for (var i=0; i<DATA_COUNT; ++i) data.push(10 + Math.round(990 * Math.random()));

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
	case 'Quick':
		sort_Quick(0, data.length-1);
		break;
	}
}

async function sort_Bubble()
{
	for (var end=data.length-2; end>=0; --end)
	{
		for (comp=0; comp<=end; ++comp)
		{
			swapByCompare(comp, comp+1);

			// update barchart and pause
			activeIdxs = [comp, comp+1];
			updateBarChart();
			await sleep(ANIMATE_INTERVAL);

			if (forceStop) break;
		}
		if (forceStop) break;
	}

	activeIdxs = [];
	updateBarChart()
	showMessage('Sorted Complete.');
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
		activeIdxs = [];
		updateBarChart()
		showMessage('Sorted Complete.');
	}
}

async function sort_QuickPartition(lft, rgt)
{
	let pivotVal = data[lft];

	swap(lft, rgt);

	// update barchart and pause
	activeIdxs = [lft, rgt];
	updateBarChart()
	await sleep(ANIMATE_INTERVAL);

	let storeIndex = lft;
	for (var i=lft; i<rgt; ++i)
	{
		if (data[i] < pivotVal)
		{
			swap(storeIndex, i);
			++storeIndex;

			// update barchart and pause
			activeIdxs = [storeIndex, i];
			updateBarChart()
			await sleep(ANIMATE_INTERVAL);
		}
		if (forceStop) break;
	}

	swap(storeIndex, rgt);
	return storeIndex;
}

async function swapByCompare(idx1, idx2)
{
	if (idx1 == idx2) return;

	showMessage('Compare: ('+idx1+') ' + data[idx1] + ' : ('+idx2+') ' + data[idx2]);
	if (data[idx1] > data[idx2]) swap(idx1, idx2);
	else showMessage('No Swap.');
}

async function swap(idx1, idx2)
{
	if (idx1 == idx2) return;

	var temp = data[idx1];
	data[idx1] = data[idx2];
	data[idx2] = temp;
	showMessage('Swap: ('+idx1+') ' + data[idx1] + ' : ('+idx2+') ' + data[idx2]);
}

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

function showMessage(msg)
{
	var msssage = $('#step-display-content').html() + '<br>' + (++stepNo) + ': ' + msg;
	$('#step-display-content').html(msssage);
	$('#step-display').scrollTop($('#step-display-content').height());
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