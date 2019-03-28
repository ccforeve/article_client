import request from './axios' //引入axios的封装方法

export const userLogin = (params) => {   //登录
  return request('get', '/user/login', params)
}

export const checkToken = (params) => {   //token验证
  return request('get', '/check_token', params)
}

export const getWechatConfig = (params) => {   //获取微信jssdk配置
  return request('get', '/wechat/config', params)
}

export const getUserInfo = (params) => {   //个人资料
  return request('get', '/user', params)
}

export const UpdateUserInfo = (params) => {   //更新个人资料
  return request('patch', '/user', params)
}

export const uploadImage = (params) => {   //上传头像和二维码
  return request('post', '/upload/image', params)
}

export const getPublicQrcode = (params) => {   //获取公众号临时二维码
  return request('get', '/user/wechat_public_qrcode', params)
}

export const getUserCenter = (params) => {   //个人中心
  return request('get', '/user/center', params)
}

export const getIndexCategoryList = (params) => {   //首页文章分类
  return request('get', '/article_categories', params)
}

export const getIndexArticleList = (params) => {    //首页文章列表
  return request('get', '/articles', params)
}

export const getIndexArticleDetail = (id, params) => {  //文章详情
  return request('get', '/articles/' + id, params)
}

export const getUserArticleDetail = (id, params) => {  //用户文章详情
  return request('get', '/user_articles/' + id, params)
}

export const becomeMyArticle = (params) => {  //成为我的文章
  return request('get', '/articles/become_my', params)
}

export const perfectInformation = (data) => {       //完善个人资料
  return request('patch', '/user', data)
}

export const MyArticles = (user_id, data) => {       //用户文章列表
  return request('get', '/user/' + user_id + '/articles', data)
}

export const paymenets = (data) => {       //会员价格列表
  return request('get', '/payments', data)
}

export const getProfit = (data) => {        //收益中心
  return request('get', '/profit', data)
}

export const getNormalProfitDetail = (data) => {    //普通用户收益
  return request('get', '/profit/normal', data)
}

export const getDealerProfitDetail = (data) => {    //经销商用户收益
  return request('get', '/profit/dealer', data)
}

export const withdrawCash = (data) => {          //提现操作
  return request('post', '/profit/withdraw_cash', data)
}

export const getWithdrawCashList = (data) => {          //提现记录
  return request('get', '/profit/withdraw_cash_list', data)
}

export const extensionUsers = (data) => {          //推广的用户列表
  return request('get', '/profit/extension_users', data)
}

export const extensionOrders = (data) => {          //推广的用户列表
  return request('get', '/profit/extension_orders', data)
}

export const randPoster = (count, data) => {       //按需海报列表
  return request('get', '/posters/random/' + count, data)
}

export const getPosterCategory = (data) => {        //海报分类
  return request('get', '/poster/categories', data)
}

export const getPosters = (type, id, data) => {     //海报列表
  return request('get', '/posters/' + type + '/' + id, data)
}

export const getPosterDetail = (id, data) => {      //海报详情
  return request('get', '/posters/' + id, data)
}

export const getNextOrLastPoster = (data) => {  //当前分类下上一个或下一下海报
  return request('get', '/posters/next_or_last', data)
}

export const sendPoster = (data) => {       //推送推广海报到公众号
  return request('post', '/posters/send_poster_wechat', data)
}

export const getVisitor = (data) => {       //访客记录列表
  return request('get', '/visitor', data)
}

export const getVisitorReadCustom = (data) => {     //今日阅读和准客户
  return request('get', '/visitor/read_custom', data)
}

export const getVisitorDetail = (id, data) => {     //访客查看详情
  return request('get', '/visitor/user_article_show/' + id, data)
}

export const getVisitorRead = (id, data) => {       //访客还看了其他文章
  return request('get', '/visitor/also_read/' + id, data)
}

export const getVisitorProspect = (data) => {       //准客户列表
  return request('get', '/visitor/prospect', data)
}

export const ifNewVisitor = (data) => {             //查看是否有新的访客
  return request('get', '/visitor/if_new_footprint', data)
}

export const updateNewVisitorState = (data) => {    //更新访客足迹状态，页面红点去掉
  return request('get', '/visitor/update_state', data)
}

export const message = (data) => {                  //留言列表
  return request('get', '/messages', data)
}

export const messageDetail = (id, data) => {        //留言详情
  return request('get', '/messages/' + id, data)
}

export const footprint = (type, data) => {          //访客足迹列表
  return request('get', '/footprints/' + type, data)
}

export const footprintFind = (user_id, data) => {          //找到访客
  return request('get', '/footprints/find_visitor/' + user_id, data)
}

export const submitNormalMessage = (type, data) => {          //用户咨询留言提交
  return request('post', '/messages?cate=' + type, data)
}

export const getFamilyMessageCount = () => {          //用户咨询留言提交
  return request('get', '/messages/family/total')
}

export const updateReadTime = (id, data) => {          //用户咨询留言提交
  return request('patch', '/footprints/update_read_time/' + id, data)
}

export const pay = (id, data) => {          //支付
  return request('post', '/pay/' + id, data)
}

export const punchIndex = () => {        //打卡页面
  return request('get', '/punch')
}

export const punchStore = () => {        //打卡操作
  return request('get', '/punch/store')
}

export const punchProvince = () => {        //省份打卡第一名
  return request('get', '/punch/province')
}

export const punchTopHundred = () => {        //省份打卡第一名
  return request('get', '/punch/top_hundred')
}

export const punchCurrentUser = () => {        //省份打卡第一名
  return request('get', '/punch/current_user')
}






