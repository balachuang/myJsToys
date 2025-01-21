// Define Base time period for timeline.js

class TimelineConst
{
	constructor()
	{
		this.majorEvents = [
			{ name: 'Juju 出生',      description: '', start: '1973/06/22', end: '1973/06/22' },
			{ name: 'Bala 出生',      description: '', start: '1973/10/07', end: '1973/10/07' },
			{ name: 'Bibi 出生',      description: '', start: '2008/03/13', end: '2008/03/13' },

			{ name: '九二一大地震',    description: '', start: '1999/09/21', end: '1999/09/21' },
			{ name: '九一一事件',      description: '', start: '2001/09/11', end: '2001/09/11' },

			{ name: '蔣經國過世',      description: '', start: '1988/01/13', end: '1988/01/13' },
			{ name: '李登輝過世',      description: '', start: '2020/07/30', end: '2020/07/30' },

			{ name: 'SARS 疫情',      description: '', start: '2002/11/15', end: '2003/09/15' },
			{ name: 'Covid-19 疫情',  description: '', start: '2019/12/15', end: '2023/02/15' },

			{ name: '拆除中華商場',    description: '', start: '1992/10/20', end: '1992/10/30' },
		];

		this.basePeriod = [
			{ name: '小一',           description: '', start: '1980/09/01', end: '1981/08/31'},
			{ name: '小二',           description: '', start: '1981/09/01', end: '1982/08/31'},
			{ name: '小三',           description: '', start: '1982/09/01', end: '1983/08/31'},
			{ name: '小四',           description: '', start: '1983/09/01', end: '1984/08/31'},
			{ name: '小五',           description: '', start: '1984/09/01', end: '1985/08/31'},
			{ name: '小六',           description: '', start: '1985/09/01', end: '1986/08/31'},
			{ name: '國一',           description: '', start: '1986/09/01', end: '1987/08/31'},
			{ name: '國二',           description: '', start: '1987/09/01', end: '1988/08/31'},
			{ name: '國三',           description: '', start: '1988/09/01', end: '1989/08/31'},
			{ name: '高一',           description: '', start: '1989/09/01', end: '1990/08/31'},
			{ name: '高二',           description: '', start: '1990/09/01', end: '1991/08/31'},
			{ name: '高三',           description: '', start: '1991/09/01', end: '1992/08/31'},
			{ name: '高四',           description: '', start: '1992/09/01', end: '1993/08/31'},
			{ name: '大一',           description: '', start: '1993/09/01', end: '1994/08/31'},
			{ name: '大二',           description: '', start: '1994/09/01', end: '1995/08/31'},
			{ name: '大三',           description: '', start: '1995/09/01', end: '1996/08/31'},
			{ name: '大四',           description: '', start: '1996/09/01', end: '1997/06/30'},
			{ name: '服役',           description: '', start: '1997/07/01', end: '1999/07/01'},
			{ name: '碩士',           description: '', start: '2000/09/01', end: '2001/08/31'},
			{ name: '博士',           description: '', start: '2001/09/01', end: '2006/10/20'},
			{ name: '威知資訊',       description: '', start: '2006/11/01', end: '2010/02/01'},
			{ name: 'TSMC (BITD)',   description: '', start: '2010/03/15', end: '2018/12/31'},
			{ name: 'TSMC (APMITD)', description: '', start: '2019/01/01', end: '2019/06/04'},
			{ name: 'TSMC (ECPD)',   description: '', start: '2019/06/05', end: '2021/01/18'},
			{ name: 'TSMC (IMSD)',   description: '', start: '2021/01/19', end: '2022/01/04'},
			{ name: 'TSMC (FOPD?)',  description: '', start: '2022/01/05', end: '2023/02/12'},
			{ name: 'TSMC (DAPD2?)', description: '', start: '2023/02/13', end: 'now'},
		];

		for (let n in this.basePeriod)
		{
			this.basePeriod[n].start = (this.basePeriod[n].start == 'now') ? new Date() : this.convStringToDate(this.basePeriod[n].start);
			this.basePeriod[n].end   = (this.basePeriod[n].end   == 'now') ? new Date() : this.convStringToDate(this.basePeriod[n].end);
		}

		for (let n in this.majorEvents)
		{
			this.majorEvents[n].start = (this.majorEvents[n].start == 'now') ? new Date() : this.convStringToDate(this.majorEvents[n].start);
			this.majorEvents[n].end   = (this.majorEvents[n].end   == 'now') ? new Date() : this.convStringToDate(this.majorEvents[n].end);
		}
	}

	// DateTime String format: 'yyyy/mm/dd hh:mm:ss' or 'yyyy/mm/dd'
	convStringToDate(dateStr)
	{
		const patt1 = /\d{4}\/\d{2}\/\d{2} \d{2}:\d{2}:\d{2}/;
		const patt2 = /\d{4}\/\d{2}\/\d{2}/;

		let date = null;
		if (patt1.test(dateStr))
		{
			try{
				let yyyy = dateStr.substring(0, 4);
				let MM = eval(this.trim0(dateStr.substring(5, 7))) - 1;
				let dd = eval(this.trim0(dateStr.substring(8, 10)));
				let hh = eval(this.trim0(dateStr.substring(11, 13)));
				let mm = eval(this.trim0(dateStr.substring(14, 16)));
				let ss = eval(this.trim0(dateStr.substring(17)));
				date = new Date(yyyy, MM, dd, hh, mm, ss, 0);
			} catch {
				console.error('ERROR in parse date string: ' + dateStr);
				date = null;
			}
		}
		else if (patt2.test(dateStr))
		{
			try{
				let yyyy = dateStr.substring(0, 4);
				let MM = eval(this.trim0(dateStr.substring(5, 7))) - 1;
				let dd = eval(this.trim0(dateStr.substring(8, 10)));
				date = new Date(yyyy, MM, dd, 0, 0, 0, 0);
			} catch {
				console.error('ERROR in parse date string: ' + dateStr);
				date = null;
			}
		}else{
			console.error('ERROR in parse date string: ' + dateStr);
			date = null;
		}

		return date;
	}

	trim0(numStr)
	{
		let ss = numStr;
		while(ss.indexOf('0') == 0) ss = ss.substring(1);
		return ss;
	}
}
