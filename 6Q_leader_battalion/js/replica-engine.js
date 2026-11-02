/**
 * v3.4.0 复刻引擎：按目录渲染筛选、按钮、表格、抽屉。
 */
(function () {
  "use strict";

  var PEOPLE = [
    { name: "林晓雯", id: "LXW8821", phone: "13800001101", gender: "女", age: 28, avatar: "林", team: "助教团", post: "助教团长" },
    { name: "陈启航", id: "CQH7601", phone: "13500009840", gender: "男", age: 40, avatar: "", team: "导师团", post: "导师" },
    { name: "王敏", id: "WM8EELU", phone: "13328491201", gender: "女", age: 32, avatar: "王", team: "统筹办", post: "统筹办成员" },
    { name: "赵欣然", id: "S6MULM1", phone: "13411782552", gender: "女", age: 19, avatar: "", team: "助教团", post: "助教" },
    { name: "刘洋", id: "LY20414", phone: "18664520414", gender: "男", age: 35, avatar: "", team: "导师团", post: "导师团长" },
    { name: "黄志远", id: "V1MHF63", phone: "17710135773", gender: "女", age: 28, avatar: "黄", team: "后勤团", post: "后勤团长" },
    { name: "吴彤", id: "3N2006", phone: "13249806762", gender: "女", age: 37, avatar: "", team: "助教团", post: "助教副团" },
    { name: "郑海", id: "ZH4800", phone: "13768001011", gender: "男", age: 45, avatar: "", team: "统筹办", post: "统筹办副主任" },
    { name: "孙悦", id: "GF32KT7", phone: "13428256979", gender: "男", age: 22, avatar: "", team: "助教团", post: "助教" },
    { name: "马丽", id: "GDZE232", phone: "18800092924", gender: "女", age: 31, avatar: "马", team: "导师团", post: "导师" },
    { name: "何俊", id: "HJ2988", phone: "15900029888", gender: "男", age: 29, avatar: "", team: "统筹办", post: "统筹办成员" },
    { name: "李薇", id: "LW6610", phone: "13600006610", gender: "女", age: 33, avatar: "李", team: "助教团", post: "助教团长" }
  ];

  var PENDING_LEAVE = {
    "刘中良": { kind: "因私请假", status: "审批中" },
    "赵欣然": { kind: "疑异处理", status: "审批中" },
    "孙悦": { kind: "生病请假", status: "请假中" },
    "刘洋": { kind: "因私请假", status: "审批中" }
  };

  var pageId = document.body.getAttribute("data-lb-page") || "";
  if (!pageId) {
    var q = new URLSearchParams(location.search);
    pageId = q.get("p") || "talent-pool";
    document.body.setAttribute("data-lb-page", pageId);
  }
  if (pageId === "camp-timetable" && document.title.indexOf("营地时间表") >= 0) {
    /* keep */
  }

  var spec = (window.LB_PAGES || {})[pageId];
  var mount = document.getElementById("lb-replica");
  if (!spec || !mount) return;

  var titleLine = pageId === "mentor-lesson-archive" ? "高EQ导师管理" : pageId === "camp-manage" ? "计划与实施" : "领袖营薪酬板块";
  document.title = spec.title + " · " + titleLine;

  var SURVEY_PLANS = [
    { name: "2027年寒假领袖营【广东基地B】", weeks: ["第一周", "第二周"] },
    { name: "2027年寒假领袖营【华东基地D】", weeks: ["第一周"] },
    { name: "2027年寒假领袖营【广东基地C】", weeks: ["第一周", "第二周"] },
    { name: "2027年寒假领袖营【广东基地A】", weeks: ["第一周"] },
    { name: "2026年国庆领袖营（国庆班）", weeks: ["第一周"] },
    { name: "2026年暑假领袖营【华东基地-湖州】", weeks: ["第六周"] },
    { name: "2026年暑假领袖营【广东基地A】", weeks: ["第一周", "第二周", "第三周"] },
    { name: "2026年暑假领袖营【广东基地B】", weeks: ["第一周", "第二周"] }
  ];

  var SURVEY_PAPERS = [
    { id: "1", title: "导师互评问卷", type: "互评/他评", target: "导师", surveyor: "导师", remark: "同组导师互相评价" },
    { id: "2", title: "导学师自评问卷", type: "自评/总结问卷", target: "导学师", surveyor: "导学师", remark: "周营结束自评" },
    { id: "3", title: "学员满意度问卷", type: "学员问卷", target: "导师", surveyor: "学员", remark: "学员对班级导师的评价" },
    { id: "4", title: "家长反馈问卷", type: "家长问卷", target: "家长", surveyor: "家长", remark: "家长对营期整体反馈" },
    { id: "5", title: "督导评价问卷", type: "督评问卷", target: "导师", surveyor: "督导", remark: "督导对导师带班评价" },
    { id: "6", title: "助教互评问卷", type: "互评/他评", target: "助教", surveyor: "助教", remark: "助教组内互评" }
  ];
  var exportPick = {};

  var state = {
    left: "all",
    planIndex: 5,
    page: 1,
    pageSize: 10,
    rows: [],
    filtered: [],
    selected: {},
    moreOpen: ""
  };

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function pick(arr, i) {
    return arr[i % arr.length];
  }

  function mockValue(col, person, i) {
    var k = col.k;
    var name = person.name;
    if (k === "avatar") return person.avatar;
    if (k === "name" || k === "target" || k === "filler" || k === "registrar" || k === "starter") return name;
    if (k === "id" || k === "sid" || k === "rid" || k === "pid" || k === "eid" || k === "registrarId" || k === "classId" || k === "tplId" || k === "payId" || k === "billId" || k === "billNo") return person.id;
    if (k === "phone") return person.phone;
    if (k === "gender") return person.gender;
    if (k === "age") return person.age;
    if (k === "type") return i % 3 ? "全职" : "非全职";
    if (k === "team") return person.team;
    if (k === "post") return person.post;
    if (k === "city") return ["广东省广州市", "广东省深圳市", "-", "湖南省长沙市"][i % 4];
    if (k === "settle") return i % 4 ? "参与" : "不参与";
    if (k === "bonus") return i % 3 ? "是" : "否";
    if (k === "times") return 2 + (i % 9);
    if (k === "status") {
      var so = (spec.filters || []).filter(function (f) { return f.k === "status" && f.o; })[0];
      return so ? pick(so.o, i) : pick(["启用", "禁用"], i);
    }
    if (k === "updated") return "2026-09-1" + (i % 8 + 1) + " 12:13:0" + (i % 6);
    if (k === "created") return "2026-06-0" + (i % 8 + 1) + " 09:20:11";
    if (k === "plan") return pick(window.LB_PAGE_CONST.plans, i);
    if (k === "week") return pick(["第一周", "第二周", "第三周"], i);
    if (k === "klass") return pick(["A1班", "A2班", "B1班"], i);
    if (k === "group") return pick(["1组", "2组", "3组"], i);
    if (k === "planWeek" || k === "postTeam" || k === "classGroup") {
      if (k === "postTeam") return person.post + " / " + person.team;
      if (k === "planWeek") return pick(window.LB_PAGE_CONST.plans, i) + " / 第二周";
      return pick(["A1班", "A2班"], i) + " / " + pick(["1组", "2组"], i);
    }
    if (k === "attStatus") return pick(["考勤中", "待确认", "已确认", "已同步"], i);
    if (k === "posStatus") return i === 3 ? "中途离营" : "正常";
    if (k === "appr") return person.team;
    if (k === "payDays" || k === "realDays") return (6 + (i % 3)) + "天";
    if (k === "adj" || k === "increase" || k === "leave" || k === "doubt" || k === "early" || k === "cont") return (i % 3) + "天";
    if (k === "sick") return (i % 2) + "天/-0.6天";
    if (k === "level") return pick(["6", "6+", "6++"], i);
    if (k === "score" || k === "total" || k === "perf" || k === "self" || k === "sat" || k === "peer" || k === "supScore" || k === "safeScore") return 80 + (i % 18);
    if (k === "payable" || k === "real" || k === "base" || k === "amount" || k === "realAmt") return "￥" + (3200 + i * 120);
    if (k === "tax" || k === "taxExpect" || k === "taxReal") return "￥" + (80 + i * 8);
    if (col.t === "stack") return "";
    return pick(["—", "正常", "已完成", "余炜烽"], i);
  }

  function lampTone(value) {
    if (value === "红") return "red";
    if (value === "黄") return "yellow";
    return "white";
  }

  function lampCell(row) {
    var hist = (row.lampLog || []).length;
    return (
      '<span class="lb-lamp-field"><i class="lb-lamp lb-lamp--' +
      lampTone(row.lamp) +
      '"></i><select class="lb-select lb-lamp-select" data-lamp="1" data-row="' +
      esc(row._id) +
      '">' +
      ["红", "黄", "白"]
        .map(function (color) {
          return "<option" + (color === row.lamp ? " selected" : "") + ">" + color + "</option>";
        })
        .join("") +
      "</select>" +
      '<button type="button" class="lb-link-btn lb-lamp-log" data-act="saLampLog" data-row="' + esc(row._id) + '">历史' + (hist ? "(" + hist + ")" : "") + "</button></span>"
    );
  }

  function studyItem(plan, week, qcamp, sid, name, buyer, family, source, time, product, status) {
    return {
      plan: plan,
      week: week,
      qcamp: qcamp,
      sid: sid,
      name: name,
      buyer: buyer,
      family: family,
      source: source,
      time: time,
      product: product,
      status: status
    };
  }

  function studentArchiveRows() {
    var buyer = function (name, phone, relation, id) {
      return "姓名：" + name + "\n电话：" + phone + "\n关系：" + relation + "\nID：" + id;
    };
    var one = function (plan, week, sid, name, who, family, source, time, product) {
      return studyItem(plan, week, "青少年6Q领袖营", sid, name, who, family, source, time, product, "已核销");
    };
    var list = [
      { sid: "TBK32", name: "夏钟畅", avatar: "夏", klass: "AQ小1班", gender: "男", phone: "15705115316", area: "杭州市", birthday: "2014-02-20", age: 12, health: "健康", city: "浙江省-杭州市-滨江区", mother: "刘琴", motherMobile: "13819142672", motherPhone: "13819142672", father: "夏占勇", fatherReg: "13777438161", fatherPhone: "13777438161", superior: ["吴敏", "18857126801"], lamp: "黄" },
      { sid: "2K8HH4", name: "郑煜馨", avatar: "郑", klass: "AQ小1班", gender: "女", phone: "13757778012", area: "温州市", birthday: "2017-08-29", age: 9, health: "健康", city: "浙江省-温州市-乐清市", mother: "陈小英", motherMobile: "13757778012", motherPhone: "13757778012", father: "—", fatherReg: "—", fatherPhone: "—", superior: ["吴中仁", "18602114990"], lamp: "白" },
      { sid: "HXH4K", name: "郑陈衍", avatar: "郑", klass: "AQ小1班", gender: "男", phone: "13757778012", area: "温州市", birthday: "2015-05-26", age: 11, health: "健康", city: "浙江省-温州市-鹿城区", mother: "陈小关", motherMobile: "13757778012", motherPhone: "13757778012", father: "—", fatherReg: "—", fatherPhone: "—", superior: ["吴中仁", "18602114990"], lamp: "白" },
      { sid: "9BHKDD", name: "丁梦瑶", avatar: "丁", klass: "AQ小1班", gender: "女", phone: "13776021297", area: "常州市", birthday: "2017-06-22", age: 9, health: "健康", city: "江苏省-苏州市-虎丘区", mother: "张宝林", motherMobile: "13776021297", motherPhone: "13776021297", father: "—", fatherReg: "—", fatherPhone: "—", superior: ["李春花", "13014444133"], lamp: "红" },
      { sid: "8YN5SL", name: "张书源", avatar: "张", klass: "AQ小1班", gender: "男", phone: "18655792666", area: "温州市", birthday: "2016-09-09", age: 10, health: "健康", city: "浙江省-温州市-乐清市", mother: "王荣艳", motherMobile: "13738897727", motherPhone: "13738897727", father: "张仕迪", fatherReg: "—", fatherPhone: "13736386666", superior: ["孙梅萍", "18368710621"], lamp: "白" },
      { sid: "8P1CKX", name: "王艺萱", avatar: "王", klass: "AQ小1班", gender: "女", phone: "18505816233", area: "郑州市", birthday: "2015-08-16", age: 11, health: "过敏", city: "河南省-郑州市-管城区", mother: "梁东阳", motherMobile: "18299957633", motherPhone: "18299957633", father: "无", fatherReg: "—", fatherPhone: "无", superior: ["郭瑞", "13157118333"], lamp: "黄" },
      { sid: "045OUJ", name: "叶绿颖", avatar: "叶", klass: "AQ小1班", gender: "女", phone: "13870527845", area: "宜春市", birthday: "2014-12-01", age: 12, health: "健康", city: "江西省-宜春市-袁州区", mother: "—", motherMobile: "—", motherPhone: "—", father: "叶正义", fatherReg: "—", fatherPhone: "13014480372", superior: ["王峰", "15879537956"], lamp: "白" },
      { sid: "N1HWTP", name: "张梓杨", avatar: "张", klass: "AQ小1班", gender: "男", phone: "19079516265", area: "宜春市", birthday: "2016-04-22", age: 10, health: "健康", city: "江西省-宜春市-樟树县", mother: "—", motherMobile: "—", motherPhone: "—", father: "张丽清", fatherReg: "—", fatherPhone: "—", superior: ["王峰", "15879537956"], lamp: "白" },
      { sid: "5A7W3D", name: "孙沐宸", avatar: "孙", klass: "AQ小1班", gender: "男", phone: "15162644921", area: "上海市", birthday: "2017-08-28", age: 9, health: "过敏", city: "上海市-徐汇区", mother: "叶亚辉", motherMobile: "15080370816", motherPhone: "15080370816", father: "—", fatherReg: "13162644921", fatherPhone: "13162644921", superior: ["栾莉莉", "13564975397"], lamp: "红" },
      { sid: "3Z09L0", name: "廖义诚", avatar: "廖", klass: "AQ小1班", gender: "男", phone: "15158177799", area: "杭州市", birthday: "2016-09-23", age: 10, health: "健康", city: "浙江省-杭州市-上城区", mother: "—", motherMobile: "—", motherPhone: "—", father: "伊公子", fatherReg: "15158177799", fatherPhone: "15158177799", superior: ["楼娉萍", "13588750074"], lamp: "白" }
    ];
    list[0].study = [one("2026暑假广州第二期", "第二周", "TBK32", "夏钟畅", buyer("刘琴", "13819142672", "妈妈", "FLJ85"), "3663", "扫码报读", "2026-07-01 11:44:59", "BY1979751106037678081092")];
    list[0].benchmarks = [{ plan: "2026暑假广州第二期", week: "第二周", klass: "AQ小1班", story: "营中主动带动小组分享" }];
    list[0].emotions = [{ plan: "2026暑假广州第二期", week: "第二周", klass: "AQ小1班", who: "余炜烽", post: "情绪陪伴老师", issue: "开营当晚想家，晚饭后哭了十几分钟", times: 1, time: "2026-07-08 21:10" }];
    list[1].study = [
      one("2026暑假广州第二期", "第一周", "2K8HH4", "郑煜馨", buyer("陈小英", "13757778012", "妈妈", "68887"), "2329", "改期报读", "2026-07-02 15:34:58", "BY16640260191881121194308"),
      one("2026暑假广州第一期", "第二周", "2K8HH4", "郑煜馨", buyer("陈小英", "13757778012", "妈妈", "68887"), "2329", "正常报读", "2026-07-02 15:33:08", "BY1664026019187306498675")
    ];
    list[1].emotions = [{ plan: "2026暑假广州第二期", week: "第一周", klass: "AQ小1班", who: "陈可", post: "情绪陪伴老师", issue: "分组时不愿进组，一个人站在教室门口", times: 2, time: "2026-07-02 19:20" }];
    list[8].study = [one("2026寒假深圳第一期", "第一周", "5A7W3D", "孙沐宸", buyer("叶亚辉", "15080370816", "妈妈", "151626"), "3591", "候补", "2026-06-11 15:12:05", "6QLXY2110394574")];
    return list.map(function (item) {
      item._id = "stu-" + item.sid;
      item.role = item.gender === "女" ? "女儿" : "儿子";
      if (!item.study) item.study = [];
      return item;
    });
  }

  /* 原型评审第二轮第6条：学员档案
     1) 去掉所在地区，留居住地。
     2) 手机类只留「学员联系电话」，父母手机 / 注册电话都去掉，父母姓名保留。
     3) 去掉家庭角色、健康状况、班级。
     4) 筛选改为 学员ID / 学员姓名 / 性别 + 红黄白。
     5) 创建档案改为「选中会员创建档案」：先从会员库选人，再补档案字段。
     6) 每次改红黄白必须填理由，理由连填写人一起进历史，可追溯。 */
  /* 会员库：选择6q会员弹窗的数据源。弹窗与现网一致，只有编号 / 姓名 / 手机号三列，
     选中确定后再把性别、居住地、出生日期、年龄带进建档表单。
     其中 TBK32 夏钟畅、9BHKDD 丁梦瑶 已有学员档案，用来验证重复建档的拦截。 */
  var SA_MEMBERS = [
    { sid: "GDURPN", name: "郑嘉佑", gender: "男", phone: "13802145678", city: "浙江省-杭州市-西湖区", birthday: "2015-03-18", age: 11, father: "郑志强", mother: "李丽华" },
    { sid: "DU8HB6", name: "陈思睿", gender: "男", phone: "13502917463", city: "广东省-广州市-天河区", birthday: "2014-11-02", age: 12, father: "陈建国", mother: "王秀英" },
    { sid: "23Y44K", name: "林语晨", gender: "女", phone: "13611802745", city: "上海市-浦东新区", birthday: "2016-01-09", age: 10, father: "林伟明", mother: "张慧敏" },
    { sid: "4CZ7JH", name: "林嘉睿", gender: "男", phone: "15869322336", city: "广东省-深圳市-南山区", birthday: "2015-07-21", age: 11, father: "林海涛", mother: "刘雅琴" },
    { sid: "6BIBCD", name: "杨烨", gender: "女", phone: "18248188235", city: "广东省-佛山市-禅城区", birthday: "2013-12-30", age: 12, father: "杨俊杰", mother: "陈月娥" },
    { sid: "C7NG3Q", name: "周宸", gender: "男", phone: "15305022066", city: "福建省-厦门市-思明区", birthday: "2016-05-14", age: 10, father: "周文斌", mother: "杨淑芬" },
    { sid: "1MUWJ7", name: "王若彤", gender: "女", phone: "13122098746", city: "江苏省-南京市-鼓楼区", birthday: "2015-09-03", age: 11, father: "王立军", mother: "黄晓燕" },
    { sid: "L5QOA4", name: "苏亦辰", gender: "男", phone: "13761234509", city: "江苏省-苏州市-工业园区", birthday: "2014-04-27", age: 12, father: "苏国强", mother: "周美玲" },
    { sid: "B2MQD5", name: "何雨桐", gender: "女", phone: "18602347811", city: "重庆市-渝北区", birthday: "2016-08-12", age: 10, father: "何振华", mother: "吴婷婷" },
    { sid: "NRT5LF", name: "丁丁", gender: "女", phone: "13728622776", city: "广东省-深圳市-福田区", birthday: "2015-02-25", age: 11, father: "丁永康", mother: "徐雪梅" },
    { sid: "TBK32", name: "夏钟畅", gender: "男", phone: "15705115316", city: "浙江省-杭州市-滨江区", birthday: "2014-02-20", age: 12, father: "夏学军", mother: "孙红梅" },
    { sid: "9BHKDD", name: "丁梦瑶", gender: "女", phone: "13776021297", city: "江苏省-苏州市-虎丘区", birthday: "2017-06-22", age: 9, father: "丁德明", mother: "马文静" },
    { sid: "W3K9PA", name: "陈知远", gender: "男", phone: "13501234567", city: "湖南省-长沙市-岳麓区", birthday: "2015-10-08", age: 11, father: "陈家豪", mother: "朱巧玲" },
    { sid: "Q8M2XZ", name: "吴若曦", gender: "女", phone: "13612345678", city: "湖北省-武汉市-武昌区", birthday: "2016-03-16", age: 10, father: "吴锦荣", mother: "胡海燕" },
    { sid: "HJ4T7C", name: "黄一诺", gender: "女", phone: "13723456789", city: "河南省-郑州市-金水区", birthday: "2015-06-05", age: 11, father: "黄宏远", mother: "郭佳怡" },
    { sid: "P2L9BN", name: "许清和", gender: "男", phone: "13834567890", city: "安徽省-合肥市-蜀山区", birthday: "2014-09-19", age: 12, father: "许少华", mother: "高梦洁" },
    { sid: "R7D3FK", name: "罗子谦", gender: "男", phone: "13945678901", city: "四川省-成都市-武侯区", birthday: "2016-11-28", age: 10, father: "罗明辉", mother: "邓素芳" },
    { sid: "T5V8QS", name: "谢语桐", gender: "女", phone: "15056789012", city: "云南省-昆明市-五华区", birthday: "2015-04-11", age: 11, father: "谢瑞祥", mother: "梁玉兰" },
    { sid: "U9J2MW", name: "曾令仪", gender: "女", phone: "15167890123", city: "江西省-南昌市-东湖区", birthday: "2016-07-07", age: 10, father: "曾世杰", mother: "宋春梅" },
    { sid: "V4N6HY", name: "邓皓轩", gender: "男", phone: "15278901234", city: "福建省-福州市-鼓楼区", birthday: "2015-01-23", age: 11, father: "邓春生", mother: "唐爱华" },
    { sid: "X1B8CP", name: "冯思远", gender: "男", phone: "15389012345", city: "天津市-和平区", birthday: "2014-06-14", age: 12, father: "冯永强", mother: "肖小燕" },
    { sid: "Y6G3ZT", name: "韩欣妍", gender: "女", phone: "15590123456", city: "辽宁省-沈阳市-和平区", birthday: "2016-10-02", age: 10, father: "韩开明", mother: "邓丽娟" },
    { sid: "Z2K7LR", name: "蒋亦辰", gender: "男", phone: "15601234567", city: "陕西省-西安市-雁塔区", birthday: "2015-05-30", age: 11, father: "蒋云峰", mother: "曹晓红" },
    { sid: "A8F5MD", name: "孔舒宁", gender: "女", phone: "15712345678", city: "山东省-济南市-历下区", birthday: "2016-12-09", age: 10, father: "孔天宇", mother: "彭静怡" },
    { sid: "C3P9XW", name: "梁书宁", gender: "女", phone: "15823456789", city: "山东省-青岛市-崂山区", birthday: "2015-08-21", age: 11, father: "梁子豪", mother: "曾思颖" },
    { sid: "E7R2JN", name: "马亦舒", gender: "女", phone: "15934567890", city: "辽宁省-大连市-中山区", birthday: "2014-12-17", age: 12, father: "马承志", mother: "肖宛婷" }
  ];
  var saPickMember = "";
  var saReasonTarget = "";
  /* 选择6q会员弹窗的临时状态：page 当前页、size 每页条数、tmp 弹窗里勾选的会员、q 三个查询条件。 */
  var saPick = { page: 1, size: 10, tmp: "", q: { sid: "", name: "", phone: "" } };

  function saMemberOf(sid) {
    return SA_MEMBERS.filter(function (m) { return m.sid === sid; })[0] || null;
  }

  function saPickerList() {
    return SA_MEMBERS.filter(function (m) {
      var q = saPick.q;
      if (q.sid && String(m.sid).toUpperCase().indexOf(q.sid.toUpperCase()) < 0) return false;
      if (q.name && String(m.name).indexOf(q.name) < 0) return false;
      if (q.phone && String(m.phone || "").indexOf(q.phone) < 0) return false;
      return true;
    });
  }

  /* 选择6q会员：查询区（编号 / 姓名 / 手机号）+ 三列表格 + 分页 + 取消 / 确定。 */
  function saPickerHtml() {
    var list = saPickerList();
    var size = saPick.size || 10;
    var total = list.length;
    var pages = Math.max(1, Math.ceil(total / size));
    if (saPick.page > pages) saPick.page = pages;
    if (saPick.page < 1) saPick.page = 1;
    var start = (saPick.page - 1) * size;
    var view = list.slice(start, start + size);

    var html = '<div class="sa-modal__card">';
    html += '<div class="sa-modal__head"><h3>选择6q会员</h3><button type="button" class="sa-modal__x" data-act="saPickCancel" aria-label="关闭">×</button></div>';
    html += '<div class="sa-q">';
    html += '<label class="sa-q__item"><span>编号</span><input class="lb-input" data-sa-q="sid" value="' + esc(saPick.q.sid) + '" placeholder="请输入编号" /></label>';
    html += '<label class="sa-q__item"><span>姓名</span><input class="lb-input" data-sa-q="name" value="' + esc(saPick.q.name) + '" placeholder="请输入姓名" /></label>';
    html += '<label class="sa-q__item"><span>手机号</span><input class="lb-input" data-sa-q="phone" value="' + esc(saPick.q.phone) + '" placeholder="请输入手机号" /></label>';
    html += '<span class="sa-q__btns"><button type="button" class="lb-btn lb-btn--primary" data-act="saPickQuery">查询</button><button type="button" class="lb-btn" data-act="saPickReset">重置</button></span>';
    html += "</div>";

    html += '<div class="sa-modal__body"><table class="sa-table"><thead><tr><th>编号</th><th>姓名</th><th>手机号</th></tr></thead><tbody>';
    if (!view.length) {
      html += '<tr><td class="sa-table__empty" colspan="3">没有匹配的会员</td></tr>';
    }
    view.forEach(function (m) {
      html += '<tr class="sa-row' + (saPick.tmp === m.sid ? " is-on" : "") + '" data-act="saPickRow" data-menu="' + esc(m.sid) + '">';
      html += "<td>" + esc(m.sid) + "</td><td>" + esc(m.name) + '</td><td>' + esc(m.phone || "") + "</td></tr>";
    });
    html += "</tbody></table></div>";

    html += '<div class="sa-pager"><span class="sa-pager__total">共 ' + total + " 条记录</span>";
    html += '<span class="sa-pager__pages">';
    html += '<button type="button" class="sa-page" data-act="saPickPage" data-menu="-1"' + (saPick.page <= 1 ? " disabled" : "") + ">‹</button>";
    for (var i = 1; i <= pages; i++) {
      if (pages > 7 && i > 3 && i < pages - 1 && Math.abs(i - saPick.page) > 1) {
        if (i === 4) html += '<span class="sa-page__dots">…</span>';
        continue;
      }
      html += '<button type="button" class="sa-page' + (i === saPick.page ? " is-on" : "") + '" data-act="saPickPage" data-menu="' + i + '">' + i + "</button>";
    }
    html += '<button type="button" class="sa-page" data-act="saPickPage" data-menu="0"' + (saPick.page >= pages ? " disabled" : "") + ">›</button>";
    html += "</span>";
    html += '<select class="sa-size" id="sa-size">' + [10, 20, 50].map(function (n) {
      return '<option value="' + n + '"' + (n === size ? " selected" : "") + ">" + n + " 条/页</option>";
    }).join("") + "</select>";
    html += '<span class="sa-jump">跳至<input class="sa-jump__input" id="sa-jump" />页</span>';
    html += "</div>";

    html += '<div class="sa-modal__foot"><button type="button" class="lb-btn" data-act="saPickCancel">取消</button><button type="button" class="lb-btn lb-btn--primary" data-act="saPickOk"' + (saPick.tmp ? "" : " disabled") + ">确定</button></div>";
    return html + "</div>";
  }

  function saPickerRender() {
    var box = document.getElementById("sa-picker");
    if (box) box.innerHTML = saPickerHtml();
  }

  function openSaPicker() {
    var box = document.getElementById("sa-picker");
    if (!box) {
      box = document.createElement("div");
      box.id = "sa-picker";
      box.className = "sa-modal";
      document.body.appendChild(box);
      box.addEventListener("mousedown", function (e) { if (e.target === box) closeSaPicker(); });
      box.addEventListener("change", function (e) {
        if (e.target && e.target.id === "sa-size") {
          saPick.size = parseInt(e.target.value, 10) || 10;
          saPick.page = 1;
          saPickerRender();
        }
      });
      box.addEventListener("keydown", function (e) {
        if (e.key === "Escape") {
          closeSaPicker();
          return;
        }
        if (e.key !== "Enter" || !e.target) return;
        if (e.target.id === "sa-jump") {
          e.preventDefault();
          saPickGo(parseInt(e.target.value, 10));
        } else if (e.target.getAttribute("data-sa-q")) {
          e.preventDefault();
          saPickQuery();
        }
      });
    }
    saPick.page = 1;
    saPick.tmp = saPickMember || "";
    saPick.q = { sid: "", name: "", phone: "" };
    saPick.size = saPick.size || 10;
    box.classList.add("is-open");
    saPickerRender();
  }

  function closeSaPicker() {
    var box = document.getElementById("sa-picker");
    if (box) box.classList.remove("is-open");
  }

  function saPickQuery() {
    var read = function (k) {
      var el = document.querySelector('[data-sa-q="' + k + '"]');
      return el ? String(el.value || "").trim() : "";
    };
    saPick.q = { sid: read("sid"), name: read("name"), phone: read("phone") };
    saPick.page = 1;
    saPickerRender();
  }

  function saPickReset() {
    saPick.q = { sid: "", name: "", phone: "" };
    saPick.page = 1;
    saPickerRender();
  }

  function saPickGo(page) {
    var total = saPickerList().length;
    var pages = Math.max(1, Math.ceil(total / (saPick.size || 10)));
    if (!page || page < 1 || page > pages) {
      window.LB.toast("请输入 1 - " + pages + " 之间的页码");
      return;
    }
    saPick.page = page;
    saPickerRender();
  }

  function saPickPage(menu) {
    var total = saPickerList().length;
    var pages = Math.max(1, Math.ceil(total / (saPick.size || 10)));
    if (menu === "-1") saPick.page = Math.max(1, saPick.page - 1);
    else if (menu === "0") saPick.page = Math.min(pages, saPick.page + 1);
    else saPick.page = parseInt(menu, 10) || 1;
    saPickerRender();
  }

  /* 点行即选中，只改类名和「确定」可用状态，不整块重渲染，避免列表跳动。 */
  function saPickRowSelect(sid) {
    saPick.tmp = sid || "";
    var box = document.getElementById("sa-picker");
    if (!box) return;
    box.querySelectorAll(".sa-row").forEach(function (tr) {
      tr.classList.toggle("is-on", tr.getAttribute("data-menu") === saPick.tmp);
    });
    var ok = box.querySelector('[data-act="saPickOk"]');
    if (ok) {
      if (saPick.tmp) ok.removeAttribute("disabled");
      else ok.setAttribute("disabled", "disabled");
    }
  }

  function confirmSaPick() {
    if (!saPick.tmp) {
      window.LB.toast("请选择会员");
      return;
    }
    var member = saMemberOf(saPick.tmp);
    if (!member) return;
    saPickMember = member.sid;
    closeSaPicker();
    /* 选中后只更新抽屉里的「已选会员」。联系电话、居住地、出生日期、年龄、父母
       都取系统/会员库既有数据，建档时不再让用户填，也不再往表单回填。 */
    var picked = document.querySelector("[data-sa-picked]");
    if (picked) {
      picked.classList.add("is-on");
      var txt = picked.querySelector(".sa-picked__txt");
      if (txt) txt.textContent = member.name + "（" + member.sid + "）· " + member.gender + " · " + member.phone;
      var open = picked.querySelector('[data-act="saOpenPicker"]');
      if (open) open.textContent = "重新选择";
    }
    window.LB.toast("已选择会员「" + member.name + "」");
  }

  function openStudentCreate() {
    /* 每次新建都从空表单开始，上一次没提交的会员不留在表单里。 */
    saPickMember = "";
    var m = saMemberOf(saPickMember);
    /* 建档只确认两件事：选哪个会员、红黄白初始值。
       其余字段（联系电话、居住地、出生日期、年龄、父母姓名）都在系统与会员库里，
       建档时不再抄一遍，列表直接取既有数据。 */
    var html =
      '<div class="lb-field"><label><i class="lb-req">*</i>从会员库选择会员</label>' +
      '<div class="sa-picked' + (m ? " is-on" : "") + '" data-sa-picked>' +
      '<span class="sa-picked__txt">' + (m ? esc(m.name + "（" + m.sid + "）· " + m.gender + " · " + m.phone) : "未选择会员，点右侧「选择会员」按编号 / 姓名 / 手机号检索") + "</span>" +
      '<button type="button" class="lb-btn" data-act="saOpenPicker">' + (m ? "重新选择" : "选择会员") + "</button>" +
      "</div></div>" +
      '<div class="lb-field"><label>红黄白</label><input class="lb-input" value="白" disabled /></div>' +
      '<p class="lb-hint">只选会员并建档案。学员ID、姓名、性别、联系电话、居住地、出生日期、年龄、父母姓名都取系统与会员库已有数据，不在此重复填写。新建档案默认白，之后按需调整并填理由。</p>' +
      '<div class="lb-drawer-foot"><button type="button" class="lb-btn" data-close-drawer="1">取消</button><button type="button" class="lb-btn lb-btn--primary" data-act="studentArchiveSave">确定</button></div>';
    window.LB.openDrawer("选中会员创建档案", html, { wide: true });
  }

  /* 原型评审第二轮第6条：改红黄白必须填理由，理由连同填写人、时间一起存成历史。 */
  var CURRENT_USER = "余炜烽";
  var saLampPending = null;

  function nowStamp() {
    var d = new Date();
    var p = function (n) { return ("0" + n).slice(-2); };
    return d.getFullYear() + "-" + p(d.getMonth() + 1) + "-" + p(d.getDate()) + " " + p(d.getHours()) + ":" + p(d.getMinutes());
  }

  function openLampReason(ids, to) {
    var rows = state.rows.filter(function (r) { return ids.indexOf(r._id) >= 0; });
    if (!rows.length) return;
    saLampPending = { ids: ids.slice(), to: to };
    var list = rows.map(function (r) {
      return "<div>" + esc(r.name) + "（" + esc(r.sid) + "）：" + esc(r.lamp) + " → " + esc(to) + "</div>";
    }).join("");
    var html =
      '<div class="lb-field"><label>本次调整</label><div class="lb-desc">' + list + "</div></div>" +
      '<div class="lb-field"><label><i class="lb-req">*</i>调整理由</label><textarea class="lb-textarea" id="sa-lamp-reason" maxlength="200" placeholder="请填写调整理由，如：连续两次课堂冲突未处理"></textarea></div>' +
      '<div class="lb-field"><label>填写人</label><input class="lb-input" value="' + esc(CURRENT_USER) + '" disabled /></div>' +
      '<p class="lb-hint">理由必填。提交后写入该学员的红黄白调整历史，可追溯。</p>' +
      '<div class="lb-drawer-foot"><button type="button" class="lb-btn" data-close-drawer="1">取消</button><button type="button" class="lb-btn lb-btn--primary" data-act="saLampConfirm">确定</button></div>';
    window.LB.openDrawer("调整红黄白", html, { wide: true });
  }

  function confirmLampReason() {
    if (!saLampPending) return;
    var box = document.getElementById("sa-lamp-reason");
    var reason = box ? String(box.value || "").trim() : "";
    if (!reason) {
      window.LB.toast("请填写调整理由");
      return;
    }
    var stamp = nowStamp();
    state.rows.forEach(function (row) {
      if (saLampPending.ids.indexOf(row._id) < 0) return;
      if (!row.lampLog) row.lampLog = [];
      row.lampLog.unshift({ from: row.lamp, to: saLampPending.to, reason: reason, who: CURRENT_USER, time: stamp });
      row.lamp = saLampPending.to;
    });
    saLampPending = null;
    window.LB.closeDrawer();
    applyFilter(true);
    window.LB.toast("已调整并记录理由");
  }

  function openLampLog(row) {
    if (!row) return;
    var log = row.lampLog || [];
    var html = '<div class="lb-desc"><div><b>' + esc(row.name) + "</b>（" + esc(row.sid) + "）　当前：" + esc(row.lamp) + "</div></div>";
    if (!log.length) {
      html += '<p class="lb-hint">还没有调整记录。</p>';
    } else {
      html += '<div class="lb-table-wrap"><table class="lb-table"><thead><tr><th>调整时间</th><th>调整前</th><th>调整后</th><th>理由</th><th>填写人</th></tr></thead><tbody>';
      log.forEach(function (item) {
        html += "<tr><td>" + esc(item.time) + "</td><td>" + esc(item.from) + "</td><td>" + esc(item.to) + "</td><td>" + esc(item.reason) + "</td><td>" + esc(item.who) + "</td></tr>";
      });
      html += "</tbody></table></div>";
    }
    html += '<p class="lb-hint">每次改红黄白都要填理由，填写人取当时登录账号。</p>';
    html += '<div class="lb-drawer-foot"><button type="button" class="lb-btn lb-btn--primary" data-close-drawer="1">关闭</button></div>';
    window.LB.openDrawer("红黄白调整历史 · " + row.name, html, { wide: true });
  }

  function saveStudentArchive() {
    /* 建档不再读表单字段。除红黄白外，其余资料一律取会员库已有数据。 */
    var member = SA_MEMBERS.filter(function (m) { return m.sid === saPickMember; })[0];
    if (!member) {
      window.LB.toast("请先从会员库选择会员");
      return;
    }
    var exists = state.rows.filter(function (r) { return r.sid === member.sid; })[0];
    if (exists) {
      window.LB.toast("该会员已有学员档案，不能重复创建");
      return;
    }
    state.rows.unshift({
      _id: "stu-" + member.sid,
      sid: member.sid,
      name: member.name,
      avatar: member.name.slice(0, 1),
      gender: member.gender,
      phone: member.phone,
      birthday: member.birthday,
      age: member.age,
      city: member.city,
      mother: member.mother || "—",
      father: member.father || "—",
      superior: ["—"],
      lamp: "白",
      lampLog: [],
      study: []
    });
    saPickMember = "";
    window.LB.closeDrawer();
    applyFilter();
    window.LB.toast("已根据会员「" + member.name + "」创建档案，红黄白为白");
  }

  function applyBatchLamp() {
    var ids = Object.keys(state.selected).filter(function (id) {
      return state.selected[id];
    });
    if (!ids.length) {
      window.LB.toast("请先勾选学员");
      return;
    }
    var colorEl = document.getElementById("lamp-batch");
    var color = colorEl ? colorEl.value : "白";
    openLampReason(ids, color);
  }

  function closeStudy() {
    var box = document.getElementById("lb-study");
    if (box) box.classList.remove("is-open");
  }

  function openStudy(row) {
    var box = document.getElementById("lb-study");
    if (!box) {
      box = document.createElement("div");
      box.id = "lb-study";
      box.className = "lb-picker";
      document.body.appendChild(box);
    }
    var records = row.study || [];
    var body = records.length
      ? records
          .map(function (item) {
            var buyer = String(item.buyer || "")
              .split("\n")
              .map(function (line) {
                return esc(line);
              })
              .join("<br>");
            return (
              "<tr><td>" +
              esc(item.plan) +
              "</td><td>" +
              esc(item.week) +
              "</td><td>" +
              esc(item.qcamp) +
              "</td><td>" +
              esc(item.sid) +
              "</td><td>" +
              esc(item.name) +
              "</td><td>" +
              buyer +
              "</td><td>" +
              esc(item.family) +
              "</td><td>" +
              esc(item.source) +
              "</td><td>" +
              esc(item.time) +
              "</td><td>" +
              esc(item.product) +
              "</td><td>" +
              esc(item.status) +
              "</td></tr>"
            );
          })
          .join("")
      : '<tr><td colspan="11">暂无报读记录</td></tr>';
    box.innerHTML =
      '<div class="lb-picker__card lb-study-card" role="dialog" aria-label="学习档案">' +
      '<div class="lb-picker__head"><span>学习档案 · ' +
      esc(row.name) +
      '</span><button type="button" class="lb-picker__x" data-act="studyClose">×</button></div>' +
      '<div class="lb-picker__body"><div class="lb-table-wrap"><table class="lb-table lb-study-table"><thead><tr><th>计划</th><th>周营</th><th>Q营</th><th>学员ID</th><th>学员名称</th><th>购买人</th><th>家庭ID</th><th>来源</th><th>报读时间</th><th>产品唯一编号</th><th>核销状态</th></tr></thead><tbody>' +
      body +
      "</tbody></table></div></div>" +
      '<div class="lb-picker__foot"><span>共 ' +
      records.length +
      ' 条报读</span><button type="button" class="lb-btn" data-act="studyClose">关闭</button></div></div>';
    box.classList.add("is-open");
  }

  function openBench(row) {
    var box = document.getElementById("lb-study");
    if (!box) {
      box = document.createElement("div");
      box.id = "lb-study";
      box.className = "lb-picker";
      document.body.appendChild(box);
    }
    var records = row.benchmarks || [];
    var body = records.length
      ? records.map(function (item) {
          return "<tr><td>" + esc(item.plan) + "</td><td>" + esc(item.week) + "</td><td>" + esc(item.klass) + "</td><td>" + esc(item.story) + "</td></tr>";
        }).join("")
      : '<tr><td colspan="4">暂无标杆记录</td></tr>';
    box.innerHTML =
      '<div class="lb-picker__card lb-study-card" role="dialog" aria-label="标杆情况">' +
      '<div class="lb-picker__head"><span>标杆情况 · ' + esc(row.name) + '</span><button type="button" class="lb-picker__x" data-act="studyClose">×</button></div>' +
      '<div class="lb-picker__body"><p class="lb-hint">标杆记在学员档案上，换班级后仍能看到。</p><div class="lb-table-wrap"><table class="lb-table"><thead><tr><th>计划</th><th>周营</th><th>班级</th><th>主要事迹</th></tr></thead><tbody>' +
      body +
      "</tbody></table></div></div>" +
      '<div class="lb-picker__foot"><span>共 ' + records.length + ' 次</span><button type="button" class="lb-btn" data-act="studyClose">关闭</button></div></div>';
    box.classList.add("is-open");
  }

  function openEmotionFollow(row) {
    var box = document.getElementById("lb-study");
    if (!box) {
      box = document.createElement("div");
      box.id = "lb-study";
      box.className = "lb-picker";
      document.body.appendChild(box);
    }
    var records = row.emotions || [];
    var body = records.length
      ? records.map(function (item) {
          return "<tr><td>" + esc(item.plan) + "</td><td>" + esc(item.week) + "</td><td>" + esc(item.klass) + "</td><td>" + esc(item.who) + "</td><td>" + esc(item.post) + "</td><td>" + esc(item.issue) + "</td><td>" + esc(item.times) + "</td><td>" + esc(item.time) + "</td></tr>";
        }).join("")
      : '<tr><td colspan="8">暂无情绪记录</td></tr>';
    box.innerHTML =
      '<div class="lb-picker__card lb-study-card" role="dialog" aria-label="情绪记录">' +
      '<div class="lb-picker__head"><span>情绪记录 · ' + esc(row.name) + '</span><button type="button" class="lb-picker__x" data-act="studyClose">×</button></div>' +
      '<div class="lb-picker__body"><p class="lb-hint">每条登记都带计划和周营，不默认只看当前周营。换班后仍按学员汇总。</p><div class="lb-table-wrap"><table class="lb-table"><thead><tr><th>计划</th><th>周营</th><th>当时班级</th><th>登记人</th><th>岗位</th><th>问题表现</th><th>处理次数</th><th>登记时间</th></tr></thead><tbody>' +
      body +
      "</tbody></table></div></div>" +
      '<div class="lb-picker__foot"><span>共 ' + records.length + ' 条</span><button type="button" class="lb-btn" data-act="studyClose">关闭</button></div></div>';
    box.classList.add("is-open");
  }

  function medicalRows() {
    return [
      { _id: "m1", kind: "发热", ptype: "学员", name: "王小满", klass: "A1班", voucher: "2张", when: "2026-10-18 09:20", note: "体温38.6℃，已服布洛芬", status: "正常", created: "2026-10-18 09:40", creator: "林晓雯" },
      { _id: "m2", kind: "上呼吸道感染", ptype: "学员", name: "李可", klass: "A1班", voucher: "1张", when: "2026-10-18 14:10", note: "咳嗽流涕，对症用药", status: "正常", created: "2026-10-18 14:30", creator: "林晓雯" },
      { _id: "m3", kind: "外伤", ptype: "学员", name: "孙悦", klass: "A2班", voucher: "1张", when: "2026-10-18 16:00", note: "膝盖擦伤，已消毒", status: "正常", created: "2026-10-18 16:20", creator: "苏晚" },
      { _id: "m4", kind: "胃肠道感染", ptype: "工作人员", name: "周宁", klass: "A1班", voucher: "—", when: "2026-10-18 11:30", note: "腹泻，已休息", status: "正常", created: "2026-10-18 11:50", creator: "李正" },
      { _id: "m5", kind: "发热", ptype: "工作人员", name: "韩朔", klass: "B1班", voucher: "1张", when: "2026-10-18 08:10", note: "低热，继续观察", status: "正常", created: "2026-10-18 08:30", creator: "李正" },
      { _id: "m6", kind: "发热", ptype: "学员", name: "赵一", klass: "A1班", voucher: "1张", when: "2026-10-17 20:10", note: "已退热", status: "作废", created: "2026-10-17 20:40", creator: "林晓雯" }
    ];
  }

  function mentorArchiveRows() {
    return [
      { _id: "a1", mid: "14753175", name: "余炜烽", phone: "13800001001", level: "传播天使", area: "广东省广州市", office: "广州运营中心", courseId: "KC10086", course: "情绪管理", realCount: 6, monthRate: 12, virtualCount: 1, totalCount: 7, firstTeach: "2026-07-07 09:00", firstTeachCode: "CC20251016-A1", latestTeach: "CC20251023-A1", updated: "2026-10-18 09:12:00" },
      { _id: "a2", mid: "16680003", name: "林晓雯", phone: "13800001101", level: "一星导师", area: "广东省深圳市", office: "深圳运营中心", courseId: "KC10021", course: "品格课", realCount: 4, monthRate: 0, virtualCount: 0, totalCount: 4, firstTeach: "2026-07-07 14:00", firstTeachCode: "CC20251016-A2", latestTeach: "CC20251023-A2", updated: "2026-10-17 14:20:00" },
      { _id: "a3", mid: "18882155", name: "陈启航", phone: "13900003303", level: "二星导师", area: "广东省广州市", office: "广州运营中心", courseId: "KC10044", course: "晨会", realCount: 8, monthRate: -5, virtualCount: 2, totalCount: 10, firstTeach: "2026-06-01 10:30", firstTeachCode: "CC20250601-B1", latestTeach: "CC20251023-B1", updated: "2026-10-16 11:08:00" },
      { _id: "a4", mid: "17713557", name: "万红", phone: "13700004404", level: "三星导师", area: "湖南省长沙市", office: "长沙运营中心", courseId: "KC10090", course: "主题分享", realCount: 3, monthRate: 8, virtualCount: 0, totalCount: 3, firstTeach: "2026-07-08 15:20", firstTeachCode: "CC20251016-B1", latestTeach: "CC20251016-B1", updated: "2026-10-15 16:40:00" }
    ];
  }

  function mockRows() {
    if (pageId === "mentor-lesson-archive") return mentorArchiveRows();
    if (pageId === "medical-reg") return medicalRows();
    if (pageId === "excellent-honor") return loadHonorApps();
    if (pageId === "student-archive") return studentArchiveRows();
    if (spec.special === "post" && window.LB_POSTS) {
      return window.LB_POSTS.map(function (p) {
        return {
          _id: p.id,
          name: p.name,
          category: p.category,
          team: p.team,
          qcamp: p.qCamp || "",
          levels: (p.grades || []).map(function (g) { return g.level; }),
          refs: (p.grades || []).map(function (g) { return g.ref || ""; }),
          full: (p.grades || []).map(function (g) { return "￥" + g.full; }),
          part: (p.grades || []).map(function (g) { return "￥" + g.part; }),
          remark: p.remark || "",
          updated: p.updated,
          created: p.operated || p.updated,
          grades: p.grades,
          preset: !!p.preset
        };
      });
    }
    var n = spec.columns && spec.columns.length > 8 ? 12 : 8;
    var rows = [];
    for (var i = 0; i < n; i++) {
      var p = PEOPLE[i % PEOPLE.length];
      var row = { _id: p.id + "-" + i };
      (spec.columns || []).forEach(function (c) {
        row[c.k] = mockValue(c, p, i);
      });
      var pending = PENDING_LEAVE[p.name];
      if (pending && pageId === "leave-exception") {
        row.status = pending.status;
        row.kind = pending.kind;
      }
      if (pageId === "survey-collect") {
        var pi = i < 6 ? 5 : i % SURVEY_PLANS.length;
        var weeks = SURVEY_PLANS[pi].weeks;
        var wi = i % weeks.length;
        row.planIndex = pi;
        row.weekIndex = wi;
        row.planWeek = SURVEY_PLANS[pi].name + " / " + weeks[wi];
        stampSurveyRow(row, p, i);
      }
      rows.push(row);
    }
    if (pageId === "talent-pool") stampTalent(rows);
    if (pageId === "talent-pool" || pageId === "camp-staff") applyShade(rows);
    applyRateDesign(rows);
    applyKinDesign(rows);
    applyPerfDesign(rows);
    if (pageId === "attendance-summary" || pageId === "leave-exception") {
      var extra = {
        _id: "LZL2201",
        name: "刘中良",
        id: "LZL2201",
        avatar: "刘",
        type: "全职",
        postTeam: "导师 / 导师团",
        planWeek: "2026暑假广州第二期 / 第二周",
        classGroup: "A1班 / 1组",
        attStatus: "待确认",
        posStatus: "正常",
        kind: PENDING_LEAVE["刘中良"].kind,
        status: PENDING_LEAVE["刘中良"].status,
        starter: "刘中良",
        post: "导师",
        source: "后台",
        reason: "待审核",
        updated: "2026-09-18 09:12:00"
      };
      rows.unshift(extra);
    }
    if (pageId === "benchmark" && window.LB_POSTER) window.LB_POSTER.stamp(rows);
    /* 原型评审第二轮第22条：光荣榜读取同一份标杆学员数据 */
    if (pageId === "benchmark") window.LB_BENCHMARK_ROWS = rows;
    return rows;
  }

  function applyRateDesign(rows) {
    var show = pageId === "camp-staff" || pageId === "staff-rate" || pageId === "salary-calc-detail" || pageId === "salary-bill";
    if (!show) return;
    rows.forEach(function (row) {
      if (row.name === "林晓雯") {
        row.crossPost = true;
        row.post = "见习副团";
        row.postTeam = "见习副团 / 助教团";
        row.level = "6";
        row.pastLevel = "6+";
        row.curLevel = "6";
        row.levelStatus = "已调整";
        row.changed = "是";
        row.status = "已同步";
        row.pastPay = "￥550";
        row.curPay = "￥580";
      }
      if (row.name === "陈启航") {
        row.pastLevel = "6";
        row.curLevel = "6+";
        row.level = "6+";
        row.levelStatus = "继承评级";
        row.changed = "否";
        row.status = "已同步";
      }
    });
  }

  function applyPerfDesign(rows) {
    var mod = pageId === "perf-pre" || pageId === "perf-mid" || pageId === "perf-post" || pageId === "perf-assess";
    if (!mod) return;
    rows.forEach(function (row, i) {
      if (pageId === "perf-assess") {
        var carriedPre = i % 2 === 0;
        row.items = [
          { name: "营前", score: 90, source: carriedPre ? "过往携带" : "本次导入" },
          { name: "营中", score: 88, source: "本次导入" },
          { name: "营后", score: 86, source: carriedPre ? "本次导入" : "过往携带" }
        ];
        row.score = 88;
        row.carry = false;
        return;
      }
      if (row.name === "林晓雯") {
        row.carry = true;
        row.score = 92;
      }
    });
  }

  var SURVEY_KINDS = [
    { code: 1, label: "互评/他评", title: "导师互评问卷", targetPost: "导师", fillerPost: "导师" },
    { code: 2, label: "自评/总结问卷", title: "导学师自评问卷", targetPost: "导学师", fillerPost: "导学师" },
    { code: 3, label: "学员问卷", title: "学员满意度问卷", targetPost: "导师", fillerPost: "学员" },
    { code: 4, label: "家长问卷", title: "家长反馈问卷", targetPost: "家长", fillerPost: "家长" },
    { code: 5, label: "督评问卷", title: "督导评价问卷", targetPost: "导师", fillerPost: "督导" }
  ];

  function surveyDatePlus(dateStr, days) {
    var d = new Date(String(dateStr).replace(/-/g, "/"));
    if (isNaN(d.getTime())) return dateStr;
    d.setDate(d.getDate() + days);
    var m = d.getMonth() + 1;
    var day = d.getDate();
    return d.getFullYear() + "-" + (m < 10 ? "0" : "") + m + "-" + (day < 10 ? "0" : "") + day;
  }

  function surveyQuestions(code, i) {
    if (code === 3) {
      return {
        common: [
          { content: "课堂专注度", score: "5", answer: "4", isCalculate: true, avgScore: "4.6" },
          { content: "团队协作", score: "5", answer: "良好" }
        ],
        items: [
          { content: "本周对导师最满意的一点", score: "10", answer: "讲解清楚，会照顾跟不上的同学" },
          { content: "请上传课堂照片", score: "—", type: 5, image: "课堂照片" }
        ]
      };
    }
    if (code === 4) {
      return {
        common: [],
        items: [
          { content: "您对本次营期的整体感受", score: "10", answer: "孩子反馈很好，希望下期继续" },
          { content: "还希望改进的地方", score: "10", answer: "接送时间再提前一些" }
        ]
      };
    }
    return {
      common: [],
      items: [
        { content: "本周带班中做得最好的一件事", score: "10", answer: i % 2 ? "晚间复盘及时" : "分组任务安排清楚", isCalculate: true, avgScore: "8.2" },
        { content: "需要改进的地方", score: "10", answer: "课堂节奏还可以再收一点" },
        { content: "请上传现场记录", score: "—", type: 5, image: i % 2 ? "" : "现场记录" }
      ]
    };
  }

  function stampSurveyRow(row, person, i) {
    var kind = SURVEY_KINDS[i % SURVEY_KINDS.length];
    var filler = kind.code === 2 ? person : PEOPLE[(i + 3) % PEOPLE.length];
    var start = String(row.created || "").split(" ")[0];
    var end = surveyDatePlus(start, 7);
    var parent = kind.code === 4;
    var questions = surveyQuestions(kind.code, i);
    row.paperCode = kind.code;
    row.paperType = kind.label;
    row.paper = kind.title;
    row.target = parent ? "-" : person.name;
    row.targetPost = parent ? "-" : kind.targetPost;
    row.filler = filler.name;
    row.fillerPost = parent ? "-" : kind.fillerPost;
    row.group = pick(["1组", "2组", "3组"], i);
    row.classGroup = (row.klass || "-") + "/" + row.group;
    row.endTime = end + " 23:59:59";
    row.valid = start + " 至 " + end;
    row.collect = i % 2 ? "已收集" : "待收集";
    row.allowAfterEnd = i % 3 === 0 ? 2 : 1;
    row.endStatus = row.allowAfterEnd === 2;
    row.fill = row.endStatus ? "已截止" : "进行中";
    row.commonItems = questions.common;
    row.items = questions.items;
  }

  function matchWhen(when, row) {
    if (!when) return true;
    return Object.keys(when).every(function (k) {
      var v = when[k];
      if (Array.isArray(v)) return v.indexOf(row[k]) >= 0;
      return row[k] === v;
    });
  }

  function visibleOps(row) {
    return (spec.ops || []).filter(function (o) {
      if (pageId === "excellent-honor" && (o.id === "pass" || o.id === "veto")) {
        return row.taskStatus === "审批中" || row.taskStatus === "未通过";
      }
      if (pageId === "survey-collect") {
        if (row.paperCode === 4) return false;
        if (o.id === "resume") return row.allowAfterEnd === 2 && row.endStatus;
        if (o.id === "pause") return row.allowAfterEnd === 1;
      }
      if (pageId === "benchmark") {
        if (o.id === "poster") return row.status === "有效";
        if (o.id === "posterView") return row.poster === "已生成";
      }
      return matchWhen(o.when, row);
    });
  }

  function renderLeft() {
    var kind = spec.left;
    if (!kind) return "";
    if (kind === "team") {
      var items = ["全部"].concat(window.LB_PAGE_CONST.teams);
      return (
        '<div class="lb-job-tree">' +
        items
          .map(function (t) {
            var id = t === "全部" ? "all" : t;
            return '<button type="button" class="' + (state.left === id ? "is-on" : "") + '" data-left="' + esc(id) + '">' + esc(t) + "</button>";
          })
          .join("") +
        "</div>"
      );
    }
    if (kind === "jobs") {
      return (
        '<div class="lb-job-tree"><input class="lb-input" id="left-q" placeholder="岗位名称" />' +
        '<div id="left-list">' +
        window.LB_PAGE_CONST.jobs
          .map(function (j) {
            return (
              '<button type="button" class="' +
              (state.left === j.id ? "is-on" : "") +
              '" data-left="' +
              j.id +
              '" data-label="' +
              esc(j.label) +
              '">' +
              esc(j.label) +
              "（" +
              j.count +
              "）</button>"
            );
          })
          .join("") +
        "</div></div>"
      );
    }
    if (kind === "planSelect") {
      var plan = SURVEY_PLANS[state.planIndex] || SURVEY_PLANS[0];
      return (
        '<div class="lb-job-tree lb-plan-side">' +
        '<div class="lb-plan-box">' +
        '<button type="button" class="lb-plan-trigger" data-plan-toggle="1"><span>' +
        esc(plan.name) +
        '</span><span class="lb-plan-caret"></span></button>' +
        '<button type="button" class="lb-num-btn" data-note-key="survey-plan"></button>' +
        '<div class="lb-plan-menu" id="lb-plan-menu" hidden>' +
        SURVEY_PLANS.map(function (item, i) {
          return (
            '<button type="button" class="' +
            (i === state.planIndex ? "is-on" : "") +
            '" data-plan="' +
            i +
            '">' +
            esc(item.name) +
            "</button>"
          );
        }).join("") +
        "</div></div>" +
        '<button type="button" class="lb-week-all' +
        (state.left === "all" ? " is-on" : "") +
        '" data-left="all">全部</button>' +
        plan.weeks
          .map(function (week, wi) {
            return (
              '<button type="button" class="lb-week-row' +
              (state.left === String(wi) ? " is-on" : "") +
              '" data-left="' +
              wi +
              '">' +
              esc(plan.name) +
              " | " +
              esc(week) +
              "</button>"
            );
          })
          .join("") +
        "</div>"
      );
    }
    if (kind === "plan") {
      var html = '<div class="lb-job-tree"><div class="lb-left-cap">计划 / 周营</div>';
      window.LB_PAGE_CONST.plans.forEach(function (plan, pi) {
        html += '<button type="button" class="' + (state.left === "p" + pi ? "is-on" : "") + '" data-left="p' + pi + '">' + esc(plan) + "</button>";
        html +=
          '<button type="button" class="is-sub ' +
          (state.left === "w" + pi ? "is-on" : "") +
          '" data-left="w' +
          pi +
          '">第二周</button>';
      });
      return html + "</div>";
    }
    if (kind === "batch") {
      return (
        '<div class="lb-job-tree">' +
        '<input class="lb-input" id="left-q" placeholder="请输入批次" />' +
        '<button type="button" class="lb-btn lb-btn--primary lb-left-add" data-act="add-batch">新增批次</button>' +
        window.LB_PAGE_CONST.batches
          .map(function (b) {
            return (
              '<button type="button" class="' +
              (state.left === b.id ? "is-on" : "") +
              '" data-left="' +
              b.id +
              '"><strong>' +
              esc(b.title) +
              "</strong>" +
              (b.remark ? '<span class="lb-left-meta">' + esc(b.remark) + "</span>" : "") +
              (b.createTime ? '<span class="lb-left-meta">' + esc(b.createTime) + "</span>" : "") +
              "</button>"
            );
          })
          .join("") +
        "</div>"
      );
    }
    return "";
  }

  function columnNoteBtn(key) {
    var map = {
      "camp-staff": { levelStatus: "levelInherit", name: "kinSame" },
      "student-archive": { role: "stuArchive", lamp: "stuArchive", study: "stuArchive", bench: "followArchive", emotion: "followArchive" },
      "emotion-reg": { registrarId: "emotionExport", target: "followArchive", plan: "followArchive", week: "followArchive" },
      "post-salary": { levels: "postLevels" },
      "salary-calc-detail": { diff: "levelDiff" },
      "salary-bill": { levelStatus: "billLevel" },
      "benchmark": { poster: "posterBanner" },
      "mentor-lesson-archive": { firstTeach: "firstTeach" },
      "medical-reg": { name: "sickNotice" }
    };
    var noteKey = (map[pageId] || {})[key];
    return noteKey ? '<button type="button" class="lb-num-btn" data-note-key="' + noteKey + '"></button>' : "";
  }

  function filterNoteBtn(key) {
    var map = {
      "leave-exception": { name: "applicant" },
      "talent-pool": { shade: "shade" },
      "camp-staff": { shade: "shade" },
      "excellent-honor": { scoreBand: "honorScore" }
    };
    var noteKey = (map[pageId] || {})[key];
    return noteKey ? '<button type="button" class="lb-num-btn" data-note-key="' + noteKey + '"></button>' : "";
  }

  function renderFilters() {
    var fs = spec.filters || [];
    if (!fs.length) return "";
    return (
      '<div class="lb-toolbar" id="lb-filters">' +
      fs
        .map(function (f) {
          if (f.t === "select") {
            return (
              '<div class="lb-field"><label>' +
              esc(f.l) +
              filterNoteBtn(f.k) +
              '</label><select class="lb-select" data-fk="' +
              f.k +
              '"><option value="">请选择' +
              esc(f.l) +
              "</option>" +
              (f.o || [])
                .map(function (o) {
                  return "<option>" + esc(o) + "</option>";
                })
                .join("") +
              "</select></div>"
            );
          }
          if (f.t === "dateRange" || f.t === "numberRange") {
            return (
              '<div class="lb-field lb-field--range"><label>' +
              esc(f.l) +
              filterNoteBtn(f.k) +
              '</label><input class="lb-input" data-fk="' +
              f.k +
              '-a" placeholder="' +
              (f.t === "numberRange" ? "最小" : "开始") +
              '" /><span class="lb-range-gap">~</span><input class="lb-input" data-fk="' +
              f.k +
              '-b" placeholder="' +
              (f.t === "numberRange" ? "最大" : "结束") +
              '" /></div>'
            );
          }
          return (
            '<div class="lb-field"><label>' +
            esc(f.l) +
            filterNoteBtn(f.k) +
            '</label><input class="lb-input" data-fk="' +
            f.k +
            '" placeholder="请输入' +
            esc(f.l) +
            '" /></div>'
          );
        })
        .join("") +
      '<button type="button" class="lb-btn lb-btn--primary" id="btn-search">查询</button>' +
      '<button type="button" class="lb-btn" id="btn-reset">重置</button></div>'
    );
  }

  function renderToolbar() {
    var tbs = spec.toolbar || [];
    if (!tbs.length) return "";
    return (
      '<div class="lb-actions" id="lb-actions">' +
      tbs
        .map(function (b) {
          var cls = "lb-btn" + (b.p ? " lb-btn--primary" : "") + (b.danger ? " lb-btn--danger" : "");
          if (b.menu) {
            return (
              '<div class="lb-drop" data-drop="' +
              b.id +
              '"><button type="button" class="' +
              cls +
              '" data-drop-toggle="' +
              b.id +
              '">' +
              esc(b.l) +
              ' ▾</button><div class="lb-drop__menu">' +
              b.menu
                .map(function (m) {
                  return '<button type="button" data-act="' + esc(b.id) + '" data-menu="' + esc(m) + '">' + esc(m) + "</button>";
                })
                .join("") +
              "</div></div>"
            );
          }
          var noteKey = ({
            "attendance-summary": { confirmAtt: "confirmAtt", refresh: "attNoSign" },
            "staff-rate": { syncLevel: "syncLevel" },
            "perf-pre": { ie: "perfImport" },
            "perf-mid": { ie: "perfImport" },
            "perf-post": { ie: "perfImport" },
            "perf-assess": { ie: "perfImport" },
            "class-assess": { export: "class-export" },
            "talent-pool": { ie: "shade-import", export: "shade-export" },
            "camp-staff": { export: "shade-export", add: "kinSame", ie: "kinSame" },
            "student-archive": { add: "stuArchive", batchLamp: "stuArchive" },
            "emotion-reg": { export: "emotionExport" },
            "salary-calc": { ledger: "ledgerEntry" },
            "benchmark": { posterTpl: "posterBanner" },
            "mentor-lesson-archive": { recordExport: "firstTeach" },
            "camp-manage": { add: "campTravelMap" },
            "salary-pay": { exportMerge: "payMergeExport" }
          }[pageId] || {})[b.id];
          var dot = noteKey ? '<button type="button" class="lb-num-btn" data-note-key="' + noteKey + '"></button>' : "";
          var demo =
            pageId === "attendance-summary" && b.id === "confirmAtt"
              ? '<button type="button" class="lb-btn" data-act="confirmAttOk">正常确认演示</button>'
              : "";
          var lampPick =
            pageId === "student-archive" && b.id === "batchLamp"
              ? '<select class="lb-select lb-lamp-batch" id="lamp-batch"><option>红</option><option>黄</option><option>白</option></select>'
              : "";
          return '<span class="lb-act">' + lampPick + '<button type="button" class="' + cls + '" data-act="' + b.id + '">' + esc(b.l) + "</button>" + dot + "</span>" + demo;
        })
        .join("") +
      "</div>"
    );
  }

  function nameMark(row, col) {
    if (col.k !== "name") return "";
    var html = "";
    if (row.levelStatus === "继承评级" && (pageId === "camp-staff" || pageId === "salary-calc-detail" || pageId === "salary-bill")) {
      html += '<span class="lb-tag lb-tag--wait" title="级别继承">继承</span>';
    }
    if (pageId === "camp-staff" && row.kinSame) {
      html += '<i class="lb-kin-warn" data-kin-tip="' + esc(kinHoverText(row, row.kinHits || [])) + '">!</i>';
    }
    return html;
  }

  function cellHtml(col, row) {
    var v = row[col.k];
    /* 第6条：黑白灰列标出规则与灰的变白日期。 */
    if (col.k === "shade" && (pageId === "talent-pool" || pageId === "camp-staff")) {
      if (v === "黑") return '<span class="lb-tag" style="color:#1f2430">黑 · 永久封禁</span>';
      if (v === "灰") {
        var until = shadeUntil(row.name);
        return '<span class="lb-tag lb-tag--wait">灰</span>' + (until ? '<em class="lb-shade-until">' + until + " 变白</em>" : "");
      }
      return '<span class="lb-tag lb-tag--ok">白 · 正常</span>';
    }
    if (pageId === "student-archive" && col.k === "lamp") return lampCell(row);
    if (pageId === "student-archive" && col.k === "study") {
      var count = (row.study || []).length;
      if (!count) return "—";
      return '<button type="button" class="lb-link-btn" data-act="studyRecord" data-row="' + esc(row._id) + '">' + count + "-查看记录</button>";
    }
    if (pageId === "student-archive" && col.k === "bench") {
      var benches = (row.benchmarks || []).length;
      if (!benches) return "无";
      return '<button type="button" class="lb-link-btn" data-act="benchRecord" data-row="' + esc(row._id) + '">' + benches + "次标杆</button>";
    }
    if (pageId === "student-archive" && col.k === "emotion") {
      var moods = (row.emotions || []).length;
      if (!moods) return "无";
      return '<button type="button" class="lb-link-btn" data-act="emotionRecord" data-row="' + esc(row._id) + '">' + moods + "-查看记录</button>";
    }
    if (pageId === "benchmark" && col.k === "poster") {
      if (row.poster === "已生成") {
        return '<button type="button" class="lb-link-btn" data-act="posterView" data-row="' + esc(row._id) + '">已生成</button>';
      }
      return '<span class="lb-tag lb-tag--wait">未生成</span>';
    }
    if (pageId === "mentor-lesson-archive" && col.k === "mentor") {
      return "<div>ID：" + esc(row.mid) + "</div><div>姓名：" + esc(row.name) + "</div><div>电话：" + esc(row.phone) + "</div>";
    }
    if (pageId === "mentor-lesson-archive" && col.k === "course") {
      return "<div>ID：" + esc(row.courseId) + "</div><div>名称：" + esc(row.course) + "</div>";
    }
    if (pageId === "mentor-lesson-archive" && col.k === "realCount") {
      return "<div>" + esc(row.realCount) + "</div><div>较上个月：" + esc(row.monthRate) + "%</div>";
    }
    if (pageId === "mentor-lesson-archive" && col.k === "firstTeach") {
      /* 原型评审第二轮第4条：第一次授课只记时间，不再跳班级课表。 */
      return esc(row.firstTeach || "-");
    }
    if (col.t === "img") {
      var face = v
        ? '<span class="lb-avatar">' + esc(v) + "</span>"
        : '<span class="lb-avatar" style="background:#d9d9d9"></span>';
      if ((pageId === "talent-pool" || pageId === "camp-staff") && row.shade) {
        var shadeCls = row.shade === "黑" ? "lb-shade--black" : row.shade === "灰" ? "lb-shade--gray" : "lb-shade--white";
        return '<span class="lb-avatar-wrap">' + face + '<i class="lb-shade ' + shadeCls + '" title="' + esc(row.shade) + '"></i></span>';
      }
      return face;
    }
    if (col.t === "link") {
      if (pageId === "survey-collect" && row.paperCode === 4) return "-";
      var nameBtn = '<button type="button" class="lb-link-btn" data-detail="' + esc(row._id) + '">' + esc(v || "-") + "</button>";
      var mark = nameMark(row, col);
      return mark ? '<span class="lb-name-cell">' + nameBtn + mark + "</span>" : nameBtn;
    }
    if (col.t === "tag") {
      if (v === "黄灯助教") return '<span class="lb-tag lb-tag--wait">黄灯助教</span>';
      if (v === "红灯助教") return '<span class="lb-tag" style="color:#cf1322;background:#fff1f0;border-color:#ffa39e">红灯助教</span>';
      if (!v || v === "—") return "-";
      if (pageId === "excellent-honor" && (col.k === "scoreBand" || col.k === "taskStatus")) {
        var honorCls = "";
        if (col.k === "scoreBand") honorCls = v === "综合分达标" ? " lb-tag--ok" : " lb-tag--wait";
        else if (/已通过/.test(String(v))) honorCls = " lb-tag--ok";
        else honorCls = " lb-tag--wait";
        return '<span class="lb-tag' + honorCls + '">' + esc(v || "-") + "</span>";
      }
      var wait = /待|中|未|禁用|下架|失效|失败/.test(String(v));
      var ok = /已确认|已同步|启用|上架|正常|已完成|已发放|有效|已获得/.test(String(v));
      return '<span class="lb-tag' + (ok ? " lb-tag--ok" : wait ? " lb-tag--wait" : "") + '">' + esc(v || "-") + "</span>";
    }
    if (pageId === "camp-staff" && (col.k === "post" || col.k === "level" || col.k === "klass")) {
      return campInline(col.k, row);
    }
    if ((col.k === "post" || col.k === "postTeam") && row.crossPost) {
      return esc(v || "-") + ' <span class="lb-tag lb-tag--wait">跨岗</span>';
    }
    if (col.k === "score" && row.carry && pageId !== "perf-assess") {
      return esc(v == null || v === "" ? "-" : v) + ' <span class="lb-tag lb-tag--wait">过往携带</span>';
    }
    if (col.k === "items" && Array.isArray(v) && v[0] && v[0].name) {
      return v.map(function (item) {
        var tag = item.source === "过往携带"
          ? ' <span class="lb-tag lb-tag--wait">过往携带</span>'
          : ' <span class="lb-tag">本次导入</span>';
        return "<div>" + esc(item.name) + " " + esc(item.score) + tag + "</div>";
      }).join("");
    }
    if (col.t === "tags") {
      if (!v) return "-";
      return String(v)
        .split(/[,，]/)
        .filter(Boolean)
        .map(function (t) {
          return '<span class="lb-tag">' + esc(t) + "</span>";
        })
        .join(" ");
    }
    if (col.t === "stack") {
      var arr = Array.isArray(v) ? v : [];
      if (!arr.length) return "-";
      return arr
        .map(function (x) {
          return "<div>" + esc(x === "" ? " " : x) + "</div>";
        })
        .join("");
    }
    return esc(v == null || v === "" ? "-" : v);
  }

  function applyFilter(keepPage) {
    var box = document.getElementById("lb-filters");
    var q = {};
    if (box) {
      box.querySelectorAll("[data-fk]").forEach(function (el) {
        q[el.getAttribute("data-fk")] = (el.value || "").trim();
      });
    }
    var leftQ = document.getElementById("left-q");
    if (leftQ && spec.left === "jobs") {
      var kw = leftQ.value.trim();
      document.querySelectorAll("#left-list [data-label]").forEach(function (b) {
        b.style.display = !kw || b.getAttribute("data-label").indexOf(kw) >= 0 ? "" : "none";
      });
    }
    state.filtered = state.rows.filter(function (r) {
      if (spec.left === "planSelect") {
        if (r.planIndex !== state.planIndex) return false;
        if (state.left !== "all" && String(r.weekIndex) !== String(state.left)) return false;
      }
      if (spec.left === "team" && state.left !== "all" && r.team && r.team !== state.left) return false;
      if (spec.left === "jobs" && state.left !== "all") {
        var job = window.LB_PAGE_CONST.jobs.filter(function (j) { return j.id === state.left; })[0];
        if (job && r.post && r.post.indexOf(job.label.replace("全部", "")) === -1 && job.label !== "全部") {
          if (r.post !== job.label) return false;
        }
      }
      if (spec.left === "batch" && state.left !== "all" && r.batch) {
        var b = window.LB_PAGE_CONST.batches.filter(function (x) { return x.id === state.left; })[0];
        if (b && r.batch.indexOf(b.title.replace("全部", "")) === -1 && state.left !== "all") return false;
      }
      return (spec.filters || []).every(function (f) {
        if (f.t === "dateRange" || f.t === "numberRange") return true;
        var val = q[f.k];
        if (!val) return true;
        if (pageId === "excellent-honor" && (f.k === "scoreBand" || f.k === "type")) return String(r[f.k] || "") === val;
        return String(r[f.k] || "").indexOf(val) >= 0;
      });
    });
    if (!keepPage) state.page = 1;
    renderTable();
  }

  function renderTable() {
    var start = (state.page - 1) * state.pageSize;
    var rows = state.filtered.slice(start, start + state.pageSize);
    var head =
      "<tr>" +
      (spec.select ? "<th><input type=\"checkbox\" id=\"chk-all\" /></th>" : "") +
      (spec.columns || [])
        .map(function (c) {
          return '<th><span class="lb-act">' + esc(c.l) + columnNoteBtn(c.k) + "</span></th>";
        })
        .join("") +
      (spec.ops && spec.ops.length ? "<th>操作</th>" : "") +
      "</tr>";
    var body = rows
      .map(function (r) {
        var ops = visibleOps(r)
          .map(function (o) {
            return (
              '<button type="button" class="lb-link-btn' +
              (o.danger ? " lb-link-btn--danger" : "") +
              '" data-row="' +
              esc(r._id) +
              '" data-act="' +
              o.id +
              '">' +
              esc(o.l) +
              "</button>"
            );
          })
          .join("");
        return (
          "<tr>" +
          (spec.select
            ? '<td><input type="checkbox" data-chk="' +
              esc(r._id) +
              '"' +
              (state.selected[r._id] ? " checked" : "") +
              " /></td>"
            : "") +
          (spec.columns || [])
            .map(function (c) {
              return "<td>" + cellHtml(c, r) + "</td>";
            })
            .join("") +
          (spec.ops && spec.ops.length ? "<td class=\"lb-ops\">" + ops + "</td>" : "") +
          "</tr>"
        );
      })
      .join("");
    document.getElementById("lb-thead").innerHTML = head;
    document.getElementById("lb-tbody").innerHTML = body || '<tr><td colspan="99" class="lb-empty">暂无数据</td></tr>';
    var total = state.filtered.length;
    document.getElementById("pager-info").textContent = "共 " + total + " 条";
    var pages = Math.max(1, Math.ceil(total / state.pageSize) || 1);
    var ph = "";
    for (var p = 1; p <= pages; p++) {
      ph += '<button type="button" class="' + (p === state.page ? "is-on" : "") + '" data-page="' + p + '">' + p + "</button>";
    }
    document.getElementById("pager-btns").innerHTML = ph;
  }

  function findRow(id) {
    return state.rows.filter(function (r) { return r._id === id; })[0];
  }

  function fieldsFromRow(row, editable) {
    return (spec.columns || [])
      .filter(function (c) { return c.t !== "img" && c.t !== "stack" && c.t !== "tags"; })
      .map(function (c) {
        return (
          '<div class="lb-field"><label>' +
          esc(c.l) +
          "</label>" +
          (editable
            ? '<input class="lb-input" name="' + c.k + '" value="' + esc(row[c.k]) + '" />'
            : '<input class="lb-input" readonly value="' + esc(row[c.k]) + '" />') +
          "</div>"
        );
      })
      .join("");
  }

  function formFields(keys) {
    return keys
      .map(function (pair) {
        return (
          '<div class="lb-field"><label>' +
          esc(pair[0]) +
          '</label><input class="lb-input" name="' +
          pair[1] +
          '" placeholder="请输入' +
          esc(pair[0]) +
          '" /></div>'
        );
      })
      .join("");
  }

  /* 第7条：营地管理新增/编辑营地。
     交通信息三块（机场接送、火车站接送、大巴接送）各自先选支持/不支持，
     选「支持」才展开该方式字段：入营注意事项、离营注意事项、位置指示图。
     位置指示图放在「离营注意事项」下面，每种接送方式 1 张，选填。
     源码位置：viewModules/implementation/affairsTool/place/form.vue，标题为「交通信息」。
     上传接口沿用现网 goods/camps/place/create、goods/camps/place/modify。 */
  var CAMP_TRAVEL = [
    { key: "airport", label: "机场接送", siteLabel: "接送机场", sitePh: "请添加接送机场", mapLabel: "机场位置指示图" },
    { key: "railway", label: "火车站接送", siteLabel: "接送车站", sitePh: "请添加接送车站", mapLabel: "火车站位置指示图" },
    { key: "bus", label: "大巴接送", siteLabel: "入营大巴起点/结营大巴终点", sitePh: "请添加入营大巴起点/结营大巴终点", mapLabel: "大巴位置指示图" }
  ];

  /* 抽屉在 #lb-replica 之外，notes.js 的 MutationObserver 画不到，这里直接写死序号。 */
  function campNoteDot(n) {
    return '<button type="button" class="lb-num-btn" data-note="' + n + '" title="查看注释"><span class="lb-num">' + n + "</span></button>";
  }

  function campTravelBlock(item, row) {
    var on = !!(row && row[item.key + "Pickup"]);
    var mapKey = item.key + "Map";
    var mapName = (row && row[mapKey]) || "";
    var html = '<div class="lb-camp-travel" data-camp-travel="' + item.key + '">';
    html += '<div class="lb-camp-travel__head"><b>' + esc(item.label) + '</b>';
    html += '<label class="lb-radio"><input type="radio" name="' + item.key + 'Pickup" value="1"' + (on ? " checked" : "") + " data-camp-toggle=\"" + item.key + "\" />支持</label>";
    html += '<label class="lb-radio"><input type="radio" name="' + item.key + 'Pickup" value="0"' + (on ? "" : " checked") + " data-camp-toggle=\"" + item.key + "\" />不支持</label></div>";
    html += '<div class="lb-camp-travel__body"' + (on ? "" : " hidden") + ">";
    html += '<div class="lb-field"><label>入营注意事项</label><textarea class="lb-textarea" name="' + item.key + 'Remark" placeholder="请输入">' + esc((row && row[item.key + "Remark"]) || "") + "</textarea></div>";
    html += '<div class="lb-field"><label>离营注意事项</label><textarea class="lb-textarea" name="' + item.key + 'LeaveRemark" placeholder="请输入">' + esc((row && row[item.key + "LeaveRemark"]) || "") + "</textarea></div>";
    html += '<div class="lb-field"><label>' + esc(item.mapLabel) + "</label>";
    html += '<div class="lb-upload' + (mapName ? " is-on" : "") + '" data-camp-map="' + item.key + '">';
    html += mapName
      ? '<span class="lb-upload__thumb">图</span><span class="lb-upload__name">' + esc(mapName) + '</span><button type="button" class="lb-link-btn" data-camp-map-clear="' + item.key + '">删除</button>'
      : '<button type="button" class="lb-btn" data-camp-map-pick="' + item.key + '">上传位置指示图</button><span class="lb-upload__hint">选填，限 1 张，建议 jpg / png</span>';
    html += "</div></div>";
    html += '<div class="lb-field"><label>' + esc(item.siteLabel) + "</label><input class=\"lb-input\" name=\"" + item.key + "List\" placeholder=\"" + esc(item.sitePh) + "\" value=\"" + esc((row && row[item.key + "List"]) || "") + '" /></div>';
    html += "</div></div>";
    return html;
  }

  function openCampForm(row) {
    var draft = row ? { airportMap: row.airportMap, railwayMap: row.railwayMap, busMap: row.busMap } : {};
    var html = '<div class="lb-field"><label>营地名称</label><input class="lb-input" name="name" value="' + esc((row && row.name) || "") + '" placeholder="请输入营地名称" /></div>';
    html += '<div class="lb-field"><label>城市</label><input class="lb-input" name="city" value="' + esc((row && row.city) || "") + '" placeholder="请输入城市" /></div>';
    html += '<div class="lb-field"><label>营地地址</label><input class="lb-input" name="address" value="' + esc((row && row.address) || "") + '" placeholder="请输入营地地址" /></div>';
    html += '<h3 class="lb-sec">交通信息' + campNoteDot(1) + "</h3>";
    html += CAMP_TRAVEL.map(function (item) { return campTravelBlock(item, row); }).join("");
    html += '<div class="lb-field"><label>备注</label><input class="lb-input" name="remark" value="' + esc((row && row.remark) || "") + '" placeholder="请输入备注" /></div>';
    html += '<p class="lb-hint"><button type="button" class="lb-num-btn" data-note="2" title="查看注释"><span class="lb-num">2</span></button>位置指示图随营地保存，家长填写入营 / 离营问卷时，选了对应接送方式就能看到这张图。</p>';
    html += '<div class="lb-drawer-foot"><button type="button" class="lb-btn" data-close-drawer="1">取消</button><button type="button" class="lb-btn lb-btn--primary" data-camp-save="1">确定</button></div>';
    campDraft = draft;
    window.LB.openDrawer(row ? "营地 · " + (row.name || "") : "新增营地", html, { wide: true, paper: true });
  }

  var campDraft = {};

  function openPostDrawer(row, mode) {
    var grades = (row && row.grades) || [{ level: "6", ref: "", full: "", part: "" }];
    var readonly = mode === "detail";
    var gradeHtml = grades
      .map(function (g, i) {
        return (
          '<div class="lb-grade">' +
          '<div class="lb-grade__bar"><span>薪酬等级' +
          (i + 1) +
          "</span>" +
          (readonly
            ? ""
            : '<span><button type="button" class="lb-link-btn" data-grade="up" data-i="' +
              i +
              '">上移</button><button type="button" class="lb-link-btn" data-grade="down" data-i="' +
              i +
              '">下移</button>' +
              (i ? '<button type="button" class="lb-link-btn lb-link-btn--danger" data-grade="del" data-i="' + i + '">删除</button>' : "") +
              "</span>") +
          "</div>" +
          '<div class="lb-grade__grid">' +
          '<div class="lb-field"><label>薪酬等级</label><input class="lb-input" ' +
          (readonly ? "disabled" : "") +
          ' value="' +
          esc(g.level) +
          '" /></div>' +
          '<div class="lb-field lb-field--wide"><label>评定参考项</label><input class="lb-input" ' +
          (readonly ? "disabled" : "") +
          ' value="' +
          esc(g.ref || "") +
          '" /></div>' +
          '<div class="lb-field"><label>全职基础薪酬</label><input class="lb-input" ' +
          (readonly ? "disabled" : "") +
          ' value="' +
          esc(g.full) +
          '" /></div>' +
          '<div class="lb-field"><label>非全职基础薪酬</label><input class="lb-input" ' +
          (readonly ? "disabled" : "") +
          ' value="' +
          esc(g.part) +
          '" /></div></div></div>'
        );
      })
      .join("");
    var extra =
      mode === "detail"
        ? '<div class="lb-drawer-extra">' +
          '<div class="lb-drop" data-drop="more"><button type="button" class="lb-btn" data-drop-toggle="more">更多操作 ▾</button>' +
          '<div class="lb-drop__menu">' +
          '<button type="button" data-act="record" data-row="' +
          esc(row._id) +
          '">操作记录</button>' +
          (row.preset ? "" : '<button type="button" data-act="remove" data-row="' + esc(row._id) + '">删除</button>') +
          "</div></div>" +
          '<button type="button" class="lb-btn lb-btn--primary" data-act="edit" data-row="' +
          esc(row._id) +
          '">编辑岗位</button></div>'
        : "";
    var html =
      extra +
      '<h3 class="lb-sec">岗位信息</h3>' +
      '<div class="lb-field"><label>岗位分类名称</label><input class="lb-input" ' +
      (readonly || mode === "edit" ? "disabled" : "") +
      ' value="' +
      esc(row.category) +
      '" /></div>' +
      '<div class="lb-field"><label>岗位名称</label><input class="lb-input" ' +
      (readonly ? "disabled" : "") +
      ' value="' +
      esc(row.name) +
      '" /></div>' +
      '<div class="lb-field"><label>所属团队</label><input class="lb-input" ' +
      (readonly || mode === "edit" ? "disabled" : "") +
      ' value="' +
      esc(row.team) +
      '" /></div>' +
      '<div class="lb-field"><label>关联Q营</label><input class="lb-input" ' +
      (readonly ? "disabled" : "") +
      ' value="' +
      esc(row.qcamp) +
      '" /></div>' +
      '<div class="lb-field"><label>备注</label><textarea class="lb-textarea" ' +
      (readonly ? "disabled" : "") +
      ">" +
      esc(row.remark) +
      "</textarea></div>" +
      '<h3 class="lb-sec">薪酬等级</h3>' +
      gradeHtml +
      (readonly ? "" : '<button type="button" class="lb-link-btn" data-grade="add">+ 添加等级</button>') +
      (readonly
        ? '<h3 class="lb-sec">系统信息</h3><div class="lb-field"><label>创建人</label><input class="lb-input" disabled value="余炜烽" /></div><div class="lb-field"><label>创建时间</label><input class="lb-input" disabled value="' +
          esc(row.created) +
          '" /></div><div class="lb-field"><label>更新人</label><input class="lb-input" disabled value="余炜烽" /></div><div class="lb-field"><label>更新时间</label><input class="lb-input" disabled value="' +
          esc(row.updated) +
          '" /></div>'
        : '<div class="lb-drawer-foot"><button type="button" class="lb-btn" data-close-drawer="1">取消</button><button type="button" class="lb-btn lb-btn--primary" data-close-drawer="1" data-save="1">确定</button></div>');
    window.LB.openDrawer(mode === "detail" ? "岗位详情" : "编辑岗位", html, { wide: true });
  }

  function openAttDetail(row) {
    var html =
      '<h3 class="lb-sec">基础信息</h3>' +
      '<div class="lb-desc"><div><b>6Q账号</b>' +
      esc(row.id) +
      ' <span class="lb-tag">' +
      esc(row.posStatus || "正常") +
      '</span> <span class="lb-tag lb-tag--wait">' +
      esc(row.attStatus || "") +
      "</span></div>" +
      "<div><b>姓名</b>" +
      esc(row.name) +
      "</div><div><b>岗位</b>" +
      esc((row.postTeam || "").split(" / ")[0]) +
      "</div>" +
      "<div><b>所属计划/周营</b>" +
      esc(row.planWeek) +
      "</div><div><b>班级/小组</b>" +
      esc(row.classGroup) +
      "</div></div>" +
      '<h3 class="lb-sec">考勤信息</h3>' +
      '<div class="lb-desc"><div><b>应出勤天数</b>' +
      esc(row.payDays) +
      "</div><div><b>实际出勤天数</b>" +
      esc(row.realDays) +
      "</div><div><b>调整天数</b>" +
      esc(row.adj) +
      "</div><div><b>提前入营/连营处理天数</b>" +
      esc(row.increase) +
      "</div><div><b>因私请假时长/天数</b>" +
      esc(row.leave) +
      "</div><div><b>生病请假天数</b>" +
      esc(row.sick) +
      " | 剩余请假时长 0.6 天</div><div><b>疑异天数</b>" +
      esc(row.doubt) +
      "</div></div>" +
      '<h3 class="lb-sec">系统信息</h3><div class="lb-desc"><div><b>更新人</b>余炜烽</div><div><b>更新时间</b>' +
      esc(row.updated) +
      "</div></div>";
    window.LB.openDrawer("查看人员", html, { wide: true });
  }

  function openHistory() {
    var html =
      '<div class="lb-toolbar"><div class="lb-field lb-field--range"><label>操作时间</label><input class="lb-input" placeholder="开始" /><span class="lb-range-gap">~</span><input class="lb-input" placeholder="结束" /></div><button type="button" class="lb-btn lb-btn--primary">查询</button><button type="button" class="lb-btn">重置</button></div>' +
      '<table class="lb-table"><thead><tr><th>版本号</th><th>操作人</th><th>操作时间</th></tr></thead><tbody>' +
      "<tr><td><button type=\"button\" class=\"lb-link-btn\">V3</button></td><td>余炜烽</td><td>2026-09-15 12:13:07</td></tr>" +
      "<tr><td><button type=\"button\" class=\"lb-link-btn\">V2</button></td><td>余炜烽</td><td>2026-09-12 09:18:40</td></tr>" +
      "<tr><td><button type=\"button\" class=\"lb-link-btn\">V1</button></td><td>系统</td><td>2026-06-01 10:00:00</td></tr>" +
      "</tbody></table>";
    window.LB.openDrawer("操作历史", html, { wide: true });
  }

  function staffField(label, inner, full) {
    return (
      '<div class="lb-field' +
      (full ? " is-full" : "") +
      '"><label>' +
      label +
      "</label>" +
      inner +
      "</div>"
    );
  }

  function staffInput(placeholder, value, name) {
    return (
      '<input class="lb-input" placeholder="' +
      placeholder +
      '"' +
      (name ? ' name="' + name + '"' : "") +
      (value ? ' value="' + esc(value) + '"' : "") +
      " />"
    );
  }

  function staffSelect(placeholder, options, value) {
    return (
      '<select class="lb-select"><option value="">' +
      placeholder +
      "</option>" +
      options
        .map(function (o) {
          var text = typeof o === "string" ? o : o.name;
          return "<option" + (text === value ? " selected" : "") + ">" + esc(text) + "</option>";
        })
        .join("") +
      "</select>"
    );
  }

  function staffBlock(title, inner, kind) {
    return (
      '<div class="lb-staff-block" data-kind="' +
      kind +
      '"><div class="lb-block-bar"><span>' +
      title +
      '</span><button type="button" class="lb-link-btn lb-link-btn--danger" data-staff-del="1">删除</button></div><div class="lb-form-grid">' +
      inner +
      "</div></div>"
    );
  }

  function openStaffDrawer(mode, row) {
    row = row || {};
    var posts = (window.LB_POSTS || []).map(function (p) {
      return p.name;
    });
    var teams = (window.LB_PAGE_CONST && window.LB_PAGE_CONST.teams) || [];
    var certs = ["大陆居民身份证", "护照", "军人证", "港澳台证件", "其他"];
    var edus = ["小学", "初中", "高中", "中专", "大专", "本科", "研究生", "硕士", "博士"];
    var members = (window.LB_TALENT || [
      { name: "林晓雯", id: "LXW8821", phone: "13800001101" },
      { name: "陈启航", id: "CQH7601", phone: "13500009840" },
      { name: "王敏", id: "WM8EELU", phone: "13328491201" }
    ])
      .slice(0, 8)
      .map(function (m) {
        return (
          '<button type="button" data-member="1" data-mid="' +
          esc(m.id) +
          '" data-mname="' +
          esc(m.name) +
          '" data-mphone="' +
          esc(m.phone || "") +
          '">' +
          esc(m.name) +
          " · " +
          esc(m.id) +
          "</button>"
        );
      })
      .join("");
    var personal =
      mode !== "post"
        ? '<h3 class="lb-sec">个人信息</h3>' +
          '<div id="lb-member-pick" class="lb-member-pick" hidden>' +
          members +
          "</div>" +
          '<div class="lb-form-grid">' +
          staffField("照片", '<button type="button" class="lb-btn" data-act="upload-avatar">上传头像</button>', true) +
          staffField(
            "6Q会员",
            '<div class="range" style="display:flex;gap:8px">' +
              staffInput("请选择会员", row.id || "", "serialNo") +
              (mode === "add" ? '<button type="button" class="lb-btn lb-btn--primary" data-pick-member="1">选择会员</button>' : "") +
              "</div>"
          ) +
          staffField("姓名", staffInput("请输入姓名", row.name || "", "realName")) +
          staffField("类型", '<label class="lb-radio"><input type="radio" name="staffType" value="1" checked data-staff-type="1">全职</label><label class="lb-radio"><input type="radio" name="staffType" value="2" data-staff-type="1">非全职</label>') +
          '<div class="lb-field" data-settle="1"><label>是否参与结算</label><label class="lb-radio"><input type="radio" name="issue" value="2" checked>参与</label><label class="lb-radio"><input type="radio" name="issue" value="1">不参与</label></div>' +
          staffField("是否结算绩效奖金", '<label class="lb-radio"><input type="radio" name="bonus" value="1" checked>是</label><label class="lb-radio"><input type="radio" name="bonus" value="2">否</label>') +
          staffField("联系电话", staffInput("请输入联系电话", row.phone || "", "mobile")) +
          staffField("个人邮箱", staffInput("请输入个人邮箱", "", "email")) +
          staffField("性别", '<label class="lb-radio"><input type="radio" name="sex" value="1">男</label><label class="lb-radio"><input type="radio" name="sex" value="2" checked>女</label>') +
          staffField("出生日期", '<input class="lb-input" type="date" name="birthday" />') +
          staffField("民族", staffInput("请输入民族", "", "nation")) +
          staffField("居住地区", staffInput("请选择居住地区", row.city && row.city !== "-" ? row.city : "", "reside")) +
          staffField("居住地址", staffInput("请输入居住地址", "", "address")) +
          staffField("备注", '<textarea class="lb-textarea" maxlength="150" placeholder="请输入"></textarea>', true) +
          staffField(
            "黑白灰",
            '<select class="lb-select" name="shade">' +
              ["白", "灰", "黑"]
                .map(function (s) {
                  return "<option" + ((row.shade || "白") === s ? " selected" : "") + ">" + s + "</option>";
                })
                .join("") +
              "</select>" +
              '<span class="lb-help">黑为永久封禁，不设到期。灰为一年，从本次修改时间起算满一年自动转为白。</span>' +
              (row.shade === "灰" && shadeUntil(row.name) ? '<span class="lb-help">当前灰：' + shadeUntil(row.name) + " 自动变白</span>" : "")
          ) +
          "</div>"
        : "";
    var position =
      mode !== "info"
        ? '<h3 class="lb-sec">岗位信息</h3><div id="lb-pos-list">' +
          staffBlock(
            "岗位1",
            staffField("岗位", staffSelect("请选择岗位", posts, row.post || "")) +
              staffField("薪酬等级", staffSelect("请先选择岗位", ["6", "6+", "6++"], "6")),
            "position"
          ) +
          '</div><button type="button" class="lb-link-btn" data-staff-add="position">+ 添加岗位</button>' +
          (mode === "post"
            ? '<h3 class="lb-sec">其他信息</h3><div class="lb-form-grid">' +
              staffField("调整说明", '<textarea class="lb-textarea" maxlength="150" placeholder="请输入"></textarea>', true) +
              staffField("凭证", '<button type="button" class="lb-btn">上传凭证</button>', true) +
              "</div>"
            : "")
        : "";
    var rest =
      mode === "add"
        ? '<h3 class="lb-sec">证件信息</h3><div id="lb-cert-list">' +
          staffBlock(
            "证件1",
            staffField("证件类型", staffSelect("请选择证件类型", certs, "大陆居民身份证")) +
              staffField("证件号", staffInput("请输入证件号")),
            "cert"
          ) +
          '</div><button type="button" class="lb-link-btn" data-staff-add="cert">+ 添加证件号</button>' +
          '<h3 class="lb-sec">银行卡信息</h3><div id="lb-bank-list">' +
          staffBlock(
            "银行卡1",
            staffField("银行卡类型", '<label class="lb-radio"><input type="radio" name="bankType0" value="1" checked data-bank-type="1">个人</label><label class="lb-radio"><input type="radio" name="bankType0" value="2" data-bank-type="1">公司</label>') +
              staffField("是否默认", '<label class="lb-radio"><input type="radio" name="def0" checked>默认</label>') +
              staffField("关联团队", staffSelect("请选择关联团队", teams)) +
              '<div class="lb-field" data-company="1" hidden><label>公司名称</label>' +
              staffInput("请输入公司名称") +
              "</div>" +
              '<div class="lb-field" data-company="1" hidden><label>社会信用代码</label>' +
              staffInput("请输入社会信用代码") +
              '<span class="lb-help">统一社会信用代码 (纳税人识别号)</span></div>' +
              staffField("开户行", staffInput("请输入开户行")) +
              staffField("开户行支行", staffInput("请输入开户行支行")) +
              '<div class="lb-field" data-personal="1"><label>开户人姓名</label>' +
              staffInput("请输入开户人姓名") +
              "</div>" +
              '<div class="lb-field" data-personal="1"><label>开户人身份证</label>' +
              staffInput("请输入开户人身份证") +
              "</div>" +
              staffField("个人帐户联行号", staffInput("请输入个人帐户联行号"), false) +
              staffField("银行卡号", staffInput("请输入银行卡号")) +
              staffField("开户行所在城市", staffInput("请输入开户行所在城市")),
            "bank"
          ) +
          '</div><button type="button" class="lb-link-btn" data-staff-add="bank">+ 添加银行卡</button>' +
          '<h3 class="lb-sec">教育信息</h3><div id="lb-edu-list">' +
          staffBlock(
            "教育经历1",
            staffField("学历", staffSelect("请选择学历", edus)) +
              staffField("学校", staffInput("请输入学校")) +
              staffField("教育时间", staffInput("开始", "", "") + " ~ " + staffInput("结束"), true) +
              staffField("专业", staffInput("请输入专业")) +
              staffField("学位", staffInput("请输入学位")),
            "edu"
          ) +
          '</div><button type="button" class="lb-link-btn" data-staff-add="edu">+ 添加教育经历</button>' +
          '<h3 class="lb-sec">紧急联系人信息</h3><div id="lb-em-list">' +
          staffBlock(
            "联系人1",
            staffField("姓名", staffInput("请输入姓名")) +
              staffField("关系", staffInput("请输入关系")) +
              staffField("电话号码", staffInput("请输入电话号码")),
            "em"
          ) +
          '</div><button type="button" class="lb-link-btn" data-staff-add="em">+ 添加联系人</button>' +
          '<h3 class="lb-sec">家庭成员信息</h3><div id="lb-family-list">' +
          staffBlock(
            "家庭成员1",
            staffField("姓名", staffInput("请输入姓名")) +
              staffField("关系", staffInput("请输入关系")) +
              staffField("电话号码", staffInput("请输入电话号码")),
            "family"
          ) +
          '</div><button type="button" class="lb-link-btn" data-staff-add="family">+ 添加家庭成员</button>'
        : "";
    var title = mode === "post" ? "岗位信息" : mode === "info" ? "编辑个人信息" : "新增人员";
    if (mode === "info" && row.name) title = "编辑个人信息";
    window.LB.openDrawer(
      title,
      personal +
        position +
        rest +
        '<div class="lb-drawer-foot"><button type="button" class="lb-btn" data-close-drawer="1">取消</button><button type="button" class="lb-btn lb-btn--primary" data-staff-save="1">确定</button></div>',
      { staff: true }
    );
  }

  function surveyExportScope() {
    var plan = SURVEY_PLANS[state.planIndex] || SURVEY_PLANS[0];
    if (state.left === "all") return { plan: plan.name, weeks: plan.weeks.slice(), all: true };
    var week = plan.weeks[Number(state.left)];
    return { plan: plan.name, weeks: week ? [week] : plan.weeks.slice(), all: !week };
  }

  function surveyPapersFiltered() {
    var titleEl = document.getElementById("lb-export-title");
    var postEl = document.getElementById("lb-export-post");
    var title = titleEl ? titleEl.value.trim() : "";
    var post = postEl ? postEl.value.trim() : "";
    return SURVEY_PAPERS.filter(function (p) {
      if (title && p.title.indexOf(title) < 0) return false;
      if (post && p.target.indexOf(post) < 0) return false;
      return true;
    });
  }

  function updateExportCount() {
    var n = Object.keys(exportPick).filter(function (id) { return exportPick[id]; }).length;
    var el = document.getElementById("lb-export-count");
    if (el) el.textContent = String(n);
    var all = document.getElementById("lb-export-all");
    var boxes = document.querySelectorAll("#lb-export-body [data-paper-id]");
    if (all && boxes.length) {
      var checked = 0;
      boxes.forEach(function (c) { if (c.checked) checked += 1; });
      all.checked = checked === boxes.length;
      all.indeterminate = checked > 0 && checked < boxes.length;
    }
  }

  function renderExportRows() {
    var body = document.getElementById("lb-export-body");
    if (!body) return;
    var list = surveyPapersFiltered();
    body.innerHTML = list.length
      ? list.map(function (p) {
          return (
            "<tr><td><input type=\"checkbox\" data-paper-id=\"" +
            esc(p.id) +
            "\"" +
            (exportPick[p.id] ? " checked" : "") +
            " /></td><td>" +
            esc(p.title) +
            "</td><td>" +
            esc(p.type) +
            "</td><td>" +
            esc(p.target) +
            "</td><td>" +
            esc(p.surveyor) +
            "</td><td>" +
            esc(p.remark) +
            "</td></tr>"
          );
        }).join("")
      : '<tr><td colspan="6" class="lb-export__empty">暂无问卷</td></tr>';
    updateExportCount();
  }

  function openSurveyExport() {
    var scope = surveyExportScope();
    exportPick = {};
    var box = document.getElementById("lb-export");
    if (!box) {
      box = document.createElement("div");
      box.id = "lb-export";
      box.className = "lb-export";
      box.innerHTML =
        '<div class="lb-export__card" role="dialog" aria-modal="true">' +
        '<div class="lb-export__head"><strong>问卷导出</strong><button type="button" class="lb-export__x" data-export-close="1">×</button></div>' +
        '<div class="lb-export__scope" id="lb-export-scope"></div>' +
        '<div class="lb-export__filters">' +
        '<div class="lb-field"><label>问卷</label><input class="lb-input" id="lb-export-title" placeholder="请输入问卷" /></div>' +
        '<div class="lb-field"><label>被调查人岗位</label><input class="lb-input" id="lb-export-post" placeholder="请选择被调查人岗位" /></div>' +
        '<button type="button" class="lb-btn lb-btn--primary" data-export-search="1">查询</button>' +
        "</div>" +
        '<div class="lb-table-wrap"><table class="lb-table"><thead><tr>' +
        '<th class="lb-export__chk"><input type="checkbox" id="lb-export-all" /></th>' +
        "<th>调查问卷</th><th>类型</th><th>被调查对象</th><th>调查对象</th><th>说明</th>" +
        '</tr></thead><tbody id="lb-export-body"></tbody></table></div>' +
        '<div class="lb-export__foot"><span class="lb-export__count">已选择<span id="lb-export-count">0</span>条</span>' +
        '<div class="lb-export__btns"><button type="button" class="lb-btn" data-export-close="1">取消</button>' +
        '<button type="button" class="lb-btn lb-btn--primary" data-export-ok="1">导出</button></div></div></div>';
      document.body.appendChild(box);
    }
    var scopeEl = document.getElementById("lb-export-scope");
    var weekText = scope.all ? "全部周营（" + scope.weeks.join("、") + "）" : scope.weeks.join("、");
    if (scopeEl) {
      scopeEl.innerHTML =
        "<div><span>计划</span>" +
        esc(scope.plan) +
        "</div><div><span>周营</span>" +
        esc(weekText) +
        "</div>";
    }
    var titleEl = document.getElementById("lb-export-title");
    var postEl = document.getElementById("lb-export-post");
    if (titleEl) titleEl.value = "";
    if (postEl) postEl.value = "";
    renderExportRows();
    box.classList.add("is-open");
  }

  function closeSurveyExport() {
    var box = document.getElementById("lb-export");
    if (box) box.classList.remove("is-open");
  }

  function perfPlanContext() {
    var plans = (window.LB_PAGE_CONST && window.LB_PAGE_CONST.plans) || ["当前计划"];
    var idx = 0;
    var m = String(state.left || "").match(/^[pw](\d+)$/);
    if (m) idx = Number(m[1]) || 0;
    if (idx >= plans.length) idx = 0;
    return {
      name: plans[idx],
      weeks: ["第一周", "第二周", "第三周", "第四周", "第五周", "第六周", "第七周"],
      current: "第二周"
    };
  }

  function openPerfImport() {
    var ctx = perfPlanContext();
    var templates = [
      "领袖营助教团-小组助教绩效考核-导入模板",
      "领袖营助教团-助教团长副团绩效考核-导入模板",
      "领袖营统筹办绩效考核-导入模板",
      "领袖营后勤团绩效考核-导入模板",
      "领袖营导师团绩效考核-导入模板"
    ];
    var links = templates.map(function (name) {
      return '<a href="javascript:void(0)" data-act="perfTemplate" data-name="' + esc(name) + '">下载' + esc(name) + "</a>";
    }).join("");
    var checks = ctx.weeks.map(function (week) {
      var on = week === ctx.current ? " checked" : "";
      return '<label style="display:flex;align-items:center;gap:8px;margin:8px 0"><input type="checkbox" data-perf-week="' + esc(week) + '"' + on + " /> " + esc(week) + "</label>";
    }).join("");
    window.LB.openDrawer(
      "导入更新",
      '<p class="lb-hint">计划：' + esc(ctx.name) + "。先按团队下载对应模板，再上传文件。同一份表格按会员ID和岗位写入下方勾选的周营。当时不在该周的人先跳过，等其签到产生绩效时再带上，并标过往携带。已有分数不覆盖。</p>" +
        '<div style="display:flex;gap:24px;align-items:flex-start;margin:12px 0">' +
        '<div style="width:120px;color:#696c69">请选择要上传的文件：</div>' +
        '<div style="display:flex;flex-direction:column;gap:8px">' + links + "</div></div>" +
        '<div style="border:1px dashed #d9d9d9;border-radius:8px;padding:28px;text-align:center;color:#8a908a;margin-bottom:16px">单击或拖动文件到该区域进行上传</div>' +
        "<p style=\"margin:0 0 8px\">写入周营</p><div>" + checks + "</div>" +
        '<div class="lb-drawer-foot"><button type="button" class="lb-btn" data-close-drawer="1">取消</button><button type="button" class="lb-btn lb-btn--primary" data-act="perfImportGo">确定</button></div>',
      { wide: true }
    );
  }

  function showPerfImportResult() {
    var picked = [];
    document.querySelectorAll("[data-perf-week]:checked").forEach(function (el) {
      picked.push(el.getAttribute("data-perf-week"));
    });
    if (!picked.length) {
      window.LB.toast("请选择周营");
      return;
    }
    var rows = [
      ["林晓雯", "LXW8821", "带队助教", picked.slice(0, 2).join("、"), "已写入"],
      ["陈启航", "CQH7601", "导师", "第二周", "已有分数，未覆盖"],
      ["孙悦", "GF32KT7", "助教", "第三周", "该周没有此岗位，已跳过。之后签到产生绩效时会带上，并标过往携带"]
    ];
    var body = rows.map(function (r) {
      return "<tr>" + r.map(function (c) { return "<td>" + esc(c) + "</td>"; }).join("") + "</tr>";
    }).join("");
    window.LB.openDrawer(
      "导入结果",
      "<p class=\"lb-hint\">已按勾选周营处理：" + esc(picked.join("、")) + "。</p>" +
        '<div class="lb-table-wrap"><table class="lb-table"><thead><tr><th>姓名</th><th>会员ID</th><th>岗位</th><th>周营</th><th>结果</th></tr></thead><tbody>' +
        body +
        '</tbody></table></div><div class="lb-drawer-foot"><button type="button" class="lb-btn lb-btn--primary" data-close-drawer="1">知道了</button></div>',
      { wide: true }
    );
  }

  function openRateFailList(action) {
    var rows = [
      ["赵欣然", "S6MULM1", "助教", "助教正团", "6+", "目标岗位不在当前晋升链上"],
      ["孙悦", "GF32KT7", "带队助教", "见习副团", "6++", "薪酬等级不是该岗位已配置的档"],
      ["吴彤", "3N2006", "见习副团", "助教正团", "6+", "评级已经确认，不能再改"],
      ["刘中良", "LZL2201", "导师", "课程导师", "6", "该周营薪酬核算已经提交审批，不能更新级别"]
    ];
    var body = rows.map(function (r) {
      return "<tr>" + r.map(function (c) { return "<td>" + esc(c) + "</td>"; }).join("") + "</tr>";
    }).join("");
    window.LB.openDrawer(
      action + "失败",
      '<p class="lb-hint">本批有问题数据，整批未写入。</p>' +
        '<div class="lb-table-wrap"><table class="lb-table"><thead><tr><th>姓名</th><th>会员ID</th><th>当前岗位</th><th>目标岗位</th><th>薪酬等级</th><th>原因</th></tr></thead><tbody>' +
        body +
        '</tbody></table></div><div class="lb-drawer-foot"><button type="button" class="lb-btn lb-btn--primary" data-close-drawer="1">知道了</button></div>',
      { wide: true }
    );
  }

  function exportMentorArchive() {
    var headers = ["会员ID", "姓名", "电话号码", "所在职级", "所在地区", "所在运营服务单位", "课程ID", "课程名称", "真实授课次数", "虚拟授课次数", "总授课次数", "第一次授课", "更新时间"];
    var lines = [headers.join(",")];
    state.rows.forEach(function (r) {
      lines.push([r.mid, r.name, r.phone, r.level, r.area, r.office, r.courseId, r.course, r.realCount, r.virtualCount, r.totalCount, r.firstTeach, r.updated].join(","));
    });
    var blob = new Blob(["\ufeff" + lines.join("\n")], { type: "text/csv;charset=utf-8" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "领袖营授课档案-记录导出.csv";
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.LB.toast("记录导出已包含第一次授课");
  }

  function openTeachRecords(row) {
    var rows = [
      ["2026暑假广州第二期", "第二周", "A1班", "1班", "2", "课程导师", "2026-10-23 至 2026-10-29", "广东基地A", "已授课", row.latestTeach],
      ["2026暑假广州第二期", "第一周", "A1班", "1班", "1", "课程导师", "2026-10-16 至 2026-10-22", "广东基地A", "已授课", row.firstTeachCode]
    ];
    var body = rows.map(function (r) {
      return "<tr>" + r.map(function (c) { return "<td>" + esc(c) + "</td>"; }).join("") + "</tr>";
    }).join("");
    window.LB.openDrawer(
      "真实授课记录 | " + (row.course || ""),
      '<p class="lb-hint">最新一次是 ' + esc(row.latestTeach) + "。第一次授课时间是 " + esc(row.firstTeach) + "，只记录时间，不拿来顶替最新记录。</p>" +
        '<div class="lb-table-wrap"><table class="lb-table"><thead><tr><th>计划</th><th>周营</th><th>周营班级</th><th>分班</th><th>期数</th><th>岗位</th><th>开营时间</th><th>开营地点</th><th>状态</th><th>班级课表编码</th></tr></thead><tbody>' +
        body + "</tbody></table></div>",
      { wide: true }
    );
  }

  function openTeachRevisions(row) {
    window.LB.openDrawer(
      "虚拟授课记录 | " + (row.course || ""),
      '<div class="lb-table-wrap"><table class="lb-table"><thead><tr><th>修订内容</th><th>备注</th><th>操作人</th><th>操作时间</th></tr></thead><tbody><tr><td>+1</td><td>补录虚拟授课</td><td>余炜烽</td><td>2026-09-02 10:18:00</td></tr></tbody></table></div>',
      { wide: true }
    );
  }

  /* 原型评审第二轮第23条：标杆学员可以修改事迹。
     事迹用于光荣墙。灯布与光荣榜都把事迹按固定区域截断，超出高度宽度加省略号。
     修改不影响已生成的灯布图，但会让光荣榜的预览内容随之更新。 */
  function openEditStory(row) {
    var txt = row.story || "";
    var html = '<div class="lb-desc"><div><b>' + esc(row.name) + "</b>（" + esc(row.sid) + "）　" + esc(row.week || "") + " · " + esc(row.klass || "") + "</div></div>";
    html += '<div class="lb-field"><label><i class="lb-req">*</i>事迹描述</label><textarea class="lb-textarea" id="bm-story" rows="8" maxlength="1200" placeholder="写这位学员在营里做过的具体事，供光荣墙展示">' + esc(txt) + "</textarea></div>";
    html += '<p class="lb-hint">当前 <span id="bm-count">' + txt.length + "</span> 字。光荣墙每张卡片可用高度固定：3 列最多 6 行、4 列 5 行、5 列 4 行，超出自动截断加省略号，不溢出画布。灯布同理。</p>";
    html += '<div class="lb-drawer-foot"><button type="button" class="lb-btn" data-close-drawer="1">取消</button><button type="button" class="lb-btn lb-btn--primary" data-act="bmStorySave" data-row="' + esc(row._id) + '">确定</button></div>';
    window.LB.openDrawer("修改事迹 · " + row.name, html, { wide: true });
    var box = document.getElementById("bm-story");
    var cnt = document.getElementById("bm-count");
    if (box && cnt) {
      box.addEventListener("input", function () { cnt.textContent = box.value.length; });
    }
  }

  function saveStory(id) {
    var box = document.getElementById("bm-story");
    var val = box ? box.value.trim() : "";
    if (!val) {
      window.LB.toast("请填写事迹描述");
      return;
    }
    var row = findRow(id);
    if (!row) return;
    row.story = val;
    row.updated = "2026-11-02 09:30";
    window.LB.closeDrawer();
    renderTable();
    window.LB.toast("事迹已更新，光荣墙预览同步刷新");
  }

  function handleAct(act, row, menu) {
    if (pageId === "salary-calc" && act === "ledger") {
      location.href = "replica.html?p=salary-ledger&note=27";
      return;
    }
    if (pageId === "mentor-lesson-archive") {
      if (act === "recordExport") {
        exportMentorArchive();
        return;
      }
      if (act === "export" || act === "import") {
        window.LB.toast(act === "import" ? "按现网导入档案" : "导出当前列表");
        return;
      }
      if (act === "record" && row) {
        openTeachRecords(row);
        return;
      }
      if (act === "editRecord" && row) {
        openTeachRevisions(row);
        return;
      }
      if (act === "edit" && row) {
        window.LB.openDrawer(
          "修订",
          '<div class="lb-field"><label>修订类型</label><select class="lb-select"><option>增加</option><option>减少</option></select></div><div class="lb-field"><label>修订数量</label><input class="lb-input" placeholder="请输入修订数量" /></div><div class="lb-field"><label>备注</label><textarea class="lb-input" placeholder="请输入备注"></textarea></div><div class="lb-drawer-foot"><button type="button" class="lb-btn" data-close-drawer="1">取消</button><button type="button" class="lb-btn lb-btn--primary" data-close-drawer="1">确定</button></div>',
          { wide: true }
        );
        return;
      }
    }
    if (pageId === "benchmark" && window.LB_POSTER) {
      if (act === "posterTpl") {
        window.LB_POSTER.template();
        return;
      }
      /* 原型评审第二轮第22条：光荣榜是集合榜单，替换原来单张生成的入口。 */
      if (act === "gloria" && window.LB_GLORIA) {
        window.LB_GLORIA.open();
        return;
      }
      if (act === "poster" && row) {
        if (window.LB_POSTER.generate(row)) renderTable();
        return;
      }
      if (act === "posterView" && row) {
        window.LB_POSTER.preview(row);
        return;
      }
      /* 原型评审第二轮第23条：标杆学员可以修改事迹，改完供光荣墙使用。 */
      if (act === "editStory" && row) {
        openEditStory(row);
        return;
      }
      if (act === "bmStorySave") {
        saveStory(row ? row._id : "");
        return;
      }
    }
    var tb = (spec.toolbar || []).filter(function (b) { return b.id === act; })[0];
    var ro = (spec.ops || []).filter(function (o) { return o.id === act; })[0];
    var def = tb || ro || {};
    var label = menu || def.l || act;

    if (pageId === "excellent-honor" && (act === "pass" || act === "veto")) {
      honorDecide(row, act === "pass");
      return;
    }
    if (pageId === "camp-staff" && act === "add") {
      openCampAdd();
      return;
    }
    if (pageId === "student-archive" && act === "add") {
      openStudentCreate();
      return;
    }
    if (pageId === "student-archive" && act === "studentArchiveSave") {
      saveStudentArchive();
      return;
    }
    if (pageId === "student-archive" && act === "saOpenPicker") {
      openSaPicker();
      return;
    }
    if (pageId === "student-archive" && act === "saPickRow") {
      saPickRowSelect(menu || "");
      return;
    }
    if (pageId === "student-archive" && act === "saPickPage") {
      saPickPage(menu || "");
      return;
    }
    if (pageId === "student-archive" && act === "saPickQuery") {
      saPickQuery();
      return;
    }
    if (pageId === "student-archive" && act === "saPickReset") {
      saPickReset();
      return;
    }
    if (pageId === "student-archive" && act === "saPickOk") {
      confirmSaPick();
      return;
    }
    if (pageId === "student-archive" && act === "saPickCancel") {
      closeSaPicker();
      return;
    }
    if (pageId === "student-archive" && act === "saLampConfirm") {
      confirmLampReason();
      return;
    }
    if (pageId === "student-archive" && act === "saLampLog") {
      openLampLog(row || findRow(menu));
      return;
    }
    if (pageId === "salary-pay" && act === "mergeExportOk") {
      confirmMergeExport();
      return;
    }
    if (pageId === "student-archive" && act === "batchLamp") {
      applyBatchLamp();
      return;
    }
    if (pageId === "student-archive" && act === "studyRecord" && row) {
      openStudy(row);
      return;
    }
    if (pageId === "student-archive" && act === "benchRecord" && row) {
      openBench(row);
      return;
    }
    if (pageId === "student-archive" && act === "emotionRecord" && row) {
      openEmotionFollow(row);
      return;
    }
    if (pageId === "student-archive" && act === "studyClose") {
      closeStudy();
      return;
    }
    if (pageId === "camp-staff" && act === "campTalentQuery") {
      renderTalentBody();
      return;
    }
    if (pageId === "camp-staff" && act === "campTalentReset") {
      ["talent-q-name", "talent-q-id", "talent-q-post", "talent-q-phone", "talent-q-region"].forEach(function (id) {
        var el = document.getElementById(id);
        if (el) el.value = "";
      });
      ["talent-q-type", "talent-q-gender"].forEach(function (id) {
        var el = document.getElementById(id);
        if (el) el.value = "";
      });
      renderTalentBody();
      return;
    }
    if (pageId === "camp-staff" && act === "campTalentMore") {
      var more = document.getElementById("talent-more");
      if (more) more.hidden = !more.hidden;
      var moreBtn = document.getElementById("talent-more-btn");
      if (moreBtn && more) moreBtn.textContent = more.hidden ? "展开筛选" : "收起筛选";
      return;
    }
    if (pageId === "camp-staff" && act === "campTalentClose") {
      closeTalentPicker();
      return;
    }
    if (pageId === "camp-staff" && act === "campTalentOk") {
      confirmTalentAdd();
      return;
    }
    if (pageId === "camp-staff" && act === "campEdit" && row) {
      row._edit = menu;
      renderTable();
      return;
    }
    if (pageId === "camp-staff" && act === "campEditCancel" && row) {
      row._edit = "";
      renderTable();
      return;
    }
    if (pageId === "camp-staff" && act === "campImportSave") {
      var importName = document.getElementById("camp-import-name");
      var importWeek = document.getElementById("camp-import-week");
      var importKlass = document.getElementById("camp-import-class");
      finishClassAssign(
        importName ? importName.value : "",
        importWeek ? importWeek.value : "",
        importKlass ? importKlass.value : ""
      );
      return;
    }
    if ((pageId === "talent-pool" || pageId === "camp-staff") && act === "export") {
      exportShadeCsv();
      return;
    }
    if (pageId === "camp-staff" && act === "ie") {
      openShadeImport("camp");
      return;
    }
    if (pageId === "talent-pool" && act === "ie") {
      openShadeImport("talent");
      return;
    }
    if (act === "shadeTemplate") {
      downloadShadeTemplate(menu || "talent");
      return;
    }
    if (pageId === "talent-pool" && act === "shadeImportSave") {
      saveShadeImport();
      return;
    }
    if (pageId === "talent-pool" && (act === "add" || act === "editInfo" || act === "editPost" || def.form === "staff" || def.form === "postPick")) {
      var staffMode = act === "editPost" || def.form === "postPick" ? "post" : act === "editInfo" ? "info" : "add";
      openStaffDrawer(staffMode, row);
      return;
    }
    if (pageId === "recruit-post" && act === "add" && state.left === "all") {
      window.LB.toast("请先选择所属团队");
      return;
    }
    if (act === "add-batch") {
      window.LB.openDrawer("新增批次", formFields([["批次名称", "title"], ["备注", "remark"]]) + '<div class="lb-drawer-foot"><button type="button" class="lb-btn" data-close-drawer="1">取消</button><button type="button" class="lb-btn lb-btn--primary" data-close-drawer="1">确定</button></div>', { wide: true });
      return;
    }
    if (act === "record" || def.form === "postHistory") {
      openHistory();
      return;
    }
    if (act === "edit" && spec.detail === "post" && row) {
      openPostDrawer(row, "edit");
      return;
    }
    if (spec.child && (act === "open-child" || (row && spec.columns && spec.columns[0] && row[spec.columns[0].k] && false))) {
      /* fallthrough */
    }
    if (spec.child && row && (act === spec.columns[0].k || label === spec.columns[0].l)) {
      location.href = "replica.html?p=" + spec.child;
      return;
    }
    if (row && spec.child && act === "openDetail") {
      location.href = "replica.html?p=" + spec.child;
      return;
    }
    if (["salary-calc", "salary-pay", "recruit-list"].indexOf(pageId) >= 0 && row && !act) {
      location.href = "replica.html?p=" + spec.child;
      return;
    }

    if (pageId === "attendance-summary" && act === "confirmAtt") {
      confirmAttendance();
      return;
    }
    if (pageId === "attendance-summary" && act === "confirmAttOk") {
      openConfirmOk(cleanAttendanceRows());
      return;
    }
    if (pageId === "attendance-summary" && act === "confirmAttApply") {
      (state.readyConfirm || []).forEach(function (r) {
        r.attStatus = "已确认";
      });
      state.readyConfirm = [];
      renderTable();
      window.LB.closeDrawer();
      window.LB.toast("考勤已确认");
      return;
    }
    if (def.confirm) {
      window.LB.confirm(def.confirm, function () {
        window.LB.toast(label + "（mock）");
      });
      return;
    }
    if (def.form || tb && tb.form) {
      var form = def.form || tb.form;
      var title = (row ? label + " · " + (row.name || row.title || "") : label);
      if (form === "camp") {
        openCampForm(row);
        return;
      }
      if (form === "post" && row) {
        openPostDrawer(row, "edit");
        return;
      }
      if (form === "dispose") {
        window.LB.openDrawer(title, formFields([["类型", "kind"], ["原因", "reason"], ["天数", "days"], ["说明", "remark"]]) + '<div class="lb-drawer-foot"><button type="button" class="lb-btn" data-close-drawer="1">取消</button><button type="button" class="lb-btn lb-btn--primary" data-close-drawer="1">确定</button></div>', { wide: true });
        return;
      }
      window.LB.openDrawer(
        title,
        (row ? fieldsFromRow(row, true) : formFields([["名称", "name"], ["备注", "remark"]])) +
          '<p class="lb-hint">按现网按钮复刻，提交为 mock。</p>' +
          '<div class="lb-drawer-foot"><button type="button" class="lb-btn" data-close-drawer="1">取消</button><button type="button" class="lb-btn lb-btn--primary" data-close-drawer="1">确定</button></div>',
        { wide: true }
      );
      return;
    }
    if (pageId === "staff-rate" && (act === "ie" || act === "syncLevel")) {
      openRateFailList(act === "ie" ? "导入" : "同步评级");
      return;
    }
    if ((pageId === "perf-pre" || pageId === "perf-mid" || pageId === "perf-post" || pageId === "perf-assess") && act === "ie") {
      openPerfImport();
      return;
    }
    if (act === "perfTemplate") {
      window.LB.toast("已下载" + (menu || "模板"));
      return;
    }
    if (act === "perfImportGo") {
      showPerfImportResult();
      return;
    }
    if (act === "ie" || act === "importArchives" || act === "ieArrange" || act === "ieScore") {
      window.LB.toast(label + "（mock）");
      return;
    }
    if (pageId === "survey-collect" && act === "export") {
      openSurveyExport();
      return;
    }
    if (pageId === "emotion-reg" && act === "export") {
      var link = document.createElement("a");
      link.href = "docs/情绪处理导出模板.xlsx";
      link.download = "情绪处理导出模板.xlsx";
      link.click();
      window.LB.toast("已导出，登记人名称后是登记人ID");
      return;
    }
    if (act === "exportMerge") {
      openMergeExport(row);
      return;
    }
    if (act === "export" || act === "exportLabor" || act === "exportMentor") {
      window.LB.toast(label + "（mock）");
      return;
    }
    window.LB.toast((menu || label) + "（mock）");
  }

  /* 原型评审第二轮第8条：薪酬发放的「导出合并账单」。
     现网来源：viewModules/leaderCampModule/components/SalaryExportDrawer.vue（type=2）。
     原来只有「账单账户类型（个人账户 / 挂靠公司）」一个条件；
     本次增加「计划」和「周营」两个筛选，保证能按基地、按周导出。
     注意：这里改的是「导出合并账单」，不是列表上的普通「导出」（type=680）。 */
  function openMergeExport() {
    var plans = [
      "2026年暑假领袖营【华东基地】",
      "2026年暑假领袖营【广东基地A】",
      "2027年寒假领袖营【广东基地】"
    ];
    var weeks = ["第一周", "第二周", "第三周", "第四周", "第五周", "第六周", "第七周"];
    var html = "";
    html += '<div class="lb-field"><label>计划</label><select class="lb-select" id="mg-plan"><option value="">全部计划</option>' +
      plans.map(function (p) { return '<option value="' + esc(p) + '">' + esc(p) + "</option>"; }).join("") + "</select></div>";
    html += '<div class="lb-field"><label>周营</label><select class="lb-select" id="mg-week"><option value="">全部周营</option>' +
      weeks.map(function (w) { return '<option value="' + esc(w) + '">' + esc(w) + "</option>"; }).join("") + "</select></div>";
    html += '<div class="lb-field"><label><i class="lb-req">*</i>账单账户类型</label><div class="lb-radio-row">' +
      '<label class="lb-radio-label"><input type="radio" name="mg-type" value="个人账户" checked />个人账户</label>' +
      '<label class="lb-radio-label"><input type="radio" name="mg-type" value="挂靠公司" />挂靠公司</label></div></div>';
    html += '<p class="lb-hint">按所选计划与周营，把勾选的发放批次合并成一张账单导出。计划和周营都选「全部」时导全部。接口沿用 leaderCamp/salary/settle/accounts/report/issue/merge/export。</p>';
    html += '<div class="lb-drawer-foot"><button type="button" class="lb-btn" data-close-drawer="1">取消</button><button type="button" class="lb-btn lb-btn--primary" data-act="mergeExportOk">确定</button></div>';
    window.LB.openDrawer("导出合并账单", html, { wide: true });
  }

  function confirmMergeExport() {
    var planEl = document.getElementById("mg-plan");
    var weekEl = document.getElementById("mg-week");
    var typeEl = document.querySelector('[name="mg-type"]:checked');
    var plan = planEl ? planEl.value : "";
    var week = weekEl ? weekEl.value : "";
    var type = typeEl ? typeEl.value : "个人账户";
    var scope = (plan ? plan.replace("2026年暑假领袖营【", "").replace("2027年寒假领袖营【", "").replace("】", "") : "全部计划") + " / " + (week || "全部周营");
    window.LB.confirm("确定导出？" + scope + "，账户类型：" + type + "。", function () {
      window.LB.closeDrawer();
      window.LB.toast("已导出合并账单：" + scope + " · " + type);
    });
  }

  function surveyAnswerHtml(item) {
    if (item.type === 5) {
      if (!item.image) return "-";
      return '<span class="lb-paper-img">' + esc(item.image) + "</span>";
    }
    return esc(item.answer || "-");
  }

  function surveyQuestionHtml(item, index) {
    var tag = item.isCalculate
      ? '<span class="lb-tag-calc">单独计算：<span class="lb-score-red">平均分 ' + esc(item.avgScore) + "</span></span>"
      : "";
    return (
      '<div class="lb-desc lb-desc--stack"><div><b>第' +
      (index + 1) +
      "题</b>" +
      tag +
      "</div><div><b>题目</b>" +
      esc(item.content) +
      "</div><div><b>分数</b>" +
      esc(item.score) +
      "</div><div><b>回答</b>" +
      surveyAnswerHtml(item) +
      '</div></div><div class="lb-paper-split"></div>'
    );
  }

  function openSurveyDetail(row) {
    var parent = row.paperCode === 4;
    var common = row.commonItems || [];
    var items = row.items || [];
    var html =
      '<div class="lb-paper"><div class="lb-title-line">基本信息</div>' +
      '<div class="lb-desc">' +
      "<div><b>问卷调查人</b>" +
      esc(parent ? "-" : row.target || "-") +
      "</div><div><b>调查人岗位</b>" +
      esc(parent ? "-" : row.targetPost || "-") +
      "</div><div><b>问卷填写人</b>" +
      esc(row.filler || "") +
      "</div><div><b>填写人岗位</b>" +
      esc(parent ? "-" : row.fillerPost || "") +
      "</div><div><b>所属计划/周营</b>" +
      esc(row.planWeek || "") +
      "</div><div><b>班级/小组</b>" +
      esc(row.classGroup || "") +
      "</div><div><b>问卷</b>" +
      esc(row.paper || "") +
      "</div><div><b>问卷类型</b>" +
      esc(row.paperType || "") +
      "</div><div><b>问卷得分</b>" +
      esc(row.score) +
      "</div><div><b>有效期</b>" +
      esc(row.valid || "") +
      "</div></div>";
    if (common.length) {
      html += '<div class="lb-title-line">问卷详情-共性题</div>';
      common.forEach(function (item, index) {
        html += surveyQuestionHtml(item, index);
      });
    }
    html += '<div class="lb-title-line">问卷详情' + (row.paperCode === 3 ? "-非共性题" : "") + "</div>";
    items.forEach(function (item, index) {
      html += surveyQuestionHtml(item, index);
    });
    html +=
      '<div class="lb-title-line">系统信息</div><div class="lb-desc"><div><b>创建时间</b>' +
      esc(row.created || "-") +
      "</div><div><b>更新时间</b>" +
      esc(row.updated || "-") +
      "</div></div></div>";
    window.LB.openDrawer("查看问卷", html, { paper: true });
  }

  /* 原型评审第一轮第6条：
     黑 = 永久封禁，不设到期。
     灰 = 一年，从最后一次编辑时间起算，满一年自动转白。
     白 = 正常。
     编辑为灰时记录编辑时间，并据此推算变白日期（编辑日 + 1 年）。 */
  var SHADE_SEED = {
    孙悦: { value: "黑", at: "2026-03-02" },
    赵欣然: { value: "灰", at: "2026-08-20" }
  };

  function shadeStore() {
    try {
      return JSON.parse(sessionStorage.getItem("lb-shade") || "{}");
    } catch (e) {
      return {};
    }
  }

  function shadeRecord(name) {
    var map = shadeStore();
    var rec = map[name] || SHADE_SEED[name];
    if (!rec) return { value: "白", at: "" };
    if (typeof rec === "string") rec = { value: rec, at: "" };
    return { value: rec.value || "白", at: rec.at || "" };
  }

  /* 灰色满一年后自动转白。返回变白日期（字符串 YYYY-MM-DD），黑与白返回空。 */
  function shadeUntil(name) {
    var rec = shadeRecord(name);
    if (rec.value !== "灰" || !rec.at) return "";
    var d = new Date(rec.at);
    if (isNaN(d.getTime())) return "";
    d.setFullYear(d.getFullYear() + 1);
    return d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2);
  }

  function shadeExpired(name) {
    var until = shadeUntil(name);
    if (!until) return false;
    return new Date(until + "T00:00:00").getTime() <= Date.now();
  }

  function todayText() {
    var d = new Date();
    return d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2);
  }

  function shadeOf(name) {
    var rec = shadeRecord(name);
    if (rec.value !== "灰") return rec.value;
    if (shadeExpired(name)) {
      saveShade(name, "白");
      return "白";
    }
    return "灰";
  }

  function saveShade(name, value) {
    var map = shadeStore();
    var prev = map[name] || (typeof SHADE_SEED[name] === "object" ? SHADE_SEED[name] : null);
    if (prev && typeof prev === "string") prev = { value: prev };
    /* 同一状态重复保存不改日期；改成灰或从其他颜色转灰时，以这次编辑时间重新起算一年。 */
    var at = prev && prev.value === value && prev.at ? prev.at : todayText();
    map[name] = { value: value, at: at };
    sessionStorage.setItem("lb-shade", JSON.stringify(map));
  }

  function applyShade(rows) {
    rows.forEach(function (row) {
      row.shade = shadeOf(row.name);
    });
  }

  var KIN_WEEKS = ["第一周", "第二周", "第三周"];
  var KIN_CLASSES = ["A1班", "A2班", "B1班"];
  var KIN_CHILDREN = {
    王敏: [{ name: "王小满", plan: "2026暑假广州第二期", week: "第二周", klass: "A1班" }],
    马丽: [{ name: "李可", plan: "2026暑假广州第二期", week: "第二周", klass: "A1班" }],
    郑海: [{ name: "郑一诺", plan: "2026暑假广州第二期", week: "第二周", klass: "A1班" }]
  };

  function planContext() {
    var plans = (window.LB_PAGE_CONST && window.LB_PAGE_CONST.plans) || ["当前计划"];
    var matched = String(state.left || "").match(/^[pw](\d+)$/);
    var idx = matched ? Number(matched[1]) : 0;
    if (isNaN(idx) || idx >= plans.length) idx = 0;
    return plans[idx] || plans[0];
  }

  /* 原型评审第二轮第18条：原来只判「同班」才提示。
     现在改为：家长与该工作人员的子女，只要在同一个计划 + 同一个周营内，就抛异常，
     不管是否同班。原因是不论同班还是同周营，都会出现利益冲突与跟车确认的重复处理。 */
  function kinHitsOf(name, plan, week) {
    return (KIN_CHILDREN[name] || []).filter(function (child) {
      return child.plan === plan && child.week === week;
    });
  }

  function stampKin(row) {
    var hits = kinHitsOf(row.name, row.plan, row.week);
    row.kinSame = hits.length > 0;
    row.kinHits = hits;
    /* 是否与子女同班。同周营但不同班也算异常，只是原因文案不同。 */
    row.kinSameClass = hits.some(function (child) { return child.klass === row.klass; });
  }

  function kinHoverText(row, hits) {
    var kids = (hits || []).map(function (child) { return child.name + "（" + child.klass + "）"; }).join("、");
    return row.kinSameClass
      ? row.name + "与学员" + kids + "同班"
      : row.name + "与学员" + kids + "同计划周营（不同班）";
  }

  function kinAlertText(row, hits) {
    var kids = (hits || []).map(function (child) { return child.name + "（" + child.klass + "）"; }).join("、");
    var reason = row.kinSameClass
      ? "同班"
      : "同一计划周营但不同班";
    return (
      "异常：" +
      row.name +
      " 与自己的子女 " +
      kids +
      " 在同一个计划「" +
      (row.plan || "") +
      " / " +
      (row.week || "") +
      "」（" +
      reason +
      "）。\n\n" +
      "规则：家长与该工作人员存在亲子关系时，不论是否同班，只要在同一个计划周营内即视为异常，需要统筹重新分配该工作人员的班级或周营。\n" +
      "本次不强制更换，姓名旁保留感叹号，便于后续跟进。"
    );
  }

  function applyKinDesign(rows) {
    if (pageId !== "camp-staff") return;
    var plan = "2026暑假广州第二期";
    rows.forEach(function (row) {
      if (row.name === "王敏") {
        row.plan = plan;
        row.week = "第二周";
        row.klass = "A1班";
        row.levelStatus = "继承评级";
      } else if (row.name === "马丽") {
        row.plan = plan;
        row.week = "第二周";
        row.klass = "A1班";
      } else if (row.name === "郑海") {
        row.plan = plan;
        row.week = "第二周";
        /* 第18条：郑海班级故意与子女不同，用来演示「不同班但同计划周营也算异常」。 */
        row.klass = "A2班";
      } else if (!row.plan) {
        row.plan = plan;
      }
      stampKin(row);
    });
  }


  var CAMP_EDIT_OPTS = {
    post: ["助教", "带队助教", "导师", "统筹办成员", "助教团长"],
    level: ["6", "6+", "6++"],
    klass: KIN_CLASSES
  };
  var campPick = {};

  function campValueEmpty(value) {
    return value == null || value === "" || value === "-" || value === "—";
  }

  function campInline(key, row) {
    var value = row[key];
    if (row._edit === key) {
      var opts = (CAMP_EDIT_OPTS[key] || []).slice();
      if (!campValueEmpty(value) && opts.indexOf(value) < 0) opts.unshift(value);
      return (
        '<span class="lb-inline"><select class="lb-select lb-inline__select" data-camp-edit="' +
        key +
        '" data-row="' +
        esc(row._id) +
        '"><option value="">请选择</option>' +
        opts
          .map(function (opt) {
            return '<option value="' + esc(opt) + '"' + (opt === value ? " selected" : "") + ">" + esc(opt) + "</option>";
          })
          .join("") +
        '</select><button type="button" class="lb-link-btn" data-act="campEditCancel" data-row="' +
        esc(row._id) +
        '">取消</button></span>'
      );
    }
    var text = campValueEmpty(value) ? "" : esc(value);
    var tag = key === "post" && row.crossPost ? ' <span class="lb-tag lb-tag--wait">跨岗</span>' : "";
    return (
      '<span class="lb-inline">' +
      (text ? '<span class="lb-inline__text">' + text + "</span>" : "") +
      tag +
      '<button type="button" class="lb-link-btn" data-act="campEdit" data-menu="' +
      key +
      '" data-row="' +
      esc(row._id) +
      '">编辑</button></span>'
    );
  }

  function commitCampField(row, key, value) {
    if (!row || campValueEmpty(value)) return;
    row[key] = value;
    row._edit = "";
    if (key === "post") row.crossPost = false;
    if (key === "klass") stampKin(row);
    renderTable();
    if (key === "klass" && row.kinSame) window.LB.alert(kinAlertText(row, row.kinHits));
  }

  function finishClassAssign(name, week, klass) {
    var row = state.rows.filter(function (item) { return item.name === name; })[0];
    if (!row) {
      window.LB.toast("名单里没有「" + name + "」");
      return;
    }
    row.plan = planContext();
    row.week = week;
    row.klass = klass;
    row._edit = "";
    stampKin(row);
    window.LB.closeDrawer();
    applyFilter();
    if (row.kinSame) window.LB.alert(kinAlertText(row, row.kinHits));
    else window.LB.toast("已导入");
  }

  function talentSource(person) {
    var row = state.rows.filter(function (item) { return item.name === person.name; })[0];
    return {
      id: person.id,
      name: person.name,
      avatar: person.avatar || "",
      type: (row && row.type) || "全职",
      post: person.post || "—",
      phone: person.phone || "—",
      gender: person.gender || "—",
      age: person.age || "—",
      city: row && row.city && row.city !== "-" ? row.city : "—"
    };
  }

  function talentQuery() {
    var read = function (id) {
      var el = document.getElementById(id);
      return el ? String(el.value || "").trim() : "";
    };
    var q = {
      name: read("talent-q-name"),
      id: read("talent-q-id"),
      type: read("talent-q-type"),
      post: read("talent-q-post"),
      phone: read("talent-q-phone"),
      gender: read("talent-q-gender"),
      region: read("talent-q-region")
    };
    return PEOPLE.map(talentSource).filter(function (item) {
      if (q.name && item.name.indexOf(q.name) < 0) return false;
      if (q.id && String(item.id).indexOf(q.id) < 0) return false;
      if (q.type && item.type !== q.type) return false;
      if (q.post && String(item.post).indexOf(q.post) < 0) return false;
      if (q.phone && String(item.phone).indexOf(q.phone) < 0) return false;
      if (q.gender && item.gender !== q.gender) return false;
      if (q.region && String(item.city).indexOf(q.region) < 0) return false;
      return true;
    });
  }

  function renderTalentBody() {
    var body = document.getElementById("talent-body");
    if (!body) return;
    var rows = talentQuery();
    body.innerHTML = rows
      .map(function (item) {
        var face = item.avatar
          ? '<span class="lb-avatar">' + esc(item.avatar) + "</span>"
          : '<span class="lb-avatar" style="background:#d9d9d9"></span>';
        return (
          "<tr><td><input type=\"checkbox\" data-talent-id=\"" +
          esc(item.id) +
          "\"" +
          (campPick[item.id] ? " checked" : "") +
          " /></td><td>" +
          face +
          "</td><td>" +
          esc(item.name) +
          "</td><td>" +
          esc(item.id) +
          "</td><td>" +
          esc(item.post) +
          "</td><td>" +
          esc(item.type) +
          "</td><td>" +
          esc(item.phone) +
          "</td><td>" +
          esc(item.gender) +
          "</td><td>" +
          esc(item.age) +
          "</td><td>" +
          esc(item.city) +
          "</td></tr>"
        );
      })
      .join("");
    var info = document.getElementById("talent-pager");
    if (info) info.textContent = "共 " + rows.length + " 条记录";
  }

  function paintPickCount() {
    var n = Object.keys(campPick).filter(function (id) { return campPick[id]; }).length;
    var el = document.getElementById("camp-pick-count");
    if (el) el.textContent = "已选择" + n + "条";
  }

  function closeTalentPicker() {
    var box = document.getElementById("lb-picker");
    if (box) box.classList.remove("is-open");
  }

  function addStaffToWeek(person) {
    var plan = planContext();
    var week = "第二周";
    var exists = state.rows.some(function (item) {
      return item.name === person.name && item.plan === plan && item.week === week;
    });
    if (exists) return false;
    var base = state.rows.filter(function (item) { return item.name === person.name; })[0];
    var row = base ? JSON.parse(JSON.stringify(base)) : { name: person.name, id: person.id, avatar: person.avatar || "", phone: person.phone, gender: person.gender, age: person.age, team: person.team };
    row._id = person.id + "-add-" + Date.now();
    row._edit = "";
    row.plan = plan;
    row.week = week;
    row.post = "—";
    row.level = "—";
    row.klass = "—";
    row.group = "—";
    row.crossPost = false;
    row.shade = shadeOf(person.name);
    stampKin(row);
    state.rows.unshift(row);
    return true;
  }

  function placePeople(people) {
    var added = [];
    var skipped = [];
    people.forEach(function (person) {
      if (addStaffToWeek(person)) added.push(person.name);
      else skipped.push(person.name);
    });
    applyFilter();
    if (added.length) window.LB.toast("已添加至" + planContext() + " / 第二周");
    else if (skipped.length) window.LB.toast(skipped.join("、") + "已在当前周营");
  }

  function confirmTalentAdd() {
    var chosen = PEOPLE.filter(function (person) { return campPick[person.id]; });
    if (!chosen.length) {
      window.LB.toast("请选择人员");
      return;
    }
    closeTalentPicker();
    var blacks = chosen.filter(function (person) { return shadeOf(person.name) === "黑"; });
    var rest = chosen.filter(function (person) { return shadeOf(person.name) !== "黑"; });
    if (rest.length) placePeople(rest);
    if (!blacks.length) return;
    window.LB.confirm("【" + blacks.map(function (person) { return person.name; }).join("、") + "】处于“黑”，是否要添加至本计划/周营当中？", function () {
      placePeople(blacks);
    });
  }

  function currentPlanText() {
    var plans = (window.LB_PAGE_CONST && window.LB_PAGE_CONST.plans) || [];
    var idx = parseInt(String(state.left || "").replace(/\D/g, ""), 10);
    var plan = !isNaN(idx) && plans[idx] ? plans[idx] : plans[0] || "当前计划";
    return plan + (String(state.left || "").charAt(0) === "w" ? " / 第二周" : "");
  }

  function openCampAdd() {
    campPick = {};
    var box = document.getElementById("lb-picker");
    if (!box) {
      box = document.createElement("div");
      box.id = "lb-picker";
      box.className = "lb-picker";
      document.body.appendChild(box);
    }
    box.innerHTML =
      '<div class="lb-picker__card" role="dialog" aria-label="人才库">' +
      '<div class="lb-picker__head"><span>人才库</span><button type="button" class="lb-picker__x" data-act="campTalentClose">×</button></div>' +
      '<div class="lb-picker__body">' +
      '<div class="lb-picker__filters">' +
      '<div class="lb-field"><label>姓名</label><input class="lb-input" id="talent-q-name" placeholder="请输入人员姓名" /></div>' +
      '<div class="lb-field"><label>会员ID</label><input class="lb-input" id="talent-q-id" placeholder="请输入会员ID" /></div>' +
      '<div class="lb-field"><label>类型</label><select class="lb-select" id="talent-q-type"><option value="">请选择类型</option><option>全职</option><option>非全职</option></select></div>' +
      '<div class="lb-field"><label>最近岗位</label><input class="lb-input" id="talent-q-post" placeholder="请输入最近担任岗位" /></div>' +
      "</div>" +
      '<div class="lb-picker__filters" id="talent-more" hidden>' +
      '<div class="lb-field"><label>联系电话</label><input class="lb-input" id="talent-q-phone" placeholder="请输入联系电话" /></div>' +
      '<div class="lb-field"><label>性别</label><select class="lb-select" id="talent-q-gender"><option value="">请选择性别</option><option>男</option><option>女</option></select></div>' +
      '<div class="lb-field"><label>地区</label><input class="lb-input" id="talent-q-region" placeholder="请输入地区" /></div>' +
      "</div>" +
      '<div class="lb-picker__tools"><button type="button" class="lb-link-btn" id="talent-more-btn" data-act="campTalentMore">展开筛选</button><span class="lb-picker__grow"></span><button type="button" class="lb-btn lb-btn--primary" data-act="campTalentQuery">查询</button><button type="button" class="lb-btn" data-act="campTalentReset">重置</button></div>' +
      '<div class="lb-table-wrap"><table class="lb-table lb-picker__table"><thead><tr><th><input type="checkbox" id="talent-check-all" /></th><th>照片</th><th>姓名</th><th>会员ID</th><th>最近担任岗位</th><th>类型</th><th>联系电话</th><th>性别</th><th>年龄</th><th>地区</th></tr></thead><tbody id="talent-body"></tbody></table></div>' +
      '<div class="lb-picker__pager" id="talent-pager"></div>' +
      "</div>" +
      '<div class="lb-picker__foot"><span id="camp-pick-count">已选择0条</span><div class="lb-picker__actions"><button type="button" class="lb-btn" data-act="campTalentClose">取消</button><button type="button" class="lb-btn lb-btn--primary" data-act="campTalentOk">确定</button></div></div>' +
      "</div>";
    box.classList.add("is-open");
    renderTalentBody();
    paintPickCount();
  }

  function shadeHeaders(kind) {
    if (kind === "camp") return ["会员ID", "姓名", "黑白灰", "类型", "联系电话", "岗位", "所属团队"];
    return ["会员ID", "姓名", "类型", "联系电话", "性别", "地区", "备注", "黑白灰", "岗位名称"];
  }

  function downloadCsv(filename, headers, rows) {
    var lines = [headers.join(",")];
    rows.forEach(function (row) {
      lines.push(
        row
          .map(function (cell) {
            return '"' + String(cell == null ? "" : cell).replace(/"/g, '""') + '"';
          })
          .join(",")
      );
    });
    var blob = new Blob(["\ufeff" + lines.join("\n")], { type: "text/csv;charset=utf-8" });
    var link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  }

  function shadeHeadHtml(headers) {
    return (
      "<tr>" +
      headers
        .map(function (name) {
          return "<th" + (name === "黑白灰" ? ' style="color:#cf1322"' : "") + ">" + esc(name) + "</th>";
        })
        .join("") +
      "</tr>"
    );
  }

  function downloadShadeTemplate(kind) {
    var headers = shadeHeaders(kind);
    var sample =
      kind === "camp"
        ? [["GF32KT7", "孙悦", "黑", "全职", "13428256979", "助教", "助教团"]]
        : [["LXW8821", "林晓雯", "全职", "13800001101", "女", "广州", "", "白", "带队助教"]];
    downloadCsv(kind === "camp" ? "领袖营人员导入模板.csv" : "人才库导入模板.csv", headers, sample);
    window.LB.toast("已下载模板，表头含黑白灰");
  }

  function exportShadeCsv() {
    var camp = pageId === "camp-staff";
    var headers = shadeHeaders(camp ? "camp" : "talent");
    var rows = (state.rows || []).map(function (row) {
      if (camp) {
        return [row.id || "", row.name || "", row.shade || "白", row.type || "", row.phone || "", row.post || "", row.team || ""];
      }
      return [row.id || "", row.name || "", row.type || "", row.phone || "", row.gender || "", row.city || "", row.remark || "", row.shade || "白", row.post || ""];
    });
    downloadCsv(camp ? "领袖营人员导出.csv" : "人才库导出.csv", headers, rows);
    window.LB.toast("已导出，文件含黑白灰列");
  }

  function openShadeImport(kind) {
    var headers = shadeHeaders(kind);
    var sample =
      kind === "camp"
        ? ["GF32KT7", "孙悦", "黑", "全职", "13428256979", "助教", "助教团"]
        : ["LXW8821", "林晓雯", "全职", "13800001101", "女", "广州", "", "白", "带队助教"];
    var hint =
      kind === "camp"
        ? "下载模板和导出文件都有「黑白灰」列，位于「姓名」之后。人员管理导入不修改这个标识，修改请用人才库导入。"
        : "下载模板在「备注」后是「黑白灰」，再往后是「岗位名称」。只接受黑、灰、白，空着按白。写错的那一行不导入。";
    var html =
      '<p class="lb-hint">' +
      hint +
      '</p><p><button type="button" class="lb-btn" data-act="shadeTemplate" data-menu="' +
      kind +
      '">下载模板</button></p>' +
      '<div class="lb-table-wrap"><table class="lb-table"><thead>' +
      shadeHeadHtml(headers) +
      "</thead><tbody><tr>" +
      sample
        .map(function (cell, index) {
          return "<td" + (headers[index] === "黑白灰" ? ' style="color:#cf1322"' : "") + ">" + esc(cell || "—") + "</td>";
        })
        .join("") +
      "</tr></tbody></table></div>";
    if (kind === "camp") {
      var importNames = ["马丽", "王敏", "郑海", "孙悦"];
      html +=
        '<div class="lb-field"><label>导入人员</label><select class="lb-select" id="camp-import-name">' +
        importNames
          .map(function (personName) {
            return "<option>" + esc(personName) + "</option>";
          })
          .join("") +
        '</select></div><div class="lb-field"><label>周营</label><select class="lb-select" id="camp-import-week">' +
        KIN_WEEKS.map(function (week) {
          return "<option" + (week === "第二周" ? " selected" : "") + ">" + esc(week) + "</option>";
        }).join("") +
        '</select></div><div class="lb-field"><label>班级</label><select class="lb-select" id="camp-import-class">' +
        KIN_CLASSES.map(function (klass) {
          return "<option>" + esc(klass) + "</option>";
        }).join("") +
        '</select></div><p class="lb-hint">确定后直接写入当前左侧所选计划。默认是马丽写入第二周 A1班，与子女李可同班，会先弹窗，班级仍然保留。</p>' +
        '<div class="lb-drawer-foot"><button type="button" class="lb-btn" data-close-drawer="1">取消</button><button type="button" class="lb-btn lb-btn--primary" data-act="campImportSave">确定导入</button></div>';
    }
    if (kind !== "camp") {
      html +=
        '<div class="lb-field"><label>姓名</label><input class="lb-input" id="shade-name" placeholder="与人才库姓名一致" /></div>' +
        '<div class="lb-field"><label>黑白灰</label><input class="lb-input" id="shade-value" placeholder="黑、灰、白，可留空" /></div>' +
        '<div class="lb-drawer-foot"><button type="button" class="lb-btn" data-close-drawer="1">取消</button><button type="button" class="lb-btn lb-btn--primary" data-act="shadeImportSave">确定导入</button></div>';
    }
    window.LB.openDrawer("导入", html, { wide: true });
  }

  function saveShadeImport() {
    var name = (document.getElementById("shade-name").value || "").trim();
    var value = (document.getElementById("shade-value").value || "").trim();
    if (!name) {
      window.LB.toast("请填写姓名");
      return;
    }
    if (!state.rows.some(function (row) { return row.name === name; })) {
      window.LB.toast("人才库没有这个姓名");
      return;
    }
    if (value && value !== "黑" && value !== "灰" && value !== "白") {
      window.LB.toast("「" + name + "」的黑白灰值不对，这一行不导入");
      return;
    }
    saveShade(name, value || "白");
    window.LB.closeDrawer();
    window.LB.toast("已导入");
    state.rows = mockRows();
    applyFilter();
  }

  function honorExtra(name) {
    try {
      var map = JSON.parse(sessionStorage.getItem("lb-talent-honor") || "{}");
      return map[name] || { aide: 0, leader: 0, evals: [] };
    } catch (e) {
      return { aide: 0, leader: 0, evals: [] };
    }
  }

  function grantTalentHonor(row) {
    var map = {};
    try {
      map = JSON.parse(sessionStorage.getItem("lb-talent-honor") || "{}");
    } catch (e) {
      map = {};
    }
    var cur = map[row.name] || { aide: 0, leader: 0, evals: [] };
    if (row.type === "优秀团长") cur.leader += 1;
    else cur.aide += 1;
    cur.evals.push([row.plan, row.week, row.type, row.taskStatus, "2026-10-09"]);
    map[row.name] = cur;
    sessionStorage.setItem("lb-talent-honor", JSON.stringify(map));
  }

  function seedHonorApps() {
    return [
      {
        _id: "ex-1",
        name: "林晓雯",
        plan: "2026暑假广州领袖营",
        week: "第二周",
        type: "优秀助教",
        post: "带队助教",
        score: 98,
        scoreBand: "综合分达标",
        taskStatus: "审批中",
        decl: "我想把这期带队的陪伴方法留下来，让每个孩子都被看见。",
        scores: [["助教副团/见习副团", "陈可、周宁平均", "96"], ["助教正团", "李正", "97"], ["导师正团", "吴正", "100"], ["综合分", "", "98"]],
        highlight: "开营第一天主动补位沉默学员，并在当晚复盘给副团。"
      },
      {
        _id: "ex-2",
        name: "赵欣然",
        plan: "2026暑假广州领袖营",
        week: "第一周",
        type: "优秀助教",
        post: "带队助教",
        score: 86,
        scoreBand: "综合分未达标",
        taskStatus: "未通过",
        decl: "这期我负责小班衔接，希望把家营沟通做得更稳。",
        scores: [["助教副团/见习副团", "陈可", "84"], ["助教正团", "李正", "88"], ["导师正团", "吴正", "86"], ["综合分", "", "86"]],
        highlight: "综合分未达 90，导师正团已写原因。统筹办仍可一票通过。"
      },
      {
        _id: "ex-3",
        name: "吴彤",
        plan: "2026暑假成都领袖营",
        week: "第三周",
        type: "优秀团长",
        post: "助教副团",
        score: 96,
        scoreBand: "综合分达标",
        taskStatus: "审批中",
        decl: "我这期带着两组助教把开营和离营岗位跑顺。",
        scores: [["见习导师", "赵岚", "95"], ["导师副团", "孙衡", "96"], ["导师正团", "吴正", "97"], ["综合分", "", "96"]],
        highlight: "课前隐患排查连续三天无遗漏。"
      },
      {
        _id: "ex-4",
        name: "孙悦",
        plan: "2026暑假成都领袖营",
        week: "第二周",
        type: "优秀团长",
        post: "见习副团",
        score: 86,
        scoreBand: "综合分未达标",
        taskStatus: "未通过",
        decl: "见习副团这一期我主要补班团的会前准备。",
        scores: [["见习导师", "无", "跳过"], ["导师副团", "孙衡", "85"], ["导师正团", "吴正", "87"], ["综合分", "", "86"]],
        highlight: "综合分未达 90，不进统筹办待办。后台仍可一票通过或否决。"
      },
      {
        _id: "ex-5",
        name: "马丽",
        plan: "2025暑假北京领袖营",
        week: "第三周",
        type: "优秀助教",
        post: "带队助教",
        score: 97,
        scoreBand: "综合分达标",
        taskStatus: "已通过",
        decl: "把大班分享会的节奏交给孩子自己主持。",
        scores: [["助教副团/见习副团", "平均", "96"], ["助教正团", "李正", "98"], ["导师正团", "吴正", "97"], ["综合分", "", "97"]],
        highlight: "统筹办已同意。"
      },
      {
        _id: "ex-6",
        name: "李薇",
        plan: "2026寒假深圳领袖营",
        week: "第一周",
        type: "优秀团长",
        post: "助教正团",
        score: 95,
        scoreBand: "综合分达标",
        taskStatus: "已驳回",
        decl: "这期我想把助教例会的跟进记成可复用清单。",
        scores: [["见习导师", "赵岚", "94"], ["导师副团", "孙衡", "95"], ["导师正团", "吴正", "96"], ["综合分", "", "95"]],
        highlight: "统筹办已否决。"
      }
    ];
  }

  function loadHonorApps() {
    try {
      var raw = sessionStorage.getItem("lb-excellent-apps");
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    var rows = seedHonorApps();
    sessionStorage.setItem("lb-excellent-apps", JSON.stringify(rows));
    return rows;
  }

  function saveHonorApps(rows) {
    sessionStorage.setItem("lb-excellent-apps", JSON.stringify(rows));
  }

  function honorOpen(row) {
    return row.taskStatus === "审批中" || row.taskStatus === "未通过";
  }

  function honorDecide(row, pass) {
    if (!row || !honorOpen(row)) return;
    var oneVote = pass && row.scoreBand === "综合分未达标";
    var verb = pass ? (oneVote ? "一票通过" : "通过") : "否决";
    window.LB.confirm("确定要" + verb + "「" + row.name + "」的" + row.type + "申请吗？", function () {
      row.taskStatus = pass ? (oneVote ? "已通过（一票通过）" : "已通过") : "已驳回";
      if (pass) grantTalentHonor(row);
      saveHonorApps(state.rows);
      window.LB.toast(verb + "成功");
      applyFilter();
      var drawer = document.getElementById("lb-drawer");
      if (drawer && drawer.classList.contains("is-open")) openHonorDetail(row);
    });
  }

  function openHonorDetail(row) {
    var lines = (row.scores || [])
      .map(function (s) {
        return "<tr><td>" + esc(s[0]) + "</td><td>" + esc(s[1]) + "</td><td>" + esc(s[2]) + "</td></tr>";
      })
      .join("");
    var actions = honorOpen(row)
      ? '<div class="lb-drawer-foot"><button type="button" class="lb-btn lb-btn--primary" data-act="pass" data-row="' +
        esc(row._id) +
        '">通过</button><button type="button" class="lb-btn lb-btn--danger" data-act="veto" data-row="' +
        esc(row._id) +
        '">否决</button></div>'
      : "";
    window.LB.openDrawer(
      row.name + " · " + row.type,
      '<div class="tp-desc">' +
        "<div><span>计划：</span><em>" + esc(row.plan) + "</em></div>" +
        "<div><span>周营：</span><em>" + esc(row.week) + "</em></div>" +
        "<div><span>岗位：</span><em>" + esc(row.post) + "</em></div>" +
        "<div><span>综合分：</span><em>" + esc(row.score) + " · " + esc(row.scoreBand) + "</em></div>" +
        "<div><span>任务状态：</span><em>" + esc(row.taskStatus) + "</em></div>" +
        "</div><h3 class=\"tp-sec\">" +
        (row.type === "优秀助教" ? "竞选宣言" : "申请自述") +
        "</h3><p>" +
        esc(row.decl || "-") +
        '</p><h3 class="tp-sec">打分</h3><div class="lb-table-wrap"><table class="lb-table"><thead><tr><th>节点</th><th>评分人</th><th>分数</th></tr></thead><tbody>' +
        lines +
        "</tbody></table></div><h3 class=\"tp-sec\">" +
        (row.type === "优秀助教" ? "突出表现" : "闪光点") +
        "</h3><p>" +
        esc(row.highlight || "-") +
        "</p>" +
        actions,
      { wide: true }
    );
  }

  function stampTalent(rows) {
    var packs = [
      {
        aideMark: "已获得",
        leaderMark: "未获得",
        aideApply: 2,
        aidePass: 1,
        leaderApply: 0,
        leaderPass: 0,
        evals: [
          ["2026暑假广州领袖营", "第二周", "优秀助教", "已通过", "2026-07-18"],
          ["2026寒假深圳领袖营", "第一周", "优秀助教", "未通过", "2026-01-20"]
        ]
      },
      {
        aideMark: "已获得",
        leaderMark: "已获得",
        aideApply: 1,
        aidePass: 1,
        leaderApply: 2,
        leaderPass: 1,
        evals: [
          ["2025暑假北京领袖营", "第三周", "优秀助教", "已通过", "2025-08-02"],
          ["2026暑假广州领袖营", "第一周", "优秀团长", "已驳回", "2026-07-06"],
          ["2026暑假广州领袖营", "第二周", "优秀团长", "已通过", "2026-07-19"]
        ]
      },
      {
        aideMark: "未获得",
        leaderMark: "已获得",
        aideApply: 1,
        aidePass: 0,
        leaderApply: 1,
        leaderPass: 1,
        evals: [
          ["2026暑假成都领袖营", "第二周", "优秀助教", "未通过", "2026-07-12"],
          ["2026暑假成都领袖营", "第三周", "优秀团长", "已通过", "2026-07-26"]
        ]
      },
      {
        aideMark: "未获得",
        leaderMark: "未获得",
        aideApply: 0,
        aidePass: 0,
        leaderApply: 0,
        leaderPass: 0,
        evals: []
      }
    ];
    rows.forEach(function (row, i) {
      var pack = packs[i % packs.length];
      Object.keys(pack).forEach(function (k) {
        row[k] = pack[k];
      });
      var plan = (window.LB_PAGE_CONST && window.LB_PAGE_CONST.plans && window.LB_PAGE_CONST.plans[i % window.LB_PAGE_CONST.plans.length]) || "2026暑假广州领袖营";
      row.camps = [
        [plan + " / 第二周", "A1班 / 1组", (row.post || "-") + " / 助教团", "6天", "6", "￥3200", "全程参与", ""],
        [plan + " / 第一周", "A2班 / 2组", (row.post || "-") + " / 助教团", "5天", "6", "￥2800", "全程参与", ""]
      ];
      row.changes = [
        ["1", "新增岗位", "人才库", plan, "助教团", row.post || "-", "-", "6", "", "-", "余炜烽", row.created || "-"],
        ["2", "修改级别", "人员评级", plan, "助教团", row.post || "-", "6", "6+", "本期评级", "-", "余炜烽", row.updated || "-"]
      ];
      if (row.name === "林晓雯") {
        row.changes.push(["3", "修改级别", "人员评级", plan + " | 第二周", "助教团", "见习副团", "6+", "6", "", "-", "余炜烽", row.updated || "-"]);
      }
      var extra = honorExtra(row.name);
      row.aidePass += extra.aide || 0;
      row.leaderPass += extra.leader || 0;
      if (extra.evals && extra.evals.length) row.evals = (row.evals || []).concat(extra.evals);
      row.aideMark = row.aidePass > 0 ? "已获得|" + row.aidePass + "次" : "未获得";
      row.leaderMark = row.leaderPass > 0 ? "已获得|" + row.leaderPass + "次" : "未获得";
      if (talentStatus[row._id]) row.status = talentStatus[row._id];
    });
  }

  var talentRow = null;
  var talentTab = "base";
  var talentCrumb = "";
  var talentStatus = {};
  var talentQ = {};

  function tpPair(label, value) {
    return "<div><span>" + esc(label) + "：</span><em>" + esc(value || "-") + "</em></div>";
  }

  function tpSection(title, act, inner) {
    var edit = act
      ? '<button type="button" class="tp-edit" data-act="' + act + '" data-row="' + esc(talentRow._id) + '">编辑</button>'
      : "";
    return '<section class="tp-block"><div class="tp-block-h"><b>' + esc(title) + "</b>" + edit + "</div>" + (inner || "") + "</section>";
  }

  function tpFilters(fields) {
    var html = '<div class="tp-filters">';
    fields.forEach(function (f) {
      var val = talentQ[f.k] || "";
      if (f.date) {
        html += '<label class="tp-filter"><span>' + esc(f.label) + '</span><input class="lb-input" type="date" data-tq="' + f.k + '" value="' + esc(val) + '" /></label>';
      } else {
        html += '<label class="tp-filter"><input class="lb-input" data-tq="' + f.k + '" placeholder="' + esc(f.ph) + '" value="' + esc(val) + '" /></label>';
      }
    });
    html += '<button type="button" class="lb-btn lb-btn--primary" data-talent-query="1">查询</button>';
    html += '<button type="button" class="lb-btn" data-talent-reset="1">重置</button></div>';
    return html;
  }

  function tpTable(heads, rows) {
    var html = '<div class="lb-table-wrap"><table class="lb-table"><thead><tr>';
    heads.forEach(function (h) {
      html += "<th>" + esc(h) + "</th>";
    });
    html += "</tr></thead><tbody>";
    if (!rows.length) {
      html += '<tr><td class="tp-empty" colspan="' + heads.length + '">暂无数据</td></tr>';
    } else {
      rows.forEach(function (r) {
        html += "<tr>";
        r.forEach(function (c) {
          html += "<td>" + esc(c === "" ? "-" : c) + "</td>";
        });
        html += "</tr>";
      });
    }
    return html + "</tbody></table></div>";
  }

  function talentBaseHtml(row) {
    var photo = row.avatar ? row.avatar : "-";
    var city = row.city && row.city !== "-" ? row.city : "-";
    return (
      tpSection(
        "个人信息",
        "editInfo",
        '<div class="tp-desc">' +
          tpPair("照片", photo) +
          tpPair("出生日期", "1998-01-07") +
          tpPair("6Q账号", row.id) +
          tpPair("户口所在地", city) +
          tpPair("姓名", row.name) +
          tpPair("居住地址", city) +
          tpPair("联系电话", row.phone) +
          tpPair("性别", row.gender) +
          tpPair("国籍", "中国") +
          tpPair("民族", "汉族") +
          tpPair("籍贯", "广东") +
          tpPair("备注", "领袖营工作人员") +
          "</div>"
      ) +
      tpSection(
        "岗位信息",
        "editPost",
        '<div class="tp-desc">' + tpPair("岗位名称", row.post) + tpPair("薪酬等级", "6") + "</div>"
      ) +
      tpSection(
        "证件信息",
        "editInfo",
        '<div class="tp-desc">' +
          tpPair("证件类型", "大陆居民身份证") +
          tpPair("有效期", "2032-08-16") +
          tpPair("证件号", "4401**********1234") +
          "</div>"
      ) +
      tpSection(
        "银行卡信息",
        "editInfo",
        '<div class="tp-desc">' +
          tpPair("银行卡类型", "个人银行卡") +
          tpPair("是否默认", "是") +
          tpPair("关联团队", "助教团") +
          tpPair("开户行号", "105581000013") +
          tpPair("开户行全称", "中国建设银行") +
          tpPair("个人开户银行号", "105581000013") +
          tpPair("开户人名称", row.name) +
          tpPair("开户人身份证", "4401**********1234") +
          tpPair("银行卡号", "6222***********4412") +
          tpPair("开户行所在城市", "广州") +
          "</div>"
      ) +
      tpSection("教育信息", "editInfo", "") +
      tpSection("紧急联系人信息", "editInfo", "") +
      tpSection("家庭成员信息", "editInfo", "") +
      tpSection(
        "系统信息",
        "",
        '<div class="tp-desc">' +
          tpPair("更新人", "余炜烽") +
          tpPair("更新时间", row.updated) +
          tpPair("创建人", "余炜烽") +
          tpPair("创建时间", row.created) +
          "</div>"
      )
    );
  }

  function visibleCamps(row) {
    return (row.camps || [])
      .filter(function (r) {
        if (talentQ.camp && String(r[0]).indexOf(talentQ.camp) < 0) return false;
        if (talentQ.week && String(r[0]).indexOf(talentQ.week) < 0) return false;
        if (talentQ.klass && String(r[1]).indexOf(talentQ.klass) < 0) return false;
        if (talentQ.post && String(r[2]).indexOf(talentQ.post) < 0) return false;
        if (talentQ.team && String(r[2]).indexOf(talentQ.team) < 0) return false;
        return true;
      })
      .map(function (r) {
        return [r[0], r[1], r[2], r[3], r[4], r[5], r[7] || "-"];
      });
  }

  function talentArchiveHtml(row) {
    var evals = row.evals || [];
    return (
      tpFilters([
        { k: "camp", ph: "请输入营地" },
        { k: "week", ph: "请输入周营" },
        { k: "klass", ph: "请输入班级" },
        { k: "post", ph: "请输入岗位" },
        { k: "team", ph: "请输入团队" }
      ]) +
      tpTable(["营地/周营", "班级/小组", "岗位/团队", "出勤天数", "薪酬等级", "薪酬标准", "备注"], visibleCamps(row)) +
      tpSection(
        "优秀头衔记录",
        "",
        '<p class="tp-note">列表标签写成「已获得|次数」，次数是通过次数。这里保留每次申请和通过结果。</p>' +
          '<div class="tp-desc">' +
          tpPair("优秀助教", row.aideMark) +
          tpPair("优秀助教申请 / 通过", row.aideApply + " / " + row.aidePass) +
          tpPair("优秀团长", row.leaderMark) +
          tpPair("优秀团长申请 / 通过", row.leaderApply + " / " + row.leaderPass) +
          "</div>" +
          tpTable(["计划", "周营", "类型", "结果", "时间"], evals)
      )
    );
  }

  function visibleChanges(row) {
    return (row.changes || []).filter(function (r) {
      if (talentQ.changePost && String(r[5]).indexOf(talentQ.changePost) < 0) return false;
      var time = String(r[11] || "").slice(0, 10);
      if (talentQ.timeStart && time < talentQ.timeStart) return false;
      if (talentQ.timeEnd && time > talentQ.timeEnd) return false;
      return true;
    });
  }

  function talentChangeHtml(row) {
    return (
      tpFilters([
        { k: "changePost", ph: "请输入岗位" },
        { k: "timeStart", label: "操作时间", date: true },
        { k: "timeEnd", label: "至", date: true }
      ]) +
      tpTable(["序号", "类型", "来源", "变动周营", "所属团队", "岗位", "变动前级别", "变动后级别", "备注", "凭证", "操作人", "操作时间"], visibleChanges(row))
    );
  }

  function openTalentDetail(row) {
    talentRow = row;
    if (window.LB.closeDrawer) window.LB.closeDrawer();
    var crumb = document.getElementById("lb-crumb-mount");
    if (crumb) {
      if (!talentCrumb) talentCrumb = crumb.innerHTML;
      crumb.innerHTML = talentCrumb.replace("<strong>人才库</strong>", "<span>人才库</span><span>/</span><strong>" + esc(row.name) + "</strong>");
    }
    var menus = [
      ["base", "基本信息"],
      ["archive", "领袖营档案"],
      ["change", "岗位变动记录"]
    ];
    var menuHtml = menus
      .map(function (m) {
        return '<button type="button" class="tp-menu' + (talentTab === m[0] ? " is-on" : "") + '" data-talent-tab="' + m[0] + '">' + m[1] + "</button>";
      })
      .join("");
    var body = talentTab === "archive" ? talentArchiveHtml(row) : talentTab === "change" ? talentChangeHtml(row) : talentBaseHtml(row);
    var locking = row.status === "启用";
    mount.innerHTML =
      '<div class="tp-page"><div class="tp-head"><div><div class="tp-name-row"><span class="tp-name">' +
      esc(row.name) +
      '</span><span class="tp-status' +
      (locking ? " is-on" : "") +
      '">' +
      esc(row.status || "-") +
      '</span></div><div class="tp-type">' +
      esc(row.type || "-") +
      '</div></div><div class="tp-head-actions"><button type="button" class="' +
      (locking ? "lb-btn lb-btn--danger" : "lb-btn lb-btn--primary") +
      '" data-talent-lock="1">' +
      (locking ? "禁用" : "启用") +
      '</button><button type="button" class="lb-btn" data-talent-back="1">返回</button></div></div><div class="tp-body"><aside class="tp-side">' +
      menuHtml +
      '</aside><div class="tp-main">' +
      body +
      "</div></div></div>";
  }

  /* 原型评审第二轮第3条：进入课表再返回时，筛选、左侧选中项、当前页码都要还原，
     不能像以前那样回到第 1 页并清空筛选。 */
  var scheduleQuery = null;
  var scheduleBoardRow = null;

  function captureScheduleQuery() {
    var q = {};
    document.querySelectorAll("#lb-filters [data-fk]").forEach(function (el) {
      q[el.getAttribute("data-fk")] = el.value || "";
    });
    scheduleQuery = { filters: q, page: state.page, left: state.left };
  }

  function openScheduleBoard(row) {
    if (row) scheduleBoardRow = row;
    captureScheduleQuery();
    var title = row.klass || row.ttable || row.week || row.name || "课表";
    mount.innerHTML =
      '<div class="lb-page"><div class="lb-actions"><button type="button" class="lb-btn" data-schedule-back="1">返回上一步</button>' +
      '<button type="button" class="lb-num-btn" data-note-key="scheduleBack"></button></div>' +
      '<h2 class="lb-sec">' + esc(title) + '</h2><p class="lb-hint">' + esc(row.plan || "") + " " + esc(row.week || "") + "</p>" +
      renderTimetableLook(true) +
      '<div class="lb-table-wrap"><table class="lb-table"><thead><tr><th>时间</th><th>课程</th><th>老师</th></tr></thead><tbody>' +
      "<tr><td>09:00-09:40</td><td>晨会</td><td>导师</td></tr><tr><td>10:00-11:30</td><td>主课</td><td>导师</td></tr>" +
      "<tr><td>14:00-15:30</td><td>小组活动</td><td>助教</td></tr><tr><td>19:00-20:30</td><td>分享会</td><td>导师</td></tr>" +
      "</tbody></table></div></div>";
  }

  function openDetail(row) {
    if (pageId === "excellent-honor" && row) {
      openHonorDetail(row);
      return;
    }
    if (pageId === "talent-pool" && row) {
      talentTab = "base";
      talentQ = {};
      openTalentDetail(row);
      return;
    }
    if (pageId === "survey-collect") {
      openSurveyDetail(row);
      return;
    }
    if (spec.detail === "post") {
      openPostDrawer(row, "detail");
      return;
    }
    if (spec.detail === "attendance") {
      openAttDetail(row);
      return;
    }
    if (spec.child) {
      location.href = "replica.html?p=" + spec.child;
      return;
    }
    if ((pageId === "week-schedule" || pageId === "class-schedule") && row) {
      openScheduleBoard(row);
      return;
    }
    window.LB.openDrawer((spec.title || "") + "详情", fieldsFromRow(row, false), { wide: true });
  }

  function renderTax() {
    mount.innerHTML =
      '<div class="lb-page"><div class="lb-tax">' +
      '<h3 class="lb-sec">个税公式</h3>' +
      '<div class="lb-desc"><div><b>公式</b><pre class="lb-pre">应税所得 = 应发金额 − 个税起扣\n个税 = 应税所得 × 扣除百分比\n实发金额 = 应发金额 − 个税</pre></div>' +
      "<div><b>个税起扣</b>5000 元</div><div><b>扣除百分比</b>3%</div></div>" +
      '<p class="lb-hint">现网领袖营一期隐藏编辑入口，本页只读。</p></div></div>';
  }

  function renderScreen() {
    mount.innerHTML =
      '<div class="lb-screen">' +
      '<div class="lb-screen__bar"><strong>领袖营大屏</strong>' +
      '<button type="button" class="lb-btn" data-act="classSign">班级签到</button>' +
      '<button type="button" class="lb-btn" data-act="lobbySign">大堂签到</button>' +
      '<button type="button" class="lb-btn" data-act="undo">撤销</button>' +
      '<button type="button" class="lb-btn" data-act="exportClass">班级签到导出</button>' +
      '<button type="button" class="lb-btn" data-act="exportEnter">入营签到导出</button></div>' +
      '<div class="lb-screen__grid">' +
      '<section><h3>营地概览</h3><p>在营 328 人 · 班级 16</p></section>' +
      '<section><h3>学员实时签到</h3><p>今日入营 42 · 未到 6</p></section>' +
      '<section><h3>学员入营离营</h3><p>入营 310 · 离营 18</p></section>' +
      '<section class="is-wide"><h3>在营人员变动 / 班级考核排名</h3><p>中区可切到班级入营明细、学员明细</p></section>' +
      '<section><h3>就医情况</h3><p>本周就医 3</p></section>' +
      '<section><h3>本周新进导师助教</h3><p>导师 4 · 助教 9</p></section>' +
      '<section><h3>本周连营人员</h3><p>连营 22</p></section>' +
      "</div></div>";
  }

  function cleanAttendanceRows() {
    return state.rows.filter(function (r) {
      return !PENDING_LEAVE[r.name] && r.attStatus !== "已确认";
    });
  }

  function openConfirmOk(targets) {
    if (!targets.length) {
      window.LB.toast("当前没有可确认的人员");
      return;
    }
    state.readyConfirm = targets;
    var html =
      '<p class="lb-ok-tip">校验通过。以下 ' +
      targets.length +
      " 人没有未完结的请假及疑异审批，可以确认考勤。</p>" +
      '<table class="lb-table"><thead><tr><th>姓名</th><th>会员ID</th><th>担任岗位/团队</th><th>确认后状态</th></tr></thead><tbody>' +
      targets
        .map(function (r) {
          return (
            "<tr><td>" +
            esc(r.name) +
            "</td><td>" +
            esc(r.id || "") +
            "</td><td>" +
            esc(r.postTeam || "-") +
            '</td><td><span class="lb-tag lb-tag--ok">已确认</span></td></tr>'
          );
        })
        .join("") +
      '</tbody></table><div class="lb-drawer-foot"><button type="button" class="lb-btn" data-close-drawer="1">取消</button><button type="button" class="lb-btn lb-btn--primary" data-act="confirmAttApply">确定</button></div>';
    window.LB.openDrawer("确认考勤", html, { wide: true });
  }

  function confirmAttendance() {
    var picked = Object.keys(state.selected).filter(function (id) {
      return state.selected[id];
    });
    var targets = picked.length
      ? state.rows.filter(function (r) {
          return picked.indexOf(r._id) >= 0;
        })
      : state.filtered.slice();
    var seen = {};
    var blocked = [];
    targets.forEach(function (r) {
      var hit = PENDING_LEAVE[r.name];
      if (!hit || seen[r.name]) return;
      seen[r.name] = true;
      blocked.push({ name: r.name, id: r.id || "", kind: hit.kind, status: hit.status });
    });
    if (!blocked.length) {
      openConfirmOk(targets.filter(function (r) {
        return r.attStatus !== "已确认";
      }));
      return;
    }
    var html =
      '<p class="lb-jump-tip">以下 ' +
      blocked.length +
      " 人存在未处理完的请假及疑异审批，本次不能确认。请先处理完成后再确认考勤。</p>" +
      '<table class="lb-table"><thead><tr><th>姓名</th><th>会员ID</th><th>单据类型</th><th>审批状态</th><th></th></tr></thead><tbody>' +
      blocked
        .map(function (b) {
          var href = "replica.html?p=leave-exception&name=" + encodeURIComponent(b.name);
          return (
            "<tr><td>" +
            esc(b.name) +
            "</td><td>" +
            esc(b.id) +
            "</td><td>" +
            esc(b.kind) +
            "</td><td>" +
            esc(b.status) +
            '</td><td><a class="lb-link-btn" href="' +
            href +
            '">去处理</a></td></tr>'
          );
        })
        .join("") +
      "</tbody></table>";
    window.LB.openDrawer("无法确认考勤", html, { wide: true });
  }

  /* 原型评审第二轮第2条：字号 / 格子这套控件原来只在课表列表上有，
     点进某个班级或周营的具体课表后就没有了。现在课表页也带同一套，
     并且和列表共用 lb-tt-look 存储，选一次两边都生效。 */
  function renderTimetableLook(onBoard) {
    if (pageId !== "week-schedule" && pageId !== "class-schedule") return "";
    var look = { font: "md", cell: "std" };
    try {
      var saved = JSON.parse(sessionStorage.getItem("lb-tt-look") || "");
      if (saved && saved.font) look.font = saved.font;
      if (saved && saved.cell) look.cell = saved.cell;
    } catch (e) {}
    function btn(kind, value, label) {
      var on = look[kind] === value ? " is-on" : "";
      return '<button type="button" class="lb-tt-btn' + on + '" data-tt-look="' + kind + '" data-v="' + value + '" data-tt-board="' + (onBoard ? "1" : "") + '">' + label + "</button>";
    }
    return (
      '<div class="lb-tt-look' + (onBoard ? " lb-tt-look--board" : "") + '" data-font="' + look.font + '" data-cell="' + look.cell + '">' +
      '<span>字号</span>' +
      btn("font", "sm", "小") + btn("font", "md", "标准") + btn("font", "lg", "大") +
      '<span>格子</span>' + btn("cell", "compact", "紧凑") + btn("cell", "std", "标准") +
      '<span class="lb-tt-note"><button type="button" class="lb-num-btn" data-note-key="timetableLook"></button></span></div>'
    );
  }

  function renderList() {
    var left = renderLeft();
    mount.innerHTML =
      '<div class="lb-page">' +
      (left ? '<div class="lb-split">' + left + '<div class="lb-split__main">' : "") +
      renderFilters() +
      renderToolbar() +
      renderTimetableLook() +
      '<div class="lb-table-wrap"><table class="lb-table"><thead id="lb-thead"></thead><tbody id="lb-tbody"></tbody></table></div>' +
      '<div class="lb-pager"><span id="pager-info"></span><div id="pager-btns"></div></div>' +
      (left ? "</div></div>" : "") +
      "</div>";
    state.rows = mockRows();
    var jumpName = new URLSearchParams(location.search).get("name") || "";
    if (pageId === "leave-exception" && jumpName) {
      var nameInput = document.querySelector('#lb-filters [data-fk="name"]');
      if (nameInput) nameInput.value = jumpName;
      var tip = document.createElement("div");
      tip.className = "lb-jump-tip";
      tip.textContent = "来自考勤汇总校验，已按申请人「" + jumpName + "」定位未完结的请假及疑异单据。";
      var filters = document.getElementById("lb-filters");
      if (filters && filters.parentNode) filters.parentNode.insertBefore(tip, filters);
    }
    var classCode = new URLSearchParams(location.search).get("classCode") || "";
    /* 原型评审第二轮第24条：从基地台账点「看该团队账单」跳过来时，
       自动带上 计划 / 周营 / 团队 三个筛选条件。 */
    if (pageId === "salary-bill") {
      var jp = new URLSearchParams(location.search);
      var jPlan = jp.get("plan") || "";
      var jWeek = jp.get("week") || "";
      var jTeam = jp.get("team") || "";
      if (jPlan || jWeek || jTeam) {
        [["plan", jPlan], ["week", jWeek], ["team", jTeam]].forEach(function (pair) {
          if (!pair[1]) return;
          var el = document.querySelector('#lb-filters [data-fk="' + pair[0] + '"]');
          if (el) el.value = pair[1];
        });
        var bTip = document.createElement("div");
        bTip.className = "lb-jump-tip";
        bTip.textContent = "来自基地台账，已按" + [jPlan ? "计划「" + jPlan + "」" : "", jWeek ? "周营「" + jWeek + "」" : "", jTeam ? "团队「" + jTeam + "」" : ""].filter(Boolean).join("、") + "筛选。";
        var bFilters = document.getElementById("lb-filters");
        if (bFilters && bFilters.parentNode) bFilters.parentNode.insertBefore(bTip, bFilters);
      }
    }    if (pageId === "class-schedule" && classCode && state.rows[0]) {
      state.rows[0].classId = classCode;
      state.rows[0].ttable = "A1班课表";
      state.rows[0].klass = "A1班";
      state.rows[0].week = "第一周";
      var classInput = document.querySelector('#lb-filters [data-fk="classId"]');
      if (classInput) classInput.value = classCode;
      var classTip = document.createElement("div");
      classTip.className = "lb-jump-tip";
      classTip.textContent = "来自领袖营授课档案的第一次授课，已按班级课表编码「" + classCode + "」定位。";
      var classFilters = document.getElementById("lb-filters");
      if (classFilters && classFilters.parentNode) classFilters.parentNode.insertBefore(classTip, classFilters);
    }
    applyFilter();
  }

  if (spec.special === "tax") renderTax();
  else if (spec.special === "screen") renderScreen();
  else if ((spec.special === "ledger" || spec.special === "ledgerBills") && window.LB_LEDGER) window.LB_LEDGER.mount(mount, pageId);
  else if (spec.special === "surveyConfig" && window.LB_SURVEY) window.LB_SURVEY.mount(mount);
  else if (spec.special === "leaveSummary" && window.LB_LEAVE_SUMMARY) window.LB_LEAVE_SUMMARY.mount(mount);
  else renderList();

  document.addEventListener("click", function (e) {
    var t = e.target;
    if (!t) return;
    var lookBtn = t.closest && t.closest("[data-tt-look]");
    if (lookBtn && (pageId === "week-schedule" || pageId === "class-schedule")) {
      var look = { font: "md", cell: "std" };
      try {
        var saved = JSON.parse(sessionStorage.getItem("lb-tt-look") || "");
        if (saved && saved.font) look.font = saved.font;
        if (saved && saved.cell) look.cell = saved.cell;
      } catch (err) {}
      look[lookBtn.getAttribute("data-tt-look")] = lookBtn.getAttribute("data-v");
      sessionStorage.setItem("lb-tt-look", JSON.stringify(look));
      /* 在课表页里切换时只刷新当前课表，不要跳回列表。 */
      if (lookBtn.getAttribute("data-tt-board") === "1" && scheduleBoardRow) {
        openScheduleBoard(scheduleBoardRow);
        return;
      }
      renderList();
      return;
    }
    if (t.closest && t.closest("#lb-export")) {
      if (t.id === "lb-export" || t.closest("[data-export-close]")) {
        closeSurveyExport();
        return;
      }
      if (t.closest("[data-export-search]")) {
        renderExportRows();
        return;
      }
      if (t.closest("[data-export-ok]")) {
        var picked = SURVEY_PAPERS.filter(function (p) { return exportPick[p.id]; });
        if (!picked.length) {
          window.LB.toast("请选择问卷");
          return;
        }
        var scope = surveyExportScope();
        var weekText = scope.all ? "全部周营（" + scope.weeks.join("、") + "）" : scope.weeks.join("、");
        window.LB.confirm(
          "你确定要执行导出操作吗？将导出「" + scope.plan + "」的" + weekText + "，问卷：" + picked.map(function (p) { return p.title; }).join("、") + "。",
          function () {
            closeSurveyExport();
            window.LB.toast("任务创建成功请稍后在下载中心下载");
          }
        );
      }
      return;
    }
    var dropToggle = t.getAttribute && t.getAttribute("data-drop-toggle");
    document.querySelectorAll(".lb-drop").forEach(function (d) {
      if (!dropToggle || d.getAttribute("data-drop") !== dropToggle) d.classList.remove("is-open");
    });
    if (dropToggle) {
      t.closest(".lb-drop").classList.toggle("is-open");
      return;
    }
    var planBox = t.closest(".lb-plan-box");
    if (!planBox) {
      var planMenu = document.getElementById("lb-plan-menu");
      if (planMenu) planMenu.hidden = true;
    }
    if (t.closest("[data-plan-toggle]")) {
      var menu = document.getElementById("lb-plan-menu");
      if (menu) menu.hidden = !menu.hidden;
      return;
    }
    var planOpt = t.closest("[data-plan]");
    if (planOpt && mount.contains(planOpt)) {
      state.planIndex = Number(planOpt.getAttribute("data-plan"));
      state.left = "all";
      var side = mount.querySelector(".lb-plan-side");
      if (side) side.outerHTML = renderLeft();
      applyFilter();
      return;
    }
    var leftBtn = t.closest("[data-left]");
    if (leftBtn && mount.contains(leftBtn)) {
      state.left = leftBtn.getAttribute("data-left");
      if (spec.left === "jobs") {
        document.querySelectorAll("#left-list [data-left]").forEach(function (b) {
          b.classList.toggle("is-on", b.getAttribute("data-left") === state.left);
        });
      } else {
        document.querySelectorAll("[data-left]").forEach(function (b) {
          b.classList.toggle("is-on", b.getAttribute("data-left") === state.left);
        });
      }
      applyFilter();
      return;
    }
    if (t.id === "btn-search") {
      applyFilter();
      return;
    }
    if (t.id === "btn-reset") {
      document.querySelectorAll("#lb-filters [data-fk]").forEach(function (el) {
        el.value = "";
      });
      state.left = spec.left === "plan" ? "p0" : "all";
      applyFilter();
      return;
    }
    var pageBtn = t.closest("[data-page]");
    if (pageBtn && mount.contains(pageBtn)) {
      state.page = Number(pageBtn.getAttribute("data-page"));
      renderTable();
      return;
    }
    if (t.id === "chk-all") {
      var on = t.checked;
      document.querySelectorAll("[data-chk]").forEach(function (c) {
        c.checked = on;
        state.selected[c.getAttribute("data-chk")] = on;
      });
      return;
    }
    if (t.getAttribute("data-chk")) {
      state.selected[t.getAttribute("data-chk")] = t.checked;
      return;
    }
    var drawerEl = document.getElementById("lb-drawer");
    if (drawerEl && drawerEl.contains(t)) {
      if (t.closest("[data-pick-member]")) {
        var pick = document.getElementById("lb-member-pick");
        if (pick) pick.hidden = !pick.hidden;
        return;
      }
      var mem = t.closest("[data-member]");
      if (mem) {
        var serial = drawerEl.querySelector('[name="serialNo"]');
        var real = drawerEl.querySelector('[name="realName"]');
        var mobile = drawerEl.querySelector('[name="mobile"]');
        if (serial) serial.value = mem.getAttribute("data-mid") || "";
        if (real) real.value = mem.getAttribute("data-mname") || "";
        if (mobile) mobile.value = mem.getAttribute("data-mphone") || "";
        var pickBox = document.getElementById("lb-member-pick");
        if (pickBox) pickBox.hidden = true;
        return;
      }
      if (t.closest("[data-staff-del]")) {
        var block = t.closest(".lb-staff-block");
        if (block && block.parentElement.querySelectorAll(".lb-staff-block").length > 1) block.remove();
        return;
      }
      var addKind = t.closest("[data-staff-add]");
      if (addKind) {
        var kind = addKind.getAttribute("data-staff-add");
        var listId = { position: "lb-pos-list", cert: "lb-cert-list", bank: "lb-bank-list", edu: "lb-edu-list", em: "lb-em-list", family: "lb-family-list" }[kind];
        var list = document.getElementById(listId);
        var first = list && list.querySelector(".lb-staff-block");
        if (first) {
          var clone = first.cloneNode(true);
          clone.querySelectorAll("input, textarea").forEach(function (el) {
            if (el.type !== "radio" && el.type !== "checkbox") el.value = "";
          });
          var cap = clone.querySelector(".lb-block-bar span");
          if (cap) cap.textContent = cap.textContent.replace(/\d+/, String(list.querySelectorAll(".lb-staff-block").length + 1));
          list.appendChild(clone);
        }
        return;
      }
      var campMapPick = t.closest("[data-camp-map-pick]");
      if (campMapPick) {
        var pickKey = campMapPick.getAttribute("data-camp-map-pick");
        var item = CAMP_TRAVEL.filter(function (x) { return x.key === pickKey; })[0];
        var names = { airport: "机场位置指示图.png", railway: "火车站位置指示图.png", bus: "大巴位置指示图.png" };
        campDraft[pickKey + "Map"] = names[pickKey] || "位置指示图.png";
        var box = campMapPick.closest(".lb-upload");
        box.classList.add("is-on");
        box.innerHTML = '<span class="lb-upload__thumb">图</span><span class="lb-upload__name">' + esc(campDraft[pickKey + "Map"]) + '</span><button type="button" class="lb-link-btn" data-camp-map-clear="' + pickKey + '">删除</button>';
        window.LB.toast("已选择" + (item ? item.mapLabel : "位置指示图"));
        return;
      }
      var campMapClear = t.closest("[data-camp-map-clear]");
      if (campMapClear) {
        var clearKey = campMapClear.getAttribute("data-camp-map-clear");
        campDraft[clearKey + "Map"] = "";
        var clearBox = campMapClear.closest(".lb-upload");
        clearBox.classList.remove("is-on");
        clearBox.innerHTML = '<button type="button" class="lb-btn" data-camp-map-pick="' + clearKey + '">上传位置指示图</button><span class="lb-upload__hint">选填，限 1 张，建议 jpg / png</span>';
        return;
      }
      if (t.closest("[data-camp-save]")) {
        var campName = drawerEl.querySelector('[name="name"]');
        if (!campName || !campName.value.trim()) { window.LB.toast("请输入营地名称"); return; }
        window.LB.toast("已保存营地，位置指示图已随营地保存");
        window.LB.closeDrawer();
        return;
      }
      if (t.closest("[data-staff-save]")) {
        var serialNo = drawerEl.querySelector('[name="serialNo"]');        var realName = drawerEl.querySelector('[name="realName"]');
        if (serialNo && !serialNo.value) {
          window.LB.toast("请选择会员");
          return;
        }
        if (realName && !realName.value) {
          window.LB.toast("请输入姓名");
          return;
        }
        var shadeEl = drawerEl.querySelector('[name="shade"]');
        if (shadeEl && realName && realName.value) {
          saveShade(realName.value.trim(), shadeEl.value);
          var realShade = shadeOf(realName.value.trim());
          state.rows.forEach(function (item) {
            if (item.name === realName.value.trim()) item.shade = realShade;
          });
          applyFilter();
        }
        window.LB.toast("已保存");
        window.LB.closeDrawer();
        return;
      }
    }
    if (t.closest && t.closest("[data-talent-back]") && talentRow) {
      var savedCrumb = talentCrumb;
      talentRow = null;
      renderList();
      var crumbEl = document.getElementById("lb-crumb-mount");
      if (crumbEl && savedCrumb) crumbEl.innerHTML = savedCrumb;
      return;
    }
    if (t.closest && t.closest("[data-talent-lock]") && talentRow) {
      var locking = talentRow.status === "启用";
      window.LB.confirm("您确定要" + (locking ? "禁用" : "启用") + "吗？", function () {
        talentRow.status = locking ? "禁用" : "启用";
        talentStatus[talentRow._id] = talentRow.status;
        window.LB.toast((locking ? "禁用" : "启用") + "成功");
        openTalentDetail(talentRow);
      });
      return;
    }
    if (t.closest && t.closest("[data-talent-query]") && talentRow) {
      var nextQ = {};
      document.querySelectorAll("[data-tq]").forEach(function (el) {
        nextQ[el.getAttribute("data-tq")] = (el.value || "").trim();
      });
      talentQ = nextQ;
      openTalentDetail(talentRow);
      return;
    }
    if (t.closest && t.closest("[data-talent-reset]") && talentRow) {
      talentQ = {};
      openTalentDetail(talentRow);
      return;
    }
    var talentTabBtn = t.closest && t.closest("[data-talent-tab]");
    if (talentTabBtn && talentRow) {
      talentTab = talentTabBtn.getAttribute("data-talent-tab");
      openTalentDetail(talentRow);
      return;
    }
    var detail = t.getAttribute("data-detail");
    if (t.closest && t.closest("[data-schedule-back]")) {
      var saved = scheduleQuery;
      scheduleBoardRow = null;
      renderList();
      if (saved) {
        /* 还原筛选 */
        Object.keys(saved.filters || {}).forEach(function (key) {
          var input = document.querySelector('#lb-filters [data-fk="' + key + '"]');
          if (input) input.value = saved.filters[key];
        });
        /* 还原左侧选中项（计划 / 周营 / 团队） */
        if (saved.left) {
          state.left = saved.left;
          var side = mount.querySelector(".lb-plan-side");
          if (side) side.outerHTML = renderLeft();
          mount.querySelectorAll("[data-left]").forEach(function (b) {
            b.classList.toggle("is-on", b.getAttribute("data-left") === state.left);
          });
        }
        /* 还原页码：先按筛选重算，但不要跳回第 1 页 */
        var wantPage = saved.page || 1;
        applyFilter(true);
        var pages = Math.max(1, Math.ceil(state.filtered.length / state.pageSize));
        state.page = Math.min(wantPage, pages);
        renderTable();
      }
      window.LB.toast("已返回，筛选条件与页码保留");
      return;
    }
    if (detail) {
      var drow = findRow(detail);
      if (drow) openDetail(drow);
      return;
    }
    var actBtn = t.closest("[data-act]");
    var pickerBox = document.getElementById("lb-picker");
    var studyBox = document.getElementById("lb-study");
    var saPickerBox = document.getElementById("sa-picker");
    if (actBtn && (mount.contains(actBtn) || (document.getElementById("lb-drawer") && document.getElementById("lb-drawer").contains(actBtn)) || (pickerBox && pickerBox.contains(actBtn)) || (studyBox && studyBox.contains(actBtn)) || (saPickerBox && saPickerBox.contains(actBtn)))) {
      var rid = actBtn.getAttribute("data-row");
      handleAct(actBtn.getAttribute("data-act"), rid ? findRow(rid) : null, actBtn.getAttribute("data-menu") || actBtn.getAttribute("data-name"));
      return;
    }
    if (t.getAttribute("data-save") === "1") {
      window.LB.toast("已保存（mock）");
    }
  });

  document.addEventListener("change", function (e) {
    var t = e.target;
    if (t && t.getAttribute && t.getAttribute("data-camp-toggle")) {
      var tKey = t.getAttribute("data-camp-toggle");
      var wrap = t.closest(".lb-camp-travel");
      var body = wrap && wrap.querySelector(".lb-camp-travel__body");
      if (body) body.hidden = t.value !== "1";
      return;
    }
    if (t && t.getAttribute && t.getAttribute("data-lamp")) {
      var lampRow = findRow(t.getAttribute("data-row"));
      if (lampRow && t.value !== lampRow.lamp) {
        /* 第6条：改红黄白必须先填理由，这里先把下拉回退到原值，再开理由抽屉。 */
        var want = t.value;
        t.value = lampRow.lamp;
        openLampReason([lampRow._id], want);
      }
      return;
    }
    if (t && t.getAttribute && t.getAttribute("data-camp-edit")) {
      var editRow = findRow(t.getAttribute("data-row"));
      commitCampField(editRow, t.getAttribute("data-camp-edit"), t.value);
      return;
    }
    if (t && t.id === "talent-check-all") {
      var pickOn = t.checked;
      document.querySelectorAll("#talent-body [data-talent-id]").forEach(function (box) {
        box.checked = pickOn;
        campPick[box.getAttribute("data-talent-id")] = pickOn;
      });
      paintPickCount();
      return;
    }
    if (t && t.getAttribute && t.getAttribute("data-talent-id")) {
      campPick[t.getAttribute("data-talent-id")] = t.checked;
      paintPickCount();
      return;
    }
    if (t && t.closest && t.closest("#lb-export")) {
      if (t.id === "lb-export-all") {
        var on = t.checked;
        document.querySelectorAll("#lb-export-body [data-paper-id]").forEach(function (c) {
          c.checked = on;
          exportPick[c.getAttribute("data-paper-id")] = on;
        });
        updateExportCount();
        return;
      }
      if (t.getAttribute("data-paper-id")) {
        exportPick[t.getAttribute("data-paper-id")] = t.checked;
        updateExportCount();
        return;
      }
    }
    var drawerEl = document.getElementById("lb-drawer");
    if (!t || !drawerEl || !drawerEl.contains(t)) return;
    if (t.getAttribute("data-staff-type") === "1") {
      var fullTime = t.value === "1";
      drawerEl.querySelectorAll("[data-settle]").forEach(function (el) {
        el.hidden = !fullTime;
      });
    }
    if (t.getAttribute("data-bank-type") === "1") {
      var block = t.closest(".lb-staff-block");
      var company = t.value === "2";
      if (block) {
        block.querySelectorAll("[data-company]").forEach(function (el) {
          el.hidden = !company;
        });
        block.querySelectorAll("[data-personal]").forEach(function (el) {
          el.hidden = company;
        });
        block.querySelectorAll(".lb-field").forEach(function (el) {
          var lab = el.querySelector("label");
          if (lab && /联行号/.test(lab.textContent)) lab.textContent = company ? "公司帐户联行号" : "个人帐户联行号";
        });
      }
    }
  });

  var leftQ = document.getElementById("left-q");
  if (leftQ) leftQ.addEventListener("input", applyFilter);

  document.addEventListener("mouseover", function (e) {
    var mark = e.target && e.target.closest && e.target.closest(".lb-kin-warn");
    var tip = document.getElementById("lb-kin-tip");
    if (!mark) {
      if (tip) tip.hidden = true;
      return;
    }
    if (!tip) {
      tip = document.createElement("div");
      tip.id = "lb-kin-tip";
      tip.className = "lb-kin-tip";
      document.body.appendChild(tip);
    }
    tip.textContent = mark.getAttribute("data-kin-tip") || "";
    tip.hidden = false;
    var rect = mark.getBoundingClientRect();
    var left = rect.left + rect.width / 2;
    var width = tip.offsetWidth;
    if (left - width / 2 < 8) left = width / 2 + 8;
    if (left + width / 2 > window.innerWidth - 8) left = window.innerWidth - width / 2 - 8;
    tip.style.left = left + "px";
    tip.style.top = rect.bottom + 8 + "px";
  });
})();
