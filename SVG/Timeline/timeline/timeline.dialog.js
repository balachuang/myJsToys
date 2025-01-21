// 設定變動, 已不用.
// 不提供動態的時間線編輯功能, 而是以我個人經驗為主, 打造可以自由縮放的時間軸.

let _timeline_dialog_ = null;
const _timeline_dialog_html_ =
	'<dialog id="_timeline_period_dialog_" class="timeline-dialog">                                  ' +
	'  <p class="timeline-dialog-title">Period Detail</p>                                            ' +
	'  <form method="dialog">                                                                        ' +
	'    <label for="pname">Name</label><br/>                                                        ' +
	'    <input type="text" id="pname" name="pname" value="">                                        ' +
	'    <label for="pdesc">Description</label><br/>                                                 ' +
	'    <input type="text" id="pdesc" name="pdesc" value="">                                        ' +
	'    <label for="psdate">Start Time</label><br/>                                                 ' +
	'    <input type="date" id="psdate" name="psdate" value="" style="width:47%;">                   ' +
	'    <input type="time" id="pstime" name="pstime" value="" style="width:47%; margin-left:3px;">  ' +
	'    <label for="pedate">End Time</label><br/>                                                   ' +
	'    <input type="date" id="pedate" name="pedate" value="" style="width:47%;">                   ' +
	'    <input type="time" id="petime" name="petime" value="" style="width:47%; margin-left:3px;">  ' +
	'    <br/><br/>                                                                                  ' +
	'    <button id="_timeline_period_dialog_del_btn_" style="float: left;">Delete</button>          ' +
	'    <button id="_timeline_period_dialog_upt_btn_" >Update Period</button>                       ' +
	'    <button id="_timeline_period_dialog_cnl_btn_" (click)="closeDialog()">Cancel</button>       ' +
	'  </form>                                                                                       ' +
	'</dialog>                                                                                       ' ;


class TimelineDialog
{
	constructor()
	{
		// check HTML5 dialog:
		// https://blog.crazyalu.com/2023/05/09/html-dialog/

		// 建立 Dialog
		// 用 HTML5 的 dialog, 不要用 plugin.
		// 用一個 dialog 就好, 不要分兩個.
		let periodDialogHtml = _timeline_dialog_html_.replace(/\s+/mg, ' ');
		if ($('#_timeline_period_dialog_').length <= 0) $('body').prepend(periodDialogHtml);
	}

	// show dialog
	show(periodInfo, updateHandler, deleteHandler)
	{
		console.log(this.getDateString(periodInfo.end));
		console.log(this.getDateString(periodInfo.end));

		// get period information
		$('#pname').val(periodInfo.name);
		$('#pdesc').val(periodInfo.description);
		$('#psdate').val(this.getDateString(periodInfo.start));
		$('#pedate').val(this.getDateString(periodInfo.end));
		$('#pstime').val(this.getTimeString(periodInfo.start));
		$('#petime').val(this.getTimeString(periodInfo.end));
		// document.getElementById(psdate).valueAsDate = this.getDateString(periodInfo.start);
		// document.getElementById(pedate).valueAsDate = this.getDateString(periodInfo.end);

		$('#_timeline_period_dialog_upt_btn_').click(updateHandler);
		$('#_timeline_period_dialog_del_btn_').click(deleteHandler);

		// show dialog
		document.getElementById('_timeline_period_dialog_').showModal();
	}

	getPeriodInfoInDialog()
	{
		let pinfoInDialog = {
			name: $('#pname').val(),
			descipriont: $('#pdesc').val(),
			start: this.getDateTime('psdate', 'pstime'),
			end: this.getDateTime('pedate', 'petime')
			// events: []
		};
		return pinfoInDialog;
	}

	getDateTime(did, tid)
	{
		let date = new Date($('#' + did).val());
		let time = $('#' + tid).val();

		date.setSeconds(0);
		if (time.match(/^\d\d\:\d\d$/))
		{
			let hourStr = time.split(':')[0];
			if (hourStr.startsWith('0')) hourStr = hourStr.substring(1);
			date.setHours(eval(hourStr));
			date.setMinutes(0);
		}else{
			date.setHours(0);
			date.setMinutes(0);
		}
		return date;
	}

	getDateString(time) { return time.getFullYear() + '-' + String(time.getMonth() + 1).padStart(2, '0') + '-' + String(time.getDate()).padStart(2, '0'); }
	getTimeString(time) { return String(time.getHours()).padStart(2, '0') + ':00'; }
}
