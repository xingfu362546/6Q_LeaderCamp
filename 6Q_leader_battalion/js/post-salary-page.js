(function () {
  "use strict";

  var page = 1;
  var pageSize = 8;
  var filtered = [];
  var editId = "";
  var editGrades = [];

  function qs(id) {
    return document.getElementById(id);
  }

  function unique(key) {
    var seen = {};
    var out = [];
    window.LB_POSTS.forEach(function (p) {
      if (!seen[p[key]]) {
        seen[p[key]] = 1;
        out.push(p[key]);
      }
    });
    return out;
  }

  function fillSelect(id, list, emptyLabel) {
    qs(id).innerHTML =
      '<option value="">' +
      emptyLabel +
      "</option>" +
      list
        .map(function (v) {
          return "<option>" + v + "</option>";
        })
        .join("");
  }

  function applyFilter() {
    var cat = qs("f-cat").value;
    var name = (qs("f-name").value || "").trim();
    var team = qs("f-team").value;
    filtered = window.LB_POSTS.filter(function (p) {
      if (cat && p.category !== cat) return false;
      if (name && p.name.indexOf(name) === -1) return false;
      if (team && p.team !== team) return false;
      return true;
    });
    page = 1;
    renderTable();
  }

  function stack(list) {
    if (!list.length) return "-";
    return (
      '<div class="lb-stack">' +
      list
        .map(function (x) {
          return "<span>" + x + "</span>";
        })
        .join("") +
      "</div>"
    );
  }

  function renderTable() {
    var start = (page - 1) * pageSize;
    var rows = filtered.slice(start, start + pageSize);
    qs("post-body").innerHTML = rows
      .map(function (p, i) {
        return (
          "<tr>" +
          "<td>" +
          (start + i + 1) +
          "</td><td>" +
          p.name +
          "</td><td>" +
          p.category +
          "</td><td>" +
          p.team +
          "</td><td>" +
          (p.qCamp || "-") +
          "</td><td>" +
          stack(
            p.grades.map(function (g) {
              return g.level;
            })
          ) +
          '</td><td class="lb-cell-wrap">' +
          stack(
            p.grades.map(function (g) {
              return g.ref || "-";
            })
          ) +
          "</td><td>" +
          stack(
            p.grades.map(function (g) {
              return "¥ " + Number(g.full).toFixed(2);
            })
          ) +
          "</td><td>" +
          stack(
            p.grades.map(function (g) {
              return "¥ " + Number(g.part).toFixed(2);
            })
          ) +
          '</td><td class="lb-cell-wrap">' +
          (p.remark || "-") +
          "</td><td>" +
          p.operated +
          "</td><td>" +
          p.updated +
          "</td>" +
          '<td><button type="button" class="lb-link-btn" data-act="edit" data-id="' +
          p.id +
          '">编辑岗位</button>' +
          '<button type="button" class="lb-link-btn" data-act="hist" data-id="' +
          p.id +
          '">历史记录</button></td></tr>'
        );
      })
      .join("");
    qs("pager-info").textContent = "共 " + filtered.length + " 条";
    var pages = Math.max(1, Math.ceil(filtered.length / pageSize));
    var html = "";
    for (var n = 1; n <= pages; n++) {
      html +=
        '<button type="button" class="' +
        (n === page ? "is-on" : "") +
        '" data-page="' +
        n +
        '">' +
        n +
        "</button>";
    }
    qs("pager-btns").innerHTML = html;
  }

  function findPost(id) {
    return window.LB_POSTS.filter(function (p) {
      return p.id === id;
    })[0];
  }

  function gradeBlock(g, i) {
    return (
      '<div class="lb-grade-block" data-gi="' +
      i +
      '"><div class="lb-grade-block__head"><span>薪酬等级' +
      (i + 1) +
      '</span><div class="lb-grade-block__ops">' +
      (i > 0 ? '<button type="button" class="lb-link-btn" data-gact="up" data-gi="' + i + '">上移</button>' : "") +
      (i < editGrades.length - 1
        ? '<button type="button" class="lb-link-btn" data-gact="down" data-gi="' + i + '">下移</button>'
        : "") +
      (editGrades.length > 1
        ? '<button type="button" class="lb-link-btn lb-link-btn--danger" data-gact="del" data-gi="' + i + '">删除</button>'
        : "") +
      "</div></div>" +
      '<div class="lb-form-grid">' +
      '<div class="lb-field"><label>薪酬等级</label><input class="lb-input" data-gf="level" data-gi="' +
      i +
      '" value="' +
      g.level +
      '"></div>' +
      '<div class="lb-field"><label>评定参考项</label><input class="lb-input" data-gf="ref" data-gi="' +
      i +
      '" value="' +
      (g.ref || "") +
      '"></div>' +
      '<div class="lb-field"><label>全职基础薪酬</label><input class="lb-input" data-gf="full" data-gi="' +
      i +
      '" value="' +
      g.full +
      '"></div>' +
      '<div class="lb-field"><label>非全职基础薪酬</label><input class="lb-input" data-gf="part" data-gi="' +
      i +
      '" value="' +
      g.part +
      '"></div></div></div>'
    );
  }

  function readGradesFromDom() {
    editGrades.forEach(function (g, i) {
      var level = document.querySelector('[data-gf="level"][data-gi="' + i + '"]');
      var ref = document.querySelector('[data-gf="ref"][data-gi="' + i + '"]');
      var full = document.querySelector('[data-gf="full"][data-gi="' + i + '"]');
      var part = document.querySelector('[data-gf="part"][data-gi="' + i + '"]');
      if (level) g.level = level.value;
      if (ref) g.ref = ref.value;
      if (full) g.full = Number(full.value) || 0;
      if (part) g.part = Number(part.value) || 0;
    });
  }

  function renderGradeList() {
    var box = document.getElementById("grade-list");
    if (!box) return;
    box.innerHTML = editGrades.map(gradeBlock).join("");
  }

  function openEdit(p) {
    editId = p.id;
    editGrades = p.grades.map(function (g) {
      return { level: g.level, ref: g.ref, full: g.full, part: g.part };
    });
    var teams = window.LB_TEAMS.map(function (t) {
      return "<option" + (t === p.team ? " selected" : "") + ">" + t + "</option>";
    }).join("");
    var qcamps = window.LB_QCAMP.map(function (t) {
      var label = t || "请选择";
      return "<option value=\"" + t + "\"" + (t === p.qCamp ? " selected" : "") + ">" + label + "</option>";
    }).join("");
    window.LB.openDrawer(
      "编辑岗位",
      "<h3 style=\"margin:0 0 12px;font-size:14px\">岗位信息</h3>" +
        '<div class="lb-form-grid">' +
        '<div class="lb-field"><label>岗位分类名称</label><input class="lb-input" id="e-cat" value="' +
        p.category +
        '"></div>' +
        '<div class="lb-field"><label>岗位名称</label><input class="lb-input" id="e-name" value="' +
        p.name +
        '"></div>' +
        '<div class="lb-field"><label>所属团队</label><select class="lb-select" id="e-team">' +
        teams +
        "</select></div>" +
        '<div class="lb-field"><label>关联Q营</label><select class="lb-select" id="e-qcamp">' +
        qcamps +
        "</select></div></div>" +
        '<div class="lb-field" style="margin:12px 0;flex-direction:column;align-items:stretch"><label>备注</label><input class="lb-input" id="e-remark" value="' +
        (p.remark || "") +
        '"></div>' +
        "<h3 style=\"margin:16px 0 12px;font-size:14px\">薪酬等级</h3>" +
        '<div id="grade-list"></div>' +
        '<button type="button" class="lb-link-btn" id="btn-add-grade">+ 添加等级</button>' +
        '<p style="margin-top:16px"><button type="button" class="lb-btn lb-btn--primary" id="btn-save-post">保存</button></p>',
      { wide: true }
    );
    renderGradeList();
  }

  fillSelect("f-cat", unique("category"), "岗位分类名称");
  fillSelect("f-team", window.LB_TEAMS, "所属团队");
  applyFilter();

  qs("btn-search").addEventListener("click", applyFilter);
  qs("btn-reset").addEventListener("click", function () {
    qs("f-cat").value = "";
    qs("f-name").value = "";
    qs("f-team").value = "";
    applyFilter();
  });
  qs("pager-btns").addEventListener("click", function (e) {
    var b = e.target.closest("[data-page]");
    if (!b) return;
    page = Number(b.getAttribute("data-page"));
    renderTable();
  });
  qs("post-body").addEventListener("click", function (e) {
    var b = e.target.closest("[data-act]");
    if (!b) return;
    var p = findPost(b.getAttribute("data-id"));
    if (!p) return;
    if (b.getAttribute("data-act") === "edit") {
      openEdit(p);
      return;
    }
    window.LB.openDrawer(
      "历史记录 · " + p.name,
      "<p>2026-09-15 12:13:07　编辑岗位薪酬等级</p><p>2026-08-21 09:20:11　创建岗位</p><p style=\"color:rgba(0,0,0,.45);font-size:12px\">本期 mock 时间线。</p>"
    );
  });

  document.addEventListener("click", function (e) {
    if (e.target && e.target.id === "btn-add-grade") {
      readGradesFromDom();
      editGrades.push({ level: "", ref: "", full: 0, part: 0 });
      renderGradeList();
      return;
    }
    var gbtn = e.target.closest("[data-gact]");
    if (gbtn) {
      readGradesFromDom();
      var i = Number(gbtn.getAttribute("data-gi"));
      var act = gbtn.getAttribute("data-gact");
      if (act === "del") editGrades.splice(i, 1);
      if (act === "up" && i > 0) {
        var t = editGrades[i - 1];
        editGrades[i - 1] = editGrades[i];
        editGrades[i] = t;
      }
      if (act === "down" && i < editGrades.length - 1) {
        var t2 = editGrades[i + 1];
        editGrades[i + 1] = editGrades[i];
        editGrades[i] = t2;
      }
      renderGradeList();
      return;
    }
    if (e.target && e.target.id === "btn-save-post") {
      var row = findPost(editId);
      if (!row) return;
      readGradesFromDom();
      row.category = qs("e-cat").value;
      row.name = qs("e-name").value;
      row.team = qs("e-team").value;
      row.qCamp = qs("e-qcamp").value;
      row.remark = qs("e-remark").value;
      row.grades = editGrades.map(function (g) {
        return { level: g.level, ref: g.ref, full: g.full, part: g.part };
      });
      row.updated = "2026-09-16 10:20:00";
      window.LB.closeDrawer();
      applyFilter();
      window.LB.toast("已保存（mock）");
    }
  });
})();
