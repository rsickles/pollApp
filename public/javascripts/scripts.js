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
			console.log(survey);
			var num_questions = 1;
			var num_responses = 0;
			var new_survey_div = "<div id=survey" + num_surveys + "></div>";
			$("#savedform").append(new_survey_div);
			//append survey url to answer underneath
			var survey_url = "http://localhost:50000/survey/" + result[x]["_id"];
			var url_html = "<a href=" + survey_url + ">" + survey_url + "</a>";
			var $delete_button = $("<a class='btn-floating btn-small waves-effect waves-light red' id='delete_survey'><i class='material-icons'>delete</i></a><br /><br />");
			var $message_button = $("<a class='btn-floating btn-small waves-effect waves-light red' id='message_survey'><i class='material-icons'>message</i></a><br /><br />");
			$("#survey"+num_surveys).html("<h2>"+survey["name"]+"</h2>");
			$("#survey"+num_surveys).append($delete_button);
			$("#survey"+num_surveys).append($message_button);
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
							 // var label = "<label for='response"+num_responses+"'>"+ key +"</label>";
							 // var checkbox = "<input type='radio' name='group" + num_questions + "' id='response" + num_responses + "' />";
							 // $("#question"+num_questions).append(checkbox);
							 // $("#question"+num_questions).append(label);
						}
					});
				  $("#survey"+num_surveys).append(table);
					//after each question and all of its responses are added
					num_questions++;
					question_name = "question" + num_questions;
				}
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
    	alert($(this).parent().attr('id'));
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
				      $('#modal1').openModal();
				      }
				    });
		});
 });