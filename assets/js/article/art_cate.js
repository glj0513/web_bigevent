$(function () {
  initArtCateList();
  var layer = layui.layer;
  var layeradd = null;
  var form = layui.form;
  //获取文章列表
  function initArtCateList() {
    $.ajax({
      method: "GET",
      url: "/my/article/cates",
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg("获取文章列表失败!");
        }
        layer.msg("获取文章列表成功!");
        var btnStr = template("tpl-table", res);
        $("tbody").html(btnStr);
      },
    });
  }

  //添加类别的点击事件
  $("#btnAdd").on("click", function () {
    layeradd = layer.open({
      type: 1,
      area: ["500px", "250px"],
      title: "添加文章分类",
      content: $("#dialog-add").html(),
    });
  });

  //通过代理的形式，为 form-add 表单绑定 submit 事件
  $("body").on("submit", "#form-add", function (e) {
    e.preventDefault();
    $.ajax({
      method: "POST",
      url: "/my/article/addcates",
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg("新增文章分类失败！");
        }
        layer.msg("新增文章分类成功！");
        initArtCateList();
        //根据索引，关闭对应的弹出层
        layer.close(layeradd);
      },
    });
  });

  //通过代理的形式，为 btn-edit 按钮绑定点击事件
  var indexEdit = null;
  $("tbody").on("click", ".btn-edit", function () {
    //弹出一个修改文章分类的层
    indexEdit = layer.open({
      type: 1,
      area: ["500px", "250px"],
      title: "修改文章分类",
      content: $("#dialog-edit").html(),
    });

    var id = $(this).attr("data-id");
    // console.log(id);
    //发起获取对应数据的请求
    $.ajax({
      method: "GET",
      url: "/my/article/cates/" + id,
      success: function (res) {
        // console.log(res);
        form.val("form-edit", res.data);
      },
    });
  });

  //通过代理的方式，为修改分类的表单绑定 submit 事件
  $("body").on("submit", "#form-edit", function (e) {
    //阻止表单的默认提交行为
    e.preventDefault();
    $.ajax({
      method: "POST",
      url: "/my/article/updatecate",
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg("更新文章类别失败！");
        }
        layer.msg("更新文章类别成功！");
        layer.close(indexEdit);
        initArtCateList();
      },
    });
  });

  //通过代理的方式，给 删除按钮 添加点击事件
  $("body").on("click", ".btn-del", function () {
    var id = $(this).attr("data-id");
    layer.confirm("确认删除?", { icon: 3, title: "提示" }, function (index) {
      $.ajax({
        method: "GET",
        url: "/my/article/deletecate/" + id,
        success: function (res) {
          if (res.status !== 0) {
            console.log(res.message);

            return layer.msg("删除文章类别失败！");
          }
          layer.msg("删除文章类别成功！");
          layer.close(index);
          initArtCateList();
        },
      });
    });
  });
});
