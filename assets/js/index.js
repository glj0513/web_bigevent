$(function () {
  //调用函数获取用户基本信息
  getUserInfo();

  var layer = layui.layer;

  //退出按钮点击事件
  $("#btnLogout").on("click", function () {
    layer.confirm(
      "确认退出登录?",
      { icon: 3, title: "提示" },
      function (index) {
        //do something
        //清空本地存储中的 token
        localStorage.removeItem("token");
        //重新跳转到 登陆页面
        location.href = "/login.html";
        layer.close(index);
      }
    );
  });
});

//获取用户基本信息
function getUserInfo() {
  $.ajax({
    method: "GET",
    url: "/my/userinfo",
    success: function (res) {
      if (res.status !== 0) {
        return layui.layer.msg("获取用户信息失败！");
      }
      // console.log(res);
      //调用函数渲染用户头像
      renderAvatar(res.data);
    },
    // complete: function (res) {
    //   // console.log(res);
    //   if (
    //     res.responseJSON.status === 1 &&
    //     res.responseJSON.message === "身份认证失败！"
    //   ) {
    //     localStorage.removeItem("token");
    //     location.href = "/login.html";
    //   }
    // },
  });
}

//渲染头像的函数
function renderAvatar(user) {
  //获取用户名称
  var name = user.nickname || user.username;
  //设置欢迎文本
  $("#welcome").html("欢迎&nbsp;&nbsp;" + name);
  // 按需渲染用户头像
  if (user.user_pic !== null) {
    //渲染图片头像
    $(".layui-nav-img").attr("src", user.user_pic).show();
    $(".text-avator").hide();
  } else {
    //渲染文字头像
    $(".layui-nav-img").hide();
    var first = name[0].toUpperCase();
    $(".text-avator").html(first).show();
  }
}
