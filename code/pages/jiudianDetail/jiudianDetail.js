// pages/jiudianDetail/jiudianDetail.js
var util = require('../../utils/util.js');
var bannerTemp = require('../../utils/bannerTemp.js');
var dataItemTemp = require('../../utils/dataItemTemp.js');
var app = getApp(); 
Date.prototype.format = function () {
  var s = '';
  var mouth = (this.getMonth() + 1) >= 10 ? (this.getMonth() + 1) : ('0' + (this.getMonth() + 1));
  var day = this.getDate() >= 10 ? this.getDate() : ('0' + this.getDate());
  s += this.getFullYear() + '-'; // 获取年份。
  s += mouth + "-"; // 获取月份。
  s += day; // 获取日。
  return (s); // 返回日期。
};
Page({
  data: {
    scrollY: true,
    scrollHeight: app.globalData.scrollHeight,
    nowTime:'',
    ruzhuTime:'',
    lidianTime:'',
    allOrderPrice:0,
    showOrderDetail:false,
    imgUrl: app.globalImageUrl,
    more:'../../img/more.png',
    slider: [],
    daohang: '../../img/daohang.png',
    closeImg: '../../img/close.png',
    total:0,
    detail:{},
    hotelOrderDetail:{
      labels:[{name:'上网',value:'WIFi和宽带'},
        { name: '卫浴', value: '独立' },
        { name: '窗户', value: '有' },],
      msg:'入住说明入住说明入住说明入住说明入住说明入住说明入住说明入住说明入住说明入住说明入住说明入住说明入住说明入住说明入住说明入住说明入住说明入住说明入住说明',
      dataList: [
        { time: '2018-04-01', quantity: '1', price: '100.00' },
        { time: '2018-04-01', quantity: '1', price: '100.00' },
        { time: '2018-04-01', quantity: '1', price: '100.00' },
        { time: '2018-04-01', quantity: '1', price: '100.00' },
      ],
      total:'1',
      totalPrice:'100.00',
      img:'../../img/test.png',
      title:'豪华大房'
    }
  },
  onLoad(options) {
    var that = this;
    var scrollHeight = this.data.scrollHeight
    var rpx = scrollHeight / 555
    console.log('rpx', rpx)
    scrollHeight += 46 * rpx
    this.setData({
      scrollHeight: scrollHeight
    })
    console.log('商家seller_id', JSON.parse(options.seller_id));
    var data = {
      seller_id: JSON.parse(options.seller_id),
      token: app.globalData.userInfo.token
    }
    //请求商家详情
    util.httpPost(app.globalUrl + app.HOTELINFO, data, this.processInfoData);
  },
  onShow(){
    // 设置日期默认值
    this.setDefineDate()
  },
  setDefineDate(){
    //当前日期
    var nowDate = app.getEnterAndLeaveDate(0)
    //第二天日期
    var nextDate = app.getEnterAndLeaveDate(1)
    var nowDateArr = nowDate.split('-')
    var nextDateArr = nextDate.split('-')
    this.setData({
      nowTime: nowDate,
      ruzhuTime: nowDate,
      lidianTime: nextDate,
      ruzhuTimeText: nowDateArr[1] + '月' + nowDateArr[2] + '日',
      lidianTimeText: nextDateArr[1] + '月' + nextDateArr[2] + '日',
    })
  },
  //导航去酒店
  daohang(){
    var obj = this.data.detail.store_fixed.split(',')
    var latitude = parseFloat(obj[0])
    var longitude = parseFloat(obj[1])
    wx.openLocation({ latitude: latitude, longitude: longitude})
  },
  processInfoData(res) {
    if (res.suc == 'y') {
      console.log('酒店数据成功', res.data);
      var slider = []
      //图片地址加前缀
      for (var i in res.data.banner_src){
        slider.push({
          img_src: app.globalImageUrl + res.data.banner_src[i]
        })
      }
      this.setData({
        detail: res.data,
        slider: slider
      })
      // 请求酒店详情成功之后再请求评价列表
      var data2 = {
        page_no: 1,
        page_size: 15,
        seller_id: res.data.seller_id
      }
      util.httpPost(app.globalUrl + app.REMARK, data2, this.processREMARKData);

    } else {
      console.log('返回酒店数据错误', res);
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
  seeMore(e){
    var seller_id = this.data.detail.seller_id
    var go = function(e){
      wx.navigateTo({
        url: '/pages/pingjiaList/pingjiaList?seller_id=' + seller_id
      })
    }
    var data = { go, e }
    this.clickTooFast(data)
  },
  //预定
  yuding(e) {
    var that = this;
    var go = function (e) {
      var goods_id = e.currentTarget.dataset.goods_id
      var ruzhuTime = that.data.ruzhuTime
      var lidianTime = that.data.lidianTime
      if (ruzhuTime > lidianTime) {
        wx.showToast({
          title: '入住时间不可晚于离店时间',
        })
        return
      } else {
        // 计算buy_key
        var buy_key = that.getAll(ruzhuTime, lidianTime)
        var params = {
          buy_key: buy_key,
          goods_id: goods_id,
          token:app.globalData.userInfo.token
        }
        console.log('params', params)
        util.httpPost(app.globalUrl + app.HOTELORDER, params, that.processData);
      }
    }
    var data = { go, e }
    this.clickTooFast(data)
  },
  processData(res){
    if (res.suc == 'y') {
      console.log('获取预定数据成功', res.data); 
      wx.hideLoading()
      // 组装订单里面的日期数据
      var dataList = []
      for (var i in res.data.list) {
        dataList.push(res.data.list[i]); 
      }
      // 计算房间数和总价
      var totalPrice = 0
      var total = 0
      for (var i in dataList){
        totalPrice += parseFloat(dataList[i].price)
        total += parseInt(dataList[i].quantity)
      }
      // 轮播图
      var img = [];
      for (var i in res.data.goods_info.banner_src){
        img.push({
          img_src: app.globalImageUrl + res.data.goods_info.banner_src[i]
        })
      }
      // 房间属性
      var labels = [];
      for (var i in res.data.goods_info.attr_detail.attr){
        labels.push({
          name: res.data.goods_info.attr_detail.attr[i], 
          value: res.data.goods_info.attr_detail.attr_value[i]
        })
      }
      // 组装弹窗展示的数据
      var hotelOrderDetail = {
        dataList: dataList,
        totalPrice: totalPrice,
        total: total,
        desc: res.data.goods_info.desc,
        img: img,
        goods_name: res.data.goods_info.goods_name,
        labels: labels
      }
      console.log('预定房间详情', hotelOrderDetail)
      // 预定弹窗出来之后，设置本页面为不可滚动
      this.setData({
        hotelOrderDetail: hotelOrderDetail,
        scrollY:false,
      })
      // 展示订单弹窗
      this.showOrderDetail();
    } else {
      console.log('获取预定数据错误', res);
      wx.showToast({
        title: res.msg,
      })
    }
  },
  showOrderDetail() {
    this.setData({
      showOrderDetail: true,
      scrollY: false,
    })
  },
  hiddenOrderDetail() {
    this.setData({
      showOrderDetail: false,
      scrollY: true,
    })
  },
  //提交酒店单个订单
  cancelYuDing(){
    this.hiddenOrderDetail();
  },
  submitYuDing(){
    // 预定了订单之后，将数据放入allList里面，便于合计提交的时候组装buy_key
    var allList = this.data.allList || [];
    var hotelOrderDetail = this.data.hotelOrderDetail;
    allList = [...allList, ...hotelOrderDetail.dataList]
    //利用allList计算当前总价
    var allOrderPrice = 0
    for (var i in allList) {
      allOrderPrice += parseFloat(allList[i].price)
    }
    this.setData({
      allList: allList,
      allOrderPrice: allOrderPrice,
    })
    console.log('allList', allList)
    this.hiddenOrderDetail();
  },
  //计算两个日期之间的所有日期，然后组装buy_key
  getAll(begin, end) {
    var ab = begin.split("-");
    var ae = end.split("-");
    var db = new Date();
    db.setUTCFullYear(ab[0], ab[1] - 1, ab[2]);
    var de = new Date();
    de.setUTCFullYear(ae[0], ae[1] - 1, ae[2]);
    var unixDb = db.getTime();
    var unixDe = de.getTime();
    var buy_key = '';
    for (var k = unixDb; k < unixDe;) {
      console.log((new Date(parseInt(k))).format());
      buy_key += (parseInt((new Date(parseInt(k))).format().substr(8, 2)) + '_1|')
      k = k + 24 * 60 * 60 * 1000;
    }
    //去掉最后一个'|'
    buy_key = buy_key.substring(0, buy_key["length"] - 1)
    return buy_key
  },
  // 选择日期
  ruzhu: function (e) {
    var ruzhuTime = e.detail.value
    var month = (ruzhuTime[5] == '0' ? '' : ruzhuTime[5]) + ruzhuTime[6]
    var day = (ruzhuTime[8] == '0' ? '' : ruzhuTime[8]) + ruzhuTime[9]
    var lidianStarTime = this.getLidianStarTime(ruzhuTime, '2020-12-12')
    this.setData({
      ruzhuTimeText: month + '月' + day + '日',
      ruzhuTime: ruzhuTime,
      lidianStarTime: lidianStarTime,
    })
    console.log(ruzhuTime)
  },
  //根据入驻时间设置离店时间以入驻时间第二天开始
  getLidianStarTime(begin, end) {
    var ab = begin.split("-");
    var ae = end.split("-");
    var db = new Date();
    db.setUTCFullYear(ab[0], ab[1] - 1, ab[2]);
    var de = new Date();
    de.setUTCFullYear(ae[0], ae[1] - 1, ae[2]);
    var unixDb = db.getTime();
    var unixDe = de.getTime();
    for (var k = unixDb + (1000 * 60 * 60 * 24); k < unixDe;) {
      return (new Date(parseInt(k))).format()
    }
  },
  ruzhu: function (e) {
    var ruzhuTime = e.detail.value
    var ruzhuTimeArr = ruzhuTime.split("-");
    // 如果月份或者天数小于10，则取单数
    if (ruzhuTimeArr[1][0] == '0') {
      ruzhuTimeArr[1] = ruzhuTimeArr[1][1]
    }
    if (ruzhuTimeArr[2][0] == '0') {
      ruzhuTimeArr[2] = ruzhuTimeArr[2][1]
    }
    // 重新组装ruzhuTime
    ruzhuTime = ruzhuTimeArr.join('-')
    var lidianStarTime = this.getLidianStarTime(ruzhuTime, '2020-12-12')
    this.setData({
      ruzhuTimeText: ruzhuTimeArr[1] + '月' + ruzhuTimeArr[2] + '日',
      ruzhuTime: ruzhuTime,
      lidianStarTime: lidianStarTime,
    })
  },
  lidian: function (e) {
    var lidianTime = e.detail.value
    var lidianTimeArr = lidianTime.split("-");
    // 如果月份或者天数小于10，则取单数
    if (lidianTimeArr[1][0] == '0') {
      lidianTimeArr[1] = lidianTimeArr[1][1]
    }
    if (lidianTimeArr[2][0] == '0') {
      lidianTimeArr[2] = lidianTimeArr[2][1]
    }
    // 重新组装lidianTime
    lidianTime = lidianTimeArr.join('-')
    this.setData({
      lidianTimeText: lidianTimeArr[1] + '月' + lidianTimeArr[2] + '日',
      lidianTime: lidianTime
    })
  },
  //点击广告
  clickBanner: function (e) {
    var that = this
    bannerTemp.clickBanner(e, that)
  },
  clickItem: function (e) {
    var that = this
    dataItemTemp.clickItem(e, that)
  },
  jiesuan(e){
    var that = this;
    var go = function (e) {
      var buy_key = '';
      var allList = that.data.allList
      if (allList && allList.length>0){
        //组装buy_key
        for (var i in allList) {
          buy_key += allList[i].product_id + '_' + allList[i].quantity + '|'
        }
        //去掉最后一个'|'
        buy_key = buy_key.substring(0, buy_key["length"] - 1)
        var data = {
          buy_key: buy_key,
          token: app.globalData.userInfo.token
        }
        util.httpPost(app.globalUrl + app.CARTSUBMIT, data, that.processSubmitData);
      }else{
        wx.showToast({
          title: '请先预定房间',
        })
      }
    }
    var data = { go, e }
    this.clickTooFast(data)
  },
  processSubmitData: function (res) {
    if (res.suc == 'y') {
      console.log('合计提交成功', res.data);
      this.goPayPage(res.data)
    } else {
      console.log('合计提交错误', res);
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
      url: '/pages/tijiaojiudiandingdan/tijiaojiudiandingdan'
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
  },
})