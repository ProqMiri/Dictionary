var searchVideoMass = [];
var searchVideoMassLength = 0;
var searchVideoLastIndex = 0;
function loadVideo()
{
	var wordTable = $('#video #videoTable>tbody');
	var currentWordMassLength = searchVideoLastIndex + 50;
	for(; searchVideoLastIndex < currentWordMassLength && searchVideoLastIndex < searchVideoMassLength; ++searchVideoLastIndex)
	{
		try{
			wordTable.append('<tr index="'+searchVideoLastIndex+'" id="'+searchVideoMass[searchVideoLastIndex][0]+'"><td>'+(searchVideoLastIndex+1)+'</td><td>'+searchVideoMass[searchVideoLastIndex][1]+'</td><td><a class="btn btn-xs btn-default btn-primary"><i class="fa fa-pencil"></i></a> <a class="btn btn-xs btn-default btn-danger"><i class="fa fa-trash"></i></a> <a class="btn btn-xs btn-default btn-info"><i class="fa fa-info-circle"></i></a> <a class="btn btn-xs btn-default btn-success"><i class="fa fa-play"></i></a></td></tr>');
		}
		catch(e){
			//console.log(e);
		}
	}
}
function searchVideo()
{
	//loading(1);
	searchVideoMass = [];
	searchVideoLastIndex = 0;
	searchStartDate = searchStartDate.trim();
	searchEndDate = searchEndDate.trim();
	var search = $('#video input[name="search"]').val().trim();
	var data = JSON.parse(fs.readFileSync('translate/videos.txt', 'utf8'));
	$('#video #videoTable>tbody').html('');
	if(checkSearchDate(searchStartDate, searchEndDate))
	{
		if(search == '')
		{
			data.forEach(function(item, key){
				if(betweenDate(searchStartDate, item[2].trim(), searchEndDate) )
				{
					++searchVideoMassLength;
					searchVideoMass.push([key, item[0], item[1], item[2]]);
				}
			});
		}
		else
		{
			data.forEach(function(item, key){
				if(item[0].indexOf(search) == 0 && betweenDate(searchStartDate, item[2].trim(), searchEndDate))
				{
					++searchVideoMassLength;
					searchVideoMass.push([key, item[0], item[1], item[2]]);
				}
			});
		}
	}
	else
	{
		if(search == '')
		{
			data.forEach(function(item, key){
				++searchVideoMassLength;
				searchVideoMass.push([key, item[0], item[1], item[2]]);
			});
		}
		else
		{
			data.forEach(function(item, key){
				if(item[0].indexOf(search) == 0)
				{
					++searchVideoMassLength;
					searchVideoMass.push([key, item[0], item[1], item[2]]);
				}
			});
		}
	}
	loadVideo();
}
function addVideo()
{
	$.confirm({
	    title: 'New Video!',
	    draggable: true,
	    boxWidth: '350px',
		useBootstrap: false,
		type: 'green',
	    typeAnimated: true,
	    content: '' +
	    '<form action="" class="formName">' +
	    	'<div class="form-group">' +
	    		'<label>Enter video name</label>' +
	    		'<input type="text" placeholder="New word" class="newVideo form-control" required />' +
	    		'<label>Enter video link</label>' +
	    		'<input type="text" placeholder="Video link" class="videoLink form-control" required /><br>' +
	    	'</div>' +
	    '</form>',
	    buttons: {
	    	formSubmit: {
	            text: 'Approve',
	            btnClass: 'btn-blue',
	            action: function () {
	            	var videoName = this.$content.find('.newVideo').val().trim();
	                var videoLink = this.$content.find('.videoLink').val().trim();
	                if(videoName == '')
	                {
	                	$.alert({
						    title: 'Warning!',
						    draggable: true,
						    boxWidth: '350px',
			    			useBootstrap: false,
						    content: 'You must write a video name!',
						});
	                	return false;
	                }
	                if(videoLink == '')
	                {
	                	$.alert({
						    title: 'Warning!',
						    draggable: true,
						    boxWidth: '350px',
			    			useBootstrap: false,
						    content: 'You must enter video link!',
						});
	                	return false;
	                }
	                var data = JSON.parse(fs.readFileSync('translate/videos.txt', 'utf8'));
	                var date = new Date();
	                var month = date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1;
	                date = date.getFullYear()+"-"+month+"-"+date.getDate();
	                data.push([videoName.toString(), videoLink.toString(), date]);
	                fs.writeFileSync('translate/videos.txt', JSON.stringify(data));
	                searchVideo();
	            }
	        },
	        Close: {
	            text: 'Cancel',
	            btnClass: 'btn-red',
	            action: function () {}
	        },
	    }
	});
}
$('#video #videoTable>tbody').on('click','tr .btn-danger', function(){
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
	            	deleteData(tr_id,'video');
	            	tr.remove();
	            	searchVideo();
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

$('#video .table-responsive').scroll(function(e){
	if($(this).scrollTop() + $(this).innerHeight() >= $(this)[0].scrollHeight)
	{
        loadVideo();   
    }
});

$('#video #videoTable>tbody').on('click','tr .btn-info', function(){
	var index = $(this).parents('tr').attr('index');
	try{
		$.confirm({
		    title: 'Detailed!',
		    content: '<label>Video name:</label> <i style="font-size:15px">' + searchVideoMass[index][1] + '</i><br>' +
		    		'<label>Video Link:</label> <i style="font-size:15px">' + searchVideoMass[index][2] + '</i><br>',
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
$('#video #videoTable>tbody').on('click','tr .btn-primary', function(){
	var index = $(this).parents('tr').attr('index');
	var id = $(this).parents('tr').attr('id');
	$.confirm({
	    title: 'Edit Video!',
	    draggable: true,
	    boxWidth: '350px',
		useBootstrap: false,
		type: 'purple',
	    typeAnimated: true,
	    content: '' +
	    '<form action="" class="formName">' +
	    	'<div class="form-group">' +
	    		'<label>Enter video name</label>' +
	    		'<input type="text" placeholder="Edit video name" value="'+searchVideoMass[index][1]+'" class="videoName form-control" required />' +
	    		'<label>Enter video link</label>' +
	    		'<input type="text" placeholder="Edit vide link" value="'+searchVideoMass[index][2]+'" class="videoLink form-control" required />' +
	    	'</div>' +
	    '</form>',
	    buttons: {
	        formSubmit: {
	            text: 'Approve',
	            btnClass: 'btn-purple',
	            action: function () {
	            	var videoName = this.$content.find('.videoName').val().trim();
	                var videoLink = this.$content.find('.videoLink').val().trim();
	                if(videoName == '')
	                {
	                	$.alert({
						    title: 'Warning!',
						    draggable: true,
						    boxWidth: '350px',
			    			useBootstrap: false,
						    content: 'You must write a video name!',
						});
	                	return false;
	                }
	                if(videoLink == '')
	                {
	                	$.alert({
						    title: 'Warning!',
						    draggable: true,
						    boxWidth: '350px',
			    			useBootstrap: false,
						    content: 'You must enter video link!',
						});
	                	return false;
	                }
	                var data = JSON.parse(fs.readFileSync('translate/videos.txt', 'utf8'));
	                data[id][0] = videoName;
	                data[id][1] = videoLink;
	                fs.writeFileSync('translate/videos.txt', JSON.stringify(data));
	                searchVideo();
	            }
	        },
	        Close: {
	            text: 'Cancel',
	            btnClass: 'btn-red',
	            action: function () {}
	        },
	    }
	});
});
$('#video #videoTable>tbody').on('click','tr .btn-success', function(){
	var bu = $(this);
	var index = bu.parents('tr').attr('index');
	bu.find('i').removeClass('fa-play').addClass('fa-pause');
	nw.Window.open(searchVideoMass[index][2],{'width': 500, 'height': 400},function(win){
		win.on('closed',function(){
			bu.find('i').removeClass('fa-pause').addClass('fa-play');
		});
		win.setAlwaysOnTop(true);
	});
});