/*==========
防止快速点击
===========*/
function clickTooFast(data, that) {
  var lastTime = that.data.lastTime
  var curTime = data.e.timeStamp
  if (lastTime > 0) {
    if (curTime - lastTime < 600) {
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

function hangyepaixu(e, that) {
  var go = function (e) {
    var nowPaiXu = that.data.allData.nowPaiXu
    var hangyepaixu = that.data.allData.hangyepaixu
    var xiaoliangpaixu = that.data.allData.xiaoliangpaixu
    var julipaixu = that.data.allData.julipaixu
    var paixuList = that.data.allData.paixuList
    switch (nowPaiXu) {
      case 0: case 2: case 3: case 4: case 5: case 6:
        hangyepaixu = paixuList[2];
        xiaoliangpaixu = paixuList[0];
        julipaixu = paixuList[0];
        nowPaiXu = 1;
        break;
      case 1:
        hangyepaixu = paixuList[1];
        xiaoliangpaixu = paixuList[0];
        julipaixu = paixuList[0];
        nowPaiXu = 2;
        break;
    }
    that.setData({
      'allData.hangyepaixu': hangyepaixu,
      'allData.xiaoliangpaixu': xiaoliangpaixu,
      'allData.julipaixu': julipaixu,
      'allData.nowPaiXu': nowPaiXu,
    })
    console.log(nowPaiXu)
    return nowPaiXu
  }
  var data = { go, e }
  clickTooFast(data, that)
}

function xiaoliangpaixu(e, that) {
  var go = function (e) {
    var nowPaiXu = that.data.allData.nowPaiXu
    var hangyepaixu = that.data.allData.hangyepaixu
    var xiaoliangpaixu = that.data.allData.xiaoliangpaixu
    var julipaixu = that.data.allData.julipaixu
    var paixuList = that.data.allData.paixuList
    switch (nowPaiXu) {
      case 0: case 4: case 1: case 2: case 5: case 6:
        hangyepaixu = paixuList[0];
        xiaoliangpaixu = paixuList[2];
        julipaixu = paixuList[0];
        nowPaiXu = 3;
        break;
      case 3:
        hangyepaixu = paixuList[0];
        xiaoliangpaixu = paixuList[1];
        julipaixu = paixuList[0];
        nowPaiXu = 4;
        break;
    }
    that.setData({
      'allData.hangyepaixu': hangyepaixu,
      'allData.xiaoliangpaixu': xiaoliangpaixu,
      'allData.julipaixu': julipaixu,
      'allData.nowPaiXu': nowPaiXu,
    })
    console.log(nowPaiXu)
    return nowPaiXu
  }
  var data = { go, e }
  clickTooFast(data, that)
}

function julipaixu(e, that) {
  var go = function (e) {
    var nowPaiXu = that.data.allData.nowPaiXu
    var hangyepaixu = that.data.allData.hangyepaixu
    var xiaoliangpaixu = that.data.allData.xiaoliangpaixu
    var julipaixu = that.data.allData.julipaixu
    var paixuList = that.data.allData.paixuList
    switch (nowPaiXu) {
      case 0: case 6: case 1: case 2: case 3: case 4:
        hangyepaixu = paixuList[0];
        xiaoliangpaixu = paixuList[0];
        julipaixu = paixuList[2];
        nowPaiXu = 5;
        break;
      case 5:
        hangyepaixu = paixuList[0];
        xiaoliangpaixu = paixuList[0];
        julipaixu = paixuList[1];
        nowPaiXu = 6;
        break;
    }
    that.setData({
      'allData.hangyepaixu': hangyepaixu,
      'allData.xiaoliangpaixu': xiaoliangpaixu,
      'allData.julipaixu': julipaixu,
      'allData.nowPaiXu': nowPaiXu,
    })
    console.log(nowPaiXu)
    return nowPaiXu
  }
  var data = { go, e }
  clickTooFast(data, that)
}

module.exports = {
  hangyepaixu: hangyepaixu,
  xiaoliangpaixu: xiaoliangpaixu,
  julipaixu: julipaixu,
}