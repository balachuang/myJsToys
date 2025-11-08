class SimplePoint
{
	constructor(x = 0, y = 0)
	{
		this.x = x;
		this.y = y;
	}
}

// Vector: 向量
// 1. 參數: 起點 + 終點
// 2. 方法: 算長度, 旋轉, 內積, 外積
class SimpleVector
{
	// (x,y) = (p1.x, p1.y) + t(p2.x, p2.y)
	constructor(p1, p2)
	{
		this.p1 = p1;
		this.p2 = p2;

		// calculate length
		this.deltaX = this.p2.x - this.p1.x;
		this.deltaY = this.p2.y - this.p1.y;
		this.length = Math.sqrt(this.deltaX * this.deltaX + this.deltaY * this.deltaY);
	}

	getP1() { return this.p1; }
	getP2() { return this.p2; }
	getLength() { return this.length; }

	getAngle() {
		return Math.atan2(this.deltaY, this.deltaX);
	}

	getUnitVector()
	{
		let ux = 1.0 * this.deltaX / this.length;
		let uy = 1.0 * this.deltaY / this.length;
		return new SimpleVector(ux, uy);
	}

	getRotatedVector(degree)
	{
	}
}

// Line: 直線
// 1. 參數: 斜率 + 點
// 2. 方法: 平行線, 過某一點垂直線, y=f(x), 
class SimpleLine
{
	// typeof(p) = SimplePoint
	constructor(p1, p2)
	{
		this.p1 = p1;
		this.p2 = p2;
		this.eqParams = getThisLineParameter();
	}

	getP1(){ return this.p1; }
	getP2(){ return this.p2; }
	getSlope(){ return this.eqParams.x; }

	getThisLineParameter()
	{
		// return SimplePoint(A,B) of eq: y = Ax + B
		let a = (this.p2.x == this.p1.x) ? 0 : (1.0 * (this.p2.y - this.p1.y) / (this.p2.x - this.p1.x));
		let b = this.p1.y - m * this.p1.x;
		return new SimplePoint(a, b);
	}

	getParallelLineParameters(distance)
	{
		// return 2 lines
		let delta = distance * Math.sqrt(1 + this.a * this.a);

		// line 1
		let l1b = this.b + delta;
		let x1d = -l1b / this.a;

		// line 2
		let l2b = this.b - delta;
		let x2d = -l2b / this.a;

		let lines = [
			new SimpleLine(new SimplePoint(0, l1b), new SimplePoint(x1d, 0)),
			new SimpleLine(new SimplePoint(0, l2b), new SimplePoint(x2d, 0))
		];

		return lines;
	}
}
