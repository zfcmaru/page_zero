// ── ELEMENTOS ─────────────────────────────────────────────────────────────
const els = {
  startScreen:       document.getElementById('vn-start-screen'),
  map:               document.getElementById('vn-map'),
  playerEl:          document.getElementById('player'),
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
  Object.values(SPRITES).forEach(charSprites => {
    Object.values(charSprites).forEach(src => { const i = new Image(); i.src = src; });
  });
  Object.values(SCRIPT).forEach(node => { if (node.bg) { const i = new Image(); i.src = node.bg; } });
})();

// ── ENTRADA DO JOGO ───────────────────────────────────────────────────────
function startGame() {
  els.startScreen.style.display = 'none';
  getAudioCtx();
  enterHub();
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

  if (gameState.phase === 'start') {
    if (['Space', 'Enter'].includes(e.code)) {
      e.preventDefault();
      startGame();
    }
    return;
  }

  if (gameState.phase === 'hub') {
    if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',
         'KeyW','KeyS','KeyA','KeyD'].includes(e.code)) {
      e.preventDefault();
    }
    return;
  }

  if (gameState.phase === 'minigame') {
    if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',
         'KeyW','KeyS','KeyA','KeyD'].includes(e.code)) {
      e.preventDefault();
    }
    if (e.code === 'KeyQ') {
      e.preventDefault();
      exitMinigame(false);
    }
    return;
  }

  if (gameState.phase === 'choosing') {
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

  if (gameState.phase === 'dialogue') {
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
