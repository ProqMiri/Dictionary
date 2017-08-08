var fs = require('fs');
var searchStartDate = "";
var searchEndDate = "";
var w = true, ex = true, s = true, t = true, a = true, v = true;
function loading(id = 0)
{
	if(id == 1)
	{
		$('body').append('<div id="loading"><i class="fa fa-spinner fa-spin fa-5x"></i></div>');
	}
	else
	{
		$('body').find('div#loading').remove();
	}
}
$('#dictionary #tabs>a').click(function(){
	if($(this).hasClass('btn-success')) return;
	$(this).parents('div').find('a.btn-success').removeClass('btn-success');
	$(this).addClass('btn-success');
	var id = $(this).attr('id');
	$('#word').fadeOut();
	$('#expression').fadeOut();
	$('#sentence').fadeOut();
	$('#text').fadeOut();
	if(id == 'expressionTab')
	{
		$('#expression').fadeIn(300);
		if(ex)
		{
			searchExpression();
			ex = false;
		}
	}
	else if(id == 'sentenceTab')
	{
		$('#sentence').fadeIn(300);
		if(s)
		{
			searchSentence();
			s = false;
		}
	}
	else if(id == 'textTab')
	{
		$('#text').fadeIn(300);
		if(t)
		{
			searchText();
			t = false;
		}
	}
	else
	{
		$('#word').fadeIn(300);
		if(w)
		{
			searchWord();
			w = false;
		}
	}
});
$('#multimedia #tabs>a').click(function(){
	if($(this).hasClass('btn-danger')) return;
	$(this).parents('div').find('a.btn-danger').removeClass('btn-danger');
	$(this).addClass('btn-danger');
	var id = $(this).attr('id');
	$('#audio').fadeOut();
	$('#video').fadeOut();
	if(id == 'audioTab')
	{
		$('#audio').fadeIn(300);
		if(a)
		{
			searchAudio();
			a = false;
		}
	}
	else
	{
		$('#video').fadeIn(300);
		if(v)
		{
			searchVideo();
			v = false;
		}
	}
});
function checkSearchDate(startDate, endDate)
{
	if(startDate.trim() == '') return false;
	if(endDate.trim() == '') return false;
	if(startDate.trim().length != endDate.trim().length) return false;
	if(startDate.localeCompare(endDate) == 1) return false;
	return true;
}

