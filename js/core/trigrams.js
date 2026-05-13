/**
 * 八卦系统 (Trigrams / BaGua)
 * 独立模块：先天八卦定义、查询、爻象转换
 */

const TRIGRAMS = {
    1: { name: '乾', symbol: '☰', wuxing: '金', number: 1, nature: '天', yao: [1,1,1] },
    2: { name: '兑', symbol: '☱', wuxing: '金', number: 2, nature: '泽', yao: [1,1,0] },
    3: { name: '离', symbol: '☲', wuxing: '火', number: 3, nature: '火', yao: [1,0,1] },
    4: { name: '震', symbol: '☳', wuxing: '木', number: 4, nature: '雷', yao: [1,0,0] },
    5: { name: '巽', symbol: '☴', wuxing: '木', number: 5, nature: '风', yao: [0,1,1] },
    6: { name: '坎', symbol: '☵', wuxing: '水', number: 6, nature: '水', yao: [0,1,0] },
    7: { name: '艮', symbol: '☶', wuxing: '土', number: 7, nature: '山', yao: [0,0,1] },
    8: { name: '坤', symbol: '☷', wuxing: '土', number: 8, nature: '地', yao: [0,0,0] },
};

// 名称 -> ID 反向索引
const NAME_TO_ID = Object.fromEntries(
    Object.entries(TRIGRAMS).map(([id, t]) => [t.name, parseInt(id)])
);

/** 通过ID获取八卦 */
export function getTrigram(id) {
    return TRIGRAMS[id] || null;
}

/** 通过名称获取八卦 */
export function getTrigramByName(name) {
    const id = NAME_TO_ID[name];
    return id ? TRIGRAMS[id] : null;
}

/** 获取所有八卦 */
export function getAllTrigrams() {
    return Object.values(TRIGRAMS);
}

/** 三爻数组转八卦ID */
export function yaoToTrigramId(yao) {
    for (let i = 1; i <= 8; i++) {
        const t = TRIGRAMS[i];
        if (t.yao[0] === yao[0] && t.yao[1] === yao[1] && t.yao[2] === yao[2]) {
            return i;
        }
    }
    return 8;
}

/** 通过五行获取八卦列表 */
export function getTrigramsByWuxing(wuxing) {
    return Object.values(TRIGRAMS).filter(t => t.wuxing === wuxing);
}

export { TRIGRAMS, NAME_TO_ID };
