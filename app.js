(function () {
    angular.module('app', ['toaster', 'rzSlider', 'ngAnimate', 'ngRoute'])
  
    angular.module('app')
      .config(['$routeProvider', '$locationProvider', RouteConfig])
      //   .directive('myModel', function() {
      //     return {
      //       restrict: 'A',
      //       link: function(scope, element, attr) {
      //         scope.dismiss = function() {
      //             element.modal('hide');
      //         };
      //       }
      //     } 
      //  })    
      .controller('MainController', MainController)
      .controller('CoreController', CoreController)
      .controller('HomePageController', HomePageController)
      .controller('RentalPageController', RentalPageController)
      .controller('PartnerPageController', PartnerPageController)
      .controller('PricingPageController', PricingPageController)
      .controller('ManagementPageController', ManagementPageController)
      .controller('CustomerOwnerAssociationPageController', CustomerOwnerAssociationPageController)
      .controller('CustomerBuilderPageController', CustomerBuilderPageController)
      .controller('CustomerFacilityManagementPageController', CustomerFacilityManagementPageController)
      .controller('CustomerSecurityPageController', CustomerSecurityPageController)
      .controller('CustomerRentalOwnersPageController', CustomerRentalOwnersPageController)
      .controller('ChooseProductPageController', ChooseProductPageController)
      .controller('RentalPropertyManagementPageController', RentalPropertyManagementPageController)
      .controller('CustomerCoLivingPageController', CustomerCoLivingPageController)
      .controller('CustomerCoWorkingPageController', CustomerCoWorkingPageController)
      .controller('CustomerRentalPropertyManagementPageController', CustomerRentalPropertyManagementPageController)
      .controller('DataManagementPageController', DataManagementPageController)
      .controller('AccountFinancePageController', AccountFinancePageController)
      .controller('OperationManagementPageController', OperationManagementPageController)
      .controller('CommunityBuilderPageController', CommunityBuilderPageController)
      .controller('VisitorManagementPageController', VisitorManagementPageController)
      .component('bottomFooter', {
        bindings: {},
        templateUrl: 'pages/footer.html',
      })
      .directive('changeClassOnScroll', function ($window) {
        return {
          restrict: 'A',
          scope: {
            offset: "@",
            scrollClass: "@"
          },
          link: function (scope, element) {
            angular.element($window).bind("scroll", function () {
              if (this.pageYOffset >= parseInt(scope.offset)) {
                element.addClass(scope.scrollClass);
              } else {
                element.removeClass(scope.scrollClass);
              }
            });
          }
        };
      })
      .directive(
        "mAppLoading",
        function ($animate) {
          // Return the directive configuration.
          return ({
            link: link,
            restrict: "C"
          });
          // I bind the JavaScript events to the scope.
          function link(scope, element, attributes) {
            // Due to the way AngularJS prevents animation during the bootstrap
            // of the application, we can't animate the top-level container; but,
            // since we added "ngAnimateChildren", we can animated the inner
            // container during this phase.
            // --
            // NOTE: Am using .eq(1) so that we don't animate the Style block.
            $animate.leave(element.children().eq(1)).then(
              function cleanupAfterAnimation() {
                // Remove the root directive element.
                element.remove();
                // Clear the closed-over variable references.
                scope = element = attributes = null;
              }
            );
          }
        })
        .directive('keepWidth', function() {
          return {
            restrict: 'A',
            link: function(scope, element, attrs, controller) {
              var width = element.prop('offsetWidth');
              var otherCss = element.css('cssText');
              
              attrs.$set('style', 'width: ' + width + 'px;' + otherCss);
            }
          }
        });
  
    function RouteConfig($routeProvider, $locationProvider) {
      'use strict';
      $routeProvider
        .when('/', {
          templateUrl: 'home.html',
          controller: 'HomePageController'
        })
        .when('/terms-of-use', {
          templateUrl: 'pages/terms-of-use.html'
        })
        .when('/privacy-policy', {
          templateUrl: 'pages/privacy-policy.html'
        })
        .when('/refund-terms', {
          templateUrl: 'pages/refund-terms.html'
        })
        .when('/partners', {
          templateUrl: 'pages/partners.html',
          controller: 'PartnerPageController'
        })
        .when('/pricing', {
          templateUrl: 'pages/pricing.html',
          controller: 'PricingPageController'
        })
        .when('/customer-owner-association', {
          templateUrl: 'pages/customer-owner-association.html',
          controller: 'CustomerOwnerAssociationPageController'
        })
        .when('/customer-facility-management', {
          templateUrl: 'pages/customer-facility-management.html',
          controller: 'CustomerFacilityManagementPageController'
        })
        // .when('/customer-security', { templateUrl: 'pages/customer-security.html', controller: 'CustomerSecurityPageController' })
        .when('/customer-rental-owners', {
          templateUrl: 'pages/customer-rental-owners.html',
          controller: 'CustomerRentalOwnersPageController'
        })
        .when('/choose-product', {
          templateUrl: 'pages/choose-product.html',
          controller: 'ChooseProductPageController'
        })
        .when('/rental-management', {
          templateUrl: 'pages/customer-rental-property-management.html',
          controller: 'CustomerRentalPropertyManagementPageController'
        })
        .otherwise({
          redirectTo: '/'
        });
      $locationProvider.html5Mode(true).hashPrefix(' ');
  
    }
  
    function CoreController($scope, $http, $document, $window, $location, toaster) {
      $scope.progressBarLoading = false;
      $scope.callbackForm = {};
      $scope.onCallbackSubmitHandler = function (form) {
        $scope.callbackOverlayActive = true;
        $scope.progressBarLoading = true;
        $http({
          method: 'POST',
          url: '/shared-resource/webhook/support/contact-us/send-email',
          data: {
            'name': $scope.callbackModalForm.name,
            'phoneNumber': $scope.callbackModalForm.countryCode + $scope.callbackModalForm.phoneNumber,
            'page': $location.path(),
            'message': $scope.callbackModalForm.message,
            'email': $scope.callbackModalForm.email
          }
        }).then(function (response) {
  
          $('#callbackModal').modal('hide');
          var capterra_vkey = '9deeec374e1dfff5b5dbb3a168be56e3',
          capterra_vid = '2130197',
          capterra_prefix = (('https:' == $window.location.protocol)
            ? 'https://ct.capterra.com' : 'http://ct.capterra.com');
  
          var ct = $document[0].createElement('script');
          ct.type = 'text/javascript';
          ct.async = true;
          ct.src = capterra_prefix + '/capterra_tracker.js?vid='
            + capterra_vid + '&vkey=' + capterra_vkey;
  
          var s = $document[0].getElementsByTagName('script')[0];
          s.parentNode.insertBefore(ct, s);
  
          $scope.callbackModalForm = {
            countryCode: '+91'
          }
          form.$setPristine();
          form.$setUntouched();
          $scope.showSuccessToast();
        }, function (response) {
          $scope.showErrorToast();
        }).finally(function () {
          $scope.callbackOverlayActive = false;
          $scope.progressBarLoading = false;
        });
      };
  
      $scope.callbackModalForm = {
        
      };
  
      $scope.onCallbackModalSubmitHandler = function () {
        $scope.callbackModalOverlayActive = true;
        $scope.progressBarLoading = true;
        $http({
          method: 'POST',
          url: '/shared-resource/webhook/support/contact-us/send-email',
          data: {
              'name': $scope.callbackModalForm.name,
              'phoneNumber': $scope.callbackModalForm.countryCode + $scope.callbackModalForm.phoneNumber,
              'page': $location.path(),
              'email': $scope.callbackModalForm.email,
              'message': $scope.callbackModalForm.message,
          }
        }).then(function (response) {
          $scope.callbackModalForm = {};
          $scope.showSuccessToast();
        }, function (response) {
          $scope.showErrorToast();
        }).finally(function () {
          $scope.callbackModalForm = {
            product:$scope.callbackModalForm.product
          };
          $scope.progressBarLoading = false;
          $scope.callbackModalOverlayActive = false;
        });
      }
  
      $scope.demoSignupForm = {};
      $scope.onDemoSignupSubmitHandler = function (form) {
        $scope.progressBarLoading = true;
        $scope.demoSignupOverlayActive = true;
        $http({
          method: 'POST',
          url: '/api/support/demo-registration',
          data: {
            'name': $scope.demoSignupForm.name,
            'phoneNumber': $scope.demoSignupForm.countryCode + $scope.demoSignupForm.phoneNumber,
            'email': $scope.demoSignupForm.email,
            'organisation': $scope.demoSignupForm.organization,
          }
        }).then(function (response) {
          var capterra_vkey = '9deeec374e1dfff5b5dbb3a168be56e3',
          capterra_vid = '2130197',
          capterra_prefix = (('https:' == $window.location.protocol)
            ? 'https://ct.capterra.com' : 'http://ct.capterra.com');
  
          var ct = $document[0].createElement('script');
          ct.type = 'text/javascript';
          ct.async = true;
          ct.src = capterra_prefix + '/capterra_tracker.js?vid='
            + capterra_vid + '&vkey=' + capterra_vkey;
  
          var s = $document[0].getElementsByTagName('script')[0];
          s.parentNode.insertBefore(ct, s);
          form.$setPristine();
          form.$setUntouched();
          $('#exampleModal').modal('hide')
          $scope.showSuccessToast();
        }, function (response) {
          $scope.showErrorToast();
        }).finally(function () {
          $scope.demoSignupForm = {
            countryCode: '+91'
          };
          $scope.progressBarLoading = false;
          setTimeout((()=>{ 
            window.location.href = 'api/demo-login?src=demopage';
            $scope.demoSignupOverlayActive = false;
          }), 1500);
          
        });
      }
  
      $scope.showSuccessToast = function () {
        toaster.pop('success', "Success", "Your form has been submitted. We will get back to you.");
      }
  
      $scope.showErrorToast = function () {
        toaster.pop('error', "Error", "Something went wrong. Please try again");
      }
  
  
    }
  
    function MainController($scope, $location, $controller, countryCodeService) {
  
      $controller('CoreController', {
        $scope: $scope
      });
      var fetchCodes = [];
      var finalCodeArray = [];
  
      for (var i = 0; i < countryCodeService.countryCodeList.length; i++){
        if(!fetchCodes.includes(countryCodeService.countryCodeList[i].code)){
          fetchCodes.push(countryCodeService.countryCodeList[i].code);
        }
      }
      fetchCodes = fetchCodes.sort();
      for (var j = 0; j < fetchCodes.length; j++){
        finalCodeArray.push({ 'code': fetchCodes[j]});
      }
      $scope.citiCodes = finalCodeArray;
      $scope.routeToLoginPage = function () {
        window.location.href = '/authenticate';
      };
  
      $scope.routeToRenatlLoginPage = function () {
        window.location.href = 'https://rentals.thehousemonk.com/authenticate/#!/login';
      };
  
      $scope.isActive = function (destination) {
        return destination === $location.path();
      };
  
  
      $scope.isAboutActive = function () {
        return "/vision" === $location.path() || "/our-team" === $location.path();
      };
  
      $scope.isServiceActive = function () {
        return "/rental-property-management" === $location.path();
      };
  
      $scope.isCustomerActive = function () {
        return "/customer-rental-property-management" === $location.path() || "/customer-co-living" === $location.path() || "/customer-co-working" === $location.path() || "/customer-owner-association" === $location.path() || "/customer-builder" === $location.path() || "/customer-facility-management" === $location.path() || "/customer-rental-owners" === $location.path();
      }


    }
  
    function CustomerOwnerAssociationPageController($scope, $controller, $window) {
      // Extend CoreController controller functionalities
      $controller('CoreController', {
        $scope: $scope
      });
  
      $window.scroll(0,0);
      $window.document.title = 'Real Estate Customer Experience Management Platform | Property Management Solutions';
  
      $scope.callbackForm = {
      };
  
      $scope.callbackModalForm = {
      };
      $scope.routeToSignupPage = function () {
        window.location.href = '/authenticate/#!/signup';
      };
    }
  
    function CustomerBuilderPageController($scope, $controller, $window) {
      // Extend CoreController controller functionalities
      $controller('CoreController', {
        $scope: $scope
      });
      $window.document.title = 'Real Estate Customer Experience Management Platform | Property Management Solutions';
  
      $scope.callbackForm = {
        product: 'Building Management'
      };
      $scope.callbackModalForm = {
      };
      $window.scroll(0,0);
      $scope.routeToSignupPage = function () {
        window.location.href = '/authenticate/#!/signup';
      };
  
    }
  
    function CustomerFacilityManagementPageController($scope, $controller, $window) {
      // Extend CoreController controller functionalities
      $controller('CoreController', {
        $scope: $scope
      });
      $window.document.title = 'Real Estate Customer Experience Management Platform | Property Management Solutions';
  
      $window.scroll(0,0);
      $scope.callbackForm = {
        product: 'Building Management'
      };
      $scope.callbackModalForm = {
        product: 'Building Management'
      };
      $scope.routeToSignupPage = function () {
        window.location.href = '/authenticate/#!/signup';
      }
  
      
    }
  
  
    function RentalPropertyManagementPageController($scope, $controller) {
      $controller('CoreController', {
        $scope: $scope
      });
      $window.document.title = 'Real Estate Customer Experience Management Platform | Property Management Solutions';
  
      $scope.callbackForm = {
        product: 'Rental Management'
      };
      $scope.callbackModalForm = {
        product: 'Rental Management'
      };
  
      $scope.routeToRentalsSignupPage = function () {
        window.location.href = 'https://rentals.thehousemonk.com/authenticate/#!/signup';
      };
    }
  
    function CustomerSecurityPageController($scope, $controller, $window) {
      // Extend CoreController controller functionalities
      $controller('CoreController', {
        $scope: $scope
      });
      $window.document.title = 'Real Estate Customer Experience Management Platform | Property Management Solutions';
  
      $window.scroll(0,0);
  
      $scope.callbackForm = {
        product: 'Building Management'
      };
      $scope.callbackModalForm = {
        product: 'Building Management'
      };
    }
  
    function CustomerRentalOwnersPageController($scope, $controller, $window) {
      // Extend CoreController controller functionalities
      $controller('CoreController', {
        $scope: $scope
      });
  
      $window.scroll(0,0);
      $window.document.title = 'Real Estate Customer Experience Management Platform | Property Management Solutions';
  
      $scope.callbackForm = {
        product: 'Rental Management'
      };
      $scope.callbackModalForm = {
        product: 'Rental Management'
      };
      $scope.routeToSignupPage = function () {
        window.location.href = '/authenticate/#!/signup';
      };
    }
    function CustomerCoLivingPageController($scope, $controller, $window) {
      // Extend CoreController controller functionalities
      $controller('CoreController', {
        $scope: $scope
      });
  
      $window.scroll(0,0);
      $window.document.title = 'Real Estate Customer Experience Management Platform | Property Management Solutions';
  
      $scope.callbackForm = {
        product: 'Rental Management'
      };
      $scope.callbackModalForm = {
        product: 'Rental Management'
      };
      $scope.routeToSignupPage = function () {
        window.location.href = '/authenticate/#!/signup';
      };
    }
  
    function CustomerCoWorkingPageController($scope, $controller, $window) {
      // Extend CoreController controller functionalities
      $controller('CoreController', {
        $scope: $scope
      });
      $window.document.title = 'Real Estate Customer Experience Management Platform | Property Management Solutions';
  
      $window.scroll(0,0);
  
      $scope.callbackForm = {
        product: 'Rental Management'
      };
      $scope.callbackModalForm = {
        product: 'Rental Management'
      };
      $scope.routeToSignupPage = function () {
        window.location.href = '/authenticate/#!/signup';
      };
    }
  
    function CustomerRentalPropertyManagementPageController($scope, $controller, $window) {
      // Extend CoreController controller functionalities
      $controller('CoreController', {
        $scope: $scope
      });
      $window.document.title = 'Real Estate Customer Experience Management Platform | Property Management Solutions';
  
      $window.scroll(0,0);
  
      $scope.callbackForm = {
        product: 'Rental Management'
      };
      $scope.callbackModalForm = {
        product: 'Rental Management'
      };
      $scope.routeToSignupPage = function () {
        window.location.href = '/authenticate/#!/signup';
      };
    }
  
    function ChooseProductPageController($scope, $controller,$window) {
      // Extend CoreController controller functionalities
      $controller('CoreController', {
        $scope: $scope
      });
      $scope.toggleKey = (key) => {
        $scope[key] = !$scope[key];
      };
  
      $window.scroll(0,0);
      $window.document.title = 'Real Estate Customer Experience Management Platform | Property Management Solutions';
  
      $scope.routeToRentalsSignupPage = function () {
        window.location.href = 'https://rentals.thehousemonk.com/authenticate/#!/signup';
      }
  
      $scope.routeToSignupPage = function () {
        window.location.href = '/authenticate/#!/signup';
      }
    }
  
    function HomePageController($scope, $controller, $location, $window) {
  
      $controller('CoreController', {
        $scope: $scope
      });
  
      $window.scroll(0,0);
      $window.document.title = 'Real Estate Customer Experience Management Platform | Property Management Solutions';
      $scope.callbackForm = {
        product: 'Building Management'
      };
      $scope.callbackModalForm = {
        product: 'Building Management'
      };
  
    }
  
    function RentalPageController($scope, $controller, $window) {
  
      $controller('CoreController', {
        $scope: $scope
      });
  
      $window.scroll(0,0);
      $window.document.title = 'Real Estate Customer Experience Management Platform | Property Management Solutions';
  
      $scope.callbackForm = {
        product: 'Rental Management'
      };
      $scope.callbackModalForm = {
        product: 'Rental Management'
      };
  
      $scope.routeToRentalsSignupPage = function () {
        window.location.href = 'https://rentals.thehousemonk.com/authenticate/#!/signup';
      };
  
    }
    function DataManagementPageController($scope, $controller, $window) {
  
      $controller('CoreController', {
        $scope: $scope
      });
      $window.scroll(0,0);
      $window.document.title = 'Data Management';
      $scope.callbackForm = {
        product: 'Rental Management'
      };
      $scope.callbackModalForm = {
        product: 'Rental Management'
      };
  
      $scope.routeToRentalsSignupPage = function () {
        window.location.href = 'https://rentals.thehousemonk.com/authenticate/#!/signup';
      };
  
    }
    function AccountFinancePageController($scope, $controller, $window) {
  
      $controller('CoreController', {
        $scope: $scope
      });
      $window.scroll(0,0);
      $window.document.title = 'Accounts & Finance';
      $scope.callbackForm = {
        product: 'Rental Management'
      };
      $scope.callbackModalForm = {
        product: 'Rental Management'
      };
  
      $scope.routeToRentalsSignupPage = function () {
        window.location.href = 'https://rentals.thehousemonk.com/authenticate/#!/signup';
      };
  
    }
    function OperationManagementPageController($scope, $controller, $window) {
  
      $controller('CoreController', {
        $scope: $scope
      });
  
      $window.scroll(0,0);
      $window.document.title = 'Operation Management';
  
      $scope.callbackForm = {
        product: 'Rental Management'
      };
      $scope.callbackModalForm = {
        product: 'Rental Management'
      };
  
      $scope.routeToRentalsSignupPage = function () {
        window.location.href = 'https://rentals.thehousemonk.com/authenticate/#!/signup';
      };
  
    }
    function CommunityBuilderPageController($scope, $controller, $window) {
  
      $controller('CoreController', {
        $scope: $scope
      });
  
      $window.scroll(0,0);
      $window.document.title = 'Community Builder';
  
      $scope.callbackForm = {
        product: 'Rental Management'
      };
      $scope.callbackModalForm = {
        product: 'Rental Management'
      };
  
      $scope.routeToRentalsSignupPage = function () {
        window.location.href = 'https://rentals.thehousemonk.com/authenticate/#!/signup';
      };
  
    }
    function VisitorManagementPageController($scope, $controller, $window) {
  
      $controller('CoreController', {
        $scope: $scope
      });
      $window.document.title = 'Visitor Management';
  
      $window.scroll(0,0);
  
      $scope.callbackForm = {
        product: 'Rental Management'
      };
      $scope.callbackModalForm = {
        product: 'Rental Management'
      };
  
      $scope.routeToRentalsSignupPage = function () {
        window.location.href = 'https://rentals.thehousemonk.com/authenticate/#!/signup';
      };
  
    }
    function PricingPageController($scope, $controller, $window) {
  
      $controller('CoreController', {
        $scope: $scope
      });
  
      $window.document.title = 'Real Estate Customer Experience Management Platform | Property Management Solutions';
  
      $scope.priceList = [
        {
          name: 'US',
          value: 1.5,
          baseUnit: 94
        }, {
          name: 'Europe',
          value: 1.5,
          baseUnit: 94
        }, {
          name: 'Middle East',
          value: 2,
          baseUnit: 63
        }, {
          name: 'India',
          value: 1,
          baseUnit: 175
        }, {
          name: 'Singapore',
          value: 1.5,
          baseUnit: 94
        }, {
          name: 'South East Asia',
          value: 1,
          baseUnit: 175
        }, {
          name: 'Australia',
          value: 1,
          baseUnit: 94
        }, {
          name: 'Rest of the world',
          value: 1,
          baseUnit: 175
        }
      ]
  
      $scope.options = {
        floor: 0,
        ceil: 2500,
        step: 5,
        onChange: (sliderId, modelValue, highValue, pointerType) => {
          $scope.updatePrice(modelValue);
        },
        translate: function (value, sliderId, label) {
          if(label == 'model')
            return  value + ' units';
          return value;
        }
      };
  
      $scope.countryPrice = 'India';
      $window.scroll(0,0);
      $scope.unit = { value : 0 };
      $scope.price = 200;
      $scope.billedAt = 0;
      $scope.basePrice = 0;
      $scope.regionUnit = 175;
  
      $scope.updatePrice = (value) => {
  
        $scope.priceList.forEach(price=> {
          if (price.name === $scope.countryPrice) {
            $scope.basePrice = price.value;
            $scope.regionUnit = parseInt(price.baseUnit);
          }
      })
  
        if((value !== 0) && (value <= 100)){
          $scope.actualPrice = Math.round(parseInt(value) * 1.50 * $scope.basePrice);
          if ($scope.actualPrice > 200) {
            $scope.price = $scope.actualPrice;
            $scope.regionUnit = value;
          }
          $scope.billedAt = (parseInt($scope.price) / parseInt(value)).toFixed(2);
        }
        else if((value !== 0) && (value <= 300)){
          $scope.actualPrice = Math.round(parseInt(value) * 1.20 * $scope.basePrice);
          if ($scope.actualPrice > 200) {
            $scope.price = $scope.actualPrice;
            $scope.regionUnit = value;
          }
          $scope.billedAt = (parseInt($scope.price) / parseInt(value)).toFixed(2);
        }
        else if((value !== 0) && (value <= 1000)){
          $scope.actualPrice = Math.round(parseInt(value) * 1 * $scope.basePrice);
          if ($scope.actualPrice > 200) {
            $scope.price = $scope.actualPrice;
            $scope.regionUnit = value;
          }
          
          $scope.billedAt = (parseInt($scope.price) / parseInt(value)).toFixed(2);
        }
        else if((value !== 0) && (value <= 2500)){
          $scope.actualPrice = Math.round(parseInt(value) * 0.75 * $scope.basePrice);
          if ($scope.actualPrice > 200) {
            $scope.price = $scope.actualPrice;
            $scope.regionUnit = value;
          }
          $scope.billedAt = (parseInt($scope.price) / parseInt(value)).toFixed(2);
  
        } else if((value == 0)) {
          $scope.price = 200;
          $scope.billedAt = 0;
        }
      };
    }
  
    function PartnerPageController($scope, $controller, $window) {
  
      $controller('CoreController', {
        $scope: $scope
      });
  
      $window.scroll(0,0);
      $window.document.title = 'Real Estate Customer Experience Management Platform | Property Management Solutions';
      $scope.callbackForm = {
        product: 'Building Management'
      };
  
      $scope.callbackModalForm = {
        product: 'Building Management'
      };
    
    }
  
  
    function ManagementPageController($scope, $controller, $window) {
  
      $controller('CoreController', {
        $scope: $scope
      });
      $scope.callbackForm = {
        product: 'Building Management'
      }
      $scope.callbackModalForm = {
        product: 'Building Management'
      };
  
      $window.scroll(0,0);
  
      $scope.routeToSignupPage = function () {
        window.location.href = '/authenticate/#!/signup';
      }
  
      $scope.featureScrollSelected = 'tickets';
      $scope.featureScrollImage = '../assets/images/management-scroll-5-tickets.png';
      $scope.featureScrollHeading = 'some text';
      $scope.verticalScrollSelected = 'owner-associations';
      $scope.buildersContent = [{
        image: './assets/images/rental-scroll-4.png',
        title: 'Management',
        description: 'Manage all your residential and commercial projects through TheHouseMonk'
      }, {
        image: './assets/images/rental-scroll-4.png',
        title: 'All in one',
        description: 'Take care of facility management, rental management and other tasks'
      }, {
        image: './assets/images/rental-scroll-4.png',
        title: 'Staff management',
        description: 'Keep tabs on your staff and ensure they maintain your projects well'
      }];
      $scope.ownerAssociationContent = [{
        image: './assets/images/rental-scroll-4.png',
        title: 'Transparency',
        description: 'Maintain transparent records for all accounts and finances'
      }, {
        image: './assets/images/rental-scroll-4.png',
        title: 'Communication',
        description: 'Send important communications to all residents'
      }, {
        image: './assets/images/rental-scroll-4.png',
        title: 'Management',
        description: 'Manage all vendors and contract employees'
      }];
      $scope.facilityManagementContent = [{
        image: './assets/images/rental-scroll-4.png',
        title: 'Track & Monitor',
        description: 'Track and monitor all the maintenance activities across all your projects'
      }, {
        image: './assets/images/rental-scroll-4.png',
        title: 'Staff management',
        description: 'Manage the staff at various projects including their in and out time'
      }, {
        image: './assets/images/rental-scroll-4.png',
        title: 'Customer satisfaction',
        description: 'Ensure good level of service to customer through our review and rating system'
      }];
      $scope.verticalScrollContent = $scope.ownerAssociationContent;
  
  
      $scope.onFeatureScrollClickHandler = function (key, text, imagePath) {
        $scope.featureScrollSelected = key;
        $scope.featureScrollHeading = text;
        $scope.featureScrollImage = imagePath;
      };
  
      $scope.onVerticalScrollClickHandler = function (key, text, imagePath) {
        $scope.verticalScrollSelected = key;
        if (key === 'builders') {
          $scope.verticalScrollContent = $scope.buildersContent;
        } else {
          if (key === 'owner-associations') {
            $scope.verticalScrollContent = $scope.ownerAssociationContent;
          } else {
            if (key === 'facility-management') {
              $scope.verticalScrollContent = $scope.facilityManagementContent;
            }
          }
        }
      };
    }
  
  })();