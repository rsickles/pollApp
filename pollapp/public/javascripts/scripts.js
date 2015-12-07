 //create new survey object, default after subimt
 var number_of_questions = 0;
 var number_of_responses = 0;
 var new_survey = {};
 $(document).ready(function(){
 	//logic for selecting open or multiple choice questions
 	$('#createSurveyForm input').on('change', function() {
   var survey_type = $('input[name=surveytype]:checked', '#createSurveyForm').val();
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
    var new_option_entry = "<input id='name' class='input-field col s12' type='text'><br /><br />";
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

		//used to create JSON structure to send to create survey object
		$("#submit").click(function(){
			var number_of_inputs = $("#createSurveyForm input").length;
			var input_array = $("#createSurveyForm input");
			for(x=0;x<number_of_inputs;x++){
				input_array[x].parentElement.id
				//to get parent id to add correclty to json
			}
		});
 });


			// $.ajax({
			// 	    url: 'survey/' + values,
			// 	    type: 'DELETE',
			// 	    success: function(result) {
			// 	      $("#response").html(result);
			// 	      }
			// 	    });