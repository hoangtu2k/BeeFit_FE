var app = angular.module("myApp", ["ngRoute"]);

app.config(function ($routeProvider, $locationProvider) {
  $locationProvider.hashPrefix("");
  $routeProvider

    .when("/sell/view", {
      templateUrl: "banhang/index.html",
      controller: BanHangController,
    })
    .when("/bill/view", {
      templateUrl: "hoadon/index.html",
      controller: HoaDonController,
    })
    .when("/bill/view/:code", {
      templateUrl: "hoadon/detail.html",
      controller: HoaDonController
    })

    .when("/chart/view", {
      templateUrl: "thongke/index.html",
      controller: ThongKeController,
    })

    .when("/product/view", {
      templateUrl: "sanpham/index.html",
      controller: SanPhamController,
    })
    .when("/product/add", {
      templateUrl: "sanpham/add.html",
      controller: SanPhamController,
    })
    .when("/product/update/:id", {
      templateUrl: "sanpham/update.html",
      controller: SanPhamController,
    })
    .when("/attributes/view", {
      templateUrl: "sanpham/thuoctinh/index.html",
      controller: ThuocTinhController,
    })

    .when("/banner/view", {
      templateUrl: "banner/index.html",
      controller: BannerController,
    })
    // .when("/news/view", {
    //   templateUrl: "tintuc/news.html",
    //   controller: TinTucController,
    // })

    .when("/customer/view", {
      templateUrl: "khachhang/index.html",
      controller: KhachHangController,
    })
    .when("/voucher/view", {
      templateUrl: "khuyenmai/index.html",
      controller: KhuyenMaiController,
    })
    .when("/voucher/update/:id", {
      templateUrl: "khuyenmai/update.html",
      controller: KhuyenMaiController,
    })


    .when("/forget", {
      templateUrl: "nhanvien/forget.html",
      controller: ForgetController,
    })
    .when("/login", {
      templateUrl: "nhanvien/login.html",
      controller: LoginAdminController,
    })
    .when("/employee/view", {
      templateUrl: "nhanvien/index.html",
      controller: NhanVienController,
    })
    .when("/profile", {
      templateUrl: "nhanvien/profile.html",
      controller: ProfileController,
    })



    .when("/403", {
      templateUrl: "403.html",
    })

    .otherwise({
      redirectTo: "/product/view",
    });
});

app.factory("AuthInterceptor", function ($location, AuthService) {
  return {
    request: function (config) {
      var token = AuthService.getToken();

      if (token === null && $location.path() !== '/login' && $location.path() !== '/forget') {
        $location.path('/login');
      }
      if (token !== null && $location.path() === '/login' || token !== null && $location.path() === '/forget') {

        $location.path('/product/view');
      }

      // phan quyen sau
      if (
        (parseInt(AuthService.getRole()) === 2 &&
          $location.path().startsWith("/employee/view")) ||
        (parseInt(AuthService.getRole()) === 2 &&
          $location.path().startsWith("/chart/view"))
      ) {
        $location.path("/403");
      }
      return config;
    },
  };
});

app.config(function ($httpProvider) {
  $httpProvider.interceptors.push("AuthInterceptor");
});
// Tạo một service để quản lý thông tin đăng nhập
app.factory("AuthService", function () {
  var authService = {};

  authService.saveToken = function (token) {
    localStorage.setItem("token", token);
  };

  authService.getToken = function () {
    return localStorage.getItem("token");
  };

  authService.clearToken = function () {
    localStorage.removeItem("token");
  };
  authService.saveId = function (id) {
    localStorage.setItem("id", id);
  };

  authService.getId = function () {
    return localStorage.getItem("id");
  };

  authService.clearId = function () {
    localStorage.removeItem("id");
  };
  authService.saveRole = function (id) {
    localStorage.setItem("role", id);
  };
  authService.getRole = function () {
    return localStorage.getItem("role");
  };
  authService.clearRole = function () {
    localStorage.removeItem("role");
  };

  return authService;
});

app.run(function ($rootScope, $http, AuthService) {
  if (AuthService.getToken() != null) {
    var token = AuthService.getToken();

    $http({
      method: "GET",
      url: "http://localhost:8080/api/auth/admin/get",
      params: { token: token },
    })
      .then(function (username) {
        $http
          .get(
            "http://localhost:8080/api/employee/getByUsername/" +
            username.data.username
          )
          .then(function (user) {
            $rootScope.user = user.data;
            AuthService.saveId(user.data.id);
            AuthService.saveRole(user.data.role.id);
          });
      })
      .catch(function (error) {
        console.log("Error fetching username:", error);
        // Xử lý lỗi ở đây nếu cần
      });
  }

  $rootScope.logout = function () {
    AuthService.clearToken();
    AuthService.clearId();
    AuthService.clearRole();
    $rootScope.user = null;
    location.href = "#/login";
  };
  $rootScope.submenu = false;
  $rootScope.menu = function () {
    $rootScope.submenu = !$rootScope.submenu;
  };
});
