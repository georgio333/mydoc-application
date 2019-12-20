
 var pathNew = 'http://88.198.205.97/api/v1/mydoc';
//var pathNew = 'http://127.0.0.1:8080';


angular.module('mydoc', ['ngRoute', 'ui.router', 'google-maps', 'ui.directives', 'date-picker', 'ui.bootstrap'])

.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/', {
        templateUrl: '/status/tpl/application.tpl.html',
        controller: 'CustomerController'
    });
}])

.controller('MainController', ['$scope', function($scope) {

    $scope.myDate = new Date();
    $scope.minDate = new Date(
        $scope.myDate.getFullYear(),
        $scope.myDate.getMonth() - 2,
        $scope.myDate.getDate());
    $scope.maxDate = new Date(
        $scope.myDate.getFullYear(),
        $scope.myDate.getMonth() + 2,
        $scope.myDate.getDate());
    $scope.onlyWeekendsPredicate = function(date) {
        var day = date.getDay();
        return day === 0 || day === 6;
    }
}])

.controller('CustomerController', ['$scope', '$http', '$location', '$routeParams', '$timeout', '$route', function($scope, $http, $location, $routeParams, $timeout, $route) {
    $scope.getInfo = function() {
        if (!$scope.custId || !$scope.postCode) {
            alert('Please fill all fields');
        } else {
            console.log($scope.custId);
            $http({
                url: pathNew + '/customer/status/' + $scope.custId + '/' + $scope.postCode,
                method: 'GET'
            }).success(function(data) {
                $scope.customer = data;
                $scope.totalItems = $scope.customer.length;
                for (var i = 0; i < data.length; i++) {

                    if (data[i].termin == null) {
                        data[i].termin = "No appointment";
                        data[i].changeDate = moment.utc(data[i].changeDate).local().format('DD.MM.YY');
                    } else {
                        data[i].termin = moment.utc(data[i].termin).local().format('DD.MM.YY');
                        data[i].changeDate = moment.utc(data[i].changeDate).local().format('DD.MM.YY');
                        
                    }
                }

                for (var i = 0; i < data.length; i++) {
                    if (data[i].status == 24) data[i].status = "Delivered";
                    if (data[i].status == 30) data[i].status = "Confirmed";
                    if (data[i].status == 0) data[i].status = "Open";
                    if (data[i].status == 20) data[i].status = "In order";
                    if (data[i].status == 241) data[i].status = "Half ready";
                    if (data[i].status == 255) data[i].status = "Closed";

                }
            });

        }
    };
    $scope.sort_by = function(predicate) {
        $scope.predicate = predicate;
        $scope.reverse = !$scope.reverse;
    };
}])
