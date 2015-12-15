 //create new survey object, default after subimt
 var number_of_questions = 0;
 var number_of_responses = 0;
 var survey_type;
 var new_survey = {};
 $(document).ready(function(){

 	if(sessionStorage.username !== undefined){
 		console.log(sessionStorage.username);
 		$("#logged_in").css("display","block");
		$("#username_entry").remove();
		show_saved_surveys();
 	}
 	var socket = io.connect();
 	socket.on("reloadResults", function(){
 		show_saved_surveys();
 	});


 	//used when user wants to view all created surveys by him/herself
 	function show_saved_surveys(){
 		var username = sessionStorage.username
	 		$.ajax({
				    url: 'survey',
				    data: {'owner':username},
				    type: 'GET',
				    success: function(result) {
				    	console.log("AJAX COMPLETE");
				      display_owner_surveys(result);
				      }
				    });
 	};

 	//displaying all surveys asked by user to
 	function display_owner_surveys(result){
 		var num_surveys = 0;
 		for(var x=0; x<result.length; x++){
 			num_surveys++;
			var survey = result[x].survey;
			var num_questions = 1;
			var num_responses = 0;
			var new_survey_div = "<div id=survey" + num_surveys + "></div>";
			$("#savedform").append(new_survey_div);
			//append survey url to answer underneath

			//create elements to add to DOM for viewing surveys
			var survey_url = "http://localhost:50000/survey/" + result[x]["_id"];
			var url_html = "<a id='survey_url' href=" + survey_url + ">" + survey_url + "</a>";
			var $delete_button = $("<a class='btn-floating btn-small waves-effect waves-light red' id='delete_survey'><i class='material-icons'>delete</i></a><br /><br />");
			var $message_button = $("<a class='btn-floating btn-small waves-effect waves-light red' id='message_survey'><i class='material-icons'>message</i></a><br /><br />");
			var $message_number_label = $("<br/><label id='phone_number_label' style='display:none;' for='name'>Recipeient Phone Number:</label>");
			var $message_number_field = $("<input id='phone_number' type='text' style='display:none;'>");
			var $send_message_button = 	$("<a id='phone_number_send_button' style='display:none;' class='btn waves-effect waves-light btn-small' id='submit'>Send</a>");

			//append these elements to the DOM
			$("#survey"+num_surveys).html("<h2>"+survey["name"]+"</h2>");
			$("#survey"+num_surveys).append($message_button);
			$("#survey"+num_surveys).append($delete_button);
			$("#survey"+num_surveys).append($message_number_label);
			$("#survey"+num_surveys).append($message_number_field);
			$("#survey"+num_surveys).append($send_message_button);
			$("#survey"+num_surveys).append(url_html);
			//survey div tag and name of survey have been added to the DOM
			//now time to add questions and responses
			if(survey["type"] == "mc"){
				var question_name = "question" + num_questions;
				while(survey[question_name]!=undefined){
					var question = survey[question_name];
					var table = $('<table></table>').addClass("question"+num_questions);
					//var new_question_div = "<br /><div id='question"+num_questions+"'></div>";
					var question_label = "<h5>"+question["name"]+"</h5>";
					$("#survey"+num_surveys).append(question_label);
					//now get all responses for each question and add them to the DOM
					//http://stackoverflow.com/questions/1078118/how-do-i-iterate-over-a-json-structure
					$.each(question, function(key, val) {
						if(key!="name"){
							 num_responses++;
							 var row = '<tr><td>' + key + '</td><td>' + val + '</td></tr>';
    					 table.append(row);
						}
					});
				  $("#survey"+num_surveys).append(table);
					//after each question and all of its responses are added
					num_questions++;
					question_name = "question" + num_questions;
				}
			//else is a open response question
			}else{
				var question_title = "";
				var question_name = "";
				for (var key in survey) {
            if (survey.hasOwnProperty(key) && key!="type" && key!="name" && key!="owner") {
                question_title = $("<h5>"+key+"</h5>");
                question_name = key;
            }
        }
        $("#survey"+num_surveys).append(question_title);
        var response_array = result[x][question_name];
        console.log(response_array);
        var $list = $('<ol></ol>');
				for (var i in response_array) {
					var response = response_array[i];
					console.log(response);
					var $bullet = $("<li></li>").html(response);
					$list.append($bullet);
				}
				$("#survey"+num_surveys).append($list);
			}
 		}
 	};

 	 	$(document.body).on("click", "a#delete_survey", function(){
 	 		//http://stackoverflow.com/questions/8376525/get-value-of-a-string-after-a-slash-in-javascript
 	 		var str = $(this).siblings("a")[1].innerHTML;
			var n = str.lastIndexOf('/');
			var result = str.substring(n + 1);
    	console.log(result);
    	$(this).parent().remove();
    	$.ajax({
				    url: 'survey/'+result,
				    type: 'DELETE',
				    success: function(result) {
				    	console.log($(this).parent());
				      }
				    });
		});
		$(document.body).on("click", "a#message_survey", function(){

    	if ($('#phone_number_label').css('display') == 'none')
			{
				$("#phone_number_label").css("display","block");
    		$("#phone_number").css("display","block");
    		$("#phone_number_send_button").css("display","block");
			}else{
				$("#phone_number_label").css("display","none");
    		$("#phone_number").css("display","none");
    		$("#phone_number_send_button").css("display","none");
			}

		});

		$(document.body).on("click", "a#phone_number_send_button", function(){
			var number = $('#phone_number').val();
			var survey_url = $(this).siblings("#survey_url").text();
			console.log(number);
			console.log(survey_url);
			$.ajax({
				    url: 'survey/send/'+number,
				    type: 'PUT',
				    data: {'survey_link' : survey_url},
				    success: function(result) {
				    	console.log("AJAX COMPLETE");
				    	console.log(result);
				      }
				    });
		});
 	//logic for selecting open or multiple choice questions
 	$('#createSurveyForm input').on('change', function() {
   survey_type = $('input[name=surveytype]:checked', '#createSurveyForm').val();
   // http://stackoverflow.com/questions/596351/how-can-i-know-which-radio-button-is-selected-via-jquery
   if(survey_type == "open"){
   	$("#mcQuestions").css("display", "none");
   	$("#openQuestion").css("display", "block");
   }
   else{
   	$("#openQuestion").css("display", "none");
   	$("#mcQuestions").css("display", "block");
   }
	});

	//button to add responses
	$("#addResponse").click(function(){
		number_of_responses+=1;
    var new_option_label = "<label for='name'>Response " + number_of_responses + ":</label><br />";
    var new_option_entry = "<input id='response' class='input-field col s12' type='text'><br /><br />";
 	  $("#question"+number_of_questions).append( new_option_label).append( new_option_entry);
	});

	//button to add questions
	$("#addQuestion").click(function(){
		number_of_responses = 0;
		number_of_questions+=1;
		var new_question_div = "<br /><div id='question"+number_of_questions+"'></div>";
		var new_question_label = "<br/><label for='name'>Question " + number_of_questions + ":</label>";
		var new_question_entry = "<input id='name' type='text'>";
		$("#AllQuestions").append(new_question_div);
    $("#question"+number_of_questions).append(new_question_label);
		$("#question"+number_of_questions).append(new_question_entry);
	});

		$("#modal_confirm").click(function(){
			location.reload();
		});

		$("#add_name").click(function(){
			var username = $('#user_name').val();
			if(username!==""){
				$("#logged_in").css("display","block");
				$("#username_entry").remove();
				sessionStorage.username = username;
				console.log(sessionStorage.username);
				show_saved_surveys();
			}
		});

		//used to send open response question to survey
		$("#submitOpenQuestions").click(function(){
			var question = $("#textarea1").val();
			new_survey["type"] = "open";
			new_survey["owner"] = sessionStorage.username+"";
			new_survey["name"] = $("#createSurveyForm input")[0].value;
			new_survey[question] = 0;
			$.ajax({
				    url: 'survey',
				    type: 'PUT',
				    data: {'survey' : new_survey},
				    success: function(result) {
				    	console.log("AJAX COMPLETE");
				    	console.log(result);
				      $('#modal1').openModal();
				      new_survey = {};
				      }
				    });
		});

		//used to create JSON structure to send to create survey object
		$("#submit").click(function(){
			var number_of_inputs = $("#createSurveyForm input").length;
			var input_array = $("#createSurveyForm input");
			new_survey["type"] = survey_type;
			new_survey["owner"] = sessionStorage.username+"";
			for(x=0;x<number_of_inputs;x++){
				var survey_category = input_array[x].parentElement.id;
				var value = input_array[x].value;
				if(survey_category==="" && input_array[x].id == "name"){
					new_survey["name"] = value;
				//in order to skip any type values for survey, since already added
				}if(x>2){
					//create new object if not exists
					if(typeof new_survey[survey_category] === "undefined"){
						new_survey[survey_category] = {};
					}
					var question = new_survey[survey_category];
					if(input_array[x].id == "name"){
						question["name"] = value;
					}else{
					question[value] = 0;
					}
				}
			}
			//now submit the new survey to the database
			$.ajax({
				    url: 'survey',
				    type: 'PUT',
				    data: {'survey' : new_survey},
				    success: function(result) {
				    	console.log("AJAX COMPLETE");
				    	console.log(result);
				    	new_survey = {};
				      $('#modal1').openModal();
				      }
				    });
		});
 });