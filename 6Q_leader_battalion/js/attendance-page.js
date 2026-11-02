(function () {
  "use strict";

  var page = 1;
  var pageSize = 10;
  var filtered = [];
  var hidden = {};

  var COLS = [
    { key: "name", label: "姓名" },
    { key: "id", label: "会员ID" },
    { key: "gender", label: "性别" },
    { key: "post", label: "担任岗位" },
    { key: "team", label: "所属团队" },
    { key: "plan", label: "计划周营" },
    { key: "inOut", label: "入营/离营时间" },
    { key: "payDays", label: "计薪天数" },
    { key: "realDays", label: "实际出勤天数" },
    { key: "adj", label: "调整天数" },
    { key: "leave", label: "因私请假" },
    { key: "early", label: "提前入营/离营" },
    { key: "status", label: "岗位状态" },
    { key: "confirm", label: "确认状态" },
    { key: "updated", label: "更新时间" }
  ];

  function qs(id) {
    return document.getElementById(id);
  }

  function applyFilter() {
    var plan = qs("f-plan").value;
    var name = (qs("f-name").value || "").trim();
    var mid = (qs("f-id").value || "").trim();
    var post = (qs("f-post").value || "").trim();
    filtered = window.LB_ATTENDANCE.filter(function (r) {
      if (plan && r.plan !== plan) return false;
      if (name && r.name.indexOf(name) === -1) return false;
      if (mid && r.id.indexOf(mid) === -1) return false;
      if (post && r.post.indexOf(post) === -1) return false;
      return true;
    });
    page = 1;
    renderTable();
  }

  function renderHead() {
    var th =
      "<th>序号</th>" +
      COLS.filter(function (c) {
        return !hidden[c.key];
      })
        .map(function (c) {
          return "<th>" + c.label + "</th>";
        })
        .join("") +
      "<th>操作</th>";
    qs("att-head").innerHTML = "<tr>" + th + "</tr>";
  }

  function renderTable() {
    renderHead();
    var start = (page - 1) * pageSize;
    var rows = filtered.slice(start, start + pageSize);
    qs("att-body").innerHTML = rows
      .map(function (r, i) {
        var av = r.avatar
          ? '<span class="lb-avatar">' + r.avatar + "</span>"
          : '<span class="lb-avatar" style="background:#d9d9d9"> </span>';
        var cells = COLS.filter(function (c) {
          return !hidden[c.key];
        }).map(function (c) {
          if (c.key === "name") {
            return '<td><span class="lb-name">' + av + r.name + "</span></td>";
          }
          if (c.key === "confirm") {
            var ok = r.confirm === "已确认";
            return (
              '<td><span class="lb-tag ' +
              (ok ? "lb-tag--ok" : "lb-tag--wait") +
              '">' +
              r.confirm +
              "</span></td>"
            );
          }
          return "<td>" + r[c.key] + "</td>";
        }).join("");
        return (
          "<tr><td>" +
          (start + i + 1) +
          "</td>" +
          cells +
          '<td><button type="button" class="lb-link-btn" data-act="ok" data-id="' +
          r.id +
          '">确认</button>' +
          '<button type="button" class="lb-link-btn lb-link-btn--danger" data-act="detail" data-id="' +
          r.id +
          '">明细</button></td></tr>'
        );
      })
      .join("");
    qs("pager-info").textContent = "共 " + filtered.length + " 条";
    var pages = Math.max(1, Math.ceil(filtered.length / pageSize));
    var html = "";
    for (var p = 1; p <= pages; p++) {
      html +=
        '<button type="button" class="' +
        (p === page ? "is-on" : "") +
        '" data-page="' +
        p +
        '">' +
        p +
        "</button>";
    }
    qs("pager-btns").innerHTML = html;
  }

  function findRow(id) {
    return window.LB_ATTENDANCE.filter(function (r) {
      return r.id === id;
    })[0];
  }

  qs("f-plan").innerHTML = window.LB_PLANS.map(function (p) {
    return "<option>" + p + "</option>";
  }).join("");

  applyFilter();

  qs("btn-search").addEventListener("click", applyFilter);
  qs("btn-reset").addEventListener("click", function () {
    qs("f-name").value = "";
    qs("f-id").value = "";
    qs("f-post").value = "";
    qs("f-plan").selectedIndex = 0;
    applyFilter();
  });
  qs("f-plan").addEventListener("change", applyFilter);
  qs("pager-btns").addEventListener("click", function (e) {
    var b = e.target.closest("[data-page]");
    if (!b) return;
    page = Number(b.getAttribute("data-page"));
    renderTable();
  });
  qs("att-body").addEventListener("click", function (e) {
    var b = e.target.closest("[data-act]");
    if (!b) return;
    var row = findRow(b.getAttribute("data-id"));
    if (!row) return;
    if (b.getAttribute("data-act") === "ok") {
      row.confirm = "已确认";
      window.LB.toast("已确认 " + row.name + "（mock）");
      renderTable();
      return;
    }
    window.LB.openDrawer(
      "考勤明细 · " + row.name,
      "<p>岗位：" +
        row.post +
        " · 团队：" +
        row.team +
        "</p><p>计薪 " +
        row.payDays +
        " 天 · 实出 " +
        row.realDays +
        " 天 · 调整 " +
        row.adj +
        "</p><p>因私请假 " +
        row.leave +
        " · " +
        row.early +
        "</p>"
    );
  });
  qs("btn-confirm-all").addEventListener("click", function () {
    var n = filtered.filter(function (r) {
      return r.confirm !== "已确认";
    }).length;
    filtered.forEach(function (r) {
      r.confirm = "已确认";
    });
    renderTable();
    window.LB.toast("已确认 " + n + " 人（mock）");
  });
  qs("btn-export").addEventListener("click", function () {
    window.LB.toast("已导出当前筛选结果（mock）");
  });
  qs("btn-cols").addEventListener("click", function () {
    var html = COLS.map(function (c) {
      var checked = hidden[c.key] ? "" : " checked";
      return (
        '<label style="display:block;margin:6px 0"><input type="checkbox" data-col="' +
        c.key +
        '"' +
        checked +
        "> " +
        c.label +
        "</label>"
      );
    }).join("");
    window.LB.openDrawer(
      "智能表头",
      "<p>勾选要展示的列。列多时表格横向滚动。</p>" +
        html +
        '<p style="margin-top:12px"><button type="button" class="lb-btn lb-btn--primary" id="cols-apply">应用</button></p>'
    );
    document.getElementById("cols-apply").addEventListener("click", function () {
      document.querySelectorAll("#lb-drawer-body [data-col]").forEach(function (box) {
        hidden[box.getAttribute("data-col")] = !box.checked;
      });
      window.LB.closeDrawer();
      renderTable();
    });
  });
})();
