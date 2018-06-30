var Moment = require("../../utils/moment.js");
var DATE_LIST = [];
var DATE_YEAR = new Date().getFullYear();
var DATE_MONTH = new Date().getMonth() + 1;
var DATE_DAY = new Date().getDate();
var app = getApp()
var util = require('../../utils/util.js');
Page({
  data: {
    maxMonth: 7, //最多渲染月数
    dateList: [],
    systemInfo: {},
    weekStr: ['日', '一', '二', '三', '四', '五', '六'],
    checkInDate: Moment(new Date()).format('YYYY-MM-DD'),
    markcheckInDate: false, //标记开始时间是否已经选择
    // 价格列表
    priceListData:[],
    sFtv: [
      {
        month: 1,
        day: 1,
        name: "元旦"
      },
      {
        month: 2,
        day: 14,
        name: "情人节"
      },
      {
        month: 3,
        day: 8,
        name: "妇女节"
      },
      {
        month: 3,
        day: 12,
        name: "植树节"
      },
      {
        month: 3,
        day: 15,
        name: "消费者权益日"
      },
      {
        month: 4,
        day: 1,
        name: "愚人节"
      },
      {
        month: 5,
        day: 1,
        name: "劳动节"
      },
      {
        month: 5,
        day: 4,
        name: "青年节"
      },
      {
        month: 5,
        day: 12,
        name: "护士节"
      },
      {
        month: 6,
        day: 1,
        name: "儿童节"
      },
      {
        month: 7,
        day: 1,
        name: "建党节"
      },
      {
        month: 8,
        day: 1,
        name: "建军节"
      },
      {
        month: 9,
        day: 10,
        name: "教师节"
      },
      {
        month: 9,
        day: 28,
        name: "孔子诞辰"
      },
      {
        month: 10,
        day: 1,
        name: "国庆节"
      },
      {
        month: 10,
        day: 6,
        name: "老人节"
      },
      {
        month: 10,
        day: 24,
        name: "联合国日"
      },
      {
        month: 12,
        day: 24,
        name: "平安夜"
      },
      {
        month: 12,
        day: 25,
        name: "圣诞节"
      }
    ]
  },
  onLoad(options) {
    this.createDateListData();
    var _this = this;
    // 页面初始化 options为页面跳转所带来的参数
    var checkInDate = Moment(new Date()).format('YYYY-MM-DD');
    wx.getSystemInfo({
      success: function (res) {
        _this.setData({ systemInfo: res, checkInDate: checkInDate});
      }
    })
    //根据日期获取价格列表
    this.getPriceList(options.product_id)
  },
  getPriceList(product_id){
    util.httpPost(app.globalUrl + app.DatePriceList, { product_id: product_id }, this.processPriceListData);
  },
  processPriceListData(res){
    if(res.suc == 'y'){
      this.setData({
        priceListData: res.data
      })
      this.addPrice(res.data);
    } else {
      console.log('根据日期获取价格列表错误', res);
    }
  },
  createDateListData() {
    var dateList = [];
    var now = new Date();
    /*
      设置日期为 年-月-01,否则可能会出现跨月的问题
      比如：2017-01-31为now ,月份直接+1（now.setMonth(now.getMonth()+1)），则会直接跳到跳到2017-03-03月份.
        原因是由于2月份没有31号，顺推下去变成了了03-03
    */
    now = new Date(now.getFullYear(), now.getMonth(), 1);
    for (var i = 0; i < this.data.maxMonth; i++) {
      var momentDate = Moment(now).add(this.data.maxMonth - (this.data.maxMonth - i), 'month').date;
      var year = momentDate.getFullYear();
      var month = momentDate.getMonth() + 1;

      var days = [];
      var totalDay = this.getTotalDayByMonth(year, month);
      var week = this.getWeek(year, month, 1);
      //-week是为了使当月第一天的日期可以正确的显示到对应的周几位置上，比如星期三(week = 2)，
      //则当月的1号是从列的第三个位置开始渲染的，前面会占用-2，-1，0的位置,从1开正常渲染
      for (var j = -week + 1; j <= totalDay; j++) {
        var tempWeek = -1;
        if (j > 0)
          tempWeek = this.getWeek(year, month, j);
        var clazz = '';
        if (tempWeek == 0 || tempWeek == 6)
          clazz = 'week'
        if (j < DATE_DAY && year == DATE_YEAR && month == DATE_MONTH)
          //当天之前的日期不可用
          clazz = 'unavailable ' + clazz;
        else
          clazz = '' + clazz
        days.push({ day: j < 10 ? '0' + j : j, class: clazz })
      }
      var dateItem = {
        id: year + '-' + month,
        year: year,
        month: month < 10 ? '0' + month : month,
        days: days
      }
      dateList.push(dateItem);
    }
    // var sFtv = this.data.sFtv;
    // for (let i = 0; i < dateList.length; i++) {//加入公历节日
    //   for (let k = 0; k < sFtv.length; k++) {
    //     if (dateList[i].month == sFtv[k].month) {
    //       let days = dateList[i].days;
    //       for (let j = 0; j < days.length; j++) {
    //         if (days[j].day == sFtv[k].day) {
    //           days[j].daytext = sFtv[k].name
    //         }
    //       }
    //     }
    //   }
    // }
    this.setData({
      dateList: dateList
    });
    DATE_LIST = dateList;
  },
  /*
	 * 获取月的总天数
	 */
  getTotalDayByMonth(year, month) {
    month = parseInt(month, 10);
    var d = new Date(year, month, 0);
    return d.getDate();
  },
	/*
	 * 获取月的第一天是星期几
	 */
  getWeek(year, month, day) {
    var d = new Date(year, month - 1, day);
    return d.getDay();
  },
  // 添加每日价格
  addPrice(priceListData) {
    var dateList = this.data.dateList
    for (let i = 0; i < dateList.length; i++) {
      let days = dateList[i].days;
      for (let j = 0; j < days.length; j++) {
        for (let k in priceListData){
          if (priceListData[k].date == dateList[i].year + '-' + dateList[i].month + '-' + days[j].day) {
            days[j].text = '￥' + priceListData[k].price
            break
          }
        }
      }
    }
    this.setData({
      dateList: dateList
    });
  },
  /**
   * 点击日期事件
   */
  onPressDate(e) {
    var { year, month, day } = e.currentTarget.dataset;
    //当前选择的日期为同一个月并小于今天，或者点击了空白处（即day<0），不执行
    if ((day < DATE_DAY && month == DATE_MONTH) || day <= 0) return;

    var date = year + '-' + month + '-' + day;
    var dateText = (month > 9 ? month : month[1]) + '月' + (day > 9 ? day : day[1])  + '日';
    console.log('选中', date)
    wx.setStorageSync('chooseDate', date)
    wx.setStorageSync('chooseDateText', dateText)
    wx.setStorageSync('changeData', true)
    this.renderPressStyle(year, month, day);
  },
  renderPressStyle(year, month, day) {
    var dateList = this.data.dateList;
    //渲染点击样式
    for (var i = 0; i < dateList.length; i++) {
      var dateItem = dateList[i];
      var days = dateItem.days;
      var id = dateItem.id;
      for (var j = 0; j < days.length; j++){
        if (days[j].checked) {
          //先将所有的日期的active类去掉
          days[j].checked = false;
        }
        if (id === year + '-' + month){
          //再将选中的日期加上active类
          var tempDay = days[j].day;
          if (tempDay == day) {
            days[j].checked = true;
          }
        }
      }
    }
    this.setData({
      dateList: dateList
    });
    setTimeout(function () {
      wx.navigateBack()
    }, 300)
  }
})