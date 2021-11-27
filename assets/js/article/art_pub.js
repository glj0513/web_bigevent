$(function () {
  initCate();
  var layer = layui.layer;
  var form = layui.form;
  // 初始化富文本编辑器
  initEditor();

  //定义加载文章分类的方法
  function initCate() {
    $.ajax({
      method: "GET",
      url: "/my/article/cates",
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg("获取分类信息失败！");
        }
        //调用模板引擎渲染页面
        var htmlStr = template("tpl-cate", res);
        $("[name=cate_id]").html(htmlStr);
        form.render();
      },
    });
  }

  // 1. 初始化图片裁剪器
  var $image = $("#image");

  // 2. 裁剪选项
  var options = {
    aspectRatio: 400 / 280,
    preview: ".img-preview",
  };

  // 3. 初始化裁剪区域
  $image.cropper(options);

  //为 选择封面 按钮添加点击事件
  $("#btnChooseImage").on("click", function () {
    $("#coverFile").click();
  });

  //监听 文件选择框 的 change 事件
  $("#coverFile").on("change", function (e) {
    var file = e.target.files;
    if (file.length === 0) {
      return;
    }
    // 根据选择的文件，创建一个对应的 URL 地址：
    var newImgURL = URL.createObjectURL(file[0]);
    // 先`销毁`旧的裁剪区域，再`重新设置图片路径`，之后再`创建新的裁剪区域`：
    $image
      .cropper("destroy") // 销毁旧的裁剪区域
      .attr("src", newImgURL) // 重新设置图片路径
      .cropper(options); // 重新初始化裁剪区域
  });

  //定义文章发布的默认状态
  var art_state = "已发布";
  //监听 存为草稿 点击事件
  $("#btnSave2").on("click", function () {
    art_state = "草稿";
  });

  //监听 form 表单的 submit 事件
  $("#form-pub").on("submit", function (e) {
    //阻止表单的默认提交
    e.preventDefault();
    var fd = new FormData($(this)[0]);
    fd.append("state", art_state);

    $image
      .cropper("getCroppedCanvas", {
        // 创建一个 Canvas 画布
        width: 400,
        height: 280,
      })
      .toBlob(function (blob) {
        // 将 Canvas 画布上的内容，转化为文件对象
        // 得到文件对象后，进行后续的操作
        fd.append("cover_img", blob);
        publishArticle(fd);
      });

    // console.log(fd);
    //发起 ajax 请求,发表文章
  });

  //定义一个发表文章的 ajax 请求
  function publishArticle(fd) {
    // console.log(fd);
    fd.forEach(function (v, k) {
      console.log(k, v);
    });
    $.ajax({
      method: "POST",
      url: "/my/article/add",
      data: fd,
      contentType: false,
      processData: false,
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg("发布文章失败！");
        }
        layer.msg("发布文章成功！");
        location.href = "/article/art_list.html";
      },
    });
  }
});
