(function () {
  "use strict";

  function marker(n, key, kind, name, req, past, now, rows) {
    return { n: n, key: key, kind: kind, name: name, req: req, past: past, now: now, rows: rows };
  }

  function row(name, control, required, notes) {
    return { name: name, control: control, required: required, notes: notes };
  }

  var PAGES = {
    "/leadershipCamp": {
      title: "我的课表",
      markers: [
        marker(1, "baseWeek", "iteration", "基地后查看周营", 14,
          "v3.4.0 我的课表左侧按计划收起周营，一行两个状态：开营情况、课表情况。没有先点基地、再展开该基地周营的一层。",
          "v3.5.0 左侧先按基地收起。点开基地后，直接列出该基地的周营、所属计划和开营、课表两个状态，不用再进一层才能看到周营。",
          [
            row("基地", "折叠", "否", "点基地名称展开或收起。红点只打开本条注释。"),
            row("周营", "列表", "否", "展开后直接看到周次、所属计划和两个状态。")
          ]),
        marker(2, "timetableLook", "iteration", "课表字号和格子", 19,
          "v3.4.0 工作台课表上课格高度约 161，课程名 14 号字，时间 12 号字。没有字号或格子尺寸的开关。后台课表同样不能在这里调。",
          "v3.5.0 工作台课表和后台周营课表、班级课表都可以切字号（小、标准、大）和格子（紧凑、标准）。紧凑把上课格从约 161 收到约 118，课程名仍保留一行完整高度，与下方导师区之间留 8px 间距，不会被压住。字号和格子存在本机，下次登录按上次的选择显示。",
          [
            row("显示", "按钮", "否", "放在课表操作行最右侧，和导出、课表图片导出同一行。点开后再选字号和格子。"),
            row("字号", "切换", "否", "小、标准、大。只影响课表里的课程名和日期字号。"),
            row("格子", "切换", "否", "紧凑或标准。紧凑把上课格收到约 118，仍保证课程名一行完整、与导师区留 8px 间距。"),
            row("记住设置", "存储", "是", "字号和格子的选择写进 localStorage（mentor-tt-look），下次登录按上次的选择展示。", true),
            row("编辑于", "说明", "否", "课表头部不再显示「编辑于 XXXX」。")
          ])
      ]
    },
    "/grindingLessons/myTask": {
      title: "查看磨课任务",
      markers: [
        marker(1, "guideScore", "iteration", "指导导师看分数", 15,
          "v3.4.0 反馈变成已反馈或反馈不通过之后，才出现一行「评分：分数｜合格/不合格」。",
          "v3.5.0 指导导师提交后，分数立刻出现在「我的指导」和「查看磨课任务」，两边都是「评分：分数｜合格/不合格」。",
          [row("评分", "文本", "否", "提交后双方都能看到分数和合格、不合格。")]),
        marker(2, "guideText", "iteration", "被指导者看文字反馈", 16,
          "v3.4.0 被指导者只能看到评分行和问卷链接，文字反馈不写在任务卡片上。",
          "v3.5.0 同一次提交后，文字反馈直接写在双方的任务卡片上。",
          [row("文字反馈", "文本", "否", "提交后双方直接看见，不必点进问卷。")]),
        marker(3, "fileName", "iteration", "下载文件用原件名", 18,
          "v3.4.0 磨课任务和我的指导里点物料下载，文件名走存储地址。跨域时浏览器会丢掉页面上的原件名。学习页没有物料下载。顶栏也不放下载中心。",
          "v3.5.0 磨课任务、我的指导里下载物料，用页面上的原件名，例如口才课件.pptx。不另做下载中心。",
          [row("下载", "按钮", "否", "跟在上传的物料旁边。下载名等于物料原件名。")])
      ]
    },
    "/grindingLessons/myGuide": {
      title: "我的指导",
      markers: [
        marker(1, "guideScore", "iteration", "指导导师看分数", 15,
          "v3.4.0 指导导师提交反馈后，分数要等状态变成已反馈才出现在详情里。",
          "v3.5.0 提交后，指导导师和被指导者都立刻看到同一行分数。",
          [row("评分", "文本", "否", "填写反馈提交后，本页立即显示分数。")]),
        marker(2, "guideText", "iteration", "被指导者看文字反馈", 16,
          "v3.4.0 文字反馈在问卷里，页面上不摊开。",
          "v3.5.0 文字反馈和分数一起写在本页任务卡片上。",
          [row("文字反馈", "文本", "否", "和被指导者看到的是同一段文字。")]),
        marker(3, "fileName", "iteration", "下载文件用原件名", 18,
          "v3.4.0 我的指导里下载导师上传的物料，文件名同样可能落到存储地址，而不是原件名。",
          "v3.5.0 这里下载物料也用原件名，和查看磨课任务是同一条规则。",
          [row("下载", "按钮", "否", "下载名等于物料原件名。")])
      ]
    },
    "/learning": {
      title: "我的学习",
      markers: [
        marker(1, "examDetail", "iteration", "试题考核只看错题", 17,
          "v3.4.0 验收考试只给出分数、合格或不合格。没有考试详情，也没有错题。",
          "v3.5.0 点「查看考试详情」弹出成绩抬头与错题回顾。原型评审第二轮调整为只展示错题：答对的题不再列出，题号保留原卷题号，便于对照纸质卷。弹窗标题由「考试详情」改为「错题回顾」，顶部给出「共 N 题，错 N 题」。全对时只显示「本次全部答对，没有错题」。选项、学员答案、参考答案仍做模糊，参考答案可读。",
          [
            row("查看考试详情", "按钮", "否", "已有成绩的考试出现。点开是「错题回顾」。"),
            row("错题回顾", "弹窗", "是", "只列答错的题。答对的题不出现。题号用原卷题号。", true),
            row("答错题项", "说明", "是", "每题显示题号、题干、选项（模糊）、学员答案、参考答案、该题得分。", true),
            row("全对", "说明", "否", "没有错题时只显示一条「本次没有错题」，不出现空白答题卡。", true),
            row("统计口径", "说明", "否", "共 N 题取试卷总题数，错 N 题取学员答案与标准答案不一致的题数。未作答算错。", true)
          ])
      ]
    },
  };

  var mountedPath = "";
  var autoOpened = "";

  function path() {
    var raw = (location.hash || "").replace(/^#/, "");
    var cut = raw.indexOf("?");
    return cut >= 0 ? raw.slice(0, cut) : raw;
  }

  function esc(s) {
    return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  function kindLabel(kind) {
    return kind === "new" ? "new" : "Iteration";
  }

  function badge(n, kind) {
    return '<span class="lb-num">' + n + "</span>" + (kind ? '<span class="lb-kind lb-kind--' + kind + '">' + kindLabel(kind) + "</span>" : "");
  }

  function tableHtml(block) {
    var html = '<table><thead><tr><th>元素名称</th><th>元素类型</th><th>是否必填</th><th>说明</th></tr></thead><tbody>';
    block.rows.forEach(function (item) {
      html += "<tr><td>" + esc(item.name) + "</td><td>" + esc(item.control) + "</td><td>" + esc(item.required) + "</td><td>" + esc(item.notes) + "</td></tr>";
    });
    return html + "</tbody></table>";
  }

  function markerHtml(block) {
    return '<article class="lb-note-block" id="note-' + block.n + '"><h3>' + badge(block.n, block.kind) + " " + esc(block.name) + ' <span class="lb-ver">清单第 ' + block.req + " 条</span></h3>" +
      '<div class="lb-logic"><h4>过往逻辑 · v3.4.0</h4><p>' + esc(block.past) + "</p></div>" +
      '<div class="lb-logic"><h4>现在的逻辑 · v3.5.0</h4><p>' + esc(block.now) + "</p></div>" +
      tableHtml(block) + "</article>";
  }

  function openPanel(n) {
    var panel = document.getElementById("lb-notes-panel");
    if (!panel) return;
    panel.classList.add("is-open");
    panel.querySelectorAll(".lb-note-block").forEach(function (el) { el.classList.remove("is-focus"); });
    document.querySelectorAll(".lb-num-btn").forEach(function (el) {
      el.classList.toggle("is-on", n && el.getAttribute("data-note") === String(n));
    });
    if (!n) {
      panel.scrollTop = 0;
      return;
    }
    var target = document.getElementById("note-" + n);
    if (!target) return;
    target.classList.add("is-focus");
    target.scrollIntoView({ block: "start" });
  }

  function paintDots(markers) {
    document.querySelectorAll("[data-note-key]").forEach(function (btn) {
      var found = null;
      markers.forEach(function (item) {
        if (item.key === btn.getAttribute("data-note-key")) found = item;
      });
      if (!found) return;
      btn.setAttribute("data-note", String(found.n));
      btn.title = found.n + " · 清单第" + found.req + "条 · " + found.name;
      btn.innerHTML = '<span class="lb-num">' + found.n + "</span>";
    });
    var panel = document.getElementById("lb-notes-panel");
    var focus = panel && panel.querySelector(".lb-note-block.is-focus");
    var current = focus ? focus.id.replace("note-", "") : "";
    if (panel && panel.classList.contains("is-open") && current) {
      document.querySelectorAll(".lb-num-btn").forEach(function (el) {
        el.classList.toggle("is-on", el.getAttribute("data-note") === current);
      });
    }
  }

  function mount(markers, title) {
    var oldBtn = document.querySelector(".lb-notes-btn");
    var oldPanel = document.getElementById("lb-notes-panel");
    if (oldBtn) oldBtn.parentNode.removeChild(oldBtn);
    if (oldPanel) oldPanel.parentNode.removeChild(oldPanel);
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "lb-notes-btn";
    btn.textContent = "全部注释";
    var panel = document.createElement("aside");
    panel.id = "lb-notes-panel";
    panel.className = "lb-notes-panel";
    panel.innerHTML = "<h2>" + esc(title) + " · 本页 " + markers.length + " 条需求</h2><p class=\"lb-note-rule\">一个红色序号对应一条需求。点开后列出本页全部需求。列表字段新增标 new，逻辑迭代标 Iteration，其余字段不打红点。</p>" +
      markers.map(markerHtml).join("") +
      '<p style="margin-top:16px"><button type="button" class="lb-btn" id="lb-notes-close">关闭</button></p>';
    document.body.appendChild(btn);
    document.body.appendChild(panel);
    btn.addEventListener("click", function () { openPanel(""); });
    document.getElementById("lb-notes-close").addEventListener("click", function () {
      panel.classList.remove("is-open");
      document.querySelectorAll(".lb-num-btn").forEach(function (el) { el.classList.remove("is-on"); });
    });
  }

  function paint() {
    var current = path();
    var page = PAGES[current];
    if (!page) {
      var btn = document.querySelector(".lb-notes-btn");
      var panel = document.getElementById("lb-notes-panel");
      if (btn) btn.parentNode.removeChild(btn);
      if (panel) panel.parentNode.removeChild(panel);
      mountedPath = "";
      return;
    }
    if (mountedPath !== current) {
      mount(page.markers, page.title);
      mountedPath = current;
      var want = new URLSearchParams(location.search).get("note");
      if (want && autoOpened !== current + ":" + want) {
        page.markers.forEach(function (item) {
          if (String(item.req) === String(want)) openPanel(item.n);
        });
        autoOpened = current + ":" + want;
      }
    }
    paintDots(page.markers);
  }

  document.addEventListener("click", function (e) {
    var dot = e.target.closest && e.target.closest("[data-note]");
    if (!dot || !dot.closest || !document.getElementById("app") || !document.getElementById("app").contains(dot)) return;
    e.preventDefault();
    e.stopPropagation();
    openPanel(dot.getAttribute("data-note"));
  }, true);

  window.MentorNotes = { paint: paint };
})();
