// pages/qiandaohudenglu/qiandaohudenglu.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    redStar: '../../img/red-star',
    defaultStar:'../../img/default-star',
    daohang:'../../img/',
    more:'../../img/more',
    seeMore:'../../img/seeMore',
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
    slider: [
      {
        img_src: '../../img/banner.png'
      },
      {
        img_src: '../../img/banner.png'
      },
      {
        img_src: '../../img/banner.png'
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
        price:'360',
        priceList: [
          {
            name: '一步旅行网',
            des: '早上9：00点出发\千岛湖中心湖区门票',
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
      }
    ],
    list_3:[
      {
        name:'千岛湖',
        stars:[1,1,1,1,0],
        des:'千岛湖位于附近客户端返回接口数据看看大家护肤会计核算的是数据库恢复看机会双方的接口就好好啊啊就看拉萨拉萨的空间发的旅客谨防的',
        imgs: ['../../img/banner', '../../img/banner', '../../img/banner'],
        userName: '鱼丸仔',
        dianzan: 100
      }
    ],
    list_4:[
      {
        img:'../../img/banner.png',
        name:'千岛湖三日自驾游',
        price:'800'
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
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})