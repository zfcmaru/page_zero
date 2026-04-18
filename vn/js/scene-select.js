// ── SCENE SELECT UI ───────────────────────────────────────────────────────
let sceneSelectIndex = 0;
let sceneSelectIds   = [];

function showSceneSelect() {
  sceneSelectIds = Object.keys(SCENARIOS);
  sceneSelectIndex = 0;

  els.sceneSelectPanel.innerHTML = '';
  sceneSelectIds.forEach((id, i) => {
    const scenario = SCENARIOS[id];
    const btn = document.createElement('button');
    btn.className = 'choice-btn';
    btn.textContent = scenario.title;
    btn.dataset.index = i;
    btn.addEventListener('click', () => confirmSceneSelect(id));
    btn.addEventListener('touchstart', e => {
      e.preventDefault();
      confirmSceneSelect(id);
    }, { passive: false });
    btn.addEventListener('mouseenter', () => {
      sceneSelectIndex = i;
      updateSceneSelectHighlight();
    });
    els.sceneSelectPanel.appendChild(btn);
  });

  updateSceneSelectHighlight();
  els.sceneSelectPanel.style.display = 'flex';
}

function updateSceneSelectHighlight() {
  const btns = els.sceneSelectPanel.querySelectorAll('.choice-btn');
  btns.forEach((btn, i) => {
    btn.classList.toggle('choice-btn--active', i === sceneSelectIndex);
  });
}

function confirmSceneSelect(scenarioId) {
  els.sceneSelectPanel.style.display = 'none';
  els.sceneSelectPanel.innerHTML = '';
  enterDialogue(scenarioId);
}
