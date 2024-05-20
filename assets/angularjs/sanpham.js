window.SanPhamController = function ($scope, $http, $location, $routeParams, $rootScope) {
  document.getElementById('header-wrapper').style.display = 'block';

  let url = "http://localhost:8080/api/product/getall";
  let urlcategory = "http://localhost:8080/api/category";
  let urlbrand = "http://localhost:8080/api/brand";
  let urlmaterial = "http://localhost:8080/api/material";
  let urlcolor = "http://localhost:8080/api/color";
  let urlsize = "http://localhost:8080/api/size";
  let urldesign = "http://localhost:8080/api/design";
  let urlhandtype = "http://localhost:8080/api/handtype";
  let urlnecktype = "http://localhost:8080/api/necktype";

  // GetAll product 
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
    //load product
    $scope.list = [];
    $http.get(url).then(function (response) {
      $scope.list = response.data;
    });

    // load product findall
    $scope.listall = [];
    $http
      .get("http://localhost:8080/api/product/findall")
      .then(function (response) {
        $scope.listall = response.data;
      });


    // pagation
    $scope.pager = {
      page: 0,
      size: 10,
      get items() {
        var start = this.page * this.size;
        return $scope.list.slice(start, start + this.size);
      },
      get count() {
        return Math.ceil((1.0 * $scope.list.length) / this.size);
      },

      first() {
        this.page = 0;
      },
      prev() {
        this.page--;
        if (this.page < 0) {
          this.last();
        }
      },
      next() {
        this.page++;
        if (this.page >= this.count) {
          this.first();
        }
      },
      last() {
        this.page = this.count - 1;
      },
    };

  };
  $scope.loadAll();

  // GetAll product dung hoat dong
  $scope.loadDungHoatDong = function () {
    //load product dhd
    $scope.listdhd = [];
    $http
      .get("http://localhost:8080/api/product/getall1")
      .then(function (response) {
        $scope.listdhd = response.data;
      });
    $scope.pagerdhd = {
      page: 0,
      size: 10,
      get items() {
        var start = this.page * this.size;
        return $scope.listdhd.slice(start, start + this.size);
      },
      get count() {
        return Math.ceil((1.0 * $scope.listdhd.length) / this.size);
      },

      first() {
        this.page = 0;
      },
      prev() {
        this.page--;
        if (this.page < 0) {
          this.last();
        }
      },
      next() {
        this.page++;
        if (this.page >= this.count) {
          this.first();
        }
      },
      last() {
        this.page = this.count - 1;
      },
    };
  };
  $scope.loadDungHoatDong();

  


};