/**
 * 易占 - 主应用入口
 * ES6 Module 架构
 */

import { DAL } from './core/dal.js';
import MeiHuaYiShu from './modules/meihua.js';
import LiuYao from './modules/liuyao.js';
import { getYaoHTML, numToChinese, getDaBaiHua } from './core/utils.js';

// ============================================
// 页面导航
// ============================================
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById('page-' + pageId).classList.add('active');
    window.scrollTo(0, 0);
}

document.querySelectorAll('.method-card').forEach(card => {
    card.addEventListener('click', () => showPage(card.dataset.page));
});

document.querySelectorAll('[data-back]').forEach(btn => {
    btn.addEventListener('click', () => showPage('home'));
});

// ============================================
// 梅花易数 UI
// ============================================
const MH_METHODS = ['time', 'three', 'random'];
let mhCurrentMethod = 'time';

function initMeiHua() {
    document.querySelectorAll('[data-mh-method]').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('[data-mh-method]').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            mhCurrentMethod = btn.dataset.mhMethod;
            MH_METHODS.forEach(m => {
                document.getElementById('mh-opt-' + m)?.classList.remove('active');
            });
            document.getElementById('mh-opt-' + mhCurrentMethod)?.classList.add('active');
        });
    });

    document.getElementById('btn-meihua-start').addEventListener('click', () => {
        let result;
        if (mhCurrentMethod === 'time') {
            result = MeiHuaYiShu.qiGuaByTime();
        } else if (mhCurrentMethod === 'three') {
            const n1 = parseInt(document.getElementById('mh-three-1').value.trim());
            const n2 = parseInt(document.getElementById('mh-three-2').value.trim());
            const n3 = parseInt(document.getElementById('mh-three-3').value.trim());
            if ([n1, n2, n3].some(n => isNaN(n))) { alert('请输入三个有效数字'); return; }
            result = MeiHuaYiShu.qiGuaByThreeNumbers(n1, n2, n3);
        } else {
            result = MeiHuaYiShu.qiGuaRandom();
        }
        renderMeiHuaResult(result);
        document.getElementById('meihua-start').classList.remove('active');
        document.getElementById('meihua-result').classList.add('active');
    });

    document.getElementById('btn-meihua-reset').addEventListener('click', () => {
        document.getElementById('meihua-result').classList.remove('active');
        document.getElementById('meihua-start').classList.add('active');
        document.getElementById('meihua-question').value = '';
        document.getElementById('mh-three-1').value = '';
        document.getElementById('mh-three-2').value = '';
        document.getElementById('mh-three-3').value = '';
    });
}

function renderMeiHuaResult(result) {
    document.getElementById('mh-ben-gua-name').textContent = result.ben.name;
    document.getElementById('mh-ben-gua-xiang').innerHTML = renderYaoLines(result.ben.yao, result.dongYao);
    document.getElementById('mh-ben-gua-info').textContent = `${result.ben.upper.name}上${result.ben.lower.name}下`;

    document.getElementById('mh-hu-gua-name').textContent = result.hu.name;
    document.getElementById('mh-hu-gua-xiang').innerHTML = renderYaoLines(result.hu.yao);
    document.getElementById('mh-hu-gua-info').textContent = `${result.hu.upper.name}上${result.hu.lower.name}下`;

    document.getElementById('mh-bian-gua-name').textContent = result.bian.name;
    document.getElementById('mh-bian-gua-xiang').innerHTML = renderYaoLines(result.bian.yao);
    document.getElementById('mh-bian-gua-info').textContent = '';

    document.getElementById('mh-dong-yao').textContent = `第${result.dongYao}爻`;
    document.getElementById('mh-ti-gua').innerHTML = `${result.ti.symbol} ${result.ti.name}（${result.ti.wuxing}）`;
    document.getElementById('mh-yong-gua').innerHTML = `${result.yong.symbol} ${result.yong.name}（${result.yong.wuxing}）`;

    const mhDuan = MeiHuaYiShu.getDuanYu(result);
    const mhDaBaihua = getDaBaiHua(result.ben.name);
    document.getElementById('mh-duan-original').innerHTML = `<div class="duan-title">卦辞原文</div><div class="duan-text duan-classic">${mhDuan.ci}</div>`;
    document.getElementById('mh-duan-baihua').innerHTML = `
        <div class="duan-title">白话释义 · 体用分析</div>
        <div class="duan-text">${mhDuan.baihua}<br><br>${mhDuan.shengKe}</div>
        ${mhDaBaihua ? `<div class="duan-subtitle">💡 大白话</div><div class="duan-text duan-dabaihua">${mhDaBaihua}</div>` : ''}
    `;
}

