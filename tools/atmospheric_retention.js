// 白給的寫作工具箱 (baigei_writer_toolbox) - 微工具模組

export default {
	render(container, { CONSTANTS, fmt, PresetManager, t, l }) {
		const K = 'atmospheric_retention';
		container.innerHTML = `<div class="panel input-panel">
				<div id="preset-container"></div>
				<h2 class="card-title">${t('通用_參數')}</h2>
				<div class="form-group"><label for="input-temp-c">${l('平均溫度', {}, K)}</label><input type="number" id="input-temp-c" value="15" step="5"></div>
				<div class="form-group"><label for="input-escape-v">${l('逃逸速度', {}, K)}</label><input type="number" id="input-escape-v" value="11.19" step="0.1"></div>
			</div>
			<div class="panel output-panel">
				<div class="card">
					<h3 class="card-title">${t('通用_計算結果')}</h3>
					<div class="data-grid" id="gas-results"></div>
					<div class="assessment-box" id="assessment"></div>
				</div>
			</div>`;

		function calculate() {
			const tempC = parseFloat(document.getElementById('input-temp-c').value) || 0;
			const v2_kms = parseFloat(document.getElementById('input-escape-v').value) || 0;
			const tempK = tempC + 273.15;
			const v2_ms = v2_kms * 1000;
			const gases = [{n:'H2',m:2.016},{n:'He',m:4.002},{n:'H2O',m:18.015},{n:'N2',m:28.013},{n:'O2',m:31.999},{n:'CO2',m:44.01}];
			const grid = document.getElementById('gas-results');
			grid.innerHTML = '';
			let retained = [];
			gases.forEach(g => {
				const m_kg = g.m * CONSTANTS.AMU;
				const v_th = Math.sqrt((3 * CONSTANTS.kB * tempK) / m_kg);
				const isRetained = (v2_ms / v_th >= 6.0);
				const status = isRetained ? l('狀態_保留', {}, K) : l('狀態_流失', {}, K);
				if (isRetained) retained.push(g.n);
				const div = document.createElement('div');
				div.className = 'data-item';
				div.innerHTML = `<span class="data-label">${g.n}</span><span class="data-value">${status}</span>`;
				grid.appendChild(div);
			});
			document.getElementById('assessment').textContent = l('評估結語', { retained: retained.join('、') }, K);
		}

		new PresetManager(["input-temp-c","input-escape-v"], calculate);
		["input-temp-c","input-escape-v"].forEach(id => {
			const el = document.getElementById(id);
			if (el) {
				el.addEventListener('input', calculate);
				el.addEventListener('change', calculate);
			}
		});
		calculate();
	}
};
