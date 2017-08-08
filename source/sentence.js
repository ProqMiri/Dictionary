var searchSentenceMass = [];
var searchSentenceMassLength = 0;
var searchSentenceLastIndex = 0;
function loadSentence()
{
	var sentenceTable = $('#sentence #sentenceTable>tbody');
	var currentSentenceMassLength = searchSentenceLastIndex + 50;
	for(; searchSentenceLastIndex < currentSentenceMassLength && searchSentenceLastIndex < searchSentenceMassLength; ++searchSentenceLastIndex)
	{
		try{
			sentenceTable.append('<tr index="'+searchSentenceLastIndex+'" id="'+searchSentenceMass[searchSentenceLastIndex][0]+'"><td>'+(searchSentenceLastIndex+1)+'</td><td>'+searchSentenceMass[searchSentenceLastIndex][1]+'</td><td><a class="btn btn-xs btn-default btn-primary"><i class="fa fa-pencil"></i></a> <a class="btn btn-xs btn-default btn-danger"><i class="fa fa-trash"></i></a> <a class="btn btn-xs btn-default btn-info"><i class="fa fa-info-circle"></i></a></td></tr>');
		}
		catch(e){
			//console.log(e);
		}
	}
}
function searchSentence()
{
	//loading(1);
	searchSentenceMass = [];
	searchSentenceLastIndex = 0;
	searchStartDate = searchStartDate.trim();
	searchEndDate = searchEndDate.trim();
	var search = $('#sentence input[name="search"]').val().trim();
	var data = JSON.parse(fs.readFileSync('translate/sentences.txt', 'utf8'));
	$('#sentence #sentenceTable>tbody').html('');
	if(checkSearchDate(searchStartDate, searchEndDate))
	{
		if(search == '')
		{
			data.forEach(function(item, key){
				if(betweenDate(searchStartDate, item[2].trim(), searchEndDate) )
				{
					++searchSentenceMassLength;
					searchSentenceMass.push([key, item[0], item[1], item[2]]);
				}
			});
		}
		else
		{
			data.forEach(function(item, key){
				if(item[0].indexOf(search) == 0 && betweenDate(searchStartDate, item[2].trim(), searchEndDate))
				{
					++searchSentenceMassLength;
					searchSentenceMass.push([key, item[0], item[1], item[2]]);
				}
			});
		}
	}
	else
	{
		if(search == '')
		{
			data.forEach(function(item, key){
				++searchSentenceMassLength;
				searchSentenceMass.push([key, item[0], item[1], item[2]]);
			});
		}
		else
		{
			data.forEach(function(item, key){
				if(item[0].indexOf(search) == 0)
				{
					++searchSentenceMassLength;
					searchSentenceMass.push([key, item[0], item[1], item[2]]);
				}
			});
		}
	}
	loadSentence();
	//loading(0);
}
//searchSentence();
function addSentences()
{
	$.confirm({
	    title: 'New Sentence!',
	    draggable: true,
	    boxWidth: '350px',
		useBootstrap: false,
		type: 'green',
	    typeAnimated: true,
	    content: '' +
	    '<form action="" class="formName">' +
	    	'<div class="form-group">' +
	    		'<label>Enter new Sentence</label>' +
	    		'<input type="text" placeholder="New sentence" class="newSentence form-control" required />' +
	    		'<label>Translate</label>' +
	    		'<input type="text" placeholder="Translate" class="translate form-control" required /><br>' +
	    		'<a style="margin-top:10px !important; cursor:pointer;"> <i class="fa fa-plus"> Add translate </a>'+
	    	'</div>' +
	    '</form>',
	    buttons: {
	        formSubmit: {
	            text: 'Approve',
	            btnClass: 'btn-blue',
	            action: function () {
	            	var sentence = this.$content.find('.newSentence').val().trim();
	                var translates = [];
	                this.$content.find('.translate').each(function(){
	                	if($(this).val().trim() != '')
	                	{
	                		translates.push($(this).val().trim());
	                	}
	                });
	                if(sentence == '')
	                {
	                	$.alert({
						    title: 'Warning!',
						    draggable: true,
						    boxWidth: '350px',
			    			useBootstrap: false,
						    content: 'You must write a sentence!',
						});
	                	return false;
	                }
	                if(translates.length == 0)
	                {
	                	$.alert({
						    title: 'Warning!',
						    draggable: true,
						    boxWidth: '350px',
			    			useBootstrap: false,
						    content: 'You must write at least a translate!',
						});
	                	return false;
	                }
	                var data = JSON.parse(fs.readFileSync('translate/sentences.txt', 'utf8'));
	                var sentenceIndex = -1;
	                data.forEach(function(item, key){
		            	if(item[0].toString() == sentence)
		            	{
		            		sentenceIndex = key;
		            	}
		            });
	                if(sentenceIndex >= 0)
	                {
	                	// exist ...
	                	currentSentenceTranslates = data[sentenceIndex][1];
	                	translates.forEach(function(item, key){
	                		if(currentSentenceTranslates.indexOf(item) == -1)
	                		{
	                			currentSentenceTranslates.push(item.toString());
	                		}
	                	});
	                	data[sentenceIndex][1] = currentSentenceTranslates;
	                }
	                else
	                {
	                	// add new ...
	                	var date = new Date();
	                	var month = date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1;
	                	date = date.getFullYear()+"-"+month+"-"+date.getDate();
	                	data.push([sentence.toString(), translates, date]);
	                }
	                fs.writeFileSync('translate/sentences.txt', JSON.stringify(data));
	                searchSentence();
	            }
	        },
	        Close: {
	            text: 'Cancel',
	            btnClass: 'btn-red',
	            action: function () {}
	        },
	    },
	    onContentReady: function () {
	        this.$content.find('form').find('a').click(function(){
	        	$(this).before('<input style="width:95%;margin-right:5px; display:inline-block;" type="text" placeholder="Translate" class="translate form-control"/><i class="fa fa-times" style="cursor:pointer;"></i><br><br>');
	        });
	        this.$content.find('form').on('click', '.fa-times', function(){
	        	$(this).prev('input').remove();
	        	$(this).next('br').remove();
	        	$(this).next('br').remove();
	        	$(this).remove();
	        });
	    }
	});
}

