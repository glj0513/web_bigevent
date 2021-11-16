//在每次调用 get、post、ajax 请求之前
//会先调用 ajaxPreFiler 这个函数
//在这个函数中，可以拿到我们给 Ajax 提供的配置对象
$.ajaxPrefiler(function (option) {
  //在发起真正的 Ajax 请求之前，统一拼接请求的根路径
  option.url = "http://api-breakingnews-web.itheima.net" + option.url;
});
