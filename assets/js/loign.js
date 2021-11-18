$(function () {
  //注册账号点击事件
  $("#login-box").on("click", function () {
    $(".login-page").hide();
    $(".reg-page").show();
  });

  //登录按钮点击事件
  $("#reg-box").on("click", function () {
    $(".reg-page").hide();
    $(".login-page").show();
  });

  //自定义校验规则
  var form = layui.form;
  var layer = layui.layer;
  form.verify({
    //自定义了一个 pwd 的校验规则
    pwd: [/^[\S]{6,12}$/, "密码必须6到12位，且不能出现空格"],
    repwd: function (value) {
      var pwd = $(".reg-page [name=password]").val();
      if (pwd !== value) {
        return "两次输入的密码不一致";
      }
    },
  });

  //监听注册表单的提交事件
  $("#form_reg").on("submit", function (e) {
    e.preventDefault();
    $.post(
      "/api/reguser",
      {
        username: $(".reg-page [name=username]").val(),
        password: $(".reg-page [name=password]").val(),
        // repassword: $(".reg-page [name=repassword]").val(),
      },
      function (res) {
        if (res.status !== 0) {
          return layer.msg(res.message);
        }
        layer.msg(res.message);
        //模拟点击行为，注册成功自动跳转到登录界面
        $("#reg-box").click();
      }
    );
  });

  //监听登录表单的提交事件
  $("#login_form").on("submit", function (e) {
    //阻止默认提交行为
    e.preventDefault();
    $.post(
      "/api/login",
      {
        username: $(".login-page [name=username]").val(),
        password: $(".login-page [name=password]").val(),
      },
      function (res) {
        if (res.status !== 0) {
          return layer.msg(res.message);
        }
        layer.msg(res.message);
        //将 token 的值保存到 localStorage 中
        localStorage.setItem("token", res.token);
        //跳转到后台主页
        location.href = "/index.html";
      }
    );
  });
});