$('#sentence #sentenceTable>tbody').on('click','tr .btn-danger', function(){
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
	            	deleteData(tr_id,'sentence');
	            	tr.remove();
	            	searchSentence();
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

$('#sentence .table-responsive').scroll(function(e){
	if($(this).scrollTop() + $(this).innerHeight() >= $(this)[0].scrollHeight)
	{
        loadSentence();   
    }
});

$('#sentence #sentenceTable>tbody').on('click','tr .btn-info', function(){
	var index = $(this).parents('tr').attr('index');
	try{
		$.confirm({
		    title: 'Detailed!',
		    content: '<label>Sentence:</label> <i style="font-size:15px">' + searchSentenceMass[index][1] + '</i><br>' +
		    		'<label>Translate:</label> <i style="font-size:15px">' + searchSentenceMass[index][2].join(', ') + '</i><br>' +
		    		'<label>Add date:</label> <i style="font-size:15px">' + searchSentenceMass[index][3] + '</i><br>'
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
$('#sentence #sentenceTable>tbody').on('click','tr .btn-primary', function(){
	var index = $(this).parents('tr').attr('index');
	var id = $(this).parents('tr').attr('id');
	var translate = "";
	try{
		searchSentenceMass[index][2].forEach(function(item, key){
			if(key)
			{
				translate += '<input style="width:95%;margin-right:5px; display:inline-block;" value="'+item+'" type="text" placeholder="Translate" class="translate form-control"/><i class="fa fa-times" style="cursor:pointer;"></i><br><br>';
			}
			else
			{
				translate += '<input type="text" placeholder="Translate" value="'+item+'" class="translate form-control" required /><br>';
			}
		});
	}
	catch(e){}
	$.confirm({
	    title: 'Edit Sentence!',
	    draggable: true,
	    boxWidth: '350px',
		useBootstrap: false,
		type: 'purple',
	    typeAnimated: true,
	    content: '' +
	    '<form action="" class="formName">' +
	    	'<div class="form-group">' +
	    		'<label>Enter new Sentence</label>' +
	    		'<input type="text" placeholder="Edit Sentence" value="'+searchSentenceMass[index][1]+'" class="newSentence form-control" required />' +
	    		'<label>Translate</label>' +
	    		translate +
	    		'<a style="margin-top:10px !important; cursor:pointer;"> <i class="fa fa-plus"> Add translate </a>'+
	    	'</div>' +
	    '</form>',
	    buttons: {
	        formSubmit: {
	            text: 'Approve',
	            btnClass: 'btn-purple',
	            action: function () {
	            	var sentence = this.$content.find('.newSentence').val().trim();
	                var translates = [];
	                this.$content.find('.translate').each(function(){
	                	if($(this).val().trim() != '')
	                	{
	                		translates.push($(this).val().trim());
	                	}
	                });
	                if(sentence == '')
	                {
	                	$.alert({
						    title: 'Warning!',
						    draggable: true,
						    boxWidth: '350px',
			    			useBootstrap: false,
						    content: 'You must write a sentence!',
						});
	                	return false;
	                }
	                if(translates.length == 0)
	                {
	                	$.alert({
						    title: 'Warning!',
						    draggable: true,
						    boxWidth: '350px',
			    			useBootstrap: false,
						    content: 'You must write al least a translate!',
						});
	                	return false;
	                }
	                //console.log(translates);return;
	                var data = JSON.parse(fs.readFileSync('translate/sentences.txt', 'utf8'));
	                data[id][0] = sentence;
	                data[id][1] = translates;
	                fs.writeFileSync('translate/sentences.txt', JSON.stringify(data));
	                searchSentence();
	            }
	        },
	        Close: {
	            text: 'Cancel',
	            btnClass: 'btn-red',
	            action: function () {}
	        },
	    },
	    onContentReady: function () {
	        this.$content.find('form').find('a').click(function(){
	        	$(this).before('<input style="width:95%;margin-right:5px; display:inline-block;" type="text" placeholder="Translate" class="translate form-control"/><i class="fa fa-times" style="cursor:pointer;"></i><br><br>');
	        });
	        this.$content.find('form').on('click', '.fa-times', function(){
	        	$(this).prev('input').remove();
	        	$(this).next('br').remove();
	        	$(this).next('br').remove();
	        	$(this).remove();
	        });
	    }
	});
});