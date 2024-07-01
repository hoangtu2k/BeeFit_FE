window.HomeController = function ($http, $scope, $routeParams, $location, $rootScope, AuthService, $sce) {

  //load product ban chay
  $scope.listProductSold = [];
  $http.get("http://localhost:8080/api/product/getAllBanChay").then(function (response) {
    $scope.listProductSold = response.data;
  });
  // pagation
  $scope.pagerProductSold = {
    page: 0,
    size: 8,
    get items() {
      var start = this.page * this.size;
      return $scope.listProductSold.slice(start, start + this.size);
    },
    get count() {
      return Math.ceil((1.0 * $scope.listProductSold.length) / this.size);
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

  };



  $scope.loadProductNew = function () {
    let url = "http://localhost:8080/api/product/getall";
    let urlcategory = "http://localhost:8080/api/category";
    let urlbrand = "http://localhost:8080/api/brand";
    let urlneck = "http://localhost:8080/api/necktype";
    let urlhand = "http://localhost:8080/api/handtype";
    let urlmaterial = "http://localhost:8080/api/material";
    let urlcolor = "http://localhost:8080/api/color";
    let urlsize = "http://localhost:8080/api/size";
    let urldesign = "http://localhost:8080/api/design";

    //load product
    $scope.list = [];
    $http.get(url).then(function (response) {
      $scope.list = response.data;
    });
    // load category
    $scope.listCategory = [];
    $http.get(urlcategory).then(function (response) {
      $scope.listCategory = response.data;
    });
    // load brand
    $scope.listBrand = [];
    $http.get(urlbrand).then(function (response) {
      $scope.listBrand = response.data;
    });
    // load HandType
    $scope.listHandType = [];
    $http.get(urlhand).then(function (response) {
      $scope.listHandType = response.data;
    });
    // load NeckType
    $scope.listNeckType = [];
    $http.get(urlneck).then(function (response) {
      $scope.listNeckType = response.data;
    });
    // load material
    $scope.listMaterial = [];
    $http.get(urlmaterial).then(function (response) {
      $scope.listMaterial = response.data;
    });
    // load color
    $scope.listColor = [];
    $http.get(urlcolor).then(function (response) {
      $scope.listColor = response.data;
    });
    // load size
    $scope.listSize = [];
    $http.get(urlsize).then(function (response) {
      $scope.listSize = response.data;
    });
    // load design
    $scope.listDesign = [];
    $http.get(urldesign).then(function (response) {
      $scope.listDesign = response.data;
    });

    $scope.listBanner = [];
    $http.get("http://localhost:8080/api/banner").then(function (resp) {
      $scope.listBanner = resp.data;


      let numberOfSlides = resp.data.length;
      let keyframes = '';

      // Tính toán keyframes dựa vào số lượng slide
      keyframes += `15% { transform: translateX(0); } `;
      for (let i = 1; i < numberOfSlides; i++) {
        let percentage = 15 + (70 / (numberOfSlides - 1)) * i;
        keyframes += `${percentage}% { transform: translateX(-${i * 100}%); } `;
      }
      keyframes += `85% { transform: translateX(-${(numberOfSlides - 1) * 100}%); } `;

      // Thêm keyframes vào stylesheet
      let style = document.styleSheets[0];
      style.insertRule(`@keyframes slidehan { ${keyframes} }`, style.cssRules.length);

      // Gán keyframes cho phần tử có class là slide-wrapperhan
      document.getElementById("slide-wrapperhan").style.animation = `slidehan ${numberOfSlides * 5}s ease infinite`;


      // Get the slides container

      //  let banner = document.getElementById("banner");

      //  // Loop through the listBanner array and create slides dynamically
      //  $scope.listBanner.forEach(function(img) {
      //      // Create slide element
      //      var slide = document.createElement('div');
      //      slide.classList.add('slide');

      //      // Create slide content
      //      var slideContent = `
      //          <div class="blur-up lazyload bg-size">
      //              <img class="blur-up lazyload bg-img" data-src="${img.url}" src="${img.url}" alt="${img.content}" title="${img.content}" />
      //              <div class="slideshow__text-wrap slideshow__overlay classic bottom">
      //                  <div class="slideshow__text-content bottom">
      //                      <div class="wrap-caption center">
      //                          <h2 class="h1 mega-title slideshow__title">${img.content}</h2>
      //                      </div>
      //                  </div>
      //              </div>
      //          </div>
      //      `;

      //      // Set the HTML content of the slide
      //      slide.innerHTML = slideContent;

      //      // Append the slide to the banner
      //      banner.appendChild(slide);


      //  });


    })


    //load cart by user
    // $scope.listCart = [];
    // $http.get("http://localhost:8080/api/cart/1").then(function (cart) {
    //   $scope.listCart = cart.data;
    //   sessionStorage.setItem("listCart1",cart.data)
    //   $scope.tongTien = 0;
    //   for (let i = 0; i < $scope.listCart.length; i++) {
    //     $scope.tongTien +=
    //       $scope.listCart[i].unitPrice * $scope.listCart[i].quantity;
    //   }
    //   sessionStorage.setItem("tongTien",$scope.tongTien)
    // });


    // pagation
    $scope.pager = {
      page: 0,
      size: 16,
      get items() {
        var start = this.page * this.size;
        return $scope.list.slice(start, start + this.size);
      },
      get count() {
        return Math.ceil((1.0 * $scope.list.length) / this.size);
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
      },
    };


  };

  $scope.loadNew = function () {
    $scope.listNews = [];
    $scope.listN = [];
    $http.get("https://beebetanews-default-rtdb.firebaseio.com/news.json").then(function (resp) {
      $scope.listNews = resp.data;

      for (let key in resp.data) {
        if (resp.data.hasOwnProperty(key)) {
          const value = resp.data[key];

          var obj = {
            key: key,
            value: value
          };

          $scope.listN.push(obj);

        }
      }
      // Chuyển đổi thời gian thành timestamp
      $scope.listN.forEach(function (item) {
        item.value.timestamp = new Date(item.value.time).getTime();
      });

      // Sắp xếp theo timestamp
      $scope.listN.sort(function (a, b) {
        return b.value.timestamp - a.value.timestamp;
      });
      // pagation
      $scope.pagerNew1 = {
        page: 0,
        size: 4,
        get items() {
          var start = this.page * this.size;
          return $scope.listN.slice(start, start + this.size);
        },
        get count() {
          return Math.ceil((1.0 * $scope.listN.length) / this.size);
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

      };

    })
    $scope.detailNew = function () {
      var key = $routeParams.key;
      $http.get("https://beebetanews-default-rtdb.firebaseio.com/news/" + key + ".json").then(function (resp) {
        $scope.form = resp.data;
        // Tin tưởng nội dung HTML trước khi hiển thị
        $scope.trustedHtml = $sce.trustAsHtml($scope.form.content);

      })
    }

    // pagation
    $scope.pagerNew = {
      page: 0,
      size: 8,
      get items() {
        var start = this.page * this.size;
        return $scope.listN.slice(start, start + this.size);
      },
      get count() {
        return Math.ceil((1.0 * $scope.listN.length) / this.size);
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







    };
  }

  $scope.loadNew();

  $scope.loadProductNew();
  $scope.colorid = [];
  //load product new
  $scope.listProductNew = [];
  $http.get("http://localhost:8080/api/product/getall").then(function (response) {
    $scope.listProductNew = response.data;
  });
  // pagation
  $scope.pagerProductNew = {
    page: 0,
    size: 8,
    get items() {
      var start = this.page * this.size;
      return $scope.listProductNew.slice(start, start + this.size);
    },
    get count() {
      return Math.ceil((1.0 * $scope.list.length) / this.size);
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
    },

  };

  

};