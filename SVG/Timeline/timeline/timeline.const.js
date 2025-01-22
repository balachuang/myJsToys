// Define Base time period for timeline.js

class TimelineConst
{
	constructor()
	{
		this.majorEvents = [
			{ name: 'Juju 出生',      description: '', start: '1973/06/22', end: '1973/06/22' },
			{ name: 'Bala 出生',      description: '', start: '1973/10/07', end: '1973/10/07' },
			{ name: 'Bibi 出生',      description: '', start: '2008/03/13', end: '2008/03/13' },
			{ name: '結婚',           description: '', start: '2006/02/15', end: '2006/02/15' },

			{ name: '大阪自由行',     description: '', start: '2013/03/14', end: '2013/03/17' },
			{ name: '沖縄自罵遊',     description: '', start: '2016/07/05', end: '2016/07/10' },
			{ name: '美國極光之旅',   description: '', start: '2017/02/25', end: '2017/03/10' },
			{ name: '北海道旅遊',     description: '', start: '2018/04/06', end: '2018/04/14' },
			{ name: '美國旅遊',       description: '', start: '2019/02/23', end: '2019/03/10' },

			{ name: '九二一大地震',    description: '', start: '1999/09/21', end: '1999/09/21' },
			{ name: '九一一恐怖攻擊',  description: '', start: '2001/09/11', end: '2001/09/11' },
			{ name: '三一一大地震 & 福島核災',    description: '', start: '2011/03/11', end: '2011/03/11' },
			{ name: '莫拉克颱風 & 八八風災',    description: '', start: '2009/08/06', end: '2009/08/10' },

			{ name: '全球金融海嘯',    description: '', start: '2007/08/09', end: '2008/09/22' },

			{ name: 'SARS 疫情',      description: '', start: '2002/11/15', end: '2003/09/15' },
			{ name: 'Covid-19 疫情',  description: '', start: '2019/12/15', end: '2023/02/15' },

			{ name: '中華商場',        description: '', start: '1961/04/22', end: '1992/10/30' },
			{ name: '拆除中華商場',    description: '', start: '1992/10/20', end: '1992/10/30' },

			{ name: '桃莉羊',           description: '', start: '1996/07/05', end: '2003/02/14' },
			{ name: '藍牙 1.0 公布',    description: '', start: '1999/07/26', end: '1999/07/26' },
			{ name: 'ChatGPT 推出',     description: '', start: '2022/11/30', end: '2022/11/30' },
			{ name: 'iPhone 發表~上巿', description: '', start: '2007/01/09', end: '2007/06/29' },
			{ name: 'Windows 1.0 推出', description: '', start: '1985/11/20', end: '1985/11/20' },

			{ name: '兩伊戰爭',      description: '', start: '1980/09/22', end: '1988/07/18' },
			{ name: '波斯灣戰爭',    description: '', start: '1990/08/02', end: '1991/02/28' },
			{ name: '俄烏戰爭',      description: '', start: '2022/02/24', end: 'now' },
			{ name: '柏林圍牆倒塌',  description: '', start: '1989/11/09', end: '1989/11/09' },
			{ name: '蘇聯解體',      description: '', start: '1991/12/25', end: '1991/12/26' },
			{ name: '六四天安門事件', description: '', start: '1989/06/04', end: '1989/06/04' },
			{ name: '文化大革命',    description: '', start: '1966/05/16', end: '1976/10/06' },

			{ name: '臺灣省戒嚴令',     description: '', start: '1949/05/20', end: '1987/07/15' },
			{ name: '台海危機',        description: '', start: '1995/07/18', end: '1996/03/25' },
			{ name: '台灣首次總統民選', description: '', start: '1996/03/23', end: '1996/03/23' },

			{ name: 'EHT 黑洞照片',  description: '', start: '2019/04/10', end: '2019/04/10' },
		];

		this.basePeriod = [
			{ name: '學齡前',         description: '', start: '1973/10/07', end: '1979/08/31'},
			{ name: '小一',           description: '', start: '1979/09/01', end: '1980/08/31'},
			{ name: '小二',           description: '', start: '1980/09/01', end: '1981/08/31'},
			{ name: '小三',           description: '', start: '1981/09/01', end: '1982/08/31'},
			{ name: '小四',           description: '', start: '1982/09/01', end: '1983/08/31'},
			{ name: '小五',           description: '', start: '1983/09/01', end: '1984/08/31'},
			{ name: '小六',           description: '', start: '1984/09/01', end: '1985/08/31'},
			{ name: '國一',           description: '', start: '1985/09/01', end: '1986/08/31'},
			{ name: '國二',           description: '', start: '1986/09/01', end: '1987/08/31'},
			{ name: '國三',           description: '', start: '1987/09/01', end: '1988/08/31'},
			{ name: '高一',           description: '', start: '1988/09/01', end: '1989/08/31'},
			{ name: '高二',           description: '', start: '1989/09/01', end: '1990/08/31'},
			{ name: '高三',           description: '', start: '1990/09/01', end: '1991/08/31'},
			{ name: '高四',           description: '', start: '1991/09/01', end: '1992/08/31'},
			{ name: '大一',           description: '', start: '1992/09/01', end: '1993/08/31'},
			{ name: '大二',           description: '', start: '1993/09/01', end: '1994/08/31'},
			{ name: '大三',           description: '', start: '1994/09/01', end: '1995/08/31'},
			{ name: '大四',           description: '', start: '1995/09/01', end: '1996/06/30'},
			{ name: '當兵',           description: '', start: '1996/08/01', end: '1998/04/01'},
			{ name: '晨軒電腦',       description: '', start: '1998/06/01', end: '1999/06/31'},
			{ name: '碩士',           description: '', start: '1999/09/01', end: '2000/08/31'},
			{ name: '博士',           description: '', start: '2000/09/01', end: '2006/10/20'},
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
			this.basePeriod[n].start = this.convStringToDate(this.basePeriod[n].start);
			this.basePeriod[n].end   = this.convStringToDate(this.basePeriod[n].end);
		}

		for (let n in this.majorEvents)
		{
			this.majorEvents[n].start = this.convStringToDate(this.majorEvents[n].start);
			this.majorEvents[n].end   = this.convStringToDate(this.majorEvents[n].end);
		}
	}

	// DateTime String format: 'now' OR 'yyyy/mm/dd hh:mm:ss' OR 'yyyy/mm/dd'
	convStringToDate(dateStr)
	{
		if (dateStr.toLowerCase() == 'now') return new Date();

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
