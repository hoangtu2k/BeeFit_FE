window.KhuyenMaiController = function ($scope, $http, $location, $routeParams) {

    let url = "http://localhost:8080/api/voucher";
    $scope.selectedVoucherType = 'percentage';
    $scope.loadAll = function () {

        // load 
        $scope.list = [];
        $http.get(url).then(function (response) {
            $scope.list = response.data;
        })
        
        // pagation
        $scope.pager = {
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
    }
    $scope.loadAll();

    console.log($location.path())
    if ($location.path() === "/voucher/add") {
        $(document).ready(function () {
            {
                $("#giamtheobill").prop("checked", true);
            }
        })

        $(document).ready(function () {
            {
                $("#giamphantram").prop("checked", true);
            }
        })

        document.getElementById("km").style.display = "block"
        // Lấy ngày hiện tại
        var today = new Date().toISOString().slice(0, 16);

        // Đặt thuộc tính min cho ô input datetime-local
        document.getElementById("ngaybatdau").min = today;
        document.getElementById("ngayhethan").min = today;

    }


    
    $scope.check = function () {
        if (document.getElementById("giamphantram").checked == true) {
            document.getElementById("km1").style.display = "block";
            document.getElementById("km").style.display = "none";
        } else {
            document.getElementById("km1").style.display = "none";
            document.getElementById("km").style.display = "block";
        }

    }



    $scope.form = {
        code: '',
        name: '',
        typeVoucher: '',
        isVoucher: '',
        discount: '',
        cash: '',
        startdate: '',
        enddate: '',
        minimum: '',
    }

    //add
    $scope.add = function () {
        let checkk = true;
        if (document.getElementById("giamtheobill").checked === true) {
            checkk = false;
        }
        let checkk2 = true;
        if (document.getElementById("giamtienmat").checked === true) {
            checkk2 = false;
        }

        let checkk1 = '';
        if (document.getElementById("giamtienmat").checked === true) {
            checkk1 = $scope.form.cash

        }
        else {
            checkk1 = $scope.form.discount;
        }


        if (document.getElementById("giamphantram").checked === true) {
            if ($scope.form.discount === '') {
                Swal.fire("Giá trị phần trăm giảm không bỏ trống !", "", "warning")
                return;
            }
        }
        else {
            if ($scope.form.cash === '') {
                Swal.fire("Giá trị tiền giảm không bỏ trống !", "", "warning")
                return;
            }

        }

        let tungay = document.getElementById("ngaybatdau").value;
        let denngay = document.getElementById("ngayhethan").value;

        var startDate = new Date(tungay);
        var endDate = new Date(denngay);
        if (tungay > denngay) {
            Swal.fire("Ngày bắt đầu trước ngày hết hạn", "", "error");
            return;
        }

        $http.post(url, {
            code: $scope.form.code,
            name: $scope.form.name,
            typeVoucher: checkk2,
            isVoucher: checkk,
            discount: checkk1,
            cash: checkk1,
            startDate: $scope.form.startdate,
            endDate: $scope.form.enddate,
            minimum: 0,

        }).then(function (resp) {
            if (resp.status === 200) {
                Swal.fire('Thêm thành công !', '', 'success')
                setTimeout(() => {
                    location.href = "#/voucher/view";
                }, 2000);
            }
        }).catch(function (err) {
            if (err.status === 400) {
                console.log(err.data)
                $scope.validationErrors = err.data;
            }

        })
    }

    //update 
    $scope.update = function () {
        var startDate = document.getElementById("ngaybatdau").value;
        var endDate = document.getElementById("ngayhethan").value;
        let id = $routeParams.id;
        if ($scope.form.typeVoucher == true) {
            $scope.form.cash = null;
        } else {
            $scope.form.discount = null;
        }

        let checkk = true;
        if (document.getElementById("giamtheobill").checked === true) {
            checkk = false;
        }
        let checkk2 = true;
        if (document.getElementById("giamtienmat").checked === true) {
            checkk2 = false;
        }

        let checkk1 = '';
        if (document.getElementById("giamtienmat").checked === true) {
            checkk1 = document.getElementById("giamtien").value;

        }

        if (document.getElementById("giamphantram").checked === true) {
            checkk1 = document.getElementById("giamtram").value;
        }

        if (document.getElementById("giamphantram").checked === true) {
            if ($scope.form.discount === '') {
                Swal.fire("Giá trị phần trăm giảm không bỏ trống !", "", "warning")
                return;
            }
        }
        else {
            if ($scope.form.cash === '') {
                Swal.fire("Giá trị tiền giảm không bỏ trống !", "", "warning")
                return;
            }

        }

        let tungay = document.getElementById("ngaybatdau").value;
        let denngay = document.getElementById("ngayhethan").value;


        var startDate = new Date(tungay);
        var endDate = new Date(denngay);

        if (tungay > denngay) {
            Swal.fire("Ngày bắt đầu trước ngày hết hạn", "", "error");
            return;
        }

        console.log(checkk1);

        $http.put("http://localhost:8080/api/voucher/update/" + id, {
            code: $scope.form.code,
            name: $scope.form.name,
            typeVoucher: checkk2,
            isVoucher: checkk,
            discount: checkk1,
            cash: checkk1,
            startDate: startDate,
            endDate: endDate,
            minimum: 0,
        }).then(function (resp) {
            if (resp.status === 200) {
                Swal.fire('Sửa thành công !', '', 'success')
                setTimeout(() => {
                    location.href = "#/voucher/view";
                }, 2000);
            }
        }).catch(function (err) {
            if (err.status === 400) {
                $scope.validationErrors = err.data;
            }

        })
    }

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

    // detail khach hang
    $scope.detail = function () {
        let id = $routeParams.id;
        $http.get("http://localhost:8080/api/voucher/" + id).then(function (resp) {
            $scope.form = resp.data;


            console.log($scope.form);
            if (resp.data.typeVoucher == true) {

                // document.getElementById("giamphantram").checked = true;
                // document.getElementById("giamtienmat").checked = false;
                document.getElementById("km").style.display = "block";
                document.getElementById("km1").style.display = "none";
            } else {
                // document.getElementById("giamtienmat").checked = true
                // document.getElementById("giamphantram").checked = false;
                document.getElementById("km").style.display = "none";
                document.getElementById("km1").style.display = "block";
            }

            if (resp.data.isVoucher == false) {
                $(document).ready(function () {
                    {
                        $("#giamtheobill").prop("checked", true);
                    }
                })


            } else {
                $(document).ready(function () {
                    {
                        $("#giamtheosp").prop("checked", true);
                    }
                })

            }
            if (resp.data.typeVoucher == true) {
                $(document).ready(function () {
                    {
                        $("#giamphantram").prop("checked", true);
                    }
                })


            } else {
                $(document).ready(function () {
                    {
                        $("#giamtienmat").prop("checked", true);
                    }
                })

            }

            // if(resp.data.typeVoucher == true){
            //     document.getElementById("giamtheobill").checked = true 
            // }else{
            //     document.getElementById("giamsanpham").checked = true
            // }




            // Chuỗi thời gian từ SQL
            let sqlDateTimeString = $scope.form.startDate;

            // Chuyển đổi chuỗi thời gian SQL thành một đối tượng Date
            let date = new Date(sqlDateTimeString);

            // Lấy các thành phần của thời gian
            let year = date.getFullYear();
            let month = ('0' + (date.getMonth() + 1)).slice(-2);
            let day = ('0' + date.getDate()).slice(-2);
            let hours = ('0' + date.getHours()).slice(-2);
            let minutes = ('0' + date.getMinutes()).slice(-2);

            // Tạo chuỗi thời gian định dạng 'yyyy-MM-ddTHH:mm'
            let formattedDateTime = `${year}-${month}-${day}T${hours}:${minutes}`;

            // Đặt giá trị của ô input datetime-local
            document.getElementById("ngaybatdau").value = formattedDateTime;

            // Chuỗi thời gian từ SQL
            let sqlDateTimeString1 = $scope.form.endDate;

            // Chuyển đổi chuỗi thời gian SQL thành một đối tượng Date
            let date1 = new Date(sqlDateTimeString1);

            // Lấy các thành phần của thời gian
            let year1 = date1.getFullYear();
            let month1 = ('0' + (date1.getMonth() + 1)).slice(-2);
            let day1 = ('0' + date1.getDate()).slice(-2);
            let hours1 = ('0' + date1.getHours()).slice(-2);
            let minutes1 = ('0' + date1.getMinutes()).slice(-2);

            // Tạo chuỗi thời gian định dạng 'yyyy-MM-ddTHH:mm'
            let formattedDateTime1 = `${year1}-${month1}-${day1}T${hours1}:${minutes1}`;

            // Đặt giá trị của ô input datetime-local
            document.getElementById("ngayhethan").value = formattedDateTime1;


        })

    }

    //appear box
    $scope.appear = function () {

    }
    //export exel
    $scope.exportToExcel = function () {
        Swal.fire({
            title: 'Bạn có chắc muốn xuất Exel ?',
            showCancelButton: true,
            confirmButtonText: 'Xuất',
        }).then((result) => {
            if (result.isConfirmed) {
                // Chuyển dữ liệu thành một mảng các đối tượng JSON
                var dataArray = $scope.list.map(function (item) {
                    return {
                        Id: item.id,
                        Code: item.code,
                        Name: item.name,
                        typeVoucher: item.typeVoucher,
                        // typeVoucher: item.typeVoucher,
                        isVoucher: item.isVoucher,
                        // isVoucher: item.isVoucher,
                        Discount: item.discount,
                        Cash: item.cash,
                        StartDate: item.startDate,
                        // StartDate: item.startdate,
                        EndDate: item.endDate,
                        // EndDate: item.enddate,
                    };
                });

                // Tạo một workbook mới
                var workbook = XLSX.utils.book_new();

                // Tạo một worksheet từ dữ liệu
                var worksheet = XLSX.utils.json_to_sheet(dataArray);

                // Thêm worksheet vào workbook
                XLSX.utils.book_append_sheet(workbook, worksheet, 'Data Sheet');

                // Xuất tệp Excel
                XLSX.writeFile(workbook, 'data' + new Date() + '.xlsx');
                Swal.fire("Xuất file exel thành công !", "", "success");
            }
        })

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
                $scope.pager.first();
            })
        }
    }
    $scope.formatDateTime = function (dateTimeString) {
        var date = new Date(dateTimeString);
        return date.toLocaleString(); // Sử dụng hàm toLocaleString() để định dạng theo cài đặt địa phương của trình duyệt
    };
}

