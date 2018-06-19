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

function jingdianpaixu(e, that) {
  var go = function (e) {
    var nowPaiXu = that.data.allData_2.nowPaiXu
    var jingdianpaixu = that.data.allData_2.jingdianpaixu
    var xiaoliangpaixu = that.data.allData_2.xiaoliangpaixu
    var jiagepaixu = that.data.allData_2.jiagepaixu
    var julipaixu = that.data.allData_2.julipaixu
    var paixuList = that.data.allData_2.paixuList
    switch (nowPaiXu) {
      case 0: case 2: case 3: case 4: case 5: case 6: case 7: case 8:
        jingdianpaixu = paixuList[2];
        xiaoliangpaixu = paixuList[0];
        jiagepaixu = paixuList[0];
        julipaixu = paixuList[0];
        nowPaiXu = 1;
        break;
      case 1:
        jingdianpaixu = paixuList[1];
        xiaoliangpaixu = paixuList[0];
        jiagepaixu = paixuList[0];
        julipaixu = paixuList[0];
        nowPaiXu = 2;
        break;
    }
    that.setData({
      'allData_2.jingdianpaixu': jingdianpaixu,
      'allData_2.xiaoliangpaixu': xiaoliangpaixu,
      'allData_2.jiagepaixu': jiagepaixu,
      'allData_2.julipaixu': julipaixu,
      'allData_2.nowPaiXu': nowPaiXu,
    })
    console.log(nowPaiXu)
    return nowPaiXu
  }
  var data = { go, e }
  clickTooFast(data, that)
}

function xiaoliangpaixu(e, that) {
  var go = function (e) {
    var nowPaiXu = that.data.allData_2.nowPaiXu
    var jingdianpaixu = that.data.allData_2.jingdianpaixu
    var xiaoliangpaixu = that.data.allData_2.xiaoliangpaixu
    var jiagepaixu = that.data.allData_2.jiagepaixu
    var julipaixu = that.data.allData_2.julipaixu
    var paixuList = that.data.allData_2.paixuList
    switch (nowPaiXu) {
      case 0: case 4: case 1: case 2: case 5: case 6: case 7: case 8:
        jingdianpaixu = paixuList[0];
        xiaoliangpaixu = paixuList[2];
        jiagepaixu = paixuList[0];
        julipaixu = paixuList[0];
        nowPaiXu = 3;
        break;
      case 3:
        jingdianpaixu = paixuList[0];
        xiaoliangpaixu = paixuList[1];
        jiagepaixu = paixuList[0];
        julipaixu = paixuList[0];
        nowPaiXu = 4;
        break;
    }
    that.setData({
      'allData_2.jingdianpaixu': jingdianpaixu,
      'allData_2.xiaoliangpaixu': xiaoliangpaixu,
      'allData_2.jiagepaixu': jiagepaixu,
      'allData_2.julipaixu': julipaixu,
      'allData_2.nowPaiXu': nowPaiXu,
    })
    console.log(nowPaiXu)
    return nowPaiXu
  }
  var data = { go, e }
  clickTooFast(data, that)
}

function jiagepaixu(e, that) {
  var go = function (e) {
    var nowPaiXu = that.data.allData_2.nowPaiXu
    var jingdianpaixu = that.data.allData_2.jingdianpaixu
    var xiaoliangpaixu = that.data.allData_2.xiaoliangpaixu
    var jiagepaixu = that.data.allData_2.jiagepaixu
    var julipaixu = that.data.allData_2.julipaixu
    var paixuList = that.data.allData_2.paixuList
    switch (nowPaiXu) {
      case 0: case 6: case 1: case 2: case 3: case 4: case 7: case 8:
        jingdianpaixu = paixuList[0];
        xiaoliangpaixu = paixuList[0];
        jiagepaixu = paixuList[2];
        julipaixu = paixuList[0];
        nowPaiXu = 5;
        break;
      case 5:
        jingdianpaixu = paixuList[0];
        xiaoliangpaixu = paixuList[0];
        jiagepaixu = paixuList[1];
        julipaixu = paixuList[0];
        nowPaiXu = 6;
        break;
    }
    that.setData({
      'allData_2.jingdianpaixu': jingdianpaixu,
      'allData_2.xiaoliangpaixu': xiaoliangpaixu,
      'allData_2.jiagepaixu': jiagepaixu,
      'allData_2.julipaixu': julipaixu,
      'allData_2.nowPaiXu': nowPaiXu,
    })
    console.log(nowPaiXu)
    return nowPaiXu
  }
  var data = { go, e }
  clickTooFast(data, that)
}

function julipaixu(e, that) {
  var go = function (e) {
    var nowPaiXu = that.data.allData_2.nowPaiXu
    var jingdianpaixu = that.data.allData_2.jingdianpaixu
    var xiaoliangpaixu = that.data.allData_2.xiaoliangpaixu
    var jiagepaixu = that.data.allData_2.jiagepaixu
    var julipaixu = that.data.allData_2.julipaixu
    var paixuList = that.data.allData_2.paixuList
    switch (nowPaiXu) {
      case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 8:
        jingdianpaixu = paixuList[0];
        xiaoliangpaixu = paixuList[0];
        jiagepaixu = paixuList[0];
        julipaixu = paixuList[2];
        nowPaiXu = 7;
        break;
      case 7:
        jingdianpaixu = paixuList[0];
        xiaoliangpaixu = paixuList[0];
        jiagepaixu = paixuList[0];
        julipaixu = paixuList[1];
        nowPaiXu = 8;
        break;
    }
    that.setData({
      'allData_2.jingdianpaixu': jingdianpaixu,
      'allData_2.xiaoliangpaixu': xiaoliangpaixu,
      'allData_2.jiagepaixu': jiagepaixu,
      'allData_2.julipaixu': julipaixu,
      'allData_2.nowPaiXu': nowPaiXu,
    })
    console.log(nowPaiXu)
    return nowPaiXu
  }
  var data = { go, e }
  clickTooFast(data, that)
}

module.exports = {
  jingdianpaixu: jingdianpaixu,
  xiaoliangpaixu: xiaoliangpaixu,
  jiagepaixu: jiagepaixu,
  julipaixu: julipaixu,
}