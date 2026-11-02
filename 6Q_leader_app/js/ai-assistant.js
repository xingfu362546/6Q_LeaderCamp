(function () {
  "use strict";

  var CHAT = "pages/aiAssistant/index";
  var HISTORY = "pages/aiAssistant/history";
  var BANKS = [
    ["领袖营是什么", "周营课程安排", "助教岗是干什么的"],
    ["营地签到怎么操作", "班级人数如何确认", "有关于岗位培训的视频"],
    ["离营方式在哪里看", "标杆学员怎么评", "请假审批找谁"]
  ];

  var ai = {
    bubble: true,
    bank: 0,
    draft: "",
    loading: false,
    current: "s0",
    sessions: [
      {
        id: "s0",
        title: "领袖营是什么",
        time: "09-18 10:20",
        messages: [
          { role: "user", parts: [{ type: "text", value: "领袖营是什么" }] },
          { role: "ai", parts: [{ type: "text", value: "领袖营是面向青少年的素质成长营。学员按周营编入班级和小组，助教负责签到、确认人数、日志和成长印记。" }] }
        ]
      }
    ]
  };

  function esc(s) {
    return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  function has(path) {
    return path === CHAT || path === HISTORY;
  }

  function session() {
    return ai.sessions.filter(function (s) { return s.id === ai.current; })[0] || ai.sessions[0];
  }

  function bar(title, right) {
    return '<header class="nav nav--light"><div><button type="button" data-back="1">返回</button></div><h1>' + esc(title) + '</h1><div class="side">' + (right || "") + "</div></header>";
  }

  function partsHtml(parts) {
    return parts.map(function (part) {
      if (part.type === "text") return "<div>" + esc(part.value) + "</div>";
      if (part.type === "file") return '<button type="button" class="ai-link" data-ai="file" data-file="' + esc(part.value) + '">' + esc(part.value) + "</button>";
      if (part.type === "image") return '<div class="ai-imgs"><i></i><i></i><i></i><i></i></div>';
      if (part.type === "video") return '<button type="button" class="ai-video" data-ai="video"><b></b><span>' + esc(part.value || "12:08") + "</span></button>";
      return "";
    }).join("");
  }

  function chatPage() {
    var cur = session();
    var qs = BANKS[ai.bank];
    var html = bar("领袖营助手", '<button type="button" data-go="' + HISTORY + '">历史</button>');
    html += '<div class="body ai-page">';
    html += '<div class="ai-hero"><h2>您可以输入您想要了解的领袖营岗位知识哦</h2><div class="ai-mascot"></div></div>';
    html += '<div class="ai-suggest"><div class="ai-suggest__hd"><strong>您可以试着问我：</strong><button type="button" data-ai="refresh">换一换</button></div>';
    qs.forEach(function (q) {
      html += '<button type="button" class="ai-q" data-ai="ask" data-q="' + esc(q) + '"><i></i>' + esc(q) + "</button>";
    });
    html += "</div><div class=\"ai-msgs\">";
    (cur ? cur.messages : []).forEach(function (msg) {
      var mine = msg.role === "user";
      html += '<div class="ai-row ' + (mine ? "is-user" : "is-ai") + '">';
      if (!mine) html += '<b class="ai-face">Q</b>';
      html += '<div class="ai-card">' + (msg.fail ? '<div class="ai-fail">加载失败，请稍后重试</div>' : partsHtml(msg.parts)) + "</div>";
      if (mine) html += '<b class="ai-face">我</b>';
      html += "</div>";
      if (msg.waiting) html += '<div class="ai-wait">回答中，请稍等...</div>';
    });
    html += '<div id="ai-bottom"></div></div></div>';
    html += '<div class="ai-bar"><textarea id="ai-input" placeholder="请在此输入您要提问的问题">' + esc(ai.draft) + '</textarea><button type="button" class="ai-send" data-ai="send">➤</button></div>';
    return html;
  }

  function historyPage() {
    var html = bar("领袖营助手会话历史") + '<div class="body ai-history">';
    html += '<button type="button" class="ai-new" data-ai="fresh">新会话</button>';
    if (!ai.sessions.length) html += '<div class="sc-empty">暂无会话</div>';
    ai.sessions.forEach(function (item) {
      html += '<button type="button" class="ai-session" data-ai="open" data-id="' + item.id + '"><b>' + esc(item.title) + "</b><span>" + esc(item.time) + "</span></button>";
    });
    html += "</div>";
    return html;
  }

  function render(path) {
    return path === HISTORY ? historyPage() : chatPage();
  }

  function answerFor(q) {
    if (q.indexOf("领袖营是什么") >= 0) return [{ type: "text", value: "领袖营是面向青少年的素质成长营。学员按周营编入班级和小组，助教负责签到、确认人数、日志和成长印记。" }];
    if (q.indexOf("周营课程") >= 0) return [{ type: "text", value: "本周营课程按天安排，每天的记录可以在学员成长日记里查看。" }, { type: "file", value: "周营课程安排.pdf" }];
    if (q.indexOf("助教岗") >= 0) return [{ type: "text", value: "助教岗负责本组学员的每日反馈、签到协助和情绪记录，并和导师团长一起确认班级人数。" }];
    if (q.indexOf("签到") >= 0) return [{ type: "text", value: "学员签到在工作台。未签到点橙色「去签到」拍照；已签到且班级未确认可以撤销；也可以批量确认签到。" }];
    if (q.indexOf("班级人数") >= 0) return [{ type: "text", value: "班级确认页先看新复训、大堂签到和班级确认三组人数。只有已签到且未确认的学员可以勾选，再点「已选 N 名，确认签到」。" }];
    if (q.indexOf("视频") >= 0) return [{ type: "text", value: "久等啦，以下是小Q为您找到符合条件的视频：" }, { type: "video", value: "12:08" }];
    if (q.indexOf("图片") >= 0) return [{ type: "text", value: "以下是相关图片：" }, { type: "image" }];
    if (q === "失败") return null;
    return [{ type: "text", value: "已记下这个问题。演示环境按岗位知识回复：可以从工作台进入助教分组、学员签到和班级确认。" }];
  }

  function readDraft() {
    var el = document.getElementById("ai-input");
    if (el) ai.draft = el.value;
  }

  function ask(text, api) {
    var q = String(text || "").trim();
    if (!q || ai.loading) return;
    var cur = session();
    if (!cur) {
      cur = { id: "s" + Date.now(), title: q, time: "刚刚", messages: [] };
      ai.sessions.unshift(cur);
      ai.current = cur.id;
    } else if (!cur.messages.length || cur.title === "新会话") {
      cur.title = q;
      cur.time = "刚刚";
    }
    cur.messages.push({ role: "user", parts: [{ type: "text", value: q }] });
    var pending = { role: "ai", parts: [], waiting: true, fail: false };
    cur.messages.push(pending);
    ai.draft = "";
    ai.loading = true;
    api.render();
    var node = document.getElementById("ai-bottom");
    if (node) node.scrollIntoView();
    setTimeout(function () {
      var parts = answerFor(q);
      pending.waiting = false;
      if (!parts) pending.fail = true;
      else pending.parts = parts;
      ai.loading = false;
      if (window.APP && window.APP.path() === CHAT) {
        api.render();
        var end = document.getElementById("ai-bottom");
        if (end) end.scrollIntoView();
      }
    }, 700);
  }

  function handle(el, api) {
    var act = el.getAttribute("data-ai");
    if (!act) return false;
    readDraft();
    if (act === "close-bubble") { ai.bubble = false; api.render(); return true; }
    if (act === "refresh") { ai.bank = (ai.bank + 1) % BANKS.length; api.render(); return true; }
    if (act === "ask") { ask(el.getAttribute("data-q"), api); return true; }
    if (act === "send") { ask(ai.draft, api); return true; }
    if (act === "file") { api.toast("打开文件 " + el.getAttribute("data-file")); return true; }
    if (act === "video") { api.toast("播放视频"); return true; }
    if (act === "open") {
      ai.current = el.getAttribute("data-id");
      ai.loading = false;
      api.go(CHAT);
      return true;
    }
    if (act === "fresh") {
      var blank = { id: "s" + Date.now(), title: "新会话", time: "刚刚", messages: [] };
      ai.sessions.unshift(blank);
      ai.current = blank.id;
      ai.loading = false;
      api.go(CHAT);
      return true;
    }
    return false;
  }

  function bubble() {
    if (!ai.bubble) return "";
    return '<span class="ai-bubble" data-ai="close-bubble">可以向我提问哦<b data-ai="close-bubble">×</b></span>';
  }

  window.AI = { has: has, render: render, handle: handle, bubble: bubble };

  document.addEventListener("keydown", function (e) {
    if (e.key !== "Enter" || e.shiftKey || !e.target || e.target.id !== "ai-input" || !window.APP) return;
    e.preventDefault();
    ai.draft = e.target.value;
    ask(ai.draft, window.APP);
  });
})();
