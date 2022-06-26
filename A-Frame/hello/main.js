let aFrameScene = null;
let circleRadius = 3;
let ObjectCnt = 9;

$(document).ready(function () {
	aFrameScene = $('#af-main-scene');

	init3DScene();
});

function init3DScene() {
	for (let n = 0; n < ObjectCnt; ++n) {
		let angleD = 180 + 360 * n / ObjectCnt;
		let angleR = angleD * Math.PI / 180;
		let boxX = circleRadius * Math.sin(angleR);
		let boxZ = circleRadius * Math.cos(angleR);
		let turX = (circleRadius + 2) * Math.sin(angleR);
		let turZ = (circleRadius + 2) * Math.cos(angleR);

		$('<a-box>').appendTo(aFrameScene)
			.attr({
				'position': `${boxX} 1.5 ${boxZ}`,
				'rotation': `0 ${angleD} 0`,
				'width': '1.5',
				'height': '2',
				'depth': '0.2',
				'color': 'rgb(2,72,130)',
				'change-color-on-hover': 'color: rgba(2,72,130,1)',
				'transparent-on-hover': 'opacity: 0.2'
			});
		$('<a-torus-knot>').appendTo(aFrameScene)
			.attr({
				'position': `${turX} 1.5 ${turZ}`,
				'rotation': `0 ${angleD} 0`,
				'radius': '0.5',
				'metalness': '1',
				'p': '2',
				'q': `${n + 3}`,
				'radius-tubular': '0.06',
				'segments_radial': '36',
				'segments_tubular': '360',
				'color': 'rgb(255,215,0)'
			});
	}
}
