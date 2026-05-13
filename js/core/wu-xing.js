/**
 * 五行系统 (WuXing / Five Elements)
 * 独立模块：生克关系、天干地支五行归属
 */

// 五行生克关系表
const SHENG_KE = {
    '金': { shengWo: '土', woSheng: '水', keWo: '火', woKe: '木' },
    '木': { shengWo: '水', woSheng: '火', keWo: '金', woKe: '土' },
    '水': { shengWo: '金', woSheng: '木', keWo: '土', woKe: '火' },
    '火': { shengWo: '木', woSheng: '土', keWo: '水', woKe: '金' },
    '土': { shengWo: '火', woSheng: '金', keWo: '木', woKe: '水' },
};

// 地支五行
const ZHI_WUXING = {
    '子': '水', '丑': '土', '寅': '木', '卯': '木',
    '辰': '土', '巳': '火', '午': '火', '未': '土',
    '申': '金', '酉': '金', '戌': '土', '亥': '水',
};

// 天干五行
const GAN_WUXING = {
    '甲': '木', '乙': '木', '丙': '火', '丁': '火',
    '戊': '土', '己': '土', '庚': '金', '辛': '金',
    '壬': '水', '癸': '水',
};

/** 获取某五行的生克关系 */
export function getShengKe(element) {
    return SHENG_KE[element] || null;
}

/** 获取地支五行 */
export function getZhiWuXing(zhi) {
    return ZHI_WUXING[zhi] || '';
}

/** 获取天干五行 */
export function getGanWuXing(gan) {
    return GAN_WUXING[gan] || '';
}

/** 
 * 判断两个五行之间的生克关系
 * @returns {'sheng'|'ke'|'beisheng'|'beike'|'bihe'}
 */
export function checkRelation(a, b) {
    const map = SHENG_KE[a];
    if (!map) return 'bihe';
    if (map.woSheng === b) return 'sheng';      // a生b
    if (map.woKe === b) return 'ke';            // a克b
    if (map.shengWo === b) return 'beisheng';   // b生a
    if (map.keWo === b) return 'beike';         // b克a
    return 'bihe';                              // 比和
}

/** 生克关系文字描述 */
export function relationText(type) {
    const map = {
        'sheng': '生',
        'ke': '克',
        'beisheng': '被生',
        'beike': '被克',
        'bihe': '比和',
    };
    return map[type] || '';
}

/** 体用生克分析（梅花易数专用） */
export function checkBodyUseRelation(tiWx, yongWx) {
    const type = checkRelation(tiWx, yongWx);
    const textMap = {
        'sheng': '体生用，主耗泄，所求之事需付出努力',
        'ke': '体克用，主能掌控，事有可为',
        'beisheng': '用生体，主得助，吉象',
        'beike': '用克体，主受制，需谨慎',
        'bihe': '体用比和，主顺畅',
    };
    return { type, text: textMap[type] || '' };
}

export { SHENG_KE, ZHI_WUXING, GAN_WUXING };
