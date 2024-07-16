window.ThuocTinhController = function ($scope, $http, $rootScope, AuthService) {
    document.getElementById('header-wrapper').style.display = 'block';

    let urlCategory = "http://localhost:8080/api/category";
    let urlDesign = "http://localhost:8080/api/design";
    let urlBrand = "http://localhost:8080/api/brand";
    let urlHandType = "http://localhost:8080/api/handtype";
    let urlNeckType = "http://localhost:8080/api/necktype";
    let urlMaterial = "http://localhost:8080/api/material";
    let urlColor = "http://localhost:8080/api/color";
    let urlSize = "http://localhost:8080/api/size";


    $scope.loadAllCategory = function () {

        // Load loadAllCategory
        $scope.list = [];
        $http.get(urlCategory).then(function (response) {
            $scope.list = response.data;
        });

        // Pagination loadAllCategory
        $scope.pagerdm = {
            page: 0,
            size: 5,
            get items() {
                var start = this.page * this.size;
                return $scope.list.slice(start, start + this.size);
            },
            get count() {
                return Math.ceil(1.0 * $scope.list.length / this.size);
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
    };
    $scope.loadAllDesign = function () {

        // Load loadAllDesign
        $scope.listDesign = [];
        $http.get(urlDesign).then(function (response) {
            $scope.listDesign = response.data;
        });

        // Pagination loadAllDesign
        $scope.pagertk = {
            page: 0,
            size: 5,
            get items() {
                var start = this.page * this.size;
                return $scope.listDesign.slice(start, start + this.size);
            },
            get count() {
                return Math.ceil(1.0 * $scope.listDesign.length / this.size);
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
    };
    $scope.loadAllBrand = function () {

        // Load loadAllDesign
        $scope.listBrand = [];
        $http.get(urlBrand).then(function (response) {
            $scope.listBrand = response.data;
        });

        // Pagination loadAllDesign
        $scope.pagerth = {
            page: 0,
            size: 5,
            get items() {
                var start = this.page * this.size;
                return $scope.listBrand.slice(start, start + this.size);
            },
            get count() {
                return Math.ceil(1.0 * $scope.listBrand.length / this.size);
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
    };
    $scope.loadAllHandType = function () {

        // Load loadAllDesign
        $scope.listHandType = [];
        $http.get(urlHandType).then(function (response) {
            $scope.listHandType = response.data;
        });

        // Pagination loadAllDesign
        $scope.pagerlt = {
            page: 0,
            size: 5,
            get items() {
                var start = this.page * this.size;
                return $scope.listHandType.slice(start, start + this.size);
            },
            get count() {
                return Math.ceil(1.0 * $scope.listHandType.length / this.size);
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

    };
    $scope.loadAllNeckType = function () {

        // Load loadAllNeckType
        $scope.listNeckType = [];
        $http.get(urlNeckType).then(function (response) {
            $scope.listNeckType = response.data;
        });

        // Pagination loadAllNeckType
        $scope.pagerlc = {
            page: 0,
            size: 5,
            get items() {
                var start = this.page * this.size;
                return $scope.listNeckType.slice(start, start + this.size);
            },
            get count() {
                return Math.ceil(1.0 * $scope.listNeckType.length / this.size);
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

    };
    $scope.loadAllMaterial = function () {

        // Load loadAllMaterial
        $scope.listMaterial = [];
        $http.get(urlMaterial).then(function (response) {
            $scope.listMaterial = response.data;
        });

        // Pagination loadAllMaterial
        $scope.pagercl = {
            page: 0,
            size: 5,
            get items() {
                var start = this.page * this.size;
                return $scope.listMaterial.slice(start, start + this.size);
            },
            get count() {
                return Math.ceil(1.0 * $scope.listMaterial.length / this.size);
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

    };
    $scope.loadAllColor = function () {

        // Load loadAllMaterial
        $scope.listColor = [];
        $http.get(urlColor).then(function (response) {
            $scope.listColor = response.data;
        });

        // Pagination loadAllMaterial
        $scope.pagerms = {
            page: 0,
            size: 5,
            get items() {
                var start = this.page * this.size;
                return $scope.listColor.slice(start, start + this.size);
            },
            get count() {
                return Math.ceil(1.0 * $scope.listColor.length / this.size);
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

    };
    $scope.loadAllSize = function () {

        // Load loadAllMaterial
        $scope.listSize = [];
        $http.get(urlSize).then(function (response) {
            $scope.listSize = response.data;
        });

        // Pagination loadAllMaterial
        $scope.pagerkc = {
            page: 0,
            size: 5,
            get items() {
                var start = this.page * this.size;
                return $scope.listSize.slice(start, start + this.size);
            },
            get count() {
                return Math.ceil(1.0 * $scope.listSize.length / this.size);
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

    };

    $scope.loadAllCategory();
    $scope.loadAllDesign();
    $scope.loadAllBrand();
    $scope.loadAllHandType();
    $scope.loadAllNeckType();
    $scope.loadAllMaterial();
    $scope.loadAllColor();
    $scope.loadAllSize();


    $scope.form = {
        name: '',
    };

    //open openadddanhmuc
    $scope.isthemdanhmuc = false;
    $scope.openadddanhmuc = function () {
        $scope.isthemdanhmuc = !$scope.isthemdanhmuc;
        $scope.form = {
            name: '',
        };
    };

    //open openaddthuonghieu
    $scope.isthemthuonghieu = false;
    $scope.openaddthuonghieu = function () {
        $scope.isthemthuonghieu = !$scope.isthemthuonghieu;
        $scope.form = {
            name: '',
        };
    };

    //open openaddthietke
    $scope.isthemthietke = false;
    $scope.openaddthietke = function () {
        $scope.isthemthietke = !$scope.isthemthietke;
        $scope.form = {
            name: '',
        };
    };

    //open openaddloaitay
    $scope.isthemloaitay = false;
    $scope.openaddloaitay = function () {
        $scope.isthemloaitay = !$scope.isthemloaitay;
        $scope.form = {
            name: '',
        };
    };

    //open openaddloaico
    $scope.isthemloaico = false;
    $scope.openaddloaico = function () {
        $scope.isthemloaico = !$scope.isthemloaico;
        $scope.form = {
            name: '',
        };
    };

    //open openaddchatlieu
    $scope.isthemchatlieu = false;
    $scope.openaddchatlieu = function () {
        $scope.isthemchatlieu = !$scope.isthemchatlieu;
        $scope.form = {
            name: '',
        };
    };

    //open openaddmausac
    $scope.isthemmausac = false;
    $scope.openaddmausac = function () {
        $scope.isthemmausac = !$scope.isthemmausac;
        $scope.form = {
            name: '',
        };
    };

    //open openaddmausac
    $scope.isthemkichco = false;
    $scope.openaddkichco = function () {
        $scope.isthemkichco = !$scope.isthemkichco;
        $scope.form = {
            name: '',
        };
    };




    // Open the edit category popup
    $scope.issuadanhmuc = false;
    $scope.opensuadanhmuc = function (dm) {
        $scope.issuadanhmuc = !$scope.issuadanhmuc;
        $scope.form = angular.copy(dm);
    };
    // Open the edit design popup
    $scope.issuathietke = false;
    $scope.opensuathietke = function (tk) {
        $scope.issuathietke = !$scope.issuathietke;
        $scope.form = angular.copy(tk);
    };
    // Open the edit brand popup
    $scope.issuathuonghieu = false;
    $scope.opensuathuonghieu = function (th) {
        $scope.issuathuonghieu = !$scope.issuathuonghieu;
        $scope.form = angular.copy(th);
    };
    // Open the edit handtype popup
    $scope.issualoaitay = false;
    $scope.opensualoaitay = function (lt) {
        $scope.issualoaitay = !$scope.issualoaitay;
        $scope.form = angular.copy(lt);
    };
    // Open the edit necktype popup
    $scope.issualoaico = false;
    $scope.opensualoaico = function (lc) {
        $scope.issualoaico = !$scope.issualoaico;
        $scope.form = angular.copy(lc);
    };
    // Open the edit material popup
    $scope.issuachatlieu = false;
    $scope.opensuachatlieu = function (cl) {
        $scope.issuachatlieu = !$scope.issuachatlieu;
        $scope.form = angular.copy(cl);
    };
    // Open the edit color popup
    $scope.issuamausac = false;
    $scope.opensuamausac = function (ms) {
        $scope.issuamausac = !$scope.issuamausac;
        $scope.form = angular.copy(ms);
    };
    // Open the edit size popup
    $scope.issuakichco = false;
    $scope.opensuakichco = function (kc) {
        $scope.issuakichco = !$scope.issuakichco;
        $scope.form = angular.copy(kc);
    };


    // function add thuộc tính
    $scope.addCategory = function () {

        // if(document.getElementById("name").value == 0){
        //     Swal.fire('Không để trống tên !', '', 'warning');
        //     return;
        // }

        const data = {
            name: $scope.form.name,
            createBy: $rootScope.user.username,
        };

        $http.post(urlCategory, data).then(function (resp) {
            if (resp.status === 200) {
                Swal.fire('Thêm thành công !', '', 'success')
                setTimeout(() => {
                    location.href = "#/attributes/view";
                }, 1000);
                $scope.loadAllCategory();
                $scope.openadddanhmuc();
            }
        }).catch(function (err) {
            if (err.status === 400) {
                $scope.validationErrors = err.data;
            }

        })

    };
    $scope.addDesign = function () {

        // if(document.getElementById("name").value == 0){
        //     Swal.fire('Không để trống tên !', '', 'warning');
        //     return;
        // }

        const data = {
            name: $scope.form.name,
            createBy: $rootScope.user.username,
        };

        $http.post(urlDesign, data).then(function (resp) {
            if (resp.status === 200) {
                Swal.fire('Thêm thành công !', '', 'success')
                setTimeout(() => {
                    location.href = "#/attributes/view";
                }, 1000);
                $scope.loadAllDesign();
                $scope.openaddthietke();
            }
        }).catch(function (err) {
            if (err.status === 400) {
                $scope.validationErrors = err.data;
            }

        })

    };
    $scope.addBrand = function () {

        // if(document.getElementById("name").value == 0){
        //     Swal.fire('Không để trống tên !', '', 'warning');
        //     return;
        // }

        const data = {
            name: $scope.form.name,
            createBy: $rootScope.user.username,
        };

        $http.post(urlBrand, data).then(function (resp) {
            if (resp.status === 200) {
                Swal.fire('Thêm thành công !', '', 'success')
                setTimeout(() => {
                    location.href = "#/attributes/view";
                }, 1000);
                $scope.loadAllBrand();
                $scope.openaddthuonghieu();
            }
        }).catch(function (err) {
            if (err.status === 400) {
                $scope.validationErrors = err.data;
            }
        })

    };
    $scope.addHandType = function () {

        // if(document.getElementById("name").value == 0){
        //     Swal.fire('Không để trống tên !', '', 'warning');
        //     return;
        // }

        const data = {
            name: $scope.form.name,
            createBy: $rootScope.user.username,
        };

        $http.post(urlHandType, data).then(function (resp) {
            if (resp.status === 200) {
                Swal.fire('Thêm thành công !', '', 'success')
                setTimeout(() => {
                    location.href = "#/attributes/view";
                }, 1000);
                $scope.loadAllHandType();
                $scope.openaddloaitay();
            }
        }).catch(function (err) {
            if (err.status === 400) {
                $scope.validationErrors = err.data;
            }

        })

    };
    $scope.addNeckType = function () {

        // if(document.getElementById("name").value == 0){
        //     Swal.fire('Không để trống tên !', '', 'warning');
        //     return;
        // }

        const data = {
            name: $scope.form.name,
            createBy: $rootScope.user.username,
        };

        $http.post(urlNeckType, data).then(function (resp) {
            if (resp.status === 200) {
                Swal.fire('Thêm thành công !', '', 'success')
                setTimeout(() => {
                    location.href = "#/attributes/view";
                }, 1000);
                $scope.loadAllNeckType();
                $scope.openaddloaico();
            }
        }).catch(function (err) {
            if (err.status === 400) {
                $scope.validationErrors = err.data;
            }

        })

    };
    $scope.addMaterial = function () {

        // if(document.getElementById("name").value == 0){
        //     Swal.fire('Không để trống tên !', '', 'warning');
        //     return;
        // }

        const data = {
            name: $scope.form.name,
            createBy: $rootScope.user.username,
        };

        $http.post(urlMaterial, data).then(function (resp) {
            if (resp.status === 200) {
                Swal.fire('Thêm thành công !', '', 'success')
                setTimeout(() => {
                    location.href = "#/attributes/view";
                }, 1000);
                $scope.loadAllMaterial();
                $scope.openaddchatlieu();
            }
        }).catch(function (err) {
            if (err.status === 400) {
                $scope.validationErrors = err.data;
            }

        })

    };
    $scope.addColor = function () {

        // if(document.getElementById("name").value == 0){
        //     Swal.fire('Không để trống tên !', '', 'warning');
        //     return;
        // }

        const data = {
            name: $scope.form.name,
            createBy: $rootScope.user.username,
        };

        $http.post(urlColor, data).then(function (resp) {
            if (resp.status === 200) {
                Swal.fire('Thêm thành công !', '', 'success')
                setTimeout(() => {
                    location.href = "#/attributes/view";
                }, 1000);
                $scope.loadAllColor();
                $scope.openaddmausac();
            }
        }).catch(function (err) {
            if (err.status === 400) {
                $scope.validationErrors = err.data;
            }

        })

    };
    $scope.addSize = function () {

        // if(document.getElementById("name").value == 0){
        //     Swal.fire('Không để trống tên !', '', 'warning');
        //     return;
        // }

        const data = {
            name: $scope.form.name,
            createBy: $rootScope.user.username,
        };

        $http.post(urlSize, data).then(function (resp) {
            if (resp.status === 200) {
                Swal.fire('Thêm thành công !', '', 'success')
                setTimeout(() => {
                    location.href = "#/attributes/view";
                }, 1000);
                $scope.loadAllSize();
                $scope.openaddkichco();
            }
        }).catch(function (err) {
            if (err.status === 400) {
                $scope.validationErrors = err.data;
            }

        })

    };


    // Update category function
    $scope.updateCategory = function () {
        // Log dữ liệu trước khi gọi API
        console.log('Cập nhật danh mục với dữ liệu:', $scope.form);

        // Gọi API để cập nhật danh mục
        $http.put(urlCategory + "/update/" + $scope.form.id, $scope.form)
            .then(function (response) {
                // Xử lý kết quả thành công
                console.log('Cập nhật danh mục thành công:', response.data);
                // Cập nhật lại danh sách danh mục
                const index = $scope.pagerdm.items.findIndex(item => item.id === $scope.form.id);
                if (index !== -1) {
                    $scope.pagerdm.items[index] = $scope.form;
                }
                Swal.fire('Sửa thành công !', '', 'success')
                // Load all và Đóng popup
                $scope.loadAllCategory();
                $scope.issuadanhmuc = false;
            }).catch(function (err) {
                // Log lỗi nếu có
                console.error('Cập nhật danh mục thất bại:', err);
                if (err.status === 400) {
                    $scope.validationErrors = err.data;
                } else {
                    Swal.fire('Có lỗi xảy ra!', '', 'error');
                }
            });
    };
    // Update design function
    $scope.updateDesign = function () {
        // Gọi API để cập nhật danh mục
        $http.put(urlDesign + "/update/" + $scope.form.id, $scope.form)
            .then(function (response) {
                // Cập nhật lại danh sách danh mục
                const index = $scope.pagertk.items.findIndex(item => item.id === $scope.form.id);
                if (index !== -1) {
                    $scope.pagertk.items[index] = $scope.form;
                }
                Swal.fire('Sửa thành công !', '', 'success')
                // Load all và Đóng popup
                $scope.loadAllDesign();
                $scope.issuathietke = false;
            }).catch(function (err) {
                // Log lỗi nếu có
                console.error('Cập nhật thiết kế thất bại:', err);
                if (err.status === 400) {
                    $scope.validationErrors = err.data;
                } else {
                    Swal.fire('Có lỗi xảy ra!', '', 'error');
                }
            });
    };
    // Update brand function
    $scope.updateBrand = function () {
        // Gọi API để cập nhật thương hiệu
        $http.put(urlBrand + "/update/" + $scope.form.id, $scope.form)
            .then(function (response) {
                // Cập nhật lại danh sách thương hiệu
                const index = $scope.pagerth.items.findIndex(item => item.id === $scope.form.id);
                if (index !== -1) {
                    $scope.pagerth.items[index] = $scope.form;
                }
                Swal.fire('Sửa thành công !', '', 'success')
                // Load all và Đóng popup
                $scope.loadAllBrand();
                $scope.issuathuonghieu = false;
            }).catch(function (err) {
                // Log lỗi nếu có
                console.error('Cập nhật thương hiệu thất bại:', err);
                if (err.status === 400) {
                    $scope.validationErrors = err.data;
                } else {
                    Swal.fire('Có lỗi xảy ra!', '', 'error');
                }
            });
    };
    // Update handtype function
    $scope.updateHandType = function () {
        // Gọi API để cập nhật thương hiệu
        $http.put(urlHandType + "/update/" + $scope.form.id, $scope.form)
            .then(function (response) {
                // Cập nhật lại danh sách thương hiệu
                const index = $scope.pagerlt.items.findIndex(item => item.id === $scope.form.id);
                if (index !== -1) {
                    $scope.pagerlt.items[index] = $scope.form;
                }
                Swal.fire('Sửa thành công !', '', 'success')
                // Load all và Đóng popup
                $scope.loadAllHandType();
                $scope.issualoaitay = false;
            }).catch(function (err) {
                // Log lỗi nếu có
                console.error('Cập nhật loại tay thất bại:', err);
                if (err.status === 400) {
                    $scope.validationErrors = err.data;
                } else {
                    Swal.fire('Có lỗi xảy ra!', '', 'error');
                }
            });
    };
    // Update brand function
    $scope.updateNeckType = function () {
        // Gọi API để cập nhật thương hiệu
        $http.put(urlNeckType + "/update/" + $scope.form.id, $scope.form)
            .then(function (response) {
                // Cập nhật lại danh sách thương hiệu
                const index = $scope.pagerlc.items.findIndex(item => item.id === $scope.form.id);
                if (index !== -1) {
                    $scope.pagerlc.items[index] = $scope.form;
                }
                Swal.fire('Sửa thành công !', '', 'success')
                // Load all và Đóng popup
                $scope.loadAllNeckType();
                $scope.issualoaico = false;
            }).catch(function (err) {
                // Log lỗi nếu có
                console.error('Cập nhật loại tay thất bại:', err);
                if (err.status === 400) {
                    $scope.validationErrors = err.data;
                } else {
                    Swal.fire('Có lỗi xảy ra!', '', 'error');
                }
            });
    };
    // Update brand function
    $scope.updateMaterial = function () {
        // Gọi API để cập nhật thương hiệu
        $http.put(urlMaterial + "/update/" + $scope.form.id, $scope.form)
            .then(function (response) {
                // Cập nhật lại danh sách thương hiệu
                const index = $scope.pagercl.items.findIndex(item => item.id === $scope.form.id);
                if (index !== -1) {
                    $scope.pagercl.items[index] = $scope.form;
                }
                Swal.fire('Sửa thành công !', '', 'success')
                // Load all và Đóng popup
                $scope.loadAllMaterial();
                $scope.issuachatlieu = false;
            }).catch(function (err) {
                // Log lỗi nếu có
                console.error('Cập nhật chất liệu thất bại:', err);
                if (err.status === 400) {
                    $scope.validationErrors = err.data;
                } else {
                    Swal.fire('Có lỗi xảy ra!', '', 'error');
                }
            });
    };
    // Update brand function
    $scope.updateColor = function () {
        // Gọi API để cập nhật thương hiệu
        $http.put(urlColor + "/update/" + $scope.form.id, $scope.form)
            .then(function (response) {
                // Cập nhật lại danh sách thương hiệu
                const index = $scope.pagerms.items.findIndex(item => item.id === $scope.form.id);
                if (index !== -1) {
                    $scope.pagerms.items[index] = $scope.form;
                }
                Swal.fire('Sửa thành công !', '', 'success')
                // Load all và Đóng popup
                $scope.loadAllColor();
                $scope.issuamausac = false;
            }).catch(function (err) {
                // Log lỗi nếu có
                console.error('Cập nhật màu sắc thất bại:', err);
                if (err.status === 400) {
                    $scope.validationErrors = err.data;
                } else {
                    Swal.fire('Có lỗi xảy ra!', '', 'error');
                }
            });
    };
    // Update brand function
    $scope.updateSize = function () {
        // Gọi API để cập nhật thương hiệu
        $http.put(urlSize + "/update/" + $scope.form.id, $scope.form)
            .then(function (response) {
                // Cập nhật lại danh sách thương hiệu
                const index = $scope.pagerkc.items.findIndex(item => item.id === $scope.form.id);
                if (index !== -1) {
                    $scope.pagerkc.items[index] = $scope.form;
                }
                Swal.fire('Sửa thành công !', '', 'success')
                // Load all và Đóng popup
                $scope.loadAllSize();
                $scope.issuakichco = false;
            }).catch(function (err) {
                // Log lỗi nếu có
                console.error('Cập nhật kích cỡ thất bại:', err);
                if (err.status === 400) {
                    $scope.validationErrors = err.data;
                } else {
                    Swal.fire('Có lỗi xảy ra!', '', 'error');
                }
            });
    };

};