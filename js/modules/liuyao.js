/**
 * 六爻模块
 * 摇卦、起卦、排盘、装卦、解卦全流程封装
 */

import { BA_GUA, getGua64, getBaGong, getNaJia, getLiuQin, ZHI_WUXING } from '../core/data.js';
import { getLunarDate, yaoToKey, numToChinese, getYaoCi, getBaiHua } from '../core/utils.js';

export default class LiuYao {
    // ---------- 铜钱摇卦 ----------

    static shakeCoin() {
        const coins = [
            Math.random() > 0.5 ? 1 : 0,
            Math.random() > 0.5 ? 1 : 0,
            Math.random() > 0.5 ? 1 : 0,
        ];
        const sum = coins.reduce((a, b) => a + b, 0);

        if (sum === 3) return { type: '老阳', yao: 1, dong: true, coins: [1,1,1] };
        if (sum === 2) return { type: '少阴', yao: 0, dong: false, coins };
        if (sum === 1) return { type: '少阳', yao: 1, dong: false, coins };
        return { type: '老阴', yao: 0, dong: true, coins: [0,0,0] };
    }

    // ---------- 起卦方法 ----------

    static qiGuaByTime() {
        const lunar = getLunarDate(new Date());
        const upper = (lunar.year + lunar.month + lunar.day) % 8 || 8;
        const lower = (lunar.year + lunar.month + lunar.day + lunar.hour) % 8 || 8;
        const dongYao = (lunar.year + lunar.month + lunar.day + lunar.hour) % 6 || 6;
        return this.buildGuaFromNumber(upper, lower, dongYao);
    }

    static qiGuaByNumber(n1, n2) {
        const upper = (Math.abs(n1) % 8) || 8;
        const lower = (Math.abs(n2) % 8) || 8;
        const dongYao = ((Math.abs(n1) + Math.abs(n2)) % 6) || 6;
        return this.buildGuaFromNumber(upper, lower, dongYao);
    }

    static buildGuaFromCoins(results) {
        const yao = results.map(r => r.yao);
        const dong = results.map(r => r.dong);
        const bianYao = yao.map((y, i) => dong[i] ? (y === 1 ? 0 : 1) : y);

        const lower = yaoToKey([yao[0], yao[1], yao[2]]);
        const upper = yaoToKey([yao[3], yao[4], yao[5]]);
        const bianLower = yaoToKey([bianYao[0], bianYao[1], bianYao[2]]);
        const bianUpper = yaoToKey([bianYao[3], bianYao[4], bianYao[5]]);

        const benGua = getGua64(upper, lower);
        const bianGua = getGua64(bianUpper, bianLower);
        const zhuangGua = this.zhuangGua(benGua.name, lower, upper);

        return {
            ben: { name: benGua.name, ci: benGua.ci, yao, dong },
            bian: { name: bianGua.name, yao: bianYao },
            zhuang: zhuangGua,
            results,
        };
    }

    static buildGuaFromNumber(upper, lower, dongYao) {
        const upperGua = BA_GUA[upper];
        const lowerGua = BA_GUA[lower];

        const yao = [
            lowerGua.yao[0], lowerGua.yao[1], lowerGua.yao[2],
            upperGua.yao[0], upperGua.yao[1], upperGua.yao[2]
        ];
        const dong = [false, false, false, false, false, false];
        dong[dongYao - 1] = true;

        const bianYao = yao.map((y, i) => dong[i] ? (y === 1 ? 0 : 1) : y);
        const benGua = getGua64(upper, lower);
        const bianLower = yaoToKey([bianYao[0], bianYao[1], bianYao[2]]);
        const bianUpper = yaoToKey([bianYao[3], bianYao[4], bianYao[5]]);
        const bianGua = getGua64(bianUpper, bianLower);
        const zhuangGua = this.zhuangGua(benGua.name, lower, upper);

        return {
            ben: { name: benGua.name, ci: benGua.ci, yao, dong },
            bian: { name: bianGua.name, yao: bianYao },
            zhuang: zhuangGua,
        };
    }

    // ---------- 装卦 ----------

    static zhuangGua(guaName, lower, upper) {
        const gong = getBaGong(guaName);
        const naJia = getNaJia(BA_GUA[lower].name, BA_GUA[upper].name);
        const liuQin = naJia.map(nj => {
            const zhiWx = ZHI_WUXING[nj.zhi];
            return getLiuQin(gong.wuxing, zhiWx);
        });

        return {
            gong: gong.gong,
            gongWuxing: gong.wuxing,
            shi: gong.shi,
            ying: gong.ying,
            naJia,
            liuQin,
        };
    }

    // ---------- 解卦 ----------

    static getDuanYu(result) {
        const { ben, bian, zhuang } = result;
        const dongIndices = ben.dong.map((d, i) => d ? i + 1 : 0).filter(Boolean);
        const yaoCiList = dongIndices.map(idx => ({
            position: numToChinese(idx) + '爻',
            text: getYaoCi(ben.name, idx - 1),
        }));
        return {
            benName: ben.name,
            bianName: bian.name,
            dongCount: dongIndices.length,
            dongYao: dongIndices,
            shi: numToChinese(zhuang.shi) + '爻',
            ying: numToChinese(zhuang.ying) + '爻',
            gong: `${zhuang.gong}宫（${zhuang.gongWuxing}）`,
            ci: ben.ci,
            baihua: getBaiHua(ben.name),
            yaoCi: yaoCiList,
        };
    }
}
