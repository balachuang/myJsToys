const _timeline_svg_id_ = 'timeline-svg-area';
const _timeline_hour_in_ms_ = 60 * 60 * 1000;
const _timeline_day_in_ms_ = 24 * _timeline_hour_in_ms_;

const _timeline_grid_size_map_ =
[
	{ 'tag' : '1h', 'day' : 0.0417  }, // 1 hour
	{ 'tag' : '3h', 'day' : 0.125   }, // 3 hours
	{ 'tag' : 'hd', 'day' : 0.5     }, // half a day = 12 hours
	{ 'tag' : '1d', 'day' : 1       }, // 1 day
	{ 'tag' : '3d', 'day' : 3       }, // 3 days
	{ 'tag' : '1w', 'day' : 7       }, // 1 week = 7 days
	{ 'tag' : '1m', 'day' : 30      }, // 1 month
	{ 'tag' : '1q', 'day' : 90      }, // 1 quarter = 3 months
	{ 'tag' : '1y', 'day' : 365     }, // 1 year
	{ 'tag' : '5y', 'day' : 1825    }, // 5 years
	{ 'tag' : '1D', 'day' : 3650    }, // 1 decade = 10 years
	{ 'tag' : '5D', 'day' : 18250   }, // 5 decades = 50 years
	{ 'tag' : '1c', 'day' : 36500   }, // 1 century = 100 years
	{ 'tag' : '5c', 'day' : 182500  }, // 5 centuries = 500 years
	{ 'tag' : '1M', 'day' : 365000  }, // 1 millennium = 1000 years
	{ 'tag' : '5M', 'day' : 1825000 }, // 5 millenniums = 5000 years
	{ 'tag' : '1W', 'day' : 3650000 }, // 10 thousand years = 10000 years 
]


let _timeline_this_object_ = null;
let _timeline_min_time_ = new Date();
let _timeline_max_time_ = new Date();
let _timeline_container_ = null;
let _timeline_svg_area_ = null;
let _timeline_svg_width_ = null;
let _timeline_svg_height_ = null;
let _timeline_axis_pos_ = 30;
let _timeline_max_Date_ = new Date( 8640000000000000);
let _timeline_min_Date_ = new Date(-8640000000000000);

let _timeline_line_dialog_ = null;
let _timeline_node_dialog_ = null;


class Timeline
{
	constructor(timelineId)
	{
		// 載入 timeline.period.js, 借用 timeline.js 的路徑來抓到真正的 timeline.period.js 位置
		$('script').each((idx) => {
			let scriptPath = $('script')[idx].src;
			if (scriptPath.indexOf('timeline.js') >= 0)
			{
				let periodPath = scriptPath.replace('timeline.js', 'timeline.period.js');
				let dialogPath = scriptPath.replace('timeline.js', 'timeline.dialog.js');
				$.getScript(periodPath, () => {console.log('timeline.period.js loaded.');});
				$.getScript(dialogPath, () => {console.log('timeline.dialog.js loaded.');});
			}
		});

		this.timelineId = timelineId;
		this.periodDialog = null;
		this.periodObj = null;

		_timeline_this_object_ = this;
		_timeline_min_time_.setHours(0);
		_timeline_min_time_.setMinutes(0);
		_timeline_min_time_.setSeconds(0);
		_timeline_max_time_.setTime(_timeline_min_time_.getTime() + _timeline_day_in_ms_);

		this.initializeTimeline();
	}

	// create Timeline Gui
	initializeTimeline()
	{
		// clear timeline block
		_timeline_container_ = $('#' + this.timelineId);
		_timeline_container_.empty();

		// create timeline svg block
		_timeline_svg_width_ = _timeline_container_.width();
		_timeline_svg_height_ = _timeline_container_.height();
		_timeline_svg_area_ = this.makeSVG('svg', {id:_timeline_svg_id_, viewBox:`0 0 ${_timeline_svg_width_} ${_timeline_svg_height_}`});
		_timeline_container_.append(_timeline_svg_area_);

		// bind mouse event
		_timeline_container_.on('mousewheel', this.scrollSvgHandler);
		_timeline_container_.on('click', this.clickSvgHandler);
		// 原來 SVG 元件不適用 委派綁定 !!!
		// ref: https://powerkaifu.github.io/2020/10/07/lesson-jq-05.events/
		// $(document).on('click', '.timeline-period-line', this.clickPeriodLine);
		// $(document).on('click', '.timeline-period-Node', this.clickPeriodNode);

		// create axis of timeline
		this.renderAxisAndGrid();
	}

