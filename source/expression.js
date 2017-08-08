var searchExpressionMass = [];
var searchExpressionMassLength = 0;
var searchExpressionLastIndex = 0;
function loadExpression()
{
	var expressionTable = $('#expression #expressionTable>tbody');
	var currentExpressionMassLength = searchExpressionLastIndex + 50;
	for(; searchExpressionLastIndex < currentExpressionMassLength && searchExpressionLastIndex < searchExpressionMassLength; ++searchExpressionLastIndex)
	{
		try{
			expressionTable.append('<tr index="'+searchExpressionLastIndex+'" id="'+searchExpressionMass[searchExpressionLastIndex][0]+'"><td>'+(searchExpressionLastIndex+1)+'</td><td>'+searchExpressionMass[searchExpressionLastIndex][1]+'</td><td><a class="btn btn-xs btn-default btn-primary"><i class="fa fa-pencil"></i></a> <a class="btn btn-xs btn-default btn-danger"><i class="fa fa-trash"></i></a> <a class="btn btn-xs btn-default btn-info"><i class="fa fa-info-circle"></i></a></td></tr>');
		}
		catch(e){
			//console.log(e);
		}
	}
}
function searchExpression()
{
	//loading(1);
	searchExpressionMass = [];
	searchExpressionLastIndex = 0;
	searchStartDate = searchStartDate.trim();
	searchEndDate = searchEndDate.trim();
	var search = $('#expression input[name="search"]').val().trim();
	var data = JSON.parse(fs.readFileSync('translate/expressions.txt', 'utf8'));
	$('#expression #expressionTable>tbody').html('');
	if(checkSearchDate(searchStartDate, searchEndDate))
	{
		if(search == '')
		{
			data.forEach(function(item, key){
				if(betweenDate(searchStartDate, item[2].trim(), searchEndDate) )
				{
					++searchExpressionMassLength;
					searchExpressionMass.push([key, item[0], item[1], item[2]]);
				}
			});
		}
		else
		{
			data.forEach(function(item, key){
				if(item[0].indexOf(search) == 0 && betweenDate(searchStartDate, item[2].trim(), searchEndDate))
				{
					++searchExpressionMassLength;
					searchExpressionMass.push([key, item[0], item[1], item[2]]);
				}
			});
		}
	}
	else
	{
		if(search == '')
		{
			data.forEach(function(item, key){
				++searchExpressionMassLength;
				searchExpressionMass.push([key, item[0], item[1], item[2]]);
			});
		}
		else
		{
			data.forEach(function(item, key){
				if(item[0].indexOf(search) == 0)
				{
					++searchExpressionMassLength;
					searchExpressionMass.push([key, item[0], item[1], item[2]]);
				}
			});
		}
	}
	loadExpression();
	//loading(0);
}
//searchExpression();
function addExpression()
{
	$.confirm({
	    title: 'New expression!',
	    draggable: true,
	    boxWidth: '350px',
		useBootstrap: false,
		type: 'green',
	    typeAnimated: true,
	    content: '' +
	    '<form action="" class="formName">' +
	    	'<div class="form-group">' +
	    		'<label>Enter New expression</label>' +
	    		'<input type="text" placeholder="New expression" class="newExpression form-control" required />' +
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
	            	var expression = this.$content.find('.newExpression').val().trim();
	                var translates = [];
	                this.$content.find('.translate').each(function(){
	                	if($(this).val().trim() != '')
	                	{
	                		translates.push($(this).val().trim());
	                	}
	                });
	                if(expression == '')
	                {
	                	$.alert({
						    title: 'Warning!',
						    draggable: true,
						    boxWidth: '350px',
			    			useBootstrap: false,
						    content: 'You must write an expression!',
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
	                var data = JSON.parse(fs.readFileSync('translate/expressions.txt', 'utf8'));
	                var expressionIndex = -1;
	                data.forEach(function(item, key){
		            	if(item[0].toString() == expression)
		            	{
		            		expressionIndex = key;
		            	}
		            });
	                if(expressionIndex >= 0)
	                {
	                	// exist ...
	                	currentExpressionTranslates = data[expressionIndex][1];
	                	translates.forEach(function(item, key){
	                		if(currentExpressionTranslates.indexOf(item) == -1)
	                		{
	                			currentExpressionTranslates.push(item.toString());
	                		}
	                	});
	                	data[expressionIndex][1] = currentExpressionTranslates;
	                }
	                else
	                {
	                	// add new ...
	                	var date = new Date();
	                	var month = date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1;
	                	date = date.getFullYear()+"-"+month+"-"+date.getDate();
	                	data.push([expression.toString(), translates, date]);
	                }
	                fs.writeFileSync('translate/expressions.txt', JSON.stringify(data));
	                searchExpression();
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
	    		'<textarea style="height: 100px;" placeholder="Sentences" class="newExpression form-control"/> </textarea>' +
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
$('#expression #expressionTable>tbody').on('click','tr .btn-danger', function(){
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
	            	deleteData(tr_id,'expression');
	            	tr.remove();
	            	searchExpression();
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

$('#expression .table-responsive').scroll(function(e){
	if($(this).scrollTop() + $(this).innerHeight() >= $(this)[0].scrollHeight)
	{
        loadExpression();   
    }
});

$('#expression #expressionTable>tbody').on('click','tr .btn-info', function(){
	var index = $(this).parents('tr').attr('index');
	try{
		$.confirm({
		    title: 'Detailed!',
		    content: '<label>Expression:</label> <i style="font-size:15px">' + searchExpressionMass[index][1] + '</i><br>' +
		    		'<label>Translate:</label> <i style="font-size:15px">' + searchExpressionMass[index][2].join(', ') + '</i><br>' +
		    		'<label>Add date:</label> <i style="font-size:15px">' + searchExpressionMass[index][3] + '</i><br>'
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
$('#expression #expressionTable>tbody').on('click','tr .btn-primary', function(){
	var index = $(this).parents('tr').attr('index');
	var id = $(this).parents('tr').attr('id');
	var translate = "";
	try{
		searchExpressionMass[index][2].forEach(function(item, key){
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
	    title: 'Edit Expression!',
	    draggable: true,
	    boxWidth: '350px',
		useBootstrap: false,
		type: 'purple',
	    typeAnimated: true,
	    content: '' +
	    '<form action="" class="formName">' +
	    	'<div class="form-group">' +
	    		'<label>Enter New expression</label>' +
	    		'<input type="text" placeholder="Edit expression" value="'+searchExpressionMass[index][1]+'" class="newExpression form-control" required />' +
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
	            	var expression = this.$content.find('.newExpression').val().trim();
	                var translates = [];
	                this.$content.find('.translate').each(function(){
	                	if($(this).val().trim() != '')
	                	{
	                		translates.push($(this).val().trim());
	                	}
	                });
	                if(expression == '')
	                {
	                	$.alert({
						    title: 'Warning!',
						    draggable: true,
						    boxWidth: '350px',
			    			useBootstrap: false,
						    content: 'You must write a expression!',
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
	                var data = JSON.parse(fs.readFileSync('translate/expressions.txt', 'utf8'));
	                data[id][0] = expression;
	                data[id][1] = translates;
	                fs.writeFileSync('translate/expressions.txt', JSON.stringify(data));
	                searchExpression();
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
