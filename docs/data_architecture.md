# 数据架构规范

> 版本：v1.0  
> 目标：支持多玄学体系数据隔离，确保中玄、西玄及未来扩展模块互不干扰

---

## 1. 目录结构

```
data/
├── chinese_data/              # 中式玄学数据（当前已实现）
│   ├── hexagrams.json         # 64卦文本（卦辞、爻辞、白话）
│   ├── hexagrams_oraclelang.json  # OracleLang 原始数据（备用）
│   ├── hexagram-mappings.json     # 64卦组合映射（上卦_下卦 → 卦名）
│   ├── hexagrams-dabaihua.json    # 64卦大白话口语解释
│   ├── trigrams.json          # 八卦定义
│   ├── ba-gong.json           # 八宫世应
│   ├── na-jia.json            # 纳甲规则
│   └── wu-xing.json           # 五行生克、天干地支五行
│
└── western_data/              # 西式玄学数据（预留）
    ├── tarot-cards.json       # 塔罗牌定义（预留）
    ├── tarot-interpretations.json  # 塔罗牌义（预留）
    ├── zodiac-signs.json      # 十二星座（预留）
    └── planetary-aspects.json # 行星相位（预留）
```

---

## 2. 添加新模块的标准流程

以后新增任何玄学体系（如日式神道、阿拉伯占星、玛雅历法等），按以下三步走：

### 2.1 创建数据目录

在 `data/` 下新建子目录，命名规范：`{体系英文名}_data/`

示例：
- 日式神道 → `data/shinto_data/`
- 阿拉伯占星 → `data/arabic_astrology_data/`

### 2.2 注册模块路径

在 `js/core/dal.js` 的 `CONFIG.modules` 中注册：

```javascript
const CONFIG = {
    ...
    modules: {
        chinese: 'chinese_data/',
        western: 'western_data/',
        shinto:  'shinto_data/',      // ← 新增
    },
};
```

### 2.3 实现数据加载方法

在 `DataAccessLayer` 类中新增加载方法：

```javascript
async init() {
    if (this._ready) return;
    await Promise.all([
        this._loadChineseData(),
        // this._loadWesternData(),  // 按需启用
        // this._loadShintoData(),   // ← 新增
    ]);
    this._ready = true;
}

async _loadShintoData() {
    const mod = 'shinto';
    // 加载该体系下的所有 JSON 数据表
    const data = await this._loadJson('kami-definitions.json', mod);
    this._shintoKami = data.kami;
}
```

---

## 3. 数据表设计规范

### 3.1 每个 JSON 文件必须包含的元数据

```json
{
  "version": "1.0.0",
  "description": "数据表用途简述",
  "...": "实际数据"
}
```

### 3.2 命名规范

| 类型 | 命名示例 | 说明 |
|------|---------|------|
| 主数据表 | `hexagrams.json` | 复数名词，小写，连字符分隔 |
| 映射表 | `hexagram-mappings.json` | 源-目标关系，用 `-mappings` 后缀 |
| 解释文本 | `hexagrams-dabaihua.json` | 在基础名后加 `-{variant}` 后缀 |
| 原始备份 | `hexagrams_oraclelang.json` | 用 `_来源` 后缀标记第三方数据 |

### 3.3 模块化隔离原则

- **绝不混放**：中玄的八卦数据不会出现在 `western_data/`，西玄的塔罗数据不会出现在 `chinese_data/`
- **绝不硬编码路径**：所有路径通过 `CONFIG.modules` 管理，禁止在代码中写死 `'data/chinese_data/'`
- **按需加载**：`init()` 时只加载当前启用的模块，未启用模块的 JSON 不会请求

---

## 4. DAL 路径解析示例

```javascript
// _loadJson 内部拼接逻辑：
// CONFIG.dataPath + CONFIG.modules[module] + filename

// 中玄 64 卦文本
this._loadJson('hexagrams.json', 'chinese');
// → 实际请求：data/chinese_data/hexagrams.json

// 西玄塔罗牌（预留）
this._loadJson('tarot-cards.json', 'western');
// → 实际请求：data/western_data/tarot-cards.json
```

---

## 5. 后端数据库迁移对应关系

| 数据文件 | 建议数据库表名 |
|---------|--------------|
| `chinese_data/hexagrams.json` | `chinese_hexagrams` |
| `chinese_data/trigrams.json` | `chinese_trigrams` |
| `chinese_data/ba-gong.json` | `chinese_ba_gong` |
| `chinese_data/na-jia.json` | `chinese_na_jia` |
| `chinese_data/wu-xing.json` | `chinese_wu_xing_rules` |
| `chinese_data/hexagrams-dabaihua.json` | `chinese_hexagram_dabaihua` |
| `western_data/tarot-cards.json` | `western_tarot_cards` |
| `western_data/zodiac-signs.json` | `western_zodiac_signs` |

**表名前缀规则**：`{体系}_{实体}`，确保不同体系的同名实体不会冲突。
