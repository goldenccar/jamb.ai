# 易占 API 接口规范

> 版本：v1.0.0  
> 状态：预留设计，待后端服务就绪后实现  
> 设计目标：支持 Web / iOS App / 微信小程序 三端共享同一套数据接口

---

## 1. 基础约定

### 1.1 通信协议
- 协议：HTTPS
- 数据格式：JSON
- 编码：UTF-8
- 时间格式：ISO 8601（`YYYY-MM-DDTHH:mm:ssZ`）

### 1.2 响应结构

```typescript
interface ApiResponse<T> {
    code: number;       // 0 = 成功，非0 = 业务错误码
    message: string;    // 提示信息
    data: T;            // 业务数据
}
```

### 1.3 错误码

| 错误码 | 含义 |
|--------|------|
| 0 | 成功 |
| 1001 | 参数非法 |
| 1002 | 资源不存在 |
| 2001 | 起卦参数错误 |
| 5000 | 服务器内部错误 |

---

## 2. 数据接口

### 2.1 获取六十四卦列表

```
GET /api/v1/hexagrams
```

**响应：**
```json
{
    "code": 0,
    "message": "ok",
    "data": [
        {
            "id": 1,
            "name": "乾为天",
            "upperTrigram": "乾",
            "lowerTrigram": "乾",
            "guaCi": "元亨利贞。",
            "guaCiBaihua": "乾卦代表天，象征刚健..."
        }
    ]
}
```

### 2.2 获取单卦详情

```
GET /api/v1/hexagrams/:id
```

**参数：**
- `id`：卦序号（1-64）或卦名（如 `乾为天`）

**响应：**
```json
{
    "code": 0,
    "data": {
        "id": 1,
        "name": "乾为天",
        "upperTrigram": "乾",
        "lowerTrigram": "乾",
        "guaCi": "元亨利贞。",
        "guaCiBaihua": "乾卦代表天...",
        "yaoCi": [
            { "position": 1, "original": "初九：潜龙勿用。", "baihua": "" },
            { "position": 2, "original": "九二：见龙在田...", "baihua": "" }
        ],
        "yongJiu": "用九：见群龙无首，吉。",
        "yongLiu": null
    }
}
```

### 2.3 获取八卦基础数据

```
GET /api/v1/bagua
```

### 2.4 获取占卜规则

```
GET /api/v1/divination-rules
```

**响应：** 八宫、纳甲、世应、五行生克、六亲规则等完整配置

---

## 3. 占卜接口（可选，由后端提供算力支持）

### 3.1 梅花易数 - 时间起卦

```
POST /api/v1/divination/meihua/time
```

**请求体：**
```json
{
    "timestamp": "2026-05-13T14:30:00+08:00"  // 可选，默认当前时间
}
```

**响应：** 完整的起卦结果（本卦、互卦、变卦、体用、动爻）

### 3.2 梅花易数 - 三数起卦

```
POST /api/v1/divination/meihua/numbers
```

**请求体：**
```json
{
    "n1": 123,
    "n2": 456,
    "n3": 789
}
```

### 3.3 六爻 - 铜钱摇卦（单次）

```
POST /api/v1/divination/liuyao/toss
```

**响应：** 单次三枚铜钱的结果（老阳/少阴/少阳/老阴）

### 3.4 六爻 - 装卦解卦

```
POST /api/v1/divination/liuyao/interpret
```

**请求体：**
```json
{
    "yao": [1, 0, 1, 1, 0, 1],
    "dong": [false, false, true, false, false, false]
}
```

**响应：** 包含本卦、变卦、八宫、世应、纳甲、六亲、爻辞、白话分析

---

## 4. 数据库表结构设计（参考）

```sql
-- 六十四卦主表
CREATE TABLE hexagrams (
    id          INT PRIMARY KEY,
    name        VARCHAR(20) NOT NULL,
    upper_trigram VARCHAR(10),
    lower_trigram VARCHAR(10),
    gua_ci      TEXT,
    gua_ci_baihua TEXT,
    yong_jiu    TEXT,
    yong_liu    TEXT,
    created_at  TIMESTAMP DEFAULT NOW()
);

-- 爻辞表
CREATE TABLE yao_texts (
    id          SERIAL PRIMARY KEY,
    hexagram_id INT REFERENCES hexagrams(id),
    position    INT NOT NULL CHECK (position BETWEEN 1 AND 6),
    original    TEXT NOT NULL,
    baihua      TEXT,
    UNIQUE(hexagram_id, position)
);

-- 占卜记录表（用户维度）
CREATE TABLE divination_records (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID,
    method      VARCHAR(20) NOT NULL CHECK (method IN ('meihua', 'liuyao')),
    sub_method  VARCHAR(20),
    question    TEXT,
    result_json JSONB NOT NULL,
    created_at  TIMESTAMP DEFAULT NOW()
);

-- 索引
CREATE INDEX idx_records_user ON divination_records(user_id, created_at DESC);
```

---

## 5. 多端数据同步策略

| 端 | 数据获取方式 | 离线支持 | 备注 |
|----|-------------|----------|------|
| Web | 直接读取 data/*.json + fetch API | 无 | 当前实现 |
| 小程序 | wx.request -> 后端 API | 可缓存 hexagrams.json | 复用 DAL 类 |
| iOS | URLSession -> 后端 API | 本地 SQLite 缓存 | 复用算法逻辑 |

### 5.1 共享代码清单

以下文件/逻辑可在三端复用：

- `data/*.json` — 纯数据，任何平台均可读取
- `js/core/dal.js` — 数据访问层，小程序可直接使用；iOS 可重写为 Swift 版本但保持相同接口
- `js/modules/meihua.js` — 梅花算法（纯 JS，无 DOM 依赖）
- `js/modules/liuyao.js` — 六爻算法（纯 JS，无 DOM 依赖）
- `js/core/utils.js` — 工具函数（农历、五行、渲染等，需替换 `fetch` 为平台特定 API）
