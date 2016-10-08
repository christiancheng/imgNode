angular.module("tritonPlanner", ['ngRoute'])
.config(function($routeProvider) {
  $routeProvider

    .when("/", {
      templateUrl: "index.html",
      controller: "homeController",
      resolve: {
        courses: function(Courses) {
            return Courses.getCourse();
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


.service("Courses", function($http) {
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

.controller("homeController", function(courses, $scope) {
  $scope.courses = courses.data;
})
