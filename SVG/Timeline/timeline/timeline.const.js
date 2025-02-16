// Define Base time period for timeline.js

class TimelineConst
{
	constructor()
	{
		this.majorEvents = [
			{ name: 'Juju 出生',      start: '1973/06/22', end: '1973/06/22' },
			{ name: 'Bala 出生',      start: '1973/10/07', end: '1973/10/07' },
			{ name: 'Bibi 出生',      start: '2008/03/13', end: '2008/03/13' },
			{ name: '結婚宴客',       start: '2006/02/15', end: '2006/02/15' },
			// ---
			{ name: '瑞士夢幻之旅',     start: '2002/08/24', end: '2002/09/02' },
			{ name: '北京香港順路玩',   start: '2004/04/04', end: '2004/04/14' }, // uncertaint date
			{ name: '北京出差中',       start: '2008/08/08', end: '2008/08/18' }, // uncertaint date
			{ name: '北海道跟團跑',     start: '2011/03/01', end: '2011/03/05' },
			{ name: '大阪奈良健健行', start: '2013/03/14', end: '2013/03/17' },
			{ name: '京阪神奈健健行', start: '2014/04/14', end: '2014/04/20' },
			{ name: '東京自由行',       start: '2016/04/04', end: '2016/04/10' },
			{ name: '沖縄自駕遊',       start: '2016/07/05', end: '2016/07/10' },
			{ name: '美國極光之旅',     start: '2017/02/25', end: '2017/03/10' },
			{ name: '北海道自駕遊',     start: '2018/04/06', end: '2018/04/14' },
			{ name: '美國旅遊',         start: '2019/02/23', end: '2019/03/10' },
			// ---
			{ name: 'Bibi 首次獨自出遊',  start: '2025/02/12', end: '2025/02/13' },
			// ---
			{ name: '三十回附',         start: '2022/04/08', end: '2022/04/08' },
			{ name: '台積病毒事件',     start: '2018/08/03', end: '2018/08/06' },
			// ---
			{ name: '台北交通黑暗期', start: '1988/07/15', end: '1997/03/15' },
			{ name: '捷運木柵線通車', start: '1996/03/28', end: '1996/03/28' },
			{ name: '捷運淡水線通車', start: '1997/03/28', end: '1997/03/28' },
			// ---
			{ name: '九二一大地震',             start: '1999/09/21', end: '1999/09/21' },
			{ name: '九一一恐怖攻擊',           start: '2001/09/11', end: '2001/09/11' },
			{ name: '三一一大地震 & 福島核災',  start: '2011/03/11', end: '2011/03/11' },
			{ name: '莫拉克颱風 & 八八風災',    start: '2009/08/06', end: '2009/08/10' },
			// ---
			{ name: '全球金融海嘯',     start: '2007/08/09', end: '2008/09/22' },
			// ---
			{ name: '中華商場',         start: '1961/04/22', end: '1992/10/30' },
			{ name: '拆除中華商場',     start: '1992/10/20', end: '1992/10/30' },
			{ name: '臺灣省戒嚴令',     start: '1949/05/20', end: '1987/07/15' },
			{ name: '台海危機',         start: '1995/07/18', end: '1996/03/25' },
			{ name: '台灣首次總統民選', start: '1996/03/23', end: '1996/03/23' },
			// ---
			{ name: '桃莉羊',           start: '1996/07/05', end: '2003/02/14' },
			{ name: '藍牙 1.0 公布',    start: '1999/07/26', end: '1999/07/26' },
			{ name: 'ChatGPT 推出',     start: '2022/11/30', end: '2022/11/30' },
			{ name: 'iPhone 發表~上巿', start: '2007/01/09', end: '2007/06/29' },
			{ name: 'Windows 1.0 推出', start: '1985/11/20', end: '1985/11/20' },
			{ name: 'EHT 黑洞照片',     start: '2019/04/10', end: '2019/04/10' },
			// ---
			{ name: '兩伊戰爭',         start: '1980/09/22', end: '1988/07/18' },
			{ name: '波斯灣戰爭',       start: '1990/08/02', end: '1991/02/28' },
			{ name: '俄烏戰爭',         start: '2022/02/24', end: 'now'        },
			{ name: '柏林圍牆倒塌',     start: '1989/11/09', end: '1989/11/09' },
			{ name: '蘇聯解體',         start: '1991/12/25', end: '1991/12/26' },
			{ name: '六四天安門事件',   start: '1989/06/04', end: '1989/06/04' },
			{ name: '文化大革命',       start: '1966/05/16', end: '1976/10/06' },
			{ name: 'SARS 疫情',        start: '2002/11/15', end: '2003/09/15' },
			{ name: 'Covid-19 疫情',    start: '2019/12/15', end: '2023/02/15' },
		];

		this.basePeriod = [
			{ name: '學齡前',         start: '1973/10/07', end: '1979/08/31' },
			{ name: '小一',           start: '1979/09/01', end: '1980/08/31' },
			{ name: '小二',           start: '1980/09/01', end: '1981/08/31' },
			{ name: '小三',           start: '1981/09/01', end: '1982/08/31' },
			{ name: '小四',           start: '1982/09/01', end: '1983/08/31' },
			{ name: '小五',           start: '1983/09/01', end: '1984/08/31' },
			{ name: '小六',           start: '1984/09/01', end: '1985/08/31' },
			{ name: '國一',           start: '1985/09/01', end: '1986/08/31' },
			{ name: '國二',           start: '1986/09/01', end: '1987/08/31' },
			{ name: '國三',           start: '1987/09/01', end: '1988/08/31' },
			{ name: '高一',           start: '1988/09/01', end: '1989/08/31' },
			{ name: '高二',           start: '1989/09/01', end: '1990/08/31' },
			{ name: '高三',           start: '1990/09/01', end: '1991/08/31' },
			{ name: '高四',           start: '1991/09/01', end: '1992/08/31' },
			{ name: '大一',           start: '1992/09/01', end: '1993/08/31' },
			{ name: '大二',           start: '1993/09/01', end: '1994/08/31' },
			{ name: '大三',           start: '1994/09/01', end: '1995/08/31' },
			{ name: '大四',           start: '1995/09/01', end: '1996/06/30' },
			{ name: '當兵',           start: '1996/07/16', end: '1998/06/11' },
			{ name: '晨軒電腦',       start: '1998/10/01', end: '1999/06/31' },
			{ name: '碩士',           start: '1999/09/01', end: '2000/08/31' },
			{ name: '博士',           start: '2000/09/01', end: '2006/10/20' },
			{ name: '威知資訊',       start: '2006/11/01', end: '2010/02/01' },
			{ name: 'TSMC (BITD)',    start: '2010/03/15', end: '2018/12/31' },
			{ name: 'TSMC (APMITD)',  start: '2019/01/01', end: '2019/06/04' },
			{ name: 'TSMC (ECPD)',    start: '2019/06/05', end: '2021/01/18' },
			{ name: 'TSMC (IMSD)',    start: '2021/01/19', end: '2022/01/04' },
			{ name: 'TSMC (FOPD)',    start: '2022/01/05', end: '2023/02/12' },
			{ name: 'TSMC (DAPD2)',   start: '2023/02/13', end: 'now'        },
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
