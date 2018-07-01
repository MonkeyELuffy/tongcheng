var util = require('../../utils/util.js');
var WxParse = require('../../wxParse/wxParse.js');
var app = getApp()
Page({
  data: {
    detail: {}
  },
  onLoad: function (options) {
    let id = options.id
    util.httpPost(app.globalUrl + app.ArticleDetail, { id: id }, this.processArticleDetailData);
  },
  processArticleDetailData(res) {
    let that = this
    if (res.suc == 'y') {
      let detail = res.data
      wx.setNavigationBarTitle({
        title: detail.cat_name,
      })
      WxParse.wxParse('article', 'html', detail.content, that, 5);
      detail.time = detail.ctime_str.substr(0, 10)
      this.setData({
        detail: detail
      })
    }
  },
})