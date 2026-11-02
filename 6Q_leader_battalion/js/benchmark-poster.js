/**
 * 第60条标杆灯布。
 * 过往：标杆学员档案只存学员、期数、班级、头像、事迹说明和事迹照片。没有底板，也不出印刷图。
 * 现在：后台只有一块固定底板。生成时从这条标杆记录取出实际期数、班级、姓名、头像、事迹说明，画进底板，并把结果写回该记录。
 * 头像用列表上的 memberAvatar。事迹照片最多 3 张，不进灯布。
 * 期数用列表字段 actualClassRank，页面显示为「N期」。
 * 失效记录不能再生成，已经生成的图还留在记录上。
 */
(function () {
  "use strict";

  var W = 900;
  var H = 1280;

  var SAMPLES = [
    { term: "3期", klass: "EQ小班", qcamp: "EQ营《口才与情商》", story: "营中主动带动小组分享，连续三天帮助同组同学完成晚间复盘。班级汇报时把大家的想法收成一条清楚的结论。" },
    { term: "5期", klass: "EQ中班", qcamp: "EQ营《口才与情商》", story: "第一次上台就能把故事讲完整，还回头提醒紧张的同学先呼吸再开口。" },
    { term: "2期", klass: "SQ小班", qcamp: "SQ营《思维与合作》", story: "分组任务里负责分工和计时，小组没有落下任何一个同学。" },
    { term: "4期", klass: "AQ营1班", qcamp: "AQ营", story: "晚间复盘时把当天的冲突讲清楚，第二天主动和对方一起把任务做完。" },
    { term: "6期", klass: "IQ小班", qcamp: "IQ营", story: "实验课上先检查安全，再带同桌把步骤记下来，结果全组一次做对。" },
    { term: "1期", klass: "RQ中班", qcamp: "RQ营", story: "体能游戏里一直守在队尾，确保每个同学都跟上队伍。" },
    { term: "7期", klass: "CQ小班", qcamp: "CQ营", story: "创作课把自己的草稿让给还没想好的同学参考，自己重新起了一稿。" },
    { term: "3期", klass: "EQ小班", qcamp: "EQ营《口才与情商》", story: "家长开放课时用三句话讲清这周学了什么，表达清楚，同学也听得懂。" }
  ];

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function stamp(rows) {
    rows.forEach(function (row, i) {
      var sample = SAMPLES[i % SAMPLES.length];
      row.term = sample.term;
      row.klass = sample.klass;
      row.qcamp = sample.qcamp;
      row.story = sample.story;
      row.group = ["1组", "2组", "3组"][i % 3];
      row.qual = i % 2 ? "新训" : "复训";
      row.gender = i % 2 ? "女" : "男";
      row.how = i % 3 === 0 ? "移动端数据生成" : "后台新增";
      row.status = i === 1 ? "失效" : "有效";
      row.poster = "未生成";
      row.avatar = (row.name || "学").slice(0, 1);
      if (!row.story) row.story = "";
    });
  }

  function fieldsOf(row) {
    if (row && row.posterFields) return row.posterFields;
    return {
      term: row ? row.term : "期数",
      klass: row ? row.klass : "班级",
      name: row ? row.name : "姓名",
      avatar: row ? (row.avatar || (row.name || "学").slice(0, 1)) : "头",
      story: row ? row.story : "事迹说明写在这里"
    };
  }

  function wrap(ctx, text, maxWidth) {
    var source = String(text || "");
    var lines = [];
    var cur = "";
    for (var i = 0; i < source.length; i++) {
      var next = cur + source.charAt(i);
      if (ctx.measureText(next).width > maxWidth && cur) {
        lines.push(cur);
        cur = source.charAt(i);
      } else {
        cur = next;
      }
    }
    if (cur) lines.push(cur);
    return lines;
  }

  function draw(canvas, data, blank) {
    var ctx = canvas.getContext("2d");
    canvas.width = W;
    canvas.height = H;
    var bg = ctx.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0, "#1c2430");
    bg.addColorStop(1, "#3a2a22");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = "#e4c27a";
    ctx.lineWidth = 10;
    ctx.strokeRect(36, 36, W - 72, H - 72);
    ctx.lineWidth = 2;
    ctx.strokeRect(56, 56, W - 112, H - 112);

    ctx.fillStyle = "#e4c27a";
    ctx.font = "600 28px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("6Q 领袖营", W / 2, 130);
    ctx.font = "700 64px sans-serif";
    ctx.fillStyle = "#f7f1e6";
    ctx.fillText("标杆学员", W / 2, 210);

    ctx.beginPath();
    ctx.arc(W / 2, 390, 108, 0, Math.PI * 2);
    ctx.fillStyle = "#f3e2c4";
    ctx.fill();
    ctx.lineWidth = 8;
    ctx.strokeStyle = "#e4c27a";
    ctx.stroke();
    ctx.fillStyle = "#3a2a22";
    ctx.font = "700 92px sans-serif";
    ctx.fillText(blank ? "头" : (data.avatar || "学"), W / 2, 424);

    ctx.fillStyle = "#ffffff";
    ctx.font = "700 72px sans-serif";
    ctx.fillText(blank ? "姓名" : data.name, W / 2, 590);

    ctx.font = "600 32px sans-serif";
    var meta = blank ? "期数    ·    班级" : (data.term + "    ·    " + data.klass);
    var metaW = ctx.measureText(meta).width + 64;
    roundRect(ctx, (W - metaW) / 2, 630, metaW, 64, 32);
    ctx.fillStyle = "#e4c27a";
    ctx.fill();
    ctx.fillStyle = "#1c2430";
    ctx.fillText(meta, W / 2, 674);

    ctx.fillStyle = "#f7f1e6";
    ctx.font = "400 30px sans-serif";
    ctx.textAlign = "left";
    var story = blank ? "事迹说明写在这块固定区域里，生成时换成这条标杆学员的事迹说明。" : data.story;
    var lines = wrap(ctx, story, 680).slice(0, 6);
    lines.forEach(function (line, i) {
      ctx.fillText(line, 110, 820 + i * 48);
    });

    ctx.textAlign = "center";
    ctx.fillStyle = "#c8b89a";
    ctx.font = "400 22px sans-serif";
    ctx.fillText("固定底板 · 只放入期数、班级、姓名、头像、事迹说明", W / 2, 1188);
  }

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  function ensure() {
    var old = document.getElementById("lb-poster");
    if (old) old.remove();
    var box = document.createElement("div");
    box.id = "lb-poster";
    box.className = "lb-poster";
    box.innerHTML =
      '<div class="lb-poster__panel">' +
      '<div class="lb-poster__head"><span id="lb-poster-title">标杆灯布</span><button type="button" class="lb-btn" id="lb-poster-close">关闭</button></div>' +
      '<canvas id="lb-poster-canvas" width="' + W + '" height="' + H + '"></canvas>' +
      '<div class="lb-poster__foot"><span id="lb-poster-note"></span><button type="button" class="lb-btn lb-btn--primary" id="lb-poster-save">下载图片</button></div>' +
      "</div>";
    document.body.appendChild(box);
    document.getElementById("lb-poster-close").onclick = function () { box.remove(); };
    box.addEventListener("click", function (event) {
      if (event.target === box) box.remove();
    });
    return box;
  }

  function show(title, note, data, blank, fileName) {
    var box = ensure();
    document.getElementById("lb-poster-title").textContent = title;
    document.getElementById("lb-poster-note").textContent = note;
    var canvas = document.getElementById("lb-poster-canvas");
    draw(canvas, data, blank);
    var save = document.getElementById("lb-poster-save");
    save.style.display = blank ? "none" : "";
    save.onclick = function () {
      var a = document.createElement("a");
      a.href = canvas.toDataURL("image/png");
      a.download = fileName;
      a.click();
    };
  }

  function generate(row) {
    if (!row || row.status !== "有效") {
      if (window.LB && window.LB.toast) window.LB.toast("失效的标杆学员不能生成灯布");
      return false;
    }
    if (!row.story || row.story === "—") {
      if (window.LB && window.LB.toast) window.LB.toast("这条记录没有事迹说明，不能生成");
      return false;
    }
    row.poster = "已生成";
    row.posterFields = {
      term: row.term || "",
      klass: row.klass || "",
      name: row.name || "",
      avatar: (row.avatar || (row.name || "学")).slice(0, 1),
      story: row.story || ""
    };
    var now = new Date();
    var p = function (n) { return n < 10 ? "0" + n : "" + n; };
    row.posterAt = now.getFullYear() + "-" + p(now.getMonth() + 1) + "-" + p(now.getDate()) + " " + p(now.getHours()) + ":" + p(now.getMinutes());
    show(
      "标杆灯布 · " + row.name,
      "已写入这条标杆记录。期数 " + row.posterFields.term + "，班级 " + row.posterFields.klass + "。",
      row.posterFields,
      false,
      "标杆灯布-" + row.name + ".png"
    );
    return true;
  }

  function preview(row) {
    if (!row || !row.posterFields) {
      if (window.LB && window.LB.toast) window.LB.toast("还没有生成灯布");
      return;
    }
    show(
      "标杆灯布 · " + row.posterFields.name,
      "这张图存在这条标杆记录上，生成于 " + (row.posterAt || "") + "。",
      row.posterFields,
      false,
      "标杆灯布-" + row.posterFields.name + ".png"
    );
  }

  function template() {
    show("灯布模板", "后台固定这一块底板。位置不能改，生成时只替换学员信息。", fieldsOf(null), true, "");
  }

  window.LB_POSTER = {
    stamp: stamp,
    generate: generate,
    preview: preview,
    template: template
  };
})();