function renderYaoLines(yao, dongYao = -1) {
    let html = '';
    for (let i = 5; i >= 0; i--) {
        html += getYaoHTML(yao[i], i + 1 === dongYao);
    }
    return html;
}

// ============================================
// 六爻 UI
// ============================================
let lyCurrentMethod = 'coin';
let lyCoinResults = [];
let lyCurrentCoins = [0, 0, 0];

function initLiuYao() {
    document.querySelectorAll('[data-ly-method]').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('[data-ly-method]').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            lyCurrentMethod = btn.dataset.lyMethod;
            ['coin', 'time', 'number'].forEach(m => {
                document.getElementById('ly-opt-' + m)?.classList.remove('active');
            });
            document.getElementById('ly-opt-' + lyCurrentMethod)?.classList.add('active');
        });
    });

    document.getElementById('btn-shake-coin').addEventListener('click', async () => {
        if (lyCoinResults.length >= 6) return;
        const btn = document.getElementById('btn-shake-coin');
        btn.disabled = true;
        btn.textContent = '摇动中...';

        document.querySelectorAll('.coin-item').forEach(c => c.classList.add('shaking'));
        await sleep(500);
        document.querySelectorAll('.coin-item').forEach(c => c.classList.remove('shaking'));

        const result = LiuYao.shakeCoin();
        lyCoinResults.push(result);
        lyCurrentCoins = result.coins;
        updateCoinDisplay();

        document.getElementById('coin-result').textContent = result.type;

        const slots = document.querySelectorAll('.yao-slot');
        const idx = lyCoinResults.length - 1;
        slots[idx].classList.add(result.yao === 1 ? 'filled-yang' : 'filled-yin');

        if (lyCoinResults.length >= 6) {
            btn.textContent = '已完成';
            btn.disabled = true;
            document.getElementById('btn-liuyao-start').classList.remove('hidden');
        } else {
            btn.textContent = `摇一摇 (${lyCoinResults.length + 1}/6)`;
            btn.disabled = false;
        }
    });

    document.getElementById('btn-liuyao-time').addEventListener('click', () => {
        const result = LiuYao.qiGuaByTime();
        renderLiuYaoResult(result);
        switchToLiuYaoResult();
    });

    document.getElementById('btn-liuyao-number').addEventListener('click', () => {
        const val = document.getElementById('ly-number-input').value.trim();
        const nums = val.split(/\s+/).map(Number).filter(n => !isNaN(n));
        if (nums.length < 2) { alert('请输入两个数字，用空格分隔'); return; }
        const result = LiuYao.qiGuaByNumber(nums[0], nums[1]);
        renderLiuYaoResult(result);
        switchToLiuYaoResult();
    });

    document.getElementById('btn-liuyao-start').addEventListener('click', () => {
        const result = LiuYao.buildGuaFromCoins(lyCoinResults);
        renderLiuYaoResult(result);
        switchToLiuYaoResult();
    });

    document.getElementById('btn-liuyao-reset').addEventListener('click', resetLiuYao);
}

function switchToLiuYaoResult() {
    document.getElementById('liuyao-start').classList.remove('active');
    document.getElementById('liuyao-result').classList.add('active');
}

function resetLiuYao() {
    lyCoinResults = [];
    lyCurrentCoins = [0, 0, 0];
    document.getElementById('liuyao-result').classList.remove('active');
    document.getElementById('liuyao-start').classList.add('active');
    document.getElementById('liuyao-question').value = '';
    document.getElementById('ly-number-input').value = '';
    document.getElementById('coin-result').textContent = '准备就绪';
    document.querySelectorAll('.yao-slot').forEach(s => s.classList.remove('filled-yang', 'filled-yin'));
    document.querySelectorAll('.coin-item').forEach(c => { c.textContent = ''; });
    const btn = document.getElementById('btn-shake-coin');
    btn.textContent = '摇一摇';
    btn.disabled = false;
    document.getElementById('btn-liuyao-start').classList.add('hidden');
}

