// 白給的寫作工具箱 (baigei_writer_toolbox) - 微工具模組

export default {
	render(container, { CONSTANTS, fmt, PresetManager, t, l }) {
		const K = 'constant_acceleration';
		container.innerHTML = `<div class="panel input-panel">
				<div id="preset-container"></div>
				<h2 class="card-title">${t('通用_參數')}</h2>
				<div class="form-group"><label for="input-dist-ly">${l('航行總距離', {}, K)}</label><input type="number" id="input-dist-ly" value="4.37" min="0.001" step="0.1"></div>
				<div class="form-group"><label for="input-acc-g">${l('恆定加速度', {}, K)}</label><input type="number" id="input-acc-g" value="1.0" min="0.01" step="0.1"></div>
			</div>
			<div class="panel output-panel">
				<div class="card">
					<h3 class="card-title">${t('通用_計算結果')}</h3>
					<div class="data-grid">
						<div class="data-item"><span class="data-label">${l('船員時間', {}, K)}</span><span class="data-value highlight" id="out-ship-time">3.58 <span class="unit">${t('單位_年')}</span></span></div>
						<div class="data-item"><span class="data-label">${l('地球時間', {}, K)}</span><span class="data-value highlight" id="out-earth-time">5.98 <span class="unit">${t('單位_年')}</span></span></div>
						<div class="data-item"><span class="data-label">${l('最高速度', {}, K)}</span><span class="data-value" id="out-vmax">0.95 <span class="unit">%c</span></span></div>
					</div>
					<div class="assessment-box" id="assessment"></div>
				</div>
			</div>`;

		function calculate() {
			const distLy = parseFloat(document.getElementById('input-dist-ly').value) || 0;
			const accG = parseFloat(document.getElementById('input-acc-g').value) || 0;
			if (distLy <= 0 || accG <= 0) return;
			const d = distLy * CONSTANTS.LY;
			const a = accG * CONSTANTS.g0;
			const c = CONSTANTS.c;
			const term = 1 + (a * d) / (2 * c * c);
			const tauSec = (2 * c / a) * Math.acosh(term);
			const tauYears = tauSec / (365.25 * 86400);
			const tSec = (2 * c / a) * Math.sinh((a * tauSec) / (2 * c));
			const tYears = tSec / (365.25 * 86400);
			const betaMax = Math.sqrt(1 - 1 / (term * term));
			document.getElementById('out-ship-time').innerHTML = `${fmt.smart(tauYears)} <span class="unit">${t('單位_年')}</span>`;
			document.getElementById('out-earth-time').innerHTML = `${fmt.smart(tYears)} <span class="unit">${t('單位_年')}</span>`;
			document.getElementById('out-vmax').innerHTML = `${fmt.smart(betaMax * 100)} <span class="unit">%c</span>`;
			document.getElementById('assessment').textContent = l('評估結語', { acc: accG.toFixed(2), dist: distLy, shipYears: fmt.smart(tauYears), earthYears: fmt.smart(tYears) }, K);
		}

		new PresetManager(["input-dist-ly","input-acc-g"], calculate);
		["input-dist-ly","input-acc-g"].forEach(id => {
			const el = document.getElementById(id);
			if (el) {
				el.addEventListener('input', calculate);
				el.addEventListener('change', calculate);
			}
		});
		calculate();
	}
};
