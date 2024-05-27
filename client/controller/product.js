window.ProductController = function ($scope, $http, $location, $routeParams, $rootScope) {

  $scope.loadProductNew = function () {

    let url = "http://localhost:8080";

    let urlproduct = url + "/api/product/getall";
    let urlcategory = url + "/api/category";
    let urlbrand = url + "/api/brand";
    let urlmaterial = url + "/api/material";
    let urlcolor = url + "/api/color";
    let urlsize = url + "/api/size";
    let urldesign = url + "/api/design";
    let urlhand = url + "/api/handtype";
    let urlneck = url + "/api/necktype";

    //load product
    $scope.list = [];
    $http.get(urlproduct).then(function (response) {
      $scope.list = response.data;
    });
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
    // load handtype
    $scope.listHandType = [];
    $http.get(urlhand).then(function (response) {
      $scope.listHandType = response.data;
    });
    // load necktype
    $scope.listNeckType = [];
    $http.get(urlneck).then(function (response) {
      $scope.listNeckType = response.data;
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

    $scope.sort = function () {
      let idsort = document.getElementById("SortBy").value;
      if (idsort === "sort") {
        $http.get(url).then(function (response) {
          $scope.list = response.data;
        });
      } else if (idsort === "sort1") {
        $scope.list = $scope.list.sort(function (a, b) {
          return a.product.name.localeCompare(b.product.name);
        });
      } else if (idsort === "sort2") {
        $scope.list = $scope.list.sort(function (a, b) {
          return b.product.name.localeCompare(a.product.name);
        });
      } else if (idsort === "sort3") {
        $scope.list = $scope.list.sort(function (a, b) {
          return a.price - b.price;
        });
      } else if (idsort === "sort4") {
        $scope.list = $scope.list.sort(function (a, b) {
          return b.price - a.price;
        });
      }
    };

    // pagation
    $scope.pager = {
      page: 0,
      size: 16,
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

    let min = 0;
    let max = 9999999;

    const calcLeftPosition = (value) => (100 / (9999999 - 0)) * (value - 0);

    $("#rangeMin").on("input", function (e) {
      const newValue = parseInt(e.target.value);
      if (newValue > max) return;
      min = newValue;
      $("#thumbMin").css("left", calcLeftPosition(newValue) + "%");
      $("#min").html(newValue.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }));
      $("#line").css({
        left: calcLeftPosition(newValue) + "%",
        right: 100 - calcLeftPosition(max) + "%",
      });
    });

    $("#rangeMax").on("input", function (e) {
      const newValue = parseInt(e.target.value);
      if (newValue < min) return;
      max = newValue;
      $("#thumbMax").css("left", calcLeftPosition(newValue) + "%");
      $("#max").html(newValue.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }));
      $("#line").css({
        left: calcLeftPosition(min) + "%",
        right: 100 - calcLeftPosition(newValue) + "%",
      });
    });

    $scope.filter = function () {
      let name = document.getElementById("tentimkiem").value;
      let idCategory = document.getElementById("danhmuc").value;
      let idMaterial = document.getElementById("chatlieu").value;
      let idColor = document.getElementById("mausac").value;
      let idSize = document.getElementById("kichthuoc").value;
      let idBrand = document.getElementById("thuonghieu").value;
      let idNeckType = document.getElementById("kieuco").value;
      let idHandType = document.getElementById("kieutay").value;
      let idDesign = document.getElementById("thietke").value;
      let min = document.getElementById("rangeMin").value;
      let max = document.getElementById("rangeMax").value;
      let idcate = idCategory != "" ? idCategory : null;
      let idbrad = idBrand != "" ? idBrand : null;
      let idmate = idMaterial != "" ? idMaterial : null;
      let idcolor = idColor != "" ? idColor : null;
      let idsize = idSize != "" ? idSize : null;
      let idhand = idHandType != "" ? idHandType : null;
      let idneck = idNeckType != "" ? idNeckType : null;
      let iddesign = idDesign != "" ? idDesign : null;
      let nameF = name != "" ? name : null;

      var params = {
        name: nameF,
        idcategory: idcate,
        idmaterial: idmate,
        idcolor: idcolor,
        idsize: idsize,
        idbrand: idbrad,
        idhandtype: idhand,
        idnecktype: idneck,
        iddesign: iddesign,
        min: min,
        max: max,
      };
      $http({
        method: "GET",
        url: "http://localhost:8080/api/product/filter",
        params: params,
      }).then(function (resp) {
        $scope.list = resp.data;
        $scope.pager.first();
      });
    };

  };
  $scope.loadProductNew();

};