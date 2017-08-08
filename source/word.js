var searchWordMass = [];
var searchWordMassLength = 0;
var searchWordLastIndex = 0;
function loadWord()
{
	var wordTable = $('#word #wordTable>tbody');
	var currentWordMassLength = searchWordLastIndex + 50;
	for(; searchWordLastIndex < currentWordMassLength && searchWordLastIndex < searchWordMassLength; ++searchWordLastIndex)
	{
		try{
			wordTable.append('<tr index="'+searchWordLastIndex+'" id="'+searchWordMass[searchWordLastIndex][0]+'"><td>'+(searchWordLastIndex+1)+'</td><td>'+searchWordMass[searchWordLastIndex][1]+'</td><td><a class="btn btn-xs btn-default btn-primary"><i class="fa fa-pencil"></i></a> <a class="btn btn-xs btn-default btn-danger"><i class="fa fa-trash"></i></a> <a class="btn btn-xs btn-default btn-info"><i class="fa fa-info-circle"></i></a></td></tr>');
		}
		catch(e){
			//console.log(e);
		}
	}
}
function searchWord()
{
	//loading(1);
	searchWordMass = [];
	searchWordLastIndex = 0;
	searchStartDate = searchStartDate.trim();
	searchEndDate = searchEndDate.trim();
	var search = $('#word input[name="search"]').val().trim();
	var data = JSON.parse(fs.readFileSync('translate/words.txt', 'utf8'));
	$('#word #wordTable>tbody').html('');
	if(checkSearchDate(searchStartDate, searchEndDate))
	{
		if(search == '')
		{
			data.forEach(function(item, key){
				if(betweenDate(searchStartDate, item[2].trim(), searchEndDate) )
				{
					++searchWordMassLength;
					searchWordMass.push([key, item[0], item[1], item[2]]);
				}
			});
		}
		else
		{
			data.forEach(function(item, key){
				if(item[0].indexOf(search) == 0 && betweenDate(searchStartDate, item[2].trim(), searchEndDate))
				{
					++searchWordMassLength;
					searchWordMass.push([key, item[0], item[1], item[2]]);
				}
			});
		}
	}
	else
	{
		if(search == '')
		{
			data.forEach(function(item, key){
				++searchWordMassLength;
				searchWordMass.push([key, item[0], item[1], item[2]]);
			});
		}
		else
		{
			data.forEach(function(item, key){
				if(item[0].indexOf(search) == 0)
				{
					++searchWordMassLength;
					searchWordMass.push([key, item[0], item[1], item[2]]);
				}
			});
		}
	}
	loadWord();
}
function addWord()
{
	$.confirm({
	    title: 'New Word!',
	    draggable: true,
	    boxWidth: '350px',
		useBootstrap: false,
		type: 'green',
	    typeAnimated: true,
	    content: '' +
	    '<form action="" class="formName">' +
	    	'<div class="form-group">' +
	    		'<label>Enter new word</label>' +
	    		'<input type="text" placeholder="New word" class="newWord form-control" required />' +
	    		'<label>Translate</label>' +
	    		'<input type="text" placeholder="Translate" class="translate form-control" required /><br>' +
	    		'<a style="margin-top:10px !important; cursor:pointer;"> <i class="fa fa-plus"> Add translate </a>'+
	    	'</div>' +
	    '</form>',
	    buttons: {
	    	Extra: {
	            text: 'Sentence',
	            btnClass: 'btn-green',
	            action: function () {
	                addSentence();
	                return false;
	            }
	        },
	        formSubmit: {
	            text: 'Approve',
	            btnClass: 'btn-blue',
	            action: function () {
	            	var word = this.$content.find('.newWord').val().trim();
	                var translates = [];
	                this.$content.find('.translate').each(function(){
	                	if($(this).val().trim() != '')
	                	{
	                		translates.push($(this).val().trim());
	                	}
	                });
	                if(word == '')
	                {
	                	$.alert({
						    title: 'Warning!',
						    draggable: true,
						    boxWidth: '350px',
			    			useBootstrap: false,
						    content: 'You must write a word!',
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
	                var data = JSON.parse(fs.readFileSync('translate/words.txt', 'utf8'));
	                var wordIndex = -1;
	                data.forEach(function(item, key){
		            	if(item[0].toString() == word)
		            	{
		            		wordIndex = key;
		            	}
		            });
	                if(wordIndex >= 0)
	                {
	                	// exist ...
	                	currentWordTranslates = data[wordIndex][1];
	                	translates.forEach(function(item, key){
	                		if(currentWordTranslates.indexOf(item) == -1)
	                		{
	                			currentWordTranslates.push(item.toString());
	                		}
	                	});
	                	data[wordIndex][1] = currentWordTranslates;
	                }
	                else
	                {
	                	// add new ...
	                	var date = new Date();
	                	var month = date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1;
	                	date = date.getFullYear()+"-"+month+"-"+date.getDate();
	                	data.push([word.toString(), translates, date]);
	                }
	                fs.writeFileSync('translate/words.txt', JSON.stringify(data));
	                searchWord();
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
function addSentence()
{
	$.confirm({
	    title: 'Sentences!',
	    draggable: true,
	    boxWidth: '400px',
		useBootstrap: false,
		typeAnimated: true,
	    type: 'red',
	    content: '' +
	    '<form action="" class="formName">' +
	    	'<div class="form-group">' +
	    		'<label>Enter sentences</label>' +
	    		'<textarea style="height: 100px;" placeholder="Sentences" class="newWord form-control"/> </textarea>' +
	    	'</div>' +
	    '</form>',
	    buttons: {
	        Close: {
	            text: 'Close',
	            btnClass: 'btn-red',
	            action: function () {}
	        },
	    },
	});
}
$('#word #wordTable>tbody').on('click','tr .btn-danger', function(){
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
	            	deleteData(tr_id,'word');
	            	tr.remove();
	            	searchWord();
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

$('#word .table-responsive').scroll(function(e){
	if($(this).scrollTop() + $(this).innerHeight() >= $(this)[0].scrollHeight)
	{
        loadWord();   
    }
});

$('#word #wordTable>tbody').on('click','tr .btn-info', function(){
	var index = $(this).parents('tr').attr('index');
	try{
		$.confirm({
		    title: 'Detailed!',
		    content: '<label>Word:</label> <i style="font-size:15px">' + searchWordMass[index][1] + '</i><br>' +
		    		'<label>Translate:</label> <i style="font-size:15px">' + searchWordMass[index][2].join(', ') + '</i><br>' +
		    		'<label>Add date:</label> <i style="font-size:15px">' + searchWordMass[index][3] + '</i><br>'
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
$('#word #wordTable>tbody').on('click','tr .btn-primary', function(){
	var index = $(this).parents('tr').attr('index');
	var id = $(this).parents('tr').attr('id');
	var translate = "";
	try{
		searchWordMass[index][2].forEach(function(item, key){
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
	    title: 'Edit Word!',
	    draggable: true,
	    boxWidth: '350px',
		useBootstrap: false,
		type: 'purple',
	    typeAnimated: true,
	    content: '' +
	    '<form action="" class="formName">' +
	    	'<div class="form-group">' +
	    		'<label>Enter new word</label>' +
	    		'<input type="text" placeholder="Edit word" value="'+searchWordMass[index][1]+'" class="newWord form-control" required />' +
	    		'<label>Translate</label>' +
	    		translate +
	    		'<a style="margin-top:10px !important; cursor:pointer;"> <i class="fa fa-plus"> Add translate </a>'+
	    	'</div>' +
	    '</form>',
	    buttons: {
	    	Extra: {
	            text: 'Sentence',
	            btnClass: 'btn-dark',
	            action: function () {
	                addSentence();
	                return false;
	            }
	        },
	        formSubmit: {
	            text: 'Approve',
	            btnClass: 'btn-purple',
	            action: function () {
	            	var word = this.$content.find('.newWord').val().trim();
	                var translates = [];
	                this.$content.find('.translate').each(function(){
	                	if($(this).val().trim() != '')
	                	{
	                		translates.push($(this).val().trim());
	                	}
	                });
	                if(word == '')
	                {
	                	$.alert({
						    title: 'Warning!',
						    draggable: true,
						    boxWidth: '350px',
			    			useBootstrap: false,
						    content: 'You must write a word!',
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
	                var data = JSON.parse(fs.readFileSync('translate/words.txt', 'utf8'));
	                data[id][0] = word;
	                data[id][1] = translates;
	                fs.writeFileSync('translate/words.txt', JSON.stringify(data));
	                searchWord();
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
