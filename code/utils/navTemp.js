
/*==========
防止快速点击
===========*/
function clickTooFast(data, that) {
  var lastTime = that.data.lastTime
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
  that.setData({
    lastTime: curTime
  })
}

function clickNav(e, that, item) {
  console.log(item)
  var go = function (e) {
    var page = item.page
    //酒店和餐饮是回到tab页面
    if (page == 'jiudian' || page == 'canyin' ){
      page = '../' + page + '/' + page
      wx.switchTab({
        url: page
      })
    } else if (page == "jiudianList" || page == 'canyinList' ) {
      // 点击nav去到酒店列表或者餐饮列表，需要trade_id
      var params = {trade_id:item.trade_id}
      page = '../' + page + '/' + page + '?params=' + JSON.stringify(params)
      wx.navigateTo({
        url: page
      })
    }else{
      // 无参数跳转页面
      page = '../' + page + '/' + page
      wx.navigateTo({
        url: page
      })
    }
  }
  var data = { go, e }
  clickTooFast(data, that)
}


module.exports = {
  clickNav: clickNav,
}