function betweenDate(startDate, date, endDate)
{
	if(startDate.localeCompare(date) != 1 && date.localeCompare(endDate) != 1) return true;
	return false;
}
$(document).ready(function(){
	$('#dictionary #tabs>a:eq(0)').click();
	$('#multimedia #tabs>a:eq(0)').click();
});
$('#menu #setting').click(function(){
	$.confirm({
	    title: 'Setting!',
	    useBootstrap: false,
		type: 'blue',
	    typeAnimated: true,
	    boxWidth: "332px",
	    content: '' +
	    '<form action="" class="formName">' +
	    	'<div class="form-group">' +
	    		'<label>İnterval</label>' +
	    		'<div style="margin-bottom:10px;">'+
	    			'<input type="text" placeholder="Start date" class="startDate form-control" style="width:48%; display:inline-block" required />' +
	    			'<input type="text" placeholder="End date" class="endDate form-control" style="width:48%; display:inline-block;margin-left:12px;" required />' +
	    		'</div>' +
	    		'<label>Type of question</label><br>' +
	    		'<div id="type">' +
	    			'<a type="word" class="btn btn-default"><i class="fa fa-wordpress"></i> Word</a> ' +
	    			'<a type="expression" class="btn btn-default"><i class="fa fa-flask"></i> Expression</a> ' +
	    			'<a type="sentence" class="btn btn-default"><i class="fa fa-paper-plane-o"></i> Sentence</a> ' +
	    		'</div>' +
	    		'<label style="margin-top:7px;">Repeat type | time</label>' +
	    		'<div id="timer">' +
	    			'<a type="second" class="btn btn-default" style="display:inline-block"> Second</a> ' +
	    			'<a type="minute" class="btn btn-default" style="display:inline-block"> Minute</a> ' +
	    			'<input type="number" placeholder="Repeat" class="repeat form-control"  required style="width:50%; display: inline-block-block; float:right" />' +
	    		'</div>' +
	    	'</div>' +
	    '</form>',
	    buttons: {
	        formSubmit: {
	            text: 'Save',
	            btnClass: 'btn-blue',
	            action: function () {
	            	var confirm = this.$content;
	                var startDate = confirm.find('form').find('input.startDate').val().trim();
					var endDate = confirm.find('form').find('input.endDate').val().trim();
					var typeOfQuestion = confirm.find('form').find('#type').find('a.btn-danger').attr('type');
					var repeatType = confirm.find('form').find('#timer').find('a.btn-success').attr('type');
					var timer = confirm.find('form').find('#timer').find('input.repeat').val().trim();
					if(timer == '')
					{
						timer = 1;
						repeatType = "minute";
					}
					if(repeatType == 'second' && timer < 10)
					{
						$.alert('Minimum repeation time must be 10 second!');
						return false;
					}
					var data = {"startDate": startDate, "endDate": endDate, "typeOfQuestion": typeOfQuestion, "repeatType": repeatType, "timer": timer};
					fs.writeFileSync('source/setting.txt', JSON.stringify(data));
	            }
	        },
	        cancel: function () {
	            //close
	        },
	    },
	    onContentReady: function () {
	    	var confirm = this.$content;
	    	confirm.parents('.jconfirm').css('cssText', "z-index:100 !important");
	        confirm.find('form').find('input.startDate').datepicker({
	        	autoclose: true,
	        	'format': 'yyyy-mm-dd',
	        });
	        confirm.find('form').find('input.endDate').datepicker({
	        	autoclose: true,
	        	'format': 'yyyy-mm-dd',
	        });
	        confirm.find('form').find('div#type').find('a.btn').click(function(){
	        	if($(this).hasClass('btn-danger')) return;
	        	$(this).parent().find('a.btn-danger').removeClass('btn-danger');
	        	$(this).addClass('btn-danger');
	        });
	        confirm.find('form').find('div#timer').find('a.btn').click(function(){
	        	if($(this).hasClass('btn-success')) return;
	        	$(this).parent().find('a.btn-success').removeClass('btn-success');
	        	$(this).addClass('btn-success');
	        });
	        var data = JSON.parse(fs.readFileSync('source/setting.txt', 'utf8'));
	        confirm.find('form').find('input.startDate').val(data.startDate);
	        confirm.find('form').find('input.endDate').val(data.endDate);
	        confirm.find('form').find('#type').find('a[type="'+data.typeOfQuestion+'"]').click();
	        confirm.find('form').find('#timer').find('a[type="'+data.repeatType+'"]').click();
	        confirm.find('form').find('#timer').find('input.repeat').val(data.timer);
	    }
	});
});
$('#menu #about').click(function(){
	$.confirm({
	    title: 'For question and suggestion!',
	    useBootstrap: false,
		type: 'green',
	    typeAnimated: true,
	    boxWidth: "350px",
	    content: '' +
	    '<form action="" class="formName">' +
	    	'<div class="form-group">' +
	    		'<div style="width:150px; height:150px; padding:0px; border:2px solid #2ecc71; border-radius: 50%; margin-left:90px;overflow:hidden; box-shadow:0px 0px 10px lightgray; margin-bottom:10px;" align="center"><img src="source/img.jpg" style="width:200%;"></div>' +
	    		'<label align="center"><i class="fa fa-user-o"></i> Mirnamiq Abdullayev</label>'+
	    		'<label align="center"><i class="fa fa-envelope-o"></i> seyyidmirnamiqabdullayev@gmail.com</label>'+
	    		'<label align="center"><i class="fa fa-envelope-o"></i> seyyidmirnamiqabdullayev@mail.ru</label>'+
	    		'<label align="center"><i class="fa fa-phone"></i> +994 50 964 14 20, +994 77 335 50 37</label>'+
	    		'<label align="center"><i class="fa fa-whatsapp"></i> +994 50 964 14 20</label>'+
	    	'</div>' +
	    '</form>',
	    buttons: {
	        formSubmit: {
	            text: 'Close',
	            btnClass: 'btn-green',
	            action: function () {
	                
	            }
	        },
	    }
	});
});

function deleteData(index, fileName)
{
	var data =  JSON.parse(fs.readFileSync('translate/'+fileName.toString().trim()+'s.txt', 'utf8'));
	var newData = [];
	data.forEach(function(item, key){
		if(key != index) newData.push(item);
	});
	fs.writeFileSync('translate/'+fileName.toString().trim()+'s.txt', JSON.stringify(newData));
}

function question()
{
	var settingData = JSON.parse(fs.readFileSync('source/setting.txt','utf8'));
	var repeatType = settingData.repeatType.toString().trim();
	var startDate = settingData.startDate.toString().trim();
	var endDate = settingData.endDate.toString().trim();
	var timer = settingData.timer.toString().trim();
	var typeOfQuestion = settingData.typeOfQuestion.toString().trim();
	var type = "Word";
	var width = 300, height = 150;
	if(typeOfQuestion == "word") {
		type = "Word";
	}
	if(typeOfQuestion == "expression") { 
		type = "Expression";
	}
	if(typeOfQuestion == "sentence") { 
		type = "Sentence";
		width = 350;
		height = 160;
	}
	if(repeatType == "minute") timer *= 60;
	timer *= 1000;
	if(!CheckData(startDate, endDate, typeOfQuestion)) return;
	window.setTimeout(function(){
		nw.Window.open('question.html',{'width': width, "height": height}, function(win){
			win.on('closed', function(){
				question();
			});
			win.setAlwaysOnTop(true);
			win.focus();
			win.title = "Question ("+type+")";
		});
	},timer);
}
question();
function CheckData(startDate, endDate, typeOfQuestion)
{
	data = JSON.parse(fs.readFileSync('translate/'+typeOfQuestion+'s.txt','utf8'));
	var win = nw.Window.get();
	var length = data.length;
	if(startDate != '' && endDate != '')
	{
		data.forEach(function(item, key){
			if(startDate.localeCompare(item[2]) != 1 && item[2].localeCompare(endDate) != 1)
			{
				length = 1;
			}
		});
	}
	if(length) return true;
	return false;
}