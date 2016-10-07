var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();

app.get('/scrape', function(req, res){

  // Scraping from UCSD's CSE course catalog  
  url = 'http://www.ucsd.edu/catalog/courses/CSE.html';

  request(url, function(error, response, html) {

      if (!error) {
        
        var $ = cheerio.load(html);
        var i = 0;

        var courseNum, courseName, courseUnits;
        
        $('p.course-name').each(function() {

            ++i;
            if (i > 30) return false;
            var course = { courseNum : "", courseName : "", courseUnits : ""};
            data = $(this);
            courseName = data.text();
            course.courseName = courseName;

            fs.writeFile('output.json', JSON.stringify(course, null, 4),
                function(err){

      console.log(course);

  })
      
        })

    }


  

  // Finally, we'll just send out a message to the browser reminding you that
  // this app does not have a UI.
  res.send('Check your console!')

      }) ;
})



app.listen('8081')
console.log('Magic happens on port 8081');
exports = module.exports = app;
