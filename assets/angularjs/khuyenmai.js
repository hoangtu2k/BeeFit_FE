window.KhuyenMaiController = function ($scope, $http, $location, $routeParams, $rootScope) {
    document.getElementById('header-wrapper').style.display = 'block';

    let url = "http://localhost:8080/api/promotion";
    let urlproduct = "http://localhost:8080/api/product/getall";

    $scope.loadAll = function () {

        // Load promotion
        $scope.list = [];
        $http.get(url).then(function (response) {
            $scope.list = response.data;
        });

        // Pagination promotion
        $scope.pagerkm = {
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

        // Load promotion
        $scope.listProduct = [];
        $http.get(urlproduct).then(function (response) {
            $scope.listProduct = response.data;
        });

        // Pagination product
        $scope.pagerpro = {
            page: 0,
            size: 5,
            get items() {
                var start = this.page * this.size;
                return $scope.listProduct.slice(start, start + this.size);
            },
            get count() {
                return Math.ceil(1.0 * $scope.listProduct.length / this.size);
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
    $scope.loadAll();

    /////////////////////////////////////////////////////////////////////

    if ($location.path() === "#/promotion/add") {

        $(document).ready(function () {
            $("#giamphantram").prop("checked", true);
        })

        document.getElementById("km").style.display = "block";

        // Lấy ngày hiện tại
        var today = new Date().toISOString().slice(0, 16);

        // Đặt thuộc tính min cho ô input datetime-local
        document.getElementById("ngaybatdau").min = today;
        document.getElementById("ngayhethan").min = today;
    }


    $scope.check = function () {
        if (document.getElementById("giamphantram").checked == true) {
            document.getElementById("km1").style.display = "none";
            document.getElementById("km").style.display = "block";
        } else {
            document.getElementById("km1").style.display = "block";
            document.getElementById("km").style.display = "none";
        }
    };

    $scope.form = {
        name: '',
        discountType: '',
        discount: '',
        cash: '',
        startdate: '',
        enddate: '',
    };



    //open openaddkhuyenmai
    $scope.isthemkhuyenmai = false;
    $scope.openaddkhuyenmai = function () {
        $scope.isthemkhuyenmai = !$scope.isthemkhuyenmai;
        $scope.form = {
            name: '',
            discountType: '',
            discount: '',
            cash: '',
            startdate: '',
            enddate: '',
        };
    };


    $scope.add = function () {

        let checkk2 = document.getElementById("giamtienmat").checked;
        let checkk1 = checkk2 ? $scope.form.cash : $scope.form.discount;

        // Kiểm tra giá trị giảm giá
        if (document.getElementById("giamphantram").checked) {
            if (!$scope.form.discount) {
                Swal.fire("Giá trị phần trăm giảm không bỏ trống !", "", "warning");
                return;
            }
        } else {
            if (!$scope.form.cash) {
                Swal.fire("Giá trị tiền giảm không bỏ trống !", "", "warning");
                return;
            }
        }

        // Kiểm tra ngày tháng
        let tungay = document.getElementById("ngaybatdau").value;
        let denngay = document.getElementById("ngayhethan").value;

        if (new Date(tungay) > new Date(denngay)) {
            Swal.fire("Ngày bắt đầu phải trước ngày hết hạn", "", "error");
            return;
        }

        const data = {
            name: $scope.form.name,
            discountType: checkk2,
            discount: !checkk2 ? checkk1 : null,
            cash: checkk2 ? checkk1 : null,
            startDate: tungay,
            endDate: denngay,
            createBy: $rootScope.user.username,
        };

        // Gửi yêu cầu validate
        $http.post("http://localhost:8080/api/promotion/validate", {
            name: $scope.form.name,
            endDate: $scope.form.enddate,
        }).then(function (vali) {
            if (vali.status === 200) {
                $http.post(url, data)
                    .then(function (resp) {
                        if (resp.status === 200) {
                            Swal.fire('Thêm thành công!', '', 'success');
                            setTimeout(() => {
                                location.href = "#/promotion/view";
                            }, 1000);
                            $scope.loadAll();
                            $scope.openaddkhuyenmai();
                        }
                    })
                    .catch(function (err) {
                        Swal.fire('Thêm thất bại!', '', 'error');
                        console.log(err.data);
                        if (err.status === 400) {
                            $scope.validationErrors = err.data;
                        }
                    });
            }
        }).catch(function (err) {
            if (err.status === 400) {
                $scope.validationErrors = err.data;
            }
            if (err.status === 409) { // Đổi từ 404 thành 409 cho conflict
                Swal.fire('Mã khuyến mãi đã tồn tại!', '', 'error');
                $scope.validationErrors = [];
            }
        });
    };

    $scope.formatDateTime = function (dateTimeString) {
        var date = new Date(dateTimeString);
        return date.toLocaleString(); // Sử dụng hàm toLocaleString() để định dạng theo cài đặt địa phương của trình duyệt
    };
}

