// Vue 3.0 with options-base style
// 這次只有用到 Vue 的 data binding 而已
const vm = Vue.createApp({
	data() {
		return {
            centAFreq: 440,
			volumn: 0.2
		}
	},
	mounted: function () {
		// Vue App 第一次 mount 到 DOM 元件後呼叫
	}
}).mount('#piano-configs');
