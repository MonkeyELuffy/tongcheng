// pages/youhuiquan/youhuiquan.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataList: [
      {
        id: 0,
        title: '通用型',
        value: 50,
        time: '2017-08-02',
        discription: '订单总金额高于代金券面值即可使用',
        status: 0,
      },
      {
        id: 1,
        title: '通用型',
        value: 50,
        time: '2017-08-02',
        discription: '订单总金额高于代金券面值即可使用',
        status: 0,
      },
      {
        id: 2,
        title: '通用型',
        value: 50,
        time: '2017-08-02',
        discription: '订单总金额高于代金券面值即可使用',
        status: 1,
      }
    ]
  },
  lingqu:function(e){
    console.log('可领取')
    console.log(e.target.dataset.id)
    var index = e.target.dataset.index
    var dataList = this.data.dataList
    dataList[index].status = 1
    this.setData({
      dataList: dataList
    })
  },
})