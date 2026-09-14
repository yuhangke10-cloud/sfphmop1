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
    mapModeSwitcher: document.getElementById('mapModeSwitcher'),
    themeToggle: document.getElementById('themeToggle')
  };

  const state = {
    page: 'monitor',
    map: 'map',
    theme: matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  };

  const regions = {
    monitorTab: [650, 0, 885, 180],
    eventTab: [1540, 0, 895, 180],
    parameterTab: [2440, 0, 895, 180],
    mapModeSwitcher: [6360, 240, 1090, 260],
    themeToggle: [7280, 0, 180, 180]
  };

  function imagePath() {
    if (state.page === 'event') return `assets/images/${state.theme}-event.png`;
    if (state.page === 'parameter') return `assets/images/${state.theme}-parameter.png`;
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
    controls.mapModeSwitcher.style.display = monitorVisible ? 'block' : 'none';
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
  controls.parameterTab.addEventListener('click', () => { state.page = 'parameter'; render(); });
  controls.mapModeSwitcher.addEventListener('click', event => {
    const rect = controls.mapModeSwitcher.getBoundingClientRect();
    const position = (event.clientX - rect.left) / rect.width;
    if (position < 0.303) state.map = 'line';
    else if (position < 0.656) state.map = 'map';
    else state.map = 'net';
    render();
  });
  controls.themeToggle.addEventListener('click', () => {
    state.theme = state.theme === 'light' ? 'dark' : 'light';
    render();
  });

  addEventListener('resize', layout);
  render();
})();
