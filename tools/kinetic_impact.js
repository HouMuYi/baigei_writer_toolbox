// 白給的寫作工具箱 (baigei_writer_toolbox) - 微工具模組

export default {
	render(container, { CONSTANTS, fmt, PresetManager, t, l }) {
		const K = 'kinetic_impact';
		container.innerHTML = `<div class="panel input-panel">
				<div id="preset-container"></div>
				<h2 class="card-title">${t('通用_參數')}</h2>
				<div class="form-group"><label for="input-mass-kg">${l('撞擊體質量', {}, K)}</label><input type="number" id="input-mass-kg" value="1000" step="100"></div>
				<div class="form-group"><label for="input-velocity-c">${l('撞擊速度', {}, K)}</label><input type="number" id="input-velocity-c" value="10" step="1"></div>
			</div>
			<div class="panel output-panel">
				<div class="card">
					<h3 class="card-title">${t('通用_計算結果')}</h3>
					<div class="data-grid">
						<div class="data-item"><span class="data-label">${l('總焦耳能', {}, K)}</span><span class="data-value highlight" id="out-energy-j">4.53e17 <span class="unit">${t('單位_焦耳')}</span></span></div>
						<div class="data-item"><span class="data-label">${l('TNT當量', {}, K)}</span><span class="data-value highlight" id="out-tnt-mt">108.3 <span class="unit">${t('單位_百萬噸TNT')}</span></span></div>
					</div>
					<div class="assessment-box" id="assessment"></div>
				</div>
			</div>`;

		function calculate() {
			const m_kg = parseFloat(document.getElementById('input-mass-kg').value)||0;
			const beta = Math.min((parseFloat(document.getElementById('input-velocity-c').value)||0)/100, 0.99999);
			if(m_kg<=0||beta<=0)return;
			const gamma = 1 / Math.sqrt(1 - beta*beta);
			const Ek = (gamma - 1) * m_kg * CONSTANTS.c * CONSTANTS.c;
			const tnt_mt = (Ek / CONSTANTS.JOULES_PER_TON_TNT) / 1e6;
			document.getElementById('out-energy-j').innerHTML = `${fmt.sci(Ek)} <span class="unit">${t('單位_焦耳')}</span>`;
			document.getElementById('out-tnt-mt').innerHTML = `${fmt.smart(tnt_mt)} <span class="unit">${t('單位_百萬噸TNT')}</span>`;
			document.getElementById('assessment').textContent = l('評估結語', { m: m_kg, beta: (beta*100).toFixed(2), energy: fmt.sci(Ek), tnt: fmt.smart(tnt_mt) }, K);
		}

		new PresetManager(["input-mass-kg","input-velocity-c"], calculate);
		["input-mass-kg","input-velocity-c"].forEach(id => {
			const el = document.getElementById(id);
			if (el) {
				el.addEventListener('input', calculate);
				el.addEventListener('change', calculate);
			}
		});
		calculate();
	}
};
