(function () {
  "use strict";

  var MARKERS = [
    {
      n: 1,
      key: "enrollUniform",
      kind: "new",
      name: "复训营服与积分返还",
      req: 31,
      past: "v3.4.0 报读分四步：选择报读人、选择期数、支付金额、完成报读。第一步列已有儿女与关系，可添加儿女；第二步按基地列周营起止日期；第三步显示上课人信息、报读 Q营（复训带「复训」标签）、日期、地点、复训费与行政生活费、优惠券，底部合计并确认报读。复训学员没有营服选项，营服随报读默认发放，也没有积分返还。",
      now: "v3.5.0 原型评审第二轮第7条已调整。仍在第三步「支付金额」里、报读 Q营卡片下方、底部合计上方，一块营服判断。触发条件改为「过往只要报读过一期」就提示，不再只看本单是否带复训标签。文案改为「检测到您过往报读过领袖营，本次是否需要新的营服？」选项由两选改为三选一，并直接带出积分返还：需要一件返 5800 积分、需要两件返 0 积分、不需要返 11600 积分。默认不预选，未选择时点确认报读提示「请选择是否需要新的营服」。选中后底部合计下方补一行对应返还积分，合计金额不变，积分不进金额。确认报读后，件数写到后台 Q营学员信息列表的「营服数量」，排在尺码右边：需要一件记 1，需要两件记 2，不需要记 0。后台只展示，没有编辑营服的入口。",
      rows: [
        ["营服判断", "区块", "是", "只在第三步支付金额出现。条件改为过往报读过一期即提示。", true],
        ["提示文案", "文本", "是", "检测到您过往报读过领袖营，本次是否需要新的营服？"],
        ["需要一件", "选项", "否", "登记 1 件新营服，返还 5800 积分。", true],
        ["需要两件", "选项", "否", "登记 2 件新营服，返还 0 积分。", true],
        ["不需要", "选项", "否", "不发放新营服，返还 11600 积分。", true],
        ["确认报读", "按钮", "是", "未选择营服时拦截并提示，选好后进入完成报读。"],
        ["完成报读", "页面", "否", "显示报读结果与对应积分返还文案。"],
        ["不受影响", "边界", "是", "第一步选择报读人、第二步选择期数、费用明细与优惠券口径都不改；积分不进合计金额。"],
        ["营服数量", "列", "否", "确认报读后写到后台 Q营学员信息列表，排在尺码右边。需要一件记 1，需要两件记 2，不需要记 0。只展示，没有编辑入口。", true]
      ]
    }
  ];

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function table(rows) {
    var html = "<table><thead><tr><th>元素名称</th><th>元素类型</th><th>是否必填</th><th>说明</th></tr></thead><tbody>";
    rows.forEach(function (r) {
      html += "<tr><td>" + esc(r[0]) + "</td><td>" + esc(r[1]) + "</td><td>" + esc(r[2]) + "</td><td>" + esc(r[3]) + "</td></tr>";
    });
    return html + "</tbody></table>";
  }

  function panelHtml() {
    var html = "<h2>报读流程 · 本页 1 条需求</h2>";
    html += '<p class="lb-note-rule">一个红色序号对应一条需求。列表字段新增标 new，逻辑迭代标 Iteration，其余字段不打红点。</p>';
    MARKERS.forEach(function (m) {
      html += '<article class="lb-note-block" id="note-' + m.n + '">';
      html += "<h3><span class=\"lb-num\">" + m.n + '</span><span class="lb-kind">' + m.kind + "</span> " + esc(m.name) + ' <span class="lb-ver">清单第 ' + m.req + " 条</span></h3>";
      html += '<div class="lb-logic"><h4>过往逻辑 · v3.4.0</h4><p>' + esc(m.past) + "</p></div>";
      html += '<div class="lb-logic"><h4>现在的逻辑 · v3.5.0</h4><p>' + esc(m.now) + "</p></div>";
      html += table(m.rows);
      html += "</article>";
    });
    html += '<p><button type="button" class="lb-btn" data-enroll-note="close">关闭</button></p>';
    return html;
  }

  function mount(root) {
    if (!root) return;
    var host = root;
    /* 注释面板与「全部注释」按钮放到手机外侧的 .stage 里，不覆盖原型画面。 */
    var outside = document.querySelector(".stage") || root;
    var btn = outside.querySelector("#lb-notes-btn");
    if (!btn) {
      btn = document.createElement("button");
      btn.id = "lb-notes-btn";
      btn.className = "lb-notes-btn";
      btn.type = "button";
      btn.textContent = "全部注释";
      outside.appendChild(btn);
      btn.addEventListener("click", function () { open(host); });
    }
    var panel = outside.querySelector("#lb-notes-panel");
    if (!panel) {
      panel = document.createElement("aside");
      panel.id = "lb-notes-panel";
      panel.className = "lb-notes-panel";
      panel.innerHTML = panelHtml();
      outside.appendChild(panel);
      panel.addEventListener("click", function (event) {
        if (event.target.getAttribute("data-enroll-note") === "close" || event.target.getAttribute("data-enroll-note") === "mask") {
          panel.classList.remove("is-open");
        }
      });
    }
    var dot = host.querySelector('[data-note="31"]');
    if (dot) {
      dot.setAttribute("data-note", "1");
      dot.addEventListener("click", function (event) {
        event.preventDefault();
        event.stopPropagation();
        open(host, 1);
      });
    }
    if (new URLSearchParams(location.search).get("note") === "31") open(host, 1);
  }

  function open(host, n) {
    /* 面板在手机外的 .stage 里，从文档取，不能再从手机内的 host 取。 */
    var panel = document.getElementById("lb-notes-panel");
    if (!panel) return;
    panel.innerHTML = panelHtml();
    panel.classList.add("is-open");
    panel.scrollTop = 0;
    if (!n) return;
    var target = panel.querySelector("#note-" + n);
    if (target) target.scrollIntoView({ block: "start" });
  }

  window.EnrollNotes = { mount: mount };

  var boot = document.getElementById("rg-app");
  if (boot) mount(boot);
})();
