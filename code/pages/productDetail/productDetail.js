var util = require('../../utils/util.js');
var bannerTemp = require('../../utils/bannerTemp.js');
var app = getApp()

Page({
  data: {
    more: '../../img/more.png',
    imgHttp: app.globalImageUrl,
    carIcon: '../../img/car.png',
    clear: '../../img/address_con_delete.png',
    carCount: 2,
    // 评价列表
    commentList: [
      {
        name: '林先森',
        time: '2011.11.11',
        text: '好吃，非常好吃。好吃的不得了！！',
        img: '../../img/user.png',
      },
    ],
    // 商品信息
    productDetail: {},
    telImg: '../../img/tel.png',
    totalPrice: 122,
    peisongPrice: '3.0',
    addImg: '../../img/add.png',
    subImg: '../../img/sub.png',
    closeImg: '../../img/close.png',
    //是否显示规格选择器
    showType: false,
    clickBtn: '../../img/checked.png',
    showCar: false,
    // 购物车数据
    carData: {
      //总数
      count: 5,
      //各个产品对象
      list: [
        {
          img: '../../img/prodect.png',
          name: '传统石锅拌饭',
          price: 31119,
          checked: true,
          count: 1,
          id: 2,
          checkedImg: '../../img/checked.png',
        },
      ],
      totalPrice: 111,
      checkedCount: 3,
    },
    now_product_detail: {},
    cart: [],
    count: 1,   //商品数量默认是1  
    total: 0,    //总金额  
    goodsCount: 1, //数量 
    //图片轮播
    slider: [],
    swiperCurrent: 0,
  },
  // 进入界面时请求商品详情
  onLoad: function (options) {
    var that = this
    var params = JSON.parse(options.params)
    console.log('params', params); 
    //保存seller_id，用于返回上一页时，刷新上一页数据
    this.setData({
      seller_id: params.seller_id,
      goods_id: params.goods_id,
    })
    var data = {
      seller_id: params.seller_id,
      token: app.globalData.userInfo.token
    }
    //请求商品详情
    util.httpPost(
      app.globalUrl + app.GOODSINFO, 
      { goods_id: params.goods_id }, 
      this.processInfoData);
    //请求购物车数据
    util.httpPost(app.globalUrl + app.CARTINFO, data, this.processCartData);
  },
  processInfoData(res) {
    if (res.suc == 'y') {
      console.log('返回商品数据成功', res.data);
      var slider = []
      // 图片地址加前缀
      for (var i in res.data.banner_src) {
        slider.push({
          img_src: app.globalImageUrl + res.data.banner_src[i]
        })
      }
      this.setData({
        productDetail: res.data,
        slider: slider
      })
      // 请求商品详情成功之后再请求评价列表
      var data2 = {
        page_no: 1,
        page_size: 15,
        goods_id: this.data.goods_id
      }
      util.httpPost(app.globalUrl + app.REMARK, data2, this.processREMARKData);
    } else {
      console.log('返回商品数据错误', res);
    }
  },
  processCartData: function (res) {
    if (res.suc == 'y') {
      console.log('返回购物车成功', res.data);
      this.setData({
        carData: res.data
      })
    } else {
      console.log('返回购物车错误', res);
    }
  },
  processREMARKData(res) {
    if (res.suc == 'y') {
      console.log('评价列表数据成功', res.data);
      this.setData({
        pingjiaList: res.data.list,
      })
    } else {
      console.log('返回评价列表数据错误', res);
    }
  },
  // 查看更多评价
  seeMore(e) {
    var goods_id = this.data.goods_id
    var go = function (e) {
      wx.navigateTo({
        url: '/pages/pingjiaList/pingjiaList?goods_id=' + goods_id
      })
    }
    var data = { go, e }
    this.clickTooFast(data)
  },
  //在购物车页面单独删除某一个商品
  clearItem: function (e) {
    var that = this
    var product_id = e.currentTarget.dataset.product_id
    wx.showModal({
      title: '提醒',
      content: '确定删除该商品？',
      success: function (res) {
        if (res.confirm) {
          var data = {
            product_id: product_id,
            token: app.globalData.userInfo.token
          }
          util.httpPost(app.globalUrl + app.CARTDEL, data, that.processCartDelData);
        }
      }
    })
  },
  processCartDelData: function (res) {
    if (res.suc == 'y') {
      console.log('删除商品成功', res.data);
      //返回最新的购物车数据
      this.setData({
        carData: res.data
      })
    } else {
      console.log('删除商品错误', res);
    }
  },
  processCartEditData: function (res) {
    if (res.suc == 'y') {
      console.log('编辑商品成功', res.data);
      //返回最新的购物车数据
      this.setData({
        carData: res.data
      })
    } else {
      console.log('编辑商品错误', res);
    }
  },
  //购物车弹出里面点击增加商品
  addCarItem: function (e) {
    var that = this
    var index = e.currentTarget.dataset.index
    var product_id = e.currentTarget.dataset.product_id
    var carData = this.data.carData;
    var get_num = parseInt(carData.product_list[index].get_num)
    if (get_num < 5) {
      get_num += 1
      carData.get_sum += 1
      var data = {
        product_id: product_id,
        set_num: get_num,
        token: app.globalData.userInfo.token
      }
      util.httpPost(app.globalUrl + app.CARTEDIT, data, that.processCartEditData);
    } else {
      wx.showToast({
        title: '一次性最多选择5个',
        content: '1000',
      })
      return
    }
  },
  removeAll: function (e) {
    var carData = this.data.carData;
    if (carData.product_list.length > 0) {
      var that = this
      var product_id_list = [];
      wx.showModal({
        title: '提醒',
        content: '确定清空购物车？',
        success: function (res) {
          if (res.confirm) {
            for (var i in carData.product_list) {
              product_id_list.push(carData.product_list[i].product_id)
            }
            var data = {
              product_id: product_id_list,
              token: app.globalData.userInfo.token
            }
            util.httpPost(app.globalUrl + app.CARTDEL, data, that.processCartDelData);
            that.setData({
              carData: {},
            })
            that.hiddenCar(e);
          } else if (res.cancel) {
          }
        }
      })
    }
  },
  // 判断是否已经收藏
  // 加入购物车  
  // 弹出规格选择器
  chooseType: function (e) {
    // 请求规格数据
    var data = {
      goods_id: e.currentTarget.dataset.goods_id
    }
    util.httpPost(app.globalUrl + app.RODUCTLIST, data, this.processProductData);
    e.stopPropagation ? e.stopPropagation() : (e.cancelBubble = true);
    // 当前选中的商品
    var nowProduct = { name: '', price: 0, typeList: [] };
    var dataList = this.data.dataList;
    for (var i in dataList) {
      if (dataList[i].goods_id == e.currentTarget.dataset.goods_id) {
        nowProduct.name = dataList[i].goods_name
        nowProduct.price = dataList[i].price
        break;
      }
    }
    this.setData({
      showType: true,
      nowProduct: nowProduct,
      viewHeight: this.data.scrollHeight + 'px',
    })
  },
  // 组装产品规格数据
  processProductData: function (res) {
    if (res.suc == 'y') {
      console.log('返回规格数据成功', res.data);
      var nowProduct = this.data.nowProduct;
      for (var i in res.data) {
        nowProduct.typeList.push({
          name: res.data[i].spec_info,
          price: res.data[i].price,
          product_id: res.data[i].product_id,
          checked: false,
        })
      }
      nowProduct.typeList[0].checked = true;
      this.setData({
        nowProductTotalPrice: nowProduct.typeList[0].price,
        nowProductPrice: nowProduct.typeList[0].price,
        nowProduct: nowProduct,
        nowType: nowProduct.typeList[0]
      })
    } else {
      console.log('返回规格数据错误', res);
    }
  },
  //在规格选择器中选择规格
  chooseItemType: function (e) {
    var nowIndex
    var nowProduct = this.data.nowProduct
    for (let i in nowProduct.typeList) {
      if (nowProduct.typeList[i].checked) {
        nowIndex = i;
        break;
      }
    }
    var index = e.currentTarget.dataset.index
    if (nowIndex == index) {
      return
    } else {
      for (let i in nowProduct.typeList) {
        nowProduct.typeList[i].checked = false
      }
      nowProduct.typeList[index].checked = true
      this.setData({
        count: 1,
        nowType: nowProduct.typeList[index],
        nowProductTotalPrice: nowProduct.typeList[index].price,
        nowProductPrice: nowProduct.typeList[index].price,
        nowProduct: nowProduct,
      })
    }
  },
  close: function (e) {
    this.setData({
      count: 1,
      showType: false,
      viewHeight: ''
    })
  },
  // 增加
  add: function (e) {
    var count = this.data.count
    var nowProductTotalPrice = this.data.nowProductTotalPrice
    var nowProductPrice = parseFloat(this.data.nowProductPrice);
    if (count < 5) {
      count += 1
    } else {
      wx.showToast({
        title: '一次性最多选择5个',
        content: '1000',
      })
      return
    }
    nowProductTotalPrice = (count * nowProductPrice).toFixed(2);
    this.setData({
      count: count,
      nowProductTotalPrice: nowProductTotalPrice,
    })
  },
  // 减少
  sub: function (e) {
    var count = this.data.count
    var nowProductTotalPrice = this.data.nowProductTotalPrice
    var nowProductPrice = parseFloat(this.data.nowProductPrice);
    if (count > 1) {
      count -= 1
    } else {
      wx.showToast({
        title: '不能再减了',
        content: '1000',
      })
      return
    }
    nowProductTotalPrice = count * nowProductPrice
    this.setData({
      count: count,
      nowProductTotalPrice: nowProductTotalPrice,
    })
  },
  //加入购物车
  addToCar: function (e) {
    var that = this
    // 当前商品数量
    var count = that.data.count
    // 当前购物车数量
    var carData = that.data.carData
    // 当前的商品信息，包括价格，id，规格名称
    var nowType = that.data.nowType
    console.log(nowType)
    console.log({ product_id: nowType.product_id, set_num: count })
    that.close()
    // 发送编辑购物车请求
    var data = {
      product_id: nowType.product_id,
      set_num: count,
      token: app.globalData.userInfo.token
    }
    util.httpPost(app.globalUrl + app.CARTEDIT, data, that.processCartEditData);
    that.setData({
      count: 1,
    })
  },
  //进入商品详情
  goProductDetail: function (e) {
    var that = this
    var item = e.currentTarget.dataset.item
    var params = {
      goods_id: item.goods_id,
      seller_id: this.data.seller_id,
    }
    var go = function (e) {
      wx.navigateTo({
        url: '/pages/productDetail/productDetail?params=' + JSON.stringify(params),
      })
    }
    var data = { go, e }
    this.clickTooFast(data)
  },
  //查看购物车
  lookCar: function (e) {
    var that = this
    var go = function (e) {
      that.setData({
        showCar: true,
        viewHeight: that.data.scrollHeight + 'px',
      })
    }
    var data = { go, e }
    this.clickTooFast(data)
  },
  //隐藏购物车
  hiddenCar: function (e) {
    this.setData({
      showCar: false,
      viewHeight: '',
    })
  },
  goPay: function (e) {
    var that = this
    var go = function (e) {
      that.carSubmit()
    }
    var data = { go, e }
    this.clickTooFast(data)
  },
  // 发送购物车结算请求
  carSubmit: function () {
    var that = this
    if (that.data.carData.product_list.length == 0) {
      wx.showModal({
        title: '提醒',
        content: '请先选择商品',
      })
      return
    } else {
      var buy_key = [];
      for (var i in that.data.carData.product_list) {
        // 组装buy_key
        buy_key.push(that.data.carData.product_list[i].product_id + '_' + that.data.carData.product_list[i].get_num)
      }
      buy_key = buy_key.join('|')
      var data = {
        buy_key: buy_key,
        member_id: app.globalData.member_id
      }
      util.httpPost(app.globalUrl + app.CARTSUBMIT, data, that.processSubmitData);
    }
  },
  processSubmitData: function (res) {
    if (res.suc == 'y') {
      console.log('购物车结算成功', res.data);
      this.goPayPage(res.data)
    } else {
      console.log('购物车结算错误', res);
      wx.showModal({
        title: '提醒',
        content: res.msg,
      })
    }
  },
  //进入结算页面
  goPayPage: function (orderData) {
    var that = this
    app.globalData.orderData = orderData
    wx.navigateTo({
      url: '/pages/tijiaodingdan/tijiaodingdan'
    })
    that.hiddenCar();
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
  },
  call: function (e) {
    wx.makePhoneCall({
      phoneNumber: this.data.productDetail.seller_phone,
    })
  }, 
  onUnload: function () {
    // 返回上一页的时候，刷新上一页数据
    var pages = getCurrentPages()
    var prevPage = pages[pages.length - 2]
    console.log(prevPage.route)
    var options = {
      seller_id: this.data.seller_id
    }
    prevPage.onLoad(options)
  }
})  