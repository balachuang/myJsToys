let svg = '<svg xmlns="http://www.w3.org/2000/svg" version="1.1">{cont}</svg>';
let bar = '<rect width="{w}" height="{h}" x="{x}" y="{y}" fill="white" />';

let eight = [1, 0, 1, 1, 0, 1];
let pageMargine = 50;
let imgMargine = 10;
let minHeight = 50;
let l1ImgWidth = 200;
let l1TxtWidth = 300;
let l2TxtWidth = 300;
let l3TxtWidth = 300;


$(document).ready(init);

function init()
{
	setDim();
	drawEightBars();

	$('.l1-img').click(switchBar);
}

function switchBar()
{
	let idx = eval($(this).attr('seq')) - 1;
	eight[idx] = (eight[idx] + 1) % 2;

	drawEightBars();
}

function getUpBarName() {

}

// 畫出六個爻
function drawEightBars()
{
	for (let n=0; n<eight.length; ++n)
	{
		let oneStr = '';
		if (eight[n] == 1)
		{
			let w = l1ImgWidth - 2 * imgMargine;
			let h = minHeight  - 2 * imgMargine;
			let m = imgMargine;
			oneStr = bar.replace('{w}', w).replace('{h}', h).replace('{x}', m).replace('{y}', m);
		}else{
			let w = (l1ImgWidth - 3 * imgMargine) / 2;
			let h = minHeight  - 2 * imgMargine;
			let m1 = imgMargine;
			let m2 = 2 * imgMargine + w;
			oneStr = bar.replace('{w}', w).replace('{h}', h).replace('{x}', m1).replace('{y}', m1) + bar.replace('{w}', w).replace('{h}', h).replace('{x}', m2).replace('{y}', m1);
		}

		$('div.l1-img[seq="' + (n+1) + '"]').html(svg.replace('{cont}', oneStr));
	}
}

// 畫出單一個爻
// flag = 0: 陰
// flag = 1: 陽
function drawSingleBar(seq, flag, m, w, h)
{
	let oneStr = flag ? 
		bar.replace('{w}', w).replace('{h}', h).replace('{x}', m).replace('{y}', m) :
		bar.replace('{w}', w).replace('{h}', h).replace('{x}', m).replace('{y}', m) + bar.replace('{w}', w).replace('{h}', h).replace('{x}', m).replace('{y}', m);

	if (flag)
	{
		let oneStr = bar.replace('{w}', w).replace('{h}', h).replace('{x}', m).replace('{y}', m);
	}else{
		let oneStr = bar.replace('{w}', w).replace('{h}', h).replace('{x}', m).replace('{y}', m);
	}
	$('div.l1-img[seq="' + (n+1) + '"]').html(oneStr);
}

// 設外框尺吋
function setDim()
{
	$('.l1-1').css({
		top: pageMargine,
		left: pageMargine,
		width: l1ImgWidth,
		height: minHeight * 6
	});
	$('.l1-2').css({
		top: pageMargine,
		left: pageMargine + l1ImgWidth,
		width: l1TxtWidth,
		height: minHeight * 6
	});
	$('.l2').css({
		top: pageMargine,
		left: pageMargine + l1ImgWidth + l1TxtWidth,
		width: l2TxtWidth,
		height: 100
	});
	$('.l3').css({
		top: pageMargine,
		left: pageMargine + l1ImgWidth + l1TxtWidth + l2TxtWidth,
		width: l3TxtWidth,
		height: 100
	});
	$('.l1-img').css({
		left: 0,
		width: l1ImgWidth,
		height: minHeight
	});
	$('.l1-txt').css({
		left: 0,
		width: l1TxtWidth,
		height: minHeight,
		paddingTop: imgMargine
	});
	$('.l2-txt').css({
		left: 0,
		width: l2TxtWidth,
		height: minHeight * 3
	});
	$('.l3-txt').css({
		left: 0,
		width: l3TxtWidth,
		height: minHeight * 6
	});
	$('.l1').each(function(){
		let thisObjSeq = eval($(this).attr('seq'));
		let thisTop = pageMargine + minHeight * (thisObjSeq - 1);
		$(this).css({ top: thisTop });
	});
	$('.l2-txt').each(function(){
		let thisObjSeq = eval($(this).attr('seq'));
		let thisTop = pageMargine + minHeight * 3 * (thisObjSeq - 1);
		$(this).css({ top: thisTop });
	});
	$('.l3-txt').each(function(){
		let thisObjSeq = eval($(this).attr('seq'));
		let thisTop = pageMargine + minHeight * 6 * (thisObjSeq - 1);
		$(this).css({ top: thisTop });
	});
}