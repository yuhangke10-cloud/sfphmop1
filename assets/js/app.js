(() => {
  'use strict';

  const WIDTH = 7680;
  const HEIGHT = 4320;
  const screen = document.getElementById('screen');
  const passwordGate = document.getElementById('passwordGate');
  const passwordInput = document.getElementById('passwordInput');
  const controls = {
    monitorTab: document.getElementById('monitorTab'),
    eventTab: document.getElementById('eventTab'),
    parameterTab: document.getElementById('parameterTab'),
    mapLine: document.getElementById('mapLine'),
    mapSatellite: document.getElementById('mapSatellite'),
    mapNetwork: document.getElementById('mapNetwork'),
    themeToggle: document.getElementById('themeToggle'),
    drawChart: document.getElementById('drawChart'),
    parameterBack: document.getElementById('parameterBack')
  };

  const state = {
    page: 'monitor',
    parameterView: 'main',
    map: 'map',
    theme: matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  };

  const regions = {
    monitorTab: [650, 0, 885, 180],
    eventTab: [1540, 0, 895, 180],
    parameterTab: [2440, 0, 895, 180],
    mapLine: [6460, 285, 240, 150],
    mapSatellite: [6720, 285, 340, 150],
    mapNetwork: [7080, 285, 320, 150],
    themeToggle: [7280, 0, 180, 180],
    drawChart: [6655, 228, 445, 140],
    parameterBack: [7440, 450, 145, 145]
  };

  function imagePath() {
    if (state.page === 'event') return `assets/images/${state.theme}-event.png`;
    if (state.page === 'parameter') return `assets/images/${state.theme}-parameter-${state.parameterView}.png`;
    return `assets/images/${state.theme}-${state.map}.png`;
  }

  function layout() {
    const scale = innerHeight / HEIGHT;
    const offsetX = (innerWidth - WIDTH * scale) / 2;
    Object.entries(regions).forEach(([name, [x, y, width, height]]) => {
      Object.assign(controls[name].style, {
        left: `${offsetX + x * scale}px`,
        top: `${y * scale}px`,
        width: `${width * scale}px`,
        height: `${height * scale}px`
      });
    });
  }

  function render() {
    screen.src = imagePath();
    document.documentElement.dataset.theme = state.theme;
    const monitorVisible = state.page === 'monitor';
    controls.drawChart.style.display = state.page === 'parameter' && state.parameterView === 'main' ? 'block' : 'none';
    controls.parameterBack.style.display = state.page === 'parameter' && state.parameterView === 'chart' ? 'block' : 'none';
    for (const name of ['mapLine', 'mapSatellite', 'mapNetwork']) {
      controls[name].style.display = monitorVisible ? 'block' : 'none';
    }
    controls.monitorTab.setAttribute('aria-pressed', String(state.page === 'monitor'));
    controls.eventTab.setAttribute('aria-pressed', String(state.page === 'event'));
    controls.parameterTab.setAttribute('aria-pressed', String(state.page === 'parameter'));
    controls.themeToggle.setAttribute('aria-label', state.theme === 'light' ? 'Switch to dark' : 'Switch to light');
    layout();
  }

  passwordInput.addEventListener('keydown', event => {
    if (event.key !== 'Enter') return;
    if (passwordInput.value === '18817962338') {
      passwordGate.classList.add('is-hidden');
      passwordGate.setAttribute('aria-hidden', 'true');
    } else {
      passwordInput.value = '';
      passwordInput.setAttribute('aria-invalid', 'true');
      passwordInput.focus();
    }
  });

  controls.monitorTab.addEventListener('click', () => { state.page = 'monitor'; render(); });
  controls.eventTab.addEventListener('click', () => { state.page = 'event'; render(); });
  controls.parameterTab.addEventListener('click', () => { state.page = 'parameter'; state.parameterView = 'main'; render(); });
  controls.drawChart.addEventListener('click', () => { state.parameterView = 'chart'; render(); });
  controls.parameterBack.addEventListener('click', () => { state.parameterView = 'main'; render(); });
  controls.mapLine.addEventListener('click', () => { state.map = 'line'; render(); });
  // Match the selected label embedded in the original artwork, not the filename meaning.
  controls.mapSatellite.addEventListener('click', () => { state.map = 'net'; render(); });
  controls.mapNetwork.addEventListener('click', () => { state.map = 'map'; render(); });
  controls.themeToggle.addEventListener('click', () => {
    state.theme = state.theme === 'light' ? 'dark' : 'light';
    render();
  });

  addEventListener('resize', layout);
  render();
})();
