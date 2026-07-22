// 白給的寫作工具箱 (baigei_writer_toolbox) - 微工具模組

export default {
	render(container, { CONSTANTS, fmt, PresetManager, t, l }) {
		const K = 'habitable_zone';
		container.innerHTML = `<div class="panel input-panel">
				<div id="preset-container"></div>
				<h2 class="card-title">${t('通用_參數')}</h2>
				<div class="form-group"><label for="input-luminosity">${l('恆星光度', {}, K)}</label><input type="number" id="input-luminosity" value="1.0" step="0.1"></div>
			</div>
			<div class="panel output-panel">
				<div class="card">
					<h3 class="card-title">${t('通用_計算結果')}</h3>
					<div class="data-grid">
						<div class="data-item"><span class="data-label">${l('內界半徑', {}, K)}</span><span class="data-value highlight" id="out-rin-au">0.95 <span class="unit">${t('單位_AU')}</span></span></div>
						<div class="data-item"><span class="data-label">${l('外界半徑', {}, K)}</span><span class="data-value highlight" id="out-rout-au">1.37 <span class="unit">${t('單位_AU')}</span></span></div>
					</div>
					<div class="assessment-box" id="assessment"></div>
				</div>
			</div>`;

		function calculate() {
			const L = parseFloat(document.getElementById('input-luminosity').value) || 0;
			if (L <= 0) return;
			const Rin = Math.sqrt(L / 1.1);
			const Rout = Math.sqrt(L / 0.53);
			document.getElementById('out-rin-au').innerHTML = `${fmt.smart(Rin)} <span class="unit">${t('單位_AU')}</span>`;
			document.getElementById('out-rout-au').innerHTML = `${fmt.smart(Rout)} <span class="unit">${t('單位_AU')}</span>`;
			document.getElementById('assessment').textContent = l('評估結語', { rin: fmt.smart(Rin), rout: fmt.smart(Rout) }, K);
		}

		new PresetManager(["input-luminosity"], calculate);
		["input-luminosity"].forEach(id => {
			const el = document.getElementById(id);
			if (el) {
				el.addEventListener('input', calculate);
				el.addEventListener('change', calculate);
			}
		});
		calculate();
	}
};
