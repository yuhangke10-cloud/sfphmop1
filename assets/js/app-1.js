
    const screens = {"light":[{"open":{"clear":"assets/images/asset-03.png","detail":"assets/images/asset-04.png"},"closed":{"clear":"assets/images/asset-05.png","detail":"assets/images/asset-06.png"}},{"open":{"clear":"assets/images/asset-07.png","detail":"assets/images/asset-08.png"},"closed":{"clear":"assets/images/asset-09.png","detail":"assets/images/asset-10.png"}}],"dark":[{"open":{"clear":"assets/images/asset-11.png","detail":"assets/images/asset-12.png"},"closed":{"clear":"assets/images/asset-13.png","detail":"assets/images/asset-14.png"}},{"open":{"clear":"assets/images/asset-15.png","detail":"assets/images/asset-16.png"},"closed":{"clear":"assets/images/asset-17.png","detail":"assets/images/asset-18.png"}}]};
    const SOURCE_WIDTH = 10240, SOURCE_HEIGHT = 5760;
    const hotspots = {
      sidebar: { x: 0, y: 0, width: 850, height: 1060 },
      detail: { x: 950, y: 1900, width: 6300, height: 3600 },
      previous: { x: 7350, y: 1720, width: 105, height: 105 },
      next: { x: 7460, y: 1720, width: 105, height: 105 },
      theme: { x: 9850, y: 40, width: 250, height: 250 }
    };
    let activeTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    let activeMode = 0, sidebarOpen = true, showDetail = false;
    const screen = document.getElementById('screen');
    const controls = { sidebar: document.getElementById('sidebarToggle'), detail: document.getElementById('mapDetailToggle'), previous: document.getElementById('previousMode'), next: document.getElementById('nextMode'), theme: document.getElementById('themeToggle') };
    function positionControl(element, spot) { const scale = window.innerHeight / SOURCE_HEIGHT, offsetX = (window.innerWidth - SOURCE_WIDTH * scale) / 2; Object.assign(element.style, { left: `${offsetX + spot.x * scale}px`, top: `${spot.y * scale}px`, width: `${spot.width * scale}px`, height: `${spot.height * scale}px` }); }
    function render() {
      syncAlertPage();
      const state = showDetail ? 'detail' : 'clear';
      screen.src = screens[activeTheme][activeMode][sidebarOpen ? 'open' : 'closed'][state];
      document.documentElement.dataset.theme = activeTheme;
      document.title = 'CRL-CdM System™';
      controls.sidebar.setAttribute('aria-label', sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar');
      controls.detail.style.pointerEvents = showDetail ? 'none' : 'auto';
      Object.entries(hotspots).forEach(([key, spot]) => positionControl(controls[key], spot));
      // Artwork coordinates: sidebar collapse shifts this toolbar 160 source pixels.
      const scale = window.innerHeight / SOURCE_HEIGHT;
      const previousCenter = sidebarOpen ? 7424 : 7264;
      const nextCenter = previousCenter + 112;
      const split = (previousCenter + nextCenter) / 2;
      const hitHeight = Math.max(176, 32 / scale);
      const leftEdge = previousCenter - Math.max(96, 20 / scale);
      positionControl(controls.previous, { x: leftEdge, y: 1832 - hitHeight / 2, width: split - leftEdge, height: hitHeight });
      // Adjacent regions meet without overlapping; stop before the fullscreen icon.
      positionControl(controls.next, { x: split, y: 1832 - hitHeight / 2, width: nextCenter + 104 - split, height: hitHeight });
    }
    controls.sidebar.addEventListener('click', () => { sidebarOpen = !sidebarOpen; render(); });
    controls.detail.addEventListener('click', () => { if (!showDetail) { showDetail = true; render(); } });
    controls.previous.addEventListener('click', () => { activeMode = (activeMode + screens[activeTheme].length - 1) % screens[activeTheme].length; showDetail = false; render(); });
    controls.next.addEventListener('click', () => { activeMode = (activeMode + 1) % screens[activeTheme].length; showDetail = false; render(); });
    controls.theme.addEventListener('click', () => { activeTheme = activeTheme === 'light' ? 'dark' : 'light'; render(); });
    // Image-space hit testing follows the same height-fit transform as the screen.
    const highlightedTrainAreas = [
      { open: { x: 2940, y: 3300, width: 550, height: 300 }, closed: { x: 2300, y: 3300, width: 550, height: 300 } },
      { open: { x: 4570, y: 3050, width: 550, height: 300 }, closed: { x: 4160, y: 3050, width: 550, height: 300 } }
    ];
    function containsPoint(area, x, y) {
      return x >= area.x && x <= area.x + area.width && y >= area.y && y <= area.y + area.height;
    }
    document.getElementById('stage').addEventListener('click', (event) => {
      if (!showDetail) return;
      const scale = window.innerHeight / SOURCE_HEIGHT;
      const x = (event.clientX - (window.innerWidth - SOURCE_WIDTH * scale) / 2) / scale;
      const y = event.clientY / scale;
      const mapArea = { x: sidebarOpen ? 950 : 320, y: 1900, width: sidebarOpen ? 6890 : 7520, height: 3650 };
      const selectedTrain = highlightedTrainAreas[activeMode][sidebarOpen ? 'open' : 'closed'];
      if (containsPoint(mapArea, x, y) && !containsPoint(selectedTrain, x, y)) {
        showDetail = false;
        render();
      }
    });
    const alertElement = document.getElementById('alertNotification');
    let alertPageKey = null, alertWaitTimer = null, alertHideTimer = null;
    function hideAlert() {
      alertElement.classList.remove('is-visible');
      alertElement.setAttribute('aria-hidden', 'true');
      alertElement.removeAttribute('role');
    }
    function syncAlertPage() {
      const pageKey = `${activeTheme}:${activeMode}:${sidebarOpen}:${showDetail}`;
      if (pageKey === alertPageKey) return;
      alertPageKey = pageKey;
      clearTimeout(alertWaitTimer);
      clearTimeout(alertHideTimer);
      hideAlert();
      alertWaitTimer = setTimeout(() => {
        if (alertPageKey !== pageKey) return;
        alertElement.setAttribute('role', 'alert');
        alertElement.setAttribute('aria-hidden', 'false');
        alertElement.classList.add('is-visible');
        alertHideTimer = setTimeout(hideAlert, 20000);
      }, 30000);
    }
    window.addEventListener('resize', render); render();
  