window.KhuyenMaiController = function ($scope, $http, $location, $routeParams, $rootScope) {
    document.getElementById('header-wrapper').style.display = 'block';

    let url = "http://localhost:8080/api/voucher";

    $scope.loadAll = function () {
        // Load promotion
        $scope.list = [];
        $http.get(url).then(function (response) {
            $scope.list = response.data;
        });
    };
    $scope.loadAll();

    // Pagination
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

    // search by name
    $scope.search = function () {
        var name = document.getElementById("name").value;
        if (name.trim().length === 0) {
            Swal.fire("Nhập tên trước khi tìm kiếm...", "", "error");
        }
        else {
            $http.get("http://localhost:8080/api/voucher/search/" + name).then(function (search) {
                $scope.list = search.data;
                $scope.pagerkm.first();
            })
        }
    }

    $scope.form = {
        code: '',
        name: '',
        discountType: '',
        discount: '',
        cash: '',
        startdate: '',
        enddate: '',
        quantity: '',
    }

    //open openaddkhuyenmai
    $scope.isthemkhuyenmai = false;
    $scope.openaddkhuyenmai = function () {
        $scope.isthemkhuyenmai = !$scope.isthemkhuyenmai;
        $scope.form = {
            code: '',
            name: '',
            discountType: '',
            discount: '',
            cash: '',
            startdate: '',
            enddate: '',
            quantity: '',
        }
    };

    // Open the edit khuyenmai
    $scope.issuakhuyenmai = false;
    $scope.opensuakhuyenmai = function (km) {
        $scope.issuakhuyenmai = !$scope.issuakhuyenmai;
        $scope.form = angular.copy(km);
    };

    //add
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

        $http.post(url, {
            code: $scope.form.code,
            name: $scope.form.name,
            discountType: checkk2,
            discount: !checkk2 ? checkk1 : null,
            cash: checkk2 ? checkk1 : null,
            startDate: tungay,
            endDate: denngay,
            quantity: $scope.form.quantity,
            createBy: $rootScope.user.username,
        }).then(function (resp) {
            if (resp.status === 200) {
                Swal.fire('Thêm thành công !', '', 'success')
                setTimeout(() => {
                    location.href = "#/voucher/view";
                }, 1000);             
                $scope.loadAll();
                $scope.openaddkhuyenmai();
            }
        }).catch(function (err) {
            if (err.status === 400) {
                console.log(err.data)
                $scope.validationErrors = err.data;
            }
        })
    };

    //update
    $scope.update = function () {
        
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

        console.log(checkk1);

        $http.put("http://localhost:8080/api/voucher/update/" + id, {
            code: $scope.form.code,
            name: $scope.form.name,
            discountType: checkk2,
            discount: !checkk2 ? checkk1 : null,
            cash: checkk2 ? checkk1 : null,
            startDate: tungay,
            endDate: denngay,
            quantity: $scope.form.quantity,
            updateBy: $rootScope.user.username,
        }).then(function (resp) {
            if (resp.status === 200) {
                Swal.fire('Sửa thành công !', '', 'success')
                setTimeout(() => {
                    location.href = "#/voucher/view";
                }, 2000);
                $scope.loadAll();
                $scope.issuakhuyenmai = false;
            }
        }).catch(function (err) {
            if (err.status === 400) {
                $scope.validationErrors = err.data;
            }

        })
    }

    //delete
    $scope.delete = function (id) {
        Swal.fire({
            title: 'Bạn có chắc muốn xóa ?',
            showCancelButton: true,
            confirmButtonText: 'Xóa',
        }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                $http.put("http://localhost:8080/api/voucher/delete/" + id).then(function (response) {
                    if (response.status === 200) {
                        Swal.fire('Xóa thành công !', '', 'success')
                        $scope.loadAll();
                    }
                    else {
                        Swal.fire('Xóa thất bại !', '', 'error')
                    }
                })
            }
        })
    }

    /////////////////////////////////////////////////////////////////////

    if ($location.path() === "#/voucher/add") {

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

    

    


    $scope.formatDateTime = function (dateTimeString) {
        var date = new Date(dateTimeString);
        return date.toLocaleString(); // Sử dụng hàm toLocaleString() để định dạng theo cài đặt địa phương của trình duyệt
    };
}

