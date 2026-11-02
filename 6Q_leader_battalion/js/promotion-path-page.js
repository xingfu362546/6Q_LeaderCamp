(function () {
  "use strict";

  var LOCK_MSG = "目前有计划周营正在开营中，不可修改";
  var team = "导师团";
  var campOpen = false;
  var editing = false;
  var draft = JSON.parse(JSON.stringify(window.LB_PATHS));
  /* 原型评审第二轮第25条：路线改为「级」的集合。
     drag = { pathId, fromStage, postId } */
  var drag = { pathId: "", fromStage: -1, postId: "" };
  /* 第25条：先点某一级的「加岗位」，再点可选岗位卡片，就能加进指定级。 */
  var picking = { pathId: "", stage: -1 };

  function qs(id) {
    return document.getElementById(id);
  }

  function canEdit() {
    return editing && !campOpen;
  }

  function refreshCampNote() {
    var btn = document.getElementById("btn-camp-state");
    var text = document.getElementById("camp-state-text");
    if (btn) btn.textContent = campOpen ? "切换为未开营" : "切换为开营中";
    if (text) {
      text.textContent = campOpen
        ? "当前开营中。新增和保存都会提示「目前有计划周营正在开营中，不可修改」。"
        : "当前未开营。可以新增和保存。保存后路线不可编辑，再次新增才进入编辑。";
    }
  }

  window.LB_bindCampDemo = function (article) {
    if (!article || document.getElementById("btn-camp-state")) return;
    var box = document.createElement("div");
    box.className = "lb-logic";
    box.innerHTML =
      "<h4>演示：计划周营状态</h4>" +
      "<p id=\"camp-state-text\"></p>" +
      "<p><button type=\"button\" class=\"lb-btn\" id=\"btn-camp-state\"></button></p>";
    var table = article.querySelector("table");
    if (table) article.insertBefore(box, table);
    else article.appendChild(box);
    refreshCampNote();
    document.getElementById("btn-camp-state").addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      campOpen = !campOpen;
      refreshCampNote();
      renderRoutes();
    });
  };

  function blockIfCamp() {
    if (!campOpen) return false;
    window.LB.alert(LOCK_MSG);
    return true;
  }

  function postById(id) {
    return window.LB_POSTS.filter(function (p) {
      return p.id === id;
    })[0];
  }

  function teamPosts() {
    return window.LB_POSTS.filter(function (p) {
      return p.team === team;
    });
  }

  function teamPaths() {
    return draft.filter(function (p) {
      return p.team === team;
    });
  }

  /* 一条路线里所有级的所有岗位 */
  function pathPostIds(path) {
    var out = [];
    (path.stages || []).forEach(function (st) {
      (st.postIds || []).forEach(function (id) { out.push(id); });
    });
    return out;
  }

  function occupied(exceptPathId) {
    var used = {};
    teamPaths().forEach(function (path) {
      if (path.id === exceptPathId) return;
      pathPostIds(path).forEach(function (id) {
        used[id] = true;
      });
    });
    return used;
  }

  function renderTeams() {
    qs("team-list").innerHTML = window.LB_TEAMS.map(function (t) {
      var on = t === team ? " is-on" : "";
      return (
        '<button type="button" class="' +
        on.trim() +
        '" data-team="' +
        t +
        '">' +
        t +
        "</button>"
      );
    }).join("");
  }

  /* 可选岗位：未进入本路线、也没被其它路线占用的岗位 */
  function renderWall(path) {
    if (!canEdit()) return "";
    var usedOther = occupied(path.id);
    var onChain = {};
    pathPostIds(path).forEach(function (id) { onChain[id] = true; });
    var cards = teamPosts()
      .map(function (p) {
        if (onChain[p.id]) return "";
        var busy = !!usedOther[p.id];
        return (
          '<button type="button" class="lb-post-card' +
          (busy ? " is-used" : "") +
          '"' +
          (busy ? " disabled" : "") +
          ' data-add="' +
          p.id +
          '" data-path="' +
          path.id +
          '">' +
          p.name +
          "<small>" +
          (busy ? "已在其它路线" : p.category === p.name ? p.team : p.category) +
          "</small></button>"
        );
      })
      .join("");
    return (
      '<div class="lb-wall"><h4><span class="lb-act">可选岗位<button type="button" class="lb-num-btn" data-note-key="promoPath"></button></span></h4><div class="lb-wall__grid">' +
      (cards || "<p style=\"color:rgba(0,0,0,.45)\">该团队岗位都已在路线中</p>") +
      "</div></div>"
    );
  }

  /* 一级 = 一个岗位集合。编辑时可点「+ 加岗位」把该级变成多岗位。 */
  function renderStage(path, stage, index) {
    var posts = (stage.postIds || []).map(function (id) {
      var p = postById(id);
      var name = p ? p.name : id;
      return (
        '<span class="lb-chip" draggable="' +
        (canEdit() ? "true" : "false") +
        '" data-path="' +
        path.id +
        '" data-stage="' +
        index +
        '" data-post="' +
        id +
        '">' +
        name +
        (canEdit()
          ? '<button type="button" data-rm="' + path.id + '" data-stage="' + index + '" data-post="' + id + '" aria-label="移除">×</button>'
          : "") +
        "</span>"
      );
    }).join('<span class="lb-chip-or">或</span>');
    var empty = '<span style="color:rgba(0,0,0,.45);font-size:12px">' + (canEdit() ? "点「加岗位」把岗位放进本级" : "本级还没有岗位") + "</span>";
    var tools = canEdit()
      ? '<span class="lb-stage__tools">' +
        (picking.pathId === path.id && picking.stage === index ? '<em class="lb-stage__picking">正在选择岗位</em>' : "") +
        '<button type="button" class="lb-stage__add' + (picking.pathId === path.id && picking.stage === index ? " is-on" : "") + '" data-pick-stage="' + path.id + '" data-stage="' + index + '">加岗位</button>' +
        '<button type="button" class="lb-stage__del" data-rm-stage="' + path.id + '" data-stage="' + index + '" title="删除本级">删除</button>' +
        "</span>"
      : "";
    return (
      '<div class="lb-stage' + (picking.pathId === path.id && picking.stage === index ? " is-picking" : "") + '" data-path="' + path.id + '" data-stage="' + index + '">' +
      '<div class="lb-stage__hd"><span class="lb-stage__no">' + (index + 1) + '</span><b>' + esc(stage.name || "第 " + (index + 1) + " 级") + "</b>" +
      '<em class="lb-stage__cnt">' + (stage.postIds || []).length + " 个岗位</em>" + tools + "</div>" +
      '<div class="lb-stage__body">' + (posts || empty) + "</div>" +
      "</div>"
    );
  }

  function esc(s) {
    return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  function renderChain(path) {
    var stages = path.stages || [];
    if (!stages.length) {
      return '<div class="lb-chain"><span style="color:rgba(0,0,0,.45)">' + (canEdit() ? "点下方岗位卡片加入本路线" : "这条路线还没有岗位") + "</span></div>";
    }
    return (
      '<div class="lb-chain lb-chain--stages" data-chain="' + path.id + '">' +
      stages.map(function (stage, index) { return renderStage(path, stage, index); }).join('<span class="lb-chain-arrow">→</span>') +
      "</div>"
    );
  }

  function renderRoutes() {
    var list = teamPaths();
    qs("route-box").innerHTML =
      list.length
        ? list
            .map(function (path) {
              return (
                '<article class="lb-route" data-route="' +
                path.id +
                '"><div class="lb-route__head">' +
                '<input class="lb-input" data-rename="' +
                path.id +
                '" value="' +
                esc(path.name) +
                '"' +
                (canEdit() ? "" : " readonly") +
                ">" +
                (canEdit()
                  ? '<button type="button" class="lb-btn" data-del="' + path.id + '">删除</button>'
                  : "") +
                "</div>" +
                renderChain(path) +
                renderWall(path) +
                "</article>"
              );
            })
            .join("")
        : '<p style="color:rgba(0,0,0,.45)">还没有路线。</p>';
    var state = document.getElementById("path-state");
    if (!state) {
      state = document.createElement("span");
      state.id = "path-state";
      state.className = "lb-ver";
      qs("btn-add-path").parentNode.insertBefore(state, qs("btn-add-path"));
    }
    state.textContent = canEdit() ? "编辑中" : "已保存，不可编辑";
  }

  function findPath(id) {
    return draft.filter(function (p) {
      return p.id === id;
    })[0];
  }

  renderTeams();
  renderRoutes();

  qs("team-list").addEventListener("click", function (e) {
    var b = e.target.closest("[data-team]");
    if (!b) return;
    team = b.getAttribute("data-team");
    renderTeams();
    renderRoutes();
  });

  qs("btn-add-path").addEventListener("click", function () {
    if (blockIfCamp()) return;
    editing = true;
    draft.push({
      id: "path-" + Date.now(),
      team: team,
      name: "未命名路线",
      stages: [{ name: "第 1 级", postIds: [] }]
    });
    renderRoutes();
  });

  qs("btn-save").addEventListener("click", function () {
    if (blockIfCamp()) return;
    window.LB_PATHS = JSON.parse(JSON.stringify(draft));
    editing = false;
    renderRoutes();
    window.LB.toast("已保存，当前不可编辑");
  });

  qs("route-box").addEventListener("click", function (e) {
    /* 加岗位：优先放进刚点「加岗位」的那一级，否则放最后一级 */
    var add = e.target.closest("[data-add]");
    if (add) {
      e.preventDefault();
      if (!canEdit()) return;
      var path = findPath(add.getAttribute("data-path"));
      if (!path) return;
      var postId = add.getAttribute("data-add");
      if (!path.stages) path.stages = [];
      if (!path.stages.length) path.stages.push({ name: "第 1 级", postIds: [] });
      var target = picking.pathId === path.id && picking.stage >= 0 && picking.stage < path.stages.length
        ? picking.stage
        : path.stages.length - 1;
      if (path.stages[target].postIds.indexOf(postId) < 0) path.stages[target].postIds.push(postId);
      picking = { pathId: "", stage: -1 };
      renderRoutes();
      return;
    }
    /* 指定某一级准备加岗位 */
    var pickStage = e.target.closest("[data-pick-stage]");
    if (pickStage) {
      if (!canEdit()) return;
      picking = { pathId: pickStage.getAttribute("data-pick-stage"), stage: Number(pickStage.getAttribute("data-stage")) };
      renderRoutes();
      return;
    }
    /* 移除岗位 */
    var rm = e.target.closest("[data-rm]");
    if (rm) {
      if (!canEdit()) return;
      var p2 = findPath(rm.getAttribute("data-rm"));
      if (!p2) return;
      var si = Number(rm.getAttribute("data-stage"));
      var post = rm.getAttribute("data-post");
      var stage = (p2.stages || [])[si];
      if (!stage) return;
      stage.postIds = stage.postIds.filter(function (id) { return id !== post; });
      renderRoutes();
      return;
    }
    /* 新增一级 */
    var addStage = e.target.closest("[data-add-stage]");
    if (addStage) {
      if (!canEdit()) return;
      var p3 = findPath(addStage.getAttribute("data-add-stage"));
      if (!p3) return;
      if (!p3.stages) p3.stages = [];
      p3.stages.push({ name: "第 " + (p3.stages.length + 1) + " 级", postIds: [] });
      renderRoutes();
      return;
    }
    /* 删除一级 */
    var rmStage = e.target.closest("[data-rm-stage]");
    if (rmStage) {
      if (!canEdit()) return;
      var p4 = findPath(rmStage.getAttribute("data-rm-stage"));
      if (!p4) return;
      p4.stages.splice(Number(rmStage.getAttribute("data-stage")), 1);
      renderRoutes();
      return;
    }
    var del = e.target.closest("[data-del]");
    if (del) {
      if (!canEdit()) return;
      window.LB.confirm("删除后，路线上的岗位会回到可选岗位。确定删除？", function () {
        draft = draft.filter(function (p) {
          return p.id !== del.getAttribute("data-del");
        });
        renderRoutes();
      });
    }
  });

  qs("route-box").addEventListener("change", function (e) {
    var input = e.target.closest("[data-rename]");
    if (!input || !canEdit()) return;
    var path = findPath(input.getAttribute("data-rename"));
    if (path) path.name = input.value;
  });

  /* 拖动只在同一级内排序；跨级用点击加岗位。 */
  qs("route-box").addEventListener("dragstart", function (e) {
    var chip = e.target.closest(".lb-chip");
    if (!chip || !canEdit()) return;
    drag.pathId = chip.getAttribute("data-path");
    drag.fromStage = Number(chip.getAttribute("data-stage"));
    drag.postId = chip.getAttribute("data-post");
    e.dataTransfer.effectAllowed = "move";
  });

  qs("route-box").addEventListener("dragover", function (e) {
    if (e.target.closest(".lb-chip")) e.preventDefault();
  });

  qs("route-box").addEventListener("drop", function (e) {
    var chip = e.target.closest(".lb-chip");
    if (!chip || !canEdit()) return;
    e.preventDefault();
    var pathId = chip.getAttribute("data-path");
    if (pathId !== drag.pathId) return;
    var toStage = Number(chip.getAttribute("data-stage"));
    if (toStage !== drag.fromStage) return;
    var path = findPath(pathId);
    if (!path || drag.fromStage < 0) return;
    var stage = path.stages[drag.fromStage];
    if (!stage) return;
    var from = stage.postIds.indexOf(drag.postId);
    var to = stage.postIds.indexOf(chip.getAttribute("data-post"));
    if (from < 0 || to < 0 || from === to) return;
    var moved = stage.postIds.splice(from, 1)[0];
    stage.postIds.splice(to, 0, moved);
    drag = { pathId: "", fromStage: -1, postId: "" };
    renderRoutes();
  });
})();
