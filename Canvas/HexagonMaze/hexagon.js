import ('hexagonGrid.js');

const cos30 = 0.866;
const sin30 = 0.5;
const cos60 = 0.5;
const margin = 10;

let hexSize = 10;
let hexIntv = 3;

let ViewDim = { x: 0, y: 0 };
let hexCount = { x: 0, y: 0 }
// let cursorPox = { x: 0, y: 0 }

let hexCenterArray = null;

class Hexagon
{
	constructor() {
	}

	generateGrid(_width, _height, _hexSize, _gridIntv)
	{
		ViewDim = { x: _width, y: _height };
		hexSize = _hexSize;
		hexIntv = _gridIntv;

		this.calculateHexagonCount();
		// createHexagonsSvg();
		// setCursor();
	}

	// pre-calculate all positions of hexagons center (when hezagons are standing)
	calculateHexagonCount()
	{
		let rcos30 = hexSize * cos30;
		let rcos60 = hexSize * cos60;
		let dcos30 = hexIntv * cos30;

		// calculate hexagon count
		hexCount.x = Math.floor((ViewDim.x + hexIntv - rcos30) / (2*rcos30 + hexIntv));
		hexCount.y = Math.floor(1 + (ViewDim.y - 2*hexSize) / (hexSize + rcos60 + dcos30));

		// prepare positions
		let posX_Od = new Array(hexCount.x);
		let posX_Ev = new Array(hexCount.x);
		let posY = new Array(hexCount.y);

		posX_Ev[0] = rcos30;
		posX_Od[0] = 2 * rcos30 + hexIntv/2;
		for (let i=1; i<hexCount.x; ++i) {
			posX_Ev[i] = posX_Ev[i-1] + hexIntv + 2*rcos30;
			posX_Od[i] = posX_Od[i-1] + hexIntv + 2*rcos30;
		}
		for (let i=0; i<hexCount.y; ++i) posY[i] = hexSize + i * (rcos60 + dcos30 + hexSize);

		// calculate hexagon center position
		hexCenterArray = this.get2DArray(hexCount.x, hexCount.y);
		for (let i=0; i<hexCount.x; ++i) {
			for (let j=0; j<hexCount.y; ++j) {
				hexCenterArray[i][j].setCenterPos( (j%2) ? posX_Od[i] : posX_Ev[i], posY[j] );
			}
		}
	}

	// get hexagon border
	getHexBorder(c, dir)
	{
		let line = {from: {x:0, y:0}, to: {x:0, y:0}};

		let v1 = {x: c.x + hexSize * cos30, y: c.y - hexSize * sin30};
		let v2 = {x: c.x,                   y: c.y - hexSize};
		let v3 = {x: c.x - hexSize * cos30, y: c.y - hexSize * sin30};
		let v4 = {x: c.x - hexSize * cos30, y: c.y + hexSize * sin30};
		let v5 = {x: c.x,                   y: c.y + hexSize};
		let v6 = {x: c.x + hexSize * cos30, y: c.y + hexSize * sin30};
		switch(dir)
		{
			case DIR.RT:
				line.from.x = c.x + hexSize * cos30;
				line.from.y = c.y + hexSize * sin30;
				line.to.x = c.x + hexSize * cos30;
				line.to.y = c.y - hexSize * sin30;
				break;
			case DIR.RU:
				line.from.x = c.x + hexSize * cos30;
				line.from.y = c.y - hexSize * sin30;
				line.to.x = c.x;
				line.to.y = c.y - hexSize;
				break;
			case DIR.LU:
				line.from.x = c.x;
				line.from.y = c.y - hexSize;
				line.to.x = c.x - hexSize * cos30;
				line.to.y = c.y - hexSize * sin30;
				break;
			case DIR.LT:
				line.from.x = c.x - hexSize * cos30;
				line.from.y = c.y - hexSize * sin30;
				line.to.x = c.x - hexSize * cos30;
				line.to.y = c.y + hexSize * sin30;
				break;
			case DIR.LD:
				line.from.x = c.x - hexSize * cos30;
				line.from.y = c.y + hexSize * sin30;
				line.to.x = c.x;
				line.to.y = c.y + hexSize;
				break;
			case DIR.RD:
				line.from.x = c.x;
				line.from.y = c.y + hexSize;
				line.to.x = c.x + hexSize * cos30;
				line.to.y = c.y + hexSize * sin30;
				break;
		}
	}

