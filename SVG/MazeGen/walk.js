// Bala: 2022-05-18
// - walk the maze

class MazeWalker {

	constructor(_maze) {

		this.maze = _maze;
		this.interval = 10;
		this.renderStep = this.defaultRenderStep;
		this.walkPath = [];
	}

	setStepInterval(intTime) {
		this.interval = intTime;
	}

	setRenderFnctions(renderStepFunc) {
		this.renderStep = renderStepFunc;
	}

	start() {
		let sg = this.maze.grid(this.maze.start);
		this.goTo(sg);
	}

	async goTo(grid) {

		this.walkPath.push(grid.pos);
		this.renderStep(this.walkPath);

		if (grid.pos.equals(this.maze.end)) return true;

		// collect availble dir
		let avalAry = [];
		if (this.checkGrid(grid, DIR.LFT)) avalAry.push(this.maze.grid(grid.pos.getLft()));
		if (this.checkGrid(grid, DIR.TOP)) avalAry.push(this.maze.grid(grid.pos.getTop()));
		if (this.checkGrid(grid, DIR.RGT)) avalAry.push(this.maze.grid(grid.pos.getRgt()));
		if (this.checkGrid(grid, DIR.BTM)) avalAry.push(this.maze.grid(grid.pos.getBtm()));

		// init, check start grid
		for (let n = 0; n < avalAry.length; ++n) {
			await sleep(this.interval);
			if (await this.goTo(avalAry[n])) return true;
		}

		// all directions are fail, back to previous grid
		this.walkPath.pop();
		return false;
	}

	checkGrid(grid, dir) {
		let hasWall = true;
		let hasBeen = true;
		switch (dir) {
			case DIR.LFT:
				hasWall = grid.wallLft;
				hasBeen = this.inPath(grid.pos.getLft());
				break;
			case DIR.TOP:
				hasWall = grid.wallTop;
				hasBeen = this.inPath(grid.pos.getTop());
				break;
			case DIR.RGT:
				hasWall = grid.wallRgt;
				hasBeen = this.inPath(grid.pos.getRgt());
				break;
			case DIR.BTM:
				hasWall = grid.wallBtm;
				hasBeen = this.inPath(grid.pos.getBtm());
				break;
		}
		return !hasWall && !hasBeen;
	}

	inPath(pos) {
		for (let n = 0; n < this.walkPath.length; ++n) {
			if ((this.walkPath[n].x == pos.x) && (this.walkPath[n].y == pos.y)) {
				return true;
			}
		}
		return false;
	}

	defaultRenderStep(path) {
		// Default maze render function that only output maze in log
		// Maze caller can overwrite this function to render customized maze
		if (path.length <= 0) return;
		let last = path[path.length - 1];
		console.log(`Walk to (${last.x},${last.y})`);
	}
}

