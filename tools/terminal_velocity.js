// 白給的寫作工具箱 (baigei_writer_toolbox) - 微工具模組 (終端速度計算)

export default {
	render(container, { CONSTANTS, fmt, PresetManager, t, l }) {
		const K = 'terminal_velocity';

		container.innerHTML = `<div class="panel input-panel">
			<div id="preset-container"></div>
			<h2 class="card-title">${t('通用_參數')}</h2>
			
			<div class="section-title" style="margin-top:10px; font-weight:bold;">${t('通用_環境參數')}</div>
			<div class="planet-buttons" id="planet-buttons" style="display:flex; flex-wrap:wrap; gap:6px; margin:8px 0;">
				<button type="button" data-g="9.81" data-rho="1.225" data-c="343" class="active">${t('天體_地球')}</button>
				<button type="button" data-g="1.62" data-rho="0" data-c="0">${t('天體_月球')}</button>
				<button type="button" data-g="3.72" data-rho="0.020" data-c="240">${t('天體_火星')}</button>
				<button type="button" data-g="8.87" data-rho="65.0" data-c="410">${t('天體_金星')}</button>
				<button type="button" data-g="24.79" data-rho="4.5" data-c="1000">${t('天體_木星')}</button>
				<button type="button" data-g="10.44" data-rho="3.0" data-c="900">${t('天體_土星')}</button>
				<button type="button" data-g="1.35" data-rho="5.43" data-c="194">${t('天體_土衛六')}</button>
				<button type="button" data-g="274.0" data-rho="200.0" data-c="0">${t('天體_太陽')}</button>
			</div>

			<div class="form-group">
				<label for="input-g">${t('通用_重力加速度')} (g) [m/s²]</label>
				<input type="number" id="input-g" value="9.81" step="0.01">
			</div>
			<div class="form-group">
				<label for="input-rho">${t('通用_大氣密度')} (ρ) [kg/m³]</label>
				<input type="number" id="input-rho" value="1.225" step="0.001">
			</div>
			<div class="form-group">
				<label for="input-c">${t('通用_大氣音速')} (c) [m/s]</label>
				<input type="number" id="input-c" value="343" step="1">
			</div>

			<div class="section-title" style="margin-top:15px; font-weight:bold;">${t('通用_幾何參數')}</div>
			<div class="planet-buttons" id="object-buttons" style="display:flex; flex-wrap:wrap; gap:6px; margin:8px 0;">
				<button type="button" data-m="45" data-r="0.1" data-l="1.5">${l('選項_萌妹', {}, K)}</button>
				<button type="button" data-m="85" data-r="0.13" data-l="1.8">${l('選項_糙漢', {}, K)}</button>
				<button type="button" data-m="3200" data-r="0.1" data-l="5">${l('選項_牛頓之劍', {}, K)}</button>
				<button type="button" data-m="60000" data-r="1.975" data-l="37.57">${l('選項_空客', {}, K)}</button>
				<button type="button" data-m="60000" data-r="1.88" data-l="39.5">${l('選項_波音', {}, K)}</button>
				<button type="button" data-m="90000" data-r="2.3" data-l="37.24">${l('選項_哥倫比亞號', {}, K)}</button>
				<button type="button" data-m="100000" data-r="1.44" data-l="61.66">${l('選項_協和', {}, K)}</button>
				<button type="button" data-m="5000000" data-r="4.5" data-l="124.4">${l('選項_星艦', {}, K)}</button>
				<button type="button" data-m="100000000" data-r="39" data-l="333">${l('選項_福特號', {}, K)}</button>
				<button type="button" data-m="700000000" data-r="25" data-l="508">${l('選項_臺北101', {}, K)}</button>
				<button type="button" data-m="4500000000" data-r="230" data-l="642.5">${l('選項_進取號', {}, K)}</button>
				<button type="button" data-m="2500000000000" data-r="1520" data-l="3040">${l('選項_博格', {}, K)}</button>
			</div>

			<div class="form-group">
				<label for="input-m">${t('通用_物體質量')} (m) [kg]</label>
				<input type="number" id="input-m" value="10" step="0.1">
			</div>
			<div class="form-group">
				<label for="input-r">${t('通用_物體半徑')} (r) [m] <span style="font-size:0.8em">(${t('單位_球體忽略') || '正方體忽略'})</span></label>
				<input type="number" id="input-r" value="0.1" step="0.01">
			</div>
			<div class="form-group">
				<label for="input-l">${t('通用_長度邊長')} (L) [m] <span style="font-size:0.8em">(${t('單位_球體忽略') || '球體忽略'})</span></label>
				<input type="number" id="input-l" value="1.0" step="0.1">
			</div>
			<div class="form-group">
				<label for="input-cd">${t('通用_風阻係數')} (Cd)</label>
				<input type="number" id="input-cd" value="0" step="0.1">
			</div>
		</div>
		<div class="panel output-panel" style="display:flex; flex-direction:column; gap:16px;">
			<!-- Card 1: Sphere -->
			<div class="card">
				<h3 class="card-title">${l('球體模型', {}, K)}</h3>
				<div class="data-grid">
					<div class="data-item"><span class="data-label">${l('終端速度', {}, K)}</span><span class="data-value highlight" id="sphere-v"></span></div>
					<div class="data-item"><span class="data-label" style="color:var(--accent2);">${l('含可壓縮修正', {}, K)}</span><span class="data-value highlight" id="sphere-mv" style="color:var(--accent2);"></span></div>
					<div class="data-item"><span class="data-label">${l('墜落距離', {}, K)}</span><span class="data-value" id="sphere-dist"></span></div>
					<div class="data-item"><span class="data-label">${l('終端動能', {}, K)}</span><span class="data-value" id="sphere-e"></span></div>
					<div class="data-item"><span class="data-label">${l('能效密度', {}, K)}</span><span class="data-value" id="sphere-ed"></span></div>
					<div class="data-item"><span class="data-label" id="sphere-cd-label"></span><span class="data-value" id="sphere-a"></span></div>
				</div>
			</div>
			<!-- Card 2: Vertical Cylinder -->
			<div class="card">
				<h3 class="card-title">${l('豎直圓柱', {}, K)}</h3>
				<div class="data-grid">
					<div class="data-item"><span class="data-label">${l('終端速度', {}, K)}</span><span class="data-value highlight" id="vcyl-v"></span></div>
					<div class="data-item"><span class="data-label" style="color:var(--accent2);">${l('含可壓縮修正', {}, K)}</span><span class="data-value highlight" id="vcyl-mv" style="color:var(--accent2);"></span></div>
					<div class="data-item"><span class="data-label">${l('墜落距離', {}, K)}</span><span class="data-value" id="vcyl-dist"></span></div>
					<div class="data-item"><span class="data-label">${l('終端動能', {}, K)}</span><span class="data-value" id="vcyl-e"></span></div>
					<div class="data-item"><span class="data-label">${l('能效密度', {}, K)}</span><span class="data-value" id="vcyl-ed"></span></div>
					<div class="data-item"><span class="data-label" id="vcyl-cd-label"></span><span class="data-value" id="vcyl-a"></span></div>
				</div>
			</div>
			<!-- Card 3: Horizontal Cylinder -->
			<div class="card">
				<h3 class="card-title">${l('水平圓柱', {}, K)}</h3>
				<div class="data-grid">
					<div class="data-item"><span class="data-label">${l('終端速度', {}, K)}</span><span class="data-value highlight" id="hcyl-v"></span></div>
					<div class="data-item"><span class="data-label" style="color:var(--accent2);">${l('含可壓縮修正', {}, K)}</span><span class="data-value highlight" id="hcyl-mv" style="color:var(--accent2);"></span></div>
					<div class="data-item"><span class="data-label">${l('墜落距離', {}, K)}</span><span class="data-value" id="hcyl-dist"></span></div>
					<div class="data-item"><span class="data-label">${l('終端動能', {}, K)}</span><span class="data-value" id="hcyl-e"></span></div>
					<div class="data-item"><span class="data-label">${l('能效密度', {}, K)}</span><span class="data-value" id="hcyl-ed"></span></div>
					<div class="data-item"><span class="data-label" id="hcyl-cd-label"></span><span class="data-value" id="hcyl-a"></span></div>
				</div>
			</div>
			<!-- Card 4: Cube -->
			<div class="card">
				<h3 class="card-title">${l('正方體', {}, K)}</h3>
				<div class="data-grid">
					<div class="data-item"><span class="data-label">${l('終端速度', {}, K)}</span><span class="data-value highlight" id="cube-v"></span></div>
					<div class="data-item"><span class="data-label" style="color:var(--accent2);">${l('含可壓縮修正', {}, K)}</span><span class="data-value highlight" id="cube-mv" style="color:var(--accent2);"></span></div>
					<div class="data-item"><span class="data-label">${l('墜落距離', {}, K)}</span><span class="data-value" id="cube-dist"></span></div>
					<div class="data-item"><span class="data-label">${l('終端動能', {}, K)}</span><span class="data-value" id="cube-e"></span></div>
					<div class="data-item"><span class="data-label">${l('能效密度', {}, K)}</span><span class="data-value" id="cube-ed"></span></div>
					<div class="data-item"><span class="data-label" id="cube-cd-label"></span><span class="data-value" id="cube-a"></span></div>
				</div>
			</div>
		</div>`;

		const defaultCd = { sphere: 0.47, vcyl: 0.82, hcyl: 1.17, cube: 1.05 };

		// 綁定輸入群
		const inputIds = ['g', 'rho', 'c', 'm', 'r', 'l', 'cd'];
		
		function calculate() {
			const val = id => parseFloat(document.getElementById(`input-${id}`).value) || 0;
			const g = val('g');
			const rho = val('rho');
			const c = val('c');
			const m = val('m');
			const r = val('r');
			const L = val('l');
			const customCd = val('cd');

			const models = [
				{ id: 'sphere', area: Math.PI * r * r, cd: customCd > 0 ? customCd : defaultCd.sphere },
				{ id: 'vcyl',   area: Math.PI * r * r, cd: customCd > 0 ? customCd : defaultCd.vcyl   },
				{ id: 'hcyl',   area: 2 * r * L,       cd: customCd > 0 ? customCd : defaultCd.hcyl   },
				{ id: 'cube',   area: L * L,            cd: customCd > 0 ? customCd : defaultCd.cube   }
			];

			models.forEach(mod => {
				const inf = rho <= 0;
				let vt = 0;
				if (!inf) {
					if (mod.area > 0 && mod.cd > 0 && m > 0 && g > 0) {
						vt = Math.sqrt((2 * m * g) / (rho * mod.area * mod.cd));
					}
				} else {
					vt = Infinity;
				}

				// 馬赫修正
				let machRes = null;
				if (!inf && c > 0 && mod.area > 0 && mod.cd > 0 && m > 0 && g > 0) {
					let vIter = vt;
					const MACH_TABLE = [
						[0.00, 1.00], [0.50, 1.06], [0.70, 1.15], [0.80, 1.28],
						[0.90, 1.62], [1.00, 2.02], [1.20, 2.00], [1.50, 1.97],
						[2.00, 1.96], [3.00, 1.83], [5.00, 1.70], [10.0, 1.60]
					];
					const machDragFactor = (M) => {
						if (M <= 0) return 1.0;
						const last = MACH_TABLE[MACH_TABLE.length - 1];
						if (M >= last[0]) return last[1];
						for (let i = 0; i < MACH_TABLE.length - 1; i++) {
							const [m0, f0] = MACH_TABLE[i], [m1, f1] = MACH_TABLE[i + 1];
							if (M <= m1) return f0 + (M - m0) / (m1 - m0) * (f1 - f0);
						}
						return 1.0;
					};

					for (let i = 0; i < 200; i++) {
						const cdEff = mod.cd * machDragFactor(vIter / c);
						const vNew = Math.sqrt((2 * m * g) / (rho * mod.area * cdEff));
						const vNext = 0.6 * vNew + 0.4 * vIter;
						if (Math.abs(vNext - vIter) / (vIter + 1e-9) < 1e-6) { vIter = vNext; break; }
						vIter = vNext;
					}
					machRes = { v: vIter, mach: vIter / c, factor: machDragFactor(vIter / c) };
				}

				const vEff = (machRes && !inf) ? machRes.v : vt;
				const distEff = (vEff === Infinity) ? Infinity : 1.95822 * (vEff * vEff / (g || 9.81));
				const eEff = (vEff === Infinity) ? Infinity : 0.5 * m * vEff * vEff;

				// 渲染卡片結果
				const prefix = mod.id;
				document.getElementById(`${prefix}-v`).innerHTML = inf ? `∞ <span class="unit">m/s</span>` : `${fmt.smart(vt)} <span class="unit">m/s</span> <span class="sub-text">(${fmt.smart(vt * 3.6)} km/h)</span>`;
				
				const mvEl = document.getElementById(`${prefix}-mv`);
				if (inf) {
					mvEl.innerHTML = `∞`;
				} else if (machRes) {
					const reduction = (1 - machRes.v / vt) * 100;
					mvEl.innerHTML = `${fmt.smart(machRes.v)} <span class="unit">m/s</span> <span class="sub-text">(Ma ${fmt.smart(machRes.mach)}, Cd×${machRes.factor.toFixed(2)}, -${reduction.toFixed(1)}%)</span>`;
				} else {
					mvEl.innerHTML = `—`;
				}

				document.getElementById(`${prefix}-dist`).innerHTML = (distEff === Infinity || isNaN(distEff)) ? `∞ <span class="unit">${t('單位_m')}</span>` : `${fmt.smart(distEff)} <span class="unit">${t('單位_m')}</span>`;
				document.getElementById(`${prefix}-e`).innerHTML = (eEff === Infinity || isNaN(eEff)) ? `∞ <span class="unit">${t('單位_焦耳')}</span>` : fmt.energy(eEff);
				document.getElementById(`${prefix}-ed`).innerHTML = (eEff === Infinity || isNaN(eEff) || mod.area <= 0) ? `—` : `${fmt.energy(eEff / mod.area)} / m²`;
				document.getElementById(`${prefix}-a`).innerHTML = `${fmt.smart(mod.area)} <span class="unit">m²</span>`;
				document.getElementById(`${prefix}-cd-label`).innerText = `${t('通用_迎風面積')} (Cd: ${mod.cd})`;
			});
		}

		// 快捷按鈕點擊事件
		function bindButtons(containerId, inputMap) {
			const containerEl = document.getElementById(containerId);
			if (!containerEl) return;
			const btns = containerEl.querySelectorAll('button');
			btns.forEach(btn => {
				btn.addEventListener('click', (e) => {
					btns.forEach(b => b.classList.remove('active'));
					e.currentTarget.classList.add('active');
					const ds = e.currentTarget.dataset;
					Object.entries(inputMap).forEach(([dataKey, inputId]) => {
						if (ds[dataKey] !== undefined) {
							const el = document.getElementById(inputId);
							if (el) el.value = ds[dataKey];
						}
					});
					calculate();
				});
			});
		}

		bindButtons('planet-buttons', { 'g': 'input-g', 'rho': 'input-rho', 'c': 'input-c' });
		bindButtons('object-buttons', { 'm': 'input-m', 'r': 'input-r', 'l': 'input-l' });

		new PresetManager(inputIds.map(id => `input-${id}`), calculate);
		inputIds.forEach(id => {
			const el = document.getElementById(`input-${id}`);
			if (el) {
				el.addEventListener('input', calculate);
				el.addEventListener('change', calculate);
			}
		});
		calculate();
	}
};
