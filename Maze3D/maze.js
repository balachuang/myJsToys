// Bala: 2022-05-14
// - make Maze as an object
// - reference: https://medium.com/enjoy-life-enjoy-coding/javascript-%E9%97%9C%E6%96%BC-object-%E4%B8%80%E5%8F%A3%E6%B0%A3%E5%85%A8%E8%AA%AA%E5%AE%8C-4bb924bcc79f

let thisMaze = null; // for setInterval
const DIR = {

	NAN: -1,
	LFT: 0,
	TOP: 1,
	RGT: 2,
	BTM: 3,

	isLft: function (dir) { return (dir == 0); },
	isTop: function (dir) { return (dir == 1); },
	isRgt: function (dir) { return (dir == 2); },
	isBtm: function (dir) { return (dir == 3); },
	isNan: function (dir) { return (dir < 0); },

	opposite: function (dir) { return (dir < 0) ? dir : ((dir + 2) % 4); },
}

class MazePos {

	constructor(_x = 0, _y = 0) {
		this.x = _x;
		this.y = _y;
	}

	equals(anotherPos) {
		if (this.x != anotherPos.x) return false;
		if (this.y != anotherPos.y) return false;
		return true;
	}

	getNeighbor(dir) {
		// assume that there is only one direction in dir.
		let npos = new MazePos(this.x, this.y);
		if (DIR.isLft(dir)) --npos.x;
		if (DIR.isTop(dir)) --npos.y;
		if (DIR.isRgt(dir)) ++npos.x;
		if (DIR.isBtm(dir)) ++npos.y;
		return npos;
	}

	setPos(pos) {
		this.x = pos.x;
		this.y = pos.y;
	}

	toIdx(size) {
		return this.y * size + this.x;
	}

	getLft() { return new MazePos(this.x - 1, this.y); }
	getTop() { return new MazePos(this.x, this.y - 1); }
	getRgt() { return new MazePos(this.x + 1, this.y); }
	getBtm() { return new MazePos(this.x, this.y + 1); }

	hasLft() { return this.x > 0; }
	hasTop() { return this.y > 0; }
	hasRgt(size) { return this.x < size.x - 1; }
	hasBtm(size) { return this.y < size.y - 1; }
}

class MazeGrid {

	constructor(x = 0, y = 0) {
		this.pos = new MazePos(x, y);
		this.isStart = false;
		this.isEnd = false;
		this.isChecked = false;
		this.wallLft = true;
		this.wallTop = true;
		this.wallRgt = true;
		this.wallBtm = true;
	}

	setChecked() { this.isChecked = true; }
	setStart() { this.isStart = true; }
	setEnd() { this.isEnd = true; }
	//setPos(_x, _y) { this.x = _x; this.y = _y; }

	openWall(dir) {
		if (DIR.isLft(dir)) this.wallLft = false;
		if (DIR.isTop(dir)) this.wallTop = false;
		if (DIR.isRgt(dir)) this.wallRgt = false;
		if (DIR.isBtm(dir)) this.wallBtm = false;
	}
}

class Maze {

	constructor(_size, _start, _end) {

		this.size = _size;
		this.start = _start;
		this.end = _end;

		this.showStep = false;
		this.gridSideLen = -1;
		this.stepId = -1;
		this.intervalTime = 100;

		this.renderMaze = this.defaultRenderMaze;
		this.renderGrid = this.defaultRenderGrid;
		this.beforeRender = this.defaultBeforeRender;
		this.afterRender = this.defaultAfterRender;

		this.mazeAry = [];
		this.mazeCheckedAry = [];
		this.mazeUnCheckAry = [];
		this.curr = new MazePos(this.start.x, this.start.y);

		for (let x = 0; x < this.size.x; ++x) {
			this.mazeAry[x] = [];
			for (let y = 0; y < this.size.y; ++y) {

				let pos = new MazePos(x, y);
				this.mazeUnCheckAry.push(pos.toIdx(this.size.x));
				this.mazeAry[x][y] = new MazeGrid(x, y);

				if (this.start.equals(pos)) this.mazeAry[x][y].setStart();
				if (this.end.equals(pos)) this.mazeAry[x][y].setEnd();
			}
		}
	}

	setShowStep(isShowStep, intTime) {
		this.showStep = isShowStep;
		this.intervalTime = intTime;
	}

	setRenderFnctions(renderMazeFunc, renderGridFunc, before, after) {
		this.renderMaze = renderMazeFunc;
		this.renderGrid = renderGridFunc;
		this.beforeRender = before;
		this.afterRender = after;
	}

	generate() {

		// init, check start grid
		this.grid(this.curr).setChecked();

		let mazeIdx = this.curr.toIdx(this.size.x);
		this.mazeCheckedAry.push(mazeIdx);
		this.spliceUnCheck(mazeIdx, this.mazeUnCheckAry);

		if (this.showStep) {

			thisMaze = this;
			this.beforeRender();
			this.renderMaze(this.mazeAry);

			// only show step need to setInterval
			let intId = window.setInterval(function () {
				if (thisMaze.mazeCheckedAry.length >= (thisMaze.size.x * thisMaze.size.y)) {
					window.clearInterval(intId);
					thisMaze.afterRender();
					return;
				}
				let nextDir = thisMaze.findNextDir(thisMaze.curr, false);
				thisMaze.moveToNext(nextDir);
			}, this.intervalTime);
		} else {

			this.beforeRender();
			let totalGridCount = this.size.x * this.size.y;
			while (this.mazeCheckedAry.length < totalGridCount) {
				let nextDir = this.findNextDir(this.curr, false);
				this.moveToNext(nextDir);
			}

			// show maze
			this.renderMaze(this.mazeAry);
			this.afterRender();
			return;
		}
	}

