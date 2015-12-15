 $(document).ready(function(){
 	//in order to trigger the modal upon completion
        var socket = io.connect("http://nodejs-ryandomain.rhcloud.com:8000");
 	$('.modal-trigger').leanModal();
    $("#modal_confirm").click(function(){
            window.location.href = "http://nodejs-ryandomain.rhcloud.com/";
    });
	// http://stackoverflow.com/questions/23403096/how-to-pass-node-variable-to-external-javascript
	// used to figure out how to send ejs variables to external js files
    var survey = $.parseJSON($('#survey').val());
    var num_questions = 1;
    var num_responses = 0;
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
            //in order to find question
        var $question_title = "";
        for (var key in survey) {
            if (survey.hasOwnProperty(key) && key!="type" && key!="name" && key!="owner") {
                $question_title = $("<h3>"+key+"</h3>");
            }
        }
        var $open_ended_response = $("<input id='open_repsonse' type='text'>");
        $("#take_survey_form").append($question_title).append($open_ended_response);
    }
    $("#submit").click(function(){
    	var survey_id = $('#survey_id').val();
        var response_json = {};
        if(survey.type == "mc"){
    	//http://stackoverflow.com/questions/8382156/getting-all-the-checked-checkboxes-in-a-form
			$("#take_survey_form input:radio:checked").each(function() {
    			var question_number = $(this).parent().attr("id");
    			var question_value = $(this).next().html();
    			//building update string before sending to mongodb
    			var question_response = "survey." + question_number + "." + question_value;
    			response_json[question_response]=1;
			});
        }else{
            var response = $("#open_repsonse").val();
            var ques_label = $("h3").text();
            response_json[ques_label]=response;
        }
			//now update survey with people who have taken it
			$.ajax({
				    url: '/survey/' + survey_id,
				    type: 'POST',
				    data: {'survey_data':response_json, 'survey_type':survey.type },
				    success: function(result) {
                        $('#modal1').openModal();
                        //using ajax to update response page without needing to reload it
                        socket.emit("didAnswerSurvey");
				      }
				    });
		});

});