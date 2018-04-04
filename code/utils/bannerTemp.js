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

function clickBanner(e, that) {
  var go = function (e) {
    console.log(e.target.dataset.id)
    console.log(e.target.dataset.skip)
    console.log(e.target.dataset.url)
  }
  var data = { go, e }
  clickTooFast(data, that)
}

module.exports = {
  clickBanner: clickBanner,
}