	findNextDir(pos, findChecked) {

		// check if go to End
		if (!findChecked && pos.equals(this.end)) return DIR.NAN;

		// find available neighbor
		let avalAry = [];
		if (pos.hasLft() && (this.grid(pos.getLft()).isChecked == findChecked)) avalAry.push(DIR.LFT);
		if (pos.hasTop() && (this.grid(pos.getTop()).isChecked == findChecked)) avalAry.push(DIR.TOP);
		if (pos.hasRgt(this.size) && (this.grid(pos.getRgt()).isChecked == findChecked)) avalAry.push(DIR.RGT);
		if (pos.hasBtm(this.size) && (this.grid(pos.getBtm()).isChecked == findChecked)) avalAry.push(DIR.BTM);

		// decide an dir by random
		if (avalAry.length == 0) return DIR.NAN;
		return avalAry[this.randomAryIdx(avalAry)];
	}

	moveToNext(nextDir) {
		if (DIR.isNan(nextDir)) {
			// find a new position from un-processed grids
			if (this.mazeCheckedAry.length >= 0.65 * this.size.x * this.size.y) {
				// find next grid from un-Processed grid (no random)
				//console.log(`random get grid except curr: (${this.curr.x},${this.curr.y})`);
				let currTmp = { 'x': this.curr.x, 'y': this.curr.y };
				while ((currTmp.x == this.curr.x) && (currTmp.y == this.curr.y)) {
					//if ((this.mazeUnCheckAry.length == 1) && (this.mazeUnCheckAry[0] == 14)) {
					//	console.log(`uncheck size: ${this.mazeUnCheckAry.length}`);
					//}
					let idx = this.randomAryIdx(this.mazeUnCheckAry);
					let xTest = this.mazeUnCheckAry[idx] % this.size.x;
					let yTest = Math.floor(this.mazeUnCheckAry[idx] / this.size.x);
					let testPos = new MazePos(xTest, yTest);
					let testNxtDir = this.findNextDir(testPos, true);
					if (!DIR.isNan(testNxtDir)) this.curr.setPos(testPos.getNeighbor(testNxtDir));
					//console.log(`get: (${this.curr.x},${this.curr.y})`);
				}
			} else {
				// find next grid rom Processed grid
				let idx = this.randomAryIdx(this.mazeCheckedAry);
				this.curr.x = this.mazeCheckedAry[idx] % this.size.x;
				this.curr.y = Math.floor(this.mazeCheckedAry[idx] / this.size.x);
			}
		} else {

			// break the out-going wall of current grid
			//console.log(`process pos: (${this.curr.x},${this.curr.y}) to dir: ${nextDir}`);
			this.grid(this.curr).openWall(nextDir);
			if (this.showStep) this.renderGrid(this.grid(this.curr));

			// move to next grid and break the in-coming wall
			let nextNxtDir = DIR.opposite(nextDir);
			this.curr = this.curr.getNeighbor(nextDir);
			this.grid(this.curr).openWall(nextNxtDir);
			if (this.showStep) this.renderGrid(this.grid(this.curr));

			// update next grid
			this.grid(this.curr).setChecked();
			this.mazeCheckedAry.push(this.curr.toIdx(this.size.x));
			this.spliceUnCheck(this.curr.toIdx(this.size.x), this.mazeUnCheckAry);

			//console.log('move to: ' + curr.x + ',' + curr.y);
		}
	}

	grid(pos) { return this.mazeAry[pos.x][pos.y]; }

	spliceUnCheck(val, mazeUnCheckAry) {
		let idx = mazeUnCheckAry.indexOf(val);
		if (idx >= 0) mazeUnCheckAry.splice(idx, 1);
	}

	randomAryIdx(ary) {
		return Math.floor(Math.random() * ary.length);
	}

	defaultRenderMaze(mazeAry) {
		// Default maze render function that only output maze in log
		// Maze caller can overwrite this function to render customized maze
		let xSize = mazeAry.length;
		let ySize = mazeAry[0].length;

		for (let y = 0; y < ySize; ++y) {
			//console.log(`=== Raw: ${y}`);
			for (let x = 0; x < xSize; ++x) {
				this.renderGrid(mazeAry[x][y]);
			}
		}
	}

	defaultRenderGrid(mazeGrid) {
		// Default grid render function that only output grid in log
		// Maze caller can overwrite this function to render customized grid
		let displayVal = '';
		if (!mazeGrid.wallLft) displayVal += ', Left';
		if (!mazeGrid.wallTop) displayVal += ', Top';
		if (!mazeGrid.wallRgt) displayVal += ', Right';
		if (!mazeGrid.wallBtm) displayVal += ', Bottom';
		if (displayVal != '') displayVal = 'Way to ' + displayVal.substring(2) + '.';
		else displayVal = 'ERROR!! No way out from this grid.'

		if (mazeGrid.isStart) displayVal = '[START] ' + displayVal;
		if (mazeGrid.isEnd) displayVal = '[END] ' + displayVal;

		//console.log(`   Grid(${mazeGrid.pos.x},${mazeGrid.pos.y}): ` + displayVal);
	}

	defaultBeforeRender() {
		console.log('Start Maze...');
	}

	defaultAfterRender() {
		console.log('Maze Done !!!');
	}
}

