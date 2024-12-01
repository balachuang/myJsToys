// Find best path by Dijkstra algorithm
// ref: 
//   https://ithelp.ithome.com.tw/articles/10209593
//   https://medium.com/@amber.fragments/%E6%BC%94%E7%AE%97%E6%B3%95-%E5%AD%B8%E7%BF%92%E7%AD%86%E8%A8%98-14-dijkstra-algorithm-%E6%9C%80%E7%9F%AD%E8%B7%AF%E5%BE%91%E6%BC%94%E7%AE%97%E6%B3%95-745983dd4332
//   https://zh.wikipedia.org/wiki/%E6%88%B4%E5%85%8B%E6%96%AF%E7%89%B9%E6%8B%89%E7%AE%97%E6%B3%95

var DEFAULT_X_NODE_CNT = 30;
var DEFAULT_Y_NODE_CNT = 10;
var DEFAULT_MIN_VAL = 1;
var DEFAULT_MAX_VAL = 100;
var DEFAULT_REMOVE_PATH_RATIO = 20;
var DEFAULT_SHOW_PATH_VALUE = true;
var MAX_VALUE = 10000000;

var nodes = [];
var paths = [];

let svgWidth = 0;
let svgHeight = 0;
let svhMargin = 20;
let svgTop = 160;

let xNodeInterval = 0;
let yNodeInterval = 0;

let pathWidthOnHover = 8;


function initializeDoc()
{
	// setup config panel
	$('#control-panel input[type="number"]').each(function(){
		let thisId = $(this).attr('id');
		let valAry = $(this).attr('quick-btn').split(',');
		let btnHtml = '';
		for (let n=0; n<valAry.length; ++n)
		{
			btnHtml += '<span class="value-btn" target-id="' + thisId + '" >' + valAry[n] + '</span>';
		}
		$(this).after(btnHtml + '<br>');
	});

	svgWidth = $(document).width() - svhMargin * 2;
	svgHeight = window.innerHeight - svhMargin - svgTop - 20;

	$('#svg-container').css({
		'top': svhMargin + svgTop,
		'left': svhMargin,
		'width': svgWidth,
		'height': svgHeight
	});
	$('#svg-area').attr({ 'viewBox': '0 0 ' + svgWidth + ' ' + svgHeight });

	$('.value-btn').click(function(){
		let thisVal = $(this).text();
		let targId = $(this).attr('target-id');
		$('#' + targId).val(thisVal);
		updateParameters();
	});

	$('#control-panel input').change(updateParameters);
	$('#control-panel input').keyup(updateParameters);
	$('#start').click(calculateBestPath);

	updateParameters();
}

// update parameters from gui, then re-create grid
function updateParameters()
{
	DEFAULT_X_NODE_CNT = Math.min(eval($('#node-count-x').val()), 100);
	DEFAULT_Y_NODE_CNT = Math.min(eval($('#node-count-y').val()), 100);
	DEFAULT_MIN_VAL = eval($('#min-value').val());
	DEFAULT_MAX_VAL = eval($('#max-value').val());
	DEFAULT_REMOVE_PATH_RATIO = eval($('#remove-path-ratio').val());
	DEFAULT_SHOW_PATH_VALUE = $('#show-path-value').is(':checked');

	xNodeInterval = (svgWidth - svhMargin*2) / (DEFAULT_X_NODE_CNT - 1);
	yNodeInterval = (svgHeight - svhMargin*2) / (DEFAULT_Y_NODE_CNT - 1);

	initialGrid();
	drawGrid();
}

// generate grid with initial values
function initialGrid()
{
	nodes = [];
	paths = [];

	// initial all path
	for (let y=0; y<DEFAULT_Y_NODE_CNT; ++y)
	{
		for (let x=0; x<DEFAULT_X_NODE_CNT; ++x)
		{
			let isBndry = isBoundary(x, y);
			let index = y * DEFAULT_X_NODE_CNT + x;

			// create node
			nodes.push({
				'xIdx': x,
				'yIdx': y,
				'confirmed': false,
				'bestPath': false
			});

			// create path (to right / down)
			if (x < DEFAULT_X_NODE_CNT-1)
			{
				// path to right
				paths.push({
					'nodeFrom': index,
					'nodeTo': y * DEFAULT_X_NODE_CNT + (x+1),
					'value': rdmValue(isBndry, false)
				});
			}
			if (y < DEFAULT_Y_NODE_CNT-1)
			{
				// path to down
				paths.push({
					'nodeFrom': index,
					'nodeTo': (y+1) * DEFAULT_X_NODE_CNT + x,
					'value': rdmValue(isBndry, false)
				});
			}
		}
	}
}

