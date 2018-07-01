// pages/qiandaohudenglu/qiandaohudenglu.js
let util = require('../../utils/util.js');
let bannerTemp = require('../../utils/bannerTemp.js');
let dataItemTemp = require('../../utils/dataItemTemp.js'); 
let basic = require('../../utils/basic.js'); 
let app = getApp(); 
Page({
  data: {
    redStar: '../../img/red-star.png',
    defaultStar:'../../img/default-star.png',
    daohang:'../../img/daohang.png',
    more:'../../img/more.png',
    seeMore_0: '../../img/seeMore_0.png',
    seeMore_1: '../../img/seeMore_1.png',
    slider: [],
    detail:{},
    // 基础门票的规格数据
    proudctList:[],
    tabList:[
      {
        name:'基础门票',
        checked:true
      },
      // {
      //   name:'必看推荐',
      //   chceked: false
      // }
    ],
    topInfo:{
      name:'千岛湖',
      des:'浙江省千岛湖景区'
    },
    list_1: [
      {
        img: '../../img/banner.png',
        name: '千岛湖中心湖区门票+梦想一号船票（成人）',
        today: '今日可定',
        sale: 23,
        price: '360'
      },
      {
        img: '../../img/banner.png',
        name: '千岛湖中心湖区门票+梦想一号船票（成人）',
        today: '今日可定',
        sale: 23,
        price: '360'
      }
    ],
    list_3: [
      {
        name: '千岛湖',
        stars: [1, 1, 1, 1, 0],
        des: '千岛湖位于附近客户端返回接口数据看看大家护肤会计核算的是数据库恢复看机会双方的接口就好好啊啊就看拉萨拉萨的空间发的旅客谨防的',
        imgs: ['../../img/banner.png', '../../img/banner.png', '../../img/banner.png'],
        userName: '鱼丸仔',
        dianzan: 100
      },
      {
        name: '千岛湖',
        stars: [1, 1, 1, 1, 0],
        des: '千岛湖位于附近客户端返回接口数据看看大家护肤会计核算的是数据库恢复看机会双方的接口就好好啊啊就看拉萨拉萨的空间发的旅客谨防的',
        imgs: ['../../img/banner.png', '../../img/banner.png', '../../img/banner.png'],
        userName: '鱼丸仔',
        dianzan: 100
      }
    ],
    list_4: [
      {
        img: '../../img/banner.png',
        name: '千岛湖三日自驾游',
        price: '800'
      },
      {
        img: '../../img/banner.png',
        name: '千岛湖三日自驾游',
        price: '800'
      },
      {
        img: '../../img/banner.png',
        name: '千岛湖三日自驾游',
        price: '800'
      },
      {
        img: '../../img/banner.png',
        name: '千岛湖三日自驾游',
        price: '800'
      },
      {
        img: '../../img/banner.png',
        name: '千岛湖三日自驾游',
        price: '800'
      }
    ],
    nowOpen:''
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    //获取屏幕高度
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          scrollHeight: res.windowHeight
        });
      }
    });
    let data = {
      seller_id: options.seller_id || JSON.parse(options.params).seller_id,
      token: app.globalData.userInfo.token
    }
    let data_2 = {
      type: 3,
      cur_fixed: app.globalData.firstLongitude + ',' + app.globalData.firstLatitude
    }
    //请求票务
    util.httpPost(app.globalUrl + app.TicketIndex, data, this.processTicketIndexData);
    //请求周边景点
    util.httpPost(app.globalUrl + app.Recommend, data_2, this.processRecommendData);
  },
  processRecommendData(res) {
    if (res.suc == 'y') {
      console.log('周边景点成功', res.data);
      //图片地址加前缀
      for (let i in res.data) {
        res.data[i].store_img_src = app.globalImageUrl + res.data[i].store_img_src
      }
      this.setData({
        list_4: res.data,
      })
    } else {
      console.log('返回周边景点错误', res);
    }
  },
  //景点介绍
  introduce(){
    wx.navigateTo({
      url: '../jingdianjieshao/jingdianjieshao?seller_id=' + this.data.detail.seller_id,
    })
  },
  processTicketIndexData(res) {
    if (res.suc == 'y') {
      console.log('景点票务成功', res.data);
      let slider = []
      //图片地址加前缀
      for (let i in res.data.banner_src) {
        slider.push({
          img_src: app.globalImageUrl + res.data.banner_src[i]
        })
      }
      res.data.store_img_src = app.globalImageUrl + res.data.store_img_src
      let proudctList = res.data
      for (let i in res.data.goods_item.list) {
        res.data.goods_item.list[i].open = false
      }
      this.setData({
        detail: res.data,
        slider: slider,
      })
    } else {
      console.log('返回景点票务错误', res);
    }
  },
  //点击周边景点
  clickRecommend(e){
    let item = e.currentTarget.dataset.item
    let that = this
    let page = 'qiandaohudenglu'
    let params = { seller_id: item.seller_id }
    basic.replacePage(page, that, e, params)
  },
  // 请求票务的规格
  chooseType(e){
    let index = e.currentTarget.dataset.index
    let goods_id = e.currentTarget.dataset.item.goods_id
    let detail = this.data.detail
    let nowOpen = this.data.nowOpen
    //点击的是已经请求过数据的项目，这只切换其开关状态
    if (nowOpen === index){
      detail.goods_item.list[index].open = !detail.goods_item.list[index].open
      this.setData({
        detail: detail,
      })
      return
    }else{
      // 初次点击时nowOpen是''，所以需要判断一下
      if(nowOpen !== ''){
        detail.goods_item.list[nowOpen].open = false
      }
      detail.goods_item.list[index].open = true
      this.setData({
        detail: detail,
        nowOpen: index,
      })
      util.httpPost(app.globalUrl + app.TicketProductIndex, { goods_id: goods_id }, this.processTicketProductIndexData);
    }
  },
  processTicketProductIndexData(res){
    if (res.suc == 'y') {
      console.log('票务的规格成功', res.data);
      this.setData({
        proudctList: res.data
      })
    } else {
      console.log('返回票务的规格错误', res);
    }
  },
  //页面跳转
  goPage: function (e) {
    var that = this
    var page = 'yudingpiaowu'
    let params = { 
      product_id: e.currentTarget.dataset.item.product_id,
      goods_id: e.currentTarget.dataset.item.goods_id
      }
    basic.goPage(page, that, e, params)
  },
  //导航
  daohang() {
    var obj = this.data.detail.store_fixed.split(',')
    var latitude = parseFloat(obj[0])
    var longitude = parseFloat(obj[1])
    wx.openLocation({ latitude: latitude, longitude: longitude })
  },
  //预定门票
  yuding(e) {
    var that = this
    var page = 'yudingpiaowu'
    let params = {
      product_id: e.currentTarget.dataset.item.product_id,
      goods_id: e.currentTarget.dataset.item.goods_id
    }
    basic.goPage(page, that, e, params)
  },
})