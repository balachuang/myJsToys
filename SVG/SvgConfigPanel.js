let svgWidth = 0;
let svgHeight = 0;
let svhMargin = 20;
let svgTop = 30;

function setupConfigPanel(configChangeHandler)
{
	// set config panel gui
	// let configButtonHeight = 0;
	let configItems = $('#control-panel input[type="number"]');
	$('#control-panel input[type="number"]').each(function(){
		let thisId = $(this).attr('id');
		let valAry = $(this).attr('quick-btn').split(',');
		let btnHtml = '';
		for (let n=0; n<valAry.length; ++n)
		{
			btnHtml += '<span class="value-btn" target-id="' + thisId + '" >' + valAry[n] + '</span>';
		}
		$(this).after(btnHtml + '<br>');

		let thisBtn = $(this).position().top + $(this).height();
		// if (configButtonHeight < thisBtn) configButtonHeight = thisBtn;
	});

	// set button click handler
	$('.value-btn').click(function(){
		let thisVal = $(this).text();
		let targId = $(this).attr('target-id');
		$('#' + targId).val(thisVal);
		configChangeHandler();
	});

	// set SVG area
	// svgTop += configItems.length * 30;
	svgTop = $('#control-panel').position().top + $('#control-panel').height() + svhMargin;
	svgWidth = $(document).width() - svhMargin * 2;
	svgHeight = window.innerHeight - svhMargin - svgTop - 20;

	$('#svg-container').css({
		'top': svgTop,
		'left': svhMargin,
		'width': svgWidth,
		'height': svgHeight
	});
	$('#svg-area').attr({ 'viewBox': '0 0 ' + svgWidth + ' ' + svgHeight });
}
