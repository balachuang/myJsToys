$(document).ready(initDocuemnt);

function initDocuemnt() {
	$('#make').click(function () {

		$('#maze-container').empty();
		setContainerId('maze-container');

		let intv = eval($('#intv').val());
		setIntervalTime(intv);

		let showStep = $('#show-step').is(":checked");
		setShowStep(showStep);

		let x = eval($('#x-size').val());
		let y = eval($('#y-size').val());
		makeMaze(
			{ 'x': x, 'y': y },
			{ 'x': 0, 'y': 0 },
			{ 'x': x - 1, 'y': y - 1 });
	});
}