// draw grid
function drawGrid()
{
	$('#svg-area').empty();

	// let xInv = (svgWidth - svhMargin*2) / (DEFAULT_X_NODE_CNT - 1);
	// let yInv = (svgHeight - svhMargin*2) / (DEFAULT_Y_NODE_CNT - 1);

	// draw path first
	for (let i=0; i<paths.length; ++i)
	{
		let pathPos = calculatePathLocation(i);
		let pathStr = `M${pathPos.xPos1} ${pathPos.yPos1} L${pathPos.xPos2} ${pathPos.yPos2}`;
		let opt = (paths[i].value >= MAX_VALUE) ? 0 : 0.5 + 0.5 * (paths[i].value - DEFAULT_MIN_VAL) / (DEFAULT_MAX_VAL - DEFAULT_MIN_VAL);
		let sty = `stroke-width:2; stroke:white; stroke-opacity:${opt}`;
		$('#svg-area').append(makeSVG('path', {id:`p${i}`, d:pathStr, style: sty}));

		// create path text
		$('#svg-area').append(makeSVG('rect', {id:`pr${i}`, x:`${pathPos.xtPos}`, y:`${pathPos.ytPos}`, width:'0', height:'0', fill:'black'}));
		$('#svg-area').append(makeSVG('text', {id:`pt${i}`, x:`${pathPos.xtPos}`, y:`${pathPos.ytPos}`, fill:'lightgray'}));

		// update text path location
		updatePathText(i, pathPos);
	}

	// apply path click
	$('path').click(pathClickHandler);
	$('path').mouseenter(pathEnterHandler);
	$('path').mouseleave(pathLeaveHandler);

	// draw node
	for (let i=0; i<nodes.length; ++i)
	{
		let xPos = svhMargin + nodes[i].xIdx * xNodeInterval;
		let yPos = svhMargin + nodes[i].yIdx * yNodeInterval;
		$('#svg-area').append(makeSVG('circle', {id:`n${i}`, cx:xPos, cy:yPos, r:5}));
		updateNodeColor(i);
	}
}

// invoke Dijkstra to find the best path, then update to gui
function calculateBestPath()
{
	let pathFinder = new Dijkstra(updateNodeColor);
	let bestPath = pathFinder.findBestPath(nodes, paths, MAX_VALUE);

	// display best path
	let bestValue = 0;
	let currNode = bestPath.length - 1;
	let prevNode = bestPath[currNode];
	bestPath[currNode].bestPath = true;
	while (true)
	{
		bestPath[prevNode].bestPath = true;

		// find path
		let pathIdx = -1;
		for (let i=0; i<paths.length; ++i)
		{
			if ((paths[i].nodeFrom == prevNode) && (paths[i].nodeTo == currNode))
			{
				pathIdx = i;
				bestValue += paths[pathIdx].value;
				break;
			}
		}

		// update node & path color
		updateNodeColor(prevNode);
		$(`#p${pathIdx}`).css({'stroke-width':'5', 'stroke':'yellow', 'stroke-opacity':'1'});

		// next...
		if (prevNode == 0) break;
		currNode = prevNode;
		prevNode = bestPath[prevNode];
	}
	bestPath[0].bestPath = true;
	$('#start').text(`Best Path Value: ${bestValue}`);
}


// ==================== assistance functions

// generate random value of path
// - isBoundary: this path is boundary, force NO MAX
// - needPath: this path need value, force NO MAX --> used when manual click path
function rdmValue(isBoundary, needPath)
{
	// default 20% of no path
	if (!isBoundary && !needPath && (Math.random() < DEFAULT_REMOVE_PATH_RATIO / 100.0)) return MAX_VALUE;

	// return Random Integer: DEFAULT_MIN_VAL ~ DEFAULT_MAX_VAL
	let rndVal = Math.random() * ((DEFAULT_MAX_VAL+1) - DEFAULT_MIN_VAL);
	rndVal = Math.round(rndVal) + DEFAULT_MIN_VAL;
	if (rndVal == DEFAULT_MAX_VAL + 1) rndVal = DEFAULT_MIN_VAL;
	return rndVal;
}

function makeSVG(tag, attrs) {
	var el= document.createElementNS('http://www.w3.org/2000/svg', tag);
	for (var k in attrs) el.setAttribute(k, attrs[k]);
	return el;
}

// change node color by node type
function updateNodeColor(nodeIndex)
{
	if ((nodeIndex == 0) ||
		(nodeIndex == (nodes.length - 1)) ||
		nodes[nodeIndex].bestPath)
	{
		$(`#n${nodeIndex}`).attr({'fill':'yellow', 'stroke':'yellow'});
		return;
	}

	let nodeStrokeClr = nodes[nodeIndex].confirmed ? 'white' : 'white';
	let nodeFillClr = nodes[nodeIndex].confirmed ? 'white' : 'black';
	$(`#n${nodeIndex}`).attr({'fill':nodeFillClr, 'stroke':nodeStrokeClr});
}

