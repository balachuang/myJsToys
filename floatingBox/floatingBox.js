const CONST_X_COUNT = 20;
const CONST_Y_COUNT = 10;

var boxCenter = [];

window.onload = function()
{
    let boxXW = 0.667 * window.innerWidth / (CONST_X_COUNT + 1);
    let boxYW = 0.667 * window.innerHeight / (CONST_Y_COUNT + 1);
    let boxW = Math.min(100, Math.min(boxXW, boxYW));

    // create all boxes
    for (var x=0; x<CONST_X_COUNT; ++x)
    {
        for (var y=0; y<CONST_Y_COUNT; ++y)
        {
            let boxId1 = 'floating-box-' + (x+1) + '-' + (y+1);
            let boxId2 = 'top-floating-box-' + (x+1) + '-' + (y+1);
            $('body').append('<div id="'+boxId1+'" class="floating-box"></div>');
            $('body').append('<div id="'+boxId2+'" class="top-floating-box"></div>');
        }
    }

    // set boxes position
    for (var x=0; x<CONST_X_COUNT; ++x)
    {
        for (var y=0; y<CONST_Y_COUNT; ++y)
        {
            let boxId1 = '#floating-box-' + (x+1) + '-' + (y+1);
            let boxId2 = '#top-floating-box-' + (x+1) + '-' + (y+1);

            $(boxId1).css({
                'width'  : boxW,
                'height' : boxW,
                'top'    : (y+1) * window.innerHeight / (CONST_Y_COUNT+1) - boxW / 2,
                'left'   : (x+1) * window.innerWidth  / (CONST_X_COUNT+1) - boxW / 2
            });

            $(boxId2).css({
                'width'  : boxW,
                'height' : boxW,
                'top'    : (y+1) * window.innerHeight / (CONST_Y_COUNT+1) - boxW / 2,
                'left'   : (x+1) * window.innerWidth  / (CONST_X_COUNT+1) - boxW / 2
            });

            boxCenter[boxId1.substring(1)] = {
                x : $(boxId1).position().left + $(boxId1).width()  / 2,
                y : $(boxId1).position().top  + $(boxId1).height() / 2
            };
        }
    }

    $(document).mousemove(mousemoveHandler);
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