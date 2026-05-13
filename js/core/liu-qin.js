/**
 * 六亲系统 (LiuQin / Six Relations)
 * 独立模块：基于卦宫五行与爻支五行推导六亲关系
 */

import { getShengKe } from './wu-xing.js';

/** 
 * 推导六亲关系
 * @param {string} gongWuxing - 卦宫五行
 * @param {string} zhiWuxing - 爻支五行
 * @returns {string} 父母/子孙/官鬼/妻财/兄弟
 */
export function getLiuQin(gongWuxing, zhiWuxing) {
    const map = getShengKe(gongWuxing);
    if (!map) return '';
    if (map.shengWo === zhiWuxing) return '父母';
    if (map.woSheng === zhiWuxing) return '子孙';
    if (map.keWo === zhiWuxing) return '官鬼';
    if (map.woKe === zhiWuxing) return '妻财';
    return '兄弟';
}

/** 批量推导六亲 */
export function getLiuQinBatch(gongWuxing, zhiWuxingList) {
    return zhiWuxingList.map(wx => getLiuQin(gongWuxing, wx));
}
