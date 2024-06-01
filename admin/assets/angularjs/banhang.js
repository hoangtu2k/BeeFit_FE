window.BanHangController = function ($scope, $http, $location, $routeParams, $rootScope, AuthService) {
  document.getElementById("header-wrapper").style.display = "none";

  

  // tạo hóa đơn
  $scope.addbill = function () {
    // add bill
    $http
      .post("http://localhost:8080/api/bill/billTaiQuay", {
        status: 10,
        idEmployee: AuthService.getId(),
        typeStatus: 1,
      })
      .then(function (bill) {
        Swal.fire(
          "Tạo hóa đơn " + bill.data.code + " thành công !",
          "",
          "success"
        );
        $http.post("http://localhost:8080/api/billhistory", {
          createBy: $rootScope.user.username,
          note: "Tạo hóa đơn tại quầy",
          status: 0,
          idBill: bill.data.id,
        });
        $scope.getAllBill();
        $scope.choose(bill.data.code, bill.data.id);
      });
  };

  //hủy hóa đơn
  $scope.huyhoadon = function (code) {
    Swal.fire({
      title: "Xác nhận hủy đơn hàng " + code + " ?",
      showCancelButton: true,
      confirmButtonText: "Hủy",
    }).then((result) => {
      if (result.isConfirmed) {
        $http.get("http://localhost:8080/api/bill/huy/" + code)
          .then(function (response) {
            return $http.get("http://localhost:8080/api/bill/getallbybill/" + code);
          })
          .then(function (resp) {
            let updatePromises = [];
            for (let i = 0; i < resp.data.length; i++) {
              // Get số lượng sản phẩm đang có
              let getPram = {
                IdProduct: resp.data[i].product.id,
                IdColor: resp.data[i].idColor,
                IdSize: resp.data[i].idSize,
              };
              updatePromises.push(
                $http({
                  method: "GET",
                  url: "http://localhost:8080/api/productdetail_color_size/getQuantityProductAndColorAndSize",
                  params: getPram,
                }).then(function (soluong) {
                  let param2 = {
                    IdProduct: resp.data[i].product.id,
                    IdColor: resp.data[i].idColor,
                    IdSize: resp.data[i].idSize,
                    Quantity: parseInt(soluong.data) + parseInt(resp.data[i].quantity),
                  };
                  return $http({
                    method: "PUT",
                    url: "http://localhost:8080/api/productdetail_color_size/updateQuantity",
                    params: param2,
                  });
                })
              );
            }
            return Promise.all(updatePromises);
          })
          .then(function () {
            Swal.fire("Hủy đơn hàng thành công !", "Bạn đã hủy thành công đơn hàng " + code, "success");
            $scope.getAllBill();
            $scope.choose(null, null);
          })
          .catch(function (error) {
            console.error("Có lỗi xảy ra:", error);
            Swal.fire("Lỗi", "Có lỗi xảy ra khi hủy đơn hàng. Vui lòng thử lại sau.", "error");
          });
      }
    });
  };

  //get bill chua thanh toan
  $scope.getAllBill = function () {
    $scope.listBill = [];
    $http
      .get("http://localhost:8080/api/bill/getbystatus/10")
      .then(function (resp) {
        $scope.listBill = resp.data;
      });

    // pagation
    $scope.pager = {
      page: 0,
      size: 4,
      get items() {
        var start = this.page * this.size;
        return $scope.listBill.slice(start, start + this.size);
      },
      get count() {
        return Math.ceil((1.0 * $scope.listBill.length) / this.size);
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
  $scope.getAllBill();
  /////////////////////////////////////////////////////////////////////////
  $scope.magiamgia = function () {
    if (document.getElementById("chuongtrinhkhuyenmaiCheck").checked == true) {
      document.getElementById("magiamgia").style.display = "none";
      document.getElementById("chuongtrinhkhuyenmai").style.display = "block";
    }
    else {
      document.getElementById("magiamgia").style.display = "block";
      document.getElementById("chuongtrinhkhuyenmai").style.display = "none";
    }

  }
  $scope.magiamgia();
  ////////////////////////////////////////////////////////////////////////////
  $scope.phiShip = 0;
  $scope.tienThanhToan = 0;
  $scope.giamGia = 0;
  let idBill = null;
  let codeBill = null;
  // chọn hóa đơn
  $scope.choose = function (code, id) {

    if (code == null || id == null) {
      document.getElementById("chitiet").style.display = "none";
      document.getElementById("search-bar").style.display = "none";
      return;
    }
    document.getElementById('hinhThuc1').checked = true;
    document.getElementById('pay1').checked = true;
    document.getElementById('chuongtrinhkhuyenmaiCheck').checked = true;
    document.getElementById("diachichon").checked = true;
    document.getElementById("diachi").style.display = 'none';
    document.getElementById("diachichon1").style.display = 'none';
    document.getElementById('chuongtrinhkhuyenmai').style.display = 'block';
    document.getElementById('magiamgia').style.display = 'none';

    
    



    idBill = id;
    codeBill = code;

    //get all voucher
    $scope.listVoucher = [];
    $http
      .get("https://66593f12de346625136bb615.mockapi.io/voucher")
      .then(function (resp) {
        $scope.listVoucher = resp.data;
      });


    //get tỉnh
    $scope.listTinh = [];
    $http({
      method: "GET",
      url: "https://online-gateway.ghn.vn/shiip/public-api/master-data/province",
      headers: {
        'token': '4d12e88b-1cb1-11ef-af94-de306bc60dfa'
      }
    }).then(function (resp) {
      $scope.listTinh = resp.data.data;

    })
    $scope.getHuyen = function () {
      let tinh = document.getElementById("tinh").value
      if (tinh === '') {
        tinh = 269;
      }
      $scope.listHuyen = [];
      $http({
        method: "GET",
        url: "https://online-gateway.ghn.vn/shiip/public-api/master-data/district?province_id=" + tinh,
        headers: {
          'token': 'f22a8bb9-632c-11ee-b394-8ac29577e80e'
        }
      }).then(function (resp) {
        $scope.listHuyen = resp.data.data;

      })
    }
    $scope.getXa = function () {
      let huyen = document.getElementById("huyen").value
      if (huyen === '') {
        huyen = 2264;
      }
      $scope.listXa = [];
      $http({
        method: "GET",
        url: "https://online-gateway.ghn.vn/shiip/public-api/master-data/ward?district_id=" + huyen,
        headers: {
          'token': 'f22a8bb9-632c-11ee-b394-8ac29577e80e'
        }
      }).then(function (resp) {
        $scope.listXa = resp.data.data;

      })
    }

    $scope.getHuyen();
    $scope.getXa();


    //get
    $http
      .get("http://localhost:8080/api/bill/getallbybill/" + codeBill)
      .then(function (resp) {
        $scope.listItem = resp.data;
        $scope.tongTien = 0.0;
        let TotalGam = 0;
        for (let i = 0; i < $scope.listItem.length; i++) {
          $scope.tongTien +=
            parseFloat($scope.listItem[i].unitPrice) *
            parseFloat($scope.listItem[i].quantity);
        }
        for (let i = 0; i < $scope.listItem.length; i++) {
          TotalGam +=
            $scope.listItem[i].product.weight * $scope.listItem[i].quantity;
        }
        $scope.tienThanhToan =
          $scope.tongTien + $scope.phiShip - $scope.giamGia;
        // lấy thông tin địa chỉ giao hàng
      });

    $scope.listCustomer = [];
    $http.get("http://localhost:8080/api/customer/getall").then(function (resp) {
      $scope.listCustomer = resp.data;
    });

    let url = "http://localhost:8080/api/product/getall";
    let urlcolor = "http://localhost:8080/api/color";
    let urlsize = "http://localhost:8080/api/size";

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

    $scope.listItem = [];
    idBill = id;
    document.getElementById("chitiet").style.display = "block";
    document.getElementById("search-bar").style.display = "block";
    $scope.hoadon = {};
    $http
      .get("http://localhost:8080/api/bill/getbycode/" + code)
      .then(function (resp) {
        $scope.hoadon = resp.data;
        $scope.nhanVien = {};
        $http
          .get("http://localhost:8080/api/employee/" + resp.data.idEmployee)
          .then(function (resp) {
            $scope.nhanVien = resp.data;
          });
      });

    $http
      .get("http://localhost:8080/api/bill/getallbybill/" + code)
      .then(function (resp) {
        $scope.listItem = resp.data;
        $scope.tongTien = 0.0;
        for (let i = 0; i < $scope.listItem.length; i++) {
          $scope.tongTien +=
            parseFloat($scope.listItem[i].unitPrice) *
            parseFloat($scope.listItem[i].quantity);
        }
      });

    $scope.getTotalQuantity = function () {
      var totalQuantity = 0;
      for (var i = 0; i < $scope.listItem.length; i++) {
        totalQuantity += $scope.listItem[i].quantity;
      }
      return totalQuantity;
    };

    $scope.getTotalPrice = function () {
      $scope.tienThanhToan;
    };
  };
  //////////////////////////////////////////////////////////////////////////////

  $scope.isPopupSearch = false;
  $scope.searchQuery = '';
  $scope.filteredList = [];

  // Hàm để tải tất cả dữ liệu cần thiết
  $scope.getAllData = function () {
    let url = "http://localhost:8080/api/product/getall";
    let urlcolor = "http://localhost:8080/api/color";
    let urlsize = "http://localhost:8080/api/size";

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
    $scope.listQuantity = [];
    //load size and color of product
    $http
      .get("http://localhost:8080/api/productdetail_color_size/getall")
      .then(function (resp) {
        $scope.listQuantity = resp.data;
      });
  };

  // Hàm filterProducts để lọc sản phẩm dựa trên tìm kiếm
  $scope.filterProducts = function () {
    let searchQueryLower = $scope.searchQuery.toLowerCase();
    $scope.filteredList = $scope.listQuantity.filter(function (cart) {
      let product = $scope.listPro.find(pro => pro.id === cart.idProduct);
      if (product) {
        return product.name.toLowerCase().includes(searchQueryLower) || product.code.toLowerCase().includes(searchQueryLower);
      }
      return false;
    });
    $scope.isPopupSearch = $scope.filteredList.length > 0;
    $scope.isPopupSearch = !$scope.isPopupSearch;
  };

  // Kiểm tra giá trị của input search và hiển thị hoặc ẩn popup tìm kiếm
  $scope.$watch('searchQuery', function (newValue) {
    if (!newValue || newValue.length === 0) {
      document.getElementById('header-search-sp').style.display = 'none';
      $scope.isPopupSearch = false;
    } else {
      document.getElementById('header-search-sp').style.display = 'block';
      $scope.isPopupSearch = !$scope.isPopupSearch;
    }
  });

  $scope.getAllData();
  // Gọi hàm getAllData khi controller được khởi tạo

  //////////////////////////////////////////////////////////////////////////////


  $scope.isPopupVisible = false;
  $scope.togglePopup = function () {
    $scope.isPopupVisible = !$scope.isPopupVisible;

    $scope.getAllProduct = function () {
      let url = "http://localhost:8080/api/product/getall";
      let urlcolor = "http://localhost:8080/api/color";
      let urlsize = "http://localhost:8080/api/size";

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
      $scope.listQuantity = [];
      //load size and color of product
      $http
        .get("http://localhost:8080/api/productdetail_color_size/getall")
        .then(function (resp) {
          $scope.listQuantity = resp.data;
        });
      // pagation
      $scope.pager1 = {
        page: 0,
        size: 6,
        get items() {
          var start = this.page * this.size;
          return $scope.listQuantity.slice(start, start + this.size);
        },
        get count() {
          return Math.ceil((1.0 * $scope.listQuantity.length) / this.size);
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

    $scope.getAllProduct();
  };
  $scope.getAllByQR = function (id) {
    let url = "http://localhost:8080/api/product/getall";
    let urlcolor = "http://localhost:8080/api/color";
    let urlsize = "http://localhost:8080/api/size";

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

    $scope.listProduct = [];
    $http.get("http://localhost:8080/api/productdetail_color_size/getbyproduct/" + parseInt(id)).then(function (response) {
      $scope.listProduct = response.data;
      $scope.choose(codeBill, idBill);

    });
    // pagation
    $scope.pager1 = {
      page: 0,
      size: 6,
      get items() {
        var start = this.page * this.size;
        return $scope.listProduct.slice(start, start + this.size);
      },
      get count() {
        return Math.ceil((1.0 * $scope.listProduct.length) / this.size);
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
  $scope.isQR1 = false;
  $scope.isSanPhamQR = false;
  $scope.SanPhamQR = function (id) {
    $scope.isSanPhamQR = !$scope.isSanPhamQR;
    document.getElementById('qrsp').style.display = 'none';
    $scope.getAllByQR(id);
  }
  $scope.webcam = function () {
    $scope.isQR1 = !$scope.isQR1;
    if ($scope.isQR1 == false) {
      const video1 = document.getElementById('video');
      const stream1 = video1.srcObject;
      const tracks1 = stream1.getTracks();

      tracks1.forEach(function (track) {
        track.stop();
      });
      video1.srcObject = null;
      document.getElementById('qr').style.display = 'none';
      return;
    }
    document.getElementById('qr').style.display = 'block';
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(function (stream) {
        const video = document.getElementById('video');
        video.srcObject = stream;
        video.play();
      })
      .catch(function (error) {
        console.error('Lỗi truy cập máy ảnh: ', error);
      });

    const canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');
    const video = document.getElementById('video');

    const scan = () => {
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, canvas.width, canvas.height);
      if (code) {
        // Có dữ liệu từ mã QR, tắt model quét QR
        $scope.SanPhamQR(code.data);
        $scope.isQR1 = false;
        document.getElementById('qr').style.display = 'none';
        document.getElementById('qrsp').style.display = 'block';
        const video1 = document.getElementById('video');
        const stream1 = video1.srcObject;
        const tracks1 = stream1.getTracks();

        tracks1.forEach(function (track) {
          track.stop();
        });
        video1.srcObject = null;
        return;
      } else {
        document.getElementById('result').textContent = 'Không tìm thấy mã QR.';
      }
      requestAnimationFrame(scan);
    };
    video.onloadedmetadata = function () {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      scan();
    };
  }
  $scope.timkiem = function () {
    var text = document.getElementById("name").value;
    var idColor = document.getElementById("mausac").value;
    var idSize = document.getElementById("kichthuoc").value;
    let idcolor = (idColor != '') ? idColor : null;
    let idsize = (idSize != '') ? idSize : null;
    let text1 = (text != '' ? text : null)


    var param = {
      keyword: text1,
      idColor: idcolor,
      idSize: idsize

    }
    $http({
      method: "GET",
      url: "http://localhost:8080/api/productdetail_color_size/getallbykeyword",
      params: param
    }).then(function (resp) {
      $scope.listQuantity = resp.data;
      // pagation
      $scope.pager1 = {
        page: 0,
        size: 8,
        get items() {
          var start = this.page * this.size;
          return $scope.listQuantity.slice(start, start + this.size);
        },
        get count() {
          return Math.ceil((1.0 * $scope.listQuantity.length) / this.size);
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
    })

  }
  // thêm giỏ hàng
  $scope.themvaogio = function (id) {
    $http
      .get("http://localhost:8080/api/productdetail_color_size/getbyid/" + id)
      .then(function (resp) {
        $http
          .get("http://localhost:8080/api/product/" + resp.data.idProduct)
          .then(function (pro) {
            if (resp.data.quantity == 0) {
              Swal.fire("Số lượng sản phẩm này đang tạm hết !", "", "error");
            } else {
              Swal.fire({
                title: "Mời nhập số lượng thêm vào giỏ",
                input: "text",
                showCancelButton: true,
              }).then((result) => {

                if (result.value.trim() === "") {
                  Swal.fire("Số lượng không được bỏ trống !", "", "error");
                  return;
                }

                if (result.value) {
                  if (parseInt(result.value) <= 0) {
                    Swal.fire("Số lượng phải lớn hơn 0 !", "", "error");
                    return;
                  }

                  if (parseInt(result.value) > 100) {
                    Swal.fire("Số lượng phải nhỏ hơn 100 !", "", "error");
                    return;
                  }

                  var numberRegex = /^[0-9]+$/;
                  if (!numberRegex.test(result.value)) {
                    Swal.fire("Số lượng phải là số !!", "", "error");
                    return;
                  }

                  //get số lượng sản phẩm đang có
                  var getPram = {
                    IdProduct: resp.data.idProduct,
                    IdColor: resp.data.idColor,
                    IdSize: resp.data.idSize,
                  };

                  $http({
                    method: "GET",
                    url: "http://localhost:8080/api/productdetail_color_size/getQuantityProductAndColorAndSize",
                    params: getPram,
                  }).then(function (soluong) {
                    if (parseInt(soluong.data) < parseInt(result.value)) {
                      Swal.fire(
                        "Số lượng bạn nhập đang lớn hơn số lượng còn hàng !!",
                        "",
                        "error"
                      );
                      return;
                    }

                    $http
                      .get("http://localhost:8080/api/bill/getallbybill/" + codeBill)
                      .then(function (bill) {
                        for (let i = 0; i < bill.data.length; i++) {
                          if (
                            bill.data[i].product.id == resp.data.idProduct &&
                            bill.data[i].idColor == resp.data.idColor &&
                            bill.data[i].idSize == resp.data.idSize
                          ) {
                            // nếu tồn tại rồi thì updatate số lượng
                            $http
                              .put(
                                "http://localhost:8080/api/bill/updateBillDetail/" +
                                bill.data[i].id,
                                {
                                  idBill: idBill,
                                  idProduct: resp.data.idProduct,
                                  idColor: resp.data.idColor,
                                  idSize: resp.data.idSize,
                                  quantity:
                                    parseInt(result.value) +
                                    parseInt(bill.data[i].quantity),
                                  unitPrice: pro.data.price,
                                }
                              )
                              .then(function (billdetail) {
                                //get số lượng sản phẩm đang có
                                var getPram = {
                                  IdProduct: resp.data.idProduct,
                                  IdColor: resp.data.idColor,
                                  IdSize: resp.data.idSize,
                                };
                                $http({
                                  method: "GET",
                                  url: "http://localhost:8080/api/productdetail_color_size/getQuantityProductAndColorAndSize",
                                  params: getPram,
                                }).then(function (soluong) {
                                  //  cập nhật số lượng sản phẩm
                                  var param2 = {
                                    IdProduct: resp.data.idProduct,
                                    IdColor: resp.data.idColor,
                                    IdSize: resp.data.idSize,
                                    Quantity:
                                      parseInt(soluong.data) -
                                      parseInt(result.value),
                                  };
                                  $http({
                                    method: "PUT",
                                    url: "http://localhost:8080/api/productdetail_color_size/updateQuantity",
                                    params: param2,
                                  }).then(function (resp) {
                                    //    Swal.fire("Đã thêm vào giỏ !", "", "success" );

                                    // Gọi lại hàm getAllData để cập nhật lại dữ liệu
                                    $scope.getAllData();

                                    // Xóa trắng input tìm kiếm
                                    $scope.searchQuery = '';
                                    document.getElementById('input__search-bh').value = '';
                                    document.getElementById('header-search-sp').style.display = 'none';

                                    $scope.choose(codeBill, idBill);

                                    if ($scope.isPopupVisible == true) {
                                      $scope.getAllProduct();
                                    } else {
                                      console.log(pro.data.id);
                                      $scope.getAllByQR(pro.data.id);
                                    }
                                  });
                                });
                              });
                            return;
                          }
                        }

                        // nếu chưa tồn tại thì thêm vào giỏ
                        $http
                          .post(
                            "http://localhost:8080/api/bill/addBillDetail",
                            {
                              // add bill detail
                              idBill: idBill,
                              idProduct: resp.data.idProduct,
                              idColor: resp.data.idColor,
                              idSize: resp.data.idSize,
                              quantity: result.value,
                              unitPrice: pro.data.price,
                            }
                          )
                          .then(function (billdetail) {
                            //get số lượng sản phẩm đang có
                            var getPram = {
                              IdProduct: resp.data.idProduct,
                              IdColor: resp.data.idColor,
                              IdSize: resp.data.idSize,
                            };
                            $http({
                              method: "GET",
                              url: "http://localhost:8080/api/productdetail_color_size/getQuantityProductAndColorAndSize",
                              params: getPram,
                            }).then(function (soluong) {
                              //  cập nhật số lượng sản phẩm
                              var param2 = {
                                IdProduct: resp.data.idProduct,
                                IdColor: resp.data.idColor,
                                IdSize: resp.data.idSize,
                                Quantity:
                                  parseInt(soluong.data) -
                                  parseInt(result.value),
                              };
                              $http({
                                method: "PUT",
                                url: "http://localhost:8080/api/productdetail_color_size/updateQuantity",
                                params: param2,
                              }).then(function (resp) {
                                // Swal.fire("Đã thêm vào giỏ !", "", "success");

                                // Gọi lại hàm choose với codeBill và idBill
                                $scope.choose(codeBill, idBill);

                                // Kiểm tra trạng thái của isPopupVisible
                                if ($scope.isPopupVisible) {
                                  // Gọi hàm getAllProduct nếu popup đang hiển thị
                                  $scope.getAllProduct();
                                } else {
                                  // Nếu không, gọi hàm getAllByQR với id sản phẩm
                                  $scope.getAllByQR(pro.data.id);
                                }

                                // Gọi lại hàm getAllData để cập nhật lại dữ liệu
                                $scope.getAllData();

                                // Xóa trắng input tìm kiếm
                                $scope.searchQuery = '';
                                document.getElementById('input__search-bh').value = '';
                                document.getElementById('header-search-sp').style.display = 'none';

                              });
                            });
                          });
                      });
                  });
                }
              });
            }
          });
      });
  };
  $scope.themvaogio1 = function (id) {
    $http.get("http://localhost:8080/api/productdetail_color_size/getbyid/" + id).then(function (resp) {
      $http.get("http://localhost:8080/api/product/" + resp.data.idProduct).then(function (pro) {
        if (resp.data.quantity == 0) {
          Swal.fire("Số lượng sản phẩm này đang tạm hết !", "", "error");
        } else {
          // Số lượng mặc định là 1
          const quantityToAdd = 1;

          var getPram = {
            IdProduct: resp.data.idProduct,
            IdColor: resp.data.idColor,
            IdSize: resp.data.idSize,
          };

          $http({
            method: "GET",
            url: "http://localhost:8080/api/productdetail_color_size/getQuantityProductAndColorAndSize",
            params: getPram,
          }).then(function (soluong) {
            if (parseInt(soluong.data) < quantityToAdd) {
              Swal.fire("Số lượng bạn nhập đang lớn hơn số lượng còn hàng !!", "", "error");
              return;
            }

            $http.get("http://localhost:8080/api/bill/getallbybill/" + codeBill).then(function (bill) {
              for (let i = 0; i < bill.data.length; i++) {
                if (
                  bill.data[i].product.id == resp.data.idProduct &&
                  bill.data[i].idColor == resp.data.idColor &&
                  bill.data[i].idSize == resp.data.idSize
                ) {
                  // nếu tồn tại rồi thì updatate số lượng
                  $http.put("http://localhost:8080/api/bill/updateBillDetail/" + bill.data[i].id, {
                    idBill: idBill,
                    idProduct: resp.data.idProduct,
                    idColor: resp.data.idColor,
                    idSize: resp.data.idSize,
                    quantity: parseInt(quantityToAdd) + parseInt(bill.data[i].quantity),
                    unitPrice: pro.data.price,
                  }).then(function (billdetail) {
                    var param2 = {
                      IdProduct: resp.data.idProduct,
                      IdColor: resp.data.idColor,
                      IdSize: resp.data.idSize,
                      Quantity: parseInt(soluong.data) - parseInt(quantityToAdd),
                    };

                    $http({
                      method: "PUT",
                      url: "http://localhost:8080/api/productdetail_color_size/updateQuantity",
                      params: param2,
                    }).then(function (resp) {
                      $scope.getAllData();
                      $scope.searchQuery = '';
                      document.getElementById('input__search-bh').value = '';
                      document.getElementById('header-search-sp').style.display = 'none';
                      $scope.choose(codeBill, idBill);

                      if ($scope.isPopupVisible) {
                        $scope.getAllProduct();
                      } else {
                        $scope.getAllByQR(pro.data.id);
                      }
                    });
                  });
                  return;
                }
              }

              // nếu chưa tồn tại thì thêm vào giỏ
              $http.post("http://localhost:8080/api/bill/addBillDetail", {
                idBill: idBill,
                idProduct: resp.data.idProduct,
                idColor: resp.data.idColor,
                idSize: resp.data.idSize,
                quantity: quantityToAdd,
                unitPrice: pro.data.price,
              }).then(function (billdetail) {
                var param2 = {
                  IdProduct: resp.data.idProduct,
                  IdColor: resp.data.idColor,
                  IdSize: resp.data.idSize,
                  Quantity: parseInt(soluong.data) - parseInt(quantityToAdd),
                };

                $http({
                  method: "PUT",
                  url: "http://localhost:8080/api/productdetail_color_size/updateQuantity",
                  params: param2,
                }).then(function (resp) {
                  $scope.choose(codeBill, idBill);

                  if ($scope.isPopupVisible) {
                    $scope.getAllProduct();
                  } else {
                    $scope.getAllByQR(pro.data.id);
                  }

                  $scope.getAllData();
                  $scope.searchQuery = '';
                  document.getElementById('input__search-bh').value = '';
                  document.getElementById('header-search-sp').style.display = 'none';
                });
              });
            });
          });
        }
      });
    });
  };

  // giảm số lượng giỏ
  $scope.giam = function (id) {
    if (document.getElementById("quantity" + id).value == 1) {
      $scope.deleteBillDetail(id);
      return;
    }

    $http
      .get("http://localhost:8080/api/bill/getbilldetail/" + id)
      .then(function (resp) {
        $http
          .get("http://localhost:8080/api/product/" + resp.data.product.id)
          .then(function (pro) {
            $http
              .get("http://localhost:8080/api/bill/getallbybill/" + codeBill)
              .then(function (bill) {
                for (let i = 0; i < bill.data.length; i++) {
                  if (
                    bill.data[i].product.id == resp.data.product.id &&
                    bill.data[i].idColor == resp.data.idColor &&
                    bill.data[i].idSize == resp.data.idSize
                  ) {
                    // nếu tồn tại rồi thì updatate số lượng
                    $http
                      .put(
                        "http://localhost:8080/api/bill/updateBillDetail/" +
                        bill.data[i].id,
                        {
                          idBill: idBill,
                          idProduct: resp.data.product.id,
                          idColor: resp.data.idColor,
                          idSize: resp.data.idSize,
                          quantity: parseInt(bill.data[i].quantity) - 1,
                          unitPrice: pro.data.price,
                        }
                      )
                      .then(function (billdetail) {
                        //get số lượng sản phẩm đang có
                        var getPram = {
                          IdProduct: resp.data.product.id,
                          IdColor: resp.data.idColor,
                          IdSize: resp.data.idSize,
                        };
                        $http({
                          method: "GET",
                          url: "http://localhost:8080/api/productdetail_color_size/getQuantityProductAndColorAndSize",
                          params: getPram,
                        }).then(function (soluong) {
                          //  cập nhật số lượng sản phẩm
                          var param2 = {
                            IdProduct: resp.data.product.id,
                            IdColor: resp.data.idColor,
                            IdSize: resp.data.idSize,
                            Quantity: parseInt(soluong.data) + 1,
                          };
                          $http({
                            method: "PUT",
                            url: "http://localhost:8080/api/productdetail_color_size/updateQuantity",
                            params: param2,
                          }).then(function (resp) {
                            $scope.getAllData();
                            // Xóa trắng input tìm kiếm
                            $scope.searchQuery = '';
                            document.getElementById('input__search-bh').value = '';
                            document.getElementById('header-search-sp').style.display = 'none';
                            $scope.choose(codeBill, idBill);
                            $scope.getAllProduct();
                          });
                        });
                      });
                    return;
                  }
                }
              });
          });
      });
  };
  // tăng số lượng giỏ
  $scope.tang = function (id) {
    $http
      .get("http://localhost:8080/api/bill/getbilldetail/" + id)
      .then(function (resp) {
        $http
          .get("http://localhost:8080/api/product/" + resp.data.product.id)
          .then(function (pro) {
            //get số lượng sản phẩm đang có
            var getPram = {
              IdProduct: resp.data.product.id,
              IdColor: resp.data.idColor,
              IdSize: resp.data.idSize,
            };
            $http({
              method: "GET",
              url: "http://localhost:8080/api/productdetail_color_size/getQuantityProductAndColorAndSize",
              params: getPram,
            }).then(function (soluong) {
              if (soluong.data === 0) {
                Swal.fire("Đã đạt số lượng tối đa", "", "error");
                return;
              }
              $http
                .get("http://localhost:8080/api/bill/getallbybill/" + codeBill)
                .then(function (bill) {
                  for (let i = 0; i < bill.data.length; i++) {
                    if (
                      bill.data[i].product.id == resp.data.product.id &&
                      bill.data[i].idColor == resp.data.idColor &&
                      bill.data[i].idSize == resp.data.idSize
                    ) {
                      // nếu tồn tại rồi thì updatate số lượng
                      $http
                        .put(
                          "http://localhost:8080/api/bill/updateBillDetail/" +
                          bill.data[i].id,
                          {
                            idBill: idBill,
                            idProduct: resp.data.product.id,
                            idColor: resp.data.idColor,
                            idSize: resp.data.idSize,
                            quantity: parseInt(bill.data[i].quantity) + 1,
                            unitPrice: pro.data.price,
                          }
                        )
                        .then(function (billdetail) {
                          //get số lượng sản phẩm đang có
                          var getPram = {
                            IdProduct: resp.data.product.id,
                            IdColor: resp.data.idColor,
                            IdSize: resp.data.idSize,
                          };
                          $http({
                            method: "GET",
                            url: "http://localhost:8080/api/productdetail_color_size/getQuantityProductAndColorAndSize",
                            params: getPram,
                          }).then(function (soluong) {
                            //  cập nhật số lượng sản phẩm
                            var param2 = {
                              IdProduct: resp.data.product.id,
                              IdColor: resp.data.idColor,
                              IdSize: resp.data.idSize,
                              Quantity: parseInt(soluong.data) - 1,
                            };
                            $http({
                              method: "PUT",
                              url: "http://localhost:8080/api/productdetail_color_size/updateQuantity",
                              params: param2,
                            }).then(function (resp) {
                              $scope.getAllData();
                              // Xóa trắng input tìm kiếm
                              $scope.searchQuery = '';
                              document.getElementById('input__search-bh').value = '';
                              document.getElementById('header-search-sp').style.display = 'none';
                              $scope.choose(codeBill, idBill);
                              $scope.getAllProduct();
                            });
                          });
                        });
                      return;
                    }
                  }
                });
            });
          });
      });
  };

  $scope.deleteBillDetail = function (id) {
    // Bước 1: Lấy thông tin chi tiết hóa đơn
    $http.get("http://localhost:8080/api/bill/getbilldetail/" + id).then(function (resp) {
      const billDetail = resp.data;

      // Bước 2: Lấy thông tin sản phẩm
      $http.get("http://localhost:8080/api/product/" + billDetail.product.id).then(function (pro) {
        const product = pro.data;

        // Bước 3: Lấy số lượng sản phẩm hiện tại
        const getPram = {
          IdProduct: billDetail.product.id,
          IdColor: billDetail.idColor,
          IdSize: billDetail.idSize,
        };

        $http({
          method: "GET",
          url: "http://localhost:8080/api/productdetail_color_size/getQuantityProductAndColorAndSize",
          params: getPram,
        }).then(function (soluong) {
          const currentQuantity = soluong.data;

          // Bước 4: Cập nhật số lượng sản phẩm
          const param2 = {
            IdProduct: billDetail.product.id,
            IdColor: billDetail.idColor,
            IdSize: billDetail.idSize,
            Quantity: parseInt(currentQuantity) + parseInt(billDetail.quantity),
          };

          $http({
            method: "PUT",
            url: "http://localhost:8080/api/productdetail_color_size/updateQuantity",
            params: param2,
          }).then(function (updateResp) {

            // Bước 5: Xóa chi tiết hóa đơn
            $http.get("http://localhost:8080/api/bill/deleteBillDetail/" + id).then(function (deleteResp) {
              // Swal.fire("Chi tiết hóa đơn đã được xóa!", "", "success");

              $scope.getAllData();
              // Xóa trắng input tìm kiếm
              $scope.searchQuery = '';
              document.getElementById('input__search-bh').value = '';
              document.getElementById('header-search-sp').style.display = 'none';
              // Gọi lại các hàm để cập nhật dữ liệu
              $scope.choose(codeBill, idBill);
              $scope.getAllProduct();


            }, function (error) {
              Swal.fire("Lỗi khi xóa chi tiết hóa đơn", "", "error");
            });
          }, function (error) {
            Swal.fire("Lỗi khi cập nhật số lượng sản phẩm", "", "error");
          });
        }, function (error) {
          Swal.fire("Lỗi khi lấy số lượng sản phẩm", "", "error");
        });
      }, function (error) {
        Swal.fire("Lỗi khi lấy thông tin sản phẩm", "", "error");
      });
    }, function (error) {
      Swal.fire("Lỗi khi lấy thông tin chi tiết hóa đơn", "", "error");
    });
  };
  /////////////////////////////////////////////////////////////////////////////

  $scope.chondiachi = function () {
    var check = document.getElementById("khachhang").value;
    if (check === '0') {
      if (document.getElementById("hinhThuc1").checked === true) {
        document.getElementById("diachi").style.display = 'none';
        document.getElementById("diachichon2").style.display = 'none';
        document.getElementById("diachichon1").style.display = 'none';
        document.getElementById('maGiamGiaKH').style.display = 'none';
        document.getElementById('chuongtrinhkhuyenmai').style.display = 'block';
        document.getElementById('magiamgia').style.display = 'none';
        document.getElementById('chuongtrinhkhuyenmaiCheck').checked = true;

      }
      else {
        document.getElementById("diachi").style.display = 'none';
        document.getElementById("diachichon2").style.display = 'block';
        document.getElementById("diachichon1").style.display = 'none';
        document.getElementById("diachichon").checked = true;
        document.getElementById('maGiamGiaKH').style.display = 'none';
        document.getElementById('chuongtrinhkhuyenmaiCheck').checked = true;
        document.getElementById('chuongtrinhkhuyenmai').style.display = 'block';
        document.getElementById('magiamgia').style.display = 'none';

      }

    } else {

      if (document.getElementById("hinhThuc1").checked === true) {
        document.getElementById('maGiamGiaKH').style.display = 'block';

        $scope.phiShip = 0;
      }
      else {
        document.getElementById("diachi").style.display = 'block';
        document.getElementById('maGiamGiaKH').style.display = 'block';
      }

    }
  }
  $scope.chondiachi1 = function () {
    var check = document.getElementById("diachichon");
    if (check.checked === true) {
      document.getElementById("nguoimua").style.display = 'block';
      document.getElementById("diachichon1").style.display = 'none';
      document.getElementById("diachichon2").style.display = 'block';
      //get
      $http.get("http://localhost:8080/api/bill/getallbybill/" + codeBill).then(function (resp) {
        $scope.listItem = resp.data;
        $scope.tongTien = 0.0;
        let TotalGam = 0;
        for (let i = 0; i < $scope.listItem.length; i++) {
          $scope.tongTien += parseFloat($scope.listItem[i].unitPrice) * parseFloat($scope.listItem[i].quantity);
        }
        for (let i = 0; i < $scope.listItem.length; i++) {
          TotalGam +=
            $scope.listItem[i].product.weight * $scope.listItem[i].quantity;
        }
        // lấy thông tin địa chỉ giao hàng

        var params = {
          service_type_id: 2,
          insurance_value: parseInt($scope.tongTien),
          coupon: null,
          from_district_id: 1482,
          to_district_id: document.getElementById("huyen").value,
          to_ward_code: document.getElementById("xa").value,
          height: 0,
          length: 0,
          weight: parseInt(TotalGam),
          width: 0,
        };
        // get phí ship từ GHN
        $http({
          method: "GET",
          url: "https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee",
          params: params,
          headers: {
            "Content-Type": undefined,
            token: "f22a8bb9-632c-11ee-b394-8ac29577e80e",
            shop_id: 4603004,
          },
        }).then(function (resp) {
          if (document.getElementById("hinhThuc1").checked === true) {
            $scope.tienThanhToan = $scope.tongTien - $scope.giamGia;
            $scope.phiShip = 0;
          } else {
            $scope.tienThanhToan = $scope.tongTien + resp.data.data.total - $scope.giamGia;
            $scope.phiShip = resp.data.data.total;
          }
          // $scope.phiShip = resp.data.data.total;
          // $scope.tienThanhToan = $scope.tongTien + resp.data.data.total - $scope.giamGia;
        });

      })

    }
    var check1 = document.getElementById("diachicosan");
    if (check1.checked === true) {
      document.getElementById("nguoimua").style.display = 'none';
      document.getElementById("diachichon1").style.display = 'block';
      document.getElementById("diachichon2").style.display = 'none';
      //get địa chỉ by khách hàng
      $scope.listAddress = [];
      if (document.getElementById("khachhang").value != '0') {
        $http.get("http://localhost:8080/api/address/" + document.getElementById("khachhang").value).then(function (resp) {
          $scope.listAddress = resp.data;
          //get
          $http.get("http://localhost:8080/api/bill/getallbybill/" + codeBill).then(function (resp) {
            $scope.listItem = resp.data;
            $scope.tongTien = 0.0;
            let TotalGam = 0;
            for (let i = 0; i < $scope.listItem.length; i++) {
              $scope.tongTien += parseFloat($scope.listItem[i].unitPrice) * parseFloat($scope.listItem[i].quantity);
            }
            for (let i = 0; i < $scope.listItem.length; i++) {
              TotalGam +=
                $scope.listItem[i].product.weight * $scope.listItem[i].quantity;
            }
            // lấy thông tin địa chỉ giao hàng
            $http
              .get("http://localhost:8080/api/address/get/" + $scope.listAddress[0].id)
              .then(function (resp) {
                var params = {
                  service_type_id: 2,
                  insurance_value: parseInt($scope.tongTien),
                  coupon: null,
                  from_district_id: 1482,
                  to_district_id: resp.data.districtId,
                  to_ward_code: resp.data.wardId,
                  height: 0,
                  length: 0,
                  weight: parseInt(TotalGam),
                  width: 0,
                };
                // get phí ship từ GHN
                $http({
                  method: "GET",
                  url: "https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee",
                  params: params,
                  headers: {
                    "Content-Type": undefined,
                    token: "f22a8bb9-632c-11ee-b394-8ac29577e80e",
                    shop_id: 4603004,
                  },
                }).then(function (resp) {
                  // $scope.phiShip = resp.data.data.total;
                  if (document.getElementById("hinhThuc1").checked === true) {
                    $scope.tienThanhToan = $scope.tongTien - $scope.giamGia;
                    $scope.phiShip = 0;
                  } else {
                    $scope.tienThanhToan = $scope.tongTien + resp.data.data.total - $scope.giamGia;
                    $scope.phiShip = resp.data.data.total;
                  }

                });
              });
          })

        })
      }

    }
  }
  //thay đổi địa chỉ giao hàng
  $scope.doidiachi = function () {
    let idAddress = document.getElementById("diachiCustomer").value;

    //get
    $http.get("http://localhost:8080/api/bill/getallbybill/" + codeBill).then(function (resp) {
      $scope.listItem = resp.data;
      $scope.tongTien = 0.0;
      let TotalGam = 0;
      for (let i = 0; i < $scope.listItem.length; i++) {
        $scope.tongTien += parseFloat($scope.listItem[i].unitPrice) * parseFloat($scope.listItem[i].quantity);
      }
      for (let i = 0; i < $scope.listItem.length; i++) {
        TotalGam +=
          $scope.listItem[i].product.weight * $scope.listItem[i].quantity;
      }
      // lấy thông tin địa chỉ giao hàng
      $http
        .get("http://localhost:8080/api/address/get/" + idAddress)
        .then(function (resp) {
          var params = {
            service_type_id: 2,
            insurance_value: parseInt($scope.tongTien),
            coupon: null,
            from_district_id: 1482,
            to_district_id: resp.data.districtId,
            to_ward_code: resp.data.wardId,
            height: 0,
            length: 0,
            weight: parseInt(TotalGam),
            width: 0,
          };
          // get phí ship từ GHN
          $http({
            method: "GET",
            url: "https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee",
            params: params,
            headers: {
              "Content-Type": undefined,
              token: "f22a8bb9-632c-11ee-b394-8ac29577e80e",
              shop_id: 4603004,
            },
          }).then(function (resp) {
            // $scope.phiShip = resp.data.data.total;
            if (document.getElementById("hinhThuc1").checked === true) {
              $scope.tienThanhToan = $scope.tongTien - $scope.giamGia;
            } else {
              $scope.tienThanhToan = $scope.tongTien + resp.data.data.total - $scope.giamGia;
            }
          });
        });
    })
  };
  //tính phí ship địa chỉ custom
  $scope.tinhPhiShip = function () {
    //get
    $http.get("http://localhost:8080/api/bill/getallbybill/" + codeBill).then(function (resp) {
      $scope.listItem = resp.data;
      $scope.tongTien = 0.0;
      let TotalGam = 0;
      for (let i = 0; i < $scope.listItem.length; i++) {
        $scope.tongTien += parseFloat($scope.listItem[i].unitPrice) * parseFloat($scope.listItem[i].quantity);
      }
      for (let i = 0; i < $scope.listItem.length; i++) {
        TotalGam +=
          $scope.listItem[i].product.weight * $scope.listItem[i].quantity;
      }
      // lấy thông tin địa chỉ giao hàng

      var params = {
        service_type_id: 2,
        insurance_value: parseInt($scope.tongTien),
        coupon: null,
        from_district_id: 1482,
        to_district_id: document.getElementById("huyen").value,
        to_ward_code: document.getElementById("xa").value,
        height: 0,
        length: 0,
        weight: parseInt(TotalGam),
        width: 0,
      };
      // get phí ship từ GHN
      $http({
        method: "GET",
        url: "https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee",
        params: params,
        headers: {
          "Content-Type": undefined,
          token: "f22a8bb9-632c-11ee-b394-8ac29577e80e",
          shop_id: 4603004,
        },
      }).then(function (resp) {
        if (document.getElementById("hinhThuc1").checked === true) {
          $scope.tienThanhToan = $scope.tongTien - $scope.giamGia;
          $scope.phiShip = 0;
        } else {
          $scope.tienThanhToan = $scope.tongTien + resp.data.data.total - $scope.giamGia;
          $scope.phiShip = resp.data.data.total;
        }
      });

    })
  }
  $scope.hinhThucMuaHang = function () {
    if (document.getElementById("hinhThuc1").checked === true) {
      document.getElementById("muaonline").style.display = "none";
      document.getElementById("muaonline1").style.display = "none";
      document.getElementById('diachichon2').style.display = "none";
      document.getElementById('diachi').style.display = "none";
      document.getElementById('diachichon1').style.display = "none";
      $scope.tienThanhToan = $scope.tongTien - $scope.giamGia;
    }
    else {
      document.getElementById("muaonline").style.display = "block";
      document.getElementById("muaonline1").style.display = "block";
      document.getElementById('diachichon2').style.display = "block";

      $http.get("http://localhost:8080/api/bill/getallbybill/" + codeBill).then(function (resp) {
        $scope.listItem = resp.data;
        $scope.tongTien = 0.0;
        let TotalGam = 0;
        for (let i = 0; i < $scope.listItem.length; i++) {
          $scope.tongTien += parseFloat($scope.listItem[i].unitPrice) * parseFloat($scope.listItem[i].quantity);
        }
        for (let i = 0; i < $scope.listItem.length; i++) {
          TotalGam +=
            $scope.listItem[i].product.weight * $scope.listItem[i].quantity;
        }
        $scope.tienThanhToan = $scope.tongTien - $scope.giamGia;
        // lấy thông tin địa chỉ giao hàng

        var params = {
          service_type_id: 2,
          insurance_value: parseInt($scope.tongTien),
          coupon: null,
          from_district_id: 1482,
          to_district_id: document.getElementById('huyen').value,
          to_ward_code: document.getElementById('huyen').xa,
          height: 0,
          length: 0,
          weight: parseInt(TotalGam),
          width: 0,
        };
        // get phí ship từ GHN
        $http({
          method: "GET",
          url: "https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee",
          params: params,
          headers: {
            "Content-Type": undefined,
            token: "f22a8bb9-632c-11ee-b394-8ac29577e80e",
            shop_id: 4603004,
          },
        }).then(function (resp) {
          if (document.getElementById("hinhThuc1").checked === true) {
            $scope.tienThanhToan = $scope.tongTien - $scope.giamGia;
            $scope.phiShip = 0;
          } else {
            $scope.tienThanhToan = $scope.tongTien + resp.data.data.total - $scope.giamGia;
            $scope.phiShip = resp.data.data.total;
          }

        });

      })

    }

  }

  /////////////////////////////////////////////////////////////////////////////////
  $scope.listCheck = [];
  $scope.listCheck1 = [];
  $scope.voucherGiamGia = 0;
  $scope.couponGiamGia = 0;
  $scope.phiShip = 0;
  let checkk = 0;
  let idCoupon = null;
  $scope.apCoupon = function () {
    let code = document.getElementById('code-coupon').value;

    //check coupon
    $http.get('http://localhost:8080/api/getcoupon/' + document.getElementById("khachhang").value).then(function (resp) {
      $scope.listCoupon = resp.data
      for (let i = 0; i < $scope.listCoupon.length; i++) {
        if (code === $scope.listCoupon[i].code) {

          if ($scope.listCheck1.length > 0) {
            Swal.fire('Bạn chỉ được áp dụng 1 phiếu giảm giá !', "", "error");
            return;
          }

          $scope.couponName = $scope.listCoupon[i].name;
          $scope.couponType = $scope.listCoupon[i].isType;
          $scope.discountCoupon = $scope.listCoupon[i].discount + '%';
          $scope.cashCoupon = $scope.listCoupon[i].cash.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
          if ($scope.listCoupon[i].isType === 0) {

            if ($scope.listCoupon[i].cash > $scope.tongTien) {
              $scope.giamGia += $scope.tongTien;
              $scope.couponGiamGia = $scope.tongTien;

            }
            else {
              $scope.giamGia += $scope.listCoupon[i].cash
              $scope.couponGiamGia = $scope.listCoupon[i].cash;
            }

          }
          else {
            $scope.giamGia += ($scope.tongTien * ($scope.listCoupon[i].discount * 0.01));
            $scope.couponGiamGia = ($scope.tongTien * ($scope.listCoupon[i].discount * 0.01));
          }

          checkCode1 = {
            code: code
          }
          checkk++;
          $scope.listCheck1.push(checkCode1);
          $scope.checkCoupon = true;
          idCoupon = $scope.listCoupon[i].id;
          Swal.fire("Áp mã thành công !", "", "success");
          $scope.hinhThucMuaHang();
          $scope.tinhPhiShip();
          document.getElementById('code-coupon').value = '';
          $scope.tienThanhToan = $scope.tongTien + $scope.phiShip - ($scope.couponGiamGia + $scope.voucherGiamGia);

        }

      }
      if ($scope.tongTien < $scope.giamGia) {
        Swal.fire('Số tiền giảm đã ở mức tối đa', '', 'error');
        $scope.checkCoupon = false;
        $scope.listCheck1 = [];
        $scope.giamGia = $scope.voucherGiamGia;
        $scope.couponGiamGia = 0;
        $scope.tienThanhToan = TotalPrice + $scope.phiShip - ($scope.couponGiamGia + $scope.voucherGiamGia);
      }

    })

    if (checkk === 0) {
      Swal.fire('Mã không tồn tại !', "", "error");
      // document.getElementById('voucher').style.display = 'none';
      return;
    }

  }
  let idVoucher = null;
  $scope.apCTKM = function () {
    $scope.phiShip = 0;
    $scope.giamGia = $scope.giamGia - $scope.voucherGiamGia;
    $scope.voucherGiamGia = 0;
    let code = document.getElementById('ctkm').value;
    $http.get('http://localhost:8080/api/getvoucher').then(function (resp) {
      $scope.listVoucher = resp.data
      for (let i = 0; i < $scope.listVoucher.length; i++) {
        if (code === $scope.listVoucher[i].code) {
          $scope.voucherName = $scope.listVoucher[i].name;
          $scope.voucherType = $scope.listVoucher[i].typeVoucher;
          $scope.voucherIs = $scope.listVoucher[i].isVoucher;
          $scope.discountVoucher = $scope.listVoucher[i].discount + '%';
          //  $scope.cashVoucher = $scope.listVoucher[i].cash.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
          if ($scope.listVoucher[i].isVoucher === false) {
            if ($scope.listVoucher[i].typeVoucher === false) {

              if ($scope.listVoucher[i].cash > $scope.tongTien) {
                $scope.giamGia += $scope.tongTien;
                $scope.voucherGiamGia += $scope.tongTien;

              }
              else {
                $scope.giamGia += $scope.listVoucher[i].cash;
                $scope.voucherGiamGia += $scope.listVoucher[i].cash;
              }

            }
            else {
              $scope.giamGia += ($scope.tongTien * ($scope.listVoucher[i].discount * 0.01));
              $scope.voucherGiamGia += ($scope.tongTien * ($scope.listVoucher[i].discount * 0.01));
            }
            $scope.tienThanhToan = $scope.tongTien + $scope.phiShip - ($scope.couponGiamGia + $scope.voucherGiamGia);
            checkCode = {
              code: code
            }






            $scope.checkVoucher = true;
            idVoucher = $scope.listVoucher[i].id;
            Swal.fire("Áp mã thành công !", "", "success");
            $scope.hinhThucMuaHang();
            $scope.tinhPhiShip();
            if ($scope.tongTien < $scope.giamGia) {
              Swal.fire('Số tiền giảm đã ở mức tối đa', '', 'error');
              $scope.checkVoucher = true;
              $scope.listCheck = [];
              $scope.giamGia = $scope.couponGiamGia;
              $scope.voucherGiamGia = 0;
              $scope.tienThanhToan = $scope.tongTien + $scope.phiShip - ($scope.couponGiamGia + $scope.voucherGiamGia);
            }
          }

          else {

            $scope.listSPVoucher = [];
            $http.get("http://localhost:8080/api/bill/getallbybill/" + codeBill).then(function (cart) {

              for (let j = 0; j < cart.data.length; j++) {
                $http.get("http://localhost:8080/api/productvoucher/getbyproduct/" + cart.data[j].product.id).then(function (resp) {


                  if (resp.data.length > 0) {
                    let Price = cart.data[j].quantity * cart.data[j].unitPrice;

                    for (let i = 0; i < resp.data.length; i++) {


                      if (resp.data[i].voucher.code == code) {

                        $scope.listSPVoucher.push(cart.data[j]);


                        if (resp.data[i].voucher.typeVoucher === false) {

                          if (resp.data[i].voucher.cash > Price) {

                            $scope.giamGia += Price;
                            $scope.voucherGiamGia += Price;

                          }
                          else {
                            $scope.giamGia += resp.data[i].voucher.cash;
                            $scope.voucherGiamGia += resp.data[i].voucher.cash;
                          }

                        }
                        else {
                          $scope.giamGia += (Price * (resp.data[i].voucher.discount * 0.01));
                          $scope.voucherGiamGia += (Price * (resp.data[i].voucher.discount * 0.01));
                        }

                      }


                    }


                  }


                  checkCode = {
                    code: code
                  }

                  if ($scope.listSPVoucher.length === 0) {
                    $scope.tienThanhToan = $scope.tongTien + $scope.phiShip - ($scope.couponGiamGia + 0);

                    Swal.fire("Rất tiếc voucher này không áp dụng cho sản phẩm nào trong giỏ hàng của bạn !", "", "error");
                  }
                  else {
                    $scope.tienThanhToan = $scope.tongTien + $scope.phiShip - ($scope.couponGiamGia + $scope.voucherGiamGia);
                    idVoucher = $scope.listVoucher[i].id;
                    $scope.checkVoucher = true;
                    Swal.fire("Áp mã thành công !", "", "success");
                    $scope.hinhThucMuaHang();
                    $scope.tinhPhiShip();
                  }
                  if ($scope.tongTien < $scope.giamGia) {
                    Swal.fire('Số tiền giảm đã ở mức tối đa', '', 'error');
                    $scope.checkVoucher = false;

                    $scope.giamGia = $scope.couponGiamGia;
                    $scope.voucherGiamGia = 0;
                    $scope.tienThanhToan = $scope.tongTien + $scope.phiShip - ($scope.couponGiamGia + $scope.voucherGiamGia);
                  }

                })




              }
            })






          }













        }


      }




    })

  }
  $scope.removeVoucher = function () {
    $scope.voucherGiamGia = 0;
    $scope.listCheck = [];
    $scope.giamGia = 0;
    $scope.voucherType = false;
    idVoucher = null;

    $scope.checkVoucher = false;
    $scope.giamGia = $scope.couponGiamGia - $scope.giamGia;
    $scope.tienThanhToan = $scope.tongTien + $scope.phiShip - $scope.couponGiamGia + $scope.voucherGiamGia;


  }
  $scope.removeCoupon = function () {
    $scope.couponGiamGia = 0;
    $scope.listCheck1 = [];
    $scope.giamGia = 0;
    idCoupon = null;
    $scope.checkCoupon = false;
    $scope.giamGia = $scope.voucherGiamGia - $scope.giamGia;
    $scope.tienThanhToan = $scope.tongTien + $scope.phiShip - $scope.voucherGiamGia + $scope.couponGiamGia;

  }

  //check trạng thái thanh toán online khi trả về
  // dat hang
  $scope.buy = function (code) {
    if ($scope.listItem.length === 0) {
      Swal.fire('Giỏ hàng của bạn đang rỗng !', '', 'error');
      return;
    }
    if (document.getElementById('diachicuthe').style.display == 'block' && document.getElementById('diachicuthe').value.trim() === '' && document.getElementById("hinhThuc2").checked === true) {
      Swal.fire('Vui lòng nhập địa chỉ !', '', 'error');
      return;
    }
    if (document.getElementById('nguoimua').style.display === 'block' && document.getElementById('tennguoimua').value.trim() === '' && document.getElementById("hinhThuc2").checked === true) {
      Swal.fire('Vui lòng nhập tên người mua !', '', 'error');
      return;
    }
    let regex = /^\d{10}$/;
    if (document.getElementById('nguoimua').style.display === 'block' && document.getElementById('sodienthoai').value.trim() === '' && document.getElementById("hinhThuc2").checked === true) {
      Swal.fire('Vui lòng nhập số điện thoại !', '', 'error');
      return;
    }
    if (document.getElementById('nguoimua').style.display === 'block' && !regex.test(document.getElementById('sodienthoai').value.trim()) && document.getElementById("hinhThuc2").checked === true) {
      Swal.fire('Số điện thoại phải là số và có 10 chữ số !', '', 'error');
      return;
    }
    if ($scope.tienThanhToan === 0 && document.getElementById("pay2").checked === true) {
      Swal.fire('Tiền thanh toán 0đ nên bạn không được phép thanh toán online !', '', 'error');
      return;
    }
    let tennguoimua = document.getElementById('tennguoimua').value;
    let sodienthoai = document.getElementById('sodienthoai').value;
    let ghichu = document.getElementById('ghichu').value;
    let diachicuthe = document.getElementById('diachicuthe').value;
    let cityId = document.getElementById('tinh').value;
    let districtId = document.getElementById('huyen').value;
    let wardId = document.getElementById('xa').value;
    let idCustomer = document.getElementById('khachhang').value == '0' ? 0 : document.getElementById('khachhang').value;
    // Get the select element by its id
    const selectElement = document.getElementById('tinh');

    // Get the selected option's text content (ProvinceName)
    const cityName = selectElement.options[selectElement.selectedIndex].textContent;
    // Get the select element by its id
    const selectElement1 = document.getElementById('huyen');

    // Get the selected option's text content (ProvinceName)
    const districtName = selectElement1.options[selectElement1.selectedIndex].textContent;
    // Get the select element by its id
    const selectElement2 = document.getElementById('xa');

    // Get the selected option's text content (ProvinceName)
    const wardName = selectElement2.options[selectElement2.selectedIndex].textContent;

    Swal.fire({
      title: "Xác nhận thanh toán đơn hàng " + codeBill + " ?",
      showCancelButton: true,
      confirmButtonText: "Thanh toán",
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        $scope.isLoading = true;
        //nếu chọn thanh toán tại tiền mặt
        if (document.getElementById("pay1").checked === true) {
          //mua tại quầy thanh toán tiền mặt
          if (document.getElementById("hinhThuc1").checked === true) {
            //khách lẻ
            if (document.getElementById('khachhang').value === '0') {

              $http.put('http://localhost:8080/api/bill/updateBillTaiQuay/' + codeBill, {
                totalPrice: $scope.tongTien,
                shipPrice: 0,
                totalPriceLast: $scope.giamGia,
                note: ghichu,
                payType: 0,
                payStatus: 1,
                idVoucher: idVoucher == null ? 0 : idVoucher,
                idCoupon: idCoupon,
                idAddress: 0,
                idCustomer: idCustomer,
                paymentDate: new Date(),
                delyveryDate: new Date(),
                status: 3,
                typeStatus: 1
              }).then(function (resp) {
                $http.post('http://localhost:8080/api/billhistory', {
                  createBy: $rootScope.user.username,
                  note: 'Đã giao hàng tại quầy',
                  status: 3,
                  idBill: resp.data.id
                });
                $scope.exportBill();
                return;
              })
            }
            //khách hàng đã có
            else {
              $http.put('http://localhost:8080/api/bill/updateBillTaiQuay/' + codeBill, {
                totalPrice: $scope.tongTien,
                shipPrice: 0,
                totalPriceLast: $scope.giamGia,
                note: ghichu,
                payType: 0,
                payStatus: 1,
                idVoucher: idVoucher == null ? 0 : idVoucher,
                idCoupon: idCoupon,
                idAddress: 0,
                idCustomer: idCustomer,
                paymentDate: new Date(),
                delyveryDate: new Date(),
                status: 3,
                typeStatus: 1
              }).then(function (resp) {
                $http.post('http://localhost:8080/api/billhistory', {
                  createBy: $rootScope.user.username,
                  note: 'Đã giao hàng tại quầy',
                  status: 3,
                  idBill: resp.data.id
                });
                $scope.exportBill();
                return;
              })
            }
          }
          //mua online thanh toán tiền mặt
          else {
            //khách lẻ
            if (document.getElementById('khachhang').value === '0') {
              $http.post('http://localhost:8080/api/address', {
                fullname: tennguoimua,
                phone: sodienthoai,
                address: diachicuthe,
                cityId: cityId,
                districtId: districtId,
                wardId: wardId,
                cityName: cityName,
                districtName: districtName,
                wardName: wardName
              }).then(function (adds) {
                $http.put('http://localhost:8080/api/bill/updateBillTaiQuay/' + codeBill, {
                  totalPrice: $scope.tongTien,
                  shipPrice: $scope.phiShip,
                  totalPriceLast: $scope.giamGia,
                  note: ghichu,
                  payType: 0,
                  payStatus: 0,
                  idCustomer: idCustomer,
                  idAddress: adds.data.id,
                  idVoucher: idVoucher == null ? 0 : idVoucher,
                  idCoupon: idCoupon,
                  status: 1,
                  typeStatus: 0
                }).then(function (resp) {
                  $http.post('http://localhost:8080/api/billhistory', {
                    createBy: $rootScope.user.username,
                    note: 'Đã xác nhận tại quầy',
                    status: 1,
                    idBill: resp.data.id
                  });
                  $scope.exportBill();
                  return;
                })
              })
            }
            //khách hàng đã có
            else {
              //chọn địa chỉ
              if (document.getElementById('diachichon'.checked === true)) {
                $http.post('http://localhost:8080/api/address', {
                  fullname: tennguoimua,
                  phone: sodienthoai,
                  address: diachicuthe,
                  cityId: cityId,
                  districtId: districtId,
                  wardId: wardId,
                  cityName: cityName,
                  districtName: districtName,
                  wardName: wardName
                }).then(function (adds) {
                  $http.put('http://localhost:8080/api/bill/updateBillTaiQuay/' + codeBill, {
                    totalPrice: $scope.tongTien,
                    shipPrice: $scope.phiShip,
                    totalPriceLast: $scope.giamGia,
                    note: ghichu,
                    payType: 0,
                    idCustomer: idCustomer,
                    payStatus: 0,
                    idAddress: adds.data.id,
                    idVoucher: idVoucher == null ? 0 : idVoucher,
                    idCoupon: idCoupon,
                    status: 1,
                    typeStatus: 0
                  }).then(function (resp) {
                    $http.post('http://localhost:8080/api/billhistory', {
                      createBy: $rootScope.user.username,
                      note: 'Đã xác nhận tại quầy',
                      status: 1,
                      idBill: resp.data.id
                    });
                    $scope.exportBill();
                    return;
                  })
                })
              }
              // địa chỉ có sẵn
              else {
                let idAddressCoSan = document.getElementById('diachiCustomer').value;

                $http.put('http://localhost:8080/api/bill/updateBillTaiQuay/' + codeBill, {
                  totalPrice: $scope.tongTien,
                  shipPrice: $scope.phiShip,
                  totalPriceLast: $scope.giamGia,
                  note: ghichu,
                  payType: 0,
                  idCustomer: idCustomer,
                  payStatus: 0,
                  idAddress: idAddressCoSan,
                  idVoucher: idVoucher == null ? 0 : idVoucher,
                  idCoupon: idCoupon,
                  status: 1,
                  typeStatus: 0
                }).then(function (resp) {
                  $http.post('http://localhost:8080/api/billhistory', {
                    createBy: $rootScope.user.username,
                    note: 'Đã xác nhận tại quầy',
                    status: 1,
                    idBill: resp.data.id
                  });
                  $scope.exportBill();
                  return;
                })
              }
            }
          }
        }


        else if (document.getElementById("pay2").checked === true) {
          //thanh toán qua vnpay
          //mua tại quầy thanh toán online
          if (document.getElementById("hinhThuc1").checked === true) {

            Swal.fire("Đang phát triển thanh toán qua VNPay vui lòng thử lại sau ...", "", "warning");
            return;

            // //khách lẻ
            // if (document.getElementById('khachhang').value === '0') {

            // }
            // //khách hàng đã có
            // else {

            // }
          }
          //mua online thanh toán online
          else {

            Swal.fire("Đang phát triển thanh toán qua VNPay vui lòng thử lại sau ...", "", "warning");
            return;

            // //khách lẻ
            // if (document.getElementById('khachhang').value === '0') {

            // }
            // //khách hàng đã có
            // else {

            // }
          }
        }

        else {
          Swal.fire("Có lỗi xảy ra !", "", "error");
        }
      }
    });
  };
  if ($location.search().vnp_TransactionStatus === "00") {

    $http.put('http://localhost:8080/api/bill/updateStatus1/' + $location.search().vnp_OrderInfo, {
      payStatus: 1,

    }).then(function (response) {

      Swal.fire('Thanh toán thành công', '', 'success');
      let urlcolor = "http://localhost:8080/api/color";
      let urlsize = "http://localhost:8080/api/size";
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

      $scope.billexport = {};
      $scope.addressexport = {};
      $scope.listItemExport = [];
      $http.get('http://localhost:8080/api/bill/getbycode/' + $location.search().vnp_OrderInfo).then(function (billexport) {
        $scope.billexport = billexport.data;
        $scope.cus = null;
        $scope.thoigian = new Date();
        if ($scope.billexport.idCustomer != "") {
          $http.get("http://localhost:8080/api/customer/" + $scope.billexport.idCustomer).then(function (cus) {
            $scope.cus = cus.data;
          })
        }

        $http.get('http://localhost:8080/api/address/get/' + billexport.data.idAddress).then(function (add) {
          $scope.addressexport = add.data;


        })

      })
      $http.get("http://localhost:8080/api/bill/getallbybill/" + $location.search().vnp_OrderInfo).then(function (resp) {
        $scope.listItemExport = resp.data;
      })

      setTimeout(() => {
        Swal.fire({
          title: 'Bạn có muốn in hóa đơn cho đơn hàng ' + $location.search().vnp_OrderInfo + ' ?',
          showCancelButton: true,
          confirmButtonText: 'In',
        }).then((result) => {
          if (result.isConfirmed) {
            var element = document.getElementById('exportbill');
            //custom file name
            html2pdf().set({ filename: $location.search().vnp_OrderInfo + '.pdf' }).from(element).save();
            Swal.fire('Đã xuất hóa đơn', '', 'success');
            setTimeout(() => {
              location.href = '#/sell/view'
            }, 2000);
          }
          else {
            location.href = '#/sell/view'
          }
        })
      }, 2000);

    })

  }
  if ($location.search().vnp_TransactionStatus === "02") {
    $http.delete("http://localhost:8080/api/billhistory/deletebillhistory/" + $location.search().vnp_OrderInfo);
    $http.put('http://localhost:8080/api/bill/updateStatus/' + $location.search().vnp_OrderInfo, {
      payStatus: 0,
      paymentDate: null,
      delyveryDate: null,
      status: 10

    });
    Swal.fire('Đơn hàng ' + $location.search().vnp_OrderInfo + ' chưa được thanh toán !', '', 'error');
    setTimeout(() => {
      location.href = '#/sell/view';
    }, 2000);
  }
  //export bill
  $scope.exportBill = function () {
    Swal.fire('Thanh toán thành công', '', 'success');
    $scope.isLoading = false;
    $scope.billexport = {};
    $scope.addressexport = {};
    $scope.listItemExport = [];
    $http.get('http://localhost:8080/api/bill/getbycode/' + codeBill).then(function (billexport) {
      $scope.billexport = billexport.data;
      $scope.cus = null;
      $scope.thoigian = new Date();
      if ($scope.billexport.idCustomer != "") {
        $http.get("http://localhost:8080/api/customer/" + $scope.billexport.idCustomer).then(function (cus) {
          $scope.cus = cus.data;
        })
      }
      $http.get('http://localhost:8080/api/address/get/' + billexport.data.idAddress).then(function (add) {
        $scope.addressexport = add.data;
      })

    })
    $http.get("http://localhost:8080/api/bill/getallbybill/" + codeBill).then(function (resp) {
      $scope.listItemExport = resp.data;
    })
    setTimeout(() => {


      Swal.fire({
        title: 'Bạn có muốn in hóa đơn cho đơn hàng ' + codeBill + ' ?',
        showCancelButton: true,
        confirmButtonText: 'In',
      }).then((result) => {

        if (result.isConfirmed) {

          var element = document.getElementById('exportbill');

          //custom file name
          html2pdf().set({ filename: codeBill + '.pdf' }).from(element).save();
          Swal.fire('Đã xuất hóa đơn', '', 'success');
          setTimeout(() => {
            location.reload();
          }, 2000);
        }
        else {
          location.reload();
        }
      })
    }, 2000);
  }
  $scope.$watch('tongTien', function () {
    console.log($scope.tongTien)
  });
  /////////////////////////////////////////////////////////////////////////////////
};
