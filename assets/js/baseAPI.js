//在每次调用 get、post、ajax 请求之前
//会先调用 ajaxPreFiler 这个函数
//在这个函数中，可以拿到我们给 Ajax 提供的配置对象
$.ajaxPrefilter(function (option) {
  //在发起真正的 Ajax 请求之前，统一拼接请求的根路径
  //http://www.liulongbin.top:3007/  备用路径
  option.url = "http://api-breakingnews-web.itheima.net" + option.url;
  //统一为有权限的接口，设置请求头
  if (option.url.indexOf("/my/") !== -1) {
    option.headers = {
      Authorization: localStorage.getItem("token" || ""),
    };
  }

  //全局挂载 complete 函数
  option.complete = function (res) {
    if (
      res.responseJSON.status === 1 &&
      res.responseJSON.message === "身份认证失败！"
    ) {
      //清空 token
      localStorage.removeItem("token");
      //跳转页面到 登陆页面
      location.href = "/login.html";
    }
  };
});
