window.SanPhamController = function ($scope, $http, $location, $routeParams, $rootScope) {
    document.getElementById('header-wrapper').style.display = 'block';

    let url = "http://localhost:8080/api/product";
    let urlcategory = "http://localhost:8080/api/category";
    let urlbrand = "http://localhost:8080/api/brand";
    let urlmaterial = "http://localhost:8080/api/material";
    let urlcolor = "http://localhost:8080/api/color";
    let urlsize = "http://localhost:8080/api/size";
    let urldesign = "http://localhost:8080/api/design";
    let urlhandtype = "http://localhost:8080/api/handtype";
    let urlnecktype = "http://localhost:8080/api/necktype";

    $scope.loadAll = function () {

        // load category
        $scope.listCategory = [];
        $http.get(urlcategory).then(function (response) {
          $scope.listCategory = response.data;
        });
        // load brand
        $scope.listBrand = [];
        $http.get(urlbrand).then(function (response) {
          $scope.listBrand = response.data;
        });
        // load material
        $scope.listMaterial = [];
        $http.get(urlmaterial).then(function (response) {
          $scope.listMaterial = response.data;
        });
        // load color
        $scope.listColor = [];
        $http.get(urlcolor).then(function (response) {
          $scope.listColor = response.data;
        });
        // load size
        $scope.listSize = [];
        $http.get(urlsize).then(function (response) {
          $scope.listSize = response.data;
        });
        // load design
        $scope.listDesign = [];
        $http.get(urldesign).then(function (response) {
          $scope.listDesign = response.data;
        });
        // load handtype
        $scope.listHandType = [];
        $http.get(urlhandtype).then(function (response) {
          $scope.listHandType = response.data;
        });
        // load necktype
        $scope.listNeckType = [];
        $http.get(urlnecktype).then(function (response) {
          $scope.listNeckType = response.data;
        });
 
      };
    $scope.loadAll();
    

};