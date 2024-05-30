window.MyOrderController = function ($http, $scope, $routeParams, $location, AuthService) {

  $scope.myorder = function () {
    let IdCustomer = AuthService.getCustomer();
    let urlcolor = "http://localhost:8080/api/color";
    let urlsize = "http://localhost:8080/api/size";
    let url = "http://localhost:8080/api/product/getall";
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
    //load product
    $scope.listPro = [];
    $http.get(url).then(function (response) {
      $scope.listPro = response.data;
    });

    $scope.isPopupVisible = false;

    $scope.togglePopup = function (code) {
      $scope.listItem = [];
      $scope.bill = {};
      $scope.isPopupVisible = !$scope.isPopupVisible;
      $http.get("http://localhost:8080/api/bill/getbycode/" + code).then(function (resp) {
        $scope.bill = resp.data;
      })
      $scope.address = {};
      $http.get("http://localhost:8080/api/address/getBill/" + code).then(function (resp) {
        $scope.address = resp.data;
      })
      $http.get("http://localhost:8080/api/bill/getallbybill/" + code).then(function (resp) {
        $scope.listItem = resp.data;
      })
      $scope.isChiTiet = false;
      $scope.chitiet = function (code) {
        $scope.isChiTiet = !$scope.isChiTiet;
        $scope.listbillhistory = [];
        $http.get("http://localhost:8080/api/billhistory/" + code).then(function (resp) {
          $scope.listbillhistory = resp.data;
        })
      }
      // $scope.pager1 = {
      //   page: 0,
      //   size: 3,
      //   get items() {
      //     var start = this.page * this.size;
      //     return $scope.listItem.slice(start, start + this.size);
      //   },
      //   get count() {
      //     return Math.ceil((1.0 * $scope.listItem.length) / this.size);
      //   },

      //   first() {
      //     this.page = 0;
      //   },
      //   prev() {
      //     this.page--;
      //     if (this.page < 0) {
      //       this.last();
      //     }
      //   },
      //   next() {
      //     this.page++;
      //     if (this.page >= this.count) {
      //       this.first();
      //     }
      //   },
      //   last() {
      //     this.page = this.count - 1;
      //   },
      // };



    };
    //   $scope.customFilter = function(item) {
    //     if (!$scope.hoadon && !$scope.ngaymua) {
    //         return true; // Hiển thị tất cả nếu không có điều kiện
    //     }

    //     var matchHoadon = (!$scope.hoadon) || (item.code.indexOf($scope.hoadon) !== -1);

    //     if ($scope.ngaymua) {
    //         // Chuyển đổi ngày mua từ ngày nhập của người dùng (ví dụ: '2023-01-01')
    //         // thành định dạng ngày mà purchaseDate sử dụng
    //         console.log(item.purchaseDate)
    //         var formattedNgaymua = $filter('date')($scope.ngaymua, "yyyy-MM-dd HH:mm:ss.sss Z");

    //         var matchNgaymua = (item.purchaseDate.indexOf(formattedNgaymua) !== -1);
    //     } else {
    //         var matchNgaymua = true; // Không có điều kiện về ngày mua
    //     }

    //     return matchHoadon && matchNgaymua;
    // };
    $scope.countTT = function () {
      //count all
      $scope.countall = [];
      let paramall = {
        idCustomer: IdCustomer,
        status: null
      }
      $http({
        method: "GET",
        url: "http://localhost:8080/api/bill/billByCustomer",
        params: paramall,
      }).then(function (countall) {
        $scope.countall = countall.data.length;
      })
      //count cho xac nhan
      $scope.choxacnhan = [];
      let paramchoxacnhan = {
        idCustomer: IdCustomer,
        status: 0
      }
      $http({
        method: "GET",
        url: "http://localhost:8080/api/bill/billByCustomer",
        params: paramchoxacnhan,
      }).then(function (choxacnhan) {
        $scope.choxacnhan = choxacnhan.data.length;
      })

      //count cho giao hang
      $scope.chogiaohang = [];
      let paramchogiaohang = {
        idCustomer: IdCustomer,
        status: 1
      }
      $http({
        method: "GET",
        url: "http://localhost:8080/api/bill/billByCustomer",
        params: paramchogiaohang,
      }).then(function (chogiaohang) {
        $scope.chogiaohang = chogiaohang.data.length;
      })

      //count dang giao hang
      $scope.danggiaohang = [];
      let paramdanggiaohang = {
        idCustomer: IdCustomer,
        status: 2
      }
      $http({
        method: "GET",
        url: "http://localhost:8080/api/bill/billByCustomer",
        params: paramdanggiaohang,
      }).then(function (danggiaohang) {
        $scope.danggiaohang = danggiaohang.data.length;
      })

      //count da giao hang
      $scope.dagiaohang = [];
      let paramdagiaohang = {
        idCustomer: IdCustomer,
        status: 3
      }
      $http({
        method: "GET",
        url: "http://localhost:8080/api/bill/billByCustomer",
        params: paramdagiaohang,
      }).then(function (dagiaohang) {
        $scope.dagiaohang = dagiaohang.data.length;
      })
      //count da huy
      $scope.dahuy = [];
      let paramdahuy = {
        idCustomer: IdCustomer,
        status: 4
      }
      $http({
        method: "GET",
        url: "http://localhost:8080/api/bill/billByCustomer",
        params: paramdahuy,
      }).then(function (dahuy) {
        $scope.dahuy = dahuy.data.length;
      })
      //count hoan tra
      $scope.hoantra = [];
      let paramhoantra = {
        idCustomer: IdCustomer,
        status: 5
      }
      $http({
        method: "GET",
        url: "http://localhost:8080/api/bill/billByCustomer",
        params: paramhoantra,
      }).then(function (hoantra) {
        $scope.hoantra = hoantra.data.length;
      })

    }

    $scope.countTT();


    $scope.getStatus = function (status) {
      $scope.list = [];
      let paramlist = {
        idCustomer: IdCustomer,
        status: status
      }
      $http({
        method: "GET",
        url: "http://localhost:8080/api/bill/billByCustomer",
        params: paramlist,
      }).then(function (data) {
        $scope.list = data.data;
      })
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
    }



    $scope.huy = function (code) {
      Swal.fire({
        title: "Xác nhận hủy ?",
        showCancelButton: true,
        confirmButtonText: "Hủy",
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          $http.get("http://localhost:8080/api/bill/huy/" + code).then(function (response) {

            $http.get("http://localhost:8080/api/bill/getbycode/" + code).then(function (billl) {

              $http.post('http://localhost:8080/api/billhistory', {
                createBy: null,
                note: 'Hủy đơn',
                status: 4,
                idBill: billl.data.id
              });
            })

            $http.get("http://localhost:8080/api/bill/getallbybill/" + code).then(function (resp) {
              for (let i = 0; i < resp.data.length; i++) {
                for (let j = 0; j < resp.data[i].product.productDetail_size_colors.length; j++) {
                  if (resp.data[i].product.productDetail_size_colors[j].color.id == resp.data[i].idColor && resp.data[i].product.productDetail_size_colors[j].size.id == resp.data[i].idSize) {
                    var param2 = {
                      IdProduct:
                        resp.data[i]
                          .product.id,
                      IdColor:
                        resp.data[i].idColor,
                      IdSize:
                        resp.data[i].idSize,
                      Quantity:
                        parseInt(resp.data[i].product.productDetail_size_colors[j].quantity) +
                        parseInt(
                          resp.data[i].quantity
                        ),
                    };
                    $http({
                      method: "PUT",
                      url: "http://localhost:8080/api/productdetail_color_size/updateQuantity",
                      params: param2,
                    });
                  }
                }

              }
            })

            Swal.fire("Hủy đơn hàng thành công !", "Bạn đã hủy thành công đơn hàng " + code, "success")
            $scope.getStatus(null);
            $scope.countTT();
          })
        }
      })


    }
    $scope.getStatus(null);

    $scope.thanhtoan = function (code, price) {
      let params = {
        totalPrice: price,
        code: code
      }
      $http({
        method: "GET",
        url: "http://localhost:8080/api/vnpay",
        params: params,
        transformResponse: [
          function (data) {
            location.href = data;
          }
        ]
      })
    }

  }
  $scope.myorder();

}