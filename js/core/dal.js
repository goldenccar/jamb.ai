/**
 * 易占 - 数据访问层 (Data Access Layer)
 *
 * 设计目标：
 * 1. 前端模式：从本地 data/{module}/*.json 加载静态数据
 * 2. API 模式（预留）：向后端 REST API 请求数据
 * 3. 模块化：支持多玄学体系数据隔离（中玄 / 西玄 / ...）
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
    dataPath: 'data/',  // 本地 JSON 根路径
    modules: {
        chinese: 'chinese_data/',   // 中式玄学数据目录
        western: 'western_data/',   // 西式玄学数据目录（预留）
    },
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
        this._daBaiHua = null;
        this._ready = false;
    }

    // ---------- 初始化 ----------

    async init() {
        if (this._ready) return;
        await Promise.all([
            this._loadChineseData(),
        ]);
        this._ready = true;
    }

    async _loadJson(filename, module = '') {
        const modulePath = module ? CONFIG.modules[module] : '';
        const res = await fetch(CONFIG.dataPath + modulePath + filename);
        return res.json();
    }

    /** 加载中式玄学全部数据表 */
    async _loadChineseData() {
        const mod = 'chinese';
        await Promise.all([
            this._loadHexagrams(mod),
            this._loadTrigrams(mod),
            this._loadBaGong(mod),
            this._loadNaJia(mod),
            this._loadWuXing(mod),
            this._loadHexagramMappings(mod),
            this._loadDaBaiHua(mod),
        ]);
    }

    /** 预留：加载西式玄学数据 */
    async _loadWesternData() {
        // const mod = 'western';
        // TODO: 加载塔罗、占星等数据
    }

    async _loadHexagrams(module) {
        const data = await this._loadJson('hexagrams.json', module);
        this._hexagramList = data.hexagrams;
        this._hexagrams = new Map(data.hexagrams.map(h => [h.name, h]));
        this._cache.set('hexagrams_meta', { version: data.version, source: data.source, updated: data.updated });
    }

    async _loadTrigrams(module) {
        const data = await this._loadJson('trigrams.json', module);
        this._trigrams = new Map(data.trigrams.map(t => [t.name, t]));
    }

    async _loadBaGong(module) {
        const data = await this._loadJson('ba-gong.json', module);
        this._baGong = data.baGong;
    }

    async _loadNaJia(module) {
        const data = await this._loadJson('na-jia.json', module);
        this._naJia = data.naJia;
    }

    async _loadWuXing(module) {
        const data = await this._loadJson('wu-xing.json', module);
        this._wuXing = data;
    }

    async _loadHexagramMappings(module) {
        const data = await this._loadJson('hexagram-mappings.json', module);
        this._hexagramMappings = data.mappings;
    }

    async _loadDaBaiHua(module) {
        const data = await this._loadJson('hexagrams-dabaihua.json', module);
        this._daBaiHua = data.dabaihua;
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

    getDaBaiHua(hexagramName) {
        return this._daBaiHua?.[hexagramName] || '';
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
