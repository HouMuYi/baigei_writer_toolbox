// 白給的寫作工具箱 (baigei_writer_toolbox) - 微工具模組

export default {
	render(container, { CONSTANTS, fmt, PresetManager, t, l }) {
		const K = 'tidal_locking';
		container.innerHTML = `<div class="panel input-panel">
				<div id="preset-container"></div>
				<h2 class="card-title">${t('通用_參數')}</h2>
				<div class="form-group"><label for="input-m-star">${l('母星質量', {}, K)}</label><input type="number" id="input-m-star" value="0.1" step="0.1"></div>
				<div class="form-group"><label for="input-m-planet">${l('行星質量', {}, K)}</label><input type="number" id="input-m-planet" value="1.0" step="0.1"></div>
				<div class="form-group"><label for="input-r-planet">${l('行星半徑', {}, K)}</label><input type="number" id="input-r-planet" value="1.0" step="0.1"></div>
				<div class="form-group"><label for="input-a-au">${l('軌道半長軸', {}, K)}</label><input type="number" id="input-a-au" value="0.05" step="0.01"></div>
			</div>
			<div class="panel output-panel">
				<div class="card">
					<h3 class="card-title">${t('通用_計算結果')}</h3>
					<div class="data-grid">
						<div class="data-item"><span class="data-label">${l('鎖定時間', {}, K)}</span><span class="data-value highlight" id="out-t-lock">1.25 <span class="unit">${t('單位_億年')}</span></span></div>
						<div class="data-item"><span class="data-label">${l('鎖定狀態', {}, K)}</span><span class="data-value highlight" id="out-status">${l('狀態_已鎖定', {}, K)}</span></div>
					</div>
					<div class="assessment-box" id="assessment"></div>
				</div>
			</div>`;

		function calculate() {
			const Ms = parseFloat(document.getElementById('input-m-star').value)||0;
			const Mp = parseFloat(document.getElementById('input-m-planet').value)||0;
			const Rp = parseFloat(document.getElementById('input-r-planet').value)||0;
			const aAU = parseFloat(document.getElementById('input-a-au').value)||0;
			if(Ms<=0||Mp<=0||Rp<=0||aAU<=0)return;
			const M_kg = Ms*CONSTANTS.M_SUN, m_kg = Mp*CONSTANTS.M_EARTH, R_m = Rp*CONSTANTS.R_EARTH, a_m = aAU*CONSTANTS.AU;
			const t100m = ((4/9)*(100 * (0.33*m_kg*R_m*R_m) * 7.27e-5 * Math.pow(a_m,6))/(CONSTANTS.G*M_kg*M_kg*Math.pow(R_m,3))) / (365.25*86400*1e8);
			const isLocked = t100m < 10;
			const status = isLocked ? l('狀態_已鎖定', {}, K) : l('狀態_未鎖定', {}, K);
			document.getElementById('out-t-lock').innerHTML = `${fmt.smart(t100m)} <span class="unit">${t('單位_億年')}</span>`;
			document.getElementById('out-status').textContent = status;
			document.getElementById('assessment').textContent = l('評估結語', { a: aAU, t: fmt.smart(t100m) }, K);
		}

		new PresetManager(["input-m-star","input-m-planet","input-r-planet","input-a-au"], calculate);
		["input-m-star","input-m-planet","input-r-planet","input-a-au"].forEach(id => {
			const el = document.getElementById(id);
			if (el) {
				el.addEventListener('input', calculate);
				el.addEventListener('change', calculate);
			}
		});
		calculate();
	}
};
