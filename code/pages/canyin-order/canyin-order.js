-21// pages/oder/oder.js

var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    default_image: '../../img/default-image.png',
    index:0,
    page: 0,
    //返回分页数据的总页数
    total_page: 1,
    ordersList:[],
    stream_icon: "img/cricle.png",
    yunfei_total: 0,
    daifukuan: [],
    daifahuo: [],
    yifahuo: [],
    wanchang: [],
    imgurl: app.globalData.imgUrl + '/',  //图片地址
    btns: [],    //按钮组
    status: '',  //订单分组
    order: [],
    now_order_message: {},
    // 现在所处的菜单项，待付款和代发货为true，已发货和完成订单为false
    now_list: true,
    navItems: [{
      name: '待付款',
      checked: true
    }, {
      name: '待收货',
      checked: false
    }, {
      name: '待评价',
      checked: false
    }, {
        name: '退款/售后',
      checked: false
    }]

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    this.setData({
      bindDownLoad: true,
      orders:{
        data: [{
          tel:'18888888888',
          create_time: '2018-02-02 12:34',
          img: '../../img/shangjia.png',
          name: '猫人内衣旗舰店',
          //订单状态
          status: '待收货/自提',
          //挨着时间的状态
          timeStatus: '下单',
          goods: [
            {
              image: '../../img/banner.png',
              name: '小米净化米净化米净化米净化米净化米净化米净化器',
              goods_price: '15.9',
              num: 2
            },
            {
              image: '../../img/banner.png',
              name: '小米净化米净化米净化米净化米净化米净化米净化器',
              goods_price: '15.9',
              num: 2
            }
          ]
        }, {
          tel: '1886666666',
          create_time: '2018-02-02 12:34',
          img: '../../img/shangjia.png',
          name: '猫人内衣旗舰店',
          //订单状态
          status: '待收货/自提',
          //挨着时间的状态
          timeStatus: '下单',
          goods: [
            {
              image: '../../img/banner.png',
              name: '小米净化米净化米净化米净化米净化米净化米净化器',
              goods_price: '15.9',
              num: 2
            },
            {
              image: '../../img/banner.png',
              name: '小米净化米净化米净化米净化米净化米净化米净化器',
              goods_price: '15.9',
              num: 2
            }
          ]
          }, {
            tel: '1883333333',
            create_time: '2018-02-02 12:34',
            img: '../../img/shangjia.png',
            name: '猫人内衣旗舰店',
            //订单状态
            status: '待收货/自提',
            //挨着时间的状态
            timeStatus: '下单',
            goods: [
              {
                image: '../../img/banner.png',
                name: '小米净化米净化米净化米净化米净化米净化米净化器',
                goods_price: '15.9',
                num: 2
              },
              {
                image: '../../img/banner.png',
                name: '小米净化米净化米净化米净化米净化米净化米净化器',
                goods_price: '15.9',
                num: 2
              }
            ]
        }, {
          tel: '1999999999',
          create_time: '2018-02-02 12:34',
          img: '../../img/shangjia.png',
          name: '猫人内衣旗舰店',
          //订单状态
          status: '待收货/自提',
          //挨着时间的状态
          timeStatus: '下单',
          goods: [
            {
              image: '../../img/banner.png',
              name: '小米净化米净化米净化米净化米净化米净化米净化器',
              goods_price: '15.9',
              num: 2
            },
            {
              image: '../../img/banner.png',
              name: '小米净化米净化米净化米净化米净化米净化米净化器',
              goods_price: '15.9',
              num: 2
            }
          ]
        },
        ]
      },
      btns: ['去付款','联系商家'],
    })
    //获取屏幕高度
    wx.getSystemInfo({
      success: function (res) {
        console.info(res.windowHeight);
        that.setData({
          scrollHeight: res.windowHeight
        });
      }
    });
    // this.loadData(1);
    
  },

  // 下拉加载更多数据
  bindDownLoad: function (e) {
    var index = this.data.index+1
    this.loadData(index)
  },

  //加载数据
  loadData: function (index) {
    var user_id = wx.getStorageSync('user_id')
    var that = this;
    console.log('======', parseInt(that.data.page) , parseInt(that.data.total_page))
    if (that.data.bindDownLoad && parseInt(that.data.page) < parseInt(that.data.total_page)){

      //加载数据
      wx.showLoading({
        title: '加载中',
      })
      setTimeout(function () {
        wx.hideLoading()
      }, 600)
      
      that.setData({
        status: index,
        bindDownLoad: false
      })
      //获取订单信息
      let extData = wx.getExtConfigSync();
      let appid = extData.authorizer_appid;
      wx.request({
        header: {
          'data': appid
        },
        url: app.globalData.rootUrl + '/info/my_order',
        data: {
          user_id: user_id,
          status: index,
          page: parseInt(that.data.page) + 1
        },
        success: function (res) {
          //请求数据
          console.log('订单返回数据', res.data)
          console.log('订单返回数据', res.data.data)
          //返回的数据总数
          var total_goodsList = res.data.total
          //防止整除的时候最后一页一直请求，所以减1
          var total_page = parseInt((total_goodsList - 1) / res.data.per_page) + 1
          //物流信息
          var stream_list = []
          //组装数据
          //求订单价钱总和
          console.log(res.data.data.length);
          var orders = that.data.orders || new Object()
          orders.data = that.data.orders.data || []
          for (var i = 0; i < res.data.data.length; i++) {
            var sum = 0;
            var count = 0;
            var yunfei_total = that.data.yunfei_total
            if (res.data.data[i].goods != null) {
              for (var j = 0; j < res.data.data[i].goods.length; j++) {
                sum += res.data.data[i].goods[j].num * res.data.data[i].goods[j].goods_price;
                count += res.data.data[i].goods[j].num * res.data.data[i].goods[j].original_price;
                yunfei_total += parseFloat(that.toDecimal(res.data.data[i].goods[j].delivery_money))
              }
              res.data.data[i].goods_total = that.toDecimal(sum) + that.toDecimal(yunfei_total) - (res.data.data[i].coupons_price || 0)
              res.data.data[i].original_total = that.toDecimal(count);
            }
            console.log('订单总运费', yunfei_total)
          } 
          var orderList = that.data.ordersList || []
          for (var i in res.data.data) {
            orders.data.push(res.data.data[i])
          }
          //按钮组
          var btns = [];
          switch (index) {
            case 1:
              btns = ['查看详情', '取消订单', '付款'];
              break;
            case 2:
              btns = ['查看详情', '取消订单'];
              // btns = ['查看详情'];
              break;
            case 3:
              // btns = ['查看详情', '取消订单', '再次购买'];
              btns = ['查看详情', '确认收货'];
              break;
            case 4:
              // btns = ['查看详情', '取消订单', '评价'];
              btns = ['查看详情'];
              break;
          }
          console.log('??????', res.data.data)
          console.log('??????orderList', orderList)
          that.setData({
            orders: orders,
            orderList: orderList,
            page: res.data.current_page,
            btns: btns,
            total_page: total_page
          })
          console.log('that.data.orders', that.data.orders);


        }
      })

      //2000ms之后才可以继续加载，防止加载请求过多
      setTimeout(function () {
        that.setData({
          bindDownLoad: true
        })
      }, 1000)
    }
    
  },

  /* ===选择顶部菜单 */
  checked: function (e) {
    var that = this
    var index = e.target.dataset.index;
    if(index === that.data.index){
      return
    }else{
      var all_order_message = that.data.order;
      // 标题
      var navItems = that.data.navItems
      // 取消所有title的选中
      for (var i = 0; i < navItems.length; i++) {
        navItems[i]['checked'] = false
      };
      // 选中当前title
      navItems[index]['checked'] = true
      // 需要展示的数据列表
      // 需要修改的按钮内容

      //只有待收货订单会有物流信息
      var now_list = that.data.now_list;
      if (index === 2) {
        now_list = false;
      } else {
        now_list = true;
      }
      that.setData({
        // orders: {},
        orderList: [],
        page: 0,
        bindDownLoad: true,
        index: index,
        now_order_message: all_order_message[index],
        navItems: navItems,
        now_list: now_list,
        bindDownLoad: true,
      })
      // that.loadData(index + 1);
    }
  },
  goPage: function () {
    var navItems = this.data.navItems;
    for (var i = 0; i < navItems.length; i++) {
      if (navItems[i]['checked'] && navItems[i]['nextPage']) {
        wx.navigateTo({
          url: navItems[i]['nextPage']
        });
        break
      }
    };

  },
  //点击各个button的事件
  clickBtn: function (e) {
    var that = this
    var user_id = wx.getStorageSync('user_id')
    var go = function(e) {
      if (e.target.dataset.page === '取消订单') {
        var ordersn = e.target.dataset.ordersn;
        console.log(ordersn);
        wx.showModal({
          title: '提示',
          content: '确定取消订单？',
          success: function (res) {
            if (res.confirm) {
              let extData = wx.getExtConfigSync();
              let appid = extData.authorizer_appid;
              wx.request({
                header: {
                  'data': appid
                },
                url: app.globalData.rootUrl + '/info/del_order',
                data: {
                  ordersn: ordersn
                },
                success: function (res) {
                  console.log('取消订单的返回字段', res.data);
                  that.setData({
                    page:0,
                    orders:{}
                  })
                  that.loadData(that.data.status);
                  wx.showToast({
                    title: res.data.message,
                    //删除订单之后刷新页面数据
                    success: function (res) {
                    }
                  })
                }
              })
              console.log('用户点击确定')
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      }
      if (e.target.dataset.page === '查看详情') {
        var now_ordersn = e.target.dataset.ordersn
        var now_all_price = e.target.dataset.now_all_price
        wx.setStorageSync('now_ordersn', now_ordersn)
        wx.setStorageSync('now_all_price', now_all_price)
        wx.navigateTo({
          url: "../order_detail/order_detail"
        });
      }
      if (e.target.dataset.page === '确认收货') {
        var now_ordersn = e.target.dataset.ordersn
        let extData = wx.getExtConfigSync();
        let appid = extData.authorizer_appid;
        wx.request({
          header: {
            'data': appid
          },
          url: app.globalData.rootUrl + '/order/confirm',
          data: {
            ordersn: now_ordersn,
            user_id: user_id
          },
          success: function (res) {
            console.log('确认收货的返回字段', res.data);
            that.setData({
              page: 0,
              orders: {}
            })
            wx.showToast({
              title: res.data.message,
              success: function (res) {
                that.loadData(that.data.status);
              }
            })
          }
        })
      }
      // if (e.target.dataset.page === '再次购买') {
      //   var ordersn = e.target.dataset.ordersn;
      //   //订单中商品
      //   var orders = that.data.orders
      //   var goods
      //   for (var i in orders.data) {
      //     if (orders.data[i].ordersn === ordersn) {
      //       // console.log('订单中的商品', orders.data[i].goods)
      //       goods = orders.data[i].goods
      //     }
      //   }
      //   console.log('订单中的商品', goods)
      //   //将订单中的商品全部加入购物车
      //   for (var i in goods) {
      //     var norms_id = goods[i].norms_id || ''
      //     var num = goods[i].num || 1
      //     var goods_id = goods[i].goods_id || ''
      //     let extData = wx.getExtConfigSync();
      //     let appid = extData.authorizer_appid;
      //     wx.request({
      //       header: {
      //         'data': appid
      //       },
      //       url: app.globalData.rootUrl + '/goods/insert_cart',
      //       data: {
      //         user_id: user_id,
      //         norms_id: norms_id,
      //         num: num,
      //         goods_id: goods_id,
      //         // cart_id: cart_id,
      //         // goodslist: goodslist
      //       },
      //       success: function (res) {
      //         console.log('加入购物车的返回字段', res.data)
      //         wx.navigateTo({
      //           url: "../gouwuche2/gouwuche2"
      //         });
      //       }
      //     })
      //   }
      // }
      if (e.target.dataset.page === '联系商家') {
        var tel = e.target.dataset.tel;
        wx.makePhoneCall({
          phoneNumber: tel
        })
      }
      if (e.target.dataset.page === '去付款') {

        wx.navigateTo({
          url: "../orderDetail/orderDetail"
        });


        // var ordersn = e.target.dataset.ordersn;
        // var orders = that.data.orders
        // var goods_price
        // for (var i in orders.data) {
        //   if (orders.data[i].ordersn === ordersn) {
        //     console.log('订单总价', orders.data[i].goods_total)
        //     goods_price = orders.data[i].goods_total
        //   }
        // }

        // let extData = wx.getExtConfigSync();
        // let appid = extData.authorizer_appid;
        // wx.request({
        //   header: {
        //     'data': appid
        //   },
        //   url: app.globalData.rootUrl + '/goods/pay',
        //   method: "POST",
        //   data: {
        //     user_id: user_id,
        //     ordersn: ordersn,
        //     goods_price: goods_price,
        //   },
        //   success: function (res) {
        //     console.log('发送订单给后台之后返回的字段', res.data)
        //     console.log('未支付订单的再支付', {
        //       user_id: user_id,
        //       ordersn: ordersn,
        //       goods_price: goods_price,
        //     })
        //     var pay = res.data
        //     //发起支付
        //     var timeStamp = pay.timeStamp;
        //     var packages = pay.package;
        //     var paySign = pay.paySign;
        //     var nonceStr = pay.nonceStr;
        //     var param = { "timeStamp": timeStamp, "package": packages, "paySign": paySign, "signType": "MD5", "nonceStr": nonceStr };
        //     that.pay(param)
        //     //清空各类数据
        //     var kong = {}
        //     wx.setStorageSync('now_youhuiquan', kong)
        //     wx.setStorageSync('yuanshi_price', '')
        //     wx.setStorageSync('coupons_id', '')
        //     wx.setStorageSync('coupons_price', '')
        //     wx.setStorageSync('goods_id', '')
        //   }
        // })
      }
    }

    var data = { go, e }
    this.clickTooFast(data)

  },
  /* 支付   */
  pay: function (param) {
    console.log("支付")
    console.log(param)
    wx.requestPayment({
      timeStamp: param.timeStamp,
      nonceStr: param.nonceStr,
      package: param.package,
      signType: param.signType,
      paySign: param.paySign,
      success: function (res) {
        // success
        wx.navigateBack({
          delta: 1, // 回退前 delta(默认为1) 页面
          success: function (res) {
            console.log('支付成功之后返回的参数', res.data)
            wx.showToast({
              title: '支付成功',
              icon: 'success',
              duration: 2000
            })
          },
          fail: function () {
            // fail

          },
          complete: function () {
            // complete
          }
        })
      },
      fail: function (res) {
        // fail
      },
      complete: function () {
        // complete
      }
    })
  },
  //保留小数点一位
  toDecimal: function (x) {
    var f = parseFloat(x);
    if (isNaN(f)) {
      return;
    }
    f = Math.round(x * 100) / 100;
    return f;
  },

  /*==========
  防止快速点击
  ===========*/
  clickTooFast: function (data) {
    var lastTime = this.data.lastTime
    var curTime = data.e.timeStamp
    if (lastTime > 0) {
      if (curTime - lastTime < 1000) {
        console.log('点击太快了')
        return
      } else {
        data.go(data.e)
      }
    } else {
      data.go(data.e)
    }
    this.setData({
      lastTime: curTime
    })
  }
})