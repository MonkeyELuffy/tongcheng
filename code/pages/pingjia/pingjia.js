// pages/valuation/valuation.js

var util = require('../../utils/util.js');
var app = getApp();
var imgsrc = []
Page({
  /**
   * 页面的初始数据
   */
  data: {
    imgHttp: app.globalImageUrl,
    starlevel:0,
    lock_submit: false,
    lock: false,
    pics: [],
    normalSrc: 'img/normal.png',
    selectedSrc: 'img/selected.png',
    pingjiaList: [{
      checked: false,
      name: '好评',
      img: '../../img/haoping.png'
    }, {
      checked: false,
      name: '中评',
      img: '../../img/zhongping.png'
      }, {
        checked: false,
        name: '差评',
        img: '../../img/chaping.png'
      },],

    goodslist: [],
    add: '../../img/add_image.png'

  },


  /**
   * 生命周期函数--监听页面显示
   */
  onLoad: function (options) {
    var item = JSON.parse(options.item)
    console.log('订单数据', item)
    this.setData({
      goodslist: item.goodslist || item.items_list,
      order_id: item.order_id,
      order_bn: item.order_bn,
    })
  },
  // 提交评价
  submit: function (e) {
    var that = this
    var go = function (e) {
      if (that.data.starlevel === 0) {
        wx.showToast({
          title: '请选择星级',
          content: '1000'
        })
      } else if (!that.data.content || that.data.content === '') {
        wx.showToast({
          title: '请输入评价',
          content: '1000'
        })
      } else {
        if (that.data.lock_submit) {
          console.log('已经评价了，等等吧')
          return
        } else {
          that.setData({
            lock_submit: true
          })
          var data = {
            order_id: that.data.order_id,
            order_bn: that.data.order_bn,
            member_id: app.globalData.member_id,
            content: that.data.content,
            starlevel: that.data.starlevel,
          }
          util.httpPost(app.globalUrl + app.addEvaluate, data, that.processData);
        }
      }
    }
    var data = { go, e }
    this.clickTooFast(data)
  }, 
  processData: function (res) {
    if (res.suc == 'y') {
      wx.showToast({
        title: res.msg,
      })
      setTimeout(function(){
        // 返回订单页面
        wx.navigateBack({
          delta: 2
        })
      },1000)
    } else {
      console.log('评价错误', res);
      wx.showToast({
        title: res.msg,
      })
    }
  },
  //添加图片
  addImg: function (e) {//这里是选取图片的方法
    var that = this;
    var go = function (e) {
      if (that.data.pics.length < 9) {
        wx.chooseImage({
          count: 9 - that.data.pics.length, // 最多可以选择的图片张数，默认9
          sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
          sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
          success: function (res) {
            for (var i in res.tempFilePaths) {
              that.data.pics.push(res.tempFilePaths[i]);
            }
            that.setData({
              pics: that.data.pics
            });
          },
          fail: function () {
            // fail
          },
          complete: function () {
            // complete
          }
        })
      } else {
        wx.showToast({
          title: '最多添加9张图片',
        })
      }
    }
    var data = { go, e }
    this.clickTooFast(data)

  },
  //图片预览
  clickImage: function (e) {
    if (this.data.lock) {
      return;
    }
    var current = e.target.dataset.src
    var that = this
    wx.previewImage({
      current: current,
      urls: that.data.pics,//内部的地址为绝对路径
      fail: function () {
        console.log('fail')
      },
      complete: function () {
        console.info("点击图片了");
      },
    })
  },
  //输入评价
  changeText: function (e) {
    var that = this;
    var content = e.detail.value
    this.setData({
      content: content
    })
  },
  //选择评分
  choose: function (e) {
    var index = e.currentTarget.dataset.index
    var pingjiaList = this.data.pingjiaList
    for (var i in pingjiaList){
      pingjiaList[i].checked = false
    }
    pingjiaList[index].checked = true;
    this.setData({
      pingjiaList: pingjiaList,
      starlevel: 3 - index
    })
  },
  //上传图片
  img: function (e) {
    wx.chooseImage({
      success: function (res) {
        var tempFilePaths = res.tempFilePaths
        wx.uploadFile({
          url: app.globalData.rootUrl + '/order/imageupload',
          filePath: tempFilePaths[0],
          name: 'file',
          formData: {
            'user': 'test'
          },
          success: function (res) {
            console.log('上传的图片是', tempFilePaths[0])
            var data = res.data
            console.log("data====", data)
          }
        })
      }
    })
  },
  // 删除图片
  deleteImag: function (e) {
    this.setData({ lock: true });
    var that = this
    var index = e.currentTarget.dataset.index
    console.log(index)
    var pics = that.data.pics
    wx.showModal({
      title: '确认删除',
      content: '是否删除选中图片？',
      success: function (res) {
        if (res.confirm) {
          pics.splice(index, 1)
          that.setData({
            pics: pics,
            lock: false
          })
        }
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