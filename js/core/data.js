/**
 * 易占 - 核心数据层
 * 八卦、六十四卦、纳甲、八宫、六亲规则
 * 
 * 兼容性说明：
 * - 本文件保留静态数据定义，确保同步访问
 * - 已同步将数据写入 data/*.json，便于后端数据库迁移
 * - DAL（dal.js）提供统一数据访问接口，优先从 JSON/API 加载
 * - data.js 中的辅助函数在 DAL 就绪后会优先使用 DAL 数据
 */

import { DAL } from './dal.js';

// ============================================
// 八卦
// ============================================
export const BA_GUA = {
    1: { name: '乾', symbol: '☰', wuxing: '金', number: 1, nature: '天', yao: [1,1,1] },
    2: { name: '兑', symbol: '☱', wuxing: '金', number: 2, nature: '泽', yao: [1,1,0] },
    3: { name: '离', symbol: '☲', wuxing: '火', number: 3, nature: '火', yao: [1,0,1] },
    4: { name: '震', symbol: '☳', wuxing: '木', number: 4, nature: '雷', yao: [1,0,0] },
    5: { name: '巽', symbol: '☴', wuxing: '木', number: 5, nature: '风', yao: [0,1,1] },
    6: { name: '坎', symbol: '☵', wuxing: '水', number: 6, nature: '水', yao: [0,1,0] },
    7: { name: '艮', symbol: '☶', wuxing: '土', number: 7, nature: '山', yao: [0,0,1] },
    8: { name: '坤', symbol: '☷', wuxing: '土', number: 8, nature: '地', yao: [0,0,0] },
};

