let imgElement = document.getElementById('imageSrc');
let inputElement = document.getElementById('fileInput');

inputElement.addEventListener('change', (e) => {
	imgElement.src = URL.createObjectURL(e.target.files[0]);
}, false);

imgElement.onload = function() {
	let mat = cv.imread(imgElement);
	cv.imshow('outputCanvas', mat);
	mat.delete();
};

// var Module = {
// 	// https://emscripten.org/docs/api_reference/module.html#Module.onRuntimeInitialized
// 	onRuntimeInitialized() {
// 		$('#status').html('OpenCV.js is ready.');
// 	}
// };
