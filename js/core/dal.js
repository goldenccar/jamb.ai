/**
 * 易占 - 数据访问层 (Data Access Layer)
 * 
 * 设计目标：
 * 1. 前端模式：从本地 data/*.json 加载静态数据
 * 2. API 模式（预留）：向后端 REST API 请求数据
 * 
 * 多端适配：
 * - Web:    import { DAL } from './core/dal.js'
 * - 小程序: 复用 DAL 类，更换 apiBase 即可
 * - iOS:    通过 JSBridge 或独立封装相同接口
 * - 后端:   data/ 目录下的 JSON 可直接作为数据库 seed
 */

const CONFIG = {
    mode: 'local',      // 'local' | 'api'
    apiBase: '',        // 预留：如 'https://api.yizhan.com/v1'
    dataPath: 'data/',  // 本地 JSON 路径
};

class DataAccessLayer {
    constructor() {
        this._cache = new Map();
        this._hexagrams = null;        // { name -> hexagram }
        this._hexagramList = null;     // [hexagram, ...]
        this._bagua = null;
        this._rules = null;
        this._ready = false;
    }

    // ---------- 初始化 ----------

    async init() {
        if (this._ready) return;
        await Promise.all([
            this._loadHexagrams(),
            this._loadBagua(),
            this._loadRules(),
        ]);
        this._ready = true;
    }

    async _loadHexagrams() {
        if (CONFIG.mode === 'api') {
            // 预留：await this._apiGet('/hexagrams');
            throw new Error('API mode not implemented yet');
        }
        const res = await fetch(CONFIG.dataPath + 'hexagrams.json');
        const data = await res.json();
        this._hexagramList = data.hexagrams;
        this._hexagrams = new Map(data.hexagrams.map(h => [h.name, h]));
        this._cache.set('hexagrams_meta', { version: data.version, source: data.source, updated: data.updated });
    }

    async _loadBagua() {
        const res = await fetch(CONFIG.dataPath + 'bagua.json');
        const data = await res.json();
        this._bagua = new Map(data.bagua.map(b => [b.id, b]));
    }

    async _loadRules() {
        const res = await fetch(CONFIG.dataPath + 'divination-rules.json');
        this._rules = await res.json();
    }

    // ---------- 六十四卦查询 ----------

    getHexagram(nameOrId) {
        if (typeof nameOrId === 'number') {
            return this._hexagramList?.[nameOrId - 1] || null;
        }
        return this._hexagrams?.get(nameOrId) || null;
    }

    getAllHexagrams() {
        return this._hexagramList || [];
    }

    getHexagramMeta() {
        return this._cache.get('hexagrams_meta') || {};
    }

    // 通过上下卦查找
    getHexagramByTrigrams(upper, lower) {
        return this._hexagramList?.find(h => h.upperTrigram === upper && h.lowerTrigram === lower) || null;
    }

    // 爻辞查询（position: 1-6）
    getYaoCi(hexagramName, position) {
        const h = this.getHexagram(hexagramName);
        if (!h) return '';
        const yao = h.yaoCi.find(y => y.position === position);
        return yao ? yao.original : '';
    }

    // 白话查询
    getBaiHua(hexagramName) {
        const h = this.getHexagram(hexagramName);
        return h ? h.guaCiBaihua : '';
    }

    // 卦辞查询
    getGuaCi(hexagramName) {
        const h = this.getHexagram(hexagramName);
        return h ? h.guaCi : '';
    }

    // ---------- 八卦查询 ----------

    getBagua(id) {
        return this._bagua?.get(id) || null;
    }

    getAllBagua() {
        return Array.from(this._bagua?.values() || []);
    }

    // ---------- 占卜规则 ----------

    getBaGong(guaName) {
        return this._rules?.baGong[guaName] || { gong: '', wuxing: '', shi: 1, ying: 4 };
    }

    getNaJia(trigramName) {
        return this._rules?.naJia[trigramName] || null;
    }

    getWuXingShengKe(element) {
        return this._rules?.wuxing.shengKe[element] || null;
    }

    getZhiWuXing(zhi) {
        return this._rules?.wuxing.zhi[zhi] || '';
    }

    getGanWuXing(gan) {
        return this._rules?.wuxing.gan[gan] || '';
    }

    getLiuQin(gongWuxing, zhiWuxing) {
        const map = this.getWuXingShengKe(gongWuxing);
        if (!map) return '';
        if (map.shengWo === zhiWuxing) return '父母';
        if (map.woSheng === zhiWuxing) return '子孙';
        if (map.keWo === zhiWuxing) return '官鬼';
        if (map.woKe === zhiWuxing) return '妻财';
        return '兄弟';
    }
}

// 单例导出
export const DAL = new DataAccessLayer();
