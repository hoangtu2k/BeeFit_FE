window.NhanVienController = function ($scope, $http, $rootScope, AuthService) {
    document.getElementById('header-wrapper').style.display = 'block';

    const url = "http://localhost:8080/api/employee";
    $scope.loadAll = function () {
        $scope.list = [];
        $http.get(url).then(function (response) {
            $scope.list = response.data;
        })
    }
    $scope.loadAll();

    $scope.pagenhanvien = {
        page: 0,
        size: 5,
        get items() {
            var start = this.page * this.size;
            return $scope.list.slice(start, start + this.size);

        },
        get count() {
            return Math.ceil(1.0 * $scope.list.length / this.size);
        }
    }

    const urlRole = "http://localhost:8080/api/role";
    $scope.loadAllRole = function () {
        $scope.listRole = [];
        $http.get(urlRole).then(function (response) {
            $scope.listRole = response.data;
        })
    }
    $scope.loadAllRole();


    $scope.form = {
        code: '',
        fullname: '',
        username: '',
        password: '',
        image: '',
        gender: '',
        phone: '',
        status: '',
        email: '',
    }
    
    //add
    $scope.add = function () {
        var gender = true;
        if (document.getElementById("gtNu").checked == true) {
            gender = false;
        }
        var idRole = document.getElementById("vaitro").value;
        var MainImage = document.getElementById("fileUpload").files;
        if (MainImage.length == 0) {
            Swal.fire('Vui lòng thêm ảnh đại diện cho sản phẩm !', '', 'error');
            return;
        }
        var img = new FormData();
        img.append("files", MainImage[0]);
        $http.post("http://localhost:8080/api/upload", img, {
            transformRequest: angular.identity,
            headers: {
                'Content-Type': undefined
            }
        }).then(function (upImage) {
            $http.post(url, {
                code: $scope.form.code,
                fullname: $scope.form.fullname,
                username: $scope.form.username,
                password: $scope.form.password,
                image: upImage.data[0],
                gender: gender,
                phone: $scope.form.phone,
                email: $scope.form.email,
                idRole: idRole,
            }).then(function (resp) {
                if (resp.status === 200) {
                    Swal.fire('Thêm thành công !', '', 'success')
                    setTimeout(() => {
                        location.href = "#/employee/view";
                    }, 2000);
                }
            }).catch(function (err) {
                if (err.status === 400) {
                    console.log(err.data)
                    $scope.validationErrors = err.data;
                }

            })
        })
    }

    //update 
    $scope.update = function () {
        var gender = true;
        if (document.getElementById("gtNu").checked == true) {
            gender = false;
        }
        var idRole = document.getElementById("vaitro").value;

        //    var status = document.getElementById("trangthai").value;

        var MainImage = document.getElementById("fileUpload").files;
        // if (MainImage.length == 0){
        //     Swal.fire('Vui lòng thêm ảnh đại diện cho sản phẩm !', '', 'error');
        //     return;
        // }
        if (MainImage.length > 0) {
            var img = new FormData();
            img.append("files", MainImage[0]);
            $http.post("http://localhost:8080/api/upload", img, {
                transformRequest: angular.identity,
                headers: {
                    'Content-Type': undefined
                }
            }).then(function (upImage) {
                let id = $routeParams.id;
                $http.put("http://localhost:8080/api/employee/update/" + id, {
                    code: $scope.form.code,
                    fullname: $scope.form.fullname,
                    username: $scope.form.username,
                    password: $scope.form.password,
                    image: upImage.data[0],
                    gender: gender,
                    phone: $scope.form.phone,
                    email: $scope.form.email,
                    idRole: idRole,
                }).then(function (resp) {
                    if (resp.status === 200) {
                        Swal.fire('Sửa thành công !', '', 'success')
                        setTimeout(() => {
                            location.href = "#/employee/view";
                        }, 2000);
                    }
                }).catch(function (err) {
                    if (err.status === 400) {
                        $scope.validationErrors = err.data;
                    }

                })
            })
        } else {
            let id = $routeParams.id;
            $http.get("http://localhost:8080/api/employee/" + id).then(function (resp) {
                $http.put("http://localhost:8080/api/employee/update/" + id, {
                    code: $scope.form.code,
                    fullname: $scope.form.fullname,
                    username: $scope.form.username,
                    password: $scope.form.password,
                    image: resp.data.image,
                    gender: $scope.form.gender,
                    phone: $scope.form.phone,
                    email: $scope.form.email,
                    idRole: idRole,
                }).then(function (resp) {
                    if (resp.status === 200) {
                        Swal.fire('Sửa thành công !', '', 'success')
                        setTimeout(() => {
                            location.href = "#/employee/view";
                        }, 2000);
                    }
                }).catch(function (err) {
                    if (err.status === 400) {
                        $scope.validationErrors = err.data;
                    }

                })
            })


        }


    }
   
    // detail
    $scope.detail = function () {
        let id = $routeParams.id;
        $http.get("http://localhost:8080/api/employee/" + id).then(function (resp) {
            $scope.form = resp.data;
            if (resp.data.role.id == 1) {
                document.getElementById("qly").selected = true
            } else {
                document.getElementById("nv").selected = true
            }

            $scope.form = resp.data;
            if (resp.data.gender == true) {
                document.getElementById("gtNam").checked = true;
            } else {
                document.getElementById("gtNu").checked = true;

            }

            $scope.form = resp.data;
            if (resp.data.status == 0) {
                document.getElementById("lam").selected = true
            } else {
                document.getElementById("nghi").selected = true
            }
        })
    }

    $scope.chitiet = function (id) {
        $http.get("http://localhost:8080/api/employee/" + id).then(function (resp) {
            $scope.form = resp.data;
            if (resp.data.role.id == 1) {
                $scope.vaiTro = "Quản lý"
            } else {
                $scope.vaiTro = "Nhân viên"
            }

            $scope.form = resp.data;
            if (resp.data.gender == true) {
                $scope.gioiTinh = "Nam"
            } else {
                $scope.gioiTinh = "Nữ"

            }

            $scope.form = resp.data;
            if (resp.data.status == 0) {
                $scope.trangThai = "Đang hoạt động";
            } else {
                $scope.trangThai = "Dừng hoạt động";
            }
        })

        $scope.isChiTiet = !$scope.isChiTiet;
    }

};
