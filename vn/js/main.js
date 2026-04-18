// ── ELEMENTOS ─────────────────────────────────────────────────────────────
const els = {
  startScreen:       document.getElementById('vn-start-screen'),
  map:               document.getElementById('vn-map'),
  playerEl:          document.getElementById('player'),
  destEl:            document.getElementById('destination'),
  scene:             document.getElementById('vn-scene'),
  background:        document.getElementById('vn-background'),
  charImg:           document.getElementById('char-img'),
  nameBox:           document.getElementById('name-box'),
  dialogText:        document.getElementById('dialogue-text'),
  hint:              document.getElementById('advance-hint'),
  dialogueBox:       document.getElementById('dialogue-box'),
  choiceContainer:   document.getElementById('choice-container'),
  choicePlaceholder: document.getElementById('choice-placeholder'),
  minigamePanel:     document.getElementById('minigame-panel'),
  minigameCanvas:    document.getElementById('minigame-canvas'),
};

// ── PRELOAD ───────────────────────────────────────────────────────────────
(function preloadAssets() {
  Object.values(SPRITES).forEach(src => { const i = new Image(); i.src = src; });
  Object.values(SCRIPT).forEach(node => { if (node.bg) { const i = new Image(); i.src = node.bg; } });
})();

// ── TRANSIÇÕES DE ESTADO ──────────────────────────────────────────────────
function startGame() {
  els.startScreen.style.display = 'none';
  els.map.style.display = 'block';
  resetGame();
  gameState = 'walking';
  const stage = document.getElementById('vn-stage');
  stage.focus({ preventScroll: true });
  getAudioCtx();
  rafId = requestAnimationFrame(gameLoop);
}

function startDialogue() {
  gameState = 'dialogue';
  cancelAnimationFrame(rafId);
  els.map.style.display = 'none';
  els.scene.style.display = 'flex';
  void els.scene.offsetWidth;
  els.scene.style.opacity = '1';
  startBlinkCycle();
  showBeat('s01');
}

function endVN() {
  stopBlinkCycle();
  els.scene.style.display = 'none';
  els.scene.style.opacity = '0';
  resetGame();
  els.startScreen.style.display = 'flex';
  gameState = 'start';
}

// ── EVENTOS ───────────────────────────────────────────────────────────────
els.startScreen.addEventListener('click', startGame);
els.startScreen.addEventListener('touchstart', function(e) {
  e.preventDefault();
  startGame();
}, { passive: false });

els.dialogueBox.addEventListener('click', advance);
els.dialogueBox.addEventListener('touchstart', function(e) {
  e.preventDefault();
  advance();
}, { passive: false });

function handleKeyDown(e) {
  keys[e.code] = true;

  if (gameState === 'start') {
    if (['Space', 'Enter'].includes(e.code)) {
      e.preventDefault();
      startGame();
    }
    return;
  }

  if (gameState === 'game_over') {
    if (['Enter', 'Space'].includes(e.code)) {
      e.preventDefault();
      resetGame();
      els.map.style.display = 'none';
      els.startScreen.style.display = 'flex';
      gameState = 'start';
    }
    return;
  }

  if (gameState === 'walking') {
    if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',
         'KeyW','KeyS','KeyA','KeyD'].includes(e.code)) {
      e.preventDefault();
    }
    return;
  }

  if (gameState === 'minigame') {
    if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',
         'KeyW','KeyS','KeyA','KeyD'].includes(e.code)) {
      e.preventDefault();
    }
    return;
  }

  if (gameState === 'dialogue' && isChoosing) {
    const choice = CHOICES[currentChoiceId];
    if (e.code === 'ArrowUp') {
      e.preventDefault();
      choiceIndex = (choiceIndex - 1 + choice.options.length) % choice.options.length;
      updateChoiceHighlight();
    }
    if (e.code === 'ArrowDown') {
      e.preventDefault();
      choiceIndex = (choiceIndex + 1) % choice.options.length;
      updateChoiceHighlight();
    }
    if (['Enter', 'Space'].includes(e.code)) {
      e.preventDefault();
      confirmChoice(choice, choiceIndex);
    }
    return;
  }

  if (gameState === 'dialogue') {
    if (['Space', 'Enter', 'ArrowRight'].includes(e.code)) {
      e.preventDefault();
      advance();
    }
  }
}

function handleKeyUp(e) {
  keys[e.code] = false;
}

document.addEventListener('keydown', handleKeyDown);
document.addEventListener('keyup',   handleKeyUp);
