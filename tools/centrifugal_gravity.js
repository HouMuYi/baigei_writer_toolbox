// 白給的寫作工具箱 (baigei_writer_toolbox) - 微工具模組

export default {
	render(container, { CONSTANTS, fmt, PresetManager, t, l }) {
		const K = 'centrifugal_gravity';
		container.innerHTML = `<div class="panel input-panel">
				<div id="preset-container"></div>
				<h2 class="card-title">${t('通用_參數')}</h2>
				<div class="form-group"><label for="input-radius-m">${l('旋轉半徑', {}, K)}</label><input type="number" id="input-radius-m" value="225" step="10"></div>
				<div class="form-group"><label for="input-target-g">${l('目標重力', {}, K)}</label><input type="number" id="input-target-g" value="1.0" step="0.1"></div>
			</div>
			<div class="panel output-panel">
				<div class="card">
					<h3 class="card-title">${t('通用_計算結果')}</h3>
					<div class="data-grid">
						<div class="data-item"><span class="data-label">${l('自轉速度', {}, K)}</span><span class="data-value highlight" id="out-rpm">1.99 <span class="unit">${t('單位_RPM')}</span></span></div>
						<div class="data-item"><span class="data-label">${l('生理適應性', {}, K)}</span><span class="data-value highlight" id="out-safety">${l('狀態_安全', {}, K)}</span></div>
					</div>
					<div class="assessment-box" id="assessment"></div>
				</div>
			</div>`;

		function calculate() {
			const r_m = parseFloat(document.getElementById('input-radius-m').value)||0;
			const targetG = parseFloat(document.getElementById('input-target-g').value)||0;
			if(r_m<=0||targetG<=0)return;
			const omega = Math.sqrt((targetG * CONSTANTS.g0) / r_m);
			const rpm = (omega * 60) / (2 * Math.PI);
			const safe = rpm <= 2.0 ? l('狀態_安全', {}, K) : (rpm <= 4.0 ? l('狀態_警戒', {}, K) : l('狀態_高風險', {}, K));
			document.getElementById('out-rpm').innerHTML = `${fmt.smart(rpm)} <span class="unit">${t('單位_RPM')}</span>`;
			document.getElementById('out-safety').textContent = safe;
			document.getElementById('assessment').textContent = l('評估結語', { r: r_m, g: targetG, rpm: fmt.smart(rpm), safety: safe }, K);
		}

		new PresetManager(["input-radius-m","input-target-g"], calculate);
		["input-radius-m","input-target-g"].forEach(id => {
			const el = document.getElementById(id);
			if (el) {
				el.addEventListener('input', calculate);
				el.addEventListener('change', calculate);
			}
		});
		calculate();
	}
};
