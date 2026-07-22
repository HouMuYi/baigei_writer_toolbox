// 鴻臚 (Honglu) - 前端原生多語系 (i18n) 核心庫

const SOURCE_OF_TRUTH = 'zh-Hant';
let currentLanguage = SOURCE_OF_TRUTH;
const store = Object.create(null);
const loadedLanguages = new Set();

export const PARENT_MAP = {
	'ang': 'en-GB',
	'gmy': 'grc',
	'grc': 'el',
	'qya': 'ang',
	'tlh': 'en',
};

export let SUPPORTED_LANGS = [];

/**
 * 前端自動偵測目錄下的所有語言字典檔
 */
async function detectLanguages() {
	try {
		const res = await fetch('./honglu/');
		if (!res.ok) throw new Error('Failed to list directory');
		const html = await res.text();
		
		// 僅提取 HTML 目錄清單中最後一個斜線後的檔名作為語言代碼
		const matches = html.matchAll(/href="(?:[^"\/]*\/)*([a-zA-Z0-9_-]+)\.jsonc"/g);
		const langs = new Set();
		for (const match of matches) {
			langs.add(match[1]);
		}
		
		if (langs.size > 0) {
			SUPPORTED_LANGS = Array.from(langs);
			return;
		}
	} catch (e) {
		console.warn('[Honglu] 目錄自動偵測失敗，回退至預設配置:', e.message);
	}
	
	// 若偵測失敗（非 Live Server 等開發環境），則以基礎支援語系作為 fallback 容錯
	SUPPORTED_LANGS = ['zh-Hant', 'la', 'grc', 'qya', 'tlh', 'non'];
}

/**
 * 去除 JSONC 中的註解並解析為物件
 * @param {string} text
 * @returns {object}
 */
export function parseJsonc(text) {
	if (!text) return {};
	const clean = text
		.replace(/\/\*[\s\S]*?\*\//g, '')
		.replace(/\/\/.*/g, '');
	return JSON.parse(clean);
}

/**
 * 建立語言退回鏈 (例: qya -> ang -> en-GB -> zh-Hant)
 * @param {string} lang
 * @returns {string[]}
 */
function buildFallbackChain(lang) {
	if (lang === SOURCE_OF_TRUTH) return [SOURCE_OF_TRUTH];
	const chain = [];
	let current = lang;
	const visited = new Set();
	while (current && !visited.has(current) && current !== SOURCE_OF_TRUTH) {
		chain.push(current);
		visited.add(current);
		const parent = PARENT_MAP[current];
		if (parent) {
			current = parent;
		} else {
			const i = current.lastIndexOf('-');
			current = i > 0 ? current.substring(0, i) : null;
		}
	}
	chain.push(SOURCE_OF_TRUTH);
	return chain;
}

/**
 * 前端載入字典檔
 * @param {string} l
 * @returns {Promise<boolean>}
 */
async function loadLanguageFile(l) {
	if (loadedLanguages.has(l)) return true;
	try {
		const res = await fetch(`./honglu/${l}.jsonc`);
		if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
		const text = await res.text();
		const parsed = parseJsonc(text);

		for (const [langKey, nsDict] of Object.entries(parsed)) {
			if (!nsDict || typeof nsDict !== 'object') continue;
			for (const [ns, dict] of Object.entries(nsDict)) {
				store[ns] ??= Object.create(null);
				store[ns][langKey] ??= Object.create(null);
				for (const [k, v] of Object.entries(dict)) {
					const cleanKey = k.replace(/:(\d+)$/, '');
					store[ns][langKey][cleanKey] = v;
				}
			}
		}
		loadedLanguages.add(l);
		return true;
	} catch (err) {
		console.warn(`[Honglu] 載入字典 (${l}) 跳過或不存在:`, err.message);
		return false;
	}
}

/**
 * 前端載入與初始化鴻臚字典
 * @param {string} [lang='zh-Hant']
 */
export async function initHonglu(lang = SOURCE_OF_TRUTH) {
	currentLanguage = lang;

	// 動態偵測目錄下所有的語言檔
	await detectLanguages();

	// 1. 收集所有需要加載的語言（僅加載 SUPPORTED_LANGS 裡實體存在的 fallback 鏈成員）
	const langsToLoad = new Set();
	for (const l of SUPPORTED_LANGS) {
		buildFallbackChain(l).forEach(fallbackLang => {
			if (SUPPORTED_LANGS.includes(fallbackLang)) {
				langsToLoad.add(fallbackLang);
			}
		});
	}

	// 2. 載入所有收集到的語言檔
	for (const l of langsToLoad) {
		await loadLanguageFile(l);
	}
}

/**
 * 取得特定語言的自稱（如 "語言_名稱"）
 * @param {string} lang
 * @returns {string}
 */
export function getLanguageName(lang) {
	return store['__GLOBAL__']?.[lang]?.[ '語言_名稱' ] ?? lang;
}

/**
 * 變數插值替換
 * @param {string} message
 * @param {Record<string, string|number>} params
 * @returns {string}
 */
function interpolate(message, params) {
	if (typeof message !== 'string') return String(message ?? '');
	const safeParams = (params && typeof params === 'object') ? params : {};
	return message.replace(/\{(\w+)\}/g, (_, key) => key in safeParams ? String(safeParams[key]) : `{${key}}`);
}

/**
 * 字典檢索
 * @param {string} key
 * @param {Record<string, string|number>} params
 * @param {string} namespace
 * @returns {string|null}
 */
function lookup(key, params, namespace) {
	const nsDict = store[namespace];
	const chain = buildFallbackChain(currentLanguage);

	if (nsDict) {
		for (const l of chain) {
			const dict = nsDict[l];
			if (dict && key in dict) {
				return interpolate(dict[key], params);
			}
		}
	}

	// 局部字典未命中時，退回全域 __GLOBAL__ 字典檢索
	if (namespace !== '__GLOBAL__' && store['__GLOBAL__']) {
		for (const l of chain) {
			const globalDict = store['__GLOBAL__'][l];
			if (globalDict && key in globalDict) {
				return interpolate(globalDict[key], params);
			}
		}
	}

	return null;
}

/**
 * 取得全域多語系字串
 * @param {string} key
 * @param {Record<string, string|number>} [params]
 * @returns {string}
 */
export const t = (key, params = {}) => lookup(key, params, '__GLOBAL__') ?? interpolate(key, params);

/**
 * 取得工具專屬多語系字串 (先查工具局部字典，無則退回全域字典)
 * @param {string} key
 * @param {Record<string, string|number>} [params]
 * @param {string} toolName
 * @returns {string}
 */
export const l = (key, params = {}, toolName) => lookup(key, params, toolName) ?? interpolate(key, params);

/**
 * 切換當前語言
 * @param {string} lang
 */
export function setLanguage(lang) {
	if (lang) currentLanguage = lang;
}

/**
 * 取得當前語言
 * @returns {string}
 */
export function getCurrentLanguage() {
	return currentLanguage;
}