	get2DArray(x, y)
	{
		let ary = new Array(x);
		for (let i=0; i<x; ++i) {
			ary[i] = new Array(y);
			for (let j=0; j<y; ++j) {
				ary[i][j] = new HexagonGrid();
			}
		}
		return ary;
	}
}


// function keyEventHandler(e)
// {
// 	switch(e.keyCode)
// 	{
// 		case 37: // left
// 			cursorPox.x = Math.max(cursorPox.x - 1, 0);
// 			break;
// 		case 38: // up
// 			cursorPox.y = Math.max(cursorPox.y - 1, 0);
// 			break;
// 		case 39: // right
// 			cursorPox.x = Math.min(cursorPox.x + 1, hexCount.x - 1);
// 			break;
// 		case 40: // down
// 			cursorPox.y = Math.min(cursorPox.y + 1, hexCount.y - 1);
// 			break;
// 		case 97: // numpad 1
// 			if (isStanding) {
// 				cursorPox.x = (cursorPox.y % 2) ? cursorPox.x : Math.max(cursorPox.x - 1, 0);
// 				cursorPox.y = Math.min(cursorPox.y + 1, hexCount.y - 1);
// 			}else{
// 				cursorPox.x = Math.max(cursorPox.x - 1, 0);
// 				cursorPox.y = (cursorPox.x % 2) ? cursorPox.y : Math.min(cursorPox.y + 1, hexCount.y - 1);
// 			}
// 			break;
// 		case 98: // numpad 2
// 			// useless in standing mode
// 			cursorPox.y = Math.min(cursorPox.y + 1, hexCount.y - 1);
// 			break;
// 		case 99: // numpad 3
// 			if (isStanding) {
// 				cursorPox.x = (cursorPox.y % 2) ? Math.min(cursorPox.x + 1, hexCount.x - 1) : cursorPox.x;
// 				cursorPox.y = Math.min(cursorPox.y + 1, hexCount.y - 1);
// 			}else{
// 				cursorPox.x = Math.min(cursorPox.x + 1, hexCount.x - 1);
// 				cursorPox.y = (cursorPox.x % 2) ? cursorPox.y : Math.min(cursorPox.y + 1, hexCount.y - 1);
// 			}
// 			break;
// 		case 100: // numpad 4
// 			cursorPox.x = Math.max(cursorPox.x - 1, 0);
// 			break;
// 		case 101: // numpad 5
// 			// useless forever
// 			break;
// 		case 102: // numpad 6
// 			cursorPox.x = Math.min(cursorPox.x + 1, hexCount.x - 1);
// 			break;
// 		case 103: // numpad 7
// 			if (isStanding) {
// 				cursorPox.x = (cursorPox.y % 2) ? cursorPox.x : Math.max(cursorPox.x - 1, 0);
// 				cursorPox.y = Math.max(cursorPox.y - 1, 0);
// 			}else{
// 				cursorPox.x = Math.max(cursorPox.x - 1, 0);
// 				cursorPox.y = (cursorPox.x % 2) ? Math.max(cursorPox.y - 1, 0) : cursorPox.y;
// 			}
// 			break;
// 		case 104: // numpad 8
// 			// useless in standing mode
// 			cursorPox.y = Math.max(cursorPox.y - 1, 0);
// 			break;
// 		case 105: // numpad 9
// 			if (isStanding) {
// 				cursorPox.x = (cursorPox.y % 2) ? Math.min(cursorPox.x + 1, hexCount.x - 1) : cursorPox.x;
// 				cursorPox.y = Math.max(cursorPox.y - 1, 0);
// 			}else{
// 				cursorPox.x = Math.min(cursorPox.x + 1, hexCount.x - 1);
// 				cursorPox.y = (cursorPox.x % 2) ? Math.max(cursorPox.y - 1, 0) : cursorPox.y;
// 			}
// 			break;
// 	}
// 	setCursor();
// }

// function setCursor()
// {
// 	cursorPox.x = Math.min(cursorPox.x, hexCount.x - 1);
// 	cursorPox.y = Math.min(cursorPox.y, hexCount.y - 1);
// 	$('#svg-area polygon.cursor').removeClass('cursor');
// 	$(`#hex_${cursorPox.x}_${cursorPox.y}`).addClass('cursor');
// }
