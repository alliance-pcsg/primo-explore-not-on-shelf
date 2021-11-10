(function(){
"use strict";
'use strict';

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/************************************* BEGIN Bootstrap Script ************************************/


var app = angular.module('viewCustom', ['notOnShelf']);





app.component('prmSearchResultAvailabilityLineAfter', {
  template: '<not-on-shelf></not-on-shelf>'
});






/****************** begin not on shelf *****************************/

angular.module('notOnShelf', []).component('notOnShelf', {
  bindings: { parentCtrl: '<' },
  controller: ['$scope', '$location', 'nosOptions', 'nosService', '$httpParamSerializer', function ($scope, $location, nosOptions, nosService, $httpParamSerializer) {
    $scope.checkBestLoc = function () {
      if (nosService.checkPage($location)) {
        //console.log($scope);
        $scope.bestlocation = $scope.$parent.$parent.$ctrl.result.delivery.bestlocation;
        console.log($scope.bestlocation)
        if (!$scope.bestlocation || $scope.bestlocation.availabilityStatus == "unavailable") {
          console.log("ain't happening");
          return false;
        } else {
          console.log("happening!");
          var mainLocation = $scope.bestlocation.mainLocation;
          console.log(mainLocation);

          /* This is checking for a match on the library names in the nosOptions. The line above will show in the console what Primo is looking for.   */
          if (!nosOptions[0][mainLocation]) {
            console.log("no options for this location")
            return false; //not on
          } else {
            var subLocationCode = nosService.getSubLocationCode($scope);
            var codes = nosOptions[0][mainLocation][0]["locationCodes"];
            if (nosService.subLocationCodeCheck(subLocationCode, codes)) {
              var _params;

              var callNumber = nosService.getCallNumber($scope);
              var author = nosService.getAuthor($scope);
              var title = nosService.getTitle($scope);
              var location = nosService.getLocation($scope);

              var params = (_params = {}, _defineProperty(_params, nosOptions[0][mainLocation][0].query_mappings[0].title, title), _defineProperty(_params, nosOptions[0][mainLocation][0].query_mappings[0].author, author), _defineProperty(_params, nosOptions[0][mainLocation][0].query_mappings[0].location, location), _defineProperty(_params, nosOptions[0][mainLocation][0].query_mappings[0].callnumber, callNumber), _params);
              var urlBase = nosOptions[0][mainLocation][0].urlBase;
              $scope.url = nosService.buildUrl(urlBase, params, $httpParamSerializer);
              return true;
            } else {
              return false;
            }
          }
        }
      } else {
        /* brief result */
        return false;
      }
    };
  }],
  template: '<div  ng-show="checkBestLoc()"  style="margin-top:10px;"><p>Not on shelf? <a ng-href="{{url}}" target="_blank">Let us know.</a></p></div>'
}).factory('nosService', [function () {
  return {
    buildUrl: function buildUrl(url, params, $httpParamSerializer) {
      var serializedParams = $httpParamSerializer(params);
      if (serializedParams.length > 0) {
        url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
      }
      return url;
    },
    checkPage: function checkPage($location) {
      if ($location.path() === '/fulldisplay') {
        return true;
      } else {
        return false;
      }
    },
    getAuthor: function getAuthor($scope) {
      var obj = $scope.$parent.$parent.$ctrl.result.pnx.addata;
    //  console.log(obj);
      if (obj.hasOwnProperty("aulast")) {
        var author = encodeURIComponent($scope.$parent.$parent.$ctrl.result.pnx.addata.aulast[0]);
      } else {
        var author = "N/A";
      }
      return author;
    },
    getTitle: function getTitle($scope) {
      var obj = $scope.$parent.$parent.$ctrl.result.pnx.addata;
      if (obj.hasOwnProperty("btitle")) {
        var title = $scope.$parent.$parent.$ctrl.result.pnx.addata.btitle[0];
      } else {
        var title = "N/A";
      }
      return title;
    },
    getCallNumber: function getCallNumber($scope) {
      var cn = $scope.$parent.$parent.$ctrl.result.delivery.bestlocation.callNumber;
      var callNumber = cn.replace('(', '');
      var callNumber = callNumber.replace(')', '');
      return callNumber;
    },
    getLocation: function getLocation($scope) {
        var mainLocation = $scope.$parent.$parent.$ctrl.result.delivery.bestlocation.mainLocation;
        var subLocation = $scope.$parent.$parent.$ctrl.result.delivery.bestlocation.subLocation;
        var location = mainLocation + " " + subLocation;
        return location;
    },
    subLocationCodeCheck: function subLocationCodeCheck(code, codes) {
      var check = codes.indexOf(code);
    //  console.log(check);
      if (check == "-1") {
        return false;
      } else {
        return true;
      }
    },
    getSubLocationCode: function getSubLocationCode($scope) {

      var subLocationCode = $scope.$parent.$parent.$ctrl.result.delivery.bestlocation.subLocationCode;
      return subLocationCode;
    }
  };
}]);


/* Not on shelf options! */

app.value('nosOptions', [{
  "Watzek Library": [{
    "urlBase": "https://docs.google.com/forms/d/e/1FAIpQLSdBvdqmK0z1mHhg-ATiCHT94JVBuwdaaHzpyZJcK3XBGEP-IA/viewform?usp=pp_url",
    "query_mappings": [{
      'title': 'entry.956660822',
      'author': 'entry.1791543904',
      'callnumber': 'entry.865809076',
      'location': 'entry.431935401'
    }],
    "locationCodes": ["wmain", "wvid", "wref", "wdis", "wgovd", "wgovav", "wjuv", "weasy", "wnew", "wos", "wbalc", "wluo"]
  }],
  "Boley Law Library": [{
    "urlBase": "https://docs.google.com/forms/d/e/1FAIpQLSeevMvoTWs7JOw7BHvz1dXsRlAYpp9gi4qDByLU4NTrmvs2hQ/viewform?usp=pp_url",
    "query_mappings": [{
      'title': 'entry.956660822',
      'author': 'entry.1791543904',
      'callnumber': 'entry.865809076',
      'location': 'entry.431935401'
    }],
    "locationCodes": ["lsta", "lfed", "lhist", "lcv", "lenv", "lmain", "lstu"]
  }]
}]);

/***************** end not on shelf ********************************/



})();
