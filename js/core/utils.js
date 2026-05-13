/**
 * 易占 - 公共工具层
 * 农历封装、五行生克、爻象渲染、易经文本
 * 
 * 数据文本来源：通过 DAL（数据访问层）加载 data/hexagrams.json
 * 便于后续迁移至后端 API 或数据库
 */

import { DAL } from './dal.js';
import { YAO_CI, BAI_HUA } from './yijing-text.js';
import { yaoToTrigramId } from './trigrams.js';
import { checkBodyUseRelation } from './wu-xing.js';

// ============================================
// 农历转换（基于 lunar-javascript）
// ============================================
export function getLunarDate(date = new Date()) {
    if (typeof Solar === 'undefined') {
        console.warn('lunar-javascript not loaded');
        return fallbackLunar(date);
    }
    const solar = Solar.fromDate(date);
    const lunar = solar.getLunar();
    const yearZhi = lunar.getYearZhi();
    const monthZhi = lunar.getMonthZhi();
    const dayZhi = lunar.getDayZhi();
    const timeZhi = lunar.getTimeZhi();

    const zhiMap = { '子':1,'丑':2,'寅':3,'卯':4,'辰':5,'巳':6,'午':7,'未':8,'申':9,'酉':10,'戌':11,'亥':12 };

    return {
        year: zhiMap[yearZhi] || 1,
        month: lunar.getMonth(),
        day: lunar.getDay(),
        hour: zhiMap[timeZhi] || 1,
        yearGanZhi: lunar.getYearInGanZhi(),
        monthGanZhi: lunar.getMonthInGanZhi(),
        dayGanZhi: lunar.getDayInGanZhi(),
        timeGanZhi: lunar.getTimeInGanZhi(),
    };
}

function fallbackLunar(date) {
    const springFestivals = { 2024:[2,10], 2025:[1,29], 2026:[2,17], 2027:[2,6], 2028:[1,26], 2029:[2,13], 2030:[2,3] };
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    const sf = springFestivals[year] || springFestivals[2025];
    const sfDate = new Date(year, sf[0]-1, sf[1]);
    let lunarYear = year;
    let lunarMonth, lunarDay;

    if (date < sfDate) {
        lunarYear = year - 1;
        const prevSf = springFestivals[lunarYear];
        if (prevSf) {
            const prevSfDate = new Date(lunarYear, prevSf[0]-1, prevSf[1]);
            const diff = Math.floor((date - prevSfDate) / (1000*60*60*24));
            lunarMonth = Math.floor(diff / 29.5) + 1;
            lunarDay = diff - Math.floor((lunarMonth-1) * 29.5) + 1;
        }
    } else {
        const diff = Math.floor((date - sfDate) / (1000*60*60*24));
        lunarMonth = Math.floor(diff / 29.5) + 1;
        lunarDay = diff - Math.floor((lunarMonth-1) * 29.5) + 1;
    }

    const shiChen = Math.floor((hour + 1) / 2) % 12 + 1;
    const yearNum = ((lunarYear - 4) % 12) + 1;
    return { year: yearNum, month: lunarMonth || 1, day: lunarDay || 1, hour: shiChen, yearGanZhi: '', monthGanZhi: '', dayGanZhi: '', timeGanZhi: '' };
}

// ============================================
// 五行生克判定
// ============================================
export function checkShengKe(tiWx, yongWx) {
    return checkBodyUseRelation(tiWx, yongWx).type;
}

export function shengKeText(type) {
    const map = {
        'sheng': '体生用，主耗泄，所求之事需付出努力',
        'ke': '体克用，主能掌控，事有可为',
        'beisheng': '用生体，主得助，吉象',
        'beike': '用克体，主受制，需谨慎',
        'bihe': '体用比和，主顺畅',
    };
    return map[type] || '';
}

// ============================================
// 易经文本获取（通过 DAL，数据来自 data/hexagrams.json）
// ============================================
export function getYaoCi(guaName, yaoIndex) {
    // yaoIndex: 0-based (0=初爻, 5=上爻)
    const dalResult = DAL.getYaoCi(guaName, yaoIndex + 1);
    if (dalResult) return dalResult;
    const ci = YAO_CI[guaName];
    return ci?.[yaoIndex] || '';
}

export function getBaiHua(guaName) {
    const dalResult = DAL.getBaiHua(guaName);
    if (dalResult) return dalResult;
    return BAI_HUA[guaName] || '';
}

export function getGuaCiText(guaName) {
    const dalResult = DAL.getGuaCi(guaName);
    if (dalResult) return dalResult;
    return '';
}

// ============================================
// 爻象渲染
// ============================================
export function getYaoHTML(yao, isDong = false) {
    const dongClass = isDong ? 'yao-dong' : '';
    if (yao === 1) {
        return `<div class="yao-line yao-yang ${dongClass}"></div>`;
    } else {
        return `<div class="yao-line yao-yin ${dongClass}"><span></span><span></span></div>`;
    }
}

// ============================================
// 三爻转八卦序号
// ============================================
export function yaoToKey(yao) {
    return yaoToTrigramId(yao);
}

// ============================================
// 数字转中文
// ============================================
export function numToChinese(num) {
    const map = {1:'初',2:'二',3:'三',4:'四',5:'五',6:'上'};
    return map[num] || num;
}