	// 處理 mouse click 事件
	clickSvgHandler(e)
	{
		// click on timeline, add new period
		let timeScale = 0.1 * (_timeline_max_time_ - _timeline_min_time_);
		let periodStart = new Date();
		let periodEnd = new Date();
		periodStart.setTime(_timeline_min_time_.getTime() + timeScale);
		periodEnd.setTime(_timeline_max_time_.getTime() - timeScale);
		_timeline_this_object_.addPeriod('New Period', 'Descripton', periodStart, periodEnd);

		_timeline_this_object_.renderTimeline();
	}

	// Add Period
	addPeriod(pName, pDescription, pStartDate, pEndDate)
	{
		if (this.periodObj == null) this.periodObj = new TimelinePeriod();
		return this.periodObj.addPeriod(pName, pDescription, pStartDate, pEndDate, null);
	}

	// Add Event
	addEvent(period, eName, eDescription, eDate)
	{
		period.addEvent(eName, eDescription, eDate);
	}

	// 處理 mouse 捲動事件
	scrollSvgHandler(e)
	{
		// change display scale
		// 修改 SVG ViewBox size 或 Scale 都會讓線條及文字變型.
		// ==> 直接修改日期邊界並自己算內容.
		// 注意 Date 範圍: -271821/4/20 ~ 271821/4/20
		if (e.originalEvent.deltaY > 0)
		{
			let timeScale = 0.1 * (_timeline_max_time_ - _timeline_min_time_);
			if (e.shiftKey)
			{
				// scroll down --> zoom out
				let timeDiff = (_timeline_max_time_ - _timeline_min_time_) / _timeline_day_in_ms_;
				if (timeDiff < 250000 * 365)
				{
					_timeline_min_time_.setTime(_timeline_min_time_.getTime() - timeScale);
					_timeline_max_time_.setTime(_timeline_max_time_.getTime() + timeScale);
				}
			}else{
				// scroll right
				if ((_timeline_max_Date_ - _timeline_max_time_) > timeScale)
				{
					_timeline_min_time_.setTime(_timeline_min_time_.getTime() + timeScale);
					_timeline_max_time_.setTime(_timeline_max_time_.getTime() + timeScale);
				}
			}
			_timeline_this_object_.renderAxisAndGrid();
		}
		else if (e.originalEvent.deltaY < 0)
		{
			let timeScale = 0.1 * (_timeline_max_time_ - _timeline_min_time_);
			if (e.shiftKey)
			{
				// scroll up --> zoom in
				let timeDiff = (_timeline_max_time_ - _timeline_min_time_) / _timeline_day_in_ms_;
				if (timeDiff > 1)
				{
					_timeline_min_time_.setTime(_timeline_min_time_.getTime() + timeScale);
					_timeline_max_time_.setTime(_timeline_max_time_.getTime() - timeScale);
				}
			}else{
				// scroll left
				if ((_timeline_min_time_ - _timeline_min_Date_) > timeScale)
				{
					_timeline_min_time_.setTime(_timeline_min_time_.getTime() - timeScale);
					_timeline_max_time_.setTime(_timeline_max_time_.getTime() - timeScale);
				}
			}
			_timeline_this_object_.renderAxisAndGrid();
		}
	}

