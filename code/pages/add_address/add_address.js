// pages/add_address/add_address.js
var util = require('../../utils/util.js');
var address = require('../../utils/cityList.js');
var app = getApp();
Page({
  data: {
    list: [
      {
        text: '收货人',
        placeholder: '请输入收货人',
        max: 100
      },
      {
        text: '手机号码',
        placeholder: '请输入手机号码',
        max: 11
      },
      {
        text: '所在地区',
        placeholder: '请选择所在地区',
        max: 100
      },
      {
        text: '详细地址',
        placeholder: '请输入详细地址',
        max: 100
      }
    ],
    new_address: {},
    menuType: 0,
    begin: null,
    status: 1,
    end: null,
    isVisible: false,
    animationData: {},
    animationAddressMenu: {},
    addressMenuIsShow: false,
    value: [0, 0, 0],
    provinces: [],
    citys: [],
    areas: [],
    province: '',
    city: '',
    area: ''
  },
  //录入地址信息
  change: function (e) {
    var index = e.target.dataset.index
    var new_address = this.data.new_address
    switch (index) {
      case 0:
        new_address.name = e.detail.value;
        break
      case 1:
        new_address.tel = e.detail.value;
        break
      case 3:
        new_address.add = e.detail.value;
        break
    }
    this.setData({
      new_address: new_address
    })
  },
  //新增地址
  add: function (e) {
    var that = this
    var go = function(e) {
      var areaInfo = that.data.areaInfo
      var new_address = that.data.new_address
      var user_name = new_address.name;
      var address = new_address.add
      var mobile = parseInt(new_address.tel)
      var reg = /^1[3|5|7|8]\d{9}$/;
      if (!user_name || user_name === '') {
        wx.showToast({
          title: '请输入用户姓名',
          content: '600',
        })
      } else if (!mobile || !reg.test(mobile)) {
        wx.showToast({
          title: '请输入正确的手机号',
          content: '600',
        })
      } else if (!areaInfo || areaInfo === '') {
        wx.showToast({
          title: '请选择所在地区',
          content: '600',
        })
      } else if (!address || address === '') {
        wx.showToast({
          title: '请输入地址',
          content: '600',
        })
      } else {
        wx.showLoading({
          title: '正在添加',
        })
        var zoneArr = that.data.areaInfo.split(',')
        var params = {
          member_id: app.globalData.member_id,
          shr_name: user_name,
          address: address,
          phone: mobile,
          shr_province: zoneArr[0],
          shr_city: zoneArr[1],
          shr_area: zoneArr[2],
        }
        //保存新地址
        util.httpPost(app.globalUrl + app.ADD_ADDRESS, params, that.processAddrData);
      }
    }
    var data = { go, e }
    this.clickTooFast(data)
  },
  processAddrData(res){
    if (res.suc == 'y') {
      console.log('添加地址成功', res.data);
      wx.hideLoading()
      wx.showToast({
        title: res.msg,
        duration: 600
      })
      setTimeout(function(){
        wx.navigateBack()
      },1000)
    } else {
      console.log('添加地址错误', res);
      wx.showToast({
        title: res.msg,
      })
    }
  },
  /*==========
  防止快速点击
  ===========*/
  clickTooFast: function (data) {
    var lastTime = this.data.lastTime
    var curTime = data.e.timeStamp
    if (lastTime > 0) {
      // 此页面设置为100000，实现“点击之后就不能再点击的效果”
      if (curTime - lastTime < 100000) {
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
  onLoad: function (options) {
    // 初始化动画变量
    var animation = wx.createAnimation({
      duration: 500,
      transformOrigin: "50% 50%",
      timingFunction: 'ease',
    })
    this.animation = animation;
    // 默认联动显示北京
    var id = address.provinces[0].id
    this.setData({
      provinces: address.provinces,
      citys: address.citys[id],
      areas: address.areas[address.citys[id][0].id],
    })
  },
  // 显示
  showMenuTap: function (e) {
    console.log('selectState')
    //获取点击菜单的类型 1点击状态 2点击时间 
    var menuType = e.currentTarget.dataset.type
    // 如果当前已经显示，再次点击时隐藏
    if (this.data.isVisible == true) {
      this.startAnimation(false, -200)
      return
    }
    this.setData({
      menuType: menuType
    })
    this.startAnimation(true, 0)
  },
  hideMenuTap: function (e) {
    this.startAnimation(false, -200)
  },
  // 执行动画
  startAnimation: function (isShow, offset) {
    var that = this
    var offsetTem
    if (offset == 0) {
      offsetTem = offset
    } else {
      offsetTem = offset + 'rpx'
    }
    this.animation.translateY(offset).step()
    this.setData({
      animationData: this.animation.export(),
      isVisible: isShow
    })
    console.log(that.data)
  },
  // 选择状态按钮
  selectState: function (e) {
    console.log('selectState1')
    this.startAnimation(false, -200)
    var status = e.currentTarget.dataset.status
    this.setData({
      status: status
    })
    console.log(this.data)

  },
  // 日志选择
  bindDateChange: function (e) {
    console.log(e)
    if (e.currentTarget.dataset.type == 1) {
      this.setData({
        begin: e.detail.value
      })
    } else if (e.currentTarget.dataset.type == 2) {
      this.setData({
        end: e.detail.value
      })
    }
  },
  sureDateTap: function () {
    this.data.pageNo = 1
    this.startAnimation(false, -200)
  },
  // 点击所在地区弹出选择框
  selectDistrict: function (e) {
    var that = this
    console.log('111111111')
    if (that.data.addressMenuIsShow) {
      return
    }
    that.startAddressAnimation(true)
  },
  // 执行动画
  startAddressAnimation: function (isShow) {
    console.log(isShow)
    var that = this
    if (isShow) {
      that.animation.translateY(0 + 'vh').step()
    } else {
      that.animation.translateY(40 + 'vh').step()
    }
    that.setData({
      animationAddressMenu: that.animation.export(),
      addressMenuIsShow: isShow,
    })
  },
  // 点击地区选择取消按钮
  cityCancel: function (e) {
    this.startAddressAnimation(false)
  },
  // 点击地区选择确定按钮
  citySure: function (e) {
    var that = this
    var city = that.data.city
    var value = that.data.value
    that.startAddressAnimation(false)
    // 将选择的城市信息显示到输入框
    var areaInfo = that.data.provinces[value[0]].name + ',' + that.data.citys[value[1]].name + ',' + that.data.areas[value[2]].name
    var list = that.data.list
    list[2].placeholder = areaInfo
    that.setData({
      areaInfo: areaInfo,
      list: list,
    })
    console.log(that.data.areaInfo)
  },
  hideCitySelected: function (e) {
    console.log(e)
    this.startAddressAnimation(false)
  },
  // 处理省市县联动逻辑
  cityChange: function (e) {
    console.log(e)
    var value = e.detail.value
    var provinces = this.data.provinces
    var citys = this.data.citys
    var areas = this.data.areas
    var provinceNum = value[0]
    var cityNum = value[1]
    var countyNum = value[2]
    if (this.data.value[0] != provinceNum) {
      var id = provinces[provinceNum].id
      this.setData({
        value: [provinceNum, 0, 0],
        citys: address.citys[id],
        areas: address.areas[address.citys[id][0].id],
      })
    } else if (this.data.value[1] != cityNum) {
      var id = citys[cityNum].id
      this.setData({
        value: [provinceNum, cityNum, 0],
        areas: address.areas[citys[cityNum].id],
      })
    } else {
      this.setData({
        value: [provinceNum, cityNum, countyNum]
      })
    }
    console.log(this.data)
  },
})