// re-calculate path text location
function updatePathText(pathIdx, pathPos)
{
	if (!DEFAULT_SHOW_PATH_VALUE) return;

	// re-calculate all variables
	if (paths[pathIdx].value < MAX_VALUE)
	{
		$(`#pt${pathIdx}`).text(paths[pathIdx].value);

		let box = $(`#pt${pathIdx}`).get(0).getBoundingClientRect();
		$(`#pr${pathIdx}`).attr({'x': (pathPos.xtPos - box.width / 2), 'y':(pathPos.ytPos - box.height / 3 - 2), 'width':box.width, 'height':box.height});
		$(`#pt${pathIdx}`).attr({'x': (pathPos.xtPos - box.width / 2), 'y':(pathPos.ytPos + box.height / 3)});
	}else{
		$(`#pt${pathIdx}`).text('');
		$(`#pr${pathIdx}`).attr({'width':0, 'height':0});
	}
}

function calculatePathLocation(pathIdx)
{
	let xPos1 = svhMargin + nodes[paths[pathIdx].nodeFrom].xIdx * xNodeInterval;
	let yPos1 = svhMargin + nodes[paths[pathIdx].nodeFrom].yIdx * yNodeInterval;
	let xPos2 = svhMargin + nodes[paths[pathIdx].nodeTo].xIdx * xNodeInterval;
	let yPos2 = svhMargin + nodes[paths[pathIdx].nodeTo].yIdx * yNodeInterval;
	let xtPos = (xPos1 * 8 + xPos2 * 2) / 10;
	let ytPos = (yPos1 * 8 + yPos2 * 2) / 10;

	return {
		'xPos1': xPos1, 'yPos1': yPos1,
		'xPos2': xPos2, 'yPos2': yPos2,
		'xtPos': xtPos, 'ytPos': ytPos,
	};
}

function pathClickHandler()
{
	let pathId = $(this).attr('id');
	let pathIdx = eval(pathId.substring(1));
	if (isBoundary(nodes[paths[pathIdx].nodeFrom].xIdx, nodes[paths[pathIdx].nodeFrom].yIdx) &&
		isBoundary(nodes[paths[pathIdx].nodeTo].xIdx, nodes[paths[pathIdx].nodeTo].yIdx)) return;

	// toggle path value
	if (paths[pathIdx].value >= MAX_VALUE)
	{
		// current no path, add new path
		paths[pathIdx].value = rdmValue(false, true);
		let opt = 0.5 + 0.5 * (paths[pathIdx].value - DEFAULT_MIN_VAL) / (DEFAULT_MAX_VAL - DEFAULT_MIN_VAL);
		$('#' + pathId).css('stroke-opacity', `${opt}`);
		$('#' + pathId).css('stroke-dasharray', '');
	}else{
		// remove current path
		paths[pathIdx].value = MAX_VALUE;
		$('#' + pathId).css('stroke-opacity', '0');
		$('#' + pathId).css('stroke-dasharray', '');
	}

	// update text
	updatePathText(pathIdx, calculatePathLocation(pathIdx));
}

function pathEnterHandler()
{
	let pathId = $(this).attr('id');
	let pathIdx = eval(pathId.substring(1));
	if (isBoundary(nodes[paths[pathIdx].nodeFrom].xIdx, nodes[paths[pathIdx].nodeFrom].yIdx) &&
		isBoundary(nodes[paths[pathIdx].nodeTo].xIdx, nodes[paths[pathIdx].nodeTo].yIdx)) return;

	if (paths[pathIdx].value >= MAX_VALUE)
	{
		$(this).css('stroke-width', `${pathWidthOnHover}`);
		$(this).css('stroke-opacity', '0.3');
		$(this).css('stroke-dasharray', '5 2');
	}
	else $(this).css('stroke-width', '10');
}

function pathLeaveHandler()
{
	let pathId = $(this).attr('id');
	let pathIdx = eval(pathId.substring(1));
	if (isBoundary(nodes[paths[pathIdx].nodeFrom].xIdx, nodes[paths[pathIdx].nodeFrom].yIdx) &&
		isBoundary(nodes[paths[pathIdx].nodeTo].xIdx, nodes[paths[pathIdx].nodeTo].yIdx)) return;

	if (paths[pathIdx].value >= MAX_VALUE)
	{
		$(this).css('stroke-width', '2');
		$(this).css('stroke-opacity', '0');
		$(this).css('stroke-dasharray', '');
	}
	else $(this).css('stroke-width', '2');
}

function isBoundary(x, y)
{
	if ((x == 0) || (x == DEFAULT_X_NODE_CNT-1)) return true;
	if ((y == 0) || (y == DEFAULT_Y_NODE_CNT-1)) return true;
	return false;
}


$(document).ready(initializeDoc);
