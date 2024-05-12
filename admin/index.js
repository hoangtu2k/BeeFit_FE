var app = angular.module("myApp", ["ngRoute"]);

app.config(function ($routeProvider, $locationProvider) {
    $locationProvider.hashPrefix("");
    $routeProvider       
        .when("/chart/view", {
            templateUrl: "thongke/index.html",
            controller: ThongKeController,
        })
        .when("/products/view", {
            templateUrl: "sanpham/index.html",
            controller: SanPhamController,
        })
        .when("/products/add", {
            templateUrl: "sanpham/add.html",
            controller: SanPhamController,
        })
        .when("/403", {
            templateUrl: "403.html",
        })
        .otherwise({
            redirectTo: "/products/view",
        });
});