	// 畫出 Axis and Grid
	renderAxisAndGrid()
	{
		// 移除現有 Grid Group, 並建立新的 Grid Group
		$('.timeline-grid-group').remove();
		let gObj = this.makeSVG('g', {class:'timeline-grid-group'});
		_timeline_svg_area_.append(gObj);

		// 畫時間軸主軸線
		let axis_y = _timeline_svg_height_ - _timeline_axis_pos_;
		gObj.prepend(this.makeSVG('line', {class:'timeline-axis', x1:0, y1:axis_y, x2:_timeline_svg_width_, y2:axis_y, stroke:'white'}));

		// 計算所有格子的位置
		// 用 timeDiff 決定格線間距
		let gridSizeIdx = this.findBestGridSizeIndex();
		console.log(`Time Range: ${this.getTimeString(_timeline_min_time_, gridSizeIdx)} ~ ${this.getTimeString(_timeline_max_time_, gridSizeIdx)} (${_timeline_grid_size_map_[gridSizeIdx].day} days)`);

		// 決定格線起點
		let currGridTime = this.getGridStartTime(gridSizeIdx);

		// 畫格線
		while (currGridTime <= _timeline_max_time_)
		{
			if (currGridTime >= _timeline_min_time_)
			{
				// calculate real location in SVG
				let x = this.getSvgXPosition(currGridTime);

				// main unit
				gObj.prepend(this.makeSVG('line', {class:'timeline-unit', x1:x, y1:axis_y, x2:x, y2:axis_y-10}));

				// grid
				gObj.prepend(this.makeSVG('line', {class:'timeline-grid', x1:x, y1:axis_y, x2:x, y2:0}));

				// lable
				let lbl = this.makeSVG('text', {class:'timeline-lable', x:x, y:axis_y, dx:0, dy:0});
				lbl.innerHTML = this.getTimeString(currGridTime, gridSizeIdx);
				gObj.prepend(lbl);
				// console.log('grid at: ' + lbl.innerHTML);

				let lbx = lbl.getBBox();
				$(lbl).attr({dx: -lbx.width/2, dy: lbx.height});
			}
			currGridTime = this.getGridNextTime(currGridTime, gridSizeIdx);
		}

		// 畫 時間線
		this.renderTimeline();
	}

	// calculate best Grid Size, feedback tab name
	findBestGridSizeIndex()
	{
		let bestGridSize = 100;
		let bestTimeDiffInDay = ((_timeline_max_time_ - _timeline_min_time_) / _timeline_day_in_ms_) * bestGridSize / _timeline_svg_width_;

		// find the first grid_size_day that greater than bestTimeDiffInDay
		if (bestTimeDiffInDay <= 0.0417) return 0;
		for (var i in _timeline_grid_size_map_)
		{
			if (_timeline_grid_size_map_[i].day < bestTimeDiffInDay) continue;

			// current grid size is less than best_grid_size
			return i;
		}

		// best not found, impossible...
		return _timeline_grid_size_map_.length - 1;
	}

	// calculate Grid start by grid interval
	getGridStartTime(gridSizeIdx)
	{
		let currGridTime = new Date();
		currGridTime.setTime(_timeline_min_time_.getTime() - _timeline_day_in_ms_);
		currGridTime.setHours(0);
		currGridTime.setMinutes(0);
		currGridTime.setSeconds(0);

		let year = 0;
		switch(_timeline_grid_size_map_[gridSizeIdx].tag)
		{
			case '1h':
			case '3h':
			case 'hd':
			case '1d':
			case '3d':
				break;
			case '1w':
				while (currGridTime.getDay() > 0) currGridTime.setDate(currGridTime.getDate() - 1);
				break;
			case '1m':
			case '1q':
			case '1y':
				if (currGridTime.getMonth() == 0)
				{
					currGridTime.setMonth(11);
					currGridTime.setFullYear(currGridTime.getFullYear() - 1);
				}else{
					currGridTime.setMonth(0);
				}
				currGridTime.setDate(1);
				break;
			case '5y':
			case '1D':
				year = 10 * Math.round(currGridTime.getFullYear() / 10);
				currGridTime.setFullYear(year);
				currGridTime.setMonth(0);
				currGridTime.setDate(1);
				break;
			case '5D':
			case '1c':
				year = 100 * Math.round(currGridTime.getFullYear() / 100);
				currGridTime.setFullYear(year);
				currGridTime.setMonth(0);
				currGridTime.setDate(1);
				break;
			case '5c':
			case '1M':
				year = 1000 * Math.round(currGridTime.getFullYear() / 1000);
				currGridTime.setFullYear(year);
				currGridTime.setMonth(0);
				currGridTime.setDate(1);
				break;
			case '5M':
			case '1W':
				year = 10000 * Math.round(currGridTime.getFullYear() / 10000);
				currGridTime.setFullYear(year);
				currGridTime.setMonth(0);
				currGridTime.setDate(1);
				break;
		}

		return currGridTime;
	}

