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
    seeMore: '../../img/seeMore.png',
    slider: [],
    detail:{},
    // 基础门票的规格数据
    proudctList:[],
    tabList:[
      {
        name:'基础门票',
        checked:true
      },
      {
        name:'必看推荐',
        chceked: false
      }
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
    list_2:[
      {
        name:'梦想一号船票（成人）',
        price: '360',
        showChild: true,
        priceList: [
          {
            name: '一步旅行网',
            des: '早上9：00点出发\千岛湖中心湖区门票',
            price:'380',
            labels: [
              {
                name: '不可退'
              },
              {
                name: '可定明日'
              }
            ]
          },
          {
            name: '一步旅行网',
            des: '早上9：00点出发\千岛湖中心湖区门票',
            price: '380',
            labels: [
              {
                name: '不可退'
              },
              {
                name: '可定明日'
              }
            ]
          }
        ]
      },
      {
        name: '梦想一号船票（成人）',
        price: '360',
        showChild:false,
        // priceList: [
        //   {
        //     name: '一步旅行网',
        //     des: '早上9：00点出发\千岛湖中心湖区门票',
        //     price: '380',
        //     labels: [
        //       {
        //         name: '不可退'
        //       },
        //       {
        //         name: '可定明日'
        //       }
        //     ]
        //   },
        //   {
        //     name: '一步旅行网',
        //     des: '早上9：00点出发\千岛湖中心湖区门票',
        //     price: '380',
        //     labels: [
        //       {
        //         name: '不可退'
        //       },
        //       {
        //         name: '可定明日'
        //       }
        //     ]
        //   }
        // ]
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
    ]
  
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
      seller_id: options.seller_id,
      token: app.globalData.userInfo.token
    }
    //请求景点介绍
    util.httpPost(app.globalUrl + app.TicketIntroduce, data, this.processInfoData);
    //请求票务
    util.httpPost(app.globalUrl + app.TicketIndex, data, this.processTicketIndexData);
  },
  processInfoData(res) {
    if (res.suc == 'y') {
      console.log('景点介绍成功', res.data);
    } else {
      console.log('返回景点介绍错误', res);
    }
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
      this.setData({
        detail: res.data,
        slider: slider,
      })
    } else {
      console.log('返回景点票务错误', res);
    }
  },
  // 请求票务的规格
  chooseType(e){
    let goods_id = e.currentTarget.dataset.item.goods_id
    util.httpPost(app.globalUrl + app.TicketProductIndex, { goods_id: goods_id}, this.processTicketProductIndexData);
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