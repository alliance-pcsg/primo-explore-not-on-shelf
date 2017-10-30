angular.module('notOnShelf', []).component('prmSearchResultAvailabilityLineAfter', {
  bindings: { parentCtrl: '<' },
  controller: function controller($scope, $location, nosService, notOnShelfOptions, $httpParamSerializer) {
    $scope.show = false;
    this.$onInit = function () {
      console.log(notOnShelfOptions.query_mappings.title);
      var titleParam = notOnShelfOptions.query_mappings.title;
      if ($location.path() === '/fulldisplay') {
        var fulldisplay = true;
      } else {
        var fulldisplay = false;
      }
      var valid = nosService.doesLibOwn($scope, notOnShelfOptions);
      console.log(valid);
      if (fulldisplay == true && valid == true) {

        $scope.show = true;
        $scope.title = $scope.$parent.$ctrl.result.pnx.addata.btitle[0];
        $scope.author = nosService.getAuthor($scope);
        $scope.location = nosService.getLocation($scope);
        $scope.callnumber = nosService.getCallNumber($scope);
        var urlBase = notOnShelfOptions.urlBase;
        var params={
                      [notOnShelfOptions.query_mappings.title] : $scope.title,
                      [notOnShelfOptions.query_mappings.author] : $scope.author,
                      [notOnShelfOptions.query_mappings.location]: $scope.location,
                      [notOnShelfOptions.query_mappings.callnumber]: $scope.callnumber
        }

        $scope.url = nosService.buildUrl(urlBase, params, $httpParamSerializer);

      }
    };
  },
  template: '<div  ng-show="{{show}}" class="" style="margin-top:10px;"><p>Not on shelf? <a ng-href="{{url}}" target="_blank">Let us know.</a></p></div>'
}).factory('nosService', [function () {
  return {
    doesLibOwn: function doesLibOwn($scope, notOnShelfOptions) {

      /* check best location instead */

      var bestloc = $scope.$parent.$ctrl.result.pnx.delivery.hasOwnProperty("bestlocation");
      if (bestloc == true) {
        var inst = $scope.$parent.$ctrl.result.pnx.delivery.bestlocation.mainLocation;

        var libs = notOnShelfOptions.libs;
        console.log("libs:" + libs);

        var check = libs.indexOf(inst);
        console.log("valid check");
        console.log(check);
        if (check == "-1") {
          return false;
        } else {
          return true;
        }
      } else {
        return false;
      }
    },
    getAuthor: function getAuthor($scope) {

      var obj = $scope.$parent.$ctrl.result.pnx.addata;
      if (obj.hasOwnProperty("aulast")) {
        var author = encodeURIComponent($scope.$parent.$ctrl.result.pnx.addata.aulast[0]);
      } else {
        var author = "N/A";
      }
      return author;
    },
    getCallNumber: function getCallNumber($scope) {

      var cn = $scope.$parent.$ctrl.result.pnx.delivery.bestlocation.callNumber;
      var callNumber = cn.replace('(', '');
      var callNumber = callNumber.replace(')', '');
      return callNumber;
    },
    getLocation: function getLocation($scope) {
      if ($scope.delCat == "Alma-E") {
        var location = "Electronic Resource";
      } else {
        var mainLocation = $scope.$parent.$ctrl.result.pnx.delivery.bestlocation.mainLocation;
        var subLocation = $scope.$parent.$ctrl.result.pnx.delivery.bestlocation.subLocation;
        var location = mainLocation + " " + subLocation;
      }
      return location;
    },
    buildUrl: function buildUrl(url, params, $httpParamSerializer) {

      var serializedParams = $httpParamSerializer(params);

      if (serializedParams.length > 0) {
        url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
      }

      return url;
    }
  };
}]);
