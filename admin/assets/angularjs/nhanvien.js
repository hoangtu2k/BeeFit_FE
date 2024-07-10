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
    $scope.addEmployee = function () {
        var idRole = document.getElementById("vaitro");
        var gender = true;
        if (document.getElementById("gtNu").checked == true) {
            gender = false;
        }
        var mainImg = document.getElementById("fileUpload").files;
        if (mainImg.length == 0) {
            Swal.fire("Vui long them anh dai dien cho nhan vien");
            return;
        }
        var img = new FormData();
        img.append("files", mainImg[0]);
        $http.post("http://localhost:8080/api/upload", img, {
            transformRequest: angular.identity,
            headers: {
                'Content-Type': undefined
            }
        }).then(function (upImage){
            const data = {

                fullname: $scope.form.fullname,
                username: $scope.form.username,
                password: $scope.form.password,
                image: upImage.data[0],
                gender: gender,
                phone: $scope.form.phone,
                email: $scope.form.email,
                idRole: idRole,
                createBy: $rootScope.user.username,
            };
            $http.post(url, data).then(function (resp) {
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
        })



    };
};
  