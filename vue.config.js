// vue.config.js 配置说明
//官方vue.config.js 参考文档 https://cli.vuejs.org/zh/config/#css-loaderoptions
// 这里只列一部分，具体配置参考文档
module.exports = {
  // 部署生产环境和开发环境下的URL。
  // 默认情况下，Vue CLI 会假设你的应用是被部署在一个域名的根路径上
  //例如 https://www.my-app.com/。如果应用被部署在一个子路径上，你就需要用这个选项指定这个子路径。例如，如果你的应用被部署在 https://www.my-app.com/my-app/，则设置 baseUrl 为 /my-app/。
  //根目录下不需要配置
  // baseUrl: process.env.NODE_ENV === "production" ? "./" : "/",
  //   lintOnSave：{ type:Boolean default:true } 问你是否使用eslint
  lintOnSave: true,
  //如果你想要在生产构建时禁用 eslint-loader，你可以用如下配置
  // lintOnSave: process.env.NODE_ENV !== 'production',

  productionSourceMap: false,

  //是否使用包含运行时编译器的 Vue 构建版本。设置为 true 后你就可以在 Vue 组件中使用 template 选项了，但是这会让你的应用额外增加 10kb 左右。(默认false)
  // runtimeCompiler: false,

  // 它支持webPack-dev-server的所有选项
  devServer: {
    host: "btl.yxcxin.com",
    // host: "127.0.0.1",
    port: 443, // 端口号
    https: true, // https:{type:Boolean}
    open: false, //配置自动启动浏览器
    // proxy: 'http://localhost:8080' ,// 配置跨域处理,只有一个代理

    // 配置多个代理
    proxy: {
      "/": {
        target: "https://stl.yxcxin.com",
        ws: false, // 如果要代理 websockets
        changeOrigin: true, // 将主机标头的原点更改为目标URL
        // pathRewrite: {
        // '^/api': '/mock'    //代理的路径
        // }
      }
    }
  }
}
