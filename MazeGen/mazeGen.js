let svgContainer = null;
let svgLines = null;
let svgStart = null;
let svgEnd = null;
let svgCurr = null;
let svgWidth = 0;
let svgHeight = 0;
let gridWidth = 0;
let xOffset = 10;
let yOffset = 10;


$(document).ready(initDocuemnt);

function initDocuemnt() {

	// init div height
	svgContainer = $('#maze-container');
	svgLines = $('#maze-line-group');
	svgStart = $('#maze-start');
	svgEnd = $('#maze-end');
	svgCurr = $('#maze-curr');
	svgWidth = svgContainer.width();
	svgHeight = $(window).height() - 110;

	$('#maze-container').height(svgHeight);
	svgContainer.attr({
		'width': svgWidth,
		'height': svgHeight,
		'viewBox': '0 0 ' + svgWidth + ' ' + svgHeight
	});

	// Caculate fit size
	$('#optSize').click(function () {
		gridWidth = 10;
		let xSize = Math.floor((svgWidth - 2 * xOffset) / gridWidth);
		let ySize = Math.floor((svgHeight - 2 * yOffset) / gridWidth);
		$('#x-size').val(xSize);
		$('#y-size').val(ySize);
	});

	// setup click action
	$('#make').click(function () {

		console.log('clean maze');
		svgContainer.find('line').remove();

		console.log('create a new maze');
		let x = eval($('#x-size').val());
		let y = eval($('#y-size').val());
		let maze = new Maze(
			new MazePos(x, y),
			new MazePos(0, 0),
			new MazePos(x - 1, y - 1)
		);

		gridWidth = Math.floor(Math.min(
			(svgWidth - 2 * xOffset) / x,
			(svgHeight - 2 * yOffset) / y
		));
		let lineWidth = Math.max(Math.min(Math.floor(0.1 * gridWidth), 10), 1);
		svgLines.css({
			'stroke': 'Gold',
			'stroke-linecap': 'round',
			'stroke-width': lineWidth,
		});
		svgStart.attr({ 'x': -100, y: -100, 'width': gridWidth, 'height': gridWidth });
		svgEnd.attr({ 'x': -100, y: -100, 'width': gridWidth, 'height': gridWidth });
		svgCurr.attr({ 'x': -100, y: -100, 'width': gridWidth, 'height': gridWidth });

		console.log('set maze parameter');
		let intv = eval($('#intv').val());
		let showStep = $('#show-step').is(":checked");
		maze.setShowStep(showStep, intv);

		console.log('generate maze');
		maze.setRenderFnctions(renderMazeSvg, renderGridSvg, beforeRenderSvg, afterRenderSvg);
		maze.generate();
	});
}

function beforeRenderSvg() {
	svgCurr.show();
}

function afterRenderSvg() {
	svgCurr.hide();
}

function renderMazeSvg(mazeAry) {

	console.log('render maze');

	let xSize = mazeAry.length;
	let ySize = mazeAry[0].length;

	for (let y = 0; y < ySize; ++y) {
		for (let x = 0; x < xSize; ++x) {
			renderGridSvg(mazeAry[x][y]);
		}
	}
}

function renderGridSvg(mazeGrid) {

	// draw lines around this grid
	let xStart = xOffset + gridWidth * mazeGrid.pos.x;
	let yStart = yOffset + gridWidth * mazeGrid.pos.y;
	let xEnd = xStart + gridWidth;
	let yEnd = yStart + gridWidth;

	let id = `grid_${mazeGrid.pos.x}_${mazeGrid.pos.y}_`;
	let lftLine = $('#' + id + 'lft');
	let topLine = $('#' + id + 'top');
	let rgtLine = $('#' + id + 'rgt');
	let btmLine = $('#' + id + 'btm');

	// only first column/raw need to render left/top wall
	if (mazeGrid.pos.x == 0) {
		if (mazeGrid.wallLft && (lftLine.length <= 0)) addSvgLine(id + 'lft', new MazePos(xStart, yStart), new MazePos(xStart, yEnd));
		if (!mazeGrid.wallLft && (lftLine.length > 0)) lftLine.remove();
	}
	if (mazeGrid.pos.y == 0) {
		if (mazeGrid.wallTop && (topLine.length <= 0)) addSvgLine(id + 'top', new MazePos(xStart, yStart), new MazePos(xEnd, yStart));
		if (!mazeGrid.wallTop && (topLine.length > 0)) topLine.remove();
	}

	// render right and bottom lines
	if (mazeGrid.wallRgt && (rgtLine.length <= 0)) addSvgLine(id + 'rgt', new MazePos(xEnd, yStart), new MazePos(xEnd, yEnd));
	if (mazeGrid.wallBtm && (btmLine.length <= 0)) addSvgLine(id + 'btm', new MazePos(xStart, yEnd), new MazePos(xEnd, yEnd));
	if (!mazeGrid.wallRgt && (rgtLine.length > 0)) rgtLine.remove();
	if (!mazeGrid.wallBtm && (btmLine.length > 0)) btmLine.remove();

	// render special grid
	if (mazeGrid.isStart) svgStart.attr({ 'x': xStart, y: yStart });
	if (mazeGrid.isEnd) svgEnd.attr({ 'x': xStart, y: yStart });
	svgCurr.attr({ 'x': xStart, y: yStart });
}

function addSvgLine(id, start, end) {
	var vo = makeSVG('line', { id: id, x1: start.x, y1: start.y, x2: end.x, y2: end.y });
	svgLines.append(vo);
}

function makeSVG(tag, attrs) {
	var el = document.createElementNS('http://www.w3.org/2000/svg', tag);
	for (var k in attrs) el.setAttribute(k, attrs[k]);
	return el;
}