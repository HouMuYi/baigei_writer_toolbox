// 白給的寫作工具箱 (baigei_writer_toolbox) - 微工具模組

export default {
	render(container, { CONSTANTS, fmt, PresetManager, t, l }) {
		const K = 'hill_sphere';
		container.innerHTML = `<div class="panel input-panel">
				<div id="preset-container"></div>
				<h2 class="card-title">${t('通用_參數')}</h2>
				<div class="form-group"><label for="input-m-primary">${l('主星質量', {}, K)}</label><input type="number" id="input-m-primary" value="1.0" step="0.1"></div>
				<div class="form-group"><label for="input-m-secondary">${l('次星質量', {}, K)}</label><input type="number" id="input-m-secondary" value="1.0" step="0.1"></div>
				<div class="form-group"><label for="input-a-au">${l('軌道半長軸', {}, K)}</label><input type="number" id="input-a-au" value="1.0" step="0.1"></div>
			</div>
			<div class="panel output-panel">
				<div class="card">
					<h3 class="card-title">${t('通用_計算結果')}</h3>
					<div class="data-grid">
						<div class="data-item"><span class="data-label">${l('希爾球半徑', {}, K)}</span><span class="data-value highlight" id="out-hill-km">1496555 <span class="unit">${t('單位_km')}</span></span></div>
						<div class="data-item"><span class="data-label">${l('穩定軌道上限', {}, K)}</span><span class="data-value" id="out-stable-km">498851 <span class="unit">${t('單位_km')}</span></span></div>
					</div>
					<div class="assessment-box" id="assessment"></div>
				</div>
			</div>`;

		function calculate() {
			const M_sun = parseFloat(document.getElementById('input-m-primary').value) || 0;
			const m_earth = parseFloat(document.getElementById('input-m-secondary').value) || 0;
			const a_au = parseFloat(document.getElementById('input-a-au').value) || 0;
			if (M_sun <= 0 || m_earth <= 0 || a_au <= 0) return;
			const M_kg = M_sun * CONSTANTS.M_SUN;
			const m_kg = m_earth * CONSTANTS.M_EARTH;
			const a_m = a_au * CONSTANTS.AU;
			const r_hill_km = (a_m * Math.cbrt(m_kg / (3 * M_kg))) / 1000;
			document.getElementById('out-hill-km').innerHTML = `${fmt.smart(r_hill_km)} <span class="unit">${t('單位_km')}</span>`;
			document.getElementById('out-stable-km').innerHTML = `${fmt.smart(r_hill_km / 3)} <span class="unit">${t('單位_km')}</span>`;
			document.getElementById('assessment').textContent = l('評估結語', { hill: fmt.smart(r_hill_km), stable: fmt.smart(r_hill_km / 3) }, K);
		}

		new PresetManager(["input-m-primary","input-m-secondary","input-a-au"], calculate);
		["input-m-primary","input-m-secondary","input-a-au"].forEach(id => {
			const el = document.getElementById(id);
			if (el) {
				el.addEventListener('input', calculate);
				el.addEventListener('change', calculate);
			}
		});
		calculate();
	}
};
