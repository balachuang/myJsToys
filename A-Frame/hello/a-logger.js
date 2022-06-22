// This is an A-Frame Component

// AFRAME.registerComponent('logger', {
// 	init: function () {
// 		console.log('My A-Frame logger in initialied.');
// 	}
// });

AFRAME.registerComponent('logger', {
	schema: { type: 'string' },

	init: function () {
		let now = new Date();
		let nowDStr = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
		let nowTStr = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}.${now.getMilliseconds()}`;
		let stringToLog = `[${nowDStr} ${nowTStr}] ${this.data}`;
		console.log(stringToLog);
	}
});
