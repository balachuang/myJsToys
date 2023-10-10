const cos30 = 0.866;
const sin30 = 0.5;
const cos60 = 0.5;
const margin = 10;

let hexSize = 10;
let hexDist = 3;
let hexCenterArray = null;

let ViewDim = { x: 0, y: 0 };
let hexCount = { x: 0, y: 0 }
let cursorPox = { x: 0, y: 0 }

$(document).ready(function()
{
	$('input').change(function(){
		calculateHexagon();
		createSvgHexagons();
		setCursor();
		$(this).blur();
	});

	$('html').keydown(keyEventHandler);

	ViewDim = {
		x: window.innerWidth - 2*margin,
		y: window.innerHeight - 2*margin - 40
	};

	$('#svg-container').css({width: ViewDim.x, height: ViewDim.y });
	$('#svg-area').attr({
		'width'   : ViewDim.x,
		'height'  : ViewDim.y,
		'viewBox' : `0 0 ${ViewDim.x} ${ViewDim.y}`
	});

	calculateHexagon();
	createSvgHexagons();
	setCursor();
});

// pre-calculate all positions of hexagons center
function calculateHexagon()
{
	hexSize = eval($('#hexagon-size').val());
	hexDist = eval($('#hexagon-dist').val());
	let rcos30 = hexSize * cos30;
	let rcos60 = hexSize * cos60;
	let dcos30 = hexDist * cos30;

	// calculate hexagon count
	hexCount.x = Math.floor((ViewDim.x + hexDist - rcos30) / (2*rcos30 + hexDist));
	hexCount.y = Math.floor(1 + (ViewDim.y - 2*hexSize) / (hexSize + rcos60 + dcos30));

	// prepare positions
	let posX_Od = new Array(hexCount.x);
	let posX_Ev = new Array(hexCount.x);
	let posY = new Array(hexCount.y);

	posX_Ev[0] = rcos30;
	posX_Od[0] = 2 * rcos30 + hexDist/2;
	for (let i=1; i<hexCount.x; ++i) {
		posX_Ev[i] = posX_Ev[i-1] + hexDist + 2*rcos30;
		posX_Od[i] = posX_Od[i-1] + hexDist + 2*rcos30;
	}
	for (let i=0; i<hexCount.y; ++i) posY[i] = hexSize + i * (rcos60 + dcos30 + hexSize);

	// calculate hexagon center position
	hexCenterArray = get2DArray(hexCount.x, hexCount.y);
	for (let i=0; i<hexCount.x; ++i) {
		for (let j=0; j<hexCount.y; ++j) {
			hexCenterArray[i][j] = {
				x: (j%2) ? posX_Od[i] : posX_Ev[i],
				y: posY[j]
			};
		}
	}
}

// update or generate hexagons
function createSvgHexagons()
{
	$('#svg-area polygon').addClass('old-hex');
	for (let i=0; i<hexCount.x; ++i) {
		for (let j=0; j<hexCount.y; ++j) {
			// prepare hexagon vertex
			let hexVertPath = getHexVertexString(hexCenterArray[i][j]);
			let hexId = `hex_${i}_${j}`;
			if ($('#' + hexId).length > 0) {
				$('#' + hexId).attr('points', hexVertPath);
				$('#' + hexId).addClass('new-hex');
				$('#' + hexId).removeClass('old-hex');
			}else{
				var vo = makeSVG('polygon', {id:hexId, points:hexVertPath});
				$('#svg-area').append(vo);
			}
		}
	}
	$('#svg-area polygon.old-hex').remove();
	$('#svg-area polygon').removeClass('new-hex');
}

function getHexVertexString(c)
{
	let v1 = {x: c.x + hexSize * cos30, y: c.y - hexSize * sin30};
	let v2 = {x: c.x,                   y: c.y - hexSize};
	let v3 = {x: c.x - hexSize * cos30, y: c.y - hexSize * sin30};
	let v4 = {x: c.x - hexSize * cos30, y: c.y + hexSize * sin30};
	let v5 = {x: c.x,                   y: c.y + hexSize};
	let v6 = {x: c.x + hexSize * cos30, y: c.y + hexSize * sin30};

	// user `` to format string by variables
	return `${v1.x},${v1.y} ${v2.x},${v2.y} ${v3.x},${v3.y} ${v4.x},${v4.y} ${v5.x},${v5.y} ${v6.x},${v6.y}`;
}

function keyEventHandler(e)
{
	switch(e.keyCode)
	{
		case 37: // left
			cursorPox.x = Math.max(cursorPox.x - 1, 0);
			break;
		case 38: // up
			cursorPox.y = Math.max(cursorPox.y - 1, 0);
			break;
		case 39: // right
			cursorPox.x = Math.min(cursorPox.x + 1, hexCount.x - 1);
			break;
		case 40: // down
			cursorPox.y = Math.min(cursorPox.y + 1, hexCount.y - 1);
			break;
		case 97: // numpad 1
			cursorPox.x = (cursorPox.y % 2) ? cursorPox.x : Math.max(cursorPox.x - 1, 0);
			cursorPox.y = Math.min(cursorPox.y + 1, hexCount.y - 1);
			break;
		case 98: // numpad 2
			// useless in standing mode
			cursorPox.y = Math.min(cursorPox.y + 1, hexCount.y - 1);
			break;
		case 99: // numpad 3
			cursorPox.x = (cursorPox.y % 2) ? Math.min(cursorPox.x + 1, hexCount.x - 1) : cursorPox.x;
			cursorPox.y = Math.min(cursorPox.y + 1, hexCount.y - 1);
			break;
		case 100: // numpad 4
			cursorPox.x = Math.max(cursorPox.x - 1, 0);
			break;
		case 101: // numpad 5
			// useless forever
			break;
		case 102: // numpad 6
			cursorPox.x = Math.min(cursorPox.x + 1, hexCount.x - 1);
			break;
		case 103: // numpad 7
			cursorPox.x = (cursorPox.y % 2) ? cursorPox.x : Math.max(cursorPox.x - 1, 0);
			cursorPox.y = Math.max(cursorPox.y - 1, 0);
			break;
		case 104: // numpad 8
			// useless in standing mode
			cursorPox.y = Math.max(cursorPox.y - 1, 0);
			break;
		case 105: // numpad 9
			cursorPox.x = (cursorPox.y % 2) ? Math.min(cursorPox.x + 1, hexCount.x - 1) : cursorPox.x;
			cursorPox.y = Math.max(cursorPox.y - 1, 0);
			break;
	}
	setCursor();
}

function setCursor()
{
	cursorPox.x = Math.min(cursorPox.x, hexCount.x - 1);
	cursorPox.y = Math.min(cursorPox.y, hexCount.y - 1);
	$('#svg-area polygon.cursor').removeClass('cursor');
	$(`#hex_${cursorPox.x}_${cursorPox.y}`).addClass('cursor');
}

function makeSVG(tag, attrs) {
	var el= document.createElementNS('http://www.w3.org/2000/svg', tag);
	for (var k in attrs) el.setAttribute(k, attrs[k]);
	return el;
}

function get2DArray(x, y)
{
	let ary = new Array(x);
	for (let i=0; i<x; ++i) ary[i] = new Array(y);
	return ary;
}