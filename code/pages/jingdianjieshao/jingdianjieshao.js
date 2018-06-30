// pages/yudingpiaowu/yudingpiaowu.js
let util = require('../../utils/util.js');
let basic = require('../../utils/basic.js');
var WxParse = require('../../wxParse/wxParse.js');
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderDes: {},
    navList:[],
    nowIntroduce:{},
    nowType:0,
  },
  onLoad: function (options) {
    let seller_id = JSON.parse(options.seller_id)
    util.httpPost(app.globalUrl + app.TicketIntroduce, { seller_id: seller_id}, this.processTicketIntroduceData);
  },
  processTicketIntroduceData(res) {
    let that = this
    if (res.suc == 'y') {
      let content = ''
      let navList = []
      for (let i in res.data) {
        content = res.data[i].explain_content
        WxParse.wxParse('article' + i, 'html', content, that, 5);
        res.data[i].article = this.data['article' + i]
        navList.push(
          {
            name:res.data[i].explain_title,
            checked: false,
            id: i,
          }
        )
      }
      navList[0].checked = true;
      this.setData({
        orderDes: res.data,
        navList: navList,
        nowIntroduce: res.data[0]
      })
    } else {
    }
  },
  /* ===选择订单状态类型 */
  checked: function (e) {
    var index = e.target.dataset.index;
    if (index == this.data.nowType) {
      return
    } else {
      // 标题
      var navList = this.data.navList
      // 取消所有title的选中
      for (var i = 0; i < navList.length; i++) {
        navList[i]['checked'] = false
      };
      // 选中当前title
      navList[index]['checked'] = true
      this.setData({
        navList: navList,
        nowType: index,
        nowIntroduce: this.data.orderDes[index],
      })
    }
  },
})