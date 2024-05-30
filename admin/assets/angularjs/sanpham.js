window.SanPhamController = function ($scope, $http, $location, $routeParams, $rootScope, AuthService) {
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

    $scope.getQuantity = function (sp) {
      $scope.quantityWarning = 0;

      for (let i = 0; i < sp.productDetail_size_colors.length; i++) {
        $scope.quantityWarning =
          $scope.quantityWarning + sp.productDetail_size_colors[i].quantity;
      }

      if ($scope.quantityWarning === 0) {
        sp.quantityWarningText = "Số lượng đã hết";
      }
      if ($scope.quantityWarning < 10 && $scope.quantityWarning > 0) {
        sp.quantityWarningText = "Số lượng sắp hết";
      }
    };

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

  $scope.giamGia = function () {
    if (document.getElementById("giamGia").checked == true) {
      document.getElementById("giamGia1").style.display = 'block';
      document.getElementById("khongGioiHan1").style.display = 'block';
      document.getElementById("khongGioiHan").checked = true


    }
    else {

      document.getElementById("giamGia1").style.display = 'none';
      document.getElementById("khongGioiHan1").style.display = 'none';
      document.getElementById("tamThoi1").style.display = 'none';
      document.getElementById("khongGioiHan").checked = true
    }
  }
  $scope.giamGia1 = function () {
    if (document.getElementById("khongGioiHan").checked == true) {
      document.getElementById("khongGioiHan1").style.display = 'block';
      document.getElementById("tamThoi1").style.display = 'none';
      document.getElementById("phanTramGiamGia").style.display = 'block';
      document.getElementById("phanTramGiamGia1").style.display = 'none';
      document.getElementById("thoiGianGiamGia").style.display = 'none';
    }
    else {
      document.getElementById("khongGioiHan1").style.display = 'none';
      document.getElementById("tamThoi1").style.display = 'block';
      document.getElementById("phanTramGiamGia").style.display = 'none';
      document.getElementById("phanTramGiamGia1").style.display = 'block';
      document.getElementById("thoiGianGiamGia").style.display = 'block';
      var today = new Date().toISOString().split('T')[0];
      document.getElementById("thoiGianGiamGia").min = today;
    }

  }

  //detail product
  $scope.isChiTietSanPham = false;
  $scope.closeChiTiet = function () {
    $scope.isChiTietSanPham = !$scope.isChiTietSanPham;
  };
  $scope.openChiTiet = function (id) {
    document.getElementById("qrcode").innerHTML = "";
    var qrcod = new QRCode(document.getElementById("qrcode"));
    $scope.isChiTietSanPham = !$scope.isChiTietSanPham;
    qrcod.makeCode(id.toString());
    $scope.form = {};

    $http
      .get("http://localhost:8080/api/product/" + id)
      .then(function (detail) {
        $scope.form = detail.data;
      });

  };

  //open img
  $scope.images = [];
  $scope.imagesList = [];
  let check = 0;
  $scope.openImage = function () {
    check++;
    if (check === 1) {
      $scope.change();
    }
    document.getElementById("fileList").click();
  };
  $scope.change = function () {
    document.getElementById("fileList").addEventListener("change", function () {
      var files = this.files;
      if (files.length > 3) {
        Swal.fire("Danh sách tối đa 3 ảnh !", "", "error");
        return;
      }
      if ($scope.images.length >= 3) {
        Swal.fire("Danh sách tối đa 3 ảnh !", "", "error");
        return;
      }
      for (var i = 0; i < files.length; i++) {
        var file = files[i];
        if (file.type.startsWith("image/")) {
          var reader = new FileReader();
          reader.onload = function (e) {
            $scope.$apply(function () {
              $scope.images.push(e.target.result);
            });
          };
          reader.readAsDataURL(file);
          $scope.imagesList.push(file);
        }
      }
    });
  };
  $scope.imageDelete = [];
  $scope.deleteImage = function (index) {
    var deletedItem = $scope.images.splice(index, 1);
    $scope.imageDelete.push(deletedItem[0]);
  };

  ///////////////////////////////////////////////////////////////////////////////
  // ADD, UPDATE, DELETE
  // ADD product
  $scope.colorStates = {}; // Tạo một đối tượng để lưu trạng thái hiển thị cho từng màu
  $scope.pushColor = [];
  $scope.checkbox = function (mausac) {
    var mau = {
      id: mausac
    }
    var checkBox = document.getElementById('Color' + mausac);

    // Kiểm tra nút checkbox đã được chọn hay chưa
    if (checkBox.checked) {
      $scope.colorStates[mausac] = true;

      $scope.pushColor.push(mau);
    } else {
      $scope.colorStates[mausac] = false;
    }
    $scope.mau = {};
  };
  $scope.isPopupVisible = false;
  $scope.colorSizes = {}; // Đối tượng để lưu trữ các kích thước cho từng màu sắc
  let id;
  $scope.themkichthuoc = function (idColor) {
    $scope.isPopupVisible = !$scope.isPopupVisible;
    id = idColor;
    $scope.idCc = idColor;
    if (!$scope.colorSizes[idColor]) {
      $scope.colorSizes[idColor] = []; // Khởi tạo mảng kích thước nếu chưa tồn tại
    }
  };
  $scope.addItem = function () {

    // Lấy giá trị size và quantity từ các input
    var newSize = document.getElementById('sizehan').value;
    var newQuantity = document.getElementById('quantitysize').value;
    if (newSize.trim() === "") {
      Swal.fire('Số lượng không được bỏ trống', '', 'error');
      return;
    }
    if (parseInt(newQuantity) <= 0) {
      Swal.fire('Số lượng phải lớn hơn 0', '', 'error');
      return;
    }
    if (parseInt(newQuantity) > 999) {
      Swal.fire('Số lượng phải nhỏ hơn 1000', '', 'error');

      return;
    }
    var numberRegex = /^[0-9]+$/;
    if (!numberRegex.test(newQuantity)) {
      Swal.fire("Số lượng phải là số !!", "", "error");
      return;
    }

    var sizes = $scope.colorSizes[id];

    var index = $scope.findIndexBySize(sizes, newSize);

    if (index !== -1) {
      if (sizes[index].quantity >= 999) {
        Swal.fire('Số lượng size nhỏ hơn 1000', '', 'error');
        return;
      }
      // Size đã tồn tại, cộng thêm số lượng mới vào số lượng hiện có
      sizes[index].quantity = parseInt(sizes[index].quantity) + parseInt(newQuantity);
    } else {
      // Size chưa tồn tại, thêm một mục mới
      // Tạo một đối tượng mới để lưu trữ kích thước và số lượng
      var newItem = {
        size: document.getElementById('sizehan').value,
        quantity: document.getElementById('quantitysize').value
      };

      // Thêm newItem vào mảng kích thước của màu sắc tương ứng
      $scope.colorSizes[id].push(newItem);
    }

    // Xóa giá trị của newItem để chuẩn bị cho lần thêm tiếp theo
    $scope.newItem = {};

  };
  $scope.removeItemBySize = function (idMausac, sizeToRemove) {
    var sizes = $scope.colorSizes[idMausac];
    var index = $scope.findIndexBySize(sizes, sizeToRemove);
    if (index !== -1) {
      sizes.splice(index, 1); // Xóa phần tử tại vị trí index
    }
  };
  $scope.findIndexBySize = function (sizes, sizeToFind) {

    for (var i = 0; i < sizes.length; i++) {
      if (sizes[i].size === sizeToFind) {
        return i;
      }
    }
    return -1; // Trả về -1 nếu không tìm thấy
  };
  $scope.form = {
    product: {
      code: '',
      name: '',
      Weight: '',
      description: ''

    }
  };
  $scope.reset = function () {
    $scope.form = {};
  }
  //add product
  $scope.add = function () {

    let phanTram = 0;
    let discountDate = null;
    if (document.getElementById("giamGia").checked == true) {
      if (document.getElementById("khongGioiHan").checked == true) {
        phanTram = document.getElementById("phanTramGiamGia").value;
      }
      else {
        phanTram = document.getElementById("phanTramGiamGia1").value;
      }

    }
    if (document.getElementById("tamThoi").checked == true) {
      if (document.getElementById("thoiGianGiamGia").value === '') {
        Swal.fire('Vui lòng chọn thời gian kết thúc giảm giá !', '', 'error');
        return;
      }
      discountDate = document.getElementById("thoiGianGiamGia").value;
    }


    var MainImage = document.getElementById("fileUpload").files;
    if (MainImage.length == 0) {
      Swal.fire('Vui lòng thêm ảnh đại diện cho sản phẩm !', '', 'error');
      return;
    }
    $scope.get = function (name) {
      return document.getElementById(name).value;
    }
    //validate
    $http.post("http://localhost:8080/api/product/validate", {
      code: $scope.form.code,
      name: $scope.form.name,
      price: $scope.form.price,
      weight: $scope.form.weight,
      discount: phanTram,
      description: $scope.form.description
    }).then(function (vali) {
      if (vali.status === 200) {
        //validate
        $scope.validationErrors = [];
        let indexMaterial = 0;
        for (let i = 0; i < $scope.listMaterial.length; i++) {
          let checkIndexMaterial = document.getElementById('Material' + $scope.listMaterial[i].id);
          if (checkIndexMaterial.checked == true) {
            indexMaterial++;
          }
        }
        let indexColor = 0;
        for (let i = 0; i < $scope.listColor.length; i++) {
          let checkIndexColor = document.getElementById('Color' + $scope.listColor[i].id);
          if (checkIndexColor.checked == true) {
            indexColor++;
          }
        }
        if (indexMaterial === 0) {
          Swal.fire('Vui lòng chọn ít nhất 1 chất liệu cho sản phẩm !', '', 'error');
          return;
        }
        if (indexColor === 0) {
          Swal.fire('Vui lòng chọn ít nhất 1 màu sắc cho sản phẩm !', '', 'error');
          return;
        }
        // check size and color

        for (let i = 0; i < $scope.listColor.length; i++) {
          let color = document.getElementById('Color' + $scope.listColor[i].id);
          if (color.checked == true) {
            let iddexQuantity = 0;
            let check = 0;
            for (let j = 0; j < $scope.listSize.length; j++) {
              let quantity = document.getElementById('Color' + $scope.listColor[i].id + 'Size' + $scope.listSize[j].id);
              if (quantity === null) {
                check++;
              }
              if (check === $scope.listSize.length) {
                Swal.fire('Vui lòng thêm ít nhất 1 kích thước cho màu ' + $scope.listColor[i].name + ' !', '', 'error');
                return;
              }
              if (quantity !== null) {

                if (quantity.value == 0) {
                  iddexQuantity++;
                }
                if (quantity.value < 0 || quantity > 999) {
                  Swal.fire('Số lượng size ' + $scope.listSize[j].name + ' màu ' + $scope.listColor[i].name + ' phải lớn hơn bằng 0 và nhỏ hơn 999 !', '', 'error');
                  return;
                }
                if (quantity.value.trim() === '') {
                  Swal.fire('Số lượng size ' + $scope.listSize[j].name + ' màu ' + $scope.listColor[i].name + ' không được bỏ trống !', '', 'error');
                  document.getElementById('Color' + $scope.listColor[i].id + 'Size' + $scope.listSize[j].id).value = 0;
                  return;
                }
              }
            }
            if (iddexQuantity === $scope.listSize.length) {
              Swal.fire('Vui lòng nhập số lượng kích thước tối thiểu cho màu ' + $scope.listColor[i].name + ' !', '', 'error');
              return;
            }
          }
        }
        $http.post("http://localhost:8080/api/product", {
          code: $scope.form.code,
          name: $scope.form.name,
          price: $scope.form.price,
          weight: $scope.form.weight,
          discount: phanTram,
          discountDate: discountDate,
          description: $scope.form.description,
          createBy: $rootScope.user.username,
          idCategory: $scope.get("category"),
          idBrand: $scope.get("brand"),
          idDesign: $scope.get("design"),
          idHandType: $scope.get("handType"),
          idNeckType: $scope.get("neckType")
        }).then(function (product) {

          //add image
          var img = new FormData();
          img.append("files", MainImage[0]);
          $http.post("http://localhost:8080/api/upload", img, {
            transformRequest: angular.identity,
            headers: {
              'Content-Type': undefined
            }
          }).then(function (upImage) {
            $http.post("http://localhost:8080/api/image", {
              url: upImage.data[0],
              mainImage: true,
              idProduct: product.data.id
            }).then(function (image) {
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
                    $http.post("http://localhost:8080/api/image", {
                      url: imagelist.data[i],
                      mainImage: false,
                      idProduct: product.data.id
                    });
                  })
                }

              }
            })
          })

          if (product.status === 200) {

            //add material
            let listMaterial = $scope.listMaterial;
            for (let i = 0; i < listMaterial.length; i++) {
              var checkMaterial = document.getElementById('Material' + listMaterial[i].id);
              if (checkMaterial.checked == true) {
                $http.post("http://localhost:8080/api/productdetail_material", {
                  idProduct: product.data.id,
                  idMaterial: listMaterial[i].id
                });
              }
            }
            // add size and color

            let listColor = $scope.listColor;
            let listSize = $scope.listSize;

            for (let i = 0; i < listColor.length; i++) {
              let color = document.getElementById('Color' + listColor[i].id);
              if (color.checked == true) {
                for (let j = 0; j < listSize.length; j++) {
                  let quantity = document.getElementById('Color' + listColor[i].id + 'Size' + listSize[j].id);

                  if (quantity !== null) {
                    if (quantity.value > 0) {
                      $http.post("http://localhost:8080/api/productdetail_color_size", {
                        idProduct: product.data.id,
                        idColor: listColor[i].id,
                        idSize: listSize[j].id,
                        quantity: quantity.value
                      })

                    }
                  }
                }
              }
            }

            Swal.fire('Thêm thành công !', '', 'success')
            setTimeout(() => {
              location.href = "#/product/view";
            }, 1000);

          }

        }).catch(function (error) {
          console.log(error.message);
          Swal.fire('Thêm thất bại !', '', 'error')
        })
      }
    }).catch(function (err) {
      if (err.status === 400) {
        $scope.validationErrors = err.data;
      }
      if (err.status === 404) {
        Swal.fire('Mã sản phẩm đã tồn tại !', '', 'error')
        $scope.validationErrors = [];
      }

    })



  }

  //update product
  $scope.update = function () {

    let id = $routeParams.id;
    $http.get("http://localhost:8080/api/product/" + id).then(function (detail) {
      $scope.history = detail.data;

    })
    $scope.get = function (name) {
      return document.getElementById(name).value;
    }
    let phanTram = 0;
    let discountDate = null;
    if (document.getElementById("giamGia").checked == true) {
      if (document.getElementById("khongGioiHan").checked == true) {
        phanTram = document.getElementById("phanTramGiamGia").value;
      }
      else {
        phanTram = document.getElementById("phanTramGiamGia1").value;
      }

    }
    if (document.getElementById("tamThoi").checked == true) {
      if (document.getElementById("thoiGianGiamGia").value === '') {
        Swal.fire('Vui lòng chọn thời gian kết thúc giảm giá !', '', 'error');
        return;
      }
      discountDate = document.getElementById("thoiGianGiamGia").value;
    }
    console.log(discountDate);

    //validate
    $http
      .post("http://localhost:8080/api/product/validateupdate", {
        code: $scope.form.code,
        name: $scope.form.name,
        price: $scope.form.price,
        weight: $scope.form.weight,
        discount: phanTram,
        description: $scope.form.description,
      })
      .then(function (vali) {
        if (vali.status === 200) {
          //validate
          $scope.validationErrors = [];
          let indexMaterial = 0;
          for (let i = 0; i < $scope.listMaterial.length; i++) {
            let checkIndexMaterial = document.getElementById(
              "Material" + $scope.listMaterial[i].id
            );
            if (checkIndexMaterial.checked == true) {
              indexMaterial++;
            }
          }
          let indexColor = 0;
          for (let i = 0; i < $scope.listColor.length; i++) {
            let checkIndexColor = document.getElementById(
              "Color" + $scope.listColor[i].id
            );
            if (checkIndexColor.checked == true) {
              indexColor++;
            }
          }
          if (indexMaterial === 0) {
            Swal.fire(
              "Vui lòng chọn ít nhất 1 chất liệu cho sản phẩm !",
              "",
              "error"
            );
            return;
          }
          if (indexColor === 0) {
            Swal.fire(
              "Vui lòng chọn ít nhất 1 màu sắc cho sản phẩm !",
              "",
              "error"
            );
            return;
          }
          // check size and color

          for (let i = 0; i < $scope.listColor.length; i++) {
            let color = document.getElementById(
              "Color" + $scope.listColor[i].id
            );
            if (color.checked == true) {
              let iddexQuantity = 0;
              let check = 0;
              for (let j = 0; j < $scope.listSize.length; j++) {
                let quantity = document.getElementById(
                  "Color" +
                  $scope.listColor[i].id +
                  "Size" +
                  $scope.listSize[j].id
                );
                if (quantity === null) {
                  check++;
                }
                if (check === $scope.listSize.length) {
                  Swal.fire(
                    "Vui lòng thêm ít nhất 1 kích thước cho màu " +
                    $scope.listColor[i].name +
                    " !",
                    "",
                    "error"
                  );
                  return;
                }
                if (quantity !== null) {
                  if (quantity.value == 0) {
                    iddexQuantity++;
                  }
                  if (quantity.value < 0 || quantity > 999) {
                    Swal.fire(
                      "Số lượng size " +
                      $scope.listSize[j].name +
                      " màu " +
                      $scope.listColor[i].name +
                      " phải lớn hơn bằng 0 và nhỏ hơn 999 !",
                      "",
                      "error"
                    );
                    return;
                  }
                  if (quantity.value.trim() === "") {
                    Swal.fire(
                      "Số lượng size " +
                      $scope.listSize[j].name +
                      " màu " +
                      $scope.listColor[i].name +
                      " không được bỏ trống !",
                      "",
                      "error"
                    );
                    document.getElementById(
                      "Color" +
                      $scope.listColor[i].id +
                      "Size" +
                      $scope.listSize[j].id
                    ).value = 0;
                    return;
                  }
                }
              }
              if (iddexQuantity === $scope.listSize.length) {
                Swal.fire(
                  "Vui lòng nhập số lượng kích thước tối thiểu cho màu " +
                  $scope.listColor[i].name +
                  " !",
                  "",
                  "error"
                );
                return;
              }
            }
          }
          Swal.fire({
            title: "Bạn có chắc muốn sửa ?",
            showCancelButton: true,
            confirmButtonText: "Sửa",
          }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
              // clear material and color size
              $http.delete(
                "http://localhost:8080/api/productdetail_material/" + id
              );
              $http.delete(
                "http://localhost:8080/api/productdetail_color_size/" + id
              );
              // update product
              $http
                .put("http://localhost:8080/api/product/update/" + id, {
                  name: $scope.form.name,
                  price: $scope.form.price,
                  weight: $scope.form.weight,
                  discount: phanTram,
                  description: $scope.form.description,
                  discountDate: discountDate,
                  updateBy: $rootScope.user.username,
                  idCategory: $scope.get("category"),
                  idBrand: $scope.get("brand"),
                  idDesign: $scope.get("design"),
                  idHandType: $scope.get("handType"),
                  idNeckType: $scope.get("neckType")
                })
                .then(function (product) {

                  // update image
                  var MainImage =
                    document.getElementById("fileUpload").files;
                  if (MainImage.length > 0) {
                    $http.delete(
                      "http://localhost:8080/api/image/" + product.data.id
                    );
                    var img = new FormData();
                    img.append("files", MainImage[0]);
                    $http
                      .post("http://localhost:8080/api/upload", img, {
                        transformRequest: angular.identity,
                        headers: {
                          "Content-Type": undefined,
                        },
                      })
                      .then(function (image) {
                        $http.post("http://localhost:8080/api/image", {
                          url: image.data[0],
                          mainImage: true,
                          idProduct: product.data.id,
                        });
                      });
                  }
                  var listImage = $scope.imagesList;

                  if (listImage.length > 0) {
                    var checkImg = true;

                    $http
                      .delete(
                        "http://localhost:8080/api/image/1/" +
                        product.data.id
                      )
                      .then(function () {
                        var img1 = new FormData();

                        for (var i = 0; i < listImage.length; i++) {
                          img1.append("files", listImage[i]);
                        }

                        $http
                          .post("http://localhost:8080/api/upload", img1, {
                            transformRequest: angular.identity,
                            headers: {
                              "Content-Type": undefined,
                            },
                          })
                          .then(function (imageList) {
                            var promises = [];

                            for (
                              var i = 0;
                              i < imageList.data.length;
                              i++
                            ) {
                              promises.push(
                                $http.post(
                                  "http://localhost:8080/api/image",
                                  {
                                    url: imageList.data[i],
                                    mainImage: false,
                                    idProduct: product.data.id,
                                  }
                                )
                              );
                            }

                            Promise.all(promises).then(function () {
                              for (
                                var i = 0;
                                i < $scope.images.length;
                                i++
                              ) {
                                if ($scope.images[i].startsWith("https")) {
                                  if ($scope.imageDelete.length > 0) {
                                    var deletePromises = [];

                                    for (
                                      var j = 0;
                                      j < $scope.imageDelete.length;
                                      j++
                                    ) {
                                      if (
                                        $scope.imageDelete[j] !==
                                        $scope.images[i]
                                      ) {
                                        deletePromises.push(
                                          $http.post(
                                            "http://localhost:8080/api/image",
                                            {
                                              url: $scope.images[i],
                                              mainImage: false,
                                              idProduct: product.data.id,
                                            }
                                          )
                                        );
                                      }
                                    }

                                    Promise.all(deletePromises).then(
                                      function () {
                                        // Các hành động khác sau khi xử lý xóa ảnh
                                      }
                                    );
                                  } else {
                                    if (checkImg) {
                                      checkImg = false;
                                      $http
                                        .post(
                                          "http://localhost:8080/api/image",
                                          {
                                            url: $scope.images[i],
                                            mainImage: false,
                                            idProduct: product.data.id,
                                          }
                                        )
                                        .then(function () {
                                          // Các hành động khác sau khi thêm ảnh mới
                                        });
                                    }
                                  }
                                }
                              }
                            });
                          });
                      });
                  }

                  if (listImage.length == 0) {
                    if ($scope.imageDelete.length > 0) {
                      $http
                        .delete(
                          "http://localhost:8080/api/image/1/" +
                          product.data.id
                        )
                        .then(function () {
                          var promises = [];

                          for (var i = 0; i < $scope.images.length; i++) {
                            if ($scope.images[i].startsWith("http")) {
                              promises.push(
                                $http.post(
                                  "http://localhost:8080/api/image",
                                  {
                                    url: $scope.images[i],
                                    mainImage: false,
                                    idProduct: product.data.id,
                                  }
                                )
                              );
                            }
                          }

                          Promise.all(promises).then(function () {
                            // Các hành động khác sau khi xử lý thêm ảnh khi không có ảnh mới
                          });
                        });
                    }
                  }

                  //update material
                  let listMaterial = $scope.listMaterial;
                  for (let i = 0; i < listMaterial.length; i++) {
                    var checkMaterial = document.getElementById(
                      "Material" + listMaterial[i].id
                    );
                    if (checkMaterial.checked == true) {
                      $http.post(
                        "http://localhost:8080/api/productdetail_material",
                        {
                          idProduct: product.data.id,
                          idMaterial: listMaterial[i].id,
                        }
                      );
                    }
                  }

                  // update size and color
                  let listColor = $scope.listColor;
                  let listSize = $scope.listSize;
                  for (let i = 0; i < listColor.length; i++) {
                    let color = document.getElementById(
                      "Color" + listColor[i].id
                    );
                    if (color.checked == true) {
                      for (let j = 0; j < listSize.length; j++) {
                        let quantity = document.getElementById(
                          "Color" + listColor[i].id + "Size" + listSize[j].id
                        );
                        if (quantity !== null) {
                          $http.post(
                            "http://localhost:8080/api/productdetail_color_size",
                            {
                              idProduct: product.data.id,
                              idColor: listColor[i].id,
                              idSize: listSize[j].id,
                              quantity: quantity.value,
                            }
                          );
                        }
                      }
                    }
                  }

                  Swal.fire("Sửa thành công !", "", "success");
                  setTimeout(() => {
                    location.href = "#/product/view";
                  }, 1000);
                })
                .catch(function (error) {
                  Swal.fire("Sửa thất bại !", "", "error");
                });
            }
          });
        }
      })
      .catch(function (err) {
        if (err.status === 400) {
          $scope.validationErrors = err.data;
        }
      });
  };
  //detail product
  $scope.detail = function () {
    let id = $routeParams.id;
    $http.get("http://localhost:8080/api/product/" + id).then(function (detail) {
      $scope.form = detail.data;

      for (let i = 0; i < detail.data.productImages.length; i++) {
        if (detail.data.productImages[i].mainImage === false) {
          $scope.images.push(detail.data.productImages[i].url);
        }

      }

      for (let i = 0; i < detail.data.productDetail_materials.length; i++) {
        document.getElementById('Material' + detail.data.productDetail_materials[i].material.id).checked = true;
      }
      for (let i = 0; i < detail.data.productDetail_size_colors.length; i++) {
        document.getElementById('Color' + detail.data.productDetail_size_colors[i].color.id).checked = true;
      }
      let listColor = $scope.listColor;
      for (let i = 0; i < listColor.length; i++) {
        var checkBox = document.getElementById('Color' + listColor[i].id);
        if (checkBox.checked == true) {
          $scope.checkbox(listColor[i].id);

        }
      }
      for (let i = 0; i < detail.data.productDetail_size_colors.length; i++) {
        if (!$scope.colorSizes[detail.data.productDetail_size_colors[i].color.id]) {
          $scope.colorSizes[detail.data.productDetail_size_colors[i].color.id] = []; // Khởi tạo mảng kích thước nếu chưa tồn tại
        }
        var newItem = {
          size: detail.data.productDetail_size_colors[i].size.id.toString(),
          quantity: detail.data.productDetail_size_colors[i].quantity.toString()
        };

        // Thêm newItem vào mảng kích thước của màu sắc tương ứng
        $scope.colorSizes[detail.data.productDetail_size_colors[i].color.id].push(newItem);

      }

      if ($scope.form.discount > 0) {
        document.getElementById("giamGia").checked = true;
        document.getElementById("giamGia1").style.display = 'block'
        if ($scope.form.discountDate != null) {
          document.getElementById("tamThoi").checked = true;
          document.getElementById("tamThoi1").style.display = 'block';
          document.getElementById("phanTramGiamGia1").style.display = 'block';
          document.getElementById("thoiGianGiamGia").style.display = 'block';
          document.getElementById("phanTramGiamGia").style.display = 'none';
          document.getElementById("phanTramGiamGia1").value = $scope.form.discount;
  
          // Format the discount date
          let discountDate = new Date($scope.form.discountDate);
          let formattedDate = discountDate.toISOString().split('T')[0];
          document.getElementById("thoiGianGiamGia").value = formattedDate;
          document.getElementById("thoiGianGiamGia").min = new Date().toISOString().split('T')[0];

        }
        else {
          document.getElementById("khongGioiHan").checked = true;
          document.getElementById("khongGioiHan1").style.display = 'block';
          document.getElementById("phanTramGiamGia1").style.display = 'none'
          document.getElementById("thoiGianGiamGia").style.display = 'none'
          document.getElementById("phanTramGiamGia").style.display = 'block';
          document.getElementById("phanTramGiamGia").value = $scope.form.discount;
        }
      }

    });
  };
  //delete product
  $scope.delete = function (idProduct) {
    Swal.fire({
      title: "Bạn có chắc muốn muốn dừng bán sản phẩm?",
      showCancelButton: true,
      confirmButtonText: "Dừng",
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        $http
          .put("http://localhost:8080/api/product/" + idProduct)
          .then(function (response) {
            if (response.status === 200) {
              Swal.fire("Dừng bán thành công !", "", "success");
              $scope.loadAll();
              $scope.loadDungHoatDong();
            } else {
              Swal.fire("Dừng bán thất bại !", "", "error");
            }
          });
      }
    });
  };
  $scope.delete1 = function (idProduct) {
    Swal.fire({
      title: "Bạn có chắc muốn cho phép bán lại sản phẩm?",
      showCancelButton: true,
      confirmButtonText: "Khôi phục",
    }).then((result) => {
      if (result.isConfirmed) {
        $http
          .put("http://localhost:8080/api/product/khoiphuc/" + idProduct)
          .then(function (response) {
            if (response.status === 200) {
              Swal.fire("Khôi phục thành công !", "", "success");
              //load product
              $http
                .get("http://localhost:8080/api/product/getall1")
                .then(function (response) {
                  $scope.listdhd = response.data;
                });
              $scope.loadAll();
            } else {
              Swal.fire("Khôi phục thất bại !", "", "error");
            }
          });
      }
    });
  };
  ///////////////////////////////////////////////////////////////////////////////
  //filter
  $scope.filter = function () {
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
    let idcate = (idCategory != '') ? idCategory : null;
    let idbrad = (idBrand != '') ? idBrand : null;
    let idmate = (idMaterial != '') ? idMaterial : null;
    let idcolor = (idColor != '') ? idColor : null;
    let idsize = (idSize != '') ? idSize : null;
    let idhand = (idHandType != '') ? idHandType : null;
    let idneck = (idNeckType != '') ? idNeckType : null;
    let iddesign = (idDesign != '') ? idDesign : null;
    var params = {
      idcategory: idcate,
      idmaterial: idmate,
      idcolor: idcolor,
      idsize: idsize,
      idbrand: idbrad,
      idhandtype: idhand,
      idnecktype: idneck,
      iddesign: iddesign,
      min: min,
      max: max
    };
    $http({
      method: 'GET',
      url: 'http://localhost:8080/api/product/filter',
      params: params
    }).then(function (resp) {
      $scope.list = resp.data;
      $scope.pager.first();
      // Swal.fire("Lọc thành công !","","success");
    });
  }

  const rangeMin = document.getElementById('rangeMin');
  const rangeMax = document.getElementById('rangeMax');
  const minDisplay = document.getElementById('min');
  const maxDisplay = document.getElementById('max');

  rangeMin.addEventListener('input', updateMinDisplay);
  rangeMax.addEventListener('input', updateMaxDisplay);

  function updateMinDisplay() {
    minDisplay.textContent = formatCurrency(rangeMin.value);
  }

  function updateMaxDisplay() {
    maxDisplay.textContent = formatCurrency(rangeMax.value);
  }

  function formatCurrency(amount) {
    return amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
  }

  ///////////////////////////////////////////////////////////////////////
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
      var Images = item.productImages
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
        Code: item.code,
        Name: item.name,
        Images: Images,
        Price: item.price,
        Description: item.description,
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