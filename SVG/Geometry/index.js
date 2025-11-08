//...
$(document).ready(initDocuemnt);

function initDocuemnt()
{
	// initialize Canvas
	cvs = $('#geoArea');
	cvsW = cvs.width();
	cvsH = $(window).height() - 80;
	cvs.height(cvsH);

	// draw
	renderGeometry();
}


function renderGeometry()
{
	const p1 = new SimplePoint();
	let p2 = new SimplePoint(200, 100);

	addSvgLine('test', p1, p2);
}

function addSvgLine(id, start, end) {
	var vo = makeSVG('line', { id: id, x1: start.x, y1: start.y, x2: end.x, y2: end.y });
	$('#geoArea').append(vo);
}

function makeSVG(tag, attrs) {
	var el = document.createElementNS('http://www.w3.org/2000/svg', tag);
	for (var k in attrs) el.setAttribute(k, attrs[k]);
	return el;
}