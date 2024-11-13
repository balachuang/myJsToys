// ref: https://blog.csdn.net/qq_36754767/article/details/91655190
// ref: https://docs.opencv.org/4.x/index.html
// utils.js need to be downloaded from opencv.js tutorial (in Chrome admin panel)

import Canvas2Image from './Canvas2Image/canvas2image.js';


const FPS = 30;
const canvas = $('#canvasOutput').get(0);
let imgIdx = 0;
let show = false;
let store = false;
let utils = new Utils('errorMsg');

$(document).ready(function(){
	$('#camera').click(function(){
		show = !show;
		if (show) {
			// start camera
			$('#camera').val('Turn off the Camera');
			utils.clearError();
			utils.startCamera('qvga', null, 'videoInput');
			setTimeout(processVideo, 100);
		}else{
			$('#camera').val('Turn on the Camera');
			utils.stopCamera();
		}
	});

	$('#store').click(function(){
		store = !store;
		$('#store').val((store ? 'Just Display' : 'Store images'));
	});
	setInterval(storeImage, 1000);
});

function processVideo()
{
	let video = $('#videoInput').get(0);
	let src = new cv.Mat(video.height, video.width, cv.CV_8UC4);
	let dst = new cv.Mat(video.height, video.width, cv.CV_8UC1);
	let camera = new cv.VideoCapture(video);

	try {
		if (!show) {
			// clean and stop.
			src.delete();
			dst.delete();
			return;
		}
		let begin = Date.now();

		// start processing.
		// ref: https://steam.oxxostudio.tw/category/python/ai/opencv-cvtcolor.html
		camera.read(src);
		cv.cvtColor(src, dst, cv.COLOR_BGR2GRAY);
		cv.imshow('canvasOutput', dst);

		// schedule the next one.
		let delay = 1000/FPS - (Date.now() - begin);
		setTimeout(processVideo, delay);
	} catch (err) {
		console.log(err);
	}
};

function storeImage()
{
	if (store)
	{
		let filename = 'capture/img_' + (imgIdx++) + '.png';
		Canvas2Image.saveAsPNG(canvas, canvas.width, canvas.height, filename);
	}
}