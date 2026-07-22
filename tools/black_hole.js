// 白給的寫作工具箱 (baigei_writer_toolbox) - 微工具模組

export default {
	render(container, { CONSTANTS, fmt, PresetManager, t, l }) {
		const K = 'black_hole';
		container.innerHTML = `<div class="panel input-panel">
				<div id="preset-container"></div>
				<h2 class="card-title">${t('通用_參數')}</h2>
				<div class="form-group"><label for="input-mass-sun">${l('黑洞質量', {}, K)}</label><input type="number" id="input-mass-sun" value="10" step="1"></div>
				<div class="form-group"><label for="input-body-len">${l('觀測體身長', {}, K)}</label><input type="number" id="input-body-len" value="2.0" step="0.1"></div>
			</div>
			<div class="panel output-panel">
				<div class="card">
					<h3 class="card-title">${t('通用_計算結果')}</h3>
					<div class="data-grid">
						<div class="data-item"><span class="data-label">${l('史瓦西半徑', {}, K)}</span><span class="data-value highlight" id="out-rs-km">29.53 <span class="unit">${t('單位_km')}</span></span></div>
						<div class="data-item"><span class="data-label">${l('視界潮汐力', {}, K)}</span><span class="data-value highlight" id="out-tidal-g">1.03e7 <span class="unit">${t('單位_G')}</span></span></div>
					</div>
					<div class="assessment-box" id="assessment"></div>
				</div>
			</div>`;

		function calculate() {
			const Ms = parseFloat(document.getElementById('input-mass-sun').value)||0;
			const len_m = parseFloat(document.getElementById('input-body-len').value)||2.0;
			if(Ms<=0||len_m<=0)return;
			const M_kg = Ms * CONSTANTS.M_SUN;
			const R_s_m = (2 * CONSTANTS.G * M_kg) / (CONSTANTS.c * CONSTANTS.c);
			const R_s_km = R_s_m / 1000;
			const delta_a_g = ((2 * CONSTANTS.G * M_kg * len_m) / Math.pow(R_s_m, 3)) / CONSTANTS.g0;
			const sur = delta_a_g > 15.0 ? l('狀態_致死', {}, K) : l('狀態_安全', {}, K);
			document.getElementById('out-rs-km').innerHTML = `${fmt.smart(R_s_km)} <span class="unit">${t('單位_km')}</span>`;
			document.getElementById('out-tidal-g').innerHTML = `${fmt.smart(delta_a_g)} <span class="unit">${t('單位_G')}</span>`;
			document.getElementById('assessment').textContent = l('評估結語', { Ms: Ms, Rs: fmt.smart(R_s_km), tidal: fmt.smart(delta_a_g), survival: sur }, K);
		}

		new PresetManager(["input-mass-sun","input-body-len"], calculate);
		["input-mass-sun","input-body-len"].forEach(id => {
			const el = document.getElementById(id);
			if (el) {
				el.addEventListener('input', calculate);
				el.addEventListener('change', calculate);
			}
		});
		calculate();
	}
};
