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

        var courseNum, courseName, courseUnits;
        var json = { courseNum : "", courseName : "", courseUnits : ""};
      
      }

  })

})

app.listen('8081')

console.log('Magic happens on port 8081');

exports = module.exports = app;
