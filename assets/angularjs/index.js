var app = angular.module("myApp", ["ngRoute"]);

app.config(function ($routeProvider, $locationProvider) {
    $locationProvider.hashPrefix("");
    $routeProvider       
        .when("/sell/view", {
            templateUrl: "banhang/index.html",
            controller: BanHangController,
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
        .when("/login", {
            templateUrl: "nhanvien/login.html",
            controller: LoginAdminController,
        })
        .when("/403", {
            templateUrl: "403.html",
        })
        .otherwise({
            redirectTo: "/product/view",
        });
});

