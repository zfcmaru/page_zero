// ── ESTADO GLOBAL ─────────────────────────────────────────────────────────
// phase: 'start' | 'hub' | 'dialogue' | 'choosing' | 'minigame'
const gameState = {
  phase: 'start',
  currentScenario: null,          // id do cenário ativo
  lastChoiceBeforeMinigame: null  // para abort com Q
};

// ── TRANSIÇÕES ────────────────────────────────────────────────────────────

function enterHub() {
  gameState.phase = 'hub';
  gameState.currentScenario = null;
  els.scene.classList.remove('is-fullscreen');
  els.scene.style.display = 'none';
  els.scene.style.opacity = '0';
  els.map.style.display = 'block';
  resetGame();
  const stage = document.getElementById('vn-stage');
  stage.focus({ preventScroll: true });
  rafId = requestAnimationFrame(gameLoop);
}

function enterDialogue(scenarioId) {
  gameState.currentScenario = scenarioId;
  gameState.phase = 'dialogue';
  cancelAnimationFrame(rafId);
  els.map.style.display = 'none';
  els.scene.classList.add('is-fullscreen');
  els.scene.style.display = 'flex';
  void els.scene.offsetWidth;
  els.scene.style.opacity = '1';
  startBlinkCycle();
  showBeat(SCENARIOS[scenarioId].entryBeat);
}

function enterChoosing(choiceId) {
  gameState.phase = 'choosing';
}

function enterMinigame(fromChoiceId) {
  gameState.phase = 'minigame';
  gameState.lastChoiceBeforeMinigame = fromChoiceId;
  doStartMinigame();
}

function exitMinigame(success) {
  cleanupMinigame();
  gameState.phase = 'dialogue';
  const scenario = SCENARIOS[gameState.currentScenario];
  if (success) {
    showBeat(scenario.minigame.onCompleteBeat);
  } else {
    showChoice(gameState.lastChoiceBeforeMinigame);
  }
}

function endScenario() {
  stopBlinkCycle();
  enterHub();
}
