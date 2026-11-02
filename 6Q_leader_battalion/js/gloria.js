/**
 * 第60条 标杆灯布（单张） + 原型评审第二轮第22、23条（光荣榜集合）。
 *
 * 过往（v3.4.0）：
 * - 只存学员、期数、班级、头像、事迹说明和事迹照片。没有底板，也不出印刷图。
 * - v3.5.0 第一版只做了单张 900×1280 灯布，把一条标杆记录画进固定底板。
 *
 * 现在（原型评审第二轮）：
 * - 第22条：光荣榜是「集合榜单」，不是单张。按用户给的模板排版：
 *   左侧品牌区（青少年6Q领袖营 · 光荣榜 · 简介 · 过往获奖照片 · 二维码 · 联系方式），
 *   右侧米色面板内按网格排列学员卡片，每张卡片是 第N期 + 班级 + 姓名，下面是事迹说明。
 *   最多可选 15 人。排列方式可选 3 / 4 / 5 列，列数决定字号（字号固定，不可手调）。
 *   生成前先在画布上预览，图片尺寸统一。
 * - 第23条：标杆学员可以修改事迹。事迹超出卡片高度或宽度时截断并加省略号，不溢出画布。
 */
(function () {
  "use strict";

  var W = 1600;
  var H = 1000;
  var MAX_PICK = 15;
  var BOARD_KEY = "lb-gloria-v1";
  /* 3 / 4 / 5 列对应的字号是固定的，用户不能改。 */
  var LAYOUTS = {
    3: { name: "3 列", cols: 3, nameSize: 22, metaSize: 15, storySize: 13, storyLines: 6, gap: 22 },
    4: { name: "4 列", cols: 4, nameSize: 19, metaSize: 13, storySize: 11, storyLines: 5, gap: 16 },
    5: { name: "5 列", cols: 5, nameSize: 17, metaSize: 12, storySize: 10, storyLines: 4, gap: 12 }
  };

  function esc(s) {
    return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  function rows() {
    if (window.LB_LEDGER_ROWS) return window.LB_LEDGER_ROWS;
    return [];
  }

  /* 取标杆学员列表（与标杆学员档案室同一份数据） */
  function benchRows() {
    return (window.LB_BENCHMARK_ROWS || []);
  }

  function state() {
    var saved = null;
    try { saved = JSON.parse(sessionStorage.getItem(BOARD_KEY) || "null"); } catch (e) { saved = null; }
    return saved || { picked: [], cols: 4, term: "2027" };
  }

  function saveState(st) {
    try { sessionStorage.setItem(BOARD_KEY, JSON.stringify(st)); } catch (e) {}
  }

  /* 树标：超过行数或宽度都截断，末尾加省略号。 */
  function fitText(ctx, text, maxWidth, maxLines) {
    var chars = String(text || "").split("");
    var lines = [];
    var line = "";
    for (var i = 0; i < chars.length; i++) {
      var next = line + chars[i];
      if (ctx.measureText(next).width > maxWidth) {
        lines.push(line);
        line = chars[i];
        if (lines.length >= maxLines) break;
      } else {
        line = next;
      }
    }
    if (lines.length < maxLines && line) lines.push(line);
    var truncated = lines.join("").length < chars.length;
    if (truncated && lines.length) {
      var last = lines[lines.length - 1];
      while (last && ctx.measureText(last + "…").width > maxWidth) last = last.slice(0, -1);
      lines[lines.length - 1] = last + "…";
    }
    return lines;
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

  function drawBoard(canvas, picked, layout, term) {
    var ctx = canvas.getContext("2d");
    canvas.width = W;
    canvas.height = H;

    /* 背景：暖橙渐变，与模板一致的品牌色 */
    var bg = ctx.createLinearGradient(0, 0, W, H);
    bg.addColorStop(0, "#fff5e6");
    bg.addColorStop(0.45, "#ffe9c9");
    bg.addColorStop(1, "#ffd9a8");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    /* 左侧品牌区 */
    var leftW = 330;
    ctx.fillStyle = "#ff8a3d";
    roundRect(ctx, 24, 24, leftW, H - 48, 20);
    ctx.fill();
    ctx.fillStyle = "#fff";
    ctx.font = "bold 30px 'PingFang SC','Microsoft YaHei',sans-serif";
    ctx.fillText("青少年", 56, 96);
    ctx.font = "bold 52px 'PingFang SC','Microsoft YaHei',sans-serif";
    ctx.fillText("6Q领袖营", 56, 152);
    ctx.font = "bold 62px 'PingFang SC','Microsoft YaHei',sans-serif";
    ctx.fillText("光荣榜", 56, 232);

    ctx.font = "14px 'PingFang SC','Microsoft YaHei',sans-serif";
    var intro = [
      "青少年6Q领袖营是专注青少年情商与品格",
      "培养的营地项目。本期从数百名学员中评选",
      "出标杆学员，他们在自我管理、同伴支持、",
      "课堂投入与品格表现上，成为同伴的榜样。"
    ];
    intro.forEach(function (line, i) { ctx.fillText(line, 56, 286 + i * 24); });

    ctx.font = "bold 15px 'PingFang SC','Microsoft YaHei',sans-serif";
    ctx.fillText("过往获奖照片", 56, 424);
    var px = 56;
    [0, 1, 2].forEach(function (i) {
      ctx.fillStyle = "#ffe0c2";
      roundRect(ctx, px + i * 88, 436, 80, 56, 6);
      ctx.fill();
      ctx.fillStyle = "#ff8a3d";
      ctx.font = "11px 'PingFang SC','Microsoft YaHei',sans-serif";
      ctx.fillText("照片" + (i + 1), px + i * 88 + 26, 468);
      ctx.fillStyle = "#fff";
      ctx.font = "bold 15px 'PingFang SC','Microsoft YaHei',sans-serif";
    });

    ctx.fillStyle = "#fff";
    ctx.font = "bold 15px 'PingFang SC','Microsoft YaHei',sans-serif";
    ctx.fillText("联系电话：19120057382    4000-020-386", 56, 552);
    ctx.font = "13px 'PingFang SC','Microsoft YaHei',sans-serif";
    ctx.fillText("地址：广州市黄埔区九龙大道腾飞园A栋1001-1012室", 56, 578);

    /* 右侧内容面板 */
    var panelX = leftW + 56;
    var panelY = 40;
    var panelW = W - panelX - 40;
    var panelH = H - 80;
    ctx.fillStyle = "rgba(255,252,245,0.92)";
    roundRect(ctx, panelX, panelY, panelW, panelH, 18);
    ctx.fill();

    /* 标题 */
    ctx.fillStyle = "#e2661c";
    ctx.font = "bold 26px 'PingFang SC','Microsoft YaHei',sans-serif";
    ctx.fillText(term + "年《青少年6Q领袖营》标杆学员风采展示", panelX + 28, panelY + 48);

    if (!picked.length) {
      ctx.fillStyle = "#b98a5c";
      ctx.font = "20px 'PingFang SC','Microsoft YaHei',sans-serif";
      ctx.fillText("还没有选择标杆学员。在左侧勾选 1–15 位后点「生成预览」。", panelX + 28, panelY + 110);
      return;
    }

    /* 网格排布 */
    var cols = layout.cols;
    var innerX = panelX + 24;
    var innerY = panelY + 74;
    var innerW = panelW - 48;
    var innerH = panelH - 100;
    var cardW = (innerW - layout.gap * (cols - 1)) / cols;
    var rowsN = Math.ceil(picked.length / cols);
    var cardH = Math.min((innerH - layout.gap * (rowsN - 1)) / rowsN, 210);

    picked.forEach(function (p, i) {
      var col = i % cols;
      var row = Math.floor(i / cols);
      var x = innerX + col * (cardW + layout.gap);
      var y = innerY + row * (cardH + layout.gap);

      ctx.fillStyle = "#fff";
      roundRect(ctx, x, y, cardW, cardH, 10);
      ctx.fill();

      /* 头像 */
      ctx.fillStyle = "#ffd7b0";
      ctx.beginPath();
      ctx.arc(x + cardW / 2, y + 34, 24, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#e2661c";
      ctx.font = "bold 18px 'PingFang SC','Microsoft YaHei',sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(String(p.name || "").slice(0, 1), x + cardW / 2, y + 41);

      /* 姓名 + 期数班级 */
      ctx.fillStyle = "#b3521a";
      ctx.font = "bold " + layout.nameSize + "px 'PingFang SC','Microsoft YaHei',sans-serif";
      var nameLines = fitText(ctx, p.name, cardW - 20, 1);
      ctx.fillText(nameLines[0] || "", x + cardW / 2, y + 78);

      ctx.fillStyle = "#a8836a";
      ctx.font = layout.metaSize + "px 'PingFang SC','Microsoft YaHei',sans-serif";
      var term = String(p.term || "").replace(/期$/, "");
      var meta = (term ? "第" + term + "期 · " : "") + (p.klass || "-");
      var metaLines = fitText(ctx, meta, cardW - 20, 1);
      ctx.fillText(metaLines[0] || "", x + cardW / 2, y + 78 + layout.nameSize + 6);

      /* 事迹说明：超出卡片高度按行截断加省略号 */
      ctx.textAlign = "left";
      ctx.fillStyle = "#6b5b4d";
      ctx.font = layout.storySize + "px 'PingFang SC','Microsoft YaHei',sans-serif";
      var avail = cardH - (78 + layout.nameSize + 6 + layout.metaSize + 14);
      var maxLines = Math.max(1, Math.min(layout.storyLines, Math.floor(avail / (layout.storySize + 5))));
      var storyLines = fitText(ctx, p.story || "", cardW - 24, maxLines);
      storyLines.forEach(function (line, li) {
        ctx.fillText(line, x + 12, y + 78 + layout.nameSize + 6 + layout.metaSize + 22 + li * (layout.storySize + 5));
      });
      ctx.textAlign = "center";
    });
  }

  function pickListHtml(st) {
    var list = benchRows();
    if (!list.length) return '<p class="lb-hint">标杆学员档案室还没有记录，先去评选标杆学员。</p>';
    var html = '<div class="gl-pick">';
    list.forEach(function (p) {
      var on = st.picked.indexOf(p._id) >= 0;
      var full = !on && st.picked.length >= MAX_PICK;
      html += '<button type="button" class="gl-pick__item' + (on ? " is-on" : "") + (full ? " is-full" : "") + '" data-gloria="pick" data-id="' + esc(p._id) + '">';
      html += '<b>' + esc(p.student || p.name || "-") + "</b>";
      html += "<em>" + esc(p.week || "") + " · " + esc(p.klass || "") + "</em>";
      html += '<span>' + esc((p.story || "未填写事迹").slice(0, 40)) + "</span>";
      html += "</button>";
    });
    return html + "</div>";
  }

  function openGloria() {
    var st = state();
    var html = '<div class="gl-wrap"><div class="gl-left"><h3>选择标杆学员</h3>';
    html += '<p class="lb-hint">最多 ' + MAX_PICK + " 位，已选 " + st.picked.length + " 位。</p>";
    html += pickListHtml(st);
    html += '<h3 style="margin-top:16px">排列方式</h3><div class="gl-cols">';
    [3, 4, 5].forEach(function (n) {
      html += '<button type="button" class="gl-col' + (st.cols === n ? " is-on" : "") + '" data-gloria="cols" data-v="' + n + '">' + LAYOUTS[n].name + "</button>";
    });
    html += "</div>";
    html += '<p class="lb-hint">列数决定字号，字号固定不可手调。' + LAYOUTS[st.cols].name + "：姓名 " + LAYOUTS[st.cols].nameSize + "px，事迹 " + LAYOUTS[st.cols].storySize + "px，最多 " + LAYOUTS[st.cols].storyLines + " 行。</p>";
    html += '<div class="gl-ops"><button type="button" class="lb-btn lb-btn--primary" data-gloria="preview">生成预览</button>';
    html += '<button type="button" class="lb-btn" data-gloria="download">下载图片</button>';
    html += '<button type="button" class="lb-btn" data-gloria="clear">清空</button></div>';
    html += "</div>";
    html += '<div class="gl-right"><canvas id="gl-canvas" width="' + W + '" height="' + H + '"></canvas></div></div>';
    window.LB.openDrawer("光荣榜 · 集合榜单", html, { paper: true });
    renderCanvas();
  }

  function renderCanvas() {
    var st = state();
    var canvas = document.getElementById("gl-canvas");
    if (!canvas) return;
    var list = benchRows().filter(function (p) { return st.picked.indexOf(p._id) >= 0; });
    /* 按选中的顺序排 */
    list.sort(function (a, b) { return st.picked.indexOf(a._id) - st.picked.indexOf(b._id); });
    drawBoard(canvas, list, LAYOUTS[st.cols], st.term);
  }

  function refreshGloria() {
    var st = state();
    var left = document.querySelector(".gl-left");
    if (!left) return;
    var html = "<h3>选择标杆学员</h3>";
    html += '<p class="lb-hint">最多 ' + MAX_PICK + " 位，已选 " + st.picked.length + " 位。</p>";
    html += pickListHtml(st);
    html += '<h3 style="margin-top:16px">排列方式</h3><div class="gl-cols">';
    [3, 4, 5].forEach(function (n) {
      html += '<button type="button" class="gl-col' + (st.cols === n ? " is-on" : "") + '" data-gloria="cols" data-v="' + n + '">' + LAYOUTS[n].name + "</button>";
    });
    html += "</div>";
    html += '<p class="lb-hint">列数决定字号，字号固定不可手调。' + LAYOUTS[st.cols].name + "：姓名 " + LAYOUTS[st.cols].nameSize + "px，事迹 " + LAYOUTS[st.cols].storySize + "px，最多 " + LAYOUTS[st.cols].storyLines + " 行。</p>";
    html += '<div class="gl-ops"><button type="button" class="lb-btn lb-btn--primary" data-gloria="preview">生成预览</button>';
    html += '<button type="button" class="lb-btn" data-gloria="download">下载图片</button>';
    html += '<button type="button" class="lb-btn" data-gloria="clear">清空</button></div>';
    left.innerHTML = html;
    renderCanvas();
  }

  document.addEventListener("click", function (e) {
    var t = e.target.closest && e.target.closest("[data-gloria]");
    if (!t) return;
    var act = t.getAttribute("data-gloria");
    var st = state();
    if (act === "pick") {
      var id = t.getAttribute("data-id");
      var at = st.picked.indexOf(id);
      if (at >= 0) st.picked.splice(at, 1);
      else if (st.picked.length >= MAX_PICK) {
        window.LB.toast("最多选 " + MAX_PICK + " 位");
        return;
      } else st.picked.push(id);
      saveState(st);
      refreshGloria();
      return;
    }
    if (act === "cols") {
      st.cols = Number(t.getAttribute("data-v"));
      saveState(st);
      refreshGloria();
      return;
    }
    if (act === "clear") {
      st.picked = [];
      saveState(st);
      refreshGloria();
      return;
    }
    if (act === "preview") {
      renderCanvas();
      window.LB.toast(st.picked.length ? "已生成预览" : "请先选择标杆学员");
      return;
    }
    if (act === "download") {
      var canvas = document.getElementById("gl-canvas");
      if (!canvas) return;
      if (!st.picked.length) { window.LB.toast("请先选择标杆学员"); return; }
      var a = document.createElement("a");
      a.download = "光荣榜.png";
      a.href = canvas.toDataURL("image/png");
      a.click();
      window.LB.toast("已下载图片");
    }
  }, true);

  window.LB_GLORIA = { open: openGloria, layouts: LAYOUTS, max: MAX_PICK };
})();
