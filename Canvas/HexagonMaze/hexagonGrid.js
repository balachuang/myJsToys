const DIR =
{
	NAN: -1,
	RT: 0,
	RU: 1,
	LU: 2,
	LT: 3,
	LD: 4,
	RD: 5

	// isLft: function (dir) { return (dir == 0); },
	// isTop: function (dir) { return (dir == 1); },
	// isRgt: function (dir) { return (dir == 2); },
	// isBtm: function (dir) { return (dir == 3); },
	// isNan: function (dir) { return (dir < 0); },

	// opposite: function (dir) { return (dir < 0) ? dir : ((dir + 2) % 4); },
}

class HexagonGrid {

	constructor(_x = 0, _y = 0) {
		this.centPos = { x: _x, y: _y};
		this.isStart = false;
		this.isEnd = false;
		this.isChecked = false;
		this.wall = [true, true, true, true, true, true];
	}

	setChecked() { this.isChecked = true; }
	setStart() { this.isStart = true; }
	setEnd() { this.isEnd = true; }

	openWall(dir) { this.wall[dir] = false; }

	setCenterPos(pos) {
		this.centPos.x = pos.x;
		this.centPos.y = pos.y;
	}
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
