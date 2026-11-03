/**
 * 家长端页面注释：红色序号。
 * 一个红色序号对应一条功能清单需求。面板里写「过往逻辑 / 现在的逻辑 / 元素表 / 数据流」。
 * 支持 ?note=<清单号> 直接展开对应注释，供功能清单跳转。
 */
(function () {
  "use strict";

  function marker(n, key, kind, name, req, past, now, rows, jump) {
    return { n: n, key: key, kind: kind, name: name, req: req, past: past, now: now, rows: rows || [], jump: jump || "" };
  }

  function row(name, control, required, notes, marked) {
    return [name, control, required, notes, !!marked];
  }

  var BACKEND_CONFIG = "../6Q_leader_battalion/camp-detail.html?camp=eq-small&tab=%E8%BF%8E%E6%8E%A5%E6%AC%A2%E9%80%81&note=48";
  var BACKEND_LEAVE = "../6Q_leader_battalion/replica.html?p=leave-summary&note=10";
  var BACKEND_SURVEY = "../6Q_leader_battalion/replica.html?p=survey-config&note=56";

  var PAGES = {
    course: {
      title: "课程详情 · 待办事项",
      markers: [
        marker(
          1,
          "todoEnter",
          "new",
          "入营方式问卷进待办，同一营地只出现一条",
          20,
          "v3.4.0 入营方式由迎接欢送组在后台一周一周地发问卷，家长在群里收到链接单独填。家长端「课程详情 → 待办事项」里只有营后调查问卷一类待办，入营、离营的接送方式不在待办里，家长经常漏填。",
          "v3.5.0 设计已实现。后台在 Q营详情 → 迎接欢送点「确认并发送」时可勾选把这份问卷复制到同营地的其他 Q营周营，一次发完。家长端的待办事项里只出现一条「入营方式问卷」，同一营地的多个周营不会重复生成待办。点「去填写」进入 04 入营方式。",
          [
            row("入营方式问卷", "待办", "是", "待办第一条。截止时间、去填写 / 修改按钮都在这行。", true),
            row("去填写", "按钮", "否", "进入入营问卷（04 入营方式）。", true),
            row("修改", "按钮", "否", "已提交且未截止时显示，进同一张问卷，带出上次填写内容。", true),
            row("同一营地多周营", "规则", "否", "只生成一条待办，不按周营重复。")
          ],
          BACKEND_CONFIG
        ),
        marker(
          2,
          "todoLeave",
          "new",
          "待办直接标出问卷截止时间",
          48,
          "v3.4.0 家长端不显示入营 / 离营问卷的截止时间，过了时间仍然可以点进去填写和修改。家营只能反复导出名单核对谁改了，离营名单一直在变，用车和跟车排不准。",
          "v3.5.0 设计已实现。待办里每条问卷都带截止时间：入营问卷在开营前 48 小时截止（2026-08-12 开营 → 2026-08-10 16:00）；离营问卷在开营第 4 天结束截止（→ 2026-08-16 00:00）。截止后按钮变为「已截止」，点不进去，已提交内容仍可查看。已提交的按钮为「修改」，副标题改为「已提交 …· 截止前可修改」。",
          [
            row("截止时间", "文案", "否", "入营：开营前 48 小时。离营：开营第 4 天 00:00 后关闭。", true),
            row("去填写", "按钮", "否", "截止前可点，进对应问卷。", true),
            row("已截止", "状态", "否", "截止后按钮不可点，只能查看已提交内容。", true),
            row("已提交时间", "文案", "否", "提交后显示「已提交 2026-08-09 20:14 · 截止前可修改」。", true)
          ],
          BACKEND_CONFIG
        ),
        marker(
          3,
          "todoSummary",
          "iteration",
          "营后家长调查问卷",
          56,
          "v3.4.0 总结问卷在结营后人工发给家长，不区分该工作人员后续是否还有营期。",
          "v3.5.0 总结问卷按最后一周发放，结营后 1 个自然日内提交，家长端在待办里出现「营后家长调查问卷」。本页只做待办入口，发放规则见后台「问卷配置」。",
          [
            row("营后家长调查问卷", "待办", "否", "结营后生成，点击进入填写。"),
            row("发放规则", "说明", "否", "同一人后续还有营期时顺延到最后一周，提交过的不再重复发放。")
          ],
          BACKEND_SURVEY
        )
      ]
    },
    enter: {
      title: "入营问卷",
      markers: [
        marker(
          1,
          "enterDeadline",
          "new",
          "入营问卷截止：开营前 48 小时",
          48,
          "v3.4.0 入营问卷发布到家长群后没有截止时间，家长随时可以改，后台每天导出的名单都不一样，迎接欢送组无法锁定接站名单。",
          "v3.5.0 设计已实现。入营问卷在开营前 48 小时截止（2026-08-12 16:00 开营 → 2026-08-10 16:00 截止），截止后整个表单不可提交、不可修改，已填内容仍可查看。页面顶部直接显示当前状态与截止时间；截止后底部按钮变「已截止」。",
          [
            row("状态条", "提示", "否", "可填写 / 已截止，都带截止时间与推算依据。", true),
            row("截止时间", "规则", "否", "开营前 48 小时，按小时计，不按天。", true),
            row("截止后", "交互", "否", "单选、输入框、时间选择全部置灰，提交按钮变「已截止」。", true),
            row("已提交", "文案", "否", "截止前显示「已提交 …· 截止前仍可修改」。", true)
          ],
          BACKEND_CONFIG
        ),
        marker(
          2,
          "enterIssue",
          "iteration",
          "入营方式只填一次，多周营共用",
          20,
          "v3.4.0 同一周的几个基地、以及连营的多周营，入营方式要分别发、分别填，工作重复且容易填错。",
          "v3.5.0 设计已实现。后台一次配置可复制到同营地的其他 Q营周营，家长端只需填一次，后续周营沿用。改用第 04 题「入营方式」：机场接营、火车/高铁接营、大巴接营、家长自驾送达。入营这一程没有「营地自离」，到营地后由营地统一接收。",
          [
            row("04 入营方式", "单选", "是", "机场接营 / 火车/高铁接营 / 大巴接营 / 家长自驾送达，四项。", true),
            row("05 入营大巴路线", "选择", "否", "选大巴接营时必填：中山大巴 / 广州总部大巴。", true),
            row("06 交接情况", "选择", "是", "家长送到站点交给老师 / 他人单独代送 / 学员独自到站。", true),
            row("07 送达时间", "选择", "否", "家长或托人到站点的时间，用于排接站。", true),
            row("12 车牌号", "输入", "否", "自驾送达时填写，便于营地放行。", true)
          ],
          BACKEND_CONFIG
        )
      ]
    },
    leave: {
      title: "离营问卷",
      markers: [
        marker(
          1,
          "leaveDeadline",
          "new",
          "离营问卷截止：开营第 4 天 00:00",
          48,
          "v3.4.0 离营问卷没有截止时间。家长在开营后仍在改离营方式，家营反复导出核对，跟车、用车安排一直变。",
          "v3.5.0 设计已实现。离营问卷在开营第 4 天结束后关闭（2026-08-12 开营 → 第 4 天为 08-15 → 2026-08-16 00:00 起不可填写和修改）。截止后表单置灰、提交按钮变「已截止」，已提交内容仍可查看。",
          [
            row("状态条", "提示", "否", "可填写 / 已截止，带截止时间与「开营第 4 天 00:00」依据。", true),
            row("截止时间", "规则", "否", "开营第 4 天 00:00 起关闭填写与修改。", true),
            row("截止后", "交互", "否", "整张表单不可改，提交按钮变「已截止」。", true)
          ],
          BACKEND_CONFIG
        ),
        marker(
          2,
          "leaveWay",
          "iteration",
          "离营方式可改，改后带标识并同步三处",
          10,
          "v3.4.0 离营方式由家长在离营问卷里填，后台只在总表里看最新值，不标谁改过、什么时候改的。家营改完后要人工把表格再发给欢送负责人，多个基地之间传递容易漏人。",
          "v3.5.0 设计已实现。家长在截止前可改离营方式。改动后：① 后台「离营总表」该行离营方式旁标「已修改」，可用「只看已修改」筛出来；② 迎接欢送的学员名单、助教分组的学员-离营方式同步显示同一份数据，不再各自维护；③ 每条改动逐条推送消息给欢送负责人，按机场 / 南站 / 总部汇总用车；④ 总表支持助教发起的离营方式变更申请，审批一票否决。",
          [
            row("04 离营方式", "单选", "是", "机场接离 / 火车/高铁接离 / 大巴接离 / 营地自离。", true),
            row("05 离营大巴路线", "选择", "否", "大巴接离必填：中山大巴 / 广州总部大巴。", true),
            row("06 接送情况", "选择", "是", "父母到点自接 / 他人单独代接 / 学员独自离营。", true),
            row("07 抵达站点时间", "选择", "否", "父母或托人到站点的时间。", true),
            row("修改标识", "规则", "否", "每次改动写入后台总表，标「已修改」并留更新时间与更新人。", true),
            row("数据流转", "说明", "否", "家长端提交 → 离营总表 → 迎接欢送名单 / 助教分组学员 → 欢送负责人汇总用车。", true)
          ],
          BACKEND_LEAVE
        ),
        marker(
          3,
          "leavePublish",
          "iteration",
          "截止时间与发布到家长群的时间一致",
          59,
          "v3.4.0 前端入离营问卷没有截止时间，与发布到家长群的时间也不对应，超过时间仍可修改填写，家营不断导出数据核实。",
          "v3.5.0 第 48 条已覆盖这条：截止时间由开营日推算，与发布到家长群的时间对齐（入营 48 小时、离营第 4 天 00:00），到点自动关闭。清单第 59 条按重复项处理，本次不做，方案随第 48 条一起落地。",
          [
            row("与群发时间一致", "规则", "否", "后台发送问卷时即按开营日带出截止时间，家长端与群里公示的时间一致。", true),
            row("本次范围", "说明", "否", "第 59 条不单独做，能力已在第 48 条实现。")
          ],
          BACKEND_CONFIG
        )
      ]
    }
  };

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function table(rows) {
    if (!rows.length) return "";
    var html = "<table><thead><tr><th>元素名称</th><th>元素类型</th><th>是否必填</th><th>说明</th></tr></thead><tbody>";
    rows.forEach(function (r) {
      html += "<tr><td>" + esc(r[0]) + (r[4] ? ' <span class="lb-kind">new</span>' : "") + "</td><td>" + esc(r[1]) + "</td><td>" + esc(r[2]) + "</td><td>" + esc(r[3]) + "</td></tr>";
    });
    return html + "</tbody></table>";
  }

  function panelHtml(page) {
    var cfg = PAGES[page] || PAGES.course;
    var html = "<h2>" + esc(cfg.title) + " · 本页 " + cfg.markers.length + " 条需求</h2>";
    html += '<p class="lb-note-rule">一个红色序号对应一条需求。点开抽屉时列出本页全部注释。</p>';
    cfg.markers.forEach(function (m) {
      html += '<article class="lb-note-block" id="note-' + m.n + '">';
      html += "<h3><span class=\"lb-num\">" + m.n + '</span><span class="lb-kind">' + esc(m.kind) + "</span> " + esc(m.name) + ' <span class="lb-ver">清单第 ' + esc(m.req) + " 条</span></h3>";
      html += '<div class="lb-logic"><h4>过往逻辑 · v3.4.0</h4><p>' + esc(m.past) + "</p></div>";
      html += '<div class="lb-logic"><h4>现在的逻辑 · v3.5.0</h4><p>' + esc(m.now) + "</p></div>";
      html += table(m.rows);
      if (m.jump) html += '<a class="lb-note-jump" href="' + esc(m.jump) + '">→ 去后台对应页面看配置</a>';
      html += "</article>";
    });
    html += '<p><button type="button" class="lb-btn" data-parent-note="close">关闭</button></p>';
    return html;
  }

  var panel = null;
  var btn = null;
  var openedByLink = false;

  function open(n) {
    if (!panel) return;
    panel.innerHTML = panelHtml(currentPage());
    panel.classList.add("is-open");
    panel.scrollTop = 0;
    if (!n) return;
    var target = panel.querySelector("#note-" + n);
    if (target) target.scrollIntoView({ block: "start" });
  }

  var pageNow = "course";
  function currentPage() {
    return pageNow;
  }

  function paint(page) {
    var cfg = PAGES[page];
    var root = document.getElementById("parent-app");
    if (!cfg || !root) return;
    root.querySelectorAll("[data-note-key]").forEach(function (dot) {
      dot.textContent = "";
      dot.style.display = "none";
    });
    cfg.markers.forEach(function (m) {
      var dot = root.querySelector('[data-note-key="' + m.key + '"]');
      if (!dot) return;
      dot.textContent = m.n;
      dot.style.display = "";
      dot.title = m.n + " · 清单第 " + m.req + " 条 · " + m.name;
      dot.onclick = function (e) {
        e.preventDefault();
        e.stopPropagation();
        open(m.n);
      };
    });
  }

  function mount(root, page) {
    if (!root) return;
    pageNow = page || "course";

    if (!btn) {
      btn = document.createElement("button");
      btn.id = "lb-notes-btn";
      btn.className = "lb-notes-btn";
      btn.type = "button";
      btn.textContent = "全部注释";
      btn.addEventListener("click", function () { open(); });
      root.appendChild(btn);
    } else if (btn.parentNode !== root) {
      root.appendChild(btn);
    }

    if (!panel) {
      panel = document.createElement("aside");
      panel.id = "lb-notes-panel";
      panel.className = "lb-notes-panel";
      root.appendChild(panel);
      panel.addEventListener("click", function (e) {
        if (e.target && e.target.getAttribute("data-parent-note") === "close") {
          panel.classList.remove("is-open");
        }
      });
    } else if (panel.parentNode !== root) {
      root.appendChild(panel);
    }

    paint(page);

    /* 功能清单跳过来时按清单号展开：?note=48 / 20 / 59 / 10 */
    if (!openedByLink) {
      var want = new URLSearchParams(location.search).get("note");
      if (want) {
        var hit = null;
        (PAGES[page] || PAGES.course).markers.forEach(function (m) {
          if (String(m.req) === String(want)) hit = m;
        });
        if (hit) {
          openedByLink = true;
          setTimeout(function () { open(hit.n); }, 30);
        }
      }
    }
  }

  window.ParentNotes = { mount: mount, open: open, pages: PAGES };
})();
