// 白給的寫作工具箱 (baigei_writer_toolbox) - 微工具模組

export default {
	render(container, { CONSTANTS, fmt, PresetManager, t, l }) {
		const K = 'escape_velocity';
		container.innerHTML = `<div class="panel input-panel">
				<div id="preset-container"></div>
				<h2 class="card-title">${t('通用_參數')}</h2>
				<div class="form-group"><label for="input-mass-earth">${l('星球質量', {}, K)}</label><input type="number" id="input-mass-earth" value="1.0" step="0.1"></div>
				<div class="form-group"><label for="input-radius-earth">${l('星球半徑', {}, K)}</label><input type="number" id="input-radius-earth" value="1.0" step="0.1"></div>
				<div class="form-group"><label for="input-eye-height">${l('眼睛高度', {}, K)}</label><input type="number" id="input-eye-height" value="1.7" step="0.1"></div>
			</div>
			<div class="panel output-panel">
				<div class="card">
					<h3 class="card-title">${t('通用_計算結果')}</h3>
					<div class="data-grid">
						<div class="data-item"><span class="data-label">${l('表面重力', {}, K)}</span><span class="data-value highlight" id="out-g-ratio">1.00 <span class="unit">${t('單位_G')}</span></span></div>
						<div class="data-item"><span class="data-label">${l('逃逸速度', {}, K)}</span><span class="data-value highlight" id="out-v2">11.19 <span class="unit">${t('單位_kms')}</span></span></div>
						<div class="data-item"><span class="data-label">${l('地平線距離', {}, K)}</span><span class="data-value" id="out-horizon-km">4.65 <span class="unit">${t('單位_km')}</span></span></div>
					</div>
					<div class="assessment-box" id="assessment"></div>
				</div>
			</div>`;

		function calculate() {
			const m_r = parseFloat(document.getElementById('input-mass-earth').value) || 0;
			const r_r = parseFloat(document.getElementById('input-radius-earth').value) || 0;
			const h_m = parseFloat(document.getElementById('input-eye-height').value) || 1.7;
			if (m_r <= 0 || r_r <= 0) return;
			const M_kg = m_r * CONSTANTS.M_EARTH;
			const R_m = r_r * CONSTANTS.R_EARTH;
			const g_ratio = ((CONSTANTS.G * M_kg) / (R_m * R_m)) / CONSTANTS.g0;
			const v2_kms = Math.sqrt((2 * CONSTANTS.G * M_kg) / R_m) / 1000;
			const horiz_km = Math.sqrt(2 * R_m * h_m + h_m * h_m) / 1000;
			document.getElementById('out-g-ratio').innerHTML = `${fmt.smart(g_ratio)} <span class="unit">${t('單位_G')}</span>`;
			document.getElementById('out-v2').innerHTML = `${fmt.smart(v2_kms)} <span class="unit">${t('單位_kms')}</span>`;
			document.getElementById('out-horizon-km').innerHTML = `${fmt.smart(horiz_km)} <span class="unit">${t('單位_km')}</span>`;
			document.getElementById('assessment').textContent = l('評估結語', { g: fmt.smart(g_ratio), v2: fmt.smart(v2_kms), horizon: fmt.smart(horiz_km) }, K);
		}

		new PresetManager(["input-mass-earth","input-radius-earth","input-eye-height"], calculate);
		["input-mass-earth","input-radius-earth","input-eye-height"].forEach(id => {
			const el = document.getElementById(id);
			if (el) {
				el.addEventListener('input', calculate);
				el.addEventListener('change', calculate);
			}
		});
		calculate();
	}
};
