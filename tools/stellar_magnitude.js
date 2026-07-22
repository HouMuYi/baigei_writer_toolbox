// 白給的寫作工具箱 (baigei_writer_toolbox) - 微工具模組

export default {
	render(container, { CONSTANTS, fmt, PresetManager, t, l }) {
		const K = 'stellar_magnitude';
		container.innerHTML = `<div class="panel input-panel">
				<div id="preset-container"></div>
				<h2 class="card-title">${t('通用_參數')}</h2>
				<div class="form-group"><label for="input-abs-mag">${l('絕對星等', {}, K)}</label><input type="number" id="input-abs-mag" value="4.83" step="0.1"></div>
				<div class="form-group"><label for="input-dist-ly">${l('觀測距離', {}, K)}</label><input type="number" id="input-dist-ly" value="10.0" step="1"></div>
			</div>
			<div class="panel output-panel">
				<div class="card">
					<h3 class="card-title">${t('通用_計算結果')}</h3>
					<div class="data-grid">
						<div class="data-item"><span class="data-label">${l('視星等', {}, K)}</span><span class="data-value highlight" id="out-m-app">+2.27</span></div>
						<div class="data-item"><span class="data-label">${l('可見度', {}, K)}</span><span class="data-value highlight" id="out-visibility">${l('狀態_可見', {}, K)}</span></div>
					</div>
					<div class="assessment-box" id="assessment"></div>
				</div>
			</div>`;

		function calculate() {
			const M = parseFloat(document.getElementById('input-abs-mag').value);
			const distLy = parseFloat(document.getElementById('input-dist-ly').value) || 0;
			if (isNaN(M) || distLy <= 0) return;
			const distPc = distLy / CONSTANTS.LY_IN_PC;
			const m = M + 5 * Math.log10(distPc) - 5;
			const vis = m <= 6.0 ? l('狀態_可見', {}, K) : l('狀態_不可見', {}, K);
			const mStr = (m >= 0 ? '+' : '') + fmt.smart(m);
			document.getElementById('out-m-app').textContent = mStr;
			document.getElementById('out-visibility').textContent = vis;
			document.getElementById('assessment').textContent = l('評估結語', { dist: distLy, m: mStr, visibility: vis }, K);
		}

		new PresetManager(["input-abs-mag","input-dist-ly"], calculate);
		["input-abs-mag","input-dist-ly"].forEach(id => {
			const el = document.getElementById(id);
			if (el) {
				el.addEventListener('input', calculate);
				el.addEventListener('change', calculate);
			}
		});
		calculate();
	}
};