	// calculate next grid time
	getGridNextTime(currGridTime, gridSizeIdx)
	{
		let nextGridTime = new Date();

		// 不是單純加一段固定時間, 而是跟據不同選擇做不同計算
		let temp;
		switch(_timeline_grid_size_map_[gridSizeIdx].tag)
		{
			case '1h':
				nextGridTime.setTime(currGridTime.getTime() + _timeline_hour_in_ms_);
				break
			case '3h':
				nextGridTime.setTime(currGridTime.getTime() + 3 * _timeline_hour_in_ms_);
				break;
			case 'hd':
				nextGridTime.setTime(currGridTime.getTime() + 12 * _timeline_hour_in_ms_);
				break;
			case '1d':
				nextGridTime.setTime(currGridTime.getTime() + _timeline_day_in_ms_);
				break;
			case '3d':
				nextGridTime.setTime(currGridTime.getTime() + 3 * _timeline_day_in_ms_);
				break;
			case '1w':
				nextGridTime.setTime(currGridTime.getTime() + 7 * _timeline_day_in_ms_);
				break;
			case '1m':
				nextGridTime.setTime(currGridTime.getTime());
				temp = currGridTime.getMonth();
				if (temp >= 11)
				{
					nextGridTime.setFullYear(currGridTime.getFullYear() + 1);
					nextGridTime.setMonth(0);
				}else{
					nextGridTime.setMonth(temp + 1);
				}
				break;
			case '1q':
				nextGridTime.setTime(currGridTime.getTime());
				temp = currGridTime.getMonth();
				if (temp >= 11)
				{
					nextGridTime.setFullYear(currGridTime.getFullYear() + 1);
					nextGridTime.setMonth(0);
				}else{
					nextGridTime.setMonth(temp + 3);
				}
				break
			case '1y':
				nextGridTime.setTime(currGridTime.getTime());
				nextGridTime.setFullYear(currGridTime.getFullYear() + 1);
				break;
			case '5y':
				nextGridTime.setTime(currGridTime.getTime());
				nextGridTime.setFullYear(currGridTime.getFullYear() + 5);
				break;
			case '1D':
				nextGridTime.setTime(currGridTime.getTime());
				nextGridTime.setFullYear(currGridTime.getFullYear() + 10);
				break;
			case '5D':
				nextGridTime.setTime(currGridTime.getTime());
				nextGridTime.setFullYear(currGridTime.getFullYear() + 50);
				break;
			case '1c':
				nextGridTime.setTime(currGridTime.getTime());
				nextGridTime.setFullYear(currGridTime.getFullYear() + 100);
				break;
			case '5c':
				nextGridTime.setTime(currGridTime.getTime());
				nextGridTime.setFullYear(currGridTime.getFullYear() + 500);
				break;
			case '1M':
				nextGridTime.setTime(currGridTime.getTime());
				nextGridTime.setFullYear(currGridTime.getFullYear() + 1000);
				break;
			case '5M':
				nextGridTime.setTime(currGridTime.getTime());
				nextGridTime.setFullYear(currGridTime.getFullYear() + 5000);
				break;
			case '1W':
				nextGridTime.setTime(currGridTime.getTime());
				nextGridTime.setFullYear(currGridTime.getFullYear() + 10000);
				break;
		}
		return nextGridTime;
	}

