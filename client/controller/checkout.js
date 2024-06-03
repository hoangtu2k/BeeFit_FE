window.CheckOutController = function ($http, $scope, $rootScope, $routeParams, $location, AuthService, CartService) {

  //trang thanh toán
  $scope.checkOut = function () {

    let IdCustomer = AuthService.getCustomer();
    $(document).ready(function () {
      // Đặt thuộc tính checked cho radio button với ID là 'pay1'
      $("#pay1").prop("checked", true);
      // Hoặc có thể sử dụng
      // $("#pay1").attr("checked", "checked");
    });
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

    if (IdCustomer != null) {

      //check trạng thái thanh toán online khi trả về
      if ($location.search().vnp_TransactionStatus === "00") {
        $http.put(
          "http://localhost:8080/api/bill/" + $location.search().vnp_OrderInfo
        ).then(function (resp) {
          $scope.sendBillToMail($location.search().vnp_OrderInfo);
        })

      }
      if ($location.search().vnp_TransactionStatus === "02") {
        Swal.fire(
          "Đơn hàng " +
          $location.search().vnp_OrderInfo +
          " chưa được thanh toán",
          "Vui lòng thanh toán trong vòng 24h ",
          "warning"
        );
        location.href = "#/myorder";
      }

      //load cart by user
      $scope.listCart = [];
      $http.get("http://localhost:8080/api/cart/" + IdCustomer).then(function (cart) {
        $scope.listCart = cart.data;
        $scope.tongTien = 0;
        for (let i = 0; i < $scope.listCart.length; i++) {
          $scope.tongTien +=
            $scope.listCart[i].unitPrice * $scope.listCart[i].quantity;
        }
      });

      $http.get("http://localhost:8080/api/cart/getCartByCustomer/" + IdCustomer).then(function (idd) {
        let idCart = idd.data.id;

        $scope.listAddress = [];
        //load address by user

        $http.get("http://localhost:8080/api/address/" + IdCustomer).then(function (address) {
          $scope.listAddress = address.data;
          let idAddress = address.data[0].id;
          //load cart by user
          $http.get("http://localhost:8080/api/cart/" + IdCustomer).then(function (cart) {
            let TotalPrice = 0;

            let TotalGam = 0;
            for (let i = 0; i < cart.data.length; i++) {
              TotalPrice +=
                parseFloat(cart.data[i].unitPrice) *
                parseFloat(cart.data[i].quantity);
            }
            for (let i = 0; i < cart.data.length; i++) {
              TotalGam += cart.data[i].product.weight * cart.data[i].quantity;
            }

            // lấy thông tin địa chỉ giao hàng
            $http
              .get("http://localhost:8080/api/address/get/" + idAddress)
              .then(function (resp) {
                var params = {
                  service_type_id: 2,
                  insurance_value: parseInt(TotalPrice),
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
                }).then(function (ship) {
                  $scope.phiShip = ship.data.data.total;
                  $scope.tienThanhToan = TotalPrice + ship.data.data.total;

                  // dat hang
                  $scope.buy = function () {

                    Swal.fire({
                      title: "Xác nhận đặt hàng ?",
                      showCancelButton: true,
                      confirmButtonText: "Đặt",
                    }).then((result) => {
                      /* Read more about isConfirmed, isDenied below */
                      if (result.isConfirmed) {
                        //  var typePay = document.getElementById("typePay").value;
                        //nếu chọn thanh toán tại nhà
                        if (document.getElementById("pay1").checked === true) {
                          // Biến để kiểm tra xem có sản phẩm nào số lượng không đủ không
                          let quantityNotEnough = false;
                          //check số lượng còn hàng trước khi cho đặt hàng
                          $http
                            .get("http://localhost:8080/api/cart/" + IdCustomer)
                            .then(function (CheckCart) {
                              // Dùng Promise.all để chờ tất cả các request hoàn thành
                              let promises = CheckCart.data.map((cartItem) => {
                                // Lấy số lượng sản phẩm đang có
                                var getPram = {
                                  IdProduct: cartItem.product.id,
                                  IdColor: cartItem.idColor,
                                  IdSize: cartItem.idSize,
                                };

                                // Trả về promise của request
                                return $http({
                                  method: "GET",
                                  url: "http://localhost:8080/api/productdetail_color_size/getQuantityProductAndColorAndSize",
                                  params: getPram,
                                }).then(function (resp) {
                                  if (parseInt(resp.data) == 0) {
                                    // Nếu số lượng hết, cập nhật biến kiểm tra
                                    quantityNotEnough = true;
                                    Swal.fire(
                                      "Số lượng sản phẩm " +
                                      cartItem.product.name +
                                      " đã hết ! Sản phẩm sẽ được xóa khỏi giỏ hàng",
                                      "",
                                      "warning",
                                    );
                                    $http.delete(
                                      "http://localhost:8080/api/cart/" +
                                      cartItem.id
                                    );

                                  }
                                  else if (resp.data === '') {
                                    quantityNotEnough = true;
                                    $http.delete(
                                      "http://localhost:8080/api/cart/" +
                                      cartItem.id
                                    );
                                    Swal.fire(
                                      "Sản phẩm " +
                                      cartItem.product.name +
                                      " không khả dụng ! Sản phẩm sẽ được xóa khỏi giỏ hàng",
                                      "",
                                      "warning"
                                    );
                                  }
                                  else if (cartItem.quantity > parseInt(resp.data)) {
                                    // Nếu số lượng không đủ, cập nhật biến kiểm tra
                                    quantityNotEnough = true;
                                    Swal.fire(
                                      "Số lượng sản phẩm " +
                                      cartItem.product.name +
                                      " không đủ! Số lượng sản phẩm này trong giỏ hàng của bạn sẽ được cập nhật về số lượng hiện có!",
                                      "",
                                      "warning"
                                    );
                                    // Cập nhật số lượng hiện có vào giỏ hàng
                                    return $http
                                      .put(
                                        "http://localhost:8080/api/cart/updateCart/" +
                                        cartItem.id,
                                        {
                                          idCart: idCart,
                                          idProduct: cartItem.product.id,
                                          idColor: cartItem.idColor,
                                          idSize: cartItem.idSize,
                                          quantity: resp.data,
                                          unitPrice: cartItem.unitPrice,
                                        }
                                      );

                                  }

                                });

                              });

                              // Sau khi tất cả các request hoàn thành
                              Promise.all(promises)
                                .then(() => {
                                  // Nếu có sản phẩm nào số lượng không đủ, không thực hiện các bước tiếp theo
                                  if (quantityNotEnough) {
                                    $http.get("http://localhost:8080/api/cart/" + IdCustomer).then(function (cartL) {
                                      $rootScope.listCartIndex = cartL.data;
                                      $rootScope.tongTienIndex = 0;
                                      for (let i = 0; i < $rootScope.listCartIndex.length; i++) {
                                        $rootScope.tongTienIndex +=
                                          $rootScope.listCartIndex[i].unitPrice * $rootScope.listCartIndex[i].quantity;
                                      }
                                    })
                                    location.href = "#/cart"
                                    return;
                                  }
                                  // add bill
                                  $http
                                    .post("http://localhost:8080/api/bill", {
                                      totalPrice: TotalPrice,
                                      shipPrice: ship.data.data.total,
                                      totalPriceLast:
                                        $scope.giamGia,
                                      note: document.getElementById("note").value,
                                      payType: 0,
                                      payStatus: 0,
                                      idCoupon: 0,
                                      idAddress: idAddress,
                                      idCustomer: IdCustomer,
                                      status: 0,
                                      typeStatus: 0
                                    })
                                    .then(function (bill) {
                                      $http.post('http://localhost:8080/api/billhistory', {
                                        createBy: null,
                                        note: null,
                                        status: 0,
                                        idBill: bill.data.id
                                      });
                                      var isMailSent = false;
                                      $http
                                        .get("http://localhost:8080/api/cart/" + IdCustomer)
                                        .then(function (CartToBill) {
                                          for (
                                            let i = 0;
                                            i < CartToBill.data.length;
                                            i++
                                          ) {
                                            $http
                                              .post(
                                                "http://localhost:8080/api/bill/addBillDetail",
                                                {
                                                  // add bill detail
                                                  idBill: bill.data.id,
                                                  idProduct:
                                                    CartToBill.data[i].product
                                                      .id,
                                                  idColor:
                                                    CartToBill.data[i].idColor,
                                                  idSize: CartToBill.data[i].idSize,
                                                  quantity:
                                                    CartToBill.data[i].quantity,
                                                  unitPrice:
                                                    CartToBill.data[i].unitPrice,
                                                }
                                              )
                                              .then(function (billdetail) {
                                                //xóa giỏ hàng by user
                                                $http.delete(
                                                  "http://localhost:8080/api/cart/deleteAllCart/" + IdCustomer
                                                );

                                                //get số lượng sản phẩm đang có
                                                var getPram = {
                                                  IdProduct:
                                                    CartToBill.data[i].product
                                                      .id,
                                                  IdColor:
                                                    CartToBill.data[i].idColor,
                                                  IdSize: CartToBill.data[i].idSize,
                                                };
                                                $http({
                                                  method: "GET",
                                                  url: "http://localhost:8080/api/productdetail_color_size/getQuantityProductAndColorAndSize",
                                                  params: getPram,
                                                }).then(function (resp) {
                                                  var param2 = {
                                                    IdProduct:
                                                      CartToBill.data[i]
                                                        .product.id,
                                                    IdColor:
                                                      CartToBill.data[i].idColor,
                                                    IdSize:
                                                      CartToBill.data[i].idSize,
                                                    Quantity:
                                                      parseInt(resp.data) -
                                                      parseInt(
                                                        CartToBill.data[i].quantity
                                                      ),
                                                  };
                                                  $http({
                                                    method: "PUT",
                                                    url: "http://localhost:8080/api/productdetail_color_size/updateQuantity",
                                                    params: param2,
                                                  }).then(function (resp) {

                                                    // Kiểm tra biến kiểm soát trước khi gọi hàm
                                                    if (!isMailSent) {
                                                      $scope.sendBillToMail(bill.data.code);
                                                      isMailSent = true; // Đánh dấu là đã gửi email
                                                    }

                                                  });
                                                });
                                              });
                                          }
                                        });

                                    });
                                })
                            });
                        } else if (document.getElementById("pay2").checked === true) {
                          //thanh toán qua vnpay
                          Swal.fire("Đang phát triển...", "", "warning");
                          return;
                        } else {
                          Swal.fire("Có lỗi xảy ra !", "", "error");
                        }
                      }
                    });
                  };
                });
              });
          });

          //thay đổi địa chỉ giao hàng
          $scope.changeAddress = function () {
            let idAddress = document.getElementById("idAddress").value;
            //load cart by user
            $http.get("http://localhost:8080/api/cart/" + IdCustomer).then(function (cart) {
              let TotalPrice = 0;

              let TotalGam = 0;
              for (let i = 0; i < cart.data.length; i++) {
                TotalPrice +=
                  parseFloat(cart.data[i].unitPrice) *
                  parseFloat(cart.data[i].quantity);
              }
              for (let i = 0; i < cart.data.length; i++) {
                TotalGam +=
                  cart.data[i].product.weight * cart.data[i].quantity;
              }

              // lấy thông tin địa chỉ giao hàng
              $http
                .get("http://localhost:8080/api/address/get/" + idAddress)
                .then(function (resp) {
                  var params = {
                    service_type_id: 2,
                    insurance_value: parseInt(TotalPrice),
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
                    $scope.phiShip = resp.data.data.total;
                    $scope.tienThanhToan = TotalPrice + resp.data.data.total - $scope.giamGia;
                  });
                });
            });
          };
        });

        $scope.listCheck = [];
        $scope.listCheck1 = [];
        $scope.voucherGiamGia = 0;
        $scope.couponGiamGia = 0;
        $scope.phiShip = 0;
        $scope.giamGia = 0;
        $scope.couponGiamGia = 0;
        $scope.apMa = function () {

          let code = document.getElementById('coupon-code').value;
          if (code.trim() === '') {
            Swal.fire('Mã không được để trống !', "", "error");
            return;
          }

          $http.get("http://localhost:8080/api/cart/" + IdCustomer).then(function (cart) {
            let TotalPrice = 0;
            for (let i = 0; i < cart.data.length; i++) {
              TotalPrice +=
                parseFloat(cart.data[i].unitPrice) *
                parseFloat(cart.data[i].quantity);
            }

            $scope.listCoupon = [];

            var checkCode1 = {
              code: ''
            }

            //check coupon
            $http.get('http://localhost:8080/api/getcoupon/' + IdCustomer).then(function (resp) {
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

                    if ($scope.listCoupon[i].cash > TotalPrice) {
                      $scope.giamGia += TotalPrice;
                      $scope.couponGiamGia = TotalPrice;

                    } else {
                      $scope.giamGia += $scope.listCoupon[i].cash
                      $scope.couponGiamGia = $scope.listCoupon[i].cash;
                    }

                  } else {
                    $scope.giamGia += (TotalPrice * ($scope.listCoupon[i].discount * 0.01));
                    $scope.couponGiamGia = (TotalPrice * ($scope.listCoupon[i].discount * 0.01));
                  }

                  checkCode1 = {
                    code: code
                  }
                  $scope.listCheck1.push(checkCode1);
                  $scope.checkCoupon = true;
                  Swal.fire("Áp mã thành công !", "", "success");
                  document.getElementById('coupon-code').value = '';
                  $scope.tienThanhToan = TotalPrice + $scope.phiShip - ($scope.couponGiamGia + $scope.giamGia);

                }
              }
              if (TotalPrice < $scope.giamGia) {
                Swal.fire('Số tiền giảm đã ở mức tối đa', '', 'error');
                $scope.checkCoupon = false;
                $scope.listCheck1 = [];
                $scope.giamGia = $scope.giamGia;
                $scope.couponGiamGia = 0;
                $scope.tienThanhToan = TotalPrice + $scope.phiShip - ($scope.couponGiamGia + $scope.giamGia);
              }
            })

            Swal.fire('Mã không tồn tại !', "", "error");
            return;
          })
        }

        $scope.removeCoupon = function () {
          $scope.couponGiamGia = 0;
          $scope.listCheck1 = [];
          $scope.giamGia = 0;
          document.getElementById('coupon-code').value = '';

          $http.get("http://localhost:8080/api/cart/" + IdCustomer).then(function (cart) {
            let TotalPrice = 0;
            for (let i = 0; i < cart.data.length; i++) {
              TotalPrice +=
                parseFloat(cart.data[i].unitPrice) *
                parseFloat(cart.data[i].quantity);
            }
            $scope.checkCoupon = false;
            $scope.tienThanhToan = TotalPrice + $scope.phiShip;
          });
        }

      })

      $scope.isDiaChi = false;
      $scope.themDiaChi = function () {
        $scope.isDiaChi = !$scope.isDiaChi;
        //get tỉnh
        $scope.listTinh = [];
        $http({
          method: "GET",
          url: "https://online-gateway.ghn.vn/shiip/public-api/master-data/province",
          headers: {
            'token': 'f22a8bb9-632c-11ee-b394-8ac29577e80e'
          }
        }).then(function (resp) {
          $scope.listTinh = resp.data.data;
          console.log(JSON.stringify($scope.listTinh));
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
            console.log(JSON.stringify($scope.listHuyen));
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
            console.log(JSON.stringify($scope.listXa));
          })
        }
        $scope.getHuyen();
        $scope.getXa();
      }

      $scope.addDiaChi = function () {
        let tennguoimua = document.getElementById('tennguoimua').value;
        let sodienthoai = document.getElementById('sodienthoai').value;
        let diachicuthe = document.getElementById('diachicuthe').value;
        let cityId = document.getElementById('tinh').value;
        let districtId = document.getElementById('huyen').value;
        let wardId = document.getElementById('xa').value;
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
        $http.post('http://localhost:8080/api/address/add', {
          fullname: tennguoimua,
          phone: sodienthoai,
          address: diachicuthe,
          cityId: cityId,
          districtId: districtId,
          wardId: wardId,
          cityName: cityName,
          districtName: districtName,
          wardName: wardName,
          idCustomer: IdCustomer


        }).then(function (resp) {
          $scope.isDiaChi = false;
          Swal.fire('Thêm thành công !', '', 'success');
          $http.get("http://localhost:8080/api/address/" + IdCustomer).then(function (address) {
            $scope.listAddress = address.data;
            //load cart by user
            $http.get("http://localhost:8080/api/cart/" + IdCustomer).then(function (cart) {
              let TotalPrice = 0;

              let TotalGam = 0;
              for (let i = 0; i < cart.data.length; i++) {
                TotalPrice +=
                  parseFloat(cart.data[i].unitPrice) *
                  parseFloat(cart.data[i].quantity);
              }
              for (let i = 0; i < cart.data.length; i++) {
                TotalGam +=
                  cart.data[i].product.weight * cart.data[i].quantity;
              }

              // lấy thông tin địa chỉ giao hàng
              $http
                .get("http://localhost:8080/api/address/get/" + $scope.listAddress[0].id)
                .then(function (resp) {
                  var params = {
                    service_type_id: 2,
                    insurance_value: parseInt(TotalPrice),
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
                    $scope.phiShip = resp.data.data.total;
                    $scope.tienThanhToan = TotalPrice + resp.data.data.total - $scope.giamGia;
                  });
                });
            });

          })
        })


      }


    }

    /////////////////////////////////////////////////////////////
    $scope.sendBillToMail = function (code) {

      $http.get('http://localhost:8080/api/bill/getbycode/' + code).then(function (billexport) {
        $scope.billexport = billexport.data;
        $http.get('http://localhost:8080/api/address/get/' + billexport.data.idAddress).then(function (add) {
          $scope.addressexport = add.data;
        }).then(function (resp) {
          $http.get("http://localhost:8080/api/bill/getallbybill/" + code).then(function (resp) {
            $scope.listItemExport = resp.data;

            $http.get("http://localhost:8080/api/customer/" + IdCustomer).then(function (response) {
              // Lấy phần tử bằng ID
              var myElement = document.getElementById('exportbill');

              // Lấy HTML từ phần tử và in ra console
              var htmlContent = myElement.innerHTML;
              // Lấy ngày và giờ hiện tại
              var currentDate = new Date();

              // Lấy giờ, phút, giây
              var hours = currentDate.getHours();
              var minutes = currentDate.getMinutes();

              // Lấy ngày, tháng, năm
              var day = currentDate.getDate();
              var month = currentDate.getMonth() + 1; // Tháng bắt đầu từ 0
              var year = currentDate.getFullYear();
              var emailData = {
                to: response.data.email,
                subject: 'Cảm ơn bạn đã mua hàng tại BeeBetaShoes lúc ' + hours + ' giờ ' + minutes + ' phút ' + day + '/' + month + '/' + year,
                bodyHtml: htmlContent,
              };

              $http.post('http://localhost:8080/api/sendmail', emailData).then(function (resp) {
                Swal.fire(
                  "Đặt hàng thành công !",
                  "",
                  "success"
                );
                $rootScope.listCartIndex = [];
                $rootScope.tongTienIndex = 0;
                location.href = "#/myorder";
              })

            })
          })
        })

      })



    }
    /////////////////////////////////////////////////////////////
  };

  $scope.checkOut();

};
