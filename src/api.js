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

export const shareUserArticle = (id, params) => {
  return request('get', '/user_articles/' + id + '/share', params)
}

export const becomeMyArticle = (params) => {  //成为我的文章
  return request('get', '/articles/become_my', params)
}

export const perfectInformation = (params) => {       //完善个人资料
  return request('patch', '/user', params)
}

export const MyArticles = (user_id, params) => {       //用户文章列表
  return request('get', '/user/' + user_id + '/articles', params)
}

export const paymenets = (params) => {       //会员价格列表
  return request('get', '/payments', params)
}

export const getProfit = (params) => {        //收益中心
  return request('get', '/profit', params)
}

export const getNormalProfitDetail = (params) => {    //普通用户收益
  return request('get', '/profit/normal', params)
}

export const withdrawCash = (params) => {          //提现操作
  return request('post', '/profit/withdraw_cash', params)
}

export const getWithdrawCashList = (params) => {          //提现记录
  return request('get', '/profit/withdraw_cash_list', params)
}

export const extensionUsers = (params) => {          //推广的用户列表
  return request('get', '/profit/extension_users', params)
}

export const extensionOrders = (params) => {          //推广的用户列表
  return request('get', '/profit/extension_orders', params)
}

export const randPoster = (count, params) => {       //按需海报列表
  return request('get', '/posters/random/' + count, params)
}

export const getPosterCategory = (params) => {        //海报分类
  return request('get', '/poster/categories', params)
}

export const getPosters = (type, id, params) => {     //海报列表
  return request('get', '/posters/' + type + '/' + id, params)
}

export const getPosterDetail = (id, params) => {      //海报详情
  return request('get', '/posters/' + id, params)
}

export const getPunchPoster = () => {
  return request('get', '/posters/punch');
}

export const getNextOrLastPoster = (params) => {  //当前分类下上一个或下一下海报
  return request('get', '/posters/next_or_last', params)
}

export const sendPoster = (params) => {       //推送推广海报到公众号
  return request('post', '/posters/send_poster_wechat', params)
}

export const getVisitor = (params) => {       //访客记录列表
  return request('get', '/visitor', params)
}

export const getVisitorReadCustom = (params) => {     //今日阅读和准客户
  return request('get', '/visitor/read_custom', params)
}

export const getVisitorDetail = (id, params) => {     //访客查看详情
  return request('get', '/visitor/user_article_show/' + id, params)
}

export const getVisitorRead = (id, params) => {       //访客还看了其他文章
  return request('get', '/visitor/also_read/' + id, params)
}

export const getVisitorProspect = (params) => {       //准客户列表
  return request('get', '/visitor/prospect', params)
}

export const ifNewVisitor = (params) => {             //查看是否有新的访客
  return request('get', '/visitor/if_new_footprint', params)
}

export const updateNewVisitorState = (params) => {    //更新访客足迹状态，页面红点去掉
  return request('get', '/visitor/update_state', params)
}

export const message = (params) => {                  //留言列表
  return request('get', '/messages', params)
}

export const messageDetail = (id, params) => {        //留言详情
  return request('get', '/messages/' + id, params)
}

export const footprint = (type, params) => {          //访客足迹列表
  return request('get', '/footprints/' + type, params)
}

export const footprintFind = (user_id, params) => {          //找到访客
  return request('get', '/footprints/find_visitor/' + user_id, params)
}

export const submitNormalMessage = (type, params) => {          //用户咨询留言提交
  return request('post', '/messages?cate=' + type, params)
}

export const getFamilyMessageCount = () => {          //用户咨询留言提交
  return request('get', '/messages/family/total')
}

export const updateReadTime = (id, params) => {          //用户咨询留言提交
  return request('patch', '/footprints/update_read_time/' + id, params)
}

export const wechatPay = (id, params) => {          //微信支付
  return request('post', '/pay/' + id, params)
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

export const orders = () => {     //滚动信息
  return request('get', '/orders')
}

export const articleExtension = (params) => {
  return request('post', '/articles/extension', params)
}






