//Data
var cities = [{
    city: 'berlin',
    desc: 'This is the best city in the world!',
    lat: 52.605800,
    long: 13.482940

}];

  var pathLocal = 'http://88.198.205.97/api/v1/mydoc';
//var pathLocal = 'http://127.0.0.1:8080';


angular.module('mydoc', ['ngRoute', 'date-picker', 'ui.bootstrap', 'google-maps'])

    .config(['$routeProvider', function($routeProvider) {

        $routeProvider.when('/customers', {
            templateUrl: '/analyses/tpl/customers.tpl.html',
            controller: 'AllClientsController'
        });


        $routeProvider.when('/', {
            templateUrl: '/analyses/tpl/angmap.tpl.html',
            controller: 'AngController'
        });

        $routeProvider.when('/allContracts', {
            templateUrl: '/analyses/tpl/allContracts.tpl.html',
            controller: 'AllContractsMapController'
        });

        $routeProvider.when('/termin/edit/:id', {
            templateUrl: '/analyses/tpl/appointment.tpl.html',
            controller: 'TerminController'
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



    .controller('AllClientsController', ['$scope', '$http', '$location', '$routeParams', '$timeout', '$route', function($scope, $http, $location, $routeParams, $timeout, $route) {
        $scope.raw = {};

        $http({
            url: pathLocal + '/route/support',
            method: 'GET'
        }).success(function(data) {
            $scope.support = data;
            console.log("Get Technicians");

        });

        $scope.getData = function() {
            var name = $scope.selectedItem.name;
            $scope.test(name);
        };

        $scope.test = function(name) {
            $http({
                url: pathLocal + '/allClients/' + name,
                method: 'GET'
            }).success(function(data) {
                $scope.customers = data;
                $scope.currentPage = 1; //current page
                $scope.entryLimit = 50; //max no of items to display in a page
                $scope.filteredItems = $scope.customers.length; //Initially for no filter  
                $scope.totalItems = $scope.customers.length;
                for (var i = 0; i < data.length; i++) {
                    if (data[i].termin) data[i].termin = moment.utc(data[i].termin).local().format('DD.MM.YY HH:mm:ss');
                }
                for (var i = 0; i < data.length; i++) {
                    if (data[i].status == 24) data[i].status = "delivered";
                    if (data[i].status == 30) data[i].status = "confirmed";
                    if (data[i].status == 21) data[i].status = "ordered";
                }
            });
        };
    }])


    .controller('AngController', ['$scope', '$http', '$location', '$routeParams', '$timeout', '$route', function($scope, $http, $location, $routeParams, $timeout, $route) {

        $http({
            url: pathLocal + '/route/support',
            method: 'GET'
        }).success(function(data) {
            $scope.support = data;
        });

        $scope.getData = function() {

            //if ($scope.stat == "24") $scope.stat = 24;
            //if ($scope.stat == "30") $scope.stat = 30;
            var name = $scope.selectedItem.name;
            var date = $scope.datepicker;
            //var stat = $scope.stat;
            var date1 = moment.utc(date).local().format('YYYY-MM-DD')

            if (date != undefined && name != undefined) {
                $scope.getClients(name, date1);
            } else {
                //console.log(stat);
                console.log("No date");
            }
        };

        $scope.getClients = function(name, date) {

            var map = new google.maps.Map(document.getElementById('map'), {
                zoom: 7,
                center: new google.maps.LatLng(50.984768, 11.029880),
                mapTypeId: google.maps.MapTypeId.ROADMAP
            });

            $scope.markers = [];
            $scope.points = [];


            $http({
                url: pathLocal + '/route/' + name + '/' + date,
                method: 'GET'
            }).success(function(data) {
                var minlat = 1000;
                var maxlat = -1000;
                var minlng = 1000;
                var maxlng = -1000;
                var name = 0;
                $scope.clients = data;
                $scope.currentPage = 1; //current page
                $scope.entryLimit = 20; //max no of items to display in a page
                $scope.filteredItems = data.length; //Initially for no filter  
                $scope.totalItems = data.length;
                for (var i = 0; i < data.length; i++) {
                    if (data[i].termin) data[i].termin = moment.utc(data[i].termin).local().format('DD.MM.YY HH:mm:ss');
                    //if (data[i].created) data[i].created = moment.utc(data[i].created).local().format('DD.MM.YY HH:mm:ss');       
                    //if (data[i].status == 24) data[i].status = "delivered";
                    //if (data[i].status == 30) data[i].status = "confirmed";
                    var address = "Deutschland, " + data[i].city + ' ' + data[i].postCode + ' ' + data[i].street;
                    var client = data[i];
                    //var customerId = data[i].number
                    $scope.geoCode(address, client, map);
                };
            });
        };


        $scope.geoCode = function(address, client, map) {
            $http.get('https://maps.googleapis.com/maps/api/geocode/json?address=' +
                    address + '&key=AIzaSyAcuHjE2Nxs03vfohCBaHo_bCOurtLdFBQ')
                .then(function(_results) {
                    $scope.queryResults = _results.data.results;
                    //$scope.geodata = $scope.queryResults[0].geometry;

                    $scope.myLat = $scope.queryResults[0].geometry.location.lat;
                    $scope.myLon = $scope.queryResults[0].geometry.location.lng;
                    $scope.markers.push({ location: new google.maps.LatLng($scope.myLat, $scope.myLon), stopover: false });
                    console.log("Geocoding: " + $scope.myLat + ' ' + $scope.myLon)
                    $scope.createMarker($scope.queryResults[0].geometry.location, "<b>" + client.name + " " + client.surname + "</b><br>" + "<a href='#/termin/edit/" + client.number + "'>" + client.number + "</a>", map, client.status, $scope.markers);
                    //$scope.test = address;//$scope.myLon.toString();
                    //scope.markers.push({ latitude: parseInt($scope.myLat,10), longitude: parseInt($scope.myLon,10), name: name });
                    $scope.directionCount($scope.markers, map);

                });
        };
        $scope.createMarker = function(location, info, map, status, markers) {

            var infowindow = new google.maps.InfoWindow();


            var newMarker = new google.maps.Marker({
                position: new google.maps.LatLng($scope.myLat, $scope.myLon),
                map: map,
                icon: (status == 30) ? 'https://maps.google.com/mapfiles/ms/icons/green-dot.png' : 'https://maps.google.com/mapfiles/ms/icons/red-dot.png'
            });

            google.maps.event.addListener(newMarker, 'click', (function(newMarker) {
                return function() {
                    infowindow.close();
                    infowindow.setContent(info);
                    infowindow.open(map, newMarker);
                }
            })(newMarker));

            newMarker.addListener("dblclick", function() {
                newMarker.setMap(null);
                //Shift Array elemeents to left 
                for (var n = newMarker; n < markers.length - 1; n++) {
                    markers[n] = markers[n + 1];
                }
                markers.length = markers.length - 1 //Decrease Array length by 1 
                //var markerIndex = markers.push(markers) - 1; // push() returns new array length
                //createRow(markerIndex);
                $scope.directionCount(markers, map)
            });

        };

        $scope.directionCount = function(markers, map) {
            $scope.startlocation = '50.979799, 11.056413';
            $scope.endlocation = '50.985856, 11.055183';
            console.log("Waypoints: " + markers);
            setTimeout(function() {
                var directionsService = new google.maps.DirectionsService();
                var directionsRequest = {
                    origin: $scope.startlocation,
                    waypoints: markers,
                    destination: $scope.startlocation,
                    optimizeWaypoints: true,
                    travelMode: google.maps.TravelMode.DRIVING
                }
                console.log('The direction service has been build with success')


                directionsService.route(directionsRequest, function(response, status) {
                    if (status === google.maps.DirectionsStatus.OK) {
                        var directionsDisplay = new google.maps.DirectionsRenderer({
                            //polylineOptions: { strokeColor: "#8b0013" },
                            map: map,
                            directions: response,
                        });
                        var leg = response.routes[0].legs[0];
                        //setMarker(0, leg.start_location, $scope.icons.start, 'title');
                        //setMarker(1, leg.end_location, $scope.icons.end, 'title');
                        var myRoute = response.routes[0];
                        var summaryPanel = document.getElementById('directions');
                        // var time = "Dauer: " + myRoute.legs[1].duration.text + '<br>';
                        //var distance = "Distanz: " + myRoute.legs[0].distance.text + '<br>';
                        var totalTime = 0;
                        var distance = 0;
                        var txtDir = '';
                        for (var i = 0; i < myRoute.legs.length; i++) {
                            summaryPanel.innerHTML += myRoute.legs[0].steps[i].instructions + "<br />";
                            totalTime += myRoute.legs[i].duration.value;
                            distance += myRoute.legs[i].distance.value;
                        }
                        summaryPanel.innerHTML = '<strong>' + "Dauer: " + '</strong>' + (totalTime / 60).toFixed(2) + " Minuten" + '<br> ' + '<strong>' + "Distanz: " + '</strong>' + distance / 1000 + " Km" + '<br>';
                        //summaryPanel.innerHTML = "Distanz: " + distance + '<br>';
                    } else {
                        console.log('Request failed: ' + status);
                    }
                });
            }, 3000);

        };


        /*            google.maps.event.addListener(marker, 'mouseout', function() { 
                                   infowindow.close();
                               });
*/
        //$scope.markers.push(newMarker);
        //$scope.markers.push({ latitude: parseInt($scope.myLat,10), longitude: parseInt($scope.myLon,10) });
        // console.log($scope.myLat + ' ' + $scope.myLon);

        /*                            if ($scope.myLat > maxlat) maxlat = parseInt($scope.myLat, 10);
                                    if ($scope.myLat < minlat) minlat = parseInt($scope.myLat, 10);
                                    if ($scope.myLon > maxlng) maxlng = parseInt($scope.myLon, 10);
                                    if ($scope.myLon < minlng) minlng = parseInt($scope.myLon, 10);*/





        /*                          maxlat += (maxlat - minlat) * 0.3;
                                    minlat -= (maxlat - minlat) * 0.3;
                                    maxlng += (maxlng - minlng) * 0.3;
                                    minlng -= (maxlng - minlng) * 0.3;
                                    $scope.bounds = {
                                        northeast: { latitude: maxlat, longitude: maxlng },
                                        southwest: { latitude: minlat, longitude: minlng }
                                    };
                                    $scope.center = {
                                            latitude: 50.984768,
                                           longitude: 11.029880
                                    };
                                    console.log('bounds: '+$scope.bounds);*/
    }])


    .controller('AllContractsMapController', ['$scope', '$http', '$location', '$routeParams', '$timeout', '$route', function($scope, $http, $location, $routeParams, $timeout, $route) {

        $http({
            url: pathLocal + '/route/support',
            method: 'GET'
        }).success(function(data) {
            $scope.support = data;
        });

        $scope.getData = function() {
            var name = $scope.selectedItem.name;
            //var stat = $scope.stat;
            if (name != undefined) {
                $scope.getClients(name);
            } else {
                console.log("No Technik");
            }
        };

        $scope.getClients = function(name) {

            var map = new google.maps.Map(document.getElementById('map'), {
                zoom: 7,
                center: new google.maps.LatLng(53.89263, 5.0503),
                mapTypeId: google.maps.MapTypeId.ROADMAP
            })

            $scope.markers = [];

            $http({
                url: pathLocal + '/allClients/' + name,
                method: 'GET'
            }).success(function(data) {
                var minlat = 1000;
                var maxlat = -1000;
                var minlng = 1000;
                var maxlng = -1000;
                var name = 0;
                $scope.clients = data;
                $scope.currentPage = 1; //current page
                $scope.entryLimit = 20; //max no of items to display in a page
                $scope.filteredItems = data.length; //Initially for no filter  
                $scope.totalItems = data.length;
                for (var i = 0; i < data.length; i++) {
                    if (data[i].termin) data[i].termin = moment.utc(data[i].termin).local().format('DD.MM.YY HH:mm:ss');
                    var address = "Deutschland, " + data[i].city + ' ' + data[i].postCode + ' ' + data[i].street;
                    var client = data[i];
                    //var customerId = data[i].number
                    $scope.geoCode(address, client, map);
                };
            });
        };

        $scope.geoCode = function(address, client, map) {
            $http.get('https://maps.googleapis.com/maps/api/geocode/json?address=' +
                    address + '&key=AIzaSyAcuHjE2Nxs03vfohCBaHo_bCOurtLdFBQ')
                .then(function(_results) {
                    $scope.queryResults = _results.data.results;
                    //$scope.geodata = $scope.queryResults[0].geometry;
                    $scope.myLat = $scope.queryResults[0].geometry.location.lat;
                    $scope.myLon = $scope.queryResults[0].geometry.location.lng;
                    $scope.markers.push({ location: new google.maps.LatLng($scope.myLat, $scope.myLon), stopover: false });
                    console.log("Geocoding: " + $scope.myLat + ' ' + $scope.myLon)
                    $scope.createMarker($scope.queryResults[0].geometry.location, "<b>" + client.name + " " + client.surname + "</b><br>" + "<p><b>AZ: </b>" + client.contract + "</p>", map, client.status, $scope.markers, client);
                    //$scope.test = address;//$scope.myLon.toString();
                    //scope.markers.push({ latitude: parseInt($scope.myLat,10), longitude: parseInt($scope.myLon,10), name: name });

                });
        };

        var infowindow = new google.maps.InfoWindow();


        $scope.createMarker = function(location, info, map, status, markers, client) {
            $scope.cientInfo = info;
            var newMarker = new google.maps.Marker({
                position: new google.maps.LatLng($scope.myLat, $scope.myLon),
                map: map,
                icon: (status == 30) ? 'https://maps.google.com/mapfiles/ms/icons/green-dot.png' : (status == 24) ? 'https://maps.google.com/mapfiles/ms/icons/red-dot.png' : 'https://maps.google.com/mapfiles/ms/icons/yellow-dot.png'
            });
            google.maps.event.addListener(newMarker, 'click', (function(newMarker) {
                return function() {
                    if (infowindow) {
                        infowindow.close();
                    }
                    infowindow.setContent(info);
                    infowindow.open(map, newMarker);
                    $scope.clientInfo = info;
                    var summaryPanel = document.getElementById('clientInfo');
                    summaryPanel.innerHTML = '<strong>' + "Name: " + '</strong>' + client.surname + ' ' + client.name + '<br> ' + '<strong>' + "Adresse: " + '</strong>' + client.street + ', ' + client.postCode + ', ' + client.city + '<br><strong>Telefonnummer: </strong>' + client.phone + '<br><strong>Handy: </strong>' + client.mobile + '<br><strong>Notiz: </strong>' + client.description + '<br><strong>Aktueller Termin: </strong>' + client.termin + '<br><strong>Neuen Termin festlegen: </><a  target="_blank"  href="#/termin/edit/' + client.number + '">' + client.number + '</a>';
                    //alert($scope.clientInfo);
                    //summaryPanel.innerHTML  = info;
                }
            })(newMarker));

            newMarker.addListener("dblclick", function() {
                newMarker.setMap(null);
                //Shift Array elemeents to left 
                for (var n = newMarker; n < markers.length - 1; n++) {
                    markers[n] = markers[n + 1];
                }
                markers.length = markers.length - 1 //Decrease Array length by 1 
                //$scope.directionCount(markers, map)
            });
        };
    }])


    .filter('startFrom', function() {
        return function(input, start) {
            if (input) {
                start = +start; //parse to int
                return input.slice(start);
            }
            return [];
        }
    })

    .controller('TerminController', ['$scope', '$http', '$location', '$routeParams', '$timeout', '$route', function($scope, $http, $location, $routeParams, $timeout, $route) {

        $http({
            url: pathLocal + '/customer/edit/' + $routeParams.id,
            method: 'GET'
        }).success(function(data) {
            console.log(data);
            $scope.person = data;
            $scope.city = data[0].city;
            $scope.postcode = data[0].postCode;
            $scope.street = data[0].street;
        });


        $scope.Cancel = function() {
            $location.url('/details');
        };

        $scope.Save = function(date, id) {
            if (confirm('DO you want to change appointment for customer Id: "' + $routeParams.id + '" ?')) {
                $scope.date = moment.utc(date).local().format('YYYY-MM-DD');
                $scope.num = $routeParams.id;
                $http({
                    url: pathLocal + '/change/appointment/' + $scope.num + '/' + $scope.date,
                    method: 'PUT',
                    data: {
                        city: $scope.city,
                        postcode: $scope.postcode,
                        street: $scope.street
                    }
                }).success(function() {
                    $location.url('/details');
                });
            };
        };
    }])