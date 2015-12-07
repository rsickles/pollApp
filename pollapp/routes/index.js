// var express = require('express');
// var router = express.Router();

// /* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Welcome To The Survey App' });
// });

// module.exports = router;
surveyModel = require('../models/surveyModel.js');

exports.init = function(app) {
	app.get("/", getHomepage);
  app.get("/survey/:survey_name", getSurveyByName);
  app.put("/survey/:survey_name/:q1/:q2?/:q3?/:q4?/:q5?", createSurvey);
  app.post("/survey/:survey_name/:q1/:q2?/:q3?/:q4?/:q5?", updateSurvey);
  app.delete("/survey/:survey_name", destroySurvey);
  };

// find a survey by its name
getSurveyByName = function(request, response) {
	var query_survey_name = request.params;
	surveyModel.retrieve("surveys", { name: query_survey_name.survey_name }, function(docs){
		if(docs.length > 0){
  	response.end("the Survey found is " + docs[0]["name"] + " Question 1 is: " + docs[0]["q1"]);
  	}
  	else {
  		response.end("Survey Does Not Exist");
  	}
	});
};

updateSurvey = function(request, response) {
	var surveyInfo = request.params;
	var survey_name = surveyInfo.survey_name;
	var q1 = surveyInfo.q1;
	var q2 = surveyInfo.q2;
	var q3 = surveyInfo.q3;
	var q4 = surveyInfo.q4;
	var q5 = surveyInfo.q5;
	var new_survey = {
				 name : survey_name,
         q1 : q1,
         q2 : q2,
         q3 : q3,
         q4 : q4,
         q5 : q5,
         users_responded : [],
       	 responses : [0,0,0,0,0],
   };
	surveyModel.update("surveys", { name: survey_name },{$set:new_survey}, function(call){
  	response.end(call);
	});
};

// delete a survey by its name
destroySurvey = function(request, response) {
	var query_survey_name = request.params;
	surveyModel.delete("surveys", { name: query_survey_name.survey_name }, function(result){
  	response.end(result);
	});
};

//create a new survey
createSurvey = function(request, response) {
	var surveyInfo = request.params;
	var survey_name = surveyInfo.survey_name;
	var q1 = surveyInfo.q1;
	var q2 = surveyInfo.q2;
	var q3 = surveyInfo.q3;
	var q4 = surveyInfo.q4;
	var q5 = surveyInfo.q5;
	var new_survey = {
				 name : survey_name,
         q1 : q1,
         q2 : q2,
         q3 : q3,
         q4 : q4,
         q5 : q5,
         users_responded : [],
         responses : [0,0,0,0,0]
   };
	surveyModel.create("surveys", new_survey, function(err,status){
  	response.end("A survey has been created and inserted into the system with name " + surveyInfo.survey_name);
	});
};

// goes to index page of app
getHomepage = function(request,response) {
  response.render('index', { 'title': "homepage" });
  // response.end();
};
