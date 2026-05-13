# 易占 - 多端架构规划

> 目标：一套核心算法 + 一套数据，支撑 Web / iOS / 微信小程序 三端

---

## 1. 整体架构

```
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│     Web App     │  │   微信小程序    │  │    iOS App      │
│  (当前实现)     │  │   (预留)        │  │   (预留)        │
├─────────────────┤  ├─────────────────┤  ├─────────────────┤
│  UI (HTML/CSS)  │  │  WXML/WXSS      │  │  SwiftUI/UIKit  │
│  App Controller │  │  Page JS        │  │  ViewModel      │
├─────────────────┤  ├─────────────────┤  ├─────────────────┤
│  DAL (fetch)    │  │  DAL (wx.req)   │  │  DAL (URLSess)  │
│  Algorithm JS   │  │  Algorithm JS   │  │  Algorithm Swift│
├─────────────────┤  ├─────────────────┤  ├─────────────────┤
│  data/*.json    │  │  data/*.json    │  │  Bundle JSON    │
│  (本地静态)     │  │  (本地缓存)     │  │  (本地缓存)     │
└─────────────────┘  └─────────────────┘  └─────────────────┘
          │                   │                   │
          └───────────────────┼───────────────────┘
                              │
                    ┌─────────┴─────────┐
                    │   后端 API 服务    │
                    │  (Node/Go/Python) │
                    └─────────┬─────────┘
                              │
                    ┌─────────┴─────────┐
                    │    PostgreSQL     │
                    │   (hexagrams DB)  │
                    └───────────────────┘
```

---

## 2. 当前 Web 端结构（已实现）

```
jamb.ai_web/
├── data/                           # 纯数据（JSON），可被任何端消费
│   ├── hexagrams.json              # 64卦完整文本（来源：OracleLang）
│   ├── bagua.json                  # 八卦基础数据
│   └── divination-rules.json       # 八宫、纳甲、世应、六亲规则
│
├── js/
│   ├── core/
│   │   ├── dal.js                  # 数据访问层（支持 local/api 双模式）
│   │   ├── data.js                 # 静态规则数据（兼容层）
│   │   ├── utils.js                # 工具函数（农历、五行、渲染）
│   │   └── yijing-text.js          # 本地静态文本回退
│   ├── modules/
│   │   ├── meihua.js               # 梅花易数算法（纯逻辑，无 DOM）
│   │   └── liuyao.js               # 六爻算法（纯逻辑，无 DOM）
│   └── app.js                      # UI 控制器 + 路由
│
├── css/
│   ├── chinese_style.css           # 中式墨韵暗色主题
│   └── western_style.css           # 西式神秘主题（占位）
│
└── docs/
    ├── chinese_algorithm.md        # 中式算法文档
    ├── western_algorithm.md        # 西式算法文档（占位）
    ├── api_spec.md                 # API 接口规范
    └── multi_platform_architecture.md  # 本文档
```

---

## 3. 各端迁移要点

### 3.1 微信小程序

**复用清单：**
- ✅ `data/*.json` — 可作为本地资源或通过网络加载
- ✅ `js/core/dal.js` — 将 `fetch` 替换为 `wx.request`
- ✅ `js/modules/meihua.js` / `liuyao.js` — 可直接复制到小程序 utils 目录
- ⚠️ `js/core/utils.js` — 需替换 `fetch` 调用，农历库需替换为小程序兼容版本

**小程序特有适配：**
- 使用 `wx.getSystemInfoSync()` 获取屏幕宽度适配布局
- 铜钱动画改用 CSS3 或小程序 animation API
- 分享功能使用 `onShareAppMessage`

### 3.2 iOS App (Swift)

**复用清单：**
- ✅ `data/*.json` — 打包到 App Bundle 中，首次启动加载到 Core Data / SQLite
- ⚠️ 算法逻辑 — 需将 JS 算法翻译为 Swift，或内嵌 JS 引擎（JavaScriptCore）

**推荐方案：JavaScriptCore 内嵌**
```swift
import JavaScriptCore

let context = JSContext()
// 加载 meihua.js + liuyao.js + data.js
// 通过 JSExport 协议桥接 Swift ↔ JS
```

**优势：**
- 算法逻辑零修改复用
- DAL 可在 Swift 层重写，对接后端 API

**备选方案：纯 Swift 重写**
- 将 `js/modules/` 中的算法翻译为 Swift Struct/Class
- 数据层使用 Codable 解析 JSON

### 3.3 后端服务

**职责：**
1. 提供 `data/*.json` 的 REST API 版本
2. 用户账户体系（可选）
3. 占卜记录存储
4. 付费/会员内容控制（如逐爻白话为付费内容）

**技术栈建议：**
- Node.js + Express/Fastify（与前端同语言，便于共享算法）
- 或 Go + Gin（高性能）
- 数据库：PostgreSQL + JSONB 存储卦象数据

---

## 4. 数据版本管理

当前 `data/*.json` 已包含版本字段：

```json
{
  "version": "1.0.0",
  "source": "OracleLang (github.com/ydzat/OracleLang)",
  "updated": "2026-05-13",
  ...
}
```

**版本策略：**
- 前端打包时包含默认数据版本
- 启动时向后端查询最新版本号
- 若后端版本 > 本地版本，则增量更新 JSON 数据
- 文本内容（如白话释义）可独立版本控制

---

## 5. 后续迭代建议

| 优先级 | 事项 | 说明 |
|--------|------|------|
| P0 | 逐爻白话填充 | `hexagrams.json` 中 `yaoCi[].baihua` 当前为空，需补充 |
| P1 | 后端服务搭建 | 部署 API 服务，提供用户体系和记录存储 |
| P2 | 小程序移植 | 复用现有 JS 算法，重写 UI 层 |
| P3 | iOS App | 评估 JavaScriptCore vs 纯 Swift 方案 |
| P4 | 西式模块 | 实现 `western_algorithm.md` 中的塔罗/占星模块 |
