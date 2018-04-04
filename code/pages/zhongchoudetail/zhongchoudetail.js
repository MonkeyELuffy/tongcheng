// pages/zhongchoudetail/zhongchoudetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    slider: [{
      img: '../../img/banner.png',
      id: 0
    }, {
      img: '../../img/banner1.png',
      id: 1
    }],
    zhongchouInfo:{
      name:'广西三生铝制品有限公司',
      state:'进行中',
      desc:'项目介绍项目介绍项目介绍项目介绍项目介绍项目介绍项目介绍项目介绍项目介绍项目介绍项目介绍',
      value: 80,
      //百分百位置
      paddingLeft: '61%',
      detail: [
        {
          name: '众筹金额',
          value: '20w'
        },
        {
          name: '参与人数',
          value: '290'
        },
        {
          name: '结束时间',
          value: '2018-03-03'
        },
      ]
    },
    navItems: [
      {
        name: '详情',
        id: 0,
        checked: true,
      },
      {
        name: '进展',
        id: 1,
        checked: false,
      },
      {
        name: '留言',
        id: 2,
        checked: false,
      }],
      
  },


  /* ===选择顶部菜单 */
  checked: function (e) {
    var that = this
    var article_type = e.target.dataset.id;
    //点击已选中的菜单时，直接返回
    if (article_type === that.data.article_type) {
      return
    } else {
      var index = e.target.dataset.index;
      console.log(index)
      var name = e.target.dataset.name;
      that.setData({
        // article_type: article_type,
        // page: 0,
        // youhuiquan_list: [],
        // bindDownLoad: true,
        // total_page: 1,
        index: index,
        // name: name
      })
      // that.loadData(index)
      that.changeStyle(index)
    }

  },
  //修改顶部菜单样式
  changeStyle: function (index) {
    var navItems = this.data.navItems
    for (var i = 0; i < navItems.length; i++) {
      navItems[i]['checked'] = false
    };
    navItems[index]['checked'] = true
    this.setData({
      navItems: navItems
    })
  },
})