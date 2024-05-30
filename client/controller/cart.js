window.CartController = function ($http, $scope, $rootScope, AuthService, CartService) {

  $scope.loadCart = function () {
    let IdCustomer = AuthService.getCustomer();

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

    if (IdCustomer != null) {

      //load cart by user
      $scope.listCart = [];
      $http.get("http://localhost:8080/api/cart/" + IdCustomer).then(function (cart) {
        $scope.listCart = cart.data;
        $scope.tongTien = 0;
        $scope.tongSoLuong = 0;
        for (let i = 0; i < $scope.listCart.length; i++) {
          $scope.tongTien +=
            $scope.listCart[i].unitPrice * $scope.listCart[i].quantity;
          $scope.tongSoLuong += $scope.listCart[i].quantity;
        }
      });
      
      $http.get("http://localhost:8080/api/cart/getCartByCustomer/" + IdCustomer).then(function (idd) {
        let idCart = idd.data.id;


        //delete product from cart
        $scope.deleteByCart = function (id) {
          Swal.fire({
            title: "Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng ?",
            showCancelButton: true,
            confirmButtonText: "Xóa",
          }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
              $http.delete("http://localhost:8080/api/cart/" + id);

              Swal.fire("Đã xóa khỏi giỏ hàng !", "", "success");
              setTimeout(() => {
                $http.get("http://localhost:8080/api/cart/" + IdCustomer).then(function (cartL) {
                  $rootScope.listCartIndex = cartL.data;
                  $rootScope.tongTienIndex = 0;
                  for (let i = 0; i < $rootScope.listCartIndex.length; i++) {
                    $rootScope.tongTienIndex +=
                      $rootScope.listCartIndex[i].unitPrice * $rootScope.listCartIndex[i].quantity;
                  }
                })
                location.href = "#cart";
              }, 500);
            }
          });
        };

        //giảm số lượng trong cart
        $scope.giam = function (idCartDetail, idProduct, idColor, idSize) {
          var getQuanity = parseInt(
            document.getElementById("qty" + idCartDetail).value
          );
          getQuanity = getQuanity - 1;
          //nếu product về số lượng là 0 thì check có thể xóa
          if (getQuanity <= 0) {
            $scope.deleteByCart(idCartDetail);
            getQuanity = 1;
            return;
          }
          //get đơn giá ở thời điểm hiện tại
          $http
            .get("http://localhost:8080/api/product/" + idProduct)
            .then(function (response) {

              var unitPrice = 0;
              if (response.data.discount > 0) {
                unitPrice =
                  response.data.price -
                  response.data.price * (response.data.discount * 0.01);
              } else {
                unitPrice = response.data.price;
              }

              // nếu thỏa mãn thì giảm số lượng trong giỏ hàng
              $http
                .put("http://localhost:8080/api/cart/updateCart/" + idCartDetail, {
                  idCart: idCart,
                  idProduct: idProduct,
                  idColor: idColor,
                  idSize: idSize,
                  quantity: getQuanity,
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
                    //load lại sau khi giảm thành công !
                    $scope.loadCart();
                  }
                });
            });
        };
        // tăng số lượng trong giỏ
        $scope.tang = function (idCartDetail, idProduct, idColor, idSize) {
          // check số lượng của sản phẩm đang còn
          var params = {
            IdProduct: idProduct,
            IdColor: idColor,
            IdSize: idSize,
          };
          $http({
            method: "GET",
            url: "http://localhost:8080/api/productdetail_color_size/getQuantityProductAndColorAndSize",
            params: params,
          }).then(function (resp) {
            $scope.quantity = resp.data;

            if (
              document.getElementById("qty" + idCartDetail).value >= $scope.quantity
            ) {
              Swal.fire(
                "Số lượng đã đến mức tối đa số lượng sản phẩm hiện có !",
                "",
                "error"
              );
              return;
            }
            document.getElementById("qty" + idCartDetail).value =
              parseInt(document.getElementById("qty" + idCartDetail).value) + 1;

            //get đơn giá ở thời điểm hiện tại
            $http
              .get("http://localhost:8080/api/product/" + idProduct)
              .then(function (response) {
                var unitPrice = 0;
                if (response.data.discount > 0) {
                  unitPrice =
                    response.data.price -
                    response.data.price * (response.data.discount * 0.01);
                } else {
                  unitPrice = response.data.price;
                }

                // nếu thỏa mãn thì tăng số lượng trong giỏ hàng
                $http
                  .put(
                    "http://localhost:8080/api/cart/updateCart/" + idCartDetail,
                    {
                      idCart: idCart,
                      idProduct: idProduct,
                      idColor: idColor,
                      idSize: idSize,
                      quantity: parseInt(
                        document.getElementById("qty" + idCartDetail).value
                      ),
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
                      //load lại sau khi tăng thành công !
                      $scope.loadCart();
                    }
                  });
              });
          });
        };

        $scope.EnterQuantity = function (
          idCartDetail,
          idProduct,
          idColor,
          idSize
        ) {
          var numberRegex = /^[0-9]+$/;
          if (
            !numberRegex.test(document.getElementById("qty" + idCartDetail).value)
          ) {
            Swal.fire("Số lượng phải là số nguyên dương !!", "", "error");
            $http
              .get(
                "http://localhost:8080/api/cart/getQuantityByCartDetail/" +
                idCartDetail
              )
              .then(function (resp) {
                document.getElementById("qty" + idCartDetail).value = resp.data;
              });
            return;
          }
          var params = {
            IdProduct: idProduct,
            IdColor: idColor,
            IdSize: idSize,
          };
          $http({
            method: "GET",
            url: "http://localhost:8080/api/productdetail_color_size/getQuantityProductAndColorAndSize",
            params: params,
          }).then(function (resp) {
            $scope.quantity = resp.data;

            if (
              document.getElementById("qty" + idCartDetail).value > $scope.quantity
            ) {
              Swal.fire(
                "Số lượng đã đến mức tối đa số lượng sản phẩm hiện có !",
                "",
                "error"
              );
              $http
                .get(
                  "http://localhost:8080/api/cart/getQuantityByCartDetail/" +
                  idCartDetail
                )
                .then(function (resp) {
                  document.getElementById("qty" + idCartDetail).value = resp.data;
                });
            } else {
              //get đơn giá ở thời điểm hiện tại
              $http
                .get("http://localhost:8080/api/product/" + idProduct)
                .then(function (response) {

                  var unitPrice = 0;
                  if (response.data.discount > 0) {
                    unitPrice =
                      response.data.price -
                      response.data.price * (response.data.discount * 0.01);
                  } else {
                    unitPrice = response.data.price;
                  }

                  // nếu thỏa mãn thì tăng số lượng trong giỏ hàng
                  $http
                    .put(
                      "http://localhost:8080/api/cart/updateCart/" + idCartDetail,
                      {
                        idCart: idCart,
                        idProduct: idProduct,
                        idColor: idColor,
                        idSize: idSize,
                        quantity: parseInt(
                          document.getElementById("qty" + idCartDetail).value
                        ),
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
                        //load lại sau khi tăng thành công !
                        $scope.loadCart();
                      }
                    });
                });
            }
          });
        };

      })
    } else{
  
      let url = "http://localhost:8080/api/product/getall";
      $http.get(url).then(function (response){
        $scope.list1 = response.data;
      
      })
      $scope.listCart1 = CartService.getCartItems();
      $scope.tongTien1 = 0;
      for (let i = 0; i < $scope.listCart1.length; i++) {
        $scope.tongTien1 +=
          $scope.listCart1[i].unitPrice * $scope.listCart1[i].quantity;
      }
    
      
      $scope.deleteByCart1 = function (id,idColor,idSize) {
        Swal.fire({
            title: "Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng ?",
            showCancelButton: true,
            confirmButtonText: "Xóa",
        }).then((result) => {
            if (result.isConfirmed) {
                var index = CartService.findItemIndexById(id,idColor,idSize);
                CartService.removeFromCart(index);
    
                // Reload data from the server
                $http.get(url).then(function (response){
                  $scope.list1 = response.data;
                
                })
    
              
    
                // Recalculate total price
                $scope.tongTien1 = 0;
                for (let i = 0; i < $scope.listCart1.length; i++) {
                  $scope.tongTien1 +=
                    $scope.listCart1[i].unitPrice * $scope.listCart1[i].quantity;
                }
                $rootScope.tongTienIndex1 = 0;
                for (let i = 0; i < $rootScope.listCartIndex1.length; i++) {
                  $rootScope.tongTienIndex1 +=
                    $rootScope.listCartIndex1[i].unitPrice * $rootScope.listCartIndex1[i].quantity;
                }
    
                Swal.fire("Đã xóa khỏi giỏ hàng !", "", "success");
            }
        });
    };
    
     //giảm số lượng trong cart
     $scope.giam1 = function (idProduct, idColor, idSize) {
      var getQuanity = parseInt(
        document.getElementById("qty1" + idProduct + "color" + idColor + "size" + idSize).value
      );
    
    
      
     
      getQuanity = getQuanity - 1;
     
      //nếu product về số lượng là 0 thì check có thể xóa
      if (getQuanity <= 0) {
        $scope.deleteByCart1(idProduct, idColor, idSize);
        getQuanity = 1;
        return;
      }
      //get đơn giá ở thời điểm hiện tại
      $http
        .get("http://localhost:8080/api/product/" + idProduct)
        .then(function (response) {
          var unitPrice = 0;
          if (response.data.discount > 0) {
            unitPrice =
              response.data.price -
              response.data.price * (response.data.discount * 0.01);
          } else {
            unitPrice = response.data.price;
          }
    
          var index = CartService.findItemIndexById(idProduct,idColor,idSize);
          var cartUpdate = {
            idProduct : response.data,
            idColor : idColor,
            idSize : idSize,
            quantity: parseInt(CartService.getCartItemAtIndex(index).quantity) - 1,
            unitPrice: unitPrice
          }
          CartService.updateCartItem(index, cartUpdate);
           // Recalculate total price
           $scope.tongTien1 = 0;
           for (let i = 0; i < $scope.listCart1.length; i++) {
             $scope.tongTien1 +=
               $scope.listCart1[i].unitPrice * $scope.listCart1[i].quantity;
               
           }
           $rootScope.tongTienIndex1 = 0;
           for (let i = 0; i < $rootScope.listCartIndex1.length; i++) {
             $rootScope.tongTienIndex1 +=
               $rootScope.listCartIndex1[i].unitPrice * $rootScope.listCartIndex1[i].quantity;
           }
    
        });
    };
    
    // tăng số lượng trong giỏ
    $scope.tang1 = function (idProduct, idColor, idSize) {
      // check số lượng của sản phẩm đang còn
      
      var params = {
        IdProduct: idProduct,
        IdColor: idColor,
        IdSize: idSize,
      };
      $http({
        method: "GET",
        url: "http://localhost:8080/api/productdetail_color_size/getQuantityProductAndColorAndSize",
        params: params,
      }).then(function (resp) {
        $scope.quantity = resp.data;
    
        if (
          document.getElementById("qty1" + idProduct + "color" + idColor + "size" + idSize).value >= $scope.quantity
        ) {
          Swal.fire(
            "Số lượng đã đến mức tối đa số lượng sản phẩm hiện có !",
            "",
            "error"
          );
          return;
        }
        document.getElementById("qty1" + idProduct + "color" + idColor + "size" + idSize).value =
          parseInt(document.getElementById("qty1" + idProduct + "color" + idColor + "size" + idSize).value) + 1;
    
        //get đơn giá ở thời điểm hiện tại
        $http
          .get("http://localhost:8080/api/product/" + idProduct)
          .then(function (response) {
            var unitPrice = 0;
            if (response.data.discount > 0) {
              unitPrice =
                response.data.price -
                response.data.price * (response.data.discount * 0.01);
            } else {
              unitPrice = response.data.price;
            }
    
            var index = CartService.findItemIndexById(idProduct,idColor,idSize);
            var cartUpdate = {
              idProduct : response.data,
              idColor : idColor,
              idSize : idSize,
              quantity: parseInt(CartService.getCartItemAtIndex(index).quantity) + 1,
              unitPrice: unitPrice
            }
            CartService.updateCartItem(index, cartUpdate);
             // Recalculate total price
             $scope.tongTien1 = 0;
                for (let i = 0; i < $scope.listCart1.length; i++) {
                  $scope.tongTien1 +=
                    $scope.listCart1[i].unitPrice * $scope.listCart1[i].quantity;
                }
                $rootScope.tongTienIndex1 = 0;
                for (let i = 0; i < $rootScope.listCartIndex1.length; i++) {
                  $rootScope.tongTienIndex1 +=
                    $rootScope.listCartIndex1[i].unitPrice * $rootScope.listCartIndex1[i].quantity;
                }
            
          });
      });
    };
    $scope.EnterQuantity1 = function (
      idProduct,
      idColor,
      idSize
    ) {
      var numberRegex = /^[0-9]+$/;
      if (
        !numberRegex.test(document.getElementById("qty1" + idProduct + "color" + idColor + "size" + idSize).value)
      ) {
        Swal.fire("Số lượng phải là số nguyên dương !!", "", "error");
        document.getElementById("qty1" + idProduct + "color" + idColor + "size" + idSize).value = 1;
        return;
      }
      var params = {
        IdProduct: idProduct,
        IdColor: idColor,
        IdSize: idSize,
      };
      $http({
        method: "GET",
        url: "http://localhost:8080/api/productdetail_color_size/getQuantityProductAndColorAndSize",
        params: params,
      }).then(function (resp) {
        $scope.quantity = resp.data;
    
        if (
          document.getElementById("qty1" + idProduct + "color" + idColor + "size" + idSize).value > $scope.quantity
        ) {
          Swal.fire(
            "Số lượng đã đến mức tối đa số lượng sản phẩm hiện có !",
            "",
            "error"
          );
          document.getElementById("qty1" + idProduct + "color" + idColor + "size" + idSize).value = resp.data
        } else {
          //get đơn giá ở thời điểm hiện tại
          $http
            .get("http://localhost:8080/api/product/" + idProduct)
            .then(function (response) {
              var unitPrice = 0;
              if (response.data.discount > 0) {
                unitPrice =
                  response.data.price -
                  response.data.price * (response.data.discount * 0.01);
              } else {
                unitPrice = response.data.price;
              }
    
              var index = CartService.findItemIndexById(idProduct,idColor,idSize);
              var cartUpdate = {
                idProduct : response.data,
                idColor : idColor,
                idSize : idSize,
                quantity: parseInt( document.getElementById("qty1" + idProduct + "color" + idColor + "size" + idSize).value),
                unitPrice: unitPrice
              }
              CartService.updateCartItem(index, cartUpdate);
               // Recalculate total price
               $scope.tongTien1 = 0;
               for (let i = 0; i < $scope.listCart1.length; i++) {
                 $scope.tongTien1 +=
                   $scope.listCart1[i].unitPrice * $scope.listCart1[i].quantity;
               }
               $rootScope.tongTienIndex1 = 0;
               for (let i = 0; i < $rootScope.listCartIndex1.length; i++) {
                 $rootScope.tongTienIndex1 +=
                   $rootScope.listCartIndex1[i].unitPrice * $rootScope.listCartIndex1[i].quantity;
               }
              
             
            });
        }
      });
    };
    
      
      
     }

    $scope.checkCheckOut = function () {
      location.href = "#/checkout";
    }
  };
  $scope.loadCart();

}