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
    $scope.isthemnhanvien = false;
    $scope.openaddnhanvien = function () {
        $scope.isthemnhanvien = !$scope.isthemnhanvien;

    };
    const urlRole = "http://localhost:8080/api/role";
    $scope.loadAllRole = function () {
        $scope.listRole = [];
        $http.get(urlRole).then(function (response) {
            $scope.listRole = response.data;
        })
    }
    $scope.loadAllRole();


    $scope.form = {
        fullname: '',
        username: '',
        password: '',
        image: '',
        gender: '',
        phone: '',
        email: '',
    }

    //add
    $scope.addEmployee = function () {
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
                createBy: $rootScope.user.username,
            }).then(function (resp) {
                if (resp.status === 200) {
                    Swal.fire('Thêm thành công !', '', 'success')
                    setTimeout(() => {
                        location.href = "#/employee/view";
                    }, 2000);
                    $scope.loadAll();
                    $scope.openaddnhanvien();
                }
            }).catch(function (err) {
                if (err.status === 400) {
                    console.log(err.data)
                    $scope.validationErrors = err.data;
                }

            })
        })
    }

    $scope.issuanhanvien = false;
    $scope.opensuanhanvien = function (nv) {
        $scope.issuanhanvien = !$scope.issuanhanvien;
        $scope.form = angular.copy(nv);
    };

};
