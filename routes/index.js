surveyModel = require('../models/surveyModel.js');
//http://stackoverflow.com/questions/8233014/how-do-i-search-for-an-object-by-its-objectid-in-the-console
//used to know to inculde this module from mongo
var ObjectId = require('mongodb').ObjectId;
//require the Twilio module and create a REST client
var client = require('twilio')('AC17fc68004c479fdeefb62a3b40384440', 'daaad96e01835f9b216bf6da534c9c55');

exports.init = function(app) {
	app.get("/", getHomepage);
  app.get("/survey/:survey_id?", getSurvey);
  app.put("/survey", createSurvey);
  app.post("/survey/:survey_id", updateSurvey);
  app.delete("/survey/:survey_id", destroySurvey);
  app.put("/survey/send/:number",sendSurveyText);
  };

 //send survey to someone via text with Twilio
 //from twilio API docs
 sendSurveyText = function(request,response){
  var survey_url = request.body.survey_link;
  var phone_number = request.params.number;
  //Send an SMS text message
      client.sendMessage({

      to: phone_number, // Any number Twilio can deliver to
      from: '+16178980748', // A number you bought from Twilio and can use for outbound communication
      body: 'Take the survey at this URL!' + survey_url // body of the SMS message

      }, function(err, responseData) { //this function is executed when a response is received from Twilio

      if (!err) { // "err" is an error received during the request, if any

      }
      });
 };
// find a survey by its id or owner in mongo
getSurvey = function(request, response) {
  if(request.params.survey_id!=undefined){
	  var query_survey_id = request.params.survey_id;
    var object_id = new ObjectId(query_survey_id);
    var query = {_id:object_id};
  }else{
    var owner = request.query.owner;
    var query = {"survey.owner":owner};
  }
  	surveyModel.retrieve("surveys", query, function(docs){
		if(docs.length > 0){
    if(request.params.survey_id!=undefined){
     var survey = docs[0].survey;
  	 response.render('answer_survey', { 'survey': survey, 'survey_id':request.params.survey_id});
    }else{
      response.send(docs);
    }
  	}
  	else {
  		response.end("Survey Does Not Exist");
  	}
	});
};

updateSurvey = function(request, response) {
	var survey_data = request.body.survey_data;
  var survey_type = request.body.survey_type;
  var object_id = new ObjectId(request.params.survey_id);
  //turn increments in JSON back to integers
  if(survey_type !="open"){
  for (var key in survey_data) {
    if (survey_data.hasOwnProperty(key)) {
      var data = survey_data[key];
      data = parseInt(data);
      survey_data[key] = data;
    }
  }
  //for mc questions
  surveyModel.update("surveys", { _id: object_id },{$inc: survey_data}, function(call){
    response.end(call);
  });
  }else{
    //for open ended questions
    surveyModel.update("surveys", { _id: object_id },{$push: survey_data}, function(call){
    response.end(call);
  });
  }

};

// delete a survey by its name
destroySurvey = function(request, response) {
  var object_id = new ObjectId(request.params.survey_id);
	surveyModel.delete("surveys", {  _id: object_id }, function(result){
  	response.end(result);
	});
};

//create a new survey
createSurvey = function(request, response) {
  //var survey = request.body
	var survey = request.body.survey;
  for (var key in survey) {
    if (survey.hasOwnProperty(key) && key.indexOf("question") != -1) {
      var new_json = survey[key];
      //now conver all to integers before storing it
      for (var key in new_json) {
        if(key!="name"){
          var value = new_json[key];
          value = parseInt(value);
          new_json[key] = value;
        }
      }
    }
  }
  //hack since arrays cant be trasnmitted through http for some reason
  if(survey["type"]=="open"){
    for(var key in survey){
      if(survey[key] == '0'){
        survey[key] = [];
      }
    }
  }
	surveyModel.create("surveys",{"survey": survey}, function(err,status){
  	response.send(survey);
	});
};

// goes to index page of app
getHomepage = function(request,response) {
  response.render('index', { 'title': "homepage" });
  // response.end();
};
