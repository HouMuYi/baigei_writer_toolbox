// 白給的寫作工具箱 (baigei_writer_toolbox) - 微工具模組

export default {
	render(container, { CONSTANTS, fmt, PresetManager, t, l }) {
		const K = 'cosmology_redshift';
		container.innerHTML = `<div class="panel input-panel">
				<div id="preset-container"></div>
				<h2 class="card-title">${t('通用_參數')}</h2>
				<div class="form-group"><label for="input-dist-mpc">${l('共動距離', {}, K)}</label><input type="number" id="input-dist-mpc" value="100" min="0.1" step="10"></div>
				<div class="form-group">
					<label for="select-h0">${l('哈伯常數流派', {}, K)}</label>
					<select id="select-h0">
						<option value="67.4">${l('選項_普朗克', {}, K)}</option>
						<option value="73.0">${l('選項_哈伯', {}, K)}</option>
						<option value="70.0">${l('選項_中間值', {}, K)}</option>
					</select>
				</div>
			</div>
			<div class="panel output-panel">
				<div class="card">
					<h3 class="card-title">${t('通用_計算結果')}</h3>
					<div class="data-grid">
						<div class="data-item"><span class="data-label">${l('退行速度', {}, K)}</span><span class="data-value highlight" id="out-v-kms">6740 <span class="unit">${t('單位_kms')}</span></span></div>
						<div class="data-item"><span class="data-label">${l('宇宙學紅移', {}, K)}</span><span class="data-value highlight" id="out-z">0.0227</span></div>
					</div>
					<div class="assessment-box" id="assessment"></div>
				</div>
			</div>`;

		function calculate() {
			const distMpc = parseFloat(document.getElementById('input-dist-mpc').value) || 0;
			const h0 = parseFloat(document.getElementById('select-h0').value) || 70;
			const vKms = h0 * distMpc;
			const beta = (vKms * 1000) / CONSTANTS.c;
			const z = beta < 1 ? Math.sqrt((1 + beta) / (1 - beta)) - 1 : beta;
			document.getElementById('out-v-kms').innerHTML = `${fmt.smart(vKms)} <span class="unit">${t('單位_kms')}</span>`;
			document.getElementById('out-z').textContent = fmt.smart(z);
			document.getElementById('assessment').textContent = l('評估結語', { dist: distMpc, v: fmt.smart(vKms), z: fmt.smart(z) }, K);
		}

		new PresetManager(["input-dist-mpc","select-h0","input-custom-h0"], calculate);
		["input-dist-mpc","select-h0","input-custom-h0"].forEach(id => {
			const el = document.getElementById(id);
			if (el) {
				el.addEventListener('input', calculate);
				el.addEventListener('change', calculate);
			}
		});
		calculate();
	}
};
