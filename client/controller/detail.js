window.DetailController = function ($http, $scope, $routeParams, $location, $rootScope, AuthService, CartService) {
  $scope.detail = function () {

    let IdCustomer = AuthService.getCustomer();
    var selectedVal = "";
    var selectedVal1 = "";
    let urlcolor = "http://localhost:8080/api/color";
    let urlsize = "http://localhost:8080/api/size";
    let urlmaterial = "http://localhost:8080/api/material";

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

    let id = $routeParams.id;
    $scope.danhgia = function () {
      let score = document.getElementById('star5').checked == true ? 5 : document.getElementById('star4').checked == true ? 4 : document.getElementById('star3').checked == true ? 3 : document.getElementById('star2').checked == true ? 2 : document.getElementById('star1').checked == true ? 1 : null;


      let review = document.getElementById('review').value;
      if (score == null) {
        Swal.fire("Vui lòng chọn sao đánh giá", "", "error");
        return;
      }
      if (review == '') {
        Swal.fire("Nội dung đánh giá không được bỏ trống", "", "error");
        return;
      }
      $http.post("http://localhost:8080/api/rating", {
        score: score,
        note: review,
        idProduct: id,
        idCustomer: IdCustomer
      }).then(function (resp) {
        var ListImage = $scope.imagesList;
        if (ListImage.length > 0) {
          var img1 = new FormData();
          for (let i = 0; i < ListImage.length; i++) {
            img1.append("files", ListImage[i]);
            $http.post("http://localhost:8080/api/upload", img1, {
              transformRequest: angular.identity,
              headers: {
                'Content-Type': undefined
              }
            }).then(function (imagelist) {
              $http.post("http://localhost:8080/api/ratingimage", {
                url: imagelist.data[i],
                idRating: resp.data.id
              });
            })
          }

        }


        Swal.fire("Đánh giá thành công", "", "success");
        setTimeout(() => {
          location.reload();
        }, 2500);
      })


    }
    $scope.images = [];
    $scope.imagesList = [];
    let check = 0;
    $scope.openImage = function () {
      check++;
      if (check === 1) {
        $scope.change();
      }
      document.getElementById('fileList').click();


    };





    $scope.imageDelete = [];
    $scope.deleteImage = function (index) {

      var deletedItem = $scope.images.splice(index, 1);
      $scope.imageDelete.push(deletedItem[0]);
    };
    $scope.dkdanhgia = false;
    $scope.sp = {};
    $scope.listCungLoai = [];
    $http
      .get("http://localhost:8080/api/product/" + id)
      .then(function (response) {
        $scope.sp = response.data;
        if ($scope.sp.status === 1) {
          location.href = "#/404";
        }
        // pagation
        $scope.pagerRating = {
          page: 0,
          size: 10,
          get items() {
            var start = this.page * this.size;
            return response.data.ratings.slice(start, start + this.size);
          },
          get count() {
            return Math.ceil(1.0 * response.data.ratings.length / this.size);
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
          }
        }
        $http.get("http://localhost:8080/api/customer/checkdkdanhgia?IdCustomer=" + IdCustomer + "&IdProduct=" + id).then(function (resp) {

          if (resp.data != '') {
            $scope.dkdanhgia = true;
          }
        })
        // Tính điểm trung bình
        $scope.averageRating = calculateAverageRating($scope.sp.ratings);
        if ($scope.averageRating % 1 == 0) {
          $scope.stars = $scope.averageRating;
          $scope.stars1 = 0;
        }
        else {
          $scope.stars = Math.floor($scope.averageRating);
          $scope.stars1 = 1;


        }


        function calculateAverageRating(reviews) {
          var totalRating = 0;
          for (var i = 0; i < reviews.length; i++) {
            totalRating += reviews[i].score;
          }
          return reviews.length > 0 ? (totalRating / reviews.length) : 0;
        }


        // $http
        //   .get(
        //     "http://localhost:8080/api/product/category?id=" + 
        //     response.data.category.id + "&idBrand=" + response.data.brand.id + "&idDesign=" + response.data.design.id + "&idProduct=" + id
        //   )
        //   .then(function (e) {
        //     $scope.listCungLoai = e.data;

        //     // pagation
        //     $scope.pagerCungLoai = {
        //       page: 0,
        //       size: 4,
        //       get items() {
        //         var start = this.page * this.size;
        //         return $scope.listCungLoai.slice(start, start + this.size);
        //       },
        //     };
        //   });

      });


    var params = {
      IdProduct: id,
    };


    $http({
      method: "GET",
      url: "http://localhost:8080/api/productdetail_color_size/getQuantityProduct",
      params: params,
    }).then(function (resp) {
      $scope.quantityHT = resp.data;
    });

    $http
      .get("http://localhost:8080/api/material/get/" + id)
      .then(function (material) {
        $scope.materialid = material.data;           
      });

    $http
      .get("http://localhost:8080/api/color/get/" + id)
      .then(function (color) {
        $scope.colorid = color.data;

        $scope.selectedColor = color.data[0]; // Assign the default color ID
        selectedVal = color.data[0];
        $scope.listKT = [];
        var params = {
          IdProduct: id,
          IdColor: color.data[0],
        };
        $http({
          method: "GET",
          url: "http://localhost:8080/api/productdetail_color_size/getbycolor",
          params: params,
        }).then(function (resp) {
          $scope.listKT = resp.data;

          $scope.selectedSize = resp.data[0].size.id;  // Assign the default size ID
          selectedVal1 = resp.data[0].size.id;
          var params = {
            IdProduct: id,
            IdColor: color.data[0],
            IdSize: resp.data[0].size.id,
          };
          $http({
            method: "GET",
            url: "http://localhost:8080/api/productdetail_color_size/getQuantityProductAndColorAndSize",
            params: params,
          }).then(function (resp) {
            $scope.quantity = resp.data;
          });

        });

      });

    $scope.check = function () {
      var selected = $("input[type='radio'][name='ColorRadioGroup']:checked");
      if (selected.length > 0) {
        selectedVal = selected.val();
        $scope.selectedVal = selected.val();
      }
      $scope.listKT = [];
      var params = {
        IdProduct: id,
        IdColor: selectedVal,
      };
      $http({
        method: "GET",
        url: "http://localhost:8080/api/productdetail_color_size/getbycolor",
        params: params,
      }).then(function (resp) {
        $scope.listKT = resp.data;
        $scope.selectedSize = resp.data[0].size.id;  // Assign the default size ID
        selectedVal1 = resp.data[0].size.id;
        var params = {
          IdProduct: id,
          IdColor: selectedVal,
          IdSize: resp.data[0].size.id,
        };
        $http({
          method: "GET",
          url: "http://localhost:8080/api/productdetail_color_size/getQuantityProductAndColorAndSize",
          params: params,
        }).then(function (resp) {
          $scope.quantity = resp.data;
        });
      });

      $http({
        method: "GET",
        url: "http://localhost:8080/api/productdetail_color_size/getQuantityProductAndColor",
        params: params,
      }).then(function (resp) {
        $scope.quantity = resp.data;
      });


    };
    $scope.checkSize = function () {
      var selected1 = $("input[type='radio'][name='SizeRadioGroup']:checked");
      if (selected1.length > 0) {
        selectedVal1 = selected1.val();
        $scope.selectedVal1 = selected1.val();
      }
      var params = {
        IdProduct: id,
        IdColor: selectedVal,
        IdSize: selectedVal1,
      };
      $http({
        method: "GET",
        url: "http://localhost:8080/api/productdetail_color_size/getQuantityProductAndColorAndSize",
        params: params,
      }).then(function (resp) {
        $scope.quantity = resp.data;
      });
    };
    ////////////////////////////////////////////////////////////////////////////////////////////////

    // Khởi tạo giá trị quantity
    $scope.quantityText = 1;

    // Hàm tăng số lượng
    $scope.increaseQuantity = function () {
      $scope.quantityText++;
    };

    // Hàm giảm số lượng
    $scope.decreaseQuantity = function () {
      if ($scope.quantityText > 1) {
        $scope.quantityText--;
      }
    };

    //thêm sản phẩm vào giỏ hàng
    $scope.addToCart = function () {
      if (selectedVal === "") {
        Swal.fire("Vui lòng chọn màu sắc !!", "", "error");
        return;
      }
      if (selectedVal1 === "") {
        Swal.fire("Vui lòng chọn kích thước !!", "", "error");
        return;
      }
      let soLuong = document.getElementById("Quantity").value;
      if (soLuong.length === 0) {
        Swal.fire("Số lượng không được bỏ trống !!", "", "error");
        document.getElementById("Quantity").value = 1;
        return;
      }

      if (soLuong <= 0) {
        Swal.fire("Số lượng phải lớn hơn 0 !!", "", "error");
        document.getElementById("Quantity").value = 1;
        return;
      }

      if ($scope.quantity < soLuong) {
        Swal.fire(
          "Số lượng bạn thêm đang vượt quá số lượng còn hàng !!",
          "",
          "error"
        );
        return;
      }

      var numberRegex = /^[0-9]+$/;
      if (!numberRegex.test(soLuong)) {
        Swal.fire("Số lượng phải là số !!", "", "error");
        document.getElementById("Quantity").value = 1;
        return;
      }
      if (IdCustomer != null) {
        $http
          .get("http://localhost:8080/api/product/" + id)
          .then(function (response) {
            var unitPrice = 0;
            if (response.data.discount > 0) {
              unitPrice =
                response.data.price -
                response.data.price * (response.data.discount * 0.01);
              $scope.unitPrice = unitPrice;
            } else {
              unitPrice = response.data.price;
              $scope.unitPrice = unitPrice;
            }

            $http.get("http://localhost:8080/api/cart/getCartByCustomer/" + IdCustomer).then(function (idd) {

              let idCart = idd.data.id;

              //get cart by user
              $scope.listCart = [];
              $http.get("http://localhost:8080/api/cart/" + IdCustomer).then(function (cart) {


                $scope.listCart = cart.data;

                // add to cart
                if ($scope.listCart.length === 0) {
                  $http
                    .post("http://localhost:8080/api/cart", {
                      idCart: idCart,
                      idProduct: id,
                      idColor: selectedVal,
                      idSize: selectedVal1,
                      quantity: soLuong,
                      unitPrice: unitPrice,
                    })
                    .then(function (cart) {
                      if (cart.status === 200) {
                        $http.get("http://localhost:8080/api/cart/" + IdCustomer).then(function (cartL) {
                          $rootScope.listCartIndex = cartL.data;
                          $rootScope.tongTienIndex = 0;
                          for (let i = 0; i < $rootScope.listCartIndex.length; i++) {
                            $rootScope.tongTienIndex +=
                              $rootScope.listCartIndex[i].unitPrice * $rootScope.listCartIndex[i].quantity;
                          }
                        })
                        Swal.fire("Đã thêm vào giỏ !!", "", "success");
                      }
                    });
                }
                //check list cart by user
                if ($scope.listCart.length > 0) {
                  for (let i = 0; i < $scope.listCart.length; i++) {
                    // if product in cart
                    if (
                      $scope.listCart[i].product.id == id &&
                      $scope.listCart[i].idColor == selectedVal &&
                      $scope.listCart[i].idSize == selectedVal1
                    ) {
                      if ($scope.listCart[i].quantity >= $scope.quantity) {
                        Swal.fire(
                          "Bạn đã thêm số lượng tối đa hiện có của sản phẩm vào giỏ hàng !!",
                          "",
                          "error"
                        );
                        return;
                      }

                      $http
                        .put(
                          "http://localhost:8080/api/cart/updateCart/" +
                          $scope.listCart[i].id,
                          {
                            idCart: idCart,
                            idProduct: id,
                            idColor: selectedVal,
                            idSize: selectedVal1,
                            quantity:
                              parseInt(soLuong) +
                              parseInt($scope.listCart[i].quantity),
                            unitPrice: unitPrice,
                          }
                        )
                        .then(function (cart) {
                          if (cart.status === 200) {
                            $http.get("http://localhost:8080/api/cart/" + IdCustomer).then(function (cartL) {
                              $rootScope.listCartIndex = cartL.data;
                              $rootScope.tongTienIndex = 0;
                              for (let i = 0; i < $rootScope.listCartIndex.length; i++) {
                                $rootScope.tongTienIndex +=
                                  $rootScope.listCartIndex[i].unitPrice * $rootScope.listCartIndex[i].quantity;
                              }
                            })

                            Swal.fire("Đã thêm vào giỏ !!", "", "success");
                          }
                        });
                      return;
                    }
                  }
                  // add to cart
                  $http
                    .post("http://localhost:8080/api/cart", {
                      idCart: idCart,
                      idProduct: id,
                      idColor: selectedVal,
                      idSize: selectedVal1,
                      quantity: soLuong,
                      unitPrice: unitPrice,
                    })
                    .then(function (cart) {
                      if (cart.status === 200) {
                        $http.get("http://localhost:8080/api/cart/" + IdCustomer).then(function (cartL) {
                          $rootScope.listCartIndex = cartL.data;
                          $rootScope.tongTienIndex = 0;
                          for (let i = 0; i < $rootScope.listCartIndex.length; i++) {
                            $rootScope.tongTienIndex +=
                              $rootScope.listCartIndex[i].unitPrice * $rootScope.listCartIndex[i].quantity;
                          }
                        })
                        Swal.fire("Đã thêm vào giỏ !!", "", "success");
                      }
                    });
                }
              });
            })

          });
      } else {
        $http
          .get("http://localhost:8080/api/product/" + id)
          .then(function (response) {
            var unitPrice = 0;
            if (response.data.discount > 0) {
              unitPrice =
                response.data.price -
                response.data.price * (response.data.discount * 0.01);
              $scope.unitPrice = unitPrice;
            } else {
              unitPrice = response.data.price;
              $scope.unitPrice = unitPrice;
            }

            var index = CartService.findItemIndexById(id, selectedVal, selectedVal1);


            if (index == -1) {
              var cartAdd = {
                idProduct: response.data,
                idColor: parseInt(selectedVal),
                idSize: parseInt(selectedVal1),
                quantity: parseInt(soLuong),
                unitPrice: unitPrice
              }
              CartService.addToCart(cartAdd);

            }
            else {

              var cartUpdate = {
                idProduct: response.data,
                idColor: parseInt(selectedVal),
                idSize: parseInt(selectedVal1),
                quantity: parseInt(CartService.getCartItemAtIndex(index).quantity) + parseInt(soLuong),
                unitPrice: unitPrice
              }
              CartService.updateCartItem(index, cartUpdate);

            }

            Swal.fire("Đã thêm vào giỏ !!", "", "success");
            $rootScope.tongTienIndex1 = 0;
            for (let i = 0; i < $rootScope.listCartIndex1.length; i++) {
              $rootScope.tongTienIndex1 +=
                $rootScope.listCartIndex1[i].unitPrice * $rootScope.listCartIndex1[i].quantity;
            }


          })

      }

    };

  };
  $scope.detail();



}