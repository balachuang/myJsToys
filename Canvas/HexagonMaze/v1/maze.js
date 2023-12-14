// mazeAry definition (bit of each grid)
// bit-1: 0: unchecked / 1: checked
// bit-2: 0: LFT close / 1: LFT open
// bit-3: 0: TOP close / 1: TOP open
// bit-4: 0: RIT close / 1: RIT open
// bit-5: 0: BTM close / 1: BTM open

// mazeAry grid operation
// Set Checked: OR 0b00001
// Open LFT: OR 0b00010
// Open TOP: OR 0b00100
// Open RIT: OR 0b01000
// Open BTM: OR 0b10000

const CHECKED = 0b00001;
const LFT = 0b00010;
const TOP = 0b00100;
const RIT = 0b01000;
const BTM = 0b10000;
const NA = -1;

const GRID_CLASS_START = 'maze-grid-start';
const GRID_CLASS_END = 'maze-grid-end';
const GRID_CLASS_CURR = 'maze-grid-curr';
const GRID_CLASS_LFT = 'maze-grid-wall-lft';
const GRID_CLASS_TOP = 'maze-grid-wall-top';
const GRID_CLASS_RIT = 'maze-grid-wall-rit';
const GRID_CLASS_BTM = 'maze-grid-wall-btm';
const GRID_CLASS_INIT = 'maze-grid ' + GRID_CLASS_LFT + ' ' + GRID_CLASS_TOP + ' ' + GRID_CLASS_RIT + ' ' + GRID_CLASS_BTM;
const GRID_ID_FORMAT = '__maze_grid_{x}_{y}_';
const GRID_HTML_FORMAT = '<div id="{id}" class="' + GRID_CLASS_INIT + '" style="{style}"></div>';
let mazeContainerObj = '';
let gridSideLen = -1;
let stepId = -1;
let intervalTime = 100;

let mazeAry = [];
let mazeCheckedAry = [];
let mazeUnCheckAry = [];
let curr = {};
let showStep = false;

function setIntervalTime(intv = 100) {
	intervalTime = intv;
}

function setShowStep(_showStep = false) {
	showStep = _showStep;
}

function setContainerId(id) {
	if (!id.startsWith('#')) id = '#' + id;
	mazeContainerObj = $(id);
	gridSideLen = -1;
}

function makeMaze(size, start, end) {

	// initialize array
	let idx = 0;
	mazeAry = new Array(size.x).fill(0).map(() => new Array(size.y).fill(0));
	mazeCheckedAry = [];
	mazeUnCheckAry = [];
	for (let x = 0; x < size.x; ++x) {
		for (let y = 0; y < size.y; ++y) {
			mazeUnCheckAry.push(y * size.x + x);
		}
	}

	// initialize grid display
	initGrid(mazeAry, start, end);

	// loop from start to check each grid
	curr = { 'x': start.x, 'y': start.y };
	setChecked(curr, mazeAry);
	mazeCheckedAry.push(start.y * size.x + start.x);
	spliceUnCheck(start.y * size.x + start.x, mazeUnCheckAry);

	if (showStep) {
		// only show step need to setInterval
		stepId = window.setInterval(function () {
			if (mazeCheckedAry.length >= (size.x * size.y)) {
				window.clearInterval(stepId);
				$('.' + GRID_CLASS_CURR).removeClass(GRID_CLASS_CURR);
				console.log('done');
				return;
			}
			let nextDir = findNextDir(size, end);
			moveToNext(nextDir, size);
		}, intervalTime);
	} else {
		while (mazeCheckedAry.length < (size.x * size.y)) {
			let nextDir = findNextDir(size, end);
			moveToNext(nextDir, size);
		}
		initGrid(mazeAry, start, end);
		console.log('done');
		return;
	}
}

function findNextDir(size, end) {
	// check if go to End
	if (samePos(curr, end)) return NA;

	// find available neighbor
	let avalAry = [];
	if ((curr.x > 0) && isAvailable(mazeAry[curr.x - 1][curr.y])) avalAry.push(LFT);
	if ((curr.y > 0) && isAvailable(mazeAry[curr.x][curr.y - 1])) avalAry.push(TOP);
	if ((curr.x < size.x - 1) && isAvailable(mazeAry[curr.x + 1][curr.y])) avalAry.push(RIT);
	if ((curr.y < size.y - 1) && isAvailable(mazeAry[curr.x][curr.y + 1])) avalAry.push(BTM);

	// decide an dir by random
	if (avalAry.length == 0) return NA;
	return avalAry[randomAryIdx(avalAry)];
}

