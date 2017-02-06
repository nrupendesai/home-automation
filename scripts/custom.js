function changeButton(btnObject) {
var server_url = window.location.protocol+"//"+window.location.host+"/";	
	var status = $(btnObject).parent().prev();
	if (status.text() == 'On') {
		// send off signal
		callAjax('POST', server_url, {}, btnObject, true);
	} else {
		// send on signal
		callAjax('POST', server_url, {}, btnObject, false);
	}
}
function callAjax(method, url, data, elementObject, isOn) {
	var status = $(elementObject).parent().prev();
	$
			.ajaxSetup({
				beforeSend : function() {
					$('#fade').show();
					$('#modal').show();
				},
				success : function() {
					if (isOn) {
						status.text('Off').removeClass('alert alert-success');
						$(elementObject).addClass('btn-primary').removeClass(
								'btn-success').text('Turn On');
					} else {
						status.text('On').addClass('alert alert-success');
						$(elementObject).addClass('btn-success').removeClass(
								'btn-primary').text('Turn Off');
					}
					
					if($(elementObject).attr('id') == 'btn_on_of_ac'){
						if($(elementObject).text() == 'Turn Off'){
							$("#temp_slider").prop('disabled',false);
						}else{
							$("#temp_slider").prop('disabled',true);
						}
						
					}
					
					notify(elementObject, 'Succeffully changed !!',
							'alert alert-success');
				},
				complete : function() {
					$('#fade').hide();
					$('#modal').hide();
				},
				error : function() {
					notify(elementObject, 'Enable to communicate',
							'alert alert-danger');
				}
			});
	$.ajax({
		method : method,
		url : url,
		data : data,
	});
}

function notify(obj, msg, css_class) {
	var msgObject = $(obj).parents("table").siblings(".msg")
	msgObject.text(msg).addClass(css_class).show();
	setTimeout(function() {
		msgObject.fadeOut();
	}, 3000);

}
$(document).ready(
		function() {
			var server_url = window.location.protocol+"//"+window.location.host+"/";	
			$.ajax({
				url : server_url+"scripts/data.json",
				dataType : 'json',
				success : function(data) {
					var structure = data.home_structure;
					var general = data.general;
					var air_conditioner = general.air_conditioner;
					delete general['air_conditioner'];
					createAC(air_conditioner);
					createTable('general', [ '#', 'Component Name', 'Status', 'Change' ],general ,'General Appliences');	
					for ( var i in structure) {
						$("div#dropdown_structure").append(
								'<a href="#' + i + '" class= "dropdown-item">'
										+ structure[i] + '</a>');
						createTable(i, [ '#', 'Component Name', 'Status',
								'Change' ], data[i], structure[i]);
					}
					
					
					// create table for each room in house

				}
			});
		});

function createTable(div_id, columns, table_data, structure_name) {
	var new_div = document.createElement('div');
	new_div.setAttribute('id', div_id);
	var h3_tag = document.createElement('h3');
	h3_tag.setAttribute('class', 'main-text');
	h3_tag.appendChild(document.createTextNode(structure_name));
	new_div.appendChild(h3_tag);
	var msg_div = document.createElement('div');
	msg_div.setAttribute('class', 'msg');
	new_div.appendChild(msg_div);
	var table_element = document.createElement('table');
	table_element.setAttribute('class', 'table table-striped');
	var table_head = document.createElement('thead');
	var tr = document.createElement('tr');
	for (var i = 0; i < columns.length; i++) {
		var th = document.createElement('th');
		th.appendChild(document.createTextNode(columns[i]));
		tr.appendChild(th);
	}
	table_head.appendChild(tr);
	table_element.appendChild(table_head);
	new_div.appendChild(table_element);
	table_tbody = document.createElement('tbody');
	var count = 1;
	for ( var i in table_data) {
		var data_tr = document.createElement('tr');
		var td = document.createElement('td');
		td.appendChild(document.createTextNode(count++));
		data_tr.appendChild(td);
		var td = document.createElement('td');
		td.appendChild(document.createTextNode(i));
		data_tr.appendChild(td);
		var td = document.createElement('td');
		var td_button = document.createElement('td');
		var button = document.createElement('button');

		if (table_data[i] === true) {
			td.appendChild(document.createTextNode("On"));
			td.setAttribute('class', 'alert alert-success');
			button.appendChild(document.createTextNode("Turn Off"));
			button.setAttribute('class', 'btn btn-success');
		} else {
			td.appendChild(document.createTextNode("Off"));
			button.appendChild(document.createTextNode("Turn On"));
			button.setAttribute('class', 'btn btn-primary');
		}
		button.setAttribute('onClick', 'changeButton(this);');
		td_button.appendChild(button);
		data_tr.appendChild(td);
		data_tr.appendChild(td_button);

		table_tbody.appendChild(data_tr);
	}
	table_element.appendChild(table_tbody);
	document.getElementById('container').appendChild(new_div);
}

function outputUpdate(vol) {
	document.querySelector('#new_temp').value = vol;
}


function createAC(data){
	if(data.status == true){
		$("#ac #status").text('On');
		$("#btn_on_of_ac").addClass('btn-success').removeClass('btn-primary').text('Turn Off');
		$("#temp_slider").prop('disabled',false);
	}else{
		$("#ac #status").text('Off');
		$("#btn_on_of_ac").removeClass('btn-success').addClass('btn-primary').text('Turn On');
		$("#temp_slider").prop('disabled',true);
	}
	$("#current_temp").text(data.temp);	
}

function changeTemperature(sliderObj){
	var server_url = window.location.protocol+"//"+window.location.host+"/";	
	var new_temp = $("#new_temp").text();
	$
	.ajaxSetup({
		beforeSend : function() {
			$('#fade').show();
			$('#modal').show();
		},
		success : function() {
			$("#current_temp").text(new_temp);
			notify(sliderObj, 'Succeffully changed !!',
					'alert alert-success');
		},
		complete : function() {
			$('#fade').hide();
			$('#modal').hide();
		},
		error : function() {
			notify(sliderObj, 'Enable to communicate',
					'alert alert-danger');
		}
	});
$.ajax({
method : 'POST',
url : server_url,
data : {'new_temp' : new_temp},
});

	
}
