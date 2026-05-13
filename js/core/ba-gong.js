/**
 * 八宫系统 (BaGong / Eight Palaces)
 * 独立模块：八宫定卦、世应定位
 */

const BA_GONG = {
    '乾为天':    { gong: '乾', wuxing: '金', shi: 6, ying: 3 },
    '天风姤':    { gong: '乾', wuxing: '金', shi: 1, ying: 4 },
    '天山遁':    { gong: '乾', wuxing: '金', shi: 2, ying: 5 },
    '天地否':    { gong: '乾', wuxing: '金', shi: 3, ying: 6 },
    '风地观':    { gong: '乾', wuxing: '金', shi: 4, ying: 1 },
    '山地剥':    { gong: '乾', wuxing: '金', shi: 5, ying: 2 },
    '火地晋':    { gong: '乾', wuxing: '金', shi: 4, ying: 1 },
    '火天大有':  { gong: '乾', wuxing: '金', shi: 3, ying: 6 },
    '兑为泽':    { gong: '兑', wuxing: '金', shi: 6, ying: 3 },
    '泽水困':    { gong: '兑', wuxing: '金', shi: 1, ying: 4 },
    '泽地萃':    { gong: '兑', wuxing: '金', shi: 2, ying: 5 },
    '泽山咸':    { gong: '兑', wuxing: '金', shi: 3, ying: 6 },
    '水山蹇':    { gong: '兑', wuxing: '金', shi: 4, ying: 1 },
    '地山谦':    { gong: '兑', wuxing: '金', shi: 5, ying: 2 },
    '雷山小过':  { gong: '兑', wuxing: '金', shi: 4, ying: 1 },
    '雷泽归妹':  { gong: '兑', wuxing: '金', shi: 3, ying: 6 },
    '离为火':    { gong: '离', wuxing: '火', shi: 6, ying: 3 },
    '火山旅':    { gong: '离', wuxing: '火', shi: 1, ying: 4 },
    '火风鼎':    { gong: '离', wuxing: '火', shi: 2, ying: 5 },
    '水火未济':  { gong: '离', wuxing: '火', shi: 3, ying: 6 },
    '山水蒙':    { gong: '离', wuxing: '火', shi: 4, ying: 1 },
    '风水涣':    { gong: '离', wuxing: '火', shi: 5, ying: 2 },
    '天水讼':    { gong: '离', wuxing: '火', shi: 4, ying: 1 },
    '天火同人':  { gong: '离', wuxing: '火', shi: 3, ying: 6 },
    '震为雷':    { gong: '震', wuxing: '木', shi: 6, ying: 3 },
    '雷地豫':    { gong: '震', wuxing: '木', shi: 1, ying: 4 },
    '雷水解':    { gong: '震', wuxing: '木', shi: 2, ying: 5 },
    '雷风恒':    { gong: '震', wuxing: '木', shi: 3, ying: 6 },
    '地风升':    { gong: '震', wuxing: '木', shi: 4, ying: 1 },
    '水风井':    { gong: '震', wuxing: '木', shi: 5, ying: 2 },
    '泽风大过':  { gong: '震', wuxing: '木', shi: 4, ying: 1 },
    '泽雷随':    { gong: '震', wuxing: '木', shi: 3, ying: 6 },
    '巽为风':    { gong: '巽', wuxing: '木', shi: 6, ying: 3 },
    '风天小畜':  { gong: '巽', wuxing: '木', shi: 1, ying: 4 },
    '风火家人':  { gong: '巽', wuxing: '木', shi: 2, ying: 5 },
    '风雷益':    { gong: '巽', wuxing: '木', shi: 3, ying: 6 },
    '天雷无妄':  { gong: '巽', wuxing: '木', shi: 4, ying: 1 },
    '火雷噬嗑':  { gong: '巽', wuxing: '木', shi: 5, ying: 2 },
    '山雷颐':    { gong: '巽', wuxing: '木', shi: 4, ying: 1 },
    '山风蛊':    { gong: '巽', wuxing: '木', shi: 3, ying: 6 },
    '坎为水':    { gong: '坎', wuxing: '水', shi: 6, ying: 3 },
    '水泽节':    { gong: '坎', wuxing: '水', shi: 1, ying: 4 },
    '水雷屯':    { gong: '坎', wuxing: '水', shi: 2, ying: 5 },
    '水火既济':  { gong: '坎', wuxing: '水', shi: 3, ying: 6 },
    '泽火革':    { gong: '坎', wuxing: '水', shi: 4, ying: 1 },
    '雷火丰':    { gong: '坎', wuxing: '水', shi: 5, ying: 2 },
    '地火明夷':  { gong: '坎', wuxing: '水', shi: 4, ying: 1 },
    '地水师':    { gong: '坎', wuxing: '水', shi: 3, ying: 6 },
    '艮为山':    { gong: '艮', wuxing: '土', shi: 6, ying: 3 },
    '山火贲':    { gong: '艮', wuxing: '土', shi: 1, ying: 4 },
    '山天大畜':  { gong: '艮', wuxing: '土', shi: 2, ying: 5 },
    '山泽损':    { gong: '艮', wuxing: '土', shi: 3, ying: 6 },
    '火泽睽':    { gong: '艮', wuxing: '土', shi: 4, ying: 1 },
    '天泽履':    { gong: '艮', wuxing: '土', shi: 5, ying: 2 },
    '风泽中孚':  { gong: '艮', wuxing: '土', shi: 4, ying: 1 },
    '风山渐':    { gong: '艮', wuxing: '土', shi: 3, ying: 6 },
    '坤为地':    { gong: '坤', wuxing: '土', shi: 6, ying: 3 },
    '地雷复':    { gong: '坤', wuxing: '土', shi: 1, ying: 4 },
    '地泽临':    { gong: '坤', wuxing: '土', shi: 2, ying: 5 },
    '地天泰':    { gong: '坤', wuxing: '土', shi: 3, ying: 6 },
    '雷天大壮':  { gong: '坤', wuxing: '土', shi: 4, ying: 1 },
    '泽天夬':    { gong: '坤', wuxing: '土', shi: 5, ying: 2 },
    '水天需':    { gong: '坤', wuxing: '土', shi: 4, ying: 1 },
    '水地比':    { gong: '坤', wuxing: '土', shi: 3, ying: 6 },
};

/** 通过卦名获取八宫信息 */
export function getBaGong(guaName) {
    return BA_GONG[guaName] || { gong: '', wuxing: '', shi: 1, ying: 4 };
}

/** 获取某宫的所有卦 */
export function getHexagramsByGong(gongName) {
    return Object.entries(BA_GONG)
        .filter(([_, info]) => info.gong === gongName)
        .map(([name, info]) => ({ name, ...info }));
}

/** 获取世爻位置 */
export function getShiYao(guaName) {
    const info = BA_GONG[guaName];
    return info ? { shi: info.shi, ying: info.ying } : { shi: 1, ying: 4 };
}

export { BA_GONG };
