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
        this._hexagrams = null;
        this._hexagramList = null;
        this._trigrams = null;
        this._baGong = null;
        this._naJia = null;
        this._wuXing = null;
        this._hexagramMappings = null;
        this._ready = false;
    }

    // ---------- 初始化 ----------

    async init() {
        if (this._ready) return;
        await Promise.all([
            this._loadHexagrams(),
            this._loadTrigrams(),
            this._loadBaGong(),
            this._loadNaJia(),
            this._loadWuXing(),
            this._loadHexagramMappings(),
        ]);
        this._ready = true;
    }

    async _loadJson(filename) {
        const res = await fetch(CONFIG.dataPath + filename);
        return res.json();
    }

    async _loadHexagrams() {
        const data = await this._loadJson('hexagrams.json');
        this._hexagramList = data.hexagrams;
        this._hexagrams = new Map(data.hexagrams.map(h => [h.name, h]));
        this._cache.set('hexagrams_meta', { version: data.version, source: data.source, updated: data.updated });
    }

    async _loadTrigrams() {
        const data = await this._loadJson('trigrams.json');
        this._trigrams = new Map(data.trigrams.map(t => [t.name, t]));
    }

    async _loadBaGong() {
        const data = await this._loadJson('ba-gong.json');
        this._baGong = data.baGong;
    }

    async _loadNaJia() {
        const data = await this._loadJson('na-jia.json');
        this._naJia = data.naJia;
    }

    async _loadWuXing() {
        const data = await this._loadJson('wu-xing.json');
        this._wuXing = data;
    }

    async _loadHexagramMappings() {
        const data = await this._loadJson('hexagram-mappings.json');
        this._hexagramMappings = data.mappings;
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

    getHexagramByTrigrams(upper, lower) {
        return this._hexagramList?.find(h => h.upperTrigram === upper && h.lowerTrigram === lower) || null;
    }

    getHexagramMapping(upperId, lowerId) {
        return this._hexagramMappings?.[`${upperId}_${lowerId}`] || null;
    }

    getYaoCi(hexagramName, position) {
        const h = this.getHexagram(hexagramName);
        if (!h) return '';
        const yao = h.yaoCi.find(y => y.position === position);
        return yao ? yao.original : '';
    }

    getBaiHua(hexagramName) {
        const h = this.getHexagram(hexagramName);
        return h ? h.guaCiBaihua : '';
    }

    getGuaCi(hexagramName) {
        const h = this.getHexagram(hexagramName);
        return h ? h.guaCi : '';
    }

    // ---------- 八卦查询 ----------

    getTrigram(nameOrId) {
        if (typeof nameOrId === 'number') {
            const list = Array.from(this._trigrams?.values() || []);
            return list.find(t => t.id === nameOrId) || null;
        }
        return this._trigrams?.get(nameOrId) || null;
    }

    getAllTrigrams() {
        return Array.from(this._trigrams?.values() || []);
    }

    // ---------- 八宫 ----------

    getBaGong(guaName) {
        return this._baGong?.[guaName] || { gong: '', wuxing: '', shi: 1, ying: 4 };
    }

    // ---------- 纳甲 ----------

    getNaJia(trigramName) {
        return this._naJia?.[trigramName] || null;
    }

    // ---------- 五行 ----------

    getWuXingShengKe(element) {
        return this._wuXing?.shengKe[element] || null;
    }

    getZhiWuXing(zhi) {
        return this._wuXing?.zhi[zhi] || '';
    }

    getGanWuXing(gan) {
        return this._wuXing?.gan[gan] || '';
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

export const DAL = new DataAccessLayer();
