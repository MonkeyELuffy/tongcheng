//index.js
//获取应用实例
var util = require('../../utils/util.js');
var app = getApp()
Page({
  data: {
    scrollHeight: app.globalData.scrollHeight,
    imgHttp: app.globalImageUrl,
    carIcon: '../../img/car.png',
    addImg: '../../img/add.png',
    subImg: '../../img/sub.png',
    closeImg: '../../img/close.png',
    clear: '../../img/address_con_delete.png',
    clickBtn: '../../img/quanxuan.png',
    checkedImg: '../../img/quanxuan.png',
    unCheckedImg: '../../img/unCheckedImg.png',
    // 排序背景图
    zonghepaixu: '../../img/paixu0.png',
    xiaoliangpaixu: '../../img/paixu0.png',
    jiagepaixu: '../../img/paixu0.png',
    paixuList: ['../../img/paixu0.png', '../../img/paixu1.png', '../../img/paixu2.png'],
    // 排序组件所需data
    allData: {
      zonghepaixu: '../../img/paixu0.png',
      xiaoliangpaixu: '../../img/paixu0.png',
      jiagepaixu: '../../img/paixu0.png',
      paixuList: ['../../img/paixu0.png', '../../img/paixu1.png', '../../img/paixu2.png'],
      // 排序规则：1、3、5降序，2、4、6升序，0不排序。
      nowPaiXu: 0,
    },
    //点餐左侧菜单
    leftList: [],
    //商品列表
    dataList: [],
    shop: {},
    nowTitle: '',
    //购物车里面的总价格
    totalPrice: 0,
    peisongPrice: '3.0',
    // 购物车数量
    carCount: 0,
    // 当前规格产品的单价
    nowProductPrice:0,
    // 选择单个商品时的总价
    nowProductTotalPrice: 0,
    // 当前选中的商品
    nowProduct: {},
    count: 1,
    //是否显示规格选择器
    showType: false,
    // 全选
    chooseAll: true,
    showCar: false,
    // 购物车数据
    carData: {
      //总数
      get_sum: 0,
      //各个产品对象
      product_list: [
      ],
      price_sum: 0,
    },
    allGoodsData:{}
  },
  onLoad: function (options) {
    var that = this
    console.log('options', options)
    console.log('商家seller_id', options.seller_id);
    this.setData({
      seller_id: options.seller_id
    })
    var data = {
      seller_id: options.seller_id,
      token: app.globalData.userInfo.token
    }
    //请求商家详情
    util.httpPost(app.globalUrl + app.STOREINFO, data, this.processInfoData);
    //请求商家商品TAB
    util.httpPost(app.globalUrl + app.GOODSTAB, data, this.processGoodsData);
    //请求购物车数据
    util.httpPost(app.globalUrl + app.CARTINFO, data, this.processCartData);
  },
  processInfoData: function (res) {
    if (res.suc == 'y') {
      console.log('商家数据成功', res.data);
      var shop={
        img: res.data.store_img_src,
        name: res.data.seller_name,
        type: res.data.trade_name,
        boss: res.data.phone,
        phone: res.data.phone,
        addr: res.data.address,
      }
      this.setData({
        shop: shop
      })

    } else {
      console.log('返回商家数据错误', res);
    }
  },
  processGoodsData: function (res) {
    if (res.suc == 'y') {
      console.log('商家商品TAB数据成功', res.data);
      // 左侧商品分类list
      var leftList = [];
      // 初次展示第一类商品的所有数据
      var dataList = res.data[0].tab_goods;
      for (var i in res.data) {
        leftList.push({
          tab_name: res.data[i].tab_name,
          tab_id: res.data[i].tab_id,
          checked: false
        })
      }
      // 默认第一类商品选中
      leftList[0].checked = true
      this.setData({
        // 商家商品TAB数据
        allGoodsData: res.data,
        leftList: leftList,
        dataList: dataList,
        nowTitle: leftList[0].tab_name
      })

    } else {
      console.log('返回商家商品TAB数据错误', res);
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
  call:function(){
    wx.makePhoneCall({
      phoneNumber: this.data.shop.phone,
    })
  },
  //选择单项
  chooseItem: function (e) {
    var that = this
    var carData = that.data.carData;
    var chooseAll = that.data.chooseAll;
    var index = e.currentTarget.dataset.index
    carData.product_list[index].checked = !carData.product_list[index].checked;
    //如果全部都已经选中了，则底部全选状态改变
    var chooseAll = true;
    for (var i in carData.product_list) {
      if (!carData.product_list[i].checked) {
        chooseAll = false
        break;
      }
    } 
    that.setData({
      chooseAll: chooseAll,
      carData: carData
    })
  },
  // 全选
  chooseAll: function (e) {
    var that = this;
    var carData = that.data.carData;
    var chooseAll = that.data.chooseAll;
    for (var i in carData.product_list) {
      carData.product_list[i].checked = !chooseAll
    }
    this.setData({
      chooseAll: !chooseAll,
      carData: carData,
    })
  },
  //切换左侧商品菜单
  checkedLeftNav: function (e) {
    var index = e.currentTarget.dataset.index
    var leftList = this.data.leftList
    for (let i in leftList) {
      leftList[i].checked = false
    }
    leftList[index].checked = true

    this.setData({
      leftList: leftList,
      // 重置dataList
      dataList: this.data.allGoodsData[index].tab_goods,
      nowTitle: leftList[index].tab_name
    })
  },
  //购物车弹出里面点击减少商品
  subCarItem: function (e) {
    var that = this
    var index = e.currentTarget.dataset.index
    var carData = this.data.carData;
    var product_id = e.currentTarget.dataset.product_id
    var get_num = parseInt(carData.product_list[index].get_num)
    if (get_num > 1) {
      get_num -= 1
      carData.get_sum -= 1
      var data = { 
        product_id: product_id, 
        set_num: get_num,
        token: app.globalData.userInfo.token
      }
      util.httpPost(app.globalUrl + app.CARTEDIT, data, that.processCartEditData);
    } else {
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
    }
  },
  //在购物车页面单独删除某一个商品
  clearItem:function(e){
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
    if (carData.product_list.length > 0){
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
  //弹出规格选择器
  chooseType: function (e) {
    // 请求规格数据
    var data = {
      goods_id: e.currentTarget.dataset.goods_id
    }
    util.httpPost(app.globalUrl + app.RODUCTLIST, data, this.processProductData);
    e.stopPropagation ? e.stopPropagation() : (e.cancelBubble = true);
    // 当前选中的商品
    var nowProduct = { name: '', price: 0, typeList: []};
    var dataList = this.data.dataList;
    for (var i in dataList){
      if (dataList[i].goods_id == e.currentTarget.dataset.goods_id){
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
      for (var i in res.data){
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
      if (nowProduct.typeList[i].checked){
        nowIndex = i;
        break;
      }
    }
    var index = e.currentTarget.dataset.index
    if (nowIndex == index){
      return
    }else{
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
    var buy_key = '';
    if (that.data.carData.product_list.length == 0){
      wx.showModal({
        title: '提醒',
        content: '请先选择商品',
      })
      return
    }else{
      for (var i in that.data.carData.product_list) {
        buy_key += that.data.carData.product_list[i].product_id + '_' + that.data.carData.product_list[i].get_num + '|'
      }
      //去掉最后一个'|'
      buy_key = buy_key.substring(0, buy_key["length"] - 1)
      var data = {
        buy_key: buy_key,
        token: app.globalData.userInfo.token
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
  zonghepaixu: function (e) {
    var that = this
    var nowPaiXu = that.data.allData.nowPaiXu
    var zonghepaixu = that.data.allData.zonghepaixu
    var xiaoliangpaixu = that.data.allData.xiaoliangpaixu
    var jiagepaixu = that.data.allData.jiagepaixu
    var paixuList = that.data.allData.paixuList
    switch (nowPaiXu) {
      case 0: case 2: case 3: case 4: case 5: case 6:
        zonghepaixu = paixuList[2];
        xiaoliangpaixu = paixuList[0];
        jiagepaixu = paixuList[0];
        nowPaiXu = 1;
        break;
      case 1:
        zonghepaixu = paixuList[1];
        xiaoliangpaixu = paixuList[0];
        jiagepaixu = paixuList[0];
        nowPaiXu = 2;
        break;
    }
    // var dataList = this.data.dataList

    that.setData({
      'allData.zonghepaixu': zonghepaixu,
      'allData.xiaoliangpaixu': xiaoliangpaixu,
      'allData.jiagepaixu': jiagepaixu,
      'allData.nowPaiXu': nowPaiXu,
    })
    console.log(nowPaiXu)
  },
  xiaoliangpaixu: function (e) {
    var that = this
    var nowPaiXu = that.data.allData.nowPaiXu
    var zonghepaixu = that.data.allData.zonghepaixu
    var xiaoliangpaixu = that.data.allData.xiaoliangpaixu
    var jiagepaixu = that.data.allData.jiagepaixu
    var paixuList = that.data.allData.paixuList
    switch (nowPaiXu) {
      case 0: case 4: case 1: case 2: case 5: case 6:
        zonghepaixu = paixuList[0];
        xiaoliangpaixu = paixuList[2];
        jiagepaixu = paixuList[0];
        nowPaiXu = 3;
        break;
      case 3:
        zonghepaixu = paixuList[0];
        xiaoliangpaixu = paixuList[1];
        jiagepaixu = paixuList[0];
        nowPaiXu = 4;
        break;
    }
    that.setData({
      'allData.zonghepaixu': zonghepaixu,
      'allData.xiaoliangpaixu': xiaoliangpaixu,
      'allData.jiagepaixu': jiagepaixu,
      'allData.nowPaiXu': nowPaiXu,
    })
    console.log(nowPaiXu)
  },
  jiagepaixu: function (e) {
    var that = this
    var nowPaiXu = that.data.allData.nowPaiXu
    var zonghepaixu = that.data.allData.zonghepaixu
    var xiaoliangpaixu = that.data.allData.xiaoliangpaixu
    var jiagepaixu = that.data.allData.jiagepaixu
    var paixuList = that.data.allData.paixuList
    switch (nowPaiXu) {
      case 0: case 6: case 1: case 2: case 3: case 4:
        zonghepaixu = paixuList[0];
        xiaoliangpaixu = paixuList[0];
        jiagepaixu = paixuList[2];
        nowPaiXu = 5;
        break;
      case 5:
        zonghepaixu = paixuList[0];
        xiaoliangpaixu = paixuList[0];
        jiagepaixu = paixuList[1];
        nowPaiXu = 6;
        break;
    }
    that.setData({
      'allData.zonghepaixu': zonghepaixu,
      'allData.xiaoliangpaixu': xiaoliangpaixu,
      'allData.jiagepaixu': jiagepaixu,
      'allData.nowPaiXu': nowPaiXu,
    })
    console.log(nowPaiXu)
  },
  /*==========
  防止快速点击
  ===========*/
  clickTooFast: function (data) {
    var lastTime = this.data.lastTime
    var curTime = data.e.timeStamp
    if (lastTime > 0) {
      if (curTime - lastTime < 600) {
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
})
