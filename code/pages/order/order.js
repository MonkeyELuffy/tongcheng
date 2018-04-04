// pages/oder/oder.js

var util = require('../../utils/util.js'); 
var loadListData = require('../../utils/loadListData.js'); 
var app = getApp()
Page({
  data: {
    scrollHeight: app.globalData.scrollHeight,
    nowType:1,
    imgHttp: app.globalImageUrl,
    shopImg:'../../img/shangjia.png',
    orderTypeList: [
      {
        name: '酒店订单',
        order: 'jiudian',
        checked: true
      },
      {
        name: '餐饮订单',
        order: 'canyin',
        checked: false
      }
    ],
    //当前订单类型
    nowOrderType:'jiudian',
    default_image: '../../img/default-image.png',
    index:0,
    differ:1,
    page_no: 1,
    //返回分页数据的总页数
    total_page: 1,
    orders:[],
    btns: [],    //按钮组
    status: '',  //订单分组
    order: [],
    navItems: [
      {
        name: '待付款',
        type: 1,
        checked: true
      },
      {
        name: '待评价',
        type: 3,
        checked: false
      },
      {
        name: '已完成',
        type: 4,
        checked: false
      }
    ]
  },
  onLoad(){
    var percent = this.data.scrollHeight / 555
    this.setData({
      scrollHeight: this.data.scrollHeight - 72 * percent
    })
  },
  onShow() {
    var nowType = parseInt(this.data.nowType)
    var btns;
    switch (nowType) {
      case 1:
        btns = ['付款'];
        break;
      case 2:
        btns = ['联系商家','确认收货'];
        break;
      case 3:
        btns = ['评价'];
        break;
      case 4:
        btns = [];
        break;
    }
    this.setData({
      bindDownLoad: true,
      page_no: 1,
      total_page: 1,
      btns: btns,
      orders:[]
    })
    var differ = this.data.orderTypeList[1].checked ? 1 : 2
    var params = {
      member_id: app.globalData.member_id,
      type: nowType,
      differ: differ,
      page_no: 1,
      pagenum: 15,
    }
    this.loadListData(params)
  },
  // 进入详情页面之前获取详情数据，然后以res名传递到详情页，详情页直接使用之前的请求回调函数处理得到的res
  goOrderDetail(e) {
    var that = this
    var order_id = e.currentTarget.dataset.order_id;
    //获取订单详情
    util.httpPost(app.globalUrl + app.getCityOrderInfoById, { order_id: order_id }, that.processOrderDetailData);
  },
  processOrderDetailData: function (res) {
    if (res.suc == 'y') {
      wx.navigateTo({
        url: "../orderDetail/orderDetail?res=" + JSON.stringify(res)
      });
    } else {
      console.log('获取订单详情错误', res);
    }
  },
  //选择订单类型
  chooseOrderType: function (e) {
    var nowOrderType = e.currentTarget.dataset.order;
    var orderTypeList = this.data.orderTypeList;
    var navItems
    //重复点击已选中的顶部菜单无事件发生；
    if (nowOrderType == 'jiudian' && !orderTypeList[0].checked) {
      orderTypeList[0].checked = true
      orderTypeList[1].checked = false
      navItems = [{
        name: '待付款',
        type: 1,
        checked: true
      }, {
        name: '待评价',
        type: 3,
        checked: false
      }, {
        name: '已完成',
        type: 4,
        checked: false
      }]
      this.setData({
        orders: []
      })
      this.setData({
        orderTypeList: orderTypeList,
        navItems: navItems,
        index: 0,
        bindDownLoad: true,
        page_no: 1,
        btns: ['付款'],
        orders: []
      })
      var params = {
        member_id: app.globalData.member_id,
        type: 1,
        differ: 2,
        page_no: 1,
        pagenum: 15,
      }
      this.loadListData(params)
    }
    if (nowOrderType == 'canyin' && !orderTypeList[1].checked) {
      orderTypeList[1].checked = true
      orderTypeList[0].checked = false
      navItems = [{
        name: '待付款',
        type: 1,
        checked: true
      }, {
        name: '待收货',
        type: 2,
        checked: false
      }, {
        name: '待评价',
        type: 3,
        checked: false
      }, {
        name: '已完成',
        type: 4,
        checked: false
      }
      ]
      this.setData({
        orderTypeList: orderTypeList,
        navItems: navItems,
        index: 0,
        bindDownLoad: true,
        page_no: 1,
        btns: ['付款'],
        orders: []
      })
      var params = {
        member_id: app.globalData.member_id,
        type: 1,
        differ: 1,
        page_no: 1,
        pagenum: 15,
      }
      this.loadListData(params)
    }
  },
// 刷新页面数据
  // refreshData(e){
  //   //与加载下一页数据唯一的区别是，清空orders
  //   // index代表订单类型1到5
  //   // differ代表订单分类酒店（2）和餐饮（1）
  //   var index = this.data.index + 1
  //   var differ = this.data.orderTypeList[1].checked ? 1 : 2
  //   this.setData({
  //     orders:[]
  //   })
  //   var params = {
  //     member_id: app.globalData.member_id,
  //     type: index,
  //     differ: differ,
  //     page_no: 1,
  //     pagenum: 15,
  //   }
  //   this.loadListData(params)
  // },
  // 下拉加载更多数据
  bindDownLoad: function (e) {
    // index代表订单类型1到5
    // differ代表订单分类酒店（2）和餐饮（1）
    var nowType = this.data.nowType
    var differ = this.data.orderTypeList[1].checked ? 1 : 2
    var params = {
      member_id: app.globalData.member_id,
      type: nowType,
      differ: differ,
      page_no: this.data.page_no,
      pagenum: 15,
    }
    this.loadListData(params)
  },
  processOrderData: function (res) {
    if (res.suc == 'y') {
      var orders = this.data.orders
      // datalist为空字符串时表示没有此类订单数据
      console.log('获取订单list成功', res.data);
      wx.hideLoading()
      //获取数据之后需要改变page和total_page数值，保障上拉加载下一页数据的page值，其余没有需要修改的数据
      if (res.data.datalist == ''){
        this.setData({
          page_no: this.data.page_no + 1,
          total_page: res.data.total_page,
          orders: orders,
        })
      } else {
        // 处理datalist里面的订单时间和订单状态文字
        var differ = this.data.orderTypeList[1].checked ? 1 : 2
        var nowType = this.data.nowType
        //showTextMom的值决定showText和showTime的值
        var showText, showTimeVal
        var showTextMom = differ + '' + nowType
        switch (showTextMom) {
          case '11':
          case '21':
            showText = '下单';
            showTimeVal = 'addtime';
            break
          case '12':
            showText = '付款';
            showTimeVal = 'paytime';
            break
          case '13':
          case '23':
            showText = '确认';
            showTimeVal = 'confirm_time';
            break
          case '14':
          case '25':
            showText = '完成';
            showTimeVal = 'confirm_time';
            break
          }
        for (var i in res.data.datalist){
          res.data.datalist[i].showTime = res.data.datalist[i][showTimeVal]
          res.data.datalist[i].showText = showText
        }
        orders = orders.concat(res.data.datalist)
        this.setData({
          page_no: this.data.page_no + 1,
          total_page: res.data.total_page,
          orders: orders,
        })
      }

    } else {
      console.log('获取订单list错误', res);
    }
  },
  // 加载数据
  loadListData: function (params) {
    var that = this
    var allParams = {
      that: that,
      params: params,
      app: app,
      processData: that.processOrderData, 
      API: app.getOrderListByMemberId
    }
    loadListData.loadListData(allParams)
  },
  /* ===选择订单状态类型 */
  checked: function (e) {
    var that = this
    var index = e.target.dataset.index;
    var item = e.target.dataset.item;
    if(index === that.data.index){
      return
    }else{
      // 标题
      var navItems = that.data.navItems
      // 取消所有title的选中
      for (var i = 0; i < navItems.length; i++) {
        navItems[i]['checked'] = false
      };
      // 选中当前title
      navItems[index]['checked'] = true
      //按钮组需要根据订单类型转换
      var btns = [];
          switch (item.type) {
            case 1:
              btns = ['付款'];
              break;
            case 2:
              btns = ['联系商家', '确认收货'];
              break;
            case 3:
              btns = ['评价'];
              break;
            case 4:
              btns = [];
              break;
            case 5:
              btns = [];
              break;
          }
      that.setData({
        orders: [],
        page_no: 1,
        bindDownLoad: true,
        index: index, 
        nowType: item.type,
        navItems: navItems,
        btns: btns
      })
      //切换顶部菜单时，初始化数据
      var differ = that.data.orderTypeList[1].checked ? 1 : 2
      var params = {
        member_id: app.globalData.member_id,
        type: item.type,
        differ: differ,
        page_no: 1,
        pagenum: 15,
      }
      that.loadListData(params);
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
    var go = function(e) {
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
        wx.showModal({
          title: '提醒',
          content: '确认收货？',
          success: function (res) {
            if (res.confirm) {
              var order_id = e.target.dataset.order_id
              console.log('订单id', order_id)
              util.httpPost(app.globalUrl + app.confirmReceipt, { order_id: order_id }, that.processOrder);
            }
          }
        })
      }
      if (e.target.dataset.page === '联系商家') {
        var phone = e.target.dataset.phone;
        wx.makePhoneCall({
          phoneNumber: phone
        })
      }
      if (e.target.dataset.page === '评价') {
        var item = JSON.stringify(e.target.dataset.item)
        wx.navigateTo({
          url: "../pingjia/pingjia?item=" + item
        });
      }
      if (e.target.dataset.page === '付款') {
        wx.navigateTo({
          url: "../pay/pay?order_id=" + e.target.dataset.order_id
        });
      }
    }

    var data = { go, e }
    this.clickTooFast(data)

  },
  //统一展示订单操作的回调，确认收货、取消订单、删除订单、申请退款
  processOrder(res){
    var that = this
    if (res.suc == 'y') {
      console.log('操作订单成功', res.data);
      // 成功之后需要清空订单，然后重新请求最新订单数据
      var differ = that.data.orderTypeList[1].checked ? 1 : 2
      var nowType = that.data.nowType
      that.setData({
        orders:[]
      })
      var params = {
        member_id: app.globalData.member_id,
        type: nowType ,
        differ: differ,
        page_no: 1,
        pagenum: 15,
      }
      that.loadListData(params);
    } else {
      console.log('操作订单错误', res);
    }
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
              duration: 2000,
              mask:true
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