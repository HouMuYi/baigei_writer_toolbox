// 白給的寫作工具箱 (baigei_writer_toolbox) - 微工具模組

export default {
	render(container, { CONSTANTS, fmt, PresetManager, t, l }) {
		const K = 'roche_limit';
		container.innerHTML = `<div class="panel input-panel">
				<div id="preset-container"></div>
				<h2 class="card-title">${t('通用_參數')}</h2>
				<div class="form-group"><label for="input-rm-km">${l('主星半徑', {}, K)}</label><input type="number" id="input-rm-km" value="6371" min="1" step="10"></div>
				<div class="form-group"><label for="input-rhom">${l('主星密度', {}, K)}</label><input type="number" id="input-rhom" value="5.51" step="0.1"></div>
				<div class="form-group"><label for="input-rhom-sub">${l('衛星密度', {}, K)}</label><input type="number" id="input-rhom-sub" value="3.34" step="0.1"></div>
			</div>
			<div class="panel output-panel">
				<div class="card">
					<h3 class="card-title">${t('通用_計算結果')}</h3>
					<div class="data-grid">
						<div class="data-item"><span class="data-label">${l('剛體極限', {}, K)}</span><span class="data-value highlight" id="out-rigid-km">9492 <span class="unit">${t('單位_km')}</span></span></div>
						<div class="data-item"><span class="data-label">${l('流體極限', {}, K)}</span><span class="data-value highlight" id="out-fluid-km">18408 <span class="unit">${t('單位_km')}</span></span></div>
					</div>
					<div class="assessment-box" id="assessment"></div>
				</div>
			</div>`;

		function calculate() {
			const Rm = parseFloat(document.getElementById('input-rm-km').value) || 0;
			const rhoM = parseFloat(document.getElementById('input-rhom').value) || 0;
			const rhom = parseFloat(document.getElementById('input-rhom-sub').value) || 0;
			if (rhoM <= 0 || rhom <= 0 || Rm <= 0) return;
			const rigidKm = 1.26 * Math.cbrt(rhoM / rhom) * Rm;
			const fluidKm = 2.44 * Math.cbrt(rhoM / rhom) * Rm;
			document.getElementById('out-rigid-km').innerHTML = `${fmt.smart(rigidKm)} <span class="unit">${t('單位_km')}</span>`;
			document.getElementById('out-fluid-km').innerHTML = `${fmt.smart(fluidKm)} <span class="unit">${t('單位_km')}</span>`;
			document.getElementById('assessment').textContent = l('評估結語', { fluid: fmt.smart(fluidKm), rigid: fmt.smart(rigidKm) }, K);
		}

		new PresetManager(["input-rm-km","input-rhom","input-rhom-sub"], calculate);
		["input-rm-km","input-rhom","input-rhom-sub"].forEach(id => {
			const el = document.getElementById(id);
			if (el) {
				el.addEventListener('input', calculate);
				el.addEventListener('change', calculate);
			}
		});
		calculate();
	}
};
