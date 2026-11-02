(function () {
  "use strict";

  var ui = { modal: "", mode: "", answers: {} };

  var info = {
    name: "岗前培训",
    klass: "A1班",
    post: "授课导师",
    start: "2026-07-01",
    end: "2026-07-06",
    desc: "完成磨课方法、课堂节奏和验收考试。"
  };

  var modules = [
    { id: "m1", type: "线上集训", typeClass: "type-online", name: "磨课方法", desc: "完成一次磨课记录", status: "completed" },
    { id: "m2", type: "线下集训", typeClass: "type-offline", name: "课堂节奏", desc: "跟一次完整课堂", status: "inProgress" },
    { id: "m3", type: "验收考试", typeClass: "type-exam", name: "导师验收考试", desc: "线上考试，报名后按时参加", status: "registerReady", start: "2026-07-06 19:00", end: "2026-07-06 20:00", score: 0, total: 100 },
    { id: "m6", type: "验收考试", typeClass: "type-exam", name: "当场验收", desc: "已经报名，可以进入考试", status: "examReady", start: "2026-07-08 19:00", end: "2026-07-08 20:00", score: 0, total: 100 },
    { id: "m4", type: "验收考试", typeClass: "type-exam", name: "补考", desc: "未通过可以重新考试", status: "failed", start: "2026-07-04 19:00", end: "2026-07-04 20:00", score: 34, total: 100, paper: null },
    { id: "m5", type: "验收考试", typeClass: "type-exam", name: "已结束的验收考试", desc: "可以查看考试详情", status: "passed", start: "2026-06-20 19:00", end: "2026-06-20 20:00", score: 66, total: 100, paper: null }
  ];

  var questions = [
    { id: "q1", title: "磨课任务提交后，指导导师先看到什么？", options: ["空白页", "待反馈的进度和物料", "直接看到分数"], answer: 1 },
    { id: "q2", title: "验收试讲材料应该在什么时候上传？", options: ["验收结束之后", "验收开始前", "结营之后"], answer: 1 },
    { id: "q3", title: "哪一项属于线下集训？", options: ["只看录播", "到营地上课", "只交一份作业"], answer: 1 }
  ];

  var exams = [
    { id: "e1", name: "七月验收考试", start: "2026-07-06 19:00", end: "2026-07-06 20:00", desc: "岗前培训验收", status: "待报名", signed: false },
    { id: "e2", name: "六月补考", start: "2026-06-28 19:00", end: "2026-06-28 20:00", desc: "已报名", status: "已报名", signed: true }
  ];

  function esc(s) { return window.MentorApp.esc(s); }
  function shell(body) { return window.MentorApp.shell("", body, true); }
  function moduleById(id) {
    for (var i = 0; i < modules.length; i++) if (modules[i].id === id) return modules[i];
    return modules[0];
  }

  function statusHtml(item) {
    if (item.status === "completed") return '<span class="ln-status ok">已完成</span>';
    if (item.status === "inProgress") return '<span class="ln-status warn">进行中</span>';
    if (item.status === "pending") return '<button type="button" class="ln-status warn" data-ln="open" data-id="' + item.id + '" data-mode="pending">待开始</button><span>已成功报名</span>';
    if (item.status === "failed") return '<div class="ln-score">' + item.score + "/" + item.total + ' 不合格</div><button type="button" class="gl-btn gl-btn--ghost" data-ln="open" data-id="' + item.id + '" data-mode="resetSignUp">重新考试</button><button type="button" class="gl-link" data-ln="detail" data-id="' + item.id + '">查看考试详情</button>';
    if (item.status === "passed") return '<button type="button" class="ln-status ok" data-ln="open" data-id="' + item.id + '" data-mode="passed">已结束</button><div class="ln-score ok">' + item.score + "/" + item.total + ' 合格</div><button type="button" class="gl-link" data-ln="detail" data-id="' + item.id + '">查看考试详情</button>';
    if (item.status === "examReady") return '<button type="button" class="gl-btn" data-ln="exam" data-id="' + item.id + '">去考试 ›</button>';
    if (item.status === "registerReady") return '<button type="button" class="gl-btn" data-ln="open" data-id="' + item.id + '" data-mode="signUp">去报名 ›</button>';
    return '<span class="ln-status">' + esc(item.status) + "</span>";
  }

  function card(item) {
    var time = item.start ? '<p>考试时间：' + esc(item.start) + " 至 " + esc(item.end) + "</p>" : "";
    return '<article class="ln-card"><span class="gl-tag ' + item.typeClass + '">' + esc(item.type) + "</span><h3>" + esc(item.name) + "</h3><p>任务说明：" + esc(item.desc) + "</p>" + time + '<div class="ln-foot">' + statusHtml(item) + "</div></article>";
  }

  function side() {
    var rows = exams.map(function (item) {
      var btn = item.signed ? '<button type="button" class="gl-btn gl-btn--mute" data-ln="side-open" data-id="' + item.id + '">已报名</button>' : '<button type="button" class="gl-btn" data-ln="side-sign" data-id="' + item.id + '">立即报名</button>';
      if (item.status !== "待报名" && item.status !== "已报名") btn = "";
      return '<div class="gl-side-item"><b>' + esc(item.name) + "</b><div>" + esc(item.start) + "~" + esc(item.end) + "</div><p>" + esc(item.desc) + "</p>" + btn + "</div>";
    }).join("");
    return '<aside class="gl-side">' + rows + '<button type="button" class="gl-more" data-ln="more">查看更多</button></aside>';
  }

  function ensurePaper(item) {
    if (item.paper) return item.paper;
    var picks = item.id === "m5" ? [1, 1, 0] : [0, 0, 1];
    item.paper = questions.map(function (question, index) {
      var picked = picks[index];
      var each = index === questions.length - 1 ? 34 : 33;
      return {
        stem: question.title,
        options: question.options.slice(),
        picked: picked,
        answer: question.answer,
        score: picked === question.answer ? each : 0,
        max: each
      };
    });
    return item.paper;
  }
  /* 原型评审第二轮第1条：考试详情只展示错题，答对的题不再列出。
     题号保留原卷题号，便于对照纸质卷。全对时给一句「本次全部答对」。 */
  function detailModal(item) {
    var paper = ensurePaper(item);
    var passed = item.score >= 60;
    var name = window.MentorApp && document.querySelector(".portal-user span:nth-child(2)");
    var who = name ? name.textContent : "演示导师";
    var wrongs = [];
    paper.forEach(function (question, index) {
      if (question.picked !== question.answer) wrongs.push({ q: question, no: index + 1 });
    });
    var head = wrongs.length
      ? '<span class="muted">共 ' + paper.length + " 题，错 " + wrongs.length + " 题。只列错题，答对的题不展示。</span>"
      : '<span class="muted">共 ' + paper.length + " 题，全部答对，没有错题。</span>";
    var blocks = wrongs.map(function (row) {
      var question = row.q;
      var letters = ["A", "B", "C", "D"];
      var options = question.options.map(function (option, optIndex) {
        var mark = "";
        if (optIndex === question.picked) mark += " is-pick";
        return '<div class="ed-opt' + mark + '"><span class="ed-letter">' + letters[optIndex] + '</span><span class="ed-blur">' + esc(option) + "</span></div>";
      }).join("");
      var yours = question.picked >= 0 ? question.options[question.picked] : "未作答";
      var right = question.options[question.answer];
      return '<div class="ed-q"><div class="ed-qrow"><span class="ed-num">' + row.no + '</span><p class="ed-stem">' + esc(question.stem) + '</p><span class="ed-result bad">答错</span></div><div class="ed-opts">' + options + '</div><div class="ed-answer"><strong>学员答案：</strong><span class="ed-blur">' + esc(yours) + '</span></div><div class="ed-answer ref"><strong>参考答案：</strong><span class="ed-blur">' + esc(right) + '</span></div><div class="ed-scoreline">得分 ' + question.score + " / " + question.max + "</div></div>";
    }).join("");
    if (!blocks) blocks = '<p class="ed-none">本次没有错题。</p>';
    return '<div class="tt-modal"><div class="tt-dialog ed-dialog"><div class="tt-dialog-h"><span>错题回顾</span><button type="button" data-ln="close">×</button></div><div class="ed-hero"><div><h2>错题回顾</h2><div class="ed-chips"><span class="ed-chip">学员 <b>' + esc(who) + '</b></span><span class="ed-chip">问卷 <b>' + esc(item.name) + '</b></span><span class="ed-chip">课程 <b>' + esc(info.name) + '</b></span></div></div><div class="ed-score"><div class="label">考试总分</div><div class="big"><span>' + item.score + '</span><span class="slash">/</span><span class="max">' + item.total + '</span></div><div class="sub">达标线 60 分</div><span class="ed-pass ' + (passed ? "ok" : "bad") + '">' + (passed ? "已满足" : "未满足") + '</span></div></div><section class="ed-card"><div class="ed-hd"><span>错题回顾</span>' + head + '</div><div class="ed-bd">' + blocks + "</div></section></div></div>";
  }
  function modal() {
    if (ui.modal === "record") {
      return '<div class="tt-modal"><div class="tt-dialog"><div class="tt-dialog-h"><span>学习记录</span><button type="button" data-ln="close">×</button></div><table class="table"><thead><tr><th>培训</th><th>时间</th><th>岗位</th></tr></thead><tbody><tr><td>岗前培训</td><td>2026-07-01 至 2026-07-06</td><td>授课导师</td></tr><tr><td>六月集训</td><td>2026-06-01 至 2026-06-05</td><td>授课导师</td></tr></tbody></table></div></div>';
    }
    if (ui.modal === "more") {
      var rows = exams.map(function (item) {
        return "<tr><td>" + esc(item.name) + "</td><td>" + esc(item.start) + "</td><td>" + esc(item.status) + "</td></tr>";
      }).join("");
      return '<div class="tt-modal"><div class="tt-dialog"><div class="tt-dialog-h"><span>验收考试</span><button type="button" data-ln="close">×</button></div><table class="table"><thead><tr><th>考试</th><th>时间</th><th>状态</th></tr></thead><tbody>' + rows + "</tbody></table></div></div>";
    }
    if (ui.modal === "exam") {
      var item = moduleById(ui.moduleId);
      var qs = questions.map(function (question) {
        var options = question.options.map(function (option, index) {
          return '<label class="ln-opt"><input type="radio" name="' + question.id + '" value="' + index + '" />' + esc(option) + "</label>";
        }).join("");
        return '<fieldset><legend>' + esc(question.title) + "</legend>" + options + "</fieldset>";
      }).join("");
      return '<div class="tt-modal"><div class="tt-dialog"><div class="tt-dialog-h"><span>' + esc(item.name) + '</span><button type="button" data-ln="close">×</button></div>' + qs + '<div class="tt-foot"><button type="button" class="btn" data-ln="close">取消</button><button type="button" class="btn btn--primary" data-ln="submit-exam">提交</button></div></div></div>';
    }
    if (ui.modal === "detail") return detailModal(moduleById(ui.moduleId));
    if (ui.modal === "sign") {
      var current = ui.examId ? exams.filter(function (item) { return item.id === ui.examId; })[0] : moduleById(ui.moduleId);
      var name = current.name;
      var start = current.start || current.examStartTime;
      var end = current.end;
      var extra = "";
      if (ui.mode === "pending") extra = '<p class="ln-status warn">待开始</p><p>已成功报名</p>';
      if (ui.mode === "passed") extra = '<p class="ln-status ok">已结束</p><p class="ln-score ok">' + current.score + "/" + current.total + " 合格</p>";
      if (ui.mode === "resetSignUp") extra = '<p class="ln-score">' + current.score + "/" + current.total + " 不合格</p>";
      var wrongLink = (ui.mode === "passed" || ui.mode === "resetSignUp") && current.paper ? '<p><button type="button" class="gl-link" data-ln="detail" data-id="' + current.id + '">查看考试详情</button></p>' : "";
      var foot = ui.mode === "passed" || ui.mode === "pending" ? "" : '<div class="tt-foot"><button type="button" class="btn" data-ln="close">取消</button><button type="button" class="btn btn--primary" data-ln="confirm">' + (ui.mode === "resetSignUp" ? "重新考试" : "确认") + "</button></div>";
      return '<div class="tt-modal"><div class="tt-dialog"><div class="tt-dialog-h"><span>考试报名</span><button type="button" data-ln="close">×</button></div><h3>' + esc(name) + "</h3><p>线上考试</p><p>考试时间：" + esc(start || "") + " 至 " + esc(end || "") + "</p><p>" + esc(current.desc || info.desc) + "</p>" + extra + wrongLink + foot + "</div></div>";
    }
    return "";
  }

  function page() {
    var cards = modules.map(card).join("");
    return shell('<div class="gl-page"><div class="gl-body"><div><button type="button" class="ln-title" data-ln="record">' + esc(info.name) + ' ›</button> <span class="lb-note-host"><button type="button" class="lb-num-btn" data-note-key="examDetail"></button></span><p>Q营班级：' + esc(info.klass) + " | 岗位：" + esc(info.post) + "</p><p>培训时间: " + esc(info.start) + " 至 " + esc(info.end) + "</p><p>" + esc(info.desc) + '</p><div class="ln-grid">' + cards + "</div></div>" + side() + "</div>" + modal() + "</div>");
  }

  function act(name, el) {
    if (name === "close") ui.modal = "";
    else if (name === "record") ui.modal = "record";
    else if (name === "more") ui.modal = "more";
    else if (name === "open") { ui.modal = "sign"; ui.mode = el.getAttribute("data-mode"); ui.moduleId = el.getAttribute("data-id"); ui.examId = ""; }
    else if (name === "detail") { ui.modal = "detail"; ui.moduleId = el.getAttribute("data-id"); }
    else if (name === "side-open" || name === "side-sign") { ui.modal = "sign"; ui.mode = "signUp"; ui.examId = el.getAttribute("data-id"); }
    else if (name === "exam") { ui.modal = "exam"; ui.moduleId = el.getAttribute("data-id"); }
    else if (name === "confirm") {
      if (ui.examId) exams.forEach(function (item) { if (item.id === ui.examId) { item.signed = true; item.status = "已报名"; } });
      else {
        var item = moduleById(ui.moduleId);
        if (ui.mode === "resetSignUp") { item.status = "examReady"; }
        else { item.status = "pending"; }
      }
      ui.modal = "";
    } else if (name === "submit-exam") {
      var right = 0;
      questions.forEach(function (question) {
        var picked = document.querySelector('input[name="' + question.id + '"]:checked');
        var value = picked ? Number(picked.value) : -1;
        ui.answers[question.id] = value;
        if (value === question.answer) right += 1;
      });
      var item = moduleById(ui.moduleId);
      var eachScores = [33, 33, 34];
      item.paper = questions.map(function (question, index) {
        var picked = ui.answers[question.id];
        return {
          stem: question.title,
          options: question.options.slice(),
          picked: picked,
          answer: question.answer,
          score: picked === question.answer ? eachScores[index] : 0,
          max: eachScores[index]
        };
      });
      item.score = item.paper.reduce(function (sum, question) { return sum + question.score; }, 0);
      item.status = item.score >= 60 ? "passed" : "failed";
      ui.modal = "sign";
      ui.mode = item.status === "passed" ? "passed" : "resetSignUp";
      ui.examId = "";
    }
    window.MentorApp.render();
  }

  window.MentorLearn = { page: page, act: act, questions: questions };
})();
