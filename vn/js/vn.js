// ── ESTADO VN ─────────────────────────────────────────────────────────────
let currentBeatId = null;
let isBlinking    = false;
let blinkTimer    = null;
let vnTyping      = false;
let vnTypeTimer   = null;

// ── SPRITES ───────────────────────────────────────────────────────────────
function setSprite(name) {
  const charId = (gameState.currentScenario && SCENARIOS[gameState.currentScenario])
    ? SCENARIOS[gameState.currentScenario].character
    : 'kanon';
  els.charImg.src = SPRITES[charId][name];
}

// ── BLINK CYCLE ───────────────────────────────────────────────────────────
function blinkCycle() {
  if (!isBlinking) return;
  setSprite('neutral');
  blinkTimer = setTimeout(() => {
    if (!isBlinking) return;
    setSprite('semi_rest');
    blinkTimer = setTimeout(() => {
      if (!isBlinking) return;
      setSprite('rest');
      blinkTimer = setTimeout(() => {
        if (!isBlinking) return;
        setSprite('semi_rest');
        blinkTimer = setTimeout(() => blinkCycle(), 60);
      }, 80);
    }, 80);
  }, 3200 + Math.random() * 1200);
}

function startBlinkCycle() {
  if (isBlinking) return;
  isBlinking = true;
  blinkCycle();
}

function stopBlinkCycle() {
  isBlinking = false;
  clearTimeout(blinkTimer);
}

// ── MOTOR VN ──────────────────────────────────────────────────────────────
function showBeat(id) {
  if (id === 'END') { endScenario(); return; }

  const activeScenario = gameState.currentScenario
    ? SCENARIOS[gameState.currentScenario]
    : null;
  if (activeScenario && id === activeScenario.minigame.triggerBeat) {
    enterMinigame(currentChoiceId);
    return;
  }

  if (CHOICES[id]) {
    showChoice(id);
    return;
  }

  const beat = SCRIPT[id];
  currentBeatId = id;

  if (beat.bg) {
    els.background.style.backgroundImage = `url(${beat.bg})`;
  }

  if (beat.sprite) {
    if (beat.sprite === 'angry') {
      stopBlinkCycle();
      setSprite('angry');
    } else {
      if (!isBlinking) startBlinkCycle();
    }
  }

  if (beat.speaker && CHARACTERS[beat.speaker]) {
    const char = CHARACTERS[beat.speaker];
    els.nameBox.textContent = char.name;
    els.nameBox.style.color = char.color || '#fff';
    els.nameBox.style.display = 'block';
  } else if (beat.speaker === "") {
    els.nameBox.textContent = '';
    els.nameBox.style.display = 'none';
  }

  els.hint.style.animationPlayState = 'paused';
  els.hint.style.opacity = '0';
  startTypewriter(beat.text);
}

function startTypewriter(text) {
  vnTyping = true;
  els.dialogText.textContent = '';
  let i = 0;
  clearInterval(vnTypeTimer);
  vnTypeTimer = setInterval(() => {
    const char = text[i];
    els.dialogText.textContent += char;
    if (char && char.trim() !== '') {
      playTypeBeep();
    }
    i++;
    if (i >= text.length) {
      clearInterval(vnTypeTimer);
      vnTyping = false;
      els.hint.style.animationPlayState = 'running';
      els.hint.style.opacity = '1';
    }
  }, 28);
}

function advance() {
  if (gameState.phase !== 'dialogue') return;

  if (vnTyping) {
    clearInterval(vnTypeTimer);
    vnTyping = false;
    els.dialogText.textContent = SCRIPT[currentBeatId].text;
    els.hint.style.animationPlayState = 'running';
    els.hint.style.opacity = '1';
    return;
  }

  showBeat(SCRIPT[currentBeatId].next);
}
