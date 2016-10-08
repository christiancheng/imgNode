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


// Generic error handler
function handleError(res, reason, message, code) {
  console.log("ERROR: " + reason);
  res.status(code || 500).json({"error": message});
}

// Get all courses
app.get("/courses", function(req, res) {
  db.collection(COURSES_COLLECTION).find({}).toArray(function(err, docs) {
    if (err) {
      handleError(res, err.message, "Failed to get courses.");
    } else {
      res.status(200).json(docs);  
    }
  });
});


// GET a course from the collection
app.get("/courses/:id", function(req, res) {
  db.collection(COURSES_COLLECTION).findOne({ _id: new ObjectID(req.params.id)
  }, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to retrieve course.");
    } else {
      res.status(200).json(doc);  
    }
  });
});


// Scrapes UCSD's CSE course catalog
app.get('/scrape', function(req, res){

  console.log("Requesting url...");
  url = 'http://www.ucsd.edu/catalog/courses/CSE.html';

  request(url, function(error, response, html) {

    if (!error) {
      
      // Load the webpage html
      var $ = cheerio.load(html);

      // Clear the collection
      console.log("Clearing all courses from the existing collection...");
      db.collection(COURSES_COLLECTION).deleteMany({});
      
      console.log('Initializing scraping...');

      // Iterate through the courses
      $('p.course-name').each(function() {

        var course = { courseNum : "", courseName : "", courseUnits : ""};
        var courseInfo, courseNum, courseName, courseUnits;
        data = $(this);

        courseInfo = data.text();

        var firstSplit = courseInfo.indexOf(".");
        var secondSplit = courseInfo.indexOf("(");
        
        course.courseNum = courseInfo.slice(0, firstSplit);
        course.courseName = courseInfo.slice(firstSplit + 2, secondSplit - 1);
        course.courseName =
          (course.courseName).replace(/(\n|\r|\t)/gm,"");
        course.courseUnits = courseInfo.charAt(secondSplit + 1);
        
        console.log(course.courseNum + " added to collection.");

        db.collection(COURSES_COLLECTION).insert(course);

      }) // End iteration 

      console.log("Finished scraping.");
    } else {
      console.log("Error occurred; scraping failed.");
    }
  }); // End request
});
