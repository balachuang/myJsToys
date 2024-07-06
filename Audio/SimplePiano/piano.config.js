const cookieName = {
	pWeight: '__cwparam_powder_weight__',
	pwRatio: '__cwparam_powder_water_ratio__',
	blRatio: '__cwparam_bloom_water_ratio__',
	swRatio: '__cwparam_second_water_ratio__',
	wdRatio: '__cwparam_water_in_powder_ratio__'
};

// Vue 3.0 with options-base style
const vm = Vue.createApp({
	data() {
		return {
            centAFreq: 440,
			volumn: 0.2
		}
	},
	mounted: function () {
		// Vue App 第一次 mount 到 DOM 元件後呼叫
		// create central-A-Frequncy lables
		// for (let key in CEN_A_FREQ) this.freqLableAry.push(CEN_A_FREQ[key]);

		// for (let key in CEN_A_FREQ) {
		// 	// this.freqLableAry.push({
		// 	// 	text: key,
		// 	// 	freq: CEN_A_FREQ[key]
		// 	// });
		// 	let lableFreq = CEN_A_FREQ[key];
		// 	let lablePos = 100 * (lableFreq - 20) / (2000 - 20);
		// 	let lableHtml = '<div style="position:absolute; float:left; margin-left:' + lablePos + '%">' + lableFreq + '</div>';
		// 	$('#freq-lable-container').append(lableHtml);
		// }

		// this.pWeight = this.readFromCookie(cookieName.pWeight, this.pWeight);
		// this.pwRatio = this.readFromCookie(cookieName.pwRatio, this.pwRatio);
		// this.blRatio = this.readFromCookie(cookieName.blRatio, this.blRatio);
		// this.swRatio = this.readFromCookie(cookieName.swRatio, this.swRatio);
		// this.wdRatio = this.readFromCookie(cookieName.wdRatio, this.wdRatio);

		// $('#menu li:first').addClass('selected');
		// $('div.cooking-method:first').addClass('selected');
		// this.reCalculation();
		// this.resizeTableCol();
	}
	// methods: {
	// 	onClickMenu(e) {
	// 		$('#menu li').removeClass('selected');
	// 		$('div.cooking-method').removeClass('selected');

	// 		let selectObj = $(e.srcElement);
	// 		let methName = $(e.srcElement).text();
	// 		let methObj = $('div.cooking-method-title:contains("' + methName + '")');
	// 		selectObj.closest('li').addClass('selected');
	// 		methObj.closest('div.cooking-method').addClass('selected');

	// 		this.resizeTableCol();
	// 	},
	// 	onFocusInput(e) {
	// 		$(e.srcElement).select();
	// 	},
	// 	reCalculation() {
	// 		this.menuArray = JSON.parse(JSON.stringify(coffeeMethods));
	// 		for (let i=0; i<this.menuArray.length; ++i) {
	// 			let menu = this.menuArray[i];
	// 			for (let j=0; j<menu.steps.length; ++j) {
	// 				let waterStr = menu.steps[j].water;
	// 				waterStr = waterStr.replace(/p/g, '' + this.pWeight);
	// 				waterStr = waterStr.replace(/r/g, '' + this.pwRatio);
	// 				waterStr = waterStr.replace(/b/g, '' + this.blRatio);
	// 				waterStr = waterStr.replace(/s/g, '' + this.swRatio);
	// 				waterStr = waterStr.replace(/w/g, '' + this.wdRatio);
	// 				let waterNum = Math.round(eval(waterStr));

	// 				this.menuArray[i].steps[j].water = waterNum;
	// 				if (j == 0)
	// 					this.menuArray[i].steps[j].totalWater = waterNum;
	// 				else
	// 					this.menuArray[i].steps[j].totalWater = this.menuArray[i].steps[j-1].totalWater + waterNum;
	// 			}
	// 		}
	// 	},
	// 	resizeTableCol() {
	// 		let tableObj = $('div.selected table');
	// 		let tbWidth = tableObj.width();
	// 		let thObjs = tableObj.find('th');
	// 		let th1Width = 0;
	// 		for (var n=0; n<thObjs.length; ++n) {
	// 			if (n == 0) th1Width = $(thObjs[n]).width();
	// 			else {
	// 				$(thObjs[n]).css('width', (tbWidth - th1Width) / thObjs.length);
	// 			}
	// 		};
	// 	},
	// 	syncCookie() {
	// 		_p = Cookies.get(cookieName.pWeight);
	// 		_r = Cookies.get(cookieName.pwRatio);
	// 		_b = Cookies.get(cookieName.blRatio);
	// 		_s = Cookies.get(cookieName.swRatio);
	// 		_w = Cookies.get(cookieName.wdRatio);
	// 		if (_p == undefined) Cookies.set(cookieName.pWeight, this.pWeight);
	// 		else				 this.pWeight = _p;
	// 		if (_r == undefined) Cookies.set(cookieName.pwRatio, this.pwRatio);
	// 		else				 this.pwRatio = _r;
	// 		if (_b == undefined) Cookies.set(cookieName.blRatio, this.blRatio);
	// 		else				 this.blRatio = _b;
	// 		if (_s == undefined) Cookies.set(cookieName.swRatio, this.swRatio);
	// 		else				 this.swRatio = _s;
	// 		if (_w == undefined) Cookies.set(cookieName.wdRatio, this.wdRatio);
	// 		else				 this.wdRatio = _w;
	// 	},
	// 	readFromCookie(name, defaultVal) {
	// 		val = Cookies.get(name);
	// 		return (val == undefined) ? defaultVal : val;
	// 	},
	// 	saveToCookie(name, val) {
	// 		Cookies.set(name, val);
	// 	}
	// },
	// watch: {
	// 	pWeight: function(val, oldVal) {
	// 		if (val === '') return;
	// 		this.value = val;
	// 		this.oldValue = oldVal;
	// 		this.saveToCookie(cookieName.pWeight, this.value);
	// 		this.reCalculation();
	// 	},
	// 	pwRatio: function(val, oldVal) {
	// 		if (val === '') return;
	// 		this.value = val;
	// 		this.oldValue = oldVal;
	// 		this.saveToCookie(cookieName.pwRatio, this.value);
	// 		this.reCalculation();
	// 	},
	// 	blRatio: function(val, oldVal) {
	// 		if (val === '') return;
	// 		this.value = val;
	// 		this.oldValue = oldVal;
	// 		this.saveToCookie(cookieName.blRatio, this.value);
	// 		this.reCalculation();
	// 	},
	// 	swRatio: function(val, oldVal) {
	// 		if (val === '') return;
	// 		this.value = val;
	// 		this.oldValue = oldVal;
	// 		this.saveToCookie(cookieName.swRatio, this.value);
	// 		this.reCalculation();
	// 	},
	// 	wdRatio: function(val, oldVal) {
	// 		if (val === '') return;
	// 		this.value = val;
	// 		this.oldValue = oldVal;
	// 		this.saveToCookie(cookieName.wdRatio, this.value);
	// 		this.reCalculation();
	// 	}
	// }
}).mount('#piano-configs');
