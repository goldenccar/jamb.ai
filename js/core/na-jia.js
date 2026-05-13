/**
 * 纳甲系统 (NaJia)
 * 独立模块：八卦六爻配天干地支
 */

const NA_JIA = {
    '乾': { inner: ['子','寅','辰'], outer: ['午','申','戌'], ganInner: ['甲','甲','甲'], ganOuter: ['壬','壬','壬'] },
    '兑': { inner: ['巳','卯','丑'], outer: ['亥','酉','未'], ganInner: ['丁','丁','丁'], ganOuter: ['丁','丁','丁'] },
    '离': { inner: ['卯','丑','亥'], outer: ['酉','未','巳'], ganInner: ['己','己','己'], ganOuter: ['己','己','己'] },
    '震': { inner: ['子','寅','辰'], outer: ['午','申','戌'], ganInner: ['庚','庚','庚'], ganOuter: ['庚','庚','庚'] },
    '巽': { inner: ['丑','亥','酉'], outer: ['未','巳','卯'], ganInner: ['辛','辛','辛'], ganOuter: ['辛','辛','辛'] },
    '坎': { inner: ['寅','辰','午'], outer: ['申','戌','子'], ganInner: ['戊','戊','戊'], ganOuter: ['戊','戊','戊'] },
    '艮': { inner: ['辰','午','申'], outer: ['戌','子','寅'], ganInner: ['丙','丙','丙'], ganOuter: ['丙','丙','丙'] },
    '坤': { inner: ['未','巳','卯'], outer: ['丑','亥','酉'], ganInner: ['乙','乙','乙'], ganOuter: ['癸','癸','癸'] },
};

/** 
 * 获取纳甲排布
 * @param {string} lowerName - 下卦名
 * @param {string} upperName - 上卦名
 * @returns {Array<{zhi:string, gan:string}>} 从初爻到上爻
 */
export function getNaJia(lowerName, upperName) {
    const lower = NA_JIA[lowerName];
    const upper = NA_JIA[upperName];
    if (!lower || !upper) return [];
    return [
        { zhi: lower.inner[0], gan: lower.ganInner[0] },
        { zhi: lower.inner[1], gan: lower.ganInner[1] },
        { zhi: lower.inner[2], gan: lower.ganInner[2] },
        { zhi: upper.outer[0], gan: upper.ganOuter[0] },
        { zhi: upper.outer[1], gan: upper.ganOuter[1] },
        { zhi: upper.outer[2], gan: upper.ganOuter[2] },
    ];
}

/** 获取单卦纳甲定义 */
export function getTrigramNaJia(trigramName) {
    return NA_JIA[trigramName] || null;
}

export { NA_JIA };
