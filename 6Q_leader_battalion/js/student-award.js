(function () {
  "use strict";

  var CLASSES = ["A1班", "EQ大1班", "SQ大班-A班"];
  var WEEKS = ["第五周", "第六周"];
  /* 原型评审第一轮：
     第1条 奖项不再设名额。
     第2条 评优不再填写主要事迹。
     第3条 记录导出只导生效记录，已失效不导出。 */
  var state = {
    tab: "config",
    dialog: "",
    pendingId: "",
    form: { name: "" },
    filter: { award: [], klass: [], week: [], status: [] },
    awards: [
      { id: "vv", name: "VV之星" },
      { id: "up", name: "进步之星" }
    ],
    records: [
      { id: "r1", week: "第六周", klass: "A1班", student: "王小满", award: "VV之星", assistant: "林晓雯", time: "2026-10-18 16:20", status: "生效" },
      { id: "r2", week: "第六周", klass: "A1班", student: "孙悦", award: "VV之星", assistant: "林晓雯", time: "2026-10-18 17:05", status: "生效" },
      { id: "r3", week: "第六周", klass: "A1班", student: "赵欣然", award: "VV之星", assistant: "黄志远", time: "2026-10-17 11:00", status: "已失效" }
    ]
  };

  function esc(s) {
    return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  function checked(list, value) {
    return !list.length || list.indexOf(value) >= 0;
  }

  function filtered() {
    return state.records.filter(function (row) {
      return checked(state.filter.award, row.award) && checked(state.filter.klass, row.klass) && checked(state.filter.week, row.week) && checked(state.filter.status, row.status);
    });
  }

  /* 第3条：导出只含生效记录，已失效不导出。 */
  function exportable() {
    return filtered().filter(function (row) { return row.status === "生效"; });
  }

  function checks(title, key, options) {
    var html = "<div><b>" + title + "</b>";
    options.forEach(function (name) {
      var on = state.filter[key].indexOf(name) >= 0;
      html += '<label><input type="checkbox" data-aw-filter="' + key + '" value="' + esc(name) + '"' + (on ? " checked" : "") + " />" + esc(name) + "</label>";
    });
    return html + "</div>";
  }

  function configHtml() {
    var html = '<div class="aw-cards">';
    state.awards.forEach(function (item) {
      html += '<article class="aw-card"><h3>' + esc(item.name) + "</h3>";
      html += "<p>配置后全体学员可选</p></article>";
    });
    return html + "</div>";
  }

  function recordHtml() {
    var rows = filtered();
    var html = '<div class="aw-filters">';
    html += checks("奖项", "award", state.awards.map(function (item) { return item.name; }));
    html += checks("班级", "klass", CLASSES);
    html += checks("周营", "week", WEEKS);
    html += checks("状态", "status", ["生效", "已失效"]);
    html += "</div>";
    html += '<div class="lb-table-wrap"><table class="lb-table"><thead><tr><th>周营</th><th>班级</th><th>学员</th><th>奖项</th><th>颁发助教</th><th>颁发时间</th><th>状态</th><th>操作</th></tr></thead><tbody>';
    if (!rows.length) html += '<tr><td colspan="8">暂无记录</td></tr>';
    rows.forEach(function (row) {
      html += "<tr" + (row.status === "已失效" ? ' class="aw-off"' : "") + "><td>" + esc(row.week) + "</td><td>" + esc(row.klass) + "</td><td>" + esc(row.student) + "</td><td>" + esc(row.award) + "</td><td>" + esc(row.assistant) + "</td><td>" + esc(row.time) + "</td><td>" + esc(row.status) + "</td><td>";
      if (row.status === "生效") html += '<button type="button" class="lb-btn" data-aw-disable="' + row.id + '">禁用</button>';
      else html += "-";
      html += "</td></tr>";
    });
    return html + "</tbody></table></div>";
  }

  function dialogHtml() {
    if (state.dialog === "add") {
      var html = '<div class="aw-dialog"><div class="aw-dialog__box"><h3>新增奖项</h3>';
      html += '<div class="aw-field"><label>奖项名称</label><input id="aw-name" type="text" value="' + esc(state.form.name) + '" placeholder="例如 VV之星" /></div>';
      html += '<p class="lb-hint">保存后，这个奖项对所有班级开放，助教都可以选用，不再按生效班级限制。</p>';
      html += '<div class="aw-actions"><button type="button" class="lb-btn" data-aw-close="1">取消</button><button type="button" class="lb-btn lb-btn--primary" data-aw-save="1">保存</button></div></div></div>';
      return html;
    }
    if (state.dialog === "disable") {
      return '<div class="aw-dialog"><div class="aw-dialog__box"><h3>禁用评优记录</h3><p>确认后这条记录变为已失效，仍可在列表查看，但不再导出。学员列表上的标签会去掉，APP 才再次出现评优入口。</p><div class="aw-actions"><button type="button" class="lb-btn" data-aw-close="1">取消</button><button type="button" class="lb-btn lb-btn--primary" data-aw-disable-ok="1">确认禁用</button></div></div></div>';
    }
    return "";
  }

  function render() {
    var root = document.getElementById("award-app");
    if (!root) return;
    var html = '<div class="aw-bar"><div class="aw-tabs">';
    html += '<button type="button" class="' + (state.tab === "config" ? "is-on" : "") + '" data-aw-tab="config">奖项配置</button>';
    html += '<button type="button" class="' + (state.tab === "record" ? "is-on" : "") + '" data-aw-tab="record">评优记录</button></div><div>';
    if (state.tab === "config") html += '<button type="button" class="lb-btn lb-btn--primary" data-aw-add="1">新增奖项</button>';
    else html += '<button type="button" class="lb-btn" data-aw-export="1">导出</button>';
    html += "</div></div>";
    html += state.tab === "config" ? configHtml() : recordHtml();
    html += dialogHtml();
    root.innerHTML = html;
  }

  function readForm() {
    var name = document.getElementById("aw-name");
    if (name) state.form.name = name.value.trim();
  }

  /* 第2条去掉主要事迹列；第3条只导出生效记录。 */
  function exportRows() {
    var rows = exportable();
    if (!rows.length) { window.alert("当前筛选下没有可导出的生效记录"); return; }
    var lines = ["周营,班级,学员,奖项,颁发助教,颁发时间,状态"];
    rows.forEach(function (row) {
      lines.push([row.week, row.klass, row.student, row.award, row.assistant, row.time, row.status].map(function (cell) {
        return '"' + String(cell).replace(/"/g, '""') + '"';
      }).join(","));
    });
    var blob = new Blob(["\ufeff" + lines.join("\n")], { type: "text/csv;charset=utf-8" });
    var link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "学员评优记录.csv";
    link.click();
  }

  document.addEventListener("click", function (e) {
    var tab = e.target.closest("[data-aw-tab]");
    if (tab) { state.tab = tab.getAttribute("data-aw-tab"); render(); return; }
    if (e.target.closest("[data-aw-add]")) {
      state.form = { name: "" };
      state.dialog = "add";
      render();
      return;
    }
    if (e.target.closest("[data-aw-close]")) { state.dialog = ""; state.pendingId = ""; render(); return; }
    if (e.target.closest("[data-aw-save]")) {
      readForm();
      if (!state.form.name) { window.alert("请填写奖项名称"); return; }
      state.awards.push({ id: "a" + Date.now(), name: state.form.name });
      state.dialog = "";
      render();
      return;
    }
    var disable = e.target.closest("[data-aw-disable]");
    if (disable) { state.pendingId = disable.getAttribute("data-aw-disable"); state.dialog = "disable"; render(); return; }
    if (e.target.closest("[data-aw-disable-ok]")) {
      state.records.forEach(function (row) {
        if (row.id === state.pendingId) row.status = "已失效";
      });
      state.dialog = "";
      state.pendingId = "";
      render();
      return;
    }
    if (e.target.closest("[data-aw-export]")) exportRows();
  });

  document.addEventListener("change", function (e) {
    var filter = e.target.closest("[data-aw-filter]");
    if (!filter) return;
    var key = filter.getAttribute("data-aw-filter");
    var value = filter.value;
    var list = state.filter[key];
    var at = list.indexOf(value);
    if (filter.checked && at < 0) list.push(value);
    if (!filter.checked && at >= 0) list.splice(at, 1);
    render();
  });

  render();
})();