// ============================================
// 六十四卦（保留静态映射，ci 字段可通过 DAL 增强）
// ============================================
export const GUA_64 = {
    '1_1': { name: '乾为天', ci: '元亨利贞。' },
    '1_2': { name: '天泽履', ci: '履虎尾，不咥人，亨。' },
    '1_3': { name: '天火同人', ci: '同人于野，亨。利涉大川，利君子贞。' },
    '1_4': { name: '天雷无妄', ci: '无妄，元亨利贞。其匪正有眚，不利有攸往。' },
    '1_5': { name: '天风姤', ci: '姤，女壮，勿用取女。' },
    '1_6': { name: '天水讼', ci: '讼，有孚，窒惕。中吉终凶。利见大人，不利涉大川。' },
    '1_7': { name: '天山遁', ci: '遁，亨。小利贞。' },
    '1_8': { name: '天地否', ci: '否之匪人，不利君子贞，大往小来。' },
    '2_1': { name: '泽天夬', ci: '夬，扬于王庭。孚号有厉。告自邑，不利即戎，利有攸往。' },
    '2_2': { name: '兑为泽', ci: '兑，亨，利贞。' },
    '2_3': { name: '泽火革', ci: '革，已日乃孚。元亨利贞。悔亡。' },
    '2_4': { name: '泽雷随', ci: '随，元亨利贞，无咎。' },
    '2_5': { name: '泽风大过', ci: '大过，栋桡，利有攸往，亨。' },
    '2_6': { name: '泽水困', ci: '困，亨，贞。大人吉，无咎。有言不信。' },
    '2_7': { name: '泽山咸', ci: '咸，亨，利贞。取女吉。' },
    '2_8': { name: '泽地萃', ci: '萃，亨。王假有庙，利见大人，亨，利贞。用大牲吉，利有攸往。' },
    '3_1': { name: '火天大有', ci: '大有，元亨。' },
    '3_2': { name: '火泽睽', ci: '睽，小事吉。' },
    '3_3': { name: '离为火', ci: '离，利贞，亨。畜牝牛，吉。' },
    '3_4': { name: '火雷噬嗑', ci: '噬嗑，亨。利用狱。' },
    '3_5': { name: '火风鼎', ci: '鼎，元吉，亨。' },
    '3_6': { name: '火水未济', ci: '未济，亨。小狐汔济，濡其尾，无攸利。' },
    '3_7': { name: '火山旅', ci: '旅，小亨。旅贞吉。' },
    '3_8': { name: '火地晋', ci: '晋，康侯用锡马蕃庶，昼日三接。' },
    '4_1': { name: '雷天大壮', ci: '大壮，利贞。' },
    '4_2': { name: '雷泽归妹', ci: '归妹，征凶，无攸利。' },
    '4_3': { name: '雷火丰', ci: '丰，亨。王假之，勿忧，宜日中。' },
    '4_4': { name: '震为雷', ci: '震，亨。震来虩虩，笑言哑哑。震惊百里，不丧匕鬯。' },
    '4_5': { name: '雷风恒', ci: '恒，亨，无咎。利贞。利有攸往。' },
    '4_6': { name: '雷水解', ci: '解，利西南。无所往，其来复吉。有攸往，夙吉。' },
    '4_7': { name: '雷山小过', ci: '小过，亨。利贞。可小事，不可大事。飞鸟遗之音，不宜上宜下，大吉。' },
    '4_8': { name: '雷地豫', ci: '豫，利建侯行师。' },
    '5_1': { name: '风天小畜', ci: '小畜，亨。密云不雨，自我西郊。' },
    '5_2': { name: '风泽中孚', ci: '中孚，豚鱼吉。利涉大川，利贞。' },
    '5_3': { name: '风火家人', ci: '家人，利女贞。' },
    '5_4': { name: '风雷益', ci: '益，利有攸往，利涉大川。' },
    '5_5': { name: '巽为风', ci: '巽，小亨。利有攸往，利见大人。' },
    '5_6': { name: '风水涣', ci: '涣，亨。王假有庙。利涉大川，利贞。' },
    '5_7': { name: '风山渐', ci: '渐，女归吉。利贞。' },
    '5_8': { name: '风地观', ci: '观，盥而不荐，有孚颙若。' },
    '6_1': { name: '水天需', ci: '需，有孚，光亨。贞吉。利涉大川。' },
    '6_2': { name: '水泽节', ci: '节，亨。苦节不可贞。' },
    '6_3': { name: '水火既济', ci: '既济，亨。小利贞。初吉终乱。' },
    '6_4': { name: '水雷屯', ci: '屯，元亨利贞。勿用有攸往。利建侯。' },
    '6_5': { name: '水风井', ci: '井，改邑不改井，无丧无得。往来井井。汔至亦未繘井，羸其瓶，凶。' },
    '6_6': { name: '坎为水', ci: '习坎，有孚。维心亨，行有尚。' },
    '6_7': { name: '水山蹇', ci: '蹇，利西南，不利东北。利见大人，贞吉。' },
    '6_8': { name: '水地比', ci: '比，吉。原筮元永贞，无咎。不宁方来，后夫凶。' },
    '7_1': { name: '山天大畜', ci: '大畜，利贞。不家食吉，利涉大川。' },
    '7_2': { name: '山泽损', ci: '损，有孚，元吉，无咎，可贞。利有攸往。曷之用，二簋可用享。' },
    '7_3': { name: '山火贲', ci: '贲，亨。小利有攸往。' },
    '7_4': { name: '山雷颐', ci: '颐，贞吉。观颐，自求口实。' },
    '7_5': { name: '山风蛊', ci: '蛊，元亨。利涉大川。先甲三日，后甲三日。' },
    '7_6': { name: '山水蒙', ci: '蒙，亨。匪我求童蒙，童蒙求我。初筮告，再三渎，渎则不告。利贞。' },
    '7_7': { name: '艮为山', ci: '艮其背，不获其身。行其庭，不见其人。无咎。' },
    '7_8': { name: '山地剥', ci: '剥，不利有攸往。' },
    '8_1': { name: '地天泰', ci: '泰，小往大来，吉亨。' },
    '8_2': { name: '地泽临', ci: '临，元亨利贞。至于八月有凶。' },
    '8_3': { name: '地火明夷', ci: '明夷，利艰贞。' },
    '8_4': { name: '地雷复', ci: '复，亨。出入无疾，朋来无咎。反复其道，七日来复。利有攸往。' },
    '8_5': { name: '地风升', ci: '升，元亨。用见大人，勿恤。南征吉。' },
    '8_6': { name: '地水师', ci: '师，贞。丈人吉，无咎。' },
    '8_7': { name: '地山谦', ci: '谦，亨。君子有终。' },
    '8_8': { name: '坤为地', ci: '元亨，利牝马之贞。君子有攸往，先迷后得主。利西南得朋，东北丧朋。安贞吉。' },
};

