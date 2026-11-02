/**
 * v3.4.0 复刻菜单：按现网 leaderCampModule 路由铺齐。
 */
window.LB_MENU = {
  version: "v3.4.0",
  topNav: [
    { id: "biz-6q", label: "6Q业务" },
    { id: "live", label: "直播" },
    { id: "schedule", label: "排课管理" },
    { id: "bbs", label: "社区" },
    { id: "eq-mentor", label: "高EQ导师管理" },
    { id: "angel", label: "传播天使管理" },
    { id: "plan", label: "计划与实施" },
    { id: "lingxiu-pay", label: "领袖营薪酬板块", current: true },
    { id: "points", label: "积分管理" },
    { id: "video", label: "视频号管理" },
    { id: "one2one", label: "一对一服务" }
  ],

  eqMenu: [
    {
      id: "eq-archives",
      label: "档案管理",
      children: [
        { id: "mentor-lesson-archive", label: "领袖营授课档案", href: "replica.html?p=mentor-lesson-archive" }
      ]
    }
  ],

  /* 计划与实施 → 会务工具。按现网 implementation/affairsTool 路由复刻。 */
  planMenu: [
    {
      id: "affairs-tool",
      label: "会务工具",
      children: [
        { id: "venue-manage", label: "场地管理", href: "placeholder.html?m=venue-manage&label=%E5%9C%BA%E5%9C%B0%E7%AE%A1%E7%90%86" },
        { id: "camp-manage", label: "营地管理", href: "replica.html?p=camp-manage", badge: "v3.5.0" }
      ]
    }
  ],

  sideMenu: [
    {
      id: "staff",
      label: "工作人员管理",
      children: [
        { id: "talent-pool", label: "人才库", href: "replica.html?p=talent-pool" },
        { id: "excellent-honor", label: "优秀助教/团长管理", href: "replica.html?p=excellent-honor" },
        { id: "recruit-record", label: "人员招募记录", href: "replica.html?p=recruit-record" },
        { id: "camp-staff", label: "领袖营人员管理", href: "replica.html?p=camp-staff" },
        { id: "class-manage", label: "班级管理", href: "replica.html?p=class-manage" },
        {
          id: "camp-schedule",
          label: "领袖营课表",
          children: [
            { id: "week-schedule", label: "周营课表", href: "replica.html?p=week-schedule" },
            { id: "class-schedule", label: "班级课表", href: "replica.html?p=class-schedule" }
          ]
        },
        { id: "cross-mentor", label: "跨班导师", href: "replica.html?p=cross-mentor" }
      ]
    },
    {
      id: "attendance",
      label: "考勤管理",
      children: [
        { id: "checkin-record", label: "签到记录", href: "replica.html?p=checkin-record" },
        { id: "leave-exception", label: "请假及疑异处理", href: "replica.html?p=leave-exception" },
        { id: "attendance-summary", label: "考勤汇总", href: "replica.html?p=attendance-summary" },
        { id: "early-camp", label: "提前入营/连营管理", href: "replica.html?p=early-camp" }
      ]
    },
    {
      id: "perf-rate",
      label: "绩效评级",
      children: [
        { id: "perf-pre", label: "营前绩效", href: "replica.html?p=perf-pre" },
        { id: "perf-mid", label: "营中绩效", href: "replica.html?p=perf-mid" },
        { id: "perf-post", label: "营后绩效", href: "replica.html?p=perf-post" },
        { id: "perf-assess", label: "绩效考核", href: "replica.html?p=perf-assess" },
        { id: "staff-rate", label: "人员评级", href: "replica.html?p=staff-rate" },
        { id: "mentor-review", label: "导师督评", href: "replica.html?p=mentor-review" },
        { id: "class-assess", label: "班级考核", href: "replica.html?p=class-assess" },
        { id: "safety-assess", label: "安全考核", href: "replica.html?p=safety-assess" },
        { id: "survey-collect", label: "问卷收集", href: "replica.html?p=survey-collect" }
      ]
    },
    {
      id: "salary",
      label: "薪酬管理",
      children: [
        { id: "salary-calc", label: "薪酬核算", href: "replica.html?p=salary-calc" },
        { id: "salary-bill", label: "薪酬账单", href: "replica.html?p=salary-bill" },
        { id: "salary-pay", label: "薪酬发放", href: "replica.html?p=salary-pay" },
        { id: "salary-ledger", label: "基地台账", href: "replica.html?p=salary-ledger" },
        { id: "leave-summary", label: "离营总表", href: "replica.html?p=leave-summary", badge: "v3.5.0" }
      ]
    },
    {
      id: "basic",
      label: "基础设置",
      children: [
        { id: "post-salary", label: "岗位基准薪酬", href: "replica.html?p=post-salary" },
        { id: "promotion-path", label: "晋升路线配置", href: "promotion-path.html" },
        { id: "survey-config", label: "问卷配置", href: "replica.html?p=survey-config" },
        { id: "question-bank", label: "题库配置", href: "replica.html?p=question-bank" },
        { id: "wage-item", label: "工资项配置", href: "replica.html?p=wage-item" },
        { id: "tax-setting", label: "个税设置", href: "replica.html?p=tax-setting" },
        { id: "reason-setting", label: "申请原因设置", href: "replica.html?p=reason-setting" },
        { id: "compare-setting", label: "评比项目设置", href: "replica.html?p=compare-setting" },
        {
          id: "schedule-setting",
          label: "课表设置",
          children: [
            { id: "schedule-tpl", label: "领袖营课表模板", href: "replica.html?p=schedule-tpl" },
            { id: "camp-timetable", label: "课表配置", href: "replica.html?p=camp-timetable" }
          ]
        }
      ]
    },
    {
      id: "recruit-train",
      label: "招募培训",
      children: [
        { id: "recruit-post", label: "招聘岗位配置", href: "replica.html?p=recruit-post" },
        { id: "recruit-list", label: "招募列表", href: "replica.html?p=recruit-list" },
        { id: "staff-train", label: "人员培训", href: "replica.html?p=staff-train" },
        { id: "accept-exam", label: "验收考试", href: "replica.html?p=accept-exam" }
      ]
    },
    {
      id: "student-file",
      label: "学员档案",
      children: [
        { id: "student-archive", label: "学员档案", href: "replica.html?p=student-archive" },
        { id: "benchmark", label: "标杆学员档案室", href: "replica.html?p=benchmark" }
      ]
    },
    { id: "student-award", label: "学员评优", href: "student-award.html" },
    { id: "camp-screen", label: "领袖营大屏", href: "replica.html?p=camp-screen" },
    { id: "emotion-reg", label: "情绪处理登记", href: "replica.html?p=emotion-reg" },
    { id: "medical-reg", label: "就医记录管理", href: "replica.html?p=medical-reg" }
  ],
  bizMenu: [
    { id: "biz-auth", label: "权限管理", href: "placeholder.html?m=biz-auth&label=%E6%9D%83%E9%99%90%E7%AE%A1%E7%90%86" },
    { id: "biz-work", label: "工作台", href: "placeholder.html?m=biz-work&label=%E5%B7%A5%E4%BD%9C%E5%8F%B0" },
    { id: "biz-user", label: "用户管理", href: "placeholder.html?m=biz-user&label=%E7%94%A8%E6%88%B7%E7%AE%A1%E7%90%86" },
    { id: "biz-offline", label: "线下课程管理", href: "placeholder.html?m=biz-offline&label=%E7%BA%BF%E4%B8%8B%E8%AF%BE%E7%A8%8B%E7%AE%A1%E7%90%86" },
    {
      id: "biz-camp",
      label: "领袖营",
      children: [
        { id: "biz-product", label: "领袖营产品", href: "placeholder.html?m=biz-product&label=%E9%A2%86%E8%A2%96%E8%90%A5%E4%BA%A7%E5%93%81" },
        { id: "biz-stage", label: "营期管理", href: "placeholder.html?m=biz-stage&label=%E8%90%A5%E6%9C%9F%E7%AE%A1%E7%90%86" },
        { id: "biz-goods", label: "领袖营商品", href: "placeholder.html?m=biz-goods&label=%E9%A2%86%E8%A2%96%E8%90%A5%E5%95%86%E5%93%81" },
        {
          id: "implement",
          label: "实施管理",
          children: [
            { id: "camp-implement", label: "领袖营实施", href: "camp-implement.html" },
            { id: "quota-enquiry", label: "周营名额查询", href: "placeholder.html?m=quota-enquiry&label=%E5%91%A8%E8%90%A5%E5%90%8D%E9%A2%9D%E6%9F%A5%E8%AF%A2" },
            { id: "connect-camp", label: "连营管理", href: "connect-camp.html" },
            { id: "biz-enroll-student", label: "报读学员", href: "placeholder.html?m=biz-enroll-student&label=%E6%8A%A5%E8%AF%BB%E5%AD%A6%E5%91%98" },
            { id: "biz-study", label: "学习档案", href: "placeholder.html?m=biz-study&label=%E5%AD%A6%E4%B9%A0%E6%A1%A3%E6%A1%88" },
            { id: "biz-cert", label: "学员证书", href: "placeholder.html?m=biz-cert&label=%E5%AD%A6%E5%91%98%E8%AF%81%E4%B9%A6" },
            { id: "biz-sign-record", label: "报读记录", href: "placeholder.html?m=biz-sign-record&label=%E6%8A%A5%E8%AF%BB%E8%AE%B0%E5%BD%95" },
            { id: "biz-survey", label: "调查问卷", href: "placeholder.html?m=biz-survey&label=%E8%B0%83%E6%9F%A5%E9%97%AE%E5%8D%B7" },
            { id: "biz-travel-task", label: "迎接欢送任务管理", href: "placeholder.html?m=biz-travel-task&label=%E8%BF%8E%E6%8E%A5%E6%AC%A2%E9%80%81%E4%BB%BB%E5%8A%A1%E7%AE%A1%E7%90%86" }
          ]
        }
      ]
    },
    { id: "biz-online", label: "线上课程管理", href: "placeholder.html?m=biz-online&label=%E7%BA%BF%E4%B8%8A%E8%AF%BE%E7%A8%8B%E7%AE%A1%E7%90%86" },
    { id: "biz-operate", label: "运营管理", href: "placeholder.html?m=biz-operate&label=%E8%BF%90%E8%90%A5%E7%AE%A1%E7%90%86" },
    { id: "biz-order", label: "订单中心", href: "placeholder.html?m=biz-order&label=%E8%AE%A2%E5%8D%95%E4%B8%AD%E5%BF%83" },
    { id: "biz-store", label: "6Q商城", href: "placeholder.html?m=biz-store&label=6Q%E5%95%86%E5%9F%8E" }
  ]
};
