// 白給的寫作工具箱 (baigei_writer_toolbox) - 微工具模組

export default {
	render(container, { CONSTANTS, fmt, PresetManager, t, l }) {
		const K = 'rocket_equation';
		container.innerHTML = `<div class="panel input-panel">
				<div id="preset-container"></div>
				<h2 class="card-title">${t('通用_參數')}</h2>
				<div class="form-group"><label for="input-dry-mass">${l('飛船乾重', {}, K)}</label><input type="number" id="input-dry-mass" value="100" step="10"></div>
				<div class="form-group"><label for="input-delta-v">${l('目標DeltaV', {}, K)}</label><input type="number" id="input-delta-v" value="9.5" step="0.5"></div>
				<div class="form-group"><label for="input-isp">${l('引擎比衝', {}, K)}</label><input type="number" id="input-isp" value="450" step="50"></div>
			</div>
			<div class="panel output-panel">
				<div class="card">
					<h3 class="card-title">${t('通用_計算結果')}</h3>
					<div class="data-grid">
						<div class="data-item"><span class="data-label">${l('起飛濕重', {}, K)}</span><span class="data-value highlight" id="out-wet-mass">860.9 <span class="unit">${t('單位_公噸')}</span></span></div>
						<div class="data-item"><span class="data-label">${l('推進劑質量', {}, K)}</span><span class="data-value highlight" id="out-fuel-mass">760.9 <span class="unit">${t('單位_公噸')}</span></span></div>
					</div>
					<div class="assessment-box" id="assessment"></div>
				</div>
			</div>`;

		function calculate() {
			const mf = parseFloat(document.getElementById('input-dry-mass').value)||0;
			const dv = (parseFloat(document.getElementById('input-delta-v').value)||0)*1000;
			const isp = parseFloat(document.getElementById('input-isp').value)||0;
			if(mf<=0||dv<=0||isp<=0)return;
			const ve = isp * CONSTANTS.g0;
			const m0 = mf * Math.exp(dv / ve);
			const mfuel = m0 - mf;
			document.getElementById('out-wet-mass').innerHTML = `${fmt.smart(m0)} <span class="unit">${t('單位_公噸')}</span>`;
			document.getElementById('out-fuel-mass').innerHTML = `${fmt.smart(mfuel)} <span class="unit">${t('單位_公噸')}</span>`;
			document.getElementById('assessment').textContent = l('評估結語', { mf: mf, dv: dv/1000, mfuel: fmt.smart(mfuel), m0: fmt.smart(m0) }, K);
		}

		new PresetManager(["input-dry-mass","input-delta-v","input-isp"], calculate);
		["input-dry-mass","input-delta-v","input-isp"].forEach(id => {
			const el = document.getElementById(id);
			if (el) {
				el.addEventListener('input', calculate);
				el.addEventListener('change', calculate);
			}
		});
		calculate();
	}
};