	// 畫時間線
	renderTimeline()
	{
		if (this.periodObj == null) return;

		// 移除現有 Period Group, 並建立新的 Period Group
		$('.timeline-period-group').remove();
		let gObj = this.makeSVG('g', {class:'timeline-period-group'});
		_timeline_svg_area_.append(gObj);

		let timlineHeight = (_timeline_svg_height_ - _timeline_axis_pos_) / (this.periodObj.maxYLevel + 2);
		for (let pid in this.periodObj.periods)
		{
			// 計算 X 軸位置
			let thisPeriod = this.periodObj.periods[pid];
			let psPos = this.getSvgXPosition(thisPeriod.start);
			let pePos = this.getSvgXPosition(thisPeriod.end);

			// 計算 Y 軸位置
			// to-do: 想一下 Y 軸要怎麼決定
			let yPos = _timeline_svg_height_ - _timeline_axis_pos_ - (thisPeriod.yLevel + 1) * timlineHeight;

			// draw Nodes and Line
			let n1 = this.makeSVG('circle', {class:'timeline-period-node', pid:pid, cx:psPos, cy:yPos, r:10});
			let n2 = this.makeSVG('circle', {class:'timeline-period-node', pid:pid, cx:pePos, cy:yPos, r:10});
			let ln = this.makeSVG('line', {class:'timeline-period-line', pid:pid, x1:psPos, y1:yPos, x2:pePos, y2:yPos});
			$(n1).on('click', this.clickPeriod);
			$(n2).on('click', this.clickPeriod);
			$(ln).on('click', this.clickPeriod);
			gObj.prepend(n1);
			gObj.prepend(n2);
			gObj.prepend(ln);
		}
	}

	// 處理 時間線 click 事件
	// 處理 時間點 click 事件
	// clickPeriodLine(e) { return this.clickPeriod(e); }
	// clickPeriodNode(e) { return this.clickPeriod(e); }
	clickPeriod(e)
	{
		let pid = eval($(this).attr('pid'));
		console.log(`click on period[${pid}]`);

		if (_timeline_this_object_.periodDialog == null) _timeline_this_object_.periodDialog = new TimelineDialog();

		_timeline_this_object_.periodDialog.show(
			_timeline_this_object_.periodObj.periods[pid],
			function() {
				// click Update
				console.log('Update this period');
				let updatePInfo = _timeline_this_object_.periodDialog.getPeriodInfoInDialog();
				_timeline_this_object_.periodObj.updatePeriod(pid, updatePInfo);
				_timeline_this_object_.renderAxisAndGrid();
			},
			function() {
				// click Delete
				console.log('Delete this period');
				_timeline_this_object_.periodObj.deletePeriod(pid);
				_timeline_this_object_.renderAxisAndGrid();
			}
		);

		// jQuery 可以用 return false 達到 stopPropagation() 的效果
		return false;
	}

	// create SVG object
	makeSVG(tag, attrs)
	{
		var el= document.createElementNS('http://www.w3.org/2000/svg', tag);
		for (var k in attrs) el.setAttribute(k, attrs[k]);
		return el;
	}

	// convert Time (Date Object) to Location
	getSvgXPosition(time) { return _timeline_svg_width_ * (time - _timeline_min_time_) / (_timeline_max_time_ - _timeline_min_time_); }

	// convert Time (Date Object) to Text, by Interval Type
	getTimeString(time, gridSizeIdx)
	{
		let timeStr = '';
		switch(_timeline_grid_size_map_[gridSizeIdx].tag)
		{
			case '1h':
			case '3h':
			case 'hd':
				timeStr = time.getFullYear() + '/' + (time.getMonth() + 1) + '/' + time.getDate() + ' ' + time.getHours() + ':00';
				break
			case '1d':
			case '3d':
			case '1w':
				timeStr = time.getFullYear() + '/' + (time.getMonth() + 1) + '/' + time.getDate();
				break;
			case '1m':
			case '1q':
				timeStr = time.getFullYear() + '/' + (time.getMonth() + 1);
				break;
			case '1y':
			case '5y':
			case '1D':
			case '5D':
			case '1c':
			case '5c':
			case '1M':
			case '5M':
			case '1W':
				timeStr = time.getFullYear();
				break;
		}
	
		return timeStr;
	}
}

