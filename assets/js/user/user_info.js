$(function () {
  var form = layui.form;

  form.verify({
    nickname: function (value) {
      if (value.length < 1 || value.length > 6) {
        return "用户名长度需在 1 ~ 6 之间!";
      }
    },
  });

  initUserInfo();

  //初始化用户的基本信息
  function initUserInfo() {
    $.ajax({
      method: "GET",
      url: "/my/userinfo",
      success: function (res) {
        if (res.status !== 0) {
          return console.log(res.message);
        }
        // console.log(res);
        form.val("user_info", res.data);
      },
    });
  }
  //重置表单的数据
  $("#reset").on("click", function (e) {
    //阻止表单的默认重置行为
    e.preventDefault();
    initUserInfo();
  });

  //点击提交修改 修改用户信息事件
  $(".layui-form").on("submit", function (e) {
    //阻止表单的默认提交行为
    e.preventDefault();
    // 发起ajax数据请求;
    $.ajax({
      method: "POST",
      url: "/my/userinfo",
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg("更新用户信息失败");
        }
        layer.msg("更新用户信息成功");
        // getUserInfo();
        window.parent.getUserInfo();
      },
    });
  });
});
