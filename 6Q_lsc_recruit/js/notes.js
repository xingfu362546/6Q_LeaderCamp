(function () {
  "use strict";
  var DETAIL = {
    title: "领袖营招募",
    n: 1,
    key: "shadeBlock",
    name: "黑名单不可报名",
    req: 28,
    past: "v3.4.0 招募详情在招募中显示立即报名。不判断报名人的黑白灰，黑名单也能点进报名。",
    now: "v3.5.0 报名人取人才库的黑白灰。黑：报名按钮改为「暂不符合报名条件」，不能点击，也不能进入报名步骤。灰和白仍是立即报名。待开始、已结束、已报名沿用原来的按钮。",
    rows: [
      ["报名", "按钮", "否", "只拦黑。灰、白可报名。"]
    ]
  };
  function pageKey() { return (location.hash || "#/list").replace("#/", "").split("?")[0] || "list"; }
  function esc(s) { return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;"); }
  function shadeNow() { return window.RecruitApp ? window.RecruitApp.shade() : "黑"; }
  function detailHtml() {
    var shade = shadeNow();
    var demo = ["白", "灰", "黑"].map(function (name) {
      return '<button type="button" data-shade="' + name + '" class="' + (shade === name ? "on" : "") + '">' + name + "</button>";
    }).join("");
    var rows = DETAIL.rows.map(function (r) {
      return "<tr><td>" + esc(r[0]) + ' <span class="lb-kind">new</span></td><td>' + esc(r[1]) + "</td><td>" + esc(r[2]) + "</td><td>" + esc(r[3]) + "</td></tr>";
    }).join("");
    return "<h2>" + esc(DETAIL.title) + " · 本页 1 条需求</h2>" +
      '<p class="lb-note-rule">一个红色序号对应一条需求。点开后列出本页全部需求。列表字段新增标 new，逻辑迭代标 Iteration，其余字段不打红点。</p>' +
      '<article class="lb-note-block" id="note-1"><h3><span class="lb-num">1</span><span class="lb-kind">new</span> ' + esc(DETAIL.name) + ' <span class="lb-ver">清单第 ' + DETAIL.req + ' 条</span></h3>' +
      '<div class="lb-logic"><h4>过往逻辑 · v3.4.0</h4><p>' + esc(DETAIL.past) + "</p></div>" +
      '<div class="lb-logic"><h4>现在的逻辑 · v3.5.0</h4><p>' + esc(DETAIL.now) + "</p></div>" +
      '<div class="shade-demo"><span>演示报名人</span>' + demo + "</div>" +
      "<table><thead><tr><th>元素名称</th><th>元素类型</th><th>是否必填</th><th>说明</th></tr></thead><tbody>" + rows + "</tbody></table></article>" +
      '<p><button type="button" class="lb-btn" id="lb-notes-close">关闭</button></p>';
  }
  function plainHtml(title) {
    return "<h2>" + esc(title) + "</h2>" +
      '<p class="lb-note-rule">本页按领袖营招募现网复刻。没有本次新增需求，所以没有红色序号。</p>' +
      '<div class="lb-logic"><h4>过往逻辑 · v3.4.0</h4><p>列表按状态筛选。详情底部是客服、分享、已报、立即报名。报名四步是基础信息、详细信息、选择周营，最后一步按团队区分。助教团提示入营基地由助教团统一调配，最后选择岗位。导师团最后一步是期望Q营。报名截止倒计时在现网已注释，页面上不出现。</p></div>' +
      '<div class="lb-logic"><h4>现在的逻辑 · v3.5.0</h4><p>这些页的字段和步骤与现网一致。黑名单不可报名只出现在招募详情的报名按钮。</p></div>' +
      '<p><button type="button" class="lb-btn" id="lb-notes-close">关闭</button></p>';
  }
  function perfectHtml() {
    return "<h2>完善信息 · 本页 1 条需求</h2>" +
      '<p class="lb-note-rule">一个红色序号对应一条需求。点开后列出本页全部需求。列表字段新增标 new，逻辑迭代标 Iteration，其余字段不打红点。</p>' +
      '<article class="lb-note-block" id="note-1"><h3><span class="lb-num">1</span><span class="lb-kind">new</span> 完善信息带出银行卡 <span class="lb-ver">清单第 37 条</span></h3>' +
      '<div class="lb-logic"><h4>过往逻辑 · v3.4.0</h4><p>已录用后才能进完善信息。打开时取人才详情。有默认工资卡，就填入账户类型、银行卡号、开户行、开户支行、开户行所在城市、开户人或公司信息、联行号。有证件也一并带出。没有人才档案，这些栏是空的。</p></div>' +
      '<div class="lb-logic"><h4>现在的逻辑 · v3.5.0</h4><p>第37条按这条现网。已录用点完善信息时，人才库里已有的银行卡自动填上，可以改完再提交。没有人才库银行卡的人仍是空表，自己填。</p></div>' +
      '<table><thead><tr><th>元素名称</th><th>元素类型</th><th>是否必填</th><th>说明</th></tr></thead><tbody><tr><td>工资卡信息 <span class="lb-kind">new</span></td><td>表单</td><td>是</td><td>林晓雯已在人才库，打开即带出默认银行卡。陈启航没有档案，打开是空的。</td></tr></tbody></table></article>' +
      '<p><button type="button" class="lb-btn" id="lb-notes-close">关闭</button></p>';
  }
  function applyHtml() {
    return "<h2>领袖营报名</h2>" +
      '<p class="lb-note-rule">本页按领袖营招募现网复刻。详细信息没有新增字段，所以没有红色序号。</p>' +
      '<div class="lb-logic"><h4>过往逻辑 · v3.4.0</h4><p>详细信息不是固定一道题。题目来自这条招募发布时勾选的题库。页面只渲染单选、多选、简答，每题都要填。简答看填写内容，单选看选中项，多选看勾选列表。</p></div>' +
      '<div class="lb-logic"><h4>现在的逻辑 · v3.5.0</h4><p>仍按现网三种题型展示这条招募勾选的题目。没有把题库改成只有「是否有领袖营带班经验」。</p></div>' +
      '<p><button type="button" class="lb-btn" id="lb-notes-close">关闭</button></p>';
  }
  function fill() {
    var panel = document.getElementById("lb-notes-panel");
    if (!panel) return;
    var key = pageKey();
    var titles = { list: "领袖营招募", detail: "领袖营招募", apply: "领袖营报名", success: "领袖营报名", mine: "我的报名", cancel: "取消报名", perfect: "完善信息", result: "报名详情" };
    if (key === "detail") panel.innerHTML = detailHtml();
    else if (key === "perfect") panel.innerHTML = perfectHtml();
    else if (key === "apply") panel.innerHTML = applyHtml();
    else panel.innerHTML = plainHtml(titles[key] || "领袖营招募");
  }
  function open() {
    fill();
    document.getElementById("lb-notes-panel").classList.add("is-open");
  }
  function paint() {
    document.querySelectorAll("[data-note-key]").forEach(function (btn) {
      var key = btn.getAttribute("data-note-key");
      var onDetail = pageKey() === "detail" && key === "shadeBlock";
      var onPerfect = pageKey() === "perfect" && key === "talentBank";
      if (!onDetail && !onPerfect) return;
      var n = onDetail ? "1" : "1";
      var title = onDetail ? "1 · 清单第28条 · 黑名单不可报名" : "1 · 清单第37条 · 完善信息带出银行卡";
      btn.setAttribute("data-note", n);
      btn.title = title;
      btn.innerHTML = '<span class="lb-num">' + n + "</span>";
    });
  }
  function mount() {
    if (document.getElementById("lb-notes-btn")) return;
    var btn = document.createElement("button");
    btn.id = "lb-notes-btn";
    btn.className = "lb-notes-btn";
    btn.type = "button";
    btn.textContent = "全部注释";
    var panel = document.createElement("aside");
    panel.id = "lb-notes-panel";
    panel.className = "lb-notes-panel";
    document.body.appendChild(btn);
    document.body.appendChild(panel);
    btn.addEventListener("click", open);
    panel.addEventListener("click", function (event) {
      var shade = event.target.closest && event.target.closest("[data-shade]");
      if (shade && window.RecruitApp) {
        window.RecruitApp.setShade(shade.getAttribute("data-shade"));
        if (panel.classList.contains("is-open") && pageKey() === "detail") fill();
        return;
      }
      if (event.target.id === "lb-notes-close") panel.classList.remove("is-open");
    });
    document.addEventListener("click", function (event) {
      var dot = event.target.closest && event.target.closest("[data-note]");
      if (!dot) return;
      event.preventDefault();
      event.stopPropagation();
      open();
    }, true);
    paint();
    if ((new URLSearchParams(location.search).get("note") === "28" && pageKey() === "detail") || (new URLSearchParams(location.search).get("note") === "37" && pageKey() === "perfect")) open();
  }
  window.RecruitNotes = { paint: paint };
  mount();
})();
