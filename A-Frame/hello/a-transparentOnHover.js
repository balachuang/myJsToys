// This is an A-Frame Component

AFRAME.registerComponent('transparent-on-hover', {
	schema: { opacity: { default: 0 } },

	init: function () {
		let el = this.el;
		let material = el.getAttribute('material');
		let orgOpacity = material.opacity;
		let tgtOpacity = this.data.opacity;

		el.addEventListener('mouseenter', function () {
			material.opacity = tgtOpacity;
		});
		el.addEventListener('mouseleave', function () {
			material.opacity = orgOpacity;
		});
	}
});
