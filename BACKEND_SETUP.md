# Simpex Backend Setup

这版后端先走微信云开发，目标是先把小程序从静态原型升级成可读、可报名、可沉淀个人主页的 MVP。

## 当前已接好的能力

- 小程序启动时初始化云环境
- 自动获取当前用户会话
- 发现页读取空间和话题列表
- 话题详情页读取真实数据
- 话题报名写入 `topic_applications`
- 个人主页读取用户和“我的事件”
- 人物页读取人物档案与关联事件

## 你需要在微信开发者工具里做的事

1. 开通云开发环境
2. 记录你的云环境 ID
3. 在 [lib/backend/index.js](/Users/zhenyu/Desktop/Simpex/simpex_ui/simpex/lib/backend/index.js) 里，把 `replace-with-your-cloud-env-id` 改成真实环境 ID
4. 在云开发数据库里创建这些集合：
   - `simpex_users`
   - `simpex_venues`
   - `simpex_topics`
   - `simpex_people`
   - `simpex_profile_events`
   - `simpex_official_events`
   - `simpex_topic_applications`
5. 右键部署云函数 `cloudfunctions/api`

## 首次运行会发生什么

- `app.onLaunch` 会先调用 `bootstrap`
- 如果数据库是空的，云函数会自动写入第一批种子数据
- 如果云环境没配好，前端会自动回退到本地 mock，不会直接白屏

## 明天白天建议优先做的两件事

1. 把“最近状态 -> 可发起话题”的 AI 提示词链路做出来
2. 给 `topic_applications`、用户资料、我的事件 增加真正的写操作和后台管理
