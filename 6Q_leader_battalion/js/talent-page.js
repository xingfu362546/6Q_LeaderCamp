(function () {
  "use strict";

  var job = "all";
  var page = 1;
  var pageSize = 10;
  var filtered = [];

  function qs(id) {
    return document.getElementById(id);
  }

  function applyFilter() {
    var name = (qs("f-name").value || "").trim();
    var mid = (qs("f-id").value || "").trim();
    var type = qs("f-type").value;
    var phone = (qs("f-phone").value || "").trim();
    var q = (qs("job-q").value || "").trim();
    filtered = window.LB_TALENT.filter(function (r) {
      if (job !== "all" && r.job !== job) return false;
      if (name && r.name.indexOf(name) === -1) return false;
      if (mid && r.id.indexOf(mid) === -1) return false;
      if (type && r.type !== type) return false;
      if (phone && r.phone.indexOf(phone) === -1) return false;
      return true;
    });
    var jobBtns = document.querySelectorAll("#job-tree [data-job]");
    jobBtns.forEach(function (b) {
      var label = b.getAttribute("data-label") || "";
      b.style.display = !q || label.indexOf(q) !== -1 ? "" : "none";
    });
    page = 1;
    renderTable();
  }

  function renderJobs() {
    var box = qs("job-tree");
    box.innerHTML = window.LB_JOBS.map(function (j) {
      var on = j.id === job ? " is-on" : "";
      return (
        '<button type="button" class="' +
        on.trim() +
        '" data-job="' +
        j.id +
        '" data-label="' +
        j.label +
        '">' +
        j.label +
        "（" +
        j.count +
        "）</button>"
      );
    }).join("");
  }

  function renderTable() {
    var start = (page - 1) * pageSize;
    var rows = filtered.slice(start, start + pageSize);
    var tb = qs("talent-body");
    tb.innerHTML = rows
      .map(function (r, i) {
        var av = r.avatar
          ? '<span class="lb-avatar">' + r.avatar + "</span>"
          : '<span class="lb-avatar" style="background:#d9d9d9"> </span>';
        return (
          "<tr>" +
          "<td>" +
          (start + i + 1) +
          "</td>" +
          '<td><span class="lb-name">' +
          av +
          r.name +
          "</span></td>" +
          "<td>" +
          r.id +
          "</td><td>" +
          r.type +
          "</td><td>" +
          r.phone +
          "</td><td>" +
          r.gender +
          "</td><td>" +
          r.age +
          "</td><td>" +
          r.camp +
          "</td><td>" +
          r.bonus +
          "</td><td>" +
          r.fund +
          "</td><td>" +
          r.city +
          "</td><td>" +
          r.post +
          "</td><td>" +
          r.times +
          "</td><td>" +
          r.updated +
          "</td>" +
          '<td><button type="button" class="lb-link-btn" data-act="edit" data-id="' +
          r.id +
          '">编辑个人信息</button>' +
          '<button type="button" class="lb-link-btn" data-act="view" data-id="' +
          r.id +
          '">查看详情</button></td></tr>'
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
    return window.LB_TALENT.filter(function (r) {
      return r.id === id;
    })[0];
  }

  function fieldHtml(label, value, name) {
    return (
      '<div class="lb-field"><label>' +
      label +
      '</label><input class="lb-input" ' +
      (name ? 'name="' + name + '"' : "readonly") +
      ' value="' +
      value +
      '"></div>'
    );
  }

  renderJobs();
  applyFilter();

  qs("job-tree").addEventListener("click", function (e) {
    var btn = e.target.closest("[data-job]");
    if (!btn) return;
    job = btn.getAttribute("data-job");
    renderJobs();
    applyFilter();
  });
  qs("job-q").addEventListener("input", applyFilter);
  qs("btn-search").addEventListener("click", applyFilter);
  qs("btn-reset").addEventListener("click", function () {
    qs("f-name").value = "";
    qs("f-id").value = "";
    qs("f-type").value = "";
    qs("f-phone").value = "";
    job = "all";
    renderJobs();
    applyFilter();
  });
  qs("pager-btns").addEventListener("click", function (e) {
    var b = e.target.closest("[data-page]");
    if (!b) return;
    page = Number(b.getAttribute("data-page"));
    renderTable();
  });
  qs("talent-body").addEventListener("click", function (e) {
    var b = e.target.closest("[data-act]");
    if (!b) return;
    var row = findRow(b.getAttribute("data-id"));
    if (!row) return;
    if (b.getAttribute("data-act") === "edit") {
      window.LB.openDrawer(
        "编辑个人信息 · " + row.name,
        fieldHtml("姓名", row.name, "name") +
          fieldHtml("电话", row.phone, "phone") +
          fieldHtml("地区", row.city, "city") +
          '<p style="color:rgba(0,0,0,.45);font-size:12px">本期 mock，不写回列表。</p>' +
          '<button type="button" class="lb-btn lb-btn--primary" data-close-drawer="1">保存</button>'
      );
    } else {
      window.LB.openDrawer(
        "工作人员详情 · " + row.name,
        fieldHtml("会员ID", row.id) +
          fieldHtml("类型", row.type) +
          fieldHtml("是否参营", row.camp) +
          fieldHtml("最近任职岗位", row.post) +
          fieldHtml("累计参营", String(row.times))
      );
    }
  });
  qs("btn-add").addEventListener("click", function () {
    window.LB.openDrawer(
      "新增人员",
      fieldHtml("会员ID", "", "id") +
        fieldHtml("姓名", "", "name") +
        '<p style="color:rgba(0,0,0,.45);font-size:12px">须为平台内用户。本期 mock。</p>' +
        '<button type="button" class="lb-btn lb-btn--primary" data-close-drawer="1">提交</button>'
    );
  });
  qs("btn-export").addEventListener("click", function () {
    window.LB.toast("已按当前岗位范围导出（mock）");
  });
  qs("btn-import").addEventListener("click", function () {
    window.LB.toast("导入用户档案（mock）");
  });
})();
