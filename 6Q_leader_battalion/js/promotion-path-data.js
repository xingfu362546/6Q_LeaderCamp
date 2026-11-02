window.LB_PATHS = [
  {
    id: "path-aide-lead-line",
    team: "助教团",
    name: "带队线",
    /* 原型评审第二轮第25条：每一级可以是一个岗位集合（多选），按集合配置。 */
    stages: [
      { name: "第 1 级", postIds: ["aide-lead-train"] },
      { name: "第 2 级", postIds: ["aide-vice-intern", "aide-vice"] },
      { name: "第 3 级", postIds: ["aide-chief"] }
    ]
  },
  {
    id: "path-mentor-line",
    team: "导师团",
    name: "导师主线",
    stages: [
      { name: "第 1 级", postIds: ["mentor", "mentor-course"] },
      { name: "第 2 级", postIds: ["mentor-lead"] }
    ]
  }
];
