angular.module('NOS', []).component('prmSearchResultAvailabilityLineAfter', {
  bindings: { parentCtrl: '<' },
  controller: ['$scope', '$location',  'nosOptions', 'nosService', '$httpParamSerializer',
    function($scope, $location,  nosOptions, nosService, $httpParamSerializer){
      $scope.checkBestLoc = function() {
        if (nosService.checkPage($location)){
          $scope.bestlocation=$scope.$parent.$ctrl.result.delivery.bestlocation;
          if (!$scope.bestlocation){
            return false;
          }
          else{
            var mainLocation = $scope.bestlocation.mainLocation
            if (!nosOptions[0][mainLocation]){
              return false;  //not on
            }
            else{
              var subLocationCode=nosService.getSubLocationCode($scope);
              var codes=nosOptions[0][mainLocation][0]["locationCodes"]
              if (nosService.subLocationCodeCheck(subLocationCode, codes)){
                var callNumber=nosService.getCallNumber($scope);
                var author=nosService.getAuthor($scope);
                var title=nosService.getTitle($scope);
                var location=nosService.getLocation($scope);

                var params={
                  [nosOptions[0][mainLocation][0].query_mappings[0].title] : title,
                  [nosOptions[0][mainLocation][0].query_mappings[0].author] : author,
                  [nosOptions[0][mainLocation][0].query_mappings[0].location]: location,
                  [nosOptions[0][mainLocation][0].query_mappings[0].callnumber]: callNumber
                }
                var urlBase=nosOptions[0][mainLocation][0].urlBase;
                $scope.url=nosService.buildUrl(urlBase, params, $httpParamSerializer);
                return true;

              }
              else{
                return false;
              }
            }
          }
        }
        else{
          /* brief result */
          return false;
        }
      };
    }],
    template: '<div  ng-show="checkBestLoc()"  style="margin-top:10px;"><p>Not on shelf? <a ng-href="{{url}}" target="_blank">Let us know.</a></p></div>'
    }).factory('nosService', [function () {
    return {
      buildUrl: function (url, params, $httpParamSerializer) {
        var serializedParams = $httpParamSerializer(params);
        if (serializedParams.length > 0) {
          url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
        }
        return url;
      },
      checkPage: function ($location){
        if ($location.path() === '/fulldisplay') {
          return true;
        } else {
          return false;
        }
      },
      getAuthor: function getAuthor($scope) {
        var obj = $scope.$parent.$ctrl.result.pnx.addata;
        console.log(obj);
        if (obj.hasOwnProperty("aulast")) {
          var author = encodeURIComponent($scope.$parent.$ctrl.result.pnx.addata.aulast[0]);
        } else {
          var author = "N/A";
        }
        return author;
      },
      getTitle: function getTitle($scope) {
        var obj = $scope.$parent.$ctrl.result.pnx.addata;
        if (obj.hasOwnProperty("btitle")) {
          var title = $scope.$parent.$ctrl.result.pnx.addata.btitle[0];
        } else {
          var title = "N/A";
        }
        return title;
      },
      getCallNumber: function ($scope) {
        var cn = $scope.$parent.$ctrl.result.delivery.bestlocation.callNumber;
        var callNumber = cn.replace('(', '');
        var callNumber = callNumber.replace(')', '');
        return callNumber;
      },
      getLocation: function getLocation($scope) {
        if ($scope.delCat == "Alma-E") {
          var location = "Electronic Resource";
        } else {
          var mainLocation = $scope.$parent.$ctrl.result.delivery.bestlocation.mainLocation;
          var subLocation = $scope.$parent.$ctrl.result.delivery.bestlocation.subLocation;
          var location = mainLocation + " " + subLocation;
        }
        return location;
      },
      subLocationCodeCheck: function(code, codes){
        var check = codes.indexOf(code);
        console.log(check);
        if (check == "-1") {
          return false;
        } else {
          return true;
        }
      },
      getSubLocationCode: function ($scope) {
        if ($scope.delCat == "Alma-E") {
          var subLocationCode = "Electronic Resource";
        } else {
          var subLocationCode = $scope.$parent.$ctrl.result.delivery.bestlocation.subLocationCode;
        }
        return subLocationCode;
      },
    };
  }]);
