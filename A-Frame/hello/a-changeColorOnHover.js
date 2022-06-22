// This is an A-Frame Component

AFRAME.registerComponent('change-color-on-hover', {
	schema: { color: { default: undefined } },

	init: function () {
		let el = this.el;
		let orgColor = el.getAttribute('material').color;
		let tgtColor = this.data.color;
		if (!tgtColor) tgtColor = orgColor;

		el.addEventListener('mouseenter', function () {
			el.setAttribute('color', tgtColor);
		});
		el.addEventListener('mouseleave', function () {
			el.setAttribute('color', orgColor);
		});
	}
});
