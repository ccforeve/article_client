/**
 * 短信验证码定时器
 * @param obj 发送按钮
 * @param html 设置文字
 * @param interval 间隔时间
 * @param cls 移除元素设置的class
 */
function smsTimer(obj, html, interval, cls) {
    obj.html(html + '(' + interval + ')');
    interval--;
    var time = setInterval(function () {
        if (interval == 0) {
            obj.attr('style', '').removeClass(cls).text(html);
            clearInterval(time);
        } else {
            obj.text(html + '(' + (interval--) + ')');
        }
    }, 1000);
}
/**
 * 获取链接的host
 */
function getHost(url) {
    var host = "null";
    if (typeof url == "undefined" || null == url)
        url = window.location.href;
    var regex = /.*\:\/\/([^\/]*).*/;
    var match = url.match(regex);
    if (typeof match != "undefined" && null != match)
        host = match[1];
    return host;
}
/**
 * get参数转 post参数
 * @param paramstr [附加参数]
 * @param url [get链接]
 */
function searchToJson(paramstr, url) {
    //if(paramstr == '') return {};
    var url = url || window.location.search;
    var newurl = url.indexOf('?') > -1 ? url.substr(url.indexOf('?') + 1) : '';
    var urlstr = (newurl == '') ? paramstr : newurl + '&' + paramstr;
    var arr = urlstr.split('&'), newarr = [];
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] == '') continue;
        var strarr = arr[i].split('=');
        var arrstr = '"' + strarr[0] + '":"' + (strarr[1] || '') + '"';
        newarr.push(arrstr);
    }
    return JSON.parse('{' + newarr.join(',') + '}');
}
