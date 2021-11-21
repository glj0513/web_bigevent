$(function () {
  var layer = layui.layer;
  // 1.1 获取裁剪区域的 DOM 元素
  var $image = $("#image");
  // 1.2 配置选项
  const options = {
    // 纵横比
    aspectRatio: 1,
    // 指定预览区域
    preview: ".img-preview",
  };

  // 1.3 创建裁剪区域
  $image.cropper(options);

  //为上传按钮添加点击事件
  $("#btnChooseImg").on("click", function () {
    $("#file").click();
  });

  //为文件选择框绑定 change 事件
  $("#file").on("change", function (e) {
    var fileList = e.target.files;
    if (fileList.length === 0) {
      return layer.msg("请选择图片!");
    }

    //拿到用户选择的图片
    var file = e.target.files[0];
    //根据选择的图片,创建一个图片的 URL 地址
    var newImgURL = URL.createObjectURL(file);
    //先销毁旧的剪裁区域,在重新设置图片路径,之后再创建新的剪裁区域
    $image
      .cropper("destroy") // 销毁旧的裁剪区域
      .attr("src", newImgURL) // 重新设置图片路径
      .cropper(options); // 重新初始化裁剪区域
  });

  //为 确定按钮 添加点击事件
  $("#btnUpload").on("click", function () {
    //拿到裁剪后的头像
    var dataURL = $image
      .cropper("getCroppedCanvas", {
        // 创建一个 Canvas 画布
        width: 100,
        height: 100,
      })
      .toDataURL("image/png"); // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
    $.ajax({
      method: "POST",
      url: "/my/update/avatar",
      data: {
        avatar: dataURL,
      },
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg("头像上传失败!");
        }
        layer.msg("头像上传成功!");
        window.parent.getUserInfo();
      },
    });
  });
});
