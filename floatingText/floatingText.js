const CONST_X_COUNT = 20;
const CONST_Y_COUNT = 10;
const CONST_WEEK_NAME = ['Sun.','Mon.','Tue.','Wed.','Thu.','Fri.','Sat.'];

var boxCenter = [];

window.onload = function()
{
	$('#timeText').text(currentTime());
	$('#timeText').css({
		'top'  : (window.innerHeight - $('#timeText').height()) / 2,
		'left' : (window.innerWidth  - $('#timeText').width())  / 2
	});

	setInterval(() => {
		$('#timeText').text(currentTime());
	}, 1000);

//    $(document).mousemove(mousemoveHandler);
};

function mousemoveHandler(event)
{
    $('.floating-box').each(function(){
        let thisId = $(this).attr('id');
        let deltaX = (boxCenter[thisId].x - event.pageX) / 30;
        let deltaY = (boxCenter[thisId].y - event.pageY) / 30;
        let delta = Math.max(10, Math.max(Math.abs(deltaX), Math.abs(deltaY)));
    
        $(this).css({
            'box-shadow' : deltaX+'px '+deltaY+'px '+delta+'px '+delta+'px rgb(214, 214, 214)'
        });
    });
}

function currentTime()
{
    let now = new Date();
    let yyyy = now.getFullYear();
    let mm = numberToString(now.getMonth(), 2);
    let dd = numberToString(now.getDate(), 2);
    let hr = numberToString(now.getHours(), 2);
    let mi = numberToString(now.getMinutes(), 2);
    let ss = numberToString(now.getSeconds(), 2);
    let ww = now.getDay();

    let timeStr = yyyy + '-' + mm + '-' + dd + ' (' + CONST_WEEK_NAME[ww] + ') ' + hr + ':' + mi + ':' + ss;
    return timeStr;
}

function numberToString(number, digital)
{
	return ('000' + number).slice(-1 * digital);
}