function updateCoinDisplay() {
    const els = document.querySelectorAll('.coin-item');
    els.forEach((el, i) => {
        el.textContent = lyCurrentCoins[i] === 1 ? '●' : '○';
    });
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function renderLiuYaoResult(result) {
    const { ben, bian, zhuang } = result;

    document.getElementById('ly-ben-gua-name').textContent = ben.name;
    document.getElementById('ly-ben-yao-list').innerHTML = renderLiuYaoYaoList(ben.yao, ben.dong, zhuang, true);

    document.getElementById('ly-bian-gua-name').textContent = bian.name;
    document.getElementById('ly-bian-yao-list').innerHTML = renderLiuYaoYaoList(bian.yao, ben.dong, zhuang, false);

    const infoHtml = `
        <div class="ly-info-item"><span class="ly-info-label">卦宫</span><span class="ly-info-value">${zhuang.gong}宫 (${zhuang.gongWuxing})</span></div>
        <div class="ly-info-item"><span class="ly-info-label">世爻</span><span class="ly-info-value">${numToChinese(zhuang.shi)}爻</span></div>
        <div class="ly-info-item"><span class="ly-info-label">应爻</span><span class="ly-info-value">${numToChinese(zhuang.ying)}爻</span></div>
    `;
    document.getElementById('ly-info-list').innerHTML = infoHtml;

    const lyDuan = LiuYao.getDuanYu(result);
    let yaoCiHtml = '';
    if (lyDuan.yaoCi.length > 0) {
        yaoCiHtml = lyDuan.yaoCi.map(y => `<div class="yao-ci-item"><span class="yao-ci-pos">${y.position}</span>${y.text}</div>`).join('');
    }
    document.getElementById('ly-duan-original').innerHTML = `
        <div class="duan-title">卦辞原文</div>
        <div class="duan-text duan-classic">${lyDuan.ci}</div>
        ${yaoCiHtml ? `<div class="duan-subtitle">动爻爻辞</div>${yaoCiHtml}` : ''}
    `;
    const lyDaBaihua = getDaBaiHua(result.ben.name);
    document.getElementById('ly-duan-baihua').innerHTML = `
        <div class="duan-title">白话释义 · 卦象分析</div>
        <div class="duan-text">${lyDuan.baihua}<br><br>世爻在${lyDuan.shi}，应爻在${lyDuan.ying}。卦宫${lyDuan.gong}。共${lyDuan.dongCount}个动爻。</div>
        ${lyDaBaihua ? `<div class="duan-subtitle">💡 大白话</div><div class="duan-text duan-dabaihua">${lyDaBaihua}</div>` : ''}
    `;
}

function renderLiuYaoYaoList(yao, dong, zhuang, showNajia) {
    let html = '';
    for (let i = 5; i >= 0; i--) {
        const isDong = dong ? dong[i] : false;
        const mark = isDong ? '变' : '';
        const naJiaText = showNajia && zhuang.naJia[i]
            ? `<span style="color:var(--text-tertiary);font-size:10px;margin-left:4px;">${zhuang.naJia[i].gan}${zhuang.naJia[i].zhi}·${zhuang.liuQin[i]}</span>`
            : '';
        html += `
            <div class="yao-row">
                <span class="yao-mark ${mark ? '' : 'empty'}">${mark}</span>
                ${getYaoHTML(yao[i], isDong)}
                ${naJiaText}
            </div>
        `;
    }
    return html;
}

// ============================================
// 初始化
// ============================================
document.addEventListener('DOMContentLoaded', async () => {
    try {
        await DAL.init();
        console.log('DAL 数据层已就绪，版本:', DAL.getHexagramMeta().version);
    } catch (err) {
        console.error('DAL 初始化失败:', err);
    }
    initMeiHua();
    initLiuYao();
    console.log('易占 - 已就绪');
});
