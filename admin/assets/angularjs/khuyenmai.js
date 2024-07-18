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

    //add
    $scope.add = function () {

        let checkk2 = document.getElementById("giamphantram").checked;
        let checkk1 = checkk2 ? $scope.form.discount : $scope.form.cash;

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

        var numberRegex = /^[0-9]+$/;
        if (!numberRegex.test(document.getElementById("qty").value)) {
            Swal.fire("Số lượng phải là số !!", "", "error");
            return;
        }

        if (!numberRegex.test(document.getElementById("km3").value)) {
            Swal.fire("Giá trị giảm phải là số !!", "", "error");
            return;
        } 

        if (!numberRegex.test(document.getElementById("km4").value)) {
            Swal.fire("Giá trị giảm phải là số !!", "", "error");
            return;
        } 

        let giaTriNhapVao = parseFloat(document.getElementById("km3").value);
        if (giaTriNhapVao < 0 || giaTriNhapVao > 100) {
            Swal.fire("% giảm phải nằm trong khoảng từ 0 đến 100", "", "error");
            return;
        }

        if (document.getElementById("qty").value < 1) {
            Swal.fire("Số lượng không hợp lệ", "", "error");
            return;
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
            discount: checkk2 ? checkk1 : null,
            cash: !checkk2 ? checkk1 : null,
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

        let id = $routeParams.id;
        $http.get("http://localhost:8080/api/voucher/" + id).then(function (detail) {
            $scope.history = detail.data;
        });

        let laGiamPhanTram = document.getElementById("giamphantram").checked;
        let giaTriGiam = laGiamPhanTram ? $scope.form.discount : $scope.form.cash;

        // Kiểm tra giá trị giảm giá
        if (laGiamPhanTram) {
            if (!$scope.form.discount) {
                Swal.fire("Giá trị phần trăm giảm không được để trống!", "", "warning");
                return;
            }
        } else {
            if (!$scope.form.cash) {
                Swal.fire("Giá trị tiền giảm không được để trống!", "", "warning");
                return;
            }
        }

        // Kiểm tra ngày tháng
        let ngayBatDau = document.getElementById("ngaybatdau").value;
        let ngayHetHan = document.getElementById("ngayhethan").value;

        if (new Date(ngayBatDau) > new Date(ngayHetHan)) {
            Swal.fire("Ngày bắt đầu phải trước ngày hết hạn", "", "error");
            return;
        }

        $http.put("http://localhost:8080/api/voucher/update/" + id, {
            code: $scope.form.code,
            name: $scope.form.name,
            discountType: laGiamPhanTram,
            discount: laGiamPhanTram ? giaTriGiam : null,
            cash: !laGiamPhanTram ? giaTriGiam : null,
            startDate: ngayBatDau,
            endDate: ngayHetHan,
            quantity: $scope.form.quantity
        }).then(function (resp) {
            if (resp.status === 200) {
                Swal.fire('Cập nhật thành công!', '', 'success');
                setTimeout(() => {
                    location.href = "#/voucher/view";
                }, 1000);
            }
        }).catch(function (err) {
            if (err.status === 400) {
                $scope.validationErrors = err.data;
            }
        });
    };

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

    $scope.detail = function () {
        let id = $routeParams.id;
        $http.get("http://localhost:8080/api/voucher/" + id).then(function (resp) {
            $scope.form = resp.data;


            if ($scope.form.startDate != null || $scope.form.endDate != null) {
                // Chuỗi thời gian từ SQL
                let startDate = new Date(resp.data.startDate);
                let endDate = new Date(resp.data.endDate);

                // Định dạng chuỗi thời gian 'yyyy-MM-dd'
                let formattedStartDate = startDate.toISOString().split('T')[0];
                let formattedEndDate = endDate.toISOString().split('T')[0];

                document.getElementById("ngaybatdau").value = formattedStartDate;
                document.getElementById("ngayhethan").value = formattedEndDate;
                document.getElementById("ngaybatdau").min = new Date().toISOString().split('T')[0];
                document.getElementById("ngayhethan").min = new Date().toISOString().split('T')[0];
            }

            // Hiển thị các phần tử dựa trên loại khuyến mãi
            if (resp.data.discountType) {
                document.getElementById("km").style.display = "block";
                document.getElementById("km1").style.display = "none";
            } else {
                document.getElementById("km").style.display = "none";
                document.getElementById("km1").style.display = "block";
            }

            // Thiết lập loại giảm giá
            $(document).ready(function () {
                if (resp.data.discountType) {
                    $("#giamphantram").prop("checked", true);
                } else {
                    $("#giamtienmat").prop("checked", true);
                }
            });

        });
    };

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




}

