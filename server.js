var express = require('express');
var request = require('request');
var cheerio = require('cheerio');
var path = require("path");
var bodyParser = require("body-parser");
var mongodb = require("mongodb");
var ObjectID = mongodb.ObjectID;

var COURSES_COLLECTION = "courses";

var app     = express();
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());

// Create database variable
var db;

// Connect to the database before starting the application server.
mongodb.MongoClient.connect(process.env.MONGODB_URI, function (err, database) {
  if (err) {
    console.log(err);
    process.exit(1);
  }

  // Save database object from the callback for reuse.
  db = database;
  console.log("Database connection ready");

  // Initialize the app.
  var server = app.listen(process.env.PORT || 8080, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
  });
});


// Scrapes UCSD's CSE course catalog
app.get('/scrape', function(req, res){

  console.log('Initializing scraping...');

  url = 'http://www.ucsd.edu/catalog/courses/CSE.html';

  request(url, function(error, response, html) {

      if (!error) {
        
        // Load the webpage html
        var $ = cheerio.load(html);
        var courseNum, courseName, courseUnits;
        
        // Iterate through the courses
        $('p.course-name').each(function() {

          var course = { courseNum : "", courseName : "", courseUnits : ""};
          data = $(this);

          courseName = data.text();
          course.courseName = courseName;
          console.log(course);

          db.collection(COURSES_COLLECTION).insertOne(course, function(err,
                doc) {

            if (err) {
              handleError(res, err.message, "Failed to add course.");
            } else {
              res.status(201).json(doc.ops[o]);
            }
           });
          
            //fs.writeFile('output.json', JSON.stringify(course, null, 4),
            //function(err){
        }) // End iteration 
      } // Endif
  }); // End request
});
