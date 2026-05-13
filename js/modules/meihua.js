/**
 * 梅花易数模块
 * 起卦、排盘、解卦全流程封装
 */

import { BA_GUA, getGua64 } from '../core/data.js';
import { getLunarDate, checkShengKe, shengKeText, yaoToKey, getBaiHua } from '../core/utils.js';

export default class MeiHuaYiShu {
    // ---------- 起卦方法 ----------

    static qiGuaByTime() {
        const lunar = getLunarDate(new Date());
        const upperNum = (lunar.year + lunar.month + lunar.day) % 8 || 8;
        const lowerNum = (lunar.year + lunar.month + lunar.day + lunar.hour) % 8 || 8;
        const dongYao = (lunar.year + lunar.month + lunar.day + lunar.hour) % 6 || 6;
        return this.buildGua(upperNum, lowerNum, dongYao);
    }

    static qiGuaByNumber(num) {
        const str = Math.abs(num).toString();
        let upperNum, lowerNum;
        if (str.length === 1) {
            upperNum = parseInt(str);
            lowerNum = Math.floor(Math.random() * 8) + 1;
        } else {
            const mid = Math.floor(str.length / 2);
            upperNum = parseInt(str.slice(0, mid)) || 1;
            lowerNum = parseInt(str.slice(mid)) || 1;
        }
        const upper = (upperNum % 8) || 8;
        const lower = (lowerNum % 8) || 8;
        const total = upperNum + lowerNum;
        const dongYao = (total % 6) || 6;
        return this.buildGua(upper, lower, dongYao);
    }

    // 三数起卦：第一数上卦，第二数下卦，第三数动爻
    static qiGuaByThreeNumbers(n1, n2, n3) {
        const upper = (Math.abs(n1) % 8) || 8;
        const lower = (Math.abs(n2) % 8) || 8;
        const dongYao = (Math.abs(n3) % 6) || 6;
        return this.buildGua(upper, lower, dongYao);
    }

    static qiGuaRandom() {
        // 混合时间熵 + Math.random，避免短时间内重复
        const now = Date.now();
        const tick = now % 10000;
        const r1 = Math.floor(Math.random() * 10000);
        const r2 = Math.floor(Math.random() * 9973);
        const upper = ((tick + r1) % 8) || 8;
        const lower = ((tick + r2) % 8) || 8;
        const dongYao = ((r1 + r2) % 6) || 6;
        return this.buildGua(upper, lower, dongYao);
    }

    // ---------- 排盘核心 ----------

    static buildGua(upper, lower, dongYao) {
        const upperGua = BA_GUA[upper];
        const lowerGua = BA_GUA[lower];

        const benYao = [
            lowerGua.yao[0], lowerGua.yao[1], lowerGua.yao[2],
            upperGua.yao[0], upperGua.yao[1], upperGua.yao[2]
        ];

        // 互卦
        const huLower = [benYao[1], benYao[2], benYao[3]];
        const huUpper = [benYao[2], benYao[3], benYao[4]];
        const huLowerKey = yaoToKey(huLower);
        const huUpperKey = yaoToKey(huUpper);

        // 变卦
        const bianYao = [...benYao];
        bianYao[dongYao - 1] = bianYao[dongYao - 1] === 1 ? 0 : 1;

        // 体用
        const ti = dongYao <= 3 ? upper : lower;
        const yong = dongYao <= 3 ? lower : upper;
        const benGua = getGua64(upper, lower);

        return {
            ben: {
                name: benGua.name,
                ci: benGua.ci,
                upper: upperGua,
                lower: lowerGua,
                yao: benYao,
            },
            hu: {
                name: getGua64(huUpperKey, huLowerKey).name,
                upper: BA_GUA[huUpperKey],
                lower: BA_GUA[huLowerKey],
                yao: [...huLower, ...huUpper],
            },
            bian: {
                name: this.getBianGuaName(bianYao),
                yao: bianYao,
            },
            dongYao,
            ti: BA_GUA[ti],
            yong: BA_GUA[yong],
        };
    }

    static getBianGuaName(yao) {
        const lower = yaoToKey([yao[0], yao[1], yao[2]]);
        const upper = yaoToKey([yao[3], yao[4], yao[5]]);
        return getGua64(upper, lower).name;
    }

    // ---------- 解卦 ----------

    static getDuanYu(result) {
        const { ben, dongYao, ti, yong } = result;
        const sk = checkShengKe(ti.wuxing, yong.wuxing);
        return {
            guaName: ben.name,
            dongYao,
            ti: `${ti.name}（${ti.wuxing}）`,
            yong: `${yong.name}（${yong.wuxing}）`,
            shengKe: shengKeText(sk),
            ci: ben.ci,
            baihua: getBaiHua(ben.name),
        };
    }
}
