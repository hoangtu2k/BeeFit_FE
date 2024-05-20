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

  //GetAll product 
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

  //GetAll product dung hoat dong
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

  //import exel
  $scope.importExel = function () {

    let file = document.getElementById("fileInput").files;

    if (file.length === 0) {
      Swal.fire("Vui lòng tải lên file Exel trước khi thêm !", "", "error");
    } else {
      let form = new FormData();
      form.append("file", file[0]);
      $http
        .post("http://localhost:8080/api/product/importExel", form, {
          transformRequest: angular.identity,
          headers: {
            "Content-Type": undefined, // Để để Angular tự động thiết lập Content-Type
          },
        })
        .catch(function (err) {
          if (err.status === 500) {
            Swal.fire("Có lỗi xảy ra vui lòng xem lại !", "", "error");
          }
          if (err.status === 404) {
            Swal.fire("Có lỗi xảy ra vui lòng xem lại !", "", "error");
          }
        })
        .then(function (ok) {
          Swal.fire("Thêm data từ Exel thành công !", "", "success");
          $scope.loadAll(); // Gọi hàm load lại dữ liệu sản phẩm
          $scope.isnhapfile = false;
        });
    }
  };

  //open import exel
  $scope.isnhapfile = false;
  $scope.openImportExcel = function () {
    $scope.isnhapfile = !$scope.isnhapfile;
  };

  //export exel
  $scope.exportToExcel = function () {
    // Chuyển dữ liệu thành một mảng các đối tượng JSON
    var dataArray = $scope.list.map(function (item) {
      var Materials = item.productDetail_materials
        .map(function (detail) {
          return detail.material.name;
        })
        .join(", ");
      var Images = item.product.productImages
        .map(function (image) {
          return image.url;
        })
        .join(", ");
      var Color_Size = item.productDetail_size_colors
        .map(function (size) {
          return (
            "Color : " +
            size.color.name +
            " { Size " +
            size.size.name +
            " | Quantity : " +
            size.quantity +
            "}"
          );
        })
        .join(", ");
      return {
        Code: item.product.code,
        Name: item.product.name,
        Images: Images,
        Price: item.price,
        Description: item.description,
        Discount: item.discount,
        Category: item.category.name,
        Brand: item.brand.name,
        Design: item.design.name,
        NeckType: item.neckType.name,
        HandType: item.handType.name,
        Materials: Materials,
        QuantityByColor_Sizes: Color_Size,
      };
    });

    // Tạo một workbook mới
    var workbook = XLSX.utils.book_new();

    // Tạo một worksheet từ dữ liệu
    var worksheet = XLSX.utils.json_to_sheet(dataArray);

    // Thêm worksheet vào workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data Sheet");

    // Xuất tệp Excel
    XLSX.writeFile(workbook, "data" + new Date() + ".xlsx");
    Swal.fire("Xuất file exel thành công !", "", "success");
  };

  //export exel mau
  $scope.exportToExcelMau = function () {
    
    var dataArray = $scope.list.map(function (item) {
      
    });
  
    // Add a hard-coded row
    dataArray.unshift({
      Name: "Product test",
      Url: "http://example.com/hardcoded-image.jpg",
      Price: 100000,
      Description: "This is a hard-coded product",
      Discount: 0,
      Category: "1",
      Brand: "1",
      Design: "1",
      HandType: "1",
      NeckType: "1",
      Materials: "1,2",
      QuantityByColor_Sizes: "1-1-100,1-2-100,1-3-100,1-4-100",
    });
  
    // Create a new workbook
    var workbook = XLSX.utils.book_new();
  
    // Create a worksheet from the data
    var worksheet = XLSX.utils.json_to_sheet(dataArray);
  
    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data Sheet");
  
    // Export the Excel file
    XLSX.writeFile(workbook, "data" + new Date() + ".xlsx");
  };

  


};