// 白給的寫作工具箱 (baigei_writer_toolbox) 共享核心庫

import { TOOLS, HOME_OPTION } from './tools_data.js?v=6';
import { initHonglu, t, l, SUPPORTED_LANGS, getLanguageName } from './honglu.js';

export { initHonglu, t, l, SUPPORTED_LANGS, getLanguageName };

// === 1. 物理常數庫 ===
export const CONSTANTS = {
	c: 299792458,               // 光速 (m/s)
	G: 6.67430e-11,             // 萬有引力常數 (m^3 kg^-1 s^-2)
	g0: 9.80665,                // 地球標準重力加速度 (m/s^2)
	AU: 1.495978707e11,         // 天文單位 (m)
	LY: 9.4607304725808e15,     // 光年 (m)
	PC: 3.08567758149137e16,    // 秒差距 (m) (1 pc ≈ 3.26156 ly)
	LY_IN_PC: 3.261563777,
	M_SUN: 1.98847e30,          // 太陽質量 (kg)
	R_SUN: 6.96342e8,           // 太陽半徑 (m)
	L_SUN: 3.828e26,            // 太陽光度 (W)
	M_EARTH: 5.9722e24,         // 地球質量 (kg)
	R_EARTH: 6.371e6,           // 地球平均半徑 (m)
	kB: 1.380649e-23,           // 玻爾茲曼常數 (J/K)
	AMU: 1.66053906660e-27,     // 原子質量單位 (kg)
	JOULES_PER_TON_TNT: 4.184e9 // 1 噸 TNT 當量 (J)
};

// === 2. 輔助格式化與 Markdown 解析函數 ===
export const fmt = {
	num: (n, digits = 2) => !isFinite(n) ? "∞" : n.toLocaleString('en-US', { minimumFractionDigits: digits, maximumFractionDigits: digits }),
	sci: (n, digits = 3) => !isFinite(n) ? "∞" : n.toExponential(digits),
	smart: (n) => {
		if (!isFinite(n)) return "∞";
		if (Math.abs(n) >= 1e6 || (Math.abs(n) < 0.001 && n !== 0)) return n.toExponential(3);
		return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 });
	},
	energy: (joules) => {
		if (!isFinite(joules)) return `∞ ${t('單位_焦耳')}`;
		const tntTons = joules / CONSTANTS.JOULES_PER_TON_TNT;
		if (tntTons >= 1e6) {
			return `${fmt.smart(joules)} ${t('單位_焦耳')} (≈ ${fmt.smart(tntTons / 1e6)} ${t('單位_百萬噸TNT')})`;
		} else if (tntTons >= 1) {
			return `${fmt.smart(joules)} ${t('單位_焦耳')} (≈ ${fmt.smart(tntTons)} ${t('單位_噸TNT')})`;
		}
		return `${fmt.smart(joules)} ${t('單位_焦耳')}`;
	}
};

/**
 * 初階通用 Markdown 轉 HTML 解析器 (支援相對路徑定位與 page= 路由轉寫)
 * @param {string} mdText - Markdown 文字內容
 * @param {string} currentFilePath - 當前檔案相對根目錄的路徑 (如 "docs/guide.md" 或 "README.md")
 */
