 $(document).ready(function(){
 	//in order to trigger the modal upon completion
        var socket = io.connect();
        socket.on('viewers', function (data) {
            console.log("HEEEEEE MY NAME IS SICKLES");
            $("#viewers").html("<center>Number of people taking this survey now is: " + data.number + "</center>");
            // $("#savedform").text(data.number);
        });
 	$('.modal-trigger').leanModal();
    $("#modal_confirm").click(function(){
            window.location.href = "http://localhost:50000";
    });
	// http://stackoverflow.com/questions/23403096/how-to-pass-node-variable-to-external-javascript
	// used to figure out how to send ejs variables to external js files
    var survey = $.parseJSON($('#survey').val());
    var num_questions = 1;
    var num_responses = 0;
    console.log(survey);
    $("#survey_name").html("<h2><center>"+survey.name+"</center></h2>");
    if(survey.type == "mc"){
    	var question_name = "question" + num_questions;
    	while(survey[question_name]!=undefined){
    		var question = survey[question_name];
    		var new_question_div = "<br /><div id='question"+num_questions+"'></div>";
    		var question_label = "<h4>"+question["name"]+"</h4>";
    		$("#take_survey_form").append(new_question_div);
    		$("#question"+num_questions).append(question_label);
    		//now get all responses for each question and add them to the DOM
    		//http://stackoverflow.com/questions/1078118/how-do-i-iterate-over-a-json-structure
				jQuery.each(question, function(key, val) {
					if(key!="name"){
						 num_responses++;
						 var label = "<label for='response"+num_responses+"'>"+ key +"</label>";
						 var checkbox = "<input type='radio' name='group" + num_questions + "' id='response" + num_responses + "' />";
						 $("#question"+num_questions).append(checkbox);
						 $("#question"+num_questions).append(label);
					}
				});
    		//after each question and all of its responses are added
    		num_questions++;
    		question_name = "question" + num_questions;
    	}
    }
    else{

    }
    $("#submit").click(function(){
    	var survey_id = $('#survey_id').val();
    	//http://stackoverflow.com/questions/8382156/getting-all-the-checked-checkboxes-in-a-form
    	var response_json = {};
			$("#take_survey_form input:radio:checked").each(function() {
    			var question_number = $(this).parent().attr("id");
    			var question_value = $(this).next().html();
    			//building update string before sending to mongodb
    			var question_response = "survey." + question_number + "." + question_value;
    			response_json[question_response]=1;
			});
			console.log(response_json);
			//now update survey with people who have taken it
			$.ajax({
				    url: '/survey/' + survey_id,
				    type: 'POST',
				    data: {'survey_data':response_json },
				    success: function(result) {
				    	console.log("AJAX COMPLETE");
                        $('#modal1').openModal();
                        //using ajax to update response page without needing to reload it
                        socket.emit("didAnswerSurvey");
				      }
				    });
		});

});