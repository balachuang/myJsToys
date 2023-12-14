// 用法:
/*
	// 呼叫 sleep 的 function 一定要宣告成 async, 要用 await 呼叫 sleep
	async func() {
		...
		// 要用 await 呼叫 sleep, 因為 sleep 裡用了 Promise
		await sleep(ms);
		...
	}
*/


async function sleep(ms = 0) {
	return new Promise(r => setTimeout(r, ms));
}
