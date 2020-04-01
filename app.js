(function () {
  angular.module('app', ['toaster', 'rzSlider', 'ngAnimate', 'ngMaterial', 'ngRoute', 'pascalprecht.translate'])

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
    .config(['$translateProvider', function ($translateProvider) {
      $translateProvider.useStaticFilesLoader({
        prefix: 'assets/i18n/locale-',
        suffix: '.json'
      });
      $translateProvider.useSanitizeValueStrategy(null);

      // $translateProvider.preferredLanguage('en');
      $translateProvider.use('ar')

      // document.documentElement.style.setProperty('--dir', $translateProvider.use() == 'ar' ? 'rtl' : 'ltr')


    }])
    .service('translateService', ['$translate', translateService])
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
    .controller('CustomerRentalPropertyManagementPageController', CustomerRentalPropertyManagementPageController)
    .controller('ContactUsPageController', ContactUsPageController)
    .controller('FooterController', FooterController)
    .controller('PrivacyPolicyController', PrivacyPolicyController)
    .controller('VisionController', VisionController)
    .controller('OutTeamController', OutTeamController)
    .controller('ModalController', ModalController)
    .component('bottomFooter', {
      bindings: {},
      templateUrl: 'pages/footer.html',
      controller: 'FooterController'
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
    .directive('keepWidth', function () {
      return {
        restrict: 'A',
        link: function (scope, element, attrs, controller) {
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
        // templateUrl: 'pages/our-team.html',
        // controller: 'OutTeamController'
      })
      .when('/terms-of-use', {
        templateUrl: 'pages/terms-of-use.html'
      })
      .when('/privacy-policy', {
        templateUrl: 'pages/privacy-policy.html'
      })
      .when('/refund-terms', {
        templateUrl: 'pages/refund-terms.html',
        controller: 'PrivacyPolicyController'
      })
      .when('/vision', {
        templateUrl: 'pages/vision.html',
        controller: 'VisionController'
      })
      .when('/our-team', {
        templateUrl: 'pages/our-team.html',
        controller: 'OutTeamController'
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
      .when('/customer-builder', {
        templateUrl: 'pages/customer-builder.html',
        controller: 'CustomerBuilderPageController'
      })
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
      .when('/contact-us', {
        templateUrl: 'pages/contact-us.html',
        controller: 'ContactUsPageController'
      })
      .otherwise({
        redirectTo: '/'
      });
    $locationProvider.html5Mode(true);

  }

  function CoreController($scope, $http, $document, $window, $location, toaster,$filter) {
    $scope.progressBarLoading = false;
    $scope.callbackForm = {};
    $scope.onCallbackSubmitHandler = function (form) {
      $scope.callbackOverlayActive = true;
      $scope.progressBarLoading = true;
      $http({
        method: 'POST',
        url: 'http://52.220.118.81:3020/shared-resource/webhook/capture-website-contact?organization=5e1ad3b4d0ffee5fb4fc0410',
        data: {
          'name': $scope.callbackModalForm.name,
          'phoneNumber': $scope.callbackModalForm.countryCode + $scope.callbackModalForm.phoneNumber,
          'page': $location.path(),
          'message': $scope.callbackModalForm.message,
          'email': $scope.callbackModalForm.email
        }
      }).then(function (response) {

        $('#callbackModal').modal('hide');
        // var capterra_vkey = '9deeec374e1dfff5b5dbb3a168be56e3',
        //   capterra_vid = '2130197',
        //   capterra_prefix = (('https:' == $window.location.protocol)
        //     ? 'https://ct.capterra.com' : 'http://ct.capterra.com');

        // var ct = $document[0].createElement('script');
        // ct.type = 'text/javascript';
        // ct.async = true;
        // ct.src = capterra_prefix + '/capterra_tracker.js?vid='
        //   + capterra_vid + '&vkey=' + capterra_vkey;

        // var s = $document[0].getElementsByTagName('script')[0];
        // s.parentNode.insertBefore(ct, s);

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
        // url: '/shared-resource/webhook/support/contact-us/send-email',
        url: 'http://52.220.118.81:3020/shared-resource/webhook/capture-website-contact?organization=5e1ad3b4d0ffee5fb4fc0410',
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
          product: $scope.callbackModalForm.product
        };
        $scope.progressBarLoading = false;
        $scope.callbackModalOverlayActive = false;
      });
    }

    $scope.demoSignupForm = {};
    // $scope.onDemoSignupSubmitHandler = function (form) {
    //   $scope.progressBarLoading = true;
    //   $scope.demoSignupOverlayActive = true;
    //   $http({
    //     method: 'POST',
    //     url: '/api/support/demo-registration',
    //     data: {
    //       'name': $scope.demoSignupForm.name,
    //       'phoneNumber': $scope.demoSignupForm.countryCode + $scope.demoSignupForm.phoneNumber,
    //       'email': $scope.demoSignupForm.email,
    //       'organisation': $scope.demoSignupForm.organization,
    //     }
    //   }).then(function (response) {
    //     var capterra_vkey = '9deeec374e1dfff5b5dbb3a168be56e3',
    //       capterra_vid = '2130197',
    //       capterra_prefix = (('https:' == $window.location.protocol)
    //         ? 'https://ct.capterra.com' : 'http://ct.capterra.com');

    //     var ct = $document[0].createElement('script');
    //     ct.type = 'text/javascript';
    //     ct.async = true;
    //     ct.src = capterra_prefix + '/capterra_tracker.js?vid='
    //       + capterra_vid + '&vkey=' + capterra_vkey;

    //     var s = $document[0].getElementsByTagName('script')[0];
    //     s.parentNode.insertBefore(ct, s);
    //     form.$setPristine();
    //     form.$setUntouched();
    //     $('#exampleModal').modal('hide')
    //     $scope.showSuccessToast();
    //   }, function (response) {
    //     $scope.showErrorToast();
    //   }).finally(function () {
    //     $scope.demoSignupForm = {
    //       countryCode: '+91'
    //     };
    //     $scope.progressBarLoading = false;
    //     setTimeout((() => {
    //       window.location.href = 'api/demo-login?src=demopage';
    //       $scope.demoSignupOverlayActive = false;
    //     }), 1500);

    //   });
    // }

    
    $scope.showSuccessToast = function () {
      toaster.pop('success', $filter('translate')("Success"), $filter('translate')("Your form has been submitted. We will get back to you."));
    }

    $scope.showErrorToast = function () {
      toaster.pop('error', $filter('translate')("Error"), $filter('translate')("Something went wrong. Please try again"));
    }


  }

  function MainController($scope, $location, $controller, countryCodeService, $translate, translateService) {

    $controller('CoreController', {
      $scope: $scope
    });
    var fetchCodes = [];
    var finalCodeArray = [];
    $scope.languages = [
      {
        language: "en",
        name: "English",
        dir: 'ltr',
        imagePath: "assets/icons/USA.png"
      },
      {
        language: "ar",
        name: "Arabic",
        dir: 'rtl',
        imagePath: "assets/icons/kuwait.png"

      }
    ];

    $scope.selectLanguage = translateService.getCurrentLanguage()
    $scope.ChangeLanguage = function (langObject) {
      translateService.setCurrentLanguage(langObject.language)
    }

    for (var i = 0; i < countryCodeService.countryCodeList.length; i++) {
      if (!fetchCodes.includes(countryCodeService.countryCodeList[i].code)) {
        fetchCodes.push(countryCodeService.countryCodeList[i].code);
      }
    }
    fetchCodes = fetchCodes.sort();
    for (var j = 0; j < fetchCodes.length; j++) {
      finalCodeArray.push({ 'code': fetchCodes[j] });
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

    $scope.isCustomerActive = function () {
      return "/rental-management" === $location.path() || "/customer-co-living" === $location.path() || "/customer-co-working" === $location.path() || "/customer-owner-association" === $location.path() || "/customer-builder" === $location.path() || "/customer-facility-management" === $location.path() || "/customer-rental-owners" === $location.path();
    }


  }


  function translateService($translate) {
    var translateService = {};
    // this.language = translateService.getCurrentLanguage()
    translateService.getCurrentLanguage = function () {
      return $translate.use()
    }

    translateService.setCurrentLanguage = function (lang) {
      $translate.use(lang)
    }

    translateService.setDirection = function (dir) {
      // document.documentElement.style.setProperty("--dir", $translate.use() == 'ar' ? 'rtl' : 'ltr')
    }


    return translateService
  }

  function CustomerOwnerAssociationPageController($scope, $controller, $window, translateService) {
    // Extend CoreController controller functionalities
    $controller('CoreController', {
      $scope: $scope
    });

    $scope.translateService = translateService
    $window.scroll(0, 0);
    $window.document.title = 'Real Estate Customer Experience Management Platform | Property Management Solutions';

    $scope.callbackForm = {
    };

    $scope.callbackModalForm = {
    };
    $scope.routeToSignupPage = function () {
      window.location.href = '/authenticate/#!/signup';
    };
  }

  function CustomerBuilderPageController($scope, $controller, $window, translateService) {
    // Extend CoreController controller functionalities
    $controller('CoreController', {
      $scope: $scope
    });
    $window.document.title = 'Real Estate Customer Experience Management Platform | Property Management Solutions';
    $scope.translateService = translateService
    $scope.callbackForm = {
      product: 'Building Management'
    };
    $scope.callbackModalForm = {
    };
    $window.scroll(0, 0);
    $scope.routeToSignupPage = function () {
      window.location.href = '/authenticate/#!/signup';
    };

  }

  function CustomerFacilityManagementPageController($scope, $controller, $window, translateService) {
    // Extend CoreController controller functionalities
    $controller('CoreController', {
      $scope: $scope
    });
    $scope.translateService = translateService
    $window.document.title = 'Real Estate Customer Experience Management Platform | Property Management Solutions';

    $window.scroll(0, 0);
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

    $window.scroll(0, 0);

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

    $window.scroll(0, 0);
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

    $window.scroll(0, 0);
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

    $window.scroll(0, 0);

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

  function CustomerRentalPropertyManagementPageController($scope, $controller, $window, translateService) {
    // Extend CoreController controller functionalities
    $controller('CoreController', {
      $scope: $scope
    });
    $scope.translateService = translateService
    $window.document.title = 'Real Estate Customer Experience Management Platform | Property Management Solutions';

    $window.scroll(0, 0);

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

  function ChooseProductPageController($scope, $controller, $window, translateService) {
    // Extend CoreController controller functionalities
    $controller('CoreController', {
      $scope: $scope
    });
    $scope.toggleKey = (key) => {
      $scope[key] = !$scope[key];
    };
    $scope.translateService = translateService
    $window.scroll(0, 0);
    $window.document.title = 'Real Estate Customer Experience Management Platform | Property Management Solutions';

    $scope.routeToRentalsSignupPage = function () {
      window.location.href = 'https://rentals.thehousemonk.com/authenticate/#!/signup';
    }

    $scope.routeToSignupPage = function () {
      window.location.href = '/authenticate/#!/signup';
    }
  }

  function HomePageController($scope, $controller, $location, $window, translateService) {

    $controller('CoreController', {
      $scope: $scope
    });
    $scope.currentLanguage = translateService.getCurrentLanguage()
    $window.scroll(0, 0);
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

    $window.scroll(0, 0);
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
    $window.scroll(0, 0);
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
    $window.scroll(0, 0);
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

    $window.scroll(0, 0);
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

    $window.scroll(0, 0);
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

    $window.scroll(0, 0);

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
        name: 'Kuwait',
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
        if (label == 'model')
          return value + ' units';
        return value;
      }
    };

    $scope.countryPrice = 'India';
    $window.scroll(0, 0);
    $scope.unit = { value: 0 };
    $scope.price = 200;
    $scope.billedAt = 0;
    $scope.basePrice = 0;
    $scope.regionUnit = 175;

    $scope.updatePrice = (value) => {

      $scope.priceList.forEach(price => {
        if (price.name === $scope.countryPrice) {
          $scope.basePrice = price.value;
          $scope.regionUnit = parseInt(price.baseUnit);
        }
      })

      if ((value !== 0) && (value <= 100)) {
        $scope.actualPrice = Math.round(parseInt(value) * 1.50 * $scope.basePrice);
        if ($scope.actualPrice > 200) {
          $scope.price = $scope.actualPrice;
          $scope.regionUnit = value;
        }
        $scope.billedAt = (parseInt($scope.price) / parseInt(value)).toFixed(2);
      }
      else if ((value !== 0) && (value <= 300)) {
        $scope.actualPrice = Math.round(parseInt(value) * 1.20 * $scope.basePrice);
        if ($scope.actualPrice > 200) {
          $scope.price = $scope.actualPrice;
          $scope.regionUnit = value;
        }
        $scope.billedAt = (parseInt($scope.price) / parseInt(value)).toFixed(2);
      }
      else if ((value !== 0) && (value <= 1000)) {
        $scope.actualPrice = Math.round(parseInt(value) * 1 * $scope.basePrice);
        if ($scope.actualPrice > 200) {
          $scope.price = $scope.actualPrice;
          $scope.regionUnit = value;
        }

        $scope.billedAt = (parseInt($scope.price) / parseInt(value)).toFixed(2);
      }
      else if ((value !== 0) && (value <= 2500)) {
        $scope.actualPrice = Math.round(parseInt(value) * 0.75 * $scope.basePrice);
        if ($scope.actualPrice > 200) {
          $scope.price = $scope.actualPrice;
          $scope.regionUnit = value;
        }
        $scope.billedAt = (parseInt($scope.price) / parseInt(value)).toFixed(2);

      } else if ((value == 0)) {
        $scope.price = 200;
        $scope.billedAt = 0;
      }
    };
  }

  function PartnerPageController($scope, $controller, $window, translateService) {

    $controller('CoreController', {
      $scope: $scope
    });

    $scope.translateService = translateService
    $window.scroll(0, 0);
    $window.document.title = 'Real Estate Customer Experience Management Platform | Property Management Solutions';
    $scope.callbackForm = {
      product: 'Building Management'
    };


  }

  function ContactUsPageController($scope, $controller, $window, $filter, translateService, $http) {

    $controller('CoreController', {
      $scope: $scope
    });


    $scope.translateService = translateService
    $window.scroll(0, 0);
    $window.document.title = 'Real Estate Customer Experience Management Platform | Property Management Solutions';
    $scope.onContactUsSubmitHandler = function () {
      $scope.callbackModalOverlayActive = true;
      $scope.progressBarLoading = true;
      $http({
        method: 'POST',
        url: 'http://52.220.118.81:3020/shared-resource/webhook/capture-website-contact?organization=5e1ad3b4d0ffee5fb4fc0410',
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
          product: $scope.callbackModalForm.product
        };
        $scope.progressBarLoading = false;
        $scope.callbackModalOverlayActive = false;
      });
    }
    $scope.callbackForm = {
      product: 'Rental Management'
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

    $window.scroll(0, 0);

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

  function FooterController($scope, translateService) {
    $scope.translateService = translateService;
    $scope.currentLanguage = translateService.getCurrentLanguage()

  }

  function PrivacyPolicyController($scope, translateService) {
    $scope.translateService = translateService
  }

  function VisionController($scope, translateService) {
    $scope.translateService = translateService
  }

  function OutTeamController($scope, translateService) {
    $scope.translateService = translateService
  }

  function ModalController($scope, translateService, $http) {
    $scope.translateService = translateService
    $scope.onDemoSignupSubmitHandler = function (form) {
      $scope.progressBarLoading = true;
      $scope.demoSignupOverlayActive = true;
      $http({
        method: 'POST',
        url: 'http://52.220.118.81:3020/shared-resource/webhook/demo-registration?organization=5e1ad3b4d0ffee5fb4fc0410',
        data: {
          'name': $scope.demoSignupForm.name,
          'phoneNumber': $scope.demoSignupForm.countryCode + $scope.demoSignupForm.phoneNumber,
          'email': $scope.demoSignupForm.email,
          'organisation': $scope.demoSignupForm.organization,

        }
      }).then(function (response) {
        $scope.demoSignupForm = {
          countryCode: '+91'
        };
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
        setTimeout((() => {
          $scope.demoSignupOverlayActive = false;
        }), 1500);

      });
    }
  }

})();