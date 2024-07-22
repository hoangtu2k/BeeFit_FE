window.ProfileController = function ($http, $scope, $rootScope, AuthService) {
    $scope.profile = function () {
        let IdCustomer = AuthService.getCustomer();

        $scope.profile = {
            fullname: '',
            phone: '',
            email: '',
            image: ''
        };
        $http.get("http://localhost:8080/api/customer/" + IdCustomer).then(function (resp) {
            $scope.profile = resp.data;
            $scope.anh = resp.data.image;
            if (resp.data.gender == true) {
                document.getElementById("gtNam").checked = true;
            } else {
                document.getElementById("gtNu").checked = true;

            }
        })

        $scope.update = function () {

            var gender = true;
            if (document.getElementById("gtNu").checked == true) {
                gender = false;

            }

            // update image
            var MainImage = document.getElementById("fileUpload").files;
            if (MainImage.length > 0) {
                var img = new FormData();
                img.append("files", MainImage[0]);
                $http.post("http://localhost:8080/api/upload", img, {
                    transformRequest: angular.identity,
                    headers: {
                        'Content-Type': undefined
                    }
                }).then(function (image) {
                    $http.put("http://localhost:8080/api/customer/updateprofile/" + IdCustomer, {
                        fullname: $scope.profile.fullname,
                        image: image.data[0],
                        gender: gender,
                        phone: $scope.profile.phone,
                        email: $scope.profile.email
                    }).then(function (resp) {
                        if (resp.status === 200) {
                            Swal.fire('Cập nhật thành công !', '', 'success')
                            setTimeout(() => {
                                location.reload();
                            }, 1000);
                        }
                    }).catch(function (err) {
                        if (err.status === 400) {
                            $scope.validationErrors = err.data;
                        }

                    })
                })
            }
            else {
                $http.put("http://localhost:8080/api/customer/updateprofile/" + IdCustomer, {
                    fullname: $scope.profile.fullname,
                    image: $scope.profile.image,
                    gender: gender,
                    phone: $scope.profile.phone,
                    email: $scope.profile.email
                }).then(function (resp) {
                    if (resp.status === 200) {
                        Swal.fire('Cập nhật thành công !', '', 'success')
                        setTimeout(() => {
                            location.reload();
                        }, 1000);
                    }
                }).catch(function (err) {
                    if (err.status === 400) {
                        $scope.validationErrors = err.data;
                    }

                })
            }

        }

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

                })
            })


        }

        $scope.listAddress = [];
        //load address by user

        $http.get("http://localhost:8080/api/address/" + IdCustomer).then(function (address) {
            $scope.listAddress = address.data;

        })
        
        $scope.delete = function (id) {
            $http.put("http://localhost:8080/api/address/delete/" + id)
                .then(function (resp) {
                    Swal.fire('Xóa thành công !', '', 'success');
                    $http.get("http://localhost:8080/api/address/" + IdCustomer)
                        .then(function (address) {
                            $scope.listAddress = address.data;
                        });
                });
        };

    }

    

    $scope.profile();
}