var searchTextMass = [];
var searchTextMassLength = 0;
var searchTextLastIndex = 0;
function loadText()
{
	var textTable = $('#text #textTable>tbody');
	var currentTextMassLength = searchTextLastIndex + 50;
	for(; searchTextLastIndex < currentTextMassLength && searchTextLastIndex < searchTextMassLength; ++searchTextLastIndex)
	{
		try{
			textTable.append('<tr index="'+searchTextLastIndex+'" id="'+searchTextMass[searchTextLastIndex][0]+'"><td>'+(searchTextLastIndex+1)+'</td><td>'+searchTextMass[searchTextLastIndex][1]+'</td><td><a class="btn btn-xs btn-default btn-primary"><i class="fa fa-pencil"></i></a> <a class="btn btn-xs btn-default btn-danger"><i class="fa fa-trash"></i></a> <a class="btn btn-xs btn-default btn-info"><i class="fa fa-info-circle"></i></a> <a class="btn btn-xs btn-default btn-warning" onclick="examText('+searchTextMass[searchTextLastIndex][0]+')"><i class="fa fa-check"></i></a></td></tr>');
		}
		catch(e){
			//console.log(e);
		}
	}
}
function searchText()
{
	searchTextMass = [];
	searchTextLastIndex = 0;
	searchStartDate = searchStartDate.trim();
	searchEndDate = searchEndDate.trim();
	var search = $('#text input[name="search"]').val().trim();
	var data = JSON.parse(fs.readFileSync('translate/texts.txt', 'utf8'));
	$('#text #textTable>tbody').html('');
	if(checkSearchDate(searchStartDate, searchEndDate))
	{
		if(search == '')
		{
			data.forEach(function(item, key){
				if(betweenDate(searchStartDate, item[2].trim(), searchEndDate) )
				{
					++searchTextMassLength;
					searchTextMass.push([key, item[0], item[1], item[2]]);
				}
			});
		}
		else
		{
			data.forEach(function(item, key){
				if(item[0].indexOf(search) == 0 && betweenDate(searchStartDate, item[2].trim(), searchEndDate))
				{
					++searchTextMassLength;
					searchTextMass.push([key, item[0], item[1], item[2]]);
				}
			});
		}
	}
	else
	{
		if(search == '')
		{
			data.forEach(function(item, key){
				++searchTextMassLength;
				searchTextMass.push([key, item[0], item[1], item[2]]);
			});
		}
		else
		{
			data.forEach(function(item, key){
				if(item[0].indexOf(search) == 0)
				{
					++searchTextMassLength;
					searchTextMass.push([key, item[0], item[1], item[2]]);
				}
			});
		}
	}
	loadText();
}
function addText()
{
	$.confirm({
	    title: 'New Text!',
	    draggable: true,
	    boxWidth: '600px',
		useBootstrap: false,
		type: 'green',
	    typeAnimated: true,
	    content: '' +
	    '<form action="" class="formName">' +
	    	'<div class="form-group">' +
	    		'<label>Enter text name</label>' +
	    		'<input type="text" placeholder="Text name" class="newText form-control" required />' +
	    		'<label>Text</label>' +
	    		'<textarea placeholder="Text" style="height:150px;" class="textContent form-control" required></textarea><br>' +
	    	'</div>' +
	    '</form>',
	    buttons: {
	        formSubmit: {
	            text: 'Approve',
	            btnClass: 'btn-success',
	            action: function () {
	            	var textName = this.$content.find('.newText').val().trim();
	                var getText = this.$content.find('.textContent').val().trim().split('.');
	                var textContent = [];
	                getText.forEach(function(item, key){
	                	if(item.trim() != '')
	                	{
	                		textContent.push(item.trim());
	                	}
	                });
	                if(textName == '')
	                {
	                	$.alert({
						    title: 'Warning!',
						    draggable: true,
						    boxWidth: '350px',
			    			useBootstrap: false,
						    content: 'You must write a name for text!',
						});
	                	return false;
	                }
	                if(textContent.length < 5)
	                {
	                	$.alert({
						    title: 'Warning!',
						    draggable: true,
						    boxWidth: '350px',
			    			useBootstrap: false,
						    content: 'Text must be contain at least 5 sentences!',
						});
	                	return false;
	                }
	                var data = JSON.parse(fs.readFileSync('translate/texts.txt', 'utf8'));
	                var date = new Date();
	                var fileName = date.getFullYear()+""+date.getMonth()+""+date.getDate()+""+date.getHours()+""+date.getMinutes()+""+date.getSeconds()+""+date.getMilliseconds();
	                var month = date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1;
	                date = date.getFullYear()+"-"+month+"-"+date.getDate();
	                data.push([textName.toString(), fileName, date]);
	                fs.writeFileSync('translate/texts.txt', JSON.stringify(data));
	                fs.writeFileSync('translate/text/'+fileName+'.txt', JSON.stringify(textContent));
	                searchText();
	            }
	        },
	        Close: {
	            text: 'Cancel',
	            btnClass: 'btn-red',
	            action: function () {}
	        },
	    },
	});
}
$('#text #textTable>tbody').on('click','tr .btn-danger', function(){
	var tr = $(this).parents('tr');
	var tr_id = tr.attr('id');
	$.confirm({
	    title: 'Warning!',
	    boxWidth: '40%',
		useBootstrap: false,
	    content: 'Do you make sure delete?',
	    type: 'red',
    	typeAnimated: true,
	    buttons: {
	        yes: {
	        	text: 'Yes',
	            btnClass: 'btn-green',
	            action: function () {
	            	deleteData(tr_id,'text');
	            	tr.remove();
	            	searchText();
	            }
	        },
	        no: {
	        	text: 'No',
	            btnClass: 'btn-red',
	            action: function () {
	            }
	        },
	    }
	});
});

$('#text .table-responsive').scroll(function(e){
	if($(this).scrollTop() + $(this).innerHeight() >= $(this)[0].scrollHeight)
	{
        loadText();
    }
});

$('#text #textTable>tbody').on('click','tr .btn-info', function(){
	var index = $(this).parents('tr').attr('index');
	var textContent = JSON.parse(fs.readFileSync('translate/text/'+searchTextMass[index][2]+'.txt','utf8'));
	try{
		$.confirm({
		    title: 'Detailed!',
		    content: '<label>Text name:</label> <i style="font-size:15px">' + searchTextMass[index][1] + '</i><br>' +
		    		'<label>Add date:</label> <i style="font-size:15px">' + searchTextMass[index][3] + '</i><br>'+
		    		'<i style="font-size:15px">' + textContent.join('. ') + '</i><br>'
		    		,
		    boxWidth: '50%',
			useBootstrap: false,
		    type: 'blue',
		    typeAnimated: true,
		    buttons: {
		        tryAgain: {
	            text: 'Close',
	            btnClass: 'btn-info',
	            action: function(){
	            	}
	        	},
		    }
		});
	}
	catch(e)
	{

	}
});
$('#text #textTable>tbody').on('click','tr .btn-primary', function(){
	var index = $(this).parents('tr').attr('index');
	var id = $(this).parents('tr').attr('id');
	try{
		var textContent = JSON.parse(fs.readFileSync('translate/text/'+searchTextMass[index][2]+'.txt','utf8')).join('. ');
	}
	catch(e){}
	$.confirm({
	    title: 'Edit Word!',
	    draggable: true,
	    boxWidth: '600px',
		useBootstrap: false,
		type: 'purple',
	    typeAnimated: true,
	    content: '' +
	    '<form action="" class="formName">' +
	    	'<div class="form-group">' +
	    		'<label>Enter text name</label>' +
	    		'<input type="text" placeholder="Text name" value="'+searchTextMass[index][1]+'" class="newText form-control" required />' +
	    		'<label>Text</label>' +
	    		'<textarea placeholder="Text" style="height:150px;" class="textContent form-control" required>'+textContent+'</textarea><br>' +
	    	'</div>' +
	    '</form>',
	    buttons: {
	        formSubmit: {
	            text: 'Approve',
	            btnClass: 'btn-purple',
	            action: function () {
	            	var textName = this.$content.find('.newText').val().trim();
	                var getText = this.$content.find('.textContent').val().trim().split('.');
	                var textContent = [];
	                getText.forEach(function(item, key){
	                	if(item.trim() != '')
	                	{
	                		textContent.push(item.trim());
	                	}
	                });
	                if(textName == '')
	                {
	                	$.alert({
						    title: 'Warning!',
						    draggable: true,
						    boxWidth: '350px',
			    			useBootstrap: false,
						    content: 'You must write a name for text!',
						});
	                	return false;
	                }
	                if(textContent.length == 0)
	                {
	                	$.alert({
						    title: 'Warning!',
						    draggable: true,
						    boxWidth: '350px',
			    			useBootstrap: false,
						    content: 'You must write at least a sentence!',
						});
	                	return false;
	                }
	                var data = JSON.parse(fs.readFileSync('translate/texts.txt', 'utf8'));
	                data[id][0] = textName;
	                var fileName = data[id][1];
	                fs.writeFileSync('translate/texts.txt', JSON.stringify(data));
	                fs.writeFileSync('translate/text/'+fileName+'.txt', JSON.stringify(textContent));
	                searchText();	           
	            }
	        },
	        Close: {
	            text: 'Cancel',
	            btnClass: 'btn-red',
	            action: function () {}
	        },
	    },
	});
});
function examText(id = -1)
{
	nw.Window.open('textExam.html?id='+id,{'width': 500, 'height': 400},function(win){
		win.setAlwaysOnTop(true);
	});
}