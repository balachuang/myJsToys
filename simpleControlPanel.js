// Setup Control Panels in myToys

$('#control-panel input[type="number"]').each(function(){
	let thisId = $(this).attr('id');
	let valAry = $(this).attr('quick-btn').split(',');
	let btnHtml = '';
	for (let n=0; n<valAry.length; ++n)
	{
		btnHtml += '<span class="value-btn" target-id="' + thisId + '" >' + valAry[n] + '</span>';
	}
	$(this).after(btnHtml + '<br>');
});
