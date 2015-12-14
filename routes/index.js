surveyModel = require('../models/surveyModel.js');
//http://stackoverflow.com/questions/8233014/how-do-i-search-for-an-object-by-its-objectid-in-the-console
//used to know to inculde this module from mongo
var ObjectId = require('mongodb').ObjectId;

exports.init = function(app) {
	app.get("/", getHomepage);
  app.get("/survey/:survey_id?", getSurvey);
  app.put("/survey", createSurvey);
  app.post("/survey/:survey_id", updateSurvey);
  app.delete("/survey/:survey_id", destroySurvey);
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
      console.log(docs);
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
  var object_id = new ObjectId(request.params.survey_id);
  //turn increments in JSON back to integers
  for (var key in survey_data) {
    if (survey_data.hasOwnProperty(key)) {
      var data = survey_data[key];
      data = parseInt(data);
      survey_data[key] = data;
    }
  }
  console.log(survey_data);
  //create JSON parameter to update
	surveyModel.update("surveys", { _id: object_id },{$inc: survey_data}, function(call){
  	response.end(call);
	});
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
	surveyModel.create("surveys",{"survey": survey}, function(err,status){
  	response.send(survey);
	});
};

// goes to index page of app
getHomepage = function(request,response) {
  response.render('index', { 'title': "homepage" });
  // response.end();
};
