window.DanhMucController = function ($scope, $http, $rootScope, AuthService) {
    document.getElementById('header-wrapper').style.display = 'block';
   
    let url = "http://localhost:8080/api/category";

    $scope.loadAll = function () {

        // Load promotion
        $scope.list = [];
        $http.get(url).then(function (response) {
            $scope.list = response.data;
        });

        // Pagination promotion
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
    $scope.loadAll();

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
    

    $scope.add = function () {

        if(document.getElementById("name").value == 0){
            Swal.fire('Không để trống tên !', '', 'warning');
            return;
        }

        const data = {
            name: $scope.form.name,         
            createBy: $rootScope.user.username,
        };

        $http.post(url,data).then(function(resp){
            if(resp.status === 200){
                Swal.fire('Thêm thành công !', '', 'success')
                setTimeout(() => {
                    location.href = "#/category/view";
                }, 1000);
                $scope.loadAll();
                $scope.openadddanhmuc();
            }
        }).catch(function (err){
            if (err.status === 400){
                $scope.validationErrors = err.data;
            }
    
        })

    };


    //open openeditdanhmuc
    $scope.issuadanhmuc = false;
    $scope.opensuadanhmuc = function (dm) {
        $scope.issuadanhmuc = !$scope.issuadanhmuc;
        $scope.form = angular.copy(dm);
    };

    $scope.update = function () {
        // Gọi API để cập nhật danh mục
        $http.put(url + "/" + $scope.form.id, $scope.form)
            .then(function (response) {
                // Xử lý kết quả thành công
                console.log('Cập nhật danh mục thành công:', response.data);
                // Cập nhật lại danh sách danh mục
                $scope.pagerdm.items[$scope.pagerdm.items.indexOf($scope.form)] = $scope.form;
                // Load all và Đóng popup
                $scope.loadAll();
                $scope.opensuadanhmuc(dm);
            }).catch(function (err){
                if (err.status === 400){
                    $scope.validationErrors = err.data;
                }
        
            })
    };

  
};