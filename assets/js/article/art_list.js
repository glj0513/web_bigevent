$(function () {
  //定义一个参数对象，将来在请求数据的时候
  //需要将请求参数对象提交到服务器
  var q = {
    pagenum: 1, //页码值，默认请求第一页的数据
    pagesize: 2, //每页显示数据的条数，默认每页显示两条数据
    cate_id: "", //文章分类的 Id
    state: "", //文章的发布状态
  };
  var form = layui.form;
  var laypage = layui.laypage;
  initTable();
  initCate();

  //定义一个美化时间的过滤器
  template.defaults.imports.dataFormat = function (date) {
    const dt = new Date(date);

    var y = dt.getFullYear();
    var m = padZero(dt.getMonth() + 1);
    var d = padZero(dt.getDate());

    var hh = padZero(dt.getHours());
    var mm = padZero(dt.getMinutes());
    var ss = padZero(dt.getSeconds());

    return y + "-" + m + "-" + d + "-" + "" + hh + ":" + mm + ":" + ss;
  };

  //定义补零函数
  function padZero(n) {
    return n > 9 ? n : "0" + n;
  }

  var layer = layui.layer;

  //发起请求获取 文章列表 数据
  function initTable() {
    $.ajax({
      method: "GET",
      url: "/my/article/list",
      data: q,
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg("获取文章列表数据失败！");
        }
        layer.msg("获取文章列表成功！");
        // console.log(res.data);
        //使用模板引擎渲染页面数据
        var htmlStr = template("tpl-table", res);
        $("tbody").html(htmlStr);
        renderPage(res.total);
      },
    });
  }

  //初始化文章分类的方法
  function initCate() {
    $.ajax({
      method: "GET",
      url: "/my/article/cates",
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg("获取分类列表失败！");
        }
        //使用 template 渲染页面
        var htmlStr = template("tpl-cate", res);
        $("[name=cate_id]").html(htmlStr);
        form.render();
      },
    });
  }

  //为 筛选表单 绑定submit事件
  $("#form-search").on("submit", function (e) {
    //阻止表单默认提交行为
    e.preventDefault();
    var cate_id = $("[name=cate_id]").val();
    var state = $("[name=state]").val();
    q.cate_id = cate_id;
    q.state = state;
    initTable();
  });

  //分页
  function renderPage(total) {
    // console.log(total);
    laypage.render({
      //分页的容器
      elem: "page-box",
      //总数据条数
      count: total,
      //每页显示的数据条数
      limit: q.pagesize,
      //设置默认被选中的页
      curr: q.pagenum,
      layout: ["count", "limit", "prev", "page", "next", "skip"],
      limits: [2, 4, 6, 8, 10],
      //可以通过 first 的值来判断是通过哪种方式触发的 jump 回调
      //如果 first 的值为true ，证明是方式 2 触发的
      //否则是 方式1 触发的
      jump: function (obj, first) {
        q.pagenum = obj.curr;
        q.pagesize = obj.limit;
        // initTable();
        if (!first) {
          initTable();
        }
      },
    });
  }

  //通过代理的方式 为 删除按钮 绑定点击事件
  $("body").on("click", ".btn-del", function () {
    var id = $(this).attr("data-id");
    var len = $(".btn-del").length;
    layer.confirm("确认删除?", { icon: 3, title: "提示" }, function (index) {
      $.ajax({
        method: "GET",
        url: "/my/article/delete/" + id,
        success: function (res) {
          if (res.status !== 0) {
            return layer.msg("删除文章失败！");
          }
          layer.msg("删除文章成功！");
          if (len === 1) {
            //页码之最小必须为 1
            q.pagenum = 1 ? 1 : q.pagenum - 1;
          }
          initTable();
        },
      });
      layer.close(index);
    });
  });
});
