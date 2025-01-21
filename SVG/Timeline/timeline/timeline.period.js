class TimelinePeriod
{
	constructor()
	{
		this.maxYLevel = 0;
		this.periods = [];
	}

	// deep copy task
	// addPeriod(period)
	// {
	// 	return addPeriod(period.name, period.descipriont, period.start, period.end, period.events);
	// }

	// add task
	addPeriod(name, descipriont, start, end, events)
	{
		// calculate Y-level
		// 這個值是用來畫圖時避開其他 period 用的, 如果同一個 level 有任何一條線重疊, 就放進下一個 level
		let yLevelConfirmed = false;
		let thisYLevel = 0;
		while (!yLevelConfirmed)
		{
			let overlap = false;
			for (let pid in this.periods)
			{
				let period = this.periods[pid];
				if (period.yLevel != thisYLevel) continue;
				if (this.isTimeInPeriod(start, period) || this.isTimeInPeriod(end, period))
				{
					thisYLevel++;
					overlap = true;
					break;
				}
			}
			yLevelConfirmed = !overlap;
		}
		if (this.maxYLevel < thisYLevel) this.maxYLevel = thisYLevel;

		let newPeriod = {
			name: name,
			description: descipriont,
			yLevel: thisYLevel,
			start: start,
			end: end,
			events: []
		};

		if (events) events.forEach(t => { addTask(newPeriod, t.name, t.description, t.time); });

		this.periods.push(newPeriod);
		return this.periods.length - 1;
	}

	// add task to exist event
	addTask(period, taskName, taskDescipriont, taskTime)
	{
		let newEvent = {
			name: taskName,
			description: taskDescipriont,
			time: taskTime
		};
		period.events.push(newEvent);
	}

	// deep copy task
	updatePeriod(index, updatePInfo)
	{
		if (index >= this.periods.length) return;

		this.periods[index].name = updatePInfo.name;
		this.periods[index].description = updatePInfo.description;
		this.periods[index].start = updatePInfo.start;
		this.periods[index].end = updatePInfo.end;

		// update Events...
		// if ((updatePInfo.events != null) && (updatePInfo.events.length > 0))
	}

	// deep copy task
	deletePeriod(index)
	{
		if (index >= this.periods.length) return;
		this.periods.splice(index, 1);
	}

	isTimeInPeriod(time, period) { return ((period.start <= time) && (time <= period.end)); }
}
