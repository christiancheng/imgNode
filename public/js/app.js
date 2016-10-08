angular.module("tritonPlanner", ['ngRoute'])
.config(function($routeProvider) {
  $routeProvider

    .when("/", {
      templateUrl: "index.html",
      controller: "homeController",
      resolve: {
        contacts: function(Contacts) {
            return Contacts.getContacts();
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

