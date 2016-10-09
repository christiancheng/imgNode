// Pass templates through the route provider
angular.module("tritonPlanner", ['ngRoute'])
.config(function($routeProvider) {
  $routeProvider

    .when("/2", {
      templateUrl: "index.html",
      controller: "homeController",
      resolve: {
        courses: function(Courses) {
            return Courses.getCourses();
        }
      }
    })

    .when("/", {
      templateUrl: "list.html",
      controller: "ListController",
      resolve: {
        courses: function(Courses) {
            return Courses.getCourses();
        }
      }
    })

    .when("/new/contact", {
        controller: "NewContactController",
        templateUrl: "contact-form.html"
    })

    .when("/contact/:contactId", {
        controller: "EditContactController",
        templateUrl: "contact.html"
    })

    .otherwise({
        redirectTo: "/"
    })
})

// Get courses from the database using services
.service("Courses", function($http) {

  // Get all courses
  this.getCourses = function() {
      return $http.get("/courses").
        then(function(response) {
            return response;
        }, function(response) {
            alert("Error retrieving courses.");
        });
    }

  // Get a specific course
  this.getCourse = function(courseId) {
    var url = "/contacts/" + courseId;
    return $http.get(url).
      then(function(response) {
          return response;
      }, function(response) {
          alert("Error finding this course.");
      });
  }
})

// Pass data from services to view controller
.controller("homeController", function(courses, $scope) {
  $scope.courses = courses.data;
})

.controller("ListController", function(courses, $scope) {
  $scope.courses = courses.data;
})