function moveToNext(nextDir, size) {
	if (nextDir == NA) {
		// find a new position from un-processed grids
		if (mazeCheckedAry.length >= 0.65 * size.x * size.y) {
			// find next grid from un-Processed grid (no random)
			let currTmp = { 'x': curr.x, 'y': curr.y };
			while ((currTmp.x == curr.x) && (currTmp.y == curr.y)) {
				let idx = randomAryIdx(mazeUnCheckAry);
				let xTest = mazeUnCheckAry[idx] % size.x;
				let yTest = Math.floor(mazeUnCheckAry[idx] / size.x);
				let gridVal = mazeAry[xTest][yTest];
				if ((xTest > 0) && !isAvailable(mazeAry[xTest - 1][yTest])) curr = { 'x': xTest - 1, 'y': yTest };
				else if ((yTest > 0) && !isAvailable(mazeAry[xTest][yTest - 1])) curr = { 'x': xTest, 'y': yTest - 1 };
				else if ((xTest < size.x - 1) && !isAvailable(mazeAry[xTest + 1][yTest])) curr = { 'x': xTest + 1, 'y': yTest };
				else if ((yTest < size.y - 1) && !isAvailable(mazeAry[xTest][yTest + 1])) curr = { 'x': xTest, 'y': yTest + 1 };
			}
		} else {
			// find next grid rom Processed grid
			let idx = randomAryIdx(mazeCheckedAry);
			curr.x = mazeCheckedAry[idx] % size.x;
			curr.y = Math.floor(mazeCheckedAry[idx] / size.x);
		}
	} else {
		// break the out-going wall of curr grid
		breakWall(curr, nextDir, mazeAry);
		if (showStep) showGrid(curr, mazeAry);

		// break the in-coming wall of next grid
		let nextNxtDir = NA;
		switch (nextDir) {
			case LFT:
				curr.x -= 1;
				nextNxtDir = RIT;
				break;
			case TOP:
				curr.y -= 1;
				nextNxtDir = BTM;
				break;
			case RIT:
				curr.x += 1;
				nextNxtDir = LFT;
				break;
			case BTM:
				curr.y += 1;
				nextNxtDir = TOP;
				break;
		}
		breakWall(curr, nextNxtDir, mazeAry);
		if (showStep) showGrid(curr, mazeAry);

		// update next grid
		setChecked(curr, mazeAry);
		mazeCheckedAry.push(curr.y * size.x + curr.x);
		spliceUnCheck(curr.y * size.x + curr.x, mazeUnCheckAry)

		console.log('move to: ' + curr.x + ',' + curr.y);
	}
}

function initGrid(mazeAry, start, end) {
	let xSize = mazeAry.length;
	let ySize = mazeAry[0].length;

	// calculate grid side length
	if (gridSideLen <= 0) {
		let xLen = Math.floor(mazeContainerObj.width() / xSize);
		let yLen = Math.floor(mazeContainerObj.height() / ySize);
		gridSideLen = Math.min(xLen, yLen);
	}

	// initial all grids
	for (let x = 0; x < xSize; ++x) {
		for (let y = 0; y < ySize; ++y) {
			showGrid({ 'x': x, 'y': y }, mazeAry);
		}
	}

	// set start / end
	let id = GRID_ID_FORMAT.replace('{x}', start.x).replace('{y}', start.y);
	let gridObj = $('#' + id);
	gridObj.addClass(GRID_CLASS_START);

	id = GRID_ID_FORMAT.replace('{x}', end.x).replace('{y}', end.y);
	gridObj = $('#' + id);
	gridObj.addClass(GRID_CLASS_END);
}

function showGrid(pos, mazeAry) {
	let id = GRID_ID_FORMAT.replace('{x}', pos.x).replace('{y}', pos.y);
	let gridObj = $('#' + id);
	if (gridObj.length <= 0) {
		// create a new grid
		let style =
			'left:' + (pos.x * gridSideLen) + 'px;' +
			'top:' + (pos.y * gridSideLen) + 'px;' +
			'width:' + gridSideLen + 'px;' +
			'height:' + gridSideLen + 'px;';
		let html = GRID_HTML_FORMAT.replace('{id}', id).replace('{style}', style);
		gridObj = mazeContainerObj.append(html);
		if (gridObj.length <= 0) {
			alert('ERROR in create grid.');
			return;
		}
	} else {
		// update this grid
		if (hasNoLftWall(mazeAry[pos.x][pos.y])) gridObj.removeClass(GRID_CLASS_LFT); else gridObj.addClass(GRID_CLASS_LFT);
		if (hasNoTopWall(mazeAry[pos.x][pos.y])) gridObj.removeClass(GRID_CLASS_TOP); else gridObj.addClass(GRID_CLASS_TOP);
		if (hasNoRitWall(mazeAry[pos.x][pos.y])) gridObj.removeClass(GRID_CLASS_RIT); else gridObj.addClass(GRID_CLASS_RIT);
		if (hasNoBtmWall(mazeAry[pos.x][pos.y])) gridObj.removeClass(GRID_CLASS_BTM); else gridObj.addClass(GRID_CLASS_BTM);
		if (showGrid) {
			$('.' + GRID_CLASS_CURR).removeClass(GRID_CLASS_CURR);
			gridObj.addClass(GRID_CLASS_CURR);
		}
	}
}

function breakWall(pos, dir, mazeAry) {
	mazeAry[pos.x][pos.y] |= dir;
}

function spliceUnCheck(val, mazeUnCheckAry) {
	let idx = mazeUnCheckAry.indexOf(val);
	if (idx >= 0) mazeUnCheckAry.splice(idx, 1);
}

function setChecked(pos, mazeAry) {
	mazeAry[pos.x][pos.y] |= CHECKED;
}

function isAvailable(gridVal) {
	return ((gridVal & CHECKED) != CHECKED);
}

function hasNoLftWall(gridVal) {
	return ((gridVal & LFT) == LFT);
}

function hasNoTopWall(gridVal) {
	return ((gridVal & TOP) == TOP);
}

function hasNoRitWall(gridVal) {
	return ((gridVal & RIT) == RIT);
}

function hasNoBtmWall(gridVal) {
	return ((gridVal & BTM) == BTM);
}

function samePos(pos1, pos2) {
	return ((pos1.x == pos2.x) && (pos1.y == pos2.y));
}

function randomAryIdx(ary) {
	return Math.floor(Math.random() * ary.length);
}
