let wx = require('weixin-js-sdk');

export const getCookie = (cname) => {
  var name = cname + "=";
  var ca = document.cookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i].trim();
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

export const setCookie = (cname, cvalue) => {
  var d = new Date();
  d.setTime(d.getTime() + (7100 * 1000));
  var expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + "; " + expires;
}

export function formatDate(date, fmt) {
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  };
  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + '';
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));
    }
  }
  return fmt;
};
// 微信分享
export function wechatConfig() { //微信jssdk
  wx.ready(function () { //需在用户可能点击分享按钮前就先调用
    wx.onMenuShareTimeline({
      title: '欢迎进入绿叶事业', // 分享标题
      link: 'http://btl.yxcxin.com/index', // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
      imgUrl: "http://stl.yxcxin.com/image/qrcode.jpg", // 分享图标
      success: function () {
        // 用户点击了分享后执行的回调函数
      }
    })
    wx.onMenuShareAppMessage({
      title: '欢迎进入绿叶事业！', // 分享标题
      desc: '超多精彩文章，每日更新推送，快来看看吧！', // 分享描述
      link: 'http://btl.yxcxin.com/index', // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
      imgUrl: 'http://stl.yxcxin.com/image/qrcode.jpg' // 分享图标
    })
  })
}

function padLeftZero(str) {
  return ('00' + str).substr(str.length);
};
