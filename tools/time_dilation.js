// 白給的寫作工具箱 (baigei_writer_toolbox) - 微工具模組

export default {
	render(container, { CONSTANTS, fmt, PresetManager, t, l }) {
		const K = 'time_dilation';
		container.innerHTML = `<div class="panel input-panel">
				<div id="preset-container"></div>
				<h2 class="card-title">${t('通用_參數')}</h2>
				<div class="form-group"><label for="input-beta">${l('飛船速度', {}, K)}</label><input type="number" id="input-beta" value="90" min="0" max="99.9999999" step="0.1"></div>
				<div class="form-group"><label for="input-earth-years">${l('地球經過時間', {}, K)}</label><input type="number" id="input-earth-years" value="10" min="0.001" step="1"></div>
			</div>
			<div class="panel output-panel">
				<div class="card">
					<h3 class="card-title">${t('通用_計算結果')}</h3>
					<div class="data-grid">
						<div class="data-item"><span class="data-label">${l('洛倫茲因子', {}, K)}</span><span class="data-value highlight" id="out-gamma">2.29</span></div>
						<div class="data-item"><span class="data-label">${l('船員時間', {}, K)}</span><span class="data-value highlight" id="out-ship-years">4.36 <span class="unit">${t('單位_年')}</span></span></div>
						<div class="data-item"><span class="data-label">${l('長度收縮', {}, K)}</span><span class="data-value" id="out-length">43.59 <span class="unit">%</span></span></div>
						<div class="data-item"><span class="data-label">${l('動態質量', {}, K)}</span><span class="data-value" id="out-mass">2.29 <span class="unit">${t('單位_倍靜止質量')}</span></span></div>
					</div>
					<div class="assessment-box" id="assessment"></div>
				</div>
			</div>`;

		function calculate() {
			const betaPercent = parseFloat(document.getElementById('input-beta').value) || 0;
			const earthYears = parseFloat(document.getElementById('input-earth-years').value) || 0;
			const beta = Math.min(Math.max(betaPercent / 100, 0), 0.999999999);
			const gamma = 1 / Math.sqrt(1 - beta * beta);
			const shipYears = earthYears / gamma;
			const lengthRatio = (1 / gamma) * 100;
			document.getElementById('out-gamma').textContent = fmt.smart(gamma);
			document.getElementById('out-ship-years').innerHTML = `${fmt.smart(shipYears)} <span class="unit">${t('單位_年')}</span>`;
			document.getElementById('out-length').innerHTML = `${fmt.smart(lengthRatio)} <span class="unit">%</span>`;
			document.getElementById('out-mass').innerHTML = `${fmt.smart(gamma)} <span class="unit">${t('單位_倍靜止質量')}</span>`;
			document.getElementById('assessment').textContent = l('評估結語', { beta: betaPercent.toFixed(4), gamma: fmt.smart(gamma), earthYears: fmt.smart(earthYears), shipYears: fmt.smart(shipYears) }, K);
		}

		new PresetManager(["input-beta","input-earth-years"], calculate);
		["input-beta","input-earth-years"].forEach(id => {
			const el = document.getElementById(id);
			if (el) {
				el.addEventListener('input', calculate);
				el.addEventListener('change', calculate);
			}
		});
		calculate();
	}
};