export function parseMarkdown(mdText, currentFilePath = '') {
	if (!mdText) return "";

	function resolvePath(relativePath) {
		if (!relativePath || /^(?:[a-z]+:|\/\/|#)/i.test(relativePath)) {
			return relativePath;
		}
		const cleanPath = relativePath.trim();
		if (cleanPath.startsWith('/')) {
			return cleanPath.substring(1);
		}
		const lastSlash = currentFilePath.lastIndexOf('/');
		const baseDir = lastSlash !== -1 ? currentFilePath.substring(0, lastSlash + 1) : '';
		try {
			const dummyBase = 'http://localhost/' + baseDir;
			const u = new URL(cleanPath, dummyBase);
			return u.pathname.substring(1);
		} catch (e) {
			return baseDir + cleanPath;
		}
	}

	function transformHref(href) {
		if (!href || /^(?:[a-z]+:|\/\/|#)/i.test(href)) return href;
		const resolved = resolvePath(href);
		const filename = resolved.split('/').pop().split('#')[0];
		const isDoc = /\.(?:md|markdown|txt)$/i.test(filename) || /^LICENSE(?:\.(?:txt|md))?$/i.test(filename) || !/\.[a-z0-9]+$/i.test(filename);
		return isDoc ? `index.html?page=${encodeURIComponent(resolved)}` : resolved;
	}

	let html = mdText
		.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
		.replace(/^### (.*$)/gim, '<h3>$1</h3>')
		.replace(/^## (.*$)/gim, '<h2>$1</h2>')
		.replace(/^# (.*$)/gim, '<h1>$1</h1>')
		.replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
		.replace(/`([^`]+)`/gim, '<code>$1</code>')
		.replace(/^\s*-\s+(.*$)/gim, '<li>$1</li>')
		.replace(/!\[([^\]]*)\]\(([^)]+)\)/gim, (m, alt, src) => `<img src="${resolvePath(src)}" alt="${alt}">`)
		.replace(/\[([^\]]+)\]\(([^)]+)\)/gim, (m, label, href) => `<a href="${transformHref(href)}">${label}</a>`)
		.replace(/&lt;img\s+(?:[^&>]*?\s+)?src=["']([^"']+)["']([^&>]*)&gt;/gim, (m, src, rest) => `<img src="${resolvePath(src)}"${rest}>`)
		.replace(/&lt;a\s+(?:[^&>]*?\s+)?href=["']([^"']+)["']([^&>]*)&gt;(.*?)&lt;\/a&gt;/gim, (m, href, rest, label) => `<a href="${transformHref(href)}"${rest}>${label}</a>`);

	html = html.replace(/(<li>.*<\/li>)/gim, '<ul>$1</ul>').replace(/<\/ul>\s*<ul>/gim, '');

	return html.split(/\n\n+/)
		.map(p => p.trim())
		.filter(Boolean)
		.map(p => /^(<h|<ul|<ol|<pre|<img)/.test(p) ? p : `<p>${p.replace(/\n/g, '<br>')}</p>`)
		.join('\n');
}

// === 3. 主題切換控制 (Theme Control) ===
export function initTheme() {
	const savedTheme = localStorage.getItem('sf_toolbox_theme') || 'dark';
	document.documentElement.setAttribute('data-theme', savedTheme);

	const btn = document.getElementById('theme-toggle');
	if (!btn) return;

	btn.textContent = savedTheme === 'light' ? t('主題_暗色') : t('主題_亮色');

	if (!btn.dataset.bound) {
		btn.dataset.bound = 'true';
		btn.addEventListener('click', () => {
			const current = document.documentElement.getAttribute('data-theme');
			const next = current === 'light' ? 'dark' : 'light';
			document.documentElement.setAttribute('data-theme', next);
			localStorage.setItem('sf_toolbox_theme', next);
			btn.textContent = next === 'light' ? t('主題_暗色') : t('主題_亮色');
		});
	}
}

// === 4. SPA 頂部快速切換選單 (Quick Nav, 動態讀取 HOME_OPTION) ===
export function initQuickNav(currentTool) {
	const header = document.querySelector('header.app-header');
	if (!header) return;

	let navContainer = header.querySelector('.quick-nav-group');
	if (!navContainer) {
		navContainer = document.createElement('div');
		navContainer.className = 'quick-nav-group';
		const titleDiv = header.querySelector('.header-title');
		if (titleDiv) {
			titleDiv.after(navContainer);
		} else {
			header.appendChild(navContainer);
		}
	}

	const urlParams = new URLSearchParams(window.location.search);
	const activeTool = currentTool || urlParams.get('tool') || '';
	const currentLang = localStorage.getItem('honglu_lang') || 'zh-Hant';

	const optionsHTML = Object.entries(TOOLS).map(([catKey, toolList]) => `
		<optgroup label="${t(catKey)}">
			${toolList.map(toolId => `
				<option value="index.html?tool=${toolId}" ${toolId === activeTool ? 'selected' : ''}>
					${l('工具_名稱', {}, toolId)}
				</option>
			`).join('')}
		</optgroup>
	`).join('');

	navContainer.innerHTML = `
		<select id="quick-nav-select" class="quick-nav-select">
			<option value="${HOME_OPTION.url}" ${!activeTool ? 'selected' : ''}>${t(HOME_OPTION.key)}</option>
			${optionsHTML}
		</select>
		<select id="lang-select" class="quick-nav-select">
			${SUPPORTED_LANGS.map(code => `
				<option value="${code}" ${currentLang === code ? 'selected' : ''}>${getLanguageName(code)}</option>
			`).join('')}
		</select>
		<button id="theme-toggle"></button>
	`;

	initTheme();

	const toolSelect = navContainer.querySelector('#quick-nav-select');
	if (toolSelect) {
		toolSelect.addEventListener('change', (e) => {
			const targetPath = e.target.value;
			if (targetPath) {
				history.pushState(null, '', targetPath);
				window.dispatchEvent(new CustomEvent('app:navchange'));
			}
		});
	}

	const langSelect = navContainer.querySelector('#lang-select');
	if (langSelect) {
		langSelect.addEventListener('change', async (e) => {
			const newLang = e.target.value;
			localStorage.setItem('honglu_lang', newLang);
			await initHonglu(newLang);
			window.dispatchEvent(new CustomEvent('honglu:langchange', { detail: { lang: newLang } }));
		});
	}
}

// === 5. 通用預設方案管理器 (PresetManager) ===
export class PresetManager {
	constructor(inputIds, onLoadCallback) {
		const urlParams = new URLSearchParams(window.location.search);
		const toolKey = urlParams.get('tool') || 'default';

		this.toolId = toolKey;
		this.inputIds = inputIds || [];
		this.onLoad = onLoadCallback;
		this.storageKey = `sf_preset_${this.toolId}`;
		this.presets = this.loadAllPresets();
		this.renderUI();
		initQuickNav(toolKey);
	}

	loadAllPresets() {
		try {
			const raw = localStorage.getItem(this.storageKey);
			return raw ? JSON.parse(raw) : {};
		} catch (e) {
			console.error(t('錯誤_載入預設'), e);
			return {};
		}
	}

	saveAllPresets() {
		try {
			localStorage.setItem(this.storageKey, JSON.stringify(this.presets));
		} catch (e) {
			console.error(t('錯誤_寫入預設'), e);
		}
	}

	getCurrentData() {
		const data = {};
		this.inputIds.forEach(id => {
			const el = document.getElementById(id);
			if (el) data[id] = el.value;
		});
		return data;
	}

	applyData(data) {
		if (!data) return;
		Object.entries(data).forEach(([id, val]) => {
			const el = document.getElementById(id);
			if (el) el.value = val;
		});
		this.onLoad?.();
	}

	renderUI() {
		const container = document.getElementById('preset-container');
		if (!container) return;

		container.classList.add('preset-container');
		container.innerHTML = `
			<label>${t('預設_標籤')}</label>
			<div class="preset-controls">
				<div class="preset-select-group">
					<select id="preset-select"></select>
					<button type="button" id="btn-preset-delete">${t('預設_刪除')}</button>
				</div>
				<div class="preset-actions">
					<input type="text" id="preset-name-input" placeholder="${t('預設_名稱提示')}" />
					<button type="button" id="btn-preset-save">${t('預設_儲存')}</button>
					<button type="button" id="btn-preset-export" title="下載成 JSON 檔案">${t('預設_匯出')}</button>
					<button type="button" id="btn-preset-import-trigger" title="載入 JSON 檔案">${t('預設_匯入')}</button>
					<input type="file" id="btn-preset-import-file" accept=".json" style="display:none;" />
				</div>
			</div>
		`;

		this.refreshSelect('');

		const select = container.querySelector('#preset-select');
		const nameInput = container.querySelector('#preset-name-input');
		const saveBtn = container.querySelector('#btn-preset-save');
		const delBtn = container.querySelector('#btn-preset-delete');
		const exportBtn = container.querySelector('#btn-preset-export');
		const importTrigger = container.querySelector('#btn-preset-import-trigger');
		const importFile = container.querySelector('#btn-preset-import-file');

		select.addEventListener('change', (e) => {
			const name = e.target.value;
			if (name && this.presets[name]) {
				nameInput.value = name;
				this.applyData(this.presets[name]);
			}
		});

		saveBtn.addEventListener('click', () => {
			const name = nameInput.value.trim();
			if (!name) {
				alert(t('預設_提示名稱'));
				return;
			}
			this.presets[name] = this.getCurrentData();
			this.saveAllPresets();
			this.refreshSelect(name);
		});

		delBtn.addEventListener('click', () => {
			const name = select.value;
			if (!name) return;
			delete this.presets[name];
			this.saveAllPresets();
			nameInput.value = '';
			this.refreshSelect('');
		});

		exportBtn.addEventListener('click', () => {
			const blob = new Blob([JSON.stringify(this.presets, null, 2)], { type: 'application/json' });
			const url = URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = `sf_preset_${this.toolId}.json`;
			a.click();
			URL.revokeObjectURL(url);
		});

		importTrigger.addEventListener('click', () => importFile.click());

		importFile.addEventListener('change', (e) => {
			const file = e.target.files[0];
			if (!file) return;
			const reader = new FileReader();
			reader.onload = (evt) => {
				try {
					const imported = JSON.parse(evt.target.result);
					this.presets = { ...this.presets, ...imported };
					this.saveAllPresets();
					this.refreshSelect('');
					alert(t('預設_匯入成功'));
				} catch (err) {
					alert(t('預設_匯入失敗'));
				}
			};
			reader.readAsText(file);
		});
	}

	refreshSelect(selectedName) {
		const select = document.getElementById('preset-select');
		if (!select) return;
		select.innerHTML = `
			<option value="">${t('預設_提示')}</option>
			${Object.keys(this.presets).map(name => `<option value="${name}" ${name === selectedName ? 'selected' : ''}>${name}</option>`).join('')}
		`;
	}
}

// 初始化全域主題
document.addEventListener('DOMContentLoaded', () => {
	initTheme();
});
