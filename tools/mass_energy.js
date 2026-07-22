// 白給的寫作工具箱 (baigei_writer_toolbox) - 微工具模組

export default {
	render(container, { CONSTANTS, fmt, PresetManager, t, l }) {
		const K = 'mass_energy';
		container.innerHTML = `<div class="panel input-panel">
				<div id="preset-container"></div>
				<h2 class="card-title">${t('通用_參數')}</h2>
				<div class="form-group"><label for="input-mass-g">${l('反應物質量', {}, K)}</label><input type="number" id="input-mass-g" value="1.0" step="0.1"></div>
				<div class="form-group">
					<label for="select-efficiency">${l('轉換效率', {}, K)}</label>
					<select id="select-efficiency">
						<option value="100.0">${l('選項_湮滅', {}, K)}</option>
						<option value="0.7">${l('選項_融合', {}, K)}</option>
						<option value="0.09">${l('選項_分裂', {}, K)}</option>
					</select>
				</div>
			</div>
			<div class="panel output-panel">
				<div class="card">
					<h3 class="card-title">${t('通用_計算結果')}</h3>
					<div class="data-grid">
						<div class="data-item"><span class="data-label">${l('總能量', {}, K)}</span><span class="data-value highlight" id="out-energy-j">8.99e13 <span class="unit">${t('單位_焦耳')}</span></span></div>
						<div class="data-item"><span class="data-label">${l('TNT當量', {}, K)}</span><span class="data-value highlight" id="out-tnt-tons">21487 <span class="unit">${t('單位_噸TNT')}</span></span></div>
					</div>
					<div class="assessment-box" id="assessment"></div>
				</div>
			</div>`;

		function calculate() {
			const m_g = parseFloat(document.getElementById('input-mass-g').value)||0;
			const eta = (parseFloat(document.getElementById('select-efficiency').value)||1)/100;
			if(m_g<=0)return;
			const Ek = eta * (m_g/1000) * CONSTANTS.c * CONSTANTS.c;
			const tnt = Ek / CONSTANTS.JOULES_PER_TON_TNT;
			document.getElementById('out-energy-j').innerHTML = `${fmt.sci(Ek)} <span class="unit">${t('單位_焦耳')}</span>`;
			document.getElementById('out-tnt-tons').innerHTML = `${fmt.smart(tnt)} <span class="unit">${t('單位_噸TNT')}</span>`;
			document.getElementById('assessment').textContent = l('評估結語', { m: m_g, energy: fmt.sci(Ek), tnt: fmt.smart(tnt) }, K);
		}

		new PresetManager(["input-mass-g","select-efficiency"], calculate);
		["input-mass-g","select-efficiency"].forEach(id => {
			const el = document.getElementById(id);
			if (el) {
				el.addEventListener('input', calculate);
				el.addEventListener('change', calculate);
			}
		});
		calculate();
	}
};
