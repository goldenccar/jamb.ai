/**
 * 易占 - 核心数据兼容层
 *
 * 本文件作为兼容层，重新导出所有独立子模块的接口。
 * 历史代码（meihua.js / liuyao.js）通过本文件导入，无需修改。
 *
 * 独立模块清单：
 * - trigrams.js    八卦系统
 * - hexagrams.js   六十四卦映射
 * - ba-gong.js     八宫世应
 * - na-jia.js      纳甲系统
 * - wu-xing.js     五行生克
 * - liu-qin.js     六亲推导
 */

// 八卦
export {
    getTrigram,
    getTrigramByName,
    getAllTrigrams,
    yaoToTrigramId,
    getTrigramsByWuxing,
    TRIGRAMS as BA_GUA,
} from './trigrams.js';

// 六十四卦
export {
    getHexagramName,
    getHexagramTrigrams,
    getAllHexagramNames,
    HEXAGRAM_MAP as GUA_64,
} from './hexagrams.js';

// 兼容旧接口：getGua64(upper, lower) -> {name, ci}
import { getHexagramName } from './hexagrams.js';
import { DAL } from './dal.js';
export function getGua64(upper, lower) {
    const name = getHexagramName(upper, lower);
    if (!name) return { name: '未知卦', ci: '' };
    const dalGua = DAL.getHexagram?.(name);
    if (dalGua) {
        return { name: dalGua.name, ci: dalGua.guaCi };
    }
    return { name, ci: '' };
}

// 八宫
export {
    getBaGong,
    getHexagramsByGong,
    getShiYao,
    BA_GONG,
} from './ba-gong.js';

// 纳甲
export {
    getNaJia,
    getTrigramNaJia,
    NA_JIA,
} from './na-jia.js';

// 五行
export {
    getShengKe,
    getZhiWuXing,
    getGanWuXing,
    checkRelation,
    relationText,
    checkBodyUseRelation,
    SHENG_KE as WUXING_SHENG_KE,
    ZHI_WUXING,
    GAN_WUXING,
} from './wu-xing.js';

// 六亲
export {
    getLiuQin,
    getLiuQinBatch,
} from './liu-qin.js';