export function getGua64(upper, lower) {
    const key = `${upper}_${lower}`;
    const staticResult = GUA_64[key] || { name: '未知卦', ci: '' };
    // 若 DAL 已加载完整文本，优先使用
    const dalGua = DAL.getHexagram?.(staticResult.name);
    if (dalGua) {
        return { name: dalGua.name, ci: dalGua.guaCi };
    }
    return staticResult;
}

// ============================================
// 八宫卦序（世应、五行）
// ============================================
export const BA_GONG = {
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

export function getBaGong(guaName) {
    const dalResult = DAL.getBaGong?.(guaName);
    if (dalResult && dalResult.gong) return dalResult;
    return BA_GONG[guaName] || { gong: '', wuxing: '', shi: 1, ying: 4 };
}

// ============================================
// 纳甲表
// ============================================
export const NA_JIA = {
    '乾': { inner: ['子','寅','辰'], outer: ['午','申','戌'], ganInner: ['甲','甲','甲'], ganOuter: ['壬','壬','壬'] },
    '兑': { inner: ['巳','卯','丑'], outer: ['亥','酉','未'], ganInner: ['丁','丁','丁'], ganOuter: ['丁','丁','丁'] },
    '离': { inner: ['卯','丑','亥'], outer: ['酉','未','巳'], ganInner: ['己','己','己'], ganOuter: ['己','己','己'] },
    '震': { inner: ['子','寅','辰'], outer: ['午','申','戌'], ganInner: ['庚','庚','庚'], ganOuter: ['庚','庚','庚'] },
    '巽': { inner: ['丑','亥','酉'], outer: ['未','巳','卯'], ganInner: ['辛','辛','辛'], ganOuter: ['辛','辛','辛'] },
    '坎': { inner: ['寅','辰','午'], outer: ['申','戌','子'], ganInner: ['戊','戊','戊'], ganOuter: ['戊','戊','戊'] },
    '艮': { inner: ['辰','午','申'], outer: ['戌','子','寅'], ganInner: ['丙','丙','丙'], ganOuter: ['丙','丙','丙'] },
    '坤': { inner: ['未','巳','卯'], outer: ['丑','亥','酉'], ganInner: ['乙','乙','乙'], ganOuter: ['癸','癸','癸'] },
};

export function getNaJia(lowerName, upperName) {
    const dalLower = DAL.getNaJia?.(lowerName);
    const dalUpper = DAL.getNaJia?.(upperName);
    const lower = dalLower || NA_JIA[lowerName];
    const upper = dalUpper || NA_JIA[upperName];
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

// ============================================
// 五行生克与六亲
// ============================================
export const WUXING_SHENG_KE = {
    '金': { shengWo: '土', woSheng: '水', keWo: '火', woKe: '木' },
    '木': { shengWo: '水', woSheng: '火', keWo: '金', woKe: '土' },
    '水': { shengWo: '金', woSheng: '木', keWo: '土', woKe: '火' },
    '火': { shengWo: '木', woSheng: '土', keWo: '水', woKe: '金' },
    '土': { shengWo: '火', woSheng: '金', keWo: '木', woKe: '水' },
};

export const ZHI_WUXING = {
    '子': '水', '丑': '土', '寅': '木', '卯': '木',
    '辰': '土', '巳': '火', '午': '火', '未': '土',
    '申': '金', '酉': '金', '戌': '土', '亥': '水',
};

export const GAN_WUXING = {
    '甲': '木', '乙': '木', '丙': '火', '丁': '火',
    '戊': '土', '己': '土', '庚': '金', '辛': '金',
    '壬': '水', '癸': '水',
};

export function getLiuQin(gongWuxing, zhiWuxing) {
    const dalResult = DAL.getLiuQin?.(gongWuxing, zhiWuxing);
    if (dalResult) return dalResult;
    const map = WUXING_SHENG_KE[gongWuxing];
    if (!map) return '';
    if (map.shengWo === zhiWuxing) return '父母';
    if (map.woSheng === zhiWuxing) return '子孙';
    if (map.keWo === zhiWuxing) return '官鬼';
    if (map.woKe === zhiWuxing) return '妻财';
    return '兄弟